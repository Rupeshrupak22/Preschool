"use client";

import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import type { PerformanceTrend } from "@/lib/dashboard/dashboard-data";

interface Props {
  data: PerformanceTrend[];
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-xl">
      <p className="mb-2 text-xs font-black text-slate-950">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-black text-slate-950">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function PerformanceTrendChart({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-950">Performance Trend</h3>
          <p className="mt-0.5 text-xs text-slate-400">Jan – Jun 2026 monthly growth</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <span className="flex items-center gap-1">
            <span className="h-2 w-4 rounded-full bg-blue-600" />
            <span className="text-slate-500">You</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-4 rounded-full bg-slate-300" />
            <span className="text-slate-500">Class Avg</span>
          </span>
        </div>
      </div>

      <div className="mt-4 flex-1">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[55, 95]}
              tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="classAvg"
              name="Class Avg"
              stroke="#94a3b8"
              strokeWidth={2}
              fill="url(#avgGrad)"
              dot={false}
              animationDuration={1200}
            />
            <Area
              type="monotone"
              dataKey="score"
              name="Your Score"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#scoreGrad)"
              dot={{ fill: "#3b82f6", r: 4, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Growth indicator */}
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2">
        <span className="text-xs font-black text-blue-700">+17 points</span>
        <span className="text-xs text-slate-500">growth from Jan to Jun 2026</span>
      </div>
    </motion.div>
  );
}
