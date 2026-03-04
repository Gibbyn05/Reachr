"use client";
import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2, Phone, Users, Building2, Plus, Check } from "lucide-react";

interface BrregEnhet {
  organisasjonsnummer: string;
  navn: string;
  naeringskode1?: { kode: string; beskrivelse: string };
  forretningsadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
  };
  antallAnsatte?: number;
  telefon?: string;
  dagligLeder?: string;
}

interface GeoEnhet extends BrregEnhet {
  lat: number;
  lng: number;
}

interface Props {
  enheter: BrregEnhet[];
  addedIds: Set<string>;
  existingIds: Set<string>;
  onAdd: (e: BrregEnhet) => void;
  capitalize: (s: string) => string;
}

export default function MapView({ enheter, addedIds, existingIds, onAdd, capitalize }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [geocoding, setGeocoding] = useState(false);
  const [geocoded, setGeocoded] = useState<GeoEnhet[]>([]);
  const [failed, setFailed] = useState(0);

  // Geocode all enheter — deduplicated by postnummer to minimise API calls
  useEffect(() => {
    if (enheter.length === 0) return;
    let cancelled = false;

    async function geocodeAll() {
      setGeocoding(true);
      setGeocoded([]);
      setFailed(0);

      // Build a map of unique postnummer → one representative company
      const uniquePnr = new Map<string, typeof enheter[0]>();
      const noPnr: typeof enheter[0][] = [];
      for (const e of enheter) {
        const pnr = e.forretningsadresse?.postnummer;
        if (pnr) {
          if (!uniquePnr.has(pnr)) uniquePnr.set(pnr, e);
        } else if (e.forretningsadresse?.poststed) {
          noPnr.push(e); // geocode by poststed if no postnummer
        }
      }

      // Geocode unique postnumre in batches of 10
      const pnrCoords = new Map<string, { lat: number; lng: number }>();
      const uniqueList = [...uniquePnr.entries()];
      for (let i = 0; i < uniqueList.length; i += 10) {
        if (cancelled) return;
        await Promise.all(
          uniqueList.slice(i, i + 10).map(async ([pnr, e]) => {
            try {
              const params = new URLSearchParams({
                postnummer: pnr,
                poststed: e.forretningsadresse?.poststed ?? "",
              });
              const res = await fetch(`/api/geocode?${params}`);
              const data = await res.json();
              if (data.lat && data.lng) pnrCoords.set(pnr, { lat: data.lat, lng: data.lng });
            } catch {}
          })
        );
      }

      if (cancelled) return;

      // Map results back to all companies with small jitter to spread co-located pins
      const jitter = () => (Math.random() - 0.5) * 0.004;
      const results: GeoEnhet[] = [];
      let failCount = 0;

      for (const e of enheter) {
        const pnr = e.forretningsadresse?.postnummer;
        const coords = pnr ? pnrCoords.get(pnr) : undefined;
        if (coords) {
          results.push({ ...e, lat: coords.lat + jitter(), lng: coords.lng + jitter() });
        } else {
          failCount++;
        }
      }

      setGeocoded(results);
      setFailed(failCount);
      setGeocoding(false);
    }

    geocodeAll();
    return () => { cancelled = true; };
  }, [enheter]);

  // Init / update Leaflet map
  useEffect(() => {
    if (!mapRef.current || geocoding) return;
    if (geocoded.length === 0) return;

    async function initMap() {
      const L = (await import("leaflet")).default;

      // Fix default marker icon paths broken by webpack
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Destroy existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Clear old markers
      markersRef.current = [];

      const map = L.map(mapRef.current!).setView([63.4, 10.4], 5);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const greenIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:32px;height:32px;border-radius:50% 50% 50% 0;
          background:#22C55E;border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.25);
          transform:rotate(-45deg);
          display:flex;align-items:center;justify-content:center;
        "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -36],
      });

      const bounds: [number, number][] = [];

      geocoded.forEach((e) => {
        bounds.push([e.lat, e.lng]);
        const marker = L.marker([e.lat, e.lng], { icon: greenIcon }).addTo(map);

        const bransje = e.naeringskode1?.beskrivelse ? capitalize(e.naeringskode1.beskrivelse) : "—";
        const poststed = e.forretningsadresse?.poststed ? capitalize(e.forretningsadresse.poststed) : "—";
        const alreadyAdded = existingIds.has(e.organisasjonsnummer) || addedIds.has(e.organisasjonsnummer);

        marker.bindPopup(`
          <div style="font-family:system-ui,sans-serif;min-width:200px;padding:4px 0;">
            <p style="font-weight:700;font-size:14px;color:#111827;margin:0 0 4px;">${capitalize(e.navn)}</p>
            <p style="font-size:11px;color:#9CA3AF;margin:0 0 10px;">${e.organisasjonsnummer}</p>
            ${e.dagligLeder ? `<p style="font-size:12px;color:#374151;margin:0 0 4px;">👤 ${e.dagligLeder}</p>` : ""}
            ${e.telefon ? `<p style="font-size:12px;color:#374151;margin:0 0 4px;">📞 ${e.telefon}</p>` : ""}
            <p style="font-size:12px;color:#374151;margin:0 0 4px;">📍 ${poststed}</p>
            <p style="font-size:12px;color:#374151;margin:0 0 10px;">🏷 ${bransje}</p>
            ${e.antallAnsatte ? `<p style="font-size:12px;color:#374151;margin:0 0 10px;">👥 ${e.antallAnsatte} ansatte</p>` : ""}
            <button
              onclick="window.reachrAddLead('${e.organisasjonsnummer}')"
              style="
                width:100%;padding:8px;border-radius:8px;border:none;
                background:${alreadyAdded ? "#F0FDF4" : "#22C55E"};
                color:${alreadyAdded ? "#16A34A" : "white"};
                font-weight:600;font-size:13px;cursor:${alreadyAdded ? "default" : "pointer"};
              "
              ${alreadyAdded ? "disabled" : ""}
            >${alreadyAdded ? "✓ Lagt til" : "+ Legg til"}</button>
          </div>
        `);

        markersRef.current.push({ marker, enhet: e });
      });

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      }
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [geocoded, geocoding]);

  // Register global handler for popup buttons
  useEffect(() => {
    (window as any).reachrAddLead = (orgnr: string) => {
      const found = geocoded.find((e) => e.organisasjonsnummer === orgnr);
      if (found) onAdd(found);
    };
    return () => { delete (window as any).reachrAddLead; };
  }, [geocoded, onAdd]);

  if (geocoding) {
    return (
      <div style={{
        backgroundColor: "white", borderRadius: 14, border: "1px solid #E5E7EB",
        height: 520, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 12,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <Loader2 size={32} color="#22C55E" style={{ animation: "spin 1s linear infinite" }} />
        <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: 0 }}>Henter koordinater…</p>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Kartverkets gratis geokoding for {enheter.length} bedrifter</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "white", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      {/* Map header */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, backgroundColor: "#22C55E", borderRadius: "50%" }} />
          <span style={{ fontSize: 12, color: "#6B7280" }}>
            {geocoded.length} av {enheter.length} bedrifter plassert på kart
          </span>
        </div>
        {failed > 0 && (
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>{failed} kunne ikke geokodes</span>
        )}
      </div>

      {/* Map container */}
      <div ref={mapRef} style={{ height: 500, width: "100%" }} />
    </div>
  );
}
