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
// COMPONENT HELPERS (UI RE-DENSEFIED TO PREVENT OVERLAP)
// ─────────────────────────────────────────────────────────────────────────────

function Comparison({ left, right }: { left: string, right: string }) {
  return (
    <div className="flex gap-4 items-stretch h-48 my-3 font-sans">
      <div className="flex-1 bg-red-100/30 border-2 border-dashed border-red-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-[9px] font-black text-red-600 uppercase tracking-tighter mb-1">Gammel</p>
        <p className="text-[11px] font-bold text-red-900 leading-tight">{left}</p>
      </div>
      <div className="flex-1 bg-emerald-100/40 border-2 border-emerald-500/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
        <Smile className="w-8 h-8 text-emerald-500 mb-2" />
        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter mb-1">Reachr</p>
        <p className="text-[11px] font-black text-emerald-900 leading-tight">{right}</p>
      </div>
    </div>
  );
}

function RadarEffect() {
  return (
    <div className="relative w-36 h-36 mx-auto my-4 flex items-center justify-center font-sans">
      <div className="absolute inset-0 border-4 border-[#171717] rounded-full opacity-10" />
      <div className="absolute inset-8 border border-[#171717] rounded-full opacity-20" />
      <div className="absolute inset-12 border border-[#171717] rounded-full opacity-30" />
      <div className="absolute w-1 h-18 bg-gradient-to-t from-[#09fe94] to-transparent origin-bottom rotate-[45deg]" style={{ bottom: "50%", left: "px" }} />
      <Target className="w-8 h-8 text-[#09fe94]" />
      <div className="absolute top-2 right-2 bg-[#09fe94] p-1 rounded-sm text-[7px] font-black text-black">FOUND</div>
    </div>
  );
}

function StatsGraph({ data }: { data: number[] }) {
  return (
    <div className="flex items-end justify-between gap-2 h-36 my-4 px-4 border-b-2 border-[#171717] relative font-sans">
      <div className="absolute top-0 right-0 text-[8px] font-black text-[#09fe94] bg-black px-1.5 py-0.5 rounded">UP</div>
      {data.map((h, i) => (
        <div key={i} className="flex-1 bg-[#171717] rounded-t-lg" style={{ height: `${h}%` }}>
          {i === data.length - 1 && <div className="absolute inset-0 bg-[#09fe94] rounded-t-lg" />}
        </div>
      ))}
    </div>
  );
}

function SpeechBubble({ text, side, name }: { text: string, side: "left" | "right", name: string }) {
  const isLeft = side === "left";
  return (
    <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"} gap-1 mb-3 font-sans`}>
      <span className="text-[8px] font-black uppercase text-[#a09b8f] tracking-widest">{name}</span>
      <div className={`p-4 rounded-3xl text-xs font-bold ${isLeft ? "bg-[#171717] text-white rounded-tl-none" : "bg-white text-[#171717] border-2 border-[#171717] rounded-tr-none"}`}>
        {text}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE SHELL (Redesigned with safe-buffer at bottom)
// ─────────────────────────────────────────────────────────────────────────────

function SlideShell({ idx, total, children, showGuide }: { idx: number; total: number; children: React.ReactNode; showGuide: boolean }) {
  return (
    <div className="absolute inset-0 bg-[#f2efe3] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
      
      {/* LOGO - Fixed position */}
      <div className="absolute top-20 left-8 flex items-center gap-2">
        <Image src="/logo.svg" alt="L" width={24} height={24} priority />
        <span className="font-serif italic font-black text-xl text-[#171717]">Reachr</span>
      </div>

      {/* PROGRESS */}
      <div className="absolute top-[88px] right-[92px] flex items-center gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1 rounded-full ${i === idx ? "w-6 bg-[#09fe94]" : "w-1.5 bg-[#d8d3c5]"}`} />
        ))}
      </div>

      {/* CONTENT AREA - COMPACTED AND LIFTED */}
      <div className="absolute inset-0 top-[140px] px-8 bottom-[280px] flex flex-col justify-center">
        {children}
      </div>

      {/* FOOTER - MOVED EVEN LOWER TO CLEAR CONTENT */}
      <div className="absolute bottom-[200px] left-8 right-12 flex justify-between items-center border-t border-[#d8d3c5] pt-3">
        <p className="text-[8px] font-black tracking-[0.2em] text-[#a09b8f]">REACHR.NO</p>
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
// UPDATED SERIES
// ─────────────────────────────────────────────────────────────────────────────

const s1Slides = [{ type: "comparison", title: "Finn ut hvem som vinner.", left: "5 timer manuelt kjedelig arbeid.", right: "5 sekunder med Reachr AI." }, { type: "stat", number: "3600", label: "Klikk spart", sub: "Gjør som de beste i bransjen." }, { type: "step", label: "1", body: "Koble til din CRM på 60 sek." }, { type: "step", label: "2", body: "La AI skanne markedet." }, { type: "cta", headline: "Start i dag.", cta: "reachr.no" }];
const s2Slides = [{ type: "radar", title: "Ledig marked?", body: "Vi skanner 1.2M norske bedrifter." }, { type: "concept", icon: Search, headline: "Din radar.", sub: "Finn leads i dypet." }, { type: "step", label: "SCAN", body: "Filtrer på omsetning." }, { type: "step", label: "TARGET", body: "Finn beslutningstakere." }, { type: "cta", headline: "Sjekk nå.", cta: "reachr.no" }];
const s3Slides = [{ type: "chat", name: "Sondre", side: "left", text: "Må vel bruke 6 timer på lister." }, { type: "chat", name: "Lene", side: "right", text: "Fullførte akkurat på 5 minutt." }, { type: "stat", number: "10t", label: "Spart tid", sub: "Per uke per selger." }, { type: "cta", headline: "Bli ferdig.", cta: "reachr.no" }];

const SERIES = [
  { name: "1. Metoden", slides: s1Slides },
  { name: "2. Radaren", slides: s2Slides },
  { name: "3. Kollegaen", slides: s3Slides },
  { name: "4. Tallene", slides: s1Slides },
  { name: "5. Klokka", slides: s2Slides },
  { name: "6. Målet", slides: s3Slides },
  { name: "7. Anatomien", slides: s1Slides },
  { name: "8. Gründeren", slides: s2Slides },
  { name: "9. Fremtiden", slides: s3Slides },
  { name: "10. Innboksen", slides: s1Slides },
  { name: "11. Deep Scan", slides: s2Slides },
  { name: "12. Kaffesnakk", slides: s3Slides },
  { name: "13. Raketten", slides: s1Slides },
  { name: "14. Tidstyv", slides: s2Slides },
  { name: "15. Bullseye", slides: s3Slides },
  { name: "16. Lagene", slides: s1Slides },
  { name: "17. Rådgiveren", slides: s2Slides },
  { name: "18. Skalering", slides: s3Slides },
  { name: "19. Pipelinen", slides: s1Slides },
  { name: "20. Sanntid", slides: s2Slides },
];

function SlideContent({ slide, idx, total, showGuide }: { slide: any; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide} key={idx}>
      {slide.type === "comparison" && (
        <div className="flex-1 flex flex-col justify-center font-sans">
          <h2 className="text-2xl font-black text-[#171717] leading-none tracking-tighter mb-2 italic uppercase">{slide.title}</h2>
          <Comparison left={slide.left} right={slide.right} />
        </div>
      )}
      {slide.type === "radar" && (
        <div className="flex-1 flex flex-col justify-center text-center font-sans">
          <h2 className="text-2xl font-black text-[#171717] tracking-tighter mb-2 italic uppercase">{slide.title}</h2>
          <RadarEffect />
          <p className="text-[11px] font-medium text-[#6b6660]">{slide.body}</p>
        </div>
      )}
      {slide.type === "graph" && (
        <div className="flex-1 flex flex-col justify-center font-sans">
          <h2 className="text-2xl font-black text-[#171717] tracking-tighter italic uppercase mb-2">{slide.title}</h2>
          <StatsGraph data={slide.data} />
        </div>
      )}
      {slide.type === "chat" && (
        <div className="flex-1 flex flex-col justify-center py-2 font-sans">
          <SpeechBubble name={slide.name} text={slide.text} side={slide.side} />
        </div>
      )}
      {slide.type === "stat" && (
        <div className="flex-1 flex flex-col justify-center bg-white p-6 rounded-[24px] border-4 border-[#171717] shadow-[10px_10px_0px_#09fe94] font-sans">
          <p className="text-6xl font-black text-[#171717] tracking-tighter leading-none mb-1">{slide.number}</p>
          <p className="text-sm font-black text-[#171717] uppercase tracking-widest">{slide.label}</p>
          <p className="text-[10px] font-bold text-[#6b6660] mt-2 leading-tight">{slide.sub}</p>
        </div>
      )}
      {slide.type === "concept" && (
        <div className="flex-1 flex flex-col justify-center font-sans">
          <div className="w-12 h-12 bg-[#171717] rounded-xl flex items-center justify-center mb-4">
            <slide.icon className="w-6 h-6 text-[#09fe94]" />
          </div>
          <h2 className="text-3xl font-black text-[#171717] leading-[0.9] tracking-tighter italic uppercase mb-3">{slide.headline}</h2>
          <p className="text-xs font-medium text-[#6b6660] leading-relaxed">{slide.sub}</p>
        </div>
      )}
      {slide.type === "step" && (
        <div className="mb-3 flex items-start gap-3 font-sans">
          <div className="bg-[#171717] text-[#09fe94] font-black text-[8px] px-2 py-0.5 rounded-full">{slide.label}</div>
          <p className="text-[11px] font-black text-[#171717] leading-tight">{slide.body}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center font-sans">
          <h2 className="text-4xl font-black text-[#171717] leading-none tracking-tighter uppercase italic mb-8">{slide.headline}</h2>
          <div className="bg-[#09fe94] text-[#171717] py-5 px-10 rounded-2xl font-black text-xl border-b-6 border-emerald-700 shadow-xl">
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
        <h1 className="text-2xl font-black italic tracking-tighter">STUDIO V3</h1>
        <button onClick={downloadImage} disabled={isDownloading} className="bg-[#09fe94] text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 text-xs shadow-xl active:scale-95 transition-all">
          <Download className="w-4 h-4" />
          {isDownloading ? "LAGRER..." : "LAST NED"}
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 mb-10 max-w-4xl">
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

export default function TiktokPage() {
  return (
    <Suspense fallback={<div className="bg-[#111] min-h-screen flex items-center justify-center text-white">LASTUR...</div>}>
      <TiktokContent />
    </Suspense>
  );
}
