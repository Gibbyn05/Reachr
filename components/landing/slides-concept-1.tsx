"use client";
/**
 * KONSEPT 1 — "Dobbel-rad karusell"
 * Stil: Lys krem — alle kort identiske warm cream-design
 * To rader som beveger seg i motsatt retning
 * Caption: "Se alle leads – alltid ett steg foran"
 */

import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useRef } from "react";
import { Building2, CheckCircle2, Clock, PhoneCall, CalendarCheck, XCircle, UserCheck } from "lucide-react";

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  "Ikke kontaktet": { icon: Clock, color: "#a09b8f" },
  "Kontaktet": { icon: PhoneCall, color: "#09fe94" },
  "Booket møte": { icon: CalendarCheck, color: "#ffad0a" },
  "Kunde": { icon: UserCheck, color: "#09fe94" },
  "Avslått": { icon: XCircle, color: "#ff470a" },
  "Kontaktet - ikke svar": { icon: CheckCircle2, color: "#6b6660" },
};

const row1 = [
  { name: "Bjørnstad & Sønner AS", industry: "Rørlegger", status: "Booket møte" },
  { name: "Nordic Print Solutions", industry: "Trykk & Design", status: "Kontaktet" },
  { name: "Vestland Elektro AS", industry: "Elektriker", status: "Kunde" },
  { name: "Hav & Kyst Reklame", industry: "Reklame", status: "Ikke kontaktet" },
  { name: "Kjeldsberg Bygg AS", industry: "Bygg & Anlegg", status: "Booket møte" },
  { name: "Norsk Logistikk Drift", industry: "Transport", status: "Kontaktet" },
  { name: "Fjord Tech Solutions", industry: "IT & Software", status: "Kunde" },
];

const row2 = [
  { name: "Bakke & Lund Advokater", industry: "Juridisk", status: "Ikke kontaktet" },
  { name: "Polaris Renhold AS", industry: "Renhold", status: "Kunde" },
  { name: "Sunnfjord Catering", industry: "Mat & Drikke", status: "Avslått" },
  { name: "Telemark Konsult AS", industry: "Konsulent", status: "Kontaktet" },
  { name: "Hamar Invest Holding", industry: "Finans", status: "Booket møte" },
  { name: "Arktis Media Group", industry: "Medier", status: "Ikke kontaktet" },
  { name: "Sørlandets Bil AS", industry: "Bil & Motor", status: "Kontaktet" },
];

function MiniCard({ name, industry, status }: { name: string; industry: string; status: string }) {
  const cfg = statusConfig[status] ?? statusConfig["Ikke kontaktet"];
  const Icon = cfg.icon;
  return (
    <div className="mx-2 w-[220px] shrink-0 flex items-center gap-3 rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] px-4 py-3">
      <div className="w-8 h-8 rounded-xl bg-[#ede9da] flex items-center justify-center shrink-0">
        <Building2 size={14} className="text-[#6b6660]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-[#171717] truncate leading-tight">{name}</p>
        <p className="text-[10px] text-[#a09b8f] mt-0.5">{industry}</p>
      </div>
      <Icon size={14} style={{ color: cfg.color }} className="shrink-0" />
    </div>
  );
}

function InfiniteRow({ items, direction }: { items: typeof row1; direction: "left" | "right" }) {
  const doubled = [...items, ...items];
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (!trackRef.current) return;
    const halfW = trackRef.current.scrollWidth / 2;
    const speed = (halfW / 35000) * delta;
    const next = direction === "left" ? x.get() - speed : x.get() + speed;
    if (direction === "left" && next <= -halfW) x.set(next + halfW);
    else if (direction === "right" && next >= 0) x.set(next - halfW);
    else x.set(next);
  });

  return (
    <div className="overflow-hidden">
      <motion.div ref={trackRef} className="flex" style={{ x, willChange: "transform" }}>
        {doubled.map((card, i) => (
          <MiniCard key={i} {...card} />
        ))}
      </motion.div>
    </div>
  );
}

export function SlidesConceptOne() {
  return (
    <div className="relative w-full py-6 space-y-3">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 z-10 bg-gradient-to-r from-[#f2efe3] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 z-10 bg-gradient-to-l from-[#f2efe3] to-transparent" />
      <InfiniteRow items={row1} direction="left" />
      <InfiniteRow items={row2} direction="right" />
    </div>
  );
}
