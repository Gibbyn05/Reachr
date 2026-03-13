import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If no session, check for an API key in headers (optional enhancement)
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized. Log in to Reachr first." }, { status: 401 });
    }

    const body = await req.json();
    const { name, company, email, phone, title, linkedin_url, website } = body;

    const db = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create the lead — map LinkedIn data to the correct leads table columns:
    // - lead.name = company/org name
    // - contact_person = the actual person's name from LinkedIn
    // - industry = their job title
    // - notes = LinkedIn URL + context
    const { data, error } = await db
      .from("leads")
      .insert({
        id: crypto.randomUUID(),
        user_email: user.email,
        name: company || name || "Ny lead",       // company name
        contact_person: name || "—",              // person's name
        email: email || "—",
        phone: phone || "—",
        industry: title || "—",                   // job title as industry
        city: "—",
        status: "Ikke kontaktet",
        notes: `Hentet fra LinkedIn${linkedin_url ? `: ${linkedin_url}` : ""}`,
        added_date: new Date().toISOString().split("T")[0],
        revenue: 0,
        employees: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, lead: data });
  } catch (error: any) {
    console.error("[Extension Lead Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
