import Navbar from "@/components/Navbar";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
import Script from "next/script"; // Import next/script for AdSense
import { Search } from "lucide-react";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "rejangpedia - Punyo Kito Galo",
  description:
    "Rejangpedia adalah ensiklopedia digital yang mengulas budaya, sejarah, dan warisan Rejang. Temukan artikel menarik, foto-foto bersejarah, dan banyak lagi!",

  // SEO Keywords
  keywords: [
    "Rejangpedia",
    "Budaya Rejang",
    "Sejarah Rejang",
    "Warisan budaya Rejang",
    "Ensiklopedia Rejang",
    "Bahasa Rejang",
    "Artikel sejarah Indonesia",
    "Rejang Bengkulu",
  ],

  // Open Graph (OG) Meta Tags for better social media previews
  openGraph: {
    title: "Rejangpedia - Punyo Kito Galo",
    type: "website",
    url: "https://rejangpedia.vercel.app", // Update if this changes
    description:
      "Ensiklopedia digital budaya Rejang. Jelajahi sejarah, bahasa, dan warisan budaya Rejang di Rejangpedia!",
    images: [
      {
        url: "/logo.png", // Featured image for OG (should be at least 1200x630 for best results)
        alt: "Rejangpedia Logo",
      },
    ],
  },

  // Twitter Card meta tags for optimized sharing on Twitter
  twitter: {
    card: "summary_large_image",
    site: "@rejangpedia", // Optional: Twitter handle (if available)
    title: "Rejangpedia - Punyo Kito Galo",
    description:
      "Ensiklopedia digital budaya Rejang. Jelajahi sejarah, bahasa, dan warisan budaya Rejang di Rejangpedia!",
    images: ["/logo.png"],
  },

  // Optional - favicon/logo setup
  icons: {
    icon: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" type="image/x-icon" href="/logo-icon.png" />
        <meta
          name="keywords"
          content="Rejangpedia, Budaya Rejang, Sejarah Rejang, Ensiklopedia, Bahasa Rejang, Warisan Budaya"
        />
        <meta
          name="google-site-verification"
          content="GcCtsibceSskv7l9WM_5t29jLRwyOsvsoFln7lUP_sk"
        />
        <meta name="google-adsense-account" content="ca-pub-2998592050723815" />
      </head>
      <body>
        <Navbar />
        <AuthProvider>{children}</AuthProvider>
        <a
          href="/search"
          className="btn btn-primary floating-button"
          id="floatingButton"
        >
          <Search />
        </a>
      </body>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2998592050723815"
        crossOrigin="anonymous"
      />
    </html>
  );
}
