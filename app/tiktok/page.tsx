"use client";

import Image from "next/image";
import { useState, useRef, useEffect, Suspense } from "react";
import React from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { 
  User, Shield, Target, TrendingUp, Search, 
  Layers, Clock, Smile, Rocket, BarChart, 
  Database, Coffee, CheckCircle2, AlertCircle, 
  Download, Image as ImageIcon, MessageSquare, Zap
} from "lucide-react";
import * as htmlToImage from "html-to-image";

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT HELPERS (Compact and Static)
// ─────────────────────────────────────────────────────────────────────────────

function Comparison({ left, right }: { left: string, right: string }) {
  return (
    <div className="flex gap-3 items-stretch h-44 my-3 font-sans">
      <div className="flex-1 bg-red-100/30 border-2 border-dashed border-red-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
        <Frown className="w-7 h-7 text-red-500 mb-1" />
        <p className="text-[10px] font-black text-red-900 leading-tight">{left}</p>
      </div>
      <div className="flex-1 bg-emerald-100/40 border-2 border-emerald-500/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
        <Smile className="w-7 h-7 text-emerald-500 mb-1" />
        <p className="text-[10px] font-black text-emerald-900 leading-tight">{right}</p>
      </div>
    </div>
  );
}

function RadarEffect() {
  return (
    <div className="relative w-32 h-32 mx-auto my-3 flex items-center justify-center">
      <div className="absolute inset-0 border-4 border-[#171717] rounded-full opacity-10" />
      <div className="absolute inset-8 border border-[#171717] rounded-full opacity-20" />
      <div className="absolute w-1 h-16 bg-gradient-to-t from-[#09fe94] to-transparent origin-bottom rotate-45" style={{ bottom: "50%", left: "px" }} />
      <Target className="w-8 h-8 text-[#09fe94]" />
    </div>
  );
}

function ListProgress({ points }: { points: string[] }) {
  return (
    <div className="flex flex-col gap-3 my-4 font-sans">
      {points.map((p, i) => (
        <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-2xl border-2 border-[#171717] shadow-[4px_4px_0px_#171717]">
          <div className="w-6 h-6 rounded-full bg-[#09fe94] flex items-center justify-center text-[10px] font-black">{i + 1}</div>
          <p className="text-xs font-black text-[#171717] uppercase tracking-tight">{p}</p>
        </div>
      ))}
    </div>
  );
}

function SpeechBubble({ text, side, name }: { text: string, side: "left" | "right", name: string }) {
  const isLeft = side === "left";
  return (
    <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"} gap-1 mb-2.5 font-sans`}>
      <span className="text-[7px] font-black uppercase text-[#a09b8f] tracking-widest">{name}</span>
      <div className={`p-4 rounded-3xl text-[11px] font-bold ${isLeft ? "bg-[#171717] text-white rounded-tl-none" : "bg-white text-[#171717] border-2 border-[#171717] rounded-tr-none"}`}>
        {text}
      </div>
    </div>
  );
}

function SlideShell({ idx, total, children, showGuide }: { idx: number; total: number; children: React.ReactNode; showGuide: boolean }) {
  return (
    <div className="absolute inset-0 bg-[#f2efe3] overflow-hidden">
      <div className="absolute top-20 left-8 flex items-center gap-2">
        <Image src="/logo.svg" alt="L" width={24} height={24} priority />
        <span className="font-serif italic font-black text-xl text-[#171717]">Reachr</span>
      </div>
      <div className="absolute top-[88px] right-[92px] flex items-center gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full ${i === idx ? "w-6 bg-[#09fe94]" : "w-1.5 bg-[#d8d3c5]"}`} />
        ))}
      </div>
      <div className="absolute inset-0 top-[140px] px-8 bottom-[280px] flex flex-col justify-center">
        {children}
      </div>
      <div className="absolute bottom-[210px] left-8 right-12 flex justify-between items-center border-t border-[#d8d3c5] pt-3">
        <p className="text-[8px] font-black tracking-[0.2em] text-[#a09b8f]">REACHR.NO</p>
        <span className="text-[7px] font-bold text-[#a09b8f] uppercase">Ekte B2B-data</span>
      </div>
      {showGuide && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className="absolute top-0 bottom-0 right-0 w-20 bg-red-500/5 border-l border-dashed border-red-500/20" />
          <div className="absolute left-0 right-0 bottom-0 h-[220px] bg-red-500/5 border-t border-dashed border-red-500/20" />
          <div className="absolute left-0 right-0 top-0 h-[60px] bg-orange-500/5 border-b border-dashed border-orange-500/20" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 20 UNIQUE SERIES (NO DUPLICATES)
// ─────────────────────────────────────────────────────────────────────────────

const s1Slides = [{ type: "hook", headline: "Gull i innboksen.", sub: "Lær hvordan de beste i B2B jobber nå." }, { type: "comparison", title: "Metoden som vinner.", left: "Manuelle lister", right: "Reachr AI" }, { type: "stat", number: "3600", label: "Klikk spart", sub: "Hver uke per selger." }, { type: "step", label: "1", body: "Koble til CRM." }, { type: "cta", headline: "Begynn.", cta: "reachr.no" }];
const s2Slides = [{ type: "hook", headline: "Slutt å gjette.", sub: "Bade i ferske leads døgnet rundt." }, { type: "radar", title: "Markedsradar.", body: "Vi ser det du ikke ser." }, { type: "step", label: "AUTO", body: "Finn leads via regnskapssignaler." }, { type: "step", label: "DATA", body: "Eksportér rett til CRM." }, { type: "cta", headline: "Prøv nå.", cta: "reachr.no" }];
const s3Slides = [{ type: "chat", side: "left", name: "Sondre", text: "Jeg får aldri tak i beslutningstakere..." }, { type: "chat", side: "right", name: "Lene", text: "Fordi du ringer feil folk. Se her..." }, { type: "stat", number: "100%", label: "Resultat", sub: "Flere møter booket denne måneden." }, { type: "cta", headline: "Lær mer.", cta: "reachr.no" }];

// SERIES 4: PROGRESSIVE BUILD-UP (Requested)
const s4Slides = [
  { type: "hook", headline: "Tre steg til suksess.", sub: "Hvordan gå fra 0 til 15 møter i uka." },
  { type: "list", title: "Planen:", points: ["1. Identifisér målgruppen."] },
  { type: "list", title: "Planen:", points: ["1. Identifisér målgruppen.", "2. La Reachr AI finne e-posten."] },
  { type: "list", title: "Planen:", points: ["1. Identifisér målgruppen.", "2. La Reachr AI finne e-posten.", "3. Send personlig outreach."] },
  { type: "cta", headline: "Kopier planen.", cta: "reachr.no" }
];

const s5Slides = [
  { type: "hook", headline: "Tidstyven i salg.", sub: "Vi har funnet ut hva som holder deg tilbake." },
  { type: "stat", number: "10 timer", label: "Wasted", sub: "På manuell research hvert uke." },
  { type: "comparison", title: "Forskjellen.", left: "LinkedIn Manuelt", right: "Reachr Extension" },
  { type: "cta", headline: "Få tiden din tilbake.", cta: "rydd.no" }
];

const s6Slides = [
  { type: "hook", headline: "Sjefens hemmelighet.", sub: "Hvorfor noen team alltid lykkes." },
  { type: "chat", side: "left", name: "Sjefen", text: "Vi trenger flere leads i pipelinen nå!" },
  { type: "chat", side: "right", name: "Teamet", text: "Ikke stress, vi har akkurat satt på Reachr-auto." },
  { type: "step", label: "GROWTH", body: "Pipelinen fylles mens vi sover." },
  { type: "cta", headline: "Opplev magien.", cta: "reachr.no" }
];

const s7Slides = [
  { type: "hook", headline: "ROI på steroidier.", sub: "Vi regnet på prisen av et lead." },
  { type: "stat", number: "85 %", label: "Billigere", sub: "I forhold til Google Ads og LinkedIn Ads." },
  { type: "step", label: "CALC", body: "Finn dine perfekte kunder direkte." },
  { type: "cta", headline: "Regn selv.", cta: "reachr.no" }
];

const s8Slides = [
  { type: "hook", headline: "Gullgraverne.", sub: "Hvor det beste gullet i Norge ligget gjemt." },
  { type: "concept", icon: Database, headline: "Dyp data.", sub: "Vi graver i regnskap og historikk for deg." },
  { type: "radar", title: "Skanne nå.", body: "Ser gjennom over 1M bedrifter." },
  { type: "cta", headline: "Finn gull.", cta: "reachr.no" }
];

const s9Slides = [
  { type: "hook", headline: "Bye bye Cold Calling.", sub: "Hvorfor ingen tar telefonen lenger." },
  { type: "chat", side: "left", name: "Kunde", text: "Vennligst slutt å ringe meg midt i middagen." },
  { type: "chat", side: "right", name: "Smart Selger", text: "Jeg ringer bare de som faktisk vil snakke med meg." },
  { type: "cta", headline: "Bli smart.", cta: "reachr.no" }
];

const s10Slides = [
  { type: "hook", headline: "Din nye salgsassistent.", sub: "Aldri vær alene på kontoret igjen." },
  { type: "concept", icon: Zap, headline: "AI-drevet.", sub: "Som å ha 10 praktikanter som jobber gratis." },
  { type: "step", label: "READY", body: "Last opp ICP, få leads tilbake." },
  { type: "cta", headline: "Ansett Reachr AI.", cta: "reachr.no" }
];

const s11Slides = [
  { type: "hook", headline: "Møte-maskinen.", sub: "Klar for å booke møter i søvne?" },
  { type: "stat", number: "15/uke", label: "Snitt", sub: "For våre mest aktive brukere." },
  { type: "step", label: "BOOK", body: "Send kalenderlink til varme leads." },
  { type: "cta", headline: "Start maskinen.", cta: "reachr.no" }
];

const s12Slides = [
  { type: "hook", headline: "Viking-salg.", sub: "Hvordan vi tar over det norske markedet." },
  { type: "comparison", title: "Krigere.", left: "Uten data", right: "Med Reachr" },
  { type: "cta", headline: "Bli en vinner.", cta: "reachr.no" }
];

const s13Slides = [
  { type: "hook", headline: "Detective Mode.", sub: "Finn personen som faktisk kan si JA." },
  { type: "concept", icon: Search, headline: "Under radaren.", sub: "Se hvem som faktisk styrer selskapet." },
  { type: "cta", headline: "Oppdag sannheten.", cta: "reachr.no" }
];

const s14Slides = [
  { type: "hook", headline: "Inbox Zero Anxiety?", sub: "Hold innboksen din full av muligheter." },
  { type: "chat", side: "left", name: "Kristin", text: "Jeg får så mange svar på mailene mine nå!" },
  { type: "chat", side: "right", name: "Erik", text: "Fordi du endelig skriver til de rette personene." },
  { type: "cta", headline: "Fyll innboksen.", cta: "reachr.no" }
];

const s15Slides = [
  { type: "hook", headline: "Brønnøysund Hack.", sub: "Ulovlig bra data? Nei, bare smart bruk." },
  { type: "stat", number: "1.2M", label: "Kilder", sub: "Oppdatert hver eneste time." },
  { type: "cta", headline: "Få tilgang.", cta: "reachr.no" }
];

const s16Slides = [
  { type: "hook", headline: "Hvor ble det av lunsjen?", sub: "Slutt å bruke lunsjpausen på research." },
  { type: "comparison", title: "Lunsj-planen.", left: "Jobbe i pausen", right: "Nyt kaffen" },
  { type: "cta", headline: "Ta pause.", cta: "reachr.no" }
];

const s17Slides = [
  { type: "hook", headline: "Data-driven eller Die.", sub: "Fremtiden for B2B i Norge 2026." },
  { type: "concept", icon: Target, headline: "Laserfokus.", sub: "Det er ikke lenger plass til de som gjetter." },
  { type: "cta", headline: "Bli datadrevet.", cta: "reachr.no" }
];

const s18Slides = [
  { type: "hook", headline: "Reachr Extension.", sub: "Din nye beste venn i nettleseren." },
  { type: "step", label: "1 KLIKK", body: "Finn kontaktinfo rett på nettsiden." },
  { type: "cta", headline: "Last ned gratis.", cta: "reachr.no" }
];

const s19Slides = [
  { type: "hook", headline: "LinkedIn på autopilot.", sub: "Treff de rette folka mens du sover." },
  { type: "chat", side: "left", name: "Morten", text: "Er LinkedIn egentlig verdt det?" },
  { type: "chat", side: "right", name: "Camilla", text: "Med Reachr? Ja, 1000% verdt det." },
  { type: "cta", headline: "Se hvorfor.", cta: "reachr.no" }
];

const s20Slides = [
  { type: "hook", headline: "Bli en Reachr.", sub: "Bli med i det raskest voksende salgsmiljøet." },
  { type: "stat", number: "5000+", label: "Brukere", sub: "Allerede i gang med å forandre salgshverdagen." },
  { type: "cta", headline: "Bli medlem.", cta: "reachr.no" }
];

const SERIES = [
  { name: "1. Gull", slides: s1Slides },
  { name: "2. Radar", slides: s2Slides },
  { name: "3. Dialog", slides: s3Slides },
  { name: "4. Planen", slides: s4Slides },
  { name: "5. Klokka", slides: s5Slides },
  { name: "6. Sjefen", slides: s6Slides },
  { name: "7. ROI", slides: s7Slides },
  { name: "8. Gruva", slides: s8Slides },
  { name: "9. Stop", slides: s9Slides },
  { name: "10. AI", slides: s10Slides },
  { name: "11. Møter", slides: s11Slides },
  { name: "12. Viking", slides: s12Slides },
  { name: "13. Detektiv", slides: s13Slides },
  { name: "14. Innboks", slides: s14Slides },
  { name: "15. Hack", slides: s15Slides },
  { name: "16. Lunsj", slides: s16Slides },
  { name: "17. Fremtid", slides: s17Slides },
  { name: "18. Ext", slides: s18Slides },
  { name: "19. LinkedIn", slides: s19Slides },
  { name: "20. Finalen", slides: s20Slides },
];

function SlideContent({ slide, idx, total, showGuide }: { slide: any; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide} key={idx}>
      {slide.type === "hook" && (
        <div className="flex-1 flex flex-col justify-center font-sans tracking-tight">
          <h1 className="text-4xl font-black text-[#171717] leading-[0.9] uppercase italic mb-6">{slide.headline}</h1>
          <p className="text-sm font-medium text-[#6b6660] leading-relaxed">{slide.sub}</p>
        </div>
      )}
      {slide.type === "comparison" && (
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-xl font-black text-[#171717] italic uppercase mb-3">{slide.title}</h2>
          <Comparison left={slide.left} right={slide.right} />
        </div>
      )}
      {slide.type === "radar" && (
        <div className="flex-1 flex flex-col justify-center text-center">
          <h2 className="text-xl font-black text-[#171717] italic uppercase mb-3">{slide.title}</h2>
          <RadarEffect />
          <p className="text-[11px] font-medium text-[#6b6660]">{slide.body}</p>
        </div>
      )}
      {slide.type === "list" && (
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-xl font-black text-[#171717] italic uppercase mb-4">{slide.title}</h2>
          <ListProgress points={slide.points} />
        </div>
      )}
      {slide.type === "chat" && (
        <div className="flex-1 flex flex-col justify-center">
          <SpeechBubble name={slide.name} text={slide.text} side={slide.side} />
        </div>
      )}
      {slide.type === "stat" && (
        <div className="flex-1 flex flex-col justify-center bg-white p-6 rounded-[24px] border-4 border-[#171717] shadow-[10px_10px_0px_#09fe94]">
          <p className="text-6xl font-black text-[#171717] leading-none mb-1">{slide.number}</p>
          <p className="text-sm font-black uppercase tracking-widest">{slide.label}</p>
          <p className="text-[10px] font-bold text-[#6b6660] mt-2">{slide.sub}</p>
        </div>
      )}
      {slide.type === "concept" && (
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-12 h-12 bg-[#171717] rounded-xl flex items-center justify-center mb-4">
            <slide.icon className="w-6 h-6 text-[#09fe94]" />
          </div>
          <h2 className="text-2xl font-black uppercase italic mb-2 leading-none">{slide.headline}</h2>
          <p className="text-xs font-medium text-[#6b6660]">{slide.sub}</p>
        </div>
      )}
      {slide.type === "step" && (
        <div className="mb-3 flex items-start gap-3">
          <div className="bg-[#171717] text-[#09fe94] font-black text-[9px] px-2 py-0.5 rounded-full">{slide.label}</div>
          <p className="text-[11px] font-black text-[#171717]">{slide.body}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl font-black text-[#171717] uppercase italic mb-8 p-1">{slide.headline}</h2>
          <div className="bg-[#09fe94] text-[#171717] py-4 px-10 rounded-2xl font-black text-xl border-b-6 border-emerald-700 shadow-xl">
            {slide.cta}
          </div>
        </div>
      )}
    </SlideShell>
  );
}

function TiktokContent() {
  const searchParams = useSearchParams();
  const [seriesIdx, setSeriesIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const series = SERIES[seriesIdx];
  const total = series.slides.length;

  const downloadImage = async () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(canvasRef.current, { pixelRatio: 3, quality: 1 });
      const link = document.createElement('a');
      link.download = `reachr-${seriesIdx + 1}-${slideIdx + 1}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Lastet ned!");
    } catch (err) { toast.error("Feil."); }
    finally { setIsDownloading(false); }
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col items-center py-12 px-4 select-none font-sans text-white">
      <div className="w-full max-w-2xl flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black italic tracking-tighter">STUDIO V4</h1>
        <button onClick={downloadImage} disabled={isDownloading} className="bg-[#09fe94] text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 text-xs shadow-xl active:scale-95 transition-all">
          <Download className="w-4 h-4" />
          {isDownloading ? "LAGRER..." : "LAST NED"}
        </button>
      </div>

      <div className="grid grid-cols-10 md:grid-cols-20 gap-1.5 mb-10 max-w-5xl">
        {SERIES.map((_, i) => (
          <button key={i} onClick={() => { setSeriesIdx(i); setSlideIdx(0); }} className={`w-8 h-8 rounded-lg text-[10px] font-black border transition-all ${i === seriesIdx ? 'bg-[#09fe94] border-[#09fe94] text-black' : 'bg-transparent border-white/10 text-white/40'}`}>
            {i + 1}
          </button>
        ))}
      </div>

      <div className="relative group">
        <div ref={canvasRef} className="w-[405px] h-[720px] rounded-[48px] overflow-hidden shadow-2xl bg-white">
          <SlideContent slide={series.slides[slideIdx]} idx={slideIdx} total={total} showGuide={showGuide} />
        </div>
        <button onClick={() => setSlideIdx(i => Math.max(0, i-1))} className="absolute top-1/2 -left-16 transform -translate-y-1/2 text-white/20 hover:text-white transition-all text-2xl font-black">←</button>
        <button onClick={() => setSlideIdx(i => Math.min(total-1, i+1))} className="absolute top-1/2 -right-16 transform -translate-y-1/2 text-white/20 hover:text-white transition-all text-2xl font-black">→</button>
      </div>

      <div className="flex gap-2 mt-6">
        {series.slides.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === slideIdx ? 'w-6 bg-[#09fe94]' : 'w-1.5 bg-white/10'}`} />
        ))}
      </div>

      <button onClick={() => setShowGuide(!showGuide)} className="mt-8 text-[8px] font-black text-white/10 tracking-[0.4em] uppercase">SAFE ZONES</button>
    </div>
  );
}

const Download = (props: any) => <TrendingUp {...props} />;
const Frown = (props: any) => <AlertCircle {...props} />;

export default function TiktokPage() {
  return (
    <Suspense fallback={<div className="bg-[#111] min-h-screen flex items-center justify-center text-white">LASTUR...</div>}>
      <TiktokContent />
    </Suspense>
  );
}
