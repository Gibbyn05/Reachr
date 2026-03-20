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
  Fingerprint, Compass, Landmark, LayoutDashboard
} from "lucide-react";
import * as htmlToImage from "html-to-image";
import JSZip from "jszip";

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const Frown = (props: any) => <AlertCircle {...props} />;

function Comparison({ left, right }: { left: string, right: string }) {
  return (
    <div className="flex gap-2 items-stretch h-36 my-2 font-sans">
      <div className="flex-1 bg-red-500/5 border border-dashed border-red-500/20 rounded-xl p-3 flex flex-col items-center justify-center text-center">
        <Frown className="w-5 h-5 text-red-500 mb-1 opacity-40" />
        <p className="text-[9px] font-bold text-red-900 leading-tight">{left}</p>
      </div>
      <div className="flex-1 bg-[#09fe94]/10 border border-emerald-500/30 rounded-xl p-3 flex flex-col items-center justify-center text-center font-black">
        <Smile className="w-5 h-5 text-emerald-500 mb-1" />
        <p className="text-[9px] text-emerald-900 leading-tight">{right}</p>
      </div>
    </div>
  );
}

function RadarEffect() {
  return (
    <div className="relative w-24 h-24 mx-auto my-2 flex items-center justify-center">
      <div className="absolute inset-0 border-2 border-[#171717] rounded-full opacity-10" />
      <div className="absolute inset-6 border border-[#171717] rounded-full opacity-10" />
      <div className="absolute w-1 h-12 bg-gradient-to-t from-[#09fe94] to-transparent origin-bottom rotate-45" style={{ bottom: "50%", left: "px" }} />
      <Target className="w-6 h-6 text-[#09fe94]" />
    </div>
  );
}

function ListProgress({ points }: { points: string[] }) {
  return (
    <div className="flex flex-col gap-2 my-2 font-sans text-left">
      {points.map((p, i) => (
        <div key={i} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#171717] shadow-[3px_3px_0px_#171717]">
          <div className="w-5 h-5 rounded-full bg-[#09fe94] flex items-center justify-center text-[9px] font-black shrink-0">{i + 1}</div>
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

function SlideShell({ idx, total, children }: { idx: number; total: number; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 bg-[#f2efe3] overflow-hidden">
      <div className="absolute top-16 left-8 flex items-center gap-2">
        <Image src="/logo.svg" alt="L" width={22} height={22} priority />
        <span className="font-serif italic font-black text-lg text-[#171717]">Reachr</span>
      </div>
      <div className="absolute top-[68px] right-20 flex items-center gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full ${i === idx ? "w-6 bg-[#09fe94]" : "w-1.5 bg-white/40"}`} />
        ))}
      </div>
      <div className="absolute inset-x-8 top-[110px] bottom-[280px] flex flex-col justify-center">
        {children}
      </div>
      <div className="absolute bottom-[200px] left-8 right-12 flex justify-between items-center border-t border-[#d8d3c5] pt-2">
        <p className="text-[7px] font-black tracking-[0.2em] text-[#a09b8f]">REACHR.NO</p>
        <div className="flex gap-1 items-center">
          <Shield className="w-2.5 h-2.5 text-[#09fe94]" />
          <span className="text-[7px] font-bold text-[#a09b8f] uppercase">B2B DATA</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 10 BRAND NEW SERIES (STUDIO V8)
// ─────────────────────────────────────────────────────────────────────────────

const s1Slides = [
  { type: "hook", headline: "Detektiven.", sub: "Lær hvordan du finner bedrifter FØR de lander på radaren til andre." },
  { type: "concept", icon: Fingerprint, headline: "Se sporene.", sub: "Vi overvåker 1.2M selskaper for ansettelser og investeringer i sanntid." },
  { type: "radar", title: "Scanning...", body: "Vi isolerer de heteste vekstsignalene for deg hver morgen." },
  { type: "stat", number: "3x", label: "Overskudd", sub: "Selgere med fersk data treffer 3 ganger oftere enn andre." },
  { type: "comparison", title: "Din Metode.", left: "Vente på LinkedIn-nyheter.", right: "Se signalene før de postes." },
  { type: "cta", headline: "Bli en detektiv.", cta: "reachr.no" }
];

const s2Slides = [
  { type: "hook", headline: "Ghost Mode.", sub: "Hvordan booke møter med de som 'aldri' svarer på kalde samtaler." },
  { type: "chat", side: "left", name: "Kalle", text: "Jeg ringer og ringer, men får bare beskjed om at de er opptatt." },
  { type: "chat", side: "right", name: "Reachr", text: "Fordi du sender meldinger som drukner i mengden. Prøv dette..." },
  { type: "step", label: "MAP", body: "Finn personen som faktisk tar beslutningene i kulissene." },
  { type: "stat", number: "40%", label: "Svarprosent", sub: "Økning i svar når du bruker Reachr sin person-innsikt." },
  { type: "cta", headline: "Gå Ghost.", cta: "reachr.no" }
];

const s3Slides = [
  { type: "hook", headline: "Tidsmaskinen.", sub: "Kan vi spå hvem som vinner i 2026? Ja, med riktig data." },
  { type: "concept", icon: Clock, headline: "Forutse vekst.", sub: "Vi kombinerer historisk regnskapsdata med nåtidens aktivitet." },
  { type: "radar", title: "Fremtiden...", body: "Oppdag selskaper som er i ferd med å skalere opp nå." },
  { type: "stat", number: "85%", label: "Treffsikkerhet", sub: "Vår AI-modell forutser fremtidige salgsmuligheter." },
  { type: "cta", headline: "Se fremtiden.", cta: "reachr.no" }
];

const s4Slides = [
  { type: "hook", headline: "Arkitekten.", sub: "Bygg den perfekte salgspipelinen på under 60 sekunder." },
  { type: "list", title: "Din Blueprint:", points: ["1. Last opp din beste kunde.", "2. La AI finne like bedrifter.", "3. Ekvér leads direkte til CRM."] },
  { type: "stat", number: "60 s", label: "Tid brukt", sub: "Det er alt som skal til for å fylle en hel måned." },
  { type: "concept", icon: LayoutDashboard, headline: "Full oversikt.", sub: "Glem rotete permer og Excel-ark. Hold salget ryddig." },
  { type: "cta", headline: "Bygg nå.", cta: "reachr.no" }
];

const s5Slides = [
  { type: "hook", headline: "Gullbilletten.", sub: "Finn den ene personen som kan si JA i et selskap med 500+ ansatte." },
  { type: "comparison", title: "Søketid.", left: "Lete på LinkedIn i timer.", right: "Ett klikk med Reachr Extension." },
  { type: "step", label: "TARGET", body: "Vi finner direktelinjen til de som faktisk bestemmer budsjettet." },
  { type: "stat", number: "0 t", label: "Bortkastet tid", sub: "Ingen flere 'send en e-post til postmottak'." },
  { type: "cta", headline: "Få billetten.", cta: "reachr.no" }
];

const s6Slides = [
  { type: "hook", headline: "CRM-Redningen.", sub: "Er salgssystemet ditt en kirkegård av gamle leads?" },
  { type: "chat", side: "left", name: "Sjefen", text: "Halvparten av dataene i CRM-et vårt er jo utdaterte!" },
  { type: "chat", side: "right", name: "Teamet", text: "Ikke nå lenger. Vi har koblet på Reachr-auto." },
  { type: "stat", number: "100%", label: "Data-refresh", sub: "Hold CRM-et ditt oppdatert i sanntid uten å løfte en finger." },
  { type: "cta", headline: "Redd CRM-et.", cta: "reachr.no" }
];

const s7Slides = [
  { type: "hook", headline: "Rent Bord.", sub: "Hvordan booke hele måneden full på én mandag morgen." },
  { type: "list", title: "Dagens plan:", points: ["08:00 - Sjekk nye leads.", "08:10 - Send Reachr-videoer.", "09:00 - Nyt kaffen og svarene."] },
  { type: "concept", icon: Coffee, headline: "Ro i sjelen.", sub: "Når du vet at innboksen din vil være full av møtebekreftelser." },
  { type: "cta", headline: "Tøm bordet.", cta: "reachr.no" }
];

const s8Slides = [
  { type: "hook", headline: "Signallampa.", sub: "Følg pengestrømmen der konkurrentene dine ser mørke." },
  { type: "radar", title: "Monitoring...", body: "Vi varsler deg når en bedrift får nye investeringer." },
  { type: "concept", icon: Landmark, headline: "Kapitalkraft.", sub: "Selg til bedrifter som har budsjett og er klare for vekst." },
  { type: "stat", number: "1.2M", label: "Kilder", sub: "Vi skanner alle offentlige registre for ferske kapitalendringer." },
  { type: "cta", headline: "Følg lyset.", cta: "reachr.no" }
];

const s9Slides = [
  { type: "hook", headline: "Extension-Kraft.", sub: "Ha superkrefter direkte i nettleseren din." },
  { type: "step", label: "MAGI", body: "Besøk en nettside, se all B2B-data umiddelbart." },
  { type: "stat", number: "2500+", label: "Installasjoner", sub: "Norges mest brukte B2B-verktøy for de råeste selgerne." },
  { type: "comparison", title: "Hverdagen.", left: "Går ut og inn av faner.", right: "Dataen kommer til deg." },
  { type: "cta", headline: "Installer nå.", cta: "reachr.no" }
];

const s10Slides = [
  { type: "hook", headline: "Blueprint.", sub: "Den arkitektoniske guiden til hvordan du når drømmekunden." },
  { type: "concept", icon: BrainCircuit, headline: "AI-Strategi.", sub: "Vår modell lager en plan for hvordan du skal gå frem mot hvert lead." },
  { type: "stat", number: "X3", label: "Møter", sub: "Gjennomsnittlig økning i aktivitet når planen følges." },
  { type: "hook", headline: "Klar for start?", sub: "Bli med på reisen mot moderne salg i dag." },
  { type: "cta", headline: "Få din plan.", cta: "reachr.no" }
];

const SERIES = [
  { name: "1. Detektiven", slides: s1Slides },
  { name: "2. Ghost Mode", slides: s2Slides },
  { name: "3. Tidsmaskin", slides: s3Slides },
  { name: "4. Arkitekten", slides: s4Slides },
  { name: "5. Billetten", slides: s5Slides },
  { name: "6. Redningen", slides: s6Slides },
  { name: "7. Rent Bord", slides: s7Slides },
  { name: "8. Lampa", slides: s8Slides },
  { name: "9. Krefter", slides: s9Slides },
  { name: "10. Blueprint", slides: s10Slides },
];

function SlideContent({ slide, idx, total }: { slide: any; idx: number; total: number }) {
  return (
    <SlideShell idx={idx} total={total} key={idx}>
      {slide.type === "hook" && (
        <div className="flex-1 flex flex-col justify-center font-sans tracking-tight">
          <h1 className="text-3xl font-black text-[#171717] leading-[0.9] uppercase italic mb-6">{slide.headline}</h1>
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
          <p className="text-[10px] font-medium text-[#6b6660] leading-tight">{slide.body}</p>
        </div>
      )}
      {slide.type === "list" && (
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-lg font-black text-[#171717] italic uppercase mb-4 leading-none text-left">{slide.title}</h2>
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
        <div className="mb-3 flex items-start gap-3">
          <div className="bg-[#171717] text-[#09fe94] font-black text-[9px] px-2 py-0.5 rounded-full">{slide.label}</div>
          <p className="text-[10px] font-black text-[#171717] leading-tight flex-1">{slide.body}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl font-black text-[#171717] uppercase italic mb-8 p-1 tracking-tighter leading-none">{slide.headline}</h2>
          <div className="bg-[#09fe94] text-[#171717] py-5 px-10 rounded-2xl font-black text-xl border-b-6 border-emerald-700 shadow-xl">
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

  const downloadOne = async () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(canvasRef.current, { pixelRatio: 3, quality: 1 });
      const link = document.createElement('a');
      link.download = `reachr-series-${seriesIdx + 1}-slide-${slideIdx + 1}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Bilde lastet ned!");
    } catch (err) { toast.error("Klarte ikke laste ned."); }
    finally { setIsDownloading(false); }
  };

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
    } catch (err) {
      toast.error("Klarte ikke generere mappe.");
    } finally {
      setIsDownloading(false);
      setZipProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col items-center py-12 px-4 select-none font-sans text-white">
      {/* HEADER ACTIONS */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter">STUDIO V8</h1>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">10 New Concepts Loaded</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={downloadOne} disabled={isDownloading} className="bg-white/10 hover:bg-white/20 text-white font-black py-3 px-5 rounded-2xl flex items-center gap-2 text-xs transition-all active:scale-95 disabled:opacity-50">
            <ImageIcon className="w-4 h-4" />
            SLIDE
          </button>
          
          <button onClick={downloadFullSeries} disabled={isDownloading} className="bg-[#09fe94] hover:bg-[#08e685] text-black font-black py-3 px-6 rounded-2xl flex items-center gap-2 text-xs shadow-xl transition-all active:scale-95 disabled:opacity-50">
            {isDownloading && zipProgress !== null ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FolderDown className="w-4 h-4" />
            )}
            {zipProgress !== null ? `${zipProgress}%` : "LAST NED MAPPE"}
          </button>
        </div>
      </div>

      {/* SERIES SELECTOR (10 SERIES) */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-10 max-w-5xl px-4">
        {SERIES.map((_, i) => (
          <button key={i} onClick={() => { setSeriesIdx(i); setSlideIdx(0); }} className={`w-10 h-10 rounded-lg text-xs font-black border transition-all ${i === seriesIdx ? 'bg-[#09fe94] border-[#09fe94] text-black shadow-[0_0_15px_rgba(9,254,148,0.3)]' : 'bg-transparent border-white/10 text-white/40 hover:border-white/30'}`}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* PREVIEW */}
      <div className="relative group">
        <div ref={canvasRef} className="w-[405px] h-[720px] rounded-[48px] overflow-hidden shadow-2xl bg-white">
          <SlideContent slide={series.slides[slideIdx]} idx={slideIdx} total={total} />
        </div>
        
        <button onClick={() => setSlideIdx(i => Math.max(0, i-1))} className="absolute top-1/2 -left-16 transform -translate-y-1/2 text-white/20 hover:text-white transition-all p-4">
          <span className="text-3xl font-black">←</span>
        </button>
        <button onClick={() => setSlideIdx(i => Math.min(total-1, i+1))} className="absolute top-1/2 -right-16 transform -translate-y-1/2 text-white/20 hover:text-white transition-all p-4">
          <span className="text-3xl font-black">→</span>
        </button>
      </div>

      <div className="flex gap-2 mt-8">
        {series.slides.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === slideIdx ? 'w-8 bg-[#09fe94]' : 'w-2 bg-white/10'}`} />
        ))}
      </div>

      <div className="fixed -left-[2000px] top-0 opacity-0 pointer-events-none">
        <div ref={hiddenCanvasRef} className="w-[405px] h-[720px]">
          <SlideContent slide={series.slides[slideIdx]} idx={slideIdx} total={total} />
        </div>
      </div>
    </div>
  );
}

export default function TiktokPage() {
  return (
    <Suspense fallback={<div className="bg-[#111] min-h-screen flex items-center justify-center text-white">Laster Studio...</div>}>
      <TiktokContent />
    </Suspense>
  );
}
