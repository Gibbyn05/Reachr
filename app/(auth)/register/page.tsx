"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

function RegisterForm() {
  const searchParams = useSearchParams();
  const inviteEmail = searchParams.get("invite") ?? "";
  const inviterEmail = searchParams.get("inviter") ?? "";
  const inviteCompany = searchParams.get("company") ?? "";
  const isInvited = !!inviteEmail && !!inviterEmail;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: inviteEmail,
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
              company: isInvited ? inviteCompany : "",
              team_owner: isInvited ? inviterEmail : undefined,
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
        window.location.href = "/dashboard";
        return;
      }

      // Normal flow: go to payment page
      window.location.href = "/onboarding/betaling";
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
            {isInvited ? "Bli med i teamet" : "Opprett konto"}
          </h1>
          <p className="text-[#6b6660] text-sm">
            {isInvited
              ? "Du er invitert til Reachr. Opprett kontoen din for å komme i gang."
              : <>
                  Allerede registrert?{" "}
                  <Link href="/login" className="text-[#ff470a] font-semibold hover:underline">
                    Logg inn her
                  </Link>
                </>
            }
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-[#ff470a]/8 border border-[#ff470a]/20 px-4 py-3 text-sm text-[#ff470a]">
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
              placeholder="du@bedrift.no"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              readOnly={!!inviteEmail}
              className={inviteEmail ? "opacity-70" : ""}
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
            {loading ? "Oppretter konto..." : isInvited ? "Kom i gang" : "Neste"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#e8e4d8]">
          <p className="text-center text-xs text-[#a09b8f]">
            Ved å registrere deg godtar du våre{" "}
            <Link href="#" className="underline">vilkår</Link> og{" "}
            <Link href="#" className="underline">personvernreglene</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-96 bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] animate-pulse" />}>
      <RegisterForm />
    </Suspense>
  );
}
