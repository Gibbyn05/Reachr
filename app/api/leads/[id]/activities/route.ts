import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch logs for this lead
    const { data: logs, error } = await supabase
      .from("email_logs")
      .select(`
        *,
        email_events (*)
      `)
      .eq("lead_id", id)
      .order("sent_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("[GET Lead Activities Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
