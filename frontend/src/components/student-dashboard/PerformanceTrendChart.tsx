"use client";

import { motion } from "framer-motion";
import {
  Tooltip, ResponsiveContainer, Area, AreaChart, XAxis, YAxis, CartesianGrid,
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
    <div className="rounded-2xl border-2 border-purple-100 bg-white/95 p-3 shadow-xl backdrop-blur">
      <p className="mb-2 text-xs font-black text-slate-900">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-black text-slate-900">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function PerformanceTrendChart({ data }: Props) {
  const hasData = data.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col rounded-3xl border-2 border-white/80 bg-white/70 p-5 shadow-[0_8px_32px_rgba(168,85,247,0.10)] backdrop-blur-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900">Performance Trend</h3>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">Live growth from recorded tests</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <span className="text-slate-500">You</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-4 rounded-full bg-slate-200" />
            <span className="text-slate-500">Class Avg</span>
          </span>
        </div>
      </div>

      {hasData ? (
        <>
          <div className="mt-4 flex-1">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
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
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="classAvg"
                  name="Class Avg"
                  stroke="#cbd5e1"
                  strokeWidth={2}
                  fill="url(#avgGrad)"
                  dot={false}
                  animationDuration={1200}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  name="Your Score"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  fill="url(#scoreGrad)"
                  dot={{ fill: "#a855f7", r: 4, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#a855f7", stroke: "#fff", strokeWidth: 2 }}
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2.5">
            <span className="text-xs font-black text-purple-700">Live trend</span>
            <span className="text-xs text-slate-500">based on recorded tests</span>
          </div>
        </>
      ) : (
        <div className="mt-4 flex min-h-[240px] items-center justify-center rounded-2xl bg-white/60 text-sm font-semibold text-slate-500">
          No test trend data yet.
        </div>
      )}
    </motion.div>
  );
}
