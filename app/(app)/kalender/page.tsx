"use client";
import { TopBar } from "@/components/layout/top-bar";
import { useAppStore } from "@/store/app-store";
import { CalendarDays, CheckCircle2, Clock, Phone, Mail, ArrowRight, User, Mic, Square, Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function KalenderPage() {
  const { leads, meetingDates, updateLeadNotes } = useAppStore();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  
  // Audio recording & Lead select state
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [leadSearch, setLeadSearch] = useState("");

  const filteredLeadsForSelect = leads.filter(l => 
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.contactPerson?.toLowerCase().includes(leadSearch.toLowerCase())
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "nb-NO";

        rec.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setTranscribedText(prev => {
              // Only append if it's the final result, otherwise it's just interim
              const isFinal = event.results[event.results.length - 1].isFinal;
              if (isFinal) {
                return (prev + " " + currentTranscript).trim();
              }
              // For interim, we'll just show it for now
              return prev; 
            });
            // Also update interim for real-time feel
            const fullRaw = Array.from(event.results)
              .map((res: any) => res[0].transcript)
              .join(" ");
            setTranscribedText(fullRaw);
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech Recognition Error:", event.error);
          if (event.error !== "no-speech") {
            toast.error("Mikrofon-feil: " + event.error);
            setIsRecording(false);
          }
        };

        (window as any)._rec = rec;
      }
    }
  }, []);

  const toggleRecording = () => {
    const rec = (window as any)._rec;
    if (!rec) {
      toast.error("Nettleseren din støtter ikke tale-til-tekst.");
      return;
    }

    if (isRecording) {
      rec.stop();
      setIsRecording(false);
      toast.success("Opptak avsluttet.");
    } else {
      setTranscribedText("");
      try {
        rec.start();
        setIsRecording(true);
        toast.info("Lytter nå... Snakk i vei!", { duration: 2000 });
      } catch (e) {
        // Sometimes it's already started, just reset state
        setIsRecording(true);
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
    <div>
      <TopBar title="Oppgaver & Kalender" subtitle="Din to-do liste for dagen" />

      <div className="p-4 sm:p-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Main Task List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#faf8f2] border border-[#d8d3c5] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Oppgaver i dag
                  <Badge variant="yellow" className="ml-2">{todayTasks.length - completedTasks.filter(id => todayTasks.find(t => t.id === id)).length}</Badge>
                </h2>
                <span className="text-sm font-medium text-[#6b6660]">
                  {now.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" })}
                </span>
              </div>

              {todayTasks.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-[#d8d3c5]">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                  <p className="text-[#171717] font-semibold">Du er à jour!</p>
                  <p className="text-[#6b6660] text-sm mt-1">Ingen flere oppgaver for i dag.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayTasks.map((task) => {
                    const isDone = completedTasks.includes(task.id);
                    return (
                      <div 
                        key={task.id} 
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isDone ? "bg-gray-50 border-gray-100 opacity-60" : "bg-white border-[#e8e4d8] hover:border-[#09fe94]/50 hover:shadow-sm"}`}
                      >
                        <button 
                          onClick={() => toggleTask(task.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isDone ? "bg-[#09fe94] border-[#09fe94]" : "border-[#d8d3c5] hover:border-[#09fe94]"}`}
                        >
                          {isDone && <CheckCircle2 className="w-4 h-4 text-[#171717]" />}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${isDone ? "line-through text-[#a09b8f]" : "text-[#171717]"}`}>
                            {task.title}
                          </p>
                          <p className={`text-xs mt-0.5 flex items-center gap-1.5 ${isDone ? "text-[#a09b8f]" : "text-[#6b6660]"}`}>
                            <User className="w-3.5 h-3.5" />
                            {task.leadName}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                            task.type === "meeting" ? "bg-purple-100 text-purple-700" : 
                            task.type === "new" ? "bg-blue-100 text-blue-700" : 
                            "bg-orange-100 text-orange-700"
                          }`}>
                            {task.time}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pl-2 border-l border-[#e8e4d8] ml-2 shrink-0">
                          <Link href={`/mine-leads`} className="p-1.5 hover:bg-[#e8e4d8] rounded-md text-[#6b6660] hover:text-[#171717] transition-colors">
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="bg-[#faf8f2] border border-[#d8d3c5] rounded-xl p-6 shadow-sm opacity-80">
              <h2 className="text-base font-bold text-[#171717] flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-blue-500" />
                Planlagt (Senere)
              </h2>
              {upcomingTasks.length === 0 ? (
                <p className="text-sm text-[#6b6660]">Ingen kommende møter eller tidsbestemte oppgaver.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e8e4d8]">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div>
                          <p className="text-sm font-semibold text-[#171717]">{task.title}</p>
                          <p className="text-xs text-[#6b6660]">{task.leadName}</p>
                        </div>
                      </div>
                      <span className="text-xs text-[#a09b8f] font-medium">{task.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions / Mini Calendar Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#171717] rounded-xl p-6 text-white shadow-xl">
              <h3 className="font-bold mb-4 text-white">Raske handlinger</h3>
              <div className="space-y-2">
                <button onClick={() => setShowCallModal(true)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                  <Phone className="w-4 h-4 text-[#09fe94]" />
                  Loggfør et anrop
                </button>
                <Link href="/mine-leads" className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                  <Mail className="w-4 h-4 text-[#09fe94]" />
                  Skriv ny e-post
                </Link>
                <button onClick={() => setShowMeetingModal(true)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                  <CalendarDays className="w-4 h-4 text-[#09fe94]" />
                  Opprett eget møte
                </button>
              </div>
            </div>

            <div className="bg-[#faf8f2] border border-[#d8d3c5] rounded-xl p-6 shadow-sm">
              <h3 className="font-bold mb-4 text-[#171717] flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-purple-500" />
                Kommende møter
              </h3>
              <div className="space-y-4">
                {tasks.filter(t => t.type === "meeting").length === 0 ? (
                  <p className="text-xs text-[#a09b8f] italic">Ingen møter booket ennå.</p>
                ) : (
                  tasks
                    .filter(t => t.type === "meeting")
                    .sort((a, b) => (a.fullDate?.getTime() || 0) - (b.fullDate?.getTime() || 0))
                    .map(meeting => (
                      <div key={meeting.id} className="flex flex-col gap-1 p-3 bg-purple-50 border border-purple-100 rounded-lg">
                        <p className="text-xs font-bold text-purple-900">{meeting.leadName}</p>
                        <p className="text-[10px] text-purple-700 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {meeting.time}
                        </p>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="bg-[#faf8f2] border border-[#d8d3c5] rounded-xl p-6 shadow-sm">
              <h3 className="font-bold mb-4 text-[#171717]">Salgsoppsummering (I dag)</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#6b6660] font-medium">Oppgaver fullført</span>
                    <span className="text-[#171717] font-bold">{completedTasks.length} / {todayTasks.length}</span>
                  </div>
                  <div className="h-2 w-full bg-[#e8e4d8] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#09fe94] transition-all duration-500"
                      style={{ width: `${todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showCallModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-[#e8e4d8] flex justify-between items-center bg-[#faf8f2]">
              <h3 className="font-bold text-[#171717] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#09fe94]" /> Loggfør et anrop
              </h3>
              <button onClick={() => setShowCallModal(false)} className="text-gray-400 hover:text-black">&times;</button>
            </div>
            <div className="p-4 space-y-4">
              <div className="relative">
                <label className="text-xs font-semibold text-[#a09b8f] mb-1 block">Søk etter Lead / Bedrift</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={leadSearch}
                    onChange={(e) => {
                      setLeadSearch(e.target.value);
                      if (selectedLeadId) setSelectedLeadId("");
                    }}
                    className="w-full border border-[#d8d3c5] rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#09fe94]" 
                    placeholder="Søk etter navn..." 
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a09b8f]" />
                </div>
                
                {leadSearch && !selectedLeadId && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#d8d3c5] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredLeadsForSelect.length > 0 ? (
                      filteredLeadsForSelect.map(l => (
                        <button
                          key={l.id}
                          onClick={() => {
                            setSelectedLeadId(l.id);
                            setLeadSearch(l.name);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-[#faf8f2] border-b border-[#f0ece0] last:border-0"
                        >
                          <div className="font-bold text-[#171717]">{l.name}</div>
                          <div className="text-[10px] text-[#a09b8f]">{l.contactPerson || l.industry}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-[#a09b8f] italic">Ingen treff...</div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#a09b8f] block">Samtalenotater</label>
                   <button 
                     onClick={toggleRecording} 
                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm ${
                       isRecording 
                         ? "bg-red-500 text-white border-red-600 animate-pulse" 
                         : "bg-white text-blue-600 border-blue-200 hover:border-blue-400"
                     }`}
                   >
                     {isRecording ? <Square className="w-3 h-3 fill-current" /> : <Mic className="w-3 h-3" />}
                     {isRecording ? "STOPP OPPTAK" : "START AI LYTTING"}
                   </button>
                </div>
                <textarea 
                  rows={4} 
                  value={transcribedText}
                  onChange={(e) => setTranscribedText(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors resize-none ${
                    isRecording ? "border-blue-400 bg-blue-50/30" : "border-[#d8d3c5] focus:border-[#09fe94]"
                  }`} 
                  placeholder={isRecording ? "Lytter..." : "Skriv notater eller bruk AI til å lytte!"}
                ></textarea>
              </div>
              <button 
                onClick={handleSaveCall}
                className="w-full bg-[#09fe94] hover:bg-[#00e882] text-black font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Lagre i historikk
              </button>
            </div>
          </div>
        </div>
      )}

      {showMeetingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-[#e8e4d8] flex justify-between items-center bg-[#faf8f2]">
              <h3 className="font-bold text-[#171717] flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#09fe94]" /> Opprett eget møte
              </h3>
              <button onClick={() => setShowMeetingModal(false)} className="text-gray-400 hover:text-black">&times;</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#a09b8f] mb-1 block">Møtetittel</label>
                <input type="text" className="w-full border border-[#d8d3c5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#09fe94]" placeholder="Kaffeprat med..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#a09b8f] mb-1 block">Dato</label>
                  <input type="date" className="w-full border border-[#d8d3c5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#09fe94]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#a09b8f] mb-1 block">Tidspunkt</label>
                  <input type="time" className="w-full border border-[#d8d3c5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#09fe94]" />
                </div>
              </div>
              <button onClick={() => { setShowMeetingModal(false); toast.success("Møte opprettet og lagt i kalenderen."); }} className="w-full bg-[#09fe94] hover:bg-[#00e882] text-black font-bold py-2 rounded-lg transition-colors">
                Lagre møte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
