import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/team — load team members for current user
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json([], { status: 200 });

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("owner_email", user.email)
    .order("invited_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
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
