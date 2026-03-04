import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F1729] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">Reachr</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Norges ledende B2B-verktøy for leadsøk og salgspipeline.
              Hjelper hundrevis av bedrifter finne og lukke nye kunder.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Produkt</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><Link href="#features" className="hover:text-white transition-colors">Funksjoner</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Priser</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Integrasjoner</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Oppdateringer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Selskap</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><Link href="#" className="hover:text-white transition-colors">Om oss</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blogg</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Karriere</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Juridisk</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><Link href="#" className="hover:text-white transition-colors">Personvern</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Vilkår</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">GDPR</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2024 Reachr AS. Alle rettigheter forbeholdt.
          </p>
          <p className="text-white/40 text-sm">
            Org.nr: 123 456 789 • Oslo, Norge
          </p>
        </div>
      </div>
    </footer>
  );
}
