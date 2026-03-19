import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@reachr.no";

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!RESEND_API_KEY) {
      console.warn("[welcome notify] RESEND_API_KEY ikke konfigurert");
      return NextResponse.json({ error: "E-posttjenesten er ikke konfigurert" }, { status: 503 });
    }

    const firstName = name?.split(" ")[0] || "der";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Reachr <${FROM_EMAIL}>`,
        to: [email],
        subject: "Velkommen til Reachr 🎉",
        text: `Hei ${firstName}!\n\nVelkommen til Reachr. Vi er glade for å ha deg med!\n\nKom i gang på https://www.reachr.no/dashboard\n\nHilsen,\nTeamet i Reachr`,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="no">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Velkommen til Reachr</title>
</head>
<body style="margin:0;padding:0;background-color:#f2efe3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2efe3;">
    <tr>
      <td align="center" style="padding:60px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#faf8f2;border:1px solid #d8d3c5;border-radius:16px;overflow:hidden;">
          <!-- Header -->
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
          <!-- Body -->
          <tr>
            <td style="padding:48px 40px;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#09fe94;text-transform:uppercase;letter-spacing:0.08em;">
                Velkommen
              </p>
              <h2 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#171717;letter-spacing:-0.5px;">
                Hei ${firstName}! 👋
              </h2>
              <p style="margin:0 0 24px;font-size:16px;color:#6b6660;line-height:1.6;">
                Vi er veldig glade for å ha deg med på Reachr. Du er nå klar til å finne nye kunder, bygge din pipeline og lukke flere deals — raskere enn noen gang.
              </p>

              <!-- Feature highlights -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ede9da;border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#171717;">Kom i gang på 3 minutter:</p>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding:8px 0;vertical-align:top;width:28px;">
                          <span style="display:inline-block;width:20px;height:20px;background-color:#09fe94;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#171717;">1</span>
                        </td>
                        <td style="padding:8px 0;font-size:14px;color:#3d3a34;line-height:1.5;">
                          Søk etter bedrifter fra Brønnøysundregistrene i <strong>Leadsøk</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;vertical-align:top;width:28px;">
                          <span style="display:inline-block;width:20px;height:20px;background-color:#09fe94;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#171717;">2</span>
                        </td>
                        <td style="padding:8px 0;font-size:14px;color:#3d3a34;line-height:1.5;">
                          Legg dem til i <strong>Mine leads</strong> og hold oversikten i CRM-pipelinen
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;vertical-align:top;width:28px;">
                          <span style="display:inline-block;width:20px;height:20px;background-color:#09fe94;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#171717;">3</span>
                        </td>
                        <td style="padding:8px 0;font-size:14px;color:#3d3a34;line-height:1.5;">
                          Bruk AI til å generere personlige e-poster og SMS til hvert lead
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="border-radius:12px;background-color:#09fe94;">
                    <a href="https://www.reachr.no/dashboard" target="_blank" style="display:inline-block;padding:16px 40px;font-size:15px;font-weight:700;color:#171717;text-decoration:none;border-radius:12px;">
                      Gå til dashbord →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;color:#6b6660;line-height:1.6;">
                Har du spørsmål? Svar på denne e-posten, så hjelper vi deg gjerne. Vi ønsker deg lykke til med salgsarbeidet!
              </p>
              <p style="margin:16px 0 0;font-size:14px;color:#6b6660;">
                Hilsen,<br/>
                <strong style="color:#171717;">Fredrik og teamet i Reachr</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
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
      console.error("[welcome notify] Resend error:", err);
      return NextResponse.json({ error: "Kunne ikke sende velkomst-e-post" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[welcome notify] Feil:", e);
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
