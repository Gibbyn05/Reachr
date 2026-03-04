"use client";
import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Users,
  CreditCard,
  Bell,
  Shield,
  Plus,
  Trash2,
  Check,
  Crown,
  Mail,
  Building2,
} from "lucide-react";

const tabs = [
  { id: "profil", label: "Min profil", icon: User },
  { id: "team", label: "Team", icon: Users },
  { id: "fakturering", label: "Fakturering", icon: CreditCard },
  { id: "varsler", label: "Varsler", icon: Bell },
  { id: "sikkerhet", label: "Sikkerhet", icon: Shield },
];

const teamMembers = [
  { id: "1", name: "Ola Nordmann", email: "ola@bedrift.no", role: "Admin", avatar: "ON", joined: "Jan 2024" },
  { id: "2", name: "Kari Hansen", email: "kari@bedrift.no", role: "Bruker", avatar: "KH", joined: "Jan 2024" },
  { id: "3", name: "Per Olsen", email: "per@bedrift.no", role: "Bruker", avatar: "PO", joined: "Feb 2024" },
];

export default function InnstillingerPage() {
  const [activeTab, setActiveTab] = useState("profil");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "Ola Nordmann",
    email: "ola@bedrift.no",
    phone: "+47 22 11 22 33",
    company: "Demo Bedrift AS",
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 3000);
    setInviteEmail("");
  };

  return (
    <div>
      <TopBar title="Innstillinger" />

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
            {activeTab === "profil" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <h2 className="text-base font-semibold text-slate-900 mb-6">Personlig informasjon</h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-[#0F1729] rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                      ON
                    </div>
                    <div>
                      <Button variant="secondary" size="sm">Endre profilbilde</Button>
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

                  <div className="flex justify-end mt-6">
                    <Button variant="primary" size="md">Lagre endringer</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-6">
                {/* Invite */}
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
                    <Button type="submit" variant="primary" size="md">
                      {inviteSent ? (
                        <>
                          <Check className="w-4 h-4" />
                          Sendt!
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Inviter
                        </>
                      )}
                    </Button>
                  </form>
                  <p className="text-xs text-gray-400 mt-2">
                    Invitasjonen er gyldig i 7 dager. Ny bruker legges til planen din automatisk.
                  </p>
                </div>

                {/* Team members */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-slate-900">
                      Teammedlemmer ({teamMembers.length})
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-4 px-6 py-4">
                        <div className="w-10 h-10 bg-[#0F1729] rounded-xl flex items-center justify-center text-white text-sm font-bold">
                          {member.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                            {member.role === "Admin" && (
                              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                                <Crown className="w-2.5 h-2.5" />
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{member.email} · Ble med {member.joined}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 bg-white focus:outline-none">
                            <option>Admin</option>
                            <option selected={member.role === "Bruker"}>Bruker</option>
                          </select>
                          {member.role !== "Admin" && (
                            <button className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "fakturering" && (
              <div className="space-y-6">
                {/* Current plan */}
                <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <h2 className="text-base font-semibold text-slate-900 mb-6">Nåværende plan</h2>
                  <div className="bg-gradient-to-r from-[#0F1729] to-[#1E3A5F] rounded-xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-white/60 text-sm">Aktiv plan</p>
                        <p className="text-2xl font-bold">Team-plan</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-sm">Månedlig kostnad</p>
                        <p className="text-2xl font-bold">597 kr</p>
                        <p className="text-white/60 text-xs">3 brukere × 199 kr</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <p className="text-white/60 text-sm">Neste faktura: 1. februar 2024</p>
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Aktiv</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-xl p-4">
                      <p className="text-sm font-semibold text-slate-900 mb-1">Brukere</p>
                      <p className="text-2xl font-extrabold text-[#0F1729]">3 / 5</p>
                      <p className="text-xs text-gray-400">Maks 5 på Team-planen</p>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4">
                      <p className="text-sm font-semibold text-slate-900 mb-1">Lagrede leads</p>
                      <p className="text-2xl font-extrabold text-[#0F1729]">124 / ∞</p>
                      <p className="text-xs text-gray-400">Ubegrenset på Team-planen</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button variant="secondary" size="md">Endre plan</Button>
                    <Button variant="ghost" size="md" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      Avbestill abonnement
                    </Button>
                  </div>
                </div>

                {/* Invoice history */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-slate-900">Fakturahistorikk</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {[
                      { date: "1. jan 2024", amount: "597 kr", status: "Betalt" },
                      { date: "1. des 2023", amount: "597 kr", status: "Betalt" },
                      { date: "1. nov 2023", amount: "398 kr", status: "Betalt" },
                    ].map((invoice, i) => (
                      <div key={i} className="flex items-center justify-between px-6 py-3.5">
                        <p className="text-sm text-gray-600">{invoice.date}</p>
                        <p className="text-sm font-semibold text-slate-900">{invoice.amount}</p>
                        <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                          {invoice.status}
                        </span>
                        <button className="text-sm text-green-600 hover:underline font-medium">
                          Last ned
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "varsler" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <h2 className="text-base font-semibold text-slate-900 mb-6">Varslingsinnstillinger</h2>
                <div className="space-y-4">
                  {[
                    { label: "E-postvarsler for nye leads", desc: "Få e-post når et nytt lead legges til", enabled: true },
                    { label: "Oppfølgingspåminnelser", desc: "Automatiske påminnelser etter 3 dager uten kontakt", enabled: true },
                    { label: "Møtepåminnelser", desc: "Påminnelse 1 time før bookede møter", enabled: true },
                    { label: "Ukentlig sammendrag", desc: "Ukentlig e-post med oversikt over pipeline", enabled: false },
                    { label: "Teamaktivitet", desc: "Varsler når teammedlemmer oppdaterer leads", enabled: false },
                  ].map(({ label, desc, enabled: defaultEnabled }) => {
                    const [enabled, setEnabled] = useState(defaultEnabled);
                    return (
                      <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                        </div>
                        <button
                          onClick={() => setEnabled(!enabled)}
                          className={`relative w-11 h-6 rounded-full transition-all ${
                            enabled ? "bg-green-500" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                              enabled ? "translate-x-5.5 left-0.5" : "left-0.5"
                            }`}
                            style={{ transform: enabled ? "translateX(20px)" : "translateX(0)" }}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <Button variant="primary" size="md" className="mt-6">Lagre innstillinger</Button>
              </div>
            )}

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
