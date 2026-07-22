"use client";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function Kontakt() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Noe gikk galt. Prøv igjen.");
        return;
      }
      setSent(true);
    } catch {
      setError("Noe gikk galt. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="kontakt" className="bg-[#ede9da] py-28 px-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.01em] text-[#171717]">
            Ta gjerne kontakt –
            <br />
            <span className="italic text-[#ff470a]">vi svarer raskt.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-base text-[#6b6660] leading-relaxed max-w-md">
              Har du spørsmål om Reachr, ønsker du en demo, eller trenger du hjelp? Send oss en melding så tar vi kontakt innen én virkedag.
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#6b6660] mb-0.5">E-post</p>
                <a href="mailto:help@reachr.no" className="text-sm font-semibold text-[#ff470a] hover:underline">help@reachr.no</a>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#6b6660] mb-0.5">Svartid</p>
                <p className="text-sm font-semibold text-[#171717]">Innen 1 virkedag</p>
              </div>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            className="bg-[#faf8f2] border border-[#d8d3c5] rounded-2xl p-8 shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {sent ? (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <p className="text-lg font-extrabold text-[#171717] mb-2">Melding sendt!</p>
                <p className="text-sm text-[#6b6660]">Vi tar kontakt med deg innen én virkedag.</p>
              </motion.div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 rounded-xl bg-[#ff470a]/8 border border-[#ff470a]/20 px-4 py-3 text-sm text-[#ff470a]">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">Navn</label>
                  <input
                    type="text"
                    required
                    placeholder="Ola Nordmann"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[#d8d3c5] bg-[#f2efe3] text-[#171717] placeholder:text-[#a09b8f] text-sm focus:outline-none focus:border-[#09fe94]/60 focus:ring-2 focus:ring-[#09fe94]/15 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">E-post</label>
                  <input
                    type="email"
                    required
                    placeholder="ola@bedrift.no"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[#d8d3c5] bg-[#f2efe3] text-[#171717] placeholder:text-[#a09b8f] text-sm focus:outline-none focus:border-[#09fe94]/60 focus:ring-2 focus:ring-[#09fe94]/15 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">Melding</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Skriv din melding her…"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[#d8d3c5] bg-[#f2efe3] text-[#171717] placeholder:text-[#a09b8f] text-sm focus:outline-none focus:border-[#09fe94]/60 focus:ring-2 focus:ring-[#09fe94]/15 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#09fe94] text-[#171717] font-bold text-sm hover:bg-[#00e882] shadow-[0_2px_12px_rgba(9,254,148,0.3)] transition-all duration-200 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Sender…</> : <>Send melding <ArrowRight size={15} /></>}
                </button>
                </form>
              </>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
