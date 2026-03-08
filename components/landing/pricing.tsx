"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { useState } from "react";

const features = [
  "Ubegrenset leadsøk",
  "CRM-pipeline med 6 statusnivåer",
  "Automatiske oppfølgingsvarsler",
  "Kartvisning av bedrifter",
  "AI-genererte salgse-poster",
  "Teamsamarbeid og tildeling",
  "Brreg-data i sanntid",
  "Statistikk og dashboard",
];

const platforms = ["Facebook", "Instagram", "LinkedIn"];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  const soloPrice = yearly ? 199 : 249;
  const teamPrice = yearly ? 159 : 199;

  return (
    <section id="pricing" className="bg-[#ede9da] py-28 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a09b8f] mb-4">
            Priser
          </p>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.01em] text-[#171717]">
            Én pris.
            <br />
            <span className="italic text-[#ff470a]">Ubegrenset salg.</span>
          </h2>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => setYearly(false)}
            className={`text-sm font-semibold transition-colors ${!yearly ? "text-[#171717]" : "text-[#a09b8f]"}`}
          >
            Månedlig
          </button>
          <button
            onClick={() => setYearly(!yearly)}
            className="relative w-12 h-6 rounded-full bg-[#09fe94] transition-colors"
            style={{ backgroundColor: yearly ? "#09fe94" : "#d8d3c5" }}
          >
            <span
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
              style={{ left: yearly ? "28px" : "4px" }}
            />
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`text-sm font-semibold transition-colors ${yearly ? "text-[#171717]" : "text-[#a09b8f]"}`}
          >
            Årlig
            <span className="ml-1.5 text-xs font-bold text-[#05c472] bg-[#09fe94]/20 px-1.5 py-0.5 rounded-full">– 20%</span>
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Solo */}
          <div className="rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] p-8">
            <p className="text-xs font-bold text-[#a09b8f] uppercase tracking-widest mb-1">Solo</p>
            <p className="text-sm text-[#6b6660] mb-6">For deg som jobber alene med salg.</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-5xl font-extrabold text-[#171717] leading-none">{soloPrice}</span>
              <span className="text-lg text-[#a09b8f] mb-1">kr</span>
              <span className="text-xs text-[#a09b8f] mb-1.5">/mnd</span>
            </div>
            <Link
              href="/register"
              className="block text-center py-3 rounded-xl border border-[#d8d3c5] text-sm font-bold text-[#171717] hover:bg-[#e8e4d8] transition-colors mb-8"
            >
              Start gratis
            </Link>
            <ul className="flex flex-col gap-3">
              {features.slice(0, 5).map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#3d3a34]">
                  <Check size={14} className="text-[#05c472] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Team – popular */}
          <div className="relative rounded-2xl border-2 border-[#09fe94] bg-[#faf8f2] p-8 shadow-[0_8px_40px_rgba(9,254,148,0.15)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#09fe94] text-[#171717] text-xs font-extrabold px-4 py-1 rounded-full whitespace-nowrap">
              Mest populær
            </div>
            <p className="text-xs font-bold text-[#05c472] uppercase tracking-widest mb-1">Team</p>
            <p className="text-sm text-[#6b6660] mb-6">2–5 brukere. Perfekt for salgsteam.</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-5xl font-extrabold text-[#171717] leading-none">{teamPrice}</span>
              <span className="text-lg text-[#a09b8f] mb-1">kr</span>
              <span className="text-xs text-[#a09b8f] mb-1.5">/bruker/mnd</span>
            </div>
            <Link
              href="/register"
              className="block text-center py-3 rounded-xl bg-[#09fe94] text-sm font-bold text-[#171717] hover:bg-[#00e882] transition-colors mb-8 shadow-[0_4px_16px_rgba(9,254,148,0.3)]"
            >
              Start gratis
            </Link>
            <ul className="flex flex-col gap-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#3d3a34]">
                  <Check size={14} className="text-[#05c472] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Enterprise */}
          <div className="rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] p-8">
            <p className="text-xs font-bold text-[#a09b8f] uppercase tracking-widest mb-1">Enterprise</p>
            <p className="text-sm text-[#6b6660] mb-6">For store salgsavdelinger med egne behov.</p>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-3xl font-extrabold text-[#171717] leading-none">Pris etter avtale</span>
            </div>
            <Link
              href="#"
              className="block text-center py-3 rounded-xl border border-[#d8d3c5] text-sm font-bold text-[#171717] hover:bg-[#e8e4d8] transition-colors mb-8"
            >
              Kontakt oss
            </Link>
            <ul className="flex flex-col gap-3">
              {[...features, "Dedikert kundehåndterer", "API-tilgang", "SLA-garanti"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#3d3a34]">
                  <Check size={14} className="text-[#05c472] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-xs text-[#a09b8f] mt-8">
          Alle planer inkluderer 3 dagers gratis prøveperiode · Ingen kredittkort nødvendig · Kan avbestilles når som helst
        </p>
      </div>
    </section>
  );
}
