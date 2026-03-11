import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email-sender";

// POST — enroll a lead in a sequence
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sequenceId, leadId, leadName, leadEmail } = await req.json();
  if (!sequenceId || !leadId) return NextResponse.json({ error: "sequenceId og leadId kreves" }, { status: 400 });

  const db = createServiceClient();

  // Check if already enrolled
  const { data: existing } = await supabase
    .from("email_sequence_enrollments")
    .select("id, status")
    .eq("sequence_id", sequenceId)
    .eq("lead_id", leadId)
    .single();

  if (existing?.status === "active") {
    return NextResponse.json({ error: "Allerede enrollert i denne sekvensen" }, { status: 409 });
  }

  // Get first step info
  const { data: firstStep } = await supabase
    .from("email_sequence_steps")
    .select("*")
    .eq("sequence_id", sequenceId)
    .eq("step_number", 1)
    .single();

  const isImmediate = (firstStep?.delay_days ?? 0) === 0;
  const nextSendAt = new Date();
  if (!isImmediate) {
    nextSendAt.setDate(nextSendAt.getDate() + (firstStep?.delay_days ?? 0));
  }

  let enrollmentResult;
  if (existing) {
    enrollmentResult = await db
      .from("email_sequence_enrollments")
      .update({ status: "active", current_step: 1, next_send_at: nextSendAt.toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
  } else {
    enrollmentResult = await db.from("email_sequence_enrollments").insert({
      sequence_id: sequenceId,
      lead_id: leadId,
      lead_name: leadName ?? "",
      lead_email: leadEmail ?? "",
      current_step: 1,
      next_send_at: nextSendAt.toISOString(),
      status: "active",
      enrolled_by: user.email,
    }).select().single();
  }

  if (enrollmentResult.error) {
    console.error("[Sequences] Enrollment DB error:", enrollmentResult.error);
    return NextResponse.json({ error: enrollmentResult.error.message, details: enrollmentResult.error.details }, { status: 500 });
  }

  // If immediate (delay_days = 0) and first step is an e-mail (has subject/body), send now.
  const isEmail = !!(firstStep?.subject || firstStep?.body);
  if (isImmediate && isEmail) {
    try {
      const { data: conn } = await db
        .from("email_connections")
        .select("provider")
        .eq("user_email", user.email)
        .limit(1)
        .single();

      if (conn && leadEmail && leadEmail !== "—") {
        const body = (firstStep.body || "")
          .replace(/\{\{bedrift\}\}/g, leadName ?? "")
          .replace(/\{\{navn\}\}/g, leadName ?? "");

        await sendEmail({
          ownerEmail: user.email,
          to: leadEmail,
          subject: firstStep.subject,
          body,
          provider: conn.provider as "gmail" | "outlook"
        });

        // Advance to next step immediately
        const { data: nextStep } = await db
          .from("email_sequence_steps")
          .select("delay_days, step_number")
          .eq("sequence_id", sequenceId)
          .eq("step_number", 2)
          .single();

        if (nextStep) {
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + (nextStep.delay_days || 0));
          await db.from("email_sequence_enrollments").update({
            current_step: nextStep.step_number,
            next_send_at: nextDate.toISOString(),
          }).eq("id", enrollmentResult.data.id);
        } else {
          await db.from("email_sequence_enrollments").update({ status: "completed" }).eq("id", enrollmentResult.data.id);
        }

        // Also update lead's last contacted
        await db.from("leads").update({ 
          last_contacted: new Date().toISOString().split("T")[0] 
        }).eq("id", leadId);
        
        console.log(`[Sequences] Immediate send successful for lead ${leadId}`);
      } else {
        console.warn(`[Sequences] Immediate send skipped: conn=${!!conn}, email=${leadEmail}`);
      }
    } catch (err: any) {
      console.error("[Sequences] Immediate send failed:", err.message);
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, immediate: isImmediate });
}

// DELETE — stop enrollment
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { enrollmentId } = await req.json();
  await supabase
    .from("email_sequence_enrollments")
    .update({ status: "stopped" })
    .eq("id", enrollmentId)
    .eq("enrolled_by", user.email);

  return NextResponse.json({ success: true });
}
