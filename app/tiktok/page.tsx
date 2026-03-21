"use client";

import Image from "next/image";
import { useState, useRef, useEffect, Suspense } from "react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { 
  User, Shield, Target, TrendingUp, Search, 
  Layers, Clock, Smile, Rocket, BarChart, 
  Database, Coffee, CheckCircle2, AlertCircle, 
  Download, Image as ImageIcon, MessageSquare, Zap,
  FolderDown, Loader2, Crosshair, BrainCircuit,
  Fingerprint, Compass, Landmark, LayoutDashboard,
  Code, Hexagon, Cpu, Globe, MousePointer2,
  Sparkles, Star
} from "lucide-react";
import * as htmlToImage from "html-to-image";
import JSZip from "jszip";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// UNIQUE THEMED SHELLS
// ─────────────────────────────────────────────────────────────────────────────

function SlideShell({ idx, total, children, theme }: { idx: number; total: number; children: React.ReactNode; theme: string }) {
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

      {/* DYNAMIC SCALE BACKGROUND (ENGAGEMENT) */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 2, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
      >
        <div className={`absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-[100px] ${isDark ? 'bg-[#09fe94]' : 'bg-[#171717]'}`} />
        <div className={`absolute bottom-1/4 -right-20 w-80 h-80 rounded-full blur-[100px] ${isDark ? 'bg-[#09fe94]' : 'bg-[#171717]'}`} />
      </motion.div>

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
// 12 UNIQUE SERIES (STUDIO V9)
// ─────────────────────────────────────────────────────────────────────────────

const SERIES = [
  {
    name: "1. Norge-Spesialisten",
    tag: "#PROSPEKTERING",
    theme: "blueprint",
    slides: [
      { type: "hook", headline: "Norge-Spesialisten.", sub: "Slutt å lete etter nåla i høystakken. Finn de perfekte norske kundene på sekunder." },
      { type: "concept", icon: Landmark, headline: "Brreg-Kraft.", sub: "Vi henter data direkte fra Brønnøysundregistrene. Alltid oppdatert, alltid korrekt." },
      { type: "comparison", title: "Søkemetoder.", left: "Google-søk og gule sider i timer.", right: "NACE-kode og omsetningsfilter i Reachr." },
      { type: "list", title: "Dine Filter:", points: ["Bransje (NACE)", "Ansatte & Omsetning", "Geografi (Fylke/By)"] },
      { type: "stat", number: "1.2M+", label: "Selskaper", sub: "Hele Norges næringsliv rett i lomma di." },
      { type: "cta", headline: "Start søket.", cta: "reachr.no" }
    ]
  },
  {
    name: "2. E-post Maskinen",
    tag: "#AUTOMATISERING",
    theme: "modern",
    slides: [
      { type: "hook", headline: "E-post Maskinen.", sub: "Hvordan sende 100 personlige e-poster uten å skrive et eneste ord." },
      { type: "concept", icon: Globe, headline: "Full Integrasjon.", sub: "Koble til din egen Gmail eller Outlook. E-postene sendes fra DEG, ikke en anonym server." },
      { type: "chat", side: "left", name: "Kunde", text: "Hei! Dette traff utrolig bra. Har du tid til en demo på torsdag?" },
      { type: "stat", number: "X3", label: "Svarrate", sub: "Automatiske sekvenser sørger for at du aldrig glemmer å følge opp." },
      { type: "list", title: "Slik fungerer det:", points: ["Legg lead i sekvens", "AI skriver utkastet", "Reachr sender automatisk"] },
      { type: "cta", headline: "Automatiser nå.", cta: "reachr.no" }
    ]
  },
  {
    name: "3. SMS-Raketten",
    tag: "#SALGS-HACK",
    theme: "tech",
    slides: [
      { type: "hook", headline: "SMS-Raketten.", sub: "98% av SMS blir lest innen 3 minutter. Bruker du det i salget ditt?" },
      { type: "concept", icon: Zap, headline: "AI-Korthet.", sub: "Vår AI lager korte, slagkraftige SMS-er under 160 tegn som faktisk blir besvart." },
      { type: "comparison", title: "Oppfølging", left: "E-post som drukner i innboksen.", right: "Personlig SMS rett på skjermen." },
      { type: "stat", number: "98%", label: "Lese-rate", sub: "Ingen annen kanal slår SMS på oppmerksomhet og fart." },
      { type: "cta", headline: "Send din første.", cta: "reachr.no" }
    ]
  },
  {
    name: "4. Scraperen",
    tag: "#DATA-TREFF",
    theme: "blueprint",
    slides: [
      { type: "hook", headline: "Scraperen.", sub: "Finner du ikke e-posten til beslutningstakeren? Vi gjør det for deg." },
      { type: "concept", icon: Fingerprint, headline: "Deep Search.", sub: "Vi skraper nettet, 1881 og Proff for å finne direkte-numre og e-postadresser." },
      { type: "radar", title: "Enriching...", body: "Vi kobler sammen data fra 5+ kilder for å gi deg full kontaktinfo." },
      { type: "stat", number: "80%", label: "E-post Treff", sub: "Vi finner kontaktinfo de fleste andre verktøy overser." },
      { type: "cta", headline: "Finn kontakten.", cta: "reachr.no" }
    ]
  },
  {
    name: "5. Pipeline-Kontroll",
    tag: "#CRM-TIPS",
    theme: "minimal",
    slides: [
      { type: "hook", headline: "Pipeline-Kontroll.", sub: "Slutt å miste leads i glemte Excel-ark og kaotiske post-it lapper." },
      { type: "concept", icon: LayoutDashboard, headline: "Visuell Oversikt.", sub: "Flytt leads fra 'Ikke kontaktet' til 'Kunde' med en enkel drag-and-drop." },
      { type: "list", title: "Statusene dine:", points: ["Ikke kontaktet", "Booket møte", "Vunnet kunde"] },
      { type: "stat", number: "0", label: "Tapte Leads", sub: "Med innebygde påminnelser faller ingen gjennom sprekkene i hverdagen." },
      { type: "cta", headline: "Få kontroll.", cta: "reachr.no" }
    ]
  },
  {
    name: "6. Møte-Mesteren",
    tag: "#MØTEBOOKING",
    theme: "clean",
    slides: [
      { type: "hook", headline: "Møte-Mesteren.", sub: "Fra booket møte til ferdig transkribert notat på rekordtid." },
      { type: "concept", icon: Crosshair, headline: "Stemme-Notater.", sub: "Snakk til appen etter møtet. Vi transkriberer og lagrer det rett på leadet." },
      { type: "list", title: "Møteflyten:", points: ["Automatisk påminnelse", "Gjennomfør møtet", "Logg notat med stemme"] },
      { type: "stat", number: "1t før", label: "Varsling", sub: "Du og kunden får påminnelse på e-post så ingen glemmer tiden." },
      { type: "cta", headline: "Book mer.", cta: "reachr.no" }
    ]
  },
  {
    name: "7. Extension-Kraft",
    tag: "#SIDEVOGNA",
    theme: "impact",
    slides: [
      { type: "hook", headline: "Extension-Kraft.", sub: "Legg til leads direkte fra LinkedIn eller firmanettsider med ett klikk." },
      { type: "comparison", title: "Arbeidsflyt", left: "Copy-paste mellom 10 faner.", right: "Ett klikk i sidepanelet." },
      { type: "concept", icon: MousePointer2, headline: "Alltid Tilstede.", sub: "Vår browser-extension bor i nettleseren din og er klar når du finner en drømmekunde." },
      { type: "stat", number: "2x", label: "Fart", sub: "Gjør prospekteringen dobbelt så rask med vårt verktøy." },
      { type: "cta", headline: "Installer nå.", cta: "reachr.no" }
    ]
  },
  {
    name: "8. AI-Sekretæren",
    tag: "#REACHR-AI",
    theme: "tech",
    slides: [
      { type: "hook", headline: "AI-Sekretæren.", sub: "Lurer du på hva du skal skrive? La Reachr gjøre jobben for deg." },
      { type: "concept", icon: BrainCircuit, headline: "Reachr AI.", sub: "Vi bruker din 'Sales Pitch' for å skrive e-poster som høres ut som deg." },
      { type: "chat", side: "right", name: "Reachr AI", text: "Jeg har laget 3 varianter av e-posten din. Hvilken vil du sende?" },
      { type: "stat", number: "5 sek", label: "Skrivetid", sub: "Fra blanke ark til ferdig pitch på under fem sekunder." },
      { type: "cta", headline: "Begynn å skrive.", cta: "reachr.no" }
    ]
  },
  {
    name: "9. Team-Vinneren",
    tag: "#TEAM-WORK",
    theme: "modern",
    slides: [
      { type: "hook", headline: "Team-Vinneren.", sub: "Salg er en lagsport. Se hvem som drar lasset denne uken." },
      { type: "concept", icon: User, headline: "Felles Pipeline.", sub: "Del leads og aktiviteter med hele teamet. Maks 5 brukere inkludert." },
      { type: "list", title: "Team-Features:", points: ["Leaderboard", "Delt innboks", "Aktivitetslogg"] },
      { type: "stat", number: "Top 1", label: "Salg", sub: "Konkurrer med kollegaene dine om å booke flest møter hver måned." },
      { type: "cta", headline: "Inviter teamet.", cta: "reachr.no" }
    ]
  },
  {
    name: "10. Full Oversikt",
    tag: "#ANALYSE",
    theme: "impact",
    slides: [
      { type: "hook", headline: "Full Oversikt.", sub: "Hvor stopper salget opp? Finn flaskehalsene med våre rapporter." },
      { type: "concept", icon: BarChart, headline: "Salgstrakt.", sub: "Se nøyaktig hvor mange leads som blir til møter og kunder." },
      { type: "radar", title: "Analyserer...", body: "Vi sporer åpningsrater og klikk på alle e-postene du sender." },
      { type: "stat", number: "Live", label: "Data", sub: "Sanntidsstatistikk på alt salgsarbeidet ditt i én enkel visning." },
      { type: "cta", headline: "Se tallene.", cta: "reachr.no" }
    ]
  },
  {
    name: "11. GIVEAWAY",
    tag: "#WIN-WIN-WIN",
    theme: "modern",
    slides: [
      { type: "hook", headline: "GIVEAWAY!", sub: "Vinn et helt år med Reachr Team for deg og dine kollegaer (verdi 5.988,-)." },
      { type: "concept", icon: Rocket, headline: "Team-Kraft.", sub: "Vi gir bort en full Team-plan som kan brukes av opptil 5 personer i 12 måneder." },
      { type: "list", title: "Hva du får:", points: ["Full tilgang til Brreg-søk", "Reachr AI & SMS", "Delt Pipeline & Analyse"] },
      { type: "list", title: "Slik deltar du:", points: ["1. Lik denne posten.", "2. Kommenter hvem du vil dele premien med.", "3. Del denne med 2 venner."] },
      { type: "cta", headline: "Lykke til!", cta: "reachr.no" }
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

function SlideContent({ slide, idx, total, theme, tag }: { slide: any; idx: number; total: number; theme: string; tag?: string }) {
  const isDark = theme === "impact";
  
  return (
    <SlideShell idx={idx} total={total} theme={theme} key={`${theme}-${idx}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${theme}-${idx}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4 }}
          className="h-full flex flex-col"
        >
          {slide.type === "hook" && (
            <div className="flex-1 flex flex-col justify-center font-sans tracking-tight relative text-left">
              <Sparkles className={`absolute top-0 right-0 w-12 h-12 opacity-20 ${isDark ? 'text-[#09fe94]' : 'text-[#171717]'}`} />
              <Star className={`absolute bottom-10 left-0 w-8 h-8 opacity-10 rotate-12 ${isDark ? 'text-[#09fe94]' : 'text-[#171717]'}`} />
              
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10"
              >
                {tag && (
                  <motion.span 
                    initial={{ x: -10, rotate: -5, opacity: 0 }}
                    animate={{ x: 0, rotate: -2, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`inline-block px-4 py-1.5 rounded-lg text-[11px] font-[1000] uppercase tracking-[0.2em] mb-8 shadow-2xl transform -rotate-2 ${isDark ? 'bg-[#09fe94] text-black shadow-[#09fe94]/20' : 'bg-[#171717] text-white shadow-black/20'}`}
                  >
                    {tag}
                  </motion.span>
                )}
                <h1 className={`text-[56px] font-[1000] leading-[0.8] uppercase italic mb-8 tracking-tighter drop-shadow-2xl ${isDark ? 'text-[#09fe94]' : 'text-[#171717]'}`}>
                  {slide.headline}
                </h1>
                <p className={`text-[14px] font-[800] leading-tight max-w-[95%] uppercase tracking-tight ${isDark ? 'text-white/60' : 'text-[#4a453e]'}`}>
                  {slide.sub}
                </p>
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "80px" }}
                   transition={{ delay: 0.7, duration: 0.8 }}
                   className={`h-2.5 mt-12 rounded-full ${isDark ? 'bg-[#09fe94]' : 'bg-[#171717]'}`}
                />
              </motion.div>
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
                  <motion.div 
                    key={i} 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-2 p-3 rounded-xl border border-[#09fe94] ${isDark ? 'bg-white/5' : 'bg-white shadow-[3px_3px_0px_#171717]'}`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#09fe94] flex items-center justify-center text-[9px] font-black text-black shrink-0">{i + 1}</div>
                    <p className={`text-[10px] font-black uppercase ${isDark ? 'text-white' : 'text-[#171717]'}`}>{p}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          {slide.type === "chat" && (
            <div className="flex-1 flex flex-col justify-center py-2">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-4 rounded-3xl text-[10px] font-bold ${slide.side === "left" ? "bg-[#171717] text-white" : "bg-white text-[#171717]"} border border-[#09fe94] shadow-xl`}
              >
                {slide.text}
              </motion.div>
            </div>
          )}
          {slide.type === "stat" && (
            <div className="flex-1 flex flex-col justify-center bg-white p-5 rounded-2xl border-4 border-[#171717] shadow-[8px_8px_0px_#09fe94]">
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl font-black text-[#171717] leading-none mb-1 tracking-tighter"
              >
                {slide.number}
              </motion.p>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#171717]">{slide.label}</p>
              <p className="text-[10px] font-bold text-[#6b6660] mt-2 leading-tight">{slide.sub}</p>
            </div>
          )}
          {slide.type === "concept" && (
            <div className="flex-1 flex flex-col justify-center text-left">
              <motion.div 
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-12 h-12 bg-[#09fe94] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-[#09fe94]/20"
              >
                {slide.icon && <slide.icon className="w-6 h-6 text-black" />}
              </motion.div>
              <h2 className={`text-2xl font-black uppercase italic mb-2 leading-none tracking-tighter ${isDark ? 'text-white' : 'text-[#171717]'}`}>{slide.headline}</h2>
              <p className={`text-[11px] font-medium leading-relaxed ${isDark ? 'text-white/60' : 'text-[#6b6660]'}`}>{slide.sub}</p>
            </div>
          )}
          {slide.type === "cta" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center relative">
              {tag?.includes("WIN") && (
                <>
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-0 left-0 w-3 h-3 bg-[#09fe94] rounded-full opacity-30" />
                  <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-20 right-10 w-2 h-2 bg-white rotate-45 opacity-20" />
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute bottom-20 left-10">
                    <Sparkles className="w-6 h-6 opacity-20 text-[#09fe94]" />
                  </motion.div>
                  <div className="absolute bottom-40 right-0 w-2 h-5 bg-[#09fe94] opacity-10 -rotate-12" />
                </>
              )}
              
              <motion.h2 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`text-4xl font-black uppercase italic mb-8 p-1 tracking-tighter leading-none ${isDark ? 'text-[#09fe94]' : 'text-[#171717]'}`}
              >
                {slide.headline}
              </motion.h2>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-[#09fe94] text-black py-5 px-10 rounded-2xl font-black text-xl border-b-6 border-emerald-700 shadow-xl"
              >
                {slide.cta}
              </motion.div>
            </div>
          )}

          {/* ── GIVEAWAY SLIDE TYPES ── */}
          {slide.type === "giveaway-hook" && (
            <div className="flex-1 flex flex-col justify-center relative z-10 text-left">
              <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#ff470a", color: "#fff", fontSize: 11, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 99, marginBottom: 18, animation: "pulseBadge 1.4s ease-in-out infinite" }}>
                🎉 GIVEAWAY
              </div>
              <p className="font-sans font-black text-[#171717] leading-[0.88] tracking-[-3px]" style={{ fontSize: 68 }}>Vinn</p>
              <p className="font-sans font-black text-[#09fe94] leading-[0.88] tracking-[-3px]" style={{ fontSize: 68 }}>1 år</p>
              <p className="font-sans font-black text-[#171717] leading-[0.88] tracking-[-3px]" style={{ fontSize: 68 }}>gratis!</p>
              <p className="text-[#6b6660] text-[13px] leading-relaxed mt-4">Hele salgsteamet ditt får ett år med Reachr Team — helt gratis. 🚀</p>
              <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, background: "#171717", borderRadius: 12, padding: "10px 14px", alignSelf: "flex-start", animation: "glowPulse 2s ease-in-out infinite" }}>
                <span style={{ fontSize: 18 }}>🏆</span>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#09fe94" }}>Verdi: over 20 000 kr</p>
              </div>
            </div>
          )}

          {slide.type === "giveaway-prize" && (
            <div className="flex-1 flex flex-col justify-center relative z-10 text-left">
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ff470a", marginBottom: 14 }}>Premien 🎁</p>
              <div style={{ background: "#171717", borderRadius: 18, padding: "20px 18px", border: "2px solid #09fe94", animation: "floatPrize 3s ease-in-out infinite" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 28, animation: "starSpin 4s linear infinite", display: "inline-block" }}>⭐</span>
                  <div>
                    <p style={{ fontFamily: "serif", fontSize: 22, fontWeight: 700, color: "#09fe94", lineHeight: 1.1 }}>Reachr Team</p>
                    <p style={{ fontSize: 11, color: "#a09b8f" }}>1 helt år — gratis</p>
                  </div>
                </div>
                <div style={{ height: 1, background: "#2a2a2a", marginBottom: 12 }} />
                {["250 000+ bedrifter", "AI-genererte e-poster", "Delt CRM-pipeline", "Automatiske varsler", "Maks 5 brukere"].map((feat, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                    <span style={{ color: "#09fe94", fontSize: 11, fontWeight: 800 }}>✓</span>
                    <p style={{ fontSize: 11, color: "#f2efe3", lineHeight: 1.4 }}>{feat}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === "giveaway-step" && (
            <div className="flex-1 flex flex-col justify-center relative z-10 text-left">
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
            <div className="flex-1 flex flex-col justify-center relative z-10 text-center">
              <div style={{ fontSize: 52, textAlign: "center", marginBottom: 14, animation: "floatPrize 2s ease-in-out infinite" }}>🏆</div>
              <p className="font-sans font-black text-center leading-[0.92] tracking-[-2.5px]" style={{ fontSize: 50 }}>
                Trekker<br />
                <span style={{ color: "#09fe94" }}>vinner</span><br />
                snart!
              </p>
              <div style={{ height: 2, background: "#d8d3c5", margin: "18px 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[{ icon: "❤️", text: "Følg oss" }, { icon: "💬", text: "Kommenter teamet ditt" }, { icon: "📤", text: "Del med minst 1 person" }].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "#faf8f2", border: "1.5px solid #d8d3c5", borderRadius: 10, padding: "10px 12px", textAlign: "left" }}>
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#171717" }}>{item.text}</p>
                    <div style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: 99, background: "#09fe94", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 8, fontWeight: 900, color: "#171717" }}>✓</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, background: "#ff470a", borderRadius: 12, padding: "11px 14px", textAlign: "center", animation: "pulseBadge 1.5s ease-in-out infinite" }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Lykke til! 🍀</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </SlideShell>
  );
}

function TiktokContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [seriesIdx, setSeriesIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [zipProgress, setZipProgress] = useState<number | null>(null);
  const [isRecordingLive, setIsRecordingLive] = useState(false);
  const [liveProgress, setLiveProgress] = useState<{
    slide: number; total: number;
    phase: "capture" | "encode";
    frame: number; frames: number;
  } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const hiddenCanvasRef = useRef<HTMLDivElement>(null);

  // TikTok Auth State
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const series = SERIES[seriesIdx];
  const total = series.slides.length;

  useEffect(() => {
    setSlideIdx(0);
  }, [seriesIdx]);

  useEffect(() => {
    const fetchTiktokStatus = async () => {
      try {
        const response = await fetch("/api/tiktok/me");
        const data = await response.json();
        if (data.connected) {
          setIsConnected(true);
          setUserName(data.name);
          setUserAvatar(data.avatar);
        }
      } catch (e) {
        console.error("Failed to check TikTok status:", e);
      }
    };
    
    fetchTiktokStatus();
  }, [searchParams]);

  useEffect(() => {
    // Confetti ONLY on last slide of GIVEAWAY
    if (series.name.includes("GIVEAWAY") && slideIdx === total - 1) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.8 },
        colors: ['#09fe94', '#ffffff', '#000000']
      });
    }
  }, [slideIdx, series.name, total]);

  const connectTiktok = () => {
    window.location.href = "/api/tiktok/auth";
  };

  const publishToTiktok = async () => {
    if (!hiddenCanvasRef.current) return;
    setIsPublishing(true);
    const formData = new FormData();
    
    try {
      toast.info("Gjør klar slides for publisering...");
      
      for (let i = 0; i < series.slides.length; i++) {
        setSlideIdx(i); 
        await new Promise(r => setTimeout(r, 400)); // Increased delay for stability

        const dataUrl = await htmlToImage.toPng(hiddenCanvasRef.current, { pixelRatio: 2, quality: 0.8 });
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        formData.append(`slide_${i}`, blob, `slide_${i}.png`);
      }

      toast.info("Laster opp til TikTok...");
      const response = await fetch("/api/tiktok/publish", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message || "Slideshow er nå hos TikTok! Åpne appen din for å legge på musikk og publisere.");
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
      } else {
        toast.error(result.error || "Publisering feilet.");
      }
    } catch (err: any) {
      toast.error("Klarte ikke publisere: " + err.message);
    } finally {
      setIsPublishing(false);
    }
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
        await new Promise(r => setTimeout(r, 300));

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
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
    } catch (err) { toast.error("Klarte ikke generere mappe."); }
    finally {
      setIsDownloading(false);
      setZipProgress(null);
    }
  };

  const downloadLivePhotos = async () => {
    const sourceEl = canvasRef.current; 
    if (!sourceEl) return;

    if (typeof window === "undefined" || !window.MediaRecorder) {
      toast.error("Nettleseren støtter ikke video-opptak. Bruk Chrome eller Edge.");
      return;
    }

    const OUTPUT_FPS    = 15;          
    const NUM_FRAMES    = 30;          
    const CAPTURE_INTERVAL = 220;      
    const W = 405, H = 720;

    const mimeType = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"]
      .find(m => MediaRecorder.isTypeSupported(m)) ?? "video/webm";

    setIsRecordingLive(true);
    const zip = new JSZip();

    try {
      for (let i = 0; i < series.slides.length; i++) {
        setSlideIdx(i);
        await new Promise(r => setTimeout(r, 600));

        const frames: ImageBitmap[] = [];
        for (let f = 0; f < NUM_FRAMES; f++) {
          setLiveProgress({ slide: i + 1, total: series.slides.length, phase: "capture", frame: f + 1, frames: NUM_FRAMES });
          try {
            const blob = await htmlToImage.toBlob(sourceEl, {
              pixelRatio: 1,
              cacheBust: true,
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

        if (frames.length === 0) continue;

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
      toast.success("Live photos lastet ned!");
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
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between mb-8 gap-6 bg-white/5 p-6 rounded-[32px] border border-white/10"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <Rocket className="w-6 h-6 text-[#09fe94]" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter">STUDIO V9</h1>
            <p className="text-[10px] font-bold text-[#09fe94] uppercase tracking-widest mt-1">TikTok Automation Active</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-3 bg-black/40 p-2 pr-4 rounded-2xl border border-[#09fe94]/30">
              {userAvatar ? (
                <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-xl" />
              ) : (
                <div className="w-10 h-10 bg-[#09fe94] rounded-xl flex items-center justify-center text-black font-black">
                  {userName?.charAt(0) || "T"}
                </div>
              )}
              <div>
                <p className="text-[10px] font-black uppercase text-[#09fe94]">Tilkoblet</p>
                <p className="text-xs font-bold leading-none">{userName || "TikTok Bruker"}</p>
              </div>
            </div>
          ) : (
            <button 
              onClick={connectTiktok}
              className="bg-white hover:bg-white/90 text-black font-black py-4 px-6 rounded-2xl flex items-center gap-2 text-xs transition-all active:scale-95"
            >
              <Smile className="w-4 h-4" />
              KOBLE TIL TIKTOK
            </button>
          )}

          <button 
            onClick={isConnected ? publishToTiktok : connectTiktok} 
            disabled={isPublishing || isBusy} 
            className="bg-[#fe2c55] hover:bg-[#ef2950] text-white font-black py-4 px-6 rounded-2xl flex items-center gap-2 text-xs shadow-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            PUBLISER
          </button>
          
          <button 
            onClick={downloadFullSeries} 
            disabled={isBusy} 
            className="bg-[#09fe94] hover:bg-[#08e685] text-black font-black py-4 px-6 rounded-2xl flex items-center gap-2 text-xs shadow-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderDown className="w-4 h-4" />}
            {zipProgress !== null ? `${zipProgress}%` : "PNG ZIP"}
          </button>

          <button
            onClick={downloadLivePhotos}
            disabled={isBusy}
            className="relative bg-[#ff470a] hover:bg-[#e03d08] text-white font-black py-4 px-6 rounded-2xl flex items-center gap-2 text-xs shadow-xl transition-all active:scale-95 disabled:opacity-50 overflow-hidden"
          >
            {isRecordingLive && <span className="absolute inset-0 bg-white/10 animate-pulse rounded-2xl" />}
            {isRecordingLive ? <Loader2 className="w-4 h-4 animate-spin relative z-10" /> : <span className="text-sm relative z-10">📸</span>}
            <span className="relative z-10">LIVE PHOTOS</span>
          </button>
        </div>
      </motion.div>

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
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-5xl px-4 text-left">
        {SERIES.map((s, i) => (
          <motion.button 
            key={i} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setSeriesIdx(i); setSlideIdx(0); }} 
            className={`px-4 py-3 rounded-xl text-[10px] font-black border transition-all flex flex-col items-center gap-0.5 ${i === seriesIdx ? 'bg-[#09fe94] border-[#09fe94] text-black shadow-lg shadow-[#09fe94]/20' : 'bg-transparent border-white/10 text-white/40 hover:border-white/30'}`}
          >
            <span className="opacity-40 text-[7px] tracking-widest">{s.tag || "#GENERAL"}</span>
            {s.name}
          </motion.button>
        ))}
      </div>

      <div className="relative group">
        {isRecordingLive && (
          <div className="absolute inset-0 rounded-[48px] border-4 border-[#ff470a] animate-pulse z-20 pointer-events-none" />
        )}
        <motion.div 
          key={seriesIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          ref={canvasRef} 
          className="w-[405px] h-[720px] rounded-[48px] overflow-hidden shadow-2xl bg-[#f2efe3] border-4 border-white/10"
        >
          <SlideContent slide={series.slides[slideIdx]} idx={slideIdx} total={total} theme={series.theme} tag={series.tag} />
        </motion.div>
        
        <button onClick={() => setSlideIdx(i => Math.max(0, i-1))} className="absolute top-1/2 -left-20 transform -translate-y-1/2 text-white/20 hover:text-white transition-all p-4 text-4xl font-black">←</button>
        <button onClick={() => setSlideIdx(i => Math.min(total-1, i+1))} className="absolute top-1/2 -right-20 transform -translate-y-1/2 text-white/20 hover:text-white transition-all p-4 text-4xl font-black">→</button>
      </div>

      <div className="flex gap-2 mt-8">
        {series.slides.map((_, i) => (
          <motion.div 
            key={i} 
            animate={{ width: i === slideIdx ? 40 : 8, opacity: i === slideIdx ? 1 : 0.2 }}
            className={`h-2 rounded-full bg-[#09fe94]`} 
          />
        ))}
      </div>

      {/* Hidden render target — off-screen for PNG exports & Publishing */}
      <div style={{ position: "fixed", left: -2000, top: 0, pointerEvents: "none" }}>
        <div ref={hiddenCanvasRef} className="w-[405px] h-[720px]">
          <SlideContent slide={series.slides[slideIdx]} idx={slideIdx} total={total} theme={series.theme} tag={series.tag} />
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
