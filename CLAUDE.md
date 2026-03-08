# CLAUDE.md — Reachr

## Hva er Reachr?
Reachr er en norsk B2B-salgs SaaS. Brukere søker etter bedrifter fra Brønnøysundregistrene (250 000+ norske selskaper), legger dem til i en CRM-pipeline, og følger dem opp med AI-genererte e-poster og SMS. Appen hjelper selgere finne, kontakte og lukke deals raskere.

---

## Tech stack
- **Framework:** Next.js 14 (App Router) — TypeScript
- **Styling:** Tailwind CSS v3
- **Animasjoner:** Framer Motion
- **Auth + DB:** Supabase (auth, Postgres for leads/teams)
- **State:** Zustand (`store/app-store.ts`)
- **Ikoner:** Lucide React
- **Deployment:** Vercel

---

## Designsystem
Warm cream-palette — inspirert av native.no:

| Token | Verdi | Bruk |
|---|---|---|
| Cream bg | `#f2efe3` | Sidebakgrunn, seksjoner |
| Card bg | `#faf8f2` | Kort, modaler |
| Alt bg | `#ede9da` | Annenhver seksjon |
| Primærtekst | `#171717` | Overskrifter, innhold |
| Dempet tekst | `#6b6660` | Labels, undertekst |
| Svak tekst | `#a09b8f` | Plassholdere, metadata |
| Border | `#d8d3c5` | Alle kanter |
| Hover | `#e8e4d8` | Hover-bakgrunn |
| Grønn accent | `#09fe94` | Primærknapp, aktiv status |
| Oransje accent | `#ff470a` | Lenker, sekundær CTA, advarsler |
| Gul accent | `#ffad0a` | Møtestatus, tredje nivå |
| Mørk | `#171717` | Sidebar, velkomstbanner |

**Skrift:** EB Garamond (display/logotype), Inter (UI)
**Knapper:** `bg-[#09fe94] text-[#171717]` for primær. Se `components/ui/button.tsx`.
**Input:** Alltid `bg-[#faf8f2] border-[#d8d3c5]` med grønn focus-ring.

---

## Mappestruktur

```
app/
  page.tsx                   # Landingsside
  (app)/                     # Beskyttet app (krever auth)
    layout.tsx                # App-shell med Sidebar
    dashboard/page.tsx        # Oversikt, stats, oppfølgingsliste
    leadsok/page.tsx          # Søk i Brønnøysund + kartvisning
    mine-leads/page.tsx       # CRM-pipeline, notatpanel, AI e-post/SMS
    varsler/page.tsx          # Oppfølgingsvarsler
    innstillinger/page.tsx    # Profil, team, fakturering, varsler, sikkerhet
  (auth)/                    # Auth-sider
    login/page.tsx
    register/page.tsx

components/
  landing/                   # Alle seksjoner på landingssiden
    navbar.tsx                # Sticky navbar med pill-animasjon
    hero.tsx                  # Hero med WordRotate + marquee-kort
    how-it-works.tsx          # 3 steg med mockup-kort
    features.tsx              # Bento-grid 3-kol (2+1 / 1+2 / 2+1)
    comparison.tsx            # Sammenligningstabell
    pricing.tsx               # Prisplaner
    testimonials.tsx          # Kundeuttalelser
    om-oss.tsx                # Team, verdier, statistikk
    kontakt.tsx               # Kontaktskjema
    cta-banner.tsx            # Avsluttende CTA
    footer.tsx                # Footer med lenker

  layout/
    sidebar.tsx               # Fast venstremeny (bg #171717)
    top-bar.tsx               # Sticky topbar per side

  ui/
    button.tsx                # Button med variant/size props
    input.tsx                 # Input med ikon-støtte
    badge.tsx                 # Statusbadges
    word-rotate.tsx           # Animert ordskifter (hero)

lib/
  supabase/                  # Supabase client/server helpers
  mock-data.ts               # Lead-type-definisjoner + mockdata
  utils.ts                   # cn() helper

store/
  app-store.ts               # Zustand: currentUser, leads, avatarUrl
```

---

## Lead-statuser (fast sett)
`"Ikke kontaktet"` | `"Kontaktet"` | `"Kontaktet - ikke svar"` | `"Booket møte"` | `"Avslått"` | `"Kunde"`

---

## Viktige mønstre

### Leads lagres i Supabase
Tabellen heter `leads`. Lastes via `loadLeads(email)` i Zustand-store. Alle CRUD-operasjoner går gjennom `useAppStore`.

### Oppfølgingslogikk
`needsFollowUpReason(lead)` i `dashboard/page.tsx` og `countNeedsFollowUp()` i sidebar beregner om et lead trenger kontakt basert på `addedDate` og `lastContacted`.

### Leadsøk
`leadsok/page.tsx` kaller Brønnøysund-API direkte fra klienten. Støtter fritekst, bransjefilter, kommunefilter, omsetningsspenn, ansattefilter og MVA-registrering. Har list- og kartvisning.

### AI e-post/SMS
I `mine-leads/page.tsx` — `AiEmailModal` og `AiSmsModal` kaller `/api/ai/email` og `/api/sms/send`. Bruker `currentUser.salesPitch` og `currentUser.targetCustomers` som kontekst.

---

## Nøkkelregler ved utvikling
1. **Aldri bruk blå** (`#2563EB`) — bruk grønn (`#09fe94`) for primær, oransje (`#ff470a`) for lenker.
2. **Aldri `bg-white`** — bruk `bg-[#faf8f2]` eller `bg-[#f2efe3]`.
3. **Aldri `text-slate-900`/`text-gray-500`** — bruk `#171717` / `#6b6660`.
4. **Borders alltid `border-[#d8d3c5]`**, ikke `border-gray-200`.
5. EB Garamond kun på logoen og display-overskrifter på landingssiden.
6. Bruk `Button`-komponenten fremfor egne knapper der mulig.

---

## Kjøring lokalt
```bash
npm install
cp .env.local.example .env.local   # Fyll inn Supabase + evt. Sveve SMS
npm run dev                         # http://localhost:3000
```
