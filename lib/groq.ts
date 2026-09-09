import Groq from "groq-sdk";
import { ExplainLanguage, MedicationExplanation } from "./types";

const LANGUAGE_INSTRUCTIONS: Record<ExplainLanguage, string> = {
  pt: "Respond in Brazilian Portuguese (pt-BR), using plain everyday language a person with no medical background would understand.",
  en: "Respond in English, using plain everyday language a person with no medical background would understand.",
  es: "Respond in Spanish (neutral, broadly understandable across Latin America and Spain), using plain everyday language a person with no medical background would understand.",
  fr: "Respond in French, using plain everyday language a person with no medical background would understand.",
  zh: "Respond in Simplified Chinese (简体中文), using plain everyday language a person with no medical background would understand.",
};

// Used only when the model's response omits these fields -- must stay localized so a
// truncated/malformed response never surfaces an English paragraph on a non-English screen.
const FALLBACK_REASSURANCE: Record<ExplainLanguage, string> = {
  pt: "É completamente normal se sentir incerto ao ler a bula de um remédio. Vá com calma, e um farmacêutico ou médico sempre pode esclarecer qualquer dúvida.",
  en: "It's completely normal to feel unsure reading a medicine label. Take your time, and a pharmacist or doctor can always clarify anything that isn't clear.",
  es: "Es completamente normal sentirse inseguro al leer la etiqueta de un medicamento. Tómese su tiempo, un farmacéutico o médico siempre puede aclarar cualquier duda.",
  fr: "Il est tout à fait normal de se sentir incertain en lisant l'étiquette d'un médicament. Prenez votre temps, un pharmacien ou un médecin peut toujours clarifier ce qui n'est pas clair.",
  zh: "阅读药品标签时感到不确定是完全正常的。慢慢来，药剂师或医生随时可以为您解答不清楚的地方。",
};
// Must stay byte-identical to ExplanationView.tsx's own `t.disclaimer` per language --
// ExplanationView only shows explanation.disclaimer as a SECOND line when it differs from its
// own hardcoded copy, so any drift here (even a missing word) causes the boilerplate disclaimer
// to render twice on screen whenever this fallback is used.
const FALLBACK_DISCLAIMER: Record<ExplainLanguage, string> = {
  pt: "Explicare não é um dispositivo médico e não diagnostica, trata, cura ou previne nenhuma condição médica. Sempre confirme com um médico ou farmacêutico antes de tomar qualquer decisão sobre seu medicamento.",
  en: "Explicare is not a medical device and does not diagnose, treat, cure, or prevent any medical condition. Always confirm with a licensed doctor or pharmacist before making any decision about your medication.",
  es: "Explicare no es un dispositivo médico y no diagnostica, trata, cura ni previene ninguna afección médica. Confirme siempre con un médico o farmacéutico antes de tomar cualquier decisión sobre su medicamento.",
  fr: "Explicare n'est pas un dispositif médical et ne diagnostique, ne traite, ne guérit ni ne prévient aucune condition médicale. Confirmez toujours avec un médecin ou un pharmacien avant de prendre une décision concernant votre médicament.",
  zh: "Explicare 不是医疗器械，不能诊断、治疗、治愈或预防任何疾病。在对用药做出任何决定之前，请务必咨询执业医生或药剂师。",
};

const SYSTEM_PROMPT = `You are Explicare, an assistant that looks at a photo of a medicine package, package insert ("bula"/"prospecto"/"notice"), or handwritten/printed prescription, and explains it in plain, calm, non-alarming language for the patient.

Rules you must always follow:
- Only name a medication if you can read it clearly and confidently in the photo. If the photo is blurry, cropped, too dark, or you cannot confidently identify the medication name, respond with exactly {"error": "unclear_photo"} instead of guessing — a wrong medication name is dangerous, never invent or assume one.
- NEVER provide a diagnosis. NEVER suggest changing, stopping, or starting a dose — always defer that to a doctor or pharmacist.
- Use a calm, encouraging, non-alarming tone even when a warning is serious — state it plainly and honestly, without panic language and without minimizing it either.
- Base "howToTake" and the side effects/warnings only on standard, widely-known information about that medication and whatever is printed on the label/insert itself. Do not invent patient-specific advice or assume a diagnosis from the medication alone.
- "keyPointsToConfirm" must be 2 to 4 short, concrete, high-stakes facts (for example "Take with food, not on an empty stomach", or "Do not take with alcohol") that are worth the patient actively confirming they understood — not a generic restatement of the summary.
- Also write a short "reassurance" note (2-3 sentences) that normalizes feeling confused or a little anxious about a medicine label, without ever falsely minimizing a genuinely serious warning.
- Set "seekCareSoon" to true ONLY if the label itself indicates something that genuinely warrants prompt follow-up with a doctor or pharmacist (a serious interaction warning, a controlled substance requiring monitoring, unclear or damaged dosage information). Set it to false for routine medications with no special flags. This is not a diagnosis or emergency alert, just an honest urgency signal.
- Respond with ONLY valid JSON, no markdown fences, no extra commentary, matching exactly this shape when the photo is readable:
{
  "medicationName": string,
  "summary": string,
  "howToTake": string,
  "sideEffects": [{ "name": string, "severity": "common" | "serious" }],
  "warnings": [string],
  "keyPointsToConfirm": [string],
  "questionsForDoctor": [string, string, string],
  "reassurance": string,
  "seekCareSoon": boolean,
  "disclaimer": string
}
Or, if the photo is not clearly readable enough to safely identify the medication, respond with ONLY:
{ "error": "unclear_photo" }`;

export class UnclearPhotoError extends Error {
  constructor() {
    super("UNCLEAR_PHOTO");
  }
}

function extractJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    // fall through
  }
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in model response");
  }
  const slice = raw.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch {
    const cleaned = slice.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(cleaned);
  }
}

function normalize(parsed: any, language: ExplainLanguage): MedicationExplanation {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Malformed explanation payload");
  }
  if (parsed.error === "unclear_photo") {
    throw new UnclearPhotoError();
  }
  const sideEffects = Array.isArray(parsed.sideEffects) ? parsed.sideEffects : [];
  return {
    medicationName: String(parsed.medicationName ?? "").trim() || "Unknown medication",
    summary: String(parsed.summary ?? "").trim(),
    howToTake: String(parsed.howToTake ?? "").trim(),
    sideEffects: sideEffects.map((s: any) => ({
      name: String(s?.name ?? ""),
      severity: s?.severity === "serious" ? "serious" : "common",
    })),
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings.map((w: any) => String(w)) : [],
    keyPointsToConfirm: Array.isArray(parsed.keyPointsToConfirm)
      ? parsed.keyPointsToConfirm.map((k: any) => String(k))
      : [],
    questionsForDoctor: Array.isArray(parsed.questionsForDoctor)
      ? parsed.questionsForDoctor.map((q: any) => String(q))
      : [],
    reassurance: String(parsed.reassurance ?? "").trim() || FALLBACK_REASSURANCE[language],
    seekCareSoon: Boolean(parsed.seekCareSoon),
    disclaimer: String(parsed.disclaimer ?? "").trim() || FALLBACK_DISCLAIMER[language],
  };
}

export async function explainMedication(
  imageBase64: string,
  mimeType: string,
  language: ExplainLanguage
): Promise<MedicationExplanation> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY_MISSING");
  }

  const groq = new Groq({ apiKey });

  const completion = await groq.chat.completions.create({
    model: "qwen/qwen3.6-27b",
    temperature: 0.3,
    // This account's current Groq free tier caps output tokens per minute (OTPM) at 1000 for
    // this vision model -- max_tokens above that gets rejected with a 429 before the call even
    // runs (confirmed empirically 04/09/2026, tighter than when this endpoint was last tested).
    max_tokens: 1000,
    reasoning_effort: "none",
    reasoning_format: "hidden",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: LANGUAGE_INSTRUCTIONS[language] },
          {
            type: "image_url",
            image_url: { url: `data:${mimeType};base64,${imageBase64}` },
          },
        ] as any,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  const parsed = extractJson(raw);
  return normalize(parsed, language);
}
