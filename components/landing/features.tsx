"use client";
import { Search, Database, Bell } from "lucide-react";

const features = [
  {
    icon: Search,
    bg: "#EFF6FF", iconColor: "#3B82F6",
    title: "Leadsøk",
    description: "Søk i over 250 000 norske bedrifter etter bransje, sted og størrelse. Finn de riktige kundene med avanserte filtre.",
    highlights: ["Brreg-data i sanntid", "Kart- og listevisning", "Filtre for omsetning og ansatte"],
  },
  {
    icon: Database,
    bg: "#F0FDF4", iconColor: "#22C55E",
    title: "CRM-pipeline",
    description: "Hold styr på alle leads gjennom salgsprosessen. Fra første kontakt til signert avtale – samlet i ett system.",
    highlights: ["6 statusnivåer med farger", "Samarbeid i team", "Notater og historikk"],
  },
  {
    icon: Bell,
    bg: "#FAF5FF", iconColor: "#A855F7",
    title: "Automatiske varsler",
    description: "Reachr minner deg på når det er tid for oppfølging, basert på kommunikasjonshistorikken din.",
    highlights: ["Smarte påminnelser", "Oppfølgingsstatus", "Tilpassbare regler"],
  },
];

export function Features() {
  return (
    <section id="features" style={{ padding: "96px 24px", backgroundColor: "white" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 64px" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#22C55E", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Funksjoner
          </span>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 800, color: "#0F1729", letterSpacing: "-0.8px", marginTop: 12, marginBottom: 16 }}>
            Alt du trenger for B2B-salg
          </h2>
          <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.65 }}>
            Reachr kombinerer leadsøk, CRM og oppfølging i ett kraftig verktøy skreddersydd for norske bedrifter.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
          {features.map(({ icon: Icon, bg, iconColor, title, description, highlights }) => (
            <div key={title} style={{
              backgroundColor: "white", border: "1px solid #E5E7EB",
              borderRadius: 20, padding: 32,
              transition: "box-shadow 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ width: 48, height: 48, backgroundColor: bg, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Icon size={22} color={iconColor} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0F1729", marginBottom: 12 }}>{title}</h3>
              <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.65, marginBottom: 24 }}>{description}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {highlights.map(h => (
                  <li key={h} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#4B5563" }}>
                    <div style={{ width: 6, height: 6, backgroundColor: "#22C55E", borderRadius: "50%", flexShrink: 0 }} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div style={{
          marginTop: 64, backgroundColor: "#0F1729", borderRadius: 20,
          padding: "48px 40px",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24,
        }}>
          {[
            { value: "250 000+", label: "Norske bedrifter" },
            { value: "3 dager", label: "Gratis prøveperiode" },
            { value: "500+", label: "Aktive brukere" },
            { value: "98%", label: "Fornøyde kunder" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#4ADE80", margin: "0 0 6px" }}>{value}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
