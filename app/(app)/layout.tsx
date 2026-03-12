"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { Sidebar } from "@/components/layout/sidebar";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const router = useRouter();
  const [subChecked, setSubChecked] = useState(false);

  useEffect(() => {
    fetch("/api/stripe/subscription")
      .then(async (r) => {
        if (r.status === 401) {
          // Not authenticated — send to login, not paywall
          router.replace("/login");
          return;
        }
        const data = await r.json();
        if (!data.subscription) {
          router.replace("/onboarding/betaling");
        } else {
          setSubChecked(true);
        }
      })
      .catch(() => {
        // On network error, allow through — don't block the user
        setSubChecked(true);
      });
  }, [router]);

  if (!subChecked) {
    return (
      <div className="min-h-screen bg-[#f2efe3] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#09fe94] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2efe3] dark:bg-[#0a0a0a]">
      <Sidebar />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="md:ml-60 min-h-screen bg-[#f2efe3] dark:bg-[#0a0a0a]">
        {children}
      </main>
      <OnboardingModal />
    </div>
  );
}
