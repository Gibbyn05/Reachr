import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { W, H, SC, C, GARAMOND, INTER } from "./tokens";
import { Confetti } from "./Confetti";

interface Props {
  children:    React.ReactNode;
  slideIdx:    number;
  totalSlides: number;
  showConfetti?: boolean;
}

export const SlideShell: React.FC<Props> = ({ children, slideIdx, totalSlides, showConfetti }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade in first 12 frames, fade out last 12 frames
  const opacity = interpolate(
    frame,
    [0, 12, durationInFrames - 12, durationInFrames],
    [0,  1,  1,                    0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Slight upward slide on entry
  const slideY = interpolate(frame, [0, 18], [36 * SC, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: C.cream, opacity }}>
      {/* Subtle radial gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 80% 0%, #ede9da40 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Glow blobs (giveaway theme) */}
      <div style={{
        position: "absolute", top: -W * 0.3, left: -W * 0.2,
        width: W * 0.8, height: W * 0.8,
        borderRadius: "50%",
        background: C.green,
        filter: `blur(${W * 0.22}px)`,
        opacity: 0.18,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -W * 0.3, right: -W * 0.2,
        width: W * 0.8, height: W * 0.8,
        borderRadius: "50%",
        background: C.orange,
        filter: `blur(${W * 0.22}px)`,
        opacity: 0.13,
        pointerEvents: "none",
      }} />

      {showConfetti && <Confetti />}

      {/* Main content wrapper — matches TikTok safe zone */}
      <div style={{ transform: `translateY(${slideY}px)`, height: "100%", position: "relative", zIndex: 3 }}>
        {/* LOGO — top-left, clear of TikTok navigation bar */}
        <div style={{
          position: "absolute", top: 190 * SC, left: 28 * SC,
          display: "flex", alignItems: "center", gap: 8 * SC,
        }}>
          {/* Reachr wordmark */}
          <div style={{
            width: 36 * SC, height: 36 * SC, borderRadius: 8 * SC,
            background: C.dark,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: C.green, fontSize: 20 * SC, fontWeight: 900, fontFamily: GARAMOND }}>R</span>
          </div>
          <span style={{ fontFamily: GARAMOND, fontSize: 26 * SC, fontWeight: 700, fontStyle: "italic", color: C.dark, lineHeight: 1 }}>
            Reachr
          </span>
        </div>

        {/* SLIDE DOTS */}
        <div style={{
          position: "absolute", top: 202 * SC, right: 36 * SC,
          display: "flex", alignItems: "center", gap: 6 * SC,
        }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div key={i} style={{
              width:        i === slideIdx ? 28 * SC : 8 * SC,
              height:       6 * SC,
              borderRadius: 3 * SC,
              background:   i === slideIdx ? C.green : C.border,
              transition:   "width 0.2s",
            }} />
          ))}
        </div>

        {/* CONTENT AREA — safe zone: x 28-377, y 300-1480 (original scale) */}
        <div style={{
          position: "absolute",
          top:    310 * SC,
          left:   28 * SC,
          right:  28 * SC,
          bottom: 440 * SC,
          display: "flex", flexDirection: "column",
        }}>
          {children}
        </div>

        {/* BOTTOM STRIP */}
        <div style={{ position: "absolute", bottom: 390 * SC, left: 28 * SC, right: 28 * SC }}>
          <div style={{ height: 1.5, background: C.border, marginBottom: 12 * SC }} />
          <span style={{ fontSize: 12 * SC, color: C.faint, letterSpacing: "0.06em", fontFamily: INTER }}>
            reachr.no
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
