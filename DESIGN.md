---
name: Reachr
description: B2B prospecting and outreach for the Norwegian market
colors:
  signal-green: "#09fe94"
  signal-green-hover: "#00e882"
  signal-green-accessible: "#008f52"
  ember-orange: "#ff470a"
  amber-marker: "#ffad0a"
  kull: "#171717"
  ink: "#3d3a34"
  stein: "#6b6660"
  svak: "#a09b8f"
  stone: "#d8d3c5"
  driftwood: "#e8e4d8"
  birch: "#f2efe3"
  linen: "#faf8f2"
  sand: "#ede9da"
fonts:
  display: "EB Garamond"
  ui: "Inter"
---

# Design System: Reachr

## Creative North Star

**"The Nordic Sales Floor"** — efficient, purposeful, quietly confident. Like a well-run Bergen office where every tool earns its place. The interface disappears into the work.

## Color System

### Brand Colors

| Token | Hex | Role |
|---|---|---|
| Signal Green | `#09fe94` | Primary CTA, active states, success badges. Scarce by design — max 10% of any viewport. |
| Signal Green Hover | `#00e882` | Hover state for Signal Green buttons |
| Signal Green Accessible | `#008f52` | Text-on-light when green must be readable (badges, inline labels) |
| Ember Orange | `#ff470a` | Links, secondary CTA, warnings, destructive accents |
| Amber Marker | `#ffad0a` | Meeting status ("Booket møte"), tertiary accents |

### Neutral Palette (Tonal Layering)

Depth comes from background shifts, not box-shadow. Surfaces stack tonally:

| Token | Hex | Role |
|---|---|---|
| Kull | `#171717` | Sidebar, dark sections (comparison, CTA banner), primary text |
| Ink | `#3d3a34` | Body text, form values |
| Stein | `#6b6660` | Secondary text, labels, descriptions |
| Svak | `#a09b8f` | Placeholders, metadata, timestamps. **Caution:** ~2.5:1 contrast on light backgrounds — use only for non-essential text |
| Stone | `#d8d3c5` | **The one border color.** All borders everywhere. |
| Driftwood | `#e8e4d8` | Hover backgrounds, subtle separators |
| Sand | `#ede9da` | Alternating section backgrounds |
| Birch | `#f2efe3` | Page background, primary surface |
| Linen | `#faf8f2` | Card surfaces, modals, elevated content |

### Named Rules

1. **No Blue Rule** — never `#2563EB` or any blue neighbor. Green for primary, orange for links.
2. **Signal Green Ceiling** — Signal Green covers max 10% of any viewport. It's an accent, not a surface.
3. **No bg-white** — always `#faf8f2` (Linen) or `#f2efe3` (Birch). Never `bg-white`.
4. **Stone Monopoly** — all borders use `border-[#d8d3c5]`. Never `border-gray-200` or variants.
5. **Garamond Ceiling** — EB Garamond is for the logotype and landing page display headings only. Never in the app UI.
6. **Green Glow Monopoly** — only the primary CTA button gets `shadow-[0_2px_12px_rgba(9,254,148,0.3)]`. No other element.
7. **Svak Text Warning** — `#a09b8f` fails WCAG AA on light backgrounds (~2.5:1). Use only for truly non-essential metadata (timestamps, placeholder text). Never for labels or body text.

## Typography

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display headings (landing only) | EB Garamond | 700 | `font-display` class. `clamp(2.5rem, 5vw, 4.5rem)`. Never in the app. |
| Logotype | EB Garamond | 800 | "Reachr" text next to logo |
| UI headings | Inter | 800 (extrabold) | Page titles, card headings, stats |
| UI body | Inter | 400–600 | All app text |
| Labels | Inter | 600–700 | Form labels, nav items |
| Small/meta | Inter | 400–500 | `text-xs` or `text-sm`, color Stein or Svak |

### Scale

- Display: `clamp(2.5rem, 5vw, 4.5rem)` — landing headings
- H1 app: `text-2xl` (24px) extrabold
- H2 app: `text-lg` (18px) extrabold
- Body: `text-sm` (14px) regular
- Small: `text-xs` (12px)
- Line heights: `leading-relaxed` for body, `leading-[0.95]` for display

## Elevation

**Hybrid: tonal layering + accent glow.**

- Surfaces are flat at rest — depth from background color shifts (Birch → Linen → white)
- Shadows appear only on hover or active state: `hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]`
- Primary CTA gets the Signal Glow: `shadow-[0_2px_12px_rgba(9,254,148,0.3)]`
- No other element gets a colored glow

## Interaction Feel

**Precise and responsive.** Snap-fast transitions, exact edges. The tool respects your time.

- `transition-all duration-200` baseline
- `hover:-translate-y-0.5` on interactive cards
- Focus rings: `focus:border-[#09fe94]/60 focus:ring-2 focus:ring-[#09fe94]/15`
- No bounce, no elastic easing

## Components

### Buttons

5 variants defined in `components/ui/button.tsx`:

| Variant | Style |
|---|---|
| `primary` | `bg-[#09fe94] hover:bg-[#00e882] text-[#171717]` + Signal Glow |
| `secondary` | `bg-[#faf8f2] hover:bg-[#e8e4d8] text-[#171717] border border-[#d8d3c5]` |
| `ghost` | `bg-transparent hover:bg-[#e8e4d8] text-[#3d3a34]` |
| `danger` | `bg-[#ff470a] hover:bg-[#e03c08] text-white` |
| `outline` | `bg-transparent hover:bg-[#09fe94]/10 text-[#171717] border border-[#d8d3c5]` |

3 sizes: `sm` (px-3 py-1.5 text-xs), `md` (px-4 py-2 text-sm), `lg` (px-6 py-2.5 text-sm)

### Inputs

`bg-[#faf8f2] border-[#d8d3c5]` with green focus ring. Always `rounded-xl` in forms, `rounded-lg` in app.

### Status Badges

6 fixed lead statuses with assigned colors:

| Status | Background | Text |
|---|---|---|
| Ikke kontaktet | `#e8e4d8` | `#6b6660` |
| Kontaktet | `#09fe94` | `#065c3a` |
| Kontaktet - ikke svar | `#ff470a` | `#fff` |
| Booket møte | `#ffad0a` | `#7a4f00` |
| Avslått | `#ff470a` | `#fff` |
| Kunde | `#171717` | `#09fe94` |

### Sidebar

Fixed left sidebar: `bg-[#171717]`, full viewport height. Nav items use `text-white/60` default, `text-white` active with a `bg-white/10` rounded background.

### Cards

`bg-[#faf8f2] border border-[#d8d3c5] rounded-2xl`. Flat at rest, `hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]` on interactive cards.

## Layout

- Max content width: `max-w-5xl` (1024px) for landing, varies in app
- Section padding: `py-28 px-6` for landing sections
- Grid: `grid-cols-1 md:grid-cols-2` or `lg:grid-cols-3` with `gap-4` to `gap-6`
- Sidebar width: fixed `w-64` (256px)

## Motion

- Framer Motion for scroll-triggered reveals (`whileInView`)
- `duration: 0.5` baseline, `staggerChildren: 0.12`
- Entrance: `opacity: 0, y: 24–30` → `opacity: 1, y: 0`
- Reduce motion: respect `prefers-reduced-motion`
- Hero marquee: continuous `useAnimationFrame` scroll of lead cards

## Dark Sections

Comparison and CTA banner use `bg-[#171717]` with:
- Headings: `text-white`
- Body: `text-white/50` to `text-white/80`
- Borders: `border-white/10`
- Green accent: `text-[#09fe94]` with `filter: brightness(0.85)` for softer glow
