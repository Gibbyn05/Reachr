"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Lead } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

interface AppStore {
  leads: Lead[];
  loadLeads: (userEmail: string) => Promise<void>;
  addLead: (lead: Lead, userEmail?: string) => Promise<void>;
  removeLead: (id: string) => Promise<void>;
  updateLeadStatus: (id: string, status: Lead["status"]) => Promise<void>;
  updateLeadNotes: (id: string, notes: string) => Promise<void>;
  updateLeadAssigned: (id: string, assignedTo: string) => Promise<void>;
  updateLeadLastContacted: (id: string, date: string | null) => Promise<void>;
  meetingDates: Record<string, string>; // leadId → ISO datetime string
  setMeetingDate: (leadId: string, datetime: string) => Promise<void>;
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  currentUser: { name: string; email: string; company: string; salesPitch?: string; targetCustomers?: string } | null;
  setCurrentUser: (user: { name: string; email: string; company: string; salesPitch?: string; targetCustomers?: string } | null) => void;
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
  profilePhone: string;
  setProfilePhone: (phone: string) => void;
}

function dbRowToLead(row: Record<string, unknown>): Lead {
  return {
    id: row.id as string,
    name: row.name as string,
    orgNumber: row.org_number as string,
    contactPerson: row.contact_person as string,
    phone: row.phone as string,
    email: row.email as string,
    industry: row.industry as string,
    city: row.city as string,
    address: row.address as string,
    revenue: (row.revenue as number) ?? 0,
    employees: (row.employees as number) ?? 0,
    lat: (row.lat as number) ?? 0,
    lng: (row.lng as number) ?? 0,
    status: row.status as Lead["status"],
    lastContacted: row.last_contacted as string | null,
    assignedTo: row.assigned_to as string,
    assignedAvatar: row.assigned_avatar as string,
    addedBy: row.added_by as string,
    notes: (row.notes as string) ?? "",
    addedDate: row.added_date as string,
  };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      leads: [],

      loadLeads: async (userEmail: string) => {
        const supabase = createClient();

        // Get team owner email from auth metadata (for members)
        const { data: { user } } = await supabase.auth.getUser();
        const teamOwnerEmail = user?.user_metadata?.team_owner as string | undefined;
        const ownerEmail = teamOwnerEmail ?? userEmail;

        // Fetch all member emails under this team
        const { data: members } = await supabase
          .from("team_members")
          .select("member_email")
          .eq("owner_email", ownerEmail);

        const teamEmails = Array.from(new Set([
          ownerEmail,
          userEmail,
          ...(members ?? []).map((m: { member_email: string }) => m.member_email),
        ]));

        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .in("user_email", teamEmails)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("[loadLeads] error:", error);
          return;
        }

        const rows = data ?? [];
        const leads = rows.map(dbRowToLead);
        const meetingDates: Record<string, string> = {};
        rows.forEach((r) => {
          if (r.meeting_date) meetingDates[r.id as string] = r.meeting_date as string;
        });
        set({ leads, meetingDates });
      },

      addLead: async (lead: Lead, userEmail?: string) => {
        set((state) => ({ leads: [...state.leads, lead] }));
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const email = user?.email ?? userEmail ?? get().currentUser?.email ?? "";

        const { error } = await supabase
          .from("leads")
          .upsert({
            id: lead.id,
            user_email: email,
            name: lead.name,
            org_number: lead.orgNumber,
            contact_person: lead.contactPerson,
            phone: lead.phone,
            email: lead.email,
            industry: lead.industry,
            city: lead.city,
            address: lead.address,
            revenue: lead.revenue ?? 0,
            employees: lead.employees ?? 0,
            lat: lead.lat ?? 0,
            lng: lead.lng ?? 0,
            status: lead.status,
            last_contacted: lead.lastContacted,
            assigned_to: lead.assignedTo,
            assigned_avatar: lead.assignedAvatar,
            added_by: lead.addedBy,
            notes: lead.notes ?? "",
            added_date: lead.addedDate,
          });

        if (error) {
          console.error("[addLead] upsert error:", error);
        }
      },

      removeLead: async (id: string) => {
        set((state) => ({ leads: state.leads.filter((l) => l.id !== id) }));
        await fetch(`/api/leads/${id}`, { method: "DELETE" });
      },

      updateLeadStatus: async (id: string, status: Lead["status"]) => {
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, status } : l)),
        }));
        await fetch(`/api/leads/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
      },

      updateLeadNotes: async (id: string, notes: string) => {
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, notes } : l)),
        }));
        await fetch(`/api/leads/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes }),
        });
      },

      updateLeadAssigned: async (id: string, assignedTo: string) => {
        const assignedAvatar = assignedTo
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id ? { ...l, assignedTo, assignedAvatar } : l
          ),
        }));
        await fetch(`/api/leads/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assigned_to: assignedTo, assigned_avatar: assignedAvatar }),
        });
      },

      updateLeadLastContacted: async (id: string, date: string | null) => {
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, lastContacted: date } : l)),
        }));
        await fetch(`/api/leads/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ last_contacted: date }),
        });
      },

      meetingDates: {},
      setMeetingDate: async (leadId: string, datetime: string) => {
        set((state) => ({
          meetingDates: { ...state.meetingDates, [leadId]: datetime },
        }));
        await fetch(`/api/leads/${leadId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ meeting_date: datetime }),
        });
      },

      isLoggedIn: false,
      setLoggedIn: (value) => set({ isLoggedIn: value }),
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      avatarUrl: null,
      setAvatarUrl: (url) => set({ avatarUrl: url }),
      profilePhone: "+47 22 11 22 33",
      setProfilePhone: (phone) => set({ profilePhone: phone }),
    }),
    {
      name: "reachr-store",
      partialize: (state) => ({
        currentUser: state.currentUser,
        avatarUrl: state.avatarUrl,
        profilePhone: state.profilePhone,
      }),
    }
  )
);
