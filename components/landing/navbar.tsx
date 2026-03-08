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
          ? "bg-[#f2efe3]/95 backdrop-blur-md border-b border-[#d8d3c5] shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 no-underline">
          <div className="w-8 h-8 bg-[#09fe94] rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(9,254,148,0.4)]">
            <Zap size={15} color="#171717" fill="#171717" />
          </div>
          <span className="font-bold text-xl text-[#171717]" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>Reachr</span>
        </Link>

        {/* Pill nav */}
        <div className="hidden md:flex items-center gap-0.5 bg-[#e8e4d8]/80 rounded-full px-1 py-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.name;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveTab(link.name)}
                className={cn(
                  "relative px-5 py-2 text-sm font-medium rounded-full cursor-pointer select-none transition-colors duration-150",
                  isActive ? "text-[#171717]" : "text-[#6b6660] hover:text-[#3d3a34]",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-pill"
                    className="absolute inset-0 rounded-full bg-[#f2efe3] shadow-sm"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="navbar-lamp"
                    className="absolute left-1/2 -translate-x-1/2 -top-px h-[3px] w-7 rounded-full bg-[#09fe94]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-[#09fe94] blur-[2px]" />
                    <div className="absolute -left-3.5 -top-1 h-5 w-14 rounded-full bg-[#09fe94]/25 blur-lg" />
                  </motion.div>
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#6b6660] hover:text-[#171717] px-4 py-2 rounded-lg hover:bg-[#e8e4d8] transition-colors"
          >
            Logg inn
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold text-[#171717] bg-[#09fe94] hover:bg-[#00e882] px-5 py-2.5 rounded-xl shadow-[0_1px_8px_rgba(9,254,148,0.4)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(9,254,148,0.5)]"
          >
            Start gratis
          </Link>
        </div>
      </div>
    </nav>
  );
}
