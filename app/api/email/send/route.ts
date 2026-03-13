import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email-sender";

export async function POST(req: NextRequest) {
  try {
    const { provider, to, subject, body, leadId } = await req.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await sendEmail({
      ownerEmail: user.email,
      to,
      subject,
      body,
      provider,
      leadId
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[Email Send Route Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
