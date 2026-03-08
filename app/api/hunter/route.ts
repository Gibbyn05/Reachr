import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ contacts: [] });

  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "HUNTER_API_KEY ikke konfigurert", contacts: [] });
  }

  const cleanDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .trim();

  try {
    const res = await fetch(
      `https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(cleanDomain)}&api_key=${apiKey}&limit=5`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();

    const contacts = ((data?.data?.emails ?? []) as Record<string, unknown>[]).map((e) => ({
      email: e.value as string,
      firstName: (e.first_name as string) ?? "",
      lastName: (e.last_name as string) ?? "",
      position: (e.position as string) ?? "",
      confidence: (e.confidence as number) ?? 0,
    }));

    return NextResponse.json({ contacts });
  } catch {
    return NextResponse.json({ error: "Kunne ikke hente kontakter", contacts: [] });
  }
}
