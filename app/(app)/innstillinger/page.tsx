"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/app-store";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  User,
  Users,
  CreditCard,
  Bell,
  Shield,
  Plus,
  Check,
  Crown,
  Mail,
  Building2,
  Camera,
  Loader2,
  Link2,
  Unlink,
  CheckCircle2,
  GitBranch,
  Trash2,
  GripVertical,
  ArrowRight,
} from "lucide-react";

const tabs = [
  { id: "profil", label: "Min profil", icon: User },
  { id: "team", label: "Team", icon: Users },
  { id: "epost", label: "E-post", icon: Mail },
  { id: "fakturering", label: "Fakturering", icon: CreditCard },
  { id: "pipeline", label: "Pipeline", icon: GitBranch },
  { id: "varsler", label: "Varsler", icon: Bell },
  { id: "sikkerhet", label: "Sikkerhet", icon: Shield },
];

/* ── Notification settings tab ── */
const NOTIFICATION_ITEMS: { key: string; label: string; desc: string; defaultEnabled: boolean }[] = [
  { key: "epost_nye_leads",         label: "E-postvarsler for nye leads",  desc: "Få e-post når et nytt lead legges til",                       defaultEnabled: true },
  { key: "oppfolgingspaminnelser",  label: "Oppfølgingspåminnelser",       desc: "Automatiske påminnelser etter 3 dager uten kontakt",           defaultEnabled: true },
  { key: "motepaminnelser",         label: "Møtepåminnelser",              desc: "Påminnelse 1 time før bookede møter",                          defaultEnabled: true },
  { key: "ukentlig_sammendrag",     label: "Ukentlig rapport",             desc: "Ukentlig e-post hver søndag med pipeline-statistikk og teamtoppliste", defaultEnabled: false },
  { key: "teamaktivitet",           label: "Teamaktivitet",                desc: "Varsler når teammedlemmer oppdaterer leads",                   defaultEnabled: false },
];

type NotifSettings = Record<string, boolean>;

function NotifSettingsTab() {
  const supabase = createClient();
  const [settings, setSettings] = useState<NotifSettings>(() =>
    Object.fromEntries(NOTIFICATION_ITEMS.map(i => [i.key, i.defaultEnabled]))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.notification_settings) {
        setSettings(prev => ({ ...prev, ...user.user_metadata.notification_settings }));
      }
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    setSaving(true);
    await supabase.auth.updateUser({ data: { notification_settings: settings } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <div className="py-8 text-center text-sm text-[#a09b8f]">Laster innstillinger…</div>;

  return (
    <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <h2 className="text-base font-semibold text-[#171717] mb-6">Varslingsinnstillinger</h2>
      <div className="space-y-1">
        {NOTIFICATION_ITEMS.map(item => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-[#e8e4d8] last:border-0">
            <div>
              <p className="text-sm font-medium text-[#171717]">{item.label}</p>
              <p className="text-xs text-[#a09b8f] mt-0.5">{item.desc}</p>
            </div>
            <button
              onClick={() => setSettings(s => ({ ...s, [item.key]: !s[item.key] }))}
              className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none shrink-0 ${settings[item.key] ? "bg-[#09fe94]" : "bg-[#d8d3c5]"}`}
            >
              <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
                style={{ transform: settings[item.key] ? "translateX(24px)" : "translateX(0)" }} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Button variant="primary" size="md" onClick={save} disabled={saving}>
          {saving ? "Lagrer…" : "Lagre innstillinger"}
        </Button>
        {saved && <span className="text-sm text-[#09fe94] flex items-center gap-1"><Check className="w-3.5 h-3.5" />Lagret</span>}
      </div>
    </div>
  );
}

const DEFAULT_STAGES = ["Ikke kontaktet", "Kontaktet", "Kontaktet - ikke svar", "Booket møte", "Avslått", "Kunde"];

function PipelineTab({ stages, onSave }: { stages: string[]; onSave: (s: string[]) => void }) {
  const [local, setLocal] = useState<string[]>(stages);
  const [newStage, setNewStage] = useState("");
  const [saved, setSaved] = useState(false);

  const add = () => {
    const trimmed = newStage.trim();
    if (!trimmed || local.includes(trimmed)) return;
    setLocal(prev => [...prev, trimmed]);
    setNewStage("");
  };

  const remove = (idx: number) => setLocal(prev => prev.filter((_, i) => i !== idx));
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setLocal(prev => { const a = [...prev]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a; });
  };
  const moveDown = (idx: number) => {
    if (idx === local.length - 1) return;
    setLocal(prev => { const a = [...prev]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a; });
  };

  const save = () => {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-[#171717]">Pipeline-statuser</h2>
          <button
            onClick={() => setLocal(DEFAULT_STAGES)}
            className="text-xs text-[#a09b8f] hover:text-[#ff470a] transition-colors"
          >
            Tilbakestill til standard
          </button>
        </div>
        <p className="text-sm text-[#6b6660] mb-6">
          Definer egne salgssteg. Rekkefølgen bestemmer visningen i pipeline-filteret.
        </p>

        <div className="space-y-2 mb-5">
          {local.map((stage, idx) => (
            <div key={stage + idx} className="flex items-center gap-2 group">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveUp(idx)} disabled={idx === 0} className="text-[#d8d3c5] hover:text-[#6b6660] disabled:opacity-30 transition-colors leading-none">
                  <span style={{ fontSize: 10 }}>▲</span>
                </button>
                <button onClick={() => moveDown(idx)} disabled={idx === local.length - 1} className="text-[#d8d3c5] hover:text-[#6b6660] disabled:opacity-30 transition-colors leading-none">
                  <span style={{ fontSize: 10 }}>▼</span>
                </button>
              </div>
              <GripVertical className="w-4 h-4 text-[#d8d3c5] shrink-0" />
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-[#f2efe3] border border-[#d8d3c5] rounded-lg">
                <span className="text-sm text-[#171717]">{stage}</span>
                {DEFAULT_STAGES.includes(stage) && (
                  <span className="ml-auto text-xs text-[#a09b8f]">standard</span>
                )}
              </div>
              <button
                onClick={() => remove(idx)}
                disabled={local.length <= 1}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-[#ff470a]/10 text-[#a09b8f] hover:text-[#ff470a] disabled:pointer-events-none"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new stage */}
        <div className="flex gap-2">
          <input
            value={newStage}
            onChange={e => setNewStage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            placeholder="Legg til nytt steg, f.eks. «Prøveperiode»"
            className="flex-1 text-sm px-3 py-2 border border-[#d8d3c5] rounded-lg bg-[#faf8f2] focus:outline-none focus:border-[#09fe94] text-[#171717] placeholder:text-[#a09b8f]"
          />
          <Button type="button" variant="secondary" size="md" onClick={add}>
            <Plus className="w-4 h-4" />
            Legg til
          </Button>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          {saved && <span className="text-sm text-[#09fe94] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Lagret</span>}
          <Button type="button" variant="primary" size="md" onClick={save}>
            Lagre endringer
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function InnstillingerPage() {
  const { currentUser, setCurrentUser, leads, avatarUrl, setAvatarUrl, pipelineStages, setPipelineStages } = useAppStore();
  const [activeTab, setActiveTab] = useState("profil");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [teamMembers, setTeamMembers] = useState<{ member_email: string; member_name: string; status: string; role?: string }[]>([]);
  const [teamRole, setTeamRole] = useState<"owner" | "member">("owner");
  const [emailConnections, setEmailConnections] = useState<{ provider: string; email_address: string }[]>([]);
  const [emailConnecting, setEmailConnecting] = useState<string | null>(null);
  const [emailDisconnecting, setEmailDisconnecting] = useState<string | null>(null);
  const [removingMember, setRemovingMember] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object" && !Array.isArray(data)) {
          setTeamRole(data.role ?? "owner");
          setTeamMembers(Array.isArray(data.members) ? data.members : []);
        }
      })
      .catch(() => {});
  }, [inviteSent]);

  const loadEmailConnections = () => {
    fetch("/api/email/connections")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setEmailConnections(data))
      .catch(() => {});
  };

  useEffect(() => {
    loadEmailConnections();
    // Open epost tab if redirected back from OAuth
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "epost") {
      setActiveTab("epost");
      window.history.replaceState({}, "", "/innstillinger");
    }
  }, []);

  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    company: currentUser?.company ?? "",
    salesPitch: currentUser?.salesPitch ?? "",
  });

  // Load actual Supabase user data on mount
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const name = user.user_metadata?.full_name ?? currentUser?.name ?? "";
      const email = user.email ?? "";
      const company = user.user_metadata?.company ?? currentUser?.company ?? "";
      const salesPitch = user.user_metadata?.sales_pitch ?? currentUser?.salesPitch ?? "";
      setProfileForm((prev) => ({
        ...prev,
        name: name || prev.name,
        email: email || prev.email,
        company: company || prev.company,
        salesPitch: salesPitch || prev.salesPitch,
      }));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [profileSaved, setProfileSaved] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);
  const [stripeSubscription, setStripeSubscription] = useState<{
    id: string;
    status: string;
    plan: string;
    interval: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
  } | null | "loading">("loading");

  useEffect(() => {
    fetch("/api/stripe/subscription")
      .then((r) => r.json())
      .then((data) => setStripeSubscription(data.subscription ?? null))
      .catch(() => setStripeSubscription(null));
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async () => {
    setCurrentUser({
      name: profileForm.name,
      email: profileForm.email,
      company: profileForm.company,
      salesPitch: profileForm.salesPitch,
    });
    // Sync to Supabase auth metadata
    const supabase = createClient();
    await supabase.auth.updateUser({
      data: { full_name: profileForm.name, sales_pitch: profileForm.salesPitch },
    });
    // Sync name to team_members table so teammates see the updated name
    await fetch("/api/team", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ member_name: profileForm.name }),
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleDisconnectEmail = async (provider: string) => {
    setEmailDisconnecting(provider);
    await fetch("/api/email/connections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider }),
    });
    loadEmailConnections();
    setEmailDisconnecting(null);
  };

  const handleInvoiceDownload = useCallback((date: string, amount: string) => {
    const content = `FAKTURA\n\nDato: ${date}\nBeløp: ${amount}\nStatus: Betalt\n\nReachr Pro-plan\nreachr.no`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `faktura-reachr-${date.replace(/\s|\./g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSending(true);
    setInviteError("");
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          inviterName: currentUser?.name ?? profileForm.name,
          companyName: currentUser?.company ?? profileForm.company,
        }),
      });
      if (res.ok) {
        setInviteSent(true);
        setInviteEmail("");
        setTimeout(() => setInviteSent(false), 4000);
      } else {
        const body = await res.json().catch(() => ({}));
        setInviteError(body.error ?? "Kunne ikke sende invitasjon. Prøv igjen.");
      }
    } catch {
      setInviteError("Nettverksfeil. Sjekk tilkoblingen.");
    } finally {
      setInviteSending(false);
    }
  };

  const handleRemoveMember = async (memberEmail: string) => {
    if (!confirm(`Er du sikker på at du vil fjerne ${memberEmail} fra teamet ditt?`)) return;
    
    setRemovingMember(memberEmail);
    try {
      const res = await fetch("/api/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_email: memberEmail }),
      });
      if (res.ok) {
        setTeamMembers(prev => prev.filter(m => m.member_email !== memberEmail));
      } else {
        toast.error("Kunne ikke fjerne medlemmet.");
      }
    } catch {
      toast.error("Nettverksfeil. Sjekk tilkoblingen.");
    } finally {
      setRemovingMember(null);
    }
  };

  const initials = profileForm.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      <TopBar title="Innstillinger" />

      {/* Plan change modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" onClick={() => setShowPlanModal(false)}>
          <div className="bg-[#faf8f2] rounded-2xl shadow-2xl p-8 w-[480px] max-w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#171717] mb-2">Velg plan</h2>
            <p className="text-sm text-[#6b6660] mb-6">Velg planen som passer din bedrift.</p>
            <div className="space-y-3">
              {[
                { name: "Starter", price: "99 kr/mnd", desc: "1 bruker · 50 leads · Leadsøk" },
                { name: "Pro", price: "199 kr/mnd", desc: "5 brukere · Ubegrenset leads · Alt i Starter + e-postintegrasjon" },
                { name: "Team", price: "499 kr/mnd", desc: "5 brukere · Prioritert support · Alt i Pro + API-tilgang" },
              ].map((plan) => {
                const isSelected = selectedPlan === plan.name;
                return (
                  <div
                    key={plan.name}
                    onClick={() => setSelectedPlan(plan.name)}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${isSelected ? "border-[#09fe94] bg-[#09fe94]/8" : "border-[#d8d3c5] hover:border-[#a09b8f]"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#171717]">
                          {plan.name}
                          {isSelected && <span className="ml-2 text-xs text-[#05c472] font-medium">(Valgt)</span>}
                        </p>
                        <p className="text-xs text-[#6b6660] mt-0.5">{plan.desc}</p>
                      </div>
                      <p className="font-bold text-[#171717] text-sm">{plan.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowPlanModal(false)} className="flex-1 py-2.5 border border-[#d8d3c5] rounded-xl text-sm font-semibold text-[#6b6660] hover:bg-[#e8e4d8]">Avbryt</button>
              <button
                onClick={() => {
                  toast.success(`Plan endret til ${selectedPlan}!`);
                  setShowPlanModal(false);
                }}
                className="flex-1 py-2.5 bg-[#09fe94] text-[#171717] rounded-xl text-sm font-semibold hover:bg-[#00e882]"
              >
                Bytt til {selectedPlan}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          {/* Sidebar tabs */}
          <div className="sm:w-52 sm:flex-shrink-0">
            <nav className="flex sm:flex-col overflow-x-auto sm:overflow-visible gap-1 sm:space-y-1 pb-1 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
              {tabs.filter(t => !(teamRole === "member" && t.id === "fakturering")).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-shrink-0 sm:flex-shrink sm:w-full flex items-center gap-2 sm:gap-3 px-3 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all text-left whitespace-nowrap sm:whitespace-normal ${
                    activeTab === id
                      ? "bg-[#09fe94]/10 text-[#05c472]"
                      : "text-[#6b6660] hover:bg-[#e8e4d8] hover:text-[#171717]"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* ── Profil ── */}
            {activeTab === "profil" && (
              <div className="space-y-6">
                <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <h2 className="text-base font-semibold text-[#171717] mb-6">Personlig informasjon</h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Profilbilde"
                          className="w-16 h-16 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-[#171717] rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                          {initials}
                        </div>
                      )}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white border border-[#d8d3c5] rounded-full flex items-center justify-center shadow-sm hover:bg-[#e8e4d8] transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#6b6660]" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <div>
                      <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                        Endre profilbilde
                      </Button>
                      <p className="text-xs text-[#a09b8f] mt-1">JPG, PNG maks 2MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Fullt navn</label>
                      <Input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        icon={<User className="w-4 h-4" />}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">E-postadresse</label>
                      <Input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        icon={<Mail className="w-4 h-4" />}
                      />
                    </div>
                    {teamRole === "owner" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Bedriftsnavn</label>
                      <Input
                        value={profileForm.company}
                        onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                        icon={<Building2 className="w-4 h-4" />}
                      />
                    </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Hva selger dere? <span className="text-[#a09b8f] font-normal">(brukes av AI til å skrive relevante kalde e-poster)</span>
                    </label>
                    <textarea
                      value={profileForm.salesPitch}
                      onChange={(e) => setProfileForm({ ...profileForm, salesPitch: e.target.value })}
                      placeholder="F.eks: Vi selger en AI-resepsjonist som svarer på anrop 24/7, booker avtaler og reduserer tapte henvendelser for små og mellomstore bedrifter."
                      rows={3}
                      style={{
                        width: "100%", padding: "10px 12px",
                        border: "1.5px solid #E5E7EB", borderRadius: 10,
                        fontSize: 14, color: "#111827", outline: "none",
                        fontFamily: "inherit", backgroundColor: "#FAFAFA",
                        resize: "vertical", lineHeight: "1.5",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#22C55E")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-6">
                    {profileSaved && (
                      <span className="flex items-center gap-1.5 text-sm text-[#05c472] font-medium">
                        <Check className="w-4 h-4" /> Lagret!
                      </span>
                    )}
                    <Button variant="primary" size="md" onClick={handleProfileSave}>
                      Lagre endringer
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Team ── */}
            {activeTab === "team" && (
              <div className="space-y-6">
                {/* Invite — only shown to team owners */}
                {teamRole === "owner" && (
                <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-[#171717]">Inviter teammedlem</h2>
                    <span className="text-xs text-[#a09b8f] px-2 py-1 bg-[#e8e4d8] rounded-md font-medium">
                      {teamMembers.length} / 4 inviterte
                    </span>
                  </div>
                  <form onSubmit={handleInvite} className={`flex gap-3 ${teamMembers.length >= 4 ? "opacity-50 pointer-events-none" : ""}`}>
                    <Input
                      type="email"
                      placeholder="kollega@bedrift.no"
                      icon={<Mail className="w-4 h-4" />}
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="flex-1"
                      required
                      disabled={teamMembers.length >= 4}
                    />
                    <Button type="submit" variant="primary" size="md" disabled={inviteSending || teamMembers.length >= 4}>
                      {inviteSending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Sender…</>
                      ) : inviteSent ? (
                        <><Check className="w-4 h-4" /> Sendt!</>
                      ) : (
                        <><Plus className="w-4 h-4" /> Inviter</>
                      )}
                    </Button>
                  </form>
                  {teamMembers.length >= 4 && (
                    <p className="text-xs text-amber-600 mt-3 font-medium flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> 
                      Du har nådd grensen på 4 inviterte medlemmer (maks 5 i teamet totalt).
                    </p>
                  )}
                  {inviteError && (
                    <p className="text-xs text-red-500 mt-2">{inviteError}</p>
                  )}
                  {inviteSent && (
                    <p className="text-xs text-[#05c472] mt-2 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Invitasjon sendt til {inviteEmail || "kollega"}!
                    </p>
                  )}
                  {teamMembers.length < 4 && (
                    <p className="text-xs text-[#a09b8f] mt-2">
                      Invitasjonen er gyldig i 7 dager. Ny bruker legges til planen din automatisk.
                    </p>
                  )}
                </div>
                )}

                {/* Team members */}
                <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-[#171717]">Teammedlemmer ({1 + teamMembers.length})</h2>
                  </div>
                  <div className="divide-y divide-[#e8e4d8]">
                    {/* Current user */}
                    <div className="flex items-center gap-4 px-6 py-4">
                      <div className="w-10 h-10 bg-[#09fe94]/20 rounded-xl flex items-center justify-center text-[#065c3a] text-sm font-bold">
                        {initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[#171717]">{profileForm.name}</p>
                          {teamRole === "owner" ? (
                            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <Crown className="w-2.5 h-2.5" />
                              Admin
                            </span>
                          ) : (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <Users className="w-2.5 h-2.5" />
                              Medlem
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#a09b8f]">{profileForm.email} · Deg</p>
                      </div>
                      <span className="text-xs text-[#a09b8f] bg-gray-50 border border-[#d8d3c5] rounded-lg px-3 py-1.5">
                        {teamRole === "owner" ? "Admin" : "Medlem"}
                      </span>
                    </div>

                    {/* Invited/joined team members */}
                    {teamMembers.map((m) => {
                      const nameInitials = (m.member_name || m.member_email)
                        .split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
                      const isPending = m.status === "pending";
                      const isOwner = m.role === "owner";
                      return (
                        <div key={m.member_email} className="flex items-center gap-4 px-6 py-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                            isPending
                              ? "bg-[#e8e4d8] text-[#a09b8f]"
                              : isOwner
                                ? "bg-[#ff470a]/15 text-[#ff470a]"
                                : "bg-[#09fe94]/20 text-[#065c3a]"
                          }`}>
                            {isPending ? <Mail className="w-4 h-4" /> : nameInitials}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-[#171717]">
                                {m.member_name || m.member_email}
                              </p>
                              {isOwner && (
                                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                                  <Crown className="w-2.5 h-2.5" />
                                  Admin
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#a09b8f]">{m.member_email}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs px-3 py-1.5 rounded-lg border ${isOwner ? "text-yellow-700 bg-yellow-50 border-yellow-200" : isPending ? "text-yellow-700 bg-yellow-50 border-yellow-200" : "text-green-700 bg-green-50 border-green-200"}`}>
                              {isOwner ? "Admin" : isPending ? "Invitert" : "Aktiv"}
                            </span>
                            {teamRole === "owner" && !isOwner && (
                              <button
                                onClick={() => handleRemoveMember(m.member_email)}
                                disabled={removingMember === m.member_email}
                                className="p-1.5 text-[#a09b8f] hover:text-[#ff470a] hover:bg-[#ff470a]/10 rounded-lg transition-colors disabled:opacity-50"
                                title="Fjern medlem"
                              >
                                {removingMember === m.member_email ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-[#a09b8f]">
                      Inviter kolleger via skjemaet over for å gi dem tilgang til Reachr.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Fakturering ── */}
            {/* ── E-post ── */}
            {activeTab === "epost" && (
              <div className="space-y-6">
                <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <h2 className="text-base font-semibold text-[#171717] mb-1">E-posttilkoblinger</h2>
                  <p className="text-sm text-[#6b6660] mb-6">Koble til Gmail eller Outlook for å sende AI-genererte e-poster direkte fra Reachr.</p>

                  <div className="space-y-4">
                    {/* Gmail */}
                    {(() => {
                      const conn = emailConnections.find((c) => c.provider === "gmail");
                      return (
                        <div className="flex items-center justify-between p-4 border border-[#d8d3c5] rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#171717]">Gmail</p>
                              {conn ? (
                                <p className="text-xs text-[#05c472] flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> {conn.email_address}
                                </p>
                              ) : (
                                <p className="text-xs text-[#a09b8f]">Ikke tilkoblet</p>
                              )}
                            </div>
                          </div>
                          {conn ? (
                            <button
                              onClick={() => handleDisconnectEmail("gmail")}
                              disabled={emailDisconnecting === "gmail"}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {emailDisconnecting === "gmail" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unlink className="w-3 h-3" />}
                              Koble fra
                            </button>
                          ) : (
                            <a
                              href="/api/email/google/connect"
                              onClick={() => setEmailConnecting("gmail")}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <Link2 className="w-3 h-3" />
                              Koble til Gmail
                            </a>
                          )}
                        </div>
                      );
                    })()}

                    {/* Outlook */}
                    {(() => {
                      const conn = emailConnections.find((c) => c.provider === "outlook");
                      return (
                        <div className="flex items-center justify-between p-4 border border-[#d8d3c5] rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                                <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.1V2.55q0-.44.3-.75.3-.3.75-.3h12.5q.44 0 .75.3.3.3.3.75V10.85l1.24.72h.01q.1.07.14.18.04.1.01.21z" fill="#0078D4"/>
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#171717]">Outlook</p>
                              {conn ? (
                                <p className="text-xs text-[#05c472] flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> {conn.email_address}
                                </p>
                              ) : (
                                <p className="text-xs text-[#a09b8f]">Ikke tilkoblet</p>
                              )}
                            </div>
                          </div>
                          {conn ? (
                            <button
                              onClick={() => handleDisconnectEmail("outlook")}
                              disabled={emailDisconnecting === "outlook"}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {emailDisconnecting === "outlook" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unlink className="w-3 h-3" />}
                              Koble fra
                            </button>
                          ) : (
                            <a
                              href="/api/email/microsoft/connect"
                              onClick={() => setEmailConnecting("outlook")}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <Link2 className="w-3 h-3" />
                              Koble til Outlook
                            </a>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>
            )}

            {activeTab === "fakturering" && (
              <div className="space-y-6">
                <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <h2 className="text-base font-semibold text-[#171717] mb-6">Nåværende plan</h2>

                  {stripeSubscription === "loading" ? (
                    <div className="flex items-center gap-2 text-[#6b6660] py-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Laster abonnementsinfo...</span>
                    </div>
                  ) : stripeSubscription === null ? (
                    <div className="bg-[#f2efe3] rounded-xl p-6 border border-[#d8d3c5]">
                      <p className="text-sm font-semibold text-[#171717] mb-1">Ingen aktiv plan</p>
                      <p className="text-sm text-[#6b6660] mb-4">Du har ikke et aktivt abonnement. Start en prøveperiode for å få tilgang til alle funksjoner.</p>
                      <Button variant="primary" size="md" onClick={() => window.location.href = "/onboarding/betaling"}>Kom i gang</Button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-[#171717] rounded-xl p-6 text-white mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-white/60 text-sm">Aktiv plan</p>
                            <p className="text-2xl font-bold capitalize">{stripeSubscription.plan}-plan</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white/60 text-sm">Fakturering</p>
                            <p className="text-lg font-bold capitalize">{stripeSubscription.interval === "yearly" ? "Årlig" : "Månedlig"}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-white/20">
                          <p className="text-white/60 text-sm">
                            {stripeSubscription.cancel_at_period_end
                              ? "Avbestilt — tilgang til: " + new Date(stripeSubscription.current_period_end).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })
                              : "Fornyes: " + new Date(stripeSubscription.current_period_end).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${stripeSubscription.cancel_at_period_end ? "bg-yellow-400 text-[#171717]" : stripeSubscription.status === "trialing" ? "bg-blue-400 text-white" : "bg-[#09fe94] text-[#171717]"}`}>
                            {stripeSubscription.cancel_at_period_end ? "Avbestilt" : stripeSubscription.status === "trialing" ? "Prøveperiode" : "Aktiv"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="border border-[#d8d3c5] rounded-xl p-4">
                          <p className="text-sm font-semibold text-[#171717] mb-1">Brukere</p>
                          <p className="text-2xl font-extrabold text-[#171717]">{1 + teamMembers.length} / {stripeSubscription.plan === "team" ? 5 : 1}</p>
                          <p className="text-xs text-[#a09b8f]">Maks {stripeSubscription.plan === "team" ? "5 på Team-planen" : "1 på Solo-planen"}</p>
                        </div>
                      </div>

                      {!stripeSubscription.cancel_at_period_end && (
                        <div className="flex gap-3 mt-6">
                          <Button variant="secondary" size="md" onClick={() => setShowPlanModal(true)}>Endre abonnement</Button>
                          <Button variant="ghost" size="md" className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            disabled={openingPortal}
                            onClick={async () => {
                              setOpeningPortal(true);
                              try {
                                const res = await fetch("/api/stripe/portal", { method: "POST" });
                                const data = await res.json();
                                if (data.url) {
                                  window.location.href = data.url;
                                } else {
                                  toast.error("Kunne ikke åpne Stripe-portalen: " + (data.error || "Ukjent feil"));
                                }
                              } catch (err: any) {
                                toast.error("Nettverksfeil: " + err.message);
                              } finally {
                                setOpeningPortal(false);
                              }
                            }}>
                            {openingPortal ? (
                              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Åpner Stripe...</>
                            ) : (
                              "Administrer & avbryt i Stripe"
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {stripeSubscription && stripeSubscription !== "loading" && (
                  <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                    <div className="px-6 py-4 border-b border-[#d8d3c5]">
                      <h2 className="text-base font-semibold text-[#171717]">Fakturahistorikk</h2>
                    </div>
                    <div className="px-6 py-4 text-sm text-[#6b6660] flex items-center justify-between">
                      <p>Fakturahistorikk og nedlasting av kvitteringer utføres kryptert hos Stripe.</p>
                      <Button variant="secondary" size="sm" onClick={async () => {
                        setOpeningPortal(true);
                        const res = await fetch("/api/stripe/portal", { method: "POST" });
                        const data = await res.json();
                        if (data.url) window.location.href = data.url;
                        setOpeningPortal(false);
                      }}>
                        Vis fakturaer i Stripe <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Varsler ── */}
            {activeTab === "varsler" && <NotifSettingsTab />}

            {/* ── Pipeline ── */}
            {activeTab === "pipeline" && (
              <PipelineTab stages={pipelineStages} onSave={setPipelineStages} />
            )}

            {/* ── Sikkerhet ── */}
            {activeTab === "sikkerhet" && (
              <div className="space-y-6">
                <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <h2 className="text-base font-semibold text-[#171717] mb-6">Endre passord</h2>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Nåværende passord</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Nytt passord</label>
                      <Input type="password" placeholder="Minst 8 tegn" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Bekreft nytt passord</label>
                      <Input type="password" placeholder="Gjenta nytt passord" />
                    </div>
                    <Button variant="primary" size="md">Oppdater passord</Button>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-base font-semibold text-red-800 mb-2">Slett konto</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Sletting av kontoen er permanent og kan ikke angres. Alle data slettes umiddelbart.
                  </p>
                  <Button variant="danger" size="md">Slett konto</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
