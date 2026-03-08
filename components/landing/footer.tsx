"use client";
import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#171717", color: "white", padding: "72px 24px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, backgroundColor: "#09fe94", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={15} color="#171717" fill="#171717" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: "white" }}>Reachr</span>
            </Link>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 260, margin: 0 }}>
              Norges B2B-verktøy for leadsøk og salgspipeline. Hjelper hundrevis av bedrifter finne og lukke nye kunder.
            </p>
          </div>

          {[
            { title: "Produkt", links: ["Funksjoner", "Priser", "Integrasjoner", "Oppdateringer"] },
            { title: "Selskap", links: ["Om oss", "Blogg", "Karriere", "Kontakt"] },
            { title: "Juridisk", links: ["Personvern", "Vilkår", "Cookies", "GDPR"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map(l => (
                  <li key={l}>
                    <a href="#" style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "white")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>© 2025 Reachr AS. Alle rettigheter forbeholdt.</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>Org.nr: 123 456 789 · Oslo, Norge</p>
        </div>
      </div>
    </footer>
  );
}
