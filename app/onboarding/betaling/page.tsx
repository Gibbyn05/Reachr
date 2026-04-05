"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Check, Shield, Users, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    id: "solo",
    name: "Solo",
    monthlyPrice: 249,
    yearlyMonthly: 199,
    yearlyTotal: 2388,
    description: "For deg som selger alene",
    icon: User,
    features: [
      "Ubegrenset leadsøk",
      "AI-genererte e-poster og SMS",
      "CRM-pipeline med oppfølgingsvarsler",
    ],
  },
  {
    id: "team",
    name: "Team",
    monthlyPrice: 499,
    yearlyMonthly: 399,
    yearlyTotal: 4788,
    description: "Per bruker — 2–5 brukere",
    icon: Users,
    features: [
      "Alt i Solo",
      "Team-invitasjoner (opptil 5)",
      "Delt pipeline og leads",
    ],
  },
] as const;

export default function BetalingPage() {
  const [selected, setSelected] = useState<"solo" | "team">("solo");
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManageExisting = async () => {
    setPortalLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError("Kunne ikke åpne administrasjonspanelet. Kontakt oss på Help@reachr.no");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Noe gikk galt. Kontakt oss på Help@reachr.no");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected, interval }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Kunne ikke starte betaling. Prøv igjen.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Noe gikk galt. Sjekk internettforbindelsen og prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = PLANS.find(p => p.id === selected)!;

  return (
    <div className="w-full max-w-lg">
      {/* Progress */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#09fe94] flex items-center justify-center">
            <Check className="w-4 h-4 text-[#171717]" />
          </div>
          <span className="text-sm font-medium text-[#a09b8f]">Konto</span>
        </div>
        <div className="w-8 h-px bg-[#d8d3c5]" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#171717] flex items-center justify-center text-white text-sm font-semibold">2</div>
          <span className="text-sm font-medium text-[#171717]">Betaling</span>
        </div>
        <div className="w-8 h-px bg-[#d8d3c5]" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#e8e4d8] flex items-center justify-center text-[#a09b8f] text-sm font-semibold">3</div>
          <span className="text-sm font-medium text-[#a09b8f]">Oppsett</span>
        </div>
      </div>

      <div className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#171717] mb-2">Velg din plan</h1>
          <p className="text-[#6b6660] text-sm">3 dager gratis — ingen binding, avslutt når som helst</p>
        </div>

        {/* Interval toggle */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center bg-[#ede9da] rounded-full p-1 gap-1">
            <button
              onClick={() => setInterval("monthly")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                interval === "monthly"
                  ? "bg-[#faf8f2] text-[#171717] shadow-sm"
                  : "text-[#6b6660] hover:text-[#171717]"
              }`}
            >
              Månedlig
            </button>
            <button
              onClick={() => setInterval("yearly")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                interval === "yearly"
                  ? "bg-[#faf8f2] text-[#171717] shadow-sm"
                  : "text-[#6b6660] hover:text-[#171717]"
              }`}
            >
              Årlig
              <span className="bg-[#09fe94] text-[#171717] text-xs font-bold px-1.5 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plan selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selected === plan.id;
            const price = interval === "yearly" ? plan.yearlyMonthly : plan.monthlyPrice;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-[#09fe94] bg-[#09fe94]/8"
                    : "border-[#d8d3c5] bg-[#f2efe3] hover:border-[#a09b8f]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-[#171717]" : "text-[#6b6660]"}`} />
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-[#09fe94] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-[#171717]" />
                    </div>
                  )}
                </div>
                <p className={`text-sm font-bold mb-0.5 ${isSelected ? "text-[#171717]" : "text-[#3d3a34]"}`}>
                  {plan.name}
                </p>
                <p className={`text-xs mb-2 ${isSelected ? "text-[#6b6660]" : "text-[#a09b8f]"}`}>
                  {plan.description}
                </p>
                <p className={`text-lg font-extrabold ${isSelected ? "text-[#171717]" : "text-[#3d3a34]"}`}>
                  {price} kr
                  <span className="text-xs font-normal text-[#a09b8f]">/mnd</span>
                </p>
                {interval === "yearly" && (
                  <p className="text-xs text-[#6b6660] mt-0.5">
                    {plan.yearlyTotal} kr/år
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-5">
          {selectedPlan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm text-[#3d3a34]">
              <div className="w-4 h-4 rounded-full bg-[#09fe94]/20 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-[#171717]" />
              </div>
              {feature}
            </li>
          ))}
        </ul>

        {interval === "yearly" && (
          <div className="mb-4 rounded-lg bg-[#09fe94]/10 border border-[#09fe94]/30 px-4 py-2.5 text-sm text-[#171717]">
            Du sparer <strong>{(selectedPlan.monthlyPrice - selectedPlan.yearlyMonthly) * 12} kr</strong> i året med årlig fakturering
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-[#ff470a]/8 border border-[#ff470a]/20 px-4 py-3 text-sm text-[#ff470a]">
            {error}
          </div>
        )}

        {/* Security note */}
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-[#a09b8f] shrink-0" />
          <p className="text-xs text-[#a09b8f]">Sikker betaling via Stripe — kortdata lagres aldri på våre servere</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Link href="/login" className="flex-1">
            <Button type="button" variant="secondary" size="lg" className="w-full justify-center">
              Tilbake
            </Button>
          </Link>
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="flex-1 justify-center"
            disabled={loading}
            onClick={handleStart}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Kobler til Stripe...
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Start prøveperiode
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        <p className="text-center text-xs text-[#a09b8f] mt-6">
          Du belastes ikke før prøveperioden er over. Avslutt gratis innen 3 dager.
        </p>
      </div>

      {/* Existing subscription management */}
      <div className="mt-6 text-center space-y-3">
        <button
          onClick={handleManageExisting}
          disabled={portalLoading}
          className="flex items-center gap-2 text-sm text-[#6b6660] hover:text-[#171717] transition-colors mx-auto"
        >
          <Settings className="w-4 h-4" />
          {portalLoading ? "Åpner administrasjonspanel..." : "Administrer eller avslutt eksisterende abonnement"}
        </button>
        <p className="text-xs text-[#a09b8f]">
          Spørsmål? Ta kontakt på{" "}
          <a href="mailto:Help@reachr.no" className="text-[#ff470a] hover:underline">
            Help@reachr.no
          </a>
        </p>
      </div>
    </div>
  );
}
