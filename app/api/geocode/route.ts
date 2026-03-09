import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = request.nextUrl.searchParams;
  const adresse = sp.get("adresse");
  const postnummer = sp.get("postnummer");
  const poststed = sp.get("poststed");

  if (!postnummer && !adresse) {
    return NextResponse.json({ error: "Mangler adresse" }, { status: 400 });
  }

  // Build query: prefer full address, fallback to poststed
  const query = [adresse, postnummer, poststed].filter(Boolean).join(" ");

  try {
    const res = await fetch(
      `https://ws.geonorge.no/adresser/v1/sok?sok=${encodeURIComponent(query)}&fuzzy=true&treffPerSide=1`,
      { headers: { Accept: "application/json" }, next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Geocoding feilet" }, { status: res.status });
    }

    const data = await res.json();
    const hit = data?.adresser?.[0];

    if (!hit) {
      return NextResponse.json({ lat: null, lng: null });
    }

    return NextResponse.json({
      lat: hit.representasjonspunkt?.lat ?? null,
      lng: hit.representasjonspunkt?.lon ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Geocoding utilgjengelig" }, { status: 500 });
  }
}
