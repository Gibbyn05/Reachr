"use client";
import React, { useState } from "react";
import { Mail, MailOpen, MousePointer2, Clock, Phone, ChevronDown, MessageSquare } from "lucide-react";

interface ParsedMessage {
  type: "email" | "sms" | "call";
  date: string;
  subject?: string;
  body: string;
  isoDate: Date;
}

function parseNotesForMessages(notes: string): ParsedMessage[] {
  if (!notes) return [];
  const entries = notes.split("\n\n---\n\n");
  const messages: ParsedMessage[] = [];

  for (const entry of entries) {
    // Email: "E-post sendt DD.MM.YYYY kl. HH:MM\nEmne: SUBJECT\n\nBODY"
    const emailMatch = entry.match(/^E-post sendt (\d{2})\.(\d{2})\.(\d{4}) kl\. (\d{2}):(\d{2})\nEmne: (.+?)\n\n([\s\S]*)/);
    if (emailMatch) {
      const isoDate = new Date(`${emailMatch[3]}-${emailMatch[2]}-${emailMatch[1]}T${emailMatch[4]}:${emailMatch[5]}:00`);
      messages.push({
        type: "email",
        date: `${emailMatch[1]}.${emailMatch[2]}.${emailMatch[3]} kl. ${emailMatch[4]}:${emailMatch[5]}`,
        subject: emailMatch[6],
        body: emailMatch[7],
        isoDate: isNaN(isoDate.getTime()) ? new Date(0) : isoDate,
      });
      continue;
    }
    // SMS: "SMS sendt DD.MM.YYYY kl. HH:MM\n\nTEXT"
    const smsMatch = entry.match(/^SMS sendt (\d{2})\.(\d{2})\.(\d{4}) kl\. (\d{2}):(\d{2})\n\n([\s\S]*)/);
    if (smsMatch) {
      const isoDate = new Date(`${smsMatch[3]}-${smsMatch[2]}-${smsMatch[1]}T${smsMatch[4]}:${smsMatch[5]}:00`);
      messages.push({
        type: "sms",
        date: `${smsMatch[1]}.${smsMatch[2]}.${smsMatch[3]} kl. ${smsMatch[4]}:${smsMatch[5]}`,
        body: smsMatch[6],
        isoDate: isNaN(isoDate.getTime()) ? new Date(0) : isoDate,
      });
      continue;
    }
    // Call: "📞 Loggført anrop (DD.MM.YYYY, HH:MM:SS):\nTRANSCRIPT"
    const callMatch = entry.match(/^📞 Loggført anrop \((.+?)\):\n([\s\S]*)/);
    if (callMatch) {
      messages.push({
        type: "call",
        date: callMatch[1],
        body: callMatch[2],
        isoDate: new Date(0),
      });
    }
  }

  return messages.sort((a, b) => b.isoDate.getTime() - a.isoDate.getTime());
}

export function ActivityTimeline({ activities, notes }: { activities: any[]; notes?: string }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const parsedMessages = notes ? parseNotesForMessages(notes) : [];
  const hasActivities = (activities && activities.length > 0) || parsedMessages.length > 0;

  if (!hasActivities) {
    return (
      <div className="py-8 text-center bg-[#faf8f2] rounded-xl border border-dashed border-[#d8d3c5]">
        <Clock className="w-8 h-8 text-[#d8d3c5] mx-auto mb-2" />
        <p className="text-xs text-[#a09b8f]">Ingen kommunikasjon registrert ennå.</p>
      </div>
    );
  }

  const toggle = (key: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {/* Tracked email activities from DB (open/click tracking) */}
      {activities && activities.map((log: any) => {
        const opens = log.email_events?.filter((e: any) => e.event_type === "open") || [];
        const clicks = log.email_events?.filter((e: any) => e.event_type === "click") || [];
        const sentDate = new Date(log.sent_at).toLocaleString("nb-NO", {
          day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
        });
        const key = `tracked-${log.id}`;
        const isExpanded = expanded.has(key);

        return (
          <div key={log.id} className="flex items-start gap-3 group">
            <div className="w-8 h-8 rounded-full bg-[#09fe94]/10 border border-[#09fe94]/30 flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-4 h-4 text-[#05c472]" />
            </div>
            <div className="flex-1 bg-[#faf8f2] border border-[#d8d3c5] rounded-xl p-3 group-hover:border-[#09fe94]/40 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-[#171717] leading-tight">{log.subject}</span>
                <span className="text-[10px] text-[#a09b8f] shrink-0">{sentDate}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold border text-[10px] ${
                  opens.length > 0
                    ? "bg-[#09fe94]/10 border-[#09fe94]/20 text-[#05c472]"
                    : "bg-[#f2efe3] border-[#e8e4d8] text-[#a09b8f]"
                }`}>
                  <MailOpen className="w-3 h-3" />
                  {opens.length > 0 ? `Åpnet ${opens.length}×` : "Ikke åpnet"}
                </span>
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold border text-[10px] ${
                  clicks.length > 0
                    ? "bg-[#ffad0a]/10 border-[#ffad0a]/20 text-[#c47e00]"
                    : "bg-[#f2efe3] border-[#e8e4d8] text-[#a09b8f]"
                }`}>
                  <MousePointer2 className="w-3 h-3" />
                  {clicks.length > 0 ? `${clicks.length} klikk` : "Ingen klikk"}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Parsed messages from notes (email, SMS, call) */}
      {parsedMessages.map((msg, i) => {
        const key = `parsed-${i}`;
        const isExpanded = expanded.has(key);
        const bodyTrimmed = msg.body?.trim() || "";
        const isLong = bodyTrimmed.length > 120;

        return (
          <div key={key} className="flex items-start gap-3 group">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
              msg.type === "email"
                ? "bg-[#09fe94]/10 border-[#09fe94]/30"
                : msg.type === "sms"
                ? "bg-[#ffad0a]/10 border-[#ffad0a]/30"
                : "bg-[#ff470a]/10 border-[#ff470a]/30"
            }`}>
              {msg.type === "email"
                ? <Mail className="w-4 h-4 text-[#05c472]" />
                : msg.type === "sms"
                ? <MessageSquare className="w-4 h-4 text-[#c47e00]" />
                : <Phone className="w-4 h-4 text-[#ff470a]" />}
            </div>
            <div className="flex-1 bg-[#faf8f2] border border-[#d8d3c5] rounded-xl p-3 group-hover:border-[#d8d3c5] transition-colors">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-[11px] font-bold text-[#171717] leading-tight">
                  {msg.type === "email"
                    ? `E-post: ${msg.subject || "Uten emne"}`
                    : msg.type === "sms"
                    ? "SMS sendt"
                    : "Anrop loggført"}
                </span>
                <span className="text-[10px] text-[#a09b8f] shrink-0">{msg.date}</span>
              </div>
              {bodyTrimmed && (
                <div>
                  <p className={`text-[11px] text-[#6b6660] whitespace-pre-wrap ${!isExpanded && isLong ? "line-clamp-2" : ""}`}>
                    {bodyTrimmed}
                  </p>
                  {isLong && (
                    <button
                      onClick={() => toggle(key)}
                      className="flex items-center gap-0.5 text-[10px] text-[#ff470a] hover:text-[#d63b08] mt-1 font-medium"
                    >
                      {isExpanded ? "Vis mindre" : "Vis mer"}
                      <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
