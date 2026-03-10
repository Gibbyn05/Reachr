import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  // Auth check with user-scoped client
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json([], { status: 200 });

  // Use service client to bypass RLS for all team data reads
  const db = getServiceClient();

  const teamOwnerEmail = user.user_metadata?.team_owner as string | undefined;
  const ownerEmail = teamOwnerEmail ?? user.email;

  // Fetch all member emails under this team (service client bypasses RLS)
  const { data: members } = await db
    .from("team_members")
    .select("member_email")
    .eq("owner_email", ownerEmail);

  const teamEmails = Array.from(new Set([
    ownerEmail,
    user.email,
    ...(members ?? []).map((m: { member_email: string }) => m.member_email),
  ]));

  const { data, error } = await db
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
  // Validate auth with the user-scoped client
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    console.error("[POST /api/leads] No authenticated user found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Use service role client for the write — bypasses RLS so the insert always works.
  // Auth is already validated above; we trust the caller is the authenticated user.
  const db = getServiceClient();

  const { error } = await db
    .from("leads")
    .upsert({
      id: body.id,
      user_email: user.email,
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
    }, { onConflict: "id" });

  if (error) {
    console.error("[POST /api/leads] upsert error:", error.message, error.details, error.hint);
    return NextResponse.json({ error: error.message, details: error.details, hint: error.hint }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
