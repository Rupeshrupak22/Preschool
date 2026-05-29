"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "./SiteFooter";
import SiteNavbar from "./SiteNavbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLmsRoute = pathname === "/student-dashboard" || pathname.startsWith("/student-dashboard/");
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isPrincipalDashboard = pathname === "/principal/dashboard" || pathname.startsWith("/principal/dashboard/");
  const isTeacherDashboard = pathname === "/teacher/dashboard" || pathname.startsWith("/teacher/dashboard/");
  const isAppRoute = isLmsRoute || isAdminRoute || isPrincipalDashboard || isTeacherDashboard;

  return (
    <>
      {!isAppRoute && <SiteNavbar />}
      <div className={isAppRoute ? undefined : "site-page-with-nav"}>{children}</div>
      {!isAppRoute && <SiteFooter />}
    </>
  );
}
