"use client";
import Link from "next/link";
import { ArrowRight, MapPin, Users, TrendingUp, Building2 } from "lucide-react";
import { motion } from "framer-motion";

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
            <p className="text-xs font-bold text-[#171717] leading-tight">{card.name}</p>
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
    <section className="bg-[#f2efe3] pt-28 pb-0 overflow-hidden">
      {/* Headline block */}
      <div className="mx-auto max-w-5xl px-6 text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-sm font-semibold text-[#6b6660] mb-6 tracking-wide uppercase">
            Norges B2B-verktøy for leadsøk og salg
          </p>
          <h1 className="text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[0.95] tracking-tight text-[#171717] mb-8">
            Finn kunder
            <br />
            <span className="text-[#ff470a]">på autopilot.</span>
          </h1>
          <p className="text-lg text-[#6b6660] max-w-lg mx-auto leading-relaxed mb-10">
            Søk i 250 000+ norske bedrifter. Legg dem i pipeline.
            La Reachr minne deg på oppfølging – alt på ett sted.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#09fe94] px-7 py-3.5 text-sm font-bold text-[#171717] shadow-[0_4px_20px_rgba(9,254,148,0.35)] transition-all duration-200 hover:bg-[#00e882] hover:-translate-y-0.5"
            >
              Start gratis i dag <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold text-[#6b6660] hover:text-[#171717] transition-colors"
            >
              Logg inn →
            </Link>
          </div>
          <p className="mt-5 text-xs text-[#a09b8f]">
            3 dagers gratis prøveperiode · Ingen kredittkort
          </p>
        </motion.div>
      </div>

      {/* Scrolling marquee – lead cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="relative w-full pb-12"
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-[#f2efe3] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-[#f2efe3] to-transparent" />

        <div className="flex" style={{ animation: "marquee 40s linear infinite" }}>
          {doubled.map((card, i) => (
            <LeadCard key={i} card={card} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
