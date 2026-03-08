import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reachr – Norsk B2B leadsøk og CRM",
  description:
    "Finn leads. Ta kontakt. Lukk avtaler. Reachr er det norske B2B-verktøyet for leadsøk og salgspipeline.",
  keywords: "B2B, leads, CRM, salg, Norge, norsk, leadsøk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
