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

    // Create the lead
    const { data, error } = await db
      .from("leads")
      .insert({
        user_email: user.email,
        name: name || company || "Ny lead",
        contact_person: name || "",
        company: company || "",
        email: email || "—",
        phone: phone || "—",
        industry: title || "Hentet fra LinkedIn",
        status: "Ikke kontaktet",
        notes: `Hentet via Chrome Extension fra ${linkedin_url || "LinkedIn"}`,
        added_date: new Date().toISOString().split("T")[0]
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
