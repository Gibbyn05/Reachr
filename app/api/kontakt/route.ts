import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@reachr.no";
const TO_EMAIL = "Help@reachr.no";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Alle felt er påkrevd" }, { status: 400 });
    }

    if (!RESEND_API_KEY) {
      console.warn("[kontakt] RESEND_API_KEY ikke konfigurert");
      return NextResponse.json({ error: "E-posttjenesten er ikke konfigurert" }, { status: 503 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Reachr Kontaktskjema <${FROM_EMAIL}>`,
        reply_to: email,
        to: [TO_EMAIL],
        subject: `Ny melding fra ${name} via reachr.no`,
        text: `Navn: ${name}\nE-post: ${email}\n\nMelding:\n${message}`,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="no">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Ny kontaktmelding</title>
</head>
<body style="margin:0;padding:0;background-color:#F2EFE3;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F2EFE3;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#FAF8F2;border:1px solid #D8D3C5;">
          <tr>
            <td style="background-color:#171717;padding:24px 40px;">
              <span style="color:#ffffff;font-size:20px;font-weight:800;">Reachr</span>
              <span style="color:#09fe94;font-size:20px;font-weight:800;">.</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <h2 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#171717;font-family:Arial,Helvetica,sans-serif;">Ny melding fra kontaktskjema</h2>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:10px 14px;background-color:#EDE9DA;border-radius:0;font-size:12px;font-weight:700;color:#A09B8F;font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:0.05em;width:80px;">Navn</td>
                  <td style="padding:10px 14px;background-color:#EDE9DA;font-size:14px;color:#171717;font-family:Arial,Helvetica,sans-serif;font-weight:600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:12px;font-weight:700;color:#A09B8F;font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:0.05em;">E-post</td>
                  <td style="padding:10px 14px;font-size:14px;color:#ff470a;font-family:Arial,Helvetica,sans-serif;"><a href="mailto:${email}" style="color:#ff470a;text-decoration:none;">${email}</a></td>
                </tr>
              </table>
              <p style="font-size:12px;font-weight:700;color:#A09B8F;font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 10px;">Melding</p>
              <div style="background-color:#EDE9DA;padding:16px;font-size:14px;color:#3d3a34;font-family:Arial,Helvetica,sans-serif;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
              <p style="font-size:12px;color:#A09B8F;margin:20px 0 0;font-family:Arial,Helvetica,sans-serif;">Svar direkte på denne e-posten for å svare ${name}.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#EDE9DA;padding:14px 40px;border-top:1px solid #D8D3C5;text-align:center;">
              <p style="color:#A09B8F;font-size:11px;margin:0;font-family:Arial,Helvetica,sans-serif;">&copy; 2026 Reachr &middot; reachr.no</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[kontakt] Resend error:", err);
      return NextResponse.json({ error: "Kunne ikke sende melding" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
