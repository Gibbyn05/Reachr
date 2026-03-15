import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@reachr.no";
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.reachr.no")
  .replace(/^(https?:\/\/)w{4,}\./, "$1");

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  if (!RESEND_API_KEY || RESEND_API_KEY === "re_din_nøkkel_her") {
    return NextResponse.json({ error: "RESEND_API_KEY er ikke konfigurert. Legg til en gyldig nøkkel i .env.local." }, { status: 503 });
  }

  const { to } = await req.json().catch(() => ({}));
  const toEmail = (to as string | undefined)?.trim() || user.email;
  const year = new Date().getFullYear();
  const name = user.user_metadata?.name ?? user.email?.split("@")[0] ?? "der";
  const meetingTime = new Date(Date.now() + 60 * 60 * 1000);
  const timeStr = meetingTime.toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" });

  const section = (badge: string, badgeColor: string, content: string) => `
    <tr>
      <td style="padding:32px 40px 0;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:${badgeColor};text-transform:uppercase;letter-spacing:0.1em;">${badge}</p>
        ${content}
      </td>
    </tr>
    <tr>
      <td style="padding:0 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="border-bottom:1px solid #d8d3c5;padding-top:32px;"></td></tr>
        </table>
      </td>
    </tr>`;

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="no">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Test – alle varsler – Reachr</title>
</head>
<body style="margin:0;padding:0;background-color:#f2efe3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2efe3;">
    <tr>
      <td align="center" style="padding:60px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#faf8f2;border:1px solid #d8d3c5;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#171717;padding:28px 40px;text-align:center;">
              <span style="color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;font-family:Georgia,serif;">Reachr</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px 16px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#a09b8f;text-transform:uppercase;letter-spacing:0.1em;">Test-e-post · Alle varseltyper</p>
              <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#171717;letter-spacing:-0.3px;">Hei, ${name}! Her er en forhåndsvisning av alle varsler.</h2>
              <p style="margin:0;font-size:14px;color:#6b6660;">Dette er en test-e-post som viser hvordan alle 5 varseltyper ser ut.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-bottom:1px solid #d8d3c5;padding-top:16px;"></td></tr>
              </table>
            </td>
          </tr>

          ${section(
            "1 · E-postvarsel · Nytt lead",
            "#09fe94",
            `<h3 style="margin:0 0 14px;font-size:18px;font-weight:700;color:#171717;">Et nytt lead er lagt til i pipelinen din</h3>
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ede9da;border-radius:10px;margin-bottom:16px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 4px;font-size:11px;color:#6b6660;font-weight:600;text-transform:uppercase;">Bedrift</p>
                <p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#171717;">Testbedrift AS (demo)</p>
                <p style="margin:0 0 4px;font-size:11px;color:#6b6660;font-weight:600;text-transform:uppercase;">Bransje</p>
                <p style="margin:0 0 12px;font-size:13px;color:#3d3a34;">IT og teknologi</p>
                <p style="margin:0 0 4px;font-size:11px;color:#6b6660;font-weight:600;text-transform:uppercase;">By</p>
                <p style="margin:0;font-size:13px;color:#3d3a34;">Oslo</p>
              </td></tr>
            </table>
            <table cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#09fe94;border-radius:8px;">
              <a href="${APP_URL}/mine-leads" style="padding:10px 22px;color:#171717;font-weight:700;font-size:13px;text-decoration:none;display:block;">Åpne pipeline &rarr;</a>
            </td></tr></table>`
          )}

          ${section(
            "2 · Automatisk påminnelse · Oppfølging",
            "#ff470a",
            `<h3 style="margin:0 0 14px;font-size:18px;font-weight:700;color:#171717;">Du har leads som venter på oppfølging</h3>
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ede9da;border-radius:10px;margin-bottom:16px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#171717;">Testbedrift AS <span style="font-weight:400;color:#a09b8f;font-size:11px;">· 5 dager siden kontakt</span></p>
                <p style="margin:0;font-size:13px;font-weight:700;color:#171717;">Demo Consulting <span style="font-weight:400;color:#a09b8f;font-size:11px;">· 4 dager siden kontakt</span></p>
              </td></tr>
            </table>
            <table cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#09fe94;border-radius:8px;">
              <a href="${APP_URL}/mine-leads" style="padding:10px 22px;color:#171717;font-weight:700;font-size:13px;text-decoration:none;display:block;">Se oppfølgingsliste &rarr;</a>
            </td></tr></table>`
          )}

          ${section(
            "3 · Møtepåminnelse · 1 time igjen",
            "#ffad0a",
            `<h3 style="margin:0 0 14px;font-size:18px;font-weight:700;color:#171717;">Du har et møte om 1 time</h3>
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ede9da;border-radius:10px;margin-bottom:16px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 4px;font-size:11px;color:#6b6660;font-weight:600;text-transform:uppercase;">Bedrift</p>
                <p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#171717;">Testbedrift AS (demo)</p>
                <p style="margin:0 0 4px;font-size:11px;color:#6b6660;font-weight:600;text-transform:uppercase;">Tidspunkt</p>
                <p style="margin:0;font-size:15px;font-weight:700;color:#ffad0a;">${timeStr} i dag</p>
              </td></tr>
            </table>
            <table cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#09fe94;border-radius:8px;">
              <a href="${APP_URL}/mine-leads" style="padding:10px 22px;color:#171717;font-weight:700;font-size:13px;text-decoration:none;display:block;">Åpne pipeline &rarr;</a>
            </td></tr></table>`
          )}

          ${section(
            "4 · Ukentlig rapport · Denne uken",
            "#09fe94",
            `<h3 style="margin:0 0 14px;font-size:18px;font-weight:700;color:#171717;">Din ukentlige salgsrapport</h3>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
              <tr>
                <td width="30%" style="background-color:#171717;border-radius:10px;padding:16px;text-align:center;">
                  <p style="margin:0;font-size:24px;font-weight:800;color:#09fe94;">12</p>
                  <p style="margin:4px 0 0;font-size:9px;font-weight:700;color:#a09b8f;text-transform:uppercase;letter-spacing:0.05em;">Totalt i pipeline</p>
                </td>
                <td width="4%">&nbsp;</td>
                <td width="30%" style="background-color:#ede9da;border-radius:10px;padding:16px;text-align:center;">
                  <p style="margin:0;font-size:24px;font-weight:800;color:#171717;">3</p>
                  <p style="margin:4px 0 0;font-size:9px;font-weight:700;color:#6b6660;text-transform:uppercase;letter-spacing:0.05em;">Lagt til denne uken</p>
                </td>
                <td width="4%">&nbsp;</td>
                <td width="30%" style="background-color:#ede9da;border-radius:10px;padding:16px;text-align:center;">
                  <p style="margin:0;font-size:24px;font-weight:800;color:#171717;">5</p>
                  <p style="margin:4px 0 0;font-size:9px;font-weight:700;color:#6b6660;text-transform:uppercase;letter-spacing:0.05em;">Kontaktet denne uken</p>
                </td>
              </tr>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="background-color:#09fe94;border-radius:8px;text-align:center;">
              <a href="${APP_URL}/dashboard" style="display:block;padding:10px;color:#171717;font-weight:700;font-size:13px;text-decoration:none;">Åpne dashboard &rarr;</a>
            </td></tr></table>`
          )}

          ${section(
            "5 · Teamaktivitet · Oppdatering",
            "#6b6660",
            `<h3 style="margin:0 0 14px;font-size:18px;font-weight:700;color:#171717;">Nylig aktivitet i teamet</h3>
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ede9da;border-radius:10px;margin-bottom:16px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 12px;font-size:13px;color:#3d3a34;">
                  <strong style="color:#171717;">Kari Nordmann</strong> oppdaterte status på <strong style="color:#171717;">Testbedrift AS</strong>
                  <span style="display:inline-block;margin-left:6px;padding:2px 8px;background-color:#09fe94;border-radius:4px;font-size:11px;font-weight:700;color:#171717;">Booket møte</span>
                </p>
                <p style="margin:0;font-size:13px;color:#3d3a34;">
                  <strong style="color:#171717;">Ola Hansen</strong> la til nytt lead: <strong style="color:#171717;">Demo Consulting AS</strong>
                </p>
              </td></tr>
            </table>
            <table cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#09fe94;border-radius:8px;">
              <a href="${APP_URL}/mine-leads" style="padding:10px 22px;color:#171717;font-weight:700;font-size:13px;text-decoration:none;display:block;">Se alle leads &rarr;</a>
            </td></tr></table>`
          )}

          <tr>
            <td style="background-color:#ede9da;padding:20px 40px;text-align:center;margin-top:32px;">
              <p style="color:#a09b8f;font-size:11px;margin:0 0 6px;">&copy; ${year} Reachr</p>
              <p style="margin:0;"><a href="${APP_URL}/innstillinger" style="color:#a09b8f;font-size:11px;text-decoration:underline;">Endre varslingsinnstillinger</a></p>
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
      subject: "🧪 Test-e-post: Alle 5 varseltyper – Reachr",
      html,
      text: `Hei ${name},\n\nDette er en test-e-post som viser alle 5 varseltyper i Reachr:\n\n1. Nytt lead: Testbedrift AS ble lagt til i pipeline\n2. Oppfølgingspåminnelse: 2 leads venter\n3. Møtepåminnelse: Testbedrift AS kl. ${timeStr}\n4. Ukentlig rapport: 12 i pipeline, 3 nye, 5 kontaktet\n5. Teamaktivitet: Oppdateringer fra Kari og Ola\n\nÅpne dashboard: ${APP_URL}/dashboard\n\n-- Reachr`,
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: "Kunne ikke sende test-e-post", detail: json }, { status: 500 });
  }
  return NextResponse.json({ success: true, sentTo: toEmail, results: { combined: { ok: true } } });
}
