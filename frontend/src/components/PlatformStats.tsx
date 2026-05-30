"use client";

import { motion } from "framer-motion";
import { Users, Zap, TrendingUp } from "lucide-react";

const stats = [
  {
    value: "Growing",
    label: "Active Learners",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    value: "Building",
    label: "Learning Progress",
    icon: Zap,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    value: "Quality",
    label: "Education Focus",
    icon: TrendingUp,
    gradient: "from-emerald-500 to-teal-500"
  }
];

export default function PlatformStats() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center text-center"
        >
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg mb-3`}>
            <stat.icon className="h-8 w-8" />
          </div>
          <div className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
            {stat.value}
          </div>
          <div className="text-sm font-semibold text-slate-600">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}