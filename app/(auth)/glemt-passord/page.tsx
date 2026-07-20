"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function GlemtPassordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/nytt-passord`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message ?? "Noe gikk galt. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="Reachr" className="w-14 h-14" />
          </div>
          <h1 className="text-2xl font-bold text-[#171717] mb-2">
            {sent ? "E-post sendt!" : "Glemt passord?"}
          </h1>
          <p className="text-[#6b6660] text-sm">
            {sent
              ? `Vi har sendt en lenke til ${email}. Sjekk innboksen din.`
              : "Skriv inn e-postadressen din, så sender vi deg en lenke for å tilbakestille passordet."}
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-12 h-12 text-[#09fe94]" />
            </div>
            <p className="text-center text-sm text-[#6b6660]">
              Ikke mottatt e-post?{" "}
              <button
                onClick={() => setSent(false)}
                className="text-[#ff470a] font-semibold hover:underline"
              >
                Prøv igjen
              </button>
            </p>
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
                  E-postadresse
                </label>
                <Input
                  type="email"
                  placeholder="du@bedrift.no"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center mt-2"
                disabled={loading}
              >
                {loading ? "Sender..." : "Send tilbakestillingslenke"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
          </>
        )}

        <div className="mt-6 pt-6 border-t border-[#e8e4d8]">
          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 text-sm text-[#6b6660] hover:text-[#171717]"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til innlogging
          </Link>
        </div>
      </div>
    </div>
  );
}
