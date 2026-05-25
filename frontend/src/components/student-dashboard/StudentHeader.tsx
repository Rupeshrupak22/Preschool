"use client";

import { Bell, Menu, Star, ChevronDown } from "lucide-react";
import type { Student } from "@/lib/dashboard/dashboard-data";

interface Props {
  student: Student;
  onMenuOpen: () => void;
}

export default function StudentHeader({ student, onMenuOpen }: Props) {
  return (
    <header className="sticky top-20 z-30 border-b border-purple-100/60 bg-white/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(168,85,247,0.08)]">
      <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-6">
        {/* Left: mobile menu + class info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuOpen}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-200 bg-white text-purple-600 shadow-sm transition hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-2.5 py-1 text-[10px] font-black text-purple-700 sm:inline-flex items-center gap-1">
              <Star className="h-2.5 w-2.5 fill-current text-yellow-500" />
              Rank #{student.rank}
            </span>
            <span className="hidden rounded-full border border-purple-100 bg-white/70 px-2.5 py-1 text-[10px] font-bold text-slate-600 sm:inline-flex backdrop-blur">
              {student.class} · {student.section}
            </span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <div className="hidden items-center gap-1.5 rounded-xl border border-purple-100 bg-white/70 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm md:flex cursor-pointer hover:border-purple-300 transition backdrop-blur">
            <span>{student.academicYear}</span>
            <ChevronDown className="h-3 w-3" />
          </div>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-purple-100 bg-white/70 text-slate-600 shadow-sm transition hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent backdrop-blur">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-[9px] font-black text-white shadow">
              5
            </span>
          </button>

          <div className="hidden items-center gap-2.5 rounded-xl border border-purple-100 bg-white/70 px-3 py-1.5 shadow-sm sm:flex backdrop-blur">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-black text-white shadow-[0_4px_12px_rgba(168,85,247,0.35)]">
              {student.avatar}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-black text-slate-900 leading-tight">{student.name}</p>
              <p className="text-[10px] font-semibold text-slate-500 leading-tight">
                {student.rollNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
