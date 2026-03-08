import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

// Vercel Cron: runs daily at 08:00
// Add to vercel.json: { "crons": [{ "path": "/api/cron/sequences", "schedule": "0 8 * * *" }] }
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date().toISOString();

  // Find enrollments due to send
  const { data: due } = await supabase
    .from("email_sequence_enrollments")
    .select("*, email_sequences(owner_email, name, is_active)")
    .eq("status", "active")
    .lte("next_send_at", now);

  if (!due?.length) return NextResponse.json({ sent: 0 });

  let sent = 0;

  for (const enrollment of due) {
    const seq = enrollment.email_sequences;
    if (!seq?.is_active) continue;

    // Get current step content
    const { data: step } = await supabase
      .from("email_sequence_steps")
      .select("*")
      .eq("sequence_id", enrollment.sequence_id)
      .eq("step_number", enrollment.current_step)
      .single();

    if (!step) {
      // No more steps — mark complete
      await supabase.from("email_sequence_enrollments").update({ status: "completed" }).eq("id", enrollment.id);
      continue;
    }

    // Get email connection for owner
    const { data: connection } = await supabase
      .from("email_connections")
      .select("*")
      .eq("user_email", seq.owner_email)
      .limit(1)
      .single();

    if (!enrollment.lead_email) {
      // Skip if no email on lead
      continue;
    }

    // Replace template variables
    const body = step.body
      .replace(/\{\{bedrift\}\}/g, enrollment.lead_name ?? "")
      .replace(/\{\{navn\}\}/g, enrollment.lead_name ?? "");

    // Send via our email send API
    const sendRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: enrollment.lead_email,
        subject: step.subject,
        body,
        provider: connection?.provider ?? "gmail",
        ownerEmail: seq.owner_email,
        sequenceMode: true,
      }),
    });

    if (sendRes.ok) {
      sent++;
      // Advance to next step
      const { data: nextStep } = await supabase
        .from("email_sequence_steps")
        .select("delay_days, step_number")
        .eq("sequence_id", enrollment.sequence_id)
        .eq("step_number", enrollment.current_step + 1)
        .single();

      if (nextStep) {
        const nextSendAt = new Date();
        nextSendAt.setDate(nextSendAt.getDate() + nextStep.delay_days);
        await supabase.from("email_sequence_enrollments").update({
          current_step: nextStep.step_number,
          next_send_at: nextSendAt.toISOString(),
        }).eq("id", enrollment.id);
      } else {
        await supabase.from("email_sequence_enrollments").update({ status: "completed" }).eq("id", enrollment.id);
      }
    }
  }

  return NextResponse.json({ sent, checked: due.length });
}
