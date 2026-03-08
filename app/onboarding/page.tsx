"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const userCountOptions = [
  { value: "1", label: "1 bruker", price: "249 kr/mnd" },
  { value: "2-5", label: "2–5 brukere", price: "199 kr/bruker/mnd" },
  { value: "6-10", label: "6–10 brukere", price: "169 kr/bruker/mnd" },
  { value: "10+", label: "10+ brukere", price: "Kontakt oss" },
];

export default function OnboardingPage() {
  const [company, setCompany] = useState("");
  const [userCount, setUserCount] = useState("1");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { company, user_count: userCount },
      });
      window.location.href = "/dashboard";
    } catch {
      window.location.href = "/dashboard";
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
          <div className="w-8 h-8 rounded-full bg-[#09fe94] flex items-center justify-center">
            <Check className="w-4 h-4 text-[#171717]" />
          </div>
          <span className="text-sm font-medium text-[#a09b8f]">Betaling</span>
        </div>
        <div className="w-8 h-px bg-[#d8d3c5]" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#171717] flex items-center justify-center text-white text-sm font-semibold">3</div>
          <span className="text-sm font-medium text-[#171717]">Oppsett</span>
        </div>
      </div>

      <div className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#171717] mb-2">Sett opp bedriften din</h1>
          <p className="text-[#6b6660] text-sm">Velg plan basert på antall brukere</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Company name */}
          <div>
            <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">Bedriftsnavn</label>
            <Input
              type="text"
              placeholder="Bedrift AS"
              icon={<Building2 className="w-4 h-4" />}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          {/* User count grid */}
          <div>
            <label className="block text-sm font-medium text-[#3d3a34] mb-3">Antall brukere</label>
            <div className="grid grid-cols-2 gap-3">
              {userCountOptions.map((opt) => {
                const isSelected = userCount === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setUserCount(opt.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-[#09fe94] bg-[#09fe94]/8"
                        : "border-[#d8d3c5] hover:border-[#a09b8f]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Users className={`w-4 h-4 ${isSelected ? "text-[#05c472]" : "text-[#a09b8f]"}`} />
                      <span className="text-sm font-semibold text-[#3d3a34]">{opt.label}</span>
                    </div>
                    <span className={`text-xs ${isSelected ? "text-[#05c472]" : "text-[#a09b8f]"}`}>
                      {opt.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trial banner */}
          <div className="bg-[#09fe94]/8 border border-[#09fe94]/30 rounded-xl p-4 flex items-start gap-3">
            <div className="w-5 h-5 bg-[#09fe94] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-[#171717]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#171717]">3 dager gratis prøveperiode</p>
              <p className="text-xs text-[#3d3a34] mt-0.5">Ingen kredittkort nødvendig. Du kan avbestille når som helst.</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <Link href="/onboarding/betaling" className="flex-1">
              <Button type="button" variant="secondary" size="lg" className="w-full justify-center">
                Tilbake
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="lg" className="flex-1 justify-center" disabled={loading}>
              {loading ? "Lagrer..." : "Neste"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
