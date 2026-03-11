"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Clock, Mail, Trash2, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { SequenceStep, Sequence } from "@/lib/mock-data";
export default function NySekvensPage() {
  const router = useRouter();
  const { addSequence, currentUser } = useAppStore();
  const [name, setName] = useState("Min nye sekvens");
  const [generatingStepIds, setGeneratingStepIds] = useState<Set<string>>(new Set());
  const [steps, setSteps] = useState<SequenceStep[]>([
    { id: "1", type: "email", subject: "Introduksjon til [Selskap]", body: "Hei [Navn],\\n\\nVi hjelper selskaper som [Selskap] med..." },
    { id: "2", type: "wait", waitDays: 3 },
    { id: "3", type: "email", subject: "Re: Introduksjon", body: "Hei igjen,\\n\\nHadde du sjanse til å se på min forrige e-post?" }
  ]);

  const addEmailStep = () => {
    setSteps([...steps, { id: Date.now().toString(), type: "email", subject: "", body: "" }]);
  };

  const addWaitStep = () => {
    setSteps([...steps, { id: Date.now().toString(), type: "wait", waitDays: 2 }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const generateAiStep = async (index: number) => {
    const step = steps[index];
    setGeneratingStepIds(prev => new Set(prev).add(step.id));
    try {
      const res = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: currentUser?.name || "Selger",
          salesPitch: currentUser?.salesPitch,
          targetCustomers: currentUser?.targetCustomers,
          comment: index === 0 ? "Dette er den første introduksjons-e-posten i en sekvens. Bruk {{navn}} og {{bedrift}} som placeholders." : `Dette er oppfølging nummer ${index} i en sekvens. Hold det kort. Bruk {{navn}} og {{bedrift}} som placeholders.`,
          isSequence: true,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const newSteps = [...steps];
      newSteps[index] = {
        ...newSteps[index],
        subject: data.subject || "",
        body: data.body || "",
      };
      setSteps(newSteps);
      toast.success("AI genererte et utkast!");
    } catch (err: any) {
      toast.error("AI-generering feilet: " + err.message);
    } finally {
      setGeneratingStepIds(prev => {
        const next = new Set(prev);
        next.delete(step.id);
        return next;
      });
    }
  };

  const saveSequence = async () => {
    if (!name.trim()) return toast.error("Vennligst gi sekvensen et navn");
    const newSeq: Sequence = {
      id: "seq-" + Date.now(),
      name,
      status: "Aktiv",
      enrolled: 0,
      replied: 0,
      opened: 0,
      steps
    };
    
    const promise = addSequence(newSeq);
    toast.promise(promise, {
      loading: "Lagrer sekvens...",
      success: "Sekvensen ble lagret!",
      error: "Klarte ikke lagre sekvens. Vennligst sjekk tilkoblingen."
    });

    await promise;
    setTimeout(() => {
      router.push("/sekvenser");
    }, 1000);
  };

  return (
    <div className="min-h-screen pb-20 bg-[#f2efe3]">
      <div className="bg-[#faf8f2] border-b border-[#e8e4d8] sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/sekvenser" className="p-2 hover:bg-[#e8e4d8] rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#6b6660]" />
            </Link>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg font-bold text-[#171717] bg-transparent border-none focus:outline-none hover:bg-[#e8e4d8] px-2 py-1 rounded"
            />
          </div>
          <Button variant="primary" onClick={saveSequence}>
            <Save className="w-4 h-4 mr-2 text-[#171717]" />
            <span className="text-[#171717]">Lagre & Aktiver</span>
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#171717] mb-2">Sekvensbygger</h1>
          <p className="text-[#6b6660]">Drip-kampanjer stopper automatisk hvis en mottaker svarer på en e-post.</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {index > 0 && (
                <div className="absolute -top-4 left-6 w-0.5 h-4 bg-[#d8d3c5]"></div>
              )}
              
              {step.type === "email" ? (
                <div className="bg-white rounded-xl border border-[#d8d3c5] shadow-sm overflow-hidden group">
                  <div className="bg-[#fcfbf9] px-4 py-3 border-b border-[#e8e4d8] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-[#171717]">Steg {index + 1}: Send e-post</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => generateAiStep(index)} 
                        disabled={generatingStepIds.has(step.id)}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                      >
                        {generatingStepIds.has(step.id) ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Zap className="w-3.5 h-3.5" />
                        )}
                        AI Skriver
                      </button>
                      <button onClick={() => removeStep(step.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-[#a09b8f] uppercase mb-1 block">Emnefelt</label>
                      <input 
                        type="text" 
                        value={step.subject}
                        onChange={(e) => {
                          const newSteps = [...steps];
                          newSteps[index].subject = e.target.value;
                          setSteps(newSteps);
                        }}
                        className="w-full border border-[#d8d3c5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                        placeholder="Emne..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#a09b8f] uppercase mb-1 block">Meldingstekst</label>
                      <textarea 
                        rows={4}
                        value={step.body}
                        onChange={(e) => {
                          const newSteps = [...steps];
                          newSteps[index].body = e.target.value;
                          setSteps(newSteps);
                        }}
                        className="w-full border border-[#d8d3c5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" 
                        placeholder="Skriv e-posten her..."
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#faf8f2] rounded-xl border border-dashed border-[#d8d3c5] p-3 flex items-center justify-between mx-4 group">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#a09b8f]" />
                    <span className="text-sm font-medium text-[#6b6660]">Vent i</span>
                    <input 
                      type="number" 
                      value={step.waitDays}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[index].waitDays = parseInt(e.target.value) || 0;
                        setSteps(newSteps);
                      }}
                      className="w-16 border border-[#d8d3c5] rounded px-2 py-1 text-sm bg-white text-center" 
                    />
                    <span className="text-sm font-medium text-[#6b6660]">dager</span>
                  </div>
                  <button onClick={() => removeStep(step.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3 justify-center">
          <Button variant="secondary" onClick={addWaitStep} className="bg-white">
            <Clock className="w-4 h-4 mr-2" />
            Legg til ventetid
          </Button>
          <Button variant="secondary" onClick={addEmailStep} className="bg-white">
            <Mail className="w-4 h-4 mr-2" />
            Legg til E-post
          </Button>
        </div>
      </div>
    </div>
  );
}
