import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f2efe3] flex flex-col">
      {/* Simple auth navbar */}
      <nav className="bg-[#faf8f2] border-b border-[#d8d3c5] px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-7 h-7 bg-[#09fe94] rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-[#171717] fill-[#171717]" />
          </div>
          <span className="font-bold text-xl text-[#171717]" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>Reachr</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        {children}
      </div>

      <footer className="text-center py-6 text-sm text-[#a09b8f]">
        © 2025 Reachr AS · Alle rettigheter forbeholdt
      </footer>
    </div>
  );
}
