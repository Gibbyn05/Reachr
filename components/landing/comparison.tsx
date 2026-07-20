"use client";
import { X, Check } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const listContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const traditionalProblems = [
  "Du ringer kaldt uten noen kontekst",
  "Du sporer leads i Excel eller post-it-lapper",
  "Du mister oversikten over hvem som er kontaktet",
  "Du husker oppfølgingstidspunkter selv",
  "Timesvis brukt på manuell research",
  "Du vet ikke hvem i teamet som følger opp hva",
  "Ingen struktur = tapte avtaler",
];

const reachrBenefits = [
  "Finn riktige bedrifter med smarte filtre",
  "Strukturert pipeline med statussporing",
  "Alt samlet på ett sted – aldri miste et lead",
  "Automatiske varsler og påminnelser",
  "Søk i 250 000+ bedrifter på sekunder",
  "Teamdeling og tildeling av leads",
  "Klar struktur = flere lukkede avtaler",
];

export function Comparison() {
  return (
    <section className="bg-[#171717] py-28 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.01em] text-white">
            Manuell prospektering
            <br />
            <span className="italic text-[#09fe94]" style={{ filter: "brightness(0.85)" }}>er bortkastet tid.</span>
          </h2>
        </motion.div>

        {/* Comparison grid */}
        <motion.div
          className="grid grid-cols-1 gap-4 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Traditional column */}
          <motion.div className="rounded-2xl border border-white/10 bg-white/5 p-8" variants={itemVariants}>
            <p className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">
              Tradisjonelt salg
            </p>
            <motion.ul
              className="flex flex-col gap-4"
              variants={listContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {traditionalProblems.map((item) => (
                <motion.li key={item} className="flex items-start gap-3" variants={listItemVariants}>
                  <div className="w-5 h-5 rounded-full bg-[#ff470a]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <X size={11} className="text-[#ff470a]" />
                  </div>
                  <span className="text-sm text-white/50 leading-snug">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Reachr column */}
          <motion.div className="rounded-2xl border border-[#09fe94]/30 bg-[#09fe94]/5 p-8" variants={itemVariants}>
            <p className="text-sm font-bold text-[#09fe94] uppercase tracking-widest mb-6" style={{ filter: "brightness(0.8)" }}>
              Med Reachr
            </p>
            <motion.ul
              className="flex flex-col gap-4"
              variants={listContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {reachrBenefits.map((item) => (
                <motion.li key={item} className="flex items-start gap-3" variants={listItemVariants}>
                  <div className="w-5 h-5 rounded-full bg-[#09fe94]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#09fe94]" style={{ filter: "brightness(0.7)" }} />
                  </div>
                  <span className="text-sm text-white/80 leading-snug">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
