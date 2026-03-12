
import { createClient } from "@supabase/supabase-js";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,*/*",
  "Accept-Language": "nb-NO,nb;q=0.9,no;q=0.8",
};

/** Shared phone formatting */
function formatNO(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("47") && digits.length === 10) return `+47 ${chunk(digits.slice(2))}`;
  if (digits.length === 8) return `+47 ${chunk(digits)}`;
  return null;
}

function chunk(digits: string): string {
  return digits.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");
}

/** Shared email extraction */
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

function pickBestEmail(emails: string[]): string | null {
  if (!emails.length) return null;
  return (
    emails.find((e) =>
      /^(kontakt|contact|info|post|epost|hei|hello|salg|sales)@/.test(e)
    ) ?? emails[0]
  );
}

/** Scrape a URL for emails */
async function scrapeUrlForEmail(url: string): Promise<string | null> {
  try {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    const res = await fetch(fullUrl, {
      headers: HEADERS,
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

/** Background enrichment function */
export async function enrichLead(leadId: string) {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Get lead info
  const { data: lead } = await db.from("leads").select("*").eq("id", leadId).single();
  if (!lead) return;

  let foundEmail = lead.email;
  let foundPhone = lead.phone;

  // 2. Find Email if missing
  if (!foundEmail || foundEmail.includes("mangler") || foundEmail.includes("@") === false) {
    // Try Brreg first
    try {
      const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${lead.org_number}`, { 
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(4000) 
      });
      if (res.ok) {
        const data = await res.json();
        if (data.epostadresse) foundEmail = data.epostadresse;
      }
    } catch (e) {}

    // Try website scraping
    if (!foundEmail && lead.website) {
      foundEmail = await scrapeUrlForEmail(lead.website);
    }
  }

  // 3. Find Phone if missing
  if (!foundPhone || foundPhone.length < 5) {
     try {
       const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${lead.org_number}`, { 
         headers: { Accept: "application/json" },
         signal: AbortSignal.timeout(4000) 
       });
       if (res.ok) {
          const data = await res.json();
          const raw = data.telefon ?? data.mobil ?? null;
          if (raw) foundPhone = formatNO(String(raw));
       }
     } catch (e) {}
  }

  // 4. Update if found anything new
  if (foundEmail !== lead.email || foundPhone !== lead.phone) {
    console.log(`[Enrichment] Found new info for ${lead.name}: Email=${foundEmail}, Phone=${foundPhone}`);
    await db.from("leads").update({
      email: foundEmail || lead.email,
      phone: foundPhone || lead.phone
    }).eq("id", leadId);
  }
}
