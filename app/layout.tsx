import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import WebMcp from "@/components/WebMcp";
import { abs, CONTACT, SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const defaultTitle = `${SITE.name} — Certified Diamonds, Exported Worldwide`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: defaultTitle, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    title: defaultTitle,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: SITE.description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = { themeColor: "#0f2a52", width: "device-width", initialScale: 1 };

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${abs("/")}#organization`,
      name: SITE.name,
      url: abs("/"),
      logo: { "@type": "ImageObject", url: abs("/images/logo.png"), width: 1072, height: 385 },
      description: SITE.description,
      slogan: SITE.tagline,
      knowsAbout: ["Diamonds", "Certified diamonds", "Fancy blue diamonds", "Diamond export", "GIA and IGI grading"],
      email: CONTACT.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: CONTACT.street.join(", "),
        addressLocality: CONTACT.locality,
        addressRegion: CONTACT.region,
        postalCode: CONTACT.postalCode,
        addressCountry: CONTACT.country,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: CONTACT.email,
        url: abs("/contact"),
        availableLanguage: "English",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${abs("/")}#website`,
      url: abs("/"),
      name: SITE.name,
      description: SITE.description,
      inLanguage: "en",
      publisher: { "@id": `${abs("/")}#organization` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={siteSchema} />
        <WebMcp />
        <Preloader />
        <noscript>
          <style>{"#preloader{display:none}"}</style>
        </noscript>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
