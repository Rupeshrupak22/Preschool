"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

// Main permanent navbar for every Next.js page. Keep page-level navbars out of routes.
const navItems = [
  { label: "Home", href: "/#top" },
  { label: "Coding", href: "/#curriculum" },
  { label: "Robotics & AI", href: "/#curriculum" },
  { label: "VR/AR Lab", href: "/#projects" },
  { label: "LMS", href: "/dashboard" },
  { label: "Our App", href: "/our.html" },
  { label: "Books", href: "/#footer" }
];

export default function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-[100] border-b border-blue-100 bg-white/98 shadow-[0_8px_28px_rgba(37,99,235,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between gap-5 px-5 md:px-8">
        <a href="/#top" className="flex shrink-0 items-center gap-3" aria-label="ADYAPAN School home">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 via-cyan-600 to-blue-950 text-sm font-black lowercase text-white shadow-[0_10px_24px_rgba(13,148,136,0.22)]">
            ady.
          </span>
          <span className="leading-none">
            <span className="block text-3xl font-black tracking-tight text-slate-950">Adyapan</span>
            <span className="ml-1 block text-[10px] font-black uppercase tracking-[0.42em] text-slate-500">School</span>
          </span>
        </a>

        <div className="hidden flex-1 items-center justify-center gap-1.5 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-[0_10px_35px_rgba(37,99,235,0.12)] xl:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative inline-flex h-11 min-w-[92px] items-center justify-center whitespace-nowrap rounded-full px-4 text-[15px] font-black text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:text-white hover:shadow-[0_12px_24px_rgba(37,99,235,0.24)]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <a
            href="/login"
            className="inline-flex h-12 min-w-[92px] items-center justify-center whitespace-nowrap rounded-xl border border-slate-300 bg-white px-5 text-[15px] font-black text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-blue-700 hover:bg-blue-700 hover:text-white"
          >
            Login
          </a>
          <a
            href="/signup"
            className="inline-flex h-12 min-w-[96px] items-center justify-center whitespace-nowrap rounded-xl bg-rose-600 px-5 text-[15px] font-black text-white shadow-[0_12px_26px_rgba(225,29,72,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-800"
          >
            Sign Up
          </a>
        </div>

        <button
          className="rounded-xl border border-blue-200 bg-white p-2 text-slate-950 shadow-[0_10px_28px_rgba(37,99,235,0.12)] transition hover:bg-blue-700 hover:text-white xl:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Open navigation"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 xl:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-black text-slate-950 transition hover:bg-blue-700 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <a
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-center text-base font-black text-slate-950 transition hover:bg-blue-700 hover:text-white"
              >
                Login
              </a>
              <a
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-rose-600 px-4 py-3 text-center text-base font-black text-white transition hover:bg-blue-800"
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
