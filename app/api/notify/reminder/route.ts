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
<body style="margin:0;padding:0;background-color:#F2EFE3;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F2EFE3;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#FAF8F2;border:1px solid #D8D3C5;">
          <tr>
            <td style="background-color:#171717;padding:24px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td width="30" height="30" style="background-color:#09fe94;text-align:center;vertical-align:middle;">
                    <span style="color:#171717;font-size:17px;font-weight:900;line-height:30px;">R</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.5px;">Reachr</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#ff470a;text-transform:uppercase;letter-spacing:0.08em;font-family:Arial,Helvetica,sans-serif;">
                Påminnelse
              </p>
              <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#171717;font-family:Arial,Helvetica,sans-serif;">
                Du har en oppfølging som venter
              </h2>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F2EFE3;border:1px solid #D8D3C5;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:13px;color:#A09B8F;font-family:Arial,Helvetica,sans-serif;">Bedrift</p>
                    <p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#171717;font-family:Arial,Helvetica,sans-serif;">${leadName}</p>
                    <p style="margin:0 0 4px;font-size:13px;color:#A09B8F;font-family:Arial,Helvetica,sans-serif;">Beskjed fra ${fromName}</p>
                    <p style="margin:0;font-size:15px;color:#3d3a34;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">${reminderText}</p>
                  </td>
                </tr>
              </table>
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#09fe94;padding:13px 28px;">
                    <a href="${APP_URL}/mine-leads" style="color:#171717;font-weight:700;font-size:15px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;display:inline-block;">
                      Åpne pipeline &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#EDE9DA;padding:14px 40px;border-top:1px solid #D8D3C5;text-align:center;">
              <p style="color:#A09B8F;font-size:11px;margin:0;font-family:Arial,Helvetica,sans-serif;">
                &copy; ${year} Reachr &middot; reachr.no
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
