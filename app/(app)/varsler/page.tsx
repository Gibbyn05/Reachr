"use client";
import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { Lead } from "@/lib/mock-data";
import {
  Bell, Phone, Calendar, Clock, Check, RotateCcw, X,
  ChevronRight, ChevronDown, CheckCircle2,
  Building2, Users, MapPin, TrendingUp, Hash, Mail, PhoneCall,
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
const typeBorderColors: Record<NotifType, string> = {
  "follow-up": "border-[#ff470a]/20",
  reminder: "border-[#09fe94]/30",
  meeting: "border-[#ffad0a]/30",
};
const typeHeaderColors: Record<NotifType, string> = {
  "follow-up": "bg-[#ff470a]/8 border-b border-[#ff470a]/15",
  reminder: "bg-[#09fe94]/8 border-b border-[#09fe94]/20",
  meeting: "bg-[#ffad0a]/8 border-b border-[#ffad0a]/20",
};
const typeLabels: Record<NotifType, string> = {
  "follow-up": "Trenger oppfølging",
  reminder: "Venter på svar",
  meeting: "Kommende møter",
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
        message: `Ikke kontaktet ennå — lagt til ${addedDate.toLocaleDateString("nb-NO")}` });
    }
    if (lead.status === "Kontaktet - ikke svar" && (!lastContact || lastContact <= twoDaysAgo)) {
      const days = lastContact ? Math.floor((now.getTime() - lastContact.getTime()) / 86400000) : null;
      notifs.push({ id: `nis-${lead.id}`, company: lead.name, type: "reminder", leadId: lead.id,
        date: lead.lastContacted ?? lead.addedDate,
        message: `Svarte ikke — prøv igjen${days !== null ? ` (${days} dager siden)` : ""}` });
    }
    if (lead.status === "Kontaktet" && lastContact && lastContact <= threeDaysAgo) {
      const days = Math.floor((now.getTime() - lastContact.getTime()) / 86400000);
      notifs.push({ id: `c-${lead.id}`, company: lead.name, type: "follow-up", leadId: lead.id,
        date: lead.lastContacted!, message: `${days} dager siden sist kontakt` });
    }
    if (lead.status === "Booket møte") {
      notifs.push({ id: `m-${lead.id}`, company: lead.name, type: "meeting", leadId: lead.id,
        date: lead.lastContacted ?? lead.addedDate,
        message: `Møte booket${lead.lastContacted ? ` — ${new Date(lead.lastContacted).toLocaleDateString("nb-NO")}` : ""}` });
    }
  }
  return notifs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function LeadInfoDropdown({ lead }: { lead: Lead }) {
  return (
    <div className="mt-3 pt-3 border-t border-[#e8e4d8] grid grid-cols-2 gap-x-4 gap-y-2">
      {lead.orgNumber && (
        <div className="flex items-center gap-1.5 text-xs text-[#6b6660]">
          <Hash className="w-3 h-3 text-[#a09b8f] shrink-0" /><span>{lead.orgNumber}</span>
        </div>
      )}
      {lead.industry && (
        <div className="flex items-center gap-1.5 text-xs text-[#6b6660]">
          <Building2 className="w-3 h-3 text-[#a09b8f] shrink-0" /><span className="truncate">{lead.industry}</span>
        </div>
      )}
      {lead.city && (
        <div className="flex items-center gap-1.5 text-xs text-[#6b6660]">
          <MapPin className="w-3 h-3 text-[#a09b8f] shrink-0" /><span>{lead.city}</span>
        </div>
      )}
      {lead.employees > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-[#6b6660]">
          <Users className="w-3 h-3 text-[#a09b8f] shrink-0" /><span>{lead.employees} ansatte</span>
        </div>
      )}
      {lead.revenue > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-[#6b6660]">
          <TrendingUp className="w-3 h-3 text-[#a09b8f] shrink-0" /><span>{(lead.revenue / 1_000_000).toFixed(1)} MNOK</span>
        </div>
      )}
      {lead.phone && lead.phone !== "—" && (
        <div className="flex items-center gap-1.5 text-xs text-[#6b6660]">
          <PhoneCall className="w-3 h-3 text-[#a09b8f] shrink-0" /><span>{lead.phone}</span>
        </div>
      )}
      {lead.email && lead.email !== "—" && (
        <div className="flex items-center gap-1.5 text-xs text-[#6b6660] col-span-2">
          <Mail className="w-3 h-3 text-[#a09b8f] shrink-0" /><span className="truncate">{lead.email}</span>
        </div>
      )}
    </div>
  );
}

function NotifCard({
  notif, isDone, leads, expandedIds, toggleExpand, onDone, onUndone, onDismiss,
}: {
  notif: ComputedNotif;
  isDone: boolean;
  leads: Lead[];
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  onDone: (id: string) => void;
  onUndone: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const Icon = typeIcons[notif.type];
  const isExpanded = expandedIds.has(notif.id);
  const lead = leads.find(l => l.id === notif.leadId);

  return (
    <div className={`bg-[#faf8f2] rounded-xl border ${typeBorderColors[notif.type]} p-4 transition-all ${isDone ? "opacity-50" : "hover:shadow-sm"}`}
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 ${typeColors[notif.type]} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#171717] truncate">{notif.company}</p>
          <p className="text-xs text-[#6b6660] mt-0.5 leading-relaxed">{notif.message}</p>
          <div className="flex items-center justify-between mt-2.5 gap-2">
            <button onClick={() => toggleExpand(notif.id)}
              className="text-xs text-[#a09b8f] hover:text-[#6b6660] flex items-center gap-1 transition-colors">
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              {new Date(notif.date).toLocaleDateString("nb-NO", { day: "numeric", month: "short" })}
            </button>
            {!isDone ? (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => alert("Utsatt til i morgen")}
                  className="p-1.5 rounded-lg text-[#a09b8f] hover:text-[#6b6660] hover:bg-[#e8e4d8] transition-all" title="Utsett">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDone(notif.id)}
                  className="p-1.5 rounded-lg bg-[#09fe94]/15 text-[#05c472] hover:bg-[#09fe94]/25 transition-all" title="Merk ferdig">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDismiss(notif.id)}
                  className="p-1.5 rounded-lg text-[#d8d3c5] hover:text-[#a09b8f] hover:bg-[#e8e4d8] transition-all" title="Avvis">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#05c472]" />
                <button onClick={() => onUndone(notif.id)} className="text-xs text-[#a09b8f] hover:text-[#6b6660] underline">Angre</button>
              </div>
            )}
          </div>
          {isExpanded && lead && <LeadInfoDropdown lead={lead} />}
        </div>
      </div>
    </div>
  );
}

const COLUMNS: { type: NotifType; label: string }[] = [
  { type: "follow-up", label: "Trenger oppfølging" },
  { type: "reminder",  label: "Venter på svar" },
  { type: "meeting",   label: "Kommende møter" },
];

export default function VarslerPage() {
  const { leads } = useAppStore();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [doneIds, setDoneIds]     = useState<Set<string>>(new Set());
  const [showDone, setShowDone]   = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) =>
    setExpandedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const onDone    = (id: string) => setDoneIds(prev => new Set([...prev, id]));
  const onUndone  = (id: string) => setDoneIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  const onDismiss = (id: string) => setDismissed(prev => new Set([...prev, id]));

  const allNotifs = useMemo(() => buildNotifications(leads), [leads]);
  const visible   = allNotifs.filter(n => !dismissed.has(n.id));
  const active    = visible.filter(n => !doneIds.has(n.id));
  const done      = visible.filter(n => doneIds.has(n.id));

  const byType = (type: NotifType) => active.filter(n => n.type === type);

  return (
    <div>
      <TopBar title="Varsler" subtitle={`${active.length} aktive oppfølginger`} />
      <div className="p-4 sm:p-8 space-y-6">

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {COLUMNS.map(({ type, label }) => {
            const Icon = typeIcons[type];
            const count = byType(type).length;
            return (
              <div key={type} className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-5 flex items-center gap-4"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <div className={`w-11 h-11 ${typeColors[type]} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#171717]">{count}</p>
                  <p className="text-sm text-[#6b6660]">{label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-column kanban */}
        {active.length === 0 ? (
          <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-16 text-center">
            <Bell className="w-12 h-12 text-[#d8d3c5] mx-auto mb-4" />
            <p className="text-[#6b6660] font-medium">
              {leads.length === 0 ? "Ingen leads i pipelinen ennå" : "Ingen aktive varsler – du er à jour!"}
            </p>
            <p className="text-sm text-[#a09b8f] mt-1">
              {leads.length === 0
                ? <><a href="/leadsok" className="text-[#09fe94] font-medium hover:underline">Søk etter leads</a> for å komme i gang.</>
                : "Varsler genereres automatisk basert på aktivitet i pipelinen."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {COLUMNS.map(({ type, label }) => {
              const Icon = typeIcons[type];
              const cards = byType(type);
              return (
                <div key={type} className={`rounded-xl border ${typeBorderColors[type]} bg-[#faf8f2] overflow-hidden`}
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  {/* Column header */}
                  <div className={`${typeHeaderColors[type]} px-4 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${typeColors[type].split(" ")[1]}`} />
                      <span className="text-sm font-semibold text-[#171717]">{label}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeColors[type]}`}>
                      {cards.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="p-3 space-y-2.5 min-h-[120px]">
                    {cards.length === 0 ? (
                      <div className="flex items-center justify-center h-20">
                        <p className="text-xs text-[#c5bfb0]">Ingen varsler her</p>
                      </div>
                    ) : cards.map(notif => (
                      <NotifCard key={notif.id} notif={notif} isDone={false} leads={leads}
                        expandedIds={expandedIds} toggleExpand={toggleExpand}
                        onDone={onDone} onUndone={onUndone} onDismiss={onDismiss} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Fullførte (collapsible) */}
        {done.length > 0 && (
          <div>
            <button onClick={() => setShowDone(v => !v)}
              className="flex items-center gap-2 text-sm font-medium text-[#6b6660] hover:text-[#3d3a34] transition-colors mb-3">
              {showDone ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              Fullførte ({done.length})
            </button>
            {showDone && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {done.map(notif => (
                  <NotifCard key={notif.id} notif={notif} isDone leads={leads}
                    expandedIds={expandedIds} toggleExpand={toggleExpand}
                    onDone={onDone} onUndone={onUndone} onDismiss={onDismiss} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
