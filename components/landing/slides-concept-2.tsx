"use client";
/**
 * KONSEPT 2 — "Mørk live-feed"
 * Stil: Mørk #171717 — alle elementer konsistent mørkt tema
 * Vertikal feed som scroller oppover — som en live aktivitetslogg
 * Caption: "Din salgspipeline — live og i bevegelse"
 */

import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useRef } from "react";
import { Mail, Calendar, UserPlus, TrendingUp, Phone, Star } from "lucide-react";

const activities = [
  { icon: UserPlus, color: "#09fe94", action: "Lagt til pipeline", company: "Vestland Elektro AS", time: "nå nettopp" },
  { icon: Mail, color: "#09fe94", action: "AI-epost sendt", company: "Nordic Print Solutions", time: "2 min siden" },
  { icon: Calendar, color: "#ffad0a", action: "Møte booket", company: "Kjeldsberg Bygg AS", time: "5 min siden" },
  { icon: Phone, color: "#09fe94", action: "Oppringning logget", company: "Fjord Tech Solutions", time: "12 min siden" },
  { icon: TrendingUp, color: "#09fe94", action: "Deal lukket 🎉", company: "Polaris Renhold AS", time: "18 min siden" },
  { icon: UserPlus, color: "#09fe94", action: "Lagt til pipeline", company: "Hamar Invest Holding", time: "24 min siden" },
  { icon: Mail, color: "#09fe94", action: "AI-epost sendt", company: "Bakke & Lund Advokater", time: "31 min siden" },
  { icon: Star, color: "#ffad0a", action: "Merket som varm", company: "Sørlandets Bil AS", time: "45 min siden" },
  { icon: Calendar, color: "#ffad0a", action: "Møte booket", company: "Bjørnstad & Sønner AS", time: "1 t siden" },
  { icon: TrendingUp, color: "#09fe94", action: "Deal lukket 🎉", company: "Arktis Media Group", time: "2 t siden" },
];

function ActivityItem({ icon: Icon, color, action, company, time }: typeof activities[0]) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 border-b border-[#2a2a2a] mx-0">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon size={13} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[11px] text-[#a09b8f]">{action} — </span>
        <span className="text-[11px] font-semibold text-[#e8e4d8]">{company}</span>
      </div>
      <span className="text-[10px] text-[#4a4540] shrink-0">{time}</span>
    </div>
  );
}

export function SlidesConceptTwo() {
  const doubled = [...activities, ...activities, ...activities];
  const trackRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (!trackRef.current) return;
    const totalH = trackRef.current.scrollHeight / 3;
    const next = y.get() - (totalH / 30000) * delta;
    y.set(next <= -totalH ? next + totalH : next);
  });

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#171717]" style={{ height: 260 }}>
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-10 z-10 bg-gradient-to-b from-[#171717] to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 z-10 bg-gradient-to-t from-[#171717] to-transparent" />

      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#171717] border-b border-[#2a2a2a] px-4 py-2.5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#09fe94] animate-pulse" />
        <span className="text-[11px] font-semibold text-[#e8e4d8]" style={{ fontFamily: "'Inter', sans-serif" }}>
          Live aktivitetsfeed
        </span>
        <span className="ml-auto text-[10px] text-[#4a4540]">i dag</span>
      </div>

      <motion.div ref={trackRef} style={{ y, willChange: "transform" }}>
        {doubled.map((item, i) => (
          <ActivityItem key={i} {...item} />
        ))}
      </motion.div>
    </div>
  );
}
