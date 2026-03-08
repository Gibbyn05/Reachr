"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Check, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BetalingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "solo", interval: "monthly" }),
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

  return (
    <div className="w-full max-w-md">
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#171717] mb-2">Start din prøveperiode</h1>
          <p className="text-[#6b6660] text-sm">3 dager gratis — ingen binding, avslutt når som helst</p>
        </div>

        {/* Plan summary */}
        <div className="bg-[#f2efe3] rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#171717]">Reachr Pro</p>
            <p className="text-xs text-[#6b6660] mt-0.5">3 dager gratis, deretter 249 kr/mnd</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-[#09fe94]">Gratis</p>
            <p className="text-xs text-[#a09b8f]">i dag</p>
          </div>
        </div>

        {/* What's included */}
        <ul className="space-y-2.5 mb-6">
          {[
            "Ubegrenset leadsøk i Brønnøysundregistrene",
            "AI-genererte e-poster og SMS",
            "CRM-pipeline med oppfølgingsvarsler",
            "Team-invitasjoner",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm text-[#3d3a34]">
              <div className="w-4 h-4 rounded-full bg-[#09fe94]/20 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-[#171717]" />
              </div>
              {feature}
            </li>
          ))}
        </ul>

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
          <Link href="/register" className="flex-1">
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
    </div>
  );
}
