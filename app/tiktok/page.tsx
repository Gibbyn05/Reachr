"use client";

import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 1 — MØRK DRAMATISK
// Tema: Svart bakgrunn · Grønn aksent · Store hvite overskrifter
// Caption: "Salgsjobben tar for lang tid — vi fikser det."
// ─────────────────────────────────────────────────────────────────────────────

const serie1 = [
  {
    eyebrow: "⏱  Problemet",
    big: ["3 timer", "bortkastet", "hver dag."],
    sub: "Gjennomsnittlig norsk selger bruker 3+ timer daglig på å finne og kvalifisere leads manuelt.",
  },
  {
    eyebrow: "😤  Kjenner du deg igjen?",
    big: ["Manuelt.", "Rotete.", "Effektivitets-", "dreper."],
    sub: "Google. LinkedIn. Excel. Ringelister. Spredte notater. Alt er overalt.",
  },
  {
    eyebrow: "⚡  Advarsel",
    big: ["Mens du", "søker —", "lukker andre."],
    sub: "Konkurrentene dine jobber smartere og vinner dealene du ikke rakk å kontakte.",
  },
  {
    eyebrow: "✦  Løsningen",
    big: ["250 000+", "norske", "bedrifter."],
    sub: "Søkbart på 10 sekunder. Direkte fra Brønnøysundregistrene.",
  },
  {
    eyebrow: "🤖  AI gjør jobben",
    big: ["AI skriver.", "Du sender.", "Kunden", "svarer."],
    sub: "Personlige salgsmeldinger generert basert på din pitch og kundens profil.",
  },
  {
    eyebrow: "🚀  Start nå",
    big: ["Gratis.", "Ingen", "binding."],
    sub: "Bare leads.",
    cta: "reachr.no →",
  },
];

function S1Slide({ slide, idx, total }: { slide: typeof serie1[0]; idx: number; total: number }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between px-10 py-12 select-none"
      style={{ background: "#0f0f0f" }}
    >
      {/* Grid lines dekor */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="absolute inset-y-0" style={{ left: `${i * 20}%`, width: 1, background: "#fff" }} />
        ))}
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="absolute inset-x-0" style={{ top: `${i * (100 / 8)}%`, height: 1, background: "#fff" }} />
        ))}
      </div>

      {/* Grønn glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, #09fe9415 0%, transparent 70%)",
          bottom: -60, right: -60,
        }}
      />

      <div>
        {/* Slide teller */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === idx ? 24 : 6, height: 4,
                  borderRadius: 2,
                  background: i === idx ? "#09fe94" : "#333",
                  transition: "width 0.3s",
                }}
              />
            ))}
          </div>
          <span style={{ color: "#444", fontSize: 11, letterSpacing: "0.08em" }}>
            {idx + 1}/{total}
          </span>
        </div>

        {/* Eyebrow */}
        <p style={{ color: "#09fe94", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 20 }}>
          {slide.eyebrow}
        </p>

        {/* Headline */}
        <div style={{ marginBottom: 28 }}>
          {slide.big.map((line, i) => (
            <p
              key={i}
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.05,
                letterSpacing: "-1.5px",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Sub */}
        <p style={{ color: "#666", fontSize: 14, lineHeight: 1.65, maxWidth: 300 }}>
          {slide.sub}
        </p>
      </div>

      <div className="flex items-end justify-between">
        {/* CTA pill */}
        {slide.cta ? (
          <div
            style={{
              background: "#09fe94",
              color: "#171717",
              fontSize: 16,
              fontWeight: 800,
              padding: "14px 28px",
              borderRadius: 16,
            }}
          >
            {slide.cta}
          </div>
        ) : (
          <div />
        )}
        {/* Branding */}
        <span style={{ color: "#333", fontSize: 12, fontStyle: "italic", fontFamily: "EB Garamond, Georgia, serif" }}>
          reachr.no
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 2 — LYS EDITORIAL
// Tema: Krem #f2efe3 bakgrunn · Oransje aksent · EB Garamond display
// Caption: "Norsk B2B-salg gjort enkelt — se Reachr i aksjon."
// ─────────────────────────────────────────────────────────────────────────────

const serie2 = [
  { tag: "Norsk B2B-salg", title: "Salg som\nfungerer.", body: "Møt Reachr — plattformen norske selgere bruker for å finne, kontakte og lukke deals raskere.", type: "intro" as const },
  { tag: "🔍 Leadsøk", title: "Finn dine\nneste kunder.", body: "Søk blant 250 000+ norske bedrifter fra Brønnøysundregistrene. Filtrer på bransje, sted og omsetning.", type: "feature" as const, stat: "250 000+", statLabel: "bedrifter tilgjengelig" },
  { tag: "📋 CRM", title: "Full oversikt\nover pipeline.", body: "Hold styr på alle leads fra første kontakt til lukket deal — i én enkel pipeline.", type: "feature" as const, stat: "6", statLabel: "pipeline-steg" },
  { tag: "✦ AI", title: "AI skriver\nfor deg.", body: "Generer personlige salgsmeldinger basert på kundens profil og din pitch. E-post og SMS.", type: "feature" as const, stat: "30 sek", statLabel: "til ferdig melding" },
  { tag: "🔔 Varsler", title: "Ingen lead\ngår tapt.", body: "Automatiske varsler når leads trenger oppfølging. Aldri gå glipp av en mulighet igjen.", type: "feature" as const, stat: "0", statLabel: "mistede muligheter" },
  { tag: "🚀 Start nå", title: "Prøv gratis\ni dag.", body: "3 dagers prøveperiode. Ingen kredittkort. Ingen binding.", type: "cta" as const },
];

function S2Slide({ slide, idx, total }: { slide: typeof serie2[0]; idx: number; total: number }) {
  const isCta = slide.type === "cta";
  const isIntro = slide.type === "intro";
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between px-9 py-11 select-none"
      style={{ background: "#f2efe3" }}
    >
      {/* Dekor sirkel */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 280, height: 280, borderRadius: "50%",
          border: "1px solid #d8d3c5",
          top: -80, right: -80, opacity: 0.6,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 200, height: 200, borderRadius: "50%",
          border: "1px solid #d8d3c5",
          top: -40, right: -40, opacity: 0.5,
        }}
      />

      <div>
        {/* Slide teller */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === idx ? 22 : 6, height: 4,
                  borderRadius: 2,
                  background: i === idx ? "#ff470a" : "#d8d3c5",
                  transition: "width 0.3s",
                }}
              />
            ))}
          </div>
          <span
            style={{
              background: "#ff470a",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 99,
              letterSpacing: "0.03em",
            }}
          >
            {slide.tag}
          </span>
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "EB Garamond, Georgia, serif",
            fontSize: isIntro ? 62 : 54,
            fontWeight: 700,
            color: "#171717",
            lineHeight: 1.05,
            letterSpacing: "-0.5px",
            whiteSpace: "pre-line",
            marginBottom: 20,
          }}
        >
          {slide.title}
        </h2>

        {/* Body */}
        <p style={{ color: "#6b6660", fontSize: 14, lineHeight: 1.7, maxWidth: 300 }}>
          {slide.body}
        </p>
      </div>

      <div>
        {/* Stat */}
        {"stat" in slide && slide.stat && (
          <div
            style={{
              background: "#faf8f2",
              border: "1.5px solid #d8d3c5",
              borderRadius: 20,
              padding: "16px 24px",
              marginBottom: 20,
              display: "inline-block",
            }}
          >
            <p style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 40, fontWeight: 700, color: "#ff470a", lineHeight: 1 }}>
              {slide.stat}
            </p>
            <p style={{ color: "#6b6660", fontSize: 12, marginTop: 4 }}>{slide.statLabel}</p>
          </div>
        )}

        {/* CTA */}
        {isCta && (
          <div
            style={{
              background: "#09fe94",
              color: "#171717",
              fontSize: 18,
              fontWeight: 800,
              padding: "18px 0",
              borderRadius: 18,
              textAlign: "center",
              fontFamily: "EB Garamond, Georgia, serif",
              fontStyle: "italic",
              letterSpacing: "-0.3px",
              marginBottom: 16,
            }}
          >
            reachr.no — start gratis →
          </div>
        )}

        {/* Branding */}
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 18, fontStyle: "italic", fontWeight: 700, color: "#171717" }}>
            Reachr
          </span>
          <span style={{ color: "#a09b8f", fontSize: 11 }}>reachr.no</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 3 — GRØNN IMPACT
// Tema: Hel grønn #09fe94 bakgrunn · Mørk tekst · Massive tall
// Caption: "Tallene snakker for seg selv."
// ─────────────────────────────────────────────────────────────────────────────

const serie3 = [
  { number: "250 000", unit: "+", label: "norske bedrifter\nklar til å søke i" },
  { number: "10", unit: "sek", label: "til første\nkvalifiserte lead" },
  { number: "3", unit: "×", label: "flere meetings\nbooket i snitt" },
  { number: "30", unit: "sek", label: "til en ferdig\nAI-melding" },
  { number: "100", unit: "%", label: "norsk og\nGDPR-trygt" },
  { number: "0", unit: "kr", label: "å komme\ni gang i dag" },
];

function S3Slide({ slide, idx, total }: { slide: typeof serie3[0]; idx: number; total: number }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center select-none"
      style={{ background: "#09fe94" }}
    >
      {/* Subtle radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 70% 30%, #00e882 0%, transparent 60%)" }}
      />

      {/* Slide teller øverst */}
      <div className="absolute top-10 left-10 right-10 flex items-center justify-between">
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === idx ? 22 : 6, height: 4, borderRadius: 2,
                background: i === idx ? "#171717" : "#171717",
                opacity: i === idx ? 1 : 0.2,
                transition: "width 0.3s",
              }}
            />
          ))}
        </div>
        <span style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 15, fontStyle: "italic", fontWeight: 700, color: "#171717" }}>
          Reachr
        </span>
      </div>

      {/* Nummer */}
      <div className="relative z-10 text-center px-8">
        <div className="flex items-start justify-center">
          <span
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 110,
              fontWeight: 900,
              color: "#171717",
              lineHeight: 0.9,
              letterSpacing: "-4px",
            }}
          >
            {slide.number}
          </span>
          <span
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 44,
              fontWeight: 900,
              color: "#171717",
              marginTop: 12,
              marginLeft: 4,
              opacity: 0.7,
            }}
          >
            {slide.unit}
          </span>
        </div>
        <p
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#171717",
            marginTop: 20,
            lineHeight: 1.4,
            opacity: 0.75,
            whiteSpace: "pre-line",
          }}
        >
          {slide.label}
        </p>
      </div>

      {/* Bunn */}
      <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center">
        <span style={{ fontSize: 11, color: "#171717", opacity: 0.5 }}>reachr.no</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#171717", opacity: 0.5 }}>
          {idx + 1} / {total}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 4 — ORANSJE ENERGI
// Tema: Oransje #ff470a bakgrunn · Hvit tekst · Punchy og rask
// Caption: "Slutt å jakte leads manuelt — vi gjør det for deg."
// ─────────────────────────────────────────────────────────────────────────────

const serie4 = [
  { line1: "Slutt å jakte", line2: "leads manuelt.", emoji: "🎯" },
  { line1: "Vi har", line2: "250 000+", line3: "norske bedrifter", line4: "klare for deg.", emoji: "🇳🇴" },
  { line1: "Pipeline som", line2: "viser deg", line3: "nøyaktig hva", line4: "som må gjøres.", emoji: "📋" },
  { line1: "AI-melding", line2: "skrevet på", line3: "30 sekunder.", line4: "Ikke spøk.", emoji: "🤖" },
  { line1: "Norsk.", line2: "Trygt.", line3: "Enkelt.", line4: "GDPR-compliant.", emoji: "✅" },
  { line1: "reachr.no", line2: "Start nå.", line3: "Det tar", line4: "2 minutter.", emoji: "⚡" },
];

function S4Slide({ slide, idx, total }: { slide: typeof serie4[0]; idx: number; total: number }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between px-10 py-12 select-none"
      style={{ background: "#ff470a" }}
    >
      {/* Mønster-dekor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: "absolute", bottom: -100, right: -100,
            width: 350, height: 350, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: -60, right: -60,
            width: 250, height: 250, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>

      <div>
        {/* Teller */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === idx ? 22 : 6, height: 4, borderRadius: 2,
                  background: "rgba(255,255,255,0.9)",
                  opacity: i === idx ? 1 : 0.3,
                  transition: "width 0.3s",
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 24 }}>{slide.emoji}</span>
        </div>

        {/* Tekst */}
        <div>
          {[slide.line1, slide.line2, "line3" in slide ? slide.line3 : null, "line4" in slide ? slide.line4 : null]
            .filter(Boolean)
            .map((line, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 48,
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.05,
                  letterSpacing: "-1.5px",
                  opacity: i === 0 ? 1 : i === 1 ? 1 : 0.85,
                }}
              >
                {line}
              </p>
            ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: "EB Garamond, Georgia, serif",
            fontSize: 20,
            fontStyle: "italic",
            fontWeight: 700,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          Reachr
        </span>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{idx + 1}/{total}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 5 — MØRK MINIMALISTISK
// Tema: Mørk #171717 bakgrunn · Gyllen #ffad0a aksent · EB Garamond editorial
// Caption: "Salg handler ikke om å jobbe hardere — men smartere."
// ─────────────────────────────────────────────────────────────────────────────

const serie5 = [
  {
    quote: "Den beste selgeren vinner ikke med flest samtaler.",
    attribution: "— med best tid brukt.",
    type: "quote" as const,
  },
  {
    label: "Reachr gir deg",
    items: ["250 000+ bedrifter å søke i", "Automatisk oppfølging", "AI-genererte meldinger", "Full CRM-pipeline"],
    type: "list" as const,
  },
  {
    big: "10",
    unit: "minutter",
    body: "Det er alt som trengs for å gå fra null til første lead-liste.",
    type: "stat" as const,
  },
  {
    big: "3×",
    unit: "mer",
    body: "Selgere på Reachr booker tre ganger så mange møter som de som jobber manuelt.",
    type: "stat" as const,
  },
  {
    quote: "Hvert minutt du bruker på å lete etter kunder, er et minutt du ikke bruker på å selge.",
    attribution: "— Reachr løser dette.",
    type: "quote" as const,
  },
  {
    label: "Kom i gang",
    cta: "reachr.no",
    sub: "Gratis · Ingen kredittkort · Norsk support",
    type: "cta" as const,
  },
];

function S5Slide({ slide, idx, total }: { slide: typeof serie5[0]; idx: number; total: number }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between px-10 py-12 select-none"
      style={{ background: "#171717" }}
    >
      {/* Dekor — horisontal linje */}
      <div className="absolute left-0 right-0 pointer-events-none" style={{ top: "45%", height: 1, background: "rgba(255,173,10,0.08)" }} />

      <div>
        {/* Teller */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === idx ? 22 : 6, height: 4, borderRadius: 2,
                  background: i === idx ? "#ffad0a" : "#2a2a2a",
                  transition: "width 0.3s",
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: "EB Garamond, Georgia, serif",
              fontSize: 16,
              fontStyle: "italic",
              color: "#ffad0a",
              fontWeight: 600,
            }}
          >
            Reachr
          </span>
        </div>

        {/* QUOTE */}
        {slide.type === "quote" && (
          <div>
            <div style={{ color: "#ffad0a", fontSize: 48, lineHeight: 1, marginBottom: 20, opacity: 0.6 }}>"</div>
            <p
              style={{
                fontFamily: "EB Garamond, Georgia, serif",
                fontSize: 34,
                fontWeight: 600,
                color: "#e8e4d8",
                lineHeight: 1.25,
                letterSpacing: "-0.3px",
                marginBottom: 24,
              }}
            >
              {slide.quote}
            </p>
            <p style={{ color: "#ffad0a", fontSize: 16, fontStyle: "italic", fontFamily: "EB Garamond, Georgia, serif" }}>
              {slide.attribution}
            </p>
          </div>
        )}

        {/* LIST */}
        {slide.type === "list" && (
          <div>
            <p style={{ color: "#6b6660", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>
              {slide.label}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {slide.items.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffad0a", flexShrink: 0 }} />
                  <p style={{ color: "#e8e4d8", fontSize: 22, fontFamily: "EB Garamond, Georgia, serif", fontWeight: 500 }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAT */}
        {slide.type === "stat" && (
          <div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 24 }}>
              <span style={{ fontFamily: "Inter, system-ui", fontSize: 96, fontWeight: 900, color: "#ffad0a", lineHeight: 0.9, letterSpacing: "-3px" }}>
                {slide.big}
              </span>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#ffad0a", opacity: 0.6, marginBottom: 8 }}>
                {slide.unit}
              </span>
            </div>
            <p style={{ color: "#6b6660", fontSize: 15, lineHeight: 1.65 }}>{slide.body}</p>
          </div>
        )}

        {/* CTA */}
        {slide.type === "cta" && (
          <div>
            <p style={{ color: "#6b6660", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
              {slide.label}
            </p>
            <div
              style={{
                background: "#ffad0a",
                borderRadius: 20,
                padding: "24px 32px",
                marginBottom: 20,
              }}
            >
              <p style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 52, fontStyle: "italic", fontWeight: 700, color: "#171717", lineHeight: 1 }}>
                {slide.cta}
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#171717", opacity: 0.6, marginTop: 8 }}>
                START GRATIS →
              </p>
            </div>
            <p style={{ color: "#444", fontSize: 12, textAlign: "center" }}>{slide.sub}</p>
          </div>
        )}
      </div>

      <div style={{ color: "#2a2a2a", fontSize: 11 }}>
        {idx + 1} / {total}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE-KONFIG
// ─────────────────────────────────────────────────────────────────────────────

const seriesMeta = [
  {
    id: 0,
    name: "Mørk dramatisk",
    caption: "Salgsjobben tar for lang tid — vi fikser det.",
    slides: serie1,
    Renderer: S1Slide as React.FC<{ slide: any; idx: number; total: number }>,
  },
  {
    id: 1,
    name: "Lys editorial",
    caption: "Norsk B2B-salg gjort enkelt — se Reachr i aksjon.",
    slides: serie2,
    Renderer: S2Slide as React.FC<{ slide: any; idx: number; total: number }>,
  },
  {
    id: 2,
    name: "Grønn impact",
    caption: "Tallene snakker for seg selv.",
    slides: serie3,
    Renderer: S3Slide as React.FC<{ slide: any; idx: number; total: number }>,
  },
  {
    id: 3,
    name: "Oransje energi",
    caption: "Slutt å jakte leads manuelt — vi gjør det for deg.",
    slides: serie4,
    Renderer: S4Slide as React.FC<{ slide: any; idx: number; total: number }>,
  },
  {
    id: 4,
    name: "Mørk minimalistisk",
    caption: "Salg handler ikke om å jobbe hardere — men smartere.",
    slides: serie5,
    Renderer: S5Slide as React.FC<{ slide: any; idx: number; total: number }>,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

export default function TiktokPage() {
  const [seriesIdx, setSeriesIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);

  const series = seriesMeta[seriesIdx];
  const { Renderer } = series;
  const total = series.slides.length;

  function changeSeries(i: number) {
    setSeriesIdx(i);
    setSlideIdx(0);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-5 py-12 px-4"
      style={{ background: "#111", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="text-center">
        <p style={{ color: "#555", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          TikTok Slideshow · 9×16
        </p>
      </div>

      {/* Serie-velger */}
      <div className="flex flex-wrap justify-center gap-2 max-w-md">
        {seriesMeta.map((s, i) => (
          <button
            key={s.id}
            onClick={() => changeSeries(i)}
            style={{
              padding: "6px 16px",
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 600,
              border: "1.5px solid",
              borderColor: i === seriesIdx ? "#fff" : "#2a2a2a",
              background: i === seriesIdx ? "#fff" : "transparent",
              color: i === seriesIdx ? "#111" : "#666",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {i + 1}. {s.name}
          </button>
        ))}
      </div>

      {/* Caption */}
      <p style={{ color: "#555", fontSize: 13, fontStyle: "italic", textAlign: "center", maxWidth: 360 }}>
        "{series.caption}"
      </p>

      {/* 9:16 Slide */}
      <div
        style={{
          width: 405,
          height: 720,
          borderRadius: 28,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 0 100px rgba(0,0,0,0.9), 0 0 0 1px #222",
          flexShrink: 0,
        }}
      >
        <Renderer slide={series.slides[slideIdx]} idx={slideIdx} total={total} />
      </div>

      {/* Navigasjon */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSlideIdx((i) => Math.max(0, i - 1))}
          disabled={slideIdx === 0}
          style={{
            padding: "10px 22px", borderRadius: 12, fontSize: 13, fontWeight: 600,
            background: slideIdx === 0 ? "#1a1a1a" : "#2a2a2a",
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
                border: "none",
                cursor: "pointer",
                transition: "width 0.2s",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setSlideIdx((i) => Math.min(total - 1, i + 1))}
          disabled={slideIdx === total - 1}
          style={{
            padding: "10px 22px", borderRadius: 12, fontSize: 13, fontWeight: 600,
            background: slideIdx === total - 1 ? "#1a1a1a" : "#09fe94",
            color: slideIdx === total - 1 ? "#333" : "#171717",
            border: "1.5px solid #333",
            cursor: slideIdx === total - 1 ? "not-allowed" : "pointer",
          }}
        >
          Neste →
        </button>
      </div>

      {/* Export hint */}
      <p style={{ color: "#333", fontSize: 11, textAlign: "center", maxWidth: 340, lineHeight: 1.6 }}>
        Tips: Høyreklikk på slide → «Inspect» → «Capture node screenshot» i DevTools for å eksportere som PNG til TikTok.
      </p>
    </div>
  );
}
