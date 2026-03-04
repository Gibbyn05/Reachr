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
  Zap,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const mainNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/leadsok", icon: Search, label: "Leadsøk" },
  { href: "/mine-leads", icon: Users, label: "Mine Leads" },
  { href: "/varsler", icon: Bell, label: "Varsler" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("reachr-dark");
    if (saved === "1") { setDark(true); document.documentElement.classList.add("dark"); }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("reachr-dark", next ? "1" : "0");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[#0F1729] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Reachr</span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {mainNavItems.map(({ href, icon: Icon, label }) => {
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
                className={cn("w-4.5 h-4.5", isActive ? "text-blue-400" : "text-current")}
                style={{ width: "18px", height: "18px" }}
              />
              {label}
              {label === "Varsler" && (
                <span className="ml-auto bg-[#2563EB] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/10 space-y-1">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          {dark ? <Sun style={{ width: "18px", height: "18px" }} /> : <Moon style={{ width: "18px", height: "18px" }} />}
          {dark ? "Lyst tema" : "Mørkt tema"}
        </button>

        {/* Settings */}
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
            className={cn(pathname === "/innstillinger" ? "text-blue-400" : "text-current")}
            style={{ width: "18px", height: "18px" }}
          />
          Innstillinger
        </Link>

        {/* User profile */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-1">
          <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center text-white text-xs font-bold">
            ON
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">Ola Nordmann</p>
            <p className="text-white/40 text-xs truncate">Pro-plan</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/50 hover:text-white/80 text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logg ut
        </Link>
      </div>
    </aside>
  );
}
