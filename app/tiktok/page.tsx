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
// COMPONENT HELPERS (Visual Diversity - STATIC)
// ─────────────────────────────────────────────────────────────────────────────

function Comparison({ left, right }: { left: string, right: string }) {
  return (
    <div className="flex gap-4 items-stretch h-56 my-4 font-sans">
      <div className="flex-1 bg-red-100/30 border-2 border-dashed border-red-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-[9px] font-black text-red-600 uppercase tracking-tighter mb-1">Gammel metode</p>
        <p className="text-xs font-bold text-red-900 leading-tight">{left}</p>
      </div>
      <div className="flex-1 bg-emerald-100/30 border-2 border-emerald-500/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
        <Smile className="w-8 h-8 text-emerald-500 mb-2" />
        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter mb-1">Reachr-metoden</p>
        <p className="text-xs font-black text-emerald-900 leading-tight">{right}</p>
      </div>
    </div>
  );
}

function RadarEffect() {
  return (
    <div className="relative w-40 h-40 mx-auto my-6 flex items-center justify-center font-sans">
      <div className="absolute inset-0 border-4 border-[#171717] rounded-full opacity-10" />
      <div className="absolute inset-8 border border-[#171717] rounded-full opacity-20" />
      <div className="absolute inset-16 border border-[#171717] rounded-full opacity-30" />
      <div className="absolute w-1 h-20 bg-gradient-to-t from-[#09fe94] to-transparent origin-bottom rotate-[45deg]" style={{ bottom: "50%", left: "px" }} />
      <Target className="w-8 h-8 text-[#09fe94]" />
      <div className="absolute top-2 right-4 bg-[#09fe94] p-1 rounded-sm text-[7px] font-black text-black">LEAD FOUND</div>
    </div>
  );
}

function StatsGraph({ data }: { data: number[] }) {
  return (
    <div className="flex items-end justify-between gap-2.5 h-40 my-6 px-4 border-b-2 border-[#171717] relative font-sans">
      <div className="absolute top-0 right-0 text-[9px] font-black text-[#09fe94] bg-black px-2 py-0.5 rounded">+400%</div>
      {data.map((h, i) => (
        <div key={i} className="flex-1 bg-[#171717] rounded-t-lg relative" style={{ height: `${h}%` }}>
          {i === data.length - 1 && <div className="absolute inset-0 bg-[#09fe94] rounded-t-lg shadow-lg" />}
        </div>
      ))}
    </div>
  );
}

function SpeechBubble({ text, side, name }: { text: string, side: "left" | "right", name: string }) {
  const isLeft = side === "left";
  return (
    <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"} gap-1.5 mb-5 font-sans`}>
      <span className="text-[8px] font-black uppercase text-[#a09b8f] tracking-widest">{name}</span>
      <div className={`p-4 rounded-3xl text-sm font-bold ${isLeft ? "bg-[#171717] text-white rounded-tl-none" : "bg-white text-[#171717] border-2 border-[#171717] rounded-tr-none"}`}>
        {text}
      </div>
    </div>
  );
}

function SlideShell({ idx, total, children, showGuide }: { idx: number; total: number; children: React.ReactNode; showGuide: boolean }) {
  return (
    <div className="absolute inset-0 bg-[#f2efe3] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
      
      {/* LOGO */}
      <div className="absolute top-20 left-8 flex items-center gap-2">
        <Image src="/logo.svg" alt="L" width={28} height={28} priority />
        <span className="font-serif italic font-black text-2xl text-[#171717]">Reachr</span>
      </div>

      {/* PROGRESS */}
      <div className="absolute top-[88px] right-[92px] flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-none ${i === idx ? "w-8 bg-[#09fe94]" : "w-1.5 bg-[#d8d3c5]"}`} />
        ))}
      </div>

      {/* CONTENT - Flyttet litt opp for å gi mer plass i bunnen */}
      <div className="absolute inset-0 mt-44 px-8 mb-[280px] flex flex-col justify-center">
        {children}
      </div>

      {/* FOOTER - Flyttet ned og gjort mindre */}
      <div className="absolute bottom-[230px] left-8 right-12 flex justify-between items-center border-t border-[#d8d3c5] pt-3">
        <p className="text-[9px] font-black tracking-[0.2em] text-[#a09b8f]">REACHR.NO</p>
        <div className="flex gap-1 items-center">
          <Shield className="w-2.5 h-2.5 text-[#09fe94]" />
          <span className="text-[7px] font-bold text-[#a09b8f] uppercase">Ekte B2B-data</span>
        </div>
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
// UPDATED SERIES (4-7 SLIDES EACH)
// ─────────────────────────────────────────────────────────────────────────────

const s1Slides = [
  { type: "comparison", title: "Finn ut hvem som vinner.", left: "5 timer manuelt arbeid.", right: "5 minutter med Reachr." },
  { type: "stat", number: "3600", label: "Klikk spart hver uke", sub: "For våre faste abonnenter." },
  { type: "concept", icon: Clock, headline: "Spar din tid.", sub: "Ikke bruk kvelden på Excel-filer." },
  { type: "step", label: "STEP 1", body: "Koble til din CRM på 60 sekunder." },
  { type: "step", label: "STEP 2", body: "La Reachr AI skanne hele markedet." },
  { type: "cta", headline: "Start i dag.", cta: "reachr.no" }
];

const s2Slides = [
  { type: "radar", title: "Ledig marked?", body: "Vi skanner 1.2 millioner bedrifter." },
  { type: "concept", icon: Search, headline: "Din radar.", sub: "Finn leads du aldri visste eksisterte." },
  { type: "stat", number: "1.2M", label: "Bedrifter", sub: "Sanntidsdata direkte fra Brønnøysund." },
  { type: "step", label: "SEARCH", body: "Filtrer på omsetning og bransje." },
  { type: "step", label: "TARGET", body: "Finn beslutningstakeren med ett klikk." },
  { type: "cta", headline: "Sjekk nå.", cta: "reachr.no" }
];

const s3Slides = [
  { type: "chat", name: "Sondre", side: "left", text: "Mandag igjen... Må vel bruke 6 timer på LinkedIn-lister." },
  { type: "chat", name: "Lene", side: "right", text: "Hæ? Jeg ble ferdig før lunsj med Reachr." },
  { type: "chat", name: "Sondre", side: "left", text: "Seriøst? Hvordan?" },
  { type: "chat", name: "Lene", side: "right", text: "Jeg bare trykket 'Generer' og vips..." },
  { type: "stat", number: "10t", label: "Spart", sub: "Per uke per selger." },
  { type: "cta", headline: "Bli ferdig.", cta: "reachr.no" }
];

const s4Slides = [
  { type: "graph", title: "Salgsekplosjon.", data: [20, 35, 30, 60, 55, 95] },
  { type: "stat", number: "31 %", label: "Ekstra vekst", sub: "Ved å bruke sanntidsdata fremfor Excel." },
  { type: "concept", icon: TrendingUp, headline: "Aldri stå stille.", sub: "Fyll pipelinen din automatisk 24/7." },
  { type: "step", label: "GROWTH", body: "Vi overvåker sosiale signaler og regnskap." },
  { type: "cta", headline: "Skalér nå.", cta: "reachr.no" }
];

const s5Slides = [
  { type: "concept", icon: Clock, headline: "Tid er penger.", sub: "Er du en selger eller en data-entry maskin?" },
  { type: "comparison", left: "Excel-helvete og gamle data.", right: "Nøyaktig B2B-innsikt." },
  { type: "stat", number: "1200", label: "Klikk spart", sub: "I gjennomsnitt hver dag." },
  { type: "step", label: "AUTO", body: "La AI skrive meldingene dine." },
  { type: "cta", headline: "Få mer tid.", cta: "Se demo" }
];

const s6Slides = [
  { type: "chat", name: "Sjefen", side: "left", text: "Hvordan klarte vi å doble salget denne måneden?" },
  { type: "chat", name: "Leder", side: "right", text: "Vi byttet ut gjetting med Reachr-data." },
  { type: "stat", number: "100%", label: "Resultat", sub: "Vi har aldri hatt så mange møter." },
  { type: "step", label: "WIN", body: "Hold oversikten over alle deals." },
  { type: "cta", headline: "Se løsningen.", cta: "reachr.no" }
];

const SERIES = [
  { name: "1. Metoden", slides: s1Slides },
  { name: "2. Radaren", slides: s2Slides },
  { name: "3. Kollegaen", slides: s3Slides },
  { name: "4. Tallene", slides: s4Slides },
  { name: "5. Klokka", slides: s5Slides },
  { name: "6. Sjefen", slides: s6Slides },
  { name: "7. Trakt", slides: s1Slides },
  { name: "8. Strategi", slides: s2Slides },
  { name: "9. Samtale", slides: s3Slides },
  { name: "10. Vekst", slides: s4Slides },
  { name: "11. Mandag", slides: s5Slides },
  { name: "12. Resultat", slides: s6Slides },
  { name: "13. Sanntid", slides: s1Slides },
  { name: "14. Skalering", slides: s2Slides },
  { name: "15. Innsikt", slides: s3Slides },
  { name: "16. Fart", slides: s4Slides },
  { name: "17. Demo", slides: s5Slides },
  { name: "18. Kontroll", slides: s6Slides },
  { name: "19. Pipelinen", slides: s1Slides },
  { name: "20. Finalen", slides: s2Slides },
];

function SlideContent({ slide, idx, total, showGuide }: { slide: any; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide} key={idx}>
      {slide.type === "comparison" && (
        <div className="flex-1 flex flex-col justify-center font-sans">
          <h2 className="text-3xl font-black text-[#171717] leading-none tracking-tighter mb-4 italic uppercase">{slide.title}</h2>
          <Comparison left={slide.left} right={slide.right} />
        </div>
      )}
      {slide.type === "radar" && (
        <div className="flex-1 flex flex-col justify-center text-center font-sans">
          <h2 className="text-3xl font-black text-[#171717] tracking-tighter mb-2 italic uppercase">{slide.title}</h2>
          <RadarEffect />
          <p className="text-sm font-medium text-[#6b6660]">{slide.body}</p>
        </div>
      )}
      {slide.type === "graph" && (
        <div className="flex-1 flex flex-col justify-center font-sans">
          <h2 className="text-3xl font-black text-[#171717] tracking-tighter italic uppercase mb-4">{slide.title}</h2>
          <StatsGraph data={slide.data} />
        </div>
      )}
      {slide.type === "chat" && (
        <div className="flex-1 flex flex-col justify-center py-4 font-sans">
          <SpeechBubble name={slide.name} text={slide.text} side={slide.side} />
        </div>
      )}
      {slide.type === "stat" && (
        <div className="flex-1 flex flex-col justify-center bg-white p-6 rounded-[32px] border-4 border-[#171717] shadow-[12px_12px_0px_#09fe94] font-sans">
          <p className="text-7xl font-black text-[#171717] tracking-tighter leading-none mb-2">{slide.number}</p>
          <p className="text-lg font-black text-[#171717] uppercase tracking-widest">{slide.label}</p>
          <p className="text-[11px] font-bold text-[#6b6660] mt-3 leading-tight">{slide.sub}</p>
        </div>
      )}
      {slide.type === "concept" && (
        <div className="flex-1 flex flex-col justify-center font-sans">
          <div className="w-16 h-16 bg-[#171717] rounded-2xl flex items-center justify-center mb-6">
            <slide.icon className="w-8 h-8 text-[#09fe94]" />
          </div>
          <h2 className="text-4xl font-black text-[#171717] leading-[0.9] tracking-tighter italic uppercase mb-4">{slide.headline}</h2>
          <p className="text-sm font-medium text-[#6b6660] leading-relaxed">{slide.sub}</p>
        </div>
      )}
      {slide.type === "step" && (
        <div className="mb-4 flex items-start gap-3 font-sans">
          <div className="bg-[#171717] text-[#09fe94] font-black text-[9px] px-3 py-1 rounded-full">{slide.label}</div>
          <p className="text-xs font-black text-[#171717] leading-tight">{slide.body}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center font-sans">
          <h2 className="text-5xl font-black text-[#171717] leading-none tracking-tighter uppercase italic mb-10">{slide.headline}</h2>
          <div className="bg-[#09fe94] text-[#171717] py-6 px-14 rounded-3xl font-black text-2xl border-b-8 border-emerald-700 shadow-2xl">
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
  const [isTiktokConnected, setIsTiktokConnected] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/tiktok/session");
        const data = await res.json();
        if (data.connected) setIsTiktokConnected(true);
      } catch (e) {}
    };
    checkSession();
  }, [searchParams]);

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
        <h1 className="text-3xl font-black italic tracking-tighter">STUDIO V2</h1>
        <button onClick={downloadImage} disabled={isDownloading} className="bg-[#09fe94] text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 text-sm shadow-xl active:scale-95 transition-all">
          {isDownloading ? <Clock className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          LAST NED
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl">
        {SERIES.map((s, i) => (
          <button key={i} onClick={() => { setSeriesIdx(i); setSlideIdx(0); }} className={`px-4 py-2 rounded-xl text-[10px] font-black border-2 transition-all ${i === seriesIdx ? 'bg-[#09fe94] border-[#09fe94] text-black scale-105 shadow-xl' : 'bg-transparent border-white/10 text-white/40'}`}>
            {i + 1}
          </button>
        ))}
      </div>

      <div className="relative group">
        <div ref={canvasRef} className="w-[405px] h-[720px] rounded-[48px] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.8)] bg-white">
          <SlideContent slide={series.slides[slideIdx]} idx={slideIdx} total={total} showGuide={showGuide} />
        </div>
        <button onClick={() => setSlideIdx(i => Math.max(0, i-1))} className="absolute top-1/2 -left-20 transform -translate-y-1/2 w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white transition-all text-2xl font-black">←</button>
        <button onClick={() => setSlideIdx(i => Math.min(total-1, i+1))} className="absolute top-1/2 -right-20 transform -translate-y-1/2 w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white transition-all text-2xl font-black">→</button>
      </div>

      <div className="flex gap-4 mt-8">
        {series.slides.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all ${i === slideIdx ? 'w-8 bg-[#09fe94]' : 'w-2 bg-white/10'}`} />
        ))}
      </div>

      <button onClick={() => setShowGuide(!showGuide)} className="mt-12 text-[9px] font-black text-white/10 tracking-[0.4em] uppercase">SAFE ZONES</button>
    </div>
  );
}

const Download = (props: any) => <TrendingUp {...props} />;

export default function TiktokPage() {
  return (
    <Suspense fallback={<div className="bg-[#111] min-h-screen flex items-center justify-center text-white">LASTUR...</div>}>
      <TiktokContent />
    </Suspense>
  );
}
