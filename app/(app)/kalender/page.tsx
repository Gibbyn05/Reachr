"use client";
import { TopBar } from "@/components/layout/top-bar";
import { useAppStore } from "@/store/app-store";
import { CalendarCheck2, CheckCircle2, Clock, Phone, Inbox, ArrowRight, User, Mic, Square, Search, Sparkles, BarChart3, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

export default function KalenderPage() {
  const { currentUser, leads, meetingDates, updateLeadNotes } = useAppStore();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  // Audio recording & Lead select state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const filteredLeadsForSelect = leads.filter(l => 
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.contactPerson?.toLowerCase().includes(leadSearch.toLowerCase())
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      // Stopp opptak
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    // Start opptak med MediaRecorder (ingen Google-servere!)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Stopp alle mikrofon-strømmer
        stream.getTracks().forEach(t => t.stop());
        
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioBlob.size < 1000) {
          toast.warning("Opptaket var tomt. Prøv igjen.");
          return;
        }

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
          } else {
            toast.error("Klarte ikke transkribere. Prøv igjen.");
          }
        } catch {
          toast.error("Serverfeil ved transkribering.");
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      setIsRecording(true);
      toast.info("🎤 Tar opp... Trykk STOPP når du er ferdig.", { duration: 3000 });
    } catch (e: any) {
      if (e.name === "NotAllowedError") {
        toast.error("🚫 Mikrofontilgang nektet. Klikk hengelåsen i adressefeltet og tillat mikrofon.");
      } else {
        toast.error("Kunne ikke starte mikrofon: " + e.message);
      }
    }
  };

  const handleSaveCall = async () => {
    if (!selectedLeadId) {
      toast.error("Vennligst velg en bedrift først.");
      return;
    }
    const lead = leads.find(l => l.id === selectedLeadId);
    if (!lead) return;

    const nowStr = new Date().toLocaleString("nb-NO");
    const newNote = `📞 Loggført anrop (${nowStr}):\n${transcribedText}`;
    const combined = lead.notes && lead.notes !== "—" 
      ? `${newNote}\n\n---\n\n${lead.notes}` 
      : newNote;
    
    try {
      await updateLeadNotes(selectedLeadId, combined);
      setShowCallModal(false);
      setTranscribedText("");
      setSelectedLeadId("");
      setLeadSearch("");
      toast.success(`Samtale med ${lead.name} er loggført!`);
    } catch (err) {
      toast.error("Kunne ikke lagre samtalen.");
    }
  };

  // Task generation
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  
  const tasks = leads.flatMap((lead) => {
    const leadTasks = [];
    
    // Task: Meetings today or upcoming
    const meetingDate = meetingDates[lead.id];
    if (meetingDate && (lead.status === "Booket møte" || lead.status === "Kunde")) {
      const d = new Date(meetingDate);
      if (!isNaN(d.getTime())) {
        const isToday = d.toISOString().split("T")[0] === todayStr;
        const timeStr = d.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
        const dateStr = d.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
        
        leadTasks.push({
          id: `meet-${lead.id}`,
          type: "meeting",
          title: `Møte med ${lead.contactPerson || "kontaktperson"}`,
          leadName: lead.name,
          time: isToday ? timeStr : `${dateStr}, ${timeStr}`,
          isToday,
          leadId: lead.id,
          fullDate: d
        });
      }
    }

    // Task: Follow up on "Kontaktet - ikke svar" after 2 days
    if (lead.status === "Kontaktet - ikke svar" && lead.lastContacted) {
      const followUpDate = new Date(lead.lastContacted);
      followUpDate.setDate(followUpDate.getDate() + 2);
      const isTodayOrPast = followUpDate <= now;
      if (isTodayOrPast) {
        leadTasks.push({
          id: `follow-${lead.id}`,
          type: "follow-up",
          title: `Følg opp (ikke svar)`,
          leadName: lead.name,
          time: "Hele dagen",
          isToday: true,
          leadId: lead.id,
        });
      }
    }

    return leadTasks;
  });

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const todayTasks = tasks.filter((t) => t.isToday);
  const upcomingTasks = tasks.filter((t) => !t.isToday);

  return (
    <div className="min-h-screen bg-[#f2efe3] dark:bg-[#0a0a0a] transition-colors duration-500">
      <TopBar title="Oppgaver & Kalender" subtitle="Loggfør anrop, book møter og følg opp dine leads" />

      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
           <div>
              <p className="text-sm font-bold text-accent-dark uppercase tracking-[0.2em] mb-1">Dagsplan</p>
              <h1 className="text-3xl font-black text-[#171717] dark:text-white">
                 God dag, {currentUser?.name?.split(" ")[0] || "Selger"}! 👋
              </h1>
           </div>
           <div className="flex items-center gap-3 bg-white dark:bg-[#141414] border border-[#e8e4d8] dark:border-[#262626] rounded-2xl px-5 py-3 shadow-sm">
              <CalendarCheck2 className="w-5 h-5 text-accent-dark" />
              <div className="flex flex-col">
                 <span className="text-[10px] uppercase font-bold text-[#a09b8f]">I dag</span>
                 <span className="text-sm font-bold text-[#171717] dark:text-white">
                    {now.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" })}
                 </span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Main Task List (Left Column) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white dark:bg-[#141414] border border-[#e8e4d8] dark:border-[#262626] rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-accent-danger/10 rounded-2xl">
                      <Clock className="w-6 h-6 text-accent-danger" />
                   </div>
                   <div>
                      <h2 className="text-xl font-black text-[#171717] dark:text-white">Dagens oppgaver</h2>
                      <p className="text-xs text-[#a09b8f]">Status på dine viktigste gjøremål</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <Badge className="bg-[#09fe94]/10 text-accent-dark border-none font-bold px-3 py-1">
                      {todayTasks.length - completedTasks.filter(id => todayTasks.find(t => t.id === id)).length} Gjenstår
                   </Badge>
                </div>
              </div>

              {todayTasks.length === 0 ? (
                <div className="text-center py-16 bg-[#faf8f2] dark:bg-[#1a1a1a] rounded-[2rem] border-2 border-dashed border-[#d8d3c5] dark:border-[#262626]">
                  <div className="w-16 h-16 bg-[#09fe94]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                     <CheckCircle2 className="w-8 h-8 text-accent-dark" />
                  </div>
                  <p className="text-lg font-black text-[#171717] dark:text-white italic">Du er helt à jour!</p>
                  <p className="text-muted-foreground text-sm mt-1">Ingen flere planlagte oppgaver for resten av dagen.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayTasks.map((task) => {
                    const isDone = completedTasks.includes(task.id);
                    return (
                      <div 
                        key={task.id} 
                        className={`group flex items-center gap-5 p-5 rounded-2xl border transition-all duration-300 ${
                          isDone 
                            ? "bg-[#faf8f2] dark:bg-[#0a0a0a] border-transparent opacity-60 scale-[0.98]" 
                            : "bg-white dark:bg-[#1a1a1a] border-[#e8e4d8] dark:border-[#262626] hover:border-[#09fe94] hover:shadow-lg dark:hover:shadow-[#09fe94]/5"
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
                              {task.type === "meeting" ? (
                                <CalendarCheck2 className="w-3.5 h-3.5 text-purple-600" />
                              ) : (
                                <Phone className="w-3.5 h-3.5 text-accent-danger" />
                              )}
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                 {task.type === "meeting" ? "Møte" : "Oppfølging"}
                              </span>
                           </div>
                           <p className={`text-base font-bold truncate transition-all ${isDone ? "line-through text-[#a09b8f]" : "text-[#171717] dark:text-white"}`}>
                             {task.title}
                           </p>
                           <div className="flex items-center gap-3 mt-1 text-xs font-medium text-[#6b6660] dark:text-[#a09b8f]">
                              <span className="flex items-center gap-1">
                                 <User className="w-3 h-3" />
                                 {task.leadName}
                              </span>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-[11px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider whitespace-nowrap ${
                              task.type === "meeting" ? "bg-accent/10 text-accent-dark" :
                              "bg-accent-danger/10 text-accent-danger"
                            }`}>
                              {task.time}
                            </span>

                           <div className="flex items-center gap-1 border-l border-[#e8e4d8] dark:border-[#262626] pl-3">
                              {task.type === "meeting" && meetingDates[task.leadId] && (
                                <>
                                  <a
                                    href={makeGoogleCalendarUrl(`Møte med ${task.leadName}`, meetingDates[task.leadId])}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden sm:flex w-8 h-8 items-center justify-center bg-[#faf8f2] dark:bg-[#202020] hover:bg-[#09fe94]/20 text-[#6b6660] hover:text-accent-dark rounded-xl transition-all duration-300 border border-[#e8e4d8]"
                                    title="Legg til i Google Kalender"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </>
                              )}
                              <Link
                                href={`/mine-leads?id=${task.leadId}`}
                                className="w-10 h-10 flex items-center justify-center bg-[#faf8f2] dark:bg-[#202020] hover:bg-[#09fe94] text-[#6b6660] hover:text-black rounded-xl transition-all duration-300"
                              >
                                <ArrowRight className="w-5 h-5" />
                              </Link>
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="bg-white dark:bg-[#141414] border border-[#e8e4d8] dark:border-[#262626] rounded-[2rem] p-8 shadow-sm">
              <h2 className="text-lg font-black text-primary flex items-center gap-2 mb-6">
                <CalendarCheck2 className="w-6 h-6 text-accent-dark" />
                Planlagt (Senere)
              </h2>
              {upcomingTasks.length === 0 ? (
                <p className="text-sm text-[#a09b8f] italic ml-8">Ingen kommende møter eller tidsbestemte oppgaver.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="group flex items-center justify-between p-4 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(9,254,148,0.5)]"></div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-primary truncate">{task.title}</p>
                          <p className="text-[11px] text-muted-foreground font-medium">{task.leadName}</p>
                         </div>
                      </div>
                      <span className="text-[10px] bg-accent/10 text-accent-dark font-black px-2 py-1 rounded-lg uppercase whitespace-nowrap">{task.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity & Quick Actions Sidebar (Right Column) */}
          <div className="space-y-6 lg:sticky lg:top-24 h-fit">
            
            {/* Summary Progress */}
            <div className="bg-white dark:bg-[#141414] border border-[#e8e4d8] dark:border-[#262626] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-black text-sm text-[#171717] dark:text-white uppercase tracking-wider">Status (I dag)</h3>
                 <div className="p-2 bg-[#09fe94]/10 rounded-xl">
                    <BarChart3 className="w-4 h-4 text-accent-dark" />
                 </div>
              </div>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2">
                    <span className="text-[#a09b8f]">Oppgaver fullført</span>
                    <span className="text-[#171717] dark:text-white">{completedTasks.length} / {todayTasks.length}</span>
                  </div>
                  <div className="h-3 w-full bg-[#f2efe3] dark:bg-[#0a0a0a] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#09fe94] to-[#05c472] transition-all duration-700 ease-out"
                      style={{ width: `${todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#faf8f2] dark:bg-[#1a1a1a] rounded-2xl border border-[#e8e4d8] dark:border-[#262626]">
                   <Sparkles className="w-5 h-5 text-yellow-500" />
                   <p className="text-[10px] text-[#6b6660] dark:text-[#a09b8f] font-medium leading-tight">
                      {completedTasks.length === todayTasks.length && todayTasks.length > 0 
                        ? "Fantastisk innsats! Du har tømt lista for i dag. 😎" 
                        : "Hold det gående! Hver oppfølging er ett skritt nærmere et salg."}
                   </p>
                </div>
              </div>
            </div>

            {/* Quick Actions Stack */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                <button 
                  onClick={() => setShowCallModal(true)} 
                  className="group relative overflow-hidden bg-accent text-accent-foreground p-4 rounded-2xl flex flex-col gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-accent/20"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                  <div className="p-2.5 bg-black/5 rounded-xl w-fit">
                     <Phone className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="text-[11px] lg:text-sm font-black text-left">Loggfør anrop</span>
                </button>

               <Link 
                 href="/innboks" 
                 className="group relative overflow-hidden bg-card border border-border p-4 rounded-2xl flex flex-col gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
               >
                 <div className="p-2.5 bg-accent-dark/10 rounded-xl w-fit">
                    <Inbox className="w-5 h-5 text-accent-dark" />
                 </div>
                 <span className="text-[11px] lg:text-sm font-black text-primary text-left">Ny e-post</span>
               </Link>

               <button 
                 onClick={() => setShowMeetingModal(true)} 
                 className="group relative overflow-hidden bg-card border border-border p-4 rounded-2xl flex flex-col gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
               >
                 <div className="p-2.5 bg-accent-dark/10 rounded-xl w-fit">
                    <Plus className="w-5 h-5 text-accent-dark" />
                 </div>
                 <span className="text-[11px] lg:text-sm font-black text-primary text-left">Nytt møte</span>
               </button>
            </div>

            {/* Compact Meetings List */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <h3 className="font-black text-sm text-primary uppercase tracking-wider mb-5 flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-accent-dark" />
                Møteoversikt
              </h3>
              <div className="space-y-4">
                {tasks.filter(t => t.type === "meeting").length === 0 ? (
                  <div className="text-center py-4 text-xs text-[#a09b8f] italic border-2 border-dashed border-[#e8e4d8] dark:border-[#262626] rounded-2xl">
                    Ingen møter booket
                  </div>
                ) : (
                  tasks
                    .filter(t => t.type === "meeting")
                    .sort((a, b) => (a.fullDate?.getTime() || 0) - (b.fullDate?.getTime() || 0))
                    .slice(0, 5)
                    .map(meeting => {
                      const lead = leads.find(l => l.id === meeting.leadId);
                      const meetingDatetime = lead ? meetingDates[lead.id] : undefined;
                      return (
                        <div key={meeting.id} className="p-3 bg-muted hover:bg-muted/80 rounded-2xl transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-card rounded-xl shadow-sm border border-border shrink-0">
                               <CalendarCheck2 className="w-3.5 h-3.5 text-accent-dark" />
                            </div>
                            <div className="min-w-0 flex-1">
                               <p className="text-xs font-black text-primary truncate">{meeting.leadName}</p>
                               <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-0.5">
                                  {meeting.time}
                               </p>
                            </div>
                          </div>
                          {meetingDatetime && (
                            <div className="flex gap-2 mt-2 ml-10">
                              <a
                                href={makeGoogleCalendarUrl(`Møte med ${meeting.leadName}`, meetingDatetime)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[9px] font-semibold text-muted-foreground hover:text-primary border border-border rounded-lg px-2 py-1 bg-card transition-colors"
                              >
                                <ExternalLink className="w-2.5 h-2.5" /> Google
                              </a>
                              <a
                                href={makeOutlookCalendarUrl(`Møte med ${meeting.leadName}`, meetingDatetime)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[9px] font-semibold text-muted-foreground hover:text-primary border border-border rounded-lg px-2 py-1 bg-card transition-colors"
                              >
                                <ExternalLink className="w-2.5 h-2.5" /> Outlook
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {showCallModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141414] rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-[#e8e4d8] dark:border-[#262626] animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-[#e8e4d8] dark:border-[#262626] flex justify-between items-center bg-[#faf8f2] dark:bg-[#1a1a1a]">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-black dark:bg-[#09fe94] rounded-2xl">
                    <Phone className="w-6 h-6 text-[#09fe94] dark:text-black" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-[#171717] dark:text-white">Loggfør anrop</h3>
                    <p className="text-xs text-[#a09b8f]">Spar tid med AI-transkribering</p>
                 </div>
              </div>
              <button onClick={() => setShowCallModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
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
                    onChange={(e) => {
                      setLeadSearch(e.target.value);
                      if (selectedLeadId) setSelectedLeadId("");
                    }}
                    className="w-full bg-[#faf8f2] dark:bg-[#0a0a0a] border border-[#d8d3c5] dark:border-[#262626] rounded-2xl pl-11 pr-4 py-4 text-sm font-bold focus:outline-none focus:border-[#09fe94] dark:text-white placeholder:text-[#a09b8f]/50 transition-all" 
                    placeholder="Søk etter navn eller bedrift..." 
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a09b8f]" />
                </div>
                
                {leadSearch && !selectedLeadId && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-[#d8d3c5] dark:border-[#262626] rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2">
                    {filteredLeadsForSelect.length > 0 ? (
                      filteredLeadsForSelect.map(l => (
                        <button
                          key={l.id}
                          onClick={() => {
                            setSelectedLeadId(l.id);
                            setLeadSearch(l.name);
                          }}
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#faf8f2] dark:hover:bg-[#0a0a0a] transition-colors group"
                        >
                          <div className="font-black text-[#171717] dark:text-white group-hover:text-[#05c472]">{l.name}</div>
                          <div className="text-[10px] uppercase font-bold text-[#a09b8f] mt-0.5">{l.contactPerson || l.industry}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-center text-sm text-[#a09b8f] italic">Ingen treff på "{leadSearch}"</div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#a09b8f] block">Samtalenotater</label>
                   <button 
                     onClick={toggleRecording} 
                     className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                       isRecording 
                         ? "bg-red-500 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse" 
                         : "bg-white dark:bg-[#141414] text-accent-dark border-[#e8e4d8] dark:border-[#262626] hover:border-[#09fe94] shadow-sm"
                     }`}
                   >
                     {isRecording ? <Square className="w-3.5 h-3.5 fill-current" /> : <Mic className="w-3.5 h-3.5" />}
                     {isRecording ? "STOPP OPPTAK" : "START AI LYTTING"}
                   </button>
                </div>
                <div className="relative">
                   <textarea 
                     rows={5} 
                     value={transcribedText}
                     onChange={(e) => setTranscribedText(e.target.value)}
                     className={`w-full bg-[#faf8f2] dark:bg-[#0a0a0a] border rounded-[1.5rem] px-5 py-4 text-sm font-medium focus:outline-none transition-all resize-none dark:text-white ${
                       isRecording ? "border-red-400 ring-4 ring-red-400/5 shadow-inner" : "border-[#d8d3c5] dark:border-[#262626] focus:border-[#09fe94]"
                     }`} 
                     placeholder={isRecording ? "🎤 Tar opp lyd... Trykk STOPP når du er ferdig." : isTranscribing ? "✨ AI transkriberer opptaket..." : "Start opptak, eller skriv notater her..."}
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
                 <button 
                   onClick={() => setShowCallModal(false)}
                   className="flex-1 bg-white dark:bg-[#141414] border border-[#e8e4d8] dark:border-[#262626] text-[#6b6660] font-black py-4 rounded-2xl hover:bg-[#faf8f2] dark:hover:bg-[#1a1a1a] transition-all uppercase tracking-widest text-[10px]"
                 >
                   Avbryt
                 </button>
                 <button 
                   onClick={handleSaveCall}
                   className="flex-[2] bg-[#09fe94] hover:bg-[#00e882] text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-[#09fe94]/20 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                 >
                   <CheckCircle2 className="w-4 h-4" />
                   Lagre Logg
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMeetingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141414] rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-[#e8e4d8] dark:border-[#262626] animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-border flex justify-between items-center bg-card">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-accent-dark/10 rounded-2xl">
                    <CalendarCheck2 className="w-6 h-6 text-accent-dark" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-primary">Nytt møte</h3>
                    <p className="text-xs text-muted-foreground">Planlegg din neste kaffeprat</p>
                 </div>
              </div>
              <button onClick={() => setShowMeetingModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                 <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-black text-[#a09b8f] mb-2 block">Møtetittel</label>
                <input 
                  type="text" 
                  className="w-full bg-[#faf8f2] dark:bg-[#0a0a0a] border border-[#d8d3c5] dark:border-[#262626] rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#09fe94] dark:text-white transition-all" 
                  placeholder="F.eks: Oppstartsmøte med Reachr" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#a09b8f] mb-2 block">Dato</label>
                  <input 
                    type="date" 
                    className="w-full bg-[#faf8f2] dark:bg-[#0a0a0a] border border-[#d8d3c5] dark:border-[#262626] rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#09fe94] dark:text-white transition-all" 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black text-[#a09b8f] mb-2 block">Tidspunkt</label>
                  <input 
                    type="time" 
                    className="w-full bg-[#faf8f2] dark:bg-[#0a0a0a] border border-[#d8d3c5] dark:border-[#262626] rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#09fe94] dark:text-white transition-all" 
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                 <button 
                    onClick={() => setShowMeetingModal(false)}
                    className="flex-1 bg-white dark:bg-[#141414] border border-[#e8e4d8] dark:border-[#262626] text-[#6b6660] font-black py-4 rounded-2xl hover:bg-[#faf8f2] dark:hover:bg-[#1a1a1a] transition-all uppercase tracking-widest text-[10px]"
                 >
                    Avbryt
                 </button>
                  <button 
                     onClick={() => { setShowMeetingModal(false); toast.success("Møte opprettet!"); }} 
                     className="flex-[2] bg-accent hover:bg-accent-hover text-accent-foreground font-black py-4 rounded-2xl transition-all shadow-lg shadow-accent/20 uppercase tracking-widest text-[10px]"
                  >
                     Bekreft
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
