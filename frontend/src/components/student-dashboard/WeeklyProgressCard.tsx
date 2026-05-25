"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Star } from "lucide-react";

interface Props {
  score: number;
  consistency: number;
  classPercentile: number;
}

function AnimatedBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
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
      className="relative overflow-hidden rounded-3xl p-6 text-white"
      style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #ec4899 100%)",
        boxShadow: "0 16px 48px rgba(168,85,247,0.45)",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/8" />
      <div className="absolute right-20 bottom-6 h-20 w-20 rounded-full bg-pink-400/20" />

      {/* Floating star */}
      <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
        <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
      </div>

      <div className="relative">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Weekly Performance</p>

        {/* Score ring */}
        <div className="mt-3 flex items-end gap-2">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl font-black leading-none"
          >
            {score}
          </motion.span>
          <span className="mb-2 text-xl font-black text-white/50">/100</span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-black text-white/90">
            🔥 Great week!
          </span>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-wide">Consistency</span>
            </div>
            <p className="text-2xl font-black">{consistency}%</p>
            <div className="mt-2">
              <AnimatedBar value={consistency} color="bg-gradient-to-r from-emerald-300 to-teal-300" />
            </div>
          </div>

          <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Users className="h-3.5 w-3.5 text-yellow-300" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-wide">Class Rank</span>
            </div>
            <p className="text-2xl font-black">Top {100 - classPercentile}%</p>
            <div className="mt-2">
              <AnimatedBar value={classPercentile} color="bg-gradient-to-r from-yellow-300 to-orange-300" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
