import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface EmailFinderResponse {
  email: string | null;
  source: "website" | "pattern" | "api" | "none";
  confidence: "high" | "medium" | "low";
}

/** Common email patterns to try */
const EMAIL_PATTERNS = [
  "info@",
  "kontakt@",
  "contact@",
  "hello@",
  "support@",
  "sales@",
  "post@",
  "epost@",
];

/** Try to extract emails from HTML */
function extractEmailsFromHtml(html: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return [...new Set(html.match(emailRegex) ?? [])];
}

/** Try common patterns for a domain */
function getCommonPatterns(domain: string): string[] {
  return EMAIL_PATTERNS.map((p) => p + domain);
}

/** Check if a domain is reachable and scrape for emails */
async function scrapeSiteForEmails(url: string): Promise<string | null> {
  try {
    // Ensure proper URL format
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;

    const response = await fetch(fullUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Email Finder Bot)" },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return null;

    const html = await response.text();
    const emails = extractEmailsFromHtml(html);

    // Filter to contact-like emails (avoid noreply, no-reply, etc)
    return (
      emails.find(
        (e) =>
          e.includes("kontakt") ||
          e.includes("contact") ||
          e.includes("info") ||
          e.includes("support") ||
          e.includes("sales") ||
          e.includes("hello")
      ) || emails[0] || null
    );
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, website, domain } = await request.json();

    if (!domain && !website) {
      return NextResponse.json(
        { error: "domain or website required" },
        { status: 400 }
      );
    }

    const targetDomain = domain || website?.replace(/^https?:\/\//i, "").split("/")[0] || "";

    if (!targetDomain) {
      return NextResponse.json(
        { email: null, source: "none", confidence: "low" } as EmailFinderResponse
      );
    }

    // Step 1: Try scraping the website
    if (website) {
      const scrapedEmail = await scrapeSiteForEmails(website);
      if (scrapedEmail) {
        return NextResponse.json({
          email: scrapedEmail,
          source: "website",
          confidence: "high",
        } as EmailFinderResponse);
      }
    }

    // Step 2: Try common patterns
    const commonPatterns = getCommonPatterns(targetDomain);
    for (const pattern of commonPatterns) {
      // We can't verify emails without an SMTP check, so just return the first likely pattern
      if (pattern.includes("info@") || pattern.includes("kontakt@")) {
        return NextResponse.json({
          email: pattern,
          source: "pattern",
          confidence: "medium",
        } as EmailFinderResponse);
      }
    }

    // Step 3: Return the first common pattern as fallback
    return NextResponse.json({
      email: commonPatterns[0] || null,
      source: "pattern",
      confidence: "low",
    } as EmailFinderResponse);
  } catch (error) {
    console.error("Email finder error:", error);
    return NextResponse.json(
      { error: "Failed to find email" },
      { status: 500 }
    );
  }
}
