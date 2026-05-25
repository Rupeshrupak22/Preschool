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

const colorMap: Record<string, { gradient: string; glow: string; bg: string }> = {
  blue:    { gradient: "from-blue-500 to-indigo-500",   glow: "shadow-[0_8px_24px_rgba(59,130,246,0.4)]",   bg: "bg-blue-50" },
  orange:  { gradient: "from-orange-500 to-amber-500",  glow: "shadow-[0_8px_24px_rgba(249,115,22,0.4)]",   bg: "bg-orange-50" },
  yellow:  { gradient: "from-yellow-400 to-orange-400", glow: "shadow-[0_8px_24px_rgba(234,179,8,0.4)]",    bg: "bg-yellow-50" },
  purple:  { gradient: "from-purple-500 to-violet-500", glow: "shadow-[0_8px_24px_rgba(139,92,246,0.4)]",   bg: "bg-purple-50" },
  fuchsia: { gradient: "from-fuchsia-500 to-pink-500",  glow: "shadow-[0_8px_24px_rgba(217,70,239,0.4)]",   bg: "bg-fuchsia-50" },
  emerald: { gradient: "from-emerald-500 to-teal-500",  glow: "shadow-[0_8px_24px_rgba(16,185,129,0.4)]",   bg: "bg-emerald-50" },
  cyan:    { gradient: "from-cyan-500 to-sky-500",      glow: "shadow-[0_8px_24px_rgba(6,182,212,0.4)]",    bg: "bg-cyan-50" },
  rose:    { gradient: "from-rose-500 to-pink-500",     glow: "shadow-[0_8px_24px_rgba(244,63,94,0.4)]",    bg: "bg-rose-50" },
};

interface Props {
  achievements: Achievement[];
}

export default function AchievementsPanel({ achievements }: Props) {
  const earned = achievements.filter((a) => a.earned);

  return (
    <section id="achievements">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Achievements & Badges</h2>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">Your earned trophies</p>
        </div>
        <span className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 text-xs font-black text-white shadow-[0_4px_16px_rgba(234,179,8,0.35)]">
          🏆 {earned.length} Earned
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {earned.map((ach, i) => {
          const Icon = iconMap[ach.icon] ?? Star;
          const colors = colorMap[ach.color] ?? colorMap.blue;

          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
              whileHover={{ y: -6, scale: 1.05 }}
              className={`flex flex-col items-center gap-3 rounded-3xl border-2 border-white/80 ${colors.bg} p-5 text-center shadow-[0_4px_20px_rgba(168,85,247,0.08)] transition-all hover:border-purple-200 hover:shadow-[0_12px_36px_rgba(168,85,247,0.18)]`}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.gradient} text-white ${colors.glow}`}>
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">{ach.title}</p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-500 leading-snug">{ach.description}</p>
                {ach.date && (
                  <p className="mt-1.5 rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-black text-slate-400 inline-block">{ach.date}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
