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

function SlideShell({ idx, total, children, showGuide }: { idx: number; total: number; children: React.ReactNode; showGuide: boolean }) {
  return (
    <div className="absolute inset-0 select-none" style={{ background: "#f2efe3" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 0%, #e8e4d800 0%, #ede9da60 100%)" }} />

      {/* LOGO */}
      <div className="absolute" style={{ top: 28, left: 28 }}>
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Reachr" width={28} height={28} style={{ display: "block" }} />
          <span style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 19, fontWeight: 700, fontStyle: "italic", color: "#171717", lineHeight: 1 }}>Reachr</span>
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute flex items-center gap-1.5" style={{ top: 36, right: 92 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: i === idx ? 18 : 5, height: 5, borderRadius: 3, background: i === idx ? "#09fe94" : "#d8d3c5", transition: "width 0.25s" }} />
        ))}
      </div>

      {/* CONTENT */}
      <div className="absolute flex flex-col" style={{ top: 80, left: 28, right: 92, bottom: 268 }}>
        {children}
      </div>

      {/* BOTTOM STRIP */}
      <div className="absolute" style={{ bottom: 232, left: 28, right: 92 }}>
        <div style={{ height: 1, background: "#d8d3c5", marginBottom: 10 }} />
        <p style={{ fontSize: 10, color: "#a09b8f", letterSpacing: "0.06em" }}>reachr.no</p>
      </div>

      {showGuide && <SafeZoneOverlay />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 1 — "LINKEDIN ER METTET" (LinkedIn saturation, bold stats)
// Caption: "Hvorfor LinkedIn ikke lenger er gullstandarden for norsk B2B-salg."
// ─────────────────────────────────────────────────────────────────────────────
const s1Slides = [
  { type: "hook" as const, label: "Hot take 🔥", headline: "LinkedIn\ner\nmettet.", sub: "Innboksen er full. Ingen leser deg. Her er hva som faktisk virker nå." },
  { type: "stat" as const, number: "89 %", claim: "av LinkedIn InMail-er ignoreres", context: "Algoritmene prioriterer annonser. Organisk rekkevidde er nær null." },
  { type: "stat" as const, number: "1 av 12", claim: "kalde LinkedIn-meldinger får svar", context: "Og de fleste svar er negative. Du betaler med tid og omdømme." },
  { type: "stat" as const, number: "250 000+", claim: "norske bedrifter du kan søke i gratis", context: "Brønnøysundregistrene er åpent. Reachr gjør det søkbart — på sekunder." },
  { type: "insight" as const, label: "Løsningen", headline: "Gå\ndirekte\ntil kilden.", body: "Finn kontakten via offisielle registre. Ikke kamp om oppmerksomhet i feed. Direkte, personlig, relevant." },
  { type: "cta" as const, headline: "Slutt\nå rope\ni tomrom.", cta: "Finn riktige leads på reachr.no →" },
];

function S1Slide({ slide, idx, total, showGuide }: { slide: typeof s1Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#171717", color: "#09fe94", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>{slide.label}</div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 64, fontWeight: 900, color: "#171717", lineHeight: 0.9, letterSpacing: "-3px" }}>{line}</p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "stat" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 72, fontWeight: 900, color: "#ff470a", lineHeight: 1, letterSpacing: "-3px" }}>{slide.number}</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 18, fontWeight: 700, color: "#171717", lineHeight: 1.2, marginTop: 8, marginBottom: 20 }}>{slide.claim}</p>
          <div style={{ height: 1, background: "#d8d3c5", marginBottom: 16 }} />
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65 }}>{slide.context}</p>
        </div>
      )}
      {slide.type === "insight" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#09fe94", color: "#171717", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>{slide.label}</div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: "#171717", lineHeight: 1.0 }}>{line}</p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.body}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 58, fontWeight: 900, color: "#171717", lineHeight: 0.93, letterSpacing: "-2.5px" }}>{line}</p>
          ))}
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 15, color: "#171717", alignSelf: "flex-start" }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 2 — "5 TEGN PÅ AT DU TRENGER REACHR" (Checklist/self-qualify)
// Caption: "Kjenner du deg igjen? Da er Reachr laget for deg."
// ─────────────────────────────────────────────────────────────────────────────
const s2Slides = [
  { type: "hook" as const, headline: "5 tegn på\nat du bruker\nfor mye tid\npå leads.", sub: "Kjenner du deg igjen i to eller flere? Les videre." },
  { type: "sign" as const, num: "01", sign: "Du googler\nbedrifter\nmanuelt.", detail: "Kopi-lim fra nettsider inn i Excel. Igjen og igjen." },
  { type: "sign" as const, num: "02", sign: "Du vet ikke\nhvem som er\nklar til å kjøpe.", detail: "Du ringer alle — uten å vite hvem som faktisk passer." },
  { type: "sign" as const, num: "03", sign: "Du glemmer\nå følge opp\nleads.", detail: "Deals dør fordi du ikke husket å sende den andre e-posten." },
  { type: "sign" as const, num: "04", sign: "Meldingene\ndine er\nkopierte maler.", detail: "Alle ser at du ikke har lest om dem. Svarprosenten lider." },
  { type: "sign" as const, num: "05", sign: "Du vet ikke\nhvor salget\nstår.", detail: "Ingen oversikt. Ingen pipeline. Ingen kontroll." },
  { type: "cta" as const, headline: "Alle 5?\nDa er\nReachr for deg.", cta: "Start gratis på reachr.no →" },
];

function S2Slide({ slide, idx, total, showGuide }: { slide: typeof s2Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#ff470a", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>Kjenner du deg igjen?</div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 44, fontWeight: 900, color: "#171717", lineHeight: 1.0, letterSpacing: "-1.5px" }}>{line}</p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "sign" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a09b8f", marginBottom: 12 }}>Tegn #{slide.num}</p>
          <div style={{ background: "#faf8f2", border: "2px solid #ff470a22", borderRadius: 16, padding: "20px 18px", marginBottom: 20 }}>
            {slide.sign.split("\n").map((line, i) => (
              <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 38, fontWeight: 900, color: "#ff470a", lineHeight: 1.05, letterSpacing: "-1px" }}>{line}</p>
            ))}
          </div>
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65 }}>{slide.detail}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: "#171717", lineHeight: 1.0 }}>{line}</p>
          ))}
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 15, color: "#171717", alignSelf: "flex-start" }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 3 — "BYGG PIPELINE PÅ 30 MIN" (Speed challenge, timer style)
// Caption: "Vi utfordrer deg: bygg en full pipeline på under 30 minutter med Reachr."
// ─────────────────────────────────────────────────────────────────────────────
const s3Slides = [
  { type: "hook" as const, label: "30-minutters utfordring ⏱", headline: "Full pipeline\npå 30\nminutter.", sub: "Vi viser deg hvordan. Steg for steg. Med klokken." },
  { type: "step" as const, time: "0–5 min", title: "Søk opp\nbransjen din.", body: "Gå til Reachr. Velg bransje, kommune og størrelse. Se resultater umiddelbart.", timer: "5 min" },
  { type: "step" as const, time: "5–10 min", title: "Legg til\n20 leads.", body: "Klikk «Legg til lead» på de mest relevante bedriftene. Alle havner i din pipeline.", timer: "10 min" },
  { type: "step" as const, time: "10–20 min", title: "Generer\nAI-meldinger.", body: "Velg lead, klikk AI-e-post. Reachr skriver en personlig melding basert på din pitch.", timer: "20 min" },
  { type: "step" as const, time: "20–25 min", title: "Send til\nde fem beste.", body: "Gå gjennom meldingene, tilpass minimalt, send. Fem personlige e-poster — på fem minutter.", timer: "25 min" },
  { type: "step" as const, time: "25–30 min", title: "Sett opp\nvarsler.", body: "Aktiver oppfølgingsvarsler. Reachr sier ifra når det er tid til neste kontakt.", timer: "30 min" },
  { type: "cta" as const, headline: "30 min.\nEtt skritt\nnærmere deal.", cta: "Prøv Reachr gratis — reachr.no →" },
];

function S3Slide({ slide, idx, total, showGuide }: { slide: typeof s3Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#ffad0a", color: "#171717", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>{slide.label}</div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 54, fontWeight: 900, color: "#171717", lineHeight: 0.95, letterSpacing: "-2px" }}>{line}</p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "step" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffad0a" }}>{slide.time}</p>
            <div style={{ background: "#171717", borderRadius: 99, padding: "3px 10px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#ffad0a" }}>⏱ {slide.timer}</p>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {slide.title.split("\n").map((line, i) => (
              <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 46, fontWeight: 900, color: "#171717", lineHeight: 1.0, letterSpacing: "-1.5px" }}>{line}</p>
            ))}
          </div>
          <div style={{ background: "#faf8f2", border: "1.5px solid #d8d3c5", borderRadius: 12, padding: "14px 16px" }}>
            <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.6 }}>{slide.body}</p>
          </div>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 52, fontWeight: 900, color: "#171717", lineHeight: 0.95, letterSpacing: "-2px" }}>{line}</p>
          ))}
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 15, color: "#171717", alignSelf: "flex-start" }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 4 — "AI-OUTREACH SOM KONVERTERER" (Message anatomy reveal)
// Caption: "Hva skiller en AI-melding som konverterer fra en som slettes?"
// ─────────────────────────────────────────────────────────────────────────────
const s4Slides = [
  { type: "hook" as const, headline: "AI-meldingen\nsom faktisk\nfår svar.", sub: "Vi bryter ned anatomien til en melding med 40 %+ åpningsrate." },
  { type: "bad" as const, label: "❌ Slik gjør folk flest", lines: ["Hei! Vi tilbyr fantastiske tjenester innen...", "Vi er markedsledende på...", "Kan vi ta en prat?"] },
  { type: "element" as const, num: "01", name: "Personlig\nhook.", detail: "Første linje nevner noe spesifikt om bedriften. Viser at du har gjort research.", example: "«Jeg ser dere vokste med 30 ansatte i fjor...»" },
  { type: "element" as const, num: "02", name: "Én klar\nverdi.", detail: "Ikke fem punkter. Én konkret ting du løser for akkurat dem.", example: "«Vi hjelper vekstbedrifter finne neste 50 kunder på halvparten av tiden.»" },
  { type: "element" as const, num: "03", name: "Lav\nterskel CTA.", detail: "Ikke «kjøp nå» eller «book demo». Spør om en liten ting.", example: "«Er dette relevant for dere dette kvartalet?»" },
  { type: "good" as const, label: "✓ Reachr genererer dette automatisk", body: "Basert på bedriftsprofilen og din salgspitch lager AI-en en melding som treffer alle tre punktene — på 30 sekunder." },
  { type: "cta" as const, headline: "Skriv\nbedre.\nSelg mer.", cta: "Prøv AI-outreach gratis →" },
];

function S4Slide({ slide, idx, total, showGuide }: { slide: typeof s4Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#09fe94", color: "#171717", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>Meldingsguide</div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 48, fontWeight: 700, color: "#171717", lineHeight: 1.05 }}>{line}</p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "bad" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#ff470a", marginBottom: 16 }}>{slide.label}</p>
          <div style={{ background: "#faf8f2", border: "2px solid #ff470a33", borderRadius: 14, padding: "16px 14px" }}>
            {slide.lines.map((line, i) => (
              <p key={i} style={{ fontSize: 12, color: "#a09b8f", lineHeight: 1.55, fontStyle: "italic", marginBottom: i < slide.lines.length - 1 ? 8 : 0 }}>{line}</p>
            ))}
          </div>
          <p style={{ color: "#ff470a", fontSize: 12, marginTop: 12, fontWeight: 600 }}>→ Slettes uten å leses. Alltid.</p>
        </div>
      )}
      {slide.type === "element" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ background: "#09fe94", borderRadius: 99, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: "#171717" }}>{slide.num}</span>
            </div>
            <div style={{ flex: 1 }}>
              {slide.name.split("\n").map((line, i) => (
                <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 30, fontWeight: 900, color: "#171717", lineHeight: 1.0, letterSpacing: "-0.5px" }}>{line}</p>
              ))}
            </div>
          </div>
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{slide.detail}</p>
          <div style={{ background: "#faf8f2", border: "1.5px solid #d8d3c5", borderRadius: 12, padding: "12px 14px" }}>
            <p style={{ fontSize: 12, color: "#171717", lineHeight: 1.5, fontStyle: "italic" }}>{slide.example}</p>
          </div>
        </div>
      )}
      {slide.type === "good" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#09fe94", marginBottom: 16 }}>{slide.label}</p>
          <div style={{ background: "#171717", borderRadius: 16, padding: "20px 16px" }}>
            <p style={{ color: "#f2efe3", fontSize: 14, lineHeight: 1.7 }}>{slide.body}</p>
          </div>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 58, fontWeight: 900, color: "#171717", lineHeight: 0.93, letterSpacing: "-2.5px" }}>{line}</p>
          ))}
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 15, color: "#171717", alignSelf: "flex-start" }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 5 — "NORSK B2B I 2025" (Market facts & trends)
// Caption: "5 ting du må vite om norsk B2B-salg i 2025."
// ─────────────────────────────────────────────────────────────────────────────
const s5Slides = [
  { type: "hook" as const, headline: "Norsk B2B\ni 2025:\nhva endrer\nseg nå.", sub: "Fem fakta alle norske selgere bør kjenne til." },
  { type: "fact" as const, num: "01", fact: "Beslutnings-\ntagere er\nyngre.", stat: "Gjennomsnittsalder: 38 år", insight: "De forventer rask, digital kommunikasjon. Ikke lange telefonsamtaler." },
  { type: "fact" as const, num: "02", fact: "67 % av\nkjøpsreisen\ner ferdig.", stat: "Før første salgsmøte", insight: "Kunden vet hva de vil. Din jobb er å dukke opp på riktig tidspunkt." },
  { type: "fact" as const, num: "03", fact: "Hyper-\nlokal\nallocation.", stat: "3× høyere konvertering", insight: "Bedrifter kjøper helst lokalt. Kommune-filter i Reachr gir deg fordelen." },
  { type: "fact" as const, num: "04", fact: "Personali-\nsering\nvinner.", stat: "+41 % åpningsrate", insight: "E-poster som nevner bedriftens navn og bransje slår generiske maler." },
  { type: "fact" as const, num: "05", fact: "Oppfølging\ner gull.", stat: "80 % av salg etter kontakt 5+", insight: "De fleste gir opp etter 1–2 forsøk. Automatisering er svaret." },
  { type: "cta" as const, headline: "Klar for\n2025?", sub: "Reachr er bygget for norsk B2B — akkurat slik det er nå.", cta: "Start på reachr.no →" },
];

function S5Slide({ slide, idx, total, showGuide }: { slide: typeof s5Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#171717", color: "#f2efe3", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>Marked & trender</div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 46, fontWeight: 700, color: "#171717", lineHeight: 1.05 }}>{line}</p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "fact" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a09b8f", marginBottom: 16 }}>Fakta #{slide.num}</p>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {slide.fact.split("\n").map((line, i) => (
              <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 42, fontWeight: 900, color: "#171717", lineHeight: 1.0, letterSpacing: "-1.5px" }}>{line}</p>
            ))}
          </div>
          <div style={{ background: "#09fe94", borderRadius: 10, padding: "10px 14px", marginTop: 16, marginBottom: 12, alignSelf: "flex-start" }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#171717" }}>{slide.stat}</p>
          </div>
          <p style={{ color: "#6b6660", fontSize: 12, lineHeight: 1.6 }}>{slide.insight}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 60, fontWeight: 900, color: "#171717", lineHeight: 0.93, letterSpacing: "-2.5px" }}>{line}</p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 16 }}>{slide.sub}</p>
          <div style={{ marginTop: 24, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 15, color: "#171717", alignSelf: "flex-start" }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 6 — "ALDRI MIST ET LEAD IGJEN" (Follow-up system)
// Caption: "Sånn sørger toppselgere for at ingen leads faller mellom stolene."
// ─────────────────────────────────────────────────────────────────────────────
const s6Slides = [
  { type: "hook" as const, label: "Oppfølging 📬", headline: "Deals\ndør i\nsansen.", sub: "Ikke fordi kunden sa nei. Fordi du glemte å følge opp." },
  { type: "problem" as const, headline: "Du har\n50 leads.", sub: "Husker du hvem du kontaktet for 12 dager siden?", highlight: "Sannsynligvis ikke." },
  { type: "data" as const, stat: "80 %", claim: "av salg krever 5+ oppfølginger", extra: "Men 44 % av selgere gir opp etter første kontakt." },
  { type: "solution" as const, label: "Reachr løser dette", points: ["Automatisk varsel når det er tid", "Pipeline viser status per lead", "Sist kontaktet — alltid synlig", "Prioritert oppfølgingsliste"] },
  { type: "flow" as const, steps: [{ label: "Kontakt", color: "#09fe94" }, { label: "Ingen svar", color: "#ffad0a" }, { label: "Varsel dag 3", color: "#ff470a" }, { label: "Oppfølging", color: "#09fe94" }, { label: "Deal! 🎯", color: "#171717" }] },
  { type: "cta" as const, headline: "Null\ntapte\nleads.", cta: "Start med Reachr på reachr.no →" },
];

function S6Slide({ slide, idx, total, showGuide }: { slide: typeof s6Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#171717", color: "#09fe94", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>{slide.label}</div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 58, fontWeight: 900, color: "#171717", lineHeight: 0.92, letterSpacing: "-2.5px" }}>{line}</p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "problem" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 52, fontWeight: 900, color: "#171717", lineHeight: 0.95, letterSpacing: "-2px" }}>{line}</p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 14, lineHeight: 1.6, marginTop: 20 }}>{slide.sub}</p>
          <div style={{ marginTop: 20, background: "#ff470a", borderRadius: 12, padding: "12px 16px", alignSelf: "flex-start" }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{slide.highlight}</p>
          </div>
        </div>
      )}
      {slide.type === "data" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 76, fontWeight: 900, color: "#09fe94", lineHeight: 1, letterSpacing: "-3px" }}>{slide.stat}</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 18, fontWeight: 700, color: "#171717", lineHeight: 1.2, marginTop: 8, marginBottom: 24 }}>{slide.claim}</p>
          <div style={{ height: 1, background: "#d8d3c5", marginBottom: 16 }} />
          <p style={{ color: "#ff470a", fontSize: 14, lineHeight: 1.55, fontWeight: 600 }}>{slide.extra}</p>
        </div>
      )}
      {slide.type === "solution" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#09fe94", marginBottom: 20 }}>{slide.label}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {slide.points.map((point, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "#faf8f2", border: "1.5px solid #d8d3c5", borderRadius: 12, padding: "12px 14px" }}>
                <span style={{ fontSize: 14, color: "#09fe94", fontWeight: 800, flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: 13, color: "#171717", fontWeight: 500 }}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {slide.type === "flow" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a09b8f", marginBottom: 8 }}>Reachr-flyten</p>
          {slide.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: 99, background: step.color, flexShrink: 0 }} />
              <p style={{ fontSize: 14, fontWeight: i === slide.steps.length - 1 ? 800 : 500, color: i === slide.steps.length - 1 ? "#171717" : "#6b6660" }}>{step.label}</p>
              {i < slide.steps.length - 1 && <div style={{ width: 1, height: 12, background: "#d8d3c5", marginLeft: 3, position: "absolute", transform: `translateY(${14}px)` }} />}
            </div>
          ))}
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 62, fontWeight: 900, color: "#171717", lineHeight: 0.92, letterSpacing: "-2.5px" }}>{line}</p>
          ))}
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 15, color: "#171717", alignSelf: "flex-start" }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 7 — "FRA FREMMED TIL FAST KUNDE" (Customer journey, 5 stages)
// Caption: "De fem stegene fra ukjent bedrift til lojal kunde — med Reachr."
// ─────────────────────────────────────────────────────────────────────────────
const s7Slides = [
  { type: "hook" as const, headline: "Fra\nfremmed\ntil fast\nkunde.", sub: "Slik ser den perfekte salgsjourneen ut — steg for steg." },
  { type: "stage" as const, stage: 1, total: 5, name: "Oppdagelse", icon: "🔍", desc: "Du finner bedriften via Reachr-søk. Bransje, størrelse og sted er akkurat riktig. 10 sekunder.", color: "#09fe94" },
  { type: "stage" as const, stage: 2, total: 5, name: "Første kontakt", icon: "✉️", desc: "AI genererer en personlig e-post basert på bedriftsprofilen. Du sender — de åpner.", color: "#ffad0a" },
  { type: "stage" as const, stage: 3, total: 5, name: "Oppfølging", icon: "🔔", desc: "Reachr varsler deg dag 3. Du sender en kort SMS. De husker deg nå.", color: "#ff470a" },
  { type: "stage" as const, stage: 4, total: 5, name: "Møte booket", icon: "📅", desc: "Tredje kontaktpunkt. Status oppdateres i pipelinen. Du er klar med kontekst.", color: "#09fe94" },
  { type: "stage" as const, stage: 5, total: 5, name: "Deal lukket", icon: "🎯", desc: "De blir kunde. Pipelinen viser 'Kunde'. Du starter prosessen med neste lead.", color: "#09fe94" },
  { type: "cta" as const, headline: "Start\nreisen\ni dag.", cta: "reachr.no — gratis de første 7 dager →" },
];

function S7Slide({ slide, idx, total, showGuide }: { slide: typeof s7Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#ff470a", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>Salgsreisen 🗺</div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 50, fontWeight: 700, color: "#171717", lineHeight: 1.02 }}>{line}</p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "stage" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {Array.from({ length: slide.total }).map((_, i) => (
                <div key={i} style={{ width: i < slide.stage ? 18 : 8, height: 6, borderRadius: 3, background: i < slide.stage ? slide.color : "#d8d3c5", transition: "width 0.2s" }} />
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#a09b8f", fontWeight: 600 }}>{slide.stage}/{slide.total}</p>
          </div>
          <div style={{ fontSize: 44, marginBottom: 12 }}>{slide.icon}</div>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 36, fontWeight: 900, color: "#171717", lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 20 }}>{slide.name}</p>
          <div style={{ background: "#faf8f2", border: `2px solid ${slide.color}33`, borderRadius: 14, padding: "14px 16px" }}>
            <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.6 }}>{slide.desc}</p>
          </div>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 62, fontWeight: 900, color: "#171717", lineHeight: 0.92, letterSpacing: "-2.5px" }}>{line}</p>
          ))}
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 14, color: "#171717", alignSelf: "flex-start" }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 8 — "HVA KOSTER ÉN SALGSUKE?" (Weekly cost breakdown)
// Caption: "Vi regner ut hva en uke uten Reachr faktisk koster deg."
// ─────────────────────────────────────────────────────────────────────────────
const s8Slides = [
  { type: "hook" as const, headline: "Hva koster\nén uke uten\nReachr?", sub: "Spoiler: mye mer enn du tror. Vi regner det ut." },
  { type: "day" as const, day: "Mandag", hours: "2,5 t", task: "Søke opp bedrifter manuelt", cost: "1 500 kr bortkastet" },
  { type: "day" as const, day: "Tirsdag", hours: "1 t", task: "Skrive generelle e-poster", cost: "600 kr + lav svarprosent" },
  { type: "day" as const, day: "Onsdag", hours: "45 min", task: "Prøve å huske hvem du kontaktet", cost: "450 kr — 3 leads mistet" },
  { type: "day" as const, day: "Torsdag", hours: "1,5 t", task: "Rapportere til Excel-ark", cost: "900 kr i ren administrasjon" },
  { type: "total" as const, hours: "6+ timer", cost: "3 600+ kr/uke", yearly: "180 000 kr/år", note: "Bare i bortkastet tid. Ikke medregnet tapte deals." },
  { type: "cta" as const, headline: "Du har\nbedre ting\nå gjøre.", cta: "Spar 6 timer/uke — start gratis →" },
];

function S8Slide({ slide, idx, total, showGuide }: { slide: typeof s8Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#ff470a", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>Kostnadsanalyse</div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 46, fontWeight: 900, color: "#171717", lineHeight: 0.97, letterSpacing: "-2px" }}>{line}</p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "day" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#171717" }}>{slide.day}</p>
            <div style={{ background: "#ff470a", borderRadius: 99, padding: "3px 12px" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{slide.hours}</p>
            </div>
          </div>
          <div style={{ flex: 1, background: "#faf8f2", border: "1.5px solid #d8d3c5", borderRadius: 14, padding: "16px 16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontSize: 14, color: "#6b6660", lineHeight: 1.5, marginBottom: 16 }}>{slide.task}</p>
            <div style={{ height: 1, background: "#d8d3c5", marginBottom: 14 }} />
            <p style={{ fontSize: 13, color: "#ff470a", fontWeight: 700 }}>↓ {slide.cost}</p>
          </div>
        </div>
      )}
      {slide.type === "total" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a09b8f", marginBottom: 16 }}>Ukestotal</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 52, fontWeight: 900, color: "#ff470a", lineHeight: 1, letterSpacing: "-2px" }}>{slide.hours}</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 36, fontWeight: 800, color: "#171717", lineHeight: 1.1, marginTop: 6 }}>{slide.cost}</p>
          <div style={{ background: "#171717", borderRadius: 12, padding: "12px 16px", marginTop: 20, marginBottom: 12 }}>
            <p style={{ fontSize: 16, fontWeight: 900, color: "#ff470a" }}>{slide.yearly}</p>
            <p style={{ fontSize: 11, color: "#a09b8f", marginTop: 4 }}>i bortkastet tid per år</p>
          </div>
          <p style={{ color: "#a09b8f", fontSize: 11, lineHeight: 1.5, fontStyle: "italic" }}>{slide.note}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 50, fontWeight: 700, color: "#171717", lineHeight: 1.05 }}>{line}</p>
          ))}
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 14, color: "#171717", alignSelf: "flex-start" }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 9 — "FILTRER DEG TIL RIKTIG KUNDE" (Search & filter showcase)
// Caption: "Slik finner du den perfekte kunden på under ett minutt."
// ─────────────────────────────────────────────────────────────────────────────
const s9Slides = [
  { type: "hook" as const, headline: "Det finnes\nen bedrift\nlaget for\ndeg.", sub: "Du finner den på under ett minutt. Her er hvordan." },
  { type: "filter" as const, label: "Filter 1", name: "Bransje", example: "Bygg & anlegg", why: "Ikke kast bort tid på bedrifter som aldri vil kjøpe av deg.", icon: "🏗" },
  { type: "filter" as const, label: "Filter 2", name: "Omsetning", example: "5–50 MNOK", why: "For store = lang salgssyklus. For små = liten betalingsevne. Treff sweet spot.", icon: "💰" },
  { type: "filter" as const, label: "Filter 3", name: "Ansatte", example: "10–50 ansatte", why: "Voksende SMB-er kjøper oftest. De har budget og beslutningstagere tilgjengelig.", icon: "👥" },
  { type: "filter" as const, label: "Filter 4", name: "Kommune", example: "Oslo, Bergen, Stavanger", why: "Lokal tilstedeværelse = 3× høyere konverteringsrate i norsk B2B.", icon: "📍" },
  { type: "filter" as const, label: "Filter 5", name: "MVA-registrert", example: "Ja (aktive bedrifter)", why: "Sikrer at du bare kontakter bedrifter som faktisk er i drift.", icon: "✅" },
  { type: "cta" as const, headline: "250 000+\nbedrifter.\nDin ideelle\nkunde.", cta: "Søk nå på reachr.no →" },
];

function S9Slide({ slide, idx, total, showGuide }: { slide: typeof s9Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#09fe94", color: "#171717", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>Leadsøk 🔍</div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 46, fontWeight: 700, color: "#171717", lineHeight: 1.05 }}>{line}</p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "filter" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a09b8f", marginBottom: 16 }}>{slide.label}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 32 }}>{slide.icon}</span>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 36, fontWeight: 900, color: "#171717", lineHeight: 1.0, letterSpacing: "-1px" }}>{slide.name}</p>
          </div>
          <div style={{ background: "#171717", borderRadius: 12, padding: "12px 16px", marginBottom: 16, alignSelf: "flex-start" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#09fe94" }}>Ex: {slide.example}</p>
          </div>
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.6 }}>{slide.why}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 46, fontWeight: 900, color: "#171717", lineHeight: 0.97, letterSpacing: "-1.5px" }}>{line}</p>
          ))}
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 15, color: "#171717", alignSelf: "flex-start" }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 10 — "TEAMETS HEMMELIGE VÅPEN" (Team & collaboration)
// Caption: "Slik bruker vinnende salgsteam Reachr for å slå konkurrentene."
// ─────────────────────────────────────────────────────────────────────────────
const s10Slides = [
  { type: "hook" as const, headline: "Hele teamet.\nSamme\nretning.", sub: "Slik bruker de beste salgsteamene Reachr — og slår alle." },
  { type: "problem" as const, issues: ["Hvem kontakter hvem?", "Dobbelt arbeid og konflikter", "Ingen felles oversikt", "Sjefen vet ikke status"] },
  { type: "feature" as const, icon: "🗂", name: "Delt\npipeline.", body: "Hele teamet ser alle leads, status og siste kontakt. Ingen overlapp. Ingen hull." },
  { type: "feature" as const, icon: "📊", name: "Team-\noversikt.", body: "Leder ser hvem som jobber med hva, hvor i prosessen de er, og hvem som trenger hjelp." },
  { type: "feature" as const, icon: "🤝", name: "Felles\nkontekst.", body: "Alle notater og AI-meldinger er synlige. En ny teammedlem er oppdatert på sekunder." },
  { type: "result" as const, items: [{ label: "Tid spart per uke", value: "8+ timer" }, { label: "Redusert dobbelt arbeid", value: "−90 %" }, { label: "Økt møtebooking", value: "+3×" }, { label: "Leder-innsikt", value: "Sanntid" }] },
  { type: "cta" as const, headline: "Bygg\net team\nsom vinner.", cta: "Se teamfunksjoner på reachr.no →" },
];

function S10Slide({ slide, idx, total, showGuide }: { slide: typeof s10Slides[0]; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#ffad0a", color: "#171717", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>Team-features 🏆</div>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 50, fontWeight: 900, color: "#171717", lineHeight: 0.95, letterSpacing: "-2px" }}>{line}</p>
          ))}
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "problem" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ff470a", marginBottom: 16 }}>Uten system</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {slide.issues.map((issue, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "#faf8f2", border: "1.5px solid #d8d3c5", borderRadius: 12, padding: "12px 14px" }}>
                <span style={{ color: "#ff470a", fontWeight: 800, fontSize: 14 }}>✕</span>
                <p style={{ fontSize: 13, color: "#6b6660" }}>{issue}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {slide.type === "feature" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span style={{ fontSize: 40, marginBottom: 16 }}>{slide.icon}</span>
          {slide.name.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 44, fontWeight: 900, color: "#171717", lineHeight: 1.0, letterSpacing: "-1.5px" }}>{line}</p>
          ))}
          <div style={{ height: 3, width: 40, background: "#ffad0a", borderRadius: 2, marginTop: 16, marginBottom: 16 }} />
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65 }}>{slide.body}</p>
        </div>
      )}
      {slide.type === "result" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#09fe94", marginBottom: 16 }}>Med Reachr</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {slide.items.map((item, i) => (
              <div key={i} style={{ background: "#faf8f2", border: "1.5px solid #d8d3c5", borderRadius: 12, padding: "12px 12px" }}>
                <p style={{ fontSize: 18, fontWeight: 900, color: "#09fe94" }}>{item.value}</p>
                <p style={{ fontSize: 11, color: "#6b6660", marginTop: 4, lineHeight: 1.3 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.headline.split("\n").map((line, i) => (
            <p key={i} style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 50, fontWeight: 700, color: "#171717", lineHeight: 1.05 }}>{line}</p>
          ))}
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, fontSize: 14, color: "#171717", alignSelf: "flex-start" }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE-KONFIG
// ─────────────────────────────────────────────────────────────────────────────
const SERIES = [
  { id: 0, name: "LinkedIn er mettet", caption: "Hvorfor LinkedIn ikke lenger er gullstandarden for norsk B2B-salg.", slides: s1Slides, Renderer: S1Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }> },
  { id: 1, name: "5 tegn på at du trenger Reachr", caption: "Kjenner du deg igjen? Da er Reachr laget for deg.", slides: s2Slides, Renderer: S2Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }> },
  { id: 2, name: "Pipeline på 30 min", caption: "Vi utfordrer deg: bygg en full pipeline på under 30 minutter med Reachr.", slides: s3Slides, Renderer: S3Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }> },
  { id: 3, name: "AI-outreach som konverterer", caption: "Hva skiller en AI-melding som konverterer fra en som slettes?", slides: s4Slides, Renderer: S4Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }> },
  { id: 4, name: "Norsk B2B i 2025", caption: "5 ting du må vite om norsk B2B-salg i 2025.", slides: s5Slides, Renderer: S5Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }> },
  { id: 5, name: "Aldri mist et lead", caption: "Sånn sørger toppselgere for at ingen leads faller mellom stolene.", slides: s6Slides, Renderer: S6Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }> },
  { id: 6, name: "Fra fremmed til fast kunde", caption: "De fem stegene fra ukjent bedrift til lojal kunde — med Reachr.", slides: s7Slides, Renderer: S7Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }> },
  { id: 7, name: "Hva koster én salgsuke?", caption: "Vi regner ut hva en uke uten Reachr faktisk koster deg.", slides: s8Slides, Renderer: S8Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }> },
  { id: 8, name: "Filtrer til riktig kunde", caption: "Slik finner du den perfekte kunden på under ett minutt.", slides: s9Slides, Renderer: S9Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }> },
  { id: 9, name: "Teamets hemmelige våpen", caption: "Slik bruker vinnende salgsteam Reachr for å slå konkurrentene.", slides: s10Slides, Renderer: S10Slide as React.FC<{ slide: any; idx: number; total: number; showGuide: boolean }> },
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
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {SERIES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => changeSeries(i)}
            style={{
              padding: "6px 14px", borderRadius: 99,
              fontSize: 11, fontWeight: 600,
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
      <p style={{ color: "#555", fontSize: 13, fontStyle: "italic", textAlign: "center", maxWidth: 420 }}>
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
