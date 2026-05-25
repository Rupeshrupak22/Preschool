"use client";

import { motion, type Variants } from "framer-motion";
import {
  CalendarCheck, BookOpen, Video, FileText,
  PenTool, Zap, ArrowRight, Gamepad2, HelpCircle, PlayCircle,
} from "lucide-react";
import type { QuickAccessCard } from "@/lib/dashboard/dashboard-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "calendar-check": CalendarCheck,
  "book-open":      BookOpen,
  "video":          Video,
  "file-text":      FileText,
  "pen-tool":       PenTool,
  "zap":            Zap,
  "gamepad-2":      Gamepad2,
  "help-circle":    HelpCircle,
  "play-circle":    PlayCircle,
};

interface Props {
  cards: QuickAccessCard[];
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function QuickAccessGrid({ cards }: Props) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Quick Access</h2>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">Jump to any module instantly</p>
        </div>
        <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-black text-purple-700">
          8 modules
        </span>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {cards.map((card) => {
          const Icon = iconMap[card.icon] ?? Zap;
          return (
            <motion.a
              key={card.id}
              href={card.href}
              variants={item}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl border-2 border-white/80 bg-white/70 p-5 text-center shadow-[0_8px_32px_rgba(168,85,247,0.10)] backdrop-blur-sm transition-all hover:border-purple-200 hover:shadow-[0_16px_48px_rgba(168,85,247,0.22)]"
            >
              {/* Hover gradient fill */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-3xl`} />

              {/* Badge */}
              {card.badge && (
                <span
                  className={`absolute right-2.5 top-2.5 z-10 rounded-full px-2 py-0.5 text-[9px] font-black shadow ${
                    card.badge === "LIVE"
                      ? "animate-pulse bg-rose-500 text-white"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  }`}
                >
                  {card.badge}
                </span>
              )}

              {/* Icon */}
              <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-[0_6px_20px_rgba(168,85,247,0.3)] transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_28px_rgba(255,255,255,0.3)]`}>
                <Icon className="h-6 w-6" />
              </div>

              {/* Text */}
              <div className="relative z-10">
                <p className="text-xs font-black text-slate-900 transition-colors group-hover:text-white">
                  {card.title}
                </p>
                <p className="mt-0.5 text-xl font-black leading-none text-slate-900 transition-colors group-hover:text-white">
                  {card.stat}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-400 transition-colors group-hover:text-white/80">
                  {card.statLabel}
                </p>
              </div>

              <ArrowRight className="relative z-10 h-3.5 w-3.5 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-white" />
            </motion.a>
          );
        })}
      </motion.div>
    </section>
  );
}
