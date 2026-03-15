"use client";
import { Zap } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

const valuesNo = [
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

const valuesEn = [
  {
    title: "Built for Norwegian B2B",
    desc: "Reachr is made specifically for Norwegian sales organizations – with the Business Registry at its core.",
    accent: "#09fe94",
  },
  {
    title: "Simplicity above all",
    desc: "We believe the best tool is the one you actually use. Reachr is designed to be fast and intuitive.",
    accent: "#ff470a",
  },
  {
    title: "Customer first",
    desc: "Every new product we launch is based on feedback from real users – not hypotheses.",
    accent: "#ffad0a",
  },
];

const statsNo = [
  { value: "2026", label: "Grunnlagt" },
  { value: "3 dager", label: "Gratis prøveperiode" },
  { value: "250 000+", label: "Bedrifter tilgjengelig" },
  { value: "4.9/5", label: "Brukervurdering" },
];

const statsEn = [
  { value: "2026", label: "Founded" },
  { value: "3 days", label: "Free trial" },
  { value: "250,000+", label: "Companies available" },
  { value: "4.9/5", label: "User rating" },
];

export function OmOss() {
  const { lang } = useLanguage();
  const values = lang === "en" ? valuesEn : valuesNo;
  const stats = lang === "en" ? statsEn : statsNo;

  return (
    <section id="om-oss" className="bg-[#f2efe3] py-28 px-6">
      <div className="mx-auto max-w-5xl">

        <div className="mb-20">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a09b8f] mb-4">
            {lang === "en" ? "About us" : "Om oss"}
          </p>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.01em] text-[#171717]">
            {lang === "en" ? "We're building the future's" : "Vi bygger fremtidens"}
            <br />
            <span className="italic text-[#ff470a]">
              {lang === "en" ? "sales tool." : "salgsverktøy."}
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20 items-center">
          <div>
            <p className="text-lg text-[#3d3a34] leading-relaxed mb-6">
              {lang === "en"
                ? "Reachr was started in 2026 by a team that was tired of overpriced, complicated CRM systems that didn't fit Norwegian SMEs."
                : "Reachr ble startet i 2026 av et team som var lei av overpriste, kompliserte CRM-systemer som ikke passet norske SMB-er."}
            </p>
            <p className="text-base text-[#6b6660] leading-relaxed mb-6">
              {lang === "en"
                ? "We combined direct access to the Norwegian Business Registry with a modern sales pipeline tool – and created something we would use ourselves. Today we help Norwegian companies find and close new customers faster than ever."
                : "Vi kombinerte direkte tilgang til Brønnøysundregistrene med et moderne salgspipeline-verktøy – og laget noe vi selv ville brukt. I dag hjelper vi norske bedrifter finne og lukke nye kunder raskere enn noensinne."}
            </p>
            <p className="text-base text-[#6b6660] leading-relaxed">
              {lang === "en"
                ? "We are a small, dedicated team. We love sales, product design, and making it simple to do business in Norway."
                : "Vi er et lite, dedikert team. Vi elsker salg, produktdesign og å gjøre det enkelt å drive business i Norge."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ value, label }) => (
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

        <div className="mb-20">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a09b8f] mb-10">
            {lang === "en" ? "Our values" : "Våre verdier"}
          </p>
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

      </div>
    </section>
  );
}
