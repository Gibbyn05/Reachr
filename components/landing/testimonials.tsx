"use client";
import { useLanguage } from "@/lib/i18n/language-context";

const testimonialsNo = [
  {
    quote: "Vi brukte å bruke dager på å finne riktige bedrifter å kontakte. Med Reachr har vi all informasjonen vi trenger på sekunder.",
    name: "Marte Holm",
    title: "Salgssjef, Bergensgruppen AS",
    initials: "MH",
    accent: "#09fe94",
  },
  {
    quote: "Endelig et norsk CRM-verktøy som faktisk er laget for oss. Enkelt å bruke, men kraftig nok for hele teamet.",
    name: "Thomas Aas",
    title: "Daglig leder, Nordkraft Solutions",
    initials: "TA",
    accent: "#ff470a",
  },
  {
    quote: "Varslingssystemet er gull verdt. Jeg glemmer aldri mer å følge opp et lead – Reachr passer på det for meg.",
    name: "Ingrid Bakke",
    title: "Account manager, Viken Salg",
    initials: "IB",
    accent: "#ffad0a",
  },
];

const testimonialsEn = [
  {
    quote: "We used to spend days finding the right companies to contact. With Reachr, we have all the information we need in seconds.",
    name: "Marte Holm",
    title: "Sales Manager, Bergensgruppen AS",
    initials: "MH",
    accent: "#09fe94",
  },
  {
    quote: "Finally a Norwegian CRM tool that's actually made for us. Easy to use, yet powerful enough for the whole team.",
    name: "Thomas Aas",
    title: "CEO, Nordkraft Solutions",
    initials: "TA",
    accent: "#ff470a",
  },
  {
    quote: "The notification system is worth its weight in gold. I never forget to follow up on a lead – Reachr takes care of it for me.",
    name: "Ingrid Bakke",
    title: "Account Manager, Viken Salg",
    initials: "IB",
    accent: "#ffad0a",
  },
];

export function Testimonials() {
  const { lang } = useLanguage();
  const testimonials = lang === "en" ? testimonialsEn : testimonialsNo;

  return (
    <section className="bg-[#f2efe3] py-28 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a09b8f] mb-4">
            {lang === "en" ? "Testimonials" : "Tilbakemeldinger"}
          </p>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.01em] text-[#171717]">
            {lang === "en" ? "Loved by Norwegian" : "Elsket av norske"}
            <br />
            <span className="italic text-[#ff470a]">
              {lang === "en" ? "sales teams." : "salgsteam."}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {testimonials.map(({ quote, name, title, initials, accent }) => (
            <div
              key={name}
              className="flex flex-col justify-between rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] p-7"
            >
              <div>
                <div
                  className="text-4xl font-serif leading-none mb-4"
                  style={{ color: accent, filter: accent === "#09fe94" ? "brightness(0.65)" : "none" }}
                >
                  "
                </div>
                <p className="text-sm text-[#3d3a34] leading-relaxed">{quote}</p>
              </div>
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#e8e4d8]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0"
                  style={{ backgroundColor: accent + "22", color: accent, filter: accent === "#09fe94" ? "brightness(0.65)" : "none" }}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#171717]">{name}</p>
                  <p className="text-xs text-[#a09b8f]">{title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
