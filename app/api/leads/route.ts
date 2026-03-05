import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const userEmail = req.nextUrl.searchParams.get("user_email");
  if (!userEmail) return NextResponse.json([], { status: 200 });

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_email", userEmail)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("leads")
    .upsert({
      id: body.id,
      user_email: body.user_email,
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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
