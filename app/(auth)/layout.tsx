import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      {/* Simple auth navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-7 h-7 bg-[#2563EB] rounded-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="font-bold text-lg text-[#0F1729] tracking-tight">Reachr</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        {children}
      </div>

      <footer className="text-center py-6 text-sm text-gray-400">
        © 2024 Reachr AS · Alle rettigheter forbeholdt
      </footer>
    </div>
  );
}
