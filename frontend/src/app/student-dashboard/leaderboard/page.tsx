"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp, Star, Medal } from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";

const leaderboard = [
  { rank: 1,  name: "Riya Patel",    score: 96, attendance: 98, consistency: 95, badge: "🥇", highlight: false },
  { rank: 2,  name: "Aryan Mehta",   score: 94, attendance: 96, consistency: 92, badge: "🥈", highlight: false },
  { rank: 3,  name: "Sneha Gupta",   score: 91, attendance: 97, consistency: 90, badge: "🥉", highlight: false },
  { rank: 4,  name: "Aarav Sharma",  score: 88, attendance: 94, consistency: 84, badge: "⭐", highlight: true  },
  { rank: 5,  name: "Priya Singh",   score: 86, attendance: 92, consistency: 88, badge: "",   highlight: false },
  { rank: 6,  name: "Karan Joshi",   score: 84, attendance: 90, consistency: 82, badge: "",   highlight: false },
  { rank: 7,  name: "Ananya Rao",    score: 82, attendance: 95, consistency: 80, badge: "",   highlight: false },
  { rank: 8,  name: "Dev Sharma",    score: 80, attendance: 88, consistency: 78, badge: "",   highlight: false },
  { rank: 9,  name: "Meera Nair",    score: 78, attendance: 91, consistency: 76, badge: "",   highlight: false },
  { rank: 10, name: "Rohan Verma",   score: 76, attendance: 87, consistency: 74, badge: "",   highlight: false },
];

export default function LeaderboardPage() {
  return (
    <DashboardLayout activeSection="/student-dashboard/leaderboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Leaderboard</h1>
          <p className="mt-1 text-sm text-slate-400">Class 9 · Section A · May 2026</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4">
          {leaderboard.slice(0, 3).map((s, i) => {
            const heights = ["h-28", "h-36", "h-24"];
            const order = [1, 0, 2]; // 2nd, 1st, 3rd
            const student = leaderboard[order[i]];
            const gradients = [
              "from-slate-400 to-slate-500",
              "from-yellow-400 to-orange-500",
              "from-orange-400 to-amber-500",
            ];
            return (
              <motion.div
                key={student.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${gradients[i]} text-lg font-black text-white shadow-lg`}>
                  {student.badge || student.rank}
                </div>
                <p className="text-xs font-black text-slate-950 text-center">{student.name}</p>
                <p className="text-[10px] font-semibold text-slate-400">{student.score} pts</p>
                <div className={`w-full rounded-t-xl bg-gradient-to-b ${gradients[i]} ${heights[i]}`} />
              </motion.div>
            );
          })}
        </div>

        {/* Full Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3 text-[11px] font-black uppercase tracking-wider text-slate-400">
            <span className="w-8">Rank</span>
            <span>Student</span>
            <span>Score</span>
            <span>Attendance</span>
            <span>Consistency</span>
          </div>
          <div className="divide-y divide-slate-50">
            {leaderboard.map((student, i) => (
              <motion.div
                key={student.rank}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`grid grid-cols-[auto_1fr_1fr_1fr_1fr] items-center gap-3 px-5 py-3 transition ${
                  student.highlight
                    ? "bg-purple-50 ring-1 ring-inset ring-purple-100"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="flex w-8 items-center justify-center">
                  {student.rank <= 3 ? (
                    <span className="text-base">{student.badge}</span>
                  ) : (
                    <span className="text-sm font-black text-slate-400">#{student.rank}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white ${student.highlight ? "bg-gradient-to-br from-purple-600 to-blue-600" : "bg-slate-300"}`}>
                    {student.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className={`text-sm font-semibold ${student.highlight ? "font-black text-purple-700" : "text-slate-950"}`}>
                    {student.name} {student.highlight && <span className="text-[10px] text-purple-500">(You)</span>}
                  </span>
                </div>
                <span className="text-sm font-black text-slate-950">{student.score}</span>
                <span className="text-sm font-semibold text-slate-600">{student.attendance}%</span>
                <span className="text-sm font-semibold text-slate-600">{student.consistency}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
