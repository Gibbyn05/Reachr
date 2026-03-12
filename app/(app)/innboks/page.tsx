"use client";
// Triggering fresh deployment for inbox fixes
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { 
  Inbox as InboxIcon, 
  Search, 
  RefreshCw, 
  Loader2, 
  Mail, 
  CheckCircle2, 
  Star, 
  Trash2, 
  Reply, 
  Send, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  Phone,
  LayoutDashboard,
  Users,
  Plus
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  provider: "gmail" | "outlook";
  isRead: boolean;
}

export default function InboxPage() {
  const router = useRouter();
  const { leads } = useAppStore();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [isReplying, setIsReplying] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Reset reply state when email changes
    setIsReplying(false);
    setReplyBody("");
  }, [selectedEmail?.id]);

  const handleStar = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setStarredIds(prev => {
      const next = new Set(prev);
      const isStarred = next.has(id);
      if (isStarred) {
        next.delete(id);
        toast.success("Fjernet stjerne");
      } else {
        next.add(id);
        toast.success("Markert med stjerne");
      }
      return next;
    });
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEmails(prev => prev.filter(email => email.id !== id));
    if (selectedEmail?.id === id) setSelectedEmail(null);
    toast.success("E-post slettet");
  };

  const handleViewProfile = (leadId: string) => {
    router.push(`/mine-leads?id=${leadId}`);
  };

  const handleReply = () => {
    setIsReplying(true);
    // Focus or scroll to reply area could be added
  };

  const sendReply = async () => {
    if (!selectedEmail || !replyBody.trim()) return;
    setSending(true);
    try {
      const toMatch = selectedEmail.from.match(/<(.+)>|(\S+@\S+)/);
      const to = toMatch ? (toMatch[1] || toMatch[2]) : selectedEmail.from;
      
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedEmail.provider,
          to: to.trim(),
          subject: selectedEmail.subject.toLowerCase().startsWith("re:") 
            ? selectedEmail.subject 
            : `Re: ${selectedEmail.subject}`,
          body: replyBody
        })
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Svar sendt!");
        setIsReplying(false);
        setReplyBody("");
      } else {
        toast.error(data.error || "Kunne ikke sende svar.");
      }
    } catch (e) {
      toast.error("En feil oppstod under sending.");
    } finally {
      setSending(false);
    }
  };

  const fetchEmails = async (isRefresh = false) => {
    setLoading(true);
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/email/list");
      const data = await res.json();
      if (data.emails) {
        setEmails(data.emails);
      }
    } catch (e) {
      toast.error("Kunne ikke hente e-poster.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const filteredEmails = emails.filter(e => 
    (e.subject || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.from || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.snippet || "").toLowerCase().includes(search.toLowerCase())
  );

  const getLeadForEmail = (fromStr: string) => {
    const match = fromStr.match(/<(.+)>|(\S+@\S+)/);
    const email = (match ? (match[1] || match[2]) : fromStr).toLowerCase().trim();
    return leads.find(l => l.email?.toLowerCase().trim() === email);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      <TopBar title="Innboks" subtitle="Siste e-poster fra dine tilkoblede kontoer" />

      <div className="flex-1 flex overflow-hidden">
        {/* Email List Panel */}
        <div className="w-full md:w-[400px] border-r border-[#d8d3c5] bg-white flex flex-col shrink-0">
          <div className="p-4 border-b border-[#e8e4d8]">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a09b8f]" />
              <input 
                type="text" 
                placeholder="Søk i e-poster..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#faf8f2] border border-[#d8d3c5] rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#09fe94] transition-colors"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => fetchEmails(true)}
                disabled={refreshing}
                className="text-[#6b6660] hover:text-[#171717]"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Oppdater
              </Button>
              <Badge className="bg-[#09fe94]/10 text-[#05c472] border-none font-bold">
                {emails.length} totalt
              </Badge>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#f0ece0]">
            {loading && !refreshing ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#09fe94]" />
                <p className="text-xs text-[#a09b8f]">Henter innboksen din...</p>
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 p-8 text-center gap-3">
                <div className="w-12 h-12 bg-[#09fe94]/10 rounded-2xl flex items-center justify-center">
                  <InboxIcon className="w-6 h-6 text-[#09fe94]" />
                </div>
                <p className="text-sm font-semibold text-[#171717]">Ingen e-poster funnet</p>
                <p className="text-xs text-[#a09b8f]">Kanskje du må koble til en konto i innstillinger?</p>
              </div>
            ) : (
              filteredEmails.map((email) => {
                const lead = getLeadForEmail(email.from);
                return (
                  <button
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`w-full text-left p-4 hover:bg-[#faf8f2] transition-colors relative group ${selectedEmail?.id === email.id ? "bg-[#faf8f2]" : ""}`}
                  >
                    {selectedEmail?.id === email.id && (
                      <div className="absolute left-0 top-0 w-1 h-full bg-[#09fe94]" />
                    )}
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-[#a09b8f]">
                        {email.provider === "gmail" ? "Gmail" : "Outlook"}
                      </p>
                      <p className="text-[10px] text-[#a09b8f]">
                        {new Date(email.date).toLocaleDateString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <p className={`text-sm font-bold truncate ${!email.isRead ? "text-[#171717]" : "text-[#6b6660]"}`}>
                      {email.from.split("<")[0].trim() || email.from}
                    </p>
                    <p className={`text-sm truncate mb-1 ${!email.isRead ? "text-[#171717] font-semibold" : "text-[#6b6660]"}`}>
                      {email.subject}
                    </p>
                    <p className="text-xs text-[#a09b8f] line-clamp-2 leading-relaxed">
                      {email.snippet}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      {lead && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#09fe94]/10 rounded-full w-fit">
                          <Sparkles className="w-3 h-3 text-[#05c472]" />
                          <span className="text-[10px] font-bold text-[#05c472]">Lead: {lead.name}</span>
                        </div>
                      )}
                      {starredIds.has(email.id) && (
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Email Content Panel */}
        <div className="flex-1 bg-white flex flex-col relative">
          {!selectedEmail ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="w-16 h-16 bg-[#faf8f2] border border-[#d8d3c5] rounded-3xl flex items-center justify-center animate-float">
                <Mail className="w-8 h-8 text-[#a09b8f]" />
              </div>
              <h2 className="text-lg font-bold text-[#171717]">Velg en e-post for å lese</h2>
              <p className="text-sm text-[#a09b8f] max-w-xs">Hold kontakten med dine leads direkte fra Reachr innboksen.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-[#e8e4d8] bg-[#faf8f2]/50">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#171717] mb-2">{selectedEmail.subject}</h2>
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 bg-[#171717] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        {selectedEmail.from.substring(0, 2).toUpperCase()}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-[#171717]">{selectedEmail.from}</p>
                         <p className="text-[10px] text-[#a09b8f]">Mottatt {new Date(selectedEmail.date).toLocaleString("nb-NO")}</p>
                       </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`bg-white border-[#d8d3c5] ${starredIds.has(selectedEmail.id) ? "text-yellow-500" : ""}`}
                      onClick={() => handleStar(selectedEmail.id)}
                    >
                      <Star className={`w-4 h-4 ${starredIds.has(selectedEmail.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white border-[#d8d3c5] text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(selectedEmail.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Lead Integration Card */}
                {getLeadForEmail(selectedEmail.from) ? (
                  (() => {
                    const lead = getLeadForEmail(selectedEmail.from)!;
                    return (
                      <div className="bg-white rounded-2xl border border-[#09fe94]/30 p-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#09fe94]/20 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-[#05c472]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#171717]">{lead.name}</p>
                            <p className="text-xs text-[#a09b8f]">Nåværende status: <Badge variant={lead.status === "Booket møte" ? "purple" : "blue"} className="ml-1">{lead.status}</Badge></p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                           <Button variant="secondary" size="sm" onClick={() => handleViewProfile(lead.id)}>
                              Se lead profil <ChevronRight className="w-4 h-4 ml-1" />
                           </Button>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-[#faf8f2] rounded-2xl border border-dashed border-[#d8d3c5] p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f2efe3] rounded-xl flex items-center justify-center">
                          <Plus className="w-5 h-5 text-[#a09b8f]" />
                        </div>
                        <p className="text-sm text-[#6b6660]">Avsender er ikke lagret som et lead ennå.</p>
                     </div>
                     <Button variant="primary" size="sm" onClick={() => toast.info("Opprett lead funksjon kommer!")}>
                        Lagre som lead +
                     </Button>
                  </div>
                )}
              </div>

              <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto pb-12">
                   <div className="text-sm text-[#171717] leading-relaxed whitespace-pre-wrap mb-8">
                      {selectedEmail.snippet}
                   </div>

                   {/* Reply Area */}
                   {isReplying ? (
                     <div className="bg-[#faf8f2] border border-[#09fe94]/40 rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-2 mb-3">
                           <Reply className="w-4 h-4 text-[#05c472]" />
                           <span className="text-xs font-bold text-[#171717]">Svarer til: {selectedEmail.from}</span>
                        </div>
                        <textarea
                          value={replyBody}
                          onChange={(e) => setReplyBody(e.target.value)}
                          placeholder="Skriv ditt svar her..."
                          className="w-full bg-white border border-[#d8d3c5] rounded-xl p-4 text-sm min-h-[200px] focus:outline-none focus:border-[#09fe94] transition-all resize-none shadow-inner"
                          autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-4">
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             onClick={() => setIsReplying(false)}
                             className="text-[#6b6660]"
                           >
                             Avbryt
                           </Button>
                           <Button 
                             variant="primary" 
                             size="sm" 
                             className="bg-[#171717] text-[#09fe94] font-bold px-6"
                             onClick={sendReply}
                             disabled={sending || !replyBody.trim()}
                           >
                              {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                              Send svar
                           </Button>
                        </div>
                     </div>
                   ) : (
                     <div className="pt-8 border-t border-[#e8e4d8] text-xs text-[#a09b8f] italic">
                        Klikk på knappen under for å svare på denne meldingen.
                     </div>
                   )}
                </div>
              </div>

              {/* Action Floating Bar - Hidden when replying to avoid clutter */}
              {!isReplying && (
                <div className="p-4 border-t border-[#e8e4d8] bg-white flex items-center justify-center gap-3 sticky bottom-0 z-10 shadow-sm">
                    <Button variant="primary" className="bg-[#09fe94] text-black font-bold h-11 px-8 hover:scale-105 transition-transform" onClick={handleReply}>
                       <Reply className="w-4 h-4 mr-2" />
                       Svar på e-post
                    </Button>
                    <Button variant="outline" className="border-[#d8d3c5] h-11 px-8" onClick={() => toast.info("Videresending kommer!")}>
                       <Send className="w-4 h-4 mr-2" />
                       Videresend
                    </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
