"use client";
import { TopBar } from "@/components/layout/top-bar";
import { TrendingUp, Users, Calendar, Star, ArrowUpRight, ArrowRight, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";

const statusColors: Record<string, "gray" | "blue" | "yellow" | "purple" | "red" | "green"> = {
  "Ikke kontaktet": "gray",
  "Kontaktet": "blue",
  "Kontaktet - ikke svar": "yellow",
  "Booket møte": "purple",
  "Avslått": "red",
  "Kunde": "green",
};

export default function DashboardPage() {
  const { leads } = useAppStore();

  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const stats = [
    {
      title: "Totalt antall leads",
      value: leads.length,
      change: `${leads.filter((l) => l.addedDate >= thisWeek).length} denne uken`,
      positive: true,
      icon: Users,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Nye denne uken",
      value: leads.filter((l) => l.addedDate >= thisWeek).length,
      change: "Lagt til via leadsøk",
      positive: true,
      icon: TrendingUp,
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Bookede møter",
      value: leads.filter((l) => l.status === "Booket møte").length,
      change: "Aktive møtebookinger",
      positive: true,
      icon: Calendar,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Kunder",
      value: leads.filter((l) => l.status === "Kunde").length,
      change: "Konverterte leads",
      positive: true,
      icon: Star,
      color: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
  ];

  const needsFollowUp = leads
    .filter((l) => l.status === "Ikke kontaktet" || l.status === "Kontaktet - ikke svar")
    .slice(0, 5);

  const pipelineCounts = [
    { label: "Ikke kontaktet", count: leads.filter((l) => l.status === "Ikke kontaktet").length, color: "bg-gray-200", textColor: "text-gray-600" },
    { label: "Kontaktet", count: leads.filter((l) => l.status === "Kontaktet").length, color: "bg-blue-200", textColor: "text-blue-700" },
    { label: "Ikke svar", count: leads.filter((l) => l.status === "Kontaktet - ikke svar").length, color: "bg-yellow-200", textColor: "text-yellow-700" },
    { label: "Booket møte", count: leads.filter((l) => l.status === "Booket møte").length, color: "bg-purple-200", textColor: "text-purple-700" },
    { label: "Avslått", count: leads.filter((l) => l.status === "Avslått").length, color: "bg-red-200", textColor: "text-red-700" },
    { label: "Kunde", count: leads.filter((l) => l.status === "Kunde").length, color: "bg-green-200", textColor: "text-green-700" },
  ];

  return (
    <div>
      <TopBar title="Dashboard" subtitle="Oversikt over din salgspipeline" />

      <div className="p-8 space-y-8">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-[#0F1729] to-[#1E3A5F] rounded-2xl p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Velkommen til Reachr 👋</h2>
            <p className="text-white/70 text-sm">
              {leads.length === 0
                ? "Start med å søke etter leads og bygg din pipeline."
                : `Du har ${needsFollowUp.length} leads som trenger oppfølging.`}
            </p>
          </div>
          <Link href="/varsler">
            <Button variant="secondary" size="md" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Se varsler
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map(({ title, value, change, positive, icon: Icon, color, iconColor }) => (
            <div key={title} className="bg-white rounded-xl border border-gray-200 p-6" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300" />
              </div>
              <p className="text-3xl font-extrabold text-[#0F1729] mb-1">{value}</p>
              <p className="text-sm text-gray-500">{title}</p>
              <p className={`text-xs mt-2 font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
                {change}
              </p>
            </div>
          ))}
        </div>

        {/* Needs follow-up */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-slate-900">Trenger oppfølging</h3>
            <Link href="/mine-leads" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
              Se alle <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {needsFollowUp.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-3 text-gray-200" />
              <p className="text-sm font-medium text-gray-500">Ingen leads å følge opp ennå</p>
              <p className="text-xs mt-1">
                <Link href="/leadsok" className="text-green-600 hover:underline font-medium">Søk etter leads</Link> for å komme i gang.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {needsFollowUp.map((lead) => (
                <div key={lead.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                    {lead.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{lead.name}</p>
                    <p className="text-xs text-gray-400 truncate">{lead.industry} · {lead.city}</p>
                  </div>
                  <Badge variant={statusColors[lead.status]}>{lead.status}</Badge>
                  <div className="flex items-center gap-2 text-gray-300">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg hover:text-blue-500 transition-colors">
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg hover:text-green-500 transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pipeline overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
          <h3 className="font-semibold text-slate-900 mb-6">Pipeline-oversikt</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {pipelineCounts.map(({ label, count, color, textColor }) => (
              <div key={label} className="text-center">
                <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <span className={`text-2xl font-extrabold ${textColor}`}>{count}</span>
                </div>
                <p className="text-xs text-gray-500 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
