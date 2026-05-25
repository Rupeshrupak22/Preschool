"use client";

import { motion } from "framer-motion";
import {
  Brain, Code2, Rocket, TrendingUp, Mic, Users, Palette, Lightbulb,
} from "lucide-react";
import type { FutureSkill } from "@/lib/dashboard/dashboard-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  brain: Brain,
  "code-2": Code2,
  rocket: Rocket,
  "trending-up": TrendingUp,
  mic: Mic,
  users: Users,
  palette: Palette,
  lightbulb: Lightbulb,
};

const colorMap: Record<string, { gradient: string; ring: string; bar: string; badge: string }> = {
  purple: { gradient: "from-purple-500 to-violet-600", ring: "ring-purple-200", bar: "bg-purple-500", badge: "bg-purple-100 text-purple-700" },
  blue: { gradient: "from-blue-500 to-indigo-600", ring: "ring-blue-200", bar: "bg-blue-500", badge: "bg-blue-100 text-blue-700" },
  orange: { gradient: "from-orange-500 to-amber-600", ring: "ring-orange-200", bar: "bg-orange-500", badge: "bg-orange-100 text-orange-700" },
  emerald: { gradient: "from-emerald-500 to-teal-600", ring: "ring-emerald-200", bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
  rose: { gradient: "from-rose-500 to-pink-600", ring: "ring-rose-200", bar: "bg-rose-500", badge: "bg-rose-100 text-rose-700" },
  yellow: { gradient: "from-yellow-500 to-orange-500", ring: "ring-yellow-200", bar: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-700" },
  fuchsia: { gradient: "from-fuchsia-500 to-purple-600", ring: "ring-fuchsia-200", bar: "bg-fuchsia-500", badge: "bg-fuchsia-100 text-fuchsia-700" },
  cyan: { gradient: "from-cyan-500 to-sky-600", ring: "ring-cyan-200", bar: "bg-cyan-500", badge: "bg-cyan-100 text-cyan-700" },
};

interface Props {
  skills: FutureSkill[];
}

export default function FutureSkillsSection({ skills }: Props) {
  return (
    <section id="skills">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-950">Future-Ready Skills</h2>
        <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-black text-purple-700">
          8 Tracks
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {skills.map((skill, i) => {
          const Icon = iconMap[skill.icon] ?? Brain;
          const colors = colorMap[skill.color] ?? colorMap.purple;

          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_8px_28px_rgba(15,23,42,0.10)]"
            >
              {/* Icon + Level */}
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colors.gradient} text-white shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${colors.badge}`}>
                  {skill.level}
                </span>
              </div>

              {/* Title + Progress */}
              <div>
                <p className="text-sm font-black text-slate-950">{skill.title}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress}%` }}
                      transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.05 }}
                      className={`h-full rounded-full ${colors.bar}`}
                    />
                  </div>
                  <span className="text-xs font-black text-slate-950">{skill.progress}%</span>
                </div>
              </div>

              {/* Badges + Milestone */}
              <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(skill.badges, 5) }).map((_, j) => (
                    <span key={j} className="text-yellow-400 text-xs">★</span>
                  ))}
                  <span className="text-[10px] font-semibold text-slate-400 ml-1">{skill.badges} badges</span>
                </div>
              </div>

              <p className="text-[10px] font-semibold text-slate-400 leading-snug">
                Next: <span className="font-bold text-slate-600">{skill.nextMilestone}</span>
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
