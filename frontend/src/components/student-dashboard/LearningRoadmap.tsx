"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2, Circle, Lock, Rocket, BookOpen,
  Code2, Brain, Mic, Trophy, Zap, ArrowRight, Star,
} from "lucide-react";

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "active" | "locked";
  xp: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface CourseTrack {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  color: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
  steps: RoadmapStep[];
}

const tracks: CourseTrack[] = [
  {
    id: "coding",
    title: "Coding & Development",
    subtitle: "Python → Web → Full Stack",
    progress: 68,
    totalModules: 12,
    completedModules: 8,
    color: "blue",
    gradient: "from-blue-500 to-indigo-600",
    icon: Code2,
    steps: [
      { id: "c1", title: "Python Basics", description: "Variables, loops, functions", status: "completed", xp: 50, icon: CheckCircle2, color: "emerald" },
      { id: "c2", title: "Data Structures", description: "Lists, dicts, sets", status: "completed", xp: 60, icon: CheckCircle2, color: "emerald" },
      { id: "c3", title: "OOP Concepts", description: "Classes & objects", status: "completed", xp: 70, icon: CheckCircle2, color: "emerald" },
      { id: "c4", title: "Web with Flask", description: "Build your first web app", status: "active", xp: 80, icon: Zap, color: "blue" },
      { id: "c5", title: "React Basics", description: "Components & state", status: "locked", xp: 90, icon: Lock, color: "slate" },
      { id: "c6", title: "Full Stack Project", description: "Deploy a real app", status: "locked", xp: 100, icon: Lock, color: "slate" },
    ],
  },
  {
    id: "ml",
    title: "Machine Learning & Data Science",
    subtitle: "Concepts → Models → Projects",
    progress: 45,
    totalModules: 10,
    completedModules: 4,
    color: "purple",
    gradient: "from-purple-500 to-fuchsia-600",
    icon: Brain,
    steps: [
      { id: "a1", title: "ML Fundamentals", description: "What is ML & Data Science", status: "completed", xp: 40, icon: CheckCircle2, color: "emerald" },
      { id: "a2", title: "Data & Statistics", description: "Datasets & analysis", status: "completed", xp: 50, icon: CheckCircle2, color: "emerald" },
      { id: "a3", title: "Supervised Learning", description: "Regression & classification", status: "active", xp: 60, icon: Zap, color: "purple" },
      { id: "a4", title: "Neural Networks", description: "Deep learning basics", status: "locked", xp: 70, icon: Lock, color: "slate" },
      { id: "a5", title: "ML Project", description: "Build a ML model", status: "locked", xp: 80, icon: Lock, color: "slate" },
    ],
  },
  {
    id: "communication",
    title: "Communication & Leadership",
    subtitle: "Speaking → Presenting → Leading",
    progress: 80,
    totalModules: 8,
    completedModules: 6,
    color: "rose",
    gradient: "from-rose-500 to-pink-600",
    icon: Mic,
    steps: [
      { id: "l1", title: "Public Speaking 101", description: "Confidence & clarity", status: "completed", xp: 40, icon: CheckCircle2, color: "emerald" },
      { id: "l2", title: "Debate Skills", description: "Argument & rebuttal", status: "completed", xp: 50, icon: CheckCircle2, color: "emerald" },
      { id: "l3", title: "Presentation Design", description: "Slides & storytelling", status: "completed", xp: 50, icon: CheckCircle2, color: "emerald" },
      { id: "l4", title: "Team Leadership", description: "Lead & motivate", status: "active", xp: 60, icon: Zap, color: "rose" },
      { id: "l5", title: "TEDx Style Talk", description: "Deliver a 5-min talk", status: "locked", xp: 80, icon: Lock, color: "slate" },
    ],
  },
];

const milestones = [
  { label: "First Code", icon: Code2, earned: true, color: "bg-blue-500" },
  { label: "ML Explorer", icon: Brain, earned: true, color: "bg-purple-500" },
  { label: "Speaker", icon: Mic, earned: true, color: "bg-rose-500" },
  { label: "Project Builder", icon: Rocket, earned: false, color: "bg-slate-300" },
  { label: "Top Learner", icon: Trophy, earned: false, color: "bg-slate-300" },
  { label: "Innovator", icon: Star, earned: false, color: "bg-slate-300" },
];

const colorMap: Record<string, { bar: string; badge: string; ring: string; activeBg: string }> = {
  blue: { bar: "bg-blue-500", badge: "bg-blue-100 text-blue-700", ring: "ring-blue-200", activeBg: "bg-blue-50 border-blue-200" },
  purple: { bar: "bg-purple-500", badge: "bg-purple-100 text-purple-700", ring: "ring-purple-200", activeBg: "bg-purple-50 border-purple-200" },
  rose: { bar: "bg-rose-500", badge: "bg-rose-100 text-rose-700", ring: "ring-rose-200", activeBg: "bg-rose-50 border-rose-200" },
  emerald: { bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700", ring: "ring-emerald-200", activeBg: "bg-emerald-50 border-emerald-200" },
  slate: { bar: "bg-slate-300", badge: "bg-slate-100 text-slate-400", ring: "ring-slate-100", activeBg: "bg-slate-50 border-slate-200" },
};

function TrackCard({ track, index }: { track: CourseTrack; index: number }) {
  const TrackIcon = track.icon;
  const colors = colorMap[track.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.07)]"
    >
      {/* Track Header */}
      <div className={`bg-gradient-to-r ${track.gradient} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <TrackIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black">{track.title}</p>
              <p className="text-[11px] font-semibold text-white/70">{track.subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-black">{track.progress}%</p>
            <p className="text-[10px] font-semibold text-white/70">{track.completedModules}/{track.totalModules} modules</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${track.progress}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 + 0.3 }}
            className="h-full rounded-full bg-white"
          />
        </div>
      </div>

      {/* Steps */}
      <div className="p-4">
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[18px] top-5 h-[calc(100%-40px)] w-0.5 bg-slate-100" />

          <div className="space-y-3">
            {track.steps.map((step, i) => {
              const StepIcon = step.icon;
              const stepColors = colorMap[step.color];
              const isActive = step.status === "active";
              const isLocked = step.status === "locked";

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + i * 0.06 }}
                  className={`relative flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                    isActive
                      ? stepColors.activeBg
                      : isLocked
                      ? "border-transparent bg-transparent opacity-50"
                      : "border-transparent bg-transparent"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-2 ${
                      isLocked
                        ? "bg-slate-100 ring-slate-100"
                        : step.status === "completed"
                        ? "bg-emerald-500 ring-emerald-200"
                        : `bg-gradient-to-br ${track.gradient} ring-2 ${stepColors.ring}`
                    }`}
                  >
                    <StepIcon className={`h-4 w-4 ${isLocked ? "text-slate-400" : "text-white"}`} />
                    {isActive && (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-yellow-400 ring-2 ring-white" />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-black ${isLocked ? "text-slate-400" : "text-slate-950"}`}>
                      {step.title}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400">{step.description}</p>
                  </div>

                  {/* XP */}
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${stepColors.badge}`}>
                    +{step.xp} XP
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <button
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${track.gradient} py-2.5 text-xs font-black text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg`}
        >
          Continue Learning <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}

export default function LearningRoadmap() {
  return (
    <section id="roadmap">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-950">Learning Roadmap</h2>
          <p className="mt-0.5 text-xs text-slate-400">Your personalised path to mastery across all tracks</p>
        </div>
        <button className="text-xs font-bold text-blue-600 transition hover:text-blue-800">
          View Full Map →
        </button>
      </div>

      {/* Milestone Strip */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex items-center gap-3 overflow-x-auto rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.06)] no-scrollbar"
      >
        <span className="shrink-0 text-xs font-black text-slate-400 uppercase tracking-wider">Milestones</span>
        <div className="mx-3 h-4 w-px bg-slate-200 shrink-0" />
        {milestones.map((m, i) => {
          const MIcon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.07 }}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm ${
                  m.earned ? m.color : "bg-slate-100"
                }`}
              >
                <MIcon className={`h-5 w-5 ${m.earned ? "text-white" : "text-slate-300"}`} />
              </div>
              <span className={`text-[10px] font-bold ${m.earned ? "text-slate-700" : "text-slate-300"}`}>
                {m.label}
              </span>
            </motion.div>
          );
        })}
        <div className="ml-auto shrink-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2 text-center">
          <p className="text-xs font-black text-white">1,850 XP</p>
          <p className="text-[9px] font-semibold text-white/70">Total Earned</p>
        </div>
      </motion.div>

      {/* Track Cards */}
      <div className="grid gap-5 lg:grid-cols-3">
        {tracks.map((track, i) => (
          <TrackCard key={track.id} track={track} index={i} />
        ))}
      </div>

      {/* Bottom Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-5 flex items-center justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-purple-950 px-6 py-5 text-white"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Rocket className="h-6 w-6 text-yellow-300" />
          </div>
          <div>
            <p className="text-sm font-black">Next Milestone: Project Builder</p>
            <p className="text-xs font-semibold text-white/60">Complete your Flask web app to unlock this badge</p>
          </div>
        </div>
        <button className="shrink-0 flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-black text-white backdrop-blur-sm transition hover:bg-white/25">
          <BookOpen className="h-3.5 w-3.5" /> Start Now
        </button>
      </motion.div>
    </section>
  );
}
