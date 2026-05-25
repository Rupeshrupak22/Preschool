"use client";

import { motion, type Variants } from "framer-motion";
import {
  CalendarCheck, BookOpen, Video, FileText,
  ClipboardCheck, PenTool, Award, Zap, ArrowRight,
} from "lucide-react";
import type { QuickAccessCard } from "@/lib/dashboard/dashboard-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "calendar-check": CalendarCheck,
  "book-open": BookOpen,
  "video": Video,
  "file-text": FileText,
  "clipboard-list": ClipboardCheck,
  "pen-tool": PenTool,
  "award": Award,
  "zap": Zap,
};

interface Props {
  cards: QuickAccessCard[];
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function QuickAccessGrid({ cards }: Props) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-950">Quick Access</h2>
        <span className="text-xs font-semibold text-slate-400">8 modules</span>
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
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border border-white/60 bg-white p-4 text-center shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_8px_32px_rgba(15,23,42,0.14)]"
            >
              {/* Gradient bg on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

              {/* Badge */}
              {card.badge && (
                <span
                  className={`absolute right-2 top-2 z-10 rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                    card.badge === "LIVE"
                      ? "animate-pulse bg-rose-500 text-white"
                      : "bg-slate-950 text-white"
                  }`}
                >
                  {card.badge}
                </span>
              )}

              {/* Icon */}
              <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Text */}
              <div className="relative z-10">
                <p className="text-xs font-black text-slate-950 transition-colors group-hover:text-white">
                  {card.title}
                </p>
                <p className="mt-0.5 text-lg font-black leading-none text-slate-950 transition-colors group-hover:text-white">
                  {card.stat}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 transition-colors group-hover:text-white/70">
                  {card.statLabel}
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight className="relative z-10 h-3 w-3 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-white" />
            </motion.a>
          );
        })}
      </motion.div>
    </section>
  );
}
