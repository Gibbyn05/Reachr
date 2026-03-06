"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, Users, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const userCountOptions = [
  { value: "1", label: "1 bruker", price: "249 kr/mnd" },
  { value: "2-5", label: "2–5 brukere", price: "199 kr/bruker/mnd" },
  { value: "6-10", label: "6–10 brukere", price: "169 kr/bruker/mnd" },
  { value: "10+", label: "10+ brukere", price: "Kontakt oss" },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteEmail = searchParams.get("invite") ?? "";
  const isInvited = !!inviteEmail;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: inviteEmail,
    password: "",
    company: "",
    userCount: "1",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Invited users skip step 2 entirely
    if (!isInvited && step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Tilkoblingen tok for lang tid. Sjekk internettforbindelsen og prøv igjen.")), 10000)
      );
      const { error } = await Promise.race([
        supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.name,
              company: form.company,
              user_count: isInvited ? "invited" : form.userCount,
              invited_by: isInvited ? inviteEmail : undefined,
            },
          },
        }),
        timeout,
      ]);

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Noe gikk galt. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  // ── Invited user: single-step form ──────────────────────────────────────
  if (isInvited) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F1729] mb-2">Bli med i teamet</h1>
            <p className="text-gray-500 text-sm">
              Du er invitert til Reachr. Opprett kontoen din for å komme i gang.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Fullt navn</label>
              <Input
                type="text"
                placeholder="Ola Nordmann"
                icon={<User className="w-4 h-4" />}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">E-postadresse</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                readOnly={!!inviteEmail}
                className={inviteEmail ? "bg-gray-50 text-gray-500" : ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Passord</label>
              <Input
                type="password"
                placeholder="Minst 8 tegn"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full justify-center mt-2" disabled={loading}>
              {loading ? "Oppretter konto..." : "Kom i gang"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Har du allerede en konto?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Logg inn her
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Normal registration: two-step flow ──────────────────────────────────
  return (
    <div className="w-full max-w-md">
      {/* Progress steps */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                s < step
                  ? "bg-[#2563EB] text-white"
                  : s === step
                  ? "bg-[#0F1729] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            <span className={`text-sm font-medium ${s === step ? "text-slate-900" : "text-gray-400"}`}>
              {s === 1 ? "Personlig info" : "Bedrift & plan"}
            </span>
            {s < 2 && <div className="w-8 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#0F1729] mb-2">Opprett konto</h1>
              <p className="text-gray-500 text-sm">
                Allerede registrert?{" "}
                <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                  Logg inn her
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Fullt navn</label>
                <Input
                  type="text"
                  placeholder="Ola Nordmann"
                  icon={<User className="w-4 h-4" />}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-postadresse</label>
                <Input
                  type="email"
                  placeholder="du@bedrift.no"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Passord</label>
                <Input
                  type="password"
                  placeholder="Minst 8 tegn"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full justify-center mt-2">
                Neste <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#0F1729] mb-2">Sett opp bedriften din</h1>
              <p className="text-gray-500 text-sm">Velg plan basert på antall brukere</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bedriftsnavn</label>
                <Input
                  type="text"
                  placeholder="Bedrift AS"
                  icon={<Building2 className="w-4 h-4" />}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Antall brukere</label>
                <div className="grid grid-cols-2 gap-3">
                  {userCountOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, userCount: opt.value })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.userCount === opt.value
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Users className={`w-4 h-4 ${form.userCount === opt.value ? "text-blue-600" : "text-gray-400"}`} />
                        <span className={`text-sm font-semibold ${form.userCount === opt.value ? "text-blue-700" : "text-slate-700"}`}>
                          {opt.label}
                        </span>
                      </div>
                      <span className={`text-xs ${form.userCount === opt.value ? "text-blue-600" : "text-gray-400"}`}>
                        {opt.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trial banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <div className="w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800">3 dager gratis prøveperiode</p>
                  <p className="text-xs text-blue-700 mt-0.5">Ingen kredittkort nødvendig. Du kan avbestille når som helst.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)} className="flex-1 justify-center">
                  Tilbake
                </Button>
                <Button type="submit" variant="primary" size="lg" className="flex-1 justify-center" disabled={loading}>
                  {loading ? "Oppretter konto..." : "Start gratis"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-96 bg-white rounded-2xl border border-gray-200 animate-pulse" />}>
      <RegisterForm />
    </Suspense>
  );
}
