"use client";
import { create } from "zustand";
import { Lead } from "@/lib/mock-data";

interface AppStore {
  leads: Lead[];
  addLead: (lead: Lead) => void;
  removeLead: (id: string) => void;
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
  updateLeadNotes: (id: string, notes: string) => void;
  updateLeadAssigned: (id: string, assignedTo: string) => void;
  updateLeadLastContacted: (id: string, date: string | null) => void;
  meetingDates: Record<string, string>; // leadId → ISO datetime string
  setMeetingDate: (leadId: string, datetime: string) => void;
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  currentUser: { name: string; email: string; company: string } | null;
  setCurrentUser: (user: { name: string; email: string; company: string } | null) => void;
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
  profilePhone: string;
  setProfilePhone: (phone: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  leads: [],
  addLead: (lead) =>
    set((state) => ({
      leads: [...state.leads, lead],
    })),
  removeLead: (id) =>
    set((state) => ({
      leads: state.leads.filter((l) => l.id !== id),
    })),
  updateLeadStatus: (id, status) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, status } : l)),
    })),
  updateLeadNotes: (id, notes) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, notes } : l)),
    })),
  updateLeadAssigned: (id, assignedTo) =>
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === id
          ? {
              ...l,
              assignedTo,
              assignedAvatar: assignedTo.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
            }
          : l
      ),
    })),
  updateLeadLastContacted: (id, date) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, lastContacted: date } : l)),
    })),
  meetingDates: {},
  setMeetingDate: (leadId, datetime) =>
    set((state) => ({
      meetingDates: { ...state.meetingDates, [leadId]: datetime },
    })),
  isLoggedIn: false,
  setLoggedIn: (value) => set({ isLoggedIn: value }),
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  avatarUrl: null,
  setAvatarUrl: (url) => set({ avatarUrl: url }),
  profilePhone: "+47 22 11 22 33",
  setProfilePhone: (phone) => set({ profilePhone: phone }),
}));
