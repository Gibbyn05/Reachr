"use client";
import { TopBar } from "@/components/layout/top-bar";
import { FastForward, Plus, ArrowRight, Settings, Play, Contact, Search, MousePointer2, Reply, FileText, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";

export default function SekvenserPage() {
  const { sequences, removeSequence, loadSequences } = useAppStore();

  useEffect(() => {
    loadSequences();
  }, [loadSequences]);

  return (
    <div className="min-h-screen pb-12">
      <TopBar title="Sekvenser" subtitle="Automatiserte e-postkampanjer (Drip campaigns)" />

      <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 max-w-md w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Søk etter sekvens..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#d8d3c5] rounded-xl text-sm focus:outline-none focus:border-accent-dark transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="md" onClick={() => toast.info("Innstillinger for sekvenser kommer snart!")}>
              <Settings className="w-4 h-4 mr-2" />
              Innstillinger
            </Button>
            <Link href="/sekvenser/ny">
              <Button variant="primary" size="md">
                <Plus className="w-4 h-4 mr-2 text-[#171717]" />
                <span className="text-[#171717]">Ny sekvens</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Builder Preview (Hero Element) */}
        <div className="bg-[#171717] rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#09fe94] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff470a] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
          
          <div className="p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-white">
              <Badge className="bg-[#09fe94] text-[#171717] hover:bg-[#09fe94] font-bold mb-4 border-none shadow-lg">
                <FastForward className="w-3.5 h-3.5 mr-1" />
                Ny funksjon
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
                Bygg sekvenser som konverterer.
              </h2>
              <p className="text-white/70 text-base mb-8 max-w-lg leading-relaxed">
                Sett salgsprosessen på autopilot. Send AI-genererte e-poster, vent i X dager, og følg opp automatisk. Sekvensen stopper av seg selv i det sekundet kunden svarer på e-posten.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <Link href="/sekvenser/ny">
                  <Button className="bg-[#09fe94] hover:bg-[#00e882] text-[#171717] font-bold border-none h-12 px-6">
                    Prøv sekvensbyggeren <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 h-12 px-6" onClick={() => toast.info("Video-demo kommer snart!")}>
                  Se video-demo <Play className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Micro visual sequence builder builder mock */}
            <div className="flex-1 w-full max-w-sm relative z-10">
              <div className="space-y-3">
                {/* Step 1 */}
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-md relative transform transition-transform hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#09fe94]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Steg 1: Intro E-post</p>
                      <p className="text-xs text-white/60">Sendes automatisk dag 1</p>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center -my-1">
                  <div className="w-0.5 h-6 bg-white/20"></div>
                </div>
                
                {/* Condition */}
                <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-3 mx-8 text-center text-xs text-white/60">
                  <Clock className="w-3 h-3 inline-block mr-1" /> Vent: 3 dager
                </div>

                {/* Arrow */}
                <div className="flex justify-center -my-1">
                  <div className="w-0.5 h-6 bg-white/20"></div>
                </div>

                {/* Step 2 */}
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-md relative transform transition-transform hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#09fe94]/10 flex items-center justify-center">
                      <Reply className="w-4 h-4 text-[#05c472]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Steg 2: Oppfølging hvis ikke svar</p>
                      <p className="text-xs text-white/60">&quot;Hei igjen, sjekker bare...&quot;</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Sequences Table */}
        <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#e8e4d8]">
            <h3 className="text-base font-bold text-[#171717]">Dine aktive sekvenser</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfbf7] border-b border-[#e8e4d8] text-xs font-semibold text-[#a09b8f] uppercase tracking-wider">
                  <th className="p-4 pl-6">Sekvensnavn</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Mottakere</th>
                  <th className="p-4 hidden sm:table-cell">Statistikk (Åpnet / Svart)</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e4d8]">
                {sequences.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#6b6660]">
                      Du har ingen sekvenser enda. Opprett en for å komme i gang!
                    </td>
                  </tr>
                ) : sequences.map((seq) => (
                  <tr key={seq.id} className="hover:bg-white transition-colors group cursor-pointer">
                    <td className="p-4 pl-6">
                      <p className="text-sm font-bold text-[#171717]">{seq.name}</p>
                      <p className="text-xs text-[#a09b8f] mt-0.5">{seq.steps?.length || 0} steg totalt</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        seq.status === "Aktiv" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                      }`}>
                        {seq.status === "Aktiv" && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />}
                        {seq.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Contact className="w-4 h-4 text-[#a09b8f]" />
                        <span className="text-sm font-semibold text-[#171717]">{seq.enrolled}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell w-64 text-sm font-medium">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-accent-foreground flex items-center gap-1.5">
                          <MousePointer2 className="w-4 h-4" />
                          {seq.enrolled > 0 ? Math.round((seq.opened / seq.enrolled) * 100) : 0}%
                        </div>
                        <div className="text-accent-dark flex items-center gap-1.5">
                          <Reply className="w-4 h-4" />
                          {seq.enrolled > 0 ? Math.round((seq.replied / seq.enrolled) * 100) : 0}%
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); removeSequence(seq.id); toast.success("Sekvens fjernet"); }} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
