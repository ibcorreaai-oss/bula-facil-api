import { NextRequest, NextResponse } from "next/server";
import { explainLabResult, UnclearPhotoError } from "@/lib/groq-lab";
import { getDemoLabExplanation } from "@/lib/demo-data-lab";
import { ExplainLanguage, ExplainRequestBody } from "@/lib/types";

export const runtime = "nodejs";

// Base64 encoding inflates size ~33%; 12MB base64 covers a ~9MB photo, comfortably under Groq's 20MB image limit.
const MAX_BASE64_LENGTH = 12_000_000;

const SUPPORTED_LANGUAGES: ExplainLanguage[] = ["pt", "en", "es", "fr", "zh"];

export async function POST(req: NextRequest) {
  let body: ExplainRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const imageBase64 = (body.imageBase64 ?? "").trim();
  const mimeType = body.mimeType || "image/jpeg";
  const language: ExplainLanguage = SUPPORTED_LANGUAGES.includes(body.language as ExplainLanguage)
    ? (body.language as ExplainLanguage)
    : "en";

  if (!imageBase64) {
    return NextResponse.json({ error: "Missing photo." }, { status: 400 });
  }
  if (imageBase64.length > MAX_BASE64_LENGTH) {
    return NextResponse.json({ error: "That photo is too large. Try taking it again." }, { status: 400 });
  }

  try {
    const explanation = await explainLabResult(imageBase64, mimeType, language);
    return NextResponse.json(explanation);
  } catch (err: any) {
    if (err?.message === "GROQ_API_KEY_MISSING") {
      return NextResponse.json(getDemoLabExplanation(language));
    }
    if (err instanceof UnclearPhotoError) {
      return NextResponse.json(
        {
          error: UNCLEAR_PHOTO_MESSAGE[language],
          retakePhoto: true,
        },
        { status: 422 }
      );
    }
    console.error("explain-lab route error", err);
    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE[language] }, { status: 502 });
  }
}

const UNCLEAR_PHOTO_MESSAGE: Record<ExplainLanguage, string> = {
  pt: "Não conseguimos ler esse exame com segurança suficiente. Tire a foto de novo com boa luz, segurando o celular firme sobre o documento.",
  en: "We couldn't read that lab result clearly enough to be safe. Please retake it with good light, holding the camera steady over the document.",
  es: "No pudimos leer ese resultado con suficiente claridad. Tómelo de nuevo con buena luz, sosteniendo el celular firme sobre el documento.",
  fr: "Nous n'avons pas pu lire ce résultat assez clairement pour être sûrs. Reprenez la photo avec un bon éclairage, en tenant le téléphone stable au-dessus du document.",
  zh: "我们无法足够清晰地识别这份化验单。请在光线充足的地方重新拍摄，并保持手机稳定对准文件。",
};

const GENERIC_ERROR_MESSAGE: Record<ExplainLanguage, string> = {
  pt: "Algo deu errado ao ler esse exame. Tente novamente.",
  en: "Something went wrong reading this lab result. Please try again.",
  es: "Algo salió mal al leer este resultado. Inténtelo de nuevo.",
  fr: "Une erreur s'est produite lors de la lecture de ce résultat. Veuillez réessayer.",
  zh: "读取这份化验单时出了点问题。请再试一次。",
};
