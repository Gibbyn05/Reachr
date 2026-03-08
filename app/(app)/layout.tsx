import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f2efe3]">
      <Sidebar />
      <main className="ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
