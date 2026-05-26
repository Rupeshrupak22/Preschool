"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from "recharts";

type DataItem = { name: string; value: number; color: string };

interface Props {
  data: DataItem[];
  overallScore: number;
}

const RADIAN = Math.PI / 180;

function CustomLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (cx == null || cy == null || midAngle == null || innerRadius == null || outerRadius == null || percent == null) return null;
  const cxN = Number(cx), cyN = Number(cy), midN = Number(midAngle);
  const irN = Number(innerRadius), orN = Number(outerRadius), pctN = Number(percent);
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
  const hasData = data.some((item) => item.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col rounded-3xl border-2 border-white/80 bg-white/70 p-5 shadow-[0_8px_32px_rgba(168,85,247,0.10)] backdrop-blur-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900">360 Performance</h3>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">Subject distribution by tier</p>
        </div>
        <span className="rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-black text-purple-700">
          {overallScore}% avg
        </span>
      </div>

      {hasData ? (
        <>
          <div className="relative mt-4 flex-1">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
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
                    borderRadius: "16px",
                    border: "2px solid #e9d5ff",
                    fontSize: "12px",
                    fontWeight: 600,
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(8px)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-3xl font-black text-slate-900"
              >
                {overallScore}%
              </motion.span>
              <span className="text-[10px] font-bold text-slate-400">Overall</span>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-semibold text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{item.value} subjects</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4 flex min-h-[220px] items-center justify-center rounded-2xl bg-white/60 text-sm font-semibold text-slate-500">
          No performance records yet.
        </div>
      )}
    </motion.div>
  );
}
