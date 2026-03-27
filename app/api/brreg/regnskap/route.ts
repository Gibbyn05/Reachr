import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });

  const orgnr = request.nextUrl.searchParams.get("orgnr");
  if (!orgnr) return NextResponse.json({ error: "mangler orgnr" }, { status: 400 });

  try {
    const res = await fetch(
      `https://data.brreg.no/regnskapsregisteret/regnskap/${orgnr}`,
      { headers: { Accept: "application/json" }, next: { revalidate: 86400 } }
    );
    if (!res.ok) return NextResponse.json([]);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
