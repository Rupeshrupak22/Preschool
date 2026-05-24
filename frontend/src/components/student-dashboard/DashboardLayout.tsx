"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import StudentHeader from "./StudentHeader";
import { studentData } from "@/lib/dashboard/dashboard-data";

interface Props {
  children: React.ReactNode;
  activeSection: string;
}

export default function DashboardLayout({ children, activeSection }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#f4f8ff] pt-[72px]">
      {/* Sidebar — fixed on desktop, stops at viewport bottom */}
      <DashboardSidebar
        activeSection={activeSection}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Content area shifts right of sidebar on desktop only */}
      <div
        className={`flex min-h-[calc(100vh-72px)] flex-col transition-[margin] duration-300 ${
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[240px]"
        }`}
      >
        {/* Sub-header */}
        <StudentHeader
          student={studentData}
          onMenuOpen={() => setMobileMenuOpen(true)}
        />

        {/* Page content */}
        <div className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
