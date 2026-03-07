"use client";
import { useState, useRef, useEffect } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users, TrendingUp, Calendar, Star, Search, ChevronDown,
  X, Phone, Mail, MessageSquare, ChevronRight, Trash2,
  UserCheck, Clock, Building2, Bell, Check, Loader2, Sparkles, Send, Copy,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { Lead, LeadStatus } from "@/lib/mock-data";

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
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-bold text-slate-900 mb-1">Dato og tid for møtet</h3>
        <p className="text-xs text-gray-400 mb-4">{leadName}</p>
        <input
          type="datetime-local"
          value={dt}
          onChange={(e) => setDt(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 bg-white"
          autoFocus
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => { if (dt) onSave(dt); }}
            disabled={!dt}
            className="flex-1 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 disabled:opacity-40"
          >
            Lagre møtetid
          </button>
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50">
            Avbryt
          </button>
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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">AI-utkast til {lead.name}</h3>
              <p className="text-xs text-gray-400">{lead.industry} · {lead.city}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {generating ? (
            <div className="flex items-center justify-center py-12 gap-3 text-gray-500">
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
                <label className="block text-xs font-semibold text-gray-500 mb-1">Til</label>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="mottaker@bedrift.no"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 bg-white"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Emne</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 bg-white"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Innhold</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 bg-white resize-none"
                />
              </div>

              {/* AI comment / regenerate */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Instruksjon til AI (valgfritt)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && generateDraft()}
                    placeholder="F.eks. «gjør den kortere», «mer uformell», «fremhev pris»"
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 bg-white"
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
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white text-gray-700"
                      >
                        {connections.map((c) => (
                          <option key={c.provider} value={c.provider}>
                            {c.provider === "gmail" ? "Gmail" : "Outlook"} ({c.email_address})
                          </option>
                        ))}
                      </select>
                    )}
                    {connections.length === 1 && (
                      <span className="text-xs text-gray-500">
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
                    <span className="text-xs text-gray-400">Ingen e-postkonto tilkoblet –</span>
                    <a href="/innstillinger?tab=epost" className="text-xs text-purple-600 hover:underline font-medium">koble til her</a>
                    <button
                      onClick={handleCopy}
                      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
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

const statusOptions: LeadStatus[] = [
  "Ikke kontaktet",
  "Kontaktet",
  "Kontaktet - ikke svar",
  "Booket møte",
  "Avslått",
  "Kunde",
];

const statusColors: Record<LeadStatus, "gray" | "blue" | "yellow" | "purple" | "red" | "green"> = {
  "Ikke kontaktet": "gray",
  "Kontaktet": "blue",
  "Kontaktet - ikke svar": "yellow",
  "Booket møte": "purple",
  "Avslått": "red",
  "Kunde": "green",
};

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
  onStatusChange: (id: string, status: LeadStatus) => void;
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
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderMsg, setReminderMsg] = useState("");
  const [reminderSending, setReminderSending] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);

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

  return (
    <>
      <tr
        className="hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Name */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <ChevronRight
              className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${expanded ? "rotate-90" : ""}`}
            />
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
              {lead.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{lead.name}</p>
              <p className="text-xs text-gray-400">{lead.industry}</p>
            </div>
          </div>
        </td>

        {/* Contact */}
        <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{lead.contactPerson}</td>

        {/* Status — uses fixed dropdown to avoid table overflow clipping */}
        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <button
              ref={statusBtnRef}
              onClick={openStatusDropdown}
              className="flex items-center gap-1.5"
            >
              <Badge variant={statusColors[lead.status]}>{lead.status}</Badge>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </td>

        {/* Last contacted / Meeting date */}
        <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">
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
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0F1729] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {lead.assignedAvatar}
            </div>
            <span className="text-sm text-gray-600 whitespace-nowrap">{lead.assignedTo}</span>
          </div>
        </td>

        {/* Notes preview */}
        <td className="px-4 py-3.5 text-sm text-gray-400 max-w-xs truncate">
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
                className="fixed bg-white rounded-xl border border-gray-200 shadow-xl z-[999] py-1 w-52"
                style={{ top: dropdownCoords.top, left: dropdownCoords.left }}
              >
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 text-left"
                    onClick={() => {
                      onStatusChange(lead.id, s);
                      setStatusDropdown(false);
                      if (s === "Booket møte") setMeetingModalOpen(true);
                    }}
                  >
                    <Badge variant={statusColors[s]}>{s}</Badge>
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
          <td colSpan={6} className="bg-slate-50 border-b border-gray-100" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 space-y-5">

              {/* Quick status buttons */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => { onStatusChange(lead.id, s); if (s === "Booket møte") setMeetingModalOpen(true); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        lead.status === s
                          ? "border-transparent ring-2 ring-offset-1"
                          : "border-gray-200 bg-white hover:border-gray-300"
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

              <div className="grid grid-cols-3 gap-6">
                {/* Contact info */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Kontaktinformasjon
                  </p>
                  <div className="space-y-2">
                    <a
                      href={`tel:${lead.phone}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600"
                    >
                      <Phone className="w-4 h-4 text-gray-400" />
                      {lead.phone !== "—" ? lead.phone : <span className="text-gray-300 italic">Ingen telefon</span>}
                    </a>
                    <a
                      href={`mailto:${lead.email}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600"
                    >
                      <Mail className="w-4 h-4 text-gray-400" />
                      {lead.email !== "—" ? lead.email : <span className="text-gray-300 italic">Ingen e-post</span>}
                    </a>
                    <p className="text-xs text-gray-400 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5" />{lead.address || "—"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setEmailModalOpen(true); }}
                    className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg hover:bg-purple-100 transition-colors border border-purple-100"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Skriv AI-e-post
                  </button>

                  {/* Last contacted */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Sist kontaktet
                    </p>
                    <input
                      type="date"
                      value={lead.lastContacted ?? ""}
                      onChange={(e) => onLastContactedChange(lead.id, e.target.value || null)}
                      className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:border-green-500 bg-white w-full"
                    />
                    {lead.lastContacted && (
                      <button
                        onClick={() => onLastContactedChange(lead.id, null)}
                        className="text-xs text-gray-400 hover:text-gray-600 mt-1 underline"
                      >
                        Nullstill dato
                      </button>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Notater
                    </p>
                    {!editingNotes && (
                      <button
                        onClick={() => setEditingNotes(true)}
                        className="text-xs text-blue-600 hover:underline font-medium"
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
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 resize-none bg-white"
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
                      className="text-sm text-gray-600 bg-white border border-gray-100 rounded-lg p-3 min-h-[80px] cursor-text"
                      onClick={() => setEditingNotes(true)}
                    >
                      {notes || <span className="italic text-gray-300">Klikk for å legge til notater…</span>}
                    </div>
                  )}
                </div>

                {/* Meta info */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" /> Ansvar og info
                  </p>
                  <div className="space-y-3">
                    {/* Assigned to — dropdown */}
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Ansvarlig</p>
                      {teamMembers.length > 1 ? (
                        <div className="relative">
                          <select
                            value={lead.assignedTo}
                            onChange={(e) => onAssignedChange(lead.id, e.target.value)}
                            className="w-full appearance-none pl-9 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 bg-white cursor-pointer text-gray-700"
                          >
                            {teamMembers.map((name) => (
                              <option key={name} value={name}>{name}</option>
                            ))}
                          </select>
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#0F1729] rounded-full flex items-center justify-center text-white text-[9px] font-bold pointer-events-none">
                            {lead.assignedAvatar}
                          </div>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
                            className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-green-500 bg-white"
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
                          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
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
                          <p className="text-xs text-gray-500 font-medium">Melding til {lead.assignedTo}:</p>
                          <textarea
                            value={reminderMsg}
                            onChange={(e) => setReminderMsg(e.target.value)}
                            placeholder={`Husk å følge opp ${lead.name}...`}
                            className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-400 resize-none bg-white"
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
                              className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-gray-50"
                            >
                              Avbryt
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Added by — read only */}
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Lagt til av</p>
                      <p className="text-sm text-gray-700">{lead.addedBy || "—"}</p>
                    </div>

                    {/* Other meta */}
                    <div className="space-y-1.5 text-sm text-gray-600 pt-2 border-t border-gray-100">
                      <p><span className="text-gray-400">Org.nr:</span> {lead.orgNumber}</p>
                      <p><span className="text-gray-400">Ansatte:</span> {lead.employees || "—"}</p>
                      <p><span className="text-gray-400">La til:</span> {new Date(lead.addedDate).toLocaleDateString("nb-NO")}</p>
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
                            className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-gray-50"
                          >
                            Avbryt
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(true)}
                          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
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
    </>
  );
}

export default function MineLeadsPage() {
  const { leads, loadLeads, updateLeadStatus, updateLeadNotes, updateLeadAssigned, updateLeadLastContacted, removeLead, meetingDates, setMeetingDate, currentUser } = useAppStore();
  const [search, setSearch] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);

  useEffect(() => {
    if (currentUser?.email) loadLeads(currentUser.email);
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
    { label: "Totalt leads", value: leads.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    {
      label: "Nye denne uken",
      value: leads.filter((l) => l.addedDate >= thisWeek).length,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
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
      <TopBar title="Mine Leads" subtitle="CRM-pipeline og leadoversikt" />

      <div className="p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-5" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${color}`} style={{ width: "18px", height: "18px" }} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#0F1729]">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
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
              {["Alle", ...statusOptions].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === s
                      ? "bg-[#0F1729] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                  className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-green-500 cursor-pointer bg-white"
                >
                  {assignedOptions.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}

            {(statusFilter !== "Alle" || assignedFilter !== "Alle" || search) && (
              <button
                onClick={() => {
                  setStatusFilter("Alle");
                  setAssignedFilter("Alle");
                  setSearch("");
                }}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700"
              >
                <X className="w-3.5 h-3.5" />
                Nullstill filtre
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bedriftsnavn</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kontaktperson</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sist kontaktet</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ansvarlig</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notater</th>
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
                <p className="text-gray-500 font-medium">
                  {leads.length === 0 ? "Ingen leads ennå" : "Ingen leads matcher filteret"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
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
