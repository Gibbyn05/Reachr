"use client";
import { TopBar } from "@/components/layout/top-bar";
import { Zap, Plus, ArrowRight, Settings2, Play, Users, MoreVertical, Search, MousePointerClick, Reply, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MOCK_SEQUENCES = [
  {
    id: "seq-1",
    name: "Standard B2B Intro-kampanje",
    status: "Aktiv",
    enrolled: 142,
    replied: 31,
    opened: 89,
    steps: 3,
  },
  {
    id: "seq-2",
    name: "Oppfølging: Avslag via telefon",
    status: "Pauset",
    enrolled: 45,
    replied: 8,
    opened: 22,
    steps: 2,
  },
  {
    id: "seq-3",
    name: "Varme leads - Nyhetsbrev",
    status: "Aktiv",
    enrolled: 812,
    replied: 104,
    opened: 580,
    steps: 6,
  }
];

export default function SekvenserPage() {
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
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#d8d3c5] rounded-xl text-sm focus:outline-none focus:border-[#09fe94] transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="md">
              <Settings2 className="w-4 h-4 mr-2" />
              Innstillinger
            </Button>
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 mr-2 text-[#171717]" />
              <span className="text-[#171717]">Ny sekvens</span>
            </Button>
          </div>
        </div>

        {/* Builder Preview (Hero Element) */}
        <div className="bg-[#171717] rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#09fe94] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
          
          <div className="p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-white">
              <Badge className="bg-[#09fe94] text-[#171717] hover:bg-[#09fe94] font-bold mb-4 border-none shadow-lg">
                <Zap className="w-3.5 h-3.5 mr-1" />
                Ny funksjon
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
                Bygg sekvenser som konverterer.
              </h2>
              <p className="text-white/70 text-base mb-8 max-w-lg leading-relaxed">
                Sett salgsprosessen på autopilot. Send AI-genererte e-poster, vent i X dager, og følg opp automatisk. Sekvensen stopper av seg selv i det sekundet kunden svarer på e-posten.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <Button className="bg-[#09fe94] hover:bg-[#00e882] text-[#171717] font-bold border-none h-12 px-6">
                  Prøv sekvensbyggeren <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 h-12 px-6">
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
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
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
                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                      <Reply className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Steg 2: Oppfølging hvis ikke svar</p>
                      <p className="text-xs text-white/60">"Hei igjen, sjekker bare..."</p>
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
                <tr className="bg-gray-50 border-b border-[#e8e4d8] text-xs font-semibold text-[#a09b8f] uppercase tracking-wider">
                  <th className="p-4 pl-6">Sekvensnavn</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Mottakere</th>
                  <th className="p-4 hidden sm:table-cell">Statistikk (Åpnet / Svart)</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e4d8]">
                {MOCK_SEQUENCES.map((seq) => (
                  <tr key={seq.id} className="hover:bg-white transition-colors group cursor-pointer">
                    <td className="p-4 pl-6">
                      <p className="text-sm font-bold text-[#171717]">{seq.name}</p>
                      <p className="text-xs text-[#a09b8f] mt-0.5">{seq.steps} steg totalt</p>
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
                        <Users className="w-4 h-4 text-[#a09b8f]" />
                        <span className="text-sm font-semibold text-[#171717]">{seq.enrolled}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell w-64 text-sm font-medium">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-blue-600 flex items-center gap-1.5">
                          <MousePointerClick className="w-4 h-4" />
                          {Math.round((seq.opened / seq.enrolled) * 100)}%
                        </div>
                        <div className="text-green-600 flex items-center gap-1.5">
                          <Reply className="w-4 h-4" />
                          {Math.round((seq.replied / seq.enrolled) * 100)}%
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-[#171717] rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreVertical className="w-5 h-5" />
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
