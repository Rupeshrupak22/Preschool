"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { SubjectPerformance } from "@/lib/dashboard/dashboard-data";

interface Props {
  subjects: SubjectPerformance[];
}

const gradeColors: Record<string, string> = {
  "A+": "bg-emerald-100 text-emerald-700",
  "A": "bg-blue-100 text-blue-700",
  "B+": "bg-yellow-100 text-yellow-700",
  "B": "bg-orange-100 text-orange-700",
  "C": "bg-red-100 text-red-700",
};

const categoryColors: Record<string, string> = {
  core: "bg-blue-50 text-blue-600",
  skill: "bg-purple-50 text-purple-600",
  innovation: "bg-emerald-50 text-emerald-600",
};

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 85 ? "bg-emerald-500" : score >= 70 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-xs font-black text-slate-950">{score}</span>
    </div>
  );
}

export default function SubjectPerformanceTable({ subjects }: Props) {
  return (
    <section id="subjects">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-950">Subject Performance</h2>
        <div className="flex gap-2">
          {["core", "skill"].map((cat) => (
            <span key={cat} className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${categoryColors[cat]}`}>
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr] gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3 text-[11px] font-black uppercase tracking-wider text-slate-400">
          <span>Subject</span>
          <span>Score</span>
          <span>Grade</span>
          <span>Progress</span>
          <span>Growth</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-50">
          {subjects.length === 0 ? (
            <div className="px-5 py-6 text-sm font-semibold text-slate-500">No subject performance has been recorded yet.</div>
          ) : subjects.map((sub, i) => (
            <motion.div
              key={sub.subject}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr] items-center gap-3 px-5 py-3 transition hover:bg-slate-50"
            >
              {/* Subject */}
              <div className="flex items-center gap-2 min-w-0">
                <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase ${categoryColors[sub.category]}`}>
                  {sub.category.slice(0, 3)}
                </span>
                <span className="truncate text-sm font-semibold text-slate-950">{sub.subject}</span>
              </div>

              {/* Score */}
              <span className="text-sm font-black text-slate-950">{sub.score}</span>

              {/* Grade */}
              <span className={`inline-flex w-fit items-center rounded-lg px-2 py-0.5 text-xs font-black ${gradeColors[sub.grade] ?? "bg-slate-100 text-slate-600"}`}>
                {sub.grade}
              </span>

              {/* Progress Bar */}
              <ScoreBar score={sub.score} />

              {/* Improvement */}
              <div className="flex items-center gap-1">
                {sub.improvement > 0 ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs font-black ${sub.improvement > 0 ? "text-emerald-600" : "text-red-600"}`}>
                  +{sub.improvement}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
