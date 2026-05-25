"use client";

import { motion } from "framer-motion";
import {
  Code2, Flame, Star, Trophy, Brain, CalendarCheck, Lightbulb, Users,
} from "lucide-react";
import type { Achievement } from "@/lib/dashboard/dashboard-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "code-2": Code2,
  flame: Flame,
  star: Star,
  trophy: Trophy,
  brain: Brain,
  "calendar-check": CalendarCheck,
  lightbulb: Lightbulb,
  users: Users,
};

const colorMap: Record<string, { gradient: string; glow: string; ring: string }> = {
  blue: { gradient: "from-blue-500 to-indigo-600", glow: "shadow-[0_4px_20px_rgba(59,130,246,0.4)]", ring: "ring-blue-200" },
  orange: { gradient: "from-orange-500 to-amber-600", glow: "shadow-[0_4px_20px_rgba(249,115,22,0.4)]", ring: "ring-orange-200" },
  yellow: { gradient: "from-yellow-500 to-orange-500", glow: "shadow-[0_4px_20px_rgba(234,179,8,0.4)]", ring: "ring-yellow-200" },
  purple: { gradient: "from-purple-500 to-violet-600", glow: "shadow-[0_4px_20px_rgba(139,92,246,0.4)]", ring: "ring-purple-200" },
  fuchsia: { gradient: "from-fuchsia-500 to-purple-600", glow: "shadow-[0_4px_20px_rgba(217,70,239,0.4)]", ring: "ring-fuchsia-200" },
  emerald: { gradient: "from-emerald-500 to-teal-600", glow: "shadow-[0_4px_20px_rgba(16,185,129,0.4)]", ring: "ring-emerald-200" },
  cyan: { gradient: "from-cyan-500 to-sky-600", glow: "shadow-[0_4px_20px_rgba(6,182,212,0.4)]", ring: "ring-cyan-200" },
  rose: { gradient: "from-rose-500 to-pink-600", glow: "shadow-[0_4px_20px_rgba(244,63,94,0.4)]", ring: "ring-rose-200" },
};

interface Props {
  achievements: Achievement[];
}

export default function AchievementsPanel({ achievements }: Props) {
  const earned = achievements.filter((a) => a.earned);

  return (
    <section id="achievements">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-950">Achievements & Badges</h2>
        <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-[10px] font-black text-yellow-700">
          {earned.length} Earned
        </span>
      </div>

      <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">Earned Badges</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {earned.map((ach, i) => {
          const Icon = iconMap[ach.icon] ?? Star;
          const colors = colorMap[ach.color] ?? colorMap.blue;

          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
              whileHover={{ y: -4, scale: 1.05 }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_8px_28px_rgba(15,23,42,0.10)]"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.gradient} text-white ${colors.glow}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-950">{ach.title}</p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-400 leading-snug">{ach.description}</p>
                {ach.date && (
                  <p className="mt-1 text-[9px] font-bold text-slate-300">{ach.date}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
