"use client";
import { create } from "zustand";
import { Lead } from "@/lib/mock-data";

interface AppStore {
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
  updateLeadNotes: (id: string, notes: string) => void;
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  currentUser: { name: string; email: string; company: string } | null;
  setCurrentUser: (user: { name: string; email: string; company: string } | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  leads: [],
  addLead: (lead) =>
    set((state) => ({
      leads: [...state.leads, lead],
    })),
  updateLeadStatus: (id, status) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, status } : l)),
    })),
  updateLeadNotes: (id, notes) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, notes } : l)),
    })),
  isLoggedIn: false,
  setLoggedIn: (value) => set({ isLoggedIn: value }),
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));
