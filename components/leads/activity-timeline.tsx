import React from "react";
import { Mail, MailOpen, MousePointer2, Clock } from "lucide-react";

export function ActivityTimeline({ activities }: { activities: any[] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-[#e8e4d8]">
        <Clock className="w-8 h-8 text-[#d8d3c5] mx-auto mb-2" />
        <p className="text-xs text-[#a09b8f]">Ingen aktivitet registrert ennå.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#e8e4d8] before:to-transparent">
      {activities.map((log: any, i: number) => {
        const opens = log.email_events?.filter((e: any) => e.event_type === "open") || [];
        const clicks = log.email_events?.filter((e: any) => e.event_type === "click") || [];
        const sentDate = new Date(log.sent_at).toLocaleString("nb-NO", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        });

        return (
          <div key={log.id} className="relative flex items-start gap-4 group">
            <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#d8d3c5] shadow-sm shrink-0 group-hover:border-accent group-hover:shadow-md transition-all">
              <Mail className="w-5 h-5 text-[#6b6660]" />
            </div>
            <div className="flex-1 bg-white border border-[#d8d3c5] rounded-xl p-3 shadow-sm group-hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-[#171717]">{log.subject}</span>
                <span className="text-[10px] text-[#a09b8f]">{sentDate}</span>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${opens.length > 0 ? "bg-accent/10 border-accent/20 text-accent-dark" : "bg-gray-50 border-gray-100 text-[#a09b8f]"}`}>
                  <MailOpen className="w-3 h-3" />
                  {opens.length > 0 ? `Åpnet ${opens.length} gang(er)` : "Ikke åpnet"}
                </div>
                
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${clicks.length > 0 ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-gray-50 border-gray-100 text-[#a09b8f]"}`}>
                  <MousePointer2 className="w-3 h-3" />
                  {clicks.length > 0 ? `${clicks.length} klikk` : "Ingen klikk"}
                </div>
              </div>

              {(opens.length > 0 || clicks.length > 0) && (
                <div className="mt-2 pt-2 border-t border-gray-50">
                  <p className="text-[9px] text-[#a09b8f] italic">
                    Siste aktivitet: {new Date(Math.max(...log.email_events.map((e: any) => new Date(e.occurred_at).getTime()))).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
