import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import Anthropic from "@anthropic-ai/sdk";

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
      language: "no",
      response_format: "text",
    }) as unknown as string;

    // Speaker diarization via Claude — label who said what based on conversational cues
    if (process.env.ANTHROPIC_API_KEY && transcription && transcription.length > 50) {
      try {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const response = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2000,
          messages: [{
            role: "user",
            content: `Dette er en transkribert telefon-salgssamtale på norsk:\n\n"${transcription}"\n\nIdentifiser de to talerne og merk hvert utsagn med "Meg:" (selgeren som ringte) eller "Kontakt:" (den andre personen). Bruk naturlige samtale-skift (spørsmål/svar, hilsener, etc.) for å bestemme hvem som sier hva. Returner KUN den merkede teksten, én linje per taleskift, ingen annen tekst.`,
          }],
        });
        const labeled = response.content[0].type === "text" ? response.content[0].text.trim() : transcription;
        return NextResponse.json({ transcript: labeled });
      } catch {
        // Fall back to raw transcript if diarization fails
        return NextResponse.json({ transcript: transcription });
      }
    }

    return NextResponse.json({ transcript: transcription });
  } catch (error: any) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Transcription failed: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
