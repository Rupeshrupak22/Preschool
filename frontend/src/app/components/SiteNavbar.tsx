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
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 md:px-10">
        <a href="/#top" className="flex items-center gap-3" aria-label="ADYAPAN School home">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 via-cyan-600 to-blue-950 text-sm font-black lowercase text-white shadow-[0_10px_24px_rgba(13,148,136,0.22)]">
            ady.
          </span>
          <span className="leading-none">
            <span className="block text-3xl font-black tracking-tight text-slate-950">Adyapan</span>
            <span className="ml-1 block text-[10px] font-black uppercase tracking-[0.42em] text-slate-500">School</span>
          </span>
        </a>

        <div className="hidden items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-[0_10px_35px_rgba(37,99,235,0.12)] md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative rounded-full px-5 py-2.5 text-base font-black text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:text-white hover:shadow-[0_12px_24px_rgba(37,99,235,0.24)]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          className="rounded-xl border border-blue-200 bg-white p-2 text-slate-950 shadow-[0_10px_28px_rgba(37,99,235,0.12)] transition hover:bg-blue-700 hover:text-white md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Open navigation"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
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
          </div>
        </div>
      )}
    </nav>
  );
}
