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
            <h2 className="text-xl font-bold text-[#171717] mb-3">4. Datalagring og sikkerhet</h2>
            <p className="leading-relaxed">Alle data lagres i Supabase (EU-region) og Stripe. Tilgang til data er begrenset til den kontoen som eier dataene. Teammedlemmer kan kun se data delt innen sitt team. Vi bruker kryptering i overføring (TLS) og i hvile.</p>
          </section>

          <section id="gdpr">
            <h2 className="text-xl font-bold text-[#171717] mb-3">5. GDPR og dine rettigheter</h2>
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
            <h2 className="text-xl font-bold text-[#171717] mb-3">6. Informasjonskapsler (cookies)</h2>
            <p className="leading-relaxed">Reachr bruker kun nødvendige cookies for autentisering og sesjonshåndtering. Vi bruker ikke sporings- eller markedsføringscookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">7. Kontakt</h2>
            <p className="leading-relaxed">Spørsmål om personvern? Kontakt oss på <a href="mailto:Help@reachr.no" className="text-[#ff470a] hover:underline">Help@reachr.no</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
