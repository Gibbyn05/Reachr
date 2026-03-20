import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SlideShell } from "../SlideShell";
import { C, SC, INTER } from "../tokens";

interface Props {
  num:       string;
  emoji:     string;
  action:    string;
  detail:    string;
  slideIdx:  number; // 2, 3, 4
}

export const StepSlide: React.FC<Props> = ({ num, emoji, action, detail, slideIdx }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badge   = spring({ frame, fps, config: { stiffness: 200, damping: 18 }, delay: 6 });
  const stepLbl = interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const emojiS  = spring({ frame, fps, config: { stiffness: 220, damping: 14 }, delay: 20 });
  const actionS = spring({ frame, fps, config: { stiffness: 150, damping: 18 }, delay: 30 });
  const detailS = interpolate(frame, [42, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Emoji float
  const emojiFloat = Math.sin((frame / fps) * Math.PI * 1.2) * 7 * SC;
  // Badge pulse
  const badgePulse = 1 + 0.06 * Math.sin((frame / fps) * Math.PI * 2.2);
  // Glow pulse
  const glowA = 0.3 + 0.7 * Math.sin((frame / fps) * Math.PI * 1.8);

  return (
    <SlideShell slideIdx={slideIdx} totalSlides={6} showConfetti>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Step badge + label row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12 * SC, marginBottom: 22 * SC,
          opacity: spring({ frame, fps, config: { stiffness: 160, damping: 20 }, delay: 4 }),
        }}>
          <div style={{
            width: 44 * SC, height: 44 * SC, borderRadius: 99 * SC,
            background: C.green, display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            transform: `scale(${badge * badgePulse})`,
          }}>
            <span style={{ fontSize: 20 * SC, fontWeight: 900, color: C.dark, fontFamily: INTER }}>{num}</span>
          </div>
          <p style={{
            fontSize: 13 * SC, fontWeight: 700, color: C.faint,
            letterSpacing: "0.08em", textTransform: "uppercase",
            fontFamily: INTER, opacity: stepLbl,
          }}>
            Steg {num} av 3
          </p>
        </div>

        {/* Emoji */}
        <div style={{
          fontSize: 68 * SC, lineHeight: 1, marginBottom: 18 * SC,
          transform: `scale(${emojiS}) translateY(${emojiFloat}px)`,
          display: "inline-block",
        }}>
          {emoji}
        </div>

        {/* Action headline */}
        <p style={{
          fontFamily: INTER, fontSize: 66 * SC, fontWeight: 900,
          color: C.dark, lineHeight: 0.95, letterSpacing: -2.5 * SC,
          margin: 0, marginBottom: 22 * SC,
          opacity: actionS, transform: `translateY(${(1 - actionS) * 24 * SC}px)`,
        }}>
          {action}
        </p>

        {/* Detail card */}
        <div style={{
          background: C.card, borderRadius: 16 * SC,
          padding: `${16 * SC}px ${18 * SC}px`,
          border: `2px solid ${C.green}55`,
          boxShadow: `0 0 ${24 * SC * glowA}px ${6 * SC * glowA}px ${C.green}33`,
          opacity: detailS, transform: `translateY(${(1 - detailS) * 14 * SC}px)`,
        }}>
          <p style={{ color: C.muted, fontSize: 15 * SC, lineHeight: 1.6, margin: 0, fontFamily: INTER }}>
            {detail}
          </p>
        </div>
      </div>
    </SlideShell>
  );
};
