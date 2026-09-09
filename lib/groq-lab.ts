import Groq from "groq-sdk";
import { ExplainLanguage, LabExplanation } from "./types";

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
  pt: "É completamente normal se sentir um pouco ansioso ao ler um resultado de exame. Vá com calma, e lembre-se: um médico licenciado é a pessoa certa pra interpretar o que isso significa pra você.",
  en: "It's completely normal to feel a little anxious reading lab results. Take your time going through this, and remember a licensed doctor is the right person to interpret what it means for you.",
  es: "Es completamente normal sentirse un poco ansioso al leer resultados de laboratorio. Tómese su tiempo, y recuerde que un médico autorizado es la persona indicada para interpretar lo que esto significa para usted.",
  fr: "Il est tout à fait normal de se sentir un peu anxieux en lisant des résultats de laboratoire. Prenez votre temps, et rappelez-vous qu'un médecin agréé est la bonne personne pour interpréter ce que cela signifie pour vous.",
  zh: "阅读化验结果时感到有点焦虑是完全正常的。请慢慢查看，并记住持证医生才是解读这些结果对您意义的合适人选。",
};
// Must stay byte-identical to LabResultView.tsx's own `t.disclaimer` per language --
// LabResultView only shows explanation.disclaimer as a SECOND line when it differs from its
// own hardcoded copy, so any drift here (even a missing word) causes the boilerplate disclaimer
// to render twice on screen whenever this fallback is used.
const FALLBACK_DISCLAIMER: Record<ExplainLanguage, string> = {
  pt: "Explicare não é um dispositivo médico e não diagnostica, trata, cura ou previne nenhuma condição médica. Sempre confirme com um médico antes de tomar qualquer decisão com base nesses resultados.",
  en: "Explicare is not a medical device and does not diagnose, treat, cure, or prevent any medical condition. Always confirm with a licensed doctor before making any decision based on these results.",
  es: "Explicare no es un dispositivo médico y no diagnostica, trata, cura ni previene ninguna afección médica. Confirme siempre con un médico antes de tomar cualquier decisión basada en estos resultados.",
  fr: "Explicare n'est pas un dispositif médical et ne diagnostique, ne traite, ne guérit ni ne prévient aucune condition médicale. Confirmez toujours avec un médecin avant de prendre une décision basée sur ces résultats.",
  zh: "Explicare 不是医疗器械，不能诊断、治疗、治愈或预防任何疾病。在根据这些结果做出任何决定之前，请务必咨询执业医生。",
};

const SYSTEM_PROMPT = `You are Explicare, an assistant that looks at a photo of a laboratory test result (blood work, urine test, or similar panel) and explains it in plain, calm, non-alarming language for the patient.

Rules you must always follow:
- Only extract a result if you can read it clearly and confidently in the photo. If the photo is blurry, cropped, too dark, or you cannot confidently identify it as a laboratory test result, respond with exactly {"error": "unclear_photo"} instead of guessing — inventing a number is dangerous.
- NEVER provide a diagnosis. NEVER tell the patient what disease they have. Always defer interpretation of the overall picture to a doctor.
- Use a calm, encouraging, non-alarming tone even when a value is out of range — state it plainly and honestly, without panic language and without minimizing it either.
- If the reference range is printed on the report, use it to decide if a parameter is "normal", "attention" (mildly outside range), or "out_of_range" (clearly outside range). If you cannot confidently read a value or its range, use "undetermined" and say so plainly in that parameter's explanation — never invent a number.
- Base each explanation only on general, widely-known health education facts about what that parameter measures. Do not invent patient-specific causes or assume a diagnosis from the result alone.
- "examTitle" must be a short, specific label for what this report is (for example "Complete Blood Count", "Lipid Panel", "Thyroid Function Test") based on what's visible in the photo.
- Also write a short "reassurance" note (2-4 sentences) that gently acknowledges it's completely normal to feel a little anxious reading lab results, and puts the overall picture in honest emotional context. Never use false reassurance — if several parameters are out of range, say so plainly, calmly, and without minimizing.
- Set "seekCareSoon" to true ONLY if the overall pattern of results genuinely suggests the patient should reach out to a doctor without waiting for a routine follow-up (e.g. a value far outside its range, or a combination that's clinically worth flagging). Set it to false for normal results or results that are only mildly outside range. This is not a diagnosis or an emergency alert — just an honest signal of urgency, used to avoid both false alarm and false calm.
- Respond with ONLY valid JSON, no markdown fences, no extra commentary, matching exactly this shape when the photo is readable:
{
  "examTitle": string,
  "summary": string,
  "parameters": [{ "name": string, "valueFound": string, "referenceRange": string, "status": "normal" | "attention" | "out_of_range" | "undetermined", "explanation": string }],
  "questionsForDoctor": [string, string, string],
  "reassurance": string,
  "seekCareSoon": boolean,
  "disclaimer": string
}
Or, if the photo is not clearly readable enough to safely extract results, respond with ONLY:
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

function normalize(parsed: any, language: ExplainLanguage): LabExplanation {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Malformed explanation payload");
  }
  if (parsed.error === "unclear_photo") {
    throw new UnclearPhotoError();
  }
  const parameters = Array.isArray(parsed.parameters) ? parsed.parameters : [];
  return {
    examTitle: String(parsed.examTitle ?? "").trim() || "Lab result",
    summary: String(parsed.summary ?? "").trim(),
    parameters: parameters.map((p: any) => ({
      name: String(p?.name ?? "Unknown parameter"),
      valueFound: String(p?.valueFound ?? ""),
      referenceRange: String(p?.referenceRange ?? ""),
      status: ["normal", "attention", "out_of_range", "undetermined"].includes(p?.status) ? p.status : "undetermined",
      explanation: String(p?.explanation ?? ""),
    })),
    questionsForDoctor: Array.isArray(parsed.questionsForDoctor)
      ? parsed.questionsForDoctor.map((q: any) => String(q))
      : [],
    reassurance: String(parsed.reassurance ?? "").trim() || FALLBACK_REASSURANCE[language],
    seekCareSoon: Boolean(parsed.seekCareSoon),
    disclaimer: String(parsed.disclaimer ?? "").trim() || FALLBACK_DISCLAIMER[language],
  };
}

export async function explainLabResult(
  imageBase64: string,
  mimeType: string,
  language: ExplainLanguage
): Promise<LabExplanation> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY_MISSING");
  }

  const groq = new Groq({ apiKey });

  const completion = await groq.chat.completions.create({
    model: "qwen/qwen3.6-27b",
    temperature: 0.2,
    // This account's current Groq free tier caps output tokens per minute (OTPM) at 1000 for
    // this vision model -- max_tokens above that gets rejected with a 429 before the call even
    // runs (confirmed empirically 04/09/2026).
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
