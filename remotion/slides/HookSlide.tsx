import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SlideShell } from "../SlideShell";
import { C, SC, INTER, GARAMOND } from "../tokens";

const TOTAL_SLIDES = 6;

export const HookSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badge = spring({ frame, fps, config: { stiffness: 180, damping: 18 }, delay: 8 });
  const line1 = spring({ frame, fps, config: { stiffness: 140, damping: 16 }, delay: 18 });
  const line2 = spring({ frame, fps, config: { stiffness: 140, damping: 16 }, delay: 26 });
  const line3 = spring({ frame, fps, config: { stiffness: 140, damping: 16 }, delay: 34 });
  const sub   = interpolate(frame, [44, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chip  = spring({ frame, fps, config: { stiffness: 160, damping: 20 }, delay: 58 });

  // Continuous glow pulse on chip
  const glow  = 0.4 + 0.6 * Math.sin((frame / fps) * Math.PI * 1.8);

  return (
    <SlideShell slideIdx={0} totalSlides={TOTAL_SLIDES} showConfetti>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* GIVEAWAY badge */}
        <div style={{
          display: "inline-flex", alignSelf: "flex-start",
          background: C.orange, color: "#fff",
          fontSize: 13 * SC, fontWeight: 900, letterSpacing: "0.1em",
          textTransform: "uppercase", padding: `${5 * SC}px ${14 * SC}px`,
          borderRadius: 99 * SC, marginBottom: 20 * SC,
          fontFamily: INTER,
          transform: `scale(${badge}) translateX(${(1 - badge) * -40 * SC}px)`,
        }}>
          🎉 GIVEAWAY
        </div>

        {/* Headlines */}
        {[
          { text: "Vinn",    color: C.dark,  spring: line1 },
          { text: "1 år",    color: C.green, spring: line2 },
          { text: "gratis!", color: C.dark,  spring: line3 },
        ].map(({ text, color, spring: s }) => (
          <p key={text} style={{
            fontFamily: INTER, fontSize: 80 * SC, fontWeight: 900,
            color, lineHeight: 0.88, letterSpacing: -3 * SC,
            margin: 0, opacity: s, transform: `translateY(${(1 - s) * 20 * SC}px)`,
          }}>
            {text}
          </p>
        ))}

        {/* Subtitle */}
        <p style={{
          color: C.muted, fontSize: 15 * SC, lineHeight: 1.6,
          marginTop: 22 * SC, fontFamily: INTER, opacity: sub,
          transform: `translateY(${(1 - sub) * 12 * SC}px)`,
        }}>
          Hele salgsteamet ditt (2–5 pers) får{"\n"}ett år med Reachr Team — helt gratis. 🚀
        </p>

        {/* Prize value chip */}
        <div style={{
          marginTop: 20 * SC,
          display: "inline-flex", alignItems: "center", gap: 8 * SC,
          background: C.dark, borderRadius: 12 * SC,
          padding: `${10 * SC}px ${16 * SC}px`,
          alignSelf: "flex-start",
          transform: `scale(${chip})`,
          boxShadow: `0 0 ${28 * SC * glow}px ${8 * SC * glow}px ${C.green}44`,
        }}>
          <span style={{ fontSize: 22 * SC }}>🏆</span>
          <span style={{ fontSize: 14 * SC, fontWeight: 700, color: C.green, fontFamily: INTER }}>
            Verdi: over 20 000 kr
          </span>
        </div>
      </div>
    </SlideShell>
  );
};
