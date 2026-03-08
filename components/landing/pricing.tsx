"use client";
import Link from "next/link";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Solo",
    price: 249,
    unit: "/mnd",
    users: "1 bruker",
    desc: "Perfekt for deg som jobber alene med salg.",
    features: ["Ubegrenset leadsøk", "Opptil 500 lagrede leads", "CRM-pipeline", "E-postvarsler", "Basisfiltre"],
    cta: "Start gratis",
    popular: false,
    href: "/register",
  },
  {
    name: "Team",
    price: 199,
    unit: "/bruker/mnd",
    users: "2–5 brukere",
    desc: "For team som vil jobbe effektivt med B2B-salg.",
    features: ["Alt i Solo", "Ubegrenset lagrede leads", "Teamdeling og samarbeid", "Avanserte filtre", "Kartvisning", "Prioritert support"],
    cta: "Start gratis",
    popular: true,
    href: "/register",
  },
  {
    name: "Vekst",
    price: 169,
    unit: "/bruker/mnd",
    users: "6–10 brukere",
    desc: "Skalerbar løsning for salgsavdelinger i vekst.",
    features: ["Alt i Team", "Egendefinerte statuser", "API-tilgang", "Dedikert kundehåndterer", "SLA-garanti", "Onboarding"],
    cta: "Start gratis",
    popular: false,
    href: "/register",
  },
  {
    name: "Enterprise",
    price: null,
    unit: "",
    users: "10+ brukere",
    desc: "Skreddersydd for store salgsorganisasjoner.",
    features: ["Alt i Vekst", "Egendefinerte integrasjoner", "Dedikert infrastruktur", "Opplæring og support", "Fleksibel fakturering", "Sikkerhetsrevisjon"],
    cta: "Kontakt oss",
    popular: false,
    href: "#",
  },
];

export function Pricing() {
  return (
    <section id="pricing" style={{ padding: "96px 24px", backgroundColor: "#ede9da" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 64px" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#09fe94", textTransform: "uppercase", letterSpacing: "0.08em", filter: "brightness(0.65)" }}>
            Priser
          </span>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 800, color: "#171717", letterSpacing: "-0.8px", marginTop: 12, marginBottom: 16 }}>
            Enkle og transparente priser
          </h2>
          <p style={{ fontSize: 17, color: "#6b6660", lineHeight: 1.65 }}>
            Alle planer inkluderer 3 dagers gratis prøveperiode. Ingen kredittkort nødvendig.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, alignItems: "start" }}>
          {plans.map(plan => (
            <div key={plan.name} style={{
              position: "relative",
              backgroundColor: "#faf8f2",
              borderRadius: 20,
              border: plan.popular ? "2px solid #09fe94" : "2px solid #d8d3c5",
              padding: "28px 24px",
              boxShadow: plan.popular ? "0 8px 32px rgba(9,254,148,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  backgroundColor: "#09fe94", color: "#171717",
                  fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 999,
                  display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
                }}>
                  <Zap size={11} fill="#171717" color="#171717" /> Mest populær
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#6b6660", margin: "0 0 4px" }}>{plan.users}</p>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#171717", margin: "0 0 16px" }}>{plan.name}</h3>
                {plan.price !== null ? (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
                    <span style={{ fontSize: 38, fontWeight: 800, color: "#171717", lineHeight: 1 }}>{plan.price} kr</span>
                    <span style={{ fontSize: 13, color: "#a09b8f", paddingBottom: 4 }}>{plan.unit}</span>
                  </div>
                ) : (
                  <span style={{ fontSize: 26, fontWeight: 800, color: "#171717" }}>Pris etter avtale</span>
                )}
                <p style={{ fontSize: 14, color: "#6b6660", marginTop: 12, lineHeight: 1.5 }}>{plan.desc}</p>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#3d3a34" }}>
                    <Check size={15} color="#09fe94" style={{ flexShrink: 0, marginTop: 1, filter: "brightness(0.7)" }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href} style={{
                display: "block", textAlign: "center",
                padding: "11px 0", borderRadius: 10,
                fontWeight: 700, fontSize: 14, textDecoration: "none",
                backgroundColor: plan.popular ? "#09fe94" : "#faf8f2",
                color: plan.popular ? "#171717" : "#171717",
                border: plan.popular ? "none" : "1.5px solid #d8d3c5",
                transition: "background-color 0.15s",
              }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#a09b8f", marginTop: 36 }}>
          Alle priser er ekskl. MVA. Faktureres månedlig. Kan avbestilles når som helst.
        </p>
      </div>
    </section>
  );
}
