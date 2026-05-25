"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import FloatingAIBuddy from "./FloatingAIBuddy";

interface Props {
  children: React.ReactNode;
  activeSection: string;
}

export default function DashboardLayout({ children, activeSection }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen pt-20"
      style={{
        background:
          "radial-gradient(circle at 0% 0%, rgba(168,85,247,0.18) 0%, transparent 40%), " +
          "radial-gradient(circle at 100% 0%, rgba(236,72,153,0.15) 0%, transparent 40%), " +
          "radial-gradient(circle at 50% 100%, rgba(59,130,246,0.12) 0%, transparent 50%), " +
          "linear-gradient(135deg, #f5f0ff 0%, #fdf2f8 40%, #eff6ff 100%)",
      }}
    >
      {/* Floating blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-48 w-48 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 h-56 w-56 rounded-full bg-blue-300/15 blur-3xl" />
      </div>

      <DashboardSidebar
        activeSection={activeSection}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        onMobileOpen={() => setMobileMenuOpen(true)}
      />

      <div
        className={`relative flex min-h-[calc(100vh-80px)] flex-col transition-[margin] duration-300 ${
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[240px]"
        }`}
      >
        <div className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
        </div>
      </div>

      {/* Global floating AI buddy */}
      <FloatingAIBuddy />
    </div>
  );
}
