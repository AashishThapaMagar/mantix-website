import { NextResponse } from "next/server";

const PRODUCTS = `
1. The Phantom (Black Oversized) — Rs. 1,499. Premium everyday streetwear essential. Oversized fit. Best for: minimal, all-black, low-key, versatile daily wear.
2. The Ghost (White Essential) — Rs. 1,399. Clean minimal design for daily wear. Regular or oversized fit. Best for: clean, bright, simple, understated looks.
3. The Venom (Dark Green Signature) — Rs. 1,499. Core MANTRIX identity colorway, dark green. Oversized fit. Best for: bold, standout, statement, expressive streetwear.
`;

export async function POST(request: Request) {
  let vibe = "";
  try {
    const body = await request.json();
    vibe = (body?.vibe ?? "").toString().trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!vibe) {
    return NextResponse.json({ error: "Please describe your vibe." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI is not configured yet." },
      { status: 500 }
    );
  }

  const prompt = `You are MANTRIX's style advisor. MANTRIX is a Nepali streetwear brand. Here are the three pieces in the first drop:
${PRODUCTS}

The customer describes their vibe as: "${vibe}"

Recommend EXACTLY ONE piece that best fits them. Reply in 2-3 short sentences, confident and on-brand. Start with the piece name, then explain why it matches their vibe. Do not use markdown, headings, or bullet lists.`;

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: "AI request failed." }, { status: 502 });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
      "Sorry, I couldn't find a match — try describing your style a little differently.";

    return NextResponse.json({ recommendation: text });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the AI. Please try again." },
      { status: 502 }
    );
  }
}