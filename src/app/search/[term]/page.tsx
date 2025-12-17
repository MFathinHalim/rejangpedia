import { Metadata } from "next";
import SearchPage from "./searchpage"; // Import the client component

// Optimized SEO Metadata for Search Page
export const metadata: Metadata = {
  title:
    "Cari Artikel Terbaik - Rejangpedia | Budaya, Sejarah, dan Bahasa Rejang",
  description:
    "Temukan artikel terbaik tentang budaya, sejarah, bahasa, dan warisan Rejang di Rejangpedia. Dapatkan informasi terbaru dan akurat seputar budaya Rejang di satu tempat.",
  keywords: [
    "Rejangpedia",
    "budaya Rejang",
    "sejarah Rejang",
    "bahasa Rejang",
    "artikel Rejang",
    "warisan budaya",
    "Rejang Indonesia",
  ],
  openGraph: {
    title: "Cari Artikel Terbaik - Rejangpedia",
    description:
      "Jelajahi artikel terbaik tentang budaya, sejarah, dan bahasa Rejang di Rejangpedia. Cari informasi terpercaya seputar warisan budaya Rejang.",
    images: ["/logo.png"],
    url: "https://rejangpedia.vercel.app/search",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cari Artikel - Rejangpedia | Budaya, Sejarah, Bahasa",
    description:
      "Cari artikel terbaik tentang budaya Rejang di Rejangpedia. Dapatkan informasi seputar sejarah, bahasa, dan warisan budaya Rejang.",
    images: ["/logo.png"],
  },
  robots: {
    index: true, // Izinkan halaman ini diindeks oleh mesin pencari
    follow: true, // Izinkan bot untuk mengikuti link di halaman ini
  },
  alternates: {
    canonical: "https://rejangpedia.vercel.app/search", // URL utama untuk menghindari duplikat
  },
  other: {
    author: "Rejangpedia",
    "og:locale": "id_ID", // Bahasa lokal Indonesia untuk Open Graph
  },
};

export default function Page() {
  return <SearchPage />; // Render the `SearchPage` client component
}
