import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site, doctor } from "@/content/site";
import {
  graph,
  physicianSchema,
  personSchema,
  organizationSchema,
  websiteSchema,
  JsonLd,
} from "@/lib/jsonld";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { AnimacaoEmVista } from "@/components/AnimacaoEmVista";

/* next/font faz self-host das fontes: zero requisição a fonts.googleapis.com,
   zero FOUT e nenhum layout shift. O site antigo puxava Montserrat e Roboto
   da rede do Google em requisição bloqueante.

   Geist (variável, um arquivo) carrega tudo: interface, corpo e títulos.
   A Instrument Serif entra só em itálico, para as palavras de destaque —
   é um arquivo de peso único, o que a torna barata como fonte de acento. */
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
  weight: "400",
  style: "italic",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Dr. Tércio Rocha — Medicina Regenerativa e Células-tronco",
    /* O site antigo produzia "Dr. Tércio Rocha - Dr. Tércio Rocha" na home. */
    template: "%s | Dr. Tércio Rocha",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: doctor.name, url: `${site.url}/dr-tercio-rocha` }],
  creator: doctor.name,
  publisher: "Clínica Longevitar",
  category: "Saúde",
  keywords: [
    "células-tronco",
    "medicina regenerativa",
    "Dr. Tércio Rocha",
    "longevidade",
    "células-tronco mesenquimais",
    "medicina anti-aging",
    "tratamento com células-tronco",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.name,
    title: "Dr. Tércio Rocha — Medicina Regenerativa e Células-tronco",
    description: site.description,
    images: [
      {
        url: "/img/tercio-retrato.webp",
        width: 1200,
        height: 630,
        alt: "Dr. Tércio Rocha, médico endocrinologista especialista em medicina regenerativa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Tércio Rocha — Medicina Regenerativa e Células-tronco",
    description: site.description,
    images: ["/img/tercio-retrato.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    /* NEXT_PUBLIC_BASE_PATH só existe na prévia do GitHub Pages. */
    icon: [{ url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/img/icone-dna.png`, type: "image/png" }],
    apple: [{ url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/img/icone-dna.png` }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1015",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${instrument.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-btn focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-bone-50"
        >
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <WhatsAppFab />
        <AnimacaoEmVista />
        <JsonLd
          data={graph(
            physicianSchema,
            personSchema,
            organizationSchema,
            websiteSchema,
          )}
        />
      </body>
    </html>
  );
}
