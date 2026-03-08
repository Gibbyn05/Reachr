"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="bg-[#171717] py-28 px-6">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-[#6b6660] mb-6">
          Klar til å begynne?
        </p>
        <h2 className="text-[clamp(2.8rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-tight text-white mb-8">
          Finn dine neste
          <br />
          <span className="text-[#09fe94]">kunder i dag.</span>
        </h2>
        <p className="text-base text-white/50 max-w-md mx-auto mb-10 leading-relaxed">
          Kom i gang på under 2 minutter. Ingen kredittkort, ingen bindingstid –
          bare 3 dager gratis for å se om Reachr er noe for deg.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-[#09fe94] px-8 py-4 text-base font-bold text-[#171717] shadow-[0_4px_24px_rgba(9,254,148,0.3)] transition-all duration-200 hover:bg-[#00e882] hover:-translate-y-0.5"
          >
            Start gratis <ArrowRight size={18} />
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-white/50 hover:text-white transition-colors"
          >
            Har du allerede en konto? Logg inn →
          </Link>
        </div>
      </div>
    </section>
  );
}
