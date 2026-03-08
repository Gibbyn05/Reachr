"use client";
import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import {
  Plus, Trash2, ChevronDown, ChevronUp, Zap, Users,
  Clock, Check, X, Mail, ArrowRight, Play, Pause,
} from "lucide-react";

interface Step {
  delayDays: number;
  subject: string;
  body: string;
}

interface Sequence {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  activeEnrollments: number;
  email_sequence_steps: (Step & { id: string; step_number: number })[];
}

const TEMPLATE_VARIABLES = ["{{bedrift}}", "{{navn}}"];

function StepEditor({
  step,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  step: Step;
  index: number;
  total: number;
  onChange: (s: Step) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="bg-[#f2efe3] border border-[#d8d3c5] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#171717] flex items-center justify-center text-xs font-bold text-[#09fe94]">{index + 1}</div>
          <div className="flex items-center gap-1 text-xs text-[#6b6660]">
            <Clock className="w-3 h-3" />
            Etter
            <input
              type="number"
              min={0}
              max={90}
              value={step.delayDays}
              onChange={e => onChange({ ...step, delayDays: Number(e.target.value) })}
              className="w-12 text-center text-xs px-1.5 py-0.5 border border-[#d8d3c5] rounded bg-[#faf8f2] focus:outline-none focus:border-[#09fe94]"
            />
            dag{step.delayDays === 1 ? "" : "er"}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onMoveUp} disabled={index === 0} className="p-1 rounded hover:bg-[#e8e4d8] disabled:opacity-30 text-[#6b6660]"><ChevronUp className="w-3.5 h-3.5" /></button>
          <button onClick={onMoveDown} disabled={index === total - 1} className="p-1 rounded hover:bg-[#e8e4d8] disabled:opacity-30 text-[#6b6660]"><ChevronDown className="w-3.5 h-3.5" /></button>
          <button onClick={onRemove} className="p-1 rounded hover:bg-[#ff470a]/10 text-[#a09b8f] hover:text-[#ff470a]"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <input
        value={step.subject}
        onChange={e => onChange({ ...step, subject: e.target.value })}
        placeholder="E-postemne"
        className="w-full text-sm px-3 py-2 border border-[#d8d3c5] rounded-lg bg-[#faf8f2] focus:outline-none focus:border-[#09fe94] text-[#171717] placeholder:text-[#a09b8f] mb-2"
      />
      <textarea
        value={step.body}
        onChange={e => onChange({ ...step, body: e.target.value })}
        placeholder={`Hei {{bedrift}},\n\nSkriv e-postteksten her...\n\nBruk {{bedrift}} og {{navn}} som variabler.`}
        rows={5}
        className="w-full text-sm px-3 py-2 border border-[#d8d3c5] rounded-lg bg-[#faf8f2] focus:outline-none focus:border-[#09fe94] text-[#171717] placeholder:text-[#a09b8f] resize-none font-mono text-xs"
      />
    </div>
  );
}

function NewSequenceForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [steps, setSteps] = useState<Step[]>([
    { delayDays: 0, subject: "", body: "" },
    { delayDays: 3, subject: "", body: "" },
    { delayDays: 7, subject: "", body: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addStep = () => setSteps(prev => [...prev, { delayDays: (prev[prev.length - 1]?.delayDays ?? 0) + 3, subject: "", body: "" }]);
  const removeStep = (i: number) => setSteps(prev => prev.filter((_, idx) => idx !== i));
  const updateStep = (i: number, s: Step) => setSteps(prev => prev.map((x, idx) => idx === i ? s : x));
  const moveUp = (i: number) => setSteps(prev => { const a = [...prev]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; return a; });
  const moveDown = (i: number) => setSteps(prev => { const a = [...prev]; [a[i], a[i + 1]] = [a[i + 1], a[i]]; return a; });

  const save = async () => {
    if (!name.trim()) { setError("Sekvensnavnet mangler"); return; }
    const invalidStep = steps.findIndex(s => !s.subject.trim() || !s.body.trim());
    if (invalidStep >= 0) { setError(`Steg ${invalidStep + 1} mangler emne eller tekst`); return; }

    setSaving(true);
    setError("");
    const res = await fetch("/api/sequences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), steps }),
    });
    if (res.ok) { onSave(); }
    else { const d = await res.json(); setError(d.error ?? "Feil ved lagring"); }
    setSaving(false);
  };

  return (
    <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5] p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <h3 className="font-bold text-[#171717] mb-1">Ny e-postsekvens</h3>
      <p className="text-xs text-[#a09b8f] mb-4">
        Bruk <code className="bg-[#e8e4d8] px-1 rounded text-[10px]">{"{{bedrift}}"}</code> og <code className="bg-[#e8e4d8] px-1 rounded text-[10px]">{"{{navn}}"}</code> som variabler i e-postteksten.
      </p>

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Sekvensens navn, f.eks. «Kald prospektering»"
        className="w-full text-sm px-3 py-2 border border-[#d8d3c5] rounded-lg bg-[#faf8f2] focus:outline-none focus:border-[#09fe94] text-[#171717] placeholder:text-[#a09b8f] mb-5"
      />

      <div className="space-y-3 mb-4">
        {steps.map((step, i) => (
          <StepEditor
            key={i}
            step={step}
            index={i}
            total={steps.length}
            onChange={s => updateStep(i, s)}
            onRemove={() => removeStep(i)}
            onMoveUp={() => moveUp(i)}
            onMoveDown={() => moveDown(i)}
          />
        ))}
      </div>

      <button
        onClick={addStep}
        className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-[#d8d3c5] rounded-xl text-sm text-[#6b6660] hover:border-[#09fe94] hover:text-[#171717] transition-colors mb-5"
      >
        <Plus className="w-4 h-4" /> Legg til e-post
      </button>

      {error && <p className="text-sm text-[#ff470a] mb-3">{error}</p>}

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" size="md" onClick={onCancel}>Avbryt</Button>
        <Button type="button" variant="primary" size="md" onClick={save} disabled={saving}>
          {saving ? "Lagrer…" : <><Check className="w-4 h-4" /> Lagre sekvens</>}
        </Button>
      </div>
    </div>
  );
}

function SequenceCard({ seq, onDelete, onRefresh }: { seq: Sequence; onDelete: () => void; onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const del = async () => {
    setDeleting(true);
    await fetch("/api/sequences", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: seq.id }) });
    onDelete();
  };

  return (
    <div className="bg-[#faf8f2] rounded-xl border border-[#d8d3c5]" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-[#171717] rounded-lg flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-[#09fe94]" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#171717] truncate">{seq.name}</p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-[#a09b8f]">{seq.email_sequence_steps.length} e-poster</span>
              {seq.activeEnrollments > 0 && (
                <span className="flex items-center gap-1 text-xs text-[#059669] bg-[#09fe94]/10 px-1.5 py-0.5 rounded-full">
                  <Users className="w-3 h-3" />{seq.activeEnrollments} aktive
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setOpen(!open)} className="p-1.5 rounded-lg hover:bg-[#e8e4d8] transition-colors text-[#6b6660]">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={del} disabled={deleting} className="p-1.5 rounded-lg hover:bg-[#ff470a]/10 text-[#a09b8f] hover:text-[#ff470a] transition-colors disabled:opacity-50">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {open && (
        <div className="px-5 pb-5 border-t border-[#e8e4d8] pt-4 space-y-2">
          {seq.email_sequence_steps.map((step, i) => (
            <div key={step.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-[#e8e4d8] flex items-center justify-center text-xs font-bold text-[#6b6660]">{i + 1}</div>
                {i < seq.email_sequence_steps.length - 1 && <div className="w-px h-6 bg-[#e8e4d8] mt-1" />}
              </div>
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs text-[#a09b8f]">
                    {step.delayDays === 0 ? "Samme dag" : `Dag ${step.delayDays}`}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#d8d3c5]" />
                  <span className="text-xs font-semibold text-[#171717] truncate">{step.subject}</span>
                </div>
                <p className="text-xs text-[#6b6660] line-clamp-2">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SekvensPage() {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/sequences")
      .then(r => r.json())
      .then(d => setSequences(d.sequences ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <TopBar title="E-postsekvenser" subtitle="Automatiske oppfølgingssekvenser for leads" />

      <div className="p-4 sm:p-8 space-y-6 max-w-3xl">
        {/* Info banner */}
        <div className="bg-[#171717] rounded-xl p-5 flex items-start gap-4">
          <div className="w-9 h-9 bg-[#09fe94]/10 rounded-lg flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-[#09fe94]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-1">Automatiske e-postsekvenser</p>
            <p className="text-white/60 text-xs leading-relaxed">
              Lag sekvenser med flere e-poster og tidsforsinkelse. Enroll leads fra «Mine Leads» og Reachr sender automatisk oppfølgings-e-postene til riktig tid.
            </p>
          </div>
        </div>

        {/* Create button / form */}
        {!creating ? (
          <Button type="button" variant="primary" size="md" onClick={() => setCreating(true)}>
            <Plus className="w-4 h-4" />
            Ny sekvens
          </Button>
        ) : (
          <NewSequenceForm onSave={() => { setCreating(false); load(); }} onCancel={() => setCreating(false)} />
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-12 text-sm text-[#a09b8f]">Laster sekvenser…</div>
        ) : sequences.length === 0 && !creating ? (
          <div className="text-center py-16 bg-[#faf8f2] rounded-xl border border-[#d8d3c5]">
            <Mail className="w-10 h-10 text-[#d8d3c5] mx-auto mb-3" />
            <p className="font-semibold text-[#6b6660] mb-1">Ingen sekvenser ennå</p>
            <p className="text-sm text-[#a09b8f]">Lag din første sekvens og enroll leads fra Mine Leads.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sequences.map(seq => (
              <SequenceCard key={seq.id} seq={seq} onDelete={load} onRefresh={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
