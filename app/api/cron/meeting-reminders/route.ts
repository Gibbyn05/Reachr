import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@reachr.no";
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.reachr.no").replace(/\/$/, "");

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RESEND_API_KEY || RESEND_API_KEY === "re_din_nøkkel_her") {
    return NextResponse.json({ error: "RESEND_API_KEY ikke konfigurert" }, { status: 503 });
  }

  const supabase = createServiceClient();
  const year = new Date().getFullYear();

  // Find leads with meeting_date within the next 60-90 minutes (cron runs every 30 min)
  const now = new Date();
  const in60min = new Date(now.getTime() + 60 * 60 * 1000);
  const in90min = new Date(now.getTime() + 90 * 60 * 1000);

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, name, meeting_date, user_email")
    .eq("status", "Booket møte")
    .gte("meeting_date", in60min.toISOString())
    .lte("meeting_date", in90min.toISOString());

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!leads || leads.length === 0) return NextResponse.json({ sent: 0 });

  // Get all users to check notification settings
  const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const userMap = new Map(users.map(u => [u.email!, u]));

  const sent: string[] = [];

  for (const lead of leads) {
    const owner = userMap.get(lead.user_email);
    if (!owner) continue;

    const settings = owner.user_metadata?.notification_settings ?? {};
    if (settings.motepaminnelser === false) continue;

    const meetingDate = new Date(lead.meeting_date);
    const timeStr = meetingDate.toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" });
    const ownerName = owner.user_metadata?.name ?? owner.email?.split("@")[0] ?? "der";

    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN">
<html lang="no"><head><meta charset="UTF-8"/><title>Møtepåminnelse – Reachr</title></head>
<body style="margin:0;padding:0;background-color:#f2efe3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2efe3;">
    <tr><td align="center" style="padding:60px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#faf8f2;border:1px solid #d8d3c5;border-radius:16px;overflow:hidden;">
        <tr><td style="background-color:#171717;padding:28px 40px;text-align:center;">
          <span style="color:#fff;font-size:24px;font-weight:800;font-family:Georgia,serif;">Reachr</span>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#ffad0a;text-transform:uppercase;letter-spacing:0.1em;">Møtepåminnelse · 1 time igjen</p>
          <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#171717;">Du har et møte om 1 time</h2>
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ede9da;border-radius:10px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 4px;font-size:11px;color:#6b6660;font-weight:700;text-transform:uppercase;">Bedrift</p>
              <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#171717;">${lead.name}</p>
              <p style="margin:0 0 4px;font-size:11px;color:#6b6660;font-weight:700;text-transform:uppercase;">Tidspunkt</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#ffad0a;">${timeStr} i dag</p>
            </td></tr>
          </table>
          <table cellpadding="0" cellspacing="0" border="0">
            <tr><td style="background-color:#09fe94;border-radius:8px;">
              <a href="${APP_URL}/mine-leads" style="padding:12px 28px;color:#171717;font-weight:700;font-size:14px;text-decoration:none;display:block;">Åpne pipeline &rarr;</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background-color:#ede9da;padding:16px 40px;text-align:center;">
          <p style="color:#a09b8f;font-size:11px;margin:0;">&copy; ${year} Reachr</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `Reachr <${FROM_EMAIL}>`,
        to: [owner.email!],
        subject: `📅 Møtepåminnelse: ${lead.name} kl. ${timeStr} – Reachr`,
        text: `Hei ${ownerName},\n\nPåminnelse: Du har et møte med ${lead.name} kl. ${timeStr} i dag.\n\nÅpne pipeline: ${APP_URL}/mine-leads\n\n-- Reachr`,
        html,
      }),
    });

    if (res.ok) sent.push(owner.email!);
  }

  return NextResponse.json({ sent: sent.length, recipients: sent });
}
