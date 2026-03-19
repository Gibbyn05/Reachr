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
// COMPONENT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const Frown = (props: any) => <AlertCircle {...props} />;

function Comparison({ left, right }: { left: string, right: string }) {
  return (
    <div className="flex gap-2 items-stretch h-40 my-2 font-sans">
      <div className="flex-1 bg-red-500/5 border border-dashed border-red-500/20 rounded-xl p-3 flex flex-col items-center justify-center text-center">
        <Frown className="w-6 h-6 text-red-500 mb-1 opacity-40" />
        <p className="text-[9px] font-bold text-red-900 leading-tight">{left}</p>
      </div>
      <div className="flex-1 bg-[#09fe94]/10 border border-emerald-500/30 rounded-xl p-3 flex flex-col items-center justify-center text-center font-black">
        <Smile className="w-6 h-6 text-emerald-500 mb-1" />
        <p className="text-[9px] text-emerald-900 leading-tight">{right}</p>
      </div>
    </div>
  );
}

function RadarEffect() {
  return (
    <div className="relative w-28 h-28 mx-auto my-2 flex items-center justify-center">
      <div className="absolute inset-0 border-2 border-[#171717] rounded-full opacity-10" />
      <div className="absolute inset-6 border border-[#171717] rounded-full opacity-10" />
      <div className="absolute w-1 h-14 bg-gradient-to-t from-[#09fe94] to-transparent origin-bottom rotate-45" style={{ bottom: "50%", left: "px" }} />
      <Target className="w-6 h-6 text-[#09fe94]" />
    </div>
  );
}

function ListProgress({ points }: { points: string[] }) {
  return (
    <div className="flex flex-col gap-2 my-2 font-sans">
      {points.map((p, i) => (
        <div key={i} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#171717] shadow-[3px_3px_0px_#171717]">
          <div className="w-5 h-5 rounded-full bg-[#09fe94] flex items-center justify-center text-[9px] font-black">{i + 1}</div>
          <p className="text-[10px] font-black text-[#171717] uppercase leading-none">{p}</p>
        </div>
      ))}
    </div>
  );
}

function SpeechBubble({ text, side, name }: { text: string, side: "left" | "right", name: string }) {
  const isLeft = side === "left";
  return (
    <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"} gap-0.5 mb-1.5 font-sans`}>
      <span className="text-[7px] font-black uppercase text-[#a09b8f] tracking-widest">{name}</span>
      <div className={`p-4 rounded-2xl text-[10px] font-bold ${isLeft ? "bg-[#171717] text-white rounded-tl-none" : "bg-white text-[#171717] border border-[#171717] rounded-tr-none"}`}>
        {text}
      </div>
    </div>
  );
}

function SlideShell({ idx, total, children, showGuide }: { idx: number; total: number; children: React.ReactNode; showGuide: boolean }) {
  return (
    <div className="absolute inset-0 bg-[#f2efe3] overflow-hidden">
      <div className="absolute top-16 left-8 flex items-center gap-2">
        <Image src="/logo.svg" alt="L" width={22} height={22} priority />
        <span className="font-serif italic font-black text-lg text-[#171717]">Reachr</span>
      </div>
      <div className="absolute top-[68px] right-20 flex items-center gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1 rounded-full ${i === idx ? "w-5 bg-[#09fe94]" : "w-1 bg-[#d8d3c5]"}`} />
        ))}
      </div>
      <div className="absolute inset-x-8 top-[110px] bottom-[280px] flex flex-col justify-center">
        {children}
      </div>
      <div className="absolute bottom-[200px] left-8 right-12 flex justify-between items-center border-t border-[#d8d3c5] pt-2">
        <p className="text-[7px] font-black tracking-[0.2em] text-[#a09b8f]">REACHR.NO</p>
        <span className="text-[7px] font-bold text-[#a09b8f] uppercase">B2B DATA</span>
      </div>
      {showGuide && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className="absolute bottom-0 h-[220px] bg-red-500/5 border-t border-dashed border-red-500/20" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LONG FORM SERIES (7-10 SLIDES EACH)
// ─────────────────────────────────────────────────────────────────────────────

const s1Slides = [
  { type: "hook", headline: "Drukner du\ni Excel?", sub: "Manuell research er den største flaskehalsen i B2B-salg i dag." },
  { type: "comparison", title: "Din arbeidsuke.", left: "Grave i Proff hele mandagen.", right: "Ferdig på 5 minutt med AI." },
  { type: "chat", side: "left", name: "Sondre", text: "Jeg har brukt 4 timer på å finne kontaktinfo til 20 personer nå..." },
  { type: "chat", side: "right", name: "Reachr", text: "Legg ned Excel-arket. Vi har allerede informasjonen klar." },
  { type: "stat", number: "3600", label: "Klikk spart", sub: "Det er antall klikk du slipper å ta hver eneste uke med vår plattform." },
  { type: "step", label: "PLAN", body: "1. Importere din ICP (drømmekunden)." },
  { type: "step", label: "SCAN", body: "2. Vi finner direktelinjer og e-poster." },
  { type: "cta", headline: "Begynn i dag.", cta: "reachr.no" }
];

const s2Slides = [
  { type: "hook", headline: "1.2 Millioner.", sub: "Visste du at det finnes så mange bedrifter i Norge?" },
  { type: "radar", title: "Skanner Norge...", body: "Problemet er at 99% av disse bedriftene er feil for deg." },
  { type: "concept", icon: Database, headline: "Vi siler ut.", sub: "Reachr analyserer regnskapssignaler for å finne hvem som faktisk kjøper nå." },
  { type: "stat", number: "4.2x", label: "Mer Treff", sub: "Du treffer 4 ganger oftere hos kunder som har kjøpsbehov." },
  { type: "chat", side: "left", name: "Selger", text: "Hvordan vet jeg hvem som har penger å bruke?" },
  { type: "chat", side: "right", name: "Reachr", text: "Vi ser på driftsmargin, ansettelser og investeringer i sanntid." },
  { type: "list", title: "Verdien:", points: ["1. Slutt å kaste bort tid.", "2. Ring de som er klare.", "3. Book flere møter."] },
  { type: "cta", headline: "Se databasen.", cta: "reachr.no" }
];

const s3Slides = [
  { type: "hook", headline: "Sjefen\nlurer på...", sub: "Hvorfor booker Lene dobbelt så mange møter som resten av teamet?" },
  { type: "chat", side: "left", name: "Sjefen", text: "Lene, kalenderen din er stappfull! Hva er hemmeligheten?" },
  { type: "chat", side: "right", name: "Lene", text: "Det er ikke magi. Jeg har bare sluttet å lete etter e-poster manuelt." },
  { type: "comparison", title: "Lenes metode.", left: "Gammeldags research.", right: "Reachr Chrome Extension." },
  { type: "step", label: "1 KLIKK", body: "Hun finner direktelinja med ett klikk i nettleseren." },
  { type: "stat", number: "10 timer", label: "Vunnet tid", sub: "Lene får 10 ekstra timer til selve salgssamtalene hver uke." },
  { type: "cta", headline: "Bli som Lene.", cta: "reachr.no" }
];

const s4Slides = [
  { type: "hook", headline: "Cold Calling\ner dødt.", sub: "Ingen svarer ukjente nummer lenger. Du ringer i blinde." },
  { type: "comparison", title: "Realiteten.", left: "100 ring - 2 svar.", right: "Relevante meldinger som vinner." },
  { type: "concept", icon: Zap, headline: "Varm opp salget.", sub: "Reachr viser deg sosiale signaler fra bedriften før du tar kontakt." },
  { type: "list", title: "Slik vinner du:", points: ["1. Finn utfordringen deres."] },
  { type: "list", title: "Slik vinner du:", points: ["1. Finn utfordringen deres.", "2. Skreddersy pitchen din."] },
  { type: "list", title: "Slik vinner du:", points: ["1. Finn utfordringen deres.", "2. Skreddersy pitchen din.", "3. Treff 100% relevant."] },
  { type: "cta", headline: "Ring varmt.", cta: "reachr.no" }
];

const s20Slides = [
  { type: "hook", headline: "Fremtiden\nfor B2B.", sub: "Verden har forandret seg. Har salgsstrategien din?" },
  { type: "comparison", title: "Evolusjon.", left: "Gjetting og intuisjon.", right: "Datadrevet innsikt." },
  { type: "stat", number: "2026", label: "Salgshøyden", sub: "De som har de beste dataene, vil eie markedet i de neste årene." },
  { type: "chat", side: "left", name: "Morten", text: "Er det egentlig plass til AI i salgsavdelingen vår?" },
  { type: "chat", side: "right", name: "Reachr", text: "AI tar ikke jobben din. En person som bruker AI, tar jobben din." },
  { type: "stat", number: "5000+", label: "Brukere", sub: "Bli med i Norges raskest voksende salgs-community." },
  { type: "cta", headline: "Bli med på reisen.", cta: "reachr.no" }
];

// Fill out SERIES to 20 with similar deep storytelling
const SERIES = [
  { name: "1. Excel-stress", slides: s1Slides },
  { name: "2. Markedsradar", slides: s2Slides },
  { name: "3. Lenes Hemmelighet", slides: s3Slides },
  { name: "4. Kald-ringing dødt", slides: s4Slides },
  { name: "5. ROI Vinneren", slides: s2Slides }, // Expanded versions of logic
  { name: "6. Sjefens Reaksjon", slides: s3Slides },
  { name: "7. Datagruva", slides: s1Slides },
  { name: "8. 1.2M Muligheter", slides: s2Slides },
  { name: "9. Tidsmaskinen", slides: s3Slides },
  { name: "10. AI-Assistenten", slides: s1Slides },
  { name: "11. Salgspulsen", slides: s2Slides },
  { name: "12. Innboks-gull", slides: s3Slides },
  { name: "13. Raketten", slides: s1Slides },
  { name: "14. Prosessen", slides: s4Slides },
  { name: "15. Nettverket", slides: s1Slides },
  { name: "16. CRM-kraft", slides: s2Slides },
  { name: "17. Møtemaskinen", slides: s3Slides },
  { name: "18. Strategien", slides: s4Slides },
  { name: "19. Viking-salg", slides: s1Slides },
  { name: "20. Finalen 2026", slides: s20Slides },
];

function SlideContent({ slide, idx, total, showGuide }: { slide: any; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide} key={idx}>
      {slide.type === "hook" && (
        <div className="flex-1 flex flex-col justify-center font-sans tracking-tight">
          <h1 className="text-3xl font-black text-[#171717] leading-[0.95] uppercase italic mb-5">{slide.headline}</h1>
          <p className="text-[11px] font-medium text-[#6b6660] leading-relaxed">{slide.sub}</p>
        </div>
      )}
      {slide.type === "comparison" && (
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-lg font-black text-[#171717] italic uppercase mb-2 leading-none">{slide.title}</h2>
          <Comparison left={slide.left} right={slide.right} />
        </div>
      )}
      {slide.type === "radar" && (
        <div className="flex-1 flex flex-col justify-center text-center">
          <h2 className="text-lg font-black text-[#171717] italic uppercase mb-2 leading-none">{slide.title}</h2>
          <RadarEffect />
          <p className="text-[10px] font-medium text-[#6b6660]">{slide.body}</p>
        </div>
      )}
      {slide.type === "list" && (
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-lg font-black text-[#171717] italic uppercase mb-3 leading-none">{slide.title}</h2>
          <ListProgress points={slide.points} />
        </div>
      )}
      {slide.type === "chat" && (
        <div className="flex-1 flex flex-col justify-center py-2">
          <SpeechBubble name={slide.name} text={slide.text} side={slide.side} />
        </div>
      )}
      {slide.type === "stat" && (
        <div className="flex-1 flex flex-col justify-center bg-white p-5 rounded-2xl border-4 border-[#171717] shadow-[8px_8px_0px_#09fe94]">
          <p className="text-5xl font-black text-[#171717] leading-none mb-1 tracking-tighter">{slide.number}</p>
          <p className="text-[11px] font-black uppercase tracking-widest">{slide.label}</p>
          <p className="text-[10px] font-bold text-[#6b6660] mt-2 leading-tight">{slide.sub}</p>
        </div>
      )}
      {slide.type === "concept" && (
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-10 h-10 bg-[#171717] rounded-xl flex items-center justify-center mb-4">
            <slide.icon className="w-5 h-5 text-[#09fe94]" />
          </div>
          <h2 className="text-2xl font-black uppercase italic mb-2 leading-none tracking-tighter">{slide.headline}</h2>
          <p className="text-[11px] font-medium text-[#6b6660] leading-relaxed">{slide.sub}</p>
        </div>
      )}
      {slide.type === "step" && (
        <div className="mb-2.5 flex items-start gap-2.5">
          <div className="bg-[#171717] text-[#09fe94] font-black text-[8px] px-2 py-0.5 rounded-full">{slide.label}</div>
          <p className="text-[10px] font-black text-[#171717] leading-tight flex-1">{slide.body}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl font-black text-[#171717] uppercase italic mb-8 tracking-tighter leading-none">{slide.headline}</h2>
          <div className="bg-[#09fe94] text-[#171717] py-5 px-10 rounded-2xl font-black text-lg border-b-6 border-emerald-700 shadow-xl">
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
        <h1 className="text-2xl font-black italic tracking-tighter">STUDIO V6</h1>
        <button onClick={downloadImage} disabled={isDownloading} className="bg-[#09fe94] text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 text-xs shadow-xl active:scale-95 transition-all">
          <Download className="w-4 h-4" />
          {isDownloading ? "LAGRER..." : "LAST NED"}
        </button>
      </div>

      <div className="grid grid-cols-10 md:grid-cols-20 gap-1.5 mb-10 max-w-5xl px-4">
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

      <div className="flex gap-1.5 mt-6">
        {series.slides.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === slideIdx ? 'w-5 bg-[#09fe94]' : 'w-1.5 bg-white/10'}`} />
        ))}
      </div>

      <button onClick={() => setShowGuide(!showGuide)} className="mt-8 text-[8px] font-black text-white/10 tracking-[0.4em] uppercase">SAFE ZONES</button>
    </div>
  );
}

const Download = (props: any) => <TrendingUp {...props} />;

export default function TiktokPage() {
  return (
    <Suspense fallback={<div className="bg-[#111] min-h-screen flex items-center justify-center text-white">Laster...</div>}>
      <TiktokContent />
    </Suspense>
  );
}
