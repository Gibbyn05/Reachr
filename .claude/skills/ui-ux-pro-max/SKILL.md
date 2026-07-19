# UI/UX Pro Max - Design Intelligence Skill

## Overview

This skill provides a searchable database for UI/UX design decisions. It contains 84 styles, 192 color palettes, 74 font pairings, 192 product types with reasoning rules, 98 UX guidelines, 104 icon entries, 16 GSAP motion presets, and 25 chart types.

## When to Use

Apply this skill when tasks involve visual design, interaction patterns, or user experience quality: designing new pages, creating/refactoring UI components, choosing color/typography/spacing/layout systems, reviewing UI for UX/accessibility/consistency.

Skip for backend logic, infrastructure work, or non-visual scripts unless the task affects how something looks or functions interactively.

## Reachr-Specific Overrides

This project uses a warm cream palette (see CLAUDE.md). When this skill suggests colors or styles, adapt recommendations to Reachr's design system:
- Primary button: `bg-[#09fe94] text-[#171717]` (green accent)
- Backgrounds: `#f2efe3` (page), `#faf8f2` (cards), `#ede9da` (alt sections)
- Text: `#171717` (primary), `#6b6660` (muted), `#a09b8f` (weak)
- Borders: `#d8d3c5`
- Accent: `#ff470a` (links/CTA), `#ffad0a` (meetings/warnings)
- Fonts: EB Garamond (display), Inter (UI)
- Never use blue, bg-white, or text-slate/text-gray

## Priority Rule Categories (1-10)

| Priority | Category | Focus |
|----------|----------|-------|
| 1 | Accessibility | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels |
| 2 | Touch & Interaction | Minimum 44x44px buttons, 8px+ spacing |
| 3 | Performance | WebP/AVIF formats, lazy loading, CLS < 0.1 |
| 4 | Style Selection | Match product type, use SVG icons (no emoji) |
| 5 | Layout & Responsive | Mobile-first breakpoints, no horizontal scroll |
| 6 | Typography & Color | Base 16px type, 1.5 line-height, semantic tokens |
| 7 | Animation | 150-300ms duration, motion conveys meaning |
| 8 | Forms & Feedback | Visible labels, Error near field, Helper text |
| 9 | Navigation Patterns | Predictable back, bottom nav <= 5 items |
| 10 | Charts & Data | Legends, tooltips, accessible color choices |

## How to Search the Database

Search by domain using data CSV files:

- **Product type**: `data/products.csv` — match product to recommended styles
- **Colors**: `data/colors.csv` — 192 palettes by product type
- **Typography**: `data/typography.csv` + `data/google-fonts.csv` — 74 font pairings
- **Styles**: `data/styles.csv` — 84 UI styles (general, landing, dashboard)
- **UX Guidelines**: `data/ux-guidelines.csv` — 98 rules by category
- **Icons**: `data/icons.csv` — icon family recommendations
- **Motion/Animation**: `data/motion.csv` — GSAP presets and timing
- **Charts**: `data/charts.csv` — chart type selection by data type
- **Landing pages**: `data/landing.csv` — landing page patterns
- **App interfaces**: `data/app-interface.csv` — app UI patterns
- **React performance**: `data/react-performance.csv` — React-specific optimizations
- **UI reasoning**: `data/ui-reasoning.csv` — design decision reasoning rules

## Before Delivery

Consult `references/pro-rules.md` for the pre-delivery checklist covering icon/visual-element discipline, interaction feedback, light/dark contrast, safe-area layout, and accessibility.

Consult `references/quick-reference.md` for the full rule set across all 10 priority categories.
