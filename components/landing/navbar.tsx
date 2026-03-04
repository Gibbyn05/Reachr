"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Funksjoner", href: "#features" },
  { name: "Priser", href: "#pricing" },
  { name: "Om oss", href: "#" },
  { name: "Kontakt", href: "#" },
];

export function Navbar() {
  const [activeTab, setActiveTab] = useState("Funksjoner");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 no-underline">
          <div className="w-8 h-8 bg-[#22C55E] rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(34,197,94,0.4)]">
            <Zap size={15} color="white" fill="white" />
          </div>
          <span className="font-extrabold text-lg text-[#0F1729] tracking-tight">Reachr</span>
        </Link>

        {/* Tubelight pill nav links */}
        <div className="hidden md:flex items-center gap-0.5 bg-gray-100/80 rounded-full px-1 py-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.name;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveTab(link.name)}
                className={cn(
                  "relative px-5 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer select-none",
                  isActive ? "text-[#0F1729]" : "text-gray-500 hover:text-gray-800",
                )}
              >
                {/* Active pill background */}
                {isActive && (
                  <motion.span
                    layoutId="navbar-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {/* Tubelight lamp effect on top */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-lamp"
                    className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-7 h-[3px] bg-[#22C55E] rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  >
                    <div className="absolute inset-0 blur-[2px] bg-[#22C55E] rounded-full" />
                    <div className="absolute w-14 h-5 -left-3.5 -top-1 bg-[#22C55E]/20 blur-lg rounded-full" />
                    <div className="absolute w-8 h-4 left-0 -top-0.5 bg-[#22C55E]/15 blur-md rounded-full" />
                  </motion.div>
                )}
                {link.name}
              </a>
            );
          })}
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Logg inn
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] px-5 py-2.5 rounded-xl shadow-[0_1px_8px_rgba(34,197,94,0.35)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(34,197,94,0.4)]"
          >
            Start gratis
          </Link>
        </div>
      </div>
    </nav>
  );
}
