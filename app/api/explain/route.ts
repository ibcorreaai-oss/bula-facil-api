import { NextRequest, NextResponse } from "next/server";
import { explainMedication, UnclearPhotoError } from "@/lib/groq";
import { getDemoExplanation } from "@/lib/demo-data";
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
    const explanation = await explainMedication(imageBase64, mimeType, language);
    return NextResponse.json(explanation);
  } catch (err: any) {
    if (err?.message === "GROQ_API_KEY_MISSING") {
      return NextResponse.json(getDemoExplanation(language));
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
    console.error("explain route error", err);
    return NextResponse.json(
      { error: GENERIC_ERROR_MESSAGE[language] },
      { status: 502 }
    );
  }
}

const UNCLEAR_PHOTO_MESSAGE: Record<ExplainLanguage, string> = {
  pt: "Não conseguimos ler essa foto com segurança suficiente. Tire a foto de novo com boa luz, segurando o celular firme sobre a bula.",
  en: "We couldn't read that photo clearly enough to be safe. Please retake it with good light, holding the camera steady over the label.",
  es: "No pudimos leer esa foto con suficiente claridad. Tómela de nuevo con buena luz, sosteniendo el celular firme sobre la etiqueta.",
  fr: "Nous n'avons pas pu lire cette photo assez clairement pour être sûrs. Reprenez-la avec un bon éclairage, en tenant le téléphone stable au-dessus de l'étiquette.",
  zh: "我们无法足够清晰地识别这张照片。请在光线充足的地方重新拍摄，并保持手机稳定对准标签。",
};

const GENERIC_ERROR_MESSAGE: Record<ExplainLanguage, string> = {
  pt: "Algo deu errado ao ler essa foto. Tente novamente.",
  en: "Something went wrong reading this photo. Please try again.",
  es: "Algo salió mal al leer esta foto. Inténtelo de nuevo.",
  fr: "Une erreur s'est produite lors de la lecture de cette photo. Veuillez réessayer.",
  zh: "读取这张照片时出了点问题。请再试一次。",
};
