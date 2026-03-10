"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Search, Users, LayoutDashboard, Bell } from "lucide-react";

const slides = [
  {
    title: "Velkommen til Reachr! 👋",
    description: "Din AI-drevne B2B salgs-assistent. La oss vise deg rundt.",
    icon: null,
    color: "#09fe94",
  },
  {
    title: "Leadsøk",
    description: "Søk etter bedrifter fra Brønnøysundregistrene (250 000+ norske selskaper). Finn og legg til potensielle kunder i sekunder.",
    icon: Search,
    color: "#ff470a",
  },
  {
    title: "Mine Leads",
    description: "Ditt CRM. Se alle dine leads i en pipeline, legg til notater, send AI-genererte e-poster og SMS-er, og følg opp på autopilot.",
    icon: Users,
    color: "#09fe94",
  },
  {
    title: "Dashboard",
    description: "Oversikt over din salgspipeline. Se statistikk over kontaktforsøk, møter, og hvilke leads du må følge opp.",
    icon: LayoutDashboard,
    color: "#ffad0a",
  },
  {
    title: "Varsler",
    description: "Automatiske påminnelser om oppfølging. Klikk på bedriftsnavnet for å se detaljer og merknad på hver lead.",
    icon: Bell,
    color: "#05c472",
  },
  {
    title: "Du er klar! 🚀",
    description: "Begynn å søke etter leads og få dem til å bli kunder. Har du spørsmål? Sjekk innstillinger → Hjelp.",
    icon: null,
    color: "#09fe94",
  },
];

export function OnboardingModal() {
  const [current, setCurrent] = useState(0);
  const [seen, setSeen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeen = localStorage.getItem("reachr-onboarding-seen");
    if (!hasSeen) {
      setSeen(false);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("reachr-onboarding-seen", "1");
    setSeen(true);
  };

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  if (!mounted || seen) return null;

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-[#faf8f2] rounded-2xl border border-[#d8d3c5] p-8 max-w-lg w-full mx-4"
          style={{ boxShadow: "0 20px 25px rgba(0,0,0,0.15)" }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 text-[#a09b8f] hover:text-[#6b6660] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="text-center mb-8">
            {Icon && (
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${slide.color}20` }}
                >
                  <Icon className="w-8 h-8" style={{ color: slide.color }} />
                </div>
              </div>
            )}
            <h2 className="text-2xl font-bold text-[#171717] mb-3">{slide.title}</h2>
            <p className="text-[#6b6660] leading-relaxed">{slide.description}</p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === current
                    ? "bg-[#09fe94] w-6"
                    : "bg-[#d8d3c5] w-2 hover:bg-[#c5bfb0]"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className="p-2 text-[#6b6660] hover:text-[#171717] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {current === slides.length - 1 ? (
              <Button
                variant="primary"
                onClick={handleClose}
                className="flex-1"
              >
                Kom i gang! →
              </Button>
            ) : (
              <>
                <span className="text-xs text-[#a09b8f]">
                  {current + 1} / {slides.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-2 text-[#09fe94] hover:text-[#05c472] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
