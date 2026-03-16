"use client";
/**
 * KONSEPT 5 — "Mørk salgstall-scoreboard"
 * Stil: Mørk #171717 — alle tall og kort konsistent mørkt tema med grønn aksent
 * Animerte teller-tall som oppdaterer seg — som et live dashboard
 * Caption: "Selgere på Reachr lukker 3× flere deals"
 */

import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, Users, MailCheck, Handshake } from "lucide-react";

function useCountUp(target: number, duration = 1.8, delay = 0) {
  const val = useMotionValue(0);
  const rounded = useTransform(val, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      const controls = animate(val, target, {
        duration,
        ease: "easeOut",
        onUpdate: (latest) => setDisplay(Math.round(latest)),
      });
      return controls.stop;
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [target, duration, delay]);

  return display;
}

const stats = [
  { icon: Users,      label: "Nye leads i dag",    value: 147,  suffix: "",     color: "#09fe94", delay: 0 },
  { icon: MailCheck,  label: "E-poster sendt",      value: 38,   suffix: "",     color: "#09fe94", delay: 0.2 },
  { icon: TrendingUp, label: "Møter booket",         value: 12,   suffix: "",     color: "#ffad0a", delay: 0.4 },
  { icon: Handshake,  label: "Deals lukket",         value: 4,    suffix: " 🎉",  color: "#09fe94", delay: 0.6 },
];

function StatCard({
  icon: Icon, label, value, suffix, color, delay,
}: {
  icon: typeof Users; label: string; value: number; suffix: string; color: string; delay: number;
}) {
  const count = useCountUp(value, 1.6, delay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.1, duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border border-[#2a2a2a] bg-[#1e1e1e] p-5 flex flex-col gap-3"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}1a` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <p
          className="text-3xl font-bold leading-none"
          style={{ color, fontFamily: "'Inter', sans-serif", fontVariantNumeric: "tabular-nums" }}
        >
          {count}
          {suffix}
        </p>
        <p className="text-[11px] text-[#6b6660] mt-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
          {label}
        </p>
      </div>

      {/* Mini sparkline-indikator */}
      <div className="flex items-end gap-0.5 h-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-sm"
            style={{ backgroundColor: `${color}` }}
            initial={{ height: 0 }}
            animate={{ height: `${20 + Math.random() * 80}%` }}
            transition={{ delay: delay + 0.3 + i * 0.05, duration: 0.4, ease: "easeOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function SlidesConceptFive() {
  const [key, setKey] = useState(0);

  // Reanimér hvert 5. sekund
  useEffect(() => {
    const t = setInterval(() => setKey((k) => k + 1), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div key={key} className="w-full rounded-2xl border border-[#2a2a2a] bg-[#171717] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#09fe94] animate-pulse" />
          <span className="text-[12px] font-semibold text-[#e8e4d8]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Live statistikk
          </span>
        </div>
        <span className="text-[10px] text-[#4a4540]">oppdateres hvert min</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Footer */}
      <p className="mt-4 text-[10px] text-center text-[#4a4540]">
        Basert på gjennomsnittlig Reachr-bruker siste 30 dager
      </p>
    </div>
  );
}
