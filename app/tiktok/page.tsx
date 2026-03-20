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
  const isGiveaway = theme === "giveaway";

  return (
    <div className={`absolute inset-0 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#171717]' : isGiveaway ? 'bg-[#f2efe3]' : 'bg-[#f2efe3]'}`}>
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
      {isGiveaway && (
        <>
          <div className="absolute top-0 left-0 w-48 h-48 bg-[#09fe94] blur-[90px] opacity-20 rounded-full -translate-y-1/4 -translate-x-1/4" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#ff470a] blur-[90px] opacity-15 rounded-full translate-y-1/4 translate-x-1/4" />
          <ConfettiCanvas />
        </>
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
// CONFETTI + GIVEAWAY ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = ["#09fe94","#ff470a","#ffad0a","#171717","#faf8f2","#ff0050","#fff"];
const CONFETTI_SHAPES = ["■","●","▲","★","♦","✦"];

function ConfettiCanvas() {
  const particles = React.useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      shape: CONFETTI_SHAPES[i % CONFETTI_SHAPES.length],
      left: `${(i * 11 + 5) % 94}%`,
      delay: `${(i * 0.15) % 3.2}s`,
      duration: `${2.2 + (i % 6) * 0.35}s`,
      size: 8 + (i % 5) * 3,
    }))
  , []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg)   scale(1);   opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(760px) rotate(740deg) scale(0.7); opacity: 0; }
        }
        @keyframes pulseBadge {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.09); }
        }
        @keyframes floatPrize {
          0%, 100% { transform: translateY(0px)  rotate(-1deg); }
          50%       { transform: translateY(-7px) rotate(1deg); }
        }
        @keyframes starSpin {
          from { transform: rotate(0deg) scale(1); }
          50%  { transform: rotate(180deg) scale(1.25); }
          to   { transform: rotate(360deg) scale(1); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0px 0px #09fe9444; }
          50%       { box-shadow: 0 0 24px 6px #09fe9477; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute", top: -20, left: p.left,
            fontSize: p.size, color: p.color,
            animation: `confettiFall ${p.duration} ${p.delay} infinite linear`,
            userSelect: "none",
          }}
        >
          {p.shape}
        </div>
      ))}
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
  },
  {
    name: "🎉 GIVEAWAY — Vinn 1 år!",
    theme: "giveaway",
    slides: [
      { type: "giveaway-hook" },
      { type: "giveaway-prize" },
      { type: "giveaway-step", num: "1", emoji: "❤️", action: "Følg oss!", detail: "Trykk følg-knappen nå — du kan ikke vinne uten!" },
      { type: "giveaway-step", num: "2", emoji: "💬", action: "Kommenter!", detail: "Skriv hvem du vil ha med på teamet ditt. Tagg dem direkte!" },
      { type: "giveaway-step", num: "3", emoji: "📤", action: "Del videoen!", detail: "Del med minst 1 person. Jo flere ser, jo høyere sjanser (for deg!)." },
      { type: "giveaway-winner" },
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

      {/* ── GIVEAWAY SLIDE TYPES ── */}
      {slide.type === "giveaway-hook" && (
        <div className="flex-1 flex flex-col justify-center relative z-10">
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#ff470a", color: "#fff", fontSize: 11, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 99, marginBottom: 18, animation: "pulseBadge 1.4s ease-in-out infinite" }}>
            🎉 GIVEAWAY
          </div>
          <p className="font-sans font-black text-[#171717] leading-[0.88] tracking-[-3px]" style={{ fontSize: 68 }}>Vinn</p>
          <p className="font-sans font-black text-[#09fe94] leading-[0.88] tracking-[-3px]" style={{ fontSize: 68 }}>1 år</p>
          <p className="font-sans font-black text-[#171717] leading-[0.88] tracking-[-3px]" style={{ fontSize: 68 }}>gratis!</p>
          <p className="text-[#6b6660] text-[13px] leading-relaxed mt-4">Hele salgsteamet ditt (2–5 pers) får ett år med Reachr Team — helt gratis. 🚀</p>
          <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, background: "#171717", borderRadius: 12, padding: "10px 14px", alignSelf: "flex-start", animation: "glowPulse 2s ease-in-out infinite" }}>
            <span style={{ fontSize: 18 }}>🏆</span>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#09fe94" }}>Verdi: over 20 000 kr</p>
          </div>
        </div>
      )}

      {slide.type === "giveaway-prize" && (
        <div className="flex-1 flex flex-col justify-center relative z-10">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ff470a", marginBottom: 14 }}>Premien 🎁</p>
          <div style={{ background: "#171717", borderRadius: 18, padding: "20px 18px", border: "2px solid #09fe94", animation: "floatPrize 3s ease-in-out infinite" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 28, animation: "starSpin 4s linear infinite", display: "inline-block" }}>⭐</span>
              <div>
                <p style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, color: "#09fe94", lineHeight: 1.1 }}>Reachr Team</p>
                <p style={{ fontSize: 11, color: "#a09b8f" }}>1 helt år — gratis</p>
              </div>
            </div>
            <div style={{ height: 1, background: "#2a2a2a", marginBottom: 12 }} />
            {["250 000+ bedrifter å søke i","AI-genererte e-poster & SMS","Delt CRM-pipeline for hele teamet","Automatiske oppfølgingsvarsler","2–5 brukere inkludert"].map((feat, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <span style={{ color: "#09fe94", fontSize: 11, fontWeight: 800 }}>✓</span>
                <p style={{ fontSize: 11, color: "#f2efe3", lineHeight: 1.4 }}>{feat}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {slide.type === "giveaway-step" && (
        <div className="flex-1 flex flex-col justify-center relative z-10">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 36, height: 36, borderRadius: 99, background: "#09fe94", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "pulseBadge 1.6s ease-in-out infinite" }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: "#171717" }}>{slide.num}</span>
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#a09b8f", letterSpacing: "0.08em", textTransform: "uppercase" }}>Steg {slide.num} av 3</p>
          </div>
          <div style={{ fontSize: 50, marginBottom: 14, animation: "floatPrize 2.5s ease-in-out infinite" }}>{slide.emoji}</div>
          <p className="font-sans font-black text-[#171717] leading-[0.95] tracking-[-2px] mb-4" style={{ fontSize: 52 }}>{slide.action}</p>
          <div style={{ background: "#faf8f2", border: "2px solid #09fe9455", borderRadius: 14, padding: "14px 16px", animation: "glowPulse 2.5s ease-in-out infinite" }}>
            <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.6 }}>{slide.detail}</p>
          </div>
        </div>
      )}

      {slide.type === "giveaway-winner" && (
        <div className="flex-1 flex flex-col justify-center relative z-10">
          <div style={{ fontSize: 52, textAlign: "center", marginBottom: 14, animation: "floatPrize 2s ease-in-out infinite" }}>🏆</div>
          <p className="font-sans font-black text-center leading-[0.92] tracking-[-2.5px]" style={{ fontSize: 50, animation: "slideUp 0.6s ease both" }}>
            Trekker<br />
            <span style={{ color: "#09fe94" }}>vinner</span><br />
            snart!
          </p>
          <div style={{ height: 2, background: "#d8d3c5", margin: "18px 0" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[{ icon: "❤️", text: "Følg oss" }, { icon: "💬", text: "Kommenter teamet ditt" }, { icon: "📤", text: "Del med minst 1 person" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "#faf8f2", border: "1.5px solid #d8d3c5", borderRadius: 10, padding: "10px 12px" }}>
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#171717" }}>{item.text}</p>
                <div style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: 99, background: "#09fe94", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 8, fontWeight: 900, color: "#171717" }}>✓</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, background: "#ff470a", borderRadius: 12, padding: "11px 14px", textAlign: "center", animation: "pulseBadge 1.5s ease-in-out infinite" }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Lykke til! 🍀 Del med noen som fortjener det!</p>
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
  const [isRecordingLive, setIsRecordingLive] = useState(false);
  const [liveProgress, setLiveProgress] = useState<{
    slide: number; total: number;
    phase: "capture" | "encode";
    frame: number; frames: number;
  } | null>(null);
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

  // ── LIVE PHOTO RECORDING ────────────────────────────────────────────────────
  // Two-phase per slide:
  //   Phase 1 — CAPTURE: sample the VISIBLE on-screen slide via html-to-image
  //             every ~220ms (animasjoner kjører alltid på synlig element).
  //             Vi samler N PNG-blobs som "frames".
  //   Phase 2 — ENCODE: play frames tilbake på et offscreen canvas ved riktig
  //             fps mens MediaRecorder tar opp → korrekt video-lengde & fps.
  const downloadLivePhotos = async () => {
    const sourceEl = canvasRef.current; // visible on-screen element — animations always run
    if (!sourceEl) return;

    if (typeof window === "undefined" || !window.MediaRecorder) {
      toast.error("Nettleseren støtter ikke video-opptak. Bruk Chrome eller Edge.");
      return;
    }

    const OUTPUT_FPS    = 15;          // output video fps
    const NUM_FRAMES    = 30;          // frames to capture per slide (= 2 sec @ 15fps)
    const CAPTURE_INTERVAL = 220;      // ms between html-to-image captures
    const W = 405, H = 720;

    const mimeType = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"]
      .find(m => MediaRecorder.isTypeSupported(m)) ?? "video/webm";

    setIsRecordingLive(true);
    const zip = new JSZip();

    try {
      for (let i = 0; i < series.slides.length; i++) {
        setSlideIdx(i);
        // Let React render + CSS animations start before capturing
        await new Promise(r => setTimeout(r, 600));

        // ── Phase 1: Capture frames ──────────────────────────────────────────
        const frames: ImageBitmap[] = [];
        for (let f = 0; f < NUM_FRAMES; f++) {
          setLiveProgress({ slide: i + 1, total: series.slides.length, phase: "capture", frame: f + 1, frames: NUM_FRAMES });
          try {
            const blob = await htmlToImage.toBlob(sourceEl, {
              pixelRatio: 1,
              cacheBust: true,
              // Strip visual chrome so output is clean 405×720
              style: { borderRadius: "0", border: "none", boxShadow: "none" },
            });
            if (blob && blob.size > 2000) {
              frames.push(await createImageBitmap(blob));
            }
          } catch (e) {
            console.warn(`Slide ${i + 1} frame ${f + 1} capture error:`, e);
          }
          await new Promise(r => setTimeout(r, CAPTURE_INTERVAL));
        }

        if (frames.length === 0) {
          toast.error(`Slide ${i + 1}: Ingen frames fanget — hopper over.`);
          continue;
        }

        // ── Phase 2: Encode captured frames → WebM at OUTPUT_FPS ─────────────
        const offCanvas = document.createElement("canvas");
        offCanvas.width  = W;
        offCanvas.height = H;
        const ctx    = offCanvas.getContext("2d")!;
        const stream = offCanvas.captureStream(OUTPUT_FPS);
        const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4_000_000 });
        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.start();

        for (let f = 0; f < frames.length; f++) {
          setLiveProgress({ slide: i + 1, total: series.slides.length, phase: "encode", frame: f + 1, frames: frames.length });
          ctx.drawImage(frames[f], 0, 0, W, H);
          await new Promise(r => setTimeout(r, 1000 / OUTPUT_FPS));
        }

        recorder.stop();
        await new Promise<void>(res => { recorder.onstop = () => res(); });
        stream.getTracks().forEach(t => t.stop());
        frames.forEach(bmp => bmp.close());

        const videoBlob = new Blob(chunks, { type: mimeType });
        zip.file(`slide-${i + 1}-live.webm`, videoBlob);
      }

      toast.info("Pakker ZIP…");
      const content = await zip.generateAsync({ type: "blob" });
      const link    = document.createElement("a");
      link.href     = URL.createObjectURL(content);
      link.download = `reachr-livephotos-${seriesIdx + 1}.zip`;
      link.click();
      toast.success("Live photos lastet ned! Dra .webm-filene rett inn i TikTok slideshow.");
    } catch (err) {
      console.error(err);
      toast.error("Kunne ikke lage live photos.");
    } finally {
      setIsRecordingLive(false);
      setLiveProgress(null);
    }
  };

  const isBusy = isDownloading || isRecordingLive;

  return (
    <div className="min-h-screen bg-[#111] flex flex-col items-center py-12 px-4 select-none font-sans text-white">
      <div className="w-full max-w-2xl flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter">STUDIO V9</h1>
          <p className="text-[10px] font-bold text-[#09fe94] uppercase tracking-widest mt-1">11 Unique Themes Active</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Static PNG ZIP */}
          <button
            onClick={downloadFullSeries}
            disabled={isBusy}
            title="Last ned alle slides som statiske PNG-bilder"
            className="bg-[#09fe94] hover:bg-[#08e685] text-black font-black py-3 px-5 rounded-2xl flex items-center gap-2 text-xs shadow-xl transition-all active:scale-95 disabled:opacity-40"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderDown className="w-4 h-4" />}
            {zipProgress !== null ? `${zipProgress}%` : "PNG ZIP"}
          </button>

          {/* Live Photo WebM ZIP */}
          <button
            onClick={downloadLivePhotos}
            disabled={isBusy}
            title="Ta opp hvert slide som en 3-sekunders video med animasjoner"
            className="relative bg-[#ff470a] hover:bg-[#e03d08] text-white font-black py-3 px-5 rounded-2xl flex items-center gap-2 text-xs shadow-xl transition-all active:scale-95 disabled:opacity-40 overflow-hidden"
          >
            {isRecordingLive && (
              <span className="absolute inset-0 bg-white/10 animate-pulse rounded-2xl" />
            )}
            {isRecordingLive
              ? <Loader2 className="w-4 h-4 animate-spin relative z-10" />
              : <span className="text-sm relative z-10">📸</span>}
            <span className="relative z-10">
              {liveProgress
                ? `Slide ${liveProgress.slide}/${liveProgress.total} — ${liveProgress.phase === "capture" ? "📸" : "🎬"}`
                : "LIVE PHOTOS (WebM)"}
            </span>
          </button>
        </div>
      </div>

      {/* Live recording progress bar */}
      {liveProgress && (
        <div className="w-full max-w-2xl mb-6">
          <div className="flex justify-between text-[10px] font-bold mb-1.5">
            <span className="text-[#ff470a] uppercase tracking-widest">
              Slide {liveProgress.slide}/{liveProgress.total} —{" "}
              {liveProgress.phase === "capture" ? "📸 Fanger animasjon" : "🎬 Koder video"}
            </span>
            <span className="text-white/30">{liveProgress.frame}/{liveProgress.frames} frames</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ff470a] rounded-full transition-all duration-150"
              style={{ width: `${Math.round((liveProgress.frame / liveProgress.frames) * 100)}%` }}
            />
          </div>
          <p className="text-[9px] text-white/20 mt-1 text-center">
            {liveProgress.phase === "capture"
              ? "Animasjonene spilles av live mens frames fanges…"
              : "Spiller frames tilbake til video ved riktig hastighet…"}
          </p>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-5xl px-4">
        {SERIES.map((s, i) => (
          <button key={i} onClick={() => { setSeriesIdx(i); setSlideIdx(0); }} className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all ${i === seriesIdx ? 'bg-[#09fe94] border-[#09fe94] text-black' : 'bg-transparent border-white/10 text-white/40 hover:border-white/30'}`}>
            {s.name}
          </button>
        ))}
      </div>

      <div className="relative">
        {/* Recording indicator ring */}
        {isRecordingLive && (
          <div className="absolute inset-0 rounded-[48px] border-4 border-[#ff470a] animate-pulse z-20 pointer-events-none" />
        )}
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

      {/* Hidden render target — off-screen, no opacity so html-to-image captures correctly */}
      <div style={{ position: "fixed", left: -2000, top: 0, pointerEvents: "none" }}>
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
