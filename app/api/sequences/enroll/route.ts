import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST — enroll a lead in a sequence
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sequenceId, leadId, leadName, leadEmail } = await req.json();
  if (!sequenceId || !leadId) return NextResponse.json({ error: "sequenceId og leadId kreves" }, { status: 400 });

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

  // Get first step to calculate next_send_at
  const { data: firstStep } = await supabase
    .from("email_sequence_steps")
    .select("delay_days")
    .eq("sequence_id", sequenceId)
    .eq("step_number", 1)
    .single();

  const nextSendAt = new Date();
  nextSendAt.setDate(nextSendAt.getDate() + (firstStep?.delay_days ?? 0));

  if (existing) {
    // Re-activate stopped enrollment
    await supabase
      .from("email_sequence_enrollments")
      .update({ status: "active", current_step: 1, next_send_at: nextSendAt.toISOString() })
      .eq("id", existing.id);
  } else {
    await supabase.from("email_sequence_enrollments").insert({
      sequence_id: sequenceId,
      lead_id: leadId,
      lead_name: leadName ?? "",
      lead_email: leadEmail ?? "",
      current_step: 1,
      next_send_at: nextSendAt.toISOString(),
      status: "active",
      enrolled_by: user.email,
    });
  }

  return NextResponse.json({ success: true });
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
