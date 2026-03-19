import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@reachr.no";
const NOTIFY_EMAIL = "Fredrik.nerlandsrem@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!RESEND_API_KEY) {
      console.warn("[new-user notify] RESEND_API_KEY ikke konfigurert");
      return NextResponse.json({ error: "E-posttjenesten er ikke konfigurert" }, { status: 503 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Reachr <${FROM_EMAIL}>`,
        to: [NOTIFY_EMAIL],
        subject: `Ny bruker registrert: ${name || email}`,
        text: `En ny bruker har registrert seg på Reachr.\n\nNavn: ${name || "–"}\nE-post: ${email}`,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="no">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Ny bruker registrert</title>
</head>
<body style="margin:0;padding:0;background-color:#f2efe3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2efe3;">
    <tr>
      <td align="center" style="padding:60px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#faf8f2;border:1px solid #d8d3c5;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#171717;padding:32px 40px;text-align:center;">
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
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#09fe94;text-transform:uppercase;letter-spacing:0.08em;">
                Ny registrering
              </p>
              <h2 style="margin:0 0 24px;font-size:24px;font-weight:700;color:#171717;letter-spacing:-0.4px;">
                En ny bruker har registrert seg
              </h2>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ede9da;border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 6px;font-size:13px;color:#6b6660;font-weight:500;">Navn</p>
                    <p style="margin:0 0 20px;font-size:16px;font-weight:700;color:#171717;">${name || "–"}</p>
                    <p style="margin:0 0 6px;font-size:13px;color:#6b6660;font-weight:500;">E-post</p>
                    <p style="margin:0;font-size:16px;color:#171717;"><a href="mailto:${email}" style="color:#ff470a;text-decoration:none;">${email}</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ede9da;padding:24px 40px;text-align:center;">
              <p style="color:#a09b8f;font-size:12px;margin:0;">
                &copy; ${new Date().getFullYear()} Reachr &middot; <a href="https://reachr.no" style="color:#a09b8f;text-decoration:underline;">reachr.no</a>
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
      console.error("[new-user notify] Resend error:", err);
      return NextResponse.json({ error: "Kunne ikke sende varsling" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[new-user notify] Feil:", e);
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
