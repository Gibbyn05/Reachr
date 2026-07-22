"use client";
import { motion } from "framer-motion";

const statsContainerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const statsItemVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const valuesContainerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const valuesItemVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const values = [
  {
    title: "Bygget for norsk B2B",
    desc: "Reachr er laget spesifikt for norske salgsorganisasjoner – med Brønnøysundregistrene i kjernen.",
  },
  {
    title: "Enkelhet fremfor alt",
    desc: "Vi tror det beste verktøyet er det du faktisk bruker. Reachr er designet for å være raskt og intuitivt.",
  },
  {
    title: "Kunden i sentrum",
    desc: "Hvert nytt produkt vi lanserer er basert på tilbakemeldinger fra ekte brukere – ikke hypoteser.",
  },
];

export function OmOss() {
  return (
    <section id="om-oss" className="bg-[#f2efe3] py-28 px-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.01em] text-[#171717]">
            Vi bygger fremtidens
            <br />
            <span className="italic text-[#ff470a]">salgsverktøy.</span>
          </h2>
        </motion.div>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-lg text-[#3d3a34] leading-relaxed mb-6">
              Reachr ble startet i 2026 av et team som var lei av overpriste, kompliserte CRM-systemer som ikke passet norske SMB-er.
            </p>
            <p className="text-base text-[#6b6660] leading-relaxed mb-6">
              Vi kombinerte direkte tilgang til Brønnøysundregistrene med et moderne salgspipeline-verktøy – og laget noe vi selv ville brukt. I dag hjelper vi norske bedrifter finne og lukke nye kunder raskere enn noensinne.
            </p>
            <p className="text-base text-[#6b6660] leading-relaxed">
              Vi er et lite, dedikert team. Vi elsker salg, produktdesign og å gjøre det enkelt å drive business i Norge.
            </p>
          </motion.div>

          {/* Stats block */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={statsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {[
              { value: "2026", label: "Grunnlagt" },
              { value: "14 dager", label: "Gratis prøveperiode" },
              { value: "250 000+", label: "Bedrifter tilgjengelig" },
            ].map(({ value, label }) => (
              <motion.div
                key={label}
                className="bg-[#faf8f2] border border-[#d8d3c5] rounded-2xl p-6"
                variants={statsItemVariants}
              >
                <p className="text-3xl font-extrabold text-[#171717] mb-1">{value}</p>
                <p className="text-sm text-[#a09b8f]">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-display text-2xl font-bold text-[#171717] mb-10">Våre verdier</h3>
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={valuesContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {values.map(({ title, desc }) => (
              <motion.div key={title} className="bg-[#faf8f2] border border-[#d8d3c5] rounded-2xl p-7" variants={valuesItemVariants}>
                <h4 className="text-base font-extrabold text-[#171717] mb-2">{title}</h4>
                <p className="text-sm text-[#6b6660] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
