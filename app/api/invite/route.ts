import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@reachr.no";
// Normalize APP_URL to prevent deployment typos (e.g. wwww -> www)
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.reachr.no")
  .replace(/^(https?:\/\/)w{4,}\./, "$1www.");

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
    }

    const { email, inviterName, companyName } = await req.json();
    if (!email) return NextResponse.json({ error: "E-post mangler" }, { status: 400 });

    // Check how many people have already been invited
    const { count, error: countError } = await supabase
      .from("team_members")
      .select("*", { count: "exact", head: true })
      .eq("owner_email", user.email);

    if (countError) {
      return NextResponse.json({ error: "Kunne ikke sjekke teamgrense" }, { status: 500 });
    }

    if (count !== null && count >= 4) {
      return NextResponse.json(
        { error: "Du har nådd maksgrensen. Du kan maks invitere 4 personer (totalt 5 i teamet)." },
        { status: 403 }
      );
    }

    // Store a pending team_members record (with owner's display name so members can see it)
    await supabase.from("team_members").upsert({
      owner_email: user.email,
      member_email: email,
      member_name: "",
      owner_name: inviterName ?? "",
      status: "pending",
    }, { onConflict: "owner_email,member_email" });

    // Build invite link with inviter info so register page can link the accounts
    const inviteLink = `${APP_URL}/register?invite=${encodeURIComponent(email)}&inviter=${encodeURIComponent(user.email)}&company=${encodeURIComponent(companyName ?? "")}&name=${encodeURIComponent(inviterName ?? "")}`;

    if (!RESEND_API_KEY) {
      console.warn("[invite] RESEND_API_KEY is not configured — invite not sent");
      return NextResponse.json(
        { error: "E-postleverandøren er ikke konfigurert. Legg til RESEND_API_KEY i miljøvariabler." },
        { status: 503 }
      );
    }

    const year = new Date().getFullYear();
    const teamName = companyName || "teamet";
    const plainText = [
      `Hei,`,
      ``,
      `${inviterName} inviterer deg til aa bli med i ${teamName} paa Reachr.`,
      ``,
      `Reachr er det norske B2B-verktoeyet for leadsok og salgspipeline.`,
      ``,
      `Bli med i teamet:`,
      inviteLink,
      ``,
      `Invitasjonen er gyldig i 7 dager.`,
      ``,
      `--`,
      `Reachr · reachr.no`,
      `(c) ${year} Reachr`,
    ].join("\n");

    // Table-based layout — required for Outlook (which renders HTML via Word engine)
    const htmlBody = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="no">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invitasjon til Reachr</title>
</head>
<body style="margin:0;padding:0;background-color:#F9FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F9FAFB;">
    <tr>
      <td align="center" style="padding:60px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
          <!-- Header -->
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
          <!-- Body -->
          <tr>
            <td style="padding:48px 40px;">
              <h2 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111827;letter-spacing:-0.4px;">
                Du er invitert til ${teamName}
              </h2>
              <p style="color:#4B5563;font-size:16px;line-height:1.6;margin:0 0 16px;">
                <strong style="color:#111827;">${inviterName}</strong> har invitert deg til å bli med i
                <strong style="color:#111827;">${teamName}</strong> på Reachr &mdash; det norske B2B-verktøyet for leadsøk og salgspipeline.
              </p>
              <p style="color:#4B5563;font-size:16px;line-height:1.6;margin:0 0 32px;">
                Du trenger ikke betale selv &mdash; du bruker teamets abonnementet.
              </p>
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#09fe94;border-radius:8px;">
                    <a href="${inviteLink}" style="padding:14px 32px;color:#064e3b;font-weight:700;font-size:15px;text-decoration:none;display:block;text-align:center;border-radius:8px;">
                      Bli med i teamet &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <div style="margin-top:32px;padding-top:24px;border-top:1px solid #E5E7EB;">
                <p style="color:#6B7280;font-size:13px;line-height:1.5;margin:0;">
                  Invitasjonen er gyldig i 7 dager. Fungerer ikke knappen? Kopier denne lenken og lim den inn i nettleseren din:<br />
                  <a href="${inviteLink}" style="color:#2563EB;text-decoration:underline;word-break:break-all;margin-top:8px;display:block;">${inviteLink}</a>
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
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
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Reachr <${FROM_EMAIL}>`,
        reply_to: FROM_EMAIL,
        to: [email],
        subject: `${inviterName} inviterer deg til Reachr`,
        text: plainText,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: "Kunne ikke sende e-post", detail: err }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
