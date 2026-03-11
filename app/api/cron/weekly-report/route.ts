import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@reachr.no";
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.reachr.no")
  .replace(/^(https?:\/\/)w{4,}\./, "$1www.");

interface LeadRow {
  added_by: string;
  assigned_to: string;
  status: string;
  added_date: string;
  last_contacted: string | null;
}

function weeklyStats(leads: LeadRow[]) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const addedThisWeek = leads.filter(l => new Date(l.added_date) >= weekAgo);
  const contactedThisWeek = leads.filter(l => l.last_contacted && new Date(l.last_contacted) >= weekAgo);

  // Per person: leads added
  const addedPerPerson: Record<string, number> = {};
  for (const l of addedThisWeek) {
    addedPerPerson[l.added_by] = (addedPerPerson[l.added_by] ?? 0) + 1;
  }

  // Per person: leads contacted
  const contactedPerPerson: Record<string, number> = {};
  for (const l of contactedThisWeek) {
    contactedPerPerson[l.assigned_to] = (contactedPerPerson[l.assigned_to] ?? 0) + 1;
  }

  // Pipeline status counts
  const statusCounts: Record<string, number> = {};
  for (const l of leads) {
    statusCounts[l.status] = (statusCounts[l.status] ?? 0) + 1;
  }

  return { addedPerPerson, contactedPerPerson, statusCounts, total: leads.length, addedCount: addedThisWeek.length, contactedCount: contactedThisWeek.length };
}

function buildHtml(ownerName: string, stats: ReturnType<typeof weeklyStats>, year: number): string {
  const { addedPerPerson, contactedPerPerson, statusCounts, total, addedCount, contactedCount } = stats;

  const topAdder = Object.entries(addedPerPerson).sort((a, b) => b[1] - a[1])[0];
  const topContacter = Object.entries(contactedPerPerson).sort((a, b) => b[1] - a[1])[0];

  const personRows = (data: Record<string, number>) =>
    Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) =>
        `<tr><td style="padding:6px 0;font-size:14px;color:#3d3a34;font-family:Arial,Helvetica,sans-serif;">${name}</td><td style="padding:6px 0;font-size:14px;font-weight:700;color:#171717;text-align:right;font-family:Arial,Helvetica,sans-serif;">${count}</td></tr>`
      ).join("") || `<tr><td colspan="2" style="padding:6px 0;font-size:13px;color:#A09B8F;font-family:Arial,Helvetica,sans-serif;">Ingen aktivitet denne uken</td></tr>`;

  const statusOrder = ["Ikke kontaktet", "Kontaktet", "Kontaktet - ikke svar", "Booket møte", "Avslått", "Kunde"];
  const statusColors: Record<string, string> = {
    "Ikke kontaktet": "#A09B8F", "Kontaktet": "#09fe94", "Kontaktet - ikke svar": "#ffad0a",
    "Booket møte": "#09fe94", "Avslått": "#ff470a", "Kunde": "#05c472",
  };

  const statusRows = statusOrder
    .filter(s => statusCounts[s])
    .map(s => `<tr>
      <td style="padding:5px 0;font-size:13px;color:#6b6660;font-family:Arial,Helvetica,sans-serif;">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:${statusColors[s] ?? "#A09B8F"};margin-right:8px;"></span>${s}
      </td>
      <td style="padding:5px 0;font-size:13px;font-weight:700;color:#171717;text-align:right;font-family:Arial,Helvetica,sans-serif;">${statusCounts[s]}</td>
    </tr>`).join("");

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="no">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ukentlig rapport – Reachr</title>
</head>
<body style="margin:0;padding:0;background-color:#F9FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F9FAFB;">
    <tr>
      <td align="center" style="padding:60px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
          <!-- Header -->
          <tr>
            <td style="background-color:#111827;padding:32px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;padding-right:12px;">
                    <img src="${APP_URL}/logo.svg" alt="Reachr" width="36" height="36" style="display:block;border:0;outline:none;text-decoration:none;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Reachr</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Title -->
          <tr>
            <td style="padding:48px 40px 0;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#2563EB;text-transform:uppercase;letter-spacing:0.08em;">Ukentlig rapport</p>
              <h2 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#111827;letter-spacing:-0.5px;">Hei, ${ownerName}!</h2>
              <p style="margin:0;font-size:16px;color:#4B5563;">Her er en oppsummering av teamets aktivitet fra de siste 7 dagene.</p>
            </td>
          </tr>
          <!-- KPI row -->
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="30%" style="background-color:#111827;border-radius:12px;padding:24px;text-align:center;">
                    <p style="margin:0;font-size:32px;font-weight:800;color:#09fe94;">${total}</p>
                    <p style="margin:8px 0 0;font-size:12px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.05em;">Totalt i pipeline</p>
                  </td>
                  <td width="4%" style="font-size:1px;">&nbsp;</td>
                  <td width="30%" style="background-color:#F3F4F6;border-radius:12px;padding:24px;text-align:center;">
                    <p style="margin:0;font-size:32px;font-weight:800;color:#111827;">${addedCount}</p>
                    <p style="margin:8px 0 0;font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em;">Lagt til denne uken</p>
                  </td>
                  <td width="4%" style="font-size:1px;">&nbsp;</td>
                  <td width="30%" style="background-color:#F3F4F6;border-radius:12px;padding:24px;text-align:center;">
                    <p style="margin:0;font-size:32px;font-weight:800;color:#111827;">${contactedCount}</p>
                    <p style="margin:8px 0 0;font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em;">Kontaktet denne uken</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Top performers -->
          ${topAdder ? `<tr><td style="padding:0 40px 16px;">
            <div style="background-color:#EFF6FF;border-radius:8px;padding:16px;text-align:center;">
              <p style="margin:0;font-size:14px;color:#1E3A8A;">
                🏆 <strong style="color:#1E40AF;">${topAdder[0]}</strong> la inn flest leads (${topAdder[1]})
                ${topContacter ? ` &nbsp;·&nbsp; <strong style="color:#1E40AF;">${topContacter[0]}</strong> kontaktet flest (${topContacter[1]})` : ""}
              </p>
            </div>
          </td></tr>` : ""}
          <!-- Leads lagt til -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="padding:16px 24px;border-bottom:1px solid #E5E7EB;background-color:#F3F4F6;">
                    <p style="margin:0;font-size:13px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Leads lagt til denne uken</p>
                  </td>
                </tr>
                <tr><td colspan="2" style="padding:8px 24px 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${personRows(addedPerPerson)}
                  </table>
                </td></tr>
              </table>
            </td>
          </tr>
          <!-- Kontaktet -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="padding:16px 24px;border-bottom:1px solid #E5E7EB;background-color:#F3F4F6;">
                    <p style="margin:0;font-size:13px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Kontaktet denne uken</p>
                  </td>
                </tr>
                <tr><td colspan="2" style="padding:8px 24px 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${personRows(contactedPerPerson)}
                  </table>
                </td></tr>
              </table>
            </td>
          </tr>
          <!-- Pipeline status -->
          <tr>
            <td style="padding:0 40px 48px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="padding:16px 24px;border-bottom:1px solid #E5E7EB;background-color:#F3F4F6;">
                    <p style="margin:0;font-size:13px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Pipeline fordeling</p>
                  </td>
                </tr>
                <tr><td colspan="2" style="padding:8px 24px 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">${statusRows}</table>
                </td></tr>
              </table>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 48px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="background-color:#09fe94;border-radius:8px;text-align:center;">
                    <a href="${APP_URL}/dashboard" style="display:block;padding:16px;color:#064e3b;font-weight:700;font-size:16px;text-decoration:none;">
                      Åpne dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#F3F4F6;padding:24px 40px;text-align:center;">
              <p style="color:#9CA3AF;font-size:12px;margin:0 0 8px;">
                &copy; ${year} Reachr &middot; <a href="https://reachr.no" style="color:#9CA3AF;text-decoration:underline;">reachr.no</a>
              </p>
              <p style="color:#9CA3AF;font-size:12px;margin:0;">
                <a href="${APP_URL}/innstillinger" style="color:#9CA3AF;text-decoration:underline;">Endre varslingsinnstillinger</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function GET(req: NextRequest) {
  // Verify cron secret
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY ikke konfigurert" }, { status: 503 });
  }

  const supabase = createServiceClient();
  const year = new Date().getFullYear();
  const force = req.nextUrl.searchParams.get("force");

  // Get all users (requires service role)
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (usersError) return NextResponse.json({ error: usersError.message }, { status: 500 });

  const reports: { email: string; ok: boolean }[] = [];

  for (const user of users) {
    const settings = user.user_metadata?.notification_settings ?? {};
    if (!force && !settings.ukentlig_sammendrag) continue;

    // Fetch leads for this user's team
    const { data: leads } = await supabase
      .from("leads")
      .select("added_by, assigned_to, status, added_date, last_contacted")
      .eq("owner_email", user.email);

    if (!leads || leads.length === 0) continue;

    const stats = weeklyStats(leads as LeadRow[]);
    const ownerName = user.user_metadata?.name ?? user.email?.split("@")[0] ?? "der";
    const html = buildHtml(ownerName, stats, year);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `Reachr <${FROM_EMAIL}>`,
        to: [user.email],
        subject: `📊 Din ukentlige salgsrapport – Reachr`,
        text: `Hei ${ownerName},\n\nHer er ukesrapporten din fra Reachr.\n\nTotalt i pipeline: ${stats.total}\nLagt til denne uka: ${stats.addedCount}\nKontaktet denne uka: ${stats.contactedCount}\n\nÅpne dashboard: ${APP_URL}/dashboard\n\n-- Reachr`,
        html,
      }),
    });

    reports.push({ email: user.email!, ok: res.ok });
  }

  return NextResponse.json({ sent: reports.length, reports });
}
