import Link from "next/link";

export const metadata = { title: "Oppdateringer – Reachr" };

const updates = [
  {
    date: "Mars 2026",
    version: "1.3",
    tag: "Sikkerhet & invitasjoner",
    tagColor: "#ff470a",
    changes: [
      "Forbedret invitasjonsflyt: brukere med eksisterende konto kobles automatisk til team ved innlogging",
      "Tydelig teambanner på invitasjonssiden som forklarer at du ikke trenger eget abonnement",
      "Fikset at teammedlemmer uten invitasjonslenke kom til betalingsvegg",
      "Sikret alle API-endepunkter med autentiseringssjekk",
      "Fikset manglende eierskapskontroll på leads – brukere kan ikke lenger endre andres data",
      "Fjernet eksponert debug-endepunkt",
      "Forbedret e-postleveranse til Outlook med tabell-basert HTML og ren-tekst fallback",
    ],
  },
  {
    date: "Mars 2026",
    version: "1.2",
    tag: "Priser & landingsside",
    tagColor: "#ffad0a",
    changes: [
      "Oppdaterte priser: Team 499 kr/mnd, 4 788 kr/år — Solo 249 kr/mnd, 2 388 kr/år",
      "Landingssiden oppdatert med AI e-poster og SMS, Gmail/Outlook-sending, e-postsekvenser og e-postberikelse",
      "\"Slik fungerer det\" utvidet til 4 steg med AI e-post mockup",
      "Ny mockup viser e-postadresser i leadsøk-resultater",
    ],
  },
  {
    date: "Februar 2026",
    version: "1.1",
    tag: "Team & AI",
    tagColor: "#09fe94",
    changes: [
      "Teamsamarbeid: inviter kolleger via e-post fra innstillinger",
      "AI-genererte e-poster via Anthropic Claude – personlig tilpasset hver bedrift",
      "AI-genererte SMS-meldinger under 160 tegn",
      "Send e-post direkte fra Reachr via Gmail eller Outlook (OAuth)",
      "Automatiske e-postsekvenser med planlagt utsendelse",
      "E-postberikelse: finn kontaktadresser automatisk fra 1881, Gulesider og Proff",
    ],
  },
  {
    date: "Januar 2026",
    version: "1.0",
    tag: "Lansering",
    tagColor: "#09fe94",
    changes: [
      "Leadsøk i 250 000+ norske bedrifter fra Brønnøysundregistrene",
      "Kartvisning av søkeresultater",
      "CRM-pipeline med 6 statusnivåer",
      "Automatiske oppfølgingsvarsler basert på aktivitet",
      "Dashboard med statistikk og oversikt",
      "Stripe-betaling med 3 dagers gratis prøveperiode",
    ],
  },
];

export default function OppdateringerPage() {
  return (
    <div className="min-h-screen bg-[#f2efe3]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-[#ff470a] hover:underline mb-8 inline-block">← Tilbake til forsiden</Link>
        <h1 className="font-display text-4xl font-bold text-[#171717] mb-2">Oppdateringer</h1>
        <p className="text-[#6b6660] text-base mb-16">Hva er nytt i Reachr — siste endringer og forbedringer.</p>

        <div className="space-y-12">
          {updates.map((u) => (
            <div key={u.version} className="relative pl-8 border-l-2 border-[#d8d3c5]">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#faf8f2] border-2 border-[#d8d3c5]" />
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-sm font-bold text-[#a09b8f]">{u.date}</span>
                <span className="text-xs font-bold text-[#171717] bg-[#e8e4d8] px-2.5 py-0.5 rounded-full">v{u.version}</span>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: u.tagColor + "20", color: u.tagColor === "#09fe94" ? "#065c3a" : u.tagColor }}
                >
                  {u.tag}
                </span>
              </div>
              <div className="bg-[#faf8f2] border border-[#d8d3c5] rounded-2xl p-6">
                <ul className="space-y-2.5">
                  {u.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#3d3a34] leading-relaxed">
                      <span className="text-[#09fe94] font-bold mt-0.5 shrink-0" style={{ filter: "brightness(0.65)" }}>+</span>
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-[#d8d3c5] text-center">
          <p className="text-sm text-[#a09b8f]">Spørsmål eller forslag? <a href="mailto:Help@reachr.no" className="text-[#ff470a] hover:underline">Help@reachr.no</a></p>
        </div>
      </div>
    </div>
  );
}
