import { NextRequest, NextResponse } from "next/server";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,*/*",
  "Accept-Language": "nb-NO,nb;q=0.9,no;q=0.8",
};

const SKIP_PATTERNS = [
  /noreply/i, /no-reply/i, /donotreply/i, /postmaster/i,
  /example\./i, /test@/i, /demo@/i, /support@sentry/i,
  /\.png$/i, /\.jpg$/i, /\.gif$/i, /\.svg$/i,
];

// Emails that belong to the directory sites themselves — never a company email
const SKIP_DOMAINS = [
  "proff.no", "1881.no", "gulesider.no", "brreg.no", "altinn.no",
  "skatteetaten.no", "nav.no", "regjeringen.no",
];

function isValidEmail(email: string): boolean {
  if (!email.includes("@") || !email.includes(".")) return false;
  if (SKIP_PATTERNS.some((p) => p.test(email))) return false;
  if (email.length > 100) return false;
  if (!(/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email))) return false;
  const domain = email.split("@")[1].toLowerCase();
  if (SKIP_DOMAINS.some((d) => domain === d || domain.endsWith("." + d))) return false;
  return true;
}

function extractEmails(html: string): string[] {
  const found = new Set<string>();

  // 1. mailto: href — most reliable
  for (const m of html.matchAll(/href=["']mailto:([^"'?\s]+)["']/gi)) {
    const e = m[1].toLowerCase().trim();
    if (isValidEmail(e)) found.add(e);
  }

  // 2. JSON-LD / embedded JSON: "email":"..."
  for (const m of html.matchAll(/"(?:email|epost|e-post|mail)":\s*"([^"]{5,100})"/gi)) {
    const e = m[1].toLowerCase().trim();
    if (isValidEmail(e)) found.add(e);
  }

  // 3. itemprop="email" content="..."
  for (const m of html.matchAll(/itemprop=["']email["'][^>]*content=["']([^"']{5,100})["']/gi)) {
    const e = m[1].toLowerCase().trim();
    if (isValidEmail(e)) found.add(e);
  }

  // 4. data-email attribute
  for (const m of html.matchAll(/data-email=["']([^"']{5,100})["']/gi)) {
    const e = m[1].toLowerCase().trim();
    if (isValidEmail(e)) found.add(e);
  }

  return Array.from(found);
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}

async function try1881ByOrgnr(orgnr: string): Promise<string[]> {
  const html = await fetchPage(`https://www.1881.no/naeringsliv/${orgnr}/`);
  return html ? extractEmails(html) : [];
}

async function try1881Search(name: string): Promise<string[]> {
  const html = await fetchPage(
    `https://www.1881.no/søk/?query=${encodeURIComponent(name)}&type=business`
  );
  return html ? extractEmails(html) : [];
}

async function tryGulesiderByOrgnr(orgnr: string): Promise<string[]> {
  const html = await fetchPage(`https://www.gulesider.no/bedrift/${orgnr}`);
  return html ? extractEmails(html) : [];
}

async function tryGulesiderSearch(name: string, poststed: string): Promise<string[]> {
  const html = await fetchPage(
    `https://www.gulesider.no/finn/${encodeURIComponent(name)}/${encodeURIComponent(poststed)}`
  );
  return html ? extractEmails(html) : [];
}

async function tryProff(orgnr: string): Promise<string[]> {
  const html = await fetchPage(`https://www.proff.no/selskap/-/-/-/${orgnr}/`);
  return html ? extractEmails(html) : [];
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const orgnr = sp.get("orgnr");
  const name = sp.get("name") ?? "";
  const poststed = sp.get("poststed") ?? "";

  if (!orgnr && !name) {
    return NextResponse.json({ emails: [] }, { status: 400 });
  }

  const allEmails: string[] = [];

  if (orgnr) {
    const [from1881, fromGulesider, fromProff] = await Promise.all([
      try1881ByOrgnr(orgnr),
      tryGulesiderByOrgnr(orgnr),
      tryProff(orgnr),
    ]);
    allEmails.push(...from1881, ...fromGulesider, ...fromProff);
  }

  // If no direct hits, try name-based search
  if (allEmails.length === 0 && name) {
    const [from1881Search, fromGulesiderSearch] = await Promise.all([
      try1881Search(name),
      poststed ? tryGulesiderSearch(name, poststed) : Promise.resolve([]),
    ]);
    allEmails.push(...from1881Search, ...fromGulesiderSearch);
  }

  const unique = Array.from(new Set(allEmails));

  return NextResponse.json(
    { emails: unique },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
