"use client";
import { Search, Users, Bell, Map, Zap, BarChart3 } from "lucide-react";

const bentoItems = [
  {
    span: "lg:col-span-2",
    icon: Search,
    accent: "#09fe94",
    title: "Leadsøk i Brønnøysundregistrene",
    description: "Søk blant 250 000+ norske bedrifter etter bransje, sted, omsetning og antall ansatte. Finn de riktige kundene – ikke bare de nærliggende.",
  },
  {
    span: "lg:col-span-1",
    icon: Map,
    accent: "#ff470a",
    title: "Kartvisning",
    description: "Se alle treff som punkter på kart. Perfekt for feltsalg og regionsbasert prospektering.",
  },
  {
    span: "lg:col-span-1",
    icon: Users,
    accent: "#ffad0a",
    title: "CRM-pipeline",
    description: "6 statusnivåer med farger. Tildel leads til teammedlemmer og legg til notater og historikk.",
  },
  {
    span: "lg:col-span-1",
    icon: Bell,
    accent: "#09fe94",
    title: "Automatiske varsler",
    description: "Reachr minner deg på oppfølging basert på siste aktivitet. Aldri la et lead bli glemt.",
  },
  {
    span: "lg:col-span-1",
    icon: Zap,
    accent: "#ff470a",
    title: "AI-genererte e-poster",
    description: "La AI skrive salgse-poster tilpasset hver bedrift, basert på din salgspitch.",
  },
  {
    span: "lg:col-span-1",
    icon: BarChart3,
    accent: "#ffad0a",
    title: "Statistikk og oversikt",
    description: "Dashboard med antall leads, bookede møter, konverteringsrate og teamstatistikk.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-[#f2efe3] py-28 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a09b8f] mb-4">
            Funksjoner
          </p>
          <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-tight tracking-tight text-[#171717]">
            Alt du trenger
            <br />
            for B2B-salg.
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {bentoItems.map(({ span, icon: Icon, accent, title, description }) => (
            <div
              key={title}
              className={`${span} rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: accent + "18" }}
              >
                <Icon
                  size={20}
                  style={{ color: accent, filter: accent === "#09fe94" ? "brightness(0.65)" : "none" }}
                />
              </div>
              <h3 className="text-lg font-extrabold text-[#171717] mb-2">{title}</h3>
              <p className="text-sm text-[#6b6660] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#d8d3c5] rounded-2xl overflow-hidden">
          {[
            { value: "250 000+", label: "Norske bedrifter" },
            { value: "3 dager", label: "Gratis prøveperiode" },
            { value: "500+", label: "Aktive brukere" },
            { value: "98%", label: "Fornøyde kunder" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-[#faf8f2] px-8 py-8 text-center">
              <p className="text-3xl font-extrabold text-[#171717]">{value}</p>
              <p className="mt-1 text-xs text-[#a09b8f]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
