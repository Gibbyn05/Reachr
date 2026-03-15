import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/admin";

function calendarSecret(): string {
  return process.env.CALENDAR_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "reachr-calendar";
}

function validateToken(token: string): string | null {
  try {
    const [encoded, sig] = token.split(".");
    if (!encoded || !sig) return null;
    const email = Buffer.from(encoded, "base64url").toString("utf-8");
    const expected = createHmac("sha256", calendarSecret()).update(email).digest("hex");
    if (sig !== expected) return null;
    return email;
  } catch {
    return null;
  }
}

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function formatIcalDate(dt: Date): string {
  // YYYYMMDDTHHMMSSZ
  return dt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcal(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

// Fold long lines per RFC 5545 (max 75 octets)
function foldLine(line: string): string {
  const bytes = Buffer.from(line, "utf-8");
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let offset = 0;
  let first = true;
  while (offset < bytes.length) {
    const chunk = first ? 75 : 74;
    parts.push((first ? "" : " ") + bytes.slice(offset, offset + chunk).toString("utf-8"));
    offset += chunk;
    first = false;
  }
  return parts.join("\r\n");
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return new NextResponse("Missing token", { status: 400 });

  const email = validateToken(token);
  if (!email) return new NextResponse("Invalid token", { status: 401 });

  const db = getServiceClient();

  // Resolve team leads (same logic as /api/leads)
  const { data: members } = await db
    .from("team_members")
    .select("member_email")
    .eq("owner_email", email);

  const teamEmails = Array.from(new Set([
    email,
    ...(members ?? []).map((m: { member_email: string }) => m.member_email),
  ]));

  let query = db
    .from("leads")
    .select("id, name, contact_person, phone, email, industry, city, status, meeting_date")
    .not("meeting_date", "is", null);

  if (!isAdmin(email)) {
    query = query.in("user_email", teamEmails);
  }

  const { data: leads } = await query;

  // Build iCal
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Reachr//Kalender//NO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Reachr Møter",
    "X-WR-TIMEZONE:Europe/Oslo",
    "X-WR-CALDESC:Møter synkronisert fra Reachr CRM",
  ];

  const now = formatIcalDate(new Date());

  for (const lead of leads ?? []) {
    if (!lead.meeting_date) continue;
    const start = new Date(lead.meeting_date);
    if (isNaN(start.getTime())) continue;
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour

    const summary = `Møte med ${lead.name}`;
    const descParts: string[] = [];
    if (lead.contact_person) descParts.push(`Kontakt: ${lead.contact_person}`);
    if (lead.phone) descParts.push(`Tlf: ${lead.phone}`);
    if (lead.email) descParts.push(`E-post: ${lead.email}`);
    if (lead.industry) descParts.push(`Bransje: ${lead.industry}`);
    if (lead.city) descParts.push(`By: ${lead.city}`);
    if (lead.status) descParts.push(`Status: ${lead.status}`);

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${lead.id}@reachr.no`);
    lines.push(`DTSTAMP:${now}`);
    lines.push(`DTSTART:${formatIcalDate(start)}`);
    lines.push(`DTEND:${formatIcalDate(end)}`);
    lines.push(foldLine(`SUMMARY:${escapeIcal(summary)}`));
    if (descParts.length > 0) {
      lines.push(foldLine(`DESCRIPTION:${escapeIcal(descParts.join("\\n"))}`));
    }
    lines.push(`STATUS:CONFIRMED`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  const ical = lines.join("\r\n") + "\r\n";

  return new NextResponse(ical, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="reachr-moter.ics"',
      "Cache-Control": "no-cache, no-store",
    },
  });
}
