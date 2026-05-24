"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, BarChart3 } from "lucide-react";

interface Props {
  score: number;
  consistency: number;
  classPercentile: number;
}

function AnimatedBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

export default function WeeklyProgressCard({ score, consistency, classPercentile }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 p-6 shadow-[0_8px_40px_rgba(99,102,241,0.35)] text-white"
    >
      {/* Background decoration */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
      <div className="absolute right-16 bottom-4 h-20 w-20 rounded-full bg-purple-500/20" />

      {/* Floating icon */}
      <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
        <BarChart3 className="h-5 w-5 text-white" />
      </div>

      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-widest text-white/60">Weekly Performance</p>

        {/* Score */}
        <div className="mt-3 flex items-end gap-2">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl font-black leading-none"
          >
            {score}
          </motion.span>
          <span className="mb-1 text-xl font-black text-white/60">/100</span>
        </div>



        {/* Stats Grid — 2 tiles only */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wide">Consistency</span>
            </div>
            <p className="text-2xl font-black">{consistency}%</p>
            <AnimatedBar value={consistency} color="bg-emerald-400" />
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Users className="h-3.5 w-3.5 text-blue-300" />
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wide">Class Rank</span>
            </div>
            <p className="text-2xl font-black">Top {100 - classPercentile}%</p>
            <AnimatedBar value={classPercentile} color="bg-blue-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
