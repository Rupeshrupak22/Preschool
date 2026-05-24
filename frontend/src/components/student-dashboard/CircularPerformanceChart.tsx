"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { circularPerformanceData } from "@/lib/dashboard/dashboard-data";

type DataItem = { name: string; value: number; color: string };

interface Props {
  data: DataItem[];
  overallScore: number;
}

const RADIAN = Math.PI / 180;

import type { PieLabelRenderProps } from "recharts";

function CustomLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (
    cx == null || cy == null || midAngle == null ||
    innerRadius == null || outerRadius == null || percent == null
  ) return null;
  const cxN = Number(cx);
  const cyN = Number(cy);
  const midN = Number(midAngle);
  const irN = Number(innerRadius);
  const orN = Number(outerRadius);
  const pctN = Number(percent);
  const radius = irN + (orN - irN) * 0.5;
  const x = cxN + radius * Math.cos(-midN * RADIAN);
  const y = cyN + radius * Math.sin(-midN * RADIAN);
  if (pctN < 0.08) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(pctN * 100).toFixed(0)}%`}
    </text>
  );
}

export default function CircularPerformanceChart({ data, overallScore }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.08)]"
    >
      <h3 className="text-sm font-black text-slate-950">360° Performance</h3>
      <p className="mt-0.5 text-xs text-slate-400">Subject distribution by performance tier</p>

      <div className="relative mt-4 flex-1">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={CustomLabel}
              animationBegin={200}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} subjects`, String(name)]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
                fontWeight: 600,
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Score */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-3xl font-black text-slate-950"
          >
            {overallScore}%
          </motion.span>
          <span className="text-[10px] font-bold text-slate-400">Overall</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs font-semibold text-slate-600">{item.name}</span>
            </div>
            <span className="text-xs font-black text-slate-950">{item.value} subjects</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
