import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import SiteFooter from "./components/SiteFooter";
import SiteNavbar from "./components/SiteNavbar";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "ADYAPAN Future Skills Platform",
  description:
    "India's premium future skills, certification, and school partnership platform for Classes 5-12.",
  keywords: ["ADYAPAN", "coding", "AI", "robotics", "school partnership", "future skills"],
  icons: {
    icon: "/adyapan-logo.svg",
    shortcut: "/adyapan-logo.svg",
    apple: "/adyapan-logo.svg"
  },
  openGraph: {
    title: "ADYAPAN Future Skills Platform",
    description: "Coding, AI, robotics, design, communication, and career skills for Classes 5-12.",
    type: "website",
    images: ["/adyapan-logo.svg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        {/* Global shell: all App Router pages must keep this navbar and footer here. */}
        <SiteNavbar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
