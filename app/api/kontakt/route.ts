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
                    <img src="https://www.reachr.no/logo.svg" alt="Reachr" width="36" height="36" style="display:block;border:0;outline:none;text-decoration:none;" />
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
                Support / Kontakt
              </p>
              <h2 style="margin:0 0 24px;font-size:24px;font-weight:700;color:#111827;letter-spacing:-0.4px;">
                Ny melding fra kontaktskjema
              </h2>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F3F4F6;border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 6px;font-size:13px;color:#6B7280;font-weight:500;">Avsender</p>
                    <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#111827;">${name}</p>
                    <p style="margin:0 0 20px;font-size:14px;"><a href="mailto:${email}" style="color:#2563EB;text-decoration:none;">${email}</a></p>
                    
                    <p style="margin:0 0 6px;font-size:13px;color:#6B7280;font-weight:500;">Melding</p>
                    <div style="margin:0;font-size:16px;color:#374151;line-height:1.6;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                  </td>
                </tr>
              </table>
              <p style="font-size:14px;color:#6B7280;margin:0;">Svar direkte på denne e-posten for å besvare ${name}.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#F3F4F6;padding:24px 40px;text-align:center;">
              <p style="color:#9CA3AF;font-size:12px;margin:0;">
                &copy; ${new Date().getFullYear()} Reachr &middot; <a href="https://reachr.no" style="color:#9CA3AF;text-decoration:underline;">reachr.no</a>
              </p>
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
