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
          <div key={i} className={`h-1.5 rounded-full ${i === idx ? "w-5 bg-[#09fe94]" : "w-1.5 bg-white"}`} />
        ))}
      </div>
      <div className="absolute inset-x-8 top-[110px] bottom-[280px] flex flex-col justify-center">
        {children}
      </div>
      <div className="absolute bottom-[200px] left-8 right-12 flex justify-between items-center border-t border-[#d8d3c5] pt-2">
        <p className="text-[7px] font-black tracking-[0.2em] text-[#a09b8f]">REACHR.NO</p>
        <div className="flex gap-1 items-center">
          <Shield className="w-2.5 h-2.5 text-[#09fe94]" />
          <span className="text-[7px] font-bold text-[#a09b8f] uppercase">Ekte B2B-data</span>
        </div>
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
// 20 SERIES (TRIMMED TO 5-8 SLIDES)
// ─────────────────────────────────────────────────────────────────────────────

const s1Slides = [
  { type: "hook", headline: "Slutt å grave\ni Excel.", sub: "Du kaster bort timer på kjedelig research hver eneste mandag." },
  { type: "comparison", title: "Realiteten.", left: "Grave i Proff hele dagen.", right: "AI skanner alt på 5 sekunder." },
  { type: "stat", number: "3600", label: "Klikk spart", sub: "Det er så mange manuelle klikk du slipper å ta hver uke med Reachr." },
  { type: "step", label: "AUTO", body: "Koble til CRM-et ditt og se leadsene flyte inn." },
  { type: "cta", headline: "Begynn nå.", cta: "reachr.no" }
];

const s2Slides = [
  { type: "hook", headline: "1.2 Millioner.", sub: "Det er antallet aktive bedrifter i det norske markedet." },
  { type: "radar", title: "Vår radar ser alt.", body: "Vi skanner samtlige 1.2M selskaper i sanntid for å finne dine leads." },
  { type: "concept", icon: Database, headline: "Vi siler ut.", sub: "Glem de 99% som aldri vil kjøpe. Vi finner de heteste for deg." },
  { type: "stat", number: "100 %", label: "Ferske Leads", sub: "Alltid oppdatert rett fra offentlige registre." },
  { type: "cta", headline: "Sjekk markedet.", cta: "reachr.no" }
];

const s3Slides = [
  { type: "hook", headline: "Lenes lunsj-hemmet.", sub: "Hvorfor har Lene alltid tid til lunsj i motsetning til deg?" },
  { type: "chat", side: "left", name: "Sondre", text: "Lene, kalenderen din er stappfull! Hvor finner du leadsen din?" },
  { type: "chat", side: "right", name: "Lene", text: "Jeg runder ikke Google lenger. Jeg bruker Reachr." },
  { type: "stat", number: "10 timer", label: "Fritid vunnet", sub: "Lene får 10 ekstra timer til salg hver uke." },
  { type: "cta", headline: "Bli som Lene.", cta: "reachr.no" }
];

const s4Slides = [
  { type: "hook", headline: "Cold Calling\ner dødt.", sub: "Ingen svarer ukjente nummer lenger. Du ringer i blinde." },
  { type: "concept", icon: Zap, headline: "Varm opp salget.", sub: "Vi viser deg hvem som faktisk trener dine tjenester akkurat nå." },
  { type: "list", title: "Tre steg til suksess:", points: ["1. Definer drømmekunden.", "2. La AI finne e-posten.", "3. Send video-pitch."] },
  { type: "cta", headline: "Vinn markedet.", cta: "reachr.no" }
];

const s5Slides = [
  { type: "hook", headline: "ROI som rocker.", sub: "Betaler du for mye for hvert eneste B2B-lead?" },
  { type: "stat", number: "80 %", label: "Billigere", sub: "Reachr-data er 80% rimeligere enn betalte annonser." },
  { type: "comparison", title: "Budsjettet.", left: "Går til Google og LinkedIn Ads.", right: "Går rett til ekte leads." },
  { type: "cta", headline: "Spar penger.", cta: "reachr.no" }
];

const s6Slides = [
  { type: "hook", headline: "Sjefen vil vite.", sub: "Hvordan ble teamet plutselig så effektive?" },
  { type: "chat", side: "left", name: "Sjefen", text: "Vi knuser alle salgsrekordene våre nå! Hva er det dere gjør?" },
  { type: "chat", side: "right", name: "Teamet", text: "Vi byttet ut gjetting med Reachr-data. Enkelt og greit." },
  { type: "stat", number: "XXL", label: "Pipeline", sub: "Pipelinen har aldri vært sunnere." },
  { type: "cta", headline: "Imponer sjefen.", cta: "reachr.no" }
];

const s7Slides = [
  { type: "hook", headline: "Viking-fart.", sub: "Slik tar man over det norske markedet i 2026." },
  { type: "comparison", title: "Evolusjonen.", left: "Gammel og treg research.", right: "Moderne og Reachr-drevet." },
  { type: "radar", title: "Erobringen...", body: "Vi ser muligheter før konkurrentene dine." },
  { type: "cta", headline: "Erobre nå.", cta: "reachr.no" }
];

const s8Slides = [
  { type: "hook", headline: "Detective Mode.", sub: "Finn de skjulte beslutningstakere i Norge." },
  { type: "concept", icon: Search, headline: "Bak kulissene.", sub: "Se hvem som faktisk bestemmer over budsjettet." },
  { type: "step", label: "1 CLICK", body: "Finn direktelinjer rett i nettleseren din." },
  { type: "cta", headline: "Oppdag sannheten.", cta: "reachr.no" }
];

const s9Slides = [
  { type: "hook", headline: "Gull i innboksen.", sub: "Når e-postene dine endelig blir lest." },
  { type: "chat", side: "left", name: "Erik", text: "Endelig får jeg svar fra folka jeg skriver til!" },
  { type: "chat", side: "right", name: "Morten", text: "Fordi du sender relevant info til relevante folk." },
  { type: "stat", number: "40 %", label: "Høyere svarprosent", sub: "Ved bruk av qualified leads fra Reachr." },
  { type: "cta", headline: "Få flere svar.", cta: "reachr.no" }
];

const s10Slides = [
  { type: "hook", headline: "Reachr AI.", sub: "Din nye salgsassistent som aldri sover." },
  { type: "concept", icon: Rocket, headline: "Launch nå.", sub: "Automatiser grovarbeidet og fokuser på å selge." },
  { type: "stat", number: "24/7", label: "Jobber for deg", sub: "Finner leads mens du sover eller er i lunsj." },
  { type: "cta", headline: "Start i dag.", cta: "reachr.no" }
];

const s11Slides = [
  { type: "hook", headline: "Møte-maskinen.", sub: "Den beste følelsen i verden er en full kalender." },
  { type: "stat", number: "+15", label: "Møter i uka", sub: "Standard for de som bruker Reachr-verktøyene proaktivt." },
  { type: "step", label: "KLAR", body: "Sett opp din søkeradar på 60 sekunder." },
  { type: "cta", headline: "Book flere møter.", cta: "reachr.no" }
];

const s12Slides = [
  { type: "hook", headline: "Data-driven or Die.", sub: "Folk som gjetter i salg har ingen fremtid." },
  { type: "comparison", title: "Slaget om B2B.", left: "Gjetting og intuisjon.", right: "Datadrevet beslutning." },
  { type: "stat", number: "100%", label: "Real-time", sub: "Alt i databasen er ferskt og oppdatert nå." },
  { type: "cta", headline: "Bli moderne.", cta: "reachr.no" }
];

const s13Slides = [
  { type: "hook", headline: "LinkedIn Genius.", sub: "Bruk verdens største nettverk på en helt ny måte." },
  { type: "step", label: "SCAN", body: "Se de hemmelige numrene direkte på LinkedIn-profiler." },
  { type: "stat", number: "Ett klikk", label: "Import", sub: "Ta leads rett fra LinkedIn til ditt CRM." },
  { type: "cta", headline: "Bruk Geni-Mode.", cta: "reachr.no" }
];

const s14Slides = [
  { type: "hook", headline: "Innboks Null?", sub: "For våre selgere betyr innboks null mangel på muligheter." },
  { type: "chat", side: "left", name: "Kollega", text: "Hvor ble det av alle kundene dine?" },
  { type: "chat", side: "right", name: "Reachr-selger", text: "De er her! Innboksen min renner over." },
  { type: "cta", headline: "Fyll innboksen.", cta: "reachr.no" }
];

const s15Slides = [
  { type: "hook", headline: "CRM Magie.", sub: "Slutt å manuelt mate systemet ditt med data." },
  { type: "concept", icon: Zap, headline: "Auto-Sync.", sub: "Sync leads rett inn i Hubspot eller Pipedrive." },
  { type: "stat", number: "0 sek", label: "Manuell jobb", sub: "Vi gjør alt grovarbeidet for deg automatisk." },
  { type: "cta", headline: "Automatiser.", cta: "reachr.no" }
];

const s16Slides = [
  { type: "hook", headline: "Hvor er lunsjen?", sub: "Du fortjener en lunsj uten tastaturstøv på skiva." },
  { type: "comparison", title: "Tidsklemma.", left: "Research foran PC-en.", right: "Nyt kaffen og lunsjen." },
  { type: "stat", number: "X2", label: "Effektivitet", sub: "Når du lar teknologien ta seg av tidsbruken." },
  { type: "cta", headline: "Ta lunsj.", cta: "reachr.no" }
];

const s17Slides = [
  { type: "hook", headline: "Bullseye.", sub: "Treff blink på hver eneste salgssamtale." },
  { type: "radar", title: "Targeting...", body: "Vi isolerer de selskapene som har størst kjøpskraft." },
  { type: "stat", number: "90 %", label: "Treffsikkerhet", sub: "Når du ringer de rette personene til rett tid." },
  { type: "cta", headline: "Treff blink.", cta: "reachr.no" }
];

const s18Slides = [
  { type: "hook", headline: "Vekst-motoren.", sub: "Hold foten din på gassen gjennom hele året." },
  { type: "stat", number: "60 %", label: "Salgsøkning", sub: "Gjennomsnittlig vekst hos våre mest lojale kunder." },
  { type: "cta", headline: "Bli en vinner.", cta: "reachr.no" }
];

const s19Slides = [
  { type: "hook", headline: "Bli en Reachr.", sub: "Bli med i Norges raskest voksende salgsmiljø." },
  { type: "stat", number: "5000+", label: "Medlemmer", sub: "Lær av de beste selgerne i bransjen." },
  { type: "cta", headline: "Bli med oss.", cta: "reachr.no" }
];

const s20Slides = [
  { type: "hook", headline: "Finalen er her.", sub: "Er du klar for å ta salget ditt til 2026-nivå?" },
  { type: "concept", icon: Rocket, headline: "Take-off.", sub: "Ikke vent til neste mandag. Start reisen i dag." },
  { type: "cta", headline: "Sjekk oss ut.", cta: "reachr.no" }
];

const SERIES = [
  { name: "1. Excel-fri", slides: s1Slides },
  { name: "2. 1.2M", slides: s2Slides },
  { name: "3. Lunsjen", slides: s3Slides },
  { name: "4. Kald start", slides: s4Slides },
  { name: "5. ROI Vinner", slides: s5Slides },
  { name: "6. Sjefens drøm", slides: s6Slides },
  { name: "7. Vikingen", slides: s7Slides },
  { name: "8. Detektiven", slides: s8Slides },
  { name: "9. Innboksen", slides: s9Slides },
  { name: "10. AI Power", slides: s10Slides },
  { name: "11. Møtene", slides: s11Slides },
  { name: "12. Fremtiden", slides: s12Slides },
  { name: "13. Geni Mode", slides: s13Slides },
  { name: "14. Flowen", slides: s14Slides },
  { name: "15. CRM Magie", slides: s15Slides },
  { name: "16. Roen", slides: s16Slides },
  { name: "17. Bullseye", slides: s17Slides },
  { name: "18. Gasen", slides: s18Slides },
  { name: "19. Miljøet", slides: s19Slides },
  { name: "20. Finalen", slides: s20Slides },
];

function SlideContent({ slide, idx, total, showGuide }: { slide: any; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide} key={idx}>
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
          <h2 className="text-lg font-black text-[#171717] italic uppercase mb-4 leading-none">{slide.title}</h2>
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
        <h1 className="text-2xl font-black italic tracking-tighter">STUDIO V7</h1>
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

      <div className="flex gap-2 mt-6">
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
