import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@reachr.no";
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.reachr.no")
  .replace(/^(https?:\/\/)w{4,}\./, "$1");

async function sendResend(to: string, subject: string, html: string, text: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: `Reachr <${FROM_EMAIL}>`, to: [to], subject, html, text }),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body: json };
}

function baseHtml(title: string, badge: string, badgeColor: string, content: string, year: number) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="no">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} – Reachr</title>
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
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:${badgeColor};text-transform:uppercase;letter-spacing:0.1em;">${badge}</p>
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color:#ede9da;padding:20px 40px;text-align:center;">
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
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });

  if (!RESEND_API_KEY || RESEND_API_KEY === "re_din_nøkkel_her") {
    return NextResponse.json({ error: "RESEND_API_KEY er ikke konfigurert. Legg til en gyldig nøkkel i .env.local." }, { status: 503 });
  }

  const { to, type } = await req.json().catch(() => ({}));
  const toEmail = (to as string | undefined)?.trim() || user.email;
  const year = new Date().getFullYear();
  const name = user.user_metadata?.name ?? user.email?.split("@")[0] ?? "der";

  const results: Record<string, { ok: boolean; detail?: string }> = {};
  const types = (type ? [type] : ["epost_nye_leads", "oppfolgingspaminnelser", "motepaminnelser", "ukentlig_sammendrag", "teamaktivitet"]) as string[];

  for (const t of types) {
    if (t === "epost_nye_leads") {
      const html = baseHtml(
        "Nytt lead lagt til",
        "E-postvarsel · Nytt lead",
        "#09fe94",
        `<h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#171717;letter-spacing:-0.3px;">Et nytt lead er lagt til i pipelinen din</h2>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ede9da;border-radius:10px;margin-bottom:24px;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 4px;font-size:12px;color:#6b6660;font-weight:600;">BEDRIFT</p>
            <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#171717;">Testbedrift AS (demo)</p>
            <p style="margin:0 0 4px;font-size:12px;color:#6b6660;font-weight:600;">BRANSJE</p>
            <p style="margin:0 0 16px;font-size:14px;color:#3d3a34;">IT og teknologi</p>
            <p style="margin:0 0 4px;font-size:12px;color:#6b6660;font-weight:600;">BY</p>
            <p style="margin:0;font-size:14px;color:#3d3a34;">Oslo</p>
          </td></tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background-color:#09fe94;border-radius:8px;">
            <a href="${APP_URL}/mine-leads" style="padding:12px 28px;color:#171717;font-weight:700;font-size:14px;text-decoration:none;display:block;">Åpne pipeline &rarr;</a>
          </td></tr>
        </table>`,
        year
      );
      const r = await sendResend(toEmail, "🆕 Nytt lead: Testbedrift AS – Reachr", html,
        `Hei ${name},\n\nEt nytt lead er lagt til: Testbedrift AS\nBransje: IT og teknologi · By: Oslo\n\nÅpne pipeline: ${APP_URL}/mine-leads\n\n-- Reachr`);
      results.epost_nye_leads = { ok: r.ok, detail: r.ok ? undefined : JSON.stringify(r.body) };
    }

    if (t === "oppfolgingspaminnelser") {
      const html = baseHtml(
        "Oppfølgingspåminnelse",
        "Automatisk påminnelse · Oppfølging",
        "#ff470a",
        `<h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#171717;letter-spacing:-0.3px;">Du har leads som venter på oppfølging</h2>
        <p style="margin:0 0 20px;font-size:15px;color:#6b6660;line-height:1.6;">Det er over 3 dager siden du sist kontaktet følgende leads:</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ede9da;border-radius:10px;margin-bottom:24px;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#171717;">Testbedrift AS <span style="font-weight:400;color:#a09b8f;font-size:12px;">· 5 dager siden kontakt</span></p>
            <p style="margin:0;font-size:14px;font-weight:700;color:#171717;">Demo Consulting <span style="font-weight:400;color:#a09b8f;font-size:12px;">· 4 dager siden kontakt</span></p>
          </td></tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background-color:#09fe94;border-radius:8px;">
            <a href="${APP_URL}/mine-leads" style="padding:12px 28px;color:#171717;font-weight:700;font-size:14px;text-decoration:none;display:block;">Se oppfølgingsliste &rarr;</a>
          </td></tr>
        </table>`,
        year
      );
      const r = await sendResend(toEmail, "⏰ 2 leads venter på oppfølging – Reachr", html,
        `Hei ${name},\n\nDu har leads som venter på oppfølging:\n- Testbedrift AS (5 dager siden kontakt)\n- Demo Consulting (4 dager siden kontakt)\n\nÅpne pipeline: ${APP_URL}/mine-leads\n\n-- Reachr`);
      results.oppfolgingspaminnelser = { ok: r.ok, detail: r.ok ? undefined : JSON.stringify(r.body) };
    }

    if (t === "motepaminnelser") {
      const meetingTime = new Date(Date.now() + 60 * 60 * 1000);
      const timeStr = meetingTime.toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" });
      const html = baseHtml(
        "Møtepåminnelse",
        "Møtepåminnelse · 1 time igjen",
        "#ffad0a",
        `<h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#171717;letter-spacing:-0.3px;">Du har et møte om 1 time</h2>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ede9da;border-radius:10px;margin-bottom:24px;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 4px;font-size:12px;color:#6b6660;font-weight:600;">BEDRIFT</p>
            <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#171717;">Testbedrift AS (demo)</p>
            <p style="margin:0 0 4px;font-size:12px;color:#6b6660;font-weight:600;">TIDSPUNKT</p>
            <p style="margin:0;font-size:16px;font-weight:700;color:#ffad0a;">${timeStr} i dag</p>
          </td></tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background-color:#09fe94;border-radius:8px;">
            <a href="${APP_URL}/mine-leads" style="padding:12px 28px;color:#171717;font-weight:700;font-size:14px;text-decoration:none;display:block;">Åpne pipeline &rarr;</a>
          </td></tr>
        </table>`,
        year
      );
      const r = await sendResend(toEmail, `📅 Møtepåminnelse: Testbedrift AS kl. ${timeStr} – Reachr`, html,
        `Hei ${name},\n\nPåminnelse: Du har et møte med Testbedrift AS kl. ${timeStr} i dag.\n\nÅpne pipeline: ${APP_URL}/mine-leads\n\n-- Reachr`);
      results.motepaminnelser = { ok: r.ok, detail: r.ok ? undefined : JSON.stringify(r.body) };
    }

    if (t === "ukentlig_sammendrag") {
      const html = baseHtml(
        "Ukentlig rapport",
        "Ukentlig rapport · Denne uken",
        "#09fe94",
        `<h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#171717;letter-spacing:-0.3px;">Hei, ${name}!</h2>
        <p style="margin:0 0 24px;font-size:15px;color:#6b6660;">Her er en oppsummering av teamets aktivitet de siste 7 dagene.</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
          <tr>
            <td width="30%" style="background-color:#171717;border-radius:10px;padding:20px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:800;color:#09fe94;">12</p>
              <p style="margin:6px 0 0;font-size:10px;font-weight:700;color:#a09b8f;text-transform:uppercase;letter-spacing:0.05em;">Totalt i pipeline</p>
            </td>
            <td width="4%">&nbsp;</td>
            <td width="30%" style="background-color:#ede9da;border-radius:10px;padding:20px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:800;color:#171717;">3</p>
              <p style="margin:6px 0 0;font-size:10px;font-weight:700;color:#6b6660;text-transform:uppercase;letter-spacing:0.05em;">Lagt til denne uken</p>
            </td>
            <td width="4%">&nbsp;</td>
            <td width="30%" style="background-color:#ede9da;border-radius:10px;padding:20px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:800;color:#171717;">5</p>
              <p style="margin:6px 0 0;font-size:10px;font-weight:700;color:#6b6660;text-transform:uppercase;letter-spacing:0.05em;">Kontaktet denne uken</p>
            </td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr><td style="background-color:#09fe94;border-radius:8px;text-align:center;">
            <a href="${APP_URL}/dashboard" style="display:block;padding:14px;color:#171717;font-weight:700;font-size:14px;text-decoration:none;">Åpne dashboard &rarr;</a>
          </td></tr>
        </table>`,
        year
      );
      const r = await sendResend(toEmail, "📊 Din ukentlige salgsrapport – Reachr", html,
        `Hei ${name},\n\nUkerapport fra Reachr:\n- Totalt i pipeline: 12\n- Lagt til denne uken: 3\n- Kontaktet denne uken: 5\n\nÅpne dashboard: ${APP_URL}/dashboard\n\n-- Reachr`);
      results.ukentlig_sammendrag = { ok: r.ok, detail: r.ok ? undefined : JSON.stringify(r.body) };
    }

    if (t === "teamaktivitet") {
      const html = baseHtml(
        "Teamaktivitet",
        "Teamaktivitet · Oppdatering",
        "#6b6660",
        `<h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#171717;letter-spacing:-0.3px;">Nylig aktivitet i teamet</h2>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ede9da;border-radius:10px;margin-bottom:24px;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 14px;font-size:14px;color:#3d3a34;">
              <strong style="color:#171717;">Kari Nordmann</strong> oppdaterte status på <strong style="color:#171717;">Testbedrift AS</strong>
              <span style="display:inline-block;margin-left:6px;padding:2px 8px;background-color:#09fe94;border-radius:4px;font-size:11px;font-weight:700;color:#171717;">Booket møte</span>
            </p>
            <p style="margin:0;font-size:14px;color:#3d3a34;">
              <strong style="color:#171717;">Ola Hansen</strong> la til nytt lead: <strong style="color:#171717;">Demo Consulting AS</strong>
            </p>
          </td></tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0">
          <tr><td style="background-color:#09fe94;border-radius:8px;">
            <a href="${APP_URL}/mine-leads" style="padding:12px 28px;color:#171717;font-weight:700;font-size:14px;text-decoration:none;display:block;">Se alle leads &rarr;</a>
          </td></tr>
        </table>`,
        year
      );
      const r = await sendResend(toEmail, "👥 Teamaktivitet i Reachr", html,
        `Hei ${name},\n\nNylig aktivitet i teamet:\n- Kari Nordmann oppdaterte status på Testbedrift AS → Booket møte\n- Ola Hansen la til nytt lead: Demo Consulting AS\n\nSe alle leads: ${APP_URL}/mine-leads\n\n-- Reachr`);
      results.teamaktivitet = { ok: r.ok, detail: r.ok ? undefined : JSON.stringify(r.body) };
    }
  }

  const allOk = Object.values(results).every(r => r.ok);
  return NextResponse.json({ success: allOk, sentTo: toEmail, results }, { status: allOk ? 200 : 207 });
}
