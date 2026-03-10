import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

const EXCLUDE = [
  /noreply/i, /no-reply/i, /donotreply/i,
  /example\./i, /test@/i, /sentry\./i,
  /wixpress/i, /\.(png|jpg|gif|svg)/i,
  /@2x/i, /schema\./i, /w3\.org/i,
  /gulesider\.no/i, /1881\.no/i, /proff\.no/i,
  /finn\.no/i, /facebook\.com/i,
];

function extractEmails(html: string): string[] {
  // Also decode HTML entities like &#64; (=@) and mailto: href
  const decoded = html
    .replace(/&#64;/g, "@")
    .replace(/&#x40;/gi, "@")
    .replace(/\[at\]/gi, "@")
    .replace(/\s*\(at\)\s*/gi, "@")
    .replace(/\s*AT\s*/g, "@");

  const matches = decoded.match(EMAIL_REGEX) ?? [];
  return [...new Set(matches)].filter(
    (e) => !EXCLUDE.some((p) => p.test(e)) && e.includes(".")
  );
}

async function fetchText(url: string, extraHeaders?: Record<string, string>): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "nb-NO,nb;q=0.9,no;q=0.8,en;q=0.7",
      ...extraHeaders,
    },
    signal: AbortSignal.timeout(7000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

/** Søk på Gule Sider etter bedriftsnavn + org.nr */
async function tryGuleSider(navn: string, orgnr: string): Promise<string | null> {
  try {
    const q = encodeURIComponent(navn);
    const html = await fetchText(`https://www.gulesider.no/finn/bedrifter?q=${q}`);
    // Gule Sider viser epost som mailto-lenker
    const mailtos = [...html.matchAll(/href="mailto:([^"]+)"/gi)].map(m => m[1]);
    const filtered = mailtos.filter(e => !EXCLUDE.some(p => p.test(e)));
    if (filtered.length > 0) return filtered[0];
    // Fallback: generell epostuttrekk
    const emails = extractEmails(html);
    return emails[0] ?? null;
  } catch {
    return null;
  }
}

/** Søk på 1881 etter bedriftsnavn */
async function try1881(navn: string): Promise<string | null> {
  try {
    const q = encodeURIComponent(navn);
    const html = await fetchText(`https://www.1881.no/?query=${q}&searchType=company`);
    const mailtos = [...html.matchAll(/href="mailto:([^"]+)"/gi)].map(m => m[1]);
    const filtered = mailtos.filter(e => !EXCLUDE.some(p => p.test(e)));
    if (filtered.length > 0) return filtered[0];
    const emails = extractEmails(html);
    return emails[0] ?? null;
  } catch {
    return null;
  }
}

/** Søk på Proff.no etter org.nr */
async function tryProff(orgnr: string, navn: string): Promise<string | null> {
  try {
    const q = encodeURIComponent(navn);
    const html = await fetchText(`https://www.proff.no/søk?q=${q}`);
    const mailtos = [...html.matchAll(/href="mailto:([^"]+)"/gi)].map(m => m[1]);
    const filtered = mailtos.filter(e => !EXCLUDE.some(p => p.test(e)));
    if (filtered.length > 0) return filtered[0];
    const emails = extractEmails(html);
    return emails[0] ?? null;
  } catch {
    return null;
  }
}

/** Skrap nettside + vanlige kontaktsider */
async function tryWebsite(raw: string): Promise<string | null> {
  let base: URL;
  try {
    base = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  const pages = [
    base.href,
    new URL("/kontakt", base).href,
    new URL("/contact", base).href,
    new URL("/om-oss", base).href,
    new URL("/about", base).href,
    new URL("/kontakt-oss", base).href,
  ];

  for (const url of pages) {
    try {
      const html = await fetchText(url);
      // Prioriter mailto-lenker
      const mailtos = [...html.matchAll(/href="mailto:([^"]+)"/gi)].map(m => m[1]);
      const filteredMailtos = mailtos.filter(e => !EXCLUDE.some(p => p.test(e)));
      if (filteredMailtos.length > 0) return filteredMailtos[0];
      const emails = extractEmails(html);
      if (emails.length > 0) return emails[0];
    } catch {
      // prøv neste
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  const website = req.nextUrl.searchParams.get("url") ?? "";
  const navn    = req.nextUrl.searchParams.get("navn") ?? "";
  const orgnr   = req.nextUrl.searchParams.get("orgnr") ?? "";

  if (!website && !navn && !orgnr) {
    return NextResponse.json({ email: null });
  }

  // Kjør alle kilder parallelt
  const [fromWebsite, fromGuleSider, from1881, fromProff] = await Promise.all([
    website ? tryWebsite(website) : Promise.resolve(null),
    navn    ? tryGuleSider(navn, orgnr) : Promise.resolve(null),
    navn    ? try1881(navn) : Promise.resolve(null),
    orgnr   ? tryProff(orgnr, navn) : Promise.resolve(null),
  ]);

  const email = fromWebsite ?? fromGuleSider ?? from1881 ?? fromProff ?? null;
  return NextResponse.json({ email });
}
