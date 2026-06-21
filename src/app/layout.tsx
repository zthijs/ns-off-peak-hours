import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@/assets/styles/globals.css";
import { Analytics } from "@/components/analytics";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/constants/site";
import { cn } from "@/lib/utils";

const sans = localFont({
  variable: "--font-sans-custom",
  src: [
    {
      path: "../assets/fonts/sans-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/sans-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  keywords: [
    "NS",
    "daluren",
    "dal-uren",
    "daltarief",
    "spitsuren",
    "spitstarief",
    "treinkaartje",
    "NS dal",
    "off-peak",
    "treintarief",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#003082",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  applicationCategory: "TravelApplication",
  operatingSystem: "Any",
  inLanguage: "nl",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={cn(sans.variable, "h-full antialiased")}>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static, build-time JSON-LD with no user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
