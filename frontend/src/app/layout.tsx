import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppShell from "./components/AppShell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
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

export const viewport = {
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
