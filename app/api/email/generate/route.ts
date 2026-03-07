import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { lead, senderName, senderCompany, salesPitch, targetCustomers, comment } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY ikke konfigurert" }, { status: 500 });
  }

  const targetLabel: Record<string, string> = { b2b: "bedrifter (B2B)", b2c: "privatpersoner (B2C)", begge: "både bedrifter og privatpersoner" };
  const productSection = salesPitch
    ? `Hva avsender selger: ${salesPitch}${targetCustomers ? `\nMålgruppe: ${targetLabel[targetCustomers] ?? targetCustomers}` : ""}`
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
- Skriv til bedriften, ikke til kontaktpersonen spesifikt. Ikke bruk kontaktpersonens navn i hilsenen.
- Start med "Hei," eller "Hei [bedriftsnavn]," – aldri "Kjære [navn]" eller lignende.
- Start med en kort referanse til bransjen eller hva bedriften driver med.
- Aldri skriv at du har fulgt med på bedriften, sett dem på sosiale medier, lagt merke til dem eller lignende. Det fremstår som falskt.
- Fokuser e-posten rundt det avsender selger – ikke finn på andre produkter eller tjenester.
- Avslutt med en enkel CTA (f.eks. be om et kort møte eller svar).
- Naturlig, uformell og profesjonell norsk tone – ikke selgende eller generisk.
- Unngå bindestreker som pausetegn (ikke bruk " – " eller " - " midt i setninger). Bruk heller komma eller skriv om til to setninger.
- Ikke skriv som om avsender befinner seg i samme by som mottakeren. Avsender henvender seg utenfra, så unngå formuleringer som "her i [by]" eller "dere her i [by]".
${comment ? `- Tilleggsinstruksjoner fra avsender: ${comment}` : ""}
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
