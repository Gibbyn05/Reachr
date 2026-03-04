import { NextRequest, NextResponse } from "next/server";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "nb-NO,nb;q=0.9",
};

/** Extract the first Norwegian phone number found in raw HTML */
function extractPhone(html: string): string | null {
  // 1. Prefer <a href="tel:..."> links — most reliable
  const telHref = html.match(/href=["']tel:([+\d\s\-()]{7,20})["']/i);
  if (telHref) {
    const raw = telHref[1].replace(/\s+/g, " ").trim();
    return formatNO(raw);
  }

  // 2. Structured: +47 followed by 8 digits (with optional spaces)
  const intl = html.match(/\+47[\s\-]?(\d[\d\s\-]{6,12}\d)/);
  if (intl) {
    const digits = intl[1].replace(/\D/g, "");
    if (digits.length === 8) return `+47 ${chunk(digits)}`;
  }

  // 3. Bare 8-digit number in a recognisable context (data-phone, itemprop, etc.)
  const dataPhone = html.match(/(?:data-phone|itemprop="telephone"|content=")["\s]*(\+?47)?[\s\-]?(\d{8})[">\s]/);
  if (dataPhone) {
    const digits = dataPhone[2];
    return `+47 ${chunk(digits)}`;
  }

  return null;
}

function chunk(digits: string): string {
  // Format as XX XX XX XX
  return digits.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");
}

function formatNO(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("47") && digits.length === 10) {
    return `+47 ${chunk(digits.slice(2))}`;
  }
  if (digits.length === 8) return `+47 ${chunk(digits)}`;
  return raw;
}

/** Try Gulesider.no — direct org-number page */
async function tryGulesider(orgnr: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.gulesider.no/bedrift/${orgnr}`, {
      headers: HEADERS,
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    return extractPhone(await res.text());
  } catch {
    return null;
  }
}

/** Try 1881.no — direct org-number page */
async function try1881(orgnr: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.1881.no/naeringsliv/${orgnr}/`, {
      headers: HEADERS,
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    return extractPhone(await res.text());
  } catch {
    return null;
  }
}

/** Try Gulesider search by name + poststed */
async function tryGulesiderSearch(name: string, poststed: string): Promise<string | null> {
  try {
    const q = encodeURIComponent(name);
    const loc = encodeURIComponent(poststed);
    const res = await fetch(`https://www.gulesider.no/finn/${q}/${loc}`, {
      headers: HEADERS,
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    return extractPhone(await res.text());
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const orgnr = sp.get("orgnr");
  const name = sp.get("name") ?? "";
  const poststed = sp.get("poststed") ?? "";

  if (!orgnr) {
    return NextResponse.json({ phone: null }, { status: 400 });
  }

  // Try sources in order — first hit wins
  const phone =
    (await tryGulesider(orgnr)) ??
    (await try1881(orgnr)) ??
    (name && poststed ? await tryGulesiderSearch(name, poststed) : null);

  return NextResponse.json(
    { phone },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
