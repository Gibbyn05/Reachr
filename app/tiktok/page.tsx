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
    <div className="flex gap-3 items-stretch h-44 my-3 font-sans">
      <div className="flex-1 bg-red-100/30 border-2 border-dashed border-red-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
        <Frown className="w-7 h-7 text-red-500 mb-1" />
        <p className="text-[10px] font-black text-red-900 leading-tight">{left}</p>
      </div>
      <div className="flex-1 bg-emerald-100/40 border-2 border-emerald-500/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center font-black">
        <Smile className="w-7 h-7 text-emerald-500 mb-1" />
        <p className="text-[10px] text-emerald-900 leading-tight">{right}</p>
      </div>
    </div>
  );
}

function RadarEffect() {
  return (
    <div className="relative w-32 h-32 mx-auto my-3 flex items-center justify-center tracking-tighter">
      <div className="absolute inset-0 border-4 border-[#171717] rounded-full opacity-10" />
      <div className="absolute inset-8 border border-[#171717] rounded-full opacity-20" />
      <div className="absolute w-1 h-16 bg-gradient-to-t from-[#09fe94] to-transparent origin-bottom rotate-45" style={{ bottom: "50%", left: "px" }} />
      <Target className="w-8 h-8 text-[#09fe94]" />
    </div>
  );
}

function ListProgress({ points }: { points: string[] }) {
  return (
    <div className="flex flex-col gap-2.5 my-3 font-sans">
      {points.map((p, i) => (
        <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-2xl border-2 border-[#171717] shadow-[4px_4px_0px_#171717]">
          <div className="w-6 h-6 rounded-full bg-[#09fe94] flex items-center justify-center text-[10px] font-black">{i + 1}</div>
          <p className="text-[11px] font-black text-[#171717] uppercase tracking-tight">{p}</p>
        </div>
      ))}
    </div>
  );
}

function SpeechBubble({ text, side, name }: { text: string, side: "left" | "right", name: string }) {
  const isLeft = side === "left";
  return (
    <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"} gap-1 mb-2 font-sans`}>
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
      <div className="absolute inset-0 top-[130px] px-8 bottom-[280px] flex flex-col justify-center">
        {children}
      </div>
      <div className="absolute bottom-[210px] left-8 right-12 flex justify-between items-center border-t border-[#d8d3c5] pt-3">
        <p className="text-[8px] font-black tracking-[0.2em] text-[#a09b8f]">REACHR.NO</p>
        <span className="text-[7px] font-bold text-[#a09b8f] uppercase tracking-wider">Ekte B2B-data</span>
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
// RE-WRITTEN SERIES WITH "RED THREAD" LOGIC
// ─────────────────────────────────────────────────────────────────────────────

const s1Slides = [
  { type: "hook", headline: "Slutt å lete.", sub: "Du kaster bort timer på å finne leads manuelt." },
  { type: "comparison", title: "Problemet vs Løsningen.", left: "Grave i Excel og Proff hele dagen.", right: "Reachr AI skanner alt på 5 sekunder." },
  { type: "stat", number: "10t", label: "Fritid", sub: "Gjennomsnittlig tid spart per uke." },
  { type: "cta", headline: "Få tiden tilbake.", cta: "reachr.no" }
];

const s2Slides = [
  { type: "hook", headline: "Din nye radar.", sub: "Finn de bedriftene som faktisk vil kjøpe." },
  { type: "radar", title: "Søker i markedet...", body: "Vi overvåker 1.2M norske bedrifter for deg." },
  { type: "stat", number: "1.2M", label: "Ledige Leads", sub: "Alt du trenger å gjøre er å filtrere." },
  { type: "cta", headline: "Sjekk radaren.", cta: "reachr.no" }
];

const s3Slides = [
  { type: "chat", side: "left", name: "Sondre", text: "Hvor ble det av alle kundene våre? Pipelinen er helt tom!" },
  { type: "chat", side: "right", name: "Lene", text: "Du bruker jo fremdeles LinkedIn manuelt. Se på min skjerm..." },
  { type: "chat", side: "left", name: "Sondre", text: "Oi! Hvordan fikk du 50 nye leads på én natt?" },
  { type: "chat", side: "right", name: "Lene", text: "Reachr. Det er som å ha en robot som selger for deg." },
  { type: "cta", headline: "Fyll pipelinen.", cta: "reachr.no" }
];

const s4Slides = [
  { type: "hook", headline: "Planen er klar.", sub: "Slik knuser du salgsrekordene i 2026." },
  { type: "list", title: "Stegene:", points: ["1. Definer drømmekunden."] },
  { type: "list", title: "Stegene:", points: ["1. Definer drømmekunden.", "2. La AI finne direktelinja."] },
  { type: "list", title: "Stegene:", points: ["1. Definer drømmekunden.", "2. La AI finne direktelinja.", "3. Send video-pitch."] },
  { type: "cta", headline: "Start reisen.", cta: "reachr.no" }
];

const s5Slides = [
  { type: "hook", headline: "Er du en selger?", sub: "Eller er du en profesjonell 'copy-paster'?" },
  { type: "comparison", title: "Din arbeidsdag.", left: "Copy-paste fra Proff til CRM.", right: "Ett klikk. Ferdig i CRM." },
  { type: "stat", number: "3600", label: "Klikk spart", sub: "Ved å slippe manuell inntasting." },
  { type: "cta", headline: "Spar hendene dine.", cta: "reachr.no" }
];

const s6Slides = [
  { type: "hook", headline: "Sjefen vil vite.", sub: "Hvordan ble teamet plutselig så effektive?" },
  { type: "chat", side: "left", name: "Sjefen", text: "Møtekalenderne deres er stappfulle. Hva skjer?" },
  { type: "chat", side: "right", name: "Kristin", text: "Vi byttet ut gjetting med Reachr-data. Enkelt og greit." },
  { type: "cta", headline: "Imponer sjefen.", cta: "reachr.no" }
];

const s7Slides = [
  { type: "hook", headline: "ROI som gir mening.", sub: "Hvorfor betale for dyre annonser?" },
  { type: "stat", number: "80 %", label: "Billigere", sub: "Direkte outreach med Reachr vs Google Ads." },
  { type: "comparison", title: "Kostnaden.", left: "Vente på at folk klikker.", right: "Gå rett til beslutningstaker." },
  { type: "cta", headline: "Kutt kostnader.", cta: "reachr.no" }
];

const s8Slides = [
  { type: "hook", headline: "Gullgraver-modus.", sub: "Gullet ligger i dataene konkurrentene ikke ser." },
  { type: "concept", icon: Database, headline: "Dyp innsikt.", sub: "Vi kombinerer 10 datakilder til én profil." },
  { type: "radar", title: "Skanner overflaten...", body: "Finner nye vekstselskaper før de blir 'mainstream'." },
  { type: "cta", headline: "Begynn å grave.", cta: "reachr.no" }
];

const s9Slides = [
  { type: "hook", headline: "Telefon-fobi?", sub: "Folk tar ikke telefonen fra ukjente nummer lenger." },
  { type: "chat", side: "left", name: "Erik", text: "Ingen svarer når jeg ringer 'cold'. Det er så frustrerende." },
  { type: "chat", side: "right", name: "Mina", text: "Ikke ring dem kaldt da! Bruk Reachr til å finne riktig tidspunkt." },
  { type: "cta", headline: "Ring varmt.", cta: "reachr.no" }
];

const s10Slides = [
  { type: "hook", headline: "AI-assistenten.", sub: "Aldri vær alene med salgsansvaret igjen." },
  { type: "concept", icon: Zap, headline: "Lynrask research.", sub: "Vår AI gjør i bakgrunnen det du pleide å bruke dager på." },
  { type: "stat", number: "24/7", label: "Alltid på", sub: "Leads-motoren din stopper aldri." },
  { type: "cta", headline: "Sjekk AI-en.", cta: "reachr.no" }
];

const s11Slides = [
  { type: "hook", headline: "Møte-lykke.", sub: "Den beste følelsen er en full kalender." },
  { type: "stat", number: "+15", label: "Møter i uka", sub: "Det er den nye standarden for våre brukere." },
  { type: "step", label: "1", body: "Finn leads." },
  { type: "step", label: "2", body: "Book møte." },
  { type: "cta", headline: "Fyll kalenderen.", cta: "reachr.no" }
];

const s12Slides = [
  { type: "hook", headline: "Viking-fart.", sub: "Ta over markedsandeler lynraskt." },
  { type: "comparison", title: "Slaget.", left: "Gammel og treg.", right: "Moderne og Reachr." },
  { type: "stat", number: "X3", label: "Vekst-fart", sub: "Når du vet nøyaktig hvem du skal treffe." },
  { type: "cta", headline: "Vinn markedet.", cta: "reachr.no" }
];

const s13Slides = [
  { type: "hook", headline: "Detective Mode.", sub: "Finn de skjulte beslutningstakerne." },
  { type: "concept", icon: Search, headline: "Bak kulissene.", sub: "Se hvem som faktisk bestemmer over budsjettet." },
  { type: "radar", title: "Søker...", body: "Graver dypere enn vanlige registre." },
  { type: "cta", headline: "Avslør dem.", cta: "reachr.no" }
];

const s14Slides = [
  { type: "hook", headline: "Innboks Gull.", sub: "Når svarprosenten din endelig øker." },
  { type: "chat", side: "left", name: "Kollega", text: "Hvorfor får DU så mange 'Ja takk, send info'-svar?" },
  { type: "chat", side: "right", name: "Deg", text: "Fordi jeg sender nøyaktig det de trenger å høre, takket være Reachr." },
  { type: "cta", headline: "Få flere svar.", cta: "reachr.no" }
];

const s15Slides = [
  { type: "hook", headline: "Smart Export.", sub: "Slutt å manuelt mate CRM-et ditt." },
  { type: "step", label: "LINK", body: "Koble til Hubspot eller Pipedrive." },
  { type: "step", label: "SYNC", body: "Leads flyter rett inn automatisk." },
  { type: "stat", number: "0 sek", label: "Manuelt", sub: "Det skal ikke ta mer enn et sekund." },
  { type: "cta", headline: "Koble til nå.", cta: "reachr.no" }
];

const s16Slides = [
  { type: "hook", headline: "Lunsj-seieren.", sub: "Hvordan rekke mer på mindre tid." },
  { type: "comparison", title: "Hverdagen.", left: "Spise foran PC-en.", right: "Nyt kaffen og lunsjen." },
  { type: "concept", icon: Coffee, headline: "Reachr ro.", sub: "Når teknologien gjør grovarbeidet for deg." },
  { type: "cta", headline: "Få mer fritid.", cta: "reachr.no" }
];

const s17Slides = [
  { type: "hook", headline: "Fremtiden er her.", sub: "Er du klar for datadrevet salg i 2026?" },
  { type: "concept", icon: TrendingUp, headline: "Vekst-garanti.", sub: "De som har best data, vinner alltid kampen om kundene." },
  { type: "stat", number: "60 %", label: "Økning", sub: "Salgseffektivitet i norske team." },
  { type: "cta", headline: "Bli moderne.", cta: "reachr.no" }
];

const s18Slides = [
  { type: "hook", headline: "Extensionkraft.", sub: "Ha superkrefter rett i nettleseren." },
  { type: "step", label: "1", body: "Besøk en nettside." },
  { type: "step", label: "2", body: "Se all B2B-data umiddelbart." },
  { type: "stat", number: "1-Click", label: "Lead Gen", sub: "Enklere blir det ikke." },
  { type: "cta", headline: "Last ned nå.", cta: "reachr.no" }
];

const s19Slides = [
  { type: "hook", headline: "LinkedIn Genius.", sub: "Bruk LinkedIn på en helt ny måte." },
  { type: "chat", side: "left", name: "Svein", text: "LinkedIn tar så mye tid å scrolle gjennom..." },
  { type: "chat", side: "right", name: "Tina", text: "Slutt å scrolle. Begynn å skrape leads med Reachr." },
  { type: "cta", headline: "Bli en geni.", cta: "reachr.no" }
];

const s20Slides = [
  { type: "hook", headline: "Bli en Vinner.", sub: "Bli med i gjengen som endrer salg i Norge." },
  { type: "stat", number: "5000+", label: "Brukere", sub: "Og vi vokser hver eneste dag." },
  { type: "concept", icon: Rocket, headline: "Launch nå.", sub: "Ikke vent til neste måned. Start i dag." },
  { type: "cta", headline: "Bli med oss.", cta: "reachr.no" }
];

const SERIES = [
  { name: "1. Metoden", slides: s1Slides },
  { name: "2. Radaren", slides: s2Slides },
  { name: "3. Dialogen", slides: s3Slides },
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
          <h2 className="text-xl font-black text-[#171717] italic uppercase mb-2 leading-none">{slide.title}</h2>
          <Comparison left={slide.left} right={slide.right} />
        </div>
      )}
      {slide.type === "radar" && (
        <div className="flex-1 flex flex-col justify-center text-center">
          <h2 className="text-xl font-black text-[#171717] italic uppercase mb-2 leading-none">{slide.title}</h2>
          <RadarEffect />
          <p className="text-[11px] font-medium text-[#6b6660]">{slide.body}</p>
        </div>
      )}
      {slide.type === "list" && (
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-xl font-black text-[#171717] italic uppercase mb-4 leading-none">{slide.title}</h2>
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
          <p className="text-6xl font-black text-[#171717] leading-none mb-1 tracking-tighter">{slide.number}</p>
          <p className="text-sm font-black uppercase tracking-widest">{slide.label}</p>
          <p className="text-[10px] font-bold text-[#6b6660] mt-2 leading-tight">{slide.sub}</p>
        </div>
      )}
      {slide.type === "concept" && (
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-12 h-12 bg-[#171717] rounded-xl flex items-center justify-center mb-4">
            <slide.icon className="w-6 h-6 text-[#09fe94]" />
          </div>
          <h2 className="text-2xl font-black uppercase italic mb-2 leading-none tracking-tighter">{slide.headline}</h2>
          <p className="text-xs font-medium text-[#6b6660] leading-relaxed">{slide.sub}</p>
        </div>
      )}
      {slide.type === "step" && (
        <div className="mb-3 flex items-start gap-3">
          <div className="bg-[#171717] text-[#09fe94] font-black text-[8px] px-2 py-0.5 rounded-full">{slide.label}</div>
          <p className="text-[11px] font-black text-[#171717] leading-tight">{slide.body}</p>
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
        <h1 className="text-2xl font-black italic tracking-tighter">STUDIO V5</h1>
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



export default function TiktokPage() {
  return (
    <Suspense fallback={<div className="bg-[#111] min-h-screen flex items-center justify-center text-white">LASTUR...</div>}>
      <TiktokContent />
    </Suspense>
  );
}
