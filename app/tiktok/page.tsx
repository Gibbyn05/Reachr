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
  Download, Image as ImageIcon, MessageSquare, Zap,
  FolderDown, Loader2, Crosshair, BrainCircuit,
  Fingerprint, Compass, Landmark, LayoutDashboard,
  Code, Hexagon, Cpu, Globe, MousePointer2
} from "lucide-react";
import * as htmlToImage from "html-to-image";
import JSZip from "jszip";

// ─────────────────────────────────────────────────────────────────────────────
// UNIQUE THEMED SHELLS
// ─────────────────────────────────────────────────────────────────────────────

function SlideShell({ idx, total, children, theme }: { idx: number; total: number; children: React.ReactNode; theme: string }) {
  const isAlt = theme === "modern" || theme === "blueprint";
  const isDark = theme === "impact";
  
  return (
    <div className={`absolute inset-0 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#171717]' : 'bg-[#f2efe3]'}`}>
      {/* BACKGROUND TEXTURES PER THEME */}
      {theme === "blueprint" && (
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#171717 1px, transparent 1px), linear-gradient(90deg, #171717 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      )}
      {theme === "tech" && (
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }} />
      )}
      {theme === "minimal" && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#09fe94] blur-[120px] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
      )}

      {/* HEADER - DIFFERENT PER THEME */}
      <div className={`absolute top-12 px-8 w-full flex justify-between items-center z-10 ${theme === "clean" ? "flex-col items-start gap-1" : ""}`}>
        <div className="flex items-center gap-2">
          {!isDark && <Image src="/logo.svg" alt="L" width={24} height={24} priority />}
          <span className={`font-serif italic font-black text-xl tracking-tighter ${isDark ? 'text-[#09fe94]' : 'text-[#171717]'}`}>Reachr</span>
        </div>
        
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-[#09fe94]" : `w-1.5 ${isDark ? 'bg-white/20' : 'bg-[#d8d3c5]'}`}`} />
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="absolute inset-x-8 top-[140px] bottom-[280px] flex flex-col justify-center">
        {children}
      </div>

      {/* FOOTER - DIFFERENT PER THEME */}
      <div className={`absolute bottom-[200px] left-8 right-12 flex justify-between items-center border-t pt-3 ${isDark ? 'border-white/10' : 'border-[#d8d3c5]'}`}>
        <p className={`text-[8px] font-black tracking-[0.3em] uppercase ${isDark ? 'text-white/40' : 'text-[#a09b8f]'}`}>REACHR.NO</p>
        <div className="flex gap-1.5 items-center">
          <Shield className={`w-3 h-3 ${isDark ? 'text-white/20' : 'text-[#09fe94]'}`} />
          <span className={`text-[8px] font-black uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-[#a09b8f]'}`}>Verified</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT VARIATIONS
// ─────────────────────────────────────────────────────────────────────────────

function Comparison({ left, right, theme }: { left: string, right: string, theme: string }) {
  if (theme === "modern") {
    return (
      <div className="flex flex-col gap-3 my-4 font-sans">
        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-2xl">
          <p className="text-[10px] font-black text-red-700 uppercase mb-1">Dårlig Metode</p>
          <p className="text-xs font-bold text-red-900">{left}</p>
        </div>
        <div className="bg-[#09fe94]/10 border-l-4 border-[#09fe94] p-4 rounded-r-2xl">
          <p className="text-[10px] font-black text-emerald-700 uppercase mb-1">Reachr Effekt</p>
          <p className="text-xs font-black text-emerald-900">{right}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2 items-stretch h-36 my-2 font-sans">
      <div className="flex-1 bg-white/50 border border-[#171717] rounded-xl p-3 flex flex-col items-center justify-center text-center">
        <p className="text-[9px] font-bold text-[#171717] leading-tight">{left}</p>
      </div>
      <div className="flex-1 bg-[#171717] rounded-xl p-3 flex flex-col items-center justify-center text-center font-black">
        <p className="text-[9px] text-[#09fe94] leading-tight">{right}</p>
      </div>
    </div>
  );
}

function RadarEffect() {
  return (
    <div className="relative w-24 h-24 mx-auto my-2 flex items-center justify-center">
      <div className="absolute inset-0 border-2 border-[#171717] rounded-full opacity-10" />
      <div className="absolute inset-6 border border-[#171717] rounded-full opacity-10" />
      <div className="absolute w-1 h-12 bg-gradient-to-t from-[#09fe94] to-transparent origin-bottom rotate-45" style={{ bottom: "50%" }} />
      <Target className="w-6 h-6 text-[#09fe94]" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 10 UNIQUE SERIES (STUDIO V9)
// ─────────────────────────────────────────────────────────────────────────────

const SERIES = [
  {
    name: "1. Detektiven",
    theme: "blueprint",
    slides: [
      { type: "hook", headline: "Detektiven.", sub: "Lær hvordan du finner bedrifter FØR de lander på radaren til andre." },
      { type: "concept", icon: Fingerprint, headline: "Se sporene.", sub: "Vi overvåker 1.2M selskaper for ansettelser og investeringer i sanntid." },
      { type: "radar", title: "Scanning...", body: "Vi isolerer de heteste vekstsignalene for deg hver morgen." },
      { type: "stat", number: "3x", label: "Overskudd", sub: "Selgere med fersk data treffer 3 ganger oftere enn andre." },
      { type: "cta", headline: "Bli en detektiv.", cta: "reachr.no" }
    ]
  },
  {
    name: "2. Ghost Mode",
    theme: "minimal",
    slides: [
      { type: "hook", headline: "Ghost Mode.", sub: "Hvordan booke møter med de som 'aldri' svarer på kalde samtaler." },
      { type: "chat", side: "left", name: "Kalle", text: "Jeg ringer og ringer, men får bare beskjed om at de er opptatt." },
      { type: "chat", side: "right", name: "Reachr", text: "Fordi du sender meldinger som drukner i mengden. Prøv dette..." },
      { type: "stat", number: "40%", label: "Svarprosent", sub: "Økning i svar når du bruker Reachr sin person-innsikt." },
      { type: "cta", headline: "Gå Ghost.", cta: "reachr.no" }
    ]
  },
  {
    name: "3. Tidsmaskin",
    theme: "tech",
    slides: [
      { type: "hook", headline: "Tidsmaskinen.", sub: "Kan vi spå hvem som vinner i 2026? Ja, med riktig data." },
      { type: "concept", icon: Cpu, headline: "Forutse vekst.", sub: "Vi kombinerer historisk regnskapsdata med nåtidens aktivitet." },
      { type: "radar", title: "Fremtiden...", body: "Oppdag selskaper som er i ferd med å skalere opp nå." },
      { type: "stat", number: "85%", label: "Treffsikkerhet", sub: "Vår AI-modell forutser fremtidige salgsmuligheter." },
      { type: "cta", headline: "Se fremtiden.", cta: "reachr.no" }
    ]
  },
  {
    name: "4. Arkitekten",
    theme: "modern",
    slides: [
      { type: "hook", headline: "Arkitekten.", sub: "Bygg den perfekte salgspipelinen på under 60 sekunder." },
      { type: "list", title: "Din Blueprint:", points: ["1. Last opp din beste kunde.", "2. La AI finne like bedrifter.", "3. Ekvér leads direkte til CRM."] },
      { type: "stat", number: "60 s", label: "Tid brukt", sub: "Det er alt som skal til for å fylle en hel måned." },
      { type: "cta", headline: "Bygg nå.", cta: "reachr.no" }
    ]
  },
  {
    name: "5. Billetten",
    theme: "impact",
    slides: [
      { type: "hook", headline: "Gullbilletten.", sub: "Finn den ene personen som kan si JA i et selskap med 500+ ansatte." },
      { type: "comparison", title: "Søketid.", left: "Lete på LinkedIn i timer.", right: "Ett klikk med Reachr Extension." },
      { type: "stat", number: "0 t", label: "Bortkastet tid", sub: "Ingen flere 'send en e-post til postmottak'." },
      { type: "cta", headline: "Få billetten.", cta: "reachr.no" }
    ]
  },
  {
    name: "6. Redningen",
    theme: "clean",
    slides: [
      { type: "hook", headline: "CRM-Redningen.", sub: "Er salgssystemet ditt en kirkegård av gamle leads?" },
      { type: "chat", side: "left", name: "Sjefen", text: "Halvparten av dataene i CRM-et vårt er jo utdaterte!" },
      { type: "stat", number: "100%", label: "Data-refresh", sub: "Hold CRM-et ditt oppdatert i sanntid uten å løfte en finger." },
      { type: "cta", headline: "Redd CRM-et.", cta: "reachr.no" }
    ]
  },
  {
    name: "7. Rent Bord",
    theme: "modern",
    slides: [
      { type: "hook", headline: "Rent Bord.", sub: "Hvordan booke hele måneden full på én mandag morgen." },
      { type: "list", title: "Dagens plan:", points: ["08:00 - Sjekk nye leads.", "08:10 - Send Reachr-videoer.", "09:00 - Nyt kaffen og svarene."] },
      { type: "cta", headline: "Tøm bordet.", cta: "reachr.no" }
    ]
  },
  {
    name: "8. Lampa",
    theme: "tech",
    slides: [
      { type: "hook", headline: "Signallampa.", sub: "Følg pengestrømmen der konkurrentene dine ser mørke." },
      { type: "radar", title: "Monitoring...", body: "Vi varsler deg når en bedrift får nye investeringer." },
      { type: "concept", icon: Globe, headline: "Kapitalkraft.", sub: "Selg til bedrifter som har budsjett og er klare for vekst." },
      { type: "cta", headline: "Følg lyset.", cta: "reachr.no" }
    ]
  },
  {
    name: "9. Krefter",
    theme: "blueprint",
    slides: [
      { type: "hook", headline: "Extension-Kraft.", sub: "Ha superkrefter direkte i nettleseren din." },
      { type: "stat", number: "2500+", label: "Installasjoner", sub: "Norges mest brukte B2B-verktøy for de råeste selgerne." },
      { type: "comparison", title: "Hverdagen.", left: "Går ut og inn av faner.", right: "Dataen kommer til deg." },
      { type: "cta", headline: "Installer nå.", cta: "reachr.no" }
    ]
  },
  {
    name: "10. Blueprint",
    theme: "impact",
    slides: [
      { type: "hook", headline: "Blueprint.", sub: "Den arkitektoniske guiden til hvordan du når drømmekunden." },
      { type: "concept", icon: Code, headline: "AI-Strategi.", sub: "Vår modell lager en plan for hvordan du skal gå frem mot hvert lead." },
      { type: "stat", number: "X3", label: "Møter", sub: "Gjennomsnittlig økning i aktivitet når planen følges." },
      { type: "cta", headline: "Få din plan.", cta: "reachr.no" }
    ]
  }
];

function SlideContent({ slide, idx, total, theme }: { slide: any; idx: number; total: number; theme: string }) {
  const isDark = theme === "impact";
  
  return (
    <SlideShell idx={idx} total={total} theme={theme} key={`${theme}-${idx}`}>
      {slide.type === "hook" && (
        <div className="flex-1 flex flex-col justify-center font-sans tracking-tight">
          <h1 className={`text-3xl font-black leading-[0.9] uppercase italic mb-6 ${isDark ? 'text-[#09fe94]' : 'text-[#171717]'}`}>{slide.headline}</h1>
          <p className={`text-[11px] font-medium leading-relaxed ${isDark ? 'text-white/60' : 'text-[#6b6660]'}`}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "comparison" && (
        <div className="flex-1 flex flex-col justify-center">
          <h2 className={`text-lg font-black italic uppercase mb-2 leading-none ${isDark ? 'text-white' : 'text-[#171717]'}`}>{slide.title}</h2>
          <Comparison left={slide.left} right={slide.right} theme={theme} />
        </div>
      )}
      {slide.type === "radar" && (
        <div className="flex-1 flex flex-col justify-center text-center">
          <h2 className={`text-lg font-black italic uppercase mb-2 leading-none ${isDark ? 'text-white' : 'text-[#171717]'}`}>{slide.title}</h2>
          <RadarEffect />
          <p className={`text-[10px] font-medium ${isDark ? 'text-white/40' : 'text-[#6b6660]'}`}>{slide.body}</p>
        </div>
      )}
      {slide.type === "list" && (
        <div className="flex-1 flex flex-col justify-center">
          <h2 className={`text-lg font-black italic uppercase mb-4 leading-none text-left ${isDark ? 'text-white' : 'text-[#171717]'}`}>{slide.title}</h2>
          <div className="flex flex-col gap-2">
            {slide.points.map((p: string, i: number) => (
              <div key={i} className={`flex items-center gap-2 p-3 rounded-xl border border-[#09fe94] ${isDark ? 'bg-white/5' : 'bg-white shadow-[3px_3px_0px_#171717]'}`}>
                <div className="w-5 h-5 rounded-full bg-[#09fe94] flex items-center justify-center text-[9px] font-black text-black shrink-0">{i + 1}</div>
                <p className={`text-[10px] font-black uppercase ${isDark ? 'text-white' : 'text-[#171717]'}`}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {slide.type === "chat" && (
        <div className="flex-1 flex flex-col justify-center py-2">
          <div className={`p-4 rounded-3xl text-[10px] font-bold ${slide.side === "left" ? "bg-[#171717] text-white" : "bg-white text-[#171717]"} border border-[#09fe94]`}>
            {slide.text}
          </div>
        </div>
      )}
      {slide.type === "stat" && (
        <div className="flex-1 flex flex-col justify-center bg-white p-5 rounded-2xl border-4 border-[#171717] shadow-[8px_8px_0px_#09fe94]">
          <p className="text-5xl font-black text-[#171717] leading-none mb-1 tracking-tighter">{slide.number}</p>
          <p className="text-[11px] font-black uppercase tracking-widest text-[#171717]">{slide.label}</p>
          <p className="text-[10px] font-bold text-[#6b6660] mt-2 leading-tight">{slide.sub}</p>
        </div>
      )}
      {slide.type === "concept" && (
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-10 h-10 bg-[#09fe94] rounded-xl flex items-center justify-center mb-4">
            <slide.icon className="w-5 h-5 text-black" />
          </div>
          <h2 className={`text-2xl font-black uppercase italic mb-2 leading-none tracking-tighter ${isDark ? 'text-white' : 'text-[#171717]'}`}>{slide.headline}</h2>
          <p className={`text-[11px] font-medium leading-relaxed ${isDark ? 'text-white/60' : 'text-[#6b6660]'}`}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className={`text-4xl font-black uppercase italic mb-8 p-1 tracking-tighter leading-none ${isDark ? 'text-[#09fe94]' : 'text-[#171717]'}`}>{slide.headline}</h2>
          <div className="bg-[#09fe94] text-black py-5 px-10 rounded-2xl font-black text-xl border-b-6 border-emerald-700 shadow-xl">
            {slide.cta}
          </div>
        </div>
      )}
    </SlideShell>
  );
}

function TiktokContent() {
  const [seriesIdx, setSeriesIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [zipProgress, setZipProgress] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const hiddenCanvasRef = useRef<HTMLDivElement>(null);

  const series = SERIES[seriesIdx];
  const total = series.slides.length;

  const downloadFullSeries = async () => {
    if (!hiddenCanvasRef.current) return;
    setIsDownloading(true);
    setZipProgress(0);
    const zip = new JSZip();
    
    try {
      for (let i = 0; i < series.slides.length; i++) {
        setZipProgress(Math.round(((i) / series.slides.length) * 100));
        setSlideIdx(i); 
        await new Promise(r => setTimeout(r, 200)); 

        const dataUrl = await htmlToImage.toPng(hiddenCanvasRef.current, { pixelRatio: 3, quality: 1 });
        const base64Data = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
        zip.file(`slide-${i + 1}.png`, base64Data, { base64: true });
      }
      
      setZipProgress(100);
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `reachr-series-${seriesIdx + 1}.zip`;
      link.click();
      toast.success("Mappe med alle slides er ferdig!");
    } catch (err) { toast.error("Klarte ikke generere mappe."); }
    finally {
      setIsDownloading(false);
      setZipProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col items-center py-12 px-4 select-none font-sans text-white">
      <div className="w-full max-w-2xl flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter">STUDIO V9</h1>
          <p className="text-[10px] font-bold text-[#09fe94] uppercase tracking-widest mt-1">10 Unique Themes Active</p>
        </div>
        
        <button onClick={downloadFullSeries} disabled={isDownloading} className="bg-[#09fe94] hover:bg-[#08e685] text-black font-black py-4 px-8 rounded-2xl flex items-center gap-2 text-xs shadow-xl transition-all active:scale-95 disabled:opacity-50">
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderDown className="w-4 h-4" />}
          {zipProgress !== null ? `${zipProgress}%` : "LAST NED MAPPE (ZIP)"}
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-5xl px-4">
        {SERIES.map((s, i) => (
          <button key={i} onClick={() => { setSeriesIdx(i); setSlideIdx(0); }} className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all ${i === seriesIdx ? 'bg-[#09fe94] border-[#09fe94] text-black' : 'bg-transparent border-white/10 text-white/40 hover:border-white/30'}`}>
            {s.name}
          </button>
        ))}
      </div>

      <div className="relative">
        <div ref={canvasRef} className="w-[405px] h-[720px] rounded-[48px] overflow-hidden shadow-2xl bg-[#f2efe3] border-4 border-white/10">
          <SlideContent slide={series.slides[slideIdx]} idx={slideIdx} total={total} theme={series.theme} />
        </div>
        
        <button onClick={() => setSlideIdx(i => Math.max(0, i-1))} className="absolute top-1/2 -left-16 transform -translate-y-1/2 text-white/10 hover:text-white transition-all p-4 text-3xl font-black">←</button>
        <button onClick={() => setSlideIdx(i => Math.min(total-1, i+1))} className="absolute top-1/2 -right-16 transform -translate-y-1/2 text-white/10 hover:text-white transition-all p-4 text-3xl font-black">→</button>
      </div>

      <div className="flex gap-2 mt-8">
        {series.slides.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === slideIdx ? 'w-10 bg-[#09fe94]' : 'w-2 bg-white/10 px-1'}`} />
        ))}
      </div>

      <div className="fixed -left-[2000px] top-0 opacity-0 pointer-events-none">
        <div ref={hiddenCanvasRef} className="w-[405px] h-[720px]">
          <SlideContent slide={series.slides[slideIdx]} idx={slideIdx} total={total} theme={series.theme} />
        </div>
      </div>
    </div>
  );
}

export default function TiktokPage() {
  return (
    <Suspense fallback={<div className="bg-[#111] min-h-screen flex items-center justify-center text-white italic font-black">LOADING V9...</div>}>
      <TiktokContent />
    </Suspense>
  );
}
