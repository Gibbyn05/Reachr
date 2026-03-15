"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "no" | "en";

interface LanguageContextValue {
  lang: Lang;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "no",
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("no");

  useEffect(() => {
    const saved = localStorage.getItem("reachr-lang") as Lang | null;
    if (saved === "en" || saved === "no") setLang(saved);
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === "no" ? "en" : "no";
    setLang(next);
    localStorage.setItem("reachr-lang", next);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
