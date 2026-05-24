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

const colorMap: Record<string, { bg: string; text: string; ring: string; trend: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-200", trend: "text-blue-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-200", trend: "text-purple-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-200", trend: "text-emerald-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", ring: "ring-orange-200", trend: "text-orange-600" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-600", ring: "ring-yellow-200", trend: "text-yellow-600" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", ring: "ring-rose-200", trend: "text-rose-600" },
};

interface Props {
  cards: MetricCard[];
}

export default function MetricCards({ cards }: Props) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-950">Performance Overview</h2>
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
              whileHover={{ y: -3, scale: 1.02 }}
              className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_8px_32px_rgba(15,23,42,0.10)]"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${colors.bg} ${colors.ring}`}>
                <Icon className={`h-4 w-4 ${colors.text}`} />
              </div>

              <div>
                <p className="text-2xl font-black text-slate-950 leading-none">{card.value}</p>
                <p className="mt-1 text-[11px] font-semibold text-slate-500">{card.title}</p>
              </div>

              {card.trend !== 0 && (
                <div className={`flex items-center gap-1 text-[10px] font-bold ${colors.trend}`}>
                  <TrendingUp className="h-3 w-3" />
                  <span>+{card.trend}% this month</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
