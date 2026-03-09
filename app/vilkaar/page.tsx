import Link from "next/link";

export const metadata = { title: "Vilkår for bruk – Reachr" };

export default function VilkaarPage() {
  return (
    <div className="min-h-screen bg-[#f2efe3]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-[#ff470a] hover:underline mb-8 inline-block">← Tilbake til forsiden</Link>
        <h1 className="font-display text-4xl font-bold text-[#171717] mb-2">Vilkår for bruk</h1>
        <p className="text-[#a09b8f] text-sm mb-12">Sist oppdatert: mars 2026</p>

        <div className="space-y-10 text-[#3d3a34]">
          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">1. Tjenesteleverandør</h2>
            <p className="leading-relaxed">Reachr AS leverer denne tjenesten. Ved å opprette en konto aksepterer du disse vilkårene. Spørsmål rettes til <a href="mailto:Help@reachr.no" className="text-[#ff470a] hover:underline">Help@reachr.no</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">2. Brukerkonto</h2>
            <p className="leading-relaxed">Du er ansvarlig for å holde påloggingsinformasjonen din konfidensiell. Du må varsle oss umiddelbart dersom du mistenker uautorisert tilgang til kontoen din. Reachr kan ikke holdes ansvarlig for tap som følge av uautorisert bruk av din konto.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">3. Abonnement og betaling</h2>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>Abonnementer fornyes automatisk ved periodens slutt</li>
              <li>Du kan si opp abonnementet når som helst via innstillinger</li>
              <li>Ved oppsigelse beholder du tilgangen ut inneværende periode</li>
              <li>Betaling håndteres av Stripe. Vi lagrer ikke betalingskortdata</li>
              <li>Priser er oppgitt i NOK og ekskluderer MVA der annet ikke er angitt</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">4. Tillatt bruk</h2>
            <p className="leading-relaxed mb-3">Tjenesten er kun for lovlig, profesjonell salgsvirksomhet. Det er ikke tillatt å:</p>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>Bruke tjenesten til spam eller uønsket markedsføring i strid med norsk markedsføringslov</li>
              <li>Videresalg eller deling av kontoer uten tillatelse</li>
              <li>Forsøke å omgå tekniske sikkerhetstiltak</li>
              <li>Bruke tjenesten til å samle inn data i strid med GDPR</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">5. Data og konfidensialitet</h2>
            <p className="leading-relaxed">Data du legger inn i Reachr (leads, notater, e-poster) eies av deg og ditt team. Reachr behandler ikke innholdet i dine lead-data til egne formål. Se vår <Link href="/personvern" className="text-[#ff470a] hover:underline">personvernerklæring</Link> for detaljer.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">6. Tilgjengelighet</h2>
            <p className="leading-relaxed">Vi tilstreber 99,5% oppetid, men kan ikke garantere uavbrutt tilgang. Planlagt vedlikehold varsles i forkant. Reachr er ikke ansvarlig for tap som følge av nedetid.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">7. Endringer i vilkårene</h2>
            <p className="leading-relaxed">Vi forbeholder oss retten til å oppdatere disse vilkårene. Vesentlige endringer varsles via e-post. Fortsatt bruk etter varsel anses som aksept av nye vilkår.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#171717] mb-3">8. Kontakt</h2>
            <p className="leading-relaxed">Spørsmål om vilkår? Kontakt oss på <a href="mailto:Help@reachr.no" className="text-[#ff470a] hover:underline">Help@reachr.no</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
