import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

// GET — list all users with active free access
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const serviceClient = createServiceClient();
  const { data, error } = await serviceClient.auth.admin.listUsers();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = new Date();
  const freeUsers = data.users
    .filter(u => {
      const end = u.user_metadata?.free_trial_end;
      return end && new Date(end) > now;
    })
    .map(u => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.full_name ?? u.email,
      grantedUntil: u.user_metadata.free_trial_end,
    }));

  return NextResponse.json({ users: freeUsers });
}

// POST — grant free access
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { email, days } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "E-post er påkrevd" }, { status: 400 });
  }

  const serviceClient = createServiceClient();
  const { data: users, error: listError } = await serviceClient.auth.admin.listUsers();
  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const target = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  if (!target) {
    return NextResponse.json({ error: `Bruker "${email}" finnes ikke. De må registrere seg først.` }, { status: 404 });
  }

  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + (days || 3650));
  const trialEndISO = trialEnd.toISOString();

  const { error: updateError } = await serviceClient.auth.admin.updateUserById(target.id, {
    user_metadata: { ...target.user_metadata, free_trial_end: trialEndISO },
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    email: target.email,
    name: target.user_metadata?.full_name ?? target.email,
    grantedUntil: trialEndISO,
  });
}

// DELETE — revoke free access and sign the user out
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: "userId er påkrevd" }, { status: 400 });
  }

  const serviceClient = createServiceClient();

  // Get current metadata so we don't lose other fields
  const { data: targetUser, error: getError } = await serviceClient.auth.admin.getUserById(userId);
  if (getError || !targetUser?.user) {
    return NextResponse.json({ error: "Bruker ikke funnet" }, { status: 404 });
  }

  const meta = { ...targetUser.user.user_metadata };
  delete meta.free_trial_end;

  // Clear free_trial_end
  const { error: updateError } = await serviceClient.auth.admin.updateUserById(userId, {
    user_metadata: meta,
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Sign the user out so they land on homepage, not paywall
  await serviceClient.auth.admin.signOut(userId, "global");

  return NextResponse.json({ success: true });
}
