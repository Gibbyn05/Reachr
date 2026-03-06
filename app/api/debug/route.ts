import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Diagnostic endpoint — visit /api/debug to see Supabase table status
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const results: Record<string, unknown> = {
    authenticated: !!user?.email,
    userEmail: user?.email ?? null,
    teamOwner: user?.user_metadata?.team_owner ?? null,
  };

  // Test leads table
  const { data: leadsData, error: leadsError } = await supabase
    .from("leads")
    .select("id")
    .limit(1);
  results.leads_test = leadsError ? { error: leadsError.message, code: leadsError.code, hint: leadsError.hint } : { ok: true, rows: leadsData?.length };

  // Test team_members table
  const { data: teamData, error: teamError } = await supabase
    .from("team_members")
    .select("owner_email")
    .limit(1);
  results.team_members_test = teamError ? { error: teamError.message, code: teamError.code } : { ok: true, rows: teamData?.length };

  // Try insert test (will be rolled back)
  const testId = "test-diagnostic-" + Date.now();
  const { error: insertError } = await supabase
    .from("leads")
    .insert({ id: testId, user_email: user?.email ?? "test@test.no", name: "test", status: "Ikke kontaktet", added_date: new Date().toISOString().split("T")[0] });
  if (insertError) {
    results.insert_test = { error: insertError.message, code: insertError.code, hint: insertError.hint };
  } else {
    results.insert_test = { ok: true };
    // Clean up test row
    await supabase.from("leads").delete().eq("id", testId);
  }

  return NextResponse.json(results, { status: 200 });
}
