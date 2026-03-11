import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@reachr.no";
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.reachr.no")
  .replace(/^(https?:\/\/)w{4,}\./, "$1www.");

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  const { assignedToName, leadName, message, senderName } = await req.json();
  if (!assignedToName || !leadName) {
    return NextResponse.json({ error: "assignedToName og leadName er påkrevd" }, { status: 400 });
  }

  // Look up team member email by name
  const { data: member } = await supabase
    .from("team_members")
    .select("member_email, member_name")
    .eq("owner_email", user.email)
    .ilike("member_name", assignedToName.trim())
    .maybeSingle();

  // Fallback: maybe the assigned person is the owner themselves
  const toEmail = member?.member_email ?? (
    user.user_metadata?.name?.toLowerCase() === assignedToName.toLowerCase() ? user.email : null
  );

  if (!toEmail) {
    return NextResponse.json({
      error: `Fant ingen teammedlem med navn "${assignedToName}". Sjekk at de er invitert til teamet.`
    }, { status: 404 });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "E-postleverandøren er ikke konfigurert (RESEND_API_KEY mangler)" }, { status: 503 });
  }

  const year = new Date().getFullYear();
  const reminderText = message ?? `Du har en oppfølging som venter på ${leadName}.`;
  const fromName = senderName ?? user.user_metadata?.name ?? user.email;

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="no">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Påminnelse fra Reachr</title>
</head>
<body style="margin:0;padding:0;background-color:#F9FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F9FAFB;">
    <tr>
      <td align="center" style="padding:60px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
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
          <tr>
            <td style="padding:48px 40px;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#2563EB;text-transform:uppercase;letter-spacing:0.08em;">
                Påminnelse
              </p>
              <h2 style="margin:0 0 24px;font-size:24px;font-weight:700;color:#111827;letter-spacing:-0.4px;">
                Du har en oppfølging som venter
              </h2>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F3F4F6;border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 6px;font-size:13px;color:#6B7280;font-weight:500;">Bedrift</p>
                    <p style="margin:0 0 20px;font-size:18px;font-weight:700;color:#111827;">${leadName}</p>
                    <p style="margin:0 0 6px;font-size:13px;color:#6B7280;font-weight:500;">Beskjed fra ${fromName}</p>
                    <p style="margin:0;font-size:16px;color:#374151;line-height:1.6;">${reminderText}</p>
                  </td>
                </tr>
              </table>
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#09fe94;border-radius:8px;">
                    <a href="${APP_URL}/mine-leads" style="padding:14px 32px;color:#064e3b;font-weight:700;font-size:15px;text-decoration:none;display:block;text-align:center;border-radius:8px;">
                      Åpne pipeline &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#F3F4F6;padding:24px 40px;text-align:center;">
              <p style="color:#9CA3AF;font-size:12px;margin:0;">
                &copy; ${year} Reachr &middot; <a href="https://reachr.no" style="color:#9CA3AF;text-decoration:underline;">reachr.no</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `Reachr <${FROM_EMAIL}>`,
      to: [toEmail],
      subject: `Påminnelse: ${leadName} venter på oppfølging`,
      text: `Hei,\n\n${fromName} minner deg om: ${reminderText}\n\nBedrift: ${leadName}\n\nÅpne pipeline: ${APP_URL}/mine-leads\n\n-- Reachr`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ error: "Kunne ikke sende e-post", detail: err }, { status: 500 });
  }

  return NextResponse.json({ success: true, sentTo: toEmail });
}
