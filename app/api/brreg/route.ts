import { NextRequest, NextResponse } from "next/server";

// Organizational form codes that are NOT real businesses (housing, associations with no commercial intent)
const EXCLUDED_ORG_FORMS = new Set([
  "BRL",   // Borettslag
  "BBL",   // Boligbyggelag
  "ESEK",  // Eierseksjonssameie
  "SAM",   // Sameie
  "TVAM",  // Tingsrettslig sameie
  "BEDR",  // Bedrift (branch unit, not independent company)
  "BO",    // Enkeltpersonforetak under konkursbehandling
]);

// Name fragments that indicate non-business entities
const EXCLUDED_NAME_PATTERNS = [
  /borettslag/i,
  /bofellesskap/i,
  /\bsameie\b/i,
  /eierseksjon/i,
  /huseierforening/i,
  /\bvelforening\b/i,
  /\bboliglag\b/i,
];

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const params = new URLSearchParams();
  const poststed = sp.get("poststed");
  const navn     = sp.get("navn");
  const nkode    = sp.get("naeringskode");
  const fra      = sp.get("fraAntallAnsatte");
  const til      = sp.get("tilAntallAnsatte");
  const mva      = sp.get("mva");
  const page     = sp.get("page") || "0";
  // Fetch more than needed so we still have 100 after filtering
  const requestedSize = parseInt(sp.get("size") || "100", 10);
  const fetchSize = Math.min(requestedSize + 40, 200); // overfetch to compensate for filtered items

  if (poststed) params.set("forretningsadresse.poststed", poststed.toUpperCase());
  if (navn)     params.set("navn", navn);
  if (nkode)    params.set("naeringskode", nkode);
  if (fra)      params.set("fraAntallAnsatte", fra);
  if (til)      params.set("tilAntallAnsatte", til);
  if (mva === "true") params.set("registrertIMvaregisteret", "true");
  params.set("size", String(fetchSize));
  params.set("page", page);
  params.set("konkurs", "false");

  try {
    const res = await fetch(
      `https://data.brreg.no/enhetsregisteret/api/enheter?${params}`,
      { headers: { Accept: "application/json" }, next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Brreg error", status: res.status }, { status: res.status });
    }

    const data = await res.json();
    const raw: any[] = data?._embedded?.enheter ?? [];

    // Filter out non-business org forms and name patterns
    const filtered = raw.filter((e: any) => {
      const formKode: string = e.organisasjonsform?.kode ?? "";
      if (EXCLUDED_ORG_FORMS.has(formKode)) return false;
      const name: string = e.navn ?? "";
      if (EXCLUDED_NAME_PATTERNS.some((p) => p.test(name))) return false;
      return true;
    });

    return NextResponse.json({
      ...data,
      _embedded: { enheter: filtered },
      // Keep original total so the "X av Y" counter reflects Brreg's total
    });
  } catch {
    return NextResponse.json({ error: "Kunne ikke koble til Brreg" }, { status: 500 });
  }
}
