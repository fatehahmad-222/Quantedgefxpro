import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import { site } from "@/content/content";
import { Analytics } from "@/components/analytics/Analytics";
import { BackgroundFX } from "@/components/effects/BackgroundFX";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { absoluteUrl, metadataBase, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-space-grotesk",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "optional",
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: site.title,
    template: `%s | ${site.brand}`,
  },
  description: site.metaDescription,
  applicationName: site.brand,
  authors: [{ name: site.brand }],
  creator: site.brand,
  publisher: site.brand,
  category: "finance",
  keywords: [
    "XAUUSD Expert Advisor",
    "gold trading EA",
    "MetaTrader 5 EA",
    "automated gold trading",
    "Quant Edge FX Pro",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.brand,
    title: site.title,
    description: site.metaDescription,
    url: siteUrl ?? undefined,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Quant Edge FX Pro â€” automated XAUUSD trading on MetaTrader 5",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.metaDescription,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
  themeColor: "#05070A",
};

function StructuredData() {
  if (!siteUrl) return null;

  const organizationId = `${siteUrl}/#organization`;
  const applicationId = `${siteUrl}/#software`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: site.brand,
        url: siteUrl,
        logo: absoluteUrl("/logo.png"),
        image: absoluteUrl("/og.png"),
        email: "sales@quantedgefxpro.com",
        description: site.metaDescription,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            email: "sales@quantedgefxpro.com",
            telephone: "+1-205-8989-6542",
            availableLanguage: "English",
          },
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "support@quantedgefxpro.com",
            availableLanguage: "English",
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": applicationId,
        name: site.brand,
        url: siteUrl,
        description: site.metaDescription,
        applicationCategory: "FinanceApplication",
        operatingSystem: "MetaTrader 5",
        image: absoluteUrl("/og.png"),
        publisher: { "@id": organizationId },
        offers: [
          {
            "@type": "Offer",
            name: "Starter",
            price: "149",
            priceCurrency: "USD",
            url: siteUrl,
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Pro",
            price: "349",
            priceCurrency: "USD",
            url: siteUrl,
            availability: "https://schema.org/InStock",
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <BackgroundFX />
        <SmoothScroll />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <Analytics />
        <StructuredData />
      </body>
    </html>
  );
}

