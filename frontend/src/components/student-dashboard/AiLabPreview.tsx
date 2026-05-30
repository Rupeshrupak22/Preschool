"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen, Code2, FlaskConical, HelpCircle, Zap } from "lucide-react";

const quickPrompts = [
  { label: "Explain Simply", icon: BookOpen,     color: "bg-white/20 hover:bg-white/30" },
  { label: "Homework Help",  icon: HelpCircle,   color: "bg-white/20 hover:bg-white/30" },
  { label: "Coding Help",    icon: Code2,        color: "bg-white/20 hover:bg-white/30" },
  { label: "Science Facts",  icon: FlaskConical, color: "bg-white/20 hover:bg-white/30" },
];

export default function AiLabPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl p-6 text-white"
      style={{
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 40%, #a855f7 70%, #ec4899 100%)",
        boxShadow: "0 16px 48px rgba(139,92,246,0.4)",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 left-16 h-28 w-28 rounded-full bg-white/8" />
      <div className="absolute right-32 top-4 h-16 w-16 rounded-full bg-pink-400/20" />

      {/* Floating emoji */}
      <div className="absolute right-6 top-6 text-3xl animate-bounce" style={{ animationDuration: "2s" }}>🤖</div>

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-[0_4px_16px_rgba(255,255,255,0.2)]">
            <Sparkles className="h-7 w-7 text-yellow-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Adyapan Smart</p>
              <span className="rounded-full bg-yellow-400/30 px-2 py-0.5 text-[9px] font-black text-yellow-200">✨ NEW</span>
            </div>
            <h3 className="mt-1 text-xl font-black">Your Learning Buddy</h3>
            <p className="mt-1 text-sm font-semibold text-white/75">
              Ask anything — homework, concepts, coding, science facts!
            </p>
          </div>
        </div>

        {/* CTA */}
        <a
          href="/student-dashboard/smart-lab"
          className="flex shrink-0 items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-purple-700 shadow-[0_8px_24px_rgba(255,255,255,0.25)] transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(255,255,255,0.35)]"
        >
          <Zap className="h-4 w-4 text-yellow-500" />
          Open Smart Lab
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {/* Quick action chips */}
      <div className="relative mt-5 flex flex-wrap gap-2">
        {quickPrompts.map((p) => (
          <a
            key={p.label}
            href="/student-dashboard/smart-lab"
            className={`flex items-center gap-1.5 rounded-full ${p.color} px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition`}
          >
            <p.icon className="h-3.5 w-3.5" />
            {p.label}
          </a>
        ))}
      </div>
    </motion.div>
  );
}
