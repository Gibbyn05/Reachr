"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { WordRotate } from "@/components/ui/word-rotate";
import { useLanguage } from "@/lib/i18n/language-context";
import { SlidesConceptOne } from "./slides-concept-1";
import { SlidesConceptTwo } from "./slides-concept-2";
import { SlidesConceptThree } from "./slides-concept-3";
import { SlidesConceptFour } from "./slides-concept-4";
import { SlidesConceptFive } from "./slides-concept-5";

const industriesNo = [
  "rørleggere",
  "elektrikere",
  "byggfirmaer",
  "regnskapsbyråer",
  "IT-selskaper",
  "renholdsbyråer",
  "advokater",
  "eiendomsmeglere",
];

const industriesEn = [
  "plumbers",
  "electricians",
  "construction firms",
  "accounting firms",
  "IT companies",
  "cleaning services",
  "lawyers",
  "real estate agents",
];

const concepts = [
  {
    id: 1,
    name: "Dobbel-rad karusell",
    caption: "Se alle leads – alltid ett steg foran",
    theme: "light" as const,
    component: <SlidesConceptOne />,
  },
  {
    id: 2,
    name: "Mørk live-feed",
    caption: "Din salgspipeline — live og i bevegelse",
    theme: "dark" as const,
    component: <SlidesConceptTwo />,
  },
  {
    id: 3,
    name: "AI-meldingsgenerator",
    caption: "AI skriver — du sender — kunden svarer",
    theme: "light" as const,
    component: <SlidesConceptThree />,
  },
  {
    id: 4,
    name: "Bransje-explorer",
    caption: "250 000+ norske bedrifter — finn din neste kunde",
    theme: "light" as const,
    component: <SlidesConceptFour />,
  },
  {
    id: 5,
    name: "Mørk salgstall-scoreboard",
    caption: "Selgere på Reachr lukker 3× flere deals",
    theme: "dark" as const,
    component: <SlidesConceptFive />,
  },
];

export function Hero() {
  const { lang } = useLanguage();
  const industries = lang === "en" ? industriesEn : industriesNo;
  const [active, setActive] = useState(0);

  return (
    <section className="bg-[#f2efe3] pt-32 pb-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto max-w-4xl px-6 mb-12"
      >
        <h1
          className="text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.01em] text-[#171717]"
          style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
        >
          <span className="block font-[700]">
            {lang === "en" ? "Find customers" : "Finn kunder"}
          </span>

          <span className="flex items-center gap-0 flex-nowrap">
            <span className="italic font-[500] text-[#171717] mr-3">for</span>
            <span className="border-b-2 border-[#ff470a] pb-0" style={{ borderColor: "#ff470a" }}>
              <WordRotate
                key={lang}
                words={industries}
                duration={2000}
                className="italic font-[600] text-[#ff470a]"
              />
            </span>
            <motion.span
              className="inline-block w-[2px] ml-1.5 rounded-sm bg-[#ff470a]"
              style={{ height: "0.8em", verticalAlign: "middle", marginBottom: "0.05em" }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear", times: [0, 0.49, 0.5] }}
            />
          </span>
        </h1>

        <p
          className="mt-6 text-[1.1rem] text-[#6b6660] max-w-md leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {lang === "en"
            ? "Search 250,000+ Norwegian companies. Add them to your pipeline. Let Reachr remind you to follow up."
            : "Søk i 250 000+ norske bedrifter. Legg dem i pipeline. La Reachr minne deg på oppfølging."}
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-9">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-[#09fe94] px-7 py-3.5 text-sm font-bold text-[#171717] shadow-[0_4px_20px_rgba(9,254,148,0.35)] transition-all duration-200 hover:bg-[#00e882] hover:-translate-y-0.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {lang === "en" ? "Start for free today" : "Start gratis i dag"} <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-[#6b6660] hover:text-[#171717] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {lang === "en" ? "Log in →" : "Logg inn →"}
          </Link>
        </div>
        <p className="mt-4 text-xs text-[#a09b8f]" style={{ fontFamily: "'Inter', sans-serif" }}>
          {lang === "en"
            ? "3-day free trial · No credit card required"
            : "3 dagers gratis prøveperiode · Ingen kredittkort"}
        </p>
      </motion.div>

      {/* ── Slideshow-konsept-velger ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full pb-16"
      >
        {/* Tab-velger */}
        <div className="mx-auto max-w-4xl px-6 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {concepts.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActive(i)}
                className="shrink-0 rounded-full px-4 py-1.5 text-[11px] font-semibold transition-all duration-200 border"
                style={{
                  backgroundColor: active === i ? "#171717" : "#faf8f2",
                  color: active === i ? "#09fe94" : "#6b6660",
                  borderColor: active === i ? "#171717" : "#d8d3c5",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {c.id}. {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Caption */}
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mx-auto max-w-4xl px-6 mb-5 text-[13px] text-[#6b6660] italic"
            style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
          >
            "{concepts[active].caption}"
          </motion.p>
        </AnimatePresence>

        {/* Slideshow */}
        <div
          className="mx-auto max-w-4xl px-6"
          style={{
            // Mørke konsepter (2 og 5) vises på mørk bakgrunn, lyse på krem
            paddingTop: concepts[active].theme === "dark" ? 0 : 0,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {concepts[active].component}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
