"use client";

import { motion } from "framer-motion";
import { MessageSquare, Cpu, Activity, Music, Lightbulb } from "lucide-react";
import type { ExtracurricularActivity } from "@/lib/dashboard/dashboard-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "message-square": MessageSquare,
  cpu: Cpu,
  activity: Activity,
  music: Music,
  lightbulb: Lightbulb,
};

const colorMap: Record<string, { gradient: string; bg: string; bar: string }> = {
  blue: { gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50", bar: "bg-blue-500" },
  purple: { gradient: "from-purple-500 to-violet-600", bg: "bg-purple-50", bar: "bg-purple-500" },
  emerald: { gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", bar: "bg-emerald-500" },
  rose: { gradient: "from-rose-500 to-pink-600", bg: "bg-rose-50", bar: "bg-rose-500" },
  yellow: { gradient: "from-yellow-500 to-orange-500", bg: "bg-yellow-50", bar: "bg-yellow-500" },
};

interface Props {
  activities: ExtracurricularActivity[];
}

export default function ExtracurricularSection({ activities }: Props) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-950">Extracurricular Activities</h2>
        <span className="text-xs font-semibold text-slate-400">{activities.length} activities</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {activities.map((act, i) => {
          const Icon = iconMap[act.icon] ?? Activity;
          const colors = colorMap[act.color] ?? colorMap.blue;

          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`flex flex-col gap-3 rounded-2xl border border-slate-100 ${colors.bg} p-4 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_8px_28px_rgba(15,23,42,0.10)]`}
            >
              {/* Icon */}
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colors.gradient} text-white shadow-md`}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Name + Score */}
              <div>
                <p className="text-sm font-black text-slate-950">{act.name}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-white/60">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${act.score}%` }}
                      transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.06 }}
                      className={`h-full rounded-full ${colors.bar}`}
                    />
                  </div>
                  <span className="text-xs font-black text-slate-950">{act.score}%</span>
                </div>
              </div>

              {/* Achievement */}
              <div className="border-t border-white/50 pt-2">
                <p className="text-[10px] font-black text-slate-700">🏆 {act.achievement}</p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-400">{act.events} events participated</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
