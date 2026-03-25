"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteEmail = searchParams.get("invite") ?? "";
  const inviterEmail = searchParams.get("inviter") ?? "";
  const inviteCompany = searchParams.get("company") ?? "";
  const inviterName = searchParams.get("name") ?? inviterEmail;
  const isInvited = !!inviteEmail && !!inviterEmail;

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(inviteEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(isInvited);

  // If already logged in with the invited email, link team and go to dashboard
  useEffect(() => {
    if (!isInvited) return;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user && user.email === inviteEmail) {
        await fetch("/api/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ owner_email: inviterEmail, member_name: user.user_metadata?.full_name ?? "" }),
        });
        await supabase.auth.updateUser({ data: { team_owner: inviterEmail } });
        router.replace("/dashboard");
      } else {
        setCheckingSession(false);
      }
    });
  }, [isInvited, inviteEmail, inviterEmail, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Tilkoblingen tok for lang tid. Sjekk internettforbindelsen og prøv igjen.")), 10000)
      );
      const { data, error } = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        timeout,
      ]);

      if (error) {
        setError(error.message);
        return;
      }

      // If opened via invite link, link this account to the team owner
      if (isInvited && data.user) {
        await fetch("/api/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner_email: inviterEmail,
            member_name: data.user.user_metadata?.full_name ?? "",
          }),
        });
        // Always update team_owner metadata so subscription check works reliably
        await supabase.auth.updateUser({
          data: { team_owner: inviterEmail },
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

  if (checkingSession) {
    return (
      <div className="w-full max-w-md flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-[#09fe94] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {isInvited && (
        <div className="mb-4 bg-[#171717] rounded-2xl border border-[#2a2a2a] p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#09fe94]/10 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-[#09fe94]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">
              Du er invitert til{inviteCompany ? ` ${inviteCompany}` : " et team"} på Reachr
            </p>
            <p className="text-[#a09b8f] text-xs mt-0.5">
              {inviterName !== inviterEmail ? inviterName : inviterEmail} har lagt deg til som teammedlem.
              Logg inn for å få tilgang — du trenger ikke betale selv.
            </p>
          </div>
        </div>
      )}

      <div className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="Reachr" className="w-14 h-14" />
          </div>
          <h1 className="text-2xl font-bold text-[#171717] mb-2">
            {isInvited ? "Logg inn for å bli med" : "Logg inn på Reachr"}
          </h1>
          <p className="text-[#6b6660] text-sm">
            {isInvited ? (
              <>
                Ny på Reachr?{" "}
                <Link
                  href={`/register?invite=${encodeURIComponent(inviteEmail)}&inviter=${encodeURIComponent(inviterEmail)}&company=${encodeURIComponent(inviteCompany)}&name=${encodeURIComponent(inviterName)}`}
                  className="text-[#ff470a] font-semibold hover:underline"
                >
                  Opprett konto her
                </Link>
              </>
            ) : (
              <>
                Har du ikke konto?{" "}
                <Link href="/register" className="text-[#ff470a] font-semibold hover:underline">
                  Registrer deg gratis
                </Link>
              </>
            )}
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
              readOnly={!!inviteEmail}
              className={inviteEmail ? "opacity-70" : ""}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-[#3d3a34]">Passord</label>
              <Link href="/glemt-passord" className="text-xs text-[#ff470a] hover:underline">
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
            {loading ? "Logger inn..." : isInvited ? "Logg inn og bli med" : "Logg inn"}
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-96 bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] animate-pulse" />}>
      <LoginForm />
    </Suspense>
  );
}
