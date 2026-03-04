export type LeadStatus =
  | "Ikke kontaktet"
  | "Kontaktet"
  | "Kontaktet - ikke svar"
  | "Booket møte"
  | "Avslått"
  | "Kunde";

export interface Company {
  id: string;
  name: string;
  orgNumber: string;
  contactPerson: string;
  phone: string;
  email: string;
  industry: string;
  city: string;
  address: string;
  revenue: number;
  employees: number;
  lat: number;
  lng: number;
}

export interface Lead extends Company {
  status: LeadStatus;
  lastContacted: string | null;
  assignedTo: string;
  assignedAvatar: string;
  notes: string;
  addedDate: string;
}

export interface Notification {
  id: string;
  company: string;
  message: string;
  date: string;
  type: "follow-up" | "reminder" | "meeting";
  done: boolean;
}

export const mockCompanies: Company[] = [];
export const mockLeads: Lead[] = [];
export const mockNotifications: Notification[] = [];

export const industries = [
  "Alle bransjer",
  "Regnskap",
  "Frisør",
  "Bygg",
  "IT og teknologi",
  "Eiendom",
  "Transport og logistikk",
  "Juridiske tjenester",
  "Elektro",
  "Fiskeri og havbruk",
  "Markedsføring",
  "Helse og omsorg",
  "Matservering",
];

export const norwegianCities = [
  "Oslo",
  "Bergen",
  "Trondheim",
  "Stavanger",
  "Molde",
  "Ålesund",
  "Kristiansand",
  "Tromsø",
  "Drammen",
  "Fredrikstad",
  "Sandnes",
  "Sarpsborg",
  "Bodø",
  "Sandefjord",
];
