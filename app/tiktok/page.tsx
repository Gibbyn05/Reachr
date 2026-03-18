"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { TikTokIcon } from "@/components/ui/tiktok-icon";
import { Loader2, CheckCircle2, Share2 } from "lucide-react";
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
      <div className="absolute" style={{ top: 28, left: 28 }}>
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Reachr" width={28} height={28} style={{ display: "block" }} />
          <span style={{ fontFamily: "EB Garamond, Georgia, serif", fontSize: 19, fontWeight: 700, fontStyle: "italic", color: "#171717", lineHeight: 1 }}>Reachr</span>
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute flex items-center gap-1.5" style={{ top: 36, right: 92 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: i === idx ? 18 : 5, height: 5, borderRadius: 3, background: i === idx ? "#09fe94" : "#d8d3c5", transition: "width 0.25s" }} />
        ))}
      </div>

      {/* CONTENT */}
      <div className="absolute flex flex-col" style={{ top: 80, left: 28, right: 92, bottom: 268 }}>
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
// SERIE 1 — "LINKEDIN ER METTET"
// ─────────────────────────────────────────────────────────────────────────────
const s1Slides = [
  { type: "hook" as const, label: "Hot take 🔥", headline: "LinkedIn\ner\nmettet.", sub: "Innboksen er full. Ingen leser deg. Her er hva som faktisk virker nå." },
  { type: "stat" as const, number: "89 %", claim: "av LinkedIn InMail-er ignoreres", context: "Algoritmene prioriterer annonser. Organisk rekkevidde er nær null." },
  { type: "cta" as const, headline: "Slutt\nå rope\ni tomrom.", cta: "Finn riktige leads på reachr.no →" },
];

function S1Slide({ slide, idx, total, showGuide }: { slide: any; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "#171717", color: "#09fe94", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, marginBottom: 20 }}>{slide.label}</div>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 64, fontWeight: 900, color: "#171717", lineHeight: 0.9, letterSpacing: "-3px" }}>{slide.headline}</p>
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
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 58, fontWeight: 900, color: "#171717", lineHeight: 0.93 }}>{slide.headline}</p>
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px", fontWeight: 800 }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 2 — "5 TEGN PÅ AT DU TRENGER REACHR"
// ─────────────────────────────────────────────────────────────────────────────
const s2Slides = [
  { type: "hook" as const, headline: "5 tegn på\nat du bruker\nfor mye tid.", sub: "Kjenner du deg igjen?" },
  { type: "sign" as const, num: "01", sign: "Du googler manuelt.", detail: "Kopi-lim fra nettsider inn i Excel." },
  { type: "cta" as const, headline: "Start\ngratis.", cta: "reachr.no →" },
];

function S2Slide({ slide, idx, total, showGuide }: { slide: any; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 44, fontWeight: 900 }}>{slide.headline}</p>
          <p style={{ color: "#6b6660", fontSize: 13, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "sign" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#a09b8f" }}>Tegn #{slide.num}</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 38, fontWeight: 900, color: "#ff470a" }}>{slide.sign}</p>
          <p style={{ color: "#6b6660", fontSize: 13, marginTop: 20 }}>{slide.detail}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "EB Garamond, serif", fontSize: 52, fontWeight: 700 }}>{slide.headline}</p>
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px" }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE 3 — "BYGG PIPELINE PÅ 30 MIN"
// ─────────────────────────────────────────────────────────────────────────────
const s3Slides = [
  { type: "hook" as const, headline: "Pipeline på\n30 min.", sub: "Slik gjør du det." },
  { type: "step" as const, time: "0–5 min", title: "Søk opp bransjen din.", body: "Gå til Reachr. Velg bransje." },
  { type: "cta" as const, headline: "Prøv nå.", cta: "reachr.no →" },
];

function S3Slide({ slide, idx, total, showGuide }: { slide: any; idx: number; total: number; showGuide: boolean }) {
  return (
    <SlideShell idx={idx} total={total} showGuide={showGuide}>
      {slide.type === "hook" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 54, fontWeight: 900 }}>{slide.headline}</p>
          <p style={{ color: "#6b6660", fontSize: 13, marginTop: 20 }}>{slide.sub}</p>
        </div>
      )}
      {slide.type === "step" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#ffad0a" }}>{slide.time}</p>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 46, fontWeight: 900 }}>{slide.title}</p>
          <p style={{ color: "#6b6660", fontSize: 13, marginTop: 16 }}>{slide.body}</p>
        </div>
      )}
      {slide.type === "cta" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 52, fontWeight: 900 }}>{slide.headline}</p>
          <div style={{ marginTop: 28, background: "#09fe94", borderRadius: 14, padding: "14px 24px" }}>{slide.cta}</div>
        </div>
      )}
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const SERIES = [
  { id: 0, name: "LinkedIn er mettet", caption: "Hvorfor LinkedIn ikke lenger er gullstandarden.", slides: s1Slides, Renderer: S1Slide },
  { id: 1, name: "5 tegn på Reachr", caption: "Kjenner du deg igjen?", slides: s2Slides, Renderer: S2Slide },
  { id: 2, name: "Pipeline på 30 min", caption: "Bygg en full pipeline raskt.", slides: s3Slides, Renderer: S3Slide },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function TiktokPage() {
  const searchParams = useSearchParams();
  const [seriesIdx, setSeriesIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [isTiktokConnected, setIsTiktokConnected] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedLink, setPublishedLink] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const connected = searchParams.get("tiktok") === "success";
    if (connected) {
      setIsTiktokConnected(true);
      toast.success("Koblet til TikTok!");
    }
  }, [searchParams]);

  const series = SERIES[seriesIdx];
  const { Renderer } = series as any;
  const total = series.slides.length;

  function changeSeries(i: number) {
    setSeriesIdx(i);
    setSlideIdx(0);
  }

  const connectTikTok = () => {
    window.location.href = "/api/tiktok/auth";
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#05c472]">
              <CheckCircle2 className="w-3 h-3" />
              Tilkoblet
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
        <Renderer slide={series.slides[slideIdx]} idx={slideIdx} total={total} showGuide={showGuide} />
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

      <button onClick={() => setShowGuide((v) => !v)} className="text-xs text-[#666] underline">
        {showGuide ? "Skjul safe zone" : "Vis safe zone guide"}
      </button>
    </div>
  );
}
