"use client";

import Image from "next/image";
import { useState, useRef, useEffect, Suspense } from "react";
import React from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { TikTokIcon } from "@/components/ui/tiktok-icon";
import { 
  Loader2, CheckCircle2, Share2, GalleryThumbnails, 
  Target, Zap, Shield, TrendingUp, Users, Search, 
  Layers, BarChart3, Database, MessageSquare 
} from "lucide-react";
import * as htmlToImage from "html-to-image";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS & ICONS (MUST BE DEFINED FIRST)
// ─────────────────────────────────────────────────────────────────────────────

const Activity = (props: any) => <TrendingUp {...props} />;
const CircleDot = (props: any) => <Target {...props} />;
const PenTool = (props: any) => <Zap {...props} />;
const Globe = (props: any) => <Target {...props} />;
const Compass = (props: any) => <Zap {...props} />;
const Brain = (props: any) => <Zap {...props} />;
const Rocket = (props: any) => <TrendingUp {...props} />;

function VisualIllustration({ type }: { type: string }) {
  if (type === "funnel") return (
    <div className="flex flex-col items-center justify-center gap-1 opacity-20 my-6">
      <div style={{ width: 120, height: 16, background: "#171717", borderRadius: 4 }} />
      <div style={{ width: 90, height: 16, background: "#171717", borderRadius: 4 }} />
      <div style={{ width: 60, height: 16, background: "#ff470a", borderRadius: 4 }} />
      <div style={{ width: 30, height: 16, background: "#09fe94", borderRadius: 4 }} />
    </div>
  );
  if (type === "graph") return (
    <div className="flex items-end justify-center gap-2 h-20 opacity-20 my-6">
      <div style={{ width: 12, height: "40%", background: "#171717", borderRadius: 2 }} />
      <div style={{ width: 12, height: "30%", background: "#171717", borderRadius: 2 }} />
      <div style={{ width: 12, height: "60%", background: "#171717", borderRadius: 2 }} />
      <div style={{ width: 12, height: "90%", background: "#09fe94", borderRadius: 2 }} />
    </div>
  );
  if (type === "radar") return (
    <div className="relative w-24 h-24 my-6 opacity-20 flex items-center justify-center">
      <div className="absolute inset-0 border-2 border-black rounded-full" />
      <div className="absolute inset-4 border border-black rounded-full" />
      <div className="absolute inset-[32px] border border-black rounded-full" />
      <div className="absolute w-1 h-12 bg-black origin-bottom animate-spin" style={{ bottom: "50%", left: "50%" }} />
    </div>
  );
  if (type === "battery") return (
    <div className="w-20 h-10 border-4 border-black rounded-lg relative my-6 opacity-20 p-1">
      <div className="h-full bg-[#09fe94] rounded-sm animate-pulse" style={{ width: "85%" }} />
      <div className="absolute -right-2 top-2 w-2 h-4 bg-black rounded-r-sm" />
    </div>
  );
  return null;
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

      {/* CONTENT */}
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

const s1Slides = [{ type: "hook", label: "Salgs-tips 💎", headline: "Gull\ni din\ninnboks.", sub: "Slutt å lete etter nåla i høystakken. Begynn å plukke gulleplene." }, { type: "stat", number: "4.2x", claim: "høyere konvertering", context: "med varme leads fra Reachr." }, { type: "cta", headline: "Hent\ngullet.", cta: "reachr.no" }];
const s2Slides = [{ type: "hook", headline: "Kald-ringing\ner\ndødt.", sub: "Ingen tar telefonen fra ukjente nummer lenger." }, { type: "sign", num: "❌", sign: "Stopp kasting av tid.", detail: "Manuelle lister er utdaterte." }, { type: "cta", headline: "Ring\nsmartere.", cta: "reachr.no" }];
const s3Slides = [{ type: "hook", headline: "Hvorfor\nde beste\nvinner.", sub: "Det handler om datadrevet presisjon." }, { type: "step", time: "9:00", title: "Få listen servert.", body: "Hotteste leads rett i fanget ditt." }, { type: "cta", headline: "Sjekk reachr.no", cta: "Sjekk nå" }];
const s4Slides = [{ type: "hook", label: "Autopilot 🚀", headline: "Salg\npå\nautopilot.", sub: "Når var sist gang du brukte 0 sekunder på research?" }, { type: "stat", number: "10t", claim: "spart pr uke", context: "for hver selger." }, { type: "cta", headline: "Spar tid.", cta: "reachr.no" }];
const s5Slides = [{ type: "hook", headline: "Største\ntidstyv\ni salg.", sub: "Det er manuell copy-paste fra Proff." }, { type: "sign", num: "STOPP", sign: "Slutt å copy-paste.", detail: "Eksportér leads direkte til CRM." }, { type: "cta", headline: "Effektiviser.", cta: "reachr.no" }];
const s6Slides = [{ type: "hook", headline: "0 til 100\nleads på\n15 min.", sub: "Det er bare smart teknologi." }, { type: "step", time: "Steg 1", title: "Definér kunden.", body: "Velg bransje og omsetning." }, { type: "cta", headline: "Få listen.", cta: "reachr.no" }];
const s7Slides = [{ type: "hook", label: "Fremtiden ✨", headline: "Fremtidens\nB2B-salg\ner her.", sub: "De som adapterer, vinner." }, { type: "sign", num: "2026", sign: "AI tar over researchen.", detail: "Bli med før konkurrentene." }, { type: "cta", headline: "Bli med.", cta: "reachr.no" }];
const s8Slides = [{ type: "hook", headline: "Manuell\nresearch\ner dødt.", sub: "Verden går for fort for Google manuelt." }, { type: "stat", number: "95 %", claim: "mindre arbeid", context: "for team som bruker Reachr." }, { type: "cta", headline: "Gå pro.", cta: "reachr.no" }];
const s9Slides = [{ type: "hook", label: "Lynraskt ⚡", headline: "Fyll din\npipeline\ni lunsjen.", sub: "Bygg hele salgsuken din mens du spiser." }, { type: "step", time: "Lunch", title: "Klikk på 'Generer'.", body: "Ferdig på minutter." }, { type: "cta", headline: "Begynn.", cta: "reachr.no" }];
const s10Slides = [{ type: "hook", headline: "Reachr-\neffekten\ner her.", sub: "Se hva som skjer med tallene dine." }, { type: "sign", num: "REACH", sign: "Nå ut til alle.", detail: "Ubegrenset tilgang på ferske leads." }, { type: "cta", headline: "Sjekk nå.", cta: "reachr.no" }];

const s11Slides = [
  { type: "concept", icon: Target, title: "Laser-fokusert\nsalgstrakt.", body: "Er trakten din full av grus, eller diamanter?", illustration: "funnel" },
  { type: "concept", icon: TrendingUp, title: "Fra lekk til\nlønnsom.", body: "Vi tetter hullene i salgsstrategien din med ekte sanntids data.", illustration: "graph" },
  { type: "cta", headline: "Tett trakten.", sub: "Prøv Reachr i dag.", cta: "reachr.no" },
];

const s12Slides = [
  { type: "concept", icon: Shield, title: "Ekte data.\nIngen gjetting.", body: "Godkjenner du leads med hjertet eller hodet?", illustration: "shield" },
  { type: "stat", number: "99.9 %", claim: "Validert kilde", context: "Alt vi leverer er hentet direkte fra registre." },
  { type: "cta", headline: "Sikre salget.", cta: "Hent demo" },
];

const s13Slides = [
  { type: "concept", icon: Zap, title: "Spark igang\nmotoren.", body: "Mange selgere starter hver uke med tomt batteri. Her er laderen.", illustration: "battery" },
  { type: "concept", icon: Activity, title: "Høy puls i\npipelinen.", body: "Få varsler når nye muligheter dukker opp — før alle andre.", illustration: "pulse" },
  { type: "cta", headline: "Lade nå.", cta: "reachr.no" },
];

const s14Slides = [
  { type: "concept", icon: Search, title: "Bedriften\nsom gjemmer\nseg.", body: "Noen av dine beste kunder venter på at DU skal finne dem først.", illustration: "radar" },
  { type: "concept", icon: Layers, title: "Se over\noverflaten.", body: "Vi graver dypere i regnskap og historikk for deg.", illustration: "layers" },
  { type: "cta", headline: "Oppdag dem.", cta: "Sjekk reachr.no" },
];

const s15Slides = [
  { type: "concept", icon: BarChart3, title: "Salgshøyden\ni 2026.", body: "Hvordan ser fjellet ditt ut? Vi hjelper deg til toppen.", illustration: "mountain" },
  { type: "stat", number: "+31 %", claim: "Ekstra vekst", context: "for team som bytter fra Excel til vårt CRM." },
  { type: "cta", headline: "Klatre mer.", cta: "reachr.no" },
];

const s16Slides = [
  { type: "concept", icon: Database, title: "Det norske\nregisteret.", body: "Hvorfor betale for dyre utlands-lister når gullet ligger her?", illustration: "norway" },
  { type: "concept", icon: CircleDot, title: "Sikt på\nsentrum.", body: "Treff beslutningstakere der de bor. Ikke via sentralbord.", illustration: "target" },
  { type: "cta", headline: "Treff nå.", cta: "reachr.no" },
];

const s17Slides = [
  { type: "concept", icon: MessageSquare, title: "Meldingen\nsom vinner.", body: "E-post er ikke død. Bare dårlig e-post. La AI-en skrive gull.", illustration: "envelope" },
  { type: "concept", icon: PenTool, title: "Skreddersydd\npitch.", body: "Aldri send samme melding to ganger igjen.", illustration: "pencil" },
  { type: "cta", headline: "Skriv bedre.", cta: "reachr.no" },
];

const s18Slides = [
  { type: "concept", icon: Users, title: "Ditt nye\nsalgsteam.", body: "Visste du at én person med Reachr gjør jobben til tre?", illustration: "users" },
  { type: "stat", number: "3:1", claim: "Mangedobling", context: "av effektiviteten til hver eneste selger i teamet ditt." },
  { type: "cta", headline: "Bli flere.", cta: "Prøv gratis" },
];

const s19Slides = [
  { type: "concept", icon: Globe, title: "Ubegrenset\nhorisont.", body: "Norge er stort. Markedet ditt er større enn du tror.", illustration: "globe" },
  { type: "concept", icon: Compass, title: "Finn din\nrening.", body: "Bli guidet direkte til selskapene som vil si ja.", illustration: "compass" },
  { type: "cta", headline: "Finn vei.", cta: "reachr.no" },
];

const s20Slides = [
  { type: "concept", icon: Brain, title: "Intelligens\noverseri.", body: "Vi kombinerer menneskelig intuisjon med rå kraft fra AI.", illustration: "brain" },
  { type: "concept", icon: Rocket, title: "Launch-sekvens\nstartet.", body: "Klar for å løfte salgsavdelingen din til nye høyder?", illustration: "rocket" },
  { type: "cta", headline: "Løft av.", cta: "reachr.no" },
];

function SlideContent({ slide, idx, total, showGuide }: { slide: any; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.label && (
            <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#171717", color: "#09fe94", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>{slide.label}</div>
          )}
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 48, fontWeight: 900, color: "#171717", lineHeight: 0.9, letterSpacing: "-2px" }}>{slide.headline}</p>
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "concept" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ background: "#171717", borderRadius: 16, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}>
            <slide.icon className="w-6 h-6 text-[#09fe94]" />
          </div>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 38, fontWeight: 900, color: "#171717", lineHeight: 1.0, letterSpacing: "-1.5px" }}>{slide.title}</p>
          {slide.illustration && <VisualIllustration type={slide.illustration} />}
          <p style={{ color: "#6b6660", fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>{slide.body}</p>
        </div>
      )}
      {slide.type === "stat" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 72, fontWeight: 900, color: "#ff470a", lineHeight: 1 }}>{slide.number}</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 18, fontWeight: 700, marginTop: 8 }}>{slide.claim}</p>
          <p style={{ color: "#6b6660", fontSize: 13, marginTop: 16 }}>{slide.context}</p>
        </div>
      )}
      {slide.type === "sign" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#a09b8f" }}>{slide.num}</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 32, fontWeight: 900, color: "#ff470a", lineHeight: 1 }}>{slide.sign}</p>
          <p style={{ color: "#6b6660", fontSize: 13, marginTop: 20 }}>{slide.detail}</p>
        </div>
      )}
      {slide.type === "step" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#ffad0a" }}>{slide.time}</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 38, fontWeight: 900, lineHeight: 1 }}>{slide.title}</p>
          <p style={{ color: "#6b6660", fontSize: 13, marginTop: 16 }}>{slide.body}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 44, fontWeight: 900, color: "#171717", lineHeight: 0.93 }}>{slide.headline}</p>
          {slide.sub && <p style={{ color: "#6b6660", fontSize: 13, marginTop: 16 }}>{slide.sub}</p>}
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800, textAlign: "center" }}>{slide.cta}</div>
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
  { id: 10, name: "Salgstrakt", slides: s11Slides },
  { id: 11, name: "Data Intel", slides: s12Slides },
  { id: 12, name: "Motoren", slides: s13Slides },
  { id: 13, name: "Radar-skanning", slides: s14Slides },
  { id: 14, name: "Fjelltoppen", slides: s15Slides },
  { id: 15, name: "Norge-fokus", slides: s16Slides },
  { id: 16, name: "Meldingskunst", slides: s17Slides },
  { id: 17, name: "Team-kraft", slides: s18Slides },
  { id: 18, name: "Horisont", slides: s19Slides },
  { id: 19, name: "Launch-sekvens", slides: s20Slides },
];

function TiktokContent() {
  const searchParams = useSearchParams();
  const [seriesIdx, setSeriesIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [isTiktokConnected, setIsTiktokConnected] = useState(false);
  const [tiktokUser, setTiktokUser] = useState<{ name: string; avatar: string } | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  
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

  const publishToTikTok = async () => {
    setIsPublishing(true);
    try {
      toast.info("Forbereder slideshow...");
      const formData = new FormData();
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas not found");
      const initialIdx = slideIdx;
      for (let i = 0; i < total; i++) {
        setSlideIdx(i);
        await new Promise(r => setTimeout(r, 150));
        const blob = await htmlToImage.toBlob(canvas, { pixelRatio: 2 });
        if (blob) formData.append(`slide_${i}`, blob, `slide_${i}.png`);
      }
      setSlideIdx(initialIdx);
      const res = await fetch("/api/tiktok/publish", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) toast.success("Publisert!");
      else toast.error("Feil.");
    } catch (err) { toast.error("Kunne ikke publisere."); }
    finally { setIsPublishing(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 py-12 px-4 bg-[#1a1a1a] font-sans">
      <div className="w-full max-w-2xl flex items-center justify-between border-b border-white/10 pb-6 mb-2">
        <h1 className="text-2xl font-bold text-white">Reachr Creator</h1>
        {isTiktokConnected && (
          <button onClick={publishToTikTok} disabled={isPublishing} className="bg-[#ff0050] text-white font-bold py-2 px-6 rounded-xl text-sm">
            {isPublishing ? "Publiserer..." : "Publiser nå"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {SERIES.map((s, i) => (
          <button key={i} onClick={() => { setSeriesIdx(i); setSlideIdx(0); }} className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-colors ${i === seriesIdx ? 'bg-[#09fe94] border-[#09fe94] text-black' : 'bg-transparent border-[#333] text-[#666]'}`}>
            {i + 1}. {s.name}
          </button>
        ))}
      </div>

      <div ref={canvasRef} style={{ width: 405, height: 720, borderRadius: 24, overflow: "hidden", position: "relative", background: "#f2efe3" }}>
        <SlideContent slide={series.slides[slideIdx]} idx={slideIdx} total={total} showGuide={showGuide} />
      </div>

      <div className="flex items-center gap-6 mt-4">
        <button onClick={() => setSlideIdx((i) => Math.max(0, i - 1))} className="text-white/40">← Tilbake</button>
        <div className="flex gap-1.5">
          {series.slides.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === slideIdx ? 'bg-[#09fe94]' : 'bg-white/10'}`} />
          ))}
        </div>
        <button onClick={() => setSlideIdx((i) => Math.min(total - 1, i + 1))} className="text-white/40">Neste →</button>
      </div>

      <div className="w-full max-w-[1200px] border-t border-white/5 pt-12 mt-12 px-6">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">🛒 Forhåndsvisning</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {series.slides.map((slide, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-4">
              <div className="w-full aspect-[9/16] bg-[#f9f7f2] rounded-xl relative flex items-center justify-center p-2 overflow-hidden">
                <div className="scale-[0.25] origin-center w-[405px] h-[720px] absolute">
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
    <Suspense fallback={<div className="bg-[#1a1a1a] min-h-screen text-white">Laster...</div>}>
      <TiktokContent />
    </Suspense>
  );
}
