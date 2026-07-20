"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

function NyttPassordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setReady(true);
      } else {
        setExpired(true);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Passordet må være minst 8 tegn.");
      return;
    }

    if (password !== confirm) {
      setError("Passordene stemmer ikke overens.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
        return;
      }

      setDone(true);
      setTimeout(() => router.push("/dashboard"), 2500);
    } catch (err: any) {
      setError(err.message ?? "Noe gikk galt. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  if (!ready && !expired) {
    return (
      <div className="w-full max-w-md flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-[#09fe94] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (expired) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-12 h-12 text-[#ffad0a]" />
            </div>
            <h1 className="text-2xl font-bold text-[#171717] mb-2">Lenken er ugyldig eller utløpt</h1>
            <p className="text-[#6b6660] text-sm">
              Tilbakestillingslenken du brukte er utløpt eller allerede brukt. Be om en ny lenke for å tilbakestille passordet ditt.
            </p>
          </div>
          <Link
            href="/glemt-passord"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#09fe94] text-[#171717] font-bold text-sm hover:bg-[#00e882] transition-all duration-200"
          >
            Be om ny lenke <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-[#6b6660] hover:text-[#171717]"
            >
              <ArrowLeft className="w-4 h-4" />
              Tilbake til innlogging
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="Reachr" className="w-14 h-14" />
          </div>
          <h1 className="text-2xl font-bold text-[#171717] mb-2">
            {done ? "Passord oppdatert!" : "Sett nytt passord"}
          </h1>
          <p className="text-[#6b6660] text-sm">
            {done
              ? "Du sendes nå til dashboardet ditt..."
              : "Velg et nytt passord for kontoen din."}
          </p>
        </div>

        {done ? (
          <div className="flex justify-center">
            <CheckCircle className="w-12 h-12 text-[#09fe94]" />
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-lg bg-[#ff470a]/8 border border-[#ff470a]/20 px-4 py-3 text-sm text-[#ff470a]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">
                  Nytt passord
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minst 8 tegn"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a09b8f] hover:text-[#6b6660]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3d3a34] mb-1.5">
                  Bekreft passord
                </label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Gjenta passordet"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a09b8f] hover:text-[#6b6660]"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center mt-2"
                disabled={loading}
              >
                {loading ? "Lagrer..." : "Oppdater passord"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function NyttPassordPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-96 bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] animate-pulse" />}>
      <NyttPassordForm />
    </Suspense>
  );
}
