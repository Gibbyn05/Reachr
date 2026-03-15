import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@reachr.no";
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.reachr.no").replace(/\/$/, "");

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  // Respect notification setting
  const settings = user.user_metadata?.notification_settings ?? {};
  if (settings.epost_nye_leads === false) {
    return NextResponse.json({ skipped: true, reason: "epost_nye_leads disabled" });
  }

  if (!RESEND_API_KEY || RESEND_API_KEY === "re_din_nøkkel_her") {
    return NextResponse.json({ skipped: true, reason: "RESEND_API_KEY ikke konfigurert" });
  }

  const { leadName, industry, city } = await req.json();
  const year = new Date().getFullYear();
  const name = user.user_metadata?.name ?? user.email?.split("@")[0] ?? "der";

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="no">
<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Nytt lead – Reachr</title></head>
<body style="margin:0;padding:0;background-color:#f2efe3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2efe3;">
    <tr><td align="center" style="padding:60px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#faf8f2;border:1px solid #d8d3c5;border-radius:16px;overflow:hidden;">
        <tr><td style="background-color:#171717;padding:28px 40px;text-align:center;">
          <span style="color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;font-family:Georgia,serif;">Reachr</span>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#09fe94;text-transform:uppercase;letter-spacing:0.1em;">E-postvarsel · Nytt lead</p>
          <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#171717;">Et nytt lead er lagt til</h2>
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ede9da;border-radius:10px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 4px;font-size:11px;color:#6b6660;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Bedrift</p>
              <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#171717;">${leadName}</p>
              ${industry ? `<p style="margin:0 0 4px;font-size:11px;color:#6b6660;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Bransje</p><p style="margin:0 0 16px;font-size:14px;color:#3d3a34;">${industry}</p>` : ""}
              ${city ? `<p style="margin:0 0 4px;font-size:11px;color:#6b6660;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">By</p><p style="margin:0;font-size:14px;color:#3d3a34;">${city}</p>` : ""}
            </td></tr>
          </table>
          <table cellpadding="0" cellspacing="0" border="0">
            <tr><td style="background-color:#09fe94;border-radius:8px;">
              <a href="${APP_URL}/mine-leads" style="padding:12px 28px;color:#171717;font-weight:700;font-size:14px;text-decoration:none;display:block;">Åpne pipeline &rarr;</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background-color:#ede9da;padding:16px 40px;text-align:center;">
          <p style="color:#a09b8f;font-size:11px;margin:0;">&copy; ${year} Reachr &middot; <a href="${APP_URL}/innstillinger" style="color:#a09b8f;text-decoration:underline;">Innstillinger</a></p>
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
      to: [user.email],
      subject: `🆕 Nytt lead: ${leadName} – Reachr`,
      text: `Hei ${name},\n\nEt nytt lead er lagt til: ${leadName}${industry ? `\nBransje: ${industry}` : ""}${city ? `\nBy: ${city}` : ""}\n\nÅpne pipeline: ${APP_URL}/mine-leads\n\n-- Reachr`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ error: "Kunne ikke sende e-post", detail: err }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
