"use client";

import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

// Main permanent navbar for every Next.js page. Keep page-level navbars out of routes.
const navItems = [
  { label: "Home", href: "/#top" },
  { label: "Overview", href: "/#overview" },
  { label: "Mentor", href: "/#mentor" },
  { label: "My App", href: "/dashboard" },
  { label: "LMS", href: "/dashboard" },
  { label: "About Us", href: "/#about" }
];

export default function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className="fixed left-0 right-0 top-0 z-[100] bg-gradient-to-r from-purple-400 via-pink-300 to-blue-300 shadow-[0_8px_32px_rgba(168,85,247,0.3)] backdrop-blur-md">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-10 w-3 h-3 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="absolute top-4 right-20 w-2 h-2 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
        <div className="absolute top-3 left-1/3 w-2.5 h-2.5 bg-red-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
      </div>

      <div className="mx-auto flex h-[80px] max-w-[1500px] items-center justify-between gap-5 px-5 md:px-8 relative z-10">
        {/* Logo with playful animation */}
        <a href="/#top" className="flex shrink-0 items-center gap-3 group" aria-label="ADYAPAN School home">
          <div className="relative">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 text-sm font-black lowercase text-white shadow-[0_10px_24px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform duration-300 animate-pulse">
              ady.
            </span>
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <span className="leading-none">
            <span className="block text-3xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">Adyapan</span>
            <span className="ml-1 block text-[10px] font-black uppercase tracking-[0.42em] bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">School</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden flex-1 items-center justify-center gap-2 rounded-full bg-white/40 backdrop-blur-md px-6 py-3 shadow-[0_10px_35px_rgba(168,85,247,0.2)] xl:flex border-2 border-white/60">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`relative inline-flex h-12 min-w-[100px] items-center justify-center whitespace-nowrap rounded-full px-4 text-[18px] font-bold transition-all duration-300 transform ${
                hoveredItem === item.label
                  ? "bg-gradient-to-r from-yellow-300 to-orange-400 text-slate-900 scale-110 shadow-[0_8px_20px_rgba(249,115,22,0.4)] -translate-y-1"
                  : "text-slate-900 hover:scale-105 hover:-translate-y-0.5"
              }`}
            >
              <span className="drop-shadow-lg">{item.label}</span>
              {hoveredItem === item.label && (
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 animate-pulse" />
              )}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <a
            href="/login"
            className="inline-flex h-12 min-w-[100px] items-center justify-center whitespace-nowrap rounded-full bg-white/80 backdrop-blur px-6 text-[16px] font-bold text-slate-900 shadow-[0_8px_20px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:bg-white hover:shadow-[0_12px_28px_rgba(255,255,255,0.5)] border-2 border-white"
          >
            Login
          </a>
          <a
            href="/signup"
            className="inline-flex h-12 min-w-[110px] items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-green-400 to-emerald-500 px-6 text-[16px] font-bold text-slate-900 shadow-[0_10px_28px_rgba(34,197,94,0.4)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(34,197,94,0.6)] border-2 border-white/50"
          >
            Sign Up
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-full border-2 border-white bg-white/40 backdrop-blur p-2.5 text-white shadow-[0_8px_20px_rgba(255,255,255,0.3)] transition-all duration-300 hover:bg-white/60 hover:scale-110 xl:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Open navigation"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t-2 border-white/40 bg-gradient-to-b from-purple-300 via-pink-200 to-blue-200 px-4 py-6 xl:hidden backdrop-blur-md">
          <div className="grid gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-full px-6 py-4 text-xl font-bold text-slate-900 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_20px_rgba(168,85,247,0.4)] transform hover:-translate-y-1 drop-shadow-lg"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-full px-4 py-3 text-center text-lg font-bold text-slate-900 bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_20px_rgba(255,255,255,0.4)] border-2 border-white"
              >
                Login
              </a>
              <a
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="rounded-full px-4 py-3 text-center text-lg font-bold text-slate-900 bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_24px_rgba(34,197,94,0.4)] border-2 border-white/50"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
