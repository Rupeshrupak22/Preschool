"use client";

import { useEffect, useRef, useState } from "react";
import {
  Award,
  BarChart3,
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UserPen,
  UserRound,
  X
} from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/#top" },
  { label: "Overview", href: "/#curriculum" },
  { label: "Mentor", href: "/#events" },
  { label: "My App", href: "/our.html" },
  { label: "LMS", href: "/dashboard" },
  { label: "About Us", href: "/#footer" }
];

type NavUser = {
  name: string;
  email?: string;
  role: "student" | "admin";
};

export default function SiteNavbar() {
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await response.json();
        if (active) setUser(response.ok ? data.user : null);
      } catch {
        if (active) setUser(null);
      }
    }

    loadUser();
    window.addEventListener("adyapan-auth-change", loadUser);
    return () => {
      active = false;
      window.removeEventListener("adyapan-auth-change", loadUser);
    };
  }, [pathname]);

  useEffect(() => {
    setProfileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  function isActive(href: string) {
    const path = href.split("#")[0] || "/";
    if (path === "/") {
      return href === "/#top" && pathname === "/";
    }

    return pathname === path || (path !== "/" && pathname.startsWith(path));
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMenuOpen(false);
    setProfileOpen(false);
    window.dispatchEvent(new Event("adyapan-auth-change"));
    window.location.href = "/login";
  }

  const dashboardHref = user?.role === "admin" ? "/admin" : "/dashboard";
  const shortName = user?.name?.split(" ")[0] || "Student";
  const initial = (user?.name?.trim()?.[0] || "A").toUpperCase();
  const menuItems = [
    { label: user?.role === "admin" ? "Admin Dashboard" : "Dashboard", href: dashboardHref, icon: LayoutDashboard },
    { label: "Edit Profile", href: "/dashboard#profile", icon: UserPen },
    { label: "My Courses", href: "/dashboard#courses", icon: BookOpen },
    { label: "Track Result", href: "/dashboard#results", icon: BarChart3 },
    { label: "Certificates", href: "/dashboard#certificates", icon: Award },
    { label: "Settings", href: "/dashboard#settings", icon: Settings }
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-[100] bg-gradient-to-r from-[#b565f2] via-[#efb7df] to-[#8ec9f6] shadow-[0_12px_36px_rgba(99,102,241,0.24)] backdrop-blur-xl">
      <div className="pointer-events-none absolute left-9 top-3 h-3 w-3 rounded-full bg-[#f6d748]" />
      <div className="pointer-events-none absolute left-[82px] top-5 text-sm font-black text-yellow-200">*</div>

      <div className="relative z-10 mx-auto flex h-20 max-w-[1500px] items-center justify-between gap-3 px-3 sm:px-4 md:px-6">
        <a href="/#top" className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3" aria-label="ADYAPAN School home">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f8c44f] via-[#ff7d65] to-[#b65df3] text-xs font-black lowercase text-white shadow-[0_12px_26px_rgba(234,88,12,0.28)] sm:h-14 sm:w-14 sm:text-sm">
            ady.
          </span>
          <span className="min-w-0 leading-none">
            <span className="block text-[24px] font-black tracking-tight text-[#8b2ed3] sm:text-[28px] md:text-[32px]">
              Adyapan
            </span>
            <span className="ml-1 block text-[9px] font-black uppercase tracking-[0.34em] text-[#9f6fd0] sm:text-[10px] sm:tracking-[0.42em]">
              School
            </span>
          </span>
        </a>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 rounded-full border-2 border-white/65 bg-white/36 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_12px_30px_rgba(124,58,237,0.14)] backdrop-blur-xl xl:flex 2xl:gap-3 2xl:px-5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <a
                key={item.label}
                href={item.href}
                className={`inline-flex h-12 min-w-[94px] items-center justify-center whitespace-nowrap rounded-full px-3 text-[15px] font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-white/65 2xl:h-14 2xl:min-w-[108px] 2xl:px-5 2xl:text-[17px] ${
                  active
                    ? "bg-gradient-to-r from-[#ffd84d] to-[#ff9f2f] shadow-[0_12px_24px_rgba(249,158,47,0.35)]"
                    : ""
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-2 xl:flex 2xl:gap-3">
          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                className="inline-flex h-12 max-w-[230px] items-center gap-3 rounded-full border-2 border-white bg-white/78 px-3 pr-4 text-left font-black text-slate-950 shadow-[0_10px_22px_rgba(255,255,255,0.24)] transition hover:-translate-y-0.5 hover:bg-white"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd84d] to-[#ff5b55] text-sm font-black text-slate-950">
                  {initial}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[15px] leading-4">{shortName}</span>
                  <span className="block truncate text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
                    {user.role === "admin" ? "Admin" : "Student"}
                  </span>
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-white/70 bg-white p-2 text-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
                >
                  <div className="flex items-center gap-3 border-b border-slate-100 p-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-base font-black text-white">
                      {initial}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black">{user.name}</span>
                      <span className="block truncate text-xs font-semibold text-slate-500">{user.email || "ADYAPAN learner"}</span>
                    </span>
                  </div>

                  <div className="py-2">
                    {menuItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-black transition hover:bg-blue-50 hover:text-blue-700"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </a>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl border-t border-slate-100 px-3 py-3 text-left text-sm font-black text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a
                href="/login"
                className="inline-flex h-12 min-w-[92px] items-center justify-center rounded-full border-2 border-white bg-white/72 px-5 text-[15px] font-black text-slate-950 shadow-[0_10px_22px_rgba(255,255,255,0.24)] transition hover:-translate-y-0.5 hover:bg-white 2xl:min-w-[100px] 2xl:px-6"
              >
                Login
              </a>
              <a
                href="/signup"
                className="inline-flex h-12 min-w-[102px] items-center justify-center rounded-full border-2 border-emerald-300/70 bg-gradient-to-r from-[#37e286] to-[#19c87d] px-5 text-[15px] font-black text-slate-950 shadow-[0_12px_30px_rgba(16,185,129,0.36)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(16,185,129,0.46)] 2xl:min-w-[110px] 2xl:px-6"
              >
                Sign Up
              </a>
            </>
          )}
        </div>

        <button
          className="shrink-0 rounded-full border-2 border-white bg-white/45 p-3 text-slate-950 shadow-[0_10px_22px_rgba(255,255,255,0.25)] transition hover:bg-white/75 xl:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Open navigation"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="max-h-[calc(100vh-80px)] overflow-y-auto border-t-2 border-white/40 bg-gradient-to-b from-[#eec3ef] to-[#afd7f7] px-4 py-5 shadow-[0_16px_36px_rgba(99,102,241,0.18)] backdrop-blur-xl xl:hidden">
          <div className="grid gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-full px-6 py-4 text-lg font-black text-slate-950 transition hover:bg-white/70 ${
                  isActive(item.href) ? "bg-gradient-to-r from-[#ffd84d] to-[#ff9f2f]" : "bg-white/36"
                }`}
              >
                {item.label}
              </a>
            ))}
            {user ? (
              <div className="mt-3 rounded-3xl border-2 border-white/55 bg-white/42 p-3">
                <div className="mb-3 flex items-center gap-3 px-2">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd84d] to-[#ff5b55] text-base font-black text-slate-950">
                    {initial}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-base font-black text-slate-950">{user.name}</span>
                    <span className="block truncate text-xs font-bold uppercase tracking-[0.12em] text-slate-700">
                      {user.role === "admin" ? "Admin" : "Student"}
                    </span>
                  </span>
                </div>
                <div className="grid gap-2">
                  {menuItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-2xl bg-white/76 px-4 py-3 text-base font-black text-slate-950"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </a>
                  ))}
                  <button
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-left text-base font-black text-rose-600"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border-2 border-white bg-white/78 px-4 py-3 text-center text-base font-black text-slate-950 transition hover:bg-white"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border-2 border-emerald-300/70 bg-gradient-to-r from-[#37e286] to-[#19c87d] px-4 py-3 text-center text-base font-black text-slate-950"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
