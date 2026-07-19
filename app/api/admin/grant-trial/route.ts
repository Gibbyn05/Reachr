import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { email, days } = await req.json();
  if (!email || !days || days < 1 || days > 365) {
    return NextResponse.json({ error: "Ugyldig email eller antall dager (1-365)" }, { status: 400 });
  }

  const serviceClient = createServiceClient();

  const { data: users, error: listError } = await serviceClient.auth.admin.listUsers();
  if (listError) {
    return NextResponse.json({ error: "Kunne ikke hente brukere: " + listError.message }, { status: 500 });
  }

  const target = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  if (!target) {
    return NextResponse.json({ error: `Bruker ${email} finnes ikke` }, { status: 404 });
  }

  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + days);
  const trialEndISO = trialEnd.toISOString();

  const { error: updateError } = await serviceClient.auth.admin.updateUserById(target.id, {
    user_metadata: { ...target.user_metadata, free_trial_end: trialEndISO },
  });

  if (updateError) {
    return NextResponse.json({ error: "Kunne ikke oppdatere bruker: " + updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    email: target.email,
    free_trial_end: trialEndISO,
    days,
  });
}
