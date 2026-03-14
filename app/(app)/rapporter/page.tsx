"use client";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { useAppStore } from "@/store/app-store";
import {
  BarChart3,
  CalendarCheck2,
  Contact,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  FastForward,
  Mail,
  Eye,
  MousePointer2,
  TrendingUp,
  Trophy,
  Target,
  Loader2,
} from "lucide-react";

interface SellerStats {
  name: string;
  totalLeads: number;
  contacted: number;
  meetingsBooked: number;
  customers: number;
  notFollowedUp: number;
  followUpRate: number;
}

interface EmailStats {
  totalSent: number;
  totalOpens: number;
  uniqueOpens: number;
  totalClicks: number;
  openRate: number;
  clickRate: number;
  dailySends: { date: string; count: number }[];
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  trend,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: string;
}) {
  return (
    <div
      className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-5 hover:shadow-md transition-shadow"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-[#05c472] bg-[#09fe94]/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <TrendingUp className="w-2.5 h-2.5" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-[#171717] mb-0.5">{value}</p>
      <p className="text-sm text-[#6b6660]">{label}</p>
      {sub && <p className="text-xs text-[#a09b8f] mt-1">{sub}</p>}
    </div>
  );
}

function MiniBarChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-16 w-full">
      {data.map((d) => {
        const pct = (d.count / max) * 100;
        const dayLabel = new Date(d.date + "T12:00:00").toLocaleDateString("nb-NO", { weekday: "short" }).slice(0, 2);
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#171717] text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
              {d.count} sendt
            </div>
            <div
              className="w-full bg-[#09fe94] rounded-sm transition-all duration-700 ease-out opacity-80 hover:opacity-100"
              style={{ height: `${Math.max(pct, 4)}%` }}
            />
            <span className="text-[9px] text-[#a09b8f]">{dayLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

function DonutGauge({ pct, label, color }: { pct: number; label: string; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#e8e4d8" strokeWidth="9" />
        <circle
          cx="44" cy="44" r={r} fill="none"
          stroke={color} strokeWidth="9"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
        <text x="44" y="48" textAnchor="middle" fontSize="15" fontWeight="800" fill="#171717">{pct}%</text>
      </svg>
      <span className="text-[11px] text-[#6b6660] font-medium">{label}</span>
    </div>
  );
}

export default function RapporterPage() {
  const { leads, sequences } = useAppStore();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeEnrollments, setActiveEnrollments] = useState(0);
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null);
  const [loadingEmail, setLoadingEmail] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => setIsAdmin(data?.role === "owner" || !data?.role))
      .catch(() => setIsAdmin(true));

    fetch("/api/sequences")
      .then((r) => r.json())
      .then((data) => {
        const count = data.sequences?.reduce(
          (acc: number, s: { activeEnrollments?: number }) => acc + (s.activeEnrollments || 0),
          0
        );
        setActiveEnrollments(count || 0);
      })
      .catch(() => {});

    fetch("/api/analytics/email")
      .then((r) => r.json())
      .then((data) => setEmailStats(data))
      .catch(() => {})
      .finally(() => setLoadingEmail(false));
  }, []);

  const now = new Date();
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  // Compute weekly leads data (last 8 weeks)
  const weeklyLeadsData = Array.from({ length: 8 }, (_, i) => {
    const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekStartStr = weekStart.toISOString().split("T")[0];
    const weekEndStr = weekEnd.toISOString().split("T")[0];
    const count = leads.filter(l => l.addedDate >= weekStartStr && l.addedDate < weekEndStr).length;
    const label = weekEnd.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
    return { label, count };
  }).reverse();

  const sellerMap = new Map<string, SellerStats>();
  for (const lead of leads) {
    const name = lead.addedBy || "Ukjent";
    if (!sellerMap.has(name)) {
      sellerMap.set(name, {
        name,
        totalLeads: 0,
        contacted: 0,
        meetingsBooked: 0,
        customers: 0,
        notFollowedUp: 0,
        followUpRate: 0,
      });
    }
    const s = sellerMap.get(name)!;
    s.totalLeads += 1;
    if (lead.status !== "Ikke kontaktet") s.contacted += 1;
    if (lead.status === "Booket møte") s.meetingsBooked += 1;
    if (lead.status === "Kunde") s.customers += 1;
    if (lead.status === "Ikke kontaktet" && new Date(lead.addedDate) <= twoDaysAgo) s.notFollowedUp += 1;
  }

  for (const s of sellerMap.values()) {
    s.followUpRate = s.totalLeads > 0 ? Math.round((s.contacted / s.totalLeads) * 100) : 0;
  }

  const sellers = Array.from(sellerMap.values()).sort((a, b) => b.meetingsBooked - a.meetingsBooked);
  const totalLeads = leads.length;
  const totalContacted = leads.filter((l) => l.status !== "Ikke kontaktet").length;
  const totalMeetings = leads.filter((l) => l.status === "Booket møte").length;
  const totalCustomers = leads.filter((l) => l.status === "Kunde").length;
  const newThisWeek = leads.filter((l) => l.addedDate >= thisWeek).length;

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#f2efe3]">
        <TopBar title="Rapporter" />
        <div className="flex items-center justify-center pt-32">
          <div className="w-8 h-8 border-2 border-[#09fe94] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#f2efe3]">
        <TopBar title="Rapporter" />
        <div className="flex flex-col items-center justify-center pt-32 gap-3">
          <AlertCircle className="w-10 h-10 text-[#d8d3c5]" />
          <p className="text-[#6b6660] font-medium">Kun teamlederen har tilgang til salgsrapporter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <TopBar title="Salgsanalyser" subtitle="Full innsikt i teamets prestasjoner og kampanjer" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">

        {/* --- Top Key Stats --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Totalt leads"
            value={totalLeads}
            sub={`+${newThisWeek} nye denne uken`}
            icon={Contact}
            color="bg-[#09fe94]/10 text-accent-dark"
            trend={newThisWeek > 0 ? `+${newThisWeek}` : undefined}
          />
          <StatCard
            label="Konverteringsrate"
            value={`${totalLeads > 0 ? Math.round((totalMeetings / totalLeads) * 100) : 0}%`}
            sub="Leads → Møte"
            icon={Target}
            color="bg-[#ffad0a]/12 text-[#c47e00]"
          />
          <StatCard
            label="Bookede møter"
            value={totalMeetings}
            sub={`av ${totalLeads} totale leads`}
            icon={CalendarCheck2}
            color="bg-[#ffad0a]/12 text-[#c47e00]"
          />
          <StatCard
            label="Aktive sekvenser"
            value={activeEnrollments}
            sub="Leads i automatisert løp"
            icon={FastForward}
            color="bg-[#ff470a]/10 text-[#ff470a]"
          />
        </div>

        {/* --- Email Stats Row --- */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-accent-dark" />
            <h2 className="font-bold text-[#171717]">E-post Sporing</h2>
            <span className="text-xs text-[#a09b8f]">— Live data fra Reachr e-post</span>
          </div>

          {loadingEmail ? (
            <div className="flex items-center justify-center py-12 gap-3 text-[#6b6660]">
              <Loader2 className="w-5 h-5 animate-spin text-accent-dark" />
              <span className="text-sm">Laster e-poststatistikk...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Gauges */}
              <div className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] p-6 flex flex-col items-center justify-center gap-4" style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <h3 className="font-bold text-[#171717] text-sm w-full">Åpnings- & klikkrate</h3>
                <div className="flex gap-8">
                  <DonutGauge pct={emailStats?.openRate ?? 0} label="Åpningsrate" color="#09fe94" />
                  <DonutGauge pct={emailStats?.clickRate ?? 0} label="Klikkrate" color="#ffad0a" />
                </div>
                <div className="grid grid-cols-3 gap-3 w-full mt-2 text-center">
                  <div>
                    <p className="text-lg font-extrabold text-[#171717]">{emailStats?.totalSent ?? 0}</p>
                    <p className="text-[10px] text-[#a09b8f] uppercase font-bold">Sendt</p>
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-[#171717]">{emailStats?.uniqueOpens ?? 0}</p>
                    <p className="text-[10px] text-[#a09b8f] uppercase font-bold">Åpnet</p>
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-[#171717]">{emailStats?.totalClicks ?? 0}</p>
                    <p className="text-[10px] text-[#a09b8f] uppercase font-bold">Klikk</p>
                  </div>
                </div>
              </div>

              {/* Daily sends bar chart */}
              <div className="lg:col-span-2 bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] p-6" style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#171717] text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-accent-dark" />
                    E-poster sendt (siste 14 dager)
                  </h3>
                  <span className="text-xs text-[#a09b8f] font-semibold">{emailStats?.totalSent ?? 0} totalt</span>
                </div>
                {emailStats?.dailySends ? (
                  <MiniBarChart data={emailStats.dailySends} />
                ) : (
                  <div className="h-16 flex items-center justify-center text-xs text-[#a09b8f]">Ingen data</div>
                )}
                <p className="text-[10px] text-[#a09b8f] mt-3">Hover over søylene for detaljer per dag</p>
              </div>
            </div>
          )}
        </div>

        {/* --- Weekly Leads Trend --- */}
        <div className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] p-6" style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#171717] flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4 text-accent-dark" />
              Leads lagt til (siste 8 uker)
            </h3>
            <span className="text-xs text-[#a09b8f] font-semibold">{leads.length} totalt</span>
          </div>
          <div className="flex items-end gap-2 h-24 w-full">
            {weeklyLeadsData.map((week, i) => {
              const max = Math.max(...weeklyLeadsData.map(w => w.count), 1);
              const pct = (week.count / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#171717] text-white text-[9px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {week.count} leads
                  </div>
                  <div
                    className="w-full bg-[#171717] rounded-sm transition-all duration-700 ease-out hover:bg-[#09fe94] hover:shadow-sm"
                    style={{ height: `${Math.max(pct, 4)}%` }}
                  />
                  <span className="text-[9px] text-[#a09b8f] whitespace-nowrap overflow-hidden">{week.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Sales Funnel --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] p-6"
            style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-[#171717] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-accent-dark" />
                Salgs-trakt (Funnel)
              </h3>
              <span className="text-xs font-semibold text-[#6b6660] uppercase tracking-wider">Pipeline</span>
            </div>

            <div className="space-y-4">
              {[
                { label: "Importerte Leads", count: totalLeads, color: "bg-[#171717]", pct: 100 },
                {
                  label: "Beslutningstakere kontaktet",
                  count: totalContacted,
                  color: "bg-[#453c29]",
                  pct: totalLeads > 0 ? (totalContacted / totalLeads) * 100 : 0,
                },
                {
                  label: "Bookede Møter",
                  count: totalMeetings,
                  color: "bg-[#ffad0a]",
                  pct: totalLeads > 0 ? (totalMeetings / totalLeads) * 100 : 0,
                },
                {
                  label: "Nye Kunder",
                  count: totalCustomers,
                  color: "bg-accent-dark",
                  pct: totalLeads > 0 ? (totalCustomers / totalLeads) * 100 : 0,
                },
              ].map((stage, i) => (
                <div key={stage.label} className="relative">
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-sm font-medium text-[#6b6660]">{stage.label}</span>
                    <span className="text-sm font-bold text-[#171717]">{stage.count}</span>
                  </div>
                  <div className="h-10 w-full bg-[#e8e4d8] rounded-xl overflow-hidden flex">
                    <div
                      className={`h-full ${stage.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${Math.max(stage.pct, 2)}%` }}
                    />
                  </div>
                  {i < 3 && stage.count > 0 && (
                    <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-10 bg-[#e8e4d8] text-[#6b6660] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#d8d3c5]">
                      {Math.round(
                        ((i === 0 ? totalContacted : i === 1 ? totalMeetings : totalCustomers) / stage.count) * 100
                      )}% drift
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#171717] rounded-2xl p-6 text-white overflow-hidden relative group">
              <div className="relative z-10">
                <p className="text-xs font-semibold text-[#09fe94] uppercase tracking-wider mb-1">Oppsummering</p>
                <h4 className="text-xl font-bold mb-4">
                  {totalCustomers > 0 ? `${totalCustomers} kunder vunnet 🎉` : "Kom i gang!"}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <CheckCircle2 className="w-4 h-4 text-[#09fe94]" />
                    <span>{totalContacted} leads kontaktet</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Eye className="w-4 h-4 text-[#09fe94]" />
                    <span>{emailStats?.uniqueOpens ?? 0} e-poster åpnet</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <MousePointer2 className="w-4 h-4 text-[#09fe94]" />
                    <span>{emailStats?.totalClicks ?? 0} lenke-klikk</span>
                  </div>
                </div>
              </div>
              <FastForward className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 group-hover:text-white/10 transition-colors" />
            </div>

            <div className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] p-6">
              <h3 className="font-bold text-[#171717] text-sm mb-4">Sekvens-ytelse</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-[#a09b8f] uppercase font-bold">Åpningsrate</p>
                  <p className="text-lg font-extrabold text-[#171717]">{emailStats?.openRate ?? 0}%</p>
                  <div className="h-1.5 w-full bg-[#e8e4d8] rounded-full">
                    <div
                      className="h-full bg-[#09fe94] rounded-full transition-all duration-700"
                      style={{ width: `${emailStats?.openRate ?? 0}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-[#a09b8f] uppercase font-bold">Klikk-rate</p>
                  <p className="text-lg font-extrabold text-[#171717]">{emailStats?.clickRate ?? 0}%</p>
                  <div className="h-1.5 w-full bg-[#e8e4d8] rounded-full">
                    <div
                      className="h-full bg-accent-dark rounded-full transition-all duration-700"
                      style={{ width: `${emailStats?.clickRate ?? 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Leaderboard --- */}
        <div
          className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] overflow-hidden shadow-sm"
        >
          <div className="px-6 py-5 border-b border-[#e8e4d8] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#171717] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#c47e00]" />
                Selger-toppliste
              </h3>
              <p className="text-xs text-[#a09b8f] mt-0.5">Rangert etter antall bookede møter</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#d8d3c5]" />
          </div>

          {sellers.length === 0 ? (
            <div className="text-center py-12">
              <Contact className="w-8 h-8 text-[#d8d3c5] mx-auto mb-2" />
              <p className="text-sm text-[#a09b8f]">Ingen leads i pipelinen</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#fcfbf7] border-b border-[#e8e4d8]">
                    <th className="text-left px-4 sm:px-6 py-4 text-[10px] font-bold text-[#a09b8f] uppercase tracking-wider">#  Selger</th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-[10px] font-bold text-[#a09b8f] uppercase tracking-wider">Leads</th>
                    <th className="hidden md:table-cell text-center px-4 py-4 text-[10px] font-bold text-[#a09b8f] uppercase tracking-wider">Samtaler</th>
                    <th className="text-center px-4 py-4 text-[10px] font-bold text-[#a09b8f] uppercase tracking-wider">Møter</th>
                    <th className="hidden sm:table-cell text-center px-4 py-4 text-[10px] font-bold text-[#a09b8f] uppercase tracking-wider">Kunder</th>
                    <th className="text-right px-4 sm:px-6 py-4 text-[10px] font-bold text-[#a09b8f] uppercase tracking-wider">Effektivitet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2efe3]">
                  {sellers.map((s, i) => (
                    <tr key={s.name} className="hover:bg-white/50 transition-colors group">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div className="w-9 h-9 rounded-xl bg-[#171717] flex items-center justify-center text-[10px] font-black text-[#09fe94] shadow-sm">
                              {s.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                            </div>
                            {i === 0 && (
                              <span className="absolute -top-1 -right-1 text-[10px]">🏆</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[#171717] truncate">{s.name}</p>
                            <p className="text-[10px] text-[#a09b8f]">{i === 0 ? "Toppleder" : `#${i + 1} på listen`}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-4 text-center font-bold text-[#171717]">{s.totalLeads}</td>
                      <td className="hidden md:table-cell px-4 py-4 text-center text-[#6b6660]">{s.contacted}</td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-lg font-black text-xs ${
                            s.meetingsBooked > 0 ? "bg-[#ffad0a]/10 text-[#c47e00]" : "text-[#d8d3c5]"
                          }`}
                        >
                          {s.meetingsBooked}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-4 text-center text-[#6b6660] font-bold">{s.customers}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className="hidden sm:block w-20 h-1.5 bg-[#e8e4d8] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${
                                s.followUpRate > 70 ? "bg-[#09fe94]" : "bg-[#05c472]"
                              }`}
                              style={{ width: `${s.followUpRate}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-black text-[#171717] min-w-[30px] text-right">
                            {s.followUpRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
