"use client";
import { Search, LayoutDashboard, Bell } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Søk etter bedrifter",
    description: "Skriv inn bransje, sted eller firmanavn. Reachr søker gjennom 250 000+ norske bedrifter fra Brønnøysundregistrene i sanntid.",
    accent: "#09fe94",
    icon: Search,
    mockup: (
      <div className="rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] p-5 shadow-sm">
        <p className="text-[10px] font-bold text-[#a09b8f] uppercase tracking-widest mb-3">Leadsøk</p>
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 rounded-xl border border-[#d8d3c5] bg-white px-3 py-2.5">
            <Search size={13} className="text-[#a09b8f] shrink-0" />
            <span className="text-sm text-[#3d3a34] font-medium">Rørlegger, Oslo</span>
          </div>
          <div className="flex items-center justify-center rounded-xl bg-[#09fe94] px-4 py-2.5">
            <span className="text-xs font-bold text-[#171717]">Søk</span>
          </div>
        </div>
        {[
          { name: "Bjørnstad VVS AS", loc: "Oslo", emp: "12 ans." },
          { name: "Nordre Rør & Bad", loc: "Oslo", emp: "7 ans." },
          { name: "Oslo Rørservice", loc: "Oslo", emp: "24 ans." },
        ].map((r, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-[#ede9da] last:border-0">
            <div>
              <p className="text-xs font-semibold text-[#171717]">{r.name}</p>
              <p className="text-[10px] text-[#a09b8f]">{r.loc} · {r.emp}</p>
            </div>
            <button className="text-[10px] font-bold bg-[#09fe94] text-[#171717] px-2.5 py-1 rounded-lg">
              + Legg til
            </button>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: "2",
    title: "Bygg din pipeline",
    description: "Legg leads direkte inn i CRM-pipelinen. Spor status, legg til notater og samarbeid med teamet ditt – alt på ett sted.",
    accent: "#ff470a",
    icon: LayoutDashboard,
    mockup: (
      <div className="rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] p-5 shadow-sm">
        <p className="text-[10px] font-bold text-[#a09b8f] uppercase tracking-widest mb-3">Mine Leads</p>
        {[
          { name: "Bjørnstad VVS AS", status: "Kontaktet", statusBg: "#09fe94", statusColor: "#065c3a" },
          { name: "Vestland Elektro AS", status: "Booket møte", statusBg: "#ffad0a", statusColor: "#7a4f00" },
          { name: "Kjeldsberg Bygg", status: "Kunde", statusBg: "#171717", statusColor: "#09fe94" },
          { name: "Hav & Kyst Reklame", status: "Ikke kontaktet", statusBg: "#e8e4d8", statusColor: "#6b6660" },
        ].map((l, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#ede9da] last:border-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#e8e4d8] flex items-center justify-center text-[10px] font-bold text-[#6b6660]">
                {l.name[0]}
              </div>
              <span className="text-xs font-semibold text-[#171717]">{l.name}</span>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: l.statusBg, color: l.statusColor }}
            >
              {l.status}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: "3",
    title: "Følg opp automatisk",
    description: "Reachr varsler deg når det er tid for oppfølging. Aldri glem et lead igjen – systemet holder styr på alt for deg.",
    accent: "#ffad0a",
    icon: Bell,
    mockup: (
      <div className="rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] p-5 shadow-sm">
        <p className="text-[10px] font-bold text-[#a09b8f] uppercase tracking-widest mb-3">Varsler</p>
        {[
          { name: "Bjørnstad VVS AS", msg: "Ingen respons – ring igjen?", time: "1d siden", dot: "#ff470a" },
          { name: "Fjord Tech Solutions", msg: "Møte om 2 timer", time: "I dag", dot: "#ffad0a" },
          { name: "Polaris Renhold", msg: "Sist kontaktet for 3 dager siden", time: "3d siden", dot: "#09fe94" },
        ].map((n, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#ede9da] last:border-0">
            <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: n.dot }} />
            <div className="flex-1">
              <p className="text-xs font-bold text-[#171717]">{n.name}</p>
              <p className="text-[10px] text-[#6b6660]">{n.msg}</p>
            </div>
            <span className="text-[10px] text-[#a09b8f] shrink-0">{n.time}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="bg-[#f2efe3] py-28 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-20">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a09b8f] mb-4">
            Slik fungerer det
          </p>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.01em] text-[#171717]">
            Tre steg til
            <br />
            <span className="italic text-[#ff470a]">dine neste kunder.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-24">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className={`flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Text */}
              <div className="flex-1">
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-6 text-xl font-extrabold"
                  style={{ backgroundColor: step.accent + "22", color: step.accent, filter: step.accent === "#09fe94" ? "brightness(0.65)" : "none" }}
                >
                  {step.number}
                </div>
                <h3 className="font-display text-[2rem] sm:text-[2.4rem] font-bold text-[#171717] mb-4 leading-[1] tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="text-base text-[#6b6660] leading-relaxed max-w-md">
                  {step.description}
                </p>
              </div>

              {/* Mockup */}
              <div className="flex-1 max-w-sm lg:max-w-none">
                {step.mockup}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
