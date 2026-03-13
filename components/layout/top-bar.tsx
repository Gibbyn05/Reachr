"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/app-store";
import { NotificationDropdown } from "../notifications/notification-dropdown";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const { setSidebarOpen } = useAppStore();

  return (
    <header className="h-16 bg-[#faf8f2] border-b border-[#d8d3c5] flex items-center px-4 md:px-8 gap-3 sticky top-0 z-40">
      {/* Hamburger — mobile only */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-[#e8e4d8] transition-colors shrink-0"
      >
        <Menu className="w-5 h-5 text-[#171717]" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-[#171717] truncate">{title}</h1>
        {subtitle && <p className="text-xs text-[#a09b8f] truncate">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <NotificationDropdown />
      </div>
    </header>
  );
}
