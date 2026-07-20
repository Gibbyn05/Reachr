"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CtaBanner() {
  return (
    <motion.section
      className="bg-[#171717] py-28 px-6"
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold uppercase tracking-widest text-[#6b6660] mb-6">
            Klar til å begynne?
          </p>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.93] tracking-[-0.02em] text-white mb-8">
            Finn dine neste
            <br />
            <span className="italic text-[#09fe94]" style={{ filter: "brightness(0.85)" }}>kunder i dag.</span>
          </h2>
          <p className="text-base text-white/50 max-w-md mx-auto mb-10 leading-relaxed">
            Kom i gang på under 2 minutter. Ingen kredittkort, ingen bindingstid –
            bare 3 dager gratis for å se om Reachr er noe for deg.
          </p>
        </motion.div>
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
        </motion.div>
      </div>
    </motion.section>
  );
}
