"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Video,
  FileText,
  CalendarCheck,
  Zap,
  Trophy,
  Settings,
  Sparkles,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Gamepad2,
  HelpCircle,
  PlayCircle,
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
  { id: "/student-dashboard",                  label: "Dashboard",        icon: LayoutDashboard, href: "/student-dashboard",                  group: "primary" },
  { id: "/student-dashboard/my-courses",       label: "My Courses",       icon: BookOpen,        href: "/student-dashboard/my-courses",       group: "primary" },
  { id: "/student-dashboard/live-classes",     label: "Live Classes",     icon: Video,           href: "/student-dashboard/live-classes",     group: "primary", badge: "LIVE" },
  { id: "/student-dashboard/ai-lab",           label: "AI Lab",           icon: Sparkles,        href: "/student-dashboard/ai-lab",           group: "primary", badge: "NEW" },
  { id: "/student-dashboard/homework",         label: "Homework",         icon: ClipboardList,   href: "/student-dashboard/homework",         group: "primary", badge: "3" },
  { id: "/student-dashboard/gamified",         label: "Gamified",         icon: Gamepad2,        href: "/student-dashboard/gamified",         group: "primary", badge: "NEW" },
  { id: "/student-dashboard/notes",            label: "Notes & PDFs",     icon: FileText,        href: "/student-dashboard/notes",            group: "secondary" },
  { id: "/student-dashboard/daily-news",       label: "Daily News",       icon: Newspaper,       href: "/student-dashboard/daily-news",       group: "secondary" },
  { id: "/student-dashboard/attendance",       label: "Attendance",       icon: CalendarCheck,   href: "/student-dashboard/attendance",       group: "secondary" },
  { id: "/student-dashboard/skill-progress",   label: "Skill Progress",   icon: Zap,             href: "/student-dashboard/skill-progress",   group: "secondary" },
  { id: "/student-dashboard/leaderboard",      label: "Leaderboard",      icon: Trophy,          href: "/student-dashboard/leaderboard",      group: "secondary" },
  { id: "/student-dashboard/doubt-section",    label: "Doubt Section",    icon: HelpCircle,      href: "/student-dashboard/homework",         group: "secondary" },
  { id: "/student-dashboard/recorded-classes", label: "Recorded Classes", icon: PlayCircle,      href: "/student-dashboard/recorded-classes", group: "tertiary" },
  { id: "/student-dashboard/settings",         label: "Settings",         icon: Settings,        href: "/student-dashboard/settings",         group: "tertiary" },
];

interface Props {
  activeSection?: string;
  collapsed: boolean;
  underMainNav?: boolean;
  onCollapse: (v: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onMobileOpen: () => void;
}

export default function DashboardSidebar({
  collapsed,
  underMainNav = false,
  onCollapse,
  mobileOpen,
  onMobileClose,
  onMobileOpen,
}: Props) {
  const pathname = usePathname();

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
            <div key={key} className="mb-4">
              {(!collapsed || forMobile) && (
                <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-widest text-white/30">
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
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_4px_20px_rgba(168,85,247,0.45)]"
                          : "text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500"
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
      {/* ── DESKTOP SIDEBAR — always visible, never moves ─────────── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 z-40 hidden overflow-hidden lg:flex lg:flex-col ${
          underMainNav ? "top-20 h-[calc(100vh-80px)]" : "top-0 h-screen"
        }`}
        style={{
          background: "linear-gradient(180deg, #1e1040 0%, #2d1b69 50%, #1a0f3c 100%)",
          boxShadow: "4px 0 32px rgba(168,85,247,0.2)",
        }}
      >
        {/* Logo */}
        <div
          className={`flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-5 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-black text-white shadow-[0_4px_16px_rgba(168,85,247,0.5)]">
            ady.
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">Adyapan</p>
              <p className="truncate text-[10px] font-bold uppercase tracking-widest text-white/40">
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
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold text-white/40 transition hover:bg-white/10 hover:text-white"
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

      {/* ── MOBILE OPEN BUTTON ────────────────────────────────────── */}
      <button
        onClick={onMobileOpen}
        className={`fixed left-4 z-40 flex h-9 w-9 items-center justify-center rounded-xl border border-purple-200 bg-white/90 text-purple-600 shadow-md backdrop-blur-sm transition hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent lg:hidden ${
          underMainNav ? "top-[86px]" : "top-4"
        }`}
        aria-label="Open navigation"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* ── MOBILE DRAWER ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col shadow-2xl lg:hidden"
              style={{
                background: "linear-gradient(180deg, #1e1040 0%, #2d1b69 50%, #1a0f3c 100%)",
              }}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-black text-white">
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
              <NavItems forMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
