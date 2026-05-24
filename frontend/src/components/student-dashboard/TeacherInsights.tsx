"use client";

import { motion } from "framer-motion";
import { MessageCircle, Sparkles, User } from "lucide-react";

export default function TeacherInsights() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-black text-slate-950">Insights & Recommendations</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Teacher Remark */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-[0_4px_20px_rgba(37,99,235,0.08)]"
        >
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-100/50" />

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-blue-600">Teacher Remark</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Mr. Sharma · Mathematics</p>
            </div>
          </div>

          <div className="relative mt-4">
            <div className="absolute -left-1 top-0 h-full w-0.5 rounded-full bg-blue-300" />
            <p className="pl-4 text-sm font-semibold leading-relaxed text-slate-700">
              "Aarav has shown excellent improvement in algebra. Focus more on Science numerical practice and time management during exams. Keep up the great work in Computer Science!"
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white">
              S
            </div>
            <span className="text-[11px] font-bold text-slate-500">Mr. Sharma · May 20, 2026</span>
          </div>
        </motion.div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-fuchsia-50 p-5 shadow-[0_4px_20px_rgba(139,92,246,0.08)]"
        >
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-purple-100/50" />

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-purple-600">AI Recommendation</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Powered by Adyapan AI</p>
            </div>
          </div>

          <div className="relative mt-4">
            <div className="absolute -left-1 top-0 h-full w-0.5 rounded-full bg-purple-300" />
            <p className="pl-4 text-sm font-semibold leading-relaxed text-slate-700">
              "Communication skills improved significantly this month (+18%). Your coding streak is strong — consider attempting the Advanced Python challenge. Revise Science Chapter 7 before the upcoming test."
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "Strengths", value: "Coding, English", color: "bg-emerald-100 text-emerald-700" },
              { label: "Focus Area", value: "Science", color: "bg-yellow-100 text-yellow-700" },
              { label: "Next Goal", value: "Top 3 Rank", color: "bg-purple-100 text-purple-700" },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl px-2 py-2 text-center ${item.color}`}>
                <p className="text-[9px] font-bold uppercase tracking-wide opacity-70">{item.label}</p>
                <p className="mt-0.5 text-[11px] font-black">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
