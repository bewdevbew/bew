import { NextRequest, NextResponse } from "next/server";

/**
 *
 * @notice pour traduire les publications
 */
export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get("text");
  const lang = request.nextUrl.searchParams.get("lang") || "en";

  console.log({ lang });
  const headers = {
    Authorization: `Bearer ${process.env.HF_API_KEY}`,
    "Content-Type": "application/json",
  };

  const API_URL =
    "https://api-inference.huggingface.co/models/google-t5/t5-base";

  try {
    if (!text) {
      throw new Error("Missing text");
    }
    const response = await fetch(API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        inputs: `translate to French: ${text}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log({ dataErrorModel: data });
    if (!data?.[0]?.translation_text?.length) {
      throw new Error("Error model translate");
    }
    return NextResponse.json(
      { message: "OK", result: data?.[0]?.translation_text },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error API ai/translate", (error as any).message);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
