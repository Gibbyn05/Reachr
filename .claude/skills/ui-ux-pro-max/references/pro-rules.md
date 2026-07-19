# Common Rules for Professional UI + Pre-Delivery Checklist

Load this file before final delivery of UI code, or when the user reports the UI "doesn't look professional" and the cause isn't obvious from the priority table in SKILL.md.

## Icons & Visual Elements

| Rule | Standard | Avoid |
|------|----------|-------|
| No Emoji as Structural Icons | Use vector-based icons (Lucide for Reachr) | Using emojis for navigation, settings, or system controls |
| Vector-Only Assets | Use SVG or platform vector icons that scale cleanly | Raster PNG icons that blur or pixelate |
| Stable Interaction States | Use color, opacity, or elevation transitions for press states | Layout-shifting transforms that move surrounding content |
| Consistent Icon Sizing | Define icon sizes as design tokens (icon-sm, icon-md = 24pt, icon-lg) | Mixing arbitrary values randomly |
| Stroke Consistency | Use a consistent stroke width (e.g. 1.5px or 2px) | Mixing thick and thin stroke styles |
| Touch Target Minimum | Minimum 44x44pt interactive area | Small icons without expanded tap area |
| Icon Alignment | Align icons to text baseline and maintain consistent padding | Misaligned icons or inconsistent spacing |
| Icon Contrast | Follow WCAG: 4.5:1 for small elements, 3:1 for larger UI glyphs | Low-contrast icons blending into background |

## Interaction

| Rule | Do | Don't |
|------|----|----- |
| Tap feedback | Provide clear pressed feedback within 80-150ms | No visual response on tap |
| Animation timing | Keep micro-interactions around 150-300ms with natural easing | Instant transitions or slow animations (>500ms) |
| Disabled state clarity | Use disabled semantics, reduced emphasis, and no tap action | Controls that look tappable but do nothing |
| Touch target minimum | Keep tap areas >=44x44pt, expand hit area when icon is smaller | Tiny tap targets |

## Light/Dark Mode Contrast

| Rule | Do | Don't |
|------|----|----- |
| Surface readability | Keep cards/surfaces clearly separated from background | Overly transparent surfaces that blur hierarchy |
| Text contrast (light) | Maintain body text contrast >=4.5:1 | Low-contrast gray body text |
| Text contrast (dark) | Maintain primary text contrast >=4.5:1 on dark surfaces | Dark mode text blending into background |
| Border visibility | Ensure separators visible in both themes | Theme-specific borders disappearing in one mode |
| Token-driven theming | Use semantic color tokens mapped per theme | Hardcoded per-screen hex values |

## Layout & Spacing

| Rule | Do | Don't |
|------|----|----- |
| Safe-area compliance | Respect top/bottom safe areas for fixed headers and tab bars | Placing fixed UI under notch or gesture area |
| Consistent content width | Keep predictable content width per device class | Mixing arbitrary widths between screens |
| 8dp spacing rhythm | Use consistent 4/8dp spacing system for padding/gaps | Random spacing increments |
| Section spacing hierarchy | Define clear vertical rhythm tiers (e.g. 16/24/32/48) | Similar UI levels with inconsistent spacing |

## Pre-Delivery Checklist

### Visual Quality
- [ ] No emojis used as icons (use SVG / Lucide instead)
- [ ] All icons from consistent icon family and style
- [ ] Pressed-state visuals do not shift layout bounds
- [ ] Semantic theme tokens used consistently (no ad-hoc hardcoded colors)

### Interaction
- [ ] All tappable elements provide clear pressed feedback
- [ ] Touch targets meet minimum size (>=44x44pt)
- [ ] Micro-interaction timing stays in 150-300ms range
- [ ] Disabled states are visually clear and non-interactive
- [ ] Screen reader focus order matches visual order

### Light/Dark Mode
- [ ] Primary text contrast >=4.5:1 in both modes
- [ ] Secondary text contrast >=3:1 in both modes
- [ ] Dividers/borders distinguishable in both modes
- [ ] Both themes tested before delivery

### Layout
- [ ] Safe areas respected for headers and fixed bars
- [ ] Scroll content not hidden behind fixed/sticky bars
- [ ] Verified on small phone, large phone, and tablet
- [ ] 4/8dp spacing rhythm maintained
- [ ] Long-form text readable on larger devices

### Accessibility
- [ ] All meaningful images/icons have accessibility labels
- [ ] Form fields have labels, hints, and clear error messages
- [ ] Color is not the only indicator
- [ ] Reduced motion preference supported
