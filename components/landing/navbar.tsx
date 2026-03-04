"use client";
import Link from "next/link";
import { useState } from "react";
import { Zap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-xl text-[#0F1729] tracking-tight">Reachr</span>
        </Link>

        {/* Nav links - desktop */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          <Link href="#features" className="text-sm text-gray-600 hover:text-[#0F1729] transition-colors font-medium">
            Funksjoner
          </Link>
          <Link href="#pricing" className="text-sm text-gray-600 hover:text-[#0F1729] transition-colors font-medium">
            Priser
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-[#0F1729] transition-colors font-medium">
            Om oss
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-[#0F1729] transition-colors font-medium">
            Kontakt
          </Link>
        </div>

        {/* CTA buttons - desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="md" className="text-slate-700 hover:text-slate-900">
              Logg inn
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="md">
              Start gratis
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden ml-auto p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          <Link href="#features" className="block text-sm text-gray-600 py-2">Funksjoner</Link>
          <Link href="#pricing" className="block text-sm text-gray-600 py-2">Priser</Link>
          <Link href="#" className="block text-sm text-gray-600 py-2">Om oss</Link>
          <Link href="#" className="block text-sm text-gray-600 py-2">Kontakt</Link>
          <div className="pt-3 border-t border-gray-100 flex gap-3">
            <Link href="/login" className="flex-1">
              <Button variant="secondary" size="md" className="w-full justify-center">Logg inn</Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button variant="primary" size="md" className="w-full justify-center">Start gratis</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
