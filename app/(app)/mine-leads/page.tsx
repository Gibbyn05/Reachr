"use client";
import { useState, useRef, useEffect } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users, TrendingUp, Calendar, Star, Search, ChevronDown,
  X, Phone, Mail, MessageSquare, ChevronRight, Trash2,
  UserCheck, Clock, Building2, Bell, Check, Loader2, Sparkles, Send, Copy, ExternalLink,
  Upload, Download, RefreshCw, Layers, CheckCircle2
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { Lead, LeadStatus } from "@/lib/mock-data";
import { toast } from "sonner";

/* ── Meeting date modal ───────────────────────────────────── */
function MeetingDateModal({
  leadName,
  existing,
  onSave,
  onClose,
}: {
  leadName: string;
  existing?: string;
  onSave: (dt: string) => void;
  onClose: () => void;
}) {
  const [dt, setDt] = useState(existing ?? "");
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-[#faf8f2] rounded-2xl shadow-xl p-6 w-80" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-bold text-[#171717] mb-1">Dato og tid for møtet</h3>
        <p className="text-xs text-[#a09b8f] mb-4">{leadName}</p>
        <input
          type="datetime-local"
          value={dt}
          onChange={(e) => setDt(e.target.value)}
          className="w-full text-sm border border-[#d8d3c5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#09fe94]/60 bg-[#faf8f2]"
          autoFocus
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => { if (dt) onSave(dt); }}
            disabled={!dt}
            className="flex-1 py-2 bg-[#09fe94] text-[#171717] text-sm font-semibold rounded-lg hover:bg-[#00e882] disabled:opacity-40"
          >
            Lagre møtetid
          </button>
          <button onClick={onClose} className="px-4 py-2 border border-[#d8d3c5] text-sm rounded-lg hover:bg-[#f0ece0]">
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── AI SMS modal ──────────────────────────────────────────── */
function AiSmsModal({
  lead,
  senderName,
  salesPitch,
  onClose,
  onSmsSent,
}: {
  lead: Lead;
  senderName: string;
  salesPitch?: string;
  onClose: () => void;
  onSmsSent?: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const [comment, setComment] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { generateDraft(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const generateDraft = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/sms/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, senderName, salesPitch, comment }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setText(data.text ?? "");
    } catch {
      setError("Klarte ikke generere SMS. Sjekk ANTHROPIC_API_KEY.");
    } finally {
      setGenerating(false);
    }
  };

  const phone = lead.phone && lead.phone !== "—" ? lead.phone.replace(/\s/g, "") : null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-[#faf8f2] rounded-2xl shadow-xl w-[480px] max-w-[95vw]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#e8e4d8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#09fe94]/10 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171717]">AI-SMS til {lead.name}</h3>
              <p className="text-xs text-[#a09b8f]">{phone ?? "Ingen tlf registrert"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#a09b8f] hover:text-[#6b6660]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {generating ? (
            <div className="flex items-center justify-center py-10 gap-3 text-[#6b6660]">
              <Loader2 className="w-5 h-5 animate-spin text-green-500" />
              <span className="text-sm">Skriver SMS med AI…</span>
            </div>
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#6b6660]">SMS-tekst</label>
                  <span className={`text-xs ${text.length > 160 ? "text-red-500" : "text-[#a09b8f]"}`}>{text.length}/160 tegn</span>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="w-full text-sm border border-[#d8d3c5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#09fe94]/60 bg-[#faf8f2] resize-none"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generateDraft()}
                  placeholder="F.eks. «kortere», «mer direkte»"
                  className="flex-1 text-sm border border-[#d8d3c5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#09fe94]/60 bg-[#faf8f2]"
                />
                <button
                  onClick={generateDraft}
                  className="flex items-center gap-1 text-xs text-[#05c472] hover:text-[#03a05a] font-medium border border-[#09fe94]/30 rounded-lg px-3 py-2 bg-[#09fe94]/8 hover:bg-[#09fe94]/15 whitespace-nowrap"
                >
                  <Sparkles className="w-3 h-3" />
                  Generer på nytt
                </button>
              </div>

              {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

              {sent && (
                <div className="flex items-center gap-2 px-3 py-2 bg-[#09fe94]/8 border border-[#09fe94]/30 rounded-lg text-xs text-[#05c472] font-medium">
                  <Check className="w-3.5 h-3.5" />
                  SMS sendt — kontaktstatus oppdatert!
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                {phone ? (
                  <a
                    href={`sms:${phone}?body=${encodeURIComponent(text)}`}
                    onClick={() => { onSmsSent?.(text); setSent(true); setTimeout(onClose, 1800); }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Åpne i SMS-app
                  </a>
                ) : (
                  <span className="text-xs text-[#a09b8f]">Ingen tlf — kopier teksten og send manuelt</span>
                )}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                    onSmsSent?.(text);
                    setSent(true);
                    setTimeout(onClose, 1800);
                  }}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#d8d3c5] rounded-lg hover:bg-[#f0ece0] text-[#6b6660]"
                >
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Kopiert!" : "Kopier tekst"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── AI Email modal ────────────────────────────────────────── */
function AiEmailModal({
  lead,
  senderName,
  salesPitch,
  targetCustomers,
  onClose,
  onEmailSent,
}: {
  lead: Lead;
  senderName: string;
  salesPitch?: string;
  targetCustomers?: string;
  onClose: () => void;
  onEmailSent?: (subject: string, body: string) => void;
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [toEmail, setToEmail] = useState(lead.email && lead.email !== "—" ? lead.email : "");
  const [comment, setComment] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [connections, setConnections] = useState<{ provider: string; email_address: string }[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [enriching, setEnriching] = useState(false);
  const [enrichResult, setEnrichResult] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("/api/email/connections")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setConnections(data);
          setSelectedProvider(data[0].provider);
        }
      })
      .catch(() => {});
    generateDraft();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateDraft = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, senderName, salesPitch, targetCustomers, comment }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setSubject(data.subject ?? "");
      setBody(data.body ?? "");
    } catch {
      setError("Klarte ikke generere e-post. Sjekk ANTHROPIC_API_KEY.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!toEmail || !subject || !body || !selectedProvider) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: selectedProvider, to: toEmail, subject, body }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      onEmailSent?.(subject, body);
      setSentOk(true);
      setTimeout(onClose, 2000);
    } catch {
      setError("Sending feilet. Prøv igjen.");
    } finally {
      setSending(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Emne: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFindEmail = async () => {
    setEnriching(true);
    setEnrichResult(null);
    try {
      const params = new URLSearchParams();
      if (lead.orgNumber) params.set("orgnr", lead.orgNumber);
      if (lead.name) params.set("name", lead.name);
      if (lead.city) params.set("poststed", lead.city);
      const res = await fetch(`/api/enrich/email?${params}`);
      const data = await res.json();
      const emails: string[] = data.emails ?? [];
      setEnrichResult(emails);
      if (emails.length > 0) setToEmail(emails[0]);
    } catch {
      setEnrichResult([]);
    } finally {
      setEnriching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-[#faf8f2] rounded-2xl shadow-xl w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e8e4d8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171717]">AI-utkast til {lead.name}</h3>
              <p className="text-xs text-[#a09b8f]">{lead.industry} · {lead.city}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#a09b8f] hover:text-[#6b6660]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {generating ? (
            <div className="flex items-center justify-center py-12 gap-3 text-[#6b6660]">
              <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
              <span className="text-sm">Skriver e-post med AI…</span>
            </div>
          ) : sentOk ? (
            <div className="flex items-center justify-center py-12 gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">E-post sendt!</span>
            </div>
          ) : (
            <>
              {/* To */}
              <div>
                <label className="block text-xs font-semibold text-[#6b6660] mb-1">Til</label>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="mottaker@bedrift.no"
                  className="w-full text-sm border border-[#d8d3c5] rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 bg-[#faf8f2]"
                />
                {!toEmail && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-2">
                    <p className="font-semibold">Ingen e-post registrert for denne bedriften.</p>

                    {/* Auto-search button */}
                    <button
                      onClick={handleFindEmail}
                      disabled={enriching}
                      className="flex items-center gap-1.5 text-xs font-medium bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 disabled:opacity-60 transition-colors"
                    >
                      {enriching ? (
                        <><Loader2 className="w-3 h-3 animate-spin" /> Søker…</>
                      ) : (
                        <><Search className="w-3 h-3" /> Finn e-post automatisk</>
                      )}
                    </button>

                    {/* Enrichment result */}
                    {enrichResult !== null && enrichResult.length === 0 && (
                      <p className="text-amber-700">Ingen e-post funnet i 1881, Gulesider eller Proff.</p>
                    )}
                    {enrichResult !== null && enrichResult.length > 1 && (
                      <div className="space-y-1">
                        <p className="font-medium">Flere e-poster funnet — velg én:</p>
                        {enrichResult.map((e) => (
                          <button
                            key={e}
                            onClick={() => setToEmail(e)}
                            className="block w-full text-left text-amber-800 hover:text-amber-900 underline truncate"
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Manual fallback links */}
                    <div>
                      <p className="text-amber-700 mb-1">Eller søk manuelt:</p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`https://www.1881.no/firma/?query=${encodeURIComponent(lead.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-amber-700 underline hover:text-amber-900"
                        >
                          <ExternalLink className="w-3 h-3" /> 1881.no
                        </a>
                        <a
                          href={`https://www.gulesider.no/finn/${encodeURIComponent(lead.name)}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-amber-700 underline hover:text-amber-900"
                        >
                          <ExternalLink className="w-3 h-3" /> Gulesider.no
                        </a>
                        <a
                          href={`https://www.proff.no/søk?q=${encodeURIComponent(lead.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-amber-700 underline hover:text-amber-900"
                        >
                          <ExternalLink className="w-3 h-3" /> Proff.no
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-[#6b6660] mb-1">Emne</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-sm border border-[#d8d3c5] rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 bg-[#faf8f2]"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs font-semibold text-[#6b6660] mb-1">Innhold</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  className="w-full text-sm border border-[#d8d3c5] rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 bg-[#faf8f2] resize-none"
                />
              </div>

              {/* AI comment / regenerate */}
              <div>
                <label className="block text-xs font-semibold text-[#6b6660] mb-1">Instruksjon til AI (valgfritt)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && generateDraft()}
                    placeholder="F.eks. «gjør den kortere», «mer uformell», «fremhev pris»"
                    className="flex-1 text-sm border border-[#d8d3c5] rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 bg-[#faf8f2]"
                  />
                  <button
                    onClick={generateDraft}
                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium border border-purple-200 rounded-lg px-3 py-2 bg-purple-50 hover:bg-purple-100 whitespace-nowrap"
                  >
                    <Sparkles className="w-3 h-3" />
                    Generer på nytt
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
              )}

              {/* Send via */}
              <div className="flex items-center gap-3 pt-1">
                {connections.length > 0 ? (
                  <>
                    {connections.length > 1 && (
                      <select
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className="text-xs border border-[#d8d3c5] rounded-lg px-2 py-1.5 focus:outline-none bg-[#faf8f2] text-gray-700"
                      >
                        {connections.map((c) => (
                          <option key={c.provider} value={c.provider}>
                            {c.provider === "gmail" ? "Gmail" : "Outlook"} ({c.email_address})
                          </option>
                        ))}
                      </select>
                    )}
                    {connections.length === 1 && (
                      <span className="text-xs text-[#6b6660]">
                        Send via {connections[0].provider === "gmail" ? "Gmail" : "Outlook"} ({connections[0].email_address})
                      </span>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSend}
                      disabled={sending || !toEmail || !subject || !body}
                      className="bg-purple-600 hover:bg-purple-700 ml-auto"
                    >
                      {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      Send e-post
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-[#a09b8f]">Ingen e-postkonto tilkoblet –</span>
                    <a href="/innstillinger?tab=epost" className="text-xs text-purple-600 hover:underline font-medium">koble til her</a>
                    <button
                      onClick={handleCopy}
                      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#d8d3c5] rounded-lg hover:bg-[#f0ece0] text-[#6b6660]"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Kopiert!" : "Kopier tekst"}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const DEFAULT_STATUS_COLORS: Record<string, "gray" | "blue" | "yellow" | "purple" | "red" | "green"> = {
  "Ikke kontaktet": "gray",
  "Kontaktet": "blue",
  "Kontaktet - ikke svar": "yellow",
  "Booket møte": "purple",
  "Avslått": "red",
  "Kunde": "green",
};

function getStatusColor(status: string): "gray" | "blue" | "yellow" | "purple" | "red" | "green" {
  return DEFAULT_STATUS_COLORS[status] ?? "gray";
}

function LeadRow({
  lead,
  onStatusChange,
  onNotesChange,
  onAssignedChange,
  onLastContactedChange,
  onRemove,
  meetingDate,
  onMeetingDateSave,
  teamMembers,
  senderName,
  salesPitch,
  targetCustomers,
}: {
  lead: Lead;
  onStatusChange: (id: string, status: string) => void;
  onNotesChange: (id: string, notes: string) => void;
  onAssignedChange: (id: string, val: string) => void;
  onLastContactedChange: (id: string, date: string | null) => void;
  onRemove: (id: string) => void;
  meetingDate?: string;
  onMeetingDateSave: (leadId: string, dt: string) => void;
  teamMembers: string[];
  senderName: string;
  salesPitch?: string;
  targetCustomers?: string;
}) {
  const statusOptions = useAppStore(s => s.pipelineStages);
  const updateLeadEmail = useAppStore(s => s.updateLeadEmail);
  const sequences = useAppStore(s => s.sequences);
  const enrollLeadInSequence = useAppStore(s => s.enrollLeadInSequence);
  const [seqDropdownOpen, setSeqDropdownOpen] = useState(false);

  const handleEmailSent = (subject: string, emailBody: string) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" });
    const timeStr = now.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
    const newNote = `E-post sendt ${dateStr} kl. ${timeStr}\nEmne: ${subject}\n\n${emailBody}`;
    const combined = lead.notes && lead.notes !== "—" && lead.notes.trim()
      ? `${newNote}\n\n---\n\n${lead.notes}`
      : newNote;
    onStatusChange(lead.id, "Kontaktet");
    onLastContactedChange(lead.id, now.toISOString().split("T")[0]);
    onNotesChange(lead.id, combined);
    setNotes(combined);
  };

  const handleSmsSent = (smsText: string) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" });
    const timeStr = now.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
    const newNote = `SMS sendt ${dateStr} kl. ${timeStr}\n\n${smsText}`;
    const combined = lead.notes && lead.notes !== "—" && lead.notes.trim()
      ? `${newNote}\n\n---\n\n${lead.notes}`
      : newNote;
    onStatusChange(lead.id, "Kontaktet");
    onLastContactedChange(lead.id, now.toISOString().split("T")[0]);
    onNotesChange(lead.id, combined);
    setNotes(combined);
  };
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(lead.notes);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const statusBtnRef = useRef<HTMLButtonElement>(null);
  const [editingAssigned, setEditingAssigned] = useState(false);
  const [assignedDraft, setAssignedDraft] = useState(lead.assignedTo);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderMsg, setReminderMsg] = useState("");
  const [reminderSending, setReminderSending] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);
  const [findingEmail, setFindingEmail] = useState(false);

  const openStatusDropdown = () => {
    const rect = statusBtnRef.current?.getBoundingClientRect();
    if (rect) setDropdownCoords({ top: rect.bottom + 4, left: rect.left });
    setStatusDropdown(true);
  };

  const handleSendReminder = async () => {
    setReminderSending(true);
    try {
      await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: lead.assignedTo.includes("@") ? lead.assignedTo : undefined,
          inviterName: "Reachr",
          companyName: `Påminnelse: ${lead.name}`,
          message: reminderMsg,
        }),
      });
      setReminderSent(true);
      setReminderMsg("");
      setTimeout(() => { setReminderSent(false); setReminderOpen(false); }, 3000);
    } catch {
      // silent fail — reminder is best-effort
      setReminderSent(true);
      setTimeout(() => { setReminderSent(false); setReminderOpen(false); }, 2000);
    } finally {
      setReminderSending(false);
    }
  };

  const handleFindEmail = async () => {
    setFindingEmail(true);
    try {
      const res = await fetch("/api/email-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: lead.website,
          orgNumber: lead.orgNumber,
        }),
      });
      const data = await res.json();
      if (data.email && data.email !== "—") {
        updateLeadEmail(lead.id, data.email);
      }
    } catch (err) {
      console.error("Failed to find email:", err);
    } finally {
      setFindingEmail(false);
    }
  };

  return (
    <>
      <tr
        className="hover:bg-[#f0ece0] transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Name */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <ChevronRight
              className={`w-4 h-4 text-[#a09b8f] transition-transform flex-shrink-0 ${expanded ? "rotate-90" : ""}`}
            />
            <div className="w-8 h-8 bg-[#e8e4d8] rounded-lg flex items-center justify-center text-xs font-bold text-[#6b6660] flex-shrink-0">
              {lead.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#171717] truncate">{lead.name}</p>
              <p className="text-xs text-[#a09b8f]">{lead.industry}</p>
            </div>
          </div>
        </td>

        {/* Contact */}
        <td className="hidden sm:table-cell px-4 py-3.5 text-sm text-[#6b6660] whitespace-nowrap">{lead.contactPerson}</td>

        {/* Status — uses fixed dropdown to avoid table overflow clipping */}
        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <button
              ref={statusBtnRef}
              onClick={openStatusDropdown}
              className="flex items-center gap-1.5"
            >
              <Badge variant={getStatusColor(lead.status)}>{lead.status}</Badge>
              <ChevronDown className="w-3 h-3 text-[#a09b8f]" />
            </button>
          </div>
        </td>

        {/* Last contacted / Meeting date */}
        <td className="hidden md:table-cell px-4 py-3.5 text-sm text-[#6b6660] whitespace-nowrap">
          {lead.status === "Booket møte" && meetingDate ? (
            <span className="flex items-center gap-1 text-purple-600 font-medium text-xs">
              <Calendar className="w-3 h-3" />
              {new Date(meetingDate).toLocaleString("nb-NO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </span>
          ) : lead.lastContacted ? (
            new Date(lead.lastContacted).toLocaleDateString("nb-NO")
          ) : "—"}
        </td>

        {/* Assigned */}
        <td className="hidden md:table-cell px-4 py-3.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0F1729] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {lead.assignedAvatar}
            </div>
            <span className="text-sm text-[#6b6660] whitespace-nowrap">{lead.assignedTo}</span>
          </div>
        </td>

        {/* Notes preview */}
        <td className="hidden lg:table-cell px-4 py-3.5 text-sm text-[#a09b8f] max-w-xs truncate">
          {lead.notes || <span className="text-gray-300 italic">Ingen notater</span>}
        </td>
      </tr>

      {/* Fixed-position status dropdown rendered outside table flow */}
      {statusDropdown && (
        <>
          <tr style={{ display: "none" }} />
          {typeof window !== "undefined" && (
            <>
              <div
                className="fixed inset-0 z-[998]"
                onClick={() => setStatusDropdown(false)}
              />
              <div
                className="fixed bg-[#faf8f2] rounded-xl border border-[#d8d3c5] shadow-xl z-[999] py-1 w-52"
                style={{ top: dropdownCoords.top, left: dropdownCoords.left }}
              >
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#f0ece0] text-left"
                    onClick={() => {
                      onStatusChange(lead.id, s);
                      setStatusDropdown(false);
                      if (s === "Booket møte") setMeetingModalOpen(true);
                    }}
                  >
                    <Badge variant={getStatusColor(s)}>{s}</Badge>
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Expanded detail panel */}
      {expanded && (
        <tr>
          <td colSpan={6} className="bg-slate-50 border-b border-[#e8e4d8]" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 space-y-5">

              {/* Quick status buttons */}
              <div>
                <p className="text-xs font-semibold text-[#a09b8f] uppercase tracking-wider mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => { onStatusChange(lead.id, s); if (s === "Booket møte") setMeetingModalOpen(true); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        lead.status === s
                          ? "border-transparent ring-2 ring-offset-1"
                          : "border-[#d8d3c5] bg-[#faf8f2] hover:border-[#a09b8f]"
                      }`}
                      style={lead.status === s ? {
                        backgroundColor: {
                          "Ikke kontaktet": "#F3F4F6", "Kontaktet": "#DBEAFE",
                          "Kontaktet - ikke svar": "#FEF3C7", "Booket møte": "#EDE9FE",
                          "Avslått": "#FEE2E2", "Kunde": "#DCFCE7",
                        }[s] as string,
                        color: {
                          "Ikke kontaktet": "#374151", "Kontaktet": "#1D4ED8",
                          "Kontaktet - ikke svar": "#92400E", "Booket møte": "#6D28D9",
                          "Avslått": "#B91C1C", "Kunde": "#15803D",
                        }[s] as string,
                      } : {}}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {/* Contact info */}
                <div>
                  <p className="text-xs font-semibold text-[#a09b8f] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Kontaktinformasjon
                  </p>
                  <div className="space-y-2">
                    <a
                      href={`tel:${lead.phone}`}
                      className="flex items-center gap-2 text-sm text-[#6b6660] hover:text-green-600"
                    >
                      <Phone className="w-4 h-4 text-[#a09b8f]" />
                      {lead.phone !== "—" ? lead.phone : <span className="text-gray-300 italic">Ingen telefon</span>}
                    </a>
                    {lead.email !== "—" ? (
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-2 text-sm text-[#6b6660] hover:text-green-600"
                      >
                        <Mail className="w-4 h-4 text-[#a09b8f]" />
                        {lead.email}
                      </a>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300 italic">Ingen e-post</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleFindEmail(); }}
                          disabled={findingEmail}
                          className="text-xs px-2 py-1 bg-[#09fe94]/10 text-[#05c472] rounded hover:bg-[#09fe94]/20 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {findingEmail ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                          Finn e-post
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-[#a09b8f] flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5" />{lead.address || "—"}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEmailModalOpen(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg hover:bg-purple-100 transition-colors border border-purple-100"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Skriv AI-e-post
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSmsModalOpen(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#09fe94]/10 text-[#05c472] text-xs font-semibold rounded-lg hover:bg-[#09fe94]/20 transition-colors border border-[#09fe94]/20"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Skriv AI-SMS
                  </button>

                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSeqDropdownOpen(!seqDropdownOpen); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                        lead.enrolledSequenceId 
                          ? "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100" 
                          : "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      {lead.enrolledSequenceId 
                        ? sequences.find(s => s.id === lead.enrolledSequenceId)?.name || "I sekvens" 
                        : "Legg til i sekvens"}
                      <ChevronDown className="w-3 h-3 ml-0.5" />
                    </button>

                    {seqDropdownOpen && (
                      <div 
                        className="absolute right-0 top-full mt-1 w-56 bg-white border border-[#d8d3c5] rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="px-3 py-1.5 text-[10px] font-bold text-[#a09b8f] uppercase tracking-wider bg-gray-50 border-b border-gray-100 mb-1">
                          Velg oppfølgingsløp
                        </p>
                        {sequences.length === 0 ? (
                          <div className="px-3 py-4 text-center">
                            <p className="text-[10px] text-[#6b6660] italic">Ingen sekvenser opprettet.</p>
                            <a href="/sekvenser/ny" className="text-[10px] text-orange-600 hover:underline mt-1 block">Opprett din første nå</a>
                          </div>
                        ) : (
                          <>
                            {sequences.map(seq => (
                              <button
                                key={seq.id}
                                onClick={async () => {
                                  setSeqDropdownOpen(false);
                                  const promise = enrollLeadInSequence(lead.id, seq.id);
                                  toast.promise(promise, {
                                    loading: `Legger til i "${seq.name}"...`,
                                    success: `Lagt til i "${seq.name}"!`,
                                    error: (err) => `Feil: ${err.message}`,
                                  });
                                }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-[#f0ece0] flex items-center justify-between ${lead.enrolledSequenceId === seq.id ? "bg-blue-50 text-blue-700 font-medium" : "text-[#6b6660]"}`}
                              >
                                {seq.name}
                                {lead.enrolledSequenceId === seq.id && <Check className="w-3 h-3" />}
                              </button>
                            ))}
                            {lead.enrolledSequenceId && (
                              <>
                                <div className="h-px bg-gray-100 my-1" />
                                <button
                                  onClick={() => {
                                    enrollLeadInSequence(lead.id, null);
                                    setSeqDropdownOpen(false);
                                    toast.info("Fjernet fra sekvens");
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <X className="w-3 h-3" />
                                  Stopp sekvens
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  </div>

                  {/* Last contacted */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-[#a09b8f] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Sist kontaktet
                    </p>
                    <input
                      type="date"
                      value={lead.lastContacted ?? ""}
                      onChange={(e) => onLastContactedChange(lead.id, e.target.value || null)}
                      className="text-sm border border-[#d8d3c5] rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:border-[#09fe94]/60 bg-[#faf8f2] w-full"
                    />
                    {lead.lastContacted && (
                      <button
                        onClick={() => onLastContactedChange(lead.id, null)}
                        className="text-xs text-[#a09b8f] hover:text-[#6b6660] mt-1 underline"
                      >
                        Nullstill dato
                      </button>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-[#a09b8f] uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Notater
                    </p>
                    {!editingNotes && (
                      <button
                        onClick={() => setEditingNotes(true)}
                        className="text-xs text-[#ff470a] hover:underline font-medium"
                      >
                        Rediger
                      </button>
                    )}
                  </div>
                  {editingNotes ? (
                    <div>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-3 border border-[#d8d3c5] rounded-lg text-sm text-[#3d3a34] focus:outline-none focus:ring-2 focus:ring-[#09fe94]/20 focus:border-[#09fe94]/60 resize-none bg-[#faf8f2]"
                        rows={5}
                        placeholder="Legg til notater om dette leadet..."
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            onNotesChange(lead.id, notes);
                            setEditingNotes(false);
                          }}
                        >
                          Lagre
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setNotes(lead.notes);
                            setEditingNotes(false);
                          }}
                        >
                          Avbryt
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-[#6b6660] bg-[#faf8f2] border border-gray-100 rounded-lg p-3 min-h-[80px] cursor-text"
                      onClick={() => setEditingNotes(true)}
                    >
                      {notes || <span className="italic text-gray-300">Klikk for å legge til notater…</span>}
                    </div>
                  )}
                </div>

                {/* Meta info */}
                <div>
                  <p className="text-xs font-semibold text-[#a09b8f] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" /> Ansvar og info
                  </p>
                  <div className="space-y-3">
                    {/* Assigned to — dropdown */}
                    <div>
                      <p className="text-xs text-[#a09b8f] mb-1">Ansvarlig</p>
                      {teamMembers.length > 1 ? (
                        <div className="relative">
                          <select
                            value={lead.assignedTo}
                            onChange={(e) => onAssignedChange(lead.id, e.target.value)}
                            className="w-full appearance-none pl-9 pr-8 py-1.5 text-sm border border-[#d8d3c5] rounded-lg focus:outline-none focus:border-[#09fe94]/60 bg-[#faf8f2] cursor-pointer text-gray-700"
                          >
                            {teamMembers.map((name) => (
                              <option key={name} value={name}>{name}</option>
                            ))}
                          </select>
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#0F1729] rounded-full flex items-center justify-center text-white text-[9px] font-bold pointer-events-none">
                            {lead.assignedAvatar}
                          </div>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a09b8f] pointer-events-none" />
                        </div>
                      ) : (
                        <button
                          onClick={() => { setAssignedDraft(lead.assignedTo); setEditingAssigned(true); }}
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 group"
                        >
                          <div className="w-6 h-6 bg-[#0F1729] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {lead.assignedAvatar}
                          </div>
                          {lead.assignedTo}
                          <span className="text-xs text-gray-300 group-hover:text-green-500">(endre)</span>
                        </button>
                      )}
                      {editingAssigned && (
                        <div className="flex gap-1.5 mt-1.5">
                          <input
                            type="text"
                            value={assignedDraft}
                            onChange={(e) => setAssignedDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                onAssignedChange(lead.id, assignedDraft.trim() || lead.assignedTo);
                                setEditingAssigned(false);
                              }
                              if (e.key === "Escape") {
                                setAssignedDraft(lead.assignedTo);
                                setEditingAssigned(false);
                              }
                            }}
                            className="flex-1 text-sm border border-[#d8d3c5] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#09fe94]/60 bg-[#faf8f2]"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              onAssignedChange(lead.id, assignedDraft.trim() || lead.assignedTo);
                              setEditingAssigned(false);
                            }}
                            className="px-2 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600"
                          >
                            OK
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Send reminder to assigned */}
                    <div>
                      {!reminderOpen ? (
                        <button
                          onClick={() => setReminderOpen(true)}
                          className="flex items-center gap-1.5 text-xs text-[#ff470a] hover:text-[#d63b08] font-medium"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          Send påminnelse til {lead.assignedTo}
                        </button>
                      ) : reminderSent ? (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Påminnelse sendt!
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-[#6b6660] font-medium">Melding til {lead.assignedTo}:</p>
                          <textarea
                            value={reminderMsg}
                            onChange={(e) => setReminderMsg(e.target.value)}
                            placeholder={`Husk å følge opp ${lead.name}...`}
                            className="w-full text-xs border border-[#d8d3c5] rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-400 resize-none bg-[#faf8f2]"
                            rows={2}
                            autoFocus
                          />
                          <div className="flex gap-1.5">
                            <button
                              onClick={handleSendReminder}
                              disabled={reminderSending}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs font-semibold hover:bg-blue-600 disabled:opacity-60"
                            >
                              {reminderSending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bell className="w-3 h-3" />}
                              Send
                            </button>
                            <button
                              onClick={() => { setReminderOpen(false); setReminderMsg(""); }}
                              className="px-2 py-1 border border-[#d8d3c5] rounded text-xs text-[#6b6660] hover:bg-[#f0ece0]"
                            >
                              Avbryt
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Added by — read only */}
                    <div>
                      <p className="text-xs text-[#a09b8f] mb-1">Lagt til av</p>
                      <p className="text-sm text-gray-700">{lead.addedBy || "—"}</p>
                    </div>

                    {/* Other meta */}
                    <div className="space-y-1.5 text-sm text-[#6b6660] pt-2 border-t border-gray-100">
                      <p><span className="text-[#a09b8f]">Org.nr:</span> {lead.orgNumber}</p>
                      <p><span className="text-[#a09b8f]">Ansatte:</span> {lead.employees || "—"}</p>
                      <p><span className="text-[#a09b8f]">La til:</span> {new Date(lead.addedDate).toLocaleDateString("nb-NO")}</p>
                    </div>

                    {/* Remove lead */}
                    <div className="pt-3 border-t border-gray-100">
                      {confirmDelete ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-600 font-medium">Sikker?</span>
                          <button
                            onClick={() => onRemove(lead.id)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600"
                          >
                            Ja, fjern
                          </button>
                          <button
                            onClick={() => setConfirmDelete(false)}
                            className="px-2 py-1 border border-[#d8d3c5] rounded text-xs text-[#6b6660] hover:bg-[#f0ece0]"
                          >
                            Avbryt
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(true)}
                          className="flex items-center gap-1.5 text-xs text-[#a09b8f] hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Fjern fra pipeline
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}

      {/* Meeting date modal */}
      {meetingModalOpen && (
        <MeetingDateModal
          leadName={lead.name}
          existing={meetingDate}
          onSave={(dt) => { onMeetingDateSave(lead.id, dt); setMeetingModalOpen(false); }}
          onClose={() => setMeetingModalOpen(false)}
        />
      )}

      {/* AI email modal */}
      {emailModalOpen && (
        <AiEmailModal
          lead={lead}
          senderName={senderName}
          salesPitch={salesPitch}
          targetCustomers={targetCustomers}
          onClose={() => setEmailModalOpen(false)}
          onEmailSent={handleEmailSent}
        />
      )}

      {/* AI SMS modal */}
      {smsModalOpen && (
        <AiSmsModal
          lead={lead}
          senderName={senderName}
          salesPitch={salesPitch}
          onClose={() => setSmsModalOpen(false)}
          onSmsSent={handleSmsSent}
        />
      )}
    </>
  );
}

export default function MineLeadsPage() {
  const { leads, loadLeads, addLead, updateLeadStatus, updateLeadNotes, updateLeadAssigned, updateLeadLastContacted, removeLead, meetingDates, setMeetingDate, currentUser, pipelineStages } = useAppStore();
  const [search, setSearch] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSyncEmails = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/email/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "E-poster synkronisert for svar!");
      } else {
        alert(data.error || "Ugyldig eller utløpt token, vennligst autentiser på nytt i Innstillinger.");
      }
    } catch {
      alert("Feil under synkronisering med e-postleverandør.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Bedriftsnavn", "Kontaktperson", "E-post", "Telefon", "Orgnr", "Status", "Lagt til dato", "Kilde", "Notater"];
    const rows = leads.map(l => [
      l.id, l.name, l.contactPerson || "", l.email || "", l.phone || "", l.orgNumber || "",
      l.status || "", l.addedDate || "", l.addedBy || "", (l.notes || "").replace(/\n/g, " ")
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${(cell || "").replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `reachr_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        // Simple CSV parse handling quotes somewhat
        const rows = text.split("\n")
          .filter(r => r.trim()) // filter empty lines
          .map(r => r.split(",").map(c => c.replace(/^"|"$/g, "").trim()));
          
        if (rows.length < 2) return;
        
        const headers = rows[0].map(h => h.toLowerCase());
        const getIdx = (keywords: string[]) => headers.findIndex(h => keywords.some(k => h === k || h.includes(k)));
        
        let nameIdx = getIdx(["bedriftsnavn", "navn", "bedrift", "company", "name"]);
        if (nameIdx === -1) nameIdx = 0; // Assume first column
        
        let contactIdx = getIdx(["kontaktperson", "contact person", "contactperson"]);
        if (contactIdx === -1 && headers.includes("kontakt")) contactIdx = headers.indexOf("kontakt");
        
        const locIdx = getIdx(["lokasjon", "by", "poststed", "city", "location"]);
        const emailIdx = getIdx(["e-post", "epost", "email"]);
        const phoneIdx = getIdx(["telefon", "tlf", "phone"]);
        const orgIdx = getIdx(["orgnr", "org", "organisasjonsnummer"]);
        const statusIdx = getIdx(["status", "kontaktet"]);
        const notesIdx = getIdx(["notater", "notes", "notat"]);

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length === 0 || !row[nameIdx]) continue; // skip empty rows
            
            let status = "Ikke kontaktet";
            if (statusIdx >= 0) {
              const sval = row[statusIdx]?.toLowerCase() || "";
              if (sval === "ja" || sval === "yes" || sval === "kontaktet") status = "Kontaktet";
              else if (["kontaktet - ikke svar", "ikke svar"].includes(sval)) status = "Kontaktet - ikke svar";
              else if (["booket møte", "møte booket", "møte"].includes(sval)) status = "Booket møte";
              else if (["avslått", "nei"].includes(sval)) status = "Avslått";
              else if (["kunde", "vunnet"].includes(sval)) status = "Kunde";
              else if (sval && ["ikke kontaktet", "kontaktet", "kontaktet - ikke svar", "booket møte", "avslått", "kunde"].includes(row[statusIdx])) {
                 status = row[statusIdx]; // try to use it directly if it matches exactly
              }
            }

            const newLead: Lead = {
               id: crypto.randomUUID(),
               name: row[nameIdx],
               contactPerson: contactIdx >= 0 && row[contactIdx] ? row[contactIdx] : "—",
               email: emailIdx >= 0 && row[emailIdx] ? row[emailIdx] : "—",
               phone: phoneIdx >= 0 && row[phoneIdx] ? row[phoneIdx] : "—",
               orgNumber: orgIdx >= 0 && row[orgIdx] ? row[orgIdx] : "—",
               status: status,
               addedDate: new Date().toISOString().split("T")[0],
               addedBy: currentUser?.name || "Importert",
               assignedTo: currentUser?.name || "Meg",
               assignedAvatar: (currentUser?.name || "M").substring(0,2).toUpperCase(),
               industry: "Importert fra CSV",
               city: locIdx >= 0 && row[locIdx] ? row[locIdx] : "Ukjent",
               address: "—",
               revenue: 0,
               employees: 0,
               lat: 0, lng: 0,
               notes: notesIdx >= 0 && row[notesIdx] ? row[notesIdx] : "",
               lastContacted: null,
            };
            // sequentially add to avoid overwhelming API immediately
            await addLead(newLead);
        }
        alert("Leads importert suksessfullt!");
      } catch (err) {
        alert("En feil oppstod under import. Sjekk at CSV-filen er i riktig format.");
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    // Load leads from API when component mounts (or when currentUser changes contextually)
    if (currentUser?.email) loadLeads();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.email]);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => {
        const names: string[] = (data.members ?? [])
          .filter((m: { status: string }) => m.status === "active")
          .map((m: { member_name: string; member_email: string }) => m.member_name || m.member_email);
        if (currentUser?.name && !names.includes(currentUser.name)) {
          names.unshift(currentUser.name);
        }
        if (names.length > 0) setTeamMembers(names);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.name]);
  const [statusFilter, setStatusFilter] = useState<string>("Alle");

  const assignedOptions = ["Alle", ...Array.from(new Set(leads.map((l) => l.assignedTo)))];
  const [assignedFilter, setAssignedFilter] = useState<string>("Alle");

  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      lead.orgNumber.includes(search);
    const matchStatus = statusFilter === "Alle" || lead.status === statusFilter;
    const matchAssigned = assignedFilter === "Alle" || lead.assignedTo === assignedFilter;
    return matchSearch && matchStatus && matchAssigned;
  });

  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const stats = [
    { label: "Totalt leads", value: leads.length, icon: Users, color: "text-[#05c472]", bg: "bg-[#09fe94]/10" },
    {
      label: "Nye denne uken",
      value: leads.filter((l) => l.addedDate >= thisWeek).length,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-[#09fe94]/10",
    },
    {
      label: "Booket møte",
      value: leads.filter((l) => l.status === "Booket møte").length,
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Kunder",
      value: leads.filter((l) => l.status === "Kunde").length,
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e8e4d8] bg-white pr-4 sm:pr-8">
        <TopBar title="Mine Leads" subtitle="CRM-pipeline og leadoversikt" />
        <div className="flex items-center gap-2 pb-4 sm:pb-0 px-4 sm:px-0 flex-shrink-0">
          <input type="file" ref={fileInputRef} onChange={handleImportCSV} accept=".csv" className="hidden" />
          <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="bg-white border-[#d8d3c5] text-[#6b6660] hover:bg-[#faf8f2] hover:text-[#171717]">
            {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {isImporting ? "Importerer..." : "Importér CSV"}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportCSV} className="bg-white border-[#d8d3c5] text-[#6b6660] hover:bg-[#faf8f2] hover:text-[#171717]">
            <Download className="w-4 h-4 mr-2" />
            Eksportér CSV
          </Button>
          <Button variant="primary" size="sm" onClick={handleSyncEmails} disabled={isSyncing} className="bg-[#09fe94] text-[#171717] hover:bg-[#00e882] shadow-sm font-semibold">
            {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {isSyncing ? "Sjekker innboks..." : "Synkroniser innboks"}
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-5" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${color}`} style={{ width: "18px", height: "18px" }} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#0F1729]">{value}</p>
                  <p className="text-xs text-[#6b6660]">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-4" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-48">
              <Input
                placeholder="Søk etter bedrift, kontakt eller org.nr..."
                icon={<Search className="w-4 h-4" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Status filter */}
            <div className="flex flex-wrap gap-1.5">
              {["Alle", ...pipelineStages].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === s
                      ? "bg-[#0F1729] text-white"
                      : "bg-[#e8e4d8] text-[#6b6660] hover:bg-[#d8d3c5]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Assigned filter */}
            {assignedOptions.length > 1 && (
              <div className="relative">
                <select
                  value={assignedFilter}
                  onChange={(e) => setAssignedFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-[#d8d3c5] text-sm text-[#6b6660] focus:outline-none focus:border-[#09fe94]/60 cursor-pointer bg-[#faf8f2]"
                >
                  {assignedOptions.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a09b8f] pointer-events-none" />
              </div>
            )}

            {(statusFilter !== "Alle" || assignedFilter !== "Alle" || search) && (
              <button
                onClick={() => {
                  setStatusFilter("Alle");
                  setAssignedFilter("Alle");
                  setSearch("");
                }}
                className="flex items-center gap-1.5 text-xs text-[#6b6660] hover:text-gray-700"
              >
                <X className="w-3.5 h-3.5" />
                Nullstill filtre
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] overflow-hidden" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr className="bg-[#f0ece0] border-b border-[#e8e4d8]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b6660] uppercase tracking-wider">Bedriftsnavn</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-[#6b6660] uppercase tracking-wider">Kontaktperson</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6b6660] uppercase tracking-wider">Status</th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-[#6b6660] uppercase tracking-wider">Sist kontaktet</th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-[#6b6660] uppercase tracking-wider">Ansvarlig</th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-[#6b6660] uppercase tracking-wider">Notater</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLeads.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onStatusChange={updateLeadStatus}
                    onNotesChange={updateLeadNotes}
                    onAssignedChange={updateLeadAssigned}
                    onLastContactedChange={updateLeadLastContacted}
                    onRemove={removeLead}
                    meetingDate={meetingDates[lead.id]}
                    onMeetingDateSave={setMeetingDate}
                    teamMembers={teamMembers}
                    senderName={currentUser?.name ?? ""}
                    salesPitch={currentUser?.salesPitch}
                    targetCustomers={currentUser?.targetCustomers}
                  />
                ))}
              </tbody>
            </table>

            {filteredLeads.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-[#6b6660] font-medium">
                  {leads.length === 0 ? "Ingen leads ennå" : "Ingen leads matcher filteret"}
                </p>
                <p className="text-sm text-[#a09b8f] mt-1">
                  {leads.length === 0 ? (
                    <>
                      Gå til{" "}
                      <a href="/leadsok" className="text-green-600 font-medium hover:underline">
                        Leadsøk
                      </a>{" "}
                      for å finne og legge til bedrifter.
                    </>
                  ) : "Prøv å endre søket eller filtrene."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
