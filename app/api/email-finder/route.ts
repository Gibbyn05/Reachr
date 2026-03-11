import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface EmailFinderResponse {
  email: string | null;
  source: "website" | "proff" | "none";
  confidence: "high" | "medium" | "low";
}

/** Extract real emails from HTML, exclude spamtraps */
function extractEmailsFromHtml(html: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const found = [...new Set(html.match(emailRegex) ?? [])];
  return found.filter(
    (e) =>
      !e.includes("noreply") &&
      !e.includes("no-reply") &&
      !e.includes("sentry") &&
      !e.includes("example") &&
      !e.includes("wixpress") &&
      !e.endsWith(".png") &&
      !e.endsWith(".jpg") &&
      !e.endsWith(".svg")
  );
}

/** Prefer contact-like emails, fall back to first found */
function pickBestEmail(emails: string[]): string | null {
  if (!emails.length) return null;
  return (
    emails.find((e) =>
      /^(kontakt|contact|info|post|epost|hei|hello|salg|sales)@/.test(e)
    ) ?? emails[0]
  );
}

/** Scrape a URL and return the best email found */
async function scrapeUrl(url: string): Promise<string | null> {
  try {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    const res = await fetch(fullUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
      signal: AbortSignal.timeout(6000),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = await res.text();
    return pickBestEmail(extractEmailsFromHtml(html));
  } catch {
    return null;
  }
}

/** Try to find email from proff.no using org number */
async function scrapeProff(orgNumber: string): Promise<string | null> {
  try {
    const searchUrl = `https://www.proff.no/sok?q=${orgNumber}`;
    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const emails = extractEmailsFromHtml(html);
    // proff.no sometimes shows email in the result page
    return pickBestEmail(emails);
  } catch {
    return null;
  }
}

/** Fetch email directly from Brreg official API */
async function fetchBrregEmail(orgNumber: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://data.brreg.no/enhetsregisteret/api/enheter/${orgNumber}`,
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.epostadresse ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
    }

    const { website, orgNumber } = await request.json();

    // Step 0: Check Brreg official registry first — most reliable source
    if (orgNumber) {
      const brregEmail = await fetchBrregEmail(orgNumber);
      if (brregEmail) {
        return NextResponse.json({
          email: brregEmail,
          source: "proff",
          confidence: "high",
        } as EmailFinderResponse);
      }
    }

    // Step 1: Scrape the company's own website (main page + kontakt)
    if (website) {
      const mainEmail = await scrapeUrl(website);
      if (mainEmail) {
        return NextResponse.json({
          email: mainEmail,
          source: "website",
          confidence: "high",
        } as EmailFinderResponse);
      }

      // Try /kontakt and /contact subpages
      const base = website.replace(/\/$/, "");
      for (const path of ["/kontakt", "/contact", "/om-oss", "/about"]) {
        const subEmail = await scrapeUrl(base + path);
        if (subEmail) {
          return NextResponse.json({
            email: subEmail,
            source: "website",
            confidence: "high",
          } as EmailFinderResponse);
        }
      }
    }

    // Step 2: Try proff.no with org number
    if (orgNumber) {
      const proffEmail = await scrapeProff(orgNumber);
      if (proffEmail) {
        return NextResponse.json({
          email: proffEmail,
          source: "proff",
          confidence: "medium",
        } as EmailFinderResponse);
      }
    }

    // Nothing found — return null, don't guess
    return NextResponse.json({
      email: null,
      source: "none",
      confidence: "low",
    } as EmailFinderResponse);
  } catch (error) {
    console.error("Email finder error:", error);
    return NextResponse.json({ error: "Failed to find email" }, { status: 500 });
  }
}
