"use client";
import { Search, Users, Bell, Map, Sparkles, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const featureItems = [
  {
    icon: Search,
    accent: "#09fe94",
    title: "Leadsøk i Brønnøysundregistrene",
    description: "Søk blant 250 000+ norske bedrifter etter bransje, sted, omsetning og antall ansatte. Reachr henter også kontaktpersoner og e-postadresser automatisk.",
  },
  {
    icon: Map,
    accent: "#ff470a",
    title: "Kartvisning",
    description: "Se alle treff som punkter på kart. Perfekt for feltsalg og regionsbasert prospektering.",
  },
  {
    icon: Users,
    accent: "#ffad0a",
    title: "CRM-pipeline",
    description: "6 statusnivåer med farger. Tildel leads til teammedlemmer, legg til notater og spor hele salgsprosessen.",
  },
  {
    icon: Sparkles,
    accent: "#09fe94",
    title: "AI-genererte e-poster og SMS",
    description: "Én klikk og AI skriver en personlig salgsmelding tilpasset hver bedrift — basert på din salgspitch og målgruppe. Send direkte fra Reachr via Gmail eller Outlook, eller kopier teksten og send selv.",
  },
  {
    icon: Bell,
    accent: "#ff470a",
    title: "Automatiske varsler og sekvenser",
    description: "Reachr minner deg på oppfølging basert på siste aktivitet. Sett opp e-postsekvenser som kjører automatisk – aldri la et lead bli glemt igjen.",
  },
  {
    icon: BarChart3,
    accent: "#ffad0a",
    title: "Statistikk og oversikt",
    description: "Dashboard med antall leads, bookede møter, konverteringsrate og teamstatistikk.",
  },
];

const gridContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section id="features" className="bg-[#f2efe3] py-28 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.01em] text-[#171717]">
            Alt du trenger
            <br />
            <span className="italic">for B2B-salg.</span>
          </h2>
        </motion.div>

        {/* Features list */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12"
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {featureItems.map(({ icon: Icon, accent, title, description }) => (
            <motion.div key={title} variants={gridItemVariants}>
              <h3 className="text-base font-extrabold text-[#171717] mb-2 flex items-center gap-2.5">
                <Icon
                  size={16}
                  style={{ color: accent, filter: accent === "#09fe94" ? "brightness(0.65)" : "none" }}
                  className="shrink-0"
                />
                {title}
              </h3>
              <p className="text-sm text-[#6b6660] leading-relaxed max-w-md">{description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats strip */}
        <motion.div
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#d8d3c5] rounded-2xl overflow-hidden max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          {[
            { value: "250 000+", label: "Norske bedrifter" },
            { value: "3 dager", label: "Gratis prøveperiode" },
            { value: "98%", label: "Fornøyde kunder" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-[#faf8f2] px-8 py-8 text-center">
              <p className="text-3xl font-extrabold text-[#171717]">{value}</p>
              <p className="mt-1 text-xs text-[#a09b8f]">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
