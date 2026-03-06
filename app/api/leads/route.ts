import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json([], { status: 200 });

  // Build list of all team emails to load leads from
  const teamOwnerEmail = user.user_metadata?.team_owner as string | undefined;
  const ownerEmail = teamOwnerEmail ?? user.email;

  // Fetch all member emails under this team
  const { data: members } = await supabase
    .from("team_members")
    .select("member_email")
    .eq("owner_email", ownerEmail);

  const teamEmails = Array.from(new Set([
    ownerEmail,
    user.email,
    ...(members ?? []).map((m: { member_email: string }) => m.member_email),
  ]));

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .in("user_email", teamEmails)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[GET /api/leads] leads query error:", error);
    return NextResponse.json({ error: error.message, details: error.details }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    console.error("[POST /api/leads] No authenticated user found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Always store under the authenticated user's own email (avoids RLS issues)
  const storeEmail = user.email;

  const { data, error } = await supabase
    .from("leads")
    .upsert({
      id: body.id,
      user_email: storeEmail,
      name: body.name,
      org_number: body.orgNumber,
      contact_person: body.contactPerson,
      phone: body.phone,
      email: body.email,
      industry: body.industry,
      city: body.city,
      address: body.address,
      revenue: body.revenue ?? 0,
      employees: body.employees ?? 0,
      lat: body.lat ?? 0,
      lng: body.lng ?? 0,
      status: body.status,
      last_contacted: body.lastContacted,
      assigned_to: body.assignedTo,
      assigned_avatar: body.assignedAvatar,
      added_by: body.addedBy,
      notes: body.notes ?? "",
      added_date: body.addedDate,
      meeting_date: body.meetingDate ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("[POST /api/leads] upsert error:", error);
    return NextResponse.json({ error: error.message, details: error.details, hint: error.hint }, { status: 500 });
  }
  return NextResponse.json(data);
}
