"use client";

/**
 * reachr.no/tiktok — TikTok slideshow preview
 *
 * TikTok safe zones (9:16 · 405×720):
 *   Top      : 0–60px     (TikTok nav, always safe for logo)
 *   Right    : 325–405px  (Like/comment/share/follow buttons)
 *   Bottom   : 500–720px  (Username, caption, music ticker)
 *
 * All critical content → x: 24–318  ·  y: 60–490
 */

import Image from "next/image";
import { useState } from "react";

// ── Reachr Logo (from /public/logo.svg) ──────────────────────────────────────
function Logo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.svg" alt="Reachr" width={size} height={size} style={{ display: "block" }} />
      <span
        style={{
          fontFamily: "EB Garamond, Georgia, serif",
          fontSize: size * 0.7,
          fontWeight: 700,
          fontStyle: "italic",
          color: "#171717",
          lineHeight: 1,
        }}
      >
        Reachr
      </span>
    </div>
  );
}

// ── TikTok safe-zone overlay (dev helper, togglable) ──────────────────────────
function SafeZoneOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {/* Right danger zone */}
      <div
        className="absolute top-0 bottom-0 right-0"
        style={{ width: 80, background: "rgba(255,0,0,0.08)", borderLeft: "1px dashed rgba(255,0,0,0.3)" }}
      />
      {/* Bottom danger zone */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{ height: 220, background: "rgba(255,0,0,0.08)", borderTop: "1px dashed rgba(255,0,0,0.3)" }}
      />
      {/* Top danger zone */}
      <div
        className="absolute left-0 right-0 top-0"
        style={{ height: 60, background: "rgba(255,165,0,0.06)", borderBottom: "1px dashed rgba(255,165,0,0.3)" }}
      />
      {/* Safe zone label */}
      <div
        className="absolute text-center"
        style={{
          left: 0, right: 80, top: 60, bottom: 220,
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          paddingTop: 8,
        }}
      >
        <span style={{ fontSize: 9, background: "rgba(0,255,0,0.15)", color: "#09fe94", padding: "2px 6px", borderRadius: 4 }}>
          ✓ SAFE ZONE
        </span>
      </div>
    </div>
  );
}

// ── Slide shell (same cream bg + logo + dots for every serie) ─────────────────
function SlideShell({
  idx, total, children, showGuide,
}: {
  idx: number; total: number; children: React.ReactNode; showGuide: boolean;
}) {
  return (
    <div className="absolute inset-0 select-none" style={{ background: "#f2efe3" }}>
      {/* Subtle texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 80% 0%, #e8e4d800 0%, #ede9da60 100%)" }}
      />

      {/* ── LOGO — top-left, within safe x zone ── */}
      <div className="absolute" style={{ top: 28, left: 28 }}>
        <Logo size={28} />
      </div>

      {/* ── SLIDE DOTS — top-right but capped at x:318 ── */}
      <div
        className="absolute flex items-center gap-1.5"
        style={{ top: 36, right: 92 /* stays inside x:318 */ }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === idx ? 18 : 5, height: 5, borderRadius: 3,
              background: i === idx ? "#09fe94" : "#d8d3c5",
              transition: "width 0.25s",
            }}
          />
        ))}
      </div>

      {/* ── CONTENT (safe zone) ── */}
      <div
        className="absolute flex flex-col"
        style={{ top: 80, left: 28, right: 92, bottom: 240 }}
      >
        {children}
      </div>

      {/* ── BOTTOM BRAND STRIP — at ~490px, just above caption danger zone ── */}
      <div
        className="absolute"
        style={{ bottom: 232, left: 28, right: 92 }}
      >
        <div style={{ height: 1, background: "#d8d3c5", marginBottom: 10 }} />
        <p style={{ fontSize: 10, color: "#a09b8f", letterSpacing: "0.06em" }}>reachr.no</p>
      </div>

      {showGuide && <SafeZoneOverlay />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 1 — PROBLEM/LØSNING (Dramatisk storytelling, cream)
// Caption: "Salgsjobben tar for lang tid — vi fikser det."
// ─────────────────────────────────────────────────────────────────────────────
const s1Slides = [
  {
    tag: "⏱  Problemet",
    headline: "3 timer\nbortkastet\nhver dag.",
    body: "Gjennomsnittlig norsk selger bruker 3+ timer daglig på manuell leads-jakt.",
  },
  {
    tag: "😤  Kjenner du dette?",
    headline: "Google.\nExcel.\nLinkedIn.\nRotete.",
    body: "Spredte notater, manuelle lister, ingenting er koblet sammen.",
  },
  {
    tag: "⚡  Advarsel",
    headline: "Mens du\nsøker —\nlukker andre.",
    body: "Konkurrentene dine bruker smartere verktøy og vinner dealene du ikke rekker.",
  },
  {
    tag: "✦  Løsningen",
    headline: "250 000+\nnorske\nbedrifter.",
    body: "Søkbart på 10 sekunder. Direkte fra Brønnøysundregistrene. Klart til bruk.",
  },
  {
    tag: "🤖  AI gjør jobben",
    headline: "AI skriver.\nDu sender.\nKunden svarer.",
    body: "Personlige salgsmeldinger basert på din pitch og kundens profil — på sekunder.",
  },
  {
    tag: "🚀  Start i dag",
    headline: "Gratis.\nIngen\nbinding.",
    body: "Start på reachr.no og ha første lead-liste klar på 10 minutter.",
    cta: true,
  },
];

function S1Slide({ slide, idx, total, showGuide }: { slide: typeof s1Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {/* Tag */}
      <div
        style={{
          display: "inline-flex", alignSelf: "flex-start",
          background: "#09fe94", color: "#171717",
          fontSize: 11, fontWeight: 700,
          padding: "4px 12px", borderRadius: 99,
          marginBottom: 22,
        }}
      >
        {slide.tag}
      </div>

      {/* Headline */}
      <div style={{ flex: 1 }}>
        {slide.headline.split("\n").map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 52,
              fontWeight: 900,
              color: "#171717",
              lineHeight: 1.0,
              letterSpacing: "-2px",
            }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Body */}
      <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>
        {slide.body}
      </p>

      {/* CTA */}
      {slide.cta && (
        <div
          style={{
            marginTop: 20,
            background: "#09fe94",
            borderRadius: 14,
            padding: "14px 24px",
            fontWeight: 800,
            fontSize: 16,
            color: "#171717",
            display: "inline-block",
          }}
        >
          Start gratis →
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 2 — FEATURE SHOWCASE (Feature per slide, cream + card)
// Caption: "Se Reachr i aksjon — ett verktøy for hele salgsprosessen."
// ─────────────────────────────────────────────────────────────────────────────
const s2Slides = [
  {
    tag: "Reachr",
    title: "Salg som\nfungerer.",
    body: "Ett verktøy for å finne, kontakte og lukke deals — for norske selgere.",
    stat: null, statLabel: null,
  },
  {
    tag: "🔍 Leadsøk",
    title: "Finn din\nneste kunde.",
    body: "Søk og filtrer 250 000+ norske bedrifter på bransje, sted og omsetning.",
    stat: "250 000+", statLabel: "bedrifter klar til søk",
  },
  {
    tag: "📋 CRM Pipeline",
    title: "Full oversikt\nhver dag.",
    body: "Flytt leads gjennom pipeline fra første kontakt til signert kontrakt.",
    stat: "6 steg", statLabel: "fra søk til kunde",
  },
  {
    tag: "✦ AI-meldinger",
    title: "AI skriver,\ndu sender.",
    body: "Automatisk genererte e-poster og SMS tilpasset hvert lead basert på din pitch.",
    stat: "30 sek", statLabel: "til en ferdig melding",
  },
  {
    tag: "🔔 Oppfølging",
    title: "Ingen lead\ngår tapt.",
    body: "Varsler når det er på tide å ta kontakt igjen. Aldri mist en mulighet.",
    stat: "0", statLabel: "mistede oppfølginger",
  },
  {
    tag: "🚀 Kom i gang",
    title: "Prøv gratis\ni dag.",
    body: "3 dager gratis. Ingen kredittkort. Norsk support.",
    stat: null, statLabel: null, cta: true,
  },
];

function S2Slide({ slide, idx, total, showGuide }: { slide: typeof s2Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {/* Tag */}
      <div
        style={{
          display: "inline-flex", alignSelf: "flex-start",
          border: "1.5px solid #d8d3c5",
          color: "#6b6660",
          fontSize: 11, fontWeight: 600,
          padding: "4px 12px", borderRadius: 99,
          marginBottom: 22, background: "#faf8f2",
        }}
      >
        {slide.tag}
      </div>

      {/* Headline — EB Garamond editorial */}
      <div style={{ flex: 1 }}>
        {slide.title.split("\n").map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: "EB Garamond, Georgia, serif",
              fontSize: 58,
              fontWeight: 700,
              color: "#171717",
              lineHeight: 1.0,
              letterSpacing: "-0.5px",
            }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Body */}
      <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 18 }}>
        {slide.body}
      </p>

      {/* Stat card */}
      {slide.stat && (
        <div
          style={{
            marginTop: 20,
            background: "#faf8f2",
            border: "1.5px solid #d8d3c5",
            borderRadius: 16,
            padding: "14px 20px",
            display: "inline-block",
          }}
        >
          <p style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 36, fontWeight: 700, color: "#ff470a", lineHeight: 1 }}>
            {slide.stat}
          </p>
          <p style={{ fontSize: 11, color: "#6b6660", marginTop: 4 }}>{slide.statLabel}</p>
        </div>
      )}

      {/* CTA */}
      {"cta" in slide && slide.cta && (
        <div
          style={{
            marginTop: 20,
            background: "#09fe94",
            borderRadius: 14,
            padding: "14px 24px",
            fontWeight: 800,
            fontSize: 16,
            color: "#171717",
            textAlign: "center" as const,
          }}
        >
          reachr.no — start gratis →
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 3 — STORE TALL (Massive stats, cream bakgrunn)
// Caption: "Tallene bak Reachr — norsk B2B-salg i praksis."
// ─────────────────────────────────────────────────────────────────────────────
const s3Slides = [
  { number: "250 000", unit: "+", label: "norske bedrifter\nklar til søk", color: "#09fe94" },
  { number: "10",      unit: "sek", label: "til første\nkvalifiserte lead", color: "#09fe94" },
  { number: "3",       unit: "×",   label: "flere møter\nbooket i snitt", color: "#ff470a" },
  { number: "30",      unit: "sek", label: "til ferdig\nAI-melding", color: "#09fe94" },
  { number: "100",     unit: "%",   label: "norsk og\nGDPR-trygt", color: "#09fe94" },
  { number: "0",       unit: "kr",  label: "å starte\ni dag", color: "#ff470a" },
];

function S3Slide({ slide, idx, total, showGuide }: { slide: typeof s3Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Big number */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 16 }}>
          <span
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 88,
              fontWeight: 900,
              color: "#171717",
              lineHeight: 0.9,
              letterSpacing: "-3px",
            }}
          >
            {slide.number}
          </span>
          <span
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 36,
              fontWeight: 900,
              color: slide.color,
              marginTop: 10,
            }}
          >
            {slide.unit}
          </span>
        </div>

        {/* Divider with color accent */}
        <div style={{ width: 60, height: 4, borderRadius: 2, background: slide.color, marginBottom: 20 }} />

        {/* Label */}
        <p
          style={{
            fontFamily: "EB Garamond, Georgia, serif",
            fontSize: 28,
            fontWeight: 600,
            color: "#6b6660",
            lineHeight: 1.35,
            whiteSpace: "pre-line",
          }}
        >
          {slide.label}
        </p>
      </div>

      {/* Decorative large number bg */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: 240, right: -10,
          fontSize: 160,
          fontWeight: 900,
          color: "#d8d3c5",
          lineHeight: 1,
          opacity: 0.3,
          userSelect: "none",
          fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "-6px",
        }}
      >
        {slide.number}
      </div>
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 4 — SITAT / HOOK (EB Garamond quotes, cream)
// Caption: "Salg handler ikke om å jobbe hardere — men smartere."
// ─────────────────────────────────────────────────────────────────────────────
const s4Slides = [
  {
    type: "quote" as const,
    quote: "Den beste selgeren vinner ikke med flest samtaler.",
    attribution: "— med best tid brukt.",
  },
  {
    type: "statement" as const,
    line1: "Du trenger ikke",
    line2: "ringe 100 bedrifter.",
    line3: "Du trenger å",
    line4: "ringe de riktige 10.",
  },
  {
    type: "quote" as const,
    quote: "Hvert minutt brukt på å lete etter kunder er et minutt du ikke selger.",
    attribution: "— Reachr løser dette.",
  },
  {
    type: "statement" as const,
    line1: "Automatiser",
    line2: "leting.",
    line3: "Bruk tiden på",
    line4: "lukking.",
  },
  {
    type: "quote" as const,
    quote: "Norske selgere fortjener et verktøy laget for det norske markedet.",
    attribution: "— bygget i Norge, for Norge.",
  },
  {
    type: "cta" as const,
    quote: "Prøv Reachr gratis.",
    attribution: "reachr.no →",
  },
];

function S4Slide({ slide, idx, total, showGuide }: { slide: typeof s4Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {slide.type === "quote" || slide.type === "cta" ? (
          <>
            {/* Opening quote mark */}
            <p style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 64, color: "#09fe94", lineHeight: 0.7, marginBottom: 16 }}>"</p>
            <p
              style={{
                fontFamily: "EB Garamond, Georgia, serif",
                fontSize: slide.type === "cta" ? 52 : 32,
                fontWeight: 600,
                color: "#171717",
                lineHeight: 1.2,
                marginBottom: 20,
              }}
            >
              {slide.quote}
            </p>
            <p
              style={{
                fontFamily: "EB Garamond, Georgia, serif",
                fontSize: slide.type === "cta" ? 24 : 18,
                fontStyle: "italic",
                color: slide.type === "cta" ? "#ff470a" : "#a09b8f",
              }}
            >
              {slide.attribution}
            </p>
          </>
        ) : (
          /* Statement slides */
          <div>
            {"line1" in slide && [slide.line1, slide.line2, slide.line3, slide.line4].map((line, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "EB Garamond, Georgia, serif",
                  fontSize: 46,
                  fontWeight: i % 2 === 0 ? 400 : 700,
                  fontStyle: i % 2 === 0 ? "italic" : "normal",
                  color: i % 2 === 0 ? "#6b6660" : "#171717",
                  lineHeight: 1.1,
                }}
              >
                {line}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Accent line decoration */}
      <div style={{ width: 40, height: 3, borderRadius: 2, background: "#09fe94", marginBottom: 8 }} />
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 5 — TIPS & VERDI (Checklist / list, cream)
// Caption: "5 grunner til at norske selgere velger Reachr."
// ─────────────────────────────────────────────────────────────────────────────
const s5Slides = [
  {
    eyebrow: "Hvorfor Reachr?",
    title: "5 grunner til\nå bytte nå.",
    items: null, cta: false,
  },
  {
    eyebrow: "01 / Tilgang",
    title: null,
    items: ["250 000+ norske bedrifter", "Direkte fra Brønnøysund", "Alltid oppdatert"],
    cta: false,
  },
  {
    eyebrow: "02 / Hastighet",
    title: null,
    items: ["Første lead på 10 sekunder", "AI-melding på 30 sekunder", "Pipeline klar på 2 minutter"],
    cta: false,
  },
  {
    eyebrow: "03 / AI",
    title: null,
    items: ["Personlige e-poster automatisk", "SMS-utsendelse innebygd", "Tilpasset din salgspitch"],
    cta: false,
  },
  {
    eyebrow: "04 / Oppfølging",
    title: null,
    items: ["Varsler når leads trenger kontakt", "CRM pipeline med full oversikt", "Aldri mist en mulighet"],
    cta: false,
  },
  {
    eyebrow: "05 / Kom i gang",
    title: "Gratis å starte.",
    items: ["✓  3 dager gratis prøveperiode", "✓  Ingen kredittkort nødvendig", "✓  Norsk support inkludert"],
    cta: true,
  },
];

function S5Slide({ slide, idx, total, showGuide }: { slide: typeof s5Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {/* Eyebrow */}
      <p
        style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          color: "#ff470a", marginBottom: 16,
        }}
      >
        {slide.eyebrow}
      </p>

      {/* Title if present */}
      {slide.title && (
        <div style={{ flex: slide.items ? 0 : 1 }}>
          {slide.title.split("\n").map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 50,
                fontWeight: 900,
                color: "#171717",
                lineHeight: 1.0,
                letterSpacing: "-1.5px",
              }}
            >
              {line}
            </p>
          ))}
        </div>
      )}

      {/* Items list */}
      {slide.items && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16, marginTop: slide.title ? 24 : 0 }}>
          {slide.items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: "#09fe94",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 800, color: "#171717" }}>
                  {slide.items && item.startsWith("✓") ? "✓" : i + 1}
                </span>
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#171717", lineHeight: 1.2 }}>
                {item.replace("✓  ", "")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      {slide.cta && (
        <div
          style={{
            marginTop: 20,
            background: "#09fe94",
            borderRadius: 14,
            padding: "14px 24px",
            fontWeight: 800,
            fontSize: 16,
            color: "#171717",
            textAlign: "center" as const,
          }}
        >
          reachr.no — start gratis →
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE-KONFIG
// ─────────────────────────────────────────────────────────────────────────────
const SERIES = [
  {
    id: 0, name: "Problem/Løsning",
    caption: "Salgsjobben tar for lang tid — vi fikser det.",
    slides: s1Slides,
    Renderer: S1Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }>,
  },
  {
    id: 1, name: "Feature showcase",
    caption: "Se Reachr i aksjon — ett verktøy for hele salgsprosessen.",
    slides: s2Slides,
    Renderer: S2Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }>,
  },
  {
    id: 2, name: "Store tall",
    caption: "Tallene bak Reachr — norsk B2B-salg i praksis.",
    slides: s3Slides,
    Renderer: S3Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }>,
  },
  {
    id: 3, name: "Sitat / Hook",
    caption: "Salg handler ikke om å jobbe hardere — men smartere.",
    slides: s4Slides,
    Renderer: S4Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }>,
  },
  {
    id: 4, name: "Tips & Verdi",
    caption: "5 grunner til at norske selgere velger Reachr.",
    slides: s5Slides,
    Renderer: S5Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }>,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";

export default function TiktokPage() {
  const [seriesIdx, setSeriesIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  const series = SERIES[seriesIdx];
  const { Renderer } = series;
  const total = series.slides.length;

  function changeSeries(i: number) {
    setSeriesIdx(i);
    setSlideIdx(0);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-5 py-12 px-4"
      style={{ background: "#1a1a1a", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Header */}
      <p style={{ color: "#555", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        TikTok Slideshow · 9×16 · Lys krem-tema
      </p>

      {/* Serie tabs */}
      <div className="flex flex-wrap justify-center gap-2 max-w-lg">
        {SERIES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => changeSeries(i)}
            style={{
              padding: "6px 16px", borderRadius: 99,
              fontSize: 12, fontWeight: 600,
              border: "1.5px solid",
              borderColor: i === seriesIdx ? "#09fe94" : "#2a2a2a",
              background: i === seriesIdx ? "#09fe94" : "transparent",
              color: i === seriesIdx ? "#171717" : "#666",
              cursor: "pointer",
              transition: "all 0.18s",
            }}
          >
            {i + 1}. {s.name}
          </button>
        ))}
      </div>

      {/* Caption */}
      <p style={{ color: "#555", fontSize: 13, fontStyle: "italic", textAlign: "center", maxWidth: 380 }}>
        "{series.caption}"
      </p>

      {/* ── 9:16 slide canvas ── */}
      <div
        style={{
          width: 405, height: 720,
          borderRadius: 24,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 0 80px rgba(0,0,0,0.8), 0 0 0 1px #2a2a2a",
          flexShrink: 0,
        }}
      >
        <Renderer slide={series.slides[slideIdx]} idx={slideIdx} total={total} showGuide={showGuide} />
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSlideIdx((i) => Math.max(0, i - 1))}
          disabled={slideIdx === 0}
          style={{
            padding: "10px 22px", borderRadius: 12,
            fontSize: 13, fontWeight: 600,
            background: slideIdx === 0 ? "#111" : "#2a2a2a",
            color: slideIdx === 0 ? "#333" : "#fff",
            border: "1.5px solid #333",
            cursor: slideIdx === 0 ? "not-allowed" : "pointer",
          }}
        >
          ← Forrige
        </button>

        <div className="flex gap-1.5">
          {series.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              style={{
                width: i === slideIdx ? 20 : 8, height: 8,
                borderRadius: 4,
                background: i === slideIdx ? "#09fe94" : "#333",
                border: "none", cursor: "pointer",
                transition: "width 0.2s",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setSlideIdx((i) => Math.min(total - 1, i + 1))}
          disabled={slideIdx === total - 1}
          style={{
            padding: "10px 22px", borderRadius: 12,
            fontSize: 13, fontWeight: 600,
            background: slideIdx === total - 1 ? "#111" : "#09fe94",
            color: slideIdx === total - 1 ? "#333" : "#171717",
            border: "1.5px solid #333",
            cursor: slideIdx === total - 1 ? "not-allowed" : "pointer",
          }}
        >
          Neste →
        </button>
      </div>

      {/* Dev tools */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowGuide((v) => !v)}
          style={{
            padding: "6px 16px", borderRadius: 99,
            fontSize: 11, fontWeight: 600,
            background: showGuide ? "#ff470a22" : "#2a2a2a",
            color: showGuide ? "#ff470a" : "#666",
            border: `1.5px solid ${showGuide ? "#ff470a44" : "#333"}`,
            cursor: "pointer",
          }}
        >
          {showGuide ? "⚠ Safe zone: på" : "Safe zone guide"}
        </button>

        <p style={{ color: "#333", fontSize: 11 }}>
          Høyreklikk på slide → Inspect → «Capture node screenshot»
        </p>
      </div>
    </div>
  );
}
