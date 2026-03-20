import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SlideShell } from "../SlideShell";
import { C, SC, INTER, GARAMOND } from "../tokens";

const FEATURES = [
  "250 000+ bedrifter å søke i",
  "AI-genererte e-poster & SMS",
  "Delt CRM-pipeline for hele teamet",
  "Automatiske oppfølgingsvarsler",
  "2–5 brukere inkludert",
];

export const PrizeSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const label = interpolate(frame, [6, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const card  = spring({ frame, fps, config: { stiffness: 120, damping: 18 }, delay: 14 });

  // Continuous float on card
  const floatY = Math.sin((frame / fps) * Math.PI * 0.9) * 8 * SC;
  // Star rotation
  const starRot = (frame / fps) * 120; // 120 deg/sec

  return (
    <SlideShell slideIdx={1} totalSlides={6} showConfetti>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Label */}
        <p style={{
          fontSize: 12 * SC, fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", color: C.orange, marginBottom: 16 * SC,
          fontFamily: INTER, opacity: label,
        }}>
          Premien 🎁
        </p>

        {/* Prize card */}
        <div style={{
          background: C.dark, borderRadius: 20 * SC,
          padding: `${24 * SC}px ${22 * SC}px`,
          border: `2.5px solid ${C.green}`,
          transform: `scale(${card}) translateY(${floatY}px)`,
          boxShadow: `0 ${16 * SC}px ${48 * SC}px rgba(0,0,0,0.25)`,
        }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 * SC, marginBottom: 18 * SC }}>
            <span style={{
              fontSize: 36 * SC,
              display: "inline-block",
              transform: `rotate(${starRot}deg) scale(${1 + 0.2 * Math.sin((frame / fps) * Math.PI * 2)})`,
            }}>⭐</span>
            <div>
              <p style={{ fontFamily: GARAMOND, fontSize: 28 * SC, fontWeight: 700, color: C.green, lineHeight: 1.1, margin: 0 }}>
                Reachr Team
              </p>
              <p style={{ fontSize: 13 * SC, color: C.faint, margin: 0, fontFamily: INTER }}>
                1 helt år — gratis
              </p>
            </div>
          </div>

          <div style={{ height: 1.5, background: "#2a2a2a", marginBottom: 16 * SC }} />

          {/* Feature list with stagger */}
          {FEATURES.map((feat, i) => {
            const featureIn = spring({ frame, fps, config: { stiffness: 160, damping: 20 }, delay: 30 + i * 10 });
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10 * SC,
                marginBottom: i < FEATURES.length - 1 ? 10 * SC : 0,
                opacity: featureIn,
                transform: `translateX(${(1 - featureIn) * -20 * SC}px)`,
              }}>
                <span style={{ color: C.green, fontSize: 14 * SC, fontWeight: 800 }}>✓</span>
                <p style={{ fontSize: 14 * SC, color: "#f2efe3", lineHeight: 1.4, margin: 0, fontFamily: INTER }}>
                  {feat}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </SlideShell>
  );
};
