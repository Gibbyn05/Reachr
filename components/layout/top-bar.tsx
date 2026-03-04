"use client";
import { Bell } from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 gap-4 sticky top-0 z-40">
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <Link href="/varsler" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
        </Link>
      </div>
    </header>
  );
}
