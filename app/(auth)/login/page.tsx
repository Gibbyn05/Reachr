"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      // Sign out any existing session before logging in as a new user
      await supabase.auth.signOut();
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Tilkoblingen tok for lang tid. Sjekk internettforbindelsen og prøv igjen.")), 10000)
      );
      const { error } = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
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

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#171717] mb-2">Logg inn på Reachr</h1>
          <p className="text-[#6b6660] text-sm">
            Har du ikke konto?{" "}
            <Link href="/register" className="text-[#ff470a] font-semibold hover:underline">
              Registrer deg gratis
            </Link>
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-[#ff470a]/8 border border-[#ff470a]/20 px-4 py-3 text-sm text-[#ff470a]">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-[#3d3a34]">Passord</label>
              <Link href="#" className="text-xs text-[#ff470a] hover:underline">
                Glemt passord?
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Ditt passord"
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center mt-2"
            disabled={loading}
          >
            {loading ? "Logger inn..." : "Logg inn"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#e8e4d8]">
          <p className="text-center text-xs text-[#a09b8f]">
            Ved å logge inn godtar du våre{" "}
            <Link href="#" className="underline">vilkår</Link> og{" "}
            <Link href="#" className="underline">personvernreglene</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
