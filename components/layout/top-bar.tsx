"use client";
import { Bell } from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="h-16 bg-[#faf8f2] border-b border-[#d8d3c5] flex items-center px-8 gap-4 sticky top-0 z-40">
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-[#171717]">{title}</h1>
        {subtitle && <p className="text-xs text-[#a09b8f]">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <Link href="/varsler" className="relative p-2 rounded-lg hover:bg-[#e8e4d8] transition-colors">
          <Bell className="w-5 h-5 text-[#6b6660]" />
        </Link>
      </div>
    </header>
  );
}
