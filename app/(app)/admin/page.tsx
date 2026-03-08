"use client";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { useAppStore } from "@/store/app-store";
import { isAdmin } from "@/lib/admin";
import {
  Users, CreditCard, TrendingUp, AlertCircle,
  CheckCircle2, Clock, XCircle, ShieldCheck, Building2,
} from "lucide-react";

interface UserRow {
  id: string;
  email: string;
  name: string;
  company: string;
  createdAt: string;
  lastSignIn: string | null;
  emailConfirmed: boolean;
  leadCount: number;
  teamSize: number;
  isAdmin: boolean;
  subscription: {
    plan: string;
    status: string;
    interval: string;
    trialEnd: string | null;
  } | null;
}

function SubBadge({ sub }: { sub: UserRow["subscription"] }) {
  if (!sub) return <span className="text-xs text-[#a09b8f]">Ingen</span>;
  const colors: Record<string, string> = {
    active: "bg-[#09fe94]/15 text-[#059669]",
    trialing: "bg-[#ffad0a]/15 text-[#c47e00]",
    canceled: "bg-[#ff470a]/10 text-[#ff470a]",
    past_due: "bg-red-100 text-red-600",
  };
  const labels: Record<string, string> = {
    active: "Aktiv",
    trialing: "Prøveperiode",
    canceled: "Kansellert",
    past_due: "Forfalt",
  };
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${colors[sub.status] ?? "bg-[#e8e4d8] text-[#6b6660]"}`}>
        {labels[sub.status] ?? sub.status}
      </span>
      <span className="text-xs text-[#a09b8f] capitalize">{sub.plan} · {sub.interval === "yearly" ? "Årlig" : "Månedlig"}</span>
    </div>
  );
}

export default function AdminPage() {
  const { currentUser } = useAppStore();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [mrr, setMrr] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const allowed = isAdmin(currentUser?.email);

  useEffect(() => {
    if (!allowed) return;
    fetch("/api/admin/users")
      .then(r => r.json())
      .then(data => { setUsers(data.users ?? []); setMrr(data.mrr ?? 0); })
      .finally(() => setLoading(false));
  }, [allowed]);

  if (!allowed) {
    return (
      <div>
        <TopBar title="Admin" />
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <AlertCircle className="w-10 h-10 text-[#d8d3c5]" />
          <p className="text-[#6b6660] font-medium">Ingen tilgang</p>
        </div>
      </div>
    );
  }

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.company.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = users.filter(u => u.subscription?.status === "active").length;
  const trialCount = users.filter(u => u.subscription?.status === "trialing").length;
  const noSubCount = users.filter(u => !u.subscription).length;

  return (
    <div>
      <TopBar title="Admin" subtitle="Brukere og betalinger — kun synlig for deg" />

      <div className="p-4 sm:p-8 space-y-6">
        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div className="w-9 h-9 bg-[#171717] rounded-lg flex items-center justify-center mb-3">
              <Users className="w-4 h-4 text-[#09fe94]" />
            </div>
            <p className="text-2xl font-extrabold text-[#171717]">{users.length}</p>
            <p className="text-sm text-[#6b6660]">Totalt registrerte</p>
          </div>
          <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div className="w-9 h-9 bg-[#09fe94]/10 rounded-lg flex items-center justify-center mb-3">
              <CreditCard className="w-4 h-4 text-[#059669]" />
            </div>
            <p className="text-2xl font-extrabold text-[#171717]">{mrr.toLocaleString("nb-NO")} kr</p>
            <p className="text-sm text-[#6b6660]">Estimert MRR</p>
          </div>
          <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div className="w-9 h-9 bg-[#09fe94]/10 rounded-lg flex items-center justify-center mb-3">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            </div>
            <p className="text-2xl font-extrabold text-[#171717]">{activeCount}</p>
            <p className="text-sm text-[#6b6660]">Aktive abonnenter</p>
          </div>
          <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div className="w-9 h-9 bg-[#ffad0a]/12 rounded-lg flex items-center justify-center mb-3">
              <Clock className="w-4 h-4 text-[#c47e00]" />
            </div>
            <p className="text-2xl font-extrabold text-[#171717]">{trialCount}</p>
            <p className="text-sm text-[#6b6660]">I prøveperiode</p>
          </div>
        </div>

        {/* Users table */}
        <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <div className="px-6 py-4 border-b border-[#e8e4d8] flex items-center justify-between gap-4">
            <h3 className="font-semibold text-[#171717] shrink-0">Alle brukere</h3>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Søk på e-post, navn eller selskap…"
              className="text-sm px-3 py-1.5 border border-[#d8d3c5] rounded-lg bg-[#f2efe3] focus:outline-none focus:border-[#09fe94] w-64 text-[#171717] placeholder:text-[#a09b8f]"
            />
          </div>

          {loading ? (
            <div className="text-center py-16 text-sm text-[#a09b8f]">Laster brukere…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8e4d8]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#6b6660] uppercase tracking-wide">Bruker</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b6660] uppercase tracking-wide">Abonnement</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#6b6660] uppercase tracking-wide">Leads</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#6b6660] uppercase tracking-wide">Team</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b6660] uppercase tracking-wide">Registrert</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#6b6660] uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id} className="border-b border-[#f2efe3] hover:bg-[#f2efe3] transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#e8e4d8] flex items-center justify-center text-xs font-bold text-[#6b6660] flex-shrink-0">
                            {(u.name || u.email).slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-[#171717] truncate">{u.name || u.email}</p>
                              {u.isAdmin && (
                                <ShieldCheck className="w-3.5 h-3.5 text-[#09fe94] shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-[#a09b8f] truncate">{u.email}</p>
                            {u.company && (
                              <p className="text-xs text-[#6b6660] flex items-center gap-1 truncate">
                                <Building2 className="w-3 h-3" />{u.company}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <SubBadge sub={u.isAdmin ? { plan: "team", status: "active", interval: "yearly", trialEnd: null } : u.subscription} />
                      </td>
                      <td className="px-4 py-3.5 text-center font-semibold text-[#171717]">{u.leadCount}</td>
                      <td className="px-4 py-3.5 text-center text-[#3d3a34]">
                        {u.teamSize > 0 ? `${u.teamSize} med.` : <span className="text-[#d8d3c5]">—</span>}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#6b6660]">
                        {new Date(u.createdAt).toLocaleDateString("nb-NO", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {u.emailConfirmed
                          ? <CheckCircle2 className="w-4 h-4 text-[#09fe94] mx-auto" />
                          : <Clock className="w-4 h-4 text-[#ffad0a] mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-sm text-[#a09b8f]">Ingen brukere funnet</div>
              )}
            </div>
          )}

          <div className="px-6 py-3 border-t border-[#e8e4d8] flex items-center gap-4 text-xs text-[#a09b8f]">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#09fe94]" /> {activeCount} aktive</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#ffad0a]" /> {trialCount} prøveperiode</span>
            <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-[#d8d3c5]" /> {noSubCount} uten abonnement</span>
          </div>
        </div>
      </div>
    </div>
  );
}
