"use client";
import { useState, useEffect } from "react";
import {
  X, Building2, Phone, Globe, MapPin, Users, Calendar,
  TrendingUp, Loader2, ExternalLink, CheckCircle, XCircle,
  Briefcase, BarChart3, DollarSign, Shield,
} from "lucide-react";

/* ─── Types ────────────────────────────────────────────── */
interface BrregDetail {
  organisasjonsnummer: string;
  navn: string;
  organisasjonsform?: { kode: string; beskrivelse: string };
  naeringskode1?: { kode: string; beskrivelse: string };
  naeringskode2?: { kode: string; beskrivelse: string };
  forretningsadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
    kommune?: string;
    land?: string;
  };
  postadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
  };
  antallAnsatte?: number;
  hjemmeside?: string;
  epostadresse?: string;
  telefon?: string;
  stiftelsesdato?: string;
  registrertIMvaregisteret?: boolean;
  registrertIForetaksregisteret?: boolean;
  vedtektsfestetFormaal?: string[];
  aktivitet?: string[];
  konkurs?: boolean;
  underAvvikling?: boolean;
}

interface Regnskap {
  regnskapsperiode?: { fraDato?: string; tilDato?: string };
  antallAnsatte?: number;
  resultatregnskapResultat?: {
    driftsresultat?: {
      driftsinntekter?: { sumDriftsinntekter?: number };
      driftsresultat?: number;
    };
    aarsresultat?: number;
    ordinaertResultatFoerSkattekostnad?: number;
  };
  egenkapitalGjeld?: {
    sumEgenkapitalGjeld?: number;
    egenkapital?: { sumEgenkapital?: number };
    gjeld?: { sumGjeld?: number };
  };
  eiendeler?: { sumEiendeler?: number };
}

interface Rolle {
  type?: { kode: string; beskrivelse: string };
  person?: { navn?: { fornavn?: string; etternavn?: string }; fodselsdato?: string };
  er_valgt_av?: string;
}

/* ─── Props ─────────────────────────────────────────────── */
interface CompanyDetailModalProps {
  orgNumber: string;
  initialName: string;
  onClose: () => void;
  onAddToPipeline?: () => void;
  alreadyInPipeline?: boolean;
}

/* ─── Helpers ───────────────────────────────────────────── */
function fmt(n: number | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 }).format(n);
}

function capitalize(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function rolleLabel(kode: string): string {
  const map: Record<string, string> = {
    DAGL: "Daglig leder", LEDE: "Styreleder", MEDL: "Styremedlem",
    VARA: "Varamedlem", REV: "Revisor", REGN: "Regnskapsfører",
    BEST: "Bestyrere", REPR: "Norsk representant", PROKH: "Prokurist",
  };
  return map[kode] ?? kode;
}

/* ─── Component ─────────────────────────────────────────── */
export function CompanyDetailModal({
  orgNumber,
  initialName,
  onClose,
  onAddToPipeline,
  alreadyInPipeline,
}: CompanyDetailModalProps) {
  const [detail, setDetail] = useState<BrregDetail | null>(null);
  const [regnskap, setRegnskap] = useState<Regnskap | null>(null);
  const [roller, setRoller] = useState<Rolle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [enhetRes, regnskapRes, rollerRes] = await Promise.all([
          fetch(`/api/brreg/enhet?orgnr=${orgNumber}`),
          fetch(`/api/brreg/regnskap?orgnr=${orgNumber}`),
          fetch(`/api/brreg/roller?orgnr=${orgNumber}`),
        ]);

        if (cancelled) return;

        if (enhetRes.ok) {
          const d = await enhetRes.json();
          if (!cancelled) setDetail(d);
        }

        if (regnskapRes.ok) {
          const d = await regnskapRes.json();
          if (!cancelled && Array.isArray(d) && d.length > 0) {
            // Pick most recent year
            const sorted = [...d].sort((a, b) => {
              const ay = a.regnskapsperiode?.tilDato ?? "";
              const by = b.regnskapsperiode?.tilDato ?? "";
              return by.localeCompare(ay);
            });
            setRegnskap(sorted[0]);
          }
        }

        if (rollerRes.ok) {
          const d = await rollerRes.json();
          if (!cancelled) {
            const groups: any[] = d?.rollegrupper ?? [];
            const allRoller: Rolle[] = groups.flatMap((g: any) => g.roller ?? []);
            setRoller(allRoller);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [orgNumber]);

  const name = detail ? capitalize(detail.navn) : capitalize(initialName);
  const initials = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const revenue = regnskap?.resultatregnskapResultat?.driftsresultat?.driftsinntekter?.sumDriftsinntekter;
  const result = regnskap?.resultatregnskapResultat?.aarsresultat
    ?? regnskap?.resultatregnskapResultat?.ordinaertResultatFoerSkattekostnad;
  const equity = regnskap?.egenkapitalGjeld?.egenkapital?.sumEgenkapital;
  const assets = regnskap?.eiendeler?.sumEiendeler;
  const debt = regnskap?.egenkapitalGjeld?.gjeld?.sumGjeld;
  const regnskapsAar = regnskap?.regnskapsperiode?.tilDato?.slice(0, 4);

  const adresseParts = [
    ...(detail?.forretningsadresse?.adresse ?? []),
    detail?.forretningsadresse?.postnummer,
    detail?.forretningsadresse?.poststed ? capitalize(detail.forretningsadresse.poststed) : undefined,
  ].filter(Boolean);
  const adresse = adresseParts.join(", ");

  const formaal = detail?.vedtektsfestetFormaal?.[0] ?? detail?.aktivitet?.[0];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#faf8f2] w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl border border-[#d8d3c5] shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-5 border-b border-[#d8d3c5] flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-[#f0ece0] flex items-center justify-center text-base font-bold text-[#6b6660] flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-[#171717] leading-tight">{name}</h2>
            <p className="text-xs text-[#a09b8f] mt-0.5">
              Org.nr. {orgNumber}
              {detail?.organisasjonsform && (
                <span className="ml-2 px-1.5 py-0.5 bg-[#f0ece0] rounded text-[10px] font-medium text-[#6b6660]">
                  {detail.organisasjonsform.beskrivelse}
                </span>
              )}
            </p>
            {detail && (
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {detail.registrertIMvaregisteret && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                    <CheckCircle className="w-3 h-3" /> MVA-registrert
                  </span>
                )}
                {detail.registrertIForetaksregisteret && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#6b6660] bg-[#f0ece0] border border-[#d8d3c5] rounded-full px-2 py-0.5">
                    <Shield className="w-3 h-3" /> Foretaksregisteret
                  </span>
                )}
                {detail.konkurs && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                    <XCircle className="w-3 h-3" /> Konkurs
                  </span>
                )}
                {detail.underAvvikling && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5">
                    <XCircle className="w-3 h-3" /> Under avvikling
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#a09b8f] hover:bg-[#f0ece0] hover:text-[#171717] transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#09fe94]" />
            </div>
          ) : (
            <>
              {/* Key info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <InfoCard
                  icon={<Users className="w-4 h-4" />}
                  label="Ansatte"
                  value={
                    (regnskap?.antallAnsatte ?? detail?.antallAnsatte) != null
                      ? String(regnskap?.antallAnsatte ?? detail?.antallAnsatte)
                      : "—"
                  }
                />
                <InfoCard
                  icon={<Calendar className="w-4 h-4" />}
                  label="Stiftet"
                  value={detail?.stiftelsesdato
                    ? new Date(detail.stiftelsesdato).toLocaleDateString("nb-NO", { year: "numeric", month: "short", day: "numeric" })
                    : "—"
                  }
                />
                <InfoCard
                  icon={<Briefcase className="w-4 h-4" />}
                  label="Bransje"
                  value={detail?.naeringskode1?.beskrivelse
                    ? capitalize(detail.naeringskode1.beskrivelse)
                    : "—"
                  }
                  small
                />
                <InfoCard
                  icon={<MapPin className="w-4 h-4" />}
                  label="Sted"
                  value={detail?.forretningsadresse?.poststed
                    ? capitalize(detail.forretningsadresse.poststed)
                    : "—"
                  }
                />
              </div>

              {/* Financial data */}
              {regnskap && (
                <section>
                  <SectionTitle icon={<BarChart3 className="w-3.5 h-3.5" />} title={`Økonomi${regnskapsAar ? ` (${regnskapsAar})` : ""}`} />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <FinanceCard label="Omsetning" value={fmt(revenue)} positive={revenue != null && revenue > 0} />
                    <FinanceCard
                      label="Årsresultat"
                      value={fmt(result ?? undefined)}
                      positive={result != null && result > 0}
                      negative={result != null && result < 0}
                    />
                    <FinanceCard label="Egenkapital" value={fmt(equity ?? undefined)} positive={equity != null && equity > 0} />
                    <FinanceCard label="Totaleiendeler" value={fmt(assets ?? undefined)} />
                  </div>
                  {debt != null && (
                    <p className="text-xs text-[#a09b8f] mt-2">
                      Gjeld: <span className="text-[#6b6660] font-medium">{fmt(debt)}</span>
                      {revenue && debt ? (
                        <span className="ml-2 text-[10px]">
                          (Gjeldsgrad: {(debt / revenue).toFixed(1)}x omsetning)
                        </span>
                      ) : null}
                    </p>
                  )}
                </section>
              )}

              {/* Contact */}
              <section>
                <SectionTitle icon={<Phone className="w-3.5 h-3.5" />} title="Kontaktinformasjon" />
                <div className="space-y-2">
                  {detail?.telefon && (
                    <a href={`tel:${detail.telefon}`} className="flex items-center gap-2.5 text-sm text-[#3d3a34] hover:text-[#ff470a] group">
                      <Phone className="w-3.5 h-3.5 text-[#a09b8f] group-hover:text-[#ff470a]" />
                      {detail.telefon}
                    </a>
                  )}
                  {detail?.epostadresse && (
                    <a href={`mailto:${detail.epostadresse}`} className="flex items-center gap-2.5 text-sm text-[#3d3a34] hover:text-[#ff470a] group">
                      <Building2 className="w-3.5 h-3.5 text-[#a09b8f] group-hover:text-[#ff470a]" />
                      {detail.epostadresse}
                    </a>
                  )}
                  {detail?.hjemmeside && (
                    <a
                      href={detail.hjemmeside.startsWith("http") ? detail.hjemmeside : `https://${detail.hjemmeside}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm text-[#ff470a] hover:underline group"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {detail.hjemmeside.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                    </a>
                  )}
                  {adresse && (
                    <p className="flex items-start gap-2.5 text-sm text-[#6b6660]">
                      <MapPin className="w-3.5 h-3.5 text-[#a09b8f] mt-0.5 flex-shrink-0" />
                      {adresse}
                    </p>
                  )}
                </div>
              </section>

              {/* Board / roles */}
              {roller.length > 0 && (
                <section>
                  <SectionTitle icon={<Briefcase className="w-3.5 h-3.5" />} title="Roller og styre" />
                  <div className="space-y-2">
                    {roller
                      .filter((r) => r.person?.navn)
                      .slice(0, 8)
                      .map((r, i) => {
                        const n = r.person!.navn!;
                        const fullName = capitalize(`${n.fornavn ?? ""} ${n.etternavn ?? ""}`.trim());
                        return (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#f0ece0] flex items-center justify-center text-[10px] font-bold text-[#6b6660] flex-shrink-0">
                                {fullName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                              </div>
                              <span className="text-sm text-[#3d3a34] font-medium">{fullName}</span>
                            </div>
                            <span className="text-xs text-[#a09b8f] bg-[#f0ece0] px-2 py-0.5 rounded-full">
                              {r.type ? rolleLabel(r.type.kode) : "—"}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </section>
              )}

              {/* Formål */}
              {formaal && (
                <section>
                  <SectionTitle icon={<TrendingUp className="w-3.5 h-3.5" />} title="Vedtektsfestet formål" />
                  <p className="text-sm text-[#6b6660] leading-relaxed">{formaal}</p>
                </section>
              )}

              {/* External links */}
              <section>
                <SectionTitle icon={<ExternalLink className="w-3.5 h-3.5" />} title="Eksterne lenker" />
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      label: "Proff.no",
                      url: `https://www.proff.no/søk?q=${encodeURIComponent(initialName)}`,
                    },
                    {
                      label: "Brreg.no",
                      url: `https://www.brreg.no/finn-foretak/sok-i-bronnoysunsregistrene/?q=${orgNumber}`,
                    },
                    {
                      label: "1881.no",
                      url: `https://www.1881.no/firma/?query=${encodeURIComponent(initialName)}`,
                    },
                  ].map(({ label, url }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#ff470a] border border-[#ff470a]/30 rounded-lg px-3 py-1.5 hover:bg-[#ff470a]/5 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> {label}
                    </a>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        {onAddToPipeline && (
          <div className="p-4 border-t border-[#d8d3c5] flex items-center gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#d8d3c5] rounded-xl text-sm font-semibold text-[#6b6660] hover:bg-[#f0ece0] transition-colors"
            >
              Lukk
            </button>
            <button
              onClick={() => { onAddToPipeline(); onClose(); }}
              disabled={alreadyInPipeline}
              className="flex-2 py-2.5 px-6 bg-[#09fe94] text-[#171717] rounded-xl text-sm font-bold hover:bg-[#00e882] transition-colors disabled:opacity-50 disabled:cursor-default"
            >
              {alreadyInPipeline ? "Allerede i pipeline" : "Legg til i pipeline"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */
function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <span className="text-[#a09b8f]">{icon}</span>
      <p className="text-xs font-bold text-[#6b6660] uppercase tracking-wider">{title}</p>
    </div>
  );
}

function InfoCard({
  icon, label, value, small,
}: { icon: React.ReactNode; label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-[#f2efe3] rounded-xl p-3 border border-[#e8e4d8]">
      <div className="flex items-center gap-1.5 text-[#a09b8f] mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className={`font-semibold text-[#171717] leading-tight ${small ? "text-xs" : "text-sm"}`}>
        {value}
      </p>
    </div>
  );
}

function FinanceCard({
  label, value, positive, negative,
}: { label: string; value: string; positive?: boolean; negative?: boolean }) {
  return (
    <div className="bg-[#f2efe3] rounded-xl p-3 border border-[#e8e4d8]">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#a09b8f] mb-1">{label}</p>
      <p className={`text-sm font-bold leading-tight ${
        positive ? "text-green-700" : negative ? "text-red-600" : "text-[#171717]"
      }`}>
        {value}
      </p>
    </div>
  );
}
