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

      {/* LOGO - Flyttet ned for å unngå TikTok-søkebaren */}
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

      {/* CONTENT - Flyttet ned for å gi logoen mer plass */}
      <div className="absolute flex flex-col" style={{ top: 156, left: 28, right: 92, bottom: 268 }}>
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
// CONTENT SERIES (10 TOTAL)
// ─────────────────────────────────────────────────────────────────────────────

const s1Slides = [
  { type: "hook" as const, label: "Salgs-tips 💎", headline: "Gull\ni din\ninnboks.", sub: "Slutt å lete etter nåla i høystakken. Begynn å plukke gulleplene." },
  { type: "stat" as const, number: "4.2x", claim: "høyere konvertering", context: "med varme leads fra Reachr sammenlignet med kalde lister." },
  { type: "cta" as const, headline: "Hent\ngullet.", cta: "Se demo på reachr.no" },
];

const s2Slides = [
  { type: "hook" as const, headline: "Kald-ringing\ner\ndødt.", sub: "Ingen tar telefonen fra ukjente nummer lenger. Her er hva du gjør i stedet." },
  { type: "sign" as const, num: "01", sign: "Bruk sosiale salgssignaler.", detail: "Reachr overvåker markedet for deg 24/7." },
  { type: "cta" as const, headline: "Ring\nsmartere.", cta: "Prøv Reachr gratis →" },
];

const s3Slides = [
  { type: "hook" as const, headline: "Hvorfor\nde beste\nvinner.", sub: "Det handler ikke om flaks. Det handler om datadrevet presisjon." },
  { type: "step" as const, time: "9:00", title: "Få listen servert.", body: "Reachr leverer dagens hotteste leads rett i fanget ditt." },
  { type: "cta" as const, headline: "Bli en\nvinner.", cta: "Sjekk reachr.no" },
];

const s4Slides = [
  { type: "hook" as const, label: "Autopilot 🚀", headline: "Salg\npå\nautopilot.", sub: "Når var sist gang du brukte 0 sekunder på research?" },
  { type: "stat" as const, number: "10t", claim: "spart pr uke", context: "for hver selger som bruker automatisert lead-fangst." },
  { type: "cta" as const, headline: "Spar\ntid.", cta: "Sjekk reachr.no" },
];

const s5Slides = [
  { type: "hook" as const, headline: "Den største\ntidstyven\ni salg.", sub: "Det er ikke kaffepausen. Det er manuell copy-paste fra Proff." },
  { type: "sign" as const, num: "STOPP", sign: "Slutt å copy-paste.", detail: "Eksportér leads direkte til din CRM med ett klikk." },
  { type: "cta" as const, headline: "Effektiviser.", cta: "reachr.no →" },
];

const s6Slides = [
  { type: "hook" as const, headline: "Fra 0 til\n100 leads\npå 15 min.", sub: "Høres det ut som magi? Det er bare smart teknologi." },
  { type: "step" as const, time: "Steg 2", title: "Filtrér på beslutningstakere.", body: "Snakk med de som faktisk kan si JA." },
  { type: "cta" as const, headline: "Få listen.", cta: "reachr.no" },
];

const s7Slides = [
  { type: "hook" as const, label: "Fremtiden ✨", headline: "Fremtidens\nB2B-salg\ner her.", sub: "De som tviholder på gamle metoder vil tape. De som adapterer, vinner." },
  { type: "sign" as const, num: "2026", sign: "AI tar over researchen.", detail: "Bli med på reisen før konkurrentene dine gjør det." },
  { type: "cta" as const, headline: "Bli med.", cta: "Start i dag på reachr.no" },
];

const s8Slides = [
  { type: "hook" as const, headline: "Manuell\nresearch\ner dødt.", sub: "Verden går for fort til at du kan bruke timer på Google." },
  { type: "stat" as const, number: "95 %", claim: "mindre manuelt arbeid", context: "for team som bytter til Reachr sine automatiserte søk." },
  { type: "cta" as const, headline: "Gå pro.", cta: "reachr.no →" },
];

const s9Slides = [
  { type: "hook" as const, label: "Lynraskt ⚡", headline: "Fyll din\npipeline\ni lunsjen.", sub: "Mens du spiser brødskiva di, kan Reachr bygge hele salgsuken din." },
  { type: "step" as const, time: "Lunch", title: "Klikk på 'Generer'.", body: "Gjør ferdig mandagens møtebooking på minutter." },
  { type: "cta" as const, headline: "Begynn.", cta: "reachr.no" },
];

const s10Slides = [
  { type: "hook" as const, headline: "Reachr-\neffekten\ner her.", sub: "Se hva som skjer med tallene dine når du har de beste dataene." },
  { type: "sign" as const, num: "REACH", sign: "Nå ut til alle.", detail: "Ubegrenset tilgang på ferske norske B2B-leads." },
  { type: "cta" as const, headline: "Se selv.", cta: "Klikk her for reachr.no" },
];

function SlideContent({ slide, idx, total, showGuide }: { slide: any; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {slide.label && (
            <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#171717", color: "#09fe94", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>{slide.label}</div>
          )}
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 64, fontWeight: 900, color: "#171717", lineHeight: 0.9, letterSpacing: "-3px", whiteSpace: "pre-line" }}>{slide.headline}</p>
          <p style={{ color: "#6b6660", fontSize: 13, lineHeight: 1.65, marginTop: 20 }}>{slide.sub}</p>
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
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 38, fontWeight: 900, color: "#ff470a", lineHeight: 1 }}>{slide.sign}</p>
          <p style={{ color: "#6b6660", fontSize: 13, marginTop: 20 }}>{slide.detail}</p>
        </div>
      )}
      {slide.type === "step" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#ffad0a" }}>{slide.time}</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 46, fontWeight: 900, lineHeight: 1 }}>{slide.title}</p>
          <p style={{ color: "#6b6660", fontSize: 13, marginTop: 16 }}>{slide.body}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 58, fontWeight: 900, color: "#171717", lineHeight: 0.93 }}>{slide.headline}</p>
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800 }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

const SERIES = [
  { id: 0, name: "Gull i innboksen", caption: "ROI-fokus", slides: s1Slides },
  { id: 1, name: "Slutt med kald-ringing", caption: "Metode-skifte", slides: s2Slides },
  { id: 2, name: "De beste vinner", caption: "Psykologi", slides: s3Slides },
  { id: 3, name: "Salg på autopilot", caption: "Automatisering", slides: s4Slides },
  { id: 4, name: "Den største tidstyven", caption: "Effektivitet", slides: s5Slides },
  { id: 5, name: "Fra 0 til 100 leads", caption: "Case-study stil", slides: s6Slides },
  { id: 6, name: "Fremtidens B2B-salg", caption: "Trender", slides: s7Slides },
  { id: 7, name: "Manuell research er død", caption: "Provokasjon", slides: s8Slides },
  { id: 8, name: "Pipeline i lunsjen", caption: "Hastighet", slides: s9Slides },
  { id: 9, name: "Reachr-effekten", caption: "Merkevare-fokus", slides: s10Slides },
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
    // Check session on load
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

  const connectTikTok = () => {
    window.location.href = "/api/tiktok/auth";
  };

  const logoutTikTok = () => {
    window.location.href = "/api/tiktok/logout";
  };

  const publishToTikTok = async () => {
    setIsPublishing(true);
    setPublishedLink(null);
    try {
      toast.info("Forbereder og tar bilder av alle slides i serien...");
      
      const formData = new FormData();
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas element not found");

      const initialIdx = slideIdx;

      for (let i = 0; i < total; i++) {
        setSlideIdx(i);
        await new Promise(r => setTimeout(r, 150));
        
        const blob = await htmlToImage.toBlob(canvas, {
          pixelRatio: 2,
          quality: 0.95,
        });
        
        if (blob) {
          formData.append(`slide_${i}`, blob, `slide_${i}.png`);
        }
      }
      
      setSlideIdx(initialIdx);

      const res = await fetch("/api/tiktok/publish", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Slideshow publisert til TikTok!");
        setPublishedLink(data.share_url || "https://tiktok.com");
      } else {
        toast.error(data.error || "Noe gikk galt.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Kunne ikke publisere.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 py-12 px-4" style={{ background: "#1a1a1a", fontFamily: "Inter, system-ui, sans-serif" }}>
      
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between border-b border-[#2a2a2a] pb-6 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">TikTok Slideshow</h1>
          <p className="text-xs text-[#666]">Automatisert slideshow-verktøy.</p>
        </div>
        
        {!isTiktokConnected ? (
          <button onClick={connectTikTok} className="flex items-center gap-2 bg-white text-black font-bold py-2 px-4 rounded-xl text-sm">
            <TikTokIcon className="w-4 h-4" />
            Koble til TikTok
          </button>
        ) : (
          <div className="flex items-center gap-4">
            {tiktokUser && (
              <div className="flex items-center gap-2 pr-4 border-r border-white/10 hidden sm:flex">
                {tiktokUser.avatar && (
                  <img src={tiktokUser.avatar} alt="Profil" className="w-8 h-8 rounded-full border border-white/20" />
                )}
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[11px] font-bold text-white">{tiktokUser.name}</span>
                  <span className="text-[9px] text-white/50">TikTok Pro</span>
                </div>
              </div>
            )}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#05c472]">
                <CheckCircle2 className="w-3 h-3" />
                Tilkoblet
              </div>
              <button 
                onClick={logoutTikTok}
                className="text-[9px] text-[#666] hover:text-white underline mt-0.5 transition-colors"
              >
                Logg ut
              </button>
            </div>
            <button 
              onClick={publishToTikTok}
              disabled={isPublishing}
              className="flex items-center gap-2 bg-[#ff0050] text-white font-bold py-2 px-5 rounded-xl text-sm disabled:opacity-50"
            >
              {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
              {isPublishing ? "Publiserer..." : "Publiser til TikTok"}
            </button>
          </div>
        )}
      </div>

      {publishedLink && (
        <div className="w-full max-w-2xl bg-[#09fe94]/10 border border-[#09fe94]/30 rounded-xl p-4 flex items-center justify-between mb-4">
          <div className="text-sm text-white">
            <span className="font-bold text-[#09fe94]">Suksess!</span> Slideshowet er publisert.
          </div>
          <a href={publishedLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-white underline">Se på TikTok →</a>
        </div>
      )}

      {/* Serie tabs */}
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {SERIES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => changeSeries(i)}
            style={{
              padding: "6px 14px", borderRadius: 99,
              fontSize: 11, fontWeight: 600,
              border: "1.5px solid",
              borderColor: i === seriesIdx ? "#09fe94" : "#2a2a2a",
              background: i === seriesIdx ? "#09fe94" : "transparent",
              color: i === seriesIdx ? "#171717" : "#666",
              cursor: "pointer",
            }}
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
      <div className="flex items-center gap-4">
        <button onClick={() => setSlideIdx((i) => Math.max(0, i - 1))} disabled={slideIdx === 0} style={{ color: "#fff" }}>← Forrige</button>
        <div className="flex gap-1.5">
          {series.slides.map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: i === slideIdx ? "#09fe94" : "#333" }} />
          ))}
        </div>
        <button onClick={() => setSlideIdx((i) => Math.min(total - 1, i + 1))} disabled={slideIdx === total - 1} style={{ color: "#fff" }}>Neste →</button>
      </div>

      <button onClick={() => setShowGuide((v) => !v)} className="text-xs text-[#666] underline mb-12">
        {showGuide ? "Skjul safe zone" : "Vis safe zone guide"}
      </button>

      {/* Preview Section - Important for Demo Clarity */}
      <div className="w-full max-w-[1200px] border-t border-white/5 pt-12">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <GalleryThumbnails className="w-5 h-5 text-[#05c472]" />
          Slideshow Forhåndsvisning
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
