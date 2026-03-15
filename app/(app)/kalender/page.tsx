"use client";
import { TopBar } from "@/components/layout/top-bar";
import { useAppStore } from "@/store/app-store";
import {
  CalendarCheck2, CheckCircle2, Clock, Phone, ArrowRight, User,
  Mic, Square, Search, Sparkles, BarChart3, Plus, ExternalLink,
  ChevronLeft, ChevronRight, Inbox
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

function makeGoogleCalendarUrl(title: string, datetime: string): string {
  const start = new Date(datetime);
  const end = new Date(start.getTime() + 60 * 60000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(start)}/${fmt(end)}`;
}
function makeOutlookCalendarUrl(title: string, datetime: string): string {
  const start = new Date(datetime);
  const end = new Date(start.getTime() + 60 * 60000);
  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&allday=false&path=%2Fcalendar%2Faction%2Fcompose`;
}

const NB_DAYS = ["man", "tir", "ons", "tor", "fre", "lør", "søn"];
const NB_MONTHS = [
  "Januar","Februar","Mars","April","Mai","Juni",
  "Juli","August","September","Oktober","November","Desember"
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
// 0=Sun,1=Mon … → we want Mon=0
function getStartDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7; // Mon-based
}

export default function KalenderPage() {
  const { currentUser, leads, meetingDates, setMeetingDate, updateLeadNotes } = useAppStore();

  // Calendar navigation
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());

  // Task completion
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  // Modals
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  // Call log state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // New meeting form state
  const [meetingLeadId, setMeetingLeadId] = useState("");
  const [meetingLeadSearch, setMeetingLeadSearch] = useState("");
  const [meetingDate, setMeetingDateState] = useState("");
  const [meetingTime, setMeetingTime] = useState("10:00");
  const [savingMeeting, setSavingMeeting] = useState(false);

  const filteredLeadsForSelect = leads.filter(l =>
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.contactPerson?.toLowerCase().includes(leadSearch.toLowerCase())
  );
  const filteredLeadsForMeeting = leads.filter(l =>
    l.name.toLowerCase().includes(meetingLeadSearch.toLowerCase()) ||
    l.contactPerson?.toLowerCase().includes(meetingLeadSearch.toLowerCase())
  );

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // ── Audio recording ────────────────────────────────────────────────────────
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioBlob.size < 1000) { toast.warning("Opptaket var tomt. Prøv igjen."); return; }
        setIsTranscribing(true);
        toast.info("✨ Transkriberer med AI...", { duration: 4000 });
        try {
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");
          const res = await fetch("/api/transcribe", { method: "POST", body: formData });
          const data = await res.json();
          if (data.transcript) {
            setTranscribedText(prev => prev + (prev ? " " : "") + data.transcript.trim());
            toast.success("Transkribert!");
          } else { toast.error("Klarte ikke transkribere. Prøv igjen."); }
        } catch { toast.error("Serverfeil ved transkribering."); }
        finally { setIsTranscribing(false); }
      };
      recorder.start();
      setIsRecording(true);
      toast.info("🎤 Tar opp... Trykk STOPP når du er ferdig.", { duration: 3000 });
    } catch (e: any) {
      if (e.name === "NotAllowedError") {
        toast.error("🚫 Mikrofontilgang nektet. Klikk hengelåsen i adressefeltet og tillat mikrofon.");
      } else { toast.error("Kunne ikke starte mikrofon: " + e.message); }
    }
  };

  const handleSaveCall = async () => {
    if (!selectedLeadId) { toast.error("Vennligst velg en bedrift først."); return; }
    const lead = leads.find(l => l.id === selectedLeadId);
    if (!lead) return;
    const nowStr = new Date().toLocaleString("nb-NO");
    const newNote = `📞 Loggført anrop (${nowStr}):\n${transcribedText}`;
    const combined = lead.notes && lead.notes !== "—"
      ? `${newNote}\n\n---\n\n${lead.notes}` : newNote;
    try {
      await updateLeadNotes(selectedLeadId, combined);
      setShowCallModal(false);
      setTranscribedText(""); setSelectedLeadId(""); setLeadSearch("");
      toast.success(`Samtale med ${lead.name} er loggført!`);
    } catch { toast.error("Kunne ikke lagre samtalen."); }
  };

  const handleSaveMeeting = async () => {
    if (!meetingLeadId) { toast.error("Velg en bedrift."); return; }
    if (!meetingDate) { toast.error("Velg en dato."); return; }
    setSavingMeeting(true);
    try {
      const datetime = `${meetingDate}T${meetingTime}:00`;
      await setMeetingDate(meetingLeadId, datetime);
      const lead = leads.find(l => l.id === meetingLeadId);
      toast.success(`Møte med ${lead?.name || "lead"} er booket!`);
      setShowMeetingModal(false);
      setMeetingLeadId(""); setMeetingLeadSearch(""); setMeetingDateState(""); setMeetingTime("10:00");
    } catch { toast.error("Kunne ikke lagre møte."); }
    finally { setSavingMeeting(false); }
  };

  // ── Task generation (today) ────────────────────────────────────────────────
  const todayStr = now.toISOString().split("T")[0];
  const allTasks = leads.flatMap((lead) => {
    const result = [];
    const meetingDt = meetingDates[lead.id];
    if (meetingDt && (lead.status === "Booket møte" || lead.status === "Kunde")) {
      const d = new Date(meetingDt);
      if (!isNaN(d.getTime())) {
        const dayStr = d.toISOString().split("T")[0];
        const isToday = dayStr === todayStr;
        const timeStr = d.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
        const dateStr = d.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
        result.push({
          id: `meet-${lead.id}`, type: "meeting" as const,
          title: `Møte med ${lead.contactPerson || "kontaktperson"}`,
          leadName: lead.name, leadId: lead.id,
          time: isToday ? timeStr : `${dateStr}, ${timeStr}`,
          isToday, fullDate: d,
          dayStr,
        });
      }
    }
    if (lead.status === "Kontaktet - ikke svar" && lead.lastContacted) {
      const followUpDate = new Date(lead.lastContacted);
      followUpDate.setDate(followUpDate.getDate() + 2);
      if (followUpDate <= now) {
        result.push({
          id: `follow-${lead.id}`, type: "followup" as const,
          title: "Følg opp (ikke svar)",
          leadName: lead.name, leadId: lead.id,
          time: "Hele dagen", isToday: true,
          fullDate: followUpDate, dayStr: todayStr,
        });
      }
    }
    return result;
  });

  const todayTasks = allTasks.filter(t => t.isToday);

  // ── Calendar helpers ───────────────────────────────────────────────────────
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const startDay = getStartDayOfMonth(viewYear, viewMonth);
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  // Build event map: "YYYY-MM-DD" → task[]
  const eventsByDay: Record<string, typeof allTasks> = {};
  allTasks.forEach(t => {
    if (!eventsByDay[t.dayStr]) eventsByDay[t.dayStr] = [];
    eventsByDay[t.dayStr].push(t);
  });

  const selectedDayStr = selectedDay !== null
    ? `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}`
    : null;
  const selectedDayEvents = selectedDayStr ? (eventsByDay[selectedDayStr] || []) : [];

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };
  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };
  const goToToday = () => {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDay(now.getDate());
  };

  const toggleTask = (id: string) => {
    setCompletedTasks(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#f2efe3] dark:bg-[#0a0a0a] transition-colors duration-500">
      <TopBar title="Kalender" subtitle="Oversikt over møter, oppfølginger og dagsplan" />

      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#09fe94] uppercase tracking-[0.2em] mb-1">Kalender</p>
            <h1 className="text-3xl font-black text-[#171717] dark:text-white">
              God dag, {currentUser?.name?.split(" ")[0] || "Selger"}!
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={goToToday}
              className="text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-[#09fe94] text-black hover:bg-[#00e882] transition-all"
            >
              I dag
            </button>
            <div className="flex items-center gap-2 bg-[#faf8f2] dark:bg-[#141414] border border-[#d8d3c5] dark:border-[#262626] rounded-2xl px-5 py-3">
              <CalendarCheck2 className="w-5 h-5 text-[#09fe94]" />
              <span className="text-sm font-bold text-[#171717] dark:text-white">
                {now.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Calendar Grid ── */}
          <div className="lg:col-span-2 bg-[#faf8f2] dark:bg-[#141414] border border-[#d8d3c5] dark:border-[#262626] rounded-[2rem] p-6 shadow-sm">

            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={goToPrevMonth}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#d8d3c5] dark:border-[#262626] hover:bg-[#e8e4d8] dark:hover:bg-[#1f1f1f] transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#6b6660]" />
              </button>
              <h2 className="text-lg font-black text-[#171717] dark:text-white">
                {NB_MONTHS[viewMonth]} {viewYear}
              </h2>
              <button
                onClick={goToNextMonth}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#d8d3c5] dark:border-[#262626] hover:bg-[#e8e4d8] dark:hover:bg-[#1f1f1f] transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#6b6660]" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {NB_DAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-[#a09b8f] py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: totalCells }).map((_, idx) => {
                const dayNum = idx - startDay + 1;
                const isValid = dayNum >= 1 && dayNum <= daysInMonth;
                const dayStr = isValid
                  ? `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(dayNum).padStart(2,"0")}`
                  : null;
                const isToday = dayStr === todayStr;
                const isSelected = isValid && dayNum === selectedDay;
                const events = dayStr ? (eventsByDay[dayStr] || []) : [];
                const meetings = events.filter(e => e.type === "meeting");
                const followups = events.filter(e => e.type === "followup");

                return (
                  <button
                    key={idx}
                    disabled={!isValid}
                    onClick={() => isValid && setSelectedDay(dayNum)}
                    className={`relative group min-h-[68px] rounded-xl p-1.5 flex flex-col transition-all duration-200 ${
                      !isValid
                        ? "opacity-0 cursor-default"
                        : isSelected
                        ? "bg-[#171717] dark:bg-[#09fe94] shadow-lg"
                        : isToday
                        ? "bg-[#09fe94]/10 border-2 border-[#09fe94] hover:bg-[#09fe94]/20"
                        : "hover:bg-[#e8e4d8] dark:hover:bg-[#1f1f1f] border border-transparent"
                    }`}
                  >
                    {/* Day number */}
                    <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-lg mx-auto mb-1 transition-colors ${
                      isSelected
                        ? "text-[#09fe94] dark:text-black"
                        : isToday
                        ? "text-[#09fe94]"
                        : "text-[#171717] dark:text-white"
                    }`}>
                      {isValid ? dayNum : ""}
                    </span>

                    {/* Event dots */}
                    {isValid && (
                      <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                        {meetings.slice(0, 2).map(m => (
                          <div
                            key={m.id}
                            className={`text-[9px] font-black px-1 py-0.5 rounded-md truncate text-left ${
                              isSelected
                                ? "bg-[#09fe94] text-[#171717]"
                                : "bg-[#09fe94] text-[#171717]"
                            }`}
                          >
                            <span className="opacity-50">Møte· </span>{m.leadName}
                          </div>
                        ))}
                        {followups.slice(0, 1).map(f => (
                          <div
                            key={f.id}
                            className={`text-[9px] font-black px-1 py-0.5 rounded-md truncate text-left ${
                              isSelected
                                ? "bg-[#ffad0a] text-[#171717]"
                                : "bg-[#ffad0a] text-[#171717]"
                            }`}
                          >
                            <span className="opacity-50">Opf· </span>{f.leadName}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <span className="text-[9px] font-bold text-[#a09b8f]">+{events.length - 2} til</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#d8d3c5] dark:border-[#262626]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#09fe94]" />
                <span className="text-[10px] font-bold text-[#6b6660]">Møte</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#ffad0a]" />
                <span className="text-[10px] font-bold text-[#6b6660]">Oppfølging</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded border-2 border-[#09fe94] bg-[#09fe94]/10" />
                <span className="text-[10px] font-bold text-[#6b6660]">I dag</span>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-5">

            {/* Selected day detail */}
            <div className="bg-[#faf8f2] dark:bg-[#141414] border border-[#d8d3c5] dark:border-[#262626] rounded-3xl p-6 shadow-sm">
              <h3 className="font-black text-sm text-[#171717] dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-[#09fe94]" />
                {selectedDay !== null
                  ? `${selectedDay}. ${NB_MONTHS[viewMonth].toLowerCase()}`
                  : "Velg en dag"}
              </h3>

              {selectedDay === null ? (
                <p className="text-xs text-[#a09b8f] italic">Klikk på en dag i kalenderen for å se detaljer.</p>
              ) : selectedDayEvents.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-[#d8d3c5] dark:border-[#262626] rounded-2xl">
                  <p className="text-xs text-[#a09b8f] italic">Ingen hendelser denne dagen.</p>
                  <button
                    onClick={() => {
                      setMeetingDateState(selectedDayStr || "");
                      setShowMeetingModal(true);
                    }}
                    className="mt-3 text-[10px] font-black uppercase tracking-widest text-[#09fe94] hover:underline"
                  >
                    + Book møte
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayEvents.map(event => {
                    const meetingDt = event.type === "meeting" ? meetingDates[event.leadId] : null;
                    return (
                      <div
                        key={event.id}
                        className="p-3 bg-white dark:bg-[#1a1a1a] border border-[#d8d3c5] dark:border-[#262626] rounded-2xl"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl shrink-0 ${event.type === "meeting" ? "bg-[#09fe94]/15" : "bg-[#ffad0a]/15"}`}>
                            {event.type === "meeting"
                              ? <CalendarCheck2 className="w-3.5 h-3.5 text-[#09fe94]" />
                              : <Phone className="w-3.5 h-3.5 text-[#ffad0a]" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-[#171717] dark:text-white truncate">{event.title}</p>
                            <p className="text-[10px] text-[#6b6660] dark:text-[#a09b8f] font-medium flex items-center gap-1 mt-0.5">
                              <User className="w-3 h-3" /> {event.leadName}
                            </p>
                            <p className="text-[10px] font-bold text-[#a09b8f] mt-0.5">
                              <Clock className="w-3 h-3 inline mr-0.5" />{event.time}
                            </p>
                          </div>
                          <Link
                            href={`/mine-leads?id=${event.leadId}`}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#09fe94] text-[#6b6660] hover:text-black transition-all shrink-0"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        {meetingDt && (
                          <div className="flex gap-2 mt-2 ml-10">
                            <a
                              href={makeGoogleCalendarUrl(`Møte med ${event.leadName}`, meetingDt)}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[9px] font-semibold text-[#6b6660] hover:text-[#171717] border border-[#d8d3c5] dark:border-[#262626] rounded-lg px-2 py-1 bg-[#faf8f2] dark:bg-[#1a1a1a] transition-colors"
                            >
                              <ExternalLink className="w-2.5 h-2.5" /> Google
                            </a>
                            <a
                              href={makeOutlookCalendarUrl(`Møte med ${event.leadName}`, meetingDt)}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[9px] font-semibold text-[#6b6660] hover:text-[#171717] border border-[#d8d3c5] dark:border-[#262626] rounded-lg px-2 py-1 bg-[#faf8f2] dark:bg-[#1a1a1a] transition-colors"
                            >
                              <ExternalLink className="w-2.5 h-2.5" /> Outlook
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="bg-[#faf8f2] dark:bg-[#141414] border border-[#d8d3c5] dark:border-[#262626] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-sm text-[#171717] dark:text-white uppercase tracking-wider">Status (I dag)</h3>
                <div className="p-2 bg-[#09fe94]/10 rounded-xl">
                  <BarChart3 className="w-4 h-4 text-[#09fe94]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-2">
                  <span className="text-[#a09b8f]">Oppgaver fullført</span>
                  <span className="text-[#171717] dark:text-white">{completedTasks.length} / {todayTasks.length}</span>
                </div>
                <div className="h-3 w-full bg-[#e8e4d8] dark:bg-[#0a0a0a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#09fe94] to-[#05c472] transition-all duration-700"
                    style={{ width: `${todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-3 p-3 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#d8d3c5] dark:border-[#262626]">
                  <Sparkles className="w-4 h-4 text-yellow-500 shrink-0" />
                  <p className="text-[10px] text-[#6b6660] dark:text-[#a09b8f] font-medium leading-tight">
                    {completedTasks.length === todayTasks.length && todayTasks.length > 0
                      ? "Fantastisk! Du har tømt lista for i dag. 😎"
                      : "Hold det gående! Hver oppfølging er ett skritt nærmere et salg."}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setShowCallModal(true)}
                className="group relative overflow-hidden bg-[#09fe94] text-black p-4 rounded-2xl flex flex-col gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#09fe94]/20"
              >
                <div className="p-2 bg-black/5 rounded-xl w-fit">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-left leading-tight">Loggfør anrop</span>
              </button>
              <Link
                href="/innboks"
                className="group bg-[#faf8f2] dark:bg-[#141414] border border-[#d8d3c5] dark:border-[#262626] p-4 rounded-2xl flex flex-col gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
              >
                <div className="p-2 bg-[#09fe94]/10 rounded-xl w-fit">
                  <Inbox className="w-4 h-4 text-[#09fe94]" />
                </div>
                <span className="text-[10px] font-black text-[#171717] dark:text-white text-left leading-tight">Ny e-post</span>
              </Link>
              <button
                onClick={() => setShowMeetingModal(true)}
                className="group bg-[#faf8f2] dark:bg-[#141414] border border-[#d8d3c5] dark:border-[#262626] p-4 rounded-2xl flex flex-col gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
              >
                <div className="p-2 bg-[#09fe94]/10 rounded-xl w-fit">
                  <Plus className="w-4 h-4 text-[#09fe94]" />
                </div>
                <span className="text-[10px] font-black text-[#171717] dark:text-white text-left leading-tight">Nytt møte</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Today's task list ── */}
        <div className="bg-[#faf8f2] dark:bg-[#141414] border border-[#d8d3c5] dark:border-[#262626] rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#ff470a]/10 rounded-2xl">
                <Clock className="w-6 h-6 text-[#ff470a]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#171717] dark:text-white">Dagens oppgaver</h2>
                <p className="text-xs text-[#a09b8f]">Møter og oppfølginger for i dag</p>
              </div>
            </div>
            <Badge className="bg-[#09fe94]/10 text-[#09fe94] border-none font-bold px-3 py-1">
              {todayTasks.length - completedTasks.filter(id => todayTasks.find(t => t.id === id)).length} Gjenstår
            </Badge>
          </div>

          {todayTasks.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#1a1a1a] rounded-[2rem] border-2 border-dashed border-[#d8d3c5] dark:border-[#262626]">
              <div className="w-14 h-14 bg-[#09fe94]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-[#09fe94]" />
              </div>
              <p className="text-base font-black text-[#171717] dark:text-white italic">Du er helt à jour!</p>
              <p className="text-sm text-[#a09b8f] mt-1">Ingen planlagte oppgaver for i dag.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => {
                const isDone = completedTasks.includes(task.id);
                return (
                  <div
                    key={task.id}
                    className={`group flex items-center gap-5 p-5 rounded-2xl border transition-all duration-300 ${
                      isDone
                        ? "bg-white dark:bg-[#0a0a0a] border-transparent opacity-60 scale-[0.99]"
                        : "bg-white dark:bg-[#1a1a1a] border-[#d8d3c5] dark:border-[#262626] hover:border-[#09fe94] hover:shadow-lg"
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isDone
                          ? "bg-[#09fe94] border-[#09fe94] shadow-[0_0_15px_rgba(9,254,148,0.4)]"
                          : "border-[#d8d3c5] dark:border-[#262626] group-hover:border-[#09fe94] bg-white dark:bg-[#141414]"
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-5 h-5 text-black" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {task.type === "meeting"
                          ? <CalendarCheck2 className="w-3.5 h-3.5 text-purple-500" />
                          : <Phone className="w-3.5 h-3.5 text-[#ff470a]" />
                        }
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#a09b8f]">
                          {task.type === "meeting" ? "Møte" : "Oppfølging"}
                        </span>
                      </div>
                      <p className={`text-base font-bold truncate transition-all ${isDone ? "line-through text-[#a09b8f]" : "text-[#171717] dark:text-white"}`}>
                        {task.title}
                      </p>
                      <p className="text-xs font-medium text-[#6b6660] dark:text-[#a09b8f] flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3" /> {task.leadName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[11px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider whitespace-nowrap ${
                        task.type === "meeting"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                          : "bg-[#ff470a]/10 text-[#ff470a]"
                      }`}>
                        {task.time}
                      </span>
                      {task.type === "meeting" && meetingDates[task.leadId] && (
                        <a
                          href={makeGoogleCalendarUrl(`Møte med ${task.leadName}`, meetingDates[task.leadId])}
                          target="_blank" rel="noopener noreferrer"
                          className="hidden sm:flex w-8 h-8 items-center justify-center bg-[#faf8f2] dark:bg-[#202020] hover:bg-[#09fe94]/20 text-[#6b6660] hover:text-[#09fe94] rounded-xl transition-all border border-[#d8d3c5] dark:border-[#262626]"
                          title="Legg til i Google Kalender"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <Link
                        href={`/mine-leads?id=${task.leadId}`}
                        className="w-9 h-9 flex items-center justify-center bg-[#faf8f2] dark:bg-[#202020] hover:bg-[#09fe94] text-[#6b6660] hover:text-black rounded-xl transition-all"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Call Log Modal ── */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141414] rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-[#d8d3c5] dark:border-[#262626] animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-[#d8d3c5] dark:border-[#262626] flex justify-between items-center bg-[#faf8f2] dark:bg-[#1a1a1a]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black dark:bg-[#09fe94] rounded-2xl">
                  <Phone className="w-6 h-6 text-[#09fe94] dark:text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#171717] dark:text-white">Loggfør anrop</h3>
                  <p className="text-xs text-[#a09b8f]">Spar tid med AI-transkribering</p>
                </div>
              </div>
              <button onClick={() => setShowCallModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#a09b8f] hover:text-black dark:hover:text-white transition-colors">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="relative">
                <label className="text-[10px] uppercase tracking-widest font-black text-[#a09b8f] mb-2 block">Søk etter Lead / Bedrift</label>
                <div className="relative">
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => { setLeadSearch(e.target.value); if (selectedLeadId) setSelectedLeadId(""); }}
                    className="w-full bg-[#faf8f2] dark:bg-[#0a0a0a] border border-[#d8d3c5] dark:border-[#262626] rounded-2xl pl-11 pr-4 py-4 text-sm font-bold focus:outline-none focus:border-[#09fe94] text-[#171717] dark:text-white placeholder:text-[#a09b8f]/50 transition-all"
                    placeholder="Søk etter navn eller bedrift..."
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a09b8f]" />
                </div>
                {leadSearch && !selectedLeadId && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-[#d8d3c5] dark:border-[#262626] rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2">
                    {filteredLeadsForSelect.length > 0 ? filteredLeadsForSelect.map(l => (
                      <button key={l.id} onClick={() => { setSelectedLeadId(l.id); setLeadSearch(l.name); }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#faf8f2] dark:hover:bg-[#0a0a0a] transition-colors">
                        <div className="font-black text-[#171717] dark:text-white">{l.name}</div>
                        <div className="text-[10px] uppercase font-bold text-[#a09b8f]">{l.contactPerson || l.industry}</div>
                      </button>
                    )) : (
                      <div className="px-4 py-4 text-center text-sm text-[#a09b8f] italic">Ingen treff</div>
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#a09b8f] block">Samtalenotater</label>
                  <button onClick={toggleRecording} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                    isRecording ? "bg-red-500 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse" : "bg-white dark:bg-[#141414] text-[#09fe94] border-[#d8d3c5] dark:border-[#262626] hover:border-[#09fe94] shadow-sm"
                  }`}>
                    {isRecording ? <Square className="w-3.5 h-3.5 fill-current" /> : <Mic className="w-3.5 h-3.5" />}
                    {isRecording ? "STOPP OPPTAK" : "START AI LYTTING"}
                  </button>
                </div>
                <div className="relative">
                  <textarea rows={5} value={transcribedText} onChange={(e) => setTranscribedText(e.target.value)}
                    className={`w-full bg-[#faf8f2] dark:bg-[#0a0a0a] border rounded-[1.5rem] px-5 py-4 text-sm font-medium focus:outline-none transition-all resize-none text-[#171717] dark:text-white ${
                      isRecording ? "border-red-400 ring-4 ring-red-400/5" : "border-[#d8d3c5] dark:border-[#262626] focus:border-[#09fe94]"
                    }`}
                    placeholder={isRecording ? "🎤 Tar opp lyd..." : isTranscribing ? "✨ AI transkriberer..." : "Start opptak, eller skriv notater her..."}
                  />
                  {isRecording && (
                    <div className="absolute bottom-4 right-4 flex gap-1">
                      <div className="w-1.5 h-4 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-6 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-4 bg-red-400 rounded-full animate-bounce" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCallModal(false)} className="flex-1 bg-white dark:bg-[#141414] border border-[#d8d3c5] dark:border-[#262626] text-[#6b6660] font-black py-4 rounded-2xl hover:bg-[#faf8f2] transition-all uppercase tracking-widest text-[10px]">Avbryt</button>
                <button onClick={handleSaveCall} className="flex-[2] bg-[#09fe94] hover:bg-[#00e882] text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-[#09fe94]/20 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                  <CheckCircle2 className="w-4 h-4" /> Lagre Logg
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── New Meeting Modal ── */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141414] rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-[#d8d3c5] dark:border-[#262626] animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-[#d8d3c5] dark:border-[#262626] flex justify-between items-center bg-[#faf8f2] dark:bg-[#1a1a1a]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#09fe94]/10 rounded-2xl">
                  <CalendarCheck2 className="w-6 h-6 text-[#09fe94]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#171717] dark:text-white">Nytt møte</h3>
                  <p className="text-xs text-[#a09b8f]">Book møte med en lead</p>
                </div>
              </div>
              <button onClick={() => setShowMeetingModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#a09b8f] hover:text-black dark:hover:text-white transition-colors">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-8 space-y-6">

              {/* Lead search */}
              <div className="relative">
                <label className="text-[10px] uppercase tracking-widest font-black text-[#a09b8f] mb-2 block">Bedrift / Lead</label>
                <div className="relative">
                  <input
                    type="text"
                    value={meetingLeadSearch}
                    onChange={(e) => { setMeetingLeadSearch(e.target.value); if (meetingLeadId) setMeetingLeadId(""); }}
                    className="w-full bg-[#faf8f2] dark:bg-[#0a0a0a] border border-[#d8d3c5] dark:border-[#262626] rounded-2xl pl-11 pr-4 py-4 text-sm font-bold focus:outline-none focus:border-[#09fe94] text-[#171717] dark:text-white placeholder:text-[#a09b8f]/50 transition-all"
                    placeholder="Søk etter bedrift..."
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a09b8f]" />
                </div>
                {meetingLeadSearch && !meetingLeadId && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-[#d8d3c5] dark:border-[#262626] rounded-2xl shadow-2xl max-h-48 overflow-y-auto p-2">
                    {filteredLeadsForMeeting.length > 0 ? filteredLeadsForMeeting.map(l => (
                      <button key={l.id} onClick={() => { setMeetingLeadId(l.id); setMeetingLeadSearch(l.name); }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#faf8f2] dark:hover:bg-[#0a0a0a] transition-colors">
                        <div className="font-black text-[#171717] dark:text-white">{l.name}</div>
                        <div className="text-[10px] uppercase font-bold text-[#a09b8f]">{l.contactPerson || l.industry}</div>
                      </button>
                    )) : (
                      <div className="px-4 py-4 text-center text-sm text-[#a09b8f] italic">Ingen treff</div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#a09b8f] mb-2 block">Dato</label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDateState(e.target.value)}
                    className="w-full bg-[#faf8f2] dark:bg-[#0a0a0a] border border-[#d8d3c5] dark:border-[#262626] rounded-2xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-[#09fe94] text-[#171717] dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#a09b8f] mb-2 block">Tidspunkt</label>
                  <input
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full bg-[#faf8f2] dark:bg-[#0a0a0a] border border-[#d8d3c5] dark:border-[#262626] rounded-2xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-[#09fe94] text-[#171717] dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowMeetingModal(false)} className="flex-1 bg-white dark:bg-[#141414] border border-[#d8d3c5] dark:border-[#262626] text-[#6b6660] font-black py-4 rounded-2xl hover:bg-[#faf8f2] transition-all uppercase tracking-widest text-[10px]">
                  Avbryt
                </button>
                <button onClick={handleSaveMeeting} disabled={savingMeeting} className="flex-[2] bg-[#09fe94] hover:bg-[#00e882] disabled:opacity-50 text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-[#09fe94]/20 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                  <CheckCircle2 className="w-4 h-4" />
                  {savingMeeting ? "Lagrer..." : "Bekreft møte"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
