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
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(37,99,235,0.4)]">
            <Zap size={15} color="white" fill="white" />
          </div>
          <span className="font-extrabold text-lg text-[#0F1729] tracking-tight">Reachr</span>
        </Link>

        {/* Tubelight pill nav */}
        <div className="hidden md:flex items-center gap-0.5 bg-gray-100/80 rounded-full px-1 py-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.name;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveTab(link.name)}
                className={cn(
                  "relative px-5 py-2 text-sm font-medium rounded-full cursor-pointer select-none transition-colors duration-150",
                  isActive ? "text-[#0F1729]" : "text-gray-500 hover:text-gray-800",
                )}
              >
                {/* Spring-animated white pill background */}
                {isActive && (
                  <motion.span
                    layoutId="navbar-pill"
                    className="absolute inset-0 rounded-full bg-white shadow-sm"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {/* Tubelight lamp – sits just above the pill */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-lamp"
                    className="absolute left-1/2 -translate-x-1/2 -top-px h-[3px] w-7 rounded-full bg-[#2563EB]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-[#2563EB] blur-[2px]" />
                    <div className="absolute -left-3.5 -top-1 h-5 w-14 rounded-full bg-[#2563EB]/20 blur-lg" />
                  </motion.div>
                )}
                {/* Text sits above the absolute pill */}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Logg inn
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-5 py-2.5 rounded-xl shadow-[0_1px_8px_rgba(37,99,235,0.35)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(37,99,235,0.4)]"
          >
            Start gratis
          </Link>
        </div>
      </div>
    </nav>
  );
}
