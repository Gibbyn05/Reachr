"use client";
import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  List,
  Map,
  Plus,
  Filter,
  ChevronUp,
  ChevronDown,
  Phone,
  Mail,
  Building2,
  Users,
  TrendingUp,
  Check,
} from "lucide-react";
import { mockCompanies, mockLeads, industries, norwegianCities, Company } from "@/lib/mock-data";
import { useAppStore } from "@/store/app-store";
import { formatCurrency } from "@/lib/utils";

export default function LeadsokPage() {
  const [view, setView] = useState<"list" | "map">("list");
  const [locationQuery, setLocationQuery] = useState("");
  const [industryQuery, setIndustryQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("Alle bransjer");
  const [employeeFilter, setEmployeeFilter] = useState<string>("all");
  const [revenueFilter, setRevenueFilter] = useState<string>("all");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof Company | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const { leads, addLead } = useAppStore();
  const existingIds = new Set(leads.map((l) => l.id));

  const handleAddLead = (company: Company) => {
    if (!existingIds.has(company.id) && !addedIds.has(company.id)) {
      addLead({
        ...company,
        status: "Ikke kontaktet",
        lastContacted: null,
        assignedTo: "Ola Nordmann",
        assignedAvatar: "ON",
        notes: "",
        addedDate: new Date().toISOString().split("T")[0],
      });
      setAddedIds((prev) => new Set([...prev, company.id]));
    }
  };

  const handleSort = (field: keyof Company) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filteredCompanies = mockCompanies
    .filter((c) => {
      const matchLocation = !locationQuery || c.city.toLowerCase().includes(locationQuery.toLowerCase());
      const matchIndustry =
        selectedIndustry === "Alle bransjer" ||
        c.industry.toLowerCase().includes(selectedIndustry.toLowerCase()) ||
        c.industry.toLowerCase().includes(industryQuery.toLowerCase());
      const matchEmployee =
        employeeFilter === "all" ||
        (employeeFilter === "1-10" && c.employees <= 10) ||
        (employeeFilter === "11-50" && c.employees > 10 && c.employees <= 50) ||
        (employeeFilter === "51+" && c.employees > 50);
      const matchRevenue =
        revenueFilter === "all" ||
        (revenueFilter === "under5m" && c.revenue < 5000000) ||
        (revenueFilter === "5-20m" && c.revenue >= 5000000 && c.revenue < 20000000) ||
        (revenueFilter === "over20m" && c.revenue >= 20000000);
      return matchLocation && matchIndustry && matchEmployee && matchRevenue;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  const SortIcon = ({ field }: { field: keyof Company }) => (
    <span className="ml-1 inline-flex flex-col">
      <ChevronUp className={`w-2.5 h-2.5 ${sortField === field && sortDir === "asc" ? "text-green-500" : "text-gray-300"}`} />
      <ChevronDown className={`w-2.5 h-2.5 ${sortField === field && sortDir === "desc" ? "text-green-500" : "text-gray-300"}`} />
    </span>
  );

  return (
    <div>
      <TopBar title="Leadsøk" subtitle={`${filteredCompanies.length} bedrifter funnet`} />

      <div className="p-8">
        {/* Search bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Søk etter sted (f.eks. Oslo, Bergen)"
                icon={<MapPin className="w-4 h-4" />}
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Søk etter bransje (f.eks. frisør, bygg)"
                icon={<Building2 className="w-4 h-4" />}
                value={industryQuery}
                onChange={(e) => setIndustryQuery(e.target.value)}
              />
            </div>
            <Button variant="primary" size="md" className="px-8">
              <Search className="w-4 h-4" />
              Søk
            </Button>
            {/* View toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-md transition-all ${view === "list" ? "bg-white shadow-sm text-slate-900" : "text-gray-500 hover:text-slate-700"}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("map")}
                className={`p-2 rounded-md transition-all ${view === "map" ? "bg-white shadow-sm text-slate-900" : "text-gray-500 hover:text-slate-700"}`}
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filter sidebar */}
          <div className="w-56 flex-shrink-0 space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
              <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4" />
                Filtre
              </h3>

              {/* Industry filter */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bransje</p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {industries.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setSelectedIndustry(ind)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        selectedIndustry === ind
                          ? "bg-green-50 text-green-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              {/* Employee filter */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ansatte</p>
                <div className="space-y-1">
                  {[
                    { value: "all", label: "Alle" },
                    { value: "1-10", label: "1–10 ansatte" },
                    { value: "11-50", label: "11–50 ansatte" },
                    { value: "51+", label: "51+ ansatte" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setEmployeeFilter(opt.value)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 ${
                        employeeFilter === opt.value
                          ? "bg-green-50 text-green-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Users className="w-3 h-3" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Revenue filter */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Omsetning</p>
                <div className="space-y-1">
                  {[
                    { value: "all", label: "Alle" },
                    { value: "under5m", label: "Under 5 MNOK" },
                    { value: "5-20m", label: "5–20 MNOK" },
                    { value: "over20m", label: "Over 20 MNOK" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setRevenueFilter(opt.value)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 ${
                        revenueFilter === opt.value
                          ? "bg-green-50 text-green-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {view === "list" ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500">
                    Viser <span className="font-semibold text-slate-900">{filteredCompanies.length}</span> bedrifter
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {[
                          { label: "Bedriftsnavn", field: "name" as keyof Company },
                          { label: "Kontaktperson", field: "contactPerson" as keyof Company },
                          { label: "Telefon", field: null },
                          { label: "E-post", field: null },
                          { label: "Bransje", field: "industry" as keyof Company },
                          { label: "Sted", field: "city" as keyof Company },
                          { label: "Omsetning", field: "revenue" as keyof Company },
                          { label: "Ansatte", field: "employees" as keyof Company },
                          { label: "", field: null },
                        ].map(({ label, field }) => (
                          <th
                            key={label}
                            className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${field ? "cursor-pointer hover:text-slate-700 select-none" : ""}`}
                            onClick={() => field && handleSort(field)}
                          >
                            {label}
                            {field && <SortIcon field={field} />}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredCompanies.map((company) => {
                        const isAdded = existingIds.has(company.id) || addedIds.has(company.id);
                        return (
                          <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                                  {company.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">{company.name}</p>
                                  <p className="text-xs text-gray-400">{company.orgNumber}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{company.contactPerson}</td>
                            <td className="px-4 py-3.5">
                              <a href={`tel:${company.phone}`} className="text-sm text-gray-600 hover:text-green-600 flex items-center gap-1.5 whitespace-nowrap">
                                <Phone className="w-3 h-3" />
                                {company.phone}
                              </a>
                            </td>
                            <td className="px-4 py-3.5">
                              <a href={`mailto:${company.email}`} className="text-sm text-gray-600 hover:text-green-600 flex items-center gap-1.5 whitespace-nowrap">
                                <Mail className="w-3 h-3" />
                                {company.email}
                              </a>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium whitespace-nowrap">
                                {company.industry}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                {company.city}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-sm font-medium text-slate-700 whitespace-nowrap">
                              {formatCurrency(company.revenue).replace("NOK", "kr").replace(/\s/g, " ")}
                            </td>
                            <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3 text-gray-400" />
                                {company.employees}
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <Button
                                variant={isAdded ? "secondary" : "primary"}
                                size="sm"
                                onClick={() => !isAdded && handleAddLead(company)}
                                disabled={isAdded}
                                className="whitespace-nowrap"
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    Lagt til
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    Legg til
                                  </>
                                )}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {filteredCompanies.length === 0 && (
                    <div className="text-center py-16">
                      <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Ingen bedrifter funnet</p>
                      <p className="text-sm text-gray-400 mt-1">Prøv å endre søkeord eller filtre</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Map view */
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08)", height: "600px"}}>
                <div className="relative w-full h-full bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center">
                  {/* Norway map placeholder */}
                  <div className="text-center">
                    <div className="w-64 h-80 relative mx-auto">
                      {/* Simplified Norway shape */}
                      <svg viewBox="0 0 200 280" className="w-full h-full opacity-20">
                        <path
                          d="M100,10 L130,30 L150,60 L160,100 L155,140 L165,170 L150,200 L130,230 L100,260 L80,250 L60,220 L50,190 L60,160 L45,130 L50,100 L60,70 L80,40 Z"
                          fill="#0F1729"
                          stroke="#0F1729"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium mt-4">Kartvisning</p>
                    <p className="text-sm text-gray-400">Google Maps API trengs for live kart</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {filteredCompanies.length} bedrifter funnet i søket
                    </p>
                  </div>

                  {/* Company pins overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {filteredCompanies.slice(0, 8).map((company, i) => (
                      <div
                        key={company.id}
                        className="absolute pointer-events-auto"
                        style={{
                          left: `${20 + (i % 4) * 20}%`,
                          top: `${20 + Math.floor(i / 4) * 30}%`,
                        }}
                      >
                        <div className="group relative">
                          <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                            <MapPin className="w-4 h-4 text-white fill-white" />
                          </div>
                          {/* Tooltip */}
                          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 w-48 hidden group-hover:block z-10">
                            <p className="font-semibold text-xs text-slate-900">{company.name}</p>
                            <p className="text-xs text-gray-500">{company.city}</p>
                            <p className="text-xs text-gray-500">{company.industry}</p>
                            <Button
                              variant="primary"
                              size="sm"
                              className="mt-2 w-full justify-center text-xs"
                              onClick={() => handleAddLead(company)}
                            >
                              <Plus className="w-3 h-3" />
                              Legg til lead
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
