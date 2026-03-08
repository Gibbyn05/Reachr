"use client";
import { Search, Database, Bell } from "lucide-react";

const features = [
  {
    Icon: Search,
    iconBg: "bg-[#09fe94]/15",
    iconColor: "text-[#05c472]",
    title: "Leadsøk",
    description: "Søk i over 250 000 norske bedrifter etter bransje, sted og størrelse. Finn de riktige kundene med avanserte filtre.",
    highlights: ["Brreg-data i sanntid", "Kart- og listevisning", "Filtre for omsetning og ansatte"],
  },
  {
    Icon: Database,
    iconBg: "bg-[#ff470a]/10",
    iconColor: "text-[#ff470a]",
    title: "CRM-pipeline",
    description: "Hold styr på alle leads gjennom salgsprosessen. Fra første kontakt til signert avtale – samlet i ett system.",
    highlights: ["6 statusnivåer med farger", "Samarbeid i team", "Notater og historikk"],
  },
  {
    Icon: Bell,
    iconBg: "bg-[#ffad0a]/15",
    iconColor: "text-[#ffad0a]",
    title: "Automatiske varsler",
    description: "Reachr minner deg på når det er tid for oppfølging, basert på kommunikasjonshistorikken din.",
    highlights: ["Smarte påminnelser", "Oppfølgingsstatus", "Tilpassbare regler"],
  },
];

const stats = [
  { value: "250 000+", label: "Norske bedrifter" },
  { value: "3 dager", label: "Gratis prøveperiode" },
  { value: "500+", label: "Aktive brukere" },
  { value: "98%", label: "Fornøyde kunder" },
];

export function Features() {
  return (
    <section id="features" className="bg-[#f2efe3] py-24 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff470a]">
            Funksjoner
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717]">
            Alt du trenger for B2B-salg
          </h2>
          <p className="mt-4 text-base text-[#6b6660] leading-relaxed">
            Reachr kombinerer leadsøk, CRM og oppfølging i ett kraftig verktøy
            skreddersydd for norske bedrifter.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-3">
          {features.map(({ Icon, iconBg, iconColor, title, description, highlights }) => (
            <div
              key={title}
              className="group rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.07)]"
            >
              <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-[14px] ${iconBg}`}>
                <Icon size={22} className={iconColor} />
              </div>
              <h3 className="mb-3 text-lg font-bold text-[#171717]">{title}</h3>
              <p className="mb-6 text-sm text-[#6b6660] leading-relaxed">{description}</p>
              <ul className="flex flex-col gap-2.5">
                {highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2.5 text-sm text-[#3d3a34]">
                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#09fe94]" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl bg-[#171717] px-10 py-12 sm:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-extrabold text-[#09fe94]">{value}</p>
              <p className="mt-1.5 text-xs text-white/55">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
