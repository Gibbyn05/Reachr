import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { lead, senderName, senderCompany, salesPitch } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY ikke konfigurert" }, { status: 500 });
  }

  const productSection = salesPitch
    ? `Hva avsender selger: ${salesPitch}`
    : "Hva avsender selger: ukjent (finn et relevant verdiforslag basert på bransjen til mottaker)";

  const prompt = `Du er en norsk salgsprofesjonell. Skriv en kort, personlig og profesjonell kald e-post til følgende bedrift.

Bedrift: ${lead.name}
Bransje: ${lead.industry}
By: ${lead.city}
Kontaktperson: ${lead.contactPerson || "ukjent"}
Antall ansatte: ${lead.employees || "ukjent"}
Omsetning: ${lead.revenue ? `${(lead.revenue / 1_000_000).toFixed(1)} mill kr` : "ukjent"}

Avsender: ${senderName}${senderCompany ? ` fra ${senderCompany}` : ""}
${productSection}

Krav til e-posten:
- Maks 4–5 setninger i brødteksten
- Start med en personlig referanse til bedriften eller bransjen
- Fokuser e-posten rundt det avsender selger – ikke finn på andre produkter eller tjenester
- Avslutt med en enkel CTA (f.eks. be om et kort møte eller svar)
- Naturlig, norsk tone – ikke selgende eller generisk
- Skriv BARE e-posten (emnelinjen og brødteksten), ingen forklaringer

Format:
Emne: [emnetekst]

[brødtekst]

Med vennlig hilsen,
${senderName}`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  // Parse subject and body
  const lines = text.trim().split("\n");
  const subjectLine = lines.find((l) => l.startsWith("Emne:")) ?? "";
  const subject = subjectLine.replace("Emne:", "").trim();
  const bodyStart = lines.findIndex((l) => l.startsWith("Emne:"));
  const body = lines
    .slice(bodyStart + 1)
    .join("\n")
    .trim();

  return NextResponse.json({ subject, body });
}
