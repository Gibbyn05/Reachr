"use client";
import { useState } from "react";
import { Mail, MessageSquare, ArrowRight, Loader2 } from "lucide-react";

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
        <div className="mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a09b8f] mb-4">Kontakt</p>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.01em] text-[#171717]">
            Ta gjerne kontakt –
            <br />
            <span className="italic text-[#ff470a]">vi svarer raskt.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — info */}
          <div className="space-y-8">
            <p className="text-base text-[#6b6660] leading-relaxed max-w-md">
              Har du spørsmål om Reachr, ønsker du en demo, eller trenger du hjelp? Send oss en melding så tar vi kontakt innen én virkedag.
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: Mail,
                  label: "E-post",
                  value: "Help@reachr.no",
                  accent: "#ff470a",
                },
                {
                  icon: MessageSquare,
                  label: "Svartid",
                  value: "Innen 1 virkedag",
                  accent: "#09fe94",
                },
              ].map(({ icon: Icon, label, value, accent }) => (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: accent + "18" }}
                  >
                    <Icon
                      size={17}
                      style={{ color: accent, filter: accent === "#09fe94" ? "brightness(0.65)" : "none" }}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#a09b8f] uppercase tracking-wide">{label}</p>
                    {label === "E-post" ? (
                      <a href={`mailto:${value}`} className="text-sm font-semibold text-[#ff470a] hover:underline">{value}</a>
                    ) : (
                      <p className="text-sm font-semibold text-[#171717]">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-[#faf8f2] border border-[#d8d3c5] rounded-2xl p-8 shadow-sm">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-[#09fe94]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={24} style={{ color: "#065c3a" }} />
                </div>
                <p className="text-lg font-extrabold text-[#171717] mb-2">Melding sendt!</p>
                <p className="text-sm text-[#6b6660]">Vi tar kontakt med deg innen én virkedag.</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 rounded-xl bg-[#ff470a]/8 border border-[#ff470a]/20 px-4 py-3 text-sm text-[#ff470a]">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#a09b8f] uppercase tracking-widest mb-2">Navn</label>
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
                  <label className="block text-xs font-bold text-[#a09b8f] uppercase tracking-widest mb-2">E-post</label>
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
                  <label className="block text-xs font-bold text-[#a09b8f] uppercase tracking-widest mb-2">Melding</label>
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
          </div>

        </div>
      </div>
    </section>
  );
}
