"use client";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { useAppStore } from "@/store/app-store";
import { TrendingUp, Calendar, Star, Users, AlertCircle, ArrowUpRight } from "lucide-react";

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
  const { leads, currentUser } = useAppStore();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/team")
      .then(r => r.json())
      .then(data => setIsAdmin(data?.role === "owner" || !data?.role))
      .catch(() => setIsAdmin(true));
  }, []);

  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  // Build per-seller stats from addedBy field
  const sellerMap = new Map<string, SellerStats>();

  for (const lead of leads) {
    const name = lead.addedBy || lead.assignedTo || "Ukjent";
    if (!sellerMap.has(name)) {
      sellerMap.set(name, { name, totalLeads: 0, contacted: 0, meetingsBooked: 0, customers: 0, notFollowedUp: 0, followUpRate: 0 });
    }
    const s = sellerMap.get(name)!;
    s.totalLeads += 1;
    if (lead.status !== "Ikke kontaktet") s.contacted += 1;
    if (lead.status === "Booket møte") s.meetingsBooked += 1;
    if (lead.status === "Kunde") s.customers += 1;
    if (lead.status === "Ikke kontaktet" && new Date(lead.addedDate) <= twoDaysAgo) s.notFollowedUp += 1;
    if (lead.status === "Kontaktet - ikke svar" && (!lead.lastContacted || new Date(lead.lastContacted) <= twoDaysAgo)) s.notFollowedUp += 1;
  }

  for (const s of sellerMap.values()) {
    s.followUpRate = s.totalLeads > 0 ? Math.round((s.contacted / s.totalLeads) * 100) : 0;
  }

  const sellers = Array.from(sellerMap.values()).sort((a, b) => b.meetingsBooked - a.meetingsBooked);

  const totalLeads = leads.length;
  const totalMeetings = leads.filter(l => l.status === "Booket møte").length;
  const totalCustomers = leads.filter(l => l.status === "Kunde").length;
  const newThisWeek = leads.filter(l => l.addedDate >= thisWeek).length;

  if (isAdmin === null) {
    return (
      <div>
        <TopBar title="Rapporter" />
        <div className="flex items-center justify-center h-64 text-[#a09b8f] text-sm">Laster…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div>
        <TopBar title="Rapporter" />
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <AlertCircle className="w-10 h-10 text-[#d8d3c5]" />
          <p className="text-[#6b6660] font-medium">Kun teamlederen har tilgang til salgsrapporter</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="Salgsrapporter" subtitle="Oversikt per selger — kun synlig for teamleder" />

      <div className="p-4 sm:p-8 space-y-6">
        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Totalt leads" value={totalLeads} sub={`+${newThisWeek} denne uken`} icon={Users} color="bg-[#09fe94]/10 text-[#05c472]" />
          <StatCard label="Bookede møter" value={totalMeetings} sub={`${totalLeads > 0 ? Math.round((totalMeetings / totalLeads) * 100) : 0}% av alle leads`} icon={Calendar} color="bg-[#ffad0a]/12 text-[#c47e00]" />
          <StatCard label="Kunder" value={totalCustomers} sub={`${totalLeads > 0 ? Math.round((totalCustomers / totalLeads) * 100) : 0}% konverteringsrate`} icon={Star} color="bg-[#ff470a]/10 text-[#ff470a]" />
          <StatCard label="Aktive selgere" value={sellerMap.size} icon={TrendingUp} color="bg-[#171717]/5 text-[#6b6660]" />
        </div>

        {/* Per-seller table */}
        <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <div className="px-6 py-4 border-b border-[#e8e4d8]">
            <h3 className="font-semibold text-[#171717]">Oversikt per selger</h3>
            <p className="text-xs text-[#a09b8f] mt-0.5">Sortert etter bookede møter</p>
          </div>

          {sellers.length === 0 ? (
            <div className="text-center py-16 text-[#a09b8f]">
              <Users className="w-10 h-10 mx-auto mb-3 text-[#d8d3c5]" />
              <p className="text-sm">Ingen leads lagt til ennå</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8e4d8]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6b6660] uppercase tracking-wide">Selger</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#6b6660] uppercase tracking-wide">Leads</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#6b6660] uppercase tracking-wide">Kontaktet</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#6b6660] uppercase tracking-wide">Møter</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#6b6660] uppercase tracking-wide">Kunder</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#6b6660] uppercase tracking-wide">Ikke fulgt opp</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-[#6b6660] uppercase tracking-wide">Oppfølgingsrate</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((s, i) => (
                    <tr key={s.name} className={`border-b border-[#f2efe3] hover:bg-[#f2efe3] transition-colors ${i === 0 ? "bg-[#09fe94]/4" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#171717] flex items-center justify-center text-xs font-bold text-[#09fe94] flex-shrink-0">
                            {s.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#171717]">{s.name}</p>
                            {i === 0 && <p className="text-xs text-[#09fe94] font-medium">Flest møter</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center font-semibold text-[#171717]">{s.totalLeads}</td>
                      <td className="px-4 py-4 text-center text-[#3d3a34]">{s.contacted}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`font-bold ${s.meetingsBooked > 0 ? "text-[#c47e00]" : "text-[#d8d3c5]"}`}>
                          {s.meetingsBooked}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`font-bold ${s.customers > 0 ? "text-[#09fe94]" : "text-[#d8d3c5]"}`}>
                          {s.customers}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {s.notFollowedUp > 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#ff470a] bg-[#ff470a]/8 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            {s.notFollowedUp}
                          </span>
                        ) : (
                          <span className="text-[#d8d3c5]">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-1.5 bg-[#e8e4d8] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#09fe94] transition-all"
                              style={{ width: `${s.followUpRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-[#171717] w-8 text-right">{s.followUpRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Insight cards */}
        {sellers.length >= 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <p className="text-xs font-semibold text-[#6b6660] uppercase tracking-wide mb-2">Hvem booker flest møter?</p>
              <p className="text-lg font-bold text-[#171717]">{sellers[0].name}</p>
              <p className="text-sm text-[#6b6660]">{sellers[0].meetingsBooked} møter booket av {sellers[0].totalLeads} leads</p>
            </div>
            <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <p className="text-xs font-semibold text-[#6b6660] uppercase tracking-wide mb-2">Trenger oppfølging</p>
              {sellers.sort((a, b) => b.notFollowedUp - a.notFollowedUp)[0]?.notFollowedUp > 0 ? (
                <>
                  <p className="text-lg font-bold text-[#ff470a]">{sellers[0].name}</p>
                  <p className="text-sm text-[#6b6660]">{sellers[0].notFollowedUp} leads uten oppfølging</p>
                </>
              ) : (
                <p className="text-sm text-[#09fe94] font-semibold">Alt ser bra ut!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
