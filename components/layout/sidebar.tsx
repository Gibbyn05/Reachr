"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Users,
  Bell,
  Settings,
  LogOut,
  Moon,
  Sun,
  X,
  BarChart2,
  ShieldCheck,
  CalendarDays,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { Lead } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAILS = ["fredriik8@gmail.com", "fredrik.nerlandsrem@gmail.com"];

const mainNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/leadsok", icon: Search, label: "Leadsøk" },
  { href: "/mine-leads", icon: Users, label: "Mine Leads" },
  { href: "/kalender", icon: CalendarDays, label: "Kalender" },
  { href: "/sekvenser", icon: Zap, label: "Sekvenser" },
  { href: "/varsler", icon: Bell, label: "Varsler" },
  { href: "/rapporter", icon: BarChart2, label: "Rapporter" },
];

function countNeedsFollowUp(leads: Lead[]): number {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  return leads.filter((l) => {
    if (l.status === "Ikke kontaktet") return new Date(l.addedDate) <= twoDaysAgo;
    if (l.status === "Kontaktet - ikke svar") {
      if (!l.lastContacted) return true;
      return new Date(l.lastContacted) <= twoDaysAgo;
    }
    if (l.status === "Kontaktet") {
      if (!l.lastContacted) return true;
      return new Date(l.lastContacted) <= threeDaysAgo;
    }
    return false;
  }).length;
}

export function Sidebar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [planLabel, setPlanLabel] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const { currentUser, setCurrentUser, loadLeads, avatarUrl, leads, sidebarOpen, setSidebarOpen } = useAppStore();

  const notifCount = countNeedsFollowUp(leads);
  const userIsAdmin = ADMIN_EMAILS.includes(currentUser?.email?.toLowerCase() ?? "");

  useEffect(() => {
    const saved = localStorage.getItem("reachr-dark");
    if (saved === "1") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data?.user;
      if (!user?.email) return;
      // Always sync from Supabase; clear stale data if a different user logged in
      if (currentUser?.email !== user.email) {
        setCurrentUser({
          name: user.user_metadata?.full_name ?? user.email,
          email: user.email,
          company: user.user_metadata?.company ?? "",
          salesPitch: user.user_metadata?.sales_pitch ?? undefined,
          targetCustomers: user.user_metadata?.target_customers ?? undefined,
        });
        // Clear avatar and phone so previous user's data doesn't bleed through
        useAppStore.getState().setAvatarUrl(null);
        useAppStore.getState().setProfilePhone("");
      }
      loadLeads(user.email);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load subscription label for the user profile section
  useEffect(() => {
    fetch("/api/stripe/subscription")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.subscription) return;
        const sub = data.subscription;
        if (sub.via_team_owner) {
          setPlanLabel("Medlem");
          setIsMember(true);
        } else {
          const name = sub.plan === "team" ? "Team" : sub.plan === "solo" ? "Solo" : sub.plan;
          setPlanLabel(name ? `${name}-plan` : null);
        }
      })
      .catch(() => {});
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("reachr-dark", next ? "1" : "0");
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Clear persisted user state so stale data isn't shown on next login
    setCurrentUser(null);
    // Hard redirect ensures cookies are cleared before middleware runs
    window.location.href = "/login";
  };

  const displayName = currentUser?.name ?? "Ola Nordmann";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full w-60 bg-[#171717] flex flex-col z-[1000]",
        "transition-transform duration-300 ease-in-out",
        "md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="Reachr" className="w-9 h-9" />
          <span className="text-white font-bold text-xl" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>Reachr</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {[...mainNavItems.filter(item => !(isMember && item.label === "Rapporter")), ...(userIsAdmin ? [{ href: "/admin", icon: ShieldCheck, label: "Admin" }] : [])].map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon
                className={cn(isActive ? "text-[#09fe94]" : "text-current")}
                style={{ width: "18px", height: "18px" }}
              />
              {label}
              {label === "Varsler" && notifCount > 0 && (
                <span className="ml-auto bg-[#09fe94] text-[#171717] text-xs rounded-full min-w-5 h-5 flex items-center justify-center font-semibold px-1">
                  {notifCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <button
          onClick={toggleDark}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          {dark
            ? <Sun style={{ width: "18px", height: "18px" }} />
            : <Moon style={{ width: "18px", height: "18px" }} />}
          {dark ? "Lyst tema" : "Mørkt tema"}
        </button>

        <Link
          href="/innstillinger"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            pathname === "/innstillinger"
              ? "bg-white/15 text-white"
              : "text-white/60 hover:text-white hover:bg-white/10"
          )}
        >
          <Settings
            className={cn(pathname === "/innstillinger" ? "text-[#09fe94]" : "text-current")}
            style={{ width: "18px", height: "18px" }}
          />
          Innstillinger
        </Link>

        <Link href="/innstillinger" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors mt-1">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 bg-[#09fe94] rounded-full flex items-center justify-center text-[#171717] text-xs font-bold flex-shrink-0">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{displayName}</p>
            {planLabel && <p className="text-white/40 text-xs truncate">{planLabel}</p>}
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/10 text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logg ut
        </button>
      </div>
    </aside>
  );
}
