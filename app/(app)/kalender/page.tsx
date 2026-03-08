"use client";
import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { useAppStore } from "@/store/app-store";
import { ChevronLeft, ChevronRight, Calendar, Clock, Building2, Phone, Mail } from "lucide-react";
import Link from "next/link";

const MONTHS_NO = ["Januar","Februar","Mars","April","Mai","Juni","Juli","August","September","Oktober","November","Desember"];
const DAYS_NO = ["Man","Tir","Ons","Tor","Fre","Lør","Søn"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

export default function KalenderPage() {
  const { leads, meetingDates } = useAppStore();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  // Build meeting map: dateKey (YYYY-MM-DD) → leads
  const meetingMap = new Map<string, typeof leads>();
  for (const lead of leads) {
    const dt = meetingDates[lead.id];
    if (!dt) continue;
    const key = dt.slice(0, 10);
    if (!meetingMap.has(key)) meetingMap.set(key, []);
    meetingMap.get(key)!.push(lead);
  }
  // Also include leads with status "Booket møte" but tracked via lastContacted
  for (const lead of leads) {
    if (lead.status === "Booket møte" && lead.lastContacted && !meetingDates[lead.id]) {
      const key = lead.lastContacted;
      if (!meetingMap.has(key)) meetingMap.set(key, []);
      if (!meetingMap.get(key)!.find(l => l.id === lead.id)) {
        meetingMap.get(key)!.push(lead);
      }
    }
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const selectedKey = selectedDay
    ? `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    : null;
  const selectedMeetings = selectedKey ? (meetingMap.get(selectedKey) ?? []) : [];

  // All meetings this month for the list
  const monthMeetings: { lead: (typeof leads)[0]; date: string; time: string }[] = [];
  for (const [key, mLeads] of meetingMap.entries()) {
    if (!key.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`)) continue;
    for (const lead of mLeads) {
      const dt = meetingDates[lead.id] ?? key;
      const d = new Date(dt);
      monthMeetings.push({
        lead,
        date: key,
        time: meetingDates[lead.id]
          ? d.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })
          : "—",
      });
    }
  }
  monthMeetings.sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <TopBar title="Kalender" subtitle="Oversikt over bookede møter" />

      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar grid */}
          <div className="lg:col-span-2 bg-[#faf8f2] rounded-xl border border-[#d8d3c5]" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e4d8]">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[#e8e4d8] transition-colors">
                <ChevronLeft className="w-4 h-4 text-[#6b6660]" />
              </button>
              <h2 className="font-bold text-[#171717]">
                {MONTHS_NO[viewMonth]} {viewYear}
              </h2>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-[#e8e4d8] transition-colors">
                <ChevronRight className="w-4 h-4 text-[#6b6660]" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 px-4 pt-3 pb-1">
              {DAYS_NO.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-[#a09b8f] py-1">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 px-4 pb-4 gap-1">
              {Array.from({ length: totalCells }).map((_, i) => {
                const dayNum = i - firstDay + 1;
                const isValid = dayNum >= 1 && dayNum <= daysInMonth;
                if (!isValid) return <div key={i} />;

                const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const meetings = meetingMap.get(dateKey) ?? [];
                const isToday = dayNum === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                const isSelected = dayNum === selectedDay;

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(isSelected ? null : dayNum)}
                    className={`relative flex flex-col items-center justify-start p-1.5 rounded-lg min-h-[48px] transition-all text-left ${
                      isSelected
                        ? "bg-[#171717] text-white"
                        : isToday
                          ? "bg-[#09fe94]/20 text-[#171717]"
                          : "hover:bg-[#f0ece0] text-[#171717]"
                    }`}
                  >
                    <span className={`text-xs font-semibold ${isSelected ? "text-white" : isToday ? "text-[#05c472]" : "text-[#6b6660]"}`}>
                      {dayNum}
                    </span>
                    {meetings.length > 0 && (
                      <div className="flex flex-wrap gap-0.5 mt-0.5 justify-center">
                        {meetings.slice(0, 3).map((m, mi) => (
                          <span
                            key={mi}
                            className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#09fe94]" : "bg-[#ffad0a]"}`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: selected day or month list */}
          <div className="space-y-4">
            {selectedDay && selectedKey ? (
              <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <h3 className="font-semibold text-[#171717] mb-4">
                  {selectedDay}. {MONTHS_NO[viewMonth].toLowerCase()}
                </h3>
                {selectedMeetings.length === 0 ? (
                  <p className="text-sm text-[#a09b8f]">Ingen møter denne dagen</p>
                ) : (
                  <div className="space-y-3">
                    {selectedMeetings.map(lead => {
                      const dt = meetingDates[lead.id];
                      const time = dt
                        ? new Date(dt).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })
                        : "—";
                      return (
                        <div key={lead.id} className="p-3 bg-[#f2efe3] rounded-lg border border-[#e8e4d8]">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#ffad0a] shrink-0" />
                            <span className="text-xs font-semibold text-[#c47e00]">{time}</span>
                          </div>
                          <p className="text-sm font-bold text-[#171717]">{lead.name}</p>
                          <p className="text-xs text-[#6b6660] flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />{lead.industry} · {lead.city}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            {lead.phone && lead.phone !== "—" && (
                              <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-xs text-[#6b6660] hover:text-[#ff470a]">
                                <Phone className="w-3 h-3" />{lead.phone}
                              </a>
                            )}
                            {lead.email && lead.email !== "—" && (
                              <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-xs text-[#6b6660] hover:text-[#ff470a]">
                                <Mail className="w-3 h-3" />E-post
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <h3 className="font-semibold text-[#171717] mb-1">Møter i {MONTHS_NO[viewMonth].toLowerCase()}</h3>
                <p className="text-xs text-[#a09b8f] mb-4">{monthMeetings.length} møter totalt</p>
                {monthMeetings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-8 h-8 text-[#d8d3c5] mx-auto mb-2" />
                    <p className="text-sm text-[#a09b8f]">Ingen bookede møter</p>
                    <Link href="/mine-leads" className="text-xs text-[#ff470a] hover:underline mt-1 block">
                      Book et møte i Mine Leads
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {monthMeetings.map(({ lead, date, time }) => (
                      <div key={lead.id + date} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#f0ece0] transition-colors">
                        <div className="w-9 h-9 bg-[#ffad0a]/15 rounded-lg flex items-center justify-center text-xs font-bold text-[#c47e00] shrink-0">
                          {new Date(date).getDate()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#171717] truncate">{lead.name}</p>
                          <p className="text-xs text-[#a09b8f]">{time !== "—" ? time : MONTHS_NO[viewMonth].slice(0, 3)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-4 grid grid-cols-2 gap-3" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <div className="text-center">
                <p className="text-xl font-extrabold text-[#171717]">{monthMeetings.length}</p>
                <p className="text-xs text-[#6b6660]">Denne måneden</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-extrabold text-[#171717]">
                  {[...meetingMap.entries()].filter(([k]) => k >= today.toISOString().slice(0, 10)).reduce((s, [,v]) => s + v.length, 0)}
                </p>
                <p className="text-xs text-[#6b6660]">Kommende</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
