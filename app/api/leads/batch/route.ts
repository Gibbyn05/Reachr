import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Lead } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { leads } = await req.json() as { leads: Lead[] };
  if (!Array.isArray(leads) || leads.length === 0) {
    return NextResponse.json({ error: "Ingen leads å importere" }, { status: 400 });
  }

  try {
    const rows = leads.map((lead) => ({
      id: lead.id,
      user_email: user.email,
      name: lead.name,
      org_number: lead.orgNumber,
      contact_person: lead.contactPerson,
      phone: lead.phone,
      email: lead.email,
      industry: lead.industry,
      city: lead.city,
      address: lead.address,
      revenue: lead.revenue,
      employees: lead.employees,
      lat: lead.lat,
      lng: lead.lng,
      status: lead.status,
      last_contacted: lead.lastContacted,
      assigned_to: lead.assignedTo,
      assigned_avatar: lead.assignedAvatar,
      added_by: lead.addedBy,
      notes: lead.notes,
      added_date: lead.addedDate,
    }));

    const { error } = await supabase
      .from("leads")
      .upsert(rows, { onConflict: "id" });

    if (error) {
      console.error("[batch] Supabase error:", error);
      return NextResponse.json({ error: "Kunne ikke importere leads" }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: leads.length });
  } catch (e) {
    console.error("[batch] Error:", e);
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
