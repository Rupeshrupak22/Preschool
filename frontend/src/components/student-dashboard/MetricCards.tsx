"use client";

import { motion } from "framer-motion";
import {
  TrendingUp, BarChart2, Calendar, Book, Star, Trophy,
} from "lucide-react";
import type { MetricCard } from "@/lib/dashboard/dashboard-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "trending-up": TrendingUp,
  "bar-chart-2": BarChart2,
  "calendar": Calendar,
  "book": Book,
  "star": Star,
  "trophy": Trophy,
};

const colorMap: Record<string, { gradient: string; bg: string; text: string; glow: string }> = {
  blue:    { gradient: "from-blue-500 to-indigo-500",   bg: "bg-blue-50",    text: "text-blue-600",    glow: "shadow-[0_8px_24px_rgba(59,130,246,0.25)]" },
  purple:  { gradient: "from-purple-500 to-violet-500", bg: "bg-purple-50",  text: "text-purple-600",  glow: "shadow-[0_8px_24px_rgba(139,92,246,0.25)]" },
  emerald: { gradient: "from-emerald-500 to-teal-500",  bg: "bg-emerald-50", text: "text-emerald-600", glow: "shadow-[0_8px_24px_rgba(16,185,129,0.25)]" },
  orange:  { gradient: "from-orange-500 to-amber-500",  bg: "bg-orange-50",  text: "text-orange-600",  glow: "shadow-[0_8px_24px_rgba(249,115,22,0.25)]" },
  yellow:  { gradient: "from-yellow-500 to-orange-400", bg: "bg-yellow-50",  text: "text-yellow-600",  glow: "shadow-[0_8px_24px_rgba(234,179,8,0.25)]" },
  rose:    { gradient: "from-rose-500 to-pink-500",     bg: "bg-rose-50",    text: "text-rose-600",    glow: "shadow-[0_8px_24px_rgba(244,63,94,0.25)]" },
};

interface Props {
  cards: MetricCard[];
}

export default function MetricCards({ cards }: Props) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Performance Overview</h2>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">Your key academic metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card, i) => {
          const Icon = iconMap[card.icon] ?? TrendingUp;
          const colors = colorMap[card.color] ?? colorMap.blue;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`flex flex-col gap-3 rounded-3xl border-2 border-white/80 bg-white/70 p-5 backdrop-blur-sm transition-all hover:border-purple-200 hover:bg-white ${colors.glow}`}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.gradient} text-white shadow-md`}>
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-2xl font-black text-slate-900 leading-none">{card.value}</p>
                <p className="mt-1.5 text-[11px] font-bold text-slate-500">{card.title}</p>
              </div>

              {card.trend !== 0 && (
                <div className={`flex items-center gap-1 rounded-full bg-gradient-to-r ${colors.gradient} px-2.5 py-1 text-[10px] font-black text-white w-fit`}>
                  <TrendingUp className="h-2.5 w-2.5" />
                  <span>+{card.trend}%</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
