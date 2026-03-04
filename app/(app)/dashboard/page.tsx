"use client";
import { TopBar } from "@/components/layout/top-bar";
import { TrendingUp, Users, Calendar, Star, ArrowUpRight, ArrowRight, Phone, Mail } from "lucide-react";
import { mockLeads } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, "gray" | "blue" | "yellow" | "purple" | "red" | "green"> = {
  "Ikke kontaktet": "gray",
  "Kontaktet": "blue",
  "Kontaktet - ikke svar": "yellow",
  "Booket møte": "purple",
  "Avslått": "red",
  "Kunde": "green",
};

const stats = [
  {
    title: "Totalt antall leads",
    value: "124",
    change: "+12 denne uken",
    positive: true,
    icon: Users,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Nye denne uken",
    value: "18",
    change: "+6 fra forrige uke",
    positive: true,
    icon: TrendingUp,
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Bookede møter",
    value: "7",
    change: "3 kommende",
    positive: true,
    icon: Calendar,
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Kunder",
    value: "23",
    change: "+2 denne måneden",
    positive: true,
    icon: Star,
    color: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
];

const recentActivity = [
  { action: "La til lead", company: "Vestlandet Helse AS", time: "10 min siden", user: "KH" },
  { action: "Statusendring → Booket møte", company: "TechStart Bergen", time: "25 min siden", user: "ON" },
  { action: "Notat lagt til", company: "Bergheim Regnskap AS", time: "1 time siden", user: "PO" },
  { action: "Kontaktet", company: "Trondheim IT Konsulent AS", time: "2 timer siden", user: "ON" },
  { action: "Ble kunde", company: "Nordvik Bygg AS", time: "I går", user: "KH" },
];

export default function DashboardPage() {
  const recentLeads = mockLeads
    .filter((l) => l.status === "Ikke kontaktet" || l.status === "Kontaktet - ikke svar")
    .slice(0, 5);

  return (
    <div>
      <TopBar title="Dashboard" subtitle="Oversikt over din salgspipeline" />

      <div className="p-8 space-y-8">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-[#0F1729] to-[#1E3A5F] rounded-2xl p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">God morgen, Ola! 👋</h2>
            <p className="text-white/70 text-sm">
              Du har <span className="text-white font-semibold">3 oppfølginger</span> som venter i dag og{" "}
              <span className="text-white font-semibold">2 møter</span> denne uken.
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Needs follow-up */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-slate-900">Trenger oppfølging!</h3>
              <Link href="/mine-leads" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                Se alle <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentLeads.map((lead) => (
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
          </div>

          {/* Activity feed */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-slate-900">Siste aktivitet</h3>
            </div>
            <div className="divide-y divide-gray-50 p-4 space-y-1">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-3">
                  <div className="w-7 h-7 bg-[#0F1729] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {a.user}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700">{a.action}</p>
                    <p className="text-xs text-gray-400 truncate">{a.company}</p>
                    <p className="text-[11px] text-gray-300 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
          <h3 className="font-semibold text-slate-900 mb-6">Pipeline-oversikt</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { label: "Ikke kontaktet", count: 32, color: "bg-gray-200", textColor: "text-gray-600" },
              { label: "Kontaktet", count: 28, color: "bg-blue-200", textColor: "text-blue-700" },
              { label: "Ikke svar", count: 15, color: "bg-yellow-200", textColor: "text-yellow-700" },
              { label: "Booket møte", count: 12, color: "bg-purple-200", textColor: "text-purple-700" },
              { label: "Avslått", count: 8, color: "bg-red-200", textColor: "text-red-700" },
              { label: "Kunde", count: 23, color: "bg-green-200", textColor: "text-green-700" },
            ].map(({ label, count, color, textColor }) => (
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
