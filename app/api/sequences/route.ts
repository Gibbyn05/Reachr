import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — list sequences for current user
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: sequences } = await supabase
    .from("email_sequences")
    .select("*, email_sequence_steps(*)")
    .eq("owner_email", user.email)
    .order("created_at", { ascending: false });

  // Count active enrollments per sequence
  const { data: enrollments } = await supabase
    .from("email_sequence_enrollments")
    .select("sequence_id, status")
    .eq("enrolled_by", user.email);

  const enrollMap: Record<string, number> = {};
  for (const e of enrollments ?? []) {
    if (e.status === "active") enrollMap[e.sequence_id] = (enrollMap[e.sequence_id] ?? 0) + 1;
  }

  return NextResponse.json({
    sequences: (sequences ?? []).map(s => ({
      ...s,
      email_sequence_steps: (s.email_sequence_steps ?? []).sort((a: { step_number: number }, b: { step_number: number }) => a.step_number - b.step_number),
      activeEnrollments: enrollMap[s.id] ?? 0,
    }))
  });
}

// POST — create new sequence
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, steps } = await req.json();
  if (!name || !steps?.length) return NextResponse.json({ error: "Navn og steg kreves" }, { status: 400 });

  const { data: seq, error } = await supabase
    .from("email_sequences")
    .insert({ owner_email: user.email, name, is_active: true })
    .select()
    .single();

  if (error || !seq) return NextResponse.json({ error: error?.message ?? "Feil" }, { status: 500 });

  const stepRows = steps.map((s: { delayDays: number; subject: string; body: string }, i: number) => ({
    sequence_id: seq.id,
    step_number: i + 1,
    delay_days: s.delayDays,
    subject: s.subject,
    body: s.body,
  }));

  await supabase.from("email_sequence_steps").insert(stepRows);

  return NextResponse.json({ sequence: seq });
}

// DELETE — delete sequence
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await supabase.from("email_sequences").delete().eq("id", id).eq("owner_email", user.email);
  return NextResponse.json({ success: true });
}
