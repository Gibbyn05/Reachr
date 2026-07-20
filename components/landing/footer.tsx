"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";

export function Footer() {
  const { lang } = useLanguage();

  const columns = lang === "en"
    ? [
        { title: "Product", links: [["Features", "#features"], ["Pricing", "#pricing"], ["Updates", "/oppdateringer"]] },
        { title: "Company", links: [["About", "#om-oss"], ["Contact", "#kontakt"], ["Support", "mailto:Help@reachr.no"]] },
        { title: "Legal", links: [["Privacy", "/personvern"], ["Terms", "/vilkaar"], ["GDPR", "/personvern#gdpr"]] },
      ]
    : [
        { title: "Produkt", links: [["Funksjoner", "#features"], ["Priser", "#pricing"], ["Oppdateringer", "/oppdateringer"]] },
        { title: "Selskap", links: [["Om oss", "#om-oss"], ["Kontakt", "#kontakt"], ["Support", "mailto:Help@reachr.no"]] },
        { title: "Juridisk", links: [["Personvern", "/personvern"], ["Vilkår", "/vilkaar"], ["GDPR", "/personvern#gdpr"]] },
      ];

  return (
    <footer className="bg-[#171717] text-white pt-[72px] pb-10 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 no-underline mb-4">
              <img src="/logo.svg" alt="Reachr" className="w-9 h-9" />
              <span className="font-extrabold text-lg text-white">Reachr</span>
            </Link>
            <p className="text-sm text-white/45 leading-[1.7] max-w-[260px]">
              {lang === "en"
                ? "Norway's B2B tool for lead search and sales pipeline. Helping hundreds of companies find and close new customers."
                : "Norges B2B-verktøy for leadsøk og salgspipeline. Hjelper hundrevis av bedrifter finne og lukke nye kunder."}
            </p>
          </div>

          {columns.map(({ title, links }) => (
            <div key={title}>
              <p className="text-[13px] font-bold text-white mb-4 uppercase tracking-[0.06em]">{title}</p>
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-white/45 no-underline transition-colors duration-150 hover:text-white"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-7 flex justify-between items-center flex-wrap gap-3">
          <p className="text-[13px] text-white/35 m-0">
            {lang === "en" ? "© 2026 Reachr AS. All rights reserved." : "© 2026 Reachr AS. Alle rettigheter forbeholdt."}
          </p>
          <p className="text-[13px] text-white/35 m-0">Help@reachr.no</p>
        </div>
      </div>
    </footer>
  );
}
