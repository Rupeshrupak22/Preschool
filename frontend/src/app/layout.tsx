import type { Metadata } from "next";
import SiteFooter from "./components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADYAPAN Future Skills Platform",
  description:
    "India's premium future skills, certification, and school partnership platform for Classes 5-12.",
  keywords: ["ADYAPAN", "coding", "AI", "robotics", "school partnership", "future skills"],
  openGraph: {
    title: "ADYAPAN Future Skills Platform",
    description: "Coding, AI, robotics, design, communication, and career skills for Classes 5-12.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}


