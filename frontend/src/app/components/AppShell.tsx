"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "./SiteFooter";
import SiteNavbar from "./SiteNavbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLmsRoute = pathname === "/student-dashboard" || pathname.startsWith("/student-dashboard/");

  return (
    <>
      {!isLmsRoute && <SiteNavbar />}
      <div className={isLmsRoute ? undefined : "site-page-with-nav"}>{children}</div>
      {!isLmsRoute && <SiteFooter />}
    </>
  );
}
