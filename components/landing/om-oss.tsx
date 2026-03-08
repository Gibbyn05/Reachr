"use client";
import { Zap } from "lucide-react";

const teamMembers = [
  {
    name: "Erik Haugen",
    role: "CEO & Medgründer",
    initials: "EH",
    accent: "#09fe94",
  },
  {
    name: "Marte Solberg",
    role: "CTO & Medgründer",
    initials: "MS",
    accent: "#ff470a",
  },
  {
    name: "Jonas Berge",
    role: "Head of Sales",
    initials: "JB",
    accent: "#ffad0a",
  },
];

const values = [
  {
    title: "Bygget for norsk B2B",
    desc: "Reachr er laget spesifikt for norske salgsorganisasjoner – med Brønnøysundregistrene i kjernen.",
    accent: "#09fe94",
  },
  {
    title: "Enkelhet fremfor alt",
    desc: "Vi tror det beste verktøyet er det du faktisk bruker. Reachr er designet for å være raskt og intuitivt.",
    accent: "#ff470a",
  },
  {
    title: "Kunden i sentrum",
    desc: "Hvert nytt produkt vi lanserer er basert på tilbakemeldinger fra ekte brukere – ikke hypoteser.",
    accent: "#ffad0a",
  },
];

export function OmOss() {
  return (
    <section id="om-oss" className="bg-[#f2efe3] py-28 px-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-20">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a09b8f] mb-4">Om oss</p>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.01em] text-[#171717]">
            Vi bygger fremtidens
            <br />
            <span className="italic text-[#ff470a]">salgsverktøy.</span>
          </h2>
        </div>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20 items-center">
          <div>
            <p className="text-lg text-[#3d3a34] leading-relaxed mb-6">
              Reachr ble startet i 2024 av et team som var lei av overpriste, kompliserte CRM-systemer som ikke passet norske SMB-er.
            </p>
            <p className="text-base text-[#6b6660] leading-relaxed mb-6">
              Vi kombinerte direkte tilgang til Brønnøysundregistrene med et moderne salgspipeline-verktøy – og laget noe vi selv ville brukt. I dag hjelper vi hundrevis av norske bedrifter finne og lukke nye kunder raskere enn noensinne.
            </p>
            <p className="text-base text-[#6b6660] leading-relaxed">
              Vi er et lite, dedikert team med base i Oslo. Vi elsker salg, produktdesign og å gjøre det enkelt å drive business i Norge.
            </p>
          </div>

          {/* Stats block */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "2024", label: "Grunnlagt" },
              { value: "500+", label: "Aktive brukere" },
              { value: "250 000+", label: "Bedrifter tilgjengelig" },
              { value: "Oslo", label: "Hvor vi holder til" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-[#faf8f2] border border-[#d8d3c5] rounded-2xl p-6"
              >
                <p className="text-3xl font-extrabold text-[#171717] mb-1">{value}</p>
                <p className="text-sm text-[#a09b8f]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a09b8f] mb-10">Våre verdier</p>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map(({ title, desc, accent }) => (
              <div key={title} className="bg-[#faf8f2] border border-[#d8d3c5] rounded-2xl p-7">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: accent + "18" }}
                >
                  <Zap
                    size={18}
                    style={{ color: accent, filter: accent === "#09fe94" ? "brightness(0.65)" : "none" }}
                  />
                </div>
                <h3 className="text-base font-extrabold text-[#171717] mb-2">{title}</h3>
                <p className="text-sm text-[#6b6660] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#a09b8f] mb-10">Teamet</p>
          <div className="flex flex-wrap gap-6">
            {teamMembers.map(({ name, role, initials, accent }) => (
              <div key={name} className="flex items-center gap-4 bg-[#faf8f2] border border-[#d8d3c5] rounded-2xl px-6 py-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0"
                  style={{ backgroundColor: accent + "22", color: accent === "#09fe94" ? "#065c3a" : accent }}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#171717]">{name}</p>
                  <p className="text-xs text-[#a09b8f]">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
