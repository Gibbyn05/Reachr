import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createHmac } from "crypto";

function calendarSecret(): string {
  return process.env.CALENDAR_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "reachr-calendar";
}

export function signCalendarToken(email: string): string {
  const encoded = Buffer.from(email).toString("base64url");
  const sig = createHmac("sha256", calendarSecret()).update(email).digest("hex");
  return `${encoded}.${sig}`;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = signCalendarToken(user.email);
  return NextResponse.json({ token });
}
