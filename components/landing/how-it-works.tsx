"use client";
import { Search, LayoutDashboard, Sparkles, Bell } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

function getSteps(lang: "no" | "en") {
  return [
    {
      number: "1",
      title: lang === "en" ? "Search for companies" : "Søk etter bedrifter",
      description: lang === "en"
        ? "Enter an industry, location, or company name. Reachr searches through 250,000+ Norwegian companies from the Business Registry in real time — and automatically retrieves contact persons and email addresses."
        : "Skriv inn bransje, sted eller firmanavn. Reachr søker gjennom 250 000+ norske bedrifter fra Brønnøysundregistrene i sanntid — og henter kontaktpersoner og e-postadresser automatisk.",
      accent: "#09fe94",
      icon: Search,
      mockup: (
        <div className="rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] p-5 shadow-sm">
          <p className="text-[10px] font-bold text-[#a09b8f] uppercase tracking-widest mb-3">
            {lang === "en" ? "Lead Search" : "Leadsøk"}
          </p>
          <div className="flex gap-2 mb-4">
            <div className="flex-1 flex items-center gap-2 rounded-xl border border-[#d8d3c5] bg-white px-3 py-2.5">
              <Search size={13} className="text-[#a09b8f] shrink-0" />
              <span className="text-sm text-[#3d3a34] font-medium">Rørlegger, Oslo</span>
            </div>
            <div className="flex items-center justify-center rounded-xl bg-[#09fe94] px-4 py-2.5">
              <span className="text-xs font-bold text-[#171717]">{lang === "en" ? "Search" : "Søk"}</span>
            </div>
          </div>
          {[
            { name: "Bjørnstad VVS AS", loc: "Oslo", emp: "12 ans.", email: "post@bjornstad.no" },
            { name: "Nordre Rør & Bad", loc: "Oslo", emp: "7 ans.", email: "kontakt@nordreror.no" },
            { name: "Oslo Rørservice", loc: "Oslo", emp: "24 ans.", email: "post@osloros.no" },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[#ede9da] last:border-0">
              <div>
                <p className="text-xs font-semibold text-[#171717]">{r.name}</p>
                <p className="text-[10px] text-[#a09b8f]">{r.loc} · {r.emp} · {r.email}</p>
              </div>
              <button className="text-[10px] font-bold bg-[#09fe94] text-[#171717] px-2.5 py-1 rounded-lg">
                + {lang === "en" ? "Add" : "Legg til"}
              </button>
            </div>
          ))}
        </div>
      ),
    },
    {
      number: "2",
      title: lang === "en" ? "Build your pipeline" : "Bygg din pipeline",
      description: lang === "en"
        ? "Add leads directly to your CRM pipeline. Track status, add notes, and collaborate with your team — all in one place."
        : "Legg leads direkte inn i CRM-pipelinen. Spor status, legg til notater og samarbeid med teamet ditt – alt på ett sted.",
      accent: "#ff470a",
      icon: LayoutDashboard,
      mockup: (
        <div className="rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] p-5 shadow-sm">
          <p className="text-[10px] font-bold text-[#a09b8f] uppercase tracking-widest mb-3">
            {lang === "en" ? "My Leads" : "Mine Leads"}
          </p>
          {[
            { name: "Bjørnstad VVS AS", status: lang === "en" ? "Contacted" : "Kontaktet", statusBg: "#09fe94", statusColor: "#065c3a" },
            { name: "Vestland Elektro AS", status: lang === "en" ? "Meeting booked" : "Booket møte", statusBg: "#ffad0a", statusColor: "#7a4f00" },
            { name: "Kjeldsberg Bygg", status: lang === "en" ? "Customer" : "Kunde", statusBg: "#171717", statusColor: "#09fe94" },
            { name: "Hav & Kyst Reklame", status: lang === "en" ? "Not contacted" : "Ikke kontaktet", statusBg: "#e8e4d8", statusColor: "#6b6660" },
          ].map((l, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#ede9da] last:border-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#e8e4d8] flex items-center justify-center text-[10px] font-bold text-[#6b6660]">
                  {l.name[0]}
                </div>
                <span className="text-xs font-semibold text-[#171717]">{l.name}</span>
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: l.statusBg, color: l.statusColor }}
              >
                {l.status}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      number: "3",
      title: lang === "en" ? "Send AI-written messages" : "Send AI-skrevne meldinger",
      description: lang === "en"
        ? "With one click, AI writes a personalized email or SMS tailored to each company — based on your sales pitch. Send directly from Reachr via Gmail or Outlook, or copy the text and send it yourself."
        : "Med ett klikk skriver AI en personlig e-post eller SMS tilpasset hver bedrift — basert på din salgspitch. Send direkte fra Reachr via Gmail eller Outlook, eller kopier teksten og send selv.",
      accent: "#ffad0a",
      icon: Sparkles,
      mockup: (
        <div className="rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] p-5 shadow-sm">
          <p className="text-[10px] font-bold text-[#a09b8f] uppercase tracking-widest mb-3">
            {lang === "en" ? "AI Email" : "AI E-post"}
          </p>
          <div className="mb-3 rounded-xl border border-[#d8d3c5] bg-[#ede9da] px-3 py-2.5">
            <p className="text-[10px] text-[#a09b8f] mb-0.5">{lang === "en" ? "To" : "Til"}</p>
            <p className="text-xs font-semibold text-[#171717]">post@bjornstadvvs.no</p>
          </div>
          <div className="mb-3 rounded-xl border border-[#d8d3c5] bg-[#ede9da] px-3 py-2.5">
            <p className="text-[10px] text-[#a09b8f] mb-0.5">{lang === "en" ? "Subject" : "Emne"}</p>
            <p className="text-xs font-semibold text-[#171717]">
              {lang === "en" ? "Partnership with Bjørnstad VVS?" : "Samarbeid med Bjørnstad VVS?"}
            </p>
          </div>
          <div className="rounded-xl border border-[#09fe94]/40 bg-[#09fe94]/5 px-3 py-3 mb-3">
            <p className="text-[10px] text-[#3d3a34] leading-relaxed">
              {lang === "en"
                ? "Hi Bjørnstad VVS! We help plumbers in the Oslo area find new customers faster. Can we have a quick chat about how we can help you?"
                : "Hei Bjørnstad VVS! Vi hjelper rørleggere i Oslo-området med å finne nye kunder raskere. Kan vi ta en kort prat om hvordan vi kan hjelpe dere?"}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#09fe94] py-2">
              <span className="text-[10px] font-bold text-[#171717]">
                {lang === "en" ? "Send via Gmail" : "Send via Gmail"}
              </span>
            </div>
            <div className="flex items-center justify-center rounded-xl border border-[#d8d3c5] px-3 py-2">
              <span className="text-[10px] font-bold text-[#6b6660]">SMS</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: "4",
      title: lang === "en" ? "Follow up automatically" : "Følg opp automatisk",
      description: lang === "en"
        ? "Reachr alerts you when it's time to follow up based on the last activity. Set up automatic email sequences that run for you — never forget a lead again."
        : "Reachr varsler deg når det er tid for oppfølging basert på siste aktivitet. Sett opp automatiske e-postsekvenser som kjører for deg — aldri glem et lead igjen.",
      accent: "#09fe94",
      icon: Bell,
      mockup: (
        <div className="rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] p-5 shadow-sm">
          <p className="text-[10px] font-bold text-[#a09b8f] uppercase tracking-widest mb-3">
            {lang === "en" ? "Alerts" : "Varsler"}
          </p>
          {[
            { name: "Bjørnstad VVS AS", msg: lang === "en" ? "No response – call again?" : "Ingen respons – ring igjen?", time: lang === "en" ? "1d ago" : "1d siden", dot: "#ff470a" },
            { name: "Fjord Tech Solutions", msg: lang === "en" ? "Meeting in 2 hours" : "Møte om 2 timer", time: lang === "en" ? "Today" : "I dag", dot: "#ffad0a" },
            { name: "Polaris Renhold", msg: lang === "en" ? "Last contacted 3 days ago" : "Sist kontaktet for 3 dager siden", time: lang === "en" ? "3d ago" : "3d siden", dot: "#09fe94" },
          ].map((n, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#ede9da] last:border-0">
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: n.dot }} />
              <div className="flex-1">
                <p className="text-xs font-bold text-[#171717]">{n.name}</p>
                <p className="text-[10px] text-[#6b6660]">{n.msg}</p>
              </div>
              <span className="text-[10px] text-[#a09b8f] shrink-0">{n.time}</span>
            </div>
          ))}
          <div className="mt-3 rounded-xl bg-[#171717] px-3 py-2.5">
            <p className="text-[10px] text-[#a09b8f] mb-0.5">{lang === "en" ? "Active sequence" : "Aktiv sekvens"}</p>
            <p className="text-xs font-semibold text-white">
              {lang === "en"
                ? "Email 2 of 3 sends automatically in 2 days"
                : "E-post 2 av 3 sendes automatisk om 2 dager"}
            </p>
          </div>
        </div>
      ),
    },
  ];
}

export function HowItWorks() {
  const { lang } = useLanguage();
  const steps = getSteps(lang);

  return (
    <section className="bg-[#f2efe3] py-28 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-20">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a09b8f] mb-4">
            {lang === "en" ? "How it works" : "Slik fungerer det"}
          </p>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.01em] text-[#171717]">
            {lang === "en" ? "Four steps to" : "Fire steg til"}
            <br />
            <span className="italic text-[#ff470a]">
              {lang === "en" ? "your next customers." : "dine neste kunder."}
            </span>
          </h2>
        </div>

        <div className="flex flex-col gap-24">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className={`flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              <div className="flex-1">
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-6 text-xl font-extrabold"
                  style={{ backgroundColor: step.accent + "22", color: step.accent, filter: step.accent === "#09fe94" ? "brightness(0.65)" : "none" }}
                >
                  {step.number}
                </div>
                <h3 className="font-display text-[2rem] sm:text-[2.4rem] font-bold text-[#171717] mb-4 leading-[1] tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="text-base text-[#6b6660] leading-relaxed max-w-md">
                  {step.description}
                </p>
              </div>

              <div className="flex-1 max-w-sm lg:max-w-none">
                {step.mockup}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
