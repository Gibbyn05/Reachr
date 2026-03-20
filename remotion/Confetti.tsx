import React from "react";
import { useCurrentFrame } from "remotion";
import { W, H, C } from "./tokens";

const COLORS  = [C.green, C.orange, C.yellow, C.dark, "#faf8f2", "#ff0050", "#fff"];
const SHAPES  = ["■", "●", "▲", "★", "♦", "✦"] as const;
const N       = 48;

interface Particle {
  x:        number; // 0-1 of width
  speed:    number; // px per frame
  size:     number;
  color:    string;
  shape:    string;
  rotSpeed: number; // deg per frame
  offset:   number; // initial y offset (px)
}

const PARTICLES: Particle[] = Array.from({ length: N }, (_, i) => ({
  x:        ((i * 79 + 17) % 100) / 100,
  speed:    6 + (i % 6) * 2,
  size:     22 + (i % 5) * 8,
  color:    COLORS[i % COLORS.length],
  shape:    SHAPES[i % SHAPES.length],
  rotSpeed: 4 + (i % 9) * 3,
  offset:   ((i * 137) % H),
}));

export const Confetti: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2 }}>
      {PARTICLES.map((p) => {
        // y wraps from top every full HEIGHT cycle
        const rawY = (p.offset + frame * p.speed) % (H + p.size);
        const y    = rawY - p.size;            // starts slightly above top
        const x    = p.x * W;
        const rot  = (frame * p.rotSpeed) % 360;

        return (
          <div
            key={p.x}
            style={{
              position:  "absolute",
              left:      x,
              top:       y,
              fontSize:  p.size,
              color:     p.color,
              transform: `rotate(${rot}deg)`,
              lineHeight: 1,
              userSelect: "none",
              opacity:   y > H * 0.85 ? 1 - (y - H * 0.85) / (H * 0.15) : 1,
            }}
          >
            {p.shape}
          </div>
        );
      })}
    </div>
  );
};
