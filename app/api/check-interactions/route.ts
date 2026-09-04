import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { ExplainLanguage } from "@/lib/types";

export const runtime = "nodejs";

interface CheckInteractionsBody {
  medicationNames: string[];
  language: ExplainLanguage;
}

interface InteractionResult {
  hasKnownInteractions: boolean;
  summary: string;
  pairs: { medications: string[]; note: string; severity: "minor" | "moderate" | "serious" }[];
  disclaimer: string;
}

const LANGUAGE_INSTRUCTIONS: Record<ExplainLanguage, string> = {
  pt: "Respond in Brazilian Portuguese (pt-BR), plain everyday language.",
  en: "Respond in English, plain everyday language.",
  es: "Respond in Spanish (neutral, broadly understandable), plain everyday language.",
  fr: "Respond in French, plain everyday language.",
  zh: "Respond in Simplified Chinese (简体中文), plain everyday language.",
};

const SYSTEM_PROMPT = `You are a medication interaction educator. You receive a list of medication names a
single patient has taken. Your job is to mention ONLY well-established, widely-known interactions
between them from general medical education knowledge — never invent an interaction you are not
confident about, and never diagnose or tell the patient to stop/change any medication.

Rules:
- If you are not confident about a real, well-documented interaction between two of the listed
  medications, do not mention a pair for it.
- Always end with a reminder that a pharmacist or doctor should review the full list, since this
  is not exhaustive and does not account for doses, individual conditions, or medications not
  listed here.
- Respond with ONLY valid JSON, no markdown fences, matching exactly this shape:
{
  "hasKnownInteractions": boolean,
  "summary": string,
  "pairs": [ { "medications": [string, string], "note": string, "severity": "minor" | "moderate" | "serious" } ],
  "disclaimer": string
}`;

function extractJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON found");
    return JSON.parse(raw.slice(start, end + 1));
  }
}

function normalize(parsed: any): InteractionResult {
  return {
    hasKnownInteractions: Boolean(parsed?.hasKnownInteractions),
    summary: String(parsed?.summary ?? "").trim(),
    pairs: Array.isArray(parsed?.pairs)
      ? parsed.pairs.map((p: any) => ({
          medications: Array.isArray(p?.medications) ? p.medications.map(String) : [],
          note: String(p?.note ?? ""),
          severity: ["minor", "moderate", "serious"].includes(p?.severity) ? p.severity : "minor",
        }))
      : [],
    disclaimer:
      String(parsed?.disclaimer ?? "").trim() ||
      "Explicare is not a medical device and does not diagnose, treat, cure, or prevent any medical condition. This is educational information, not medical advice. Always review your full medication list with a doctor or pharmacist.",
  };
}

const SUPPORTED_LANGUAGES: ExplainLanguage[] = ["pt", "en", "es", "fr", "zh"];

const DEMO_SUMMARY: Record<ExplainLanguage, string> = {
  pt: "Modo demonstração: configure GROQ_API_KEY no servidor para checagem real.",
  en: "Demo mode: configure GROQ_API_KEY on the server to check real interactions.",
  es: "Modo demostración: configure GROQ_API_KEY en el servidor para una verificación real.",
  fr: "Mode démo : configurez GROQ_API_KEY sur le serveur pour une vérification réelle.",
  zh: "演示模式：请在服务器上配置 GROQ_API_KEY 以进行真实的相互作用检查。",
};

const GENERIC_ERROR_MESSAGE: Record<ExplainLanguage, string> = {
  pt: "Algo deu errado. Tente novamente.",
  en: "Something went wrong. Please try again.",
  es: "Algo salió mal. Inténtelo de nuevo.",
  fr: "Une erreur s'est produite. Veuillez réessayer.",
  zh: "出了点问题。请再试一次。",
};

export async function POST(req: NextRequest) {
  let body: CheckInteractionsBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const names = (body.medicationNames ?? []).map((n) => String(n).trim()).filter(Boolean);
  const language: ExplainLanguage = SUPPORTED_LANGUAGES.includes(body.language as ExplainLanguage)
    ? (body.language as ExplainLanguage)
    : "en";

  if (names.length < 2) {
    return NextResponse.json({ error: "Need at least 2 medications to check." }, { status: 400 });
  }
  if (names.length > 15) {
    return NextResponse.json({ error: "Too many medications in one check." }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      isDemo: true,
      hasKnownInteractions: false,
      summary: DEMO_SUMMARY[language],
      pairs: [],
      disclaimer:
        "Explicare is not a medical device and does not diagnose, treat, cure, or prevent any medical condition. This is educational information, not medical advice. Always review your full medication list with a doctor or pharmacist.",
    });
  }

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.2,
      max_tokens: 1200,
      reasoning_effort: "low",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `${LANGUAGE_INSTRUCTIONS[language]}\n\nMedications: ${names.join(", ")}`,
        },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    const result = normalize(extractJson(raw));
    return NextResponse.json(result);
  } catch (err) {
    console.error("check-interactions error", err);
    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE[language] }, { status: 502 });
  }
}
