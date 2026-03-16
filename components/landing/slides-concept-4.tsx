"use client";
/**
 * KONSEPT 4 — "Bransje-explorer"
 * Stil: Lys krem — store ikonkort, alle identisk cream-design
 * Viser bransjer i en rutenett-karusell med antall bedrifter
 * Caption: "250 000+ norske bedrifter — finn din neste kunde"
 */

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Wrench, Zap, HardHat, Calculator, Monitor, Truck, Scale, Home, Utensils, Scissors, Stethoscope, GraduationCap,
} from "lucide-react";

const industries = [
  { icon: Wrench,       label: "Rørleggere",        count: "2 841",  color: "#ff470a" },
  { icon: Zap,          label: "Elektrikere",        count: "4 203",  color: "#ffad0a" },
  { icon: HardHat,      label: "Byggfirmaer",        count: "18 740", color: "#09fe94" },
  { icon: Calculator,   label: "Regnskapsbyråer",    count: "6 129",  color: "#ff470a" },
  { icon: Monitor,      label: "IT-selskaper",       count: "12 387", color: "#09fe94" },
  { icon: Truck,        label: "Transport",          count: "9 614",  color: "#ffad0a" },
  { icon: Scale,        label: "Advokater",          count: "3 802",  color: "#ff470a" },
  { icon: Home,         label: "Eiendom",            count: "7 455",  color: "#09fe94" },
  { icon: Utensils,     label: "Restaurant & Mat",   count: "11 920", color: "#ffad0a" },
  { icon: Scissors,     label: "Frisør & Skjønnhet", count: "5 317",  color: "#ff470a" },
  { icon: Stethoscope,  label: "Helse & Medisin",    count: "8 063",  color: "#09fe94" },
  { icon: GraduationCap,label: "Opplæring & Kurs",   count: "4 588",  color: "#ffad0a" },
];

function IndustryCard({
  icon: Icon, label, count, color, isActive,
}: {
  icon: typeof Wrench; label: string; count: string; color: string; isActive: boolean;
}) {
  return (
    <motion.div
      animate={isActive ? { scale: 1.05, y: -4 } : { scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="rounded-2xl border bg-[#faf8f2] p-4 flex flex-col items-center gap-2 cursor-default"
      style={{ borderColor: isActive ? color : "#d8d3c5" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: isActive ? `${color}22` : "#ede9da" }}
      >
        <Icon size={18} style={{ color: isActive ? color : "#6b6660" }} />
      </div>
      <div className="text-center">
        <p className="text-[11px] font-bold text-[#171717] leading-tight">{label}</p>
        <p className="text-[10px] mt-0.5" style={{ color: isActive ? color : "#a09b8f" }}>
          {count} bedrifter
        </p>
      </div>
    </motion.div>
  );
}

export function SlidesConceptFour() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % industries.length), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full">
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}
      >
        {industries.map((ind, i) => (
          <IndustryCard key={i} {...ind} isActive={active === i} />
        ))}
      </div>
      <div className="mt-5 text-center">
        <motion.p
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[#6b6660]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <span className="font-bold text-[#171717]">{industries[active].count}</span>{" "}
          {industries[active].label.toLowerCase()} registrert i Brønnøysundregistrene
        </motion.p>
      </div>
    </div>
  );
}
