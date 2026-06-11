import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://play-qris.vercel.app"),
  title: {
    default: "PlayQRIS — Read & Edit QRIS Payment Data",
    template: "%s | PlayQRIS",
  },
  description:
    "Read, validate, and edit QRIS (Indonesian QR Code Standard) payment data. Upload a QRIS image or paste the code to decode merchant info, transaction amounts, and more.",
  keywords: [
    "QRIS",
    "QRIS Indonesia",
    "QR code payment",
    "Indonesian payment",
    "EMVCo QR",
    "merchant QR",
    "QRIS decoder",
    "QRIS editor",
    "QRIS validator",
    "QRIS parser",
    "payment QR code",
    "BI Quick Response",
    "Standar QR Indonesia",
  ],
  authors: [{ name: "Fariz Rifqi", url: "https://github.com/farizrifqi" }],
  creator: "Fariz Rifqi",
  publisher: "Fariz Rifqi",
  applicationName: "PlayQRIS",
  category: "Finance",
  classification: "Payment Tool",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["id_ID"],
    url: "https://play-qris.vercel.app",
    siteName: "PlayQRIS",
    title: "PlayQRIS — Read & Edit QRIS Payment Data",
    description:
      "Read, validate, and edit QRIS (Indonesian QR Code Standard) payment data. Upload a QRIS image or paste the code to decode merchant info, transaction amounts, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PlayQRIS — QRIS Payment Data Reader & Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@farizrifqi",
    creator: "@farizrifqi",
    title: "PlayQRIS — Read & Edit QRIS Payment Data",
    description:
      "Read, validate, and edit QRIS (Indonesian QR Code Standard) payment data. Upload a QRIS image or paste the code to decode merchant info, transaction amounts, and more.",
    images: ["/og-image.png"],
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
  alternates: {
    canonical: "https://play-qris.vercel.app",
    languages: {
      en: "https://play-qris.vercel.app",
      id: "https://play-qris.vercel.app/id",
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PlayQRIS",
  url: "https://play-qris.vercel.app",
  description:
    "Read, validate, and edit QRIS (Indonesian QR Code Standard) payment data.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  author: {
    "@type": "Person",
    name: "Fariz Rifqi",
    url: "https://github.com/farizrifqi",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
    { media: "(prefers-color-scheme: light)", color: "#020617" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://api.qrserver.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.qrserver.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
