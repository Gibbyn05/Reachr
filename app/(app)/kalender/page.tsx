"use client";
import { TopBar } from "@/components/layout/top-bar";
import { useAppStore } from "@/store/app-store";
import { CalendarDays, CheckCircle2, Clock, Phone, Mail, ArrowRight, User, Mic, Square } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

export default function KalenderPage() {
  const { leads, meetingDates } = useAppStore();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  
  // Audio recording state simulation
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.success("Opptak avsluttet.");
    } else {
      setIsRecording(true);
      toast.info("Lytter til samtalen...", { duration: 4000 });
      // Simulate real-time transcription after a delay
      setTimeout(() => {
        setTranscribedText(prev => prev + (prev ? " " : "") + "Kunden var veldig interessert i AI-transkriberingen og ønsket et konkret pristilbud i løpet av neste uke. De vurderer oppstart om ca. to uker.");
        setIsRecording(false);
        toast.success("Notater ble transkribert med AI!");
      }, 3500);
    }
  };

  // Simple task generation based on leads
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
                Kommende (Senere)
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
              <div>
                <label className="text-xs font-semibold text-[#a09b8f] mb-1 block">Lead / Bedrift</label>
                <input type="text" className="w-full border border-[#d8d3c5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#09fe94]" placeholder="Søk etter lead..." />
              </div>
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#a09b8f] block">Samtalenotater</label>
                  <button 
                    onClick={toggleRecording} 
                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold transition-colors ${
                      isRecording ? "bg-red-100 text-red-600 animate-pulse" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {isRecording ? <Square className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    {isRecording ? "Avslutt opptak" : "AI Transkribering"}
                  </button>
                </div>
                <textarea 
                  rows={4} 
                  value={transcribedText}
                  onChange={(e) => setTranscribedText(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors resize-none ${
                    isRecording ? "border-blue-400 bg-blue-50/30" : "border-[#d8d3c5] focus:border-[#09fe94]"
                  }`} 
                  placeholder={isRecording ? "Lytter..." : "Hva snakket dere om? AI kan lytte for deg!"}
                ></textarea>
              </div>
              <button onClick={() => { 
                setShowCallModal(false); 
                setTranscribedText(""); 
                toast.success("Anrop loggført i historikken."); 
              }} className="w-full bg-[#09fe94] hover:bg-[#00e882] text-black font-bold py-2 rounded-lg transition-colors">
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
