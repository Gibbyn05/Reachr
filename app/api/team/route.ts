import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/team — load team info for current user (owner or member perspective)
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ role: "owner", members: [] }, { status: 200 });

  // Check if current user owns a team (has invited members)
  const { data: ownedMembers } = await supabase
    .from("team_members")
    .select("*")
    .eq("owner_email", user.email)
    .order("invited_at", { ascending: true });

  if (ownedMembers && ownedMembers.length > 0) {
    return NextResponse.json({ role: "owner", members: ownedMembers });
  }

  // Check if current user is a member of someone else's team
  const teamOwnerEmail: string | undefined = user.user_metadata?.team_owner;
  if (teamOwnerEmail) {
    const { data: teamData } = await supabase
      .from("team_members")
      .select("*")
      .eq("owner_email", teamOwnerEmail)
      .order("invited_at", { ascending: true });

    // Use stored owner_name from any row (they all share the same owner)
    const ownerName = (teamData ?? []).find((m) => m.owner_name)?.owner_name ?? teamOwnerEmail;

    // Include the owner as a synthetic entry so the member can see them
    const ownerEntry = {
      owner_email: teamOwnerEmail,
      member_email: teamOwnerEmail,
      member_name: ownerName,
      status: "active",
      role: "owner",
    };
    // Filter out self from members list; owner entry comes first
    const otherMembers = (teamData ?? []).filter((m) => m.member_email !== user.email);
    return NextResponse.json({ role: "member", members: [ownerEntry, ...otherMembers] });
  }

  return NextResponse.json({ role: "owner", members: [] });
}

// POST /api/team/join — called after invited user registers
// Body: { owner_email: string, member_name: string }
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { owner_email, member_name } = await req.json();
  if (!owner_email) return NextResponse.json({ error: "owner_email mangler" }, { status: 400 });

  const { error } = await supabase
    .from("team_members")
    .update({
      member_name: member_name ?? user.email,
      status: "active",
      joined_at: new Date().toISOString(),
    })
    .eq("owner_email", owner_email)
    .eq("member_email", user.email);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// PATCH /api/team — update current user's display name in team_members
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { member_name } = await req.json();
  if (!member_name) return NextResponse.json({ error: "member_name mangler" }, { status: 400 });

  // Update as member (own row)
  await supabase
    .from("team_members")
    .update({ member_name })
    .eq("member_email", user.email);

  // Also update as owner (so members see the correct owner name)
  await supabase
    .from("team_members")
    .update({ owner_name: member_name })
    .eq("owner_email", user.email);

  return NextResponse.json({ success: true });
}
