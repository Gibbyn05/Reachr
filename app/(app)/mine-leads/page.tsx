"use client";
import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  TrendingUp,
  Calendar,
  Star,
  Search,
  ChevronDown,
  X,
  Phone,
  Mail,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { Lead, LeadStatus } from "@/lib/mock-data";

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

const teamMembers = ["Alle", "Ola Nordmann", "Kari Hansen", "Per Olsen"];

function LeadRow({
  lead,
  onStatusChange,
  onNotesChange,
}: {
  lead: Lead;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(lead.notes);
  const [statusDropdown, setStatusDropdown] = useState(false);

  return (
    <>
      <tr
        className="hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <ChevronRight
              className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`}
            />
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
              {lead.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
              <p className="text-xs text-gray-400">{lead.industry}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{lead.contactPerson}</td>
        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <button
              onClick={() => setStatusDropdown(!statusDropdown)}
              className="flex items-center gap-1.5"
            >
              <Badge variant={statusColors[lead.status]}>{lead.status}</Badge>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            {statusDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setStatusDropdown(false)} />
                <div className="absolute left-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-1 w-52">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 text-left"
                      onClick={() => {
                        onStatusChange(lead.id, s);
                        setStatusDropdown(false);
                      }}
                    >
                      <Badge variant={statusColors[s]}>{s}</Badge>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </td>
        <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">
          {lead.lastContacted
            ? new Date(lead.lastContacted).toLocaleDateString("nb-NO")
            : "—"}
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0F1729] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              {lead.assignedAvatar}
            </div>
            <span className="text-sm text-gray-600 whitespace-nowrap">{lead.assignedTo}</span>
          </div>
        </td>
        <td className="px-4 py-3.5 text-sm text-gray-400 max-w-xs truncate">
          {lead.notes || <span className="text-gray-300 italic">Ingen notater</span>}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} className="bg-slate-50 px-6 py-4 border-b border-gray-100">
            <div className="flex gap-6">
              {/* Contact info */}
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Kontaktinformasjon</h4>
                <div className="space-y-2">
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600"
                  >
                    <Phone className="w-4 h-4" />
                    {lead.phone}
                  </a>
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600"
                  >
                    <Mail className="w-4 h-4" />
                    {lead.email}
                  </a>
                  <p className="text-xs text-gray-400">{lead.address}</p>
                </div>
              </div>

              {/* Notes editor */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    Notater
                  </h4>
                  {!editingNotes && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingNotes(true);
                      }}
                    >
                      Rediger
                    </Button>
                  )}
                </div>
                {editingNotes ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 resize-none"
                      rows={3}
                      placeholder="Legg til notater om dette leadet..."
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
                  <p className="text-sm text-gray-500">
                    {notes || <span className="italic text-gray-300">Ingen notater ennå</span>}
                  </p>
                )}
              </div>

              {/* Company info */}
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Bedriftsinfo</h4>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <p><span className="text-gray-400">Org.nr:</span> {lead.orgNumber}</p>
                  <p><span className="text-gray-400">Bransje:</span> {lead.industry}</p>
                  <p><span className="text-gray-400">Sted:</span> {lead.city}</p>
                  <p><span className="text-gray-400">Ansatte:</span> {lead.employees}</p>
                  <p><span className="text-gray-400">La til:</span> {new Date(lead.addedDate).toLocaleDateString("nb-NO")}</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function MineLeadsPage() {
  const { leads, updateLeadStatus, updateLeadNotes } = useAppStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Alle");
  const [assignedFilter, setAssignedFilter] = useState<string>("Alle");

  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Alle" || lead.status === statusFilter;
    const matchAssigned = assignedFilter === "Alle" || lead.assignedTo === assignedFilter;
    return matchSearch && matchStatus && matchAssigned;
  });

  const stats = [
    { label: "Totalt leads", value: leads.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    {
      label: "Nye denne uken",
      value: leads.filter((l) => l.addedDate >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]).length,
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
                  <Icon className={`w-4.5 h-4.5 ${color}`} style={{ width: "18px", height: "18px" }} />
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
                placeholder="Søk etter bedrift eller kontakt..."
                icon={<Search className="w-4 h-4" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Status filter */}
            <div className="flex flex-wrap gap-2">
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
            <div className="relative">
              <select
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-green-500 cursor-pointer bg-white"
              >
                {teamMembers.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

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
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Bedriftsnavn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Kontaktperson
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sist kontaktet
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ansvarlig
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Notater
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLeads.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onStatusChange={updateLeadStatus}
                    onNotesChange={updateLeadNotes}
                  />
                ))}
              </tbody>
            </table>

            {filteredLeads.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Ingen leads funnet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Prøv å endre filtrene eller{" "}
                  <a href="/leadsok" className="text-green-600 font-medium hover:underline">
                    søk etter nye leads
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
