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
    const { lead, senderName, senderCompany, salesPitch, targetCustomers, comment, isSequence, stepIndex } = bodyData;

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY ikke konfigurert" }, { status: 500 });
    }

    const isFollowUp = (stepIndex ?? 0) > 0;

    const targetLabel: Record<string, string> = { b2b: "bedrifter (B2B)", b2c: "privatpersoner (B2C)", begge: "både bedrifter og privatpersoner" };
    const productSection = salesPitch && !isFollowUp
      ? `Hva avsender selger: ${salesPitch}${targetCustomers ? `\nMålgruppe: ${targetLabel[targetCustomers] ?? targetCustomers}` : ""}`
      : isFollowUp ? "Dette er en oppfølging. Du har allerede sent en introduksjon. Referer kort til forrige e-post uten å gjenta salgspitchen." : "Hva avsender selger: Salgsfremmende tjenester";

    const leadSection = isSequence 
      ? `Dette er en generell mal for steg ${ (stepIndex ?? 0) + 1} i en sekvens. Bruk {{navn}} og {{bedrift}} som placeholders.`
      : `Bedrift: ${lead?.name || "ukjent"}\nBransje: ${lead?.industry || "ukjent"}\nBy: ${lead?.city || "ukjent"}\nKontaktperson: ${lead?.contactPerson || "ukjent"}`;

    const prompt = isFollowUp 
    ? `Du er en norsk salgsprofesjonell. Skriv en oppfølgings-e-post.
${leadSection}
Avsender: ${senderName}
Målet med denne e-posten: Sjekke om mottakeren har lest den forrige e-posten din.

Krav til e-posten:
- Maks 2 setninger
- IKKE presenter deg selv eller produktet på nytt.
- Bruk en personlig og uformell tone (f.eks "Hei igjen,").
- Referer til forrige e-post (f.eks "Ville bare sjekke om du hadde sjanse til å lese min forrige e-post").
- Avslutt med en enkel CTA (f.eks "Hører gjerne fra deg").
${comment ? `- Tilleggsinstruksjoner: ${comment}` : ""}

Format:
Emne: Re: [forrige emne eller lignende]

[brødtekst]

Hilsen,
${senderName}`
    : `Du er en norsk salgsprofesjonell. Skriv en introduksjons-e-post.
${leadSection}
Avsender: ${senderName}${senderCompany ? ` fra ${senderCompany}` : ""}
${productSection}

Krav til e-posten:
- Maks 4 setninger.
- Start med "Hei {{bedrift}}," eller "Hei {{navn}},"
- Introduser kort hvorfor du kontakter dem basert på salgspitchen ovenfor.
- Naturlig og uformell tone.
${comment ? `- Tilleggsinstruksjoner: ${comment}` : ""}

Format:
Emne: [emne]

[brødtekst]

Hilsen,
${senderName}`;

    console.log("[/api/email/generate] Calling Anthropic...");
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
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
