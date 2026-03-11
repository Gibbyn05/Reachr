import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/* ── Regex & filtrering ─────────────────────────────────── */
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

const EXCLUDE = [
  /noreply/i, /no-reply/i, /donotreply/i, /unsubscribe/i,
  /example\./i, /test@/i, /sentry\./i, /wixpress/i,
  /\.(png|jpg|gif|svg|webp)/i, /@2x/i, /schema\./i,
  /w3\.org/i, /googleapis/i, /cloudflare/i, /amazonaws/i,
  /gulesider\.no/i, /1881\.no/i, /proff\.no/i,
  /finn\.no/i, /facebook\.com/i, /google\./i,
  /purehelp\.no/i, /firma\.no/i, /duckduckgo/i,
  /privacy/i, /support@wp/i, /wordpress/i,
];

function decodeHtml(html: string): string {
  return html
    .replace(/&#64;/g, "@").replace(/&#x40;/gi, "@")
    .replace(/\[at\]/gi, "@").replace(/\(at\)/gi, "@")
    .replace(/\s+AT\s+/g, "@").replace(/\s+at\s+/g, "@")
    .replace(/&#46;/g, ".").replace(/\[dot\]/gi, ".").replace(/\(dot\)/gi, ".");
}

function extractEmails(html: string): string[] {
  const decoded = decodeHtml(html);
  // Prioriter mailto:-lenker
  const mailtos = [...decoded.matchAll(/href=["']mailto:([^"'?\s]+)/gi)].map(m => m[1]);
  // Deretter fri tekst
  const free = decoded.match(EMAIL_REGEX) ?? [];
  const all = [...mailtos, ...free];
  return [...new Set(all)].filter(
    e => !EXCLUDE.some(p => p.test(e)) && e.includes(".") && e.length < 80
  );
}

/* ── Fetch-hjelper ──────────────────────────────────────── */
async function get(url: string, extra?: Record<string, string>): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "nb-NO,nb;q=0.9,no;q=0.8,en;q=0.7",
      ...extra,
    },
    redirect: "follow",
    signal: AbortSignal.timeout(7000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function first(html: string): string | null {
  return extractEmails(html)[0] ?? null;
}

/* ── Kilder ──────────────────────────────────────────────── */

/** Bedriftens egen nettside + vanlige kontaktsider */
async function tryWebsite(raw: string): Promise<string | null> {
  let base: URL;
  try { base = new URL(raw.startsWith("http") ? raw : `https://${raw}`); }
  catch { return null; }

  const paths = [
    "", "/kontakt", "/contact", "/om-oss", "/about",
    "/kontakt-oss", "/kontaktskjema", "/hjelp", "/support",
    "/finn-oss", "/reach-us",
  ];

  for (const p of paths) {
    try {
      const html = await get(new URL(p, base).href);
      const e = first(html);
      if (e) return e;
    } catch { /* neste */ }
  }
  return null;
}

/** Gule Sider */
async function tryGuleSider(navn: string): Promise<string | null> {
  try {
    const html = await get(`https://www.gulesider.no/finn/bedrifter?q=${encodeURIComponent(navn)}`);
    return first(html);
  } catch { return null; }
}

/** 1881.no */
async function try1881(navn: string): Promise<string | null> {
  try {
    const html = await get(`https://www.1881.no/?query=${encodeURIComponent(navn)}&searchType=company`);
    return first(html);
  } catch { return null; }
}

/** Proff.no */
async function tryProff(navn: string): Promise<string | null> {
  try {
    const html = await get(`https://www.proff.no/s%C3%B8k?q=${encodeURIComponent(navn)}`);
    return first(html);
  } catch { return null; }
}

/** Purehelp.no — norsk bedriftskatalog */
async function tryPurehelp(navn: string, orgnr: string): Promise<string | null> {
  try {
    const html = await get(`https://purehelp.no/search/?q=${encodeURIComponent(navn)}`);
    const e = first(html);
    if (e) return e;
    if (orgnr) {
      const html2 = await get(`https://purehelp.no/company/${orgnr}/`);
      return first(html2);
    }
    return null;
  } catch { return null; }
}

/** Firma.no */
async function tryFirma(orgnr: string, navn: string): Promise<string | null> {
  try {
    if (orgnr) {
      const html = await get(`https://firma.no/bedrift/${orgnr}`);
      const e = first(html);
      if (e) return e;
    }
    const html2 = await get(`https://firma.no/search?q=${encodeURIComponent(navn)}`);
    return first(html2);
  } catch { return null; }
}

/** Bedriftsdatabasen.no */
async function tryBedriftsdatabasen(orgnr: string, navn: string): Promise<string | null> {
  try {
    if (orgnr) {
      const html = await get(`https://www.bedriftsdatabasen.no/bedrift/${orgnr}`);
      const e = first(html);
      if (e) return e;
    }
    const html2 = await get(`https://www.bedriftsdatabasen.no/search?q=${encodeURIComponent(navn)}`);
    return first(html2);
  } catch { return null; }
}

/** Enin.no — norsk bedriftsdatabase */
async function tryEnin(navn: string): Promise<string | null> {
  try {
    const html = await get(`https://www.enin.no/search?q=${encodeURIComponent(navn)}`);
    return first(html);
  } catch { return null; }
}

/** Foretaksregisteret direkte via Brreg enhetsregisteret */
async function tryBrregKontakt(orgnr: string): Promise<string | null> {
  try {
    const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.epostadresse ?? data.hjemmeside ?? null; // hjemmeside ikke epost, men kontrollerer felt
  } catch { return null; }
}

/** DuckDuckGo HTML-søk — fanger opp alt resten ikke har */
async function tryDuckDuckGo(navn: string, orgnr: string): Promise<string | null> {
  const queries = [
    `"${navn}" epost kontakt`,
    `"${navn}" email contact`,
    orgnr ? `${orgnr} epost` : "",
  ].filter(Boolean);

  for (const q of queries) {
    try {
      const html = await get(
        `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`,
        { Referer: "https://duckduckgo.com/" }
      );
      const e = first(html);
      if (e) return e;
    } catch { /* neste */ }
  }
  return null;
}

/** Bing HTML-søk som ekstra fallback */
async function tryBing(navn: string): Promise<string | null> {
  try {
    const q = encodeURIComponent(`"${navn}" epost OR email`);
    const html = await get(`https://www.bing.com/search?q=${q}&setlang=nb`, {
      Referer: "https://www.bing.com/",
    });
    return first(html);
  } catch { return null; }
}

/* ── Hoved-handler ───────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const website = req.nextUrl.searchParams.get("url") ?? "";
  const navn    = req.nextUrl.searchParams.get("navn") ?? "";
  const orgnr   = req.nextUrl.searchParams.get("orgnr") ?? "";

  if (!website && !navn && !orgnr) return NextResponse.json({ email: null });

  // Runde 1: alle raske kilder parallelt
  const [
    fromWebsite,
    fromGuleSider,
    from1881,
    fromProff,
    fromPurehelp,
    fromFirma,
    fromBedriftsdatabasen,
    fromEnin,
    fromBrregKontakt,
  ] = await Promise.all([
    website ? tryWebsite(website)                       : Promise.resolve(null),
    navn    ? tryGuleSider(navn)                        : Promise.resolve(null),
    navn    ? try1881(navn)                             : Promise.resolve(null),
    navn    ? tryProff(navn)                            : Promise.resolve(null),
    navn    ? tryPurehelp(navn, orgnr)                  : Promise.resolve(null),
    (orgnr || navn) ? tryFirma(orgnr, navn)             : Promise.resolve(null),
    (orgnr || navn) ? tryBedriftsdatabasen(orgnr, navn) : Promise.resolve(null),
    navn    ? tryEnin(navn)                             : Promise.resolve(null),
    orgnr   ? tryBrregKontakt(orgnr)                   : Promise.resolve(null),
  ]);

  const round1 = fromWebsite ?? fromGuleSider ?? from1881 ?? fromProff
    ?? fromPurehelp ?? fromFirma ?? fromBedriftsdatabasen ?? fromEnin ?? fromBrregKontakt;

  if (round1) return NextResponse.json({ email: round1 });

  // Runde 2: søkemotorer (tregere, bruker bare om alt annet feiler)
  const [fromDDG, fromBing] = await Promise.all([
    navn ? tryDuckDuckGo(navn, orgnr) : Promise.resolve(null),
    navn ? tryBing(navn)              : Promise.resolve(null),
  ]);

  return NextResponse.json({ email: fromDDG ?? fromBing ?? null });
}
