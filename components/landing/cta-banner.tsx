"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export function CtaBanner() {
  const { lang } = useLanguage();

  return (
    <section className="bg-[#171717] py-28 px-6">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-[#6b6660] mb-6">
          {lang === "en" ? "Ready to get started?" : "Klar til å begynne?"}
        </p>
        <h2 className="font-display text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.93] tracking-[-0.02em] text-white mb-8">
          {lang === "en" ? "Find your next" : "Finn dine neste"}
          <br />
          <span className="italic text-[#09fe94]" style={{ filter: "brightness(0.85)" }}>
            {lang === "en" ? "customers today." : "kunder i dag."}
          </span>
        </h2>
        <p className="text-base text-white/50 max-w-md mx-auto mb-10 leading-relaxed">
          {lang === "en"
            ? "Get started in under 2 minutes. No credit card, no commitment – just 3 days free to see if Reachr is right for you."
            : "Kom i gang på under 2 minutter. Ingen kredittkort, ingen bindingstid – bare 3 dager gratis for å se om Reachr er noe for deg."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-[#09fe94] px-8 py-4 text-base font-bold text-[#171717] shadow-[0_4px_24px_rgba(9,254,148,0.3)] transition-all duration-200 hover:bg-[#00e882] hover:-translate-y-0.5"
          >
            {lang === "en" ? "Start for free" : "Start gratis"} <ArrowRight size={18} />
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-white/50 hover:text-white transition-colors"
          >
            {lang === "en"
              ? "Already have an account? Log in →"
              : "Har du allerede en konto? Logg inn →"}
          </Link>
        </div>
      </div>
    </section>
  );
}
