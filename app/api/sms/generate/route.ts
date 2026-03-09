import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lead, senderName, senderCompany, salesPitch, comment } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY ikke konfigurert" }, { status: 500 });
  }

  const prompt = `Du er en norsk salgsprofesjonell. Skriv en kort, uformell og personlig SMS-melding til følgende bedrift.

Bedrift: ${lead.name}
Bransje: ${lead.industry}
By: ${lead.city}
Kontaktperson: ${lead.contactPerson || "ukjent"}

Avsender: ${senderName}${senderCompany ? ` fra ${senderCompany}` : ""}
${salesPitch ? `Hva avsender selger: ${salesPitch}` : ""}

Krav:
- Maks 2–3 korte setninger, absolutt under 160 tegn totalt
- Naturlig og direkte tone, som en ekte SMS
- Start med "Hei," eller "Hei [fornavn til kontaktperson],"
- Avslutt med avsenders fornavn
- Ingen hilsener, ingen formell avslutning
- Fokus på én tydelig verdi eller spørsmål
${comment ? `- Tillegg: ${comment}` : ""}

Skriv BARE selve SMS-teksten, ingen forklaringer.`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
  return NextResponse.json({ text });
}
