"use client";

import { motion } from "framer-motion";
import { RotateCcw, Clock, ChevronRight } from "lucide-react";
import type { TestResult, UpcomingQuiz } from "@/lib/dashboard/dashboard-data";

interface Props {
  results: TestResult[];
  upcoming: UpcomingQuiz[];
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  excellent: { label: "Excellent", color: "text-emerald-700", bg: "bg-emerald-100" },
  good: { label: "Good", color: "text-blue-700", bg: "bg-blue-100" },
  average: { label: "Average", color: "text-yellow-700", bg: "bg-yellow-100" },
  "needs-improvement": { label: "Needs Work", color: "text-red-700", bg: "bg-red-100" },
};

export default function TestResultsPanel({ results, upcoming }: Props) {
  return (
    <section id="tests">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-950">Tests & Quizzes</h2>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition">View All →</button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        {/* Recent Results */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
          <div className="border-b border-slate-100 px-5 py-3">
            <h3 className="text-sm font-black text-slate-950">Recent Results</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {results.map((test, i) => {
              const pct = Math.round((test.obtained / test.total) * 100);
              const status = statusConfig[test.status];
              return (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-slate-50"
                >
                  {/* Score Circle */}
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                    <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                      <motion.circle
                        cx="18" cy="18" r="15" fill="none"
                        stroke={pct >= 85 ? "#10b981" : pct >= 70 ? "#3b82f6" : "#f59e0b"}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${(pct / 100) * 94.2} 94.2`}
                        initial={{ strokeDasharray: "0 94.2" }}
                        animate={{ strokeDasharray: `${(pct / 100) * 94.2} 94.2` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </svg>
                    <span className="absolute text-[10px] font-black text-slate-950">{pct}%</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">{test.title}</p>
                    <p className="text-xs font-semibold text-slate-400">{test.subject} · {test.date}</p>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-slate-950">{test.obtained}/{test.total}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Retry */}
                  <button className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-blue-300 hover:text-blue-600">
                    <RotateCcw className="h-3 w-3" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Quizzes */}
        <div className="flex w-full flex-col gap-3 lg:w-64">
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
            <div className="border-b border-slate-100 px-4 py-3">
              <h3 className="text-sm font-black text-slate-950">Upcoming Quizzes</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {upcoming.map((quiz, i) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-black text-slate-950">{quiz.title}</p>
                    <p className="text-[10px] font-semibold text-slate-400">{quiz.subject}</p>
                    <p className="text-[10px] font-bold text-purple-600">{quiz.date} · {quiz.duration}</p>
                  </div>
                  <ChevronRight className="h-3 w-3 shrink-0 text-slate-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
