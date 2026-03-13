import { Lead } from "./mock-data";
import { PhoneCall, Clock, CalendarCheck2, Bell } from "lucide-react";

export type NotifType = "follow-up" | "reminder" | "meeting";

export interface ComputedNotif {
  id: string;
  company: string;
  message: string;
  date: string;
  type: NotifType;
  leadId: string;
}

export const typeIcons: Record<NotifType, typeof Bell> = {
  "follow-up": PhoneCall,
  reminder: Clock,
  meeting: CalendarCheck2,
};

export const typeColors: Record<NotifType, string> = {
  "follow-up": "bg-[#ff470a]/10 text-[#ff470a]",
  reminder: "bg-accent-dark/10 text-accent-dark",
  meeting: "bg-[#ffad0a]/12 text-[#c47e00]",
};

export function buildNotifications(leads: Lead[]): ComputedNotif[] {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const notifs: ComputedNotif[] = [];

  for (const lead of leads) {
    const addedDate = new Date(lead.addedDate);
    const lastContact = lead.lastContacted ? new Date(lead.lastContacted) : null;

    if (lead.status === "Ikke kontaktet" && addedDate <= twoDaysAgo) {
      notifs.push({
        id: `nc-${lead.id}`,
        company: lead.name,
        type: "follow-up",
        leadId: lead.id,
        date: lead.addedDate,
        message: `Ikke kontaktet ennå — lagt til ${addedDate.toLocaleDateString("nb-NO")}`,
      });
    }
    if (lead.status === "Kontaktet - ikke svar" && (!lastContact || lastContact <= twoDaysAgo)) {
      const days = lastContact ? Math.floor((now.getTime() - lastContact.getTime()) / 86400000) : null;
      notifs.push({
        id: `nis-${lead.id}`,
        company: lead.name,
        type: "reminder",
        leadId: lead.id,
        date: lead.lastContacted ?? lead.addedDate,
        message: `Svarte ikke — prøv igjen${days !== null ? ` (${days} dager siden)` : ""}`,
      });
    }
    if (lead.status === "Kontaktet" && lastContact && lastContact <= threeDaysAgo) {
      const days = Math.floor((now.getTime() - lastContact.getTime()) / 86400000);
      notifs.push({
        id: `c-${lead.id}`,
        company: lead.name,
        type: "follow-up",
        leadId: lead.id,
        date: lead.lastContacted!,
        message: `${days} dager siden sist kontakt`,
      });
    }
    if (lead.status === "Booket møte") {
      notifs.push({
        id: `m-${lead.id}`,
        company: lead.name,
        type: "meeting",
        leadId: lead.id,
        date: lead.lastContacted ?? lead.addedDate,
        message: `Møte booket${lead.lastContacted ? ` — ${new Date(lead.lastContacted).toLocaleDateString("nb-NO")}` : ""}`,
      });
    }
  }
  return notifs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
