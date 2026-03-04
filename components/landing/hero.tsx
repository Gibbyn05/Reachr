import Link from "next/link";
import { ArrowRight, Play, TrendingUp, Users, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-white to-[#F8F9FC]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            3 dagers gratis prøveperiode – ingen kredittkort
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#0F1729] leading-tight mb-6 tracking-tight">
            Finn leads.{" "}
            <span className="text-green-500">Ta kontakt.</span>
            <br />
            Lukk avtaler.
          </h1>

          {/* Subtext */}
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Reachr er det norske B2B verktøyet som hjelper deg finne nye kunder,
            følge opp leads og bygge varige forretningsrelasjoner – alt på ett sted.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg" className="text-base px-8 py-3 shadow-lg shadow-green-500/25">
                Start gratis i dag
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <button className="flex items-center gap-2.5 text-slate-700 font-medium hover:text-slate-900 transition-colors">
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-200">
                <Play className="w-4 h-4 text-green-500 fill-green-500 ml-0.5" />
              </div>
              Se demo
            </button>
          </div>

          {/* Social proof */}
          <p className="text-sm text-gray-400 mt-8">
            Over <strong className="text-gray-600">500+ norske bedrifter</strong> bruker allerede Reachr
          </p>
        </div>

        {/* App mockup */}
        <div className="relative max-w-5xl mx-auto">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>

          {/* Main mockup container */}
          <div className="relative bg-[#0F1729] rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.25)] overflow-hidden border border-white/10 animate-float">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-[#1A2540] border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
              </div>
              <div className="flex-1 mx-4 bg-white/10 rounded-md px-4 py-1 text-white/40 text-xs">
                app.reachr.no/leadsok
              </div>
            </div>

            {/* App UI mockup */}
            <div className="flex h-80">
              {/* Sidebar mockup */}
              <div className="w-48 bg-[#0F1729] border-r border-white/10 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-green-500 rounded-md"></div>
                  <span className="text-white font-bold text-sm">Reachr</span>
                </div>
                {["Dashboard", "Leadsøk", "Mine Leads", "Varsler", "Innstillinger"].map((item, i) => (
                  <div
                    key={item}
                    className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs ${
                      i === 1 ? "bg-white/15 text-white" : "text-white/50"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? "bg-green-400" : "bg-white/20"}`}></div>
                    {item}
                  </div>
                ))}
              </div>

              {/* Main content mockup */}
              <div className="flex-1 bg-[#F8F9FC] p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-9 bg-white rounded-lg border border-gray-200 flex items-center px-3 gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="h-2 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1 h-9 bg-white rounded-lg border border-gray-200 flex items-center px-3 gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="h-2 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-9 px-4 bg-green-500 rounded-lg flex items-center">
                    <div className="h-2 w-12 bg-white/80 rounded"></div>
                  </div>
                </div>
                {/* Table mockup */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                    {["Bedrift", "Kontaktperson", "Bransje", "Omsetning", ""].map((h) => (
                      <div key={h} className="flex-1 h-2 bg-gray-200 rounded text-xs text-gray-500">{h}</div>
                    ))}
                  </div>
                  {[
                    ["Bergheim Regnskap", "Anders Bergheim", "Regnskap", "8,5 MNOK"],
                    ["Nordvik Bygg AS", "Erik Nordvik", "Bygg", "15,6 MNOK"],
                    ["TechStart Bergen", "Silje Bakke", "IT", "3,2 MNOK"],
                    ["Hansen & Co", "Ingrid Hansen", "Juridisk", "22 MNOK"],
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0">
                      {row.map((cell, j) => (
                        <div key={j} className="flex-1">
                          <div className={`h-2 rounded ${j === 0 ? "bg-slate-700 w-24" : j === 3 ? "bg-green-200 w-16" : "bg-gray-200 w-20"}`}></div>
                        </div>
                      ))}
                      <div className="flex-1 flex justify-end">
                        <div className="h-6 w-20 bg-green-500 rounded-md"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating stats cards */}
          <div className="absolute -left-8 top-20 bg-white rounded-xl shadow-xl p-4 border border-gray-100 hidden lg:flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Nye leads i dag</p>
              <p className="text-lg font-bold text-slate-900">+24</p>
            </div>
          </div>

          <div className="absolute -right-8 top-32 bg-white rounded-xl shadow-xl p-4 border border-gray-100 hidden lg:flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Bookede møter</p>
              <p className="text-lg font-bold text-slate-900">7 denne uka</p>
            </div>
          </div>

          <div className="absolute -right-6 bottom-16 bg-white rounded-xl shadow-xl p-4 border border-gray-100 hidden lg:flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Varsler venter</p>
              <p className="text-lg font-bold text-slate-900">3 oppfølginger</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
