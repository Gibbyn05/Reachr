// Design tokens — same as the web app (CLAUDE.md)
export const C = {
  cream:   "#f2efe3",
  card:    "#faf8f2",
  alt:     "#ede9da",
  dark:    "#171717",
  text:    "#171717",
  muted:   "#6b6660",
  faint:   "#a09b8f",
  border:  "#d8d3c5",
  hover:   "#e8e4d8",
  green:   "#09fe94",
  orange:  "#ff470a",
  yellow:  "#ffad0a",
} as const;

// Video dimensions (9:16, TikTok full-HD)
export const W  = 1080;
export const H  = 1920;
export const SC = W / 405; // scale factor from the 405px web design

// Typography helpers
export const INTER    = "Inter, system-ui, sans-serif";
export const GARAMOND = "EB Garamond, Georgia, serif";
