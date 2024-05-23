import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  //   const text = request.nextUrl.searchParams.get("text");
  const text = `[REQUIRE]: Répond moi avec les [CONSIGNES] suivantes.
    [CLASSNAME] Retourne moi la className d'un boutton pour mon module. Mon module utilise tailwindcss et je souhaite uniquement la className.`;
  const headers = {
    Authorization: `Bearer ${process.env.HF_API_KEY}`,
    "Content-Type": "application/json",
  };

  const API_URL =
    "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        inputs:
          "Donne uniquement la className en une seule ligne de code pour un bouton utilisant Tailwind CSS avec les styles suivants : couleur de fond primaire, couleur de texte blanc, bordures arrondies, padding approprié, ombre discrète, et effet de survol. Ne retourne que la className. Exemple : 'bg-blue-500 text-white rounded-lg px-4 py-2 shadow-md hover:bg-blue-600'",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({ message: "OK", result: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
