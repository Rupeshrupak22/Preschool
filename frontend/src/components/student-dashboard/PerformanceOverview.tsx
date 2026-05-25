"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, CheckCircle2, BarChart3, Zap, ExternalLink } from "lucide-react";

interface Metric {
  label: string;
  value: string;
  percent: number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  ring: string;
  glow: string;
  trend: string;
}

const metrics: Metric[] = [
  {
    label: "Overall Score",
    value: "86%",
    percent: 86,
    icon: BarChart3,
    gradient: "from-blue-500 to-indigo-500",
    ring: "stroke-blue-500",
    glow: "shadow-[0_8px_28px_rgba(59,130,246,0.3)]",
    trend: "+5%",
  },
  {
    label: "Consistency",
    value: "72%",
    percent: 72,
    icon: Zap,
    gradient: "from-purple-500 to-violet-500",
    ring: "stroke-purple-500",
    glow: "shadow-[0_8px_28px_rgba(139,92,246,0.3)]",
    trend: "+3%",
  },
  {
    label: "Accuracy",
    value: "91%",
    percent: 91,
    icon: Target,
    gradient: "from-emerald-500 to-teal-500",
    ring: "stroke-emerald-500",
    glow: "shadow-[0_8px_28px_rgba(16,185,129,0.3)]",
    trend: "+8%",
  },
  {
    label: "Attendance",
    value: "94%",
    percent: 94,
    icon: CheckCircle2,
    gradient: "from-rose-500 to-pink-500",
    ring: "stroke-rose-500",
    glow: "shadow-[0_8px_28px_rgba(244,63,94,0.3)]",
    trend: "+2%",
  },
];

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function RingChart({ percent, gradient, ring }: { percent: number; gradient: string; ring: string }) {
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
      {/* Track */}
      <circle cx="48" cy="48" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100" />
      {/* Progress */}
      <motion.circle
        cx="48"
        cy="48"
        r={RADIUS}
        fill="none"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        initial={{ strokeDashoffset: CIRCUMFERENCE }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        className={ring}
      />
    </svg>
  );
}

export default function PerformanceOverview() {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Performance Overview</h2>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">Your academic progress this month</p>
        </div>
        <a
          href="/student-dashboard/skill-progress"
          className="flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-black text-purple-700 transition hover:bg-purple-100"
        >
          View Detailed Report <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl border-2 border-white/80 bg-white/70 p-5 text-center backdrop-blur-sm transition-all hover:border-purple-200 ${metric.glow}`}
            >
              {/* Soft gradient tint top-right */}
              <div className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${metric.gradient} opacity-10`} />

              {/* Ring chart */}
              <div className="relative flex items-center justify-center">
                <RingChart percent={metric.percent} gradient={metric.gradient} ring={metric.ring} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-slate-900 leading-none">{metric.value}</span>
                </div>
              </div>

              {/* Label + icon */}
              <div>
                <div className={`mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br ${metric.gradient} text-white shadow-sm`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs font-black text-slate-900">{metric.label}</p>
                <span className="mt-1 inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                  <TrendingUp className="h-2.5 w-2.5" />
                  {metric.trend}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly goal bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4 flex items-center gap-4 rounded-3xl border-2 border-white/80 bg-white/70 px-5 py-4 backdrop-blur-sm"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_4px_16px_rgba(251,146,60,0.35)]">
          <Target className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-black text-slate-900">Weekly Goal Progress</p>
            <span className="text-xs font-black text-amber-600">78 / 100 pts</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "78%" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
            />
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
          22 pts to go 🎯
        </span>
      </motion.div>
    </section>
  );
}
