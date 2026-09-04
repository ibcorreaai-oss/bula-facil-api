import Groq from "groq-sdk";
import { ExplainLanguage, MedicationExplanation } from "./types";

const LANGUAGE_INSTRUCTIONS: Record<ExplainLanguage, string> = {
  pt: "Respond in Brazilian Portuguese (pt-BR), using plain everyday language a person with no medical background would understand.",
  en: "Respond in English, using plain everyday language a person with no medical background would understand.",
  es: "Respond in Spanish (neutral, broadly understandable across Latin America and Spain), using plain everyday language a person with no medical background would understand.",
  fr: "Respond in French, using plain everyday language a person with no medical background would understand.",
  zh: "Respond in Simplified Chinese (简体中文), using plain everyday language a person with no medical background would understand.",
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

function normalize(parsed: any): MedicationExplanation {
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
    reassurance:
      String(parsed.reassurance ?? "").trim() ||
      "It's completely normal to feel unsure reading a medicine label. Take your time, and a pharmacist or doctor can always clarify anything that isn't clear.",
    seekCareSoon: Boolean(parsed.seekCareSoon),
    disclaimer:
      String(parsed.disclaimer ?? "").trim() ||
      "Explicare is not a medical device and does not diagnose, treat, cure, or prevent any medical condition. Always confirm with a licensed doctor or pharmacist before making any decision about your medication.",
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
    max_tokens: 2000,
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
  return normalize(parsed);
}
