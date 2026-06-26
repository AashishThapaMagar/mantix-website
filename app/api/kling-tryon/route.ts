import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { profile, product } = await req.json();

    fal.config({ credentials: process.env.FAL_KEY });

    // Map product to shirt file
    const shirtFiles: Record<string, string> = {
      "01": "phantom.png",
      "02": "phantom.png",
      "03": "phantom.png",
    };

    const shirtFile = shirtFiles[product.id] || "phantom.png";
    const shirtPath = path.join(process.cwd(), "public", "shirts", shirtFile);

    // Read shirt image and convert to base64
    const shirtBuffer = fs.readFileSync(shirtPath);
    const shirtBase64 = `data:image/png;base64,${shirtBuffer.toString("base64")}`;

    console.log("Starting fal.ai virtual try-on...");

    const result = await fal.subscribe(
      "fal-ai/kling/v1-5/kolors-virtual-try-on",
      {
        input: {
          human_image_url: profile.photo,
          garment_image_url: shirtBase64,
        },
        logs: true,
        onQueueUpdate: (update) => {
          console.log("fal status:", update.status);
        },
      }
    );

    console.log("fal result:", JSON.stringify(result, null, 2));

    const imageUrl = result.data?.image?.url;
    if (!imageUrl) throw new Error("No image URL returned from fal.ai");

    return NextResponse.json({ imageUrl });

  } catch (err: unknown) {
    console.error("Try-on error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}