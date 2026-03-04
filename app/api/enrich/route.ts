import { NextRequest, NextResponse } from "next/server";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,*/*",
  "Accept-Language": "nb-NO,nb;q=0.9,no;q=0.8",
};

/** Extract the first Norwegian phone number found in raw HTML */
function extractPhone(html: string): string | null {
  // 1. tel: href — most reliable source
  const telHrefs = [...html.matchAll(/href=["']tel:([+\d\s\-().]{5,20})["']/gi)];
  for (const m of telHrefs) {
    const p = formatNO(m[1].trim());
    if (p) return p;
  }

  // 2. JSON-embedded: "phone":"XXXXXXXX" or "tlf":"XXXXXXXX"
  const jsonPhone = html.match(/"(?:phone|tlf|telefon|telephone)":\s*"([+\d\s\-]{7,20})"/i);
  if (jsonPhone) {
    const p = formatNO(jsonPhone[1].trim());
    if (p) return p;
  }

  // 3. itemprop / meta content / data-phone
  const structured = html.match(
    /(?:itemprop=["']telephone["']|data-phone=["']|content=["'])([+\d\s\-]{7,20})["'<]/i
  );
  if (structured) {
    const p = formatNO(structured[1].trim());
    if (p) return p;
  }

  // 4. +47 followed by 8 digits
  const intl = html.match(/\+47[\s\-]?(\d[\d\s\-]{0,10}\d)/g);
  if (intl) {
    for (const m of intl) {
      const digits = m.replace(/\D/g, "").replace(/^47/, "");
      if (digits.length === 8) return `+47 ${chunk(digits)}`;
    }
  }

  // 5. Norwegian mobile: starts with 4x or 9x (8 digits)
  const mobile = html.match(/\b([49]\d{7})\b/g);
  if (mobile) {
    for (const m of mobile) {
      const digits = m.replace(/\D/g, "");
      if (digits.length === 8) return `+47 ${chunk(digits)}`;
    }
  }

  return null;
}

function chunk(digits: string): string {
  return digits.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");
}

function formatNO(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("47") && digits.length === 10) return `+47 ${chunk(digits.slice(2))}`;
  if (digits.length === 8) return `+47 ${chunk(digits)}`;
  return null;
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}

/** Try Brreg's own entity record — returns telefon/mobil as structured JSON */
async function tryBrreg(orgnr: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`,
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const raw = data.telefon ?? data.mobil ?? null;
    if (!raw) return null;
    return formatNO(String(raw).replace(/\s/g, ""));
  } catch {
    return null;
  }
}

async function tryGulesider(orgnr: string): Promise<string | null> {
  const html = await fetchPage(`https://www.gulesider.no/bedrift/${orgnr}`);
  return html ? extractPhone(html) : null;
}

async function try1881(orgnr: string): Promise<string | null> {
  const html = await fetchPage(`https://www.1881.no/naeringsliv/${orgnr}/`);
  return html ? extractPhone(html) : null;
}

async function tryGulesiderSearch(name: string, poststed: string): Promise<string | null> {
  const q = encodeURIComponent(name);
  const loc = encodeURIComponent(poststed);
  const html = await fetchPage(`https://www.gulesider.no/finn/${q}/${loc}`);
  return html ? extractPhone(html) : null;
}

async function try1881Search(name: string): Promise<string | null> {
  const q = encodeURIComponent(name);
  const html = await fetchPage(`https://www.1881.no/søk/?query=${q}&type=business`);
  return html ? extractPhone(html) : null;
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const orgnr = sp.get("orgnr");
  const name = sp.get("name") ?? "";
  const poststed = sp.get("poststed") ?? "";

  if (!orgnr) {
    return NextResponse.json({ phone: null }, { status: 400 });
  }

  // Run all direct-lookup sources in parallel for speed
  const [fromBrreg, fromGulesider, from1881] = await Promise.all([
    tryBrreg(orgnr),
    tryGulesider(orgnr),
    try1881(orgnr),
  ]);

  let phone = fromBrreg ?? fromGulesider ?? from1881;

  // If direct lookups failed, try name-based search in parallel
  if (!phone && name) {
    const searches = await Promise.all([
      poststed ? tryGulesiderSearch(name, poststed) : Promise.resolve(null),
      try1881Search(name),
    ]);
    phone = searches.find(Boolean) ?? null;
  }

  return NextResponse.json(
    { phone },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
