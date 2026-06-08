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
  title: "Adyapan School",
  applicationName: "Adyapan School",
  description:
    "India's premium future skills, certification, and school partnership platform for Classes 5-12.",
  keywords: ["Adyapan School", "coding", "AI", "robotics", "school partnership", "future skills"],
  icons: {
    icon: "/ady-logo.png",
    shortcut: "/ady-logo.png",
    apple: "/ady-logo.png"
  },
  openGraph: {
    siteName: "Adyapan School",
    title: "Adyapan School",
    description: "Coding, AI, robotics, design, communication, and career skills for Classes 5-12.",
    type: "website",
    images: ["/ady-logo.png"]
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
