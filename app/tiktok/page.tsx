"use client";

import Image from "next/image";
import { useState, useRef, useEffect, Suspense } from "react";
import React from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { TikTokIcon } from "@/components/ui/tiktok-icon";
import { Loader2, CheckCircle2, Share2, GalleryThumbnails } from "lucide-react";
import * as htmlToImage from "html-to-image";

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

function SlideShell({ idx, total, children, showGuide }: { idx: number; total: number; children: React.ReactNode; showGuide: boolean }) {
  return (
    <div className="absolute inset-0 select-none" style={{ background: "#f2efe3" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 0%, #e8e4d800 0%, #ede9da60 100%)" }} />

      {/* LOGO */}
      <div className="absolute" style={{ top: 80, left: 28 }}>
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Reachr" width={28} height={28} style={{ display: "block" }} />
          <span style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 19, fontWeight: 700, fontStyle: "italic", color: "#171717", lineHeight: 1 }}>Reachr</span>
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute flex items-center gap-1.5" style={{ top: 88, right: 92 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: i === idx ? 18 : 5, height: 5, borderRadius: 3, background: i === idx ? "#09fe94" : "#d8d3c5", transition: "width 0.25s" }} />
        ))}
      </div>

      {/* CONTENT - Justert padding til høyre for å sikre plass for TikTok-knapper */}
      <div className="absolute flex flex-col" style={{ top: 156, left: 28, right: 100, bottom: 268 }}>
        {children}
      </div>

      {/* BOTTOM STRIP */}
      <div className="absolute" style={{ bottom: 232, left: 28, right: 92 }}>
        <div style={{ height: 1, background: "#d8d3c5", marginBottom: 10 }} />
        <p style={{ fontSize: 10, color: "#a09b8f", letterSpacing: "0.06em" }}>reachr.no</p>
      </div>

      {showGuide && <SafeZoneOverlay />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT SERIES (TOTAL 20 UNIVERES)
// ─────────────────────────────────────────────────────────────────────────────

const s1Slides = [
  { type: "hook" as const, label: "Salgs-tips 💎", headline: "Gull\ni din\ninnboks.", sub: "Slutt å lete etter nåla i høystakken. Begynn å plukke gulleplene." },
  { type: "stat" as const, number: "4.2x", claim: "høyere konvertering", context: "med varme leads fra Reachr sammenlignet med kalde lister." },
  { type: "sign" as const, num: "01", sign: "Kvalitet over kvantitet.", detail: "Det er bedre å sende 5 meldinger som treffer, enn 50 som slettes." },
  { type: "stat" as const, number: "80 %", claim: "av salg krever 5+ oppfølginger", context: "Reachr automatiserer påminnelser slik at du aldri glemmer en deal." },
  { type: "cta" as const, headline: "Hent\ngullet.", cta: "Se demo på reachr.no" },
];

const s2Slides = [
  { type: "hook" as const, headline: "Kald-ringing\ner\ndødt.", sub: "Ingen tar telefonen fra ukjente nummer lenger. Her er hva du gjør i stedet." },
  { type: "sign" as const, num: "❌", sign: "Stopp kasting av tid.", detail: "Manuelle lister er utdaterte før du rekker å ringe dem." },
  { type: "sign" as const, num: "✅", sign: "Bruk sosiale signaler.", detail: "Reachr overvåker markedet for deg 24/7." },
  { type: "stat" as const, number: "6ms", claim: "pr research-søk", context: "Reachr henter info raskere enn du klarer å blunke." },
  { type: "cta" as const, headline: "Ring\nsmartere.", cta: "Prøv Reachr gratis →" },
];

const s3Slides = [
  { type: "hook" as const, headline: "Hvorfor\nde beste\nvinner.", sub: "Det handler ikke om flaks. Det handler om datadrevet presisjon." },
  { type: "step" as const, time: "9:00", title: "Få listen servert.", body: "Reachr leverer dagens hotteste leads rett i fanget ditt." },
  { type: "step" as const, time: "9:15", title: "Kvalifiser på 1-2-3.", body: "Sjekk regnskap og vekst med ett klikk i samme vindu." },
  { type: "step" as const, time: "9:30", title: "Send første pitch.", body: "Bruk AI til å skrive en unik melding som faktisk blir lest." },
  { type: "cta" as const, headline: "Bli en\nvinner.", cta: "Sjekk reachr.no" },
];

const s4Slides = [
  { type: "hook" as const, label: "Autopilot 🚀", headline: "Salg\npå\nautopilot.", sub: "Når var sist gang du brukte 0 sekunder på research?" },
  { type: "stat" as const, number: "10t", claim: "spart pr uke", context: "for hver selger som bruker automatisert lead-fangst." },
  { type: "sign" as const, num: "TRY", sign: "Gjør som 500+ andre.", detail: "Norske bedrifter bytter til Reachr for å skalere salget." },
  { type: "stat" as const, number: "100 %", claim: "fokus på salg", context: "Slutt med admin-arbeid. Begynn å lukke avtaler." },
  { type: "cta" as const, headline: "Spar\ntid.", cta: "Sjekk reachr.no" },
];

const s5Slides = [
  { type: "hook" as const, headline: "Den største\ntidstyven\ni salg.", sub: "Det er ikke kaffepausen. Det er manuell copy-paste fra Proff." },
  { type: "sign" as const, num: "STOPP", sign: "Slutt å copy-paste.", detail: "Eksportér leads direkte til din CRM med ett klikk." },
  { type: "stat" as const, number: "1200", claim: "klikk spart daglig", context: "ved å bruke vårt 'ett-klikk-oppslag' i nettleseren." },
  { type: "cta" as const, headline: "Effektiviser.", cta: "reachr.no →" },
];

const s6Slides = [
  { type: "hook" as const, headline: "Fra 0 til\n100 leads\npå 15 min.", sub: "Høres det ut som magi? Det er bare smart teknologi." },
  { type: "step" as const, time: "Steg 1", title: "Definér din drømmekunde.", body: "Velg bransje, ansatte og omsetning." },
  { type: "step" as const, time: "Steg 2", title: "Filtrér på beslutning.", body: "Snakk med de som faktisk kan si JA." },
  { type: "step" as const, time: "Steg 3", title: "Trykk 'Generer'.", body: "Få listen med e-post og direkte-nummer umiddelbart." },
  { type: "cta" as const, headline: "Få listen.", cta: "reachr.no" },
];

const s7Slides = [
  { type: "hook" as const, label: "Fremtiden ✨", headline: "Fremtidens\nB2B-salg\ner her.", sub: "De som tviholder på gamle metoder vil tape. De som adapterer, vinner." },
  { type: "sign" as const, num: "2026", sign: "AI tar over researchen.", detail: "Bli med på reisen før konkurrentene dine gjør det." },
  { type: "stat" as const, number: "3x", claim: "flere bookede møter", context: "for team som bruker AI til å personalisere outreach." },
  { type: "sign" as const, num: "JOIN", sign: "Bli fremtidens selger.", detail: "Bruk verktøyene som gir deg en urettferdig fordel." },
  { type: "cta" as const, headline: "Bli med.", cta: "Start i dag på reachr.no" },
];

const s8Slides = [
  { type: "hook" as const, headline: "Manuell\nresearch\ner dødt.", sub: "Verden går for fort til at du kan bruke timer på Google." },
  { type: "stat" as const, number: "95 %", claim: "mindre arbeid", context: "for team som bytter til Reachr sine automatiserte søk." },
  { type: "sign" as const, num: "DATA", sign: "Sannhet i sanntid.", detail: "Alt fra Brønnøysund, Proff og sosiale medier — på ett sted." },
  { type: "stat" as const, number: "0", claim: "missete muligheter", context: "Få varsel i det sekundet en potensiell kunde melder behov." },
  { type: "cta" as const, headline: "Gå pro.", cta: "reachr.no →" },
];

const s9Slides = [
  { type: "hook" as const, label: "Lynraskt ⚡", headline: "Fyll din\npipeline\ni lunsjen.", sub: "Mens du spiser brødskiva di, kan Reachr bygge hele salgsuken din." },
  { type: "step" as const, time: "Lunch", title: "Klikk på 'Generer'.", body: "Gjør ferdig mandagens møtebooking på minutter." },
  { type: "step" as const, time: "Kaffe", title: "Se over AI-forslagene.", body: "Godkjenn meldingene AI-en har skrevet for deg." },
  { type: "step" as const, time: "Ferdig", title: "Nyt ettermiddagen.", body: "Med mandagen klar kan du slappe helt av resten av helgen." },
  { type: "cta" as const, headline: "Begynn.", cta: "reachr.no" },
];

const s10Slides = [
  { type: "hook" as const, headline: "Reachr-\neffekten\ner her.", sub: "Se hva som skjer med tallene dine når du har de beste dataene." },
  { type: "sign" as const, num: "REACH", sign: "Nå ut til alle.", detail: "Ubegrenset tilgang på ferske norske B2B-leads." },
  { type: "stat" as const, number: "40 %", claim: "økt win-rate", context: "når du snakker med de rette personene til rett tid." },
  { type: "cta" as const, headline: "Se selv.", cta: "Klikk her for reachr.no" },
];

const s11Slides = [
  { type: "hook" as const, label: "Intel Ops 📡", headline: "Data\nis the new\nGold.", sub: "I mørket av B2B-markedet er data din eneste lommelykt." },
  { type: "stat" as const, number: "100K", claim: "datapunkter analysert", context: "Reachr skanner sanntids-endringer i hele det norske markedet." },
  { type: "sign" as const, num: "SYS", sign: "Systematisk vekst.", detail: "Eliminer gjetting. Begynn å bruke harde fakta." },
  { type: "cta" as const, headline: "Get Intel.", cta: "reachr.no" },
];

const s12Slides = [
  { type: "hook" as const, headline: "Salg er\nen nådeløs\nsport.", sub: "Trener du med gårsdagens utstyr, eller dagens teknologi?" },
  { type: "stat" as const, number: "#1", claim: "posisjon i markedet", context: "De som bruker Reachr er alltid 3 skritt foran konkurrentene." },
  { type: "sign" as const, num: "WIN", sign: "Vinn hver dag.", detail: "Salg handler om volum x presisjon. Vi gir deg begge." },
  { type: "cta" as const, headline: "Vinn mer.", cta: "reachr.no" },
];

const s13Slides = [
  { type: "hook" as const, headline: "Hyper-\nskalering\naktivert.", sub: "Skal du vokse 10% eller 1000%? Teknologien setter grensen." },
  { type: "stat" as const, number: "10x", claim: "større pipeline", context: "Uten å ansette en eneste ny selger. Det er Reachr-magi." },
  { type: "sign" as const, num: "GO", sign: "Gjør deg klar.", detail: "Systemet er klart for din vekst. Er du?" },
  { type: "cta" as const, headline: "Skalér nå.", cta: "reachr.no" },
];

const s14Slides = [
  { type: "hook" as const, label: "Next Gen 🧬", headline: "Slutt å\nsende\nspam.", sub: "Verden trenger ikke mer støy. Den trenger mer relevans." },
  { type: "step" as const, time: "SCAN", title: "Total analyse.", body: "Vi forstår hvem kunden er før du i det hele tatt ser navnet." },
  { type: "step" as const, time: "PITCH", title: "AI-drevet relevans.", body: "Meldinger så treffsikre at de ikke kan ignoreres." },
  { type: "cta" as const, headline: "Start nå.", cta: "reachr.no" },
];

const s15Slides = [
  { type: "hook" as const, headline: "Vinn\nmandagen.\nVinn uken.", sub: "De fleste selgere bruker mandag på research. Våre brukere bruker den på salg." },
  { type: "stat" as const, number: "08:00", claim: "Full liste klar", context: "Våkne opp til en fersk liste med leads generert mens du sov." },
  { type: "sign" as const, num: "RUN", sign: "Full fart fra start.", detail: "Ikke kast bort dine beste timer på Excel." },
  { type: "cta" as const, headline: "Vinn uka.", cta: "reachr.no" },
];

const s16Slides = [
  { type: "hook" as const, headline: "Når andre\ngir opp,\nfortsetter vi.", sub: "Resiliens i salg handler om å ha de rette systemene i ryggen." },
  { type: "stat" as const, number: "500+", claim: "aktive bedrifter", context: "Suksess-rater som stiger for hvert år med vårt system." },
  { type: "sign" as const, num: "HARD", sign: "Jobb smartere.", detail: "Hardt arbeid er bra. Smart arbeid er bedre." },
  { type: "cta" as const, headline: "Prøv oss.", cta: "reachr.no" },
];

const s17Slides = [
  { type: "hook" as const, headline: "Følelsen\nav total\nkontroll.", sub: "Ingen 'ghosting'. Ingen ubesvarte meldinger. Bare ren fremdrift." },
  { type: "step" as const, time: "MAP", title: "Kartlegg markedet.", body: "Se hele ditt potensiale på en skjerm." },
  { type: "step" as const, time: "WIN", title: "Lukk hver deal.", body: "Følg opp med laser-presisjon hver eneste gang." },
  { type: "cta" as const, headline: "Få kontroll.", cta: "reachr.no" },
];

const s18Slides = [
  { type: "hook" as const, headline: "Gjør mer\nmed mye\nmindre.", sub: "Lean salg er fremtiden. Fjern fettet, behold musklene." },
  { type: "stat" as const, number: "50 %", claim: "lavere kost pr lead", context: "Fordi du ikke kaster bort tid på leads som aldri vil kjøpe." },
  { type: "sign" as const, num: "LEAN", sign: "Vær effektiv.", detail: "Reachr er din digitale salgs-assistent som aldri sover." },
  { type: "cta" as const, headline: "Bli lean.", cta: "reachr.no" },
];

const s19Slides = [
  { type: "hook" as const, headline: "Ekte\nB2B\nIntelligens.", sub: "Det er ikke bare et verktøy. Det er hjernen i salgsavdelingen din." },
  { type: "stat" as const, number: "99.9 %", claim: "datakvalitet", context: "Vi dobbeltsjekker hver kilde slik at du har de riktige tallene." },
  { type: "sign" as const, num: "CORE", sign: "Kjerne-innsikt.", detail: "Se bak tallene. Forstå hvem kunden egentlig er." },
  { type: "cta" as const, headline: "Se innsikt.", cta: "reachr.no" },
];

const s20Slides = [
  { type: "hook" as const, label: "Agent 01 🤖", headline: "Din nye\ndigitale\nassistent.", sub: "Som å ha 10 researchere i sving, 24 timer i døgnet." },
  { type: "stat" as const, number: "24/7", claim: "Overvåking", context: "Vi sier ifra når drømmekunden din gjør et trekk." },
  { type: "sign" as const, num: "AI", sign: "Alltid pålogget.", detail: "La teknologien gjøre drittjobben, så du kan selge." },
  { type: "cta" as const, headline: "Ansatt oss.", cta: "reachr.no" },
];

function SlideContent({ slide, idx, total, showGuide }: { slide: any; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.label && (
            <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#171717", color: "#09fe94", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>{slide.label}</div>
          )}
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 52, fontWeight: 900, color: "#171717", lineHeight: 0.9, letterSpacing: "-2px", whiteSpace: "pre-line", overflowWrap: "break-word", wordBreak: "break-word" }}>{slide.headline}</p>
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "stat" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 72, fontWeight: 900, color: "#ff470a", lineHeight: 1 }}>{slide.number}</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 18, fontWeight: 700, marginTop: 8, overflowWrap: "break-word" }}>{slide.claim}</p>
          <p style={{ color: "#6b6660", fontSize: 13, marginTop: 16 }}>{slide.context}</p>
        </div>
      )}
      {slide.type === "sign" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#a09b8f" }}>{slide.num}</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 32, fontWeight: 900, color: "#ff470a", lineHeight: 1, overflowWrap: "break-word" }}>{slide.sign}</p>
          <p style={{ color: "#6b6660", fontSize: 13, marginTop: 20 }}>{slide.detail}</p>
        </div>
      )}
      {slide.type === "step" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#ffad0a" }}>{slide.time}</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 38, fontWeight: 900, lineHeight: 1, overflowWrap: "break-word", wordBreak: "break-word" }}>{slide.title}</p>
          <p style={{ color: "#6b6660", fontSize: 13, marginTop: 16 }}>{slide.body}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 48, fontWeight: 900, color: "#171717", lineHeight: 0.93, letterSpacing: "-1.5px", overflowWrap: "break-word" }}>{slide.headline}</p>
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800 }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

const SERIES = [
  { id: 0, name: "Gull i innboksen", slides: s1Slides },
  { id: 1, name: "Kald-ringing dødt", slides: s2Slides },
  { id: 2, name: "De beste vinner", slides: s3Slides },
  { id: 3, name: "Salg på autopilot", slides: s4Slides },
  { id: 4, name: "Tidstyven i salg", slides: s5Slides },
  { id: 5, name: "Fra 0 til 100 leads", slides: s6Slides },
  { id: 6, name: "Fremtidens salg", slides: s7Slides },
  { id: 7, name: "Research er dødt", slides: s8Slides },
  { id: 8, name: "Pipeline i lunsjen", slides: s9Slides },
  { id: 9, name: "Reachr-effekten", slides: s10Slides },
  { id: 10, name: "Data Intel 01", slides: s11Slides },
  { id: 11, name: "Salg er Sport", slides: s12Slides },
  { id: 12, name: "Hyper-skalering", slides: s13Slides },
  { id: 13, name: "Next Gen Outreach", slides: s14Slides },
  { id: 14, name: "Vinn uken din", slides: s15Slides },
  { id: 15, name: "Når andre gir opp", slides: s16Slides },
  { id: 16, name: "Full kontroll", slides: s17Slides },
  { id: 17, name: "Mer med mindre", slides: s18Slides },
  { id: 18, name: "B2B Intelligens", slides: s19Slides },
  { id: 19, name: "Salgsassistent", slides: s20Slides },
];

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

  const series = SERIES[seriesIdx];
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
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 py-12 px-4 bg-[#1a1a1a] font-sans">
      
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between border-b border-white/10 pb-6 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">TikTok Slideshow</h1>
          <p className="text-xs text-[#666]">20 profesjonelle serier klare til bruk.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {!isTiktokConnected ? (
            <button onClick={() => window.location.href = "/api/tiktok/auth"} className="bg-white text-black font-bold py-2 px-4 rounded-xl text-sm">
              Koble til TikTok
            </button>
          ) : (
            <div className="flex items-center gap-4">
              {tiktokUser && (
                <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-white/10">
                  <img src={tiktokUser.avatar} className="w-8 h-8 rounded-full" />
                  <span className="text-[11px] font-bold text-white">{tiktokUser.name}</span>
                </div>
              )}
              <button onClick={publishToTikTok} disabled={isPublishing} className="bg-[#ff0050] text-white font-bold py-2 px-5 rounded-xl text-sm disabled:opacity-50">
                Publiser til TikTok
              </button>
            </div>
          )}
        </div>
      </div>

      {publishedLink && (
        <a href={publishedLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#09fe94] underline mb-4">Siste publisering her →</a>
      )}

      {/* Serie tabs */}
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl px-4">
        {SERIES.map((s, i) => (
          <button
            key={i}
            onClick={() => changeSeries(i)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-colors ${i === seriesIdx ? 'bg-[#09fe94] border-[#09fe94] text-black' : 'bg-transparent border-[#333] text-[#666] hover:border-[#666]'}`}
          >
            {i + 1}. {s.name}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div ref={canvasRef} style={{ width: 405, height: 720, borderRadius: 24, overflow: "hidden", position: "relative", boxShadow: "0 0 80px rgba(0,0,0,0.8)" }}>
        <SlideContent slide={series.slides[slideIdx]} idx={slideIdx} total={total} showGuide={showGuide} />
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6 mt-4">
        <button onClick={() => setSlideIdx((i) => Math.max(0, i - 1))} className="text-white/40 hover:text-white transition-colors">← Tilbake</button>
        <div className="flex gap-1.5">
          {series.slides.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === slideIdx ? 'bg-[#09fe94]' : 'bg-white/10'}`} />
          ))}
        </div>
        <button onClick={() => setSlideIdx((i) => Math.min(total - 1, i + 1))} className="text-white/40 hover:text-white transition-colors">Neste →</button>
      </div>

      <button onClick={() => setShowGuide((v) => !v)} className="text-[10px] text-white/20 uppercase tracking-widest mt-4">
        {showGuide ? "Skjul soner" : "Vis soner"}
      </button>

      {/* Preview Section */}
      <div className="w-full max-w-[1200px] border-t border-white/5 pt-12 mt-12 px-6">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
          <GalleryThumbnails className="w-5 h-5 text-[#05c472]" />
          Alle slides i serien
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {series.slides.map((slide, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-4 hover:border-[#05c472]/50 transition-all cursor-pointer group">
              <div className="bg-[#05c472]/10 text-[#05c472] text-[10px] px-3 py-1 rounded-full font-bold">
                Slide {idx + 1}
              </div>
              <div className="w-full aspect-[9/16] bg-[#f9f7f2] rounded-xl shadow-2xl relative flex items-center justify-center p-2 transform group-hover:scale-[1.05] transition-transform overflow-hidden">
                <div className="scale-[0.25] origin-center w-[405px] h-[720px] pointer-events-none absolute">
                  <SlideContent slide={slide} idx={idx} total={total} showGuide={false} />
                </div>
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
    <Suspense fallback={<div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white text-xs">Laster...</div>}>
      <TiktokContent />
    </Suspense>
  );
}
