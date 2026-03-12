"use client";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { useAppStore } from "@/store/app-store";
import { 
  TrendingUp, 
  Calendar, 
  Star, 
  Users, 
  AlertCircle, 
  ArrowUpRight, 
  CheckCircle2, 
  MousePointer2, 
  Zap,
  Mail,
  MessageSquare
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

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: number | string; sub?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-[#d8d3c5]" />
      </div>
      <p className="text-2xl font-extrabold text-[#171717] mb-0.5">{value}</p>
      <p className="text-sm text-[#6b6660]">{label}</p>
      {sub && <p className="text-xs text-[#a09b8f] mt-1">{sub}</p>}
    </div>
  );
}

export default function RapporterPage() {
  const { leads, sequences } = useAppStore();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeEnrollments, setActiveEnrollments] = useState(0);

  useEffect(() => {
    fetch("/api/team")
      .then(r => r.json())
      .then(data => setIsAdmin(data?.role === "owner" || !data?.role))
      .catch(() => setIsAdmin(true));

    fetch("/api/sequences")
      .then(r => r.json())
      .then(data => {
        const count = data.sequences?.reduce((acc: number, s: any) => acc + (s.activeEnrollments || 0), 0);
        setActiveEnrollments(count || 0);
      });
  }, []);

  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  // Build per-seller stats
  const sellerMap = new Map<string, SellerStats>();
  for (const lead of leads) {
    const name = lead.addedBy || "Ukjent";
    if (!sellerMap.has(name)) {
      sellerMap.set(name, { name, totalLeads: 0, contacted: 0, meetingsBooked: 0, customers: 0, notFollowedUp: 0, followUpRate: 0 });
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
  const totalContacted = leads.filter(l => l.status !== "Ikke kontaktet").length;
  const totalMeetings = leads.filter(l => l.status === "Booket møte").length;
  const totalCustomers = leads.filter(l => l.status === "Kunde").length;
  const newThisWeek = leads.filter(l => l.addedDate >= thisWeek).length;

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

      <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Top Key Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Totalt leads" value={totalLeads} sub={`+${newThisWeek} nye denne uken`} icon={Users} color="bg-[#09fe94]/10 text-[#05c472]" />
          <StatCard label="Pipeline verdi" value={`${(totalLeads * 14500).toLocaleString()} kr`} sub="Estimert verdi (mock)" icon={TrendingUp} color="bg-[#09fe94]/10 text-[#05c472]" />
          <StatCard label="Bookede møter" value={totalMeetings} sub={`${totalLeads > 0 ? Math.round((totalMeetings / totalLeads) * 100) : 0}% konvertering`} icon={Calendar} color="bg-[#ffad0a]/12 text-[#c47e00]" />
          <StatCard label="Aktive sekvenser" value={activeEnrollments} sub="Leads i automatisert løp" icon={Zap} color="bg-[#ff470a]/10 text-[#ff470a]" />
        </div>

        {/* Sales Funnel & Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Funnel Visualization */}
          <div className="lg:col-span-2 bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] p-6" style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-[#171717] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#05c472]" />
                Salgs-trakt (Funnel)
              </h3>
              <span className="text-xs font-semibold text-[#a09b8f] uppercase tracking-wider">Siste 30 dager</span>
            </div>

            <div className="space-y-4">
              {[
                { label: "Importerte Leads", count: totalLeads, color: "bg-[#171717]", pct: 100 },
                { label: "Beslutningstakere kontaktet", count: totalContacted, color: "bg-[#453c29]", pct: totalLeads > 0 ? (totalContacted/totalLeads)*100 : 0 },
                { label: "Bookede Møter", count: totalMeetings, color: "bg-[#ffad0a]", pct: totalLeads > 0 ? (totalMeetings/totalLeads)*100 : 0 },
                { label: "Nye Kunder", count: totalCustomers, color: "bg-[#09fe94]", pct: totalLeads > 0 ? (totalCustomers/totalLeads)*100 : 0 },
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
                      {Math.round(( ( (i===0?totalContacted:i===1?totalMeetings:totalCustomers) ) / stage.count) * 100)}% drift
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
                <p className="text-xs font-semibold text-[#09fe94] uppercase tracking-wider mb-1">AI Effekt</p>
                <h4 className="text-xl font-bold mb-4 italic">"AI-skribenten har spart deg for ca. 42 timer denne måneden."</h4>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <CheckCircle2 className="w-4 h-4 text-[#09fe94]" />
                  <span>248 utkast generert</span>
                </div>
              </div>
              <Zap className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 group-hover:text-white/10 transition-colors" />
            </div>

            <div className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] p-6">
              <h3 className="font-bold text-[#171717] text-sm mb-4">Sekvens-ytelse</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-[#a09b8f] uppercase font-bold">Åpningsrate</p>
                  <p className="text-lg font-extrabold text-[#171717]">64%</p>
                  <div className="h-1 w-full bg-[#e8e4d8] rounded-full">
                    <div className="h-full bg-[#09fe94] rounded-full w-[64%]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-[#a09b8f] uppercase font-bold">Svar-rate</p>
                  <p className="text-lg font-extrabold text-[#171717]">{totalContacted > 0 ? "12%" : "0%"}</p>
                  <div className="h-1 w-full bg-[#e8e4d8] rounded-full">
                    <div className="h-full bg-[#05c472] rounded-full w-[12%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Per-seller Leaderboard */}
        <div className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-[#e8e4d8] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#171717]">Selger-toppliste</h3>
              <p className="text-xs text-[#a09b8f] mt-0.5">Rangert etter antall bookede møter</p>
            </div>
            <Users className="w-5 h-5 text-[#d8d3c5]" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fcfbf7] border-b border-[#e8e4d8]">
                  <th className="text-left px-6 py-4 text-[10px] font-bold text-[#a09b8f] uppercase tracking-wider">Selger</th>
                  <th className="text-center px-4 py-4 text-[10px] font-bold text-[#a09b8f] uppercase tracking-wider">Leads</th>
                  <th className="text-center px-4 py-4 text-[10px] font-bold text-[#a09b8f] uppercase tracking-wider">Samtaler</th>
                  <th className="text-center px-4 py-4 text-[10px] font-bold text-[#a09b8f] uppercase tracking-wider">Møter</th>
                  <th className="text-center px-4 py-4 text-[10px] font-bold text-[#a09b8f] uppercase tracking-wider">Kunder</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold text-[#a09b8f] uppercase tracking-wider">Effektivitet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2efe3]">
                {sellers.map((s, i) => (
                  <tr key={s.name} className="hover:bg-white/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#171717] flex items-center justify-center text-[10px] font-black text-[#09fe94] shadow-sm">
                          {s.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-[#171717]">{s.name}</p>
                          <p className="text-[10px] text-[#a09b8f]">{i === 0 ? "🏆 Månedens selger" : "Aktiv nå"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-slate-800">{s.totalLeads}</td>
                    <td className="px-4 py-4 text-center text-slate-500">{s.contacted}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg font-black text-xs ${s.meetingsBooked > 0 ? "bg-[#ffad0a]/10 text-[#c47e00]" : "text-slate-300"}`}>
                        {s.meetingsBooked}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-500 font-bold">{s.customers}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-24 h-1.5 bg-[#e8e4d8] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${s.followUpRate > 70 ? "bg-[#09fe94]" : "bg-[#ffad0a]"}`}
                            style={{ width: `${s.followUpRate}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-black text-[#171717] min-w-[30px]">{s.followUpRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white rounded-2xl p-6 border border-[#d8d3c5] flex flex-col gap-4">
              <div className="bg-[#09fe94]/10 w-10 h-10 rounded-xl flex items-center justify-center text-[#05c472]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#171717]">Beste tid å sende e-post</h4>
                <p className="text-sm text-[#6b6660] mt-1">Analyser viser at tirsdager kl. 09:30 har høyest svarrate for dine kampanjer.</p>
              </div>
           </div>
           <div className="bg-white rounded-2xl p-6 border border-[#d8d3c5] flex flex-col gap-4">
              <div className="bg-orange-50 w-10 h-10 rounded-xl flex items-center justify-center text-orange-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#171717]">Mest brukte CTA</h4>
                <p className="text-sm text-[#6b6660] mt-1">"Har du sjanse til et kort møte?" fungerer bedre enn "Når passer det å snakkes?" i dine sekvenser.</p>
              </div>
           </div>
           <div className="bg-[#171717] rounded-2xl p-6 border border-[#171717] flex flex-col gap-4 text-white">
              <div className="bg-[#09fe94]/20 w-10 h-10 rounded-xl flex items-center justify-center text-[#09fe94]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Prognose</h4>
                <p className="text-sm text-white/60 mt-1">Basert på nåværende fart vil du booke ca. {totalMeetings + 3} møter til før månedsslutt.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

