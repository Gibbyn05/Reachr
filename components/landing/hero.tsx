"use client";
import Link from "next/link";
import { ArrowRight, MapPin, Users, TrendingUp, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { WordRotate } from "@/components/ui/word-rotate";

const industries = [
  "rørleggere",
  "elektrikere",
  "byggfirmaer",
  "regnskapsbyråer",
  "IT-selskaper",
  "renholdsbyråer",
  "advokater",
  "eiendomsmeglere",
];

const leadCards = [
  { name: "Bjørnstad & Sønner AS", industry: "Rørlegger", city: "Oslo", employees: 12, revenue: "8,2 mill", status: "Ikke kontaktet", statusColor: "#e8e4d8", statusText: "#6b6660" },
  { name: "Nordic Print Solutions", industry: "Trykk & Design", city: "Bergen", employees: 7, revenue: "4,5 mill", status: "Kontaktet", statusColor: "#09fe94", statusText: "#065c3a" },
  { name: "Vestland Elektro AS", industry: "Elektriker", city: "Stavanger", employees: 24, revenue: "18,1 mill", status: "Booket møte", statusColor: "#ffad0a", statusText: "#7a4f00" },
  { name: "Hav & Kyst Reklame", industry: "Reklame", city: "Tromsø", employees: 5, revenue: "2,9 mill", status: "Ikke kontaktet", statusColor: "#e8e4d8", statusText: "#6b6660" },
  { name: "Kjeldsberg Bygg AS", industry: "Bygg & Anlegg", city: "Trondheim", employees: 38, revenue: "42,0 mill", status: "Kunde", statusColor: "#171717", statusText: "#09fe94" },
  { name: "Norsk Logistikk Drift", industry: "Transport", city: "Drammen", employees: 19, revenue: "11,3 mill", status: "Kontaktet", statusColor: "#09fe94", statusText: "#065c3a" },
  { name: "Fjord Tech Solutions", industry: "IT & Software", city: "Ålesund", employees: 11, revenue: "6,8 mill", status: "Booket møte", statusColor: "#ffad0a", statusText: "#7a4f00" },
  { name: "Bakke & Lund Advokater", industry: "Juridisk", city: "Oslo", employees: 8, revenue: "9,4 mill", status: "Ikke kontaktet", statusColor: "#e8e4d8", statusText: "#6b6660" },
  { name: "Polaris Renhold AS", industry: "Renhold", city: "Bodø", employees: 31, revenue: "14,7 mill", status: "Kunde", statusColor: "#171717", statusText: "#09fe94" },
  { name: "Sunnfjord Catering", industry: "Mat & Drikke", city: "Florø", employees: 6, revenue: "3,1 mill", status: "Avslått", statusColor: "#ff470a", statusText: "#fff" },
];

function LeadCard({ card }: { card: typeof leadCards[0] }) {
  return (
    <div className="mx-3 w-[260px] shrink-0 rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#e8e4d8] flex items-center justify-center shrink-0">
            <Building2 size={16} className="text-[#6b6660]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#171717] leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{card.name}</p>
            <p className="text-[10px] text-[#a09b8f] mt-0.5">{card.industry}</p>
          </div>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
          style={{ backgroundColor: card.statusColor, color: card.statusText }}
        >
          {card.status}
        </span>
      </div>
      <div className="flex items-center gap-4 text-[10px] text-[#6b6660]">
        <span className="flex items-center gap-1"><MapPin size={9} />{card.city}</span>
        <span className="flex items-center gap-1"><Users size={9} />{card.employees} ans.</span>
        <span className="flex items-center gap-1"><TrendingUp size={9} />{card.revenue}</span>
      </div>
    </div>
  );
}

export function Hero() {
  const doubled = [...leadCards, ...leadCards];

  return (
    <section className="bg-[#f2efe3] pt-32 pb-0 overflow-hidden">
      {/* Headline block */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto max-w-4xl px-6 mb-12"
      >
        {/* Native.no-style editorial headline */}
        <h1
          className="text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.01em] text-[#171717]"
          style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
        >
          {/* Line 1 – upright serif */}
          <span className="block font-[700]">Finn kunder</span>

          {/* Line 2 – italic "for" + rotating word in accent + underline + cursor */}
          <span className="flex items-center gap-0 flex-nowrap">
            <span className="italic font-[500] text-[#171717] mr-3">for</span>
            <span
              className="border-b-2 border-[#ff470a] pb-0"
              style={{ borderColor: "#ff470a" }}
            >
              <WordRotate
                words={industries}
                duration={2000}
                className="italic font-[600] text-[#ff470a]"
              />
            </span>
            {/* blinking cursor */}
            <motion.span
              className="inline-block w-[2px] ml-1.5 rounded-sm bg-[#ff470a]"
              style={{ height: "0.8em", verticalAlign: "middle", marginBottom: "0.05em" }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear", times: [0, 0.49, 0.5] }}
            />
          </span>
        </h1>

        {/* Sub-text */}
        <p
          className="mt-6 text-[1.1rem] text-[#6b6660] max-w-md leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Søk i 250 000+ norske bedrifter. Legg dem i pipeline.
          La Reachr minne deg på oppfølging.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-4 mt-9">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-[#09fe94] px-7 py-3.5 text-sm font-bold text-[#171717] shadow-[0_4px_20px_rgba(9,254,148,0.35)] transition-all duration-200 hover:bg-[#00e882] hover:-translate-y-0.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Start gratis i dag <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-[#6b6660] hover:text-[#171717] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Logg inn →
          </Link>
        </div>
        <p className="mt-4 text-xs text-[#a09b8f]" style={{ fontFamily: "'Inter', sans-serif" }}>
          3 dagers gratis prøveperiode · Ingen kredittkort
        </p>
      </motion.div>

      {/* Scrolling marquee – lead cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative w-full pb-14"
      >
        <div className="pointer-events-none absolute left-0 top-0 h-full w-28 z-10 bg-gradient-to-r from-[#f2efe3] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-28 z-10 bg-gradient-to-l from-[#f2efe3] to-transparent" />

        <motion.div
          className="flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ x: { duration: 40, ease: "linear", repeat: Infinity, repeatType: "loop" } }}
        >
          {doubled.map((card, i) => (
            <LeadCard key={i} card={card} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
