"use client";

import { useRef } from "react";

const screenshots = [
  {
    id: 1,
    headline: "Finn nye kunder\npå sekunder",
    sub: "Søk blant 250 000+ norske bedrifter direkte fra Brønnøysundregistrene.",
    bg: "#171717",
    accent: "#09fe94",
    textColor: "#f2efe3",
    mockup: "search",
  },
  {
    id: 2,
    headline: "Hold styr på\nhver deal",
    sub: "Bygg en CRM-pipeline som gir deg full oversikt — fra første kontakt til lukket avtale.",
    bg: "#f2efe3",
    accent: "#09fe94",
    textColor: "#171717",
    mockup: "pipeline",
  },
  {
    id: 3,
    headline: "AI skriver\ne-posten for deg",
    sub: "Generer personlige salgsmeldinger basert på din pitch og kundens profil.",
    bg: "#171717",
    accent: "#09fe94",
    textColor: "#f2efe3",
    mockup: "email",
  },
  {
    id: 4,
    headline: "Ikke mist en\noppfølging",
    sub: "Få varsler når leads trenger kontakt — aldri gå glipp av en mulighet.",
    bg: "#f2efe3",
    accent: "#ff470a",
    textColor: "#171717",
    mockup: "alerts",
  },
  {
    id: 5,
    headline: "Selg mer.\nBruk mindre tid.",
    sub: "Reachr samler søk, CRM og AI i én enkel plattform for norske selgere.",
    bg: "#09fe94",
    accent: "#171717",
    textColor: "#171717",
    mockup: "cta",
  },
];

function SearchMockup({ accent }: { accent: string }) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="bg-[#faf8f2] border border-[#d8d3c5] rounded-xl px-4 py-3 flex items-center gap-2">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6b6660" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span className="text-[#6b6660] text-sm">Søk bedrift eller bransje…</span>
      </div>
      {["Rørleggertjenester AS", "Bergen Bygg & Anlegg", "Oslo Tech Solutions"].map((name, i) => (
        <div key={i} className="bg-[#faf8f2] border border-[#d8d3c5] rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="font-semibold text-[#171717] text-sm">{name}</div>
            <div className="text-xs text-[#6b6660] mt-0.5">{["Oslo", "Bergen", "Oslo"][i]} · {["12", "8", "34"][i]} ansatte</div>
          </div>
          <div style={{ background: accent }} className="rounded-lg px-3 py-1.5 text-xs font-bold text-[#171717]">+ Legg til</div>
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
    { label: "Kunde", count: 1, color: "#09fe94" },
  ];
  return (
    <div className="w-full flex flex-col gap-3">
      {statuses.map((s, i) => (
        <div key={i} className="bg-[#faf8f2] border border-[#d8d3c5] rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
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
    <div className="w-full flex flex-col gap-3">
      <div className="bg-[#faf8f2] border border-[#d8d3c5] rounded-xl p-4">
        <div className="text-xs text-[#6b6660] mb-1">Til: kontakt@bergenbygg.no</div>
        <div className="text-xs font-semibold text-[#171717] mb-2">Emne: Spar tid på prosjektstyring</div>
        <div className="text-xs text-[#6b6660] leading-relaxed">
          Hei Lars,<br/><br/>
          Jeg så at Bergen Bygg & Anlegg nylig har vokst til 8 ansatte — gratulerer! Vi hjelper byggebransjen med å…
        </div>
      </div>
      <div style={{ background: accent }} className="rounded-xl py-3 text-center text-sm font-bold text-[#171717]">
        ✦ Generer med AI
      </div>
    </div>
  );
}

function AlertsMockup({ accent }: { accent: string }) {
  const alerts = [
    { name: "Rørleggertjenester AS", msg: "Ingen kontakt på 7 dager", urgent: true },
    { name: "Oslo Tech Solutions", msg: "Møte i morgen kl. 10:00", urgent: false },
    { name: "Fjord Consulting", msg: "Ingen kontakt på 14 dager", urgent: true },
  ];
  return (
    <div className="w-full flex flex-col gap-3">
      {alerts.map((a, i) => (
        <div key={i} className="bg-[#faf8f2] border border-[#d8d3c5] rounded-xl p-4 flex gap-3 items-start">
          <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.urgent ? accent : "#09fe94" }} />
          <div>
            <div className="text-[#171717] text-sm font-semibold">{a.name}</div>
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
      <div className="text-6xl">⚡</div>
      <div className="flex gap-4 w-full">
        {["12 leads\nfunnet", "3 møter\nbooket", "1 deal\nlukket"].map((stat, i) => (
          <div key={i} className="flex-1 bg-[#faf8f2] border border-[#d8d3c5] rounded-xl p-3 text-center">
            {stat.split("\n").map((line, j) => (
              <div key={j} className={j === 0 ? "text-lg font-bold text-[#171717]" : "text-xs text-[#6b6660]"}>{line}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ background: accent }} className="w-full rounded-xl py-3 text-center text-sm font-bold text-[#171717]">
        Start gratis i dag →
      </div>
    </div>
  );
}

function Mockup({ type, accent }: { type: string; accent: string }) {
  if (type === "search") return <SearchMockup accent={accent} />;
  if (type === "pipeline") return <PipelineMockup accent={accent} />;
  if (type === "email") return <EmailMockup accent={accent} />;
  if (type === "alerts") return <AlertsMockup accent={accent} />;
  return <CtaMockup accent={accent} />;
}

export default function ScreenshotsPage() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDownload = async (index: number) => {
    const el = refs.current[index];
    if (!el) return;

    // Use browser print for now — or instruct user to screenshot
    alert(`Høyreklikk på skjermbildet og velg "Ta skjermbilde av element" i DevTools, eller bruk Cmd+Shift+4 på Mac.`);
  };

  return (
    <div className="min-h-screen bg-[#e8e4d8] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#171717] mb-2" style={{ fontFamily: "EB Garamond, serif" }}>
            Reachr — App Store Screenshots
          </h1>
          <p className="text-[#6b6660] text-sm">iPhone 6.7" format (1290 × 2796px) · Klikk for å laste ned</p>
        </div>

        <div className="flex flex-wrap gap-6 justify-center">
          {screenshots.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-3">
              {/* iPhone frame */}
              <div
                ref={(el) => { refs.current[i] = el; }}
                onClick={() => handleDownload(i)}
                className="cursor-pointer relative rounded-[48px] overflow-hidden shadow-2xl"
                style={{
                  width: 290,
                  height: 630,
                  background: s.bg,
                  border: "8px solid #2a2a2a",
                  boxShadow: "0 0 0 2px #444, 0 32px 64px rgba(0,0,0,0.4)",
                }}
              >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#2a2a2a] rounded-b-2xl z-10" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col px-6 pt-14 pb-10">
                  {/* Status bar */}
                  <div className="flex justify-between items-center mb-6 opacity-60">
                    <span className="text-xs font-semibold" style={{ color: s.textColor }}>9:41</span>
                    <div className="flex gap-1.5 items-center">
                      <svg width="16" height="12" viewBox="0 0 16 12" fill={s.textColor}><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1"/><rect x="9" y="0.5" width="3" height="11.5" rx="1"/><rect x="13.5" y="0" width="2.5" height="12" rx="1" opacity="0.3"/></svg>
                      <svg width="16" height="12" viewBox="0 0 24 24" fill="none" stroke={s.textColor} strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>
                      <svg width="25" height="12" viewBox="0 0 25 12" fill={s.textColor}><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={s.textColor} strokeOpacity="0.35" fill="none"/><rect x="2" y="2" width="16" height="8" rx="2"/><path d="M23 4.5v3a1.5 1.5 0 0 0 0-3z" fill={s.textColor} fillOpacity="0.4"/></svg>
                    </div>
                  </div>

                  {/* Logo */}
                  <div className="mb-4">
                    <span className="text-lg font-bold" style={{ color: s.accent, fontFamily: "EB Garamond, serif" }}>Reachr</span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-2xl font-bold leading-tight mb-3 whitespace-pre-line" style={{ color: s.textColor }}>
                    {s.headline}
                  </h2>

                  {/* Sub */}
                  <p className="text-xs leading-relaxed mb-6 opacity-75" style={{ color: s.textColor }}>
                    {s.sub}
                  </p>

                  {/* UI Mockup */}
                  <div className="flex-1 flex flex-col justify-center">
                    <Mockup type={s.mockup} accent={s.accent} />
                  </div>
                </div>
              </div>

              <span className="text-xs text-[#6b6660] font-medium">Skjermbilde {s.id}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[#6b6660] text-sm">
            Tips: Åpne DevTools (F12) → Høyreklikk på et skjermbilde → "Capture node screenshot" for PNG-eksport
          </p>
        </div>
      </div>
    </div>
  );
}
