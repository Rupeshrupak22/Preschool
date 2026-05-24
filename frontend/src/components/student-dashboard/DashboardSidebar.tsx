"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Video,
  FileText,
  ClipboardCheck,
  CalendarCheck,
  Award,
  Zap,
  Trophy,
  Settings,
  Sparkles,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  group: "primary" | "secondary" | "tertiary";
}

const sidebarItems: SidebarItem[] = [
  // PRIMARY
  { id: "/student-dashboard",              label: "Dashboard",     icon: LayoutDashboard, href: "/student-dashboard",              group: "primary" },
  { id: "/student-dashboard/my-courses",   label: "My Courses",    icon: BookOpen,        href: "/student-dashboard/my-courses",   group: "primary" },
  { id: "/student-dashboard/live-classes", label: "Live Classes",  icon: Video,           href: "/student-dashboard/live-classes", group: "primary", badge: "LIVE" },
  { id: "/student-dashboard/ai-lab",       label: "AI Lab",        icon: Sparkles,        href: "/student-dashboard/ai-lab",       group: "primary", badge: "NEW" },
  { id: "/student-dashboard/homework",     label: "Homework",      icon: ClipboardList,   href: "/student-dashboard/homework",     group: "primary", badge: "3" },
  { id: "/student-dashboard/tests",        label: "Tests & Quiz",  icon: ClipboardCheck,  href: "/student-dashboard/tests",        group: "primary", badge: "2" },
  // SECONDARY
  { id: "/student-dashboard/notes",        label: "Notes & PDFs",  icon: FileText,        href: "/student-dashboard/notes",        group: "secondary" },
  { id: "/student-dashboard/daily-news",   label: "Daily News",    icon: Newspaper,       href: "/student-dashboard/daily-news",   group: "secondary" },
  { id: "/student-dashboard/attendance",   label: "Attendance",    icon: CalendarCheck,   href: "/student-dashboard/attendance",   group: "secondary" },
  { id: "/student-dashboard/skill-progress",label:"Skill Progress",icon: Zap,             href: "/student-dashboard/skill-progress",group:"secondary" },
  { id: "/student-dashboard/leaderboard",  label: "Leaderboard",   icon: Trophy,          href: "/student-dashboard/leaderboard",  group: "secondary" },
  // TERTIARY
  { id: "/student-dashboard/certificates", label: "Certificates",  icon: Award,           href: "/student-dashboard/certificates", group: "tertiary" },
  { id: "/student-dashboard/settings",     label: "Settings",      icon: Settings,        href: "/student-dashboard/settings",     group: "tertiary" },
];

interface Props {
  activeSection?: string;
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function DashboardSidebar({
  collapsed,
  onCollapse,
  mobileOpen,
  onMobileClose,
}: Props) {
  const pathname = usePathname();

  // ── Scroll-trigger: hide on scroll-down, show on scroll-up ──────────────
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (delta > 8 && currentY > 120) {
          // Scrolling DOWN past 120px → hide sidebar
          setSidebarVisible(false);
        } else if (delta < -8) {
          // Scrolling UP → show sidebar
          setSidebarVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Shared nav content ───────────────────────────────────────────────────
  const NavItems = ({ forMobile = false }: { forMobile?: boolean }) => {
    const groups: Array<{ key: "primary" | "secondary" | "tertiary"; label: string }> = [
      { key: "primary",   label: "Main" },
      { key: "secondary", label: "Explore" },
      { key: "tertiary",  label: "More" },
    ];

    return (
      <nav className="flex-1 overflow-y-auto px-3 py-3 no-scrollbar">
        {groups.map(({ key, label }) => {
          const items = sidebarItems.filter((i) => i.group === key);
          return (
            <div key={key} className="mb-3">
              {(!collapsed || forMobile) && (
                <p className="mb-1 px-3 text-[9px] font-black uppercase tracking-widest text-white/25">
                  {label}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = pathname === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={onMobileClose}
                      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)]"
                          : "text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600"
                          style={{ zIndex: -1 }}
                        />
                      )}
                      <item.icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-white" : "text-white/50 group-hover:text-white"
                        }`}
                      />
                      {(!collapsed || forMobile) && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}
                      {(!collapsed || forMobile) && item.badge && (
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                            item.badge === "LIVE"
                              ? "animate-pulse bg-rose-500 text-white"
                              : item.badge === "NEW"
                              ? "bg-emerald-500 text-white"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    );
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────────────── */}
      <motion.aside
        animate={{
          width: collapsed ? 72 : 240,
          x: sidebarVisible ? 0 : -(collapsed ? 72 : 240),
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-[72px] z-40 hidden h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-[4px_0_24px_rgba(0,0,0,0.15)] lg:flex lg:flex-col"
      >
        {/* Logo */}
        <div
          className={`flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-5 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-black text-white shadow-lg">
            ady.
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">Adyapan</p>
              <p className="truncate text-[10px] font-bold uppercase tracking-widest text-white/50">
                LMS Portal
              </p>
            </div>
          )}
        </div>

        <NavItems />

        {/* Collapse toggle */}
        <div className="shrink-0 border-t border-white/10 p-3">
          <button
            onClick={() => onCollapse(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>

      {/* ── SCROLL-UP TRIGGER TAB (desktop) ─────────────────────────────── */}
      {/* When sidebar is hidden, show a small pull-tab on the left edge */}
      <AnimatePresence>
        {!sidebarVisible && (
          <motion.button
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarVisible(true)}
            className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 items-center justify-center rounded-r-xl bg-gradient-to-b from-purple-600 to-blue-600 px-1.5 py-4 shadow-[4px_0_16px_rgba(139,92,246,0.4)] lg:flex"
            aria-label="Show sidebar"
          >
            <Menu className="h-4 w-4 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── MOBILE DRAWER ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />

            {/* Drawer panel */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-black text-white">
                    ady.
                  </div>
                  <span className="text-sm font-black text-white">Adyapan LMS</span>
                </div>
                <button
                  onClick={onMobileClose}
                  className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile nav */}
              <NavItems forMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
