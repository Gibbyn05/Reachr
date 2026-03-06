import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json([], { status: 200 });

  const { data } = await supabase
    .from("email_connections")
    .select("provider, email_address, expires_at")
    .eq("user_email", user.email);

  return NextResponse.json(data ?? []);
}

export async function DELETE(req: Request) {
  const { provider } = await req.json();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await supabase
    .from("email_connections")
    .delete()
    .eq("user_email", user.email)
    .eq("provider", provider);

  return NextResponse.json({ success: true });
}
