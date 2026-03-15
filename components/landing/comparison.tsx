"use client";
import { X, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

const traditionalProblemsNo = [
  "Du ringer kaldt uten noen kontekst",
  "Du sporer leads i Excel eller post-it-lapper",
  "Du mister oversikten over hvem som er kontaktet",
  "Du husker oppfølgingstidspunkter selv",
  "Timesvis brukt på manuell research",
  "Du vet ikke hvem i teamet som følger opp hva",
  "Ingen struktur = tapte avtaler",
];

const traditionalProblemsEn = [
  "You cold call without any context",
  "You track leads in Excel or sticky notes",
  "You lose track of who has been contacted",
  "You have to remember follow-up times yourself",
  "Hours spent on manual research",
  "You don't know who on the team is following up on what",
  "No structure = lost deals",
];

const reachrBenefitsNo = [
  "Finn riktige bedrifter med smarte filtre",
  "Strukturert pipeline med statussporing",
  "Alt samlet på ett sted – aldri miste et lead",
  "Automatiske varsler og påminnelser",
  "Søk i 250 000+ bedrifter på sekunder",
  "Teamdeling og tildeling av leads",
  "Klar struktur = flere lukkede avtaler",
];

const reachrBenefitsEn = [
  "Find the right companies with smart filters",
  "Structured pipeline with status tracking",
  "Everything in one place – never lose a lead",
  "Automatic alerts and reminders",
  "Search 250,000+ companies in seconds",
  "Team sharing and lead assignment",
  "Clear structure = more closed deals",
];

export function Comparison() {
  const { lang } = useLanguage();
  const traditionalProblems = lang === "en" ? traditionalProblemsEn : traditionalProblemsNo;
  const reachrBenefits = lang === "en" ? reachrBenefitsEn : reachrBenefitsNo;

  return (
    <section className="bg-[#171717] py-28 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-[#6b6660] mb-4">
            {lang === "en" ? "Reachr vs. traditional sales" : "Reachr vs. tradisjonelt salg"}
          </p>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.01em] text-white">
            {lang === "en" ? "Manual prospecting" : "Manuell prospektering"}
            <br />
            <span className="italic text-[#09fe94]" style={{ filter: "brightness(0.85)" }}>
              {lang === "en" ? "is a waste of time." : "er bortkastet tid."}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <p className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">
              {lang === "en" ? "Traditional sales" : "Tradisjonelt salg"}
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

          <div className="rounded-2xl border border-[#09fe94]/30 bg-[#09fe94]/5 p-8">
            <p className="text-sm font-bold text-[#09fe94] uppercase tracking-widest mb-6" style={{ filter: "brightness(0.8)" }}>
              {lang === "en" ? "With Reachr" : "Med Reachr"}
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
