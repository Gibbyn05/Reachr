"use client";
import { X, Check } from "lucide-react";

const traditionalProblems = [
  "Du ringer kaldt uten noen kontekst",
  "Du sporer leads i Excel eller post-it-lapper",
  "Du mister oversikten over hvem som er kontaktet",
  "Du husker oppfølgingstidspunkter selv",
  "Timesvis brukt på manuell research",
  "Du vet ikke hvem i teamet som følger opp hva",
  "Ingen struktur = tapte avtaler",
];

const reachrBenefits = [
  "Finn riktige bedrifter med smarte filtre",
  "Strukturert pipeline med statussporing",
  "Alt samlet på ett sted – aldri miste et lead",
  "Automatiske varsler og påminnelser",
  "Søk i 250 000+ bedrifter på sekunder",
  "Teamdeling og tildeling av leads",
  "Klar struktur = flere lukkede avtaler",
];

export function Comparison() {
  return (
    <section className="bg-[#171717] py-28 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-[#6b6660] mb-4">
            Reachr vs. tradisjonelt salg
          </p>
          <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-tight tracking-tight text-white">
            Manuell prospektering
            <br />
            <span className="text-[#09fe94]">er bortkastet tid.</span>
          </h2>
        </div>

        {/* Comparison grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Traditional column */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <p className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">
              Tradisjonelt salg
            </p>
            <ul className="flex flex-col gap-4">
              {traditionalProblems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#ff470a]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <X size={11} className="text-[#ff470a]" />
                  </div>
                  <span className="text-sm text-white/50 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reachr column */}
          <div className="rounded-2xl border border-[#09fe94]/30 bg-[#09fe94]/5 p-8">
            <p className="text-sm font-bold text-[#09fe94] uppercase tracking-widest mb-6" style={{ filter: "brightness(0.8)" }}>
              Med Reachr
            </p>
            <ul className="flex flex-col gap-4">
              {reachrBenefits.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#09fe94]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#09fe94]" style={{ filter: "brightness(0.7)" }} />
                  </div>
                  <span className="text-sm text-white/80 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
