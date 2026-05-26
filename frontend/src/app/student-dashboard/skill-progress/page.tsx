"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, Star } from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";
import RadarSkillsChart from "@/components/student-dashboard/RadarSkillsChart";
import { useDashboardData } from "@/lib/dashboard/use-dashboard-data";

export default function SkillProgressPage() {
  const data = useDashboardData();
  const skillCards = data.skillsData.map((skill, index) => ({
    title: skill.skill,
    score: skill.value,
    level: skill.value >= 85 ? "Advanced" : skill.value >= 60 ? "Intermediate" : "Beginner",
    color: ["from-blue-500 to-indigo-600", "from-cyan-500 to-blue-600", "from-purple-500 to-violet-600"][index % 3],
    bar: ["bg-blue-500", "bg-cyan-500", "bg-purple-500"][index % 3],
  }));

  return (
    <DashboardLayout activeSection="/student-dashboard/skill-progress">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Skill Progress</h1>
          <p className="mt-1 text-sm text-slate-400">Track your core competency growth</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <RadarSkillsChart data={data.skillsData} />

          <div className="grid gap-3 sm:grid-cols-2">
            {skillCards.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-5 text-sm font-semibold text-slate-500 shadow-[0_4px_16px_rgba(15,23,42,0.06)] sm:col-span-2">
                No skill progress has been recorded yet.
              </div>
            ) : skillCards.map((skill, i) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3 }}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${skill.color} text-white shadow-sm`}>
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600">
                    {skill.level}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-950">{skill.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.score}%` }}
                        transition={{ duration: 0.9, delay: i * 0.07 + 0.3 }}
                        className={`h-full rounded-full ${skill.bar}`}
                      />
                    </div>
                    <span className="text-xs font-black text-slate-950">{skill.score}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.floor(skill.score / 20) }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
