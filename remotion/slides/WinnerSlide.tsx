import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SlideShell } from "../SlideShell";
import { C, SC, INTER } from "../tokens";

const CHECKLIST = [
  { icon: "❤️", text: "Følg oss" },
  { icon: "💬", text: "Kommenter teamet ditt" },
  { icon: "📤", text: "Del med minst 1 person" },
];

export const WinnerSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Trophy drops in from top with big bounce
  const trophy    = spring({ frame, fps, config: { stiffness: 100, damping: 10 }, delay: 4 });
  const trophyY   = (1 - trophy) * -120 * SC;
  const trophyFloat = Math.sin((frame / fps) * Math.PI * 1.1) * 9 * SC;

  // Headline words
  const word1 = spring({ frame, fps, config: { stiffness: 180, damping: 18 }, delay: 20 });
  const word2 = spring({ frame, fps, config: { stiffness: 180, damping: 18 }, delay: 30 });
  const word3 = spring({ frame, fps, config: { stiffness: 180, damping: 18 }, delay: 40 });

  // Divider draws from left
  const divider = interpolate(frame, [52, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Checklist items stagger in
  const checks = CHECKLIST.map((_, i) =>
    spring({ frame, fps, config: { stiffness: 200, damping: 20 }, delay: 70 + i * 12 }),
  );

  // CTA pulse
  const ctaPulse = 1 + 0.055 * Math.sin((frame / fps) * Math.PI * 2.4);
  const ctaIn = spring({ frame, fps, config: { stiffness: 180, damping: 18 }, delay: 96 + CHECKLIST.length * 12 });

  return (
    <SlideShell slideIdx={5} totalSlides={6} showConfetti>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Trophy */}
        <div style={{
          fontSize: 70 * SC, textAlign: "center", marginBottom: 18 * SC,
          transform: `translateY(${trophyY + trophyFloat}px)`,
          display: "block",
        }}>
          🏆
        </div>

        {/* Headline — word by word */}
        <div style={{ textAlign: "center" }}>
          {[
            { text: "Trekker",  color: C.dark,  s: word1 },
            { text: "vinner",   color: C.green, s: word2 },
            { text: "snart!",   color: C.dark,  s: word3 },
          ].map(({ text, color, s }) => (
            <p key={text} style={{
              fontFamily: INTER, fontSize: 62 * SC, fontWeight: 900,
              color, lineHeight: 0.92, letterSpacing: -2.5 * SC, margin: 0,
              opacity: s, transform: `scale(${0.85 + 0.15 * s})`,
            }}>
              {text}
            </p>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          height: 2, background: C.border,
          margin: `${20 * SC}px 0`,
          width: `${divider * 100}%`,
          borderRadius: 1,
        }} />

        {/* Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 * SC }}>
          {CHECKLIST.map(({ icon, text }, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12 * SC,
              background: C.card, border: `1.5px solid ${C.border}`,
              borderRadius: 12 * SC, padding: `${12 * SC}px ${14 * SC}px`,
              opacity: checks[i], transform: `translateX(${(1 - checks[i]) * -30 * SC}px)`,
            }}>
              <span style={{ fontSize: 20 * SC }}>{icon}</span>
              <p style={{ fontSize: 14 * SC, fontWeight: 600, color: C.dark, margin: 0, fontFamily: INTER, flex: 1 }}>
                {text}
              </p>
              <div style={{
                width: 20 * SC, height: 20 * SC, borderRadius: 99 * SC,
                background: C.green, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 11 * SC, fontWeight: 900, color: C.dark }}>✓</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 18 * SC, background: C.orange, borderRadius: 14 * SC,
          padding: `${14 * SC}px ${18 * SC}px`, textAlign: "center",
          transform: `scale(${ctaPulse * ctaIn})`,
          opacity: ctaIn,
        }}>
          <p style={{ fontSize: 15 * SC, fontWeight: 800, color: "#fff", margin: 0, fontFamily: INTER }}>
            Lykke til! 🍀 Del med noen som fortjener det!
          </p>
        </div>
      </div>
    </SlideShell>
  );
};
