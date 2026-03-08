import Link from "next/link";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f2efe3] flex flex-col">
      <nav className="bg-[#faf8f2] border-b border-[#d8d3c5] px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <img src="/logo.svg" alt="Reachr" className="w-8 h-8" />
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
