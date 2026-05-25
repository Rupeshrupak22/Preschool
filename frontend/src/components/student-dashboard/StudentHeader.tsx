"use client";

import { motion } from "framer-motion";
import { Bell, Menu, Sparkles, ChevronDown } from "lucide-react";
import type { Student } from "@/lib/dashboard/dashboard-data";

interface Props {
  student: Student;
  onMenuOpen: () => void;
}

export default function StudentHeader({ student, onMenuOpen }: Props) {
  return (
    <header className="sticky top-[72px] z-30 border-b border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Left: Menu + Welcome */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={onMenuOpen}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-950 hover:text-white lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-black text-slate-950 md:text-lg">
                Welcome back, {student.name.split(" ")[0]} 👋
              </h1>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-1.5 mt-0.5"
            >
              <Sparkles className="h-3 w-3 shrink-0 text-purple-500" />
              <p className="truncate text-xs font-semibold text-purple-600">{student.aiInsight}</p>
            </motion.div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          {/* Academic Year */}
          <div className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm md:flex cursor-pointer hover:border-blue-300 transition">
            <span>{student.academicYear}</span>
            <ChevronDown className="h-3 w-3" />
          </div>

          {/* Notifications */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-blue-700 hover:text-white hover:border-blue-700">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
              5
            </span>
          </button>

          {/* Student Info */}
          <div className="hidden items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-xs font-black text-white">
              {student.avatar}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-black text-slate-950 leading-tight">{student.name}</p>
              <p className="text-[10px] font-semibold text-slate-500 leading-tight">
                {student.class} · {student.rollNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
