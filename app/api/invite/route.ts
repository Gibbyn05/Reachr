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

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Reachr <${FROM_EMAIL}>`,
        to: [email],
        subject: `${inviterName} inviterer deg til Reachr`,
        html: `
<!DOCTYPE html>
<html lang="no">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#F8F9FC;margin:0;padding:40px 0;">
  <div style="max-width:560px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0F1729,#1E3A5F);padding:32px 40px;text-align:center;">
      <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:8px;">
        <div style="width:36px;height:36px;background:#2563EB;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:20px;font-weight:900;">⚡</span>
        </div>
        <span style="color:white;font-size:22px;font-weight:800;letter-spacing:-0.5px;">Reachr</span>
      </div>
    </div>
    <div style="padding:40px;">
      <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#0F1729;">Du er invitert! 🎉</h2>
      <p style="color:#6B7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
        <strong style="color:#374151;">${inviterName}</strong> inviterer deg til å bli med i
        <strong style="color:#374151;">${companyName || "teamet"}</strong> på Reachr —
        det norske B2B-verktøyet for leadsøk og salgspipeline.
      </p>
      <a href="${inviteLink}" style="display:inline-block;background:#2563EB;color:white;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;box-shadow:0 4px 12px rgba(37,99,235,0.4);">
        Bli med i teamet →
      </a>
      <p style="color:#9CA3AF;font-size:12px;margin:24px 0 0;">
        Invitasjonen er gyldig i 7 dager. Har du spørsmål? Svar på denne e-posten.
      </p>
    </div>
    <div style="background:#F9FAFB;padding:20px 40px;border-top:1px solid #F3F4F6;">
      <p style="color:#D1D5DB;font-size:11px;margin:0;text-align:center;">
        © ${new Date().getFullYear()} Reachr · reachr.no
      </p>
    </div>
  </div>
</body>
</html>`,
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
