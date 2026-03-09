import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/** Verify the lead belongs to the authenticated user's team before mutating. */
async function assertOwnership(leadId: string, userEmail: string): Promise<boolean> {
  const db = createServiceClient();
  const { data } = await db
    .from("leads")
    .select("user_email")
    .eq("id", leadId)
    .single();
  if (!data) return false;

  // Direct owner
  if (data.user_email === userEmail) return true;

  // Team member: check if lead owner is the same team owner as current user
  const { data: membership } = await db
    .from("team_members")
    .select("owner_email")
    .eq("member_email", userEmail)
    .limit(1)
    .single();

  const teamOwner = membership?.owner_email ?? null;
  if (teamOwner && data.user_email === teamOwner) return true;

  // Current user is the owner and lead belongs to one of their members
  const { data: ownedMember } = await db
    .from("team_members")
    .select("member_email")
    .eq("owner_email", userEmail)
    .eq("member_email", data.user_email)
    .limit(1)
    .single();

  return !!ownedMember;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  if (!await assertOwnership(id, user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const db = createServiceClient();
  const { error } = await db.from("leads").update(body).eq("id", id);
  if (error) {
    console.error("[PATCH /api/leads] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  if (!await assertOwnership(id, user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = createServiceClient();
  const { error } = await db.from("leads").delete().eq("id", id);
  if (error) {
    console.error("[DELETE /api/leads] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
