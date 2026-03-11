"use client";
import { TopBar } from "@/components/layout/top-bar";
import { TrendingUp, Users, Calendar, Star, ArrowUpRight, ArrowRight, Phone, Mail, AlertCircle, BarChart, Trophy, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { Lead } from "@/lib/mock-data";

const statusColors: Record<string, "gray" | "blue" | "yellow" | "purple" | "red" | "green"> = {
  "Ikke kontaktet": "gray",
  "Kontaktet": "blue",
  "Kontaktet - ikke svar": "yellow",
  "Booket møte": "purple",
  "Avslått": "red",
  "Kunde": "green",
};

function needsFollowUpReason(lead: Lead): string | null {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  // Not contacted at all
  if (lead.status === "Ikke kontaktet") {
    const addedDate = new Date(lead.addedDate);
    if (addedDate <= twoDaysAgo) return "Ikke kontaktet på 2+ dager";
    return null;
  }

  // Didn't answer — show 2 days after last contact
  if (lead.status === "Kontaktet - ikke svar") {
    if (!lead.lastContacted) return "Ikke svar – følg opp";
    const lastContact = new Date(lead.lastContacted);
    if (lastContact <= twoDaysAgo) return "Ikke svar – 2+ dager siden sist";
    return null;
  }

  // Contacted but long time ago
  if (lead.status === "Kontaktet") {
    if (!lead.lastContacted) return "Kontaktet – ingen dato registrert";
    const lastContact = new Date(lead.lastContacted);
    if (lastContact <= threeDaysAgo) return "Kontaktet – 3+ dager siden sist";
    return null;
  }

  // Meeting booked — remind before meeting date
  if (lead.status === "Booket møte") {
    if (!lead.lastContacted) return "Møte booket – bekreft detaljer";
    return null;
  }

  return null;
}

export default function DashboardPage() {
  const { leads } = useAppStore();

  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Build needs-follow-up list with reasons
  const needsFollowUp = leads
    .map((l) => ({ lead: l, reason: needsFollowUpReason(l) }))
    .filter((x) => x.reason !== null)
    .slice(0, 6);

  const stats = [
    {
      title: "Totalt antall leads",
      value: leads.length,
      change: `${leads.filter((l) => l.addedDate >= thisWeek).length} denne uken`,
      positive: true,
      icon: Users,
      color: "bg-[#09fe94]/10",
      iconColor: "text-[#05c472]",
    },
    {
      title: "Nye denne uken",
      value: leads.filter((l) => l.addedDate >= thisWeek).length,
      change: "Lagt til via leadsøk",
      positive: true,
      icon: TrendingUp,
      color: "bg-[#09fe94]/10",
      iconColor: "text-[#05c472]",
    },
    {
      title: "Bookede møter",
      value: leads.filter((l) => l.status === "Booket møte").length,
      change: "Aktive møtebookinger",
      positive: true,
      icon: Calendar,
      color: "bg-[#ffad0a]/12",
      iconColor: "text-[#c47e00]",
    },
    {
      title: "Kunder",
      value: leads.filter((l) => l.status === "Kunde").length,
      change: "Konverterte leads",
      positive: true,
      icon: Star,
      color: "bg-[#ff470a]/10",
      iconColor: "text-[#ff470a]",
    },
  ];

  const pipelineCounts = [
    { label: "Ikke kontaktet", count: leads.filter((l) => l.status === "Ikke kontaktet").length, color: "bg-[#e8e4d8]", textColor: "text-[#6b6660]" },
    { label: "Kontaktet", count: leads.filter((l) => l.status === "Kontaktet").length, color: "bg-[#09fe94]/20", textColor: "text-[#05c472]" },
    { label: "Ikke svar", count: leads.filter((l) => l.status === "Kontaktet - ikke svar").length, color: "bg-[#ffad0a]/20", textColor: "text-[#c47e00]" },
    { label: "Booket møte", count: leads.filter((l) => l.status === "Booket møte").length, color: "bg-[#ffad0a]/30", textColor: "text-[#a06000]" },
    { label: "Avslått", count: leads.filter((l) => l.status === "Avslått").length, color: "bg-[#ff470a]/15", textColor: "text-[#ff470a]" },
    { label: "Kunde", count: leads.filter((l) => l.status === "Kunde").length, color: "bg-[#171717]", textColor: "text-[#09fe94]" },
  ];

  // --- ANALYTICS / METRICS CALCULATIONS ---
  // Hit Rate = (Booket Møte + Kunde) / All Contacted Leads
  const totalContacted = leads.filter((l) => ["Kontaktet", "Kontaktet - ikke svar", "Booket møte", "Avslått", "Kunde"].includes(l.status)).length;
  const totalSuccess = leads.filter((l) => ["Booket møte", "Kunde"].includes(l.status)).length;
  const hitRate = totalContacted > 0 ? Math.round((totalSuccess / totalContacted) * 100) : 0;

  // Leaderboard (Group by addedBy / assignedTo)
  const agentStats = leads.reduce((acc: Record<string, { total: number; success: number }>, lead) => {
    const agent = lead.addedBy || "Ukjent";
    if (!acc[agent]) acc[agent] = { total: 0, success: 0 };
    acc[agent].total++;
    if (["Booket møte", "Kunde"].includes(lead.status)) acc[agent].success++;
    return acc;
  }, {});

  const leaderboardArray = Object.entries(agentStats)
    .sort((a, b) => b[1].success - a[1].success) // sort by successes
    .slice(0, 3); // top 3

  return (
    <div>
      <TopBar title="Dashboard" subtitle="Oversikt over din salgspipeline" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Welcome banner */}
        <div className="bg-[#171717] rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Velkommen til Reachr 👋</h2>
            <p className="text-white/70 text-sm">
              {leads.length === 0
                ? "Start med å søke etter leads og bygg din pipeline."
                : needsFollowUp.length > 0
                  ? `${needsFollowUp.length} lead${needsFollowUp.length > 1 ? "s trenger" : " trenger"} oppfølging nå.`
                  : "Alt er oppdatert – pipeline ser bra ut!"}
            </p>
          </div>
          <Link href="/varsler" className="shrink-0">
            <Button variant="secondary" size="md" className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto">
              Se varsler
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map(({ title, value, change, positive, icon: Icon, color, iconColor }) => (
            <div key={title} className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-6" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300" />
              </div>
              <p className="text-3xl font-extrabold text-[#171717] mb-1">{value}</p>
              <p className="text-sm text-[#6b6660]">{title}</p>
              <p className={`text-xs mt-2 font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
                {change}
              </p>
            </div>
          ))}
        </div>

        {/* Needs follow-up */}
        <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] overflow-hidden" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e4d8]">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#171717]">Trenger oppfølging</h3>
              {needsFollowUp.length > 0 && (
                <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {needsFollowUp.length}
                </span>
              )}
            </div>
            <Link href="/mine-leads" className="text-sm text-[#ff470a] font-medium hover:underline flex items-center gap-1">
              Se alle <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {needsFollowUp.length === 0 ? (
            <div className="text-center py-12 text-[#a09b8f]">
              <Users className="w-10 h-10 mx-auto mb-3 text-gray-200" />
              <p className="text-sm font-medium text-[#6b6660]">Ingen leads trenger oppfølging akkurat nå</p>
              <p className="text-xs mt-1">
                <Link href="/leadsok" className="text-green-600 hover:underline font-medium">Søk etter leads</Link> for å komme i gang.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#e8e4d8]">
              {needsFollowUp.map(({ lead, reason }) => (
                <div key={lead.id} className="flex items-center gap-3 px-3 sm:px-6 py-3 hover:bg-[#f0ece0] transition-colors">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#e8e4d8] rounded-lg flex items-center justify-center text-xs font-bold text-[#6b6660] flex-shrink-0">
                    {lead.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#171717] truncate">{lead.name}</p>
                    <p className="text-xs text-[#a09b8f] truncate">{lead.industry} · {lead.city}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={statusColors[lead.status]}>{lead.status}</Badge>
                    <span className="hidden sm:flex items-center gap-1 text-xs text-orange-500 bg-orange-50 border border-orange-100 px-2 py-1 rounded-full whitespace-nowrap">
                      <AlertCircle className="w-3 h-3" />
                      {reason}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-gray-300 flex-shrink-0">
                    {lead.phone && lead.phone !== "—" && (
                      <a href={`tel:${lead.phone}`} className="p-1.5 hover:bg-gray-100 rounded-lg hover:text-blue-500 transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
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
        <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-6" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
          <h3 className="font-semibold text-[#171717] mb-6">Pipeline-oversikt</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {pipelineCounts.map(({ label, count, color, textColor }) => (
              <div key={label} className="text-center">
                <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <span className={`text-2xl font-extrabold ${textColor}`}>{count}</span>
                </div>
                <p className="text-xs text-[#6b6660] leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Metrics & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          {/* Hit Rate / Conversion Card */}
          <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-6 lg:p-8 flex flex-col items-center justify-center text-center" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
            <h3 className="font-semibold text-[#171717] w-full text-left mb-6 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-gray-500" />
              Salgskonvertering (Hit Rate)
            </h3>
            
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-white border-4 border-[#e8e4d8] shadow-inner mb-4">
              <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                {hitRate > 0 && (
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="#09fe94"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${(hitRate / 100) * 377} 377`}
                    className="transition-all duration-1000 ease-out"
                  />
                )}
              </svg>
              <div className="flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-[#171717]">{hitRate}%</span>
              </div>
            </div>
            
            <p className="text-sm text-[#6b6660] font-medium max-w-xs">
              Møter booket eller vunnet som andel av totalt ukontaktede leads. Du har kontaktet <strong className="text-black">{totalContacted}</strong> prospekter og landet <strong className="text-green-600">{totalSuccess}</strong>!
            </p>
          </div>

          {/* Leaderboard Card */}
          <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-6 lg:p-8" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
            <h3 className="font-semibold text-[#171717] mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Toppselgere i Teamet
            </h3>
            
            {leaderboardArray.length === 0 ? (
              <div className="text-center py-8 text-[#a09b8f]">
                <Target className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Ingen bookede møter enda.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboardArray.map(([name, stats], index) => (
                  <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#e8e4d8]">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? "bg-yellow-100 text-yellow-700" :
                        index === 1 ? "bg-gray-100 text-gray-600" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#171717]">{name}</p>
                        <p className="text-xs text-[#a09b8f]">{stats.total} leads i pipeline</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">{stats.success} Wins</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {leaderboardArray.length > 0 && (
              <p className="text-xs text-[#a09b8f] mt-5 text-center px-4">
                "Wins" baseres på summen av antall bookede møter og signerte kunder per selger.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
