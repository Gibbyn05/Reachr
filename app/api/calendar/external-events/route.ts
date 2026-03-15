import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ExternalEvent {
  id: string;
  title: string;
  start: string; // ISO datetime
  end: string;
  allDay: boolean;
  source: "google" | "outlook";
  location?: string;
  description?: string;
}

async function refreshGoogleToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
    const data = await res.json();
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

async function refreshMicrosoftToken(refreshToken: string): Promise<string | null> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const res = await fetch(`https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID ?? "common"}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        refresh_token: refreshToken,
        redirect_uri: `${appUrl}/api/email/microsoft/callback`,
        grant_type: "refresh_token",
        scope: "https://graph.microsoft.com/Calendars.Read offline_access",
      }),
    });
    const data = await res.json();
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

async function fetchGoogleEvents(
  accessToken: string,
  refreshToken: string | null,
  timeMin: string,
  timeMax: string,
  supabase: Awaited<ReturnType<typeof createClient>>,
  userEmail: string
): Promise<ExternalEvent[]> {
  let token = accessToken;

  const tryFetch = async (t: string) => {
    return fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      new URLSearchParams({
        timeMin,
        timeMax,
        singleEvents: "true",
        orderBy: "startTime",
        maxResults: "100",
      }),
      { headers: { Authorization: `Bearer ${t}` } }
    );
  };

  let res = await tryFetch(token);

  // Try refresh if 401
  if (res.status === 401 && refreshToken) {
    const newToken = await refreshGoogleToken(refreshToken);
    if (newToken) {
      token = newToken;
      // Persist new token
      await supabase.from("email_connections").update({ access_token: newToken })
        .eq("user_email", userEmail).eq("provider", "gmail");
      res = await tryFetch(token);
    }
  }

  if (!res.ok) return [];

  const data = await res.json();
  const items: any[] = data.items ?? [];

  return items
    .filter((item: any) => item.status !== "cancelled" && item.start)
    .map((item: any): ExternalEvent => {
      const allDay = !!item.start.date && !item.start.dateTime;
      return {
        id: `google-${item.id}`,
        title: item.summary ?? "(Uten tittel)",
        start: item.start.dateTime ?? item.start.date ?? "",
        end: item.end?.dateTime ?? item.end?.date ?? "",
        allDay,
        source: "google",
        location: item.location,
        description: item.description,
      };
    });
}

async function fetchOutlookEvents(
  accessToken: string,
  refreshToken: string | null,
  timeMin: string,
  timeMax: string,
  supabase: Awaited<ReturnType<typeof createClient>>,
  userEmail: string
): Promise<ExternalEvent[]> {
  let token = accessToken;

  const tryFetch = async (t: string) => {
    return fetch(
      `https://graph.microsoft.com/v1.0/me/calendarView?` +
      new URLSearchParams({ startDateTime: timeMin, endDateTime: timeMax, $top: "100" }),
      {
        headers: {
          Authorization: `Bearer ${t}`,
          Prefer: 'outlook.timezone="Europe/Oslo"',
        },
      }
    );
  };

  let res = await tryFetch(token);

  if (res.status === 401 && refreshToken) {
    const newToken = await refreshMicrosoftToken(refreshToken);
    if (newToken) {
      token = newToken;
      await supabase.from("email_connections").update({ access_token: newToken })
        .eq("user_email", userEmail).eq("provider", "outlook");
      res = await tryFetch(token);
    }
  }

  if (!res.ok) return [];

  const data = await res.json();
  const items: any[] = data.value ?? [];

  return items.map((item: any): ExternalEvent => ({
    id: `outlook-${item.id}`,
    title: item.subject ?? "(Uten tittel)",
    start: item.start?.dateTime ?? "",
    end: item.end?.dateTime ?? "",
    allDay: item.isAllDay ?? false,
    source: "outlook",
    location: item.location?.displayName,
    description: item.bodyPreview,
  }));
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const timeMin = searchParams.get("from") ?? new Date().toISOString();
  const timeMax = searchParams.get("to") ?? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

  const { data: connections } = await supabase
    .from("email_connections")
    .select("provider, access_token, refresh_token")
    .eq("user_email", user.email);

  const events: ExternalEvent[] = [];

  for (const conn of connections ?? []) {
    if (!conn.access_token) continue;

    if (conn.provider === "gmail") {
      const googleEvents = await fetchGoogleEvents(
        conn.access_token, conn.refresh_token, timeMin, timeMax, supabase, user.email
      );
      events.push(...googleEvents);
    }

    if (conn.provider === "outlook") {
      const outlookEvents = await fetchOutlookEvents(
        conn.access_token, conn.refresh_token, timeMin, timeMax, supabase, user.email
      );
      events.push(...outlookEvents);
    }
  }

  return NextResponse.json({ events, connected: (connections ?? []).map(c => c.provider) });
}
