"use client";
import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { Lead } from "@/lib/mock-data";
import {
  Bell, Phone, Calendar, Clock, Check, RotateCcw, X,
  ChevronRight, AlertCircle, CheckCircle2,
} from "lucide-react";

type NotifType = "follow-up" | "reminder" | "meeting";

interface ComputedNotif {
  id: string;
  company: string;
  message: string;
  date: string;
  type: NotifType;
  leadId: string;
}

const typeIcons: Record<NotifType, typeof Bell> = {
  "follow-up": Phone,
  reminder: Clock,
  meeting: Calendar,
};
const typeColors: Record<NotifType, string> = {
  "follow-up": "bg-[#ff470a]/10 text-[#ff470a]",
  reminder: "bg-[#09fe94]/10 text-[#05c472]",
  meeting: "bg-[#ffad0a]/12 text-[#c47e00]",
};
const typeLabels: Record<NotifType, string> = {
  "follow-up": "Oppfølging",
  reminder: "Påminnelse",
  meeting: "Møte",
};

function buildNotifications(leads: Lead[]): ComputedNotif[] {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const notifs: ComputedNotif[] = [];

  for (const lead of leads) {
    const addedDate = new Date(lead.addedDate);
    const lastContact = lead.lastContacted ? new Date(lead.lastContacted) : null;

    if (lead.status === "Ikke kontaktet" && addedDate <= twoDaysAgo) {
      notifs.push({ id: `nc-${lead.id}`, company: lead.name, type: "follow-up", leadId: lead.id, date: lead.addedDate,
        message: `${lead.name} er ikke kontaktet ennå — lagt til ${addedDate.toLocaleDateString("nb-NO")}` });
    }
    if (lead.status === "Kontaktet - ikke svar" && (!lastContact || lastContact <= twoDaysAgo)) {
      const days = lastContact ? Math.floor((now.getTime() - lastContact.getTime()) / 86400000) : null;
      notifs.push({ id: `nis-${lead.id}`, company: lead.name, type: "reminder", leadId: lead.id,
        date: lead.lastContacted ?? lead.addedDate,
        message: `${lead.name} svarte ikke — prøv igjen${days !== null ? ` (${days} dager siden sist)` : ""}` });
    }
    if (lead.status === "Kontaktet" && lastContact && lastContact <= threeDaysAgo) {
      const days = Math.floor((now.getTime() - lastContact.getTime()) / 86400000);
      notifs.push({ id: `c-${lead.id}`, company: lead.name, type: "follow-up", leadId: lead.id,
        date: lead.lastContacted!, message: `${lead.name} — ${days} dager siden sist kontakt` });
    }
    if (lead.status === "Booket møte") {
      notifs.push({ id: `m-${lead.id}`, company: lead.name, type: "meeting", leadId: lead.id,
        date: lead.lastContacted ?? lead.addedDate,
        message: `Møte booket med ${lead.name}${lead.lastContacted ? ` — ${new Date(lead.lastContacted).toLocaleDateString("nb-NO")}` : ""}` });
    }
  }
  return notifs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function VarslerPage() {
  const { leads } = useAppStore();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"active" | "done">("active");

  const allNotifs = useMemo(() => buildNotifications(leads), [leads]);
  const visible = allNotifs.filter((n) => !dismissed.has(n.id));
  const activeNotifs = visible.filter((n) => !doneIds.has(n.id));
  const doneNotifs = visible.filter((n) => doneIds.has(n.id));
  const displayed = activeTab === "active" ? activeNotifs : doneNotifs;

  return (
    <div>
      <TopBar title="Varsler" subtitle={`${activeNotifs.length} aktive oppfølginger`} />
      <div className="p-8 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Venter på svar", count: activeNotifs.filter(n => n.type === "follow-up").length, icon: Phone, color: "bg-[#ff470a]/10", iconColor: "text-[#ff470a]" },
            { label: "Påminnelser", count: activeNotifs.filter(n => n.type === "reminder").length, icon: Clock, color: "bg-[#09fe94]/10", iconColor: "text-[#05c472]" },
            { label: "Kommende møter", count: activeNotifs.filter(n => n.type === "meeting").length, icon: Calendar, color: "bg-[#ffad0a]/12", iconColor: "text-[#c47e00]" },
          ].map(({ label, count, icon: Icon, color, iconColor }) => (
            <div key={label} className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-5 flex items-center gap-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}><Icon className={`w-6 h-6 ${iconColor}`} /></div>
              <div><p className="text-2xl font-extrabold text-[#171717]">{count}</p><p className="text-sm text-[#6b6660]">{label}</p></div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[#e8e4d8] p-1 rounded-lg w-fit">
          {[["active", "Aktive", AlertCircle, activeNotifs.length], ["done", "Fullførte", CheckCircle2, doneNotifs.length]].map(([tab, label, Icon, count]) => (
            <button key={tab as string} onClick={() => setActiveTab(tab as "active" | "done")}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab ? "bg-[#faf8f2] shadow-sm text-[#171717]" : "text-[#6b6660] hover:text-[#3d3a34]"}`}>
              {/* @ts-ignore */}
              <Icon className="w-4 h-4" />{label} ({count})
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {displayed.length === 0 ? (
            <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-16 text-center">
              <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-[#6b6660] font-medium">
                {activeTab === "active" ? (leads.length === 0 ? "Ingen leads i pipelinen ennå" : "Ingen aktive varsler – du er à jour!") : "Ingen fullførte varsler"}
              </p>
              <p className="text-sm text-[#a09b8f] mt-1">
                {activeTab === "active" && leads.length === 0
                  ? <><a href="/leadsok" className="text-green-600 font-medium hover:underline">Søk etter leads</a> for å komme i gang.</>
                  : "Varsler genereres automatisk basert på aktivitet i pipelinen."}
              </p>
            </div>
          ) : displayed.map((notif) => {
            const Icon = typeIcons[notif.type];
            const isDone = doneIds.has(notif.id);
            return (
              <div key={notif.id} className={`bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-5 flex items-start gap-4 transition-all ${isDone ? "opacity-60" : "hover:shadow-sm hover:border-[#c5bfb0]"}`} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <div className={`w-10 h-10 ${typeColors[notif.type]} rounded-xl flex items-center justify-center flex-shrink-0`}><Icon className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[notif.type]}`}>{typeLabels[notif.type]}</span>
                    <span className="text-xs text-[#a09b8f]">{new Date(notif.date).toLocaleDateString("nb-NO", { day: "numeric", month: "long" })}</span>
                  </div>
                  <p className="text-sm text-[#3d3a34] mb-1">{notif.message}</p>
                  <p className="text-xs text-[#a09b8f] flex items-center gap-1"><ChevronRight className="w-3 h-3" />{notif.company}</p>
                </div>
                {!isDone ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => alert("Utsatt til i morgen")} className="text-gray-600"><RotateCcw className="w-3.5 h-3.5" />Utsett</Button>
                    <Button variant="primary" size="sm" onClick={() => setDoneIds(prev => new Set([...prev, notif.id]))}><Check className="w-3.5 h-3.5" />Ferdig</Button>
                    <button onClick={() => setDismissed(prev => new Set([...prev, notif.id]))} className="p-1.5 text-gray-300 hover:text-[#6b6660]"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium"><CheckCircle2 className="w-4 h-4" />Fullført</div>
                    <button onClick={() => setDoneIds(prev => { const n = new Set(prev); n.delete(notif.id); return n; })} className="text-xs text-[#a09b8f] hover:text-gray-600 underline">Angre</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
