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
  Download, Image as ImageIcon
} from "lucide-react";
import * as htmlToImage from "html-to-image";

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT HELPERS (Visual Diversity - NOW STATIC)
// ─────────────────────────────────────────────────────────────────────────────

function Comparison({ left, right }: { left: string, right: string }) {
  return (
    <div className="flex gap-4 items-stretch h-64 my-6 font-sans">
      <div className="flex-1 bg-red-100/30 border-2 border-dashed border-red-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
        <p className="text-[10px] font-black text-red-600 uppercase tracking-tighter mb-2">Gammel metode</p>
        <p className="text-sm font-bold text-red-900 leading-tight">{left}</p>
      </div>
      <div className="flex-1 bg-emerald-100/30 border-2 border-emerald-500/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
        <Smile className="w-10 h-10 text-emerald-500 mb-2" />
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter mb-2">Reachr-metoden</p>
        <p className="text-sm font-black text-emerald-900 leading-tight">{right}</p>
      </div>
    </div>
  );
}

function RadarEffect() {
  return (
    <div className="relative w-48 h-48 mx-auto my-8 flex items-center justify-center font-sans">
      <div className="absolute inset-0 border-4 border-[#171717] rounded-full opacity-10" />
      <div className="absolute inset-8 border border-[#171717] rounded-full opacity-20" />
      <div className="absolute inset-16 border border-[#171717] rounded-full opacity-30" />
      {/* STATIC RADAR LINE */}
      <div className="absolute w-1 h-24 bg-gradient-to-t from-[#09fe94] to-transparent origin-bottom rotate-[45deg]" style={{ bottom: "50%", left: "px" }} />
      <Target className="w-10 h-10 text-[#09fe94]" />
      <div className="absolute top-4 right-8 bg-[#09fe94] p-1 rounded-sm text-[8px] font-bold text-black shadow-sm">LEAD FOUND</div>
    </div>
  );
}

function StatsGraph({ data }: { data: number[] }) {
  return (
    <div className="flex items-end justify-between gap-3 h-48 my-8 px-4 border-b-2 border-[#171717] relative font-sans">
      <div className="absolute top-0 right-0 text-[10px] font-black text-[#09fe94] bg-black px-2 py-1 rounded">+400% VEKST</div>
      {data.map((h, i) => (
        <div key={i} className="flex-1 bg-[#171717] rounded-t-lg relative" style={{ height: `${h}%` }}>
          {i === data.length - 1 && <div className="absolute inset-0 bg-[#09fe94] rounded-t-lg shadow-[0_0_20px_rgba(9,254,148,0.4)]" />}
        </div>
      ))}
    </div>
  );
}

function SpeechBubble({ text, side, name }: { text: string, side: "left" | "right", name: string }) {
  const isLeft = side === "left";
  return (
    <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"} gap-2 mb-6 font-sans`}>
      <span className="text-[9px] font-black uppercase text-[#a09b8f] tracking-widest">{name}</span>
      <div className={`p-4 rounded-3xl text-sm font-bold shadow-xl ${isLeft ? "bg-[#171717] text-white rounded-tl-none" : "bg-white text-[#171717] border-2 border-[#171717] rounded-tr-none"}`}>
        {text}
      </div>
    </div>
  );
}

function SafeZoneOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <div className="absolute top-0 bottom-0 right-0 w-20 bg-red-500/5 border-l border-dashed border-red-500/20" />
      <div className="absolute left-0 right-0 bottom-0 h-[220px] bg-red-500/5 border-t border-dashed border-red-500/20" />
      <div className="absolute left-0 right-0 top-0 h-[60px] bg-orange-500/5 border-b border-dashed border-orange-500/20" />
    </div>
  );
}

function SlideShell({ idx, total, children, showGuide }: { idx: number; total: number; children: React.ReactNode; showGuide: boolean }) {
  return (
    <div className="absolute inset-0 select-none bg-[#f2efe3] overflow-hidden">
      {/* NO ANIMATIONS IN BACKGROUND */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
      
      {/* LOGO AREA */}
      <div className="absolute top-20 left-8 flex items-center gap-2">
        <Image src="/logo.svg" alt="L" width={28} height={28} priority />
        <span className="font-serif italic font-black text-2xl text-[#171717]">Reachr</span>
      </div>

      {/* PROGRESS BAR */}
      <div className="absolute top-[88px] right-[92px] flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-none ${i === idx ? "w-10 bg-[#09fe94]" : "w-2 bg-[#d8d3c5]"}`} />
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="absolute inset-0 mt-44 px-8 mb-[268px] flex flex-col justify-center">
        {children}
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-[232px] left-8 right-12 flex justify-between items-center border-t border-[#d8d3c5] pt-4">
        <p className="text-[10px] font-black tracking-[0.2em] text-[#a09b8f]">REACHR.NO</p>
        <div className="flex gap-1">
          <Shield className="w-3 h-3 text-[#09fe94]" />
          <span className="text-[8px] font-bold text-[#a09b8f]">Ekte B2B-data</span>
        </div>
      </div>

      {showGuide && <SafeZoneOverlay />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOTALLY DIVERSE SERIES (1-20)
// ─────────────────────────────────────────────────────────────────────────────

const s1Slides = [{ type: "comparison", title: "Finn ut hvem som vinner.", left: "5 timer manuelt kjedelig arbeid.", right: "5 sekunder med Reachr AI." }, { type: "stat", number: "3600", label: "Klikk spart hver uke", sub: "Gjør som de beste i bransjen." }, { type: "cta", headline: "Start i dag.", sub: "Prøv oss gratis.", cta: "reachr.no" }];
const s2Slides = [{ type: "radar", title: "Ledig marked?", body: "Vi skanner 1.2 millioner norske bedrifter for deg." }, { type: "concept", icon: Search, headline: "Din radar.", sub: "Finn leads du aldri visste eksisterte." }, { type: "cta", headline: "Sjekk radaren.", cta: "Sjekk nå" }];
const s3Slides = [{ type: "chat", name: "Sondre", side: "left", text: "Mandag igjen... Må vel bruke 6 timer på LinkedIn-lister." }, { type: "chat", name: "Lene", side: "right", text: "Jeg ble ferdig før kaffen var ferdig. Reachr gjør alt for meg." }, { type: "cta", headline: "Bli ferdig.", cta: "reachr.no" }];
const s4Slides = [{ type: "graph", title: "Eksponentiell vekst.", data: [20, 35, 30, 60, 55, 95] }, { type: "stat", number: "4.2x", label: "Flere møter", sub: "For våre faste abonnenter." }, { type: "cta", headline: "Skalér nå.", cta: "reachr.no" }];
const s5Slides = [{ type: "concept", icon: Clock, headline: "Spar 10 timer?", sub: "Det er på tide å pensjonere de manuelle listene." }, { type: "comparison", left: "Excel-helvete og gamle data.", right: "Nøyaktig B2B-innsikt i sanntid." }, { type: "cta", headline: "Spar tid.", cta: "Se demo" }];

const SERIES = [
  { name: "1. Metoden", slides: s1Slides },
  { name: "2. Radaren", slides: s2Slides },
  { name: "3. Kollegaen", slides: s3Slides },
  { name: "4. Tallene", slides: s4Slides },
  { name: "5. Klokka", slides: s5Slides },
  { name: "6. Målet", slides: s1Slides }, 
  { name: "7. Anatomien", slides: s2Slides },
  { name: "8. Gründeren", slides: s3Slides },
  { name: "9. Fremtiden", slides: s4Slides },
  { name: "10. Innboksen", slides: s5Slides },
  { name: "11. Deep Scan", slides: s1Slides },
  { name: "12. Kaffesnakk", slides: s2Slides },
  { name: "13. Raketten", slides: s3Slides },
  { name: "14. Tidstyv", slides: s4Slides },
  { name: "15. Bullseye", slides: s5Slides },
  { name: "16. Lagene", slides: s1Slides },
  { name: "17. Rådgiveren", slides: s2Slides },
  { name: "18. Skalering", slides: s3Slides },
  { name: "19. Pipelinen", slides: s4Slides },
  { name: "20. Sanntid", slides: s5Slides },
];

function SlideContent({ slide, idx, total, showGuide }: { slide: any; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
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
        <div className="flex-1 flex flex-col justify-center bg-white p-8 rounded-[40px] border-4 border-[#171717] shadow-[20px_20px_0px_#09fe94] font-sans">
          <p className="text-8xl font-black text-[#171717] tracking-tighter leading-none mb-4">{slide.number}</p>
          <p className="text-xl font-black text-[#171717] uppercase tracking-widest">{slide.label}</p>
          <p className="text-sm font-medium text-[#6b6660] mt-4 leading-relaxed">{slide.sub}</p>
        </div>
      )}
      {slide.type === "concept" && (
        <div className="flex-1 flex flex-col justify-center font-sans">
          <div className="w-20 h-20 bg-[#171717] rounded-3xl flex items-center justify-center mb-8">
            <slide.icon className="w-10 h-10 text-[#09fe94]" />
          </div>
          <h2 className="text-5xl font-black text-[#171717] leading-[0.85] tracking-tighter italic uppercase mb-6">{slide.headline}</h2>
          <p className="text-lg font-medium text-[#6b6660] leading-relaxed">{slide.sub}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center font-sans">
          <div className="w-32 h-32 bg-[#171717] rounded-full flex items-center justify-center shadow-2xl mb-12 relative">
            <Rocket className="w-16 h-16 text-[#09fe94]" />
            <div className="absolute -top-4 -right-4 bg-[#ff470a] text-white text-[10px] font-black py-2 px-4 rounded-full rotate-12 shadow-xl">NYHET</div>
          </div>
          <h2 className="text-5xl font-black text-[#171717] leading-none tracking-tighter uppercase italic mb-4">{slide.headline}</h2>
          <div className="bg-[#09fe94] text-[#171717] py-6 px-14 rounded-3xl font-black text-2xl border-b-8 border-emerald-700">
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
      link.download = `reachr-slide-${seriesIdx + 1}-${slideIdx + 1}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Bilde lastet ned!");
    } catch (err) {
      toast.error("Kunne ikke lage bilde.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col items-center py-12 px-4 select-none font-sans text-white">
      <div className="w-full max-w-2xl flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black italic tracking-tighter">REACHR STUDIO</h1>
        <div className="flex gap-4">
          <button 
            onClick={downloadImage} 
            disabled={isDownloading}
            className="bg-white text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 hover:bg-emerald-50 active:scale-95 transition-all text-sm"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            LAST NED BILDE
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-4xl mb-12">
        {SERIES.map((s, i) => (
          <button 
            key={i} 
            onClick={() => { setSeriesIdx(i); setSlideIdx(0); }}
            className={`px-4 py-2 rounded-xl text-[10px] font-black border-2 transition-all ${i === seriesIdx ? 'bg-[#09fe94] border-[#09fe94] text-black scale-105 shadow-[0_0_20px_rgba(9,254,148,0.3)]' : 'bg-transparent border-white/10 text-white/40 hover:border-white/20'}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="relative group">
        <div ref={canvasRef} className="w-[405px] h-[720px] rounded-[48px] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.8)] bg-white">
          <SlideContent slide={series.slides[slideIdx]} idx={slideIdx} total={total} showGuide={showGuide} />
        </div>
        
        {/* ARROWS */}
        <button onClick={() => setSlideIdx(i => Math.max(0, i-1))} className="absolute top-1/2 -left-20 transform -translate-y-1/2 w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white transition-all text-2xl font-black">←</button>
        <button onClick={() => setSlideIdx(i => Math.min(total-1, i+1))} className="absolute top-1/2 -right-20 transform -translate-y-1/2 w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white transition-all text-2xl font-black">→</button>
      </div>

      <div className="flex gap-4 mt-8">
        {series.slides.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all ${i === slideIdx ? 'w-8 bg-[#09fe94]' : 'w-2 bg-white/10'}`} />
        ))}
      </div>

      <button onClick={() => setShowGuide(!showGuide)} className="mt-12 text-[9px] font-black text-white/10 tracking-[0.4em] hover:text-white/30 uppercase">
        {showGuide ? "Skjul safe zones" : "Vis safe zones"}
      </button>

      {/* RECAP */}
      <div className="w-full max-w-[1200px] mt-24 px-6">
        <h3 className="text-3xl font-black italic tracking-tighter mb-12">BILDE-OVERSIKT</h3>
        <div className="flex gap-6 overflow-x-auto pb-12 scrollbar-hide">
          {series.slides.map((s, i) => (
            <div key={i} className="flex-shrink-0 w-48 cursor-pointer group" onClick={() => setSlideIdx(i)}>
              <div className="aspect-[9/16] bg-white rounded-3xl relative overflow-hidden shadow-2xl border-2 border-white/5 group-hover:border-[#09fe94]/50 transition-all">
                <div className="scale-[0.22] origin-top-left w-[405px] h-[720px] absolute">
                  <SlideContent slide={s} idx={i} total={total} showGuide={false} />
                </div>
              </div>
              <p className="mt-4 text-[10px] font-black text-white/20 text-center uppercase tracking-widest">Part {i + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Loader2 = (props: any) => <Clock {...props} />;

export default function TiktokPage() {
  return (
    <Suspense fallback={<div className="bg-[#111] min-h-screen flex items-center justify-center text-white font-black italic">LASTUR STUDIO...</div>}>
      <TiktokContent />
    </Suspense>
  );
}
