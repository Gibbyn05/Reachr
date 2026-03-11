import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const bodyData = await req.json().catch(() => ({}));
    const { lead, senderName, senderCompany, salesPitch, targetCustomers, comment, isSequence } = bodyData;

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY ikke konfigurert" }, { status: 500 });
    }

    const targetLabel: Record<string, string> = { b2b: "bedrifter (B2B)", b2c: "privatpersoner (B2C)", begge: "både bedrifter og privatpersoner" };
    const productSection = salesPitch
      ? `Hva avsender selger: ${salesPitch}${targetCustomers ? `\nMålgruppe: ${targetLabel[targetCustomers] ?? targetCustomers}` : ""}`
      : "Hva avsender selger: Salgsfremmende tjenester";

    const leadSection = isSequence 
      ? "Dette er en generell mal for en sekvens. Bruk {{navn}} for kontaktperson og {{bedrift}} for firmanavn som placeholders."
      : `Bedrift: ${lead?.name || "ukjent"}
Bransje: ${lead?.industry || "ukjent"}
By: ${lead?.city || "ukjent"}
Kontaktperson: ${lead?.contactPerson || "ukjent"}
Antall ansatte: ${lead?.employees || "ukjent"}
Omsetning: ${lead?.revenue ? `${(lead.revenue / 1_000_000).toFixed(1)} mill kr` : "ukjent"}`;

    const prompt = `Du er en norsk salgsprofesjonell. Skriv en kort, personlig og profesjonell salgs-e-post.
${leadSection}

Avsender: ${senderName}${senderCompany ? ` fra ${senderCompany}` : ""}
${productSection}

Krav til e-posten:
- Maks 4–5 setninger i brødteksten
- Skriv til bedriften, ikke til kontaktpersonen spesifikt. Bruk gjerne {{bedrift}} i hilsenen.
- Start med "Hei," eller "Hei {{bedrift}},"
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

    console.log("[/api/email/generate] Calling Anthropic...");
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    console.log("[/api/email/generate] Received text length:", text.length);

    // Robust parse subject and body
    let subject = "";
    let body = "";

    const subjectMatch = text.match(/Emne:\s*(.*)/i);
    if (subjectMatch) {
      subject = subjectMatch[1].trim();
      body = text.replace(subjectMatch[0], "").trim();
    } else {
      // Fallback if AI skips "Emne:"
      subject = isSequence ? "Oppfølging" : `Henvendelse til ${lead?.name || "bedrift"}`;
      body = text.trim();
    }

    return NextResponse.json({ subject, body });
  } catch (err: any) {
    console.error("[/api/email/generate] Catch Error:", err);
    return NextResponse.json({ 
      error: err.message || "En ukjent feil oppsto under generering." 
    }, { status: 500 });
  }
}
