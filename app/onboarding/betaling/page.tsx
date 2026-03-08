"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, CreditCard, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatCardNumber(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

export default function BetalingPage() {
  const [form, setForm] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 1200));
    window.location.href = "/onboarding";
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card number */}
          <div>
            <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">Kortnummer</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <CreditCard className="w-4 h-4 text-[#a09b8f]" />
              </div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={form.cardNumber}
                onChange={(e) => setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })}
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#faf8f2] border border-[#d8d3c5] rounded-lg focus:outline-none focus:border-[#09fe94] text-[#171717] placeholder:text-[#a09b8f] transition-colors"
              />
            </div>
          </div>

          {/* Expiry + CVC */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">Utløpsdato</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/ÅÅ"
                value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                required
                className="w-full px-3 py-2.5 text-sm bg-[#faf8f2] border border-[#d8d3c5] rounded-lg focus:outline-none focus:border-[#09fe94] text-[#171717] placeholder:text-[#a09b8f] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">CVC</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="123"
                maxLength={4}
                value={form.cvc}
                onChange={(e) => setForm({ ...form, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                required
                className="w-full px-3 py-2.5 text-sm bg-[#faf8f2] border border-[#d8d3c5] rounded-lg focus:outline-none focus:border-[#09fe94] text-[#171717] placeholder:text-[#a09b8f] transition-colors"
              />
            </div>
          </div>

          {/* Cardholder name */}
          <div>
            <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">Navn på kortet</label>
            <input
              type="text"
              placeholder="Ola Nordmann"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-2.5 text-sm bg-[#faf8f2] border border-[#d8d3c5] rounded-lg focus:outline-none focus:border-[#09fe94] text-[#171717] placeholder:text-[#a09b8f] transition-colors"
            />
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 py-2">
            <Shield className="w-4 h-4 text-[#a09b8f] shrink-0" />
            <p className="text-xs text-[#a09b8f]">Kortinformasjonen din krypteres og lagres sikkert</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <Link href="/register" className="flex-1">
              <Button type="button" variant="secondary" size="lg" className="w-full justify-center">
                Tilbake
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="lg" className="flex-1 justify-center" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Behandler...
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
        </form>

        <p className="text-center text-xs text-[#a09b8f] mt-6">
          Du belastes ikke før prøveperioden er over. Avslutt gratis innen 3 dager.
        </p>
      </div>
    </div>
  );
}
