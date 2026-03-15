"use client";
import { useState } from "react";
import { Mail, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export function Kontakt() {
  const { lang } = useLanguage();
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
        setError(data.error ?? (lang === "en" ? "Something went wrong. Please try again." : "Noe gikk galt. Prøv igjen."));
        return;
      }
      setSent(true);
    } catch {
      setError(lang === "en" ? "Something went wrong. Please try again." : "Noe gikk galt. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="kontakt" className="bg-[#ede9da] py-28 px-6">
      <div className="mx-auto max-w-5xl">

        <div className="mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-[#a09b8f] mb-4">
            {lang === "en" ? "Contact" : "Kontakt"}
          </p>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.01em] text-[#171717]">
            {lang === "en" ? "Feel free to reach out –" : "Ta gjerne kontakt –"}
            <br />
            <span className="italic text-[#ff470a]">
              {lang === "en" ? "we reply quickly." : "vi svarer raskt."}
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          <div className="space-y-8">
            <p className="text-base text-[#6b6660] leading-relaxed max-w-md">
              {lang === "en"
                ? "Do you have questions about Reachr, want a demo, or need help? Send us a message and we'll get back to you within one business day."
                : "Har du spørsmål om Reachr, ønsker du en demo, eller trenger du hjelp? Send oss en melding så tar vi kontakt innen én virkedag."}
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: Mail,
                  label: lang === "en" ? "Email" : "E-post",
                  value: "Help@reachr.no",
                  href: "mailto:Help@reachr.no",
                },
                {
                  icon: MessageSquare,
                  label: lang === "en" ? "Response time" : "Svartid",
                  value: lang === "en" ? "Within 1 business day" : "Innen 1 virkedag",
                  href: null,
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#faf8f2] border border-[#d8d3c5] flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#6b6660]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#a09b8f] uppercase tracking-widest">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-semibold text-[#ff470a] hover:underline">{value}</a>
                    ) : (
                      <p className="text-sm font-semibold text-[#171717]">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#faf8f2] border border-[#d8d3c5] rounded-2xl p-8">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-[#09fe94]/15 flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-[#05c472]" />
                </div>
                <h3 className="text-lg font-bold text-[#171717] mb-2">
                  {lang === "en" ? "Message sent!" : "Melding sendt!"}
                </h3>
                <p className="text-sm text-[#6b6660]">
                  {lang === "en"
                    ? "We'll get back to you within one business day."
                    : "Vi tar kontakt med deg innen én virkedag."}
                </p>
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
                    <label className="block text-xs font-bold text-[#a09b8f] uppercase tracking-widest mb-2">
                      {lang === "en" ? "Name" : "Navn"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === "en" ? "John Smith" : "Ola Nordmann"}
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-[#d8d3c5] bg-[#f2efe3] text-[#171717] placeholder:text-[#a09b8f] text-sm focus:outline-none focus:border-[#09fe94]/60 focus:ring-2 focus:ring-[#09fe94]/15 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#a09b8f] uppercase tracking-widest mb-2">
                      {lang === "en" ? "Email" : "E-post"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={lang === "en" ? "john@company.com" : "ola@bedrift.no"}
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-[#d8d3c5] bg-[#f2efe3] text-[#171717] placeholder:text-[#a09b8f] text-sm focus:outline-none focus:border-[#09fe94]/60 focus:ring-2 focus:ring-[#09fe94]/15 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#a09b8f] uppercase tracking-widest mb-2">
                      {lang === "en" ? "Message" : "Melding"}
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder={lang === "en" ? "Write your message here…" : "Skriv din melding her…"}
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
                    {loading
                      ? <><Loader2 size={15} className="animate-spin" /> {lang === "en" ? "Sending…" : "Sender…"}</>
                      : <>{lang === "en" ? "Send message" : "Send melding"} <ArrowRight size={15} /></>}
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
