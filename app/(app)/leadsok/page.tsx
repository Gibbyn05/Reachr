"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { TopBar } from "@/components/layout/top-bar";
import {
  Search, MapPin, SlidersHorizontal, Plus, Check,
  Phone, Globe, Building2, X, ChevronUp, ChevronDown,
  Loader2, AlertCircle, List, Map as MapIcon,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";

const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false });

/* ─── Types ──────────────────────────────────────────────── */
interface BrregEnhet {
  organisasjonsnummer: string;
  navn: string;
  organisasjonsform?: { kode: string; beskrivelse: string };
  naeringskode1?: { kode: string; beskrivelse: string };
  forretningsadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
    kommune?: string;
  };
  antallAnsatte?: number;
  hjemmeside?: string;
  telefon?: string;
  dagligLeder?: string; // will be filled by roles fetch
}

interface Filters {
  ansatte: string;   // "all"|"1-10"|"11-50"|"51-200"|"200+"
  mva: boolean;
  bransje: string;   // NACE prefix, empty = alle
}

/* ─── Industry categories ─────────────────────────────────── */
const INDUSTRY_CATEGORIES: { label: string; nace: string }[] = [
  { label: "Alle bransjer", nace: "" },
  { label: "Handel & butikk", nace: "47" },
  { label: "Grossist & import", nace: "46" },
  { label: "Bygg & anlegg", nace: "41" },
  { label: "Håndverk & installasjoner", nace: "43" },
  { label: "IT & teknologi", nace: "62" },
  { label: "Restaurant & mat", nace: "56" },
  { label: "Transport & logistikk", nace: "49" },
  { label: "Helse & velvære", nace: "86" },
  { label: "Regnskap & økonomi", nace: "69" },
  { label: "Eiendom", nace: "68" },
  { label: "Markedsføring & reklame", nace: "73" },
  { label: "Rengjøring & service", nace: "81" },
  { label: "Personlig service (frisør, negler…)", nace: "96" },
  { label: "Industri & produksjon", nace: "25" },
  { label: "Utdanning & kurs", nace: "85" },
  { label: "Finans & forsikring", nace: "64" },
  { label: "Juridisk & konsulentvirksomhet", nace: "70" },
];

/** Map a NACE code (e.g. "47.110") to the broad category label */
function naceToCategory(kode: string | undefined, beskrivelse: string | undefined): string {
  if (!kode) return beskrivelse ? capitalize(beskrivelse) : "—";
  const prefix2 = kode.slice(0, 2);
  const prefix1 = kode.slice(0, 1);
  const cat =
    INDUSTRY_CATEGORIES.find(c => c.nace && prefix2 === c.nace) ??
    INDUSTRY_CATEGORIES.find(c => c.nace && prefix1 === c.nace);
  return cat ? cat.label : (beskrivelse ? capitalize(beskrivelse) : "—");
}

const NACE_MAP: Record<string, string> = {
  // Use 2-digit codes for reliable prefix matching on Brreg
  frisør: "96", frisørsalong: "96", hår: "96", negl: "96", skjønnhet: "96",
  regnskap: "69", revisjon: "69", bokføring: "69", regnskapsfører: "69",
  bygg: "41", byggentreprenør: "41", entreprenør: "43",
  it: "62", software: "62", teknologi: "62", dataprogrammering: "62",
  restaurant: "56", kafé: "56", kafe: "56", catering: "56",
  transport: "49", frakt: "52", logistikk: "52",
  elektro: "43", elektriker: "43", rørlegger: "43", vvs: "43",
  advokat: "69", jus: "69",
  eiendom: "68", megling: "68",
  helse: "86", lege: "86", tannlege: "86", fysioterapi: "86",
  rengjøring: "81", renhold: "81", vakt: "80",
  markedsføring: "73", reklame: "73",
  butikk: "47", handel: "46", import: "46", grossist: "46",
  industri: "25", produksjon: "25", maskin: "28",
  finans: "64", bank: "64", forsikring: "65",
  utdanning: "85", kurs: "85",
};

function guessNace(q: string): string | undefined {
  const lower = q.toLowerCase().trim();
  for (const [key, code] of Object.entries(NACE_MAP)) {
    if (lower.includes(key)) return code;
  }
  return undefined;
}

function capitalize(s: string) {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function toKommune(city: string) {
  // Brreg wants uppercase municipality name
  const map: Record<string, string> = {
    oslo: "OSLO", bergen: "BERGEN", trondheim: "TRONDHEIM",
    stavanger: "STAVANGER", tromsø: "TROMSØ", drammen: "DRAMMEN",
    fredrikstad: "FREDRIKSTAD", kristiansand: "KRISTIANSAND",
    sandnes: "SANDNES", bodø: "BODØ", ålesund: "ÅLESUND",
    molde: "MOLDE", haugesund: "HAUGESUND", arendal: "ARENDAL",
    sarpsborg: "SARPSBORG", sandefjord: "SANDEFJORD", porsgrunn: "PORSGRUNN",
  };
  return map[city.toLowerCase()] ?? city.toUpperCase();
}

/* ─── Component ───────────────────────────────────────────── */
export default function LeadsokPage() {
  const { leads, addLead, loadLeads, currentUser } = useAppStore();
  const existingIds = new Set(leads.map((l) => l.id));

  const [locationQ, setLocationQ]   = useState("");
  const [industryQ, setIndustryQ]   = useState("");
  const [results, setResults]       = useState<BrregEnhet[]>([]);
  const [total, setTotal]           = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading]       = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]           = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [addedIds, setAddedIds]     = useState<Set<string>>(new Set());
  const [view, setView]             = useState<"list" | "map">("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortField, setSortField]   = useState<string | null>(null);
  const [sortDir, setSortDir]       = useState<"asc" | "desc">("asc");

  const [filters, setFilters] = useState<Filters>({ ansatte: "all", mva: false, bransje: "" });
  const [pendingFilters, setPendingFilters] = useState<Filters>({ ansatte: "all", mva: false, bransje: "" });

  const filterRef = useRef<HTMLDivElement>(null);

  // Load leads from DB on mount
  useEffect(() => {
    if (currentUser?.email) loadLeads(currentUser.email);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.email]);

  // Close filter on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeFilterCount =
    (filters.ansatte !== "all" ? 1 : 0) +
    (filters.mva ? 1 : 0) +
    (filters.bransje ? 1 : 0);

  const buildParams = (loc: string, ind: string, f: Filters, page: number) => {
    const params = new URLSearchParams({ size: "100", page: String(page) });
    if (loc) params.set("poststed", loc.trim().toUpperCase());
    // bransje category takes priority over free-text industry search
    if (f.bransje) {
      params.set("naeringskode", f.bransje);
    } else if (ind) {
      const nace = guessNace(ind);
      if (nace) params.set("naeringskode", nace);
      else params.set("navn", ind);
    }
    if (f.mva) params.set("mva", "true");
    if (f.ansatte !== "all") {
      const [fra, til] = {
        "1-10": ["1", "10"], "11-50": ["11", "50"],
        "51-200": ["51", "200"], "200+": ["200", "99999"],
      }[f.ansatte] ?? [];
      if (fra) params.set("fraAntallAnsatte", fra);
      if (til) params.set("tilAntallAnsatte", til);
    }
    return params;
  };

  // Fetch leaders and phone numbers in background batches and update state incrementally
  const fetchLeadersInBackground = useCallback((enheter: BrregEnhet[], isAppend: boolean) => {
    const BATCH = 8;
    let i = 0;
    const run = async () => {
      while (i < enheter.length) {
        const batch = enheter.slice(i, i + BATCH);
        i += BATCH;
        await Promise.all(
          batch.map(async (e) => {
            const needsLeader = !e.dagligLeder;
            const needsPhone = !e.telefon;

            const tasks: Promise<void>[] = [];

            if (needsLeader) {
              tasks.push((async () => {
                try {
                  const r = await fetch(`/api/brreg/roller?orgnr=${e.organisasjonsnummer}`);
                  const d = await r.json();
                  const groups: any[] = d?.rollegrupper ?? [];
                  const dagl = groups
                    .flatMap((g: any) => g.roller ?? [])
                    .find((r: any) => r.type?.kode === "DAGL" || r.type?.kode === "LEDE");
                  if (dagl?.person?.navn) {
                    const n = dagl.person.navn;
                    e.dagligLeder = capitalize(`${n.fornavn ?? ""} ${n.etternavn ?? ""}`).trim();
                  }
                } catch {}
              })());
            }

            if (needsPhone) {
              tasks.push((async () => {
                try {
                  const poststed = e.forretningsadresse?.poststed ?? "";
                  const params = new URLSearchParams({ orgnr: e.organisasjonsnummer, name: e.navn, poststed });
                  const r = await fetch(`/api/enrich?${params}`);
                  const d = await r.json();
                  if (d?.phone) e.telefon = d.phone;
                } catch {}
              })());
            }

            await Promise.all(tasks);
          })
        );
        // Push incremental update to state
        setResults((prev) => {
          if (isAppend) {
            return [...prev];
          }
          return [...enheter]; // trigger re-render with updated data
        });
      }
    };
    run();
  }, []);

  const doSearch = useCallback(async (loc: string, ind: string, f: Filters, page = 0, append = false) => {
    if (!loc && !ind && !f.bransje) return;
    if (append) setLoadingMore(true);
    else { setLoading(true); setResults([]); }
    setError("");
    setHasSearched(true);

    try {
      const res  = await fetch(`/api/brreg?${buildParams(loc, ind, f, page)}`);
      const data = await res.json();
      const enheter: BrregEnhet[] = data?._embedded?.enheter ?? [];
      setTotal(data?.page?.totalElements ?? enheter.length);
      setCurrentPage(page);

      if (append) {
        setResults((prev) => {
          const newList = [...prev, ...enheter];
          fetchLeadersInBackground(newList, true);
          return newList;
        });
      } else {
        setResults(enheter);
        fetchLeadersInBackground(enheter, false);
      }
    } catch {
      setError("Kunne ikke laste data. Sjekk nettilkoblingen.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [fetchLeadersInBackground]);

  // Auto-detect user city and load on first page open
  useEffect(() => {
    const KNOWN_CITIES = [
      "Oslo", "Bergen", "Trondheim", "Stavanger", "Tromsø", "Drammen",
      "Fredrikstad", "Kristiansand", "Sandnes", "Bodø", "Ålesund",
      "Molde", "Haugesund", "Arendal", "Sarpsborg", "Sandefjord", "Porsgrunn",
      "Tønsberg", "Skien", "Moss", "Hamar", "Gjøvik", "Lillehammer",
      "Kongsberg", "Larvik", "Halden", "Harstad", "Narvik", "Alta",
    ];

    function matchCity(raw: string): string {
      const lower = raw.toLowerCase().trim();
      const match = KNOWN_CITIES.find(c => c.toLowerCase() === lower);
      return match ?? "Oslo";
    }

    function fallback() {
      setLocationQ("Oslo");
      doSearch("Oslo", "", { ansatte: "all", mva: false, bransje: "" }, 0, false);
    }

    if (!navigator.geolocation) { fallback(); return; }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "nb" } }
          );
          const data = await res.json();
          const raw = data?.address?.city ?? data?.address?.town ?? data?.address?.municipality ?? "";
          const city = matchCity(raw);
          setLocationQ(city);
          doSearch(city, "", { ansatte: "all", mva: false, bransje: "" }, 0, false);
        } catch {
          fallback();
        }
      },
      () => fallback(),
      { timeout: 5000, maximumAge: 600_000 }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setFilters(pendingFilters);
    doSearch(locationQ, industryQ, pendingFilters, 0, false);
  };

  const handleLoadMore = () => {
    doSearch(locationQ, industryQ, filters, currentPage + 1, true);
  };

  const applyFilters = () => {
    setFilters(pendingFilters);
    setFilterOpen(false);
    if (hasSearched) doSearch(locationQ, industryQ, pendingFilters, 0, false);
  };

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  // Hide leads that are already in the pipeline
  const visible = results.filter(
    (e) => !existingIds.has(e.organisasjonsnummer) && !addedIds.has(e.organisasjonsnummer)
  );
  const hiddenCount = results.length - visible.length;

  const sorted = [...visible].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === "ansatte") {
      const av = a.antallAnsatte ?? 0;
      const bv = b.antallAnsatte ?? 0;
      return sortDir === "asc" ? av - bv : bv - av;
    }
    let av: any, bv: any;
    if (sortField === "navn") { av = a.navn; bv = b.navn; }
    else if (sortField === "sted") { av = a.forretningsadresse?.poststed ?? ""; bv = b.forretningsadresse?.poststed ?? ""; }
    else if (sortField === "bransje") { av = naceToCategory(a.naeringskode1?.kode, a.naeringskode1?.beskrivelse); bv = naceToCategory(b.naeringskode1?.kode, b.naeringskode1?.beskrivelse); }
    return sortDir === "asc" ? String(av).localeCompare(String(bv), "nb") : String(bv).localeCompare(String(av), "nb");
  });

  const handleAdd = (e: BrregEnhet) => {
    if (existingIds.has(e.organisasjonsnummer) || addedIds.has(e.organisasjonsnummer)) return;
    addLead({
      id: e.organisasjonsnummer,
      name: capitalize(e.navn),
      orgNumber: e.organisasjonsnummer,
      contactPerson: e.dagligLeder ?? "—",
      phone: e.telefon ?? "—",
      email: "—",
      industry: naceToCategory(e.naeringskode1?.kode, e.naeringskode1?.beskrivelse),
      city: e.forretningsadresse?.poststed ? capitalize(e.forretningsadresse.poststed) : "—",
      address: [
        ...(e.forretningsadresse?.adresse ?? []),
        e.forretningsadresse?.postnummer,
        e.forretningsadresse?.poststed,
      ].filter(Boolean).join(", "),
      revenue: 0,
      employees: e.antallAnsatte ?? 0,
      lat: 0, lng: 0,
      status: "Ikke kontaktet",
      lastContacted: null,
      assignedTo: currentUser?.name ?? "Meg",
      assignedAvatar: (currentUser?.name ?? "M").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      addedBy: currentUser?.name ?? "Meg",
      notes: "",
      addedDate: new Date().toISOString().split("T")[0],
    });
    setAddedIds(prev => new Set([...prev, e.organisasjonsnummer]));
  };

  const SortBtn = ({ field, label }: { field: string; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        background: "none", border: "none", cursor: "pointer",
        fontSize: 11, fontWeight: 600, color: "#6b6660",
        textTransform: "uppercase", letterSpacing: "0.05em", padding: 0,
      }}
    >
      {label}
      <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <ChevronUp size={9} color={sortField === field && sortDir === "asc" ? "#09fe94" : "#c5bfb0"} />
        <ChevronDown size={9} color={sortField === field && sortDir === "desc" ? "#09fe94" : "#c5bfb0"} />
      </span>
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <TopBar title="Leadsøk" />

      {/* ── Search bar ───────────────────────────────────── */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #d8d3c5", backgroundColor: "#faf8f2", flexShrink: 0 }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, alignItems: "center" }}>

          {/* Location */}
          <div style={{ flex: 1, position: "relative" }}>
            <MapPin size={15} color="#9CA3AF" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              value={locationQ}
              onChange={e => setLocationQ(e.target.value)}
              placeholder="By eller kommune (f.eks. Oslo, Bergen)"
              style={{
                width: "100%", padding: "10px 12px 10px 36px",
                border: "1.5px solid #d8d3c5", borderRadius: 10,
                fontSize: 14, color: "#171717", outline: "none",
                fontFamily: "inherit", backgroundColor: "#faf8f2",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "#09fe94")}
              onBlur={e => (e.currentTarget.style.borderColor = "#d8d3c5")}
            />
          </div>

          {/* Industry */}
          <div style={{ flex: 1, position: "relative" }}>
            <Building2 size={15} color="#9CA3AF" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              value={industryQ}
              onChange={e => setIndustryQ(e.target.value)}
              placeholder="Bransje (f.eks. frisør, bygg, regnskap)"
              style={{
                width: "100%", padding: "10px 12px 10px 36px",
                border: "1.5px solid #d8d3c5", borderRadius: 10,
                fontSize: 14, color: "#171717", outline: "none",
                fontFamily: "inherit", backgroundColor: "#faf8f2",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "#09fe94")}
              onBlur={e => (e.currentTarget.style.borderColor = "#d8d3c5")}
            />
          </div>

          {/* Search button */}
          <button type="submit" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            backgroundColor: "#09fe94", color: "#171717",
            fontWeight: 700, fontSize: 14, padding: "10px 20px",
            borderRadius: 10, border: "none", cursor: "pointer",
            flexShrink: 0, fontFamily: "inherit",
          }}>
            <Search size={15} />
            Søk
          </button>

          {/* Filter popup */}
          <div ref={filterRef} style={{ position: "relative", flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => { setPendingFilters(filters); setFilterOpen(o => !o); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                backgroundColor: filterOpen ? "#F0FDF4" : "white",
                color: activeFilterCount > 0 ? "#15803D" : "#374151",
                fontWeight: 600, fontSize: 14, padding: "10px 16px",
                borderRadius: 10, border: `1.5px solid ${activeFilterCount > 0 ? "#09fe94" : "#d8d3c5"}`,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <SlidersHorizontal size={15} />
              Filtre
              {activeFilterCount > 0 && (
                <span style={{
                  backgroundColor: "#09fe94", color: "#171717",
                  fontSize: 11, fontWeight: 700, width: 18, height: 18,
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                }}>{activeFilterCount}</span>
              )}
            </button>

            {filterOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                backgroundColor: "#faf8f2", borderRadius: 16,
                border: "1px solid #d8d3c5",
                boxShadow: "0 16px 48px rgba(0,0,0,0.14)", zIndex: 50,
                width: 320, padding: 20,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "#171717", margin: 0 }}>Filtre</p>
                  <button onClick={() => setFilterOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#a09b8f" }}>
                    <X size={16} />
                  </button>
                </div>

                {/* Ansatte */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#6b6660", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                    Antall ansatte
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { v: "all", l: "Alle" },
                      { v: "1-10", l: "1–10 ansatte" },
                      { v: "11-50", l: "11–50 ansatte" },
                      { v: "51-200", l: "51–200 ansatte" },
                      { v: "200+", l: "200+ ansatte" },
                    ].map(({ v, l }) => (
                      <label key={v} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#3d3a34" }}>
                        <div onClick={() => setPendingFilters(f => ({ ...f, ansatte: v }))} style={{
                          width: 18, height: 18, borderRadius: "50%", border: "2px solid",
                          borderColor: pendingFilters.ansatte === v ? "#09fe94" : "#c5bfb0",
                          backgroundColor: pendingFilters.ansatte === v ? "#09fe94" : "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, cursor: "pointer",
                        }}>
                          {pendingFilters.ansatte === v && <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#faf8f2" }} />}
                        </div>
                        {l}
                      </label>
                    ))}
                  </div>
                </div>

                {/* MVA */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#6b6660", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                    MVA-registrert
                  </p>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#3d3a34" }}>
                    <div
                      onClick={() => setPendingFilters(f => ({ ...f, mva: !f.mva }))}
                      style={{
                        width: 38, height: 22, borderRadius: 11,
                        backgroundColor: pendingFilters.mva ? "#09fe94" : "#d8d3c5",
                        position: "relative", cursor: "pointer", transition: "background-color 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      <div style={{
                        position: "absolute", top: 3, left: pendingFilters.mva ? 19 : 3,
                        width: 16, height: 16, borderRadius: "50%", backgroundColor: "#faf8f2",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.2s",
                      }} />
                    </div>
                    Kun MVA-registrerte
                  </label>
                </div>

                {/* Bransje kategori */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#6b6660", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                    Bransje-kategori
                  </p>
                  <select
                    value={pendingFilters.bransje}
                    onChange={(e) => setPendingFilters(f => ({ ...f, bransje: e.target.value }))}
                    style={{
                      width: "100%", padding: "8px 12px", borderRadius: 8,
                      border: "1.5px solid #d8d3c5", fontSize: 13, color: "#3d3a34",
                      fontFamily: "inherit", outline: "none", backgroundColor: "#faf8f2",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#09fe94")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#d8d3c5")}
                  >
                    {INDUSTRY_CATEGORIES.map(({ label, nace }) => (
                      <option key={nace} value={nace}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setPendingFilters({ ansatte: "all", mva: false, bransje: "" })}
                    style={{
                      flex: 1, padding: "9px 0", borderRadius: 8,
                      border: "1.5px solid #d8d3c5", backgroundColor: "#faf8f2",
                      fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#3d3a34", fontFamily: "inherit",
                    }}
                  >Nullstill</button>
                  <button
                    onClick={applyFilters}
                    style={{
                      flex: 2, padding: "9px 0", borderRadius: 8,
                      border: "none", backgroundColor: "#09fe94",
                      fontSize: 13, fontWeight: 700, cursor: "pointer", color: "white", fontFamily: "inherit",
                    }}
                  >Bruk filtre</button>
                </div>
              </div>
            )}
          </div>

          {/* View toggle */}
          <div style={{ display: "flex", backgroundColor: "#f2efe3", borderRadius: 10, padding: 3, gap: 2, flexShrink: 0 }}>
            {([["list", List], ["map", MapIcon]] as const).map(([v, Icon]) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                style={{
                  padding: "7px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                  backgroundColor: view === v ? "white" : "transparent",
                  boxShadow: view === v ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  color: view === v ? "#111827" : "#9CA3AF",
                  transition: "all 0.15s",
                }}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* ── Results area ─────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 24px", backgroundColor: "#F8F9FC" }}>

        {/* Empty state */}
        {!hasSearched && !loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
            <div style={{ width: 64, height: 64, backgroundColor: "#09fe9414", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Search size={28} color="#09fe94" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#3d3a34", margin: 0 }}>Søk for å finne bedrifter</p>
            <p style={{ fontSize: 14, color: "#a09b8f", margin: 0, textAlign: "center", maxWidth: 380 }}>
              Skriv inn by og bransje over for å søke i Brønnøysundregisteret (Brreg).
              Over 600 000 norske bedrifter tilgjengelig.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {[["Oslo", "frisør"], ["Bergen", "bygg"], ["Trondheim", "regnskap"], ["Stavanger", "elektro"]].map(([loc, ind]) => (
                <button key={loc + ind} onClick={() => { setLocationQ(loc); setIndustryQ(ind); doSearch(loc, ind, filters, 0, false); }}
                  style={{
                    padding: "6px 14px", borderRadius: 999, border: "1.5px solid #d8d3c5",
                    backgroundColor: "#faf8f2", fontSize: 13, fontWeight: 500, color: "#3d3a34",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >{loc} · {ind}</button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60%", gap: 12 }}>
            <Loader2 size={32} color="#09fe94" style={{ animation: "spin 1s linear infinite" }} />
            <p style={{ fontSize: 14, color: "#6b6660", margin: 0 }}>Laster bedrifter…</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "14px 18px", marginBottom: 16 }}>
            <AlertCircle size={18} color="#DC2626" />
            <p style={{ fontSize: 14, color: "#DC2626", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && !error && (
          <>
            {/* Result meta row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <p style={{ fontSize: 13, color: "#6b6660", margin: 0 }}>
                  Viser <strong style={{ color: "#171717" }}>{sorted.length}</strong> av{" "}
                  <strong style={{ color: "#171717" }}>{total.toLocaleString("nb-NO")}</strong> treff fra Brreg
                </p>
                {hiddenCount > 0 && (
                  <span style={{
                    fontSize: 12, color: "#16A34A", backgroundColor: "#09fe9414",
                    border: "1px solid #BBF7D0", borderRadius: 6,
                    padding: "2px 8px", fontWeight: 500,
                  }}>
                    {hiddenCount} allerede lagt til (skjult)
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, backgroundColor: "#09fe94", borderRadius: "50%" }} />
                <span style={{ fontSize: 12, color: "#6b6660" }}>Live data</span>
              </div>
            </div>

            {view === "list" ? (
              <div style={{ backgroundColor: "#faf8f2", borderRadius: 14, border: "1px solid #d8d3c5", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                {/* Table header */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.3fr 0.9fr 0.9fr 1.3fr 0.9fr 0.7fr 80px",
                  padding: "10px 16px",
                  backgroundColor: "#F9FAFB",
                  borderBottom: "1px solid #F3F4F6",
                  gap: 8,
                }}>
                  <SortBtn field="navn" label="Bedriftsnavn" />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#6b6660", textTransform: "uppercase", letterSpacing: "0.05em" }}>Daglig leder</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#6b6660", textTransform: "uppercase", letterSpacing: "0.05em" }}>Telefon</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#6b6660", textTransform: "uppercase", letterSpacing: "0.05em" }}>Nettside</span>
                  <SortBtn field="bransje" label="Bransje" />
                  <SortBtn field="sted" label="Sted" />
                  <SortBtn field="ansatte" label="Ansatte" />
                  <span />
                </div>

                {/* Rows */}
                {sorted.length === 0 ? (
                  <div style={{ padding: "48px 24px", textAlign: "center" }}>
                    <p style={{ fontSize: 15, color: "#a09b8f", margin: 0 }}>Ingen bedrifter funnet med disse søkekriteriene.</p>
                    <p style={{ fontSize: 13, color: "#c5bfb0", margin: "6px 0 0" }}>Prøv et annet stedsnavn eller en annen bransje.</p>
                  </div>
                ) : (
                  sorted.map((enhet, idx) => {
                    const alreadyAdded = existingIds.has(enhet.organisasjonsnummer) || addedIds.has(enhet.organisasjonsnummer);
                    const adr = enhet.forretningsadresse;
                    const poststed = adr?.poststed ? capitalize(adr.poststed) : "—";
                    const bransje = naceToCategory(enhet.naeringskode1?.kode, enhet.naeringskode1?.beskrivelse);
                    const initials = enhet.navn.trim().split(/\s+/).slice(0,2).map(w => w[0]).join("").toUpperCase();

                    return (
                      <div key={enhet.organisasjonsnummer} style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1.3fr 0.9fr 0.9fr 1.3fr 0.9fr 0.7fr 80px",
                        padding: "12px 16px",
                        borderBottom: idx < sorted.length - 1 ? "1px solid #F9FAFB" : "none",
                        alignItems: "center", gap: 8,
                        transition: "background-color 0.1s",
                        backgroundColor: "#faf8f2",
                      }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#FAFAFA")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "white")}
                      >
                        {/* Name */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: 8,
                            backgroundColor: "#f0ece0", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 700, color: "#475569",
                          }}>{initials}</div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#171717", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {capitalize(enhet.navn)}
                            </p>
                            <p style={{ fontSize: 11, color: "#a09b8f", margin: 0 }}>{enhet.organisasjonsnummer}</p>
                          </div>
                        </div>

                        {/* Daglig leder */}
                        <p style={{ fontSize: 13, color: "#3d3a34", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {enhet.dagligLeder ?? <span style={{ color: "#c5bfb0" }}>—</span>}
                        </p>

                        {/* Telefon */}
                        <div style={{ fontSize: 13, color: "#6b6660" }}>
                          {enhet.telefon ? (
                            <a href={`tel:${enhet.telefon}`} style={{ color: "#3d3a34", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                              <Phone size={12} />{enhet.telefon}
                            </a>
                          ) : (
                            <span style={{ color: "#d8d3c5", fontSize: 13 }}>—</span>
                          )}
                        </div>

                        {/* Nettside */}
                        <div style={{ minWidth: 0, overflow: "hidden" }}>
                          {enhet.hjemmeside ? (
                            <a
                              href={enhet.hjemmeside.startsWith("http") ? enhet.hjemmeside : `https://${enhet.hjemmeside}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              style={{ fontSize: 12, color: "#ff470a", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                            >
                              <Globe size={11} style={{ flexShrink: 0 }} />
                              {enhet.hjemmeside.replace(/^https?:\/\//, "").replace(/\/$/, "").split("/")[0]}
                            </a>
                          ) : <span style={{ color: "#d8d3c5", fontSize: 13 }}>—</span>}
                        </div>

                        {/* Bransje */}
                        <div style={{ minWidth: 0 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 500, padding: "3px 8px",
                            borderRadius: 6, backgroundColor: "#f0ece0", color: "#475569",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            display: "inline-block", maxWidth: "100%",
                          }}>{bransje}</span>
                        </div>

                        {/* Sted */}
                        <p style={{ fontSize: 13, color: "#3d3a34", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={11} color="#9CA3AF" style={{ flexShrink: 0 }} />
                          {poststed}
                        </p>

                        {/* Ansatte */}
                        <p style={{ fontSize: 13, color: "#3d3a34", margin: 0 }}>
                          {enhet.antallAnsatte != null ? enhet.antallAnsatte : <span style={{ color: "#d8d3c5" }}>—</span>}
                        </p>

                        {/* CTA */}
                        <button
                          onClick={() => handleAdd(enhet)}
                          disabled={alreadyAdded}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "7px 12px", borderRadius: 8, border: "none",
                            backgroundColor: alreadyAdded ? "#e8e4d8" : "#09fe94",
                            color: alreadyAdded ? "#6b6660" : "#171717",
                            fontSize: 12, fontWeight: 600, cursor: alreadyAdded ? "default" : "pointer",
                            fontFamily: "inherit", flexShrink: 0,
                          }}
                        >
                          {alreadyAdded ? <><Check size={12} /> Lagt til</> : <><Plus size={12} /> Legg til</>}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <MapView
                enheter={sorted}
                addedIds={addedIds}
                existingIds={existingIds}
                onAdd={handleAdd}
                capitalize={capitalize}
              />
            )}

            {/* Load more */}
            {results.length < total && (
              <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "11px 28px", borderRadius: 10,
                    border: "1.5px solid #d8d3c5", backgroundColor: "#faf8f2",
                    fontSize: 14, fontWeight: 600, color: "#3d3a34",
                    cursor: loadingMore ? "default" : "pointer",
                    fontFamily: "inherit", opacity: loadingMore ? 0.7 : 1,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  {loadingMore ? (
                    <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Laster inn…</>
                  ) : (
                    <>Last inn flere bedrifter ({(total - results.length).toLocaleString("nb-NO")} gjenstår)</>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
