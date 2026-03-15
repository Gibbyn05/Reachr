"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/language-context";

const navLinksNo = [
  { name: "Funksjoner", href: "#features" },
  { name: "Priser", href: "#pricing" },
  { name: "Om oss", href: "#om-oss" },
  { name: "Kontakt", href: "#kontakt" },
];

const navLinksEn = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "About", href: "#om-oss" },
  { name: "Contact", href: "#kontakt" },
];

export function Navbar() {
  const { lang, toggleLang } = useLanguage();
  const navLinks = lang === "en" ? navLinksEn : navLinksNo;

  const [activeTab, setActiveTab] = useState(navLinks[0].name);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setActiveTab(navLinks[0].name);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || mobileOpen
          ? "bg-[#f2efe3]/95 backdrop-blur-md border-b border-[#d8d3c5] shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 no-underline">
          <img src="/logo.svg" alt="Reachr" className="w-9 h-9" />
          <span className="font-bold text-xl text-[#171717]" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>Reachr</span>
        </Link>

        {/* Pill nav — desktop */}
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

        {/* CTAs — desktop */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="text-xs font-bold text-[#6b6660] hover:text-[#171717] border border-[#d8d3c5] hover:border-[#a09b8f] px-3 py-1.5 rounded-lg hover:bg-[#e8e4d8] transition-colors"
            title={lang === "no" ? "Switch to English" : "Bytt til norsk"}
          >
            {lang === "no" ? "EN" : "NO"}
          </button>
          <Link
            href="/login"
            className="text-sm font-semibold text-[#6b6660] hover:text-[#171717] px-4 py-2 rounded-lg hover:bg-[#e8e4d8] transition-colors"
          >
            {lang === "en" ? "Log in" : "Logg inn"}
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold text-[#171717] bg-[#09fe94] hover:bg-[#00e882] px-5 py-2.5 rounded-xl shadow-[0_1px_8px_rgba(9,254,148,0.4)] transition-all duration-200 hover:-translate-y-px"
          >
            {lang === "en" ? "Start for free" : "Start gratis"}
          </Link>
        </div>

        {/* Mobile: lang toggle + CTA + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLang}
            className="text-xs font-bold text-[#6b6660] border border-[#d8d3c5] px-2.5 py-1.5 rounded-lg"
          >
            {lang === "no" ? "EN" : "NO"}
          </button>
          <Link
            href="/register"
            className="text-sm font-bold text-[#171717] bg-[#09fe94] px-4 py-2 rounded-xl"
          >
            {lang === "en" ? "Start free" : "Start gratis"}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-[#e8e4d8] transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5 text-[#171717]" /> : <Menu className="w-5 h-5 text-[#171717]" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[#f2efe3]/98 border-t border-[#d8d3c5]"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => { setActiveTab(link.name); setMobileOpen(false); }}
                  className="px-4 py-3 text-sm font-medium text-[#3d3a34] hover:text-[#171717] hover:bg-[#e8e4d8] rounded-xl transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2 border-t border-[#d8d3c5] mt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold text-[#6b6660] hover:text-[#171717] hover:bg-[#e8e4d8] rounded-xl transition-colors"
                >
                  {lang === "en" ? "Log in" : "Logg inn"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
