"use client";
import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#171717", color: "white", padding: "72px 24px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
              <img src="/logo.svg" alt="Reachr" style={{ width: 36, height: 36 }} />
              <span style={{ fontWeight: 800, fontSize: 18, color: "white" }}>Reachr</span>
            </Link>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 260, margin: 0 }}>
              Norges B2B-verktøy for leadsøk og salgspipeline. Hjelper hundrevis av bedrifter finne og lukke nye kunder.
            </p>
          </div>

          {[
            { title: "Produkt", links: [["Funksjoner", "#features"], ["Priser", "#pricing"], ["Oppdateringer", "/oppdateringer"]] },
            { title: "Selskap", links: [["Om oss", "#om-oss"], ["Kontakt", "#kontakt"], ["Support", "mailto:Help@reachr.no"]] },
            { title: "Juridisk", links: [["Personvern", "/personvern"], ["Vilkår", "/vilkaar"], ["GDPR", "/personvern#gdpr"]] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "white")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                    >{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>© 2026 Reachr AS. Alle rettigheter forbeholdt.</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>Help@reachr.no</p>
        </div>
      </div>
    </footer>
  );
}
