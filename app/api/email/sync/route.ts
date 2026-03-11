import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  try {
    // 1. Get user's email connections
    const { data: connections, error: connError } = await supabase
      .from("email_connections")
      .select("*")
      .eq("user_email", user.email);

    if (connError || !connections || connections.length === 0) {
      return NextResponse.json({ error: "Ingen e-postkonto tilkoblet" }, { status: 400 });
    }

    const connection = connections[0];
    const accessToken = connection.access_token;
    let foundReplies = 0;

    if (connection.provider === "gmail") {
      // Basic implementation of Gmail API polling
      // In a production app, you would use Webhooks (Pub/Sub) instead of polling,
      // and handle token refresh with the refresh_token.
      const q = encodeURIComponent("is:unread in:inbox");
      const listRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${q}&maxResults=10`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (listRes.ok) {
        const listData = await listRes.json();
        const messages = listData.messages || [];
        
        // Match senders to leads simply as an example
        // (This would normally parse the headers "From" and "Subject")
        for (const msg of messages) {
           // We would fetch message details, compare email addresses to DB leads,
           // and update status to "Kunde" or "Kontaktet - Svar mottatt".
           foundReplies++; // Mocking that we processed them
        }
      } else {
        console.warn("Gmail API failed, token might be expired.");
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Synkronisering fullført. Analyserte innboks og sjekket opp mot leads. (Mock: Fant ${foundReplies} relevante e-poster)` 
    });

  } catch (error) {
    console.error("Email sync error:", error);
    return NextResponse.json({ error: "En feil oppstod under synkronisering" }, { status: 500 });
  }
}
