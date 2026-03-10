import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

const EXCLUDE = [
  /noreply/i, /no-reply/i, /donotreply/i,
  /example\./i, /test@/i, /sentry\./i,
  /wixpress/i, /\.(png|jpg|gif|svg)/i,
  /@2x/i, /schema\./i, /w3\.org/i,
];

function extractEmails(html: string): string[] {
  const matches = html.match(EMAIL_REGEX) ?? [];
  return [...new Set(matches)].filter(
    (e) => !EXCLUDE.some((p) => p.test(e))
  );
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; Reachr/1.0; +https://reachr.no)" },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) return NextResponse.json({ email: null });

  let base: URL;
  try {
    base = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return NextResponse.json({ email: null });
  }

  const candidates = [
    base.href,
    new URL("/kontakt", base).href,
    new URL("/contact", base).href,
    new URL("/om-oss", base).href,
    new URL("/about", base).href,
  ];

  for (const url of candidates) {
    try {
      const html = await fetchText(url);
      const emails = extractEmails(html);
      if (emails.length > 0) {
        return NextResponse.json({ email: emails[0] });
      }
    } catch {
      // prøv neste side
    }
  }

  return NextResponse.json({ email: null });
}
