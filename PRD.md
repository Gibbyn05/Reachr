# Product Requirements Document (PRD): Reachr

> **Sist oppdatert:** Mars 2026 — v1.4

## 1. Produktvisjon & Oversikt
**Navn:** Reachr
**Målgruppe:** Norske B2B-selgere, gründere og salgsteam (Solo & Team-brukere).
**Formål:** Reachr er et alt-i-ett B2B-verktøy skreddersydd for det norske markedet. Plattformen fungerer som en intelligent søkemotor for leads, et lettvekts CRM-system (pipeline), og et verktøy for automatisert oppfølging (sekvenser for e-post og SMS). Målet er å redusere tiden selgere bruker på prospektering og manuell oppfølging ved å koble offentlige firmadata direkte til salgsaktivitetene.

---

## 2. Brukerhistorier & Kjernefunksjonalitet

### 2.1 Målrettet Leadsøk (Prospektering)
* **Datakilder:** Integrasjon med Brønnøysundregistrene (Brreg), kombinert med web-skraping for berikelse av kontaktinfo (Gule Sider, 1881, Proff, firmasammenkoblinger).
* **Filtrering:** Mulighet for bruker å søke på bransjer (NACE-koder), antall ansatte, poststed/geografi, mva-registrering og omsetningsspenn.
* **Berikelse:** Automatisk forsøk på å finne relevante e-postadresser, telefonnumre og hjemmesider til selskapet ved hjelp av scraping og skreddersydde API-ruter (`/api/enrich`, `/api/email-finder`, `/api/scrape-email`, `/api/enrich/email`).
* **Kartvisning:** Leads kan vises på interaktivt kart via `MapView`-komponenten og `/api/geocode`.
* **Rolleoppslag:** Henter styremedlemmer/daglig leder fra Brreg via `/api/brreg/roller`.
* **CSV Import/Eksport:** Brukere kan importere leads fra CSV/Excel og eksportere hele pipelinen til CSV.
* **Browser-extension:** Støtte for å legge til leads direkte fra nettleseren via `/api/leads/extension`.

### 2.2 CRM & Pipeline Management
* **Visuell Pipeline (Kanban):** Leads kan legges til og flyttes mellom statuser i en visuell tavle.
* **Status-oversikt:** Statuser: `"Ikke kontaktet"`, `"Kontaktet"`, `"Kontaktet - Ikke svar"`, `"Booket møte"`, `"Avslått"`, `"Kunde"`.
* **Salgshistorikk:** Brukere kan legge til notater og se en fullstendig aktivitetstidslinje (`components/leads/activity-timeline.tsx`) per lead via `/api/leads/[id]/activities`.
* **Oppfølgingsvarsler:** Varslinger og påminnelser slik at ingen leads faller gjennom sprekkene.
* **Push-varsler:** Sanntidsnotifikasjoner via `notification-dropdown`-komponenten. API-ruter: `/api/notifications/new-lead`, `/api/notifications/team-activity`, `/api/notifications/test`.

### 2.3 Automatisering & Sekvenser
* **E-post integrasjon:** Brukere kobler til sine egne **Google Workspace** (OAuth via `/api/email/google/*`) eller **Microsoft 365** (OAuth via `/api/email/microsoft/*`) kontoer for å sende e-poster direkte fra sin egen identitet.
* **Sekvensbygger (Drip Campaigns):** Full oversikt over oppfølgingspunkter (Steg 1, Steg 2, osv.) med egendefinerte ventetider mellom hver kontakt. Opprettes i `/sekvenser/ny`.
* **AI Skriver i Sekvenser:** En innebygd AI-assistent (`/api/email/generate`) som lager ferdige utkast basert på bedriftens "Sales Pitch" og "Målgruppe".
  * **Intelligent logikk:** AI-en skiller mellom introduksjon (steg 1) og oppfølging (steg 2+).
  * **Placeholders:** Full støtte for `{{navn}}` og `{{bedrift}}` som automatisk fylles ut ved utsendelse.
* **Automatisk utsendelse:** Cron-job (`/api/cron/sequences`) kjører sekvenser automatisk. Første steg sendes umiddelbart ved 0 dagers ventetid.
* **E-postsporing (tracking):** Åpninger og klikk spores via piksler — `/api/tracking/open/[id]` og `/api/tracking/click/[id]`.
* **Innboks (Unified Inbox):** Samlet innboks for tilkoblede e-postkontoer (`/innboks`). Viser mottatte e-poster fra Gmail og Outlook, matcher avsender mot lagrede leads, og lar brukeren svare direkte fra Reachr.
* **Persistent lagring:** Alle sekvenser, steg, enrollments og statistikk lagres i Supabase.

### 2.4 Kalender & Møtehåndtering
* **Innebygd kalender (`/kalender`):** Måneds-/ukevisning av møter og oppfølgingsaktiviteter.
* **To-do liste:** Brukere kan opprette og fullføre oppgaver direkte i kalendervisningen.
* **Møtepåminnelser:** Automatisk cron-job (`/api/cron/meeting-reminders`) sender påminnelser om kommende møter.
* **Ekstern kalenderintegrasjon:** Lenker til å opprette hendelse i Google Kalender og Outlook, samt ICS-feed via `/api/calendar/feed`.
* **Stemmeopptaker / Transkribering:** Brukere kan ta opp notater med mikrofon. Lyd transkriberes automatisk via `/api/transcribe`.

### 2.5 Salgsanalyser & Rapporter (`/rapporter`)
* **Kun tilgjengelig for teamleder (Owner).**
* **Nøkkeltall:** Totalt leads, konverteringsrate (leads → møte), bookede møter, aktive sekvenser.
* **E-poststatistikk:** Live data fra Reachr — åpningsrate og klikkrate (donutgrafer), e-poster sendt siste 14 dager (stolpediagram med hover-tooltip).
* **Leads-trend:** Ukentlig stolpediagram over leads lagt til (siste 8 uker).
* **Salgstrakt (Funnel):** Visualiserer flyt fra importerte leads → kontaktede → bookede møter → kunder, med konverteringsrate mellom hvert steg.
* **Selger-toppliste (Leaderboard):** Team-oversikt rangert etter bookede møter, med effektivitetsmålinger per selger.

### 2.6 Team & Administrasjon
* **Roller:** `"Owner"` og `"Member"`.
* **Team Plan:** Maks **5 brukere** (1 Eier + 4 Medlemmer). Eier inviterer via e-post (Resend), og kan fjerne medlemmer. Alle deler samme pipeline via RLS på `owner_email`.
* **Invitasjonsflyt:** Inviterte brukere klikker lenke i e-post og er umiddelbart aktive i teamet uten egne abonnementskostnader.

### 2.7 Betalingsløsning og Abonnementer
* **Gateway:** Stripe.
* **Priser (per Mars 2026):**
  * Solo: **249 kr/mnd** (2 388 kr/år — 20% rabatt)
  * Team: **499 kr/mnd** (4 788 kr/år — 20% rabatt)
* **Gratis prøveperiode:** 3 dager gratis for nye brukere.
* **Kundeportal:** Brukere kan administrere fakturaer og endre abonnement via Stripe Customer Portal (`/api/stripe/portal`).
* **Webhooks:** Stripe webhooks (`/api/stripe/webhook`) oppdaterer abonnementsstatus i Supabase.

### 2.8 Admin-panel (`/admin`)
* **Kun tilgjengelig for interne administratorer** (sjekket via `lib/admin.ts`).
* **Brukeroversikt:** Liste over alle registrerte brukere med navn, e-post, firma, sist innlogget, antall leads, teamstørrelse og abonnementsstatus.
* **Sidevisningsstatistikk:** Daglig, ukentlig og månedlig sidevisningsdata via `/api/admin/pageviews`.
* **Sporings-API:** Anonymisert sidevisningssporing via `/api/track` + `components/analytics/page-tracker.tsx`.

### 2.9 Onboarding
* **3-stegs flyt:** Konto → Betaling → Profil.
* **Profildata:** Bruker fyller ut firma, rolle, salgspitch og målgruppe. Lagres i Supabase auth metadata og brukes som kontekst for AI-genererte e-poster.
* **Onboarding-modal:** Vises for nye brukere som ikke har fylt ut profilen.

---

## 3. Arkitektur & Teknologistack

### Frontend
* **Rammeverk:** Next.js 14 (App Router, Server Actions).
* **Språk:** TypeScript.
* **Styling:** Tailwind CSS + Lucide React-ikoner.
* **Animasjoner:** Framer Motion.
* **State management:** Zustand (`store/app-store.ts`) — håndterer leads, sekvenser, brukerdata.
* **UI-komponenter:** `Button`, `Input`, `Badge`, `Select`, `WordRotate`, `FlipWords`, `BorderBeam`, `Glow`, `Mockup`, `TubelightNavbar`.
* **Notifikasjoner:** Sonner (toast).

### Backend / Database
* **Database & Auth:** Supabase (PostgreSQL, Row Level Security, innebygd autentisering).
* **Datamodell (nøkkeltabeller):** `leads`, `team_members`, `subscriptions`, `email_connections`, `email_sequences`, `email_sequence_steps`, `email_sequence_enrollments`, `lead_activities`, `notifications`, `pageviews`, `email_tracking`.
* **Cron-jobs:** `/api/cron/sequences`, `/api/cron/weekly-report`, `/api/cron/meeting-reminders` (kjøres via Vercel Cron eller ekstern scheduler).

### Eksterne Integrasjoner
* **Stripe:** Betaling, webhooks, subscription management, customer portal.
* **Resend:** Transaksjonelle e-poster (invitasjoner, ukentlig rapport, kontaktskjema, møtepåminnelser).
* **Brreg API:** Åpne firmadata (org.nr, adresse, bransje, roller/styremedlemmer).
* **Google Cloud OAuth:** Gmail-integrasjon for sending og lesing av e-poster.
* **Microsoft Entra ID (Azure AD):** Outlook-integrasjon for sending og lesing av e-poster.
* **Anthropic Claude API:** AI-generering av e-postutkast og SMS.

---

## 4. Sikkerhet / Personvern (Security & Compliance)

* **GDPR og Web-skraping:** Kun offentlige bedriftsdata og offisielle kontakt-e-poster skrapes (avviser private adresser, noreply@ e.l.).
* **API Sikkerhet:** Alle backend-ruter validerer `supabase.auth.getUser()` og returnerer HTTP 401 for uautoriserte forespørsler.
* **Dataseparasjon (RLS):** Supabase Row Level Security sikrer at Team A sine data ikke er tilgjengelig for Team B.
* **E-postsporing:** Åpnings- og klikksporingspiksler anonymiseres og brukes kun til statistikk, ikke videresolgt.
* **Personvern- og vilkårssider:** `/personvern` og `/vilkaar` er tilgjengelige for alle brukere.

---

## 5. Viktige Brukerflyter (User Journeys)

1. **Onboarding:** Registrer deg → Velg plan (Solo/Team) → 3 dagers gratis prøveperiode via Stripe → Fyll ut salgsprofil → Dashboard.
2. **Finne en kunde:** Leadsøk → Søk på "Rørleggere i Oslo" → Filtrer etter størrelse/omsetning → Se kontaktinfo (berikede e-poster) → Legg til i pipeline.
3. **Sekvenser & Oppfølging:** Sekvenser → AI Skriver → Lag 3-stegs kampanje → Lagre. Mine Leads → Velg lead → "Legg til i sekvens" → Første e-post sendes umiddelbart.
4. **Innboks & Svar:** Gå til Innboks → Se svar fra lead → Systemet kobler e-post til lead-profilen → Svar direkte fra Reachr.
5. **Analyse:** Rapporter → Se konverteringsrate, åpningsrate, salgstrakt og team-leaderboard → Identifiser flaskehalser.
6. **Møtehåndtering:** Kalender → Se bookede møter → Legg til oppgaver → Motta automatisk påminnelse → Transcriber notat etter møtet.
7. **Team:** Innstillinger → Team → Inviter kollega via e-post → Kollega klikker lenke → Er umiddelbart aktiv i samme pipeline.
8. **Fakturering:** Innstillinger → Abonnement → Stripe Kundeportal → Endre plan eller last ned fakturaer.
9. **Ukentlig oppsummering:** Cron-job kjører hver uke og sender eier en e-postoppsummering med nøkkelstatistikk.

---

## 6. Fremtidig Funksjonalitet (Roadmap)

### 6.1 Toveis E-post synkronisering (Reply Detection) 📧
* **Formål:** Gjøre sekvenser smarte slik at de automatisk stopper når kunden svarer.
* **Funksjon:** Lytte på innboks via Webhooks/PubSub (Gmail og Outlook) for å fange opp svar, Out-of-Office og bounce — og oppdatere lead-status automatisk.

### 6.2 Avansert Sekvens-analyse 📊
* **Formål:** Vise hvilke AI-e-postmaler som genererer flest svar per bransje.
* **Funksjon:** Per-sekvens statistikk for åpningsrate, svarprosent og konvertering. Mulighet for A/B-testing av emnelinjer.

### 6.3 LinkedIn-integrasjon 🔗
* **Formål:** Berike leads med LinkedIn-profiler og se felles koblinger.
* **Funksjon:** Lenke til LinkedIn-profil fra lead-kortet, og mulighet for å sende connection request eller InMail som en del av en sekvens.

### 6.4 Mobilapp (iOS/Android) 📱
* **Formål:** Gi selgere tilgang til pipeline og varsler på farten.
* **Funksjon:** Kompakt visning av pipeline, push-varsler, og mulighet til å logge aktivitet etter et møte.
