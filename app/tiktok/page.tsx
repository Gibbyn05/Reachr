"use client";

import { useState } from "react";

const slides = [
  {
    id: 1,
    bg: "#1a1a1a",
    screenBg: "#f2efe3",
    accent: "#09fe94",
    textColor: "#171717",
    headline: "Finn dine neste\nkunder på sekunder",
    sub: "Søk blant 250 000+ norske bedrifter direkte fra Brønnøysundregistrene.",
    mockup: "search",
    tag: "🔍 Leadsøk",
  },
  {
    id: 2,
    bg: "#1a1a1a",
    screenBg: "#f2efe3",
    accent: "#09fe94",
    textColor: "#171717",
    headline: "Hold styr på\nhver deal",
    sub: "Bygg en CRM-pipeline som gir deg full oversikt — fra første kontakt til lukket avtale.",
    mockup: "pipeline",
    tag: "📋 CRM Pipeline",
  },
  {
    id: 3,
    bg: "#1a1a1a",
    screenBg: "#f2efe3",
    accent: "#09fe94",
    textColor: "#171717",
    headline: "AI skriver\ne-posten for deg",
    sub: "Generer personlige salgsmeldinger basert på din pitch og kundens profil — på sekunder.",
    mockup: "email",
    tag: "✦ AI-meldinger",
  },
  {
    id: 4,
    bg: "#1a1a1a",
    screenBg: "#f2efe3",
    accent: "#09fe94",
    textColor: "#171717",
    headline: "Ikke mist en\noppfølging",
    sub: "Få varsler når leads trenger kontakt. Aldri gå glipp av en mulighet igjen.",
    mockup: "alerts",
    tag: "🔔 Varsler",
  },
  {
    id: 5,
    bg: "#1a1a1a",
    screenBg: "#f2efe3",
    accent: "#09fe94",
    textColor: "#171717",
    headline: "Selg mer.\nBruk mindre tid.",
    sub: "Reachr samler søk, CRM og AI i én enkel plattform for norske selgere.",
    mockup: "cta",
    tag: "🚀 Kom i gang",
  },
];

function StatusBar({ textColor }: { textColor: string }) {
  return (
    <div className="flex justify-between items-center mb-5" style={{ opacity: 0.7 }}>
      <span className="text-xs font-semibold" style={{ color: textColor }}>9:41</span>
      <div className="flex gap-1.5 items-center">
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill={textColor}>
          <rect x="0" y="5" width="3" height="7" rx="1" />
          <rect x="4.5" y="3" width="3" height="9" rx="1" />
          <rect x="9" y="1" width="3" height="11" rx="1" />
          <rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.3" />
        </svg>
        {/* Wifi */}
        <svg width="16" height="12" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2.5">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <circle cx="12" cy="20" r="1.5" fill={textColor} stroke="none" />
        </svg>
        {/* Battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill={textColor}>
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={textColor} strokeOpacity="0.35" fill="none" />
          <rect x="2" y="2" width="16" height="8" rx="2" />
          <path d="M23 4v4a2 2 0 0 0 0-4z" fill={textColor} fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

function SearchMockup({ accent }: { accent: string }) {
  const results = [
    { name: "Rørleggertjenester AS", location: "Oslo", employees: "12 ansatte", org: "Bransje: VVS" },
    { name: "Bergen Bygg & Anlegg", location: "Bergen", employees: "8 ansatte", org: "Bransje: Bygg" },
    { name: "Oslo Tech Solutions", location: "Oslo", employees: "34 ansatte", org: "Bransje: IT" },
  ];
  return (
    <div className="w-full flex flex-col gap-2.5">
      <div
        className="rounded-2xl px-4 py-3 flex items-center gap-2.5"
        style={{ background: "#faf8f2", border: "1.5px solid #d8d3c5" }}
      >
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#a09b8f" strokeWidth={2.5}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="text-[#a09b8f] text-sm">Søk bedrift eller bransje…</span>
      </div>
      {results.map((r, i) => (
        <div
          key={i}
          className="rounded-2xl p-3.5 flex justify-between items-center"
          style={{ background: "#faf8f2", border: "1.5px solid #d8d3c5" }}
        >
          <div>
            <div className="font-semibold text-[#171717] text-sm leading-tight">{r.name}</div>
            <div className="text-xs text-[#6b6660] mt-0.5">{r.location} · {r.employees}</div>
            <div className="text-xs text-[#a09b8f]">{r.org}</div>
          </div>
          <div
            className="rounded-xl px-3 py-1.5 text-xs font-bold text-[#171717] flex-shrink-0"
            style={{ background: accent }}
          >
            + Legg til
          </div>
        </div>
      ))}
    </div>
  );
}

function PipelineMockup({ accent }: { accent: string }) {
  const statuses = [
    { label: "Ikke kontaktet", count: 5, color: "#d8d3c5" },
    { label: "Kontaktet", count: 3, color: "#ffad0a" },
    { label: "Booket møte", count: 2, color: accent },
    { label: "Avslått", count: 1, color: "#ff470a" },
    { label: "Kunde", count: 1, color: "#09fe94" },
  ];
  return (
    <div className="w-full flex flex-col gap-2.5">
      {statuses.map((s, i) => (
        <div
          key={i}
          className="rounded-2xl px-4 py-3.5 flex items-center justify-between"
          style={{ background: "#faf8f2", border: "1.5px solid #d8d3c5" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-[#171717] text-sm font-medium">{s.label}</span>
          </div>
          <span className="text-[#6b6660] text-sm font-semibold">{s.count}</span>
        </div>
      ))}
    </div>
  );
}

function EmailMockup({ accent }: { accent: string }) {
  return (
    <div className="w-full flex flex-col gap-2.5">
      <div
        className="rounded-2xl p-4"
        style={{ background: "#faf8f2", border: "1.5px solid #d8d3c5" }}
      >
        <div className="text-xs text-[#a09b8f] mb-1">Til: kontakt@bergenbygg.no</div>
        <div className="text-xs font-semibold text-[#171717] mb-3">Emne: Spar tid på prosjektstyring</div>
        <div className="text-xs text-[#6b6660] leading-relaxed">
          Hei Lars,
          <br /><br />
          Jeg så at Bergen Bygg & Anlegg nylig har vokst til 8 ansatte — gratulerer! Vi hjelper byggebransjen med å automatisere kundeoppfølging…
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
          <span className="text-xs" style={{ color: accent }}>Skriver…</span>
        </div>
      </div>
      <div
        className="rounded-2xl py-3.5 text-center text-sm font-bold text-[#171717]"
        style={{ background: accent }}
      >
        ✦ Generer med AI
      </div>
    </div>
  );
}

function AlertsMockup({ accent }: { accent: string }) {
  const alerts = [
    { name: "Rørleggertjenester AS", msg: "Ingen kontakt på 7 dager", urgent: true, time: "Nå" },
    { name: "Oslo Tech Solutions", msg: "Møte i morgen kl. 10:00", urgent: false, time: "I dag" },
    { name: "Fjord Consulting", msg: "Ingen kontakt på 14 dager", urgent: true, time: "2d siden" },
  ];
  return (
    <div className="w-full flex flex-col gap-2.5">
      {alerts.map((a, i) => (
        <div
          key={i}
          className="rounded-2xl p-3.5 flex gap-3 items-start"
          style={{
            background: "#faf8f2",
            border: `1.5px solid ${a.urgent ? accent + "55" : "#d8d3c5"}`,
          }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
            style={{ background: a.urgent ? accent : "#09fe94" }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="text-[#171717] text-sm font-semibold truncate">{a.name}</div>
              <div className="text-[#a09b8f] text-xs flex-shrink-0 ml-2">{a.time}</div>
            </div>
            <div className="text-[#6b6660] text-xs mt-0.5">{a.msg}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CtaMockup({ accent }: { accent: string }) {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex gap-3 w-full">
        {[
          { stat: "250 000+", label: "bedrifter" },
          { stat: "AI", label: "e-poster" },
          { stat: "Full", label: "CRM" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex-1 rounded-2xl p-3 text-center"
            style={{ background: "#faf8f2", border: "1.5px solid #d8d3c5" }}
          >
            <div className="text-base font-bold text-[#171717]">{item.stat}</div>
            <div className="text-xs text-[#6b6660]">{item.label}</div>
          </div>
        ))}
      </div>
      <div
        className="w-full flex flex-col gap-2.5 rounded-2xl p-4"
        style={{ background: "#faf8f2", border: "1.5px solid #d8d3c5" }}
      >
        {["Søk blant norske bedrifter", "Legg til i CRM-pipeline", "Skriv AI-melding", "Send og lukk dealen"].map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-[#171717]"
              style={{ background: accent }}
            >
              {i + 1}
            </div>
            <span className="text-[#171717] text-sm">{step}</span>
          </div>
        ))}
      </div>
      <div
        className="w-full rounded-2xl py-3.5 text-center text-sm font-bold text-[#171717]"
        style={{ background: accent }}
      >
        Start gratis på reachr.no →
      </div>
    </div>
  );
}

function PhoneMockup({ slide }: { slide: (typeof slides)[0] }) {
  return (
    <div
      className="relative"
      style={{
        width: 280,
        height: 580,
        borderRadius: 44,
        background: "#0d0d0d",
        border: "9px solid #0d0d0d",
        boxShadow:
          "inset 0 0 0 1.5px #333, 0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px #222",
      }}
    >
      {/* Side buttons */}
      <div
        className="absolute"
        style={{
          left: -12,
          top: 100,
          width: 4,
          height: 32,
          borderRadius: 2,
          background: "#333",
        }}
      />
      <div
        className="absolute"
        style={{
          left: -12,
          top: 145,
          width: 4,
          height: 32,
          borderRadius: 2,
          background: "#333",
        }}
      />
      <div
        className="absolute"
        style={{
          right: -12,
          top: 120,
          width: 4,
          height: 56,
          borderRadius: 2,
          background: "#333",
        }}
      />

      {/* Screen */}
      <div
        className="relative overflow-hidden"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 36,
          background: slide.screenBg,
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 z-10"
          style={{
            transform: "translateX(-50%)",
            width: 110,
            height: 28,
            background: "#0d0d0d",
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col px-5 pt-12 pb-6 overflow-hidden">
          <StatusBar textColor={slide.textColor} />

          {/* Logo */}
          <div className="mb-3">
            <span
              className="font-bold italic"
              style={{
                color: slide.accent,
                fontSize: 18,
                fontFamily: "EB Garamond, Georgia, serif",
              }}
            >
              Reachr
            </span>
          </div>

          {/* Headline */}
          <h2
            className="font-bold leading-tight mb-2.5 whitespace-pre-line"
            style={{ color: slide.textColor, fontSize: 22, lineHeight: 1.2 }}
          >
            {slide.headline}
          </h2>

          {/* Sub */}
          <p
            className="leading-relaxed mb-4"
            style={{ color: slide.textColor, fontSize: 11.5, opacity: 0.7 }}
          >
            {slide.sub}
          </p>

          {/* Mockup content */}
          <div className="flex-1 overflow-hidden flex flex-col justify-start">
            {slide.mockup === "search" && <SearchMockup accent={slide.accent} />}
            {slide.mockup === "pipeline" && <PipelineMockup accent={slide.accent} />}
            {slide.mockup === "email" && <EmailMockup accent={slide.accent} />}
            {slide.mockup === "alerts" && <AlertsMockup accent={slide.accent} />}
            {slide.mockup === "cta" && <CtaMockup accent={slide.accent} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TiktokPage() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "#111", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="mb-6 text-center">
        <p className="text-[#6b6660] text-xs tracking-widest uppercase">
          TikTok Slideshow · 9×16 · {current + 1} / {slides.length}
        </p>
      </div>

      {/* 9:16 slide container */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: 405,
          height: 720,
          borderRadius: 24,
          background: slide.bg,
          boxShadow: "0 0 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* Gradient top */}
        <div
          className="absolute inset-x-0 top-0 h-32 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
          }}
        />

        {/* Slide number top-left */}
        <div className="absolute top-5 left-5 z-10">
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
          >
            {current + 1} / {slides.length}
          </div>
        </div>

        {/* Feature tag top-right */}
        <div className="absolute top-5 right-5 z-10">
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: slide.accent, color: "#171717" }}
          >
            {slide.tag}
          </div>
        </div>

        {/* Phone mockup */}
        <PhoneMockup slide={slide} />

        {/* Gradient bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
          }}
        />

        {/* Bottom branding */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center z-10">
          <span
            className="text-sm font-bold italic"
            style={{ color: slide.accent, fontFamily: "EB Garamond, Georgia, serif" }}
          >
            reachr.no
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: current === 0 ? "#222" : "#2a2a2a",
            color: current === 0 ? "#444" : "#fff",
            border: "1.5px solid #333",
            cursor: current === 0 ? "not-allowed" : "pointer",
          }}
        >
          ← Forrige
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all"
              style={{
                width: i === current ? 20 : 8,
                height: 8,
                background: i === current ? "#09fe94" : "#333",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrent((c) => Math.min(slides.length - 1, c + 1))}
          disabled={current === slides.length - 1}
          className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: current === slides.length - 1 ? "#222" : "#09fe94",
            color: current === slides.length - 1 ? "#444" : "#171717",
            border: "1.5px solid #333",
            cursor: current === slides.length - 1 ? "not-allowed" : "pointer",
          }}
        >
          Neste →
        </button>
      </div>

      {/* Export hint */}
      <div className="mt-5 text-center max-w-sm">
        <p className="text-[#444] text-xs leading-relaxed">
          Tips: Åpne DevTools → høyreklikk på slide-boksen → «Capture node screenshot» for å eksportere hver slide som PNG til TikTok.
        </p>
      </div>
    </div>
  );
}
