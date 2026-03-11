# Product Requirements Document (PRD): Reachr

## 1. Produktvisjon & Oversikt
**Navn:** Reachr  
**Målgruppe:** Norske B2B-selgere, gründere og salgsteam (Solo & Team-brukere).  
**Formål:** Reachr er et alt-i-ett B2B-verktøy skreddersydd for det norske markedet. Plattformen fungerer som en intelligent søkemotor for leads, et lettvekts CRM-system (pipeline), og et verktøy for automatisert oppfølging (sekvenser for e-post og SMS). Målet er å redusere tiden selgere bruker på prospektering og manuell oppfølging ved å koble offentlige firmadata direkte til salgsaktivitetene.

## 2. Brukerhistorier & Kjernefunksjonalitet

### 2.1 Målrettet Leadsøk (Prospektering)
* **Datakilder:** Integrasjon med Brønnøysundregistrene (Brreg), kombinert med web-skraping for berikelse av kontaktinfo (Gule Sider, 1881, Proff, firmasammenkoblinger).
* **Filtrering:** Mulighet for bruker å søke på bransjer (NACE-koder), antall ansatte, poststed/geografi, mva-registrering.
* **Berikelse:** Automatisk forsøk på å finne relevante e-postadresser, telefonnumre og hjemmesider til selskapet ved hjelp av scraping og skreddersydde API-ruter (`/api/enrich`, `/api/email-finder`).

### 2.2 CRM & Pipeline Management
* **Visuell Pipeline (Kanban):** Leads kan legges til i en visuell tavle.
* **Status-oversikt:** Statuser som "Ikke kontaktet", "Kontaktet", "Kontaktet - Ikke svar", "Booket møte", "Avslått", og "Kunde".
* **Salgshistorikk:** Brukere kan legge til notater og følge med på når selskapet sist ble kontaktet.
* **Oppfølgingsvarsler:** Varslinger og påminnelser slik at ingen leads faller gjennom sprekkene (ofte levert som en "ukentlig rapport" via e-post).

### 2.3 Automatisering & Sekvenser
* **E-post integrasjon:** Brukere kan koble til sine egne **Google Workspace** eller **Microsoft 365** kontoer for å sende målrettede og personaliserte B2B-eposter direkte fra sin egen identitet.
* **Sekvensbygger (Drip Campaigns):** Full oversikt over oppfølgingspunkter (Steg 1, Steg 2, osv.) med egendefinerte ventetider mellom hver kontakt.
* **AI Skriver i Sekvenser:** En innebygd AI-assistent i sekvensbyggeren som lager ferdige utkast basert på bedriftens "Sales Pitch" og "Målgruppe".
    *   **Intelligent logikk:** AI-en skiller mellom introduksjon (steg 1) og oppfølging (steg 2+), der oppfølginger holdes korte (maks 2 setninger) og refererer naturlig til forrige kontakt.
    *   **Placeholders:** Full støtte for `{{navn}}` og `{{bedrift}}` som automatisk fylles ut ved utsendelse.
* **Automatisk utsendelse:** Ved påmelding til en sekvens sendes første steg umiddelbart dersom ventetiden er satt til 0 dager.
* **Persistent lagring:** Alle sekvenser, steg og medlemskap lagres trygt i databasen og synkroniseres på tvers av enheter.

### 2.4 Team & Administrasjon
* **Roller:** "Owner" og "Member".
* **Team Plan:** Begrensning satt opp til **maks 5 brukere** (1 Eier + 4 Medlemmer). Eier kan invitere og administrere ("Remove") medlemmer. Medlemmer får betalt via bedriftens felles Stripe-abonnement og deler samme pipeline/data-område (styrt via RLS (Row Level Security) relatert til `owner_email`).

### 2.5 Betalingsløsning og Abonnementer
* **Gateway:** Stripe.
* **Modeller:** 
  * "Solo" (passer for enkeltpersoner, 1 bruker).
  * "Team" (opptil 5 brukere på samme regning).
  * Tilbyr 3-dagers gratis prøveperiode før kunden trekkes. Både månedlig og årlig ("Årlig -20%") fakturering.

---

## 3. Arkitektur & Teknologistack

### Frontend
* **Rammeverk:** Next.js (App Router, Server Actions).
* **Språk:** TypeScript.
* **Styling:** Tailwind CSS + Radix UI / Lucide React-ikoner for et minimalistisk, skandinavisk og "premium" design (Vibrant greens, greyscale og clean whitespace).

### Backend / Database
* **Database & Auth:** Supabase (PostgreSQL, in-built Authentication og Row Level Security).
* **Datamodell (Key tables):** `leads`, `team_members`, `subscriptions`, `email_connections`, `email_sequences`, `email_sequence_steps`, `email_sequence_enrollments`.

### Eksterne Integrasjoner
* **Stripe:** Betaling, Webhooks, Håndtering av Subscriptions.
* **Resend:** For transaksjonelle e-poster (kvitteringer, invitasjoner til plattformen, ukentlig oppsummering, kontakt-skjemaer).
* **Brreg API:** Henting av åpne data (org.nr, adresse, roller/styremedlemmer).
* **Google Cloud Oauth / Microsoft Entra ID:** E-post integrasjon for klient-brukerne (sending).

---

## 4. Sikkerhet / Personvern (Security & Compliance)
* **GDPR og Web-skraping:** Web-skrapes kun offentlige bedriftsdata og offisielle kontakt-eposter (avviser sensitive privatadresser, noreply@ e.t.c pga reguleringer for B2B-markedsføring). 
* **API Sikkerhet:** Alle REST og Next.js backend-ruter (f.eks `api/enrich`, `api/scrape-email`) validerer tilstedeværelse av `supabase.auth.getUser()`. Returnerer hardgrense (HTTP 401) for gjester for å beskytte mot System-Side Request Forgery og misbruk av servertid.
* **Dataseparason (RLS):** Supabase RLS (Row Level Security) sikrer at "Tenant A" (Bruker A / Team A sine leads) ikke kan leses, endres eller slettes av "Tenant B".

---

## 5. Viktige Brukerflyter (User Journeys)
1. **Onboarding:** Bruker registrerer ("Sign up") -> Velger plan ("Solo" eller "Team") -> Starter 3-dagers gratis prøveperiode gjennom Stripe -> Kommer inn i Dashboard.
2. **Finne en kunde:** Går til "Finn Leads" -> Søker på "Rørleggere i Oslo" -> Får liste opp via Brreg -> Velger "Legg til i pipeline".
3. **Sekvenser & Oppfølging:** Går til "Sekvenser" -> Bruker "AI Skriver" for å lage en 3-stegs plan -> Lagrer. Går til "Mine Leads" -> Velger lead -> "Legg til i sekvens" -> Første e-post sendes umiddelbart (hvis 0 dager ventetid).
4. **Organisasjon:** Innstillinger -> Team -> Skriver e-post til kollega -> Kollega mottar profesjonelt stylet "Reachr" invitasjonsepost -> Klikker -> Logges direkte inn og kan se samme Pipeline. Eier kan fjerne tilgang når kollegaen slutter.
5. **Analytics/Oppsummering:** Hver uke kjører et Cron-job script og e-poster Owner en fin infografikk om ukens "added leads" vs "contacted".

---

## 6. Fremtidig Funksjonalitet (Roadmap)

### 6.1 Toveis E-post synkronisering (Reply Detection) 📧
* **Formål:** Gjøre "Drip-kampanjene" (sekvensene) smarte slik at de automatisk stopper hvis kunden svarer på en e-post.
* **Funksjon:** Lytte på innboksen via Webhooks/PubSub for Gmail og Outlook for å fange opp innkomne svar (reply), Out-of-Office, eller Bounced e-poster, og oppdatere lead-statusen deretter.

### 6.2 CSV Import & Eksport 📊
* **Formål:** Gjøre det enkelt å bytte fra gamle Excel-ark eller flytte data til/fra andre systemer.
* **Funksjon:**
  * Import: En drag-and-drop opplaster for å dra inn leads via CSV eller Excel, uavhengig av Brreg-søket.
  * Eksport: Laste ned Pipelinen til en CSV-fil (f.eks. for bruk i markedsføring eller egne presentasjoner).

### 6.3 Analysedashboard (Sales Metrics) 📊
* **Formål:** Gi team og eier full innsikt i hvordan salgsarbeidet går direkte i plattformen.
* **Funksjon:** 
  * Interaktive dashboard-grafer som viser "Hit Rate" (f.eks antall bookede møter over tid).
  * Statistikker på hvilke AI-maler som genererer flest svar.
  * Et "Leaderboard" (poengtavle) for "Team" brukere for litt vennskapelig gamification og konkurranse internt i salgsteamet.
