"use client";

import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from "recharts";
import type { SkillData } from "@/lib/dashboard/dashboard-data";

interface Props {
  data: SkillData[];
}

function CustomTooltip({ active, payload }: {
  active?: boolean;
  payload?: Array<{ payload: SkillData }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-xl">
      <p className="text-xs font-black text-slate-950">{d.skill}</p>
      <p className="text-sm font-black text-purple-600">{d.value}/100</p>
    </div>
  );
}

export default function RadarSkillsChart({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.08)]"
    >
      <h3 className="text-sm font-black text-slate-950">Skill Analytics</h3>
      <p className="mt-0.5 text-xs text-slate-400">Core competency radar</p>

      <div className="mt-4 flex-1">
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fontSize: 11, fontWeight: 700, fill: "#64748b" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: "#94a3b8" }}
              tickCount={4}
            />
            <Radar
              name="Skills"
              dataKey="value"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.25}
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 2, stroke: "#fff" }}
              animationDuration={1000}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Skill Bars */}
      <div className="mt-2 space-y-2">
        {data.map((skill) => (
          <div key={skill.skill} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-[11px] font-semibold text-slate-600">{skill.skill}</span>
            <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.value}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
              />
            </div>
            <span className="w-8 text-right text-[11px] font-black text-slate-950">{skill.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
