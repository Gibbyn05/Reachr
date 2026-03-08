"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, User, Briefcase, Target, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [salesPitch, setSalesPitch] = useState("");
  const [targetCustomers, setTargetCustomers] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { company, role, salesPitch, targetCustomers },
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
          <p className="text-[#6b6660] text-sm">Litt info slik at AI-en kan hjelpe deg bedre</p>
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

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">Din rolle</label>
            <Input
              type="text"
              placeholder="f.eks. Daglig leder, Salgssjef"
              icon={<User className="w-4 h-4" />}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          {/* Sales pitch */}
          <div>
            <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">Hva selger dere?</label>
            <textarea
              placeholder="Kort beskrivelse av produktet/tjenesten din..."
              value={salesPitch}
              onChange={(e) => setSalesPitch(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-[#d8d3c5] bg-[#faf8f2] text-sm text-[#171717] placeholder:text-[#a09b8f] focus:outline-none focus:ring-2 focus:ring-[#09fe94] resize-none"
            />
            <p className="text-xs text-[#a09b8f] mt-1">Brukes av AI for å skrive salgsmails og SMS på dine vegne</p>
          </div>

          {/* Target customers */}
          <div>
            <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">Hvem er målkundene dine?</label>
            <Input
              type="text"
              placeholder="f.eks. Norske restauranter med 5–50 ansatte"
              icon={<Target className="w-4 h-4" />}
              value={targetCustomers}
              onChange={(e) => setTargetCustomers(e.target.value)}
            />
            <p className="text-xs text-[#a09b8f] mt-1">Hjelper AI-en å tilpasse innholdet riktig</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <Link href="/onboarding/betaling" className="flex-1">
              <Button type="button" variant="secondary" size="lg" className="w-full justify-center">
                Tilbake
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="lg" className="flex-1 justify-center" disabled={loading || !company}>
              {loading ? "Lagrer..." : "Kom i gang"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
