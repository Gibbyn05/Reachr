"use client";

/**
 * reachr.no/tiktok — TikTok slideshow preview
 *
 * TikTok safe zones (9:16 · 405×720):
 *   Top      : 0–60px     (TikTok nav)
 *   Right    : 325–405px  (Like/comment/share/follow buttons)
 *   Bottom   : 500–720px  (Username, caption, music ticker)
 *
 * All critical content → x: 24–318  ·  y: 60–490
 */

import Image from "next/image";
import { useState } from "react";
import React from "react";

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

function SafeZoneOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <div className="absolute top-0 bottom-0 right-0" style={{ width: 80, background: "rgba(255,0,0,0.08)", borderLeft: "1px dashed rgba(255,0,0,0.3)" }} />
      <div className="absolute left-0 right-0 bottom-0" style={{ height: 220, background: "rgba(255,0,0,0.08)", borderTop: "1px dashed rgba(255,0,0,0.3)" }} />
      <div className="absolute left-0 right-0 top-0" style={{ height: 60, background: "rgba(255,165,0,0.06)", borderBottom: "1px dashed rgba(255,165,0,0.3)" }} />
      <div className="absolute text-center" style={{ left: 0, right: 80, top: 60, bottom: 220, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 8 }}>
        <span style={{ fontSize: 9, background: "rgba(0,255,0,0.15)", color: "#09fe94", padding: "2px 6px", borderRadius: 4 }}>✓ SAFE ZONE</span>
      </div>
    </div>
  );
}

function SlideShell({ idx, total, children, showGuide, dark }: { idx: number; total: number; children: React.ReactNode; showGuide: boolean; dark?: boolean }) {
  const bg = dark ? "#171717" : "#f2efe3";
  const logoTextColor = dark ? "#f2efe3" : "#171717";
  return (
    <div className="absolute inset-0 select-none" style={{ background: bg }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: dark ? "radial-gradient(ellipse at 20% 100%, #09fe9408 0%, transparent 70%)" : "radial-gradient(ellipse at 80% 0%, #e8e4d800 0%, #ede9da60 100%)" }} />

      {/* LOGO */}
      <div className="absolute" style={{ top: 28, left: 28 }}>
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Reachr" width={28} height={28} style={{ display: "block" }} />
          <span style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 19, fontWeight: 700, fontStyle: "italic", color: logoTextColor, lineHeight: 1 }}>Reachr</span>
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute flex items-center gap-1.5" style={{ top: 36, right: 92 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: i === idx ? 18 : 5, height: 5, borderRadius: 3, background: i === idx ? "#09fe94" : dark ? "#333" : "#d8d3c5", transition: "width 0.25s" }} />
        ))}
      </div>

      {/* CONTENT */}
      <div className="absolute flex flex-col" style={{ top: 80, left: 28, right: 92, bottom: 268 }}>
        {children}
      </div>

      {/* BOTTOM STRIP */}
      <div className="absolute" style={{ bottom: 232, left: 28, right: 92 }}>
        <div style={{ height: 1, background: dark ? "#2a2a2a" : "#d8d3c5", marginBottom: 10 }} />
        <p style={{ fontSize: 10, color: dark ? "#555" : "#a09b8f", letterSpacing: "0.06em" }}>reachr.no</p>
      </div>

      {showGuide && <SafeZoneOverlay />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 1 — "COLD CALL ER DØD" (Mørkt tema, provoserende hook)
// Caption: "Cold calling i 2024 er bortkastet tid — her er hva som faktisk virker."
// ─────────────────────────────────────────────────────────────────────────────
const s1Slides = [
  {
    eyebrow: "Hot take 🔥",
    headline: "Cold\ncalling\ner død.",
    body: "97 % av uønskede salgsamtaler legges på. Stopp å kaste bort dagen din.",
  },
  {
    eyebrow: "Virkeligheten",
    headline: "1 av 100\nringer\nsvarer.",
    body: "Og de fleste er irriterte. Det er ikke en strategi — det er håp.",
  },
  {
    eyebrow: "Problemet",
    headline: "Du vet\ningenting\nom dem.",
    body: "Du ringer en fremmed uten kontekst. Selvsagt sier de nei.",
  },
  {
    eyebrow: "Løsningen",
    headline: "Ring de\nsom faktisk\npasser.",
    body: "Filtrer 250 000+ norske bedrifter på bransje, størrelse og sted — og ring bare de riktige.",
  },
  {
    eyebrow: "Reachr-metoden",
    headline: "Warm\noutreach\nvinner.",
    body: "Se bedriftsprofilen, forstå behovet, send personlig melding. Konverteringsraten tredobles.",
  },
  {
    eyebrow: "Start i dag",
    headline: "Slutt\nå ringe\nblinde.",
    body: "Prøv Reachr gratis på reachr.no — ha første kvalifiserte lead-liste klar på 10 minutter.",
    cta: true,
  },
];

function S1Slide({ slide, idx, total, showGuide }: { slide: typeof s1Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide} dark>
      {/* Eyebrow */}
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#09fe94", marginBottom: 18 }}>
        {slide.eyebrow}
      </p>

      {/* Headline */}
      <div style={{ flex: 1 }}>
        {slide.headline.split("\n").map((line, i) => (
          <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 56, fontWeight: 900, color: "#f2efe3", lineHeight: 0.95, letterSpacing: "-2.5px" }}>
            {line}
          </p>
        ))}
      </div>

      {/* Body */}
      <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.body}</p>

      {/* CTA */}
      {"cta" in slide && slide.cta && (
        <div style={{ marginTop: 20, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 15, color: "#171717", alignSelf: "flex-start" }}>
          Start gratis på reachr.no →
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 2 — "SLIK BOOKER DU 3× FLERE MØTER" (Steg-for-steg tutorial)
// Caption: "Den enkle metoden norske toppselgere bruker for å booke 3× flere møter."
// ─────────────────────────────────────────────────────────────────────────────
const s2Slides = [
  {
    step: null,
    hook: true,
    headline: "Slik booker\ndu 3× flere\nmøter.",
    sub: "En metode. 5 steg. Norske toppselgere gjør dette daglig.",
  },
  {
    step: "Steg 1 / 5",
    headline: "Finn riktig\nbedrift.",
    body: "Ikke jobb hardt — jobb smart. Filtrer på bransje, omsetning og sted i Reachr.",
    tip: "💡 Bruk MVA-filter for å finne aktive bedrifter",
  },
  {
    step: "Steg 2 / 5",
    headline: "Forstå\nbehovet.",
    body: "Les bedriftsprofilen. Hva gjør de? Hvor store er de? Hvilke utfordringer har de?",
    tip: "💡 10 sekunder research = 3× bedre samtale",
  },
  {
    step: "Steg 3 / 5",
    headline: "Send riktig\nmelding.",
    body: "Bruk AI til å generere en personlig e-post basert på din pitch og deres profil.",
    tip: "💡 AI-meldingen er klar på under 30 sekunder",
  },
  {
    step: "Steg 4 / 5",
    headline: "Følg opp\nautomatisk.",
    body: "Reachr varsler deg når det er på tide å ta kontakt igjen. Aldri mist en mulighet.",
    tip: "💡 80 % av salg skjer etter 5+ kontaktpunkter",
  },
  {
    step: "Steg 5 / 5",
    headline: "Lukk\ndealen.",
    body: "Med riktig bedrift, riktig timing og riktig melding — sier de ja.",
    tip: null,
    cta: true,
  },
];

function S2Slide({ slide, idx, total, showGuide }: { slide: typeof s2Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.hook ? (
        /* Hook slide */
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#ff470a", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 24 }}>
            Metode som virker
          </div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 54, fontWeight: 700, color: "#171717", lineHeight: 0.98, letterSpacing: "-0.5px" }}>
              {line}
            </p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.6, marginTop: 20 }}>{slide.sub}</p>
        </div>
      ) : (
        <>
          {/* Step label */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ff470a", marginBottom: 16 }}>{slide.step}</p>

          {/* Progress bar */}
          <div style={{ height: 3, background: "#ede9da", borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(idx / (total - 1)) * 100}%`, background: "#09fe94", borderRadius: 2, transition: "width 0.3s" }} />
          </div>

          {/* Headline */}
          <div style={{ flex: 1 }}>
            {slide.headline.split("\n").map((line, i) => (
              <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 50, fontWeight: 900, color: "#171717", lineHeight: 1.0, letterSpacing: "-1.5px" }}>
                {line}
              </p>
            ))}
          </div>

          {/* Body */}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 16 }}>{slide.body}</p>

          {/* Tip card */}
          {slide.tip && (
            <div style={{ marginTop: 16, background: "#faf8f2", border: "1.5px solid #d8d3c5", borderRadius: 12, padding: "10px 14px" }}>
              <p style={{ fontSize: 12, color: "#6b6660", lineHeight: 1.5 }}>{slide.tip}</p>
            </div>
          )}

          {/* CTA */}
          {"cta" in slide && slide.cta && (
            <div style={{ marginTop: 16, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 15, color: "#171717", alignSelf: "flex-start" }}>
              Prøv Reachr gratis →
            </div>
          )}
        </>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 3 — "FØR VS ETTER" (Kontrast-sammenlikning, to kolonner)
// Caption: "Slik ser arbeidsdagen ut etter at du bytter til Reachr."
// ─────────────────────────────────────────────────────────────────────────────
const s3Slides = [
  {
    type: "hook" as const,
    headline: "Arbeidsdagen\nfør og etter\nReachr.",
    sub: "Samme jobb. Helt annen opplevelse.",
  },
  {
    type: "compare" as const,
    topic: "Finne leads",
    before: ["Google + LinkedIn", "Manuell kopi-lim", "1–2 timer daglig"],
    after: ["250 000+ bedrifter søkbart", "Filter på sek.", "Første lead: 10 sek."],
  },
  {
    type: "compare" as const,
    topic: "Sende melding",
    before: ["Skriver fra bunnen", "Kopierer mal", "15–20 min per melding"],
    after: ["AI genererer utkast", "Tilpasset bedriften", "Klar på 30 sek."],
  },
  {
    type: "compare" as const,
    topic: "Følge opp",
    before: ["Post-its + Excel", "Glemmer leads", "Mister deals"],
    after: ["Automatiske varsler", "Pipeline-oversikt", "Null tapte leads"],
  },
  {
    type: "compare" as const,
    topic: "Tid på salg",
    before: ["3+ t/dag på admin", "Lite tid til kunder", "Jobber hardt"],
    after: ["Admin: 20 min/dag", "Tid til å lukke", "Jobber smart"],
  },
  {
    type: "cta" as const,
    headline: "Klar for\netter?",
    sub: "Prøv Reachr gratis — ingen binding, norsk support.",
  },
];

function S3Slide({ slide, idx, total, showGuide }: { slide: typeof s3Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#171717", color: "#f2efe3", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 24 }}>
            Før / Etter
          </div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 50, fontWeight: 700, color: "#171717", lineHeight: 1.0 }}>
              {line}
            </p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}

      {slide.type === "compare" && (
        <>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6660", marginBottom: 16 }}>{slide.topic}</p>

          {/* Two column compare */}
          <div style={{ flex: 1, display: "flex", gap: 10 }}>
            {/* Before */}
            <div style={{ flex: 1, background: "#faf8f2", border: "1.5px solid #d8d3c5", borderRadius: 14, padding: "14px 12px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#a09b8f", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Før</p>
              {slide.before.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "#ff470a", marginTop: 1, flexShrink: 0 }}>✕</span>
                  <p style={{ fontSize: 12, color: "#6b6660", lineHeight: 1.35 }}>{item}</p>
                </div>
              ))}
            </div>

            {/* After */}
            <div style={{ flex: 1, background: "#171717", border: "1.5px solid #09fe9433", borderRadius: 14, padding: "14px 12px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#09fe94", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Etter</p>
              {slide.after.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "#09fe94", marginTop: 1, flexShrink: 0 }}>✓</span>
                  <p style={{ fontSize: 12, color: "#d8d3c5", lineHeight: 1.35 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 60, fontWeight: 900, color: "#171717", lineHeight: 0.95, letterSpacing: "-2px" }}>
              {line}
            </p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
          <div style={{ marginTop: 24, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 15, color: "#171717", alignSelf: "flex-start" }}>
            reachr.no — gratis start →
          </div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 4 — "TOPPSELGERENS HEMMELIGHET" (Dark editorial, mystikk)
// Caption: "Norges beste selgere deler én ting — dette verktøyet."
// ─────────────────────────────────────────────────────────────────────────────
const s4Slides = [
  {
    type: "hook" as const,
    label: "Avsløring 👀",
    headline: "Hemmeligheten\nbak Norges\nbeste selgere.",
    sub: "Det handler ikke om talent. Det handler om verktøy.",
  },
  {
    type: "reveal" as const,
    number: "01",
    title: "De jakter\nikke blindt.",
    body: "De søker presist. Bransje, størrelse, sted. Bare relevante bedrifter. Aldri kaldkontakt.",
  },
  {
    type: "reveal" as const,
    number: "02",
    title: "De er\nalltid\nforberedt.",
    body: "Før hver samtale vet de hvem de ringer, hva de gjør, og hva de trenger. Reachr gir dem det.",
  },
  {
    type: "reveal" as const,
    number: "03",
    title: "AI skriver\nfor dem.",
    body: "Ikke maler. Personlige meldinger tilpasset hvert enkelt lead — på 30 sekunder.",
  },
  {
    type: "reveal" as const,
    number: "04",
    title: "De følger\nalltid\nopp.",
    body: "Automatiske varsler sier ifra når det er tid. Ingen leads faller mellom stolene.",
  },
  {
    type: "cta" as const,
    label: "Din tur",
    headline: "Nå kjenner\ndu hemmeligheten.",
    sub: "Prøv Reachr gratis på reachr.no — 3 dager uten kredittkort.",
  },
];

function S4Slide({ slide, idx, total, showGuide }: { slide: typeof s4Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide} dark>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#09fe94", color: "#171717", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 24 }}>
            {slide.label}
          </div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 46, fontWeight: 700, color: "#f2efe3", lineHeight: 1.05 }}>
              {line}
            </p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}

      {slide.type === "reveal" && (
        <>
          {/* Big number background */}
          <div className="absolute pointer-events-none" style={{ top: 70, right: -5, fontSize: 120, fontWeight: 900, color: "#09fe94", lineHeight: 1, opacity: 0.07, fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "-4px", userSelect: "none" }}>
            {slide.number}
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#09fe94", marginBottom: 18 }}>
            #{slide.number}
          </p>

          <div style={{ flex: 1 }}>
            {slide.title.split("\n").map((line, i) => (
              <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 48, fontWeight: 900, color: "#f2efe3", lineHeight: 0.97, letterSpacing: "-2px" }}>
                {line}
              </p>
            ))}
          </div>

          <div style={{ width: 40, height: 3, borderRadius: 2, background: "#09fe94", marginTop: 20, marginBottom: 16 }} />
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65 }}>{slide.body}</p>
        </>
      )}

      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#09fe94", marginBottom: 20 }}>{slide.label}</p>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 46, fontWeight: 700, color: "#f2efe3", lineHeight: 1.05 }}>
              {line}
            </p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 16 }}>{slide.sub}</p>
          <div style={{ marginTop: 24, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 15, color: "#171717", alignSelf: "flex-start" }}>
            reachr.no — start gratis →
          </div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 5 — "REGNESTYKKET" (ROI-kalkulator, tall som overbeviser)
// Caption: "Hva koster det deg å IKKE bruke Reachr? Vi regner det ut."
// ─────────────────────────────────────────────────────────────────────────────
const s5Slides = [
  {
    type: "hook" as const,
    headline: "Hva koster\ndet å IKKE\nbruke Reachr?",
    sub: "Vi regner det ut — svaret er litt ubehagelig.",
  },
  {
    type: "calc" as const,
    label: "Tid 🕐",
    premise: "3 timer/dag på manuell leting",
    calc: "3t × 220 dager\n= 660 timer/år",
    insight: "660 timer du heller burde bruke på å selge.",
    accent: "#ff470a",
  },
  {
    type: "calc" as const,
    label: "Penger 💸",
    premise: "Lønn 600 kr/t (snitt selger)",
    calc: "660 timer × 600 kr\n= 396 000 kr/år",
    insight: "Det er prisen på å ikke ha riktig verktøy.",
    accent: "#ff470a",
  },
  {
    type: "calc" as const,
    label: "Tapte deals 📉",
    premise: "Mangler du 3× møter = 3× færre deals",
    calc: "La oss si 10 deals/mnd\nkunne vært 30.",
    insight: "20 tapte deals. Hver måned. Hva er det verdt?",
    accent: "#ff470a",
  },
  {
    type: "flip" as const,
    label: "Med Reachr ✓",
    items: [
      { text: "Leads på 10 sek.", value: "−3t/dag" },
      { text: "AI-melding klar", value: "−30 sek." },
      { text: "Automatisk oppfølging", value: "0 tapte leads" },
      { text: "3× møtebooking", value: "+300 %" },
    ],
  },
  {
    type: "cta" as const,
    headline: "Regnestykket\ner enkelt.",
    sub: "Reachr koster langt mindre enn det koster å ikke ha det.",
    cta: "Start gratis på reachr.no →",
  },
];

function S5Slide({ slide, idx, total, showGuide }: { slide: typeof s5Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#ff470a", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 24 }}>
            ROI-kalkulator
          </div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 46, fontWeight: 900, color: "#171717", lineHeight: 0.97, letterSpacing: "-2px" }}>
              {line}
            </p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}

      {slide.type === "calc" && (
        <>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: slide.accent, marginBottom: 16 }}>{slide.label}</p>

          {/* Premise */}
          <div style={{ background: "#faf8f2", border: "1.5px solid #d8d3c5", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: "#6b6660" }}>{slide.premise}</p>
          </div>

          {/* Calculation */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {slide.calc.split("\n").map((line, i) => (
              <p key={i} style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: i === 1 ? 38 : 22,
                fontWeight: i === 1 ? 900 : 600,
                color: i === 1 ? slide.accent : "#a09b8f",
                lineHeight: 1.1,
                letterSpacing: i === 1 ? "-1px" : "0",
              }}>
                {line}
              </p>
            ))}
          </div>

          {/* Insight */}
          <div style={{ background: "#171717", borderRadius: 12, padding: "12px 14px" }}>
            <p style={{ fontSize: 12, color: "#f2efe3", lineHeight: 1.5 }}>{slide.insight}</p>
          </div>
        </>
      )}

      {slide.type === "flip" && (
        <>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#09fe94", marginBottom: 20 }}>{slide.label}</p>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            {slide.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#171717", borderRadius: 12, padding: "12px 16px" }}>
                <p style={{ fontSize: 13, color: "#d8d3c5", fontWeight: 500 }}>{item.text}</p>
                <p style={{ fontSize: 13, color: "#09fe94", fontWeight: 800 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 50, fontWeight: 900, color: "#171717", lineHeight: 0.97, letterSpacing: "-2px" }}>
              {line}
            </p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
          <div style={{ marginTop: 24, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 15, color: "#171717", alignSelf: "flex-start" }}>
            {slide.cta}
          </div>
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
    id: 0, name: "Cold call er død",
    caption: "Cold calling i 2025 er bortkastet tid — her er hva som faktisk virker.",
    slides: s1Slides,
    Renderer: S1Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }>,
  },
  {
    id: 1, name: "3× flere møter",
    caption: "Den enkle metoden norske toppselgere bruker for å booke 3× flere møter.",
    slides: s2Slides,
    Renderer: S2Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }>,
  },
  {
    id: 2, name: "Før vs Etter",
    caption: "Slik ser arbeidsdagen ut etter at du bytter til Reachr.",
    slides: s3Slides,
    Renderer: S3Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }>,
  },
  {
    id: 3, name: "Hemmeligheten",
    caption: "Norges beste selgere deler én ting — dette verktøyet.",
    slides: s4Slides,
    Renderer: S4Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }>,
  },
  {
    id: 4, name: "Regnestykket",
    caption: "Hva koster det deg å IKKE bruke Reachr? Vi regner det ut.",
    slides: s5Slides,
    Renderer: S5Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }>,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
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
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 py-12 px-4" style={{ background: "#1a1a1a", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header */}
      <p style={{ color: "#555", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        TikTok Slideshow · 9×16 · Reachr
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

      {/* 9:16 slide canvas */}
      <div style={{ width: 405, height: 720, borderRadius: 24, overflow: "hidden", position: "relative", boxShadow: "0 0 80px rgba(0,0,0,0.8), 0 0 0 1px #2a2a2a", flexShrink: 0 }}>
        <Renderer slide={series.slides[slideIdx]} idx={slideIdx} total={total} showGuide={showGuide} />
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSlideIdx((i) => Math.max(0, i - 1))}
          disabled={slideIdx === 0}
          style={{ padding: "10px 22px", borderRadius: 12, fontSize: 13, fontWeight: 600, background: slideIdx === 0 ? "#111" : "#2a2a2a", color: slideIdx === 0 ? "#333" : "#fff", border: "1.5px solid #333", cursor: slideIdx === 0 ? "not-allowed" : "pointer" }}
        >
          ← Forrige
        </button>

        <div className="flex gap-1.5">
          {series.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              style={{ width: i === slideIdx ? 20 : 8, height: 8, borderRadius: 4, background: i === slideIdx ? "#09fe94" : "#333", border: "none", cursor: "pointer", transition: "width 0.2s" }}
            />
          ))}
        </div>

        <button
          onClick={() => setSlideIdx((i) => Math.min(total - 1, i + 1))}
          disabled={slideIdx === total - 1}
          style={{ padding: "10px 22px", borderRadius: 12, fontSize: 13, fontWeight: 600, background: slideIdx === total - 1 ? "#111" : "#09fe94", color: slideIdx === total - 1 ? "#333" : "#171717", border: "1.5px solid #333", cursor: slideIdx === total - 1 ? "not-allowed" : "pointer" }}
        >
          Neste →
        </button>
      </div>

      {/* Dev tools */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowGuide((v) => !v)}
          style={{ padding: "6px 16px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: showGuide ? "#ff470a22" : "#2a2a2a", color: showGuide ? "#ff470a" : "#666", border: `1.5px solid ${showGuide ? "#ff470a44" : "#333"}`, cursor: "pointer" }}
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
