import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, unknown> = {};

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    results.supabase_init = "ok";

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      results.auth = authError ? { error: authError.message } : { ok: true, email: user?.email ?? null };
    } catch (e) {
      results.auth = { exception: String(e) };
    }

    try {
      const { data, error } = await supabase.from("leads").select("id").limit(1);
      results.leads_select = error
        ? { error: error.message, code: error.code, hint: error.hint, details: error.details }
        : { ok: true, rows: data?.length };
    } catch (e) {
      results.leads_select = { exception: String(e) };
    }

    try {
      const { data, error } = await supabase.from("team_members").select("owner_email").limit(1);
      results.team_members_select = error
        ? { error: error.message, code: error.code }
        : { ok: true, rows: data?.length };
    } catch (e) {
      results.team_members_select = { exception: String(e) };
    }

  } catch (e) {
    results.supabase_init = { exception: String(e) };
  }

  return NextResponse.json(results, { status: 200 });
}
