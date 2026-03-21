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

// Layout constants — absolute px for 1080×1920 canvas
// Original web design: 405×720. SC = 2.667.
// Correct mapping: original_y * SC = canvas_y
const LOGO_TOP    = 72  * SC;  // 192px
const LOGO_LEFT   = 28  * SC;  // 75px
const DOTS_TOP    = 84  * SC;  // 224px  (vertically centred with logo)
const DOTS_RIGHT  = 32  * SC;  // 85px
const CON_TOP     = 160 * SC;  // 427px  (below logo + gap)
const CON_LEFT    = 28  * SC;  // 75px
const CON_RIGHT   = 28  * SC;  // 75px
const CON_BOTTOM  = 140 * SC;  // 373px  (above strip)
const STRIP_BOT   = 130 * SC;  // 347px
const STRIP_LEFT  = 28  * SC;
const STRIP_RIGHT = 28  * SC;

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
  const slideY = interpolate(frame, [0, 18], [30 * SC, 0], {
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

      {/* Glow blobs */}
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

      {/* Main content wrapper */}
      <div style={{ transform: `translateY(${slideY}px)`, height: "100%", position: "relative", zIndex: 3 }}>

        {/* LOGO */}
        <div style={{
          position: "absolute", top: LOGO_TOP, left: LOGO_LEFT,
          display: "flex", alignItems: "center", gap: 8 * SC,
        }}>
          <div style={{
            width: 34 * SC, height: 34 * SC, borderRadius: 7 * SC,
            background: C.dark,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ color: C.green, fontSize: 19 * SC, fontWeight: 900, fontFamily: GARAMOND }}>R</span>
          </div>
          <span style={{ fontFamily: GARAMOND, fontSize: 24 * SC, fontWeight: 700, fontStyle: "italic", color: C.dark, lineHeight: 1 }}>
            Reachr
          </span>
        </div>

        {/* SLIDE DOTS */}
        <div style={{
          position: "absolute", top: DOTS_TOP, right: DOTS_RIGHT,
          display: "flex", alignItems: "center", gap: 5 * SC,
        }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div key={i} style={{
              width:        i === slideIdx ? 24 * SC : 7 * SC,
              height:       5 * SC,
              borderRadius: 3 * SC,
              background:   i === slideIdx ? C.green : C.border,
            }} />
          ))}
        </div>

        {/* CONTENT AREA */}
        <div style={{
          position: "absolute",
          top:    CON_TOP,
          left:   CON_LEFT,
          right:  CON_RIGHT,
          bottom: CON_BOTTOM,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {children}
        </div>

        {/* BOTTOM STRIP */}
        <div style={{
          position: "absolute",
          bottom: STRIP_BOT, left: STRIP_LEFT, right: STRIP_RIGHT,
        }}>
          <div style={{ height: 1.5, background: C.border, marginBottom: 10 * SC }} />
          <span style={{ fontSize: 11 * SC, color: C.faint, letterSpacing: "0.06em", fontFamily: INTER }}>
            reachr.no
          </span>
        </div>

      </div>
    </AbsoluteFill>
  );
};
