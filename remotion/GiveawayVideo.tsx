import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HookSlide }   from "./slides/HookSlide";
import { PrizeSlide }  from "./slides/PrizeSlide";
import { StepSlide }   from "./slides/StepSlide";
import { WinnerSlide } from "./slides/WinnerSlide";

// ── Timing constants ────────────────────────────────────────────────────────
export const FPS            = 30;
export const W              = 1080;
export const H              = 1920;

const SLIDE_FRAMES   = 100; // frames each slide is on screen
const OVERLAP_FRAMES = 12;  // cross-fade overlap between slides
const SLIDE_NET      = SLIDE_FRAMES - OVERLAP_FRAMES; // net frames per slide slot

const SLIDES = 6;
export const TOTAL_FRAMES = SLIDE_NET * SLIDES + OVERLAP_FRAMES;

// Each slide starts at: index * SLIDE_NET
function startOf(i: number) {
  return i * SLIDE_NET;
}

// ── Composition ─────────────────────────────────────────────────────────────
export const GiveawayVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "#f2efe3" }}>
    <Sequence from={startOf(0)} durationInFrames={SLIDE_FRAMES}>
      <HookSlide />
    </Sequence>

    <Sequence from={startOf(1)} durationInFrames={SLIDE_FRAMES}>
      <PrizeSlide />
    </Sequence>

    <Sequence from={startOf(2)} durationInFrames={SLIDE_FRAMES}>
      <StepSlide
        num="1" emoji="❤️"
        action="Følg oss!"
        detail="Trykk følg-knappen nå — du kan ikke vinne uten!"
        slideIdx={2}
      />
    </Sequence>

    <Sequence from={startOf(3)} durationInFrames={SLIDE_FRAMES}>
      <StepSlide
        num="2" emoji="💬"
        action="Kommenter!"
        detail="Skriv hvem du vil ha med på teamet ditt. Tagg dem direkte!"
        slideIdx={3}
      />
    </Sequence>

    <Sequence from={startOf(4)} durationInFrames={SLIDE_FRAMES}>
      <StepSlide
        num="3" emoji="📤"
        action="Del videoen!"
        detail="Del med minst 1 person. Jo flere ser, jo høyere sjanser (for deg!)."
        slideIdx={4}
      />
    </Sequence>

    <Sequence from={startOf(5)} durationInFrames={SLIDE_FRAMES}>
      <WinnerSlide />
    </Sequence>
  </AbsoluteFill>
);
