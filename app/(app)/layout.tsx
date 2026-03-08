"use client";
import { useAppStore } from "@/store/app-store";
import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-[#f2efe3]">
      <Sidebar />
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="md:ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
