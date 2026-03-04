"use client";
import Link from "next/link";
import { Zap } from "lucide-react";

export function Navbar() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid #E5E7EB",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "0 24px", height: 68,
        display: "flex", alignItems: "center",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, backgroundColor: "#22C55E", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: "#0F1729", letterSpacing: "-0.5px" }}>Reachr</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32, flex: 1, justifyContent: "center" }}>
          {[["#features","Funksjoner"],["#pricing","Priser"],["#","Om oss"],["#","Kontakt"]].map(([href,label]) => (
            <a key={label} href={href} style={{ fontSize: 14, fontWeight: 500, color: "#6B7280", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#111827")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6B7280")}
            >{label}</a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Link href="/login" style={{
            fontSize: 14, fontWeight: 600, color: "#374151", textDecoration: "none",
            padding: "8px 16px", borderRadius: 8,
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >Logg inn</Link>
          <Link href="/register" style={{
            fontSize: 14, fontWeight: 700, color: "white", textDecoration: "none",
            padding: "9px 20px", borderRadius: 10, backgroundColor: "#22C55E",
            boxShadow: "0 1px 4px rgba(34,197,94,0.3)",
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#16A34A")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#22C55E")}
          >Start gratis</Link>
        </div>
      </div>
    </nav>
  );
}
