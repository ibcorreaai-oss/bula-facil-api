import { NextRequest, NextResponse } from "next/server";
import { explainMedication, UnclearPhotoError } from "@/lib/groq";
import { getDemoExplanation } from "@/lib/demo-data";
import { ExplainRequestBody } from "@/lib/types";

export const runtime = "nodejs";

// Base64 encoding inflates size ~33%; 12MB base64 covers a ~9MB photo, comfortably under Groq's 20MB image limit.
const MAX_BASE64_LENGTH = 12_000_000;

export async function POST(req: NextRequest) {
  let body: ExplainRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const imageBase64 = (body.imageBase64 ?? "").trim();
  const mimeType = body.mimeType || "image/jpeg";
  const language = body.language === "en" ? "en" : "pt";

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
          error:
            language === "en"
              ? "We couldn't read that photo clearly enough to be safe. Please retake it with good light, holding the camera steady over the label."
              : "Não conseguimos ler essa foto com segurança suficiente. Tire a foto de novo com boa luz, segurando o celular firme sobre a bula.",
          retakePhoto: true,
        },
        { status: 422 }
      );
    }
    console.error("explain route error", err);
    return NextResponse.json(
      {
        error:
          language === "en"
            ? "Something went wrong reading this photo. Please try again."
            : "Algo deu errado ao ler essa foto. Tente novamente.",
      },
      { status: 502 }
    );
  }
}
