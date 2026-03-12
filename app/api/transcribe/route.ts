import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY not configured" },
      { status: 500 }
    );
  }

  const groq = new Groq({ apiKey });

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Groq Whisper supports: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      language: "no", // Norwegian
      response_format: "text",
    });

    return NextResponse.json({ transcript: transcription });
  } catch (error: any) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Transcription failed: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
