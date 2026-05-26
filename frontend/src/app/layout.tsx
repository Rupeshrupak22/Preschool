import type { Metadata } from "next";
import AppShell from "./components/AppShell";
import "./globals.css";

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
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
