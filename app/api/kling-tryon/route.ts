import { NextRequest, NextResponse } from "next/server";

const KLING_BASE = "https://api.klingai.com/v1";
const KLING_KEY = process.env.KLING_API_KEY;

async function pollForImage(taskId: string): Promise<string> {
  const maxAttempts = 40;
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise(r => setTimeout(r, 3000));
    attempts++;

    const res = await fetch(`${KLING_BASE}/images/generations/${taskId}`, {
      headers: {
        "Authorization": `Bearer ${KLING_KEY}`,
        "Content-Type": "application/json",
      }
    });

    const data = await res.json();
    const status = data?.data?.task_status;
    console.log(`Poll attempt ${attempts}: ${status}`);

    if (status === "succeed") {
      const url = data?.data?.task_result?.images?.[0]?.url;
      if (url) return url;
      throw new Error("No image URL in response");
    }

    if (status === "failed") {
      throw new Error("Generation failed: " + JSON.stringify(data));
    }
  }
  throw new Error("Timed out");
}

export async function POST(req: NextRequest) {
  try {
    const { profile, product } = await req.json();

    if (!KLING_KEY) {
      return NextResponse.json(
        { error: "Kling API key not configured" },
        { status: 500 }
      );
    }

    // Build detailed full body prompt
    const prompt = `Full body professional fashion photography of a ${profile.height}cm tall ${profile.weight}kg person wearing a ${product.color} MANTIX branded oversized streetwear t-shirt. The shirt says MANTIX on the chest. Person standing straight facing camera, arms relaxed at sides, full body visible from head to feet. Clean dark studio background, cinematic lighting, sharp focus, photorealistic, 4K fashion editorial. Do not crop body. Show complete outfit head to toe.`;

    console.log("Generating with prompt:", prompt);

    const res = await fetch(`${KLING_BASE}/images/generations`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${KLING_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "kling-v1",
        prompt,
        negative_prompt: "cropped, cut off, missing feet, missing legs, blurry, distorted, watermark, text overlay, bad anatomy, floating, no background",
        n: 1,
        aspect_ratio: "3:4",
      })
    });

    const data = await res.json();
    console.log("Kling response:", JSON.stringify(data, null, 2));

    const taskId = data?.data?.task_id;
    if (!taskId) {
      throw new Error(data?.message || "No task ID returned");
    }

    const imageUrl = await pollForImage(taskId);
    return NextResponse.json({ imageUrl });

  } catch (err: unknown) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}