"use client";
import Link from "next/link";
import { motion, type Transition } from "framer-motion";
import { ArrowRight, Play, TrendingUp, Users, Bell } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { FlipWords } from "@/components/ui/flip-words";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" } as Transition,
});

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-0">
      {/* Subtle radial glow in background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(37,99,235,0.07),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_20%_at_50%_0%,rgba(37,99,235,0.05),transparent)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* ── Centered headline block ── */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          {/* Badge */}
          <motion.div {...fadeUp(0)} className="mb-8 inline-flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              3 dagers gratis prøveperiode – ingen kredittkort
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.1)}
            className="text-5xl sm:text-6xl md:text-[4.25rem] font-extrabold tracking-tight text-[#0F1729] leading-[1.05] mb-6"
          >
            Finn{" "}
            <span className="inline-block relative" style={{ minWidth: "7rem" }}>
              <FlipWords words={["leads", "kunder", "avtaler", "salg"]} duration={2800} />
            </span>
            <br />
            Ta kontakt.{" "}
            <span className="text-[#2563EB]">Lukk avtaler.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            {...fadeUp(0.2)}
            className="mx-auto max-w-xl text-lg text-gray-500 leading-relaxed mb-10"
          >
            Reachr er det norske B2B-verktøyet som hjelper deg finne nye kunder,
            følge opp leads og lukke avtaler – alt på ett sted.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-all duration-200 hover:bg-[#1D4ED8] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(37,99,235,0.5)]"
            >
              Start gratis i dag <ArrowRight size={16} />
            </Link>
            <button className="inline-flex items-center gap-3 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <Play size={12} fill="#2563EB" color="#2563EB" className="ml-0.5" />
              </span>
              Se demo
            </button>
          </motion.div>

          <motion.p {...fadeUp(0.45)} className="mt-6 text-xs text-gray-400">
            Brukt av <strong className="text-gray-500">500+ norske bedrifter</strong>
          </motion.p>
        </div>

        {/* ── App mockup ── */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-4xl px-6"
        >
          {/* Glow behind mockup */}
          <div className="pointer-events-none absolute -inset-10 top-8 bg-[radial-gradient(ellipse_70%_40%_at_50%_60%,rgba(37,99,235,0.1),transparent)]" />

          {/* Mockup frame with border beam */}
          <div className="relative rounded-2xl bg-black/[0.03] p-2 ring-1 ring-black/[0.06] shadow-[0_32px_80px_rgba(0,0,0,0.18)]">
            <BorderBeam
              size={320}
              duration={10}
              colorFrom="#2563EB"
              colorTo="#60A5FA"
              borderWidth={1.5}
            />

            {/* Browser chrome */}
            <div className="overflow-hidden rounded-xl bg-[#0F1729] ring-1 ring-white/5 shadow-xl">
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-white/5 bg-[#1A2540] px-4 py-3">
                <div className="flex gap-1.5">
                  {["#EF4444", "#F59E0B", "#2563EB"].map((c) => (
                    <div
                      key={c}
                      className="h-3 w-3 rounded-full opacity-70"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="mx-4 flex-1 rounded-md bg-white/5 px-4 py-1 text-[11px] text-white/30">
                  app.reachr.no/leadsok
                </div>
              </div>

              {/* App body */}
              <div className="flex h-[300px] sm:h-[340px]">
                {/* Sidebar */}
                <div className="w-44 shrink-0 border-r border-white/5 bg-[#0F1729] p-3">
                  <div className="mb-5 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-[#2563EB]" />
                    <span className="text-xs font-bold text-white">Reachr</span>
                  </div>
                  {[
                    ["Dashboard", false],
                    ["Leadsøk", true],
                    ["Mine Leads", false],
                    ["Varsler", false],
                    ["Innstillinger", false],
                  ].map(([label, active]) => (
                    <div
                      key={String(label)}
                      className={`mb-1 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs ${
                        active
                          ? "bg-white/10 font-semibold text-white"
                          : "text-white/40"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          active ? "bg-[#60A5FA]" : "bg-white/15"
                        }`}
                      />
                      {label}
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="flex-1 overflow-hidden bg-[#F8F9FC] p-4">
                  {/* Search row */}
                  <div className="mb-3 flex gap-2">
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2"
                      >
                        <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-gray-300" />
                        <div className="h-1.5 w-3/5 rounded bg-gray-200" />
                      </div>
                    ))}
                    <div className="flex items-center rounded-lg bg-[#2563EB] px-4 py-2">
                      <div className="h-1.5 w-8 rounded bg-white/85" />
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    {/* Header row */}
                    <div className="flex gap-3 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
                      {[1, 1, 1, 1].map((_, i) => (
                        <div key={i} className="h-1.5 flex-1 rounded bg-gray-200" />
                      ))}
                      <div className="h-1.5 w-16 shrink-0 rounded bg-gray-200" />
                    </div>
                    {/* Data rows */}
                    {[85, 72, 90, 78].map((w, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 px-4 py-2.5 ${
                          i < 3 ? "border-b border-gray-50" : ""
                        }`}
                      >
                        <div className="flex flex-1 items-center gap-2">
                          <div className="h-6 w-6 shrink-0 rounded-md bg-gray-100" />
                          <div
                            className="h-1.5 rounded bg-gray-700/50"
                            style={{ width: w }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="h-1.5 w-14 rounded bg-gray-300" />
                        </div>
                        <div className="flex-1">
                          <div className="h-4 w-14 rounded-md bg-gray-100" />
                        </div>
                        <div className="flex-1">
                          <div className="h-1.5 w-12 rounded bg-blue-200" />
                        </div>
                        <div className="w-16 shrink-0">
                          <div className="flex h-7 items-center justify-center rounded-md bg-[#2563EB]">
                            <div className="h-1 w-9 rounded bg-white/85" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating stat card – left */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -left-4 top-10 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <TrendingUp size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] leading-none text-gray-400 mb-1">Nye leads i dag</p>
              <p className="text-xl font-extrabold leading-none text-[#0F1729]">+24</p>
            </div>
          </motion.div>

          {/* Floating stat card – right top */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.85, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-4 top-16 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Users size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] leading-none text-gray-400 mb-1">Bookede møter</p>
              <p className="text-base font-extrabold leading-none text-[#0F1729]">7 denne uka</p>
            </div>
          </motion.div>

          {/* Floating stat card – right bottom */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.95, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-2 bottom-10 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
              <Bell size={18} className="text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] leading-none text-gray-400 mb-1">Varsler venter</p>
              <p className="text-base font-extrabold leading-none text-[#0F1729]">3 oppfølginger</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
