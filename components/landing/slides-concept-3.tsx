"use client";
/**
 * KONSEPT 3 — "AI-meldingsgenerator"
 * Stil: Lys krem — alle bobler og kort konsistent cream-design
 * Simulerer at AI skriver en e-post / SMS — cycling gjennom eksempler
 * Caption: "AI skriver — du sender — kunden svarer"
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";

const messages = [
  {
    company: "Vestland Elektro AS",
    contact: "Kari Andersen, daglig leder",
    subject: "Rask spørsmål om nye kunder til Vestland",
    body: "Hei Kari! Jeg så at Vestland Elektro AS har vokst mye de siste månedene — imponerende! Vi hjelper elektrikerfirmaer i bergensregionen finne nye B2B-kunder automatisk. Kan jeg vise deg hvordan det fungerer på 15 min?",
    type: "E-post",
    color: "#09fe94",
  },
  {
    company: "Kjeldsberg Bygg AS",
    contact: "Ole Kjeldsberg, eier",
    subject: "Spar 10 timer i uken på kundejakt",
    body: "Hei Ole! Mange byggfirmaer i Trondheim sliter med å finne nye oppdrag i rolige perioder. Vi har et verktøy som automatisk finner og kontakter potensielle kunder for deg — 100% norsk og GDPR-trygt. Interessert?",
    type: "E-post",
    color: "#09fe94",
  },
  {
    company: "Polaris Renhold AS",
    contact: "Hanne Nordvik, salgssjef",
    subject: null,
    body: "Hei Hanne! Jeg hjelper renholdsbedrifter i Nordland finne nye bedriftskunder raskt. Har du 10 min til en kort prat? 😊",
    type: "SMS",
    color: "#ffad0a",
  },
  {
    company: "Bakke & Lund Advokater",
    contact: "Petter Bakke, partner",
    subject: "Nye klienter til Bakke & Lund?",
    body: "Hei Petter! Jeg la merke til at Bakke & Lund jobber mye med entrepriserett — et felt der mange byggfirmaer trenger juridisk bistand akkurat nå. Kan vi ta en kort prat om hvordan vi kan hjelpe dere nå kundene?",
    type: "E-post",
    color: "#09fe94",
  },
];

export function SlidesConceptThree() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<"typing" | "done" | "wait">("typing");

  const current = messages[index];
  const bodyText = current.body;

  useEffect(() => {
    setTyped(0);
    setPhase("typing");
  }, [index]);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typed >= bodyText.length) {
      setPhase("done");
      const t = setTimeout(() => {
        setPhase("wait");
        setTimeout(() => setIndex((i) => (i + 1) % messages.length), 600);
      }, 2200);
      return () => clearTimeout(t);
    }
    const delay = typed < 20 ? 30 : typed < bodyText.length - 20 ? 12 : 30;
    const t = setTimeout(() => setTyped((n) => n + 1), delay);
    return () => clearTimeout(t);
  }, [typed, phase, bodyText]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-xl mx-auto"
      >
        {/* Melding-kortbeholder */}
        <div className="rounded-2xl border border-[#d8d3c5] bg-[#faf8f2] overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#d8d3c5] bg-[#ede9da]">
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold"
              style={{
                backgroundColor: current.type === "SMS" ? "#ffad0a22" : "#09fe9422",
                color: current.type === "SMS" ? "#7a4f00" : "#065c3a",
              }}
            >
              <Sparkles size={10} />
              AI genererer {current.type}
            </div>
            <span className="ml-auto text-[11px] text-[#6b6660]">{current.company}</span>
          </div>

          <div className="p-5 space-y-3">
            {/* Til */}
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-[#a09b8f] w-10 shrink-0">Til:</span>
              <span className="text-[#171717] font-medium">{current.contact}</span>
            </div>

            {/* Emne */}
            {current.subject && (
              <div className="flex items-start gap-2 text-[11px]">
                <span className="text-[#a09b8f] w-10 shrink-0">Emne:</span>
                <span className="text-[#171717] font-semibold">{current.subject}</span>
              </div>
            )}

            {/* Separator */}
            <div className="border-t border-[#d8d3c5]" />

            {/* Body med skriveeffekt */}
            <p className="text-[12px] text-[#6b6660] leading-relaxed min-h-[72px]">
              {bodyText.slice(0, typed)}
              {phase === "typing" && (
                <motion.span
                  className="inline-block w-[2px] h-[13px] ml-0.5 rounded-sm align-text-bottom bg-[#ff470a]"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                />
              )}
            </p>

            {/* Send-knapp — vises når ferdig */}
            <AnimatePresence>
              {phase === "done" && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl bg-[#09fe94] px-4 py-2 text-[11px] font-bold text-[#171717]"
                >
                  <Send size={11} /> Send {current.type}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Punktindikator */}
        <div className="flex justify-center gap-1.5 mt-4">
          {messages.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? 18 : 6,
                height: 6,
                backgroundColor: i === index ? "#171717" : "#d8d3c5",
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
