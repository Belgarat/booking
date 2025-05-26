import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/app/components/common/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: 'Eventi Dolomiti Nerd – Iscriviti ora',
    description:
        'Partecipa agli eventi ufficiali di Dolomiti Nerd: tornei, sessioni di gioco, fiere e attività nerd in Triveneto.',
    openGraph: {
        title: 'Eventi Dolomiti Nerd – Iscriviti ora',
        description:
            'Scopri il calendario eventi di Dolomiti Nerd e iscriviti facilmente online. Entra nella community e vivi la tua passione nerd!',
        url: 'https://eventi.dolomitinerd.it',
        siteName: 'Dolomiti Nerd',
        images: [
            {
                url: 'https://eventi.dolomitinerd.it/og-cover.jpg',
                width: 1200,
                height: 630,
                alt: 'Dolomiti Nerd Eventi - Iscriviti ora',
            },
        ],
        locale: 'it_IT',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        site: '@DolomitiNerd', // se hai un account Twitter/X ufficiale
        title: 'Eventi Dolomiti Nerd – Iscriviti ora',
        description:
            'Iscriviti subito agli eventi nerd più epici del Triveneto. Tornei, giochi da tavolo, cosplay e molto altro!',
        images: ['https://eventi.dolomitinerd.it/og-cover.jpg'],
    },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
