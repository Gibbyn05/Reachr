"use client";
import { useState, useRef, useEffect } from "react";
import { Bell, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/app-store";
import { buildNotifications, typeIcons, typeColors } from "@/lib/notifications";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { leads } = useAppStore();
  
  const notifications = buildNotifications(leads).slice(0, 5); // Show top 5
  const activeCount = notifications.length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors ${
          isOpen ? "bg-[#e8e4d8]" : "hover:bg-[#e8e4d8]"
        }`}
      >
        <Bell className="w-5 h-5 text-[#6b6660]" />
        {activeCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff470a] rounded-full border-2 border-[#faf8f2]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#faf8f2] border border-[#d8d3c5] rounded-xl shadow-xl z-50 overflow-hidden transform origin-top-right transition-all animate-appear">
          <div className="p-4 border-b border-[#d8d3c5] flex items-center justify-between bg-white">
            <h3 className="text-sm font-bold text-[#171717]">Varsler</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff470a]/10 text-[#ff470a]">
              {activeCount} aktive
            </span>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-[#d8d3c5] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[#a09b8f]">Ingen nye varsler</p>
              </div>
            ) : (
              <div className="divide-y divide-[#e8e4d8]">
                {notifications.map((notif) => {
                  const Icon = typeIcons[notif.type];
                  return (
                    <Link
                      key={notif.id}
                      href="/varsler"
                      onClick={() => setIsOpen(false)}
                      className="block p-4 hover:bg-[#f0ece0] transition-colors group"
                    >
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-lg ${typeColors[notif.type]} flex items-center justify-center shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#171717] truncate group-hover:text-black">
                            {notif.company}
                          </p>
                          <p className="text-[11px] text-[#6b6660] mt-0.5 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-[#a09b8f] mt-1.5 flex items-center gap-1">
                            {new Date(notif.date).toLocaleDateString("nb-NO", {
                              day: "numeric",
                              month: "short"
                            })}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#d8d3c5] self-center group-hover:text-[#6b6660] transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/varsler"
            onClick={() => setIsOpen(false)}
            className="block p-3 text-center text-xs font-bold text-[#6b6660] bg-white border-t border-[#d8d3c5] hover:bg-[#faf8f2] hover:text-[#171717] transition-all flex items-center justify-center gap-2"
          >
            Se alle varsler
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
