import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file" }, { status: 400 });
    }

    // Convert audio to base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = audioFile.type || "audio/webm";

    // Use Claude to transcribe (multimodal)
    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please transcribe this audio recording accurately. Return ONLY the transcribed text, nothing else. The speaker is Norwegian, so transcribe in Norwegian if that's what's spoken.",
            },
            {
              type: "document",
              source: {
                type: "base64",
                media_type: mimeType as any,
                data: base64Audio,
              },
            } as any,
          ],
        },
      ],
    });

    const transcript =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ transcript });
  } catch (error: any) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Transcription failed: " + error.message },
      { status: 500 }
    );
  }
}
