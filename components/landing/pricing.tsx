import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Solo",
    price: 249,
    users: "1 bruker",
    description: "Perfekt for deg som jobber alene med salg.",
    features: [
      "Ubegrenset leadsøk",
      "Opptil 500 lagrede leads",
      "CRM-pipeline",
      "E-postvarsler",
      "Basisfiltre",
    ],
    cta: "Start gratis",
    popular: false,
    color: "border-gray-200",
  },
  {
    name: "Team",
    price: 199,
    users: "2–5 brukere",
    priceNote: "per bruker/mnd",
    description: "For team som vil jobbe effektivt med B2B-salg.",
    features: [
      "Alt i Solo",
      "Ubegrenset lagrede leads",
      "Teamdeling og samarbeid",
      "Avanserte filtre",
      "Kart-visning",
      "Prioritert support",
    ],
    cta: "Start gratis",
    popular: true,
    color: "border-green-500",
  },
  {
    name: "Vekst",
    price: 169,
    users: "6–10 brukere",
    priceNote: "per bruker/mnd",
    description: "Skalerbar løsning for salgsavdelinger i vekst.",
    features: [
      "Alt i Team",
      "Egendefinerte statuser",
      "API-tilgang",
      "Dedikert kundehåndterer",
      "SLA-garanti",
      "Onboarding-assistanse",
    ],
    cta: "Start gratis",
    popular: false,
    color: "border-gray-200",
  },
  {
    name: "Enterprise",
    price: null,
    users: "10+ brukere",
    description: "Skreddersydd for store salgsorganisasjoner.",
    features: [
      "Alt i Vekst",
      "Egendefinerte integrasjoner",
      "Dedikert infrastruktur",
      "Opplæring og support",
      "Fleksibel fakturering",
      "Sikkerhetsrevisjon",
    ],
    cta: "Kontakt oss",
    popular: false,
    color: "border-gray-200",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Priser</span>
          <h2 className="text-4xl font-bold text-[#0F1729] mt-3 mb-4">
            Enkle og transparente priser
          </h2>
          <p className="text-lg text-gray-500">
            Alle planer inkluderer 3 dagers gratis prøveperiode.
            Ingen kredittkort nødvendig. Avbestill når som helst.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl border-2 p-7 ${plan.color} ${
                plan.popular ? "shadow-xl shadow-green-500/10" : "shadow-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-white" />
                    Mest populær
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#0F1729] mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{plan.users}</p>
                {plan.price !== null ? (
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-[#0F1729]">{plan.price}kr</span>
                    <span className="text-sm text-gray-400 mb-1">/{plan.priceNote ?? "mnd"}</span>
                  </div>
                ) : (
                  <div className="text-3xl font-extrabold text-[#0F1729]">Pris etter avtale</div>
                )}
                <p className="text-sm text-gray-500 mt-3">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.price !== null ? "/register" : "#"}>
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  size="md"
                  className="w-full justify-center"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-10">
          Alle priser er ekskl. MVA. Faktureres månedlig. Kan avbestilles når som helst.
        </p>
      </div>
    </section>
  );
}
