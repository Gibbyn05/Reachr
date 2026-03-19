"use client";

import Image from "next/image";
import { useState, useRef, useEffect, Suspense } from "react";
import React from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { TikTokIcon } from "@/components/ui/tiktok-icon";
import { Loader2, CheckCircle2, Share2, GalleryThumbnails, Zap } from "lucide-react";
import * as htmlToImage from "html-to-image";

// ─────────────────────────────────────────────────────────────────────────────
// STIL 1: "CLASSIC LIGHT" (Original Cream Style)
// ─────────────────────────────────────────────────────────────────────────────

function LightSlideShell({ idx, total, children, showGuide }: { idx: number; total: number; children: React.ReactNode; showGuide: boolean }) {
  return (
    <div className="absolute inset-0 select-none" style={{ background: "#f2efe3" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 0%, #e8e4d800 0%, #ede9da60 100%)" }} />
      <div className="absolute" style={{ top: 80, left: 28 }}>
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Reachr" width={28} height={28} />
          <span style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 19, fontWeight: 700, fontStyle: "italic", color: "#171717" }}>Reachr</span>
        </div>
      </div>
      <div className="absolute flex items-center gap-1.5" style={{ top: 88, right: 92 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: i === idx ? 18 : 5, height: 5, borderRadius: 3, background: i === idx ? "#09fe94" : "#d8d3c5", transition: "width 0.25s" }} />
        ))}
      </div>
      <div className="absolute flex flex-col" style={{ top: 156, left: 28, right: 92, bottom: 268 }}>
        {children}
      </div>
      <div className="absolute" style={{ bottom: 232, left: 28, right: 92 }}>
        <div style={{ height: 1, background: "#d8d3c5", marginBottom: 10 }} />
        <p style={{ fontSize: 10, color: "#a09b8f", letterSpacing: "0.06em" }}>reachr.no</p>
      </div>
      {showGuide && <SafeZoneOverlay />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STIL 2: "DARK CYBER" (New Modern Dark Style)
// ─────────────────────────────────────────────────────────────────────────────

function DarkSlideShell({ idx, total, children, showGuide }: { idx: number; total: number; children: React.ReactNode; showGuide: boolean }) {
  return (
    <div className="absolute inset-0 select-none overflow-hidden" style={{ background: "#0a0a0b" }}>
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-20" style={{ background: "radial-gradient(circle at 80% 20%, #09fe94 0%, transparent 40%)" }} />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#09fe94/30] to-transparent opacity-50" />
      
      {/* Mini Branding */}
      <div className="absolute" style={{ bottom: 245, left: 28 }}>
        <div className="flex items-center gap-1.5 opacity-60">
          <div className="w-4 h-4 rounded-sm bg-[#09fe94] flex items-center justify-center">
            <Zap className="w-3 h-3 text-black" />
          </div>
          <span className="text-[10px] uppercase font-black text-[#09fe94] tracking-widest">Reachr Intel</span>
        </div>
      </div>

      {/* Modern Progress Bar at Bottom */}
      <div className="absolute" style={{ bottom: 230, left: 28, right: 92 }}>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#09fe94] transition-all duration-500 ease-out" 
            style={{ width: `${((idx + 1) / total) * 100}%`, boxShadow: "0 0 10px #09fe94" }} 
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[8px] font-black text-[#09fe94] opacity-50">{String(idx + 1).padStart(2, '0')}</span>
          <span className="text-[8px] font-black text-white/20">{String(total).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="absolute flex flex-col" style={{ top: 120, left: 28, right: 92, bottom: 280 }}>
        {children}
      </div>

      {showGuide && <SafeZoneOverlay />}
    </div>
  );
}

function SafeZoneOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <div className="absolute top-0 bottom-0 right-0" style={{ width: 80, background: "rgba(255,0,0,0.08)", borderLeft: "1px dashed rgba(255,0,0,0.3)" }} />
      <div className="absolute left-0 right-0 bottom-0" style={{ height: 220, background: "rgba(255,0,0,0.08)", borderTop: "1px dashed rgba(255,0,0,0.3)" }} />
      <div className="absolute left-0 right-0 top-0" style={{ height: 60, background: "rgba(255,165,0,0.06)", borderBottom: "1px dashed rgba(255,165,0,0.3)" }} />
      <div className="absolute text-center" style={{ left: 0, right: 80, top: 60, bottom: 220, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 8 }}>
        <span style={{ fontSize: 9, background: "rgba(0,255,0,0.15)", color: "#09fe94", padding: "2px 6px", borderRadius: 4 }}>✓ SAFE ZONE</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA FOR ALL 20 SERIES
// ─────────────────────────────────────────────────────────────────────────────

const seriesData = [
  // LIGHT SERIES (0-9)
  {
    id: 0, style: "light", name: "Gull i innboksen", slides: [
      { type: "hook", label: "Salgs-tips 💎", headline: "Gull\ni din\ninnboks.", sub: "Slutt å lete etter nåla i høystakken. Begynn å plukke gulleplene." },
      { type: "stat", number: "4.2x", claim: "høyere konvertering", context: "med varme leads fra Reachr sammenlignet med kalde lister." },
      { type: "sign", num: "01", sign: "Kvalitet over kvantitet.", detail: "Det er bedre å sende 5 meldinger som treffer, enn 50 som slettes." },
      { type: "stat", number: "80 %", claim: "av salg krever 5+ oppfølginger", context: "Reachr automatiserer påminnelser slik at du aldri glemmer en deal." },
      { type: "cta", headline: "Hent\ngullet.", cta: "Se demo på reachr.no" },
    ]
  },
  {
    id: 1, style: "light", name: "Slutt med kald-ringing", slides: [
      { type: "hook", headline: "Kald-ringing\ner\ndødt.", sub: "Ingen tar telefonen fra ukjente nummer lenger. Her er hva du gjør i stedet." },
      { type: "sign", num: "❌", sign: "Stopp kasting av tid.", detail: "Manuelle lister er utdaterte før du rekker å ringe dem." },
      { type: "sign", num: "✅", sign: "Bruk sosiale signaler.", detail: "Reachr overvåker markedet for deg 24/7." },
      { type: "stat", number: "6ms", claim: "pr research-søk", context: "Reachr henter info raskere enn du klarer å blunke." },
      { type: "cta", headline: "Ring\nsmartere.", cta: "Prøv Reachr gratis →" },
    ]
  },
  {
    id: 2, style: "light", name: "De beste vinner", slides: [
      { type: "hook", headline: "Hvorfor\nde beste\nvinner.", sub: "Det handler ikke om flaks. Det handler om datadrevet presisjon." },
      { type: "step", time: "9:00", title: "Få listen servert.", body: "Reachr leverer dagens hotteste leads rett i fanget ditt." },
      { type: "step", time: "9:15", title: "Kvalifisér på 1-2-3.", body: "Sjekk regnskap og vekst med ett klikk i samme vindu." },
      { type: "step", time: "9:30", title: "Send første pitch.", body: "Bruk AI til å skrive en unik melding som faktisk blir lest." },
      { type: "cta", headline: "Bli en\nvinner.", cta: "Sjekk reachr.no" },
    ]
  },
  {
    id: 3, style: "light", name: "Salg på autopilot", slides: [
      { type: "hook", label: "Autopilot 🚀", headline: "Salg\npå\nautopilot.", sub: "Når var sist gang du brukte 0 sekunder på research?" },
      { type: "stat", number: "10t", claim: "spart pr uke", context: "for hver selger som bruker automatisert lead-fangst." },
      { type: "sign", num: "TRY", sign: "Gjør som 500+ andre.", detail: "Norske bedrifter bytter til Reachr for å skalere salget." },
      { type: "stat", number: "100 %", claim: "fokus på salg", context: "Slutt med admin-arbeid. Begynn å lukke avtaler." },
      { type: "cta", headline: "Spar\ntid.", cta: "Sjekk reachr.no" },
    ]
  },
  {
    id: 4, style: "light", name: "Tidstyven i salg", slides: [
      { type: "hook", headline: "Den største\ntidstyven\ni salg.", sub: "Det er ikke kaffepausen. Det er manuell copy-paste fra Proff." },
      { type: "sign", num: "STOPP", sign: "Slutt å copy-paste.", detail: "Eksportér leads direkte til din CRM med ett klikk." },
      { type: "stat", number: "1200", claim: "klikk spart daglig", context: "ved å bruke vårt 'ett-klikk-oppslag' i nettleseren." },
      { type: "cta", headline: "Effektiviser.", cta: "reachr.no →" },
    ]
  },
  {
    id: 5, style: "light", name: "Fra 0 til 100 leads", slides: [
      { type: "hook", headline: "Fra 0 til\n100 leads\npå 15 min.", sub: "Høres det ut som magi? Det er bare smart teknologi." },
      { type: "step", time: "Steg 1", title: "Definér din drømmekunde.", body: "Velg bransje, ansatte og omsetning." },
      { type: "step", time: "Steg 2", title: "Filtrér på beslutningstakere.", body: "Snakk med de som faktisk kan si JA." },
      { type: "step", time: "Steg 3", title: "Trykk 'Generer'.", body: "Få listen med e-post og direkte-nummer umiddelbart." },
      { type: "cta", headline: "Få listen.", cta: "reachr.no" },
    ]
  },
  {
    id: 6, style: "light", name: "Fremtidens salg", slides: [
      { type: "hook", label: "Fremtiden ✨", headline: "Fremtidens\nB2B-salg\ner her.", sub: "De som tviholder på gamle metoder vil tape. De som adapterer, vinner." },
      { type: "sign", num: "2026", sign: "AI tar over researchen.", detail: "Bli med på reisen før konkurrentene dine gjør det." },
      { type: "stat", number: "3x", claim: "flere bookede møter", context: "for team som bruker AI til å personalisere outreach." },
      { type: "sign", num: "JOIN", sign: "Bli fremtidens selger.", detail: "Bruk verktøyene som gir deg en urettferdig fordel." },
      { type: "cta", headline: "Bli med.", cta: "Start i dag på reachr.no" },
    ]
  },
  {
    id: 7, style: "light", name: "Research er dødt", slides: [
      { type: "hook", headline: "Manuell\nresearch\ner dødt.", sub: "Verden går for fort til at du kan bruke timer på Google." },
      { type: "stat", number: "95 %", claim: "mindre manuelt arbeid", context: "for team som bytter til Reachr sine automatiserte søk." },
      { type: "sign", num: "DATA", sign: "Sannhet i sanntid.", detail: "Alt fra Brønnøysund, Proff og sosiale medier — på ett sted." },
      { type: "stat", number: "0", claim: "missete muligheter", context: "Få varsel i det sekundet en potensiell kunde melder behov." },
      { type: "cta", headline: "Gå pro.", cta: "reachr.no →" },
    ]
  },
  {
    id: 8, style: "light", name: "Pipeline i lunsjen", slides: [
      { type: "hook", label: "Lynraskt ⚡", headline: "Fyll din\npipeline\ni lunsjen.", sub: "Mens du spiser brødskiva di, kan Reachr bygge hele salgsuken din." },
      { type: "step", time: "Lunch", title: "Klikk på 'Generer'.", body: "Gjør ferdig mandagens møtebooking på minutter." },
      { type: "step", time: "Kaffe", title: "Se over AI-forslagene.", body: "Godkjenn meldingene AI-en har skrevet for deg." },
      { type: "step", time: "Ferdig", title: "Nyt ettermiddagen.", body: "Med mandagen klar kan du slappe helt av resten av helgen." },
      { type: "cta", headline: "Begynn.", cta: "reachr.no" },
    ]
  },
  {
    id: 9, style: "light", name: "Reachr-effekten", slides: [
      { type: "hook", headline: "Reachr-\neffekten\ner her.", sub: "Se hva som skjer med tallene dine når du har de beste dataene." },
      { type: "sign", num: "REACH", sign: "Nå ut til alle.", detail: "Ubegrenset tilgang på ferske norske B2B-leads." },
      { type: "stat", number: "40 %", claim: "økt win-rate", context: "når du snakker med de rette personene til rett tid." },
      { type: "cta", headline: "Se selv.", cta: "Klikk her for reachr.no" },
    ]
  },

  // DARK CYBER SERIES (10-19)
  {
    id: 10, style: "dark", name: "Data Intel 01", slides: [
      { type: "hook", label: "Intel Ops 📡", headline: "Data\nis the new\nGold.", sub: "I mørket av B2B-markedet er data din eneste lommelykt." },
      { type: "stat", number: "100K", claim: "datapunkter analysert", context: "Reachr skanner sanntids-endringer i hele det norske markedet." },
      { type: "sign", num: "SYS", sign: "Systematisk vekst.", detail: "Eliminer gjetting. Begynn å bruke harde fakta." },
      { type: "cta", headline: "Get Intel.", cta: "access@reachr.no" },
    ]
  },
  {
    id: 11, style: "dark", name: "Salg er Sport", slides: [
      { type: "hook", headline: "Salg er\nen nådeløs\nsport.", sub: "Trener du med gårsdagens utstyr, eller dagens teknologi?" },
      { type: "stat", number: "#1", claim: "posisjon i markedet", context: "De som bruker Reachr er alltid 3 skritt foran konkurrentene." },
      { type: "sign", num: "WIN", sign: "Vinn hver dag.", detail: "Salg handler om volum x presisjon. Vi gir deg begge." },
      { type: "cta", headline: "Vinn mer.", cta: "play@reachr.no" },
    ]
  },
  {
    id: 12, style: "dark", name: "Hyper-skalering", slides: [
      { type: "hook", headline: "Hyper-\nskalering\naktivert.", sub: "Skal du vokse 10% eller 1000%? Teknologien setter grensen." },
      { type: "stat", number: "10x", claim: "større pipeline", context: "Uten å ansette en eneste ny selger. Det er Reachr-magi." },
      { type: "sign", num: "GO", sign: "Gjør deg klar.", detail: "Systemet er klart for din vekst. Er du?" },
      { type: "cta", headline: "Skalér nå.", cta: "grow@reachr.no" },
    ]
  },
  {
    id: 13, style: "dark", name: "Next Gen Outreach", slides: [
      { type: "hook", label: "Next Gen 🧬", headline: "Slutt å\nsende\nspam.", sub: "Verden trenger ikke mer støy. Den trenger mer relevans." },
      { type: "step", time: "SCAN", title: "Total analyse.", body: "Vi forstår hvem kunden er før du i det hele tatt ser navnet." },
      { type: "step", time: "PITCH", title: "AI-drevet relevans.", body: "Meldinger så treffsikre at de ikke kan ignoreres." },
      { type: "cta", headline: "Start nå.", cta: "reachr.no" },
    ]
  },
  {
    id: 14, style: "dark", name: "Vinn uken din", slides: [
      { type: "hook", headline: "Vinn\nmandagen.\nVinn uken.", sub: "De fleste selgere bruker mandag på research. Våre brukere bruker den på salg." },
      { type: "stat", number: "08:00", claim: "Full liste klar", context: "Våkne opp til en fersk liste med leads generert mens du sov." },
      { type: "sign", num: "RUN", sign: "Full fart fra start.", detail: "Ikke kast bort dine beste timer på Excel." },
      { type: "cta", headline: "Vinn uka.", cta: "reachr.no" },
    ]
  },
  {
    id: 15, style: "dark", name: "Når andre gir opp", slides: [
      { type: "hook", headline: "Når andre\ngir opp,\nfortsetter vi.", sub: "Resiliens i salg handler om å ha de rette systemene i ryggen." },
      { type: "stat", number: "500+", claim: "aktive bedrifter", context: "Suksess-rater som stiger for hvert år med vårt system." },
      { type: "sign", num: "HARD", sign: "Jobb smartere.", detail: "Hardt arbeid er bra. Smart arbeid er bedre." },
      { type: "cta", headline: "Prøv oss.", cta: "reachr.no" },
    ]
  },
  {
    id: 16, style: "dark", name: "Full kontroll", slides: [
      { type: "hook", headline: "Følelsen\nav total\nkontroll.", sub: "Ingen "ghosting". Ingen ubesvarte meldinger. Bare ren fremdrift." },
      { type: "step", time: "MAP", title: "Kartlegg markedet.", body: "Se hele ditt potensiale på en skjerm." },
      { type: "step", time: "WIN", title: "Lukk hver deal.", body: "Følg opp med laser-presisjon hver eneste gang." },
      { type: "cta", headline: "Få kontroll.", cta: "reachr.no" },
    ]
  },
  {
    id: 17, style: "dark", name: "Mer med mindre", slides: [
      { type: "hook", headline: "Gjør mer\nmed mye\nmindre.", sub: "Lean salg er fremtiden. Fjern fettet, behold musklene." },
      { type: "stat", number: "50 %", claim: "lavere kost pr lead", context: "Fordi du ikke kaster bort tid på leads som aldri vil kjøpe." },
      { type: "sign", num: "LEAN", sign: "Vær effektiv.", detail: "Reachr er din digitale salgs-assistent som aldri sover." },
      { type: "cta", headline: "Bli lean.", cta: "reachr.no" },
    ]
  },
  {
    id: 18, style: "dark", name: "B2B Intelligens", slides: [
      { type: "hook", headline: "Ekte\nB2B\nIntelligens.", sub: "Det er ikke bare et verktøy. Det er hjernen i salgsavdelingen din." },
      { type: "stat", number: "99.9 %", claim: "datakvalitet", context: "Vi dobbeltsjekker hver kilde slik at du har de riktige tallene." },
      { type: "sign", num: "CORE", sign: "Kjerne-innsikt.", detail: "Se bak tallene. Forstå hvem kunden egentlig er." },
      { type: "cta", headline: "Se innsikt.", cta: "reachr.no" },
    ]
  },
  {
    id: 19, style: "dark", name: "Din Salgsassistent", slides: [
      { type: "hook", label: "Agent 01 🤖", headline: "Din nye\ndigitale\nassistent.", sub: "Som å ha 10 researchere i sving, 24 timer i døgnet." },
      { type: "stat", number: "24/7", claim: "Overvåking", context: "Vi sier ifra når drømmekunden din gjør et trekk." },
      { type: "sign", num: "AI", sign: "Alltid pålogget.", detail: "La teknologien gjøre drittjobben, så du kan selge." },
      { type: "cta", headline: "Ansatt oss.", cta: "reachr.no" },
    ]
  }
];

function SlideContent({ slide, idx, total, showGuide, style }: { slide: any; idx: number; total: number; showGuide: boolean; style: string }) {
  const Shell = style === "dark" ? DarkSlideShell : LightSlideShell;
  const headlineColor = style === "dark" ? "#fff" : "#171717";
  const subColor = style === "dark" ? "rgba(255,255,255,0.6)" : "#6b6660";
  const accentColor = "#09fe94";
  const statColor = style === "dark" ? "#09fe94" : "#ff470a";

  return (
    <Shell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.label && (
            <div style={{ 
              display: "inline-flex", alignSelf: "flex-start", 
              background: style === "dark" ? "rgba(9,254,148,0.1)" : "#171717", 
              color: style === "dark" ? "#09fe94" : "#09fe94", 
              fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20,
              border: style === "dark" ? "1px solid rgba(9,254,148,0.3)" : "none"
            }}>{slide.label}</div>
          )}
          <p style={{ 
            fontFamily: style === "dark" ? "Inter, sans-serif" : "Inter, sans-serif", 
            fontSize: 64, fontWeight: 900, color: headlineColor, lineHeight: 0.9, letterSpacing: "-3px", whiteSpace: "pre-line" 
          }}>{slide.headline}</p>
          <p style={{ color: subColor, fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "stat" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ 
            fontFamily: "Inter, sans-serif", fontSize: 72, fontWeight: 900, color: statColor, lineHeight: 1,
            textShadow: style === "dark" ? "0 0 20px rgba(9,254,148,0.3)" : "none"
          }}>{slide.number}</p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 700, color: headlineColor, marginTop: 8 }}>{slide.claim}</p>
          <p style={{ color: subColor, fontSize: 13, marginTop: 16 }}>{slide.context}</p>
        </div>
      )}
      {slide.type === "sign" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: style === "dark" ? "#09fe94" : "#a09b8f" }}>{slide.num}</p>
          <p style={{ 
            fontFamily: "Inter, sans-serif", fontSize: 38, fontWeight: 900, color: statColor, lineHeight: 1 
          }}>{slide.sign}</p>
          <p style={{ color: subColor, fontSize: 13, marginTop: 20 }}>{slide.detail}</p>
        </div>
      )}
      {slide.type === "step" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: style === "dark" ? "#09fe94" : "#ffad0a" }}>{slide.time}</p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 46, fontWeight: 900, lineHeight: 1, color: headlineColor }}>{slide.title}</p>
          <p style={{ color: subColor, fontSize: 13, marginTop: 16 }}>{slide.body}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 58, fontWeight: 900, color: headlineColor, lineHeight: 0.93 }}>{slide.headline}</p>
          <div style={{ 
            marginTop: 28, background: style === "dark" ? "#09fe94" : "#09fe94", 
            borderRadius: 14, padding: "14px 24px", fontWeight: 800, color: "#171717",
            boxShadow: style === "dark" ? "0 0 30px rgba(9,254,148,0.4)" : "none",
            textAlign: "center"
          }}>{slide.cta}</div>
        </div>
      )}
    </Shell>
  );
}

function TiktokContent() {
  const searchParams = useSearchParams();
  const [seriesIdx, setSeriesIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [isTiktokConnected, setIsTiktokConnected] = useState(false);
  const [tiktokUser, setTiktokUser] = useState<{ name: string; avatar: string } | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedLink, setPublishedLink] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/tiktok/session");
        const data = await res.json();
        if (data.connected) {
          setIsTiktokConnected(true);
          setTiktokUser(data.user);
        } else if (searchParams.get("tiktok") === "success") {
          setIsTiktokConnected(true);
          setTiktokUser({
            name: searchParams.get("name") || "Tilkoblet bruker",
            avatar: searchParams.get("avatar") || ""
          });
        }
      } catch (e) {
        console.error("Session check failed:", e);
      }
    };
    checkSession();
  }, [searchParams]);

  const series = seriesData[seriesIdx];
  const total = series.slides.length;

  function changeSeries(i: number) {
    setSeriesIdx(i);
    setSlideIdx(0);
  }

  const publishToTikTok = async () => {
    setIsPublishing(true);
    setPublishedLink(null);
    try {
      toast.info("Forbereder slideshow...");
      const formData = new FormData();
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas element not found");

      const initialIdx = slideIdx;
      for (let i = 0; i < total; i++) {
        setSlideIdx(i);
        await new Promise(r => setTimeout(r, 150));
        const blob = await htmlToImage.toBlob(canvas, { pixelRatio: 2, quality: 0.95 });
        if (blob) formData.append(`slide_${i}`, blob, `slide_${i}.png`);
      }
      setSlideIdx(initialIdx);

      const res = await fetch("/api/tiktok/publish", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        toast.success("Publisert!");
        setPublishedLink(data.share_url || "https://tiktok.com");
      } else {
        toast.error(data.error || "Feil.");
      }
    } catch (err) {
      toast.error("Kunne ikke publisere.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 py-12 px-4 bg-[#0a0a0b] font-sans">
      
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between border-b border-white/5 pb-8 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#09fe94] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(9,254,148,0.2)]">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Reachr TikTok</h1>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Slide Generator v2.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {!isTiktokConnected ? (
            <button onClick={() => window.location.href = "/api/tiktok/auth"} className="bg-white text-black font-black py-3 px-6 rounded-2xl text-sm hover:scale-105 transition-transform">
              Koble til TikTok
            </button>
          ) : (
            <div className="flex items-center gap-4">
              {tiktokUser && (
                <div className="flex items-center gap-3 bg-white/5 p-2 pr-4 rounded-2xl border border-white/10">
                  <img src={tiktokUser.avatar} className="w-8 h-8 rounded-full border border-[#09fe94]/50" />
                  <span className="text-xs font-bold text-white uppercase tracking-tighter">{tiktokUser.name}</span>
                </div>
              )}
              <button onClick={publishToTikTok} disabled={isPublishing} className="bg-[#09fe94] text-black font-black py-3 px-8 rounded-2xl text-sm shadow-[0_0_30px_rgba(9,254,148,0.3)] disabled:opacity-50">
                {isPublishing ? "Publiserer..." : "Send til TikTok"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Style Toggle Info */}
      <div className="flex gap-12 mb-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-black text-white/20 uppercase">Stil A: Classic Light</span>
          <div className="flex gap-2">
            {seriesData.filter(s => s.style === "light").map((s, i) => (
              <button key={s.id} onClick={() => changeSeries(s.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${seriesIdx === s.id ? 'bg-[#09fe94] text-black border-[#09fe94]' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-black text-[#09fe94] uppercase">Stil B: Cyber Dark</span>
          <div className="flex gap-2">
            {seriesData.filter(s => s.style === "dark").map((s, i) => (
              <button key={s.id} onClick={() => changeSeries(s.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${seriesIdx === s.id ? 'bg-[#09fe94] text-black border-[#09fe94]' : 'bg-[#09fe94]/10 text-[#09fe94] border-[#09fe94]/20 hover:border-[#09fe94]/50'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview & Controls */}
      <div className="flex flex-col lg:flex-row items-center gap-12 mt-4">
        <div ref={canvasRef} className="relative w-[405px] h-[720px] rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border-8 border-white/5">
          <SlideContent slide={series.slides[slideIdx]} idx={slideIdx} total={total} showGuide={showGuide} style={series.style} />
        </div>

        <div className="flex flex-col gap-8 w-full max-w-sm">
          <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
            <h2 className="text-2xl font-black text-white mb-2">{series.name}</h2>
            <p className="text-white/40 text-sm mb-6 uppercase tracking-widest font-bold">{series.style} mode activated</p>
            
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setSlideIdx(i => Math.max(0, i - 1))} 
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                disabled={slideIdx === 0}
              >
                ←
              </button>
              <div className="flex gap-2">
                {series.slides.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === slideIdx ? 'w-8 bg-[#09fe94]' : 'w-2 bg-white/10'}`} />
                ))}
              </div>
              <button 
                onClick={() => setSlideIdx(i => Math.min(total - 1, i + 1))} 
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                disabled={slideIdx === total - 1}
              >
                →
              </button>
            </div>

            <button onClick={() => setShowGuide(!showGuide)} className="w-full py-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase text-white/30 tracking-widest hover:text-white transition-colors">
              {showGuide ? "Hide Safe Zones" : "Show Safe Zone Overlay"}
            </button>
          </div>

          <div className="bg-[#09fe94]/10 p-6 rounded-[24px] border border-[#09fe94]/20">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#09fe94]" />
              <span className="text-[10px] font-black text-[#09fe94] uppercase tracking-widest">Ready to post</span>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed">Dette slideshowet er optimalisert for TikTok. Pass på at tekst ikke havner i den røde sonen.</p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="w-full max-w-7xl mt-20 pt-20 border-t border-white/5">
        <div className="flex items-center gap-4 mb-12">
          <GalleryThumbnails className="w-8 h-8 text-[#09fe94]" />
          <h3 className="text-4xl font-black text-white tracking-tighter">Slide Library <span className="text-white/20">20 sets</span></h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {seriesData.map((s, idx) => (
            <div key={s.id} onClick={() => changeSeries(s.id)} className={`group relative p-6 rounded-[40px] border transition-all cursor-pointer ${seriesIdx === s.id ? 'bg-[#09fe94]/5 border-[#09fe94]/30' : 'bg-white/2 border-white/5 hover:border-white/20'}`}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-widest p-1 px-2 rounded-md ${s.style === 'dark' ? 'bg-[#09fe94] text-black' : 'bg-white/10 text-white/60'}`}>{s.style}</span>
                  <h4 className="text-xl font-bold text-white mt-2">{s.name}</h4>
                </div>
                <div className="text-4xl font-black text-white/5">#{idx + 1}</div>
              </div>
              <div className="flex gap-4 overflow-hidden mask-fade-right">
                {s.slides.slice(0, 4).map((_, i) => (
                  <div key={i} className={`flex-shrink-0 w-24 h-40 rounded-xl border-4 ${s.style === 'dark' ? 'bg-[#0a0a0b] border-white/5' : 'bg-[#f2efe3] border-black/5'} opacity-40 group-hover:opacity-100 transition-opacity`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TiktokPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-[#09fe94] font-black tracking-widest">INITIALIZING...</div>}>
      <TiktokContent />
    </Suspense>
  );
}
