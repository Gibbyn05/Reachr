import Link from "next/link";

export const metadata = { title: "Personvern – Reachr" };

export default function PersonvernPage() {
  return (
    <div className="min-h-screen bg-[#f2efe3]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-[#ff470a] hover:underline mb-8 inline-block">← Tilbake til forsiden</Link>
        <h1 className="font-display text-4xl font-bold text-[#171717] mb-2">Personvernerklæring</h1>
        <p className="text-[#a09b8f] text-sm mb-12">Sist oppdatert: mars 2026</p>

        <div className="space-y-10 text-[#3d3a34]">
          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">1. Behandlingsansvarlig</h2>
            <p className="leading-relaxed">Reachr AS er behandlingsansvarlig for personopplysninger som behandles i forbindelse med bruk av tjenesten reachr.no. Spørsmål om personvern kan rettes til <a href="mailto:Help@reachr.no" className="text-[#ff470a] hover:underline">Help@reachr.no</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">2. Hvilke opplysninger samler vi inn?</h2>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>Navn og e-postadresse ved registrering</li>
              <li>Bedriftsnavn og salgsinformasjon du fyller inn i profilen din</li>
              <li>Leads og notater du legger til i CRM-pipelinen</li>
              <li>Betalingsinformasjon behandles av Stripe – vi lagrer ikke kortdata</li>
              <li>Innloggingsaktivitet og teknisk informasjon (IP-adresse, nettleser)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">3. Formål med behandlingen</h2>
            <p className="leading-relaxed mb-3">Vi behandler personopplysninger for å:</p>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>Levere og forbedre Reachr-tjenesten</li>
              <li>Administrere brukerkontoer og abonnementer</li>
              <li>Sende nødvendige service-e-poster (faktura, invitasjoner)</li>
              <li>Forebygge misbruk og ivareta sikkerheten i tjenesten</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">4. Tredjepartsintegrasjoner (Google og Microsoft)</h2>
            <p className="leading-relaxed mb-3">Reachr tilbyr valgfri integrasjon med Google (Gmail og Google Kalender) og Microsoft (Outlook og Outlook Kalender). Disse integrasjonene er helt frivillige og aktiveres kun dersom brukeren selv kobler til kontoen sin via OAuth.</p>
            <p className="leading-relaxed font-semibold mb-2">Google-integrasjon:</p>
            <ul className="list-disc list-inside space-y-2 leading-relaxed mb-3">
              <li><strong>Gmail (send/les):</strong> Brukes til å sende og lese e-poster direkte fra Reachr på vegne av brukeren. Vi ber om <code>gmail.send</code>, <code>gmail.readonly</code> og <code>gmail.modify</code>.</li>
              <li><strong>Google Kalender (kun lesing):</strong> Vi henter brukerens eksisterende kalenderoppføringer via <code>calendar.readonly</code> og viser dem i Reachrs innebygde kalendervisning. Vi oppretter, endrer eller sletter aldri kalenderoppføringer.</li>
              <li>Google-data brukes utelukkende for å levere den beskrevne funksjonaliteten til den innloggede brukeren. Dataene deles ikke med tredjeparter, brukes ikke til reklame, og brukes ikke til å trene AI/ML-modeller.</li>
              <li>Access token og refresh token lagres kryptert i brukerens egen konto i Supabase (EU-region). Kalenderdata bufres ikke — den hentes på nytt ved hvert sideopplasting.</li>
              <li>Brukeren kan koble fra Google-kontoen sin når som helst under Innstillinger → E-post, og da slettes alle lagrede tokens umiddelbart.</li>
            </ul>
            <p className="leading-relaxed font-semibold mb-2">Microsoft-integrasjon:</p>
            <ul className="list-disc list-inside space-y-2 leading-relaxed mb-3">
              <li>Tilsvarende funksjonalitet som Google-integrasjonen, men for Outlook e-post og Outlook Kalender.</li>
              <li>Samme prinsipp gjelder: kun lesing av kalender, kun på brukerens vegne, ingen deling, ingen AI-trening.</li>
            </ul>
            <p className="leading-relaxed">Reachrs bruk og overføring av informasjon mottatt fra Google API-er overholder <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-[#ff470a] hover:underline" target="_blank" rel="noopener noreferrer">Googles retningslinjer for brukerdata</a>, inkludert kravene til begrenset bruk.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">5. Datalagring og sikkerhet</h2>
            <p className="leading-relaxed">Alle data lagres i Supabase (EU-region) og Stripe. Tilgang til data er begrenset til den kontoen som eier dataene. Teammedlemmer kan kun se data delt innen sitt team. Vi bruker kryptering i overføring (TLS) og i hvile.</p>
          </section>

          <section id="gdpr">
            <h2 className="text-xl font-bold text-[#171717] mb-3">6. GDPR og dine rettigheter</h2>
            <p className="leading-relaxed mb-3">I henhold til GDPR har du rett til å:</p>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>Få innsyn i hvilke opplysninger vi har om deg</li>
              <li>Kreve retting av uriktige opplysninger</li>
              <li>Kreve sletting av dine opplysninger (sletting av konto)</li>
              <li>Protestere mot behandling eller kreve begrensning</li>
              <li>Dataportabilitet – motta dine data i maskinlesbart format</li>
            </ul>
            <p className="leading-relaxed mt-3">Send forespørsler til <a href="mailto:Help@reachr.no" className="text-[#ff470a] hover:underline">Help@reachr.no</a>. Du kan også klage til Datatilsynet (datatilsynet.no).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">7. Informasjonskapsler (cookies)</h2>
            <p className="leading-relaxed">Reachr bruker kun nødvendige cookies for autentisering og sesjonshåndtering. Vi bruker ikke sporings- eller markedsføringscookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">8. Kontakt</h2>
            <p className="leading-relaxed">Spørsmål om personvern? Kontakt oss på <a href="mailto:Help@reachr.no" className="text-[#ff470a] hover:underline">Help@reachr.no</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
