"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, Users, Building2, User, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const userCountOptions = [
  { value: "1", label: "1 bruker", price: "249 kr/mnd" },
  { value: "2-5", label: "2–5 brukere", price: "199 kr/bruker/mnd" },
  { value: "6-10", label: "6–10 brukere", price: "169 kr/bruker/mnd" },
  { value: "10+", label: "10+ brukere", price: "Kontakt oss" },
];

const targetOptions = [
  { value: "b2b", label: "Bedrifter (B2B)", desc: "Selger til andre bedrifter" },
  { value: "b2c", label: "Privatpersoner (B2C)", desc: "Selger direkte til forbrukere" },
  { value: "begge", label: "Begge", desc: "Selger til både bedrifter og privatpersoner" },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteEmail = searchParams.get("invite") ?? "";
  const inviterEmail = searchParams.get("inviter") ?? "";
  const inviteCompany = searchParams.get("company") ?? "";
  const isInvited = !!inviteEmail && !!inviterEmail;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: inviteEmail,
    password: "",
    company: inviteCompany,
    userCount: "1",
    salesPitch: "",
    targetCustomers: "b2b",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Invited users skip steps 2 and 3
    if (!isInvited && step === 1) { setStep(2); return; }
    if (!isInvited && step === 2) { setStep(3); return; }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Tilkoblingen tok for lang tid. Sjekk internettforbindelsen og prøv igjen.")), 10000)
      );
      const { error: signUpError } = await Promise.race([
        supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.name,
              company: isInvited ? inviteCompany : form.company,
              user_count: isInvited ? "invited" : form.userCount,
              team_owner: isInvited ? inviterEmail : undefined,
              sales_pitch: form.salesPitch || undefined,
              target_customers: isInvited ? undefined : form.targetCustomers,
            },
          },
        }),
        timeout,
      ]);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // If invited, link this user to the team owner
      if (isInvited) {
        await fetch("/api/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ owner_email: inviterEmail, member_name: form.name }),
        });
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
        <div className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-[#05c472]" />
            </div>
            <h1 className="text-2xl font-bold text-[#171717] mb-2">Bli med i teamet</h1>
            <p className="text-[#6b6660] text-sm">
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
              <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">Fullt navn</label>
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
              <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">E-postadresse</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                readOnly={!!inviteEmail}
                className={inviteEmail ? "bg-gray-50 text-[#6b6660]" : ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">Passord</label>
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

          <p className="text-center text-sm text-[#6b6660] mt-4">
            Har du allerede en konto?{" "}
            <Link href="/login" className="text-[#ff470a] font-semibold hover:underline">
              Logg inn her
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Normal registration: three-step flow ────────────────────────────────
  const stepLabels = ["Personlig info", "Bedrift & plan", "Om produktet"];
  return (
    <div className="w-full max-w-md">
      {/* Progress steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                s < step
                  ? "bg-[#09fe94] text-white"
                  : s === step
                  ? "bg-[#171717] text-white"
                  : "bg-gray-200 text-[#6b6660]"
              }`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            <span className={`text-sm font-medium ${s === step ? "text-[#171717]" : "text-[#a09b8f]"}`}>
              {stepLabels[s - 1]}
            </span>
            {s < 3 && <div className="w-6 h-px bg-[#d8d3c5]" />}
          </div>
        ))}
      </div>

      <div className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] shadow-sm p-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#171717] mb-2">Opprett konto</h1>
              <p className="text-[#6b6660] text-sm">
                Allerede registrert?{" "}
                <Link href="/login" className="text-[#ff470a] font-semibold hover:underline">
                  Logg inn her
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">Fullt navn</label>
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
                <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">E-postadresse</label>
                <Input
                  type="email"
                  placeholder="du@bedrift.no"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">Passord</label>
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
        ) : step === 2 ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#171717] mb-2">Sett opp bedriften din</h1>
              <p className="text-[#6b6660] text-sm">Velg plan basert på antall brukere</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">Bedriftsnavn</label>
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
                <label className="block text-sm font-medium text-[#3d3a34] mb-3">Antall brukere</label>
                <div className="grid grid-cols-2 gap-3">
                  {userCountOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, userCount: opt.value })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.userCount === opt.value
                          ? "border-[#09fe94] bg-[#09fe94]/8"
                          : "border-[#d8d3c5] hover:border-[#a09b8f]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Users className={`w-4 h-4 ${form.userCount === opt.value ? "text-[#05c472]" : "text-[#a09b8f]"}`} />
                        <span className={`text-sm font-semibold ${form.userCount === opt.value ? "text-[#3d3a34]" : "text-[#3d3a34]"}`}>
                          {opt.label}
                        </span>
                      </div>
                      <span className={`text-xs ${form.userCount === opt.value ? "text-[#05c472]" : "text-[#a09b8f]"}`}>
                        {opt.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trial banner */}
              <div className="bg-[#09fe94]/8 border border-[#09fe94]/30 rounded-xl p-4 flex items-start gap-3">
                <div className="w-5 h-5 bg-[#09fe94] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#171717]">3 dager gratis prøveperiode</p>
                  <p className="text-xs text-[#3d3a34] mt-0.5">Ingen kredittkort nødvendig. Du kan avbestille når som helst.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)} className="flex-1 justify-center">
                  Tilbake
                </Button>
                <Button type="submit" variant="primary" size="lg" className="flex-1 justify-center">
                  Neste <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#171717] mb-2">Om bedriften din</h1>
              <p className="text-[#6b6660] text-sm">Hjelper AI-en med å skrive relevante e-poster</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">
                  Hva selger dere? <span className="text-[#a09b8f] font-normal">(kort beskrivelse)</span>
                </label>
                <textarea
                  value={form.salesPitch}
                  onChange={(e) => setForm({ ...form, salesPitch: e.target.value })}
                  placeholder="F.eks: Vi tilbyr regnskapstjenester for små og mellomstore bedrifter. Vi hjelper kunder med å spare tid og unngå feil i regnskapet."
                  rows={3}
                  required
                  style={{
                    width: "100%", padding: "10px 12px",
                    border: "1.5px solid #d8d3c5", borderRadius: 10,
                    fontSize: 14, color: "#171717", outline: "none",
                    fontFamily: "inherit", backgroundColor: "#faf8f2",
                    resize: "vertical", lineHeight: "1.5",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#09fe94")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#d8d3c5")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3d3a34] mb-3">Hvem er kundene deres?</label>
                <div className="space-y-2">
                  {targetOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, targetCustomers: opt.value })}
                      className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                        form.targetCustomers === opt.value
                          ? "border-[#09fe94] bg-[#09fe94]/8"
                          : "border-[#d8d3c5] hover:border-[#a09b8f]"
                      }`}
                    >
                      <span className={`text-sm font-semibold ${form.targetCustomers === opt.value ? "text-[#3d3a34]" : "text-[#3d3a34]"}`}>
                        {opt.label}
                      </span>
                      <span className={`block text-xs mt-0.5 ${form.targetCustomers === opt.value ? "text-[#05c472]" : "text-[#a09b8f]"}`}>
                        {opt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="secondary" size="lg" onClick={() => setStep(2)} className="flex-1 justify-center">
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
