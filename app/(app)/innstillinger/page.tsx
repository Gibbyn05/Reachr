"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/app-store";
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
} from "lucide-react";

const tabs = [
  { id: "profil", label: "Min profil", icon: User },
  { id: "team", label: "Team", icon: Users },
  { id: "fakturering", label: "Fakturering", icon: CreditCard },
  { id: "varsler", label: "Varsler", icon: Bell },
  { id: "sikkerhet", label: "Sikkerhet", icon: Shield },
];

/* ── Notification toggle as its own component so hooks are legal ── */
function NotificationToggle({
  label,
  desc,
  defaultEnabled,
}: {
  label: string;
  desc: string;
  defaultEnabled: boolean;
}) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-all ${enabled ? "bg-green-500" : "bg-gray-200"}`}
      >
        <span
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
          style={{ transform: enabled ? "translateX(20px)" : "translateX(2px)", transition: "transform 0.2s" }}
        />
      </button>
    </div>
  );
}

const NOTIFICATION_ITEMS = [
  { label: "E-postvarsler for nye leads", desc: "Få e-post når et nytt lead legges til", defaultEnabled: true },
  { label: "Oppfølgingspåminnelser", desc: "Automatiske påminnelser etter 3 dager uten kontakt", defaultEnabled: true },
  { label: "Møtepåminnelser", desc: "Påminnelse 1 time før bookede møter", defaultEnabled: true },
  { label: "Ukentlig sammendrag", desc: "Ukentlig e-post med oversikt over pipeline", defaultEnabled: false },
  { label: "Teamaktivitet", desc: "Varsler når teammedlemmer oppdaterer leads", defaultEnabled: false },
];

export default function InnstillingerPage() {
  const { currentUser, setCurrentUser, leads, avatarUrl, setAvatarUrl, profilePhone, setProfilePhone } = useAppStore();
  const [activeTab, setActiveTab] = useState("profil");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [teamMembers, setTeamMembers] = useState<{ member_email: string; member_name: string; status: string }[]>([]);
  const [teamRole, setTeamRole] = useState<"owner" | "member">("owner");

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

  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name ?? "Ola Nordmann",
    email: currentUser?.email ?? "ola@bedrift.no",
    phone: profilePhone || "+47 22 11 22 33",
    company: currentUser?.company ?? "Demo Bedrift AS",
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleProfileSave = () => {
    setCurrentUser({
      name: profileForm.name,
      email: profileForm.email,
      company: profileForm.company,
    });
    setProfilePhone(profileForm.phone);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
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
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[480px] max-w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Velg plan</h2>
            <p className="text-sm text-gray-500 mb-6">Velg planen som passer din bedrift.</p>
            <div className="space-y-3">
              {[
                { name: "Starter", price: "99 kr/mnd", desc: "1 bruker · 50 leads · Leadsøk" },
                { name: "Pro", price: "199 kr/mnd", desc: "5 brukere · Ubegrenset leads · Alt i Starter + e-postintegrasjon", current: true },
                { name: "Team", price: "499 kr/mnd", desc: "15 brukere · Prioritert support · Alt i Pro + API-tilgang" },
              ].map((plan) => (
                <div key={plan.name} className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${plan.current ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{plan.name}{plan.current && <span className="ml-2 text-xs text-green-600 font-medium">(Aktiv)</span>}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{plan.desc}</p>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{plan.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowPlanModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Avbryt</button>
              <button onClick={() => { alert("Kontakt salg@reachr.no for å endre plan."); setShowPlanModal(false); }} className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600">Kontakt oss</button>
            </div>
          </div>
        </div>
      )}

      <div className="p-8">
        <div className="flex gap-8">
          {/* Sidebar tabs */}
          <div className="w-52 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    activeTab === id
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* ── Profil ── */}
            {activeTab === "profil" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <h2 className="text-base font-semibold text-slate-900 mb-6">Personlig informasjon</h2>

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
                        <div className="w-16 h-16 bg-[#0F1729] rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                          {initials}
                        </div>
                      )}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-gray-500" />
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
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG maks 2MB</p>
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
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefon</label>
                      <Input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Bedriftsnavn</label>
                      <Input
                        value={profileForm.company}
                        onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                        icon={<Building2 className="w-4 h-4" />}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-6">
                    {profileSaved && (
                      <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
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
                <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <h2 className="text-base font-semibold text-slate-900 mb-4">Inviter teammedlem</h2>
                  <form onSubmit={handleInvite} className="flex gap-3">
                    <Input
                      type="email"
                      placeholder="kollega@bedrift.no"
                      icon={<Mail className="w-4 h-4" />}
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="flex-1"
                      required
                    />
                    <Button type="submit" variant="primary" size="md" disabled={inviteSending}>
                      {inviteSending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Sender…</>
                      ) : inviteSent ? (
                        <><Check className="w-4 h-4" /> Sendt!</>
                      ) : (
                        <><Plus className="w-4 h-4" /> Inviter</>
                      )}
                    </Button>
                  </form>
                  {inviteError && (
                    <p className="text-xs text-red-500 mt-2">{inviteError}</p>
                  )}
                  {inviteSent && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Invitasjon sendt til {inviteEmail || "kollega"}!
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Invitasjonen er gyldig i 7 dager. Ny bruker legges til planen din automatisk.
                  </p>
                </div>
                )}

                {/* Team members */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-slate-900">Teammedlemmer ({1 + teamMembers.length})</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {/* Current user */}
                    <div className="flex items-center gap-4 px-6 py-4">
                      <div className="w-10 h-10 bg-[#0F1729] rounded-xl flex items-center justify-center text-white text-sm font-bold">
                        {initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">{profileForm.name}</p>
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
                        <p className="text-xs text-gray-400">{profileForm.email} · Deg</p>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                        {teamRole === "owner" ? "Admin" : "Medlem"}
                      </span>
                    </div>

                    {/* Invited/joined team members */}
                    {teamMembers.map((m) => {
                      const nameInitials = (m.member_name || m.member_email)
                        .split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
                      const isPending = m.status === "pending";
                      return (
                        <div key={m.member_email} className="flex items-center gap-4 px-6 py-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold ${isPending ? "bg-gray-300" : "bg-[#2563EB]"}`}>
                            {isPending ? <Mail className="w-4 h-4" /> : nameInitials}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">
                              {m.member_name || m.member_email}
                            </p>
                            <p className="text-xs text-gray-400">{m.member_email}</p>
                          </div>
                          <span className={`text-xs px-3 py-1.5 rounded-lg border ${isPending ? "text-yellow-700 bg-yellow-50 border-yellow-200" : "text-green-700 bg-green-50 border-green-200"}`}>
                            {isPending ? "Invitert" : "Aktiv"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      Inviter kolleger via skjemaet over for å gi dem tilgang til Reachr.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Fakturering ── */}
            {activeTab === "fakturering" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <h2 className="text-base font-semibold text-slate-900 mb-6">Nåværende plan</h2>
                  <div className="bg-gradient-to-r from-[#0F1729] to-[#1E3A5F] rounded-xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-white/60 text-sm">Aktiv plan</p>
                        <p className="text-2xl font-bold">Pro-plan</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-sm">Månedlig kostnad</p>
                        <p className="text-2xl font-bold">199 kr</p>
                        <p className="text-white/60 text-xs">per bruker</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <p className="text-white/60 text-sm">Neste faktura: 1. april 2026</p>
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Aktiv</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="border border-gray-200 rounded-xl p-4">
                      <p className="text-sm font-semibold text-slate-900 mb-1">Brukere</p>
                      <p className="text-2xl font-extrabold text-[#0F1729]">1 / 5</p>
                      <p className="text-xs text-gray-400">Maks 5 på Pro-planen</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button variant="secondary" size="md" onClick={() => setShowPlanModal(true)}>Endre plan</Button>
                    <Button variant="ghost" size="md" className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => { if (confirm("Er du sikker på at du vil avbestille abonnementet?")) alert("Abonnement avbestilt. Du beholder tilgang til slutten av perioden."); }}>
                      Avbestill abonnement
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-slate-900">Fakturahistorikk</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {[
                      { date: "1. mar 2026", amount: "199 kr", status: "Betalt" },
                      { date: "1. feb 2026", amount: "199 kr", status: "Betalt" },
                      { date: "1. jan 2026", amount: "199 kr", status: "Betalt" },
                    ].map((invoice, i) => (
                      <div key={i} className="flex items-center justify-between px-6 py-3.5">
                        <p className="text-sm text-gray-600">{invoice.date}</p>
                        <p className="text-sm font-semibold text-slate-900">{invoice.amount}</p>
                        <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                          {invoice.status}
                        </span>
                        <button
                          className="text-sm text-green-600 hover:underline font-medium"
                          onClick={() => handleInvoiceDownload(invoice.date, invoice.amount)}
                        >
                          Last ned
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Varsler ── */}
            {activeTab === "varsler" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <h2 className="text-base font-semibold text-slate-900 mb-6">Varslingsinnstillinger</h2>
                <div className="space-y-1">
                  {NOTIFICATION_ITEMS.map((item) => (
                    <NotificationToggle key={item.label} {...item} />
                  ))}
                </div>
                <Button variant="primary" size="md" className="mt-6">Lagre innstillinger</Button>
              </div>
            )}

            {/* ── Sikkerhet ── */}
            {activeTab === "sikkerhet" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <h2 className="text-base font-semibold text-slate-900 mb-6">Endre passord</h2>
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
