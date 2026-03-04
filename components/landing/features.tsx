import { Search, Database, Bell, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Search,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
    title: "Leadsøk",
    description:
      "Søk i millioner av norske bedrifter etter bransje, sted og størrelse. Finn de riktige kundene med filtre for omsetning, ansatte og mer.",
    highlights: ["Brreg-data i sanntid", "Kart- og listevisning", "Avanserte filtre"],
  },
  {
    icon: Database,
    color: "bg-green-50",
    iconColor: "text-green-600",
    title: "CRM-pipeline",
    description:
      "Hold styr på alle leads gjennom salgsprosessen. Fra første kontakt til signert avtale – alt samlet i et oversiktlig system.",
    highlights: ["6 statusnivåer", "Samarbeid i team", "Notater og historikk"],
  },
  {
    icon: Bell,
    color: "bg-purple-50",
    iconColor: "text-purple-600",
    title: "Automatiske varsler",
    description:
      "Ikke glem oppfølginger. Reachr minner deg på når det er tid for å ta kontakt igjen, basert på din kommunikasjonshistorikk.",
    highlights: ["Smarte påminnelser", "Oppfølgingsstatus", "Tilpassbare regler"],
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Funksjoner</span>
          <h2 className="text-4xl font-bold text-[#0F1729] mt-3 mb-4">
            Alt du trenger for B2B-salg
          </h2>
          <p className="text-lg text-gray-500">
            Reachr kombinerer leadsøk, CRM og oppfølging i ett kraftig verktøy
            skreddersydd for norske bedrifter.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, color, iconColor, title, description, highlights }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-6`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-[#0F1729] mb-3">{title}</h3>
              <p className="text-gray-500 leading-relaxed mb-6">{description}</p>
              <ul className="space-y-2">
                {highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-[#0F1729] rounded-2xl">
          {[
            { value: "250,000+", label: "Norske bedrifter i databasen" },
            { value: "3 dager", label: "Gratis prøveperiode" },
            { value: "500+", label: "Aktive brukere" },
            { value: "98%", label: "Fornøyde kunder" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-extrabold text-green-400 mb-1">{value}</p>
              <p className="text-sm text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
