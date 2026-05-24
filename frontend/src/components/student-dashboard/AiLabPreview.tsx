"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen, Code2, FlaskConical, HelpCircle } from "lucide-react";

const quickPrompts = [
  { label: "Explain Simply", icon: BookOpen,     color: "bg-blue-100 text-blue-700" },
  { label: "Homework Help",  icon: HelpCircle,   color: "bg-purple-100 text-purple-700" },
  { label: "Coding Help",    icon: Code2,        color: "bg-cyan-100 text-cyan-700" },
  { label: "Science Facts",  icon: FlaskConical, color: "bg-emerald-100 text-emerald-700" },
];

export default function AiLabPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 p-5 text-white shadow-[0_8px_32px_rgba(139,92,246,0.35)]"
    >
      {/* Background blobs */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 left-12 h-20 w-20 rounded-full bg-white/5" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-yellow-300" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white/60">Adyapan AI</p>
            <h3 className="mt-0.5 text-base font-black">Your Learning Buddy 🤖</h3>
            <p className="mt-1 text-xs font-semibold text-white/70">
              Ask anything — homework, concepts, coding, science facts!
            </p>
          </div>
        </div>

        {/* CTA */}
        <a
          href="/student-dashboard/ai-lab"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-purple-700 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Open AI Lab <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Quick action chips */}
      <div className="relative mt-4 flex flex-wrap gap-2">
        {quickPrompts.map((p) => (
          <a
            key={p.label}
            href="/student-dashboard/ai-lab"
            className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            <p.icon className="h-3 w-3" />
            {p.label}
          </a>
        ))}
      </div>
    </motion.div>
  );
}
