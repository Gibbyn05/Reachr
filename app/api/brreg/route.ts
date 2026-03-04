import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const params = new URLSearchParams();
  const poststed = sp.get("poststed");
  const navn     = sp.get("navn");
  const nkode    = sp.get("naeringskode");
  const fra      = sp.get("fraAntallAnsatte");
  const til      = sp.get("tilAntallAnsatte");
  const mva      = sp.get("mva");
  const size     = sp.get("size") || "25";

  if (poststed) params.set("forretningsadresse.poststed", poststed.toUpperCase());
  if (navn)     params.set("navn", navn);
  if (nkode)    params.set("naeringskode", nkode);
  if (fra)      params.set("fraAntallAnsatte", fra);
  if (til)      params.set("tilAntallAnsatte", til);
  if (mva === "true") params.set("registrertIMvaregisteret", "true");
  params.set("size", size);
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
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Kunne ikke koble til Brreg" }, { status: 500 });
  }
}
