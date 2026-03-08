"use client";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#f2efe3] flex flex-col">
      <nav className="bg-[#faf8f2] border-b border-[#d8d3c5] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <img src="/logo.svg" alt="Reachr" className="w-8 h-8" />
          <span className="font-bold text-xl text-[#171717]" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>Reachr</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-[#6b6660] hover:text-[#171717] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logg ut
        </button>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        {children}
      </div>

      <footer className="text-center py-6 text-sm text-[#a09b8f]">
        © 2025 Reachr AS · Alle rettigheter forbeholdt
      </footer>
    </div>
  );
}
