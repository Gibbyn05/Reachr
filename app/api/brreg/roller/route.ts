import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const orgnr = request.nextUrl.searchParams.get("orgnr");
  if (!orgnr) return NextResponse.json({ error: "mangler orgnr" }, { status: 400 });

  try {
    const res = await fetch(
      `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}/roller`,
      { headers: { Accept: "application/json" }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return NextResponse.json({ roller: [] });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ roller: [] });
  }
}
