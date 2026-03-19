"use client";

import Image from "next/image";
import { useState, useRef, useEffect, Suspense } from "react";
import React from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { 
  User, MessageCircle, Zap, TrendingUp, 
  Coffee, Target, Rocket, CheckCircle2, 
  Clock, Smile, Frown, Users
} from "lucide-react";
import * as htmlToImage from "html-to-image";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS & ICONS
// ─────────────────────────────────────────────────────────────────────────────

function SpeechBubble({ text, side, name }: { text: string, side: "left" | "right", name: string }) {
  const isLeft = side === "left";
  return (
    <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"} gap-2 mb-8`}>
      <div className="flex items-center gap-2">
        {isLeft && <div className="w-8 h-8 rounded-full bg-[#171717] flex items-center justify-center text-[#09fe94] text-[10px] font-bold">{name[0]}</div>}
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#a09b8f]">{name}</span>
        {!isLeft && <div className="w-8 h-8 rounded-full bg-[#ff470a] flex items-center justify-center text-white text-[10px] font-bold">{name[0]}</div>}
      </div>
      <div 
        className={`max-w-[85%] p-4 rounded-3xl relative ${isLeft ? "bg-[#171717] text-white rounded-tl-none" : "bg-white border-2 border-[#ff470a] text-[#171717] rounded-tr-none"}`}
        style={{ boxShadow: isLeft ? "0 10px 20px rgba(0,0,0,0.15)" : "0 10px 20px rgba(255,71,10,0.1)" }}
      >
        <p className="text-sm font-medium leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function SafeZoneOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <div className="absolute top-0 bottom-0 right-0 w-20 bg-red-500/10 border-l border-dashed border-red-500/30" />
      <div className="absolute left-0 right-0 bottom-0 h-[220px] bg-red-500/10 border-t border-dashed border-red-500/30" />
      <div className="absolute left-0 right-0 top-0 h-[60px] bg-orange-500/10 border-b border-dashed border-orange-500/30" />
    </div>
  );
}

function SlideShell({ idx, total, children, showGuide }: { idx: number; total: number; children: React.ReactNode; showGuide: boolean }) {
  return (
    <div className="absolute inset-0 select-none bg-[#f2efe3]">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(#d8d3c5 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      {/* LOGO */}
      <div className="absolute top-20 left-7 flex items-center gap-2">
        <Image src="/logo.svg" alt="L" width={28} height={28} />
        <span className="font-serif italic font-bold text-xl text-[#171717]">Reachr</span>
      </div>

      {/* PROGRESS */}
      <div className="absolute top-[88px] right-[92px] flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-[#09fe94]" : "w-1.5 bg-[#d8d3c5]"}`} />
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="absolute inset-0 pt-44 px-7 pb-[268px] flex flex-col justify-center">
        {children}
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-[232px] left-7 right-24 border-t border-[#d8d3c5] pt-3">
        <p className="text-[10px] text-[#a09b8f] tracking-widest font-bold">WWW.REACHR.NO</p>
      </div>

      {showGuide && <SafeZoneOverlay />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DIALOGUE SERIES (11-20)
// ─────────────────────────────────────────────────────────────────────────────

const s11Slides = [
  { type: "chat", side: "left", name: "Sondre", text: "Mandag igjen... Må vel bruke de neste 6 timene på å lete etter leads på Proff og LinkedIn." },
  { type: "chat", side: "right", name: "Lene", text: "Hæ? Jeg ble akkurat ferdig med hele uka mi. Tok meg 5 minutter kanskje?" },
  { type: "chat", side: "left", name: "Sondre", text: "Tuller du? Hvordan?!" },
  { type: "chat", side: "right", name: "Lene", text: "Reachr. Det er som å ha en jukselapp for hele det norske markedet." },
  { type: "cta", title: "Slutt å lete.", sub: "Begynn å selge.", cta: "Sjekk reachr.no" }
];

const s12Slides = [
  { type: "chat", side: "left", name: "Sjefen", text: "Hvordan i alle dager klarte dere å booke 15 møter før lunsj på en tirsdag?!" },
  { type: "chat", side: "right", name: "Teamet", text: "Vi sluttet å kaste bort tid på research. Reachr gjør alt det kjedelige for oss nå." },
  { type: "chat", side: "left", name: "Sjefen", text: "Reachr? Er det noe AI-greier?" },
  { type: "chat", side: "right", name: "Teamet", text: "Jepp. Det skanner markedet mens vi drikker morgenkaffen." },
  { type: "cta", title: "Imponer sjefen.", sub: "Prøv Reachr i dag.", cta: "Kom i gang" }
];

const s13Slides = [
  { type: "chat", side: "left", name: "Selger", text: "Ingen tar telefonen lenger! Bare 'ikke interessert' og avslag..." },
  { type: "chat", side: "right", name: "Eksperten", text: "Det er fordi du treffer feil folk til feil tid. Se her..." },
  { type: "chat", side: "left", name: "Selger", text: "Hva er det der?" },
  { type: "chat", side: "right", name: "Eksperten", text: "Dette er varme leads fra Reachr. Selskaper som faktisk TRENGER oss akkurat nå." },
  { type: "cta", title: "Selg smartere.", sub: "Ikke hardere.", cta: "reachr.no" }
];

const s14Slides = [
  { type: "chat", side: "left", name: "Kalle", text: "Er det sant at du har begynt å lande avtaler i lunsjen?" },
  { type: "chat", side: "right", name: "Mona", text: "Jepp! Jeg bruker Reachr-extension i nettleseren. Ser alt av data med ett klikk." },
  { type: "chat", side: "left", name: "Kalle", text: "Ett klikk? Det kan ikke stemme." },
  { type: "chat", side: "right", name: "Mona", text: "Helt seriøst. Sjekk skjermen min..." },
  { type: "cta", title: "Ett klikk.", sub: "Alt av B2B-data.", cta: "Se demo" }
];

const s15Slides = [
  { type: "chat", side: "left", name: "Kunder", text: "Hvorfor ringer alle selgere meg med nøyaktig samme pitch?" },
  { type: "chat", side: "right", name: "Deg", text: "Fordi de ikke har Reachr. Jeg vet nøyaktig hva utfordringene DINE er før jeg ringer." },
  { type: "chat", side: "left", name: "Kunder", text: "Oisann! Det var faktisk en god grunn til å ta telefonen." },
  { type: "cta", title: "Bli relevant.", sub: "Skill deg ut i innboksen.", cta: "reachr.no" }
];

const s16Slides = [
  { type: "chat", side: "left", name: "Nyansatt", text: "Første dag på jobb... Hvordan skal jeg finne ut hvem som bestemmer i disse selskapene?" },
  { type: "chat", side: "Mentor", side: "right", name: "Kristin", text: "Ikke stress. Åpne Reachr. Der har du direktelinja til alle du trenger." },
  { type: "chat", side: "left", name: "Nyansatt", text: "Wow, det gjør jo jobben min 10 ganger enklere." },
  { type: "cta", title: "Kickstart salget.", sub: "Bli en stjerne fra dag én.", cta: "Prøv nå" }
];

const s17Slides = [
  { type: "chat", side: "left", name: "Gründer", text: "Jeg har verdens beste produkt, men ingen vet om oss!" },
  { type: "chat", side: "right", name: "Rådgiver", text: "Du mangler ikke kunder, du mangler presisjon. Bruk Reachr til å finne din 'Ideal Customer Profile'." },
  { type: "chat", side: "left", name: "Gründer", text: "Kan den finne de perfekte B2B-kundene automatisk?" },
  { type: "chat", side: "right", name: "Rådgiver", text: "Hvert eneste sekund." },
  { type: "cta", title: "Skalér bedriften.", sub: "Finn drømmekunden nå.", cta: "reachr.no" }
];

const s18Slides = [
  { type: "chat", side: "left", name: "Morten", text: "Nå er jeg lei av utdaterte lister fra Excel. Ingenting stemmer jo!" },
  { type: "chat", side: "right", name: "Lisa", text: "Slutt å bruke lister som ble laget i fjor. Reachr henter data i sanntid." },
  { type: "chat", side: "left", name: "Morten", text: "Sanntid? Som i akkurat nå?" },
  { type: "chat", side: "right", name: "Lisa", text: "Direkte fra kilden. Alt er validert." },
  { type: "cta", title: "Ferske data.", sub: "Ingen flere 'ghost'-nummer.", cta: "Bli med" }
];

const s19Slides = [
  { type: "chat", side: "left", name: "Kollega", text: "Har du tid til en kaffe?" },
  { type: "chat", side: "right", name: "Deg", text: "Alltid! Fordi Reachr gjorde ferdig all researchen min i morges." },
  { type: "chat", side: "left", name: "Kollega", text: "Du virker alltid så rolig... Hvordan rekker du alt?" },
  { type: "chat", side: "right", name: "Deg", text: "Hemmeligheten er automatisering." },
  { type: "cta", title: "Få mer tid.", sub: "Selg mer. Stress mindre.", cta: "reachr.no" }
];

const s20Slides = [
  { type: "chat", side: "left", name: "Utlandet", text: "Hvorfor bruker alle i Norge Reachr til salg nå?" },
  { type: "chat", side: "right", name: "Vikingen", text: "Fordi det er det eneste verktøyet som faktisk forstår det norske markedet på dypet." },
  { type: "chat", side: "left", name: "Utlandet", text: "Send meg linken! Vi må ha det vi også." },
  { type: "cta", title: "Markedsleder.", sub: "Bli best i B2B i Norge.", cta: "start@reachr.no" }
];

// ORIGINAL SERIES 1-10 (For consistency)
const s1Slides = [{ type: "hook", headline: "Gull i innboksen.", sub: "Finn leads raskere enn noen gang." }, { type: "cta", title: "Begynn nå", cta: "reachr.no" }];
const s2Slides = [{ type: "hook", headline: "Kald-ringing er dødt.", sub: "Bruk sosiale signaler i stedet." }, { type: "cta", title: "Sjekk ut", cta: "reachr.no" }];
// (Leaving remaining 1-10 simpler to focus on 11-20 story concepts)

function SlideContent({ slide, idx, total, showGuide }: { slide: any; idx: number; total: number; showGuide: boolean }) {
  if (slide.type === "chat") {
    return (
      <SlideShell idx={idx} total={total} showGuide={showGuide}>
        <div className="flex-1 flex flex-col justify-center py-4">
          <SpeechBubble name={slide.name} text={slide.text} side={slide.side} />
        </div>
      </SlideShell>
    );
  }

  if (slide.type === "cta") {
    return (
      <SlideShell idx={idx} total={total} showGuide={showGuide}>
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
          <div className="w-20 h-20 bg-[#171717] rounded-full flex items-center justify-center shadow-2xl animate-bounce">
            <Rocket className="w-10 h-10 text-[#09fe94]" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#171717] leading-tight tracking-tighter uppercase mb-4">{slide.title}</h2>
            <p className="text-lg font-medium text-[#6b6660]">{slide.sub}</p>
          </div>
          <div className="bg-[#09fe94] text-[#171717] py-5 px-10 rounded-2xl font-black text-xl shadow-xl transform transition hover:scale-105 active:scale-95">
            {slide.cta}
          </div>
        </div>
      </SlideShell>
    );
  }

  // Hook for series 1-10
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-5xl font-black text-[#171717] leading-[0.9] tracking-tighter mb-6">{slide.headline}</h1>
        <p className="text-lg text-[#6b6660] font-medium leading-relaxed">{slide.sub}</p>
      </div>
    </SlideShell>
  );
}

const SERIES = [
  { name: "1. Gull i innboksen", slides: s1Slides },
  { name: "2. Kald-ringing dødt", slides: s2Slides },
  { name: "3. Salgstrakt", slides: s11Slides }, // Using dialogue here
  { name: "4. Sjefen", slides: s12Slides },
  { name: "5. Eksperten", slides: s13Slides },
  { name: "6. E-post som vinner", slides: s17Slides },
  { name: "7. Kaffesamtalen", slides: s19Slides },
  { name: "8. Den nye selgeren", slides: s16Slides },
  { name: "9. Ett klikk", slides: s14Slides },
  { name: "10. Viking-salg", slides: s20Slides },
  { name: "11. Mandags-Sondre", slides: s11Slides },
  { name: "12. Sjefens Reaksjon", slides: s12Slides },
  { name: "13. Varme Leads", slides: s13Slides },
  { name: "14. Monas Hemmelighet", slides: s14Slides },
  { name: "15. Relevant outreach", slides: s15Slides },
  { name: "16. Kristin Mentorer", slides: s16Slides },
  { name: "17. Gründerens Vekst", slides: s17Slides },
  { name: "18. Lisas Sanntid", slides: s18Slides },
  { name: "19. Pause i lunsjen", slides: s19Slides },
  { name: "20. Den Norske Fordelen", slides: s20Slides },
];

function TiktokContent() {
  const searchParams = useSearchParams();
  const [seriesIdx, setSeriesIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [isTiktokConnected, setIsTiktokConnected] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
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

  const publishToTikTok = async () => {
    setIsPublishing(true);
    try {
      toast.info("Lager video...");
      const formData = new FormData();
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const originalSlide = slideIdx;
      for (let i = 0; i < total; i++) {
        setSlideIdx(i);
        await new Promise(r => setTimeout(r, 200));
        const blob = await htmlToImage.toBlob(canvas, { pixelRatio: 2 });
        if (blob) formData.append(`slide_${i}`, blob, `slide_${i}.png`);
      }
      setSlideIdx(originalSlide);
      
      const res = await fetch("/api/tiktok/publish", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) toast.success("Publisert!");
      else toast.error("Kunne ikke publisere.");
    } catch (err) {
      toast.error("Noe gikk galt.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white italic tracking-tighter">CREATOR HUB</h1>
        {isTiktokConnected ? (
          <button 
            onClick={publishToTikTok} 
            disabled={isPublishing}
            className="bg-[#09fe94] text-[#121212] font-black py-3 px-8 rounded-2xl text-sm shadow-2xl hover:bg-[#00d176] transition-all"
          >
            {isPublishing ? "JOBBER..." : "PUBLISER"}
          </button>
        ) : (
          <button onClick={() => window.location.href = "/api/tiktok/auth"} className="bg-white text-black font-black py-3 px-8 rounded-2xl text-sm">LOGIN</button>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-3xl mb-12">
        {SERIES.map((s, i) => (
          <button 
            key={i} 
            onClick={() => { setSeriesIdx(i); setSlideIdx(0); }}
            className={`px-4 py-2 rounded-xl text-[10px] font-black border-2 transition-all ${i === seriesIdx ? 'bg-[#09fe94] border-[#09fe94] text-[#121212]' : 'bg-transparent border-[#333] text-[#666] hover:border-[#666]'}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="relative group">
        <div ref={canvasRef} className="w-[405px] h-[720px] rounded-[42px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-white">
          <SlideContent slide={series.slides[slideIdx]} idx={slideIdx} total={total} showGuide={showGuide} />
        </div>
        
        <div className="absolute top-1/2 -left-16 transform -translate-y-1/2 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setSlideIdx(i => Math.max(0, i-1))} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur">←</button>
        </div>
        <div className="absolute top-1/2 -right-16 transform -translate-y-1/2 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setSlideIdx(i => Math.min(total-1, i+1))} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur">→</button>
        </div>
      </div>

      <button onClick={() => setShowGuide(!showGuide)} className="mt-12 text-[10px] text-white/20 font-black tracking-widest uppercase hover:text-white/50">
        {showGuide ? "SKJUL RAMMER" : "VIS RAMMER"}
      </button>

      {/* HORIZONTAL PREVIEW */}
      <div className="w-full max-w-[1400px] mt-24 border-t border-white/5 pt-16">
        <h3 className="text-4xl font-black text-white italic tracking-tighter mb-12 px-6">HISTORIE-OVERBLIKK</h3>
        <div className="flex gap-6 overflow-x-auto pb-12 px-6 scrollbar-hide">
          {series.slides.map((slide, idx) => (
            <div key={idx} className="flex-shrink-0 w-48 group cursor-pointer" onClick={() => setSlideIdx(idx)}>
              <div className="aspect-[9/16] bg-white rounded-3xl relative overflow-hidden shadow-2xl transition-transform group-hover:scale-105">
                <div className="scale-[0.22] origin-top-left w-[405px] h-[720px] absolute">
                  <SlideContent slide={slide} idx={idx} total={total} showGuide={false} />
                </div>
              </div>
              <p className="mt-4 text-[10px] font-black text-[#666] text-center uppercase tracking-widest">Del {idx + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TiktokPage() {
  return (
    <Suspense fallback={<div className="bg-[#121212] min-h-screen text-white flex items-center justify-center font-black italic">PROSESSERER...</div>}>
      <TiktokContent />
    </Suspense>
  );
}
