"use client";

import { motion } from "framer-motion";
import { PlayCircle, Clock, BookOpen, Search, Filter, Bookmark, Eye } from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";

const recordings = [
  {
    id: "r1",
    subject: "Mathematics",
    title: "Quadratic Equations — Full Lecture",
    teacher: "Mr. Sharma",
    duration: "45 min",
    date: "May 22, 2026",
    views: 18,
    gradient: "from-blue-500 to-indigo-600",
    emoji: "📐",
    bookmarked: true,
  },
  {
    id: "r2",
    subject: "Science",
    title: "Newton's Laws of Motion",
    teacher: "Ms. Priya",
    duration: "50 min",
    date: "May 20, 2026",
    views: 24,
    gradient: "from-emerald-500 to-teal-600",
    emoji: "⚗️",
    bookmarked: false,
  },
  {
    id: "r3",
    subject: "ML Basics",
    title: "Introduction to Neural Networks",
    teacher: "Mr. Arjun",
    duration: "40 min",
    date: "May 18, 2026",
    views: 31,
    gradient: "from-purple-500 to-violet-600",
    emoji: "🤖",
    bookmarked: true,
  },
  {
    id: "r4",
    subject: "English",
    title: "Creative Writing Workshop",
    teacher: "Ms. Kavya",
    duration: "45 min",
    date: "May 16, 2026",
    views: 15,
    gradient: "from-rose-500 to-pink-600",
    emoji: "✍️",
    bookmarked: false,
  },
  {
    id: "r5",
    subject: "Computer Science",
    title: "Python Functions & Recursion",
    teacher: "Mr. Arjun",
    duration: "55 min",
    date: "May 14, 2026",
    views: 27,
    gradient: "from-cyan-500 to-sky-600",
    emoji: "💻",
    bookmarked: false,
  },
  {
    id: "r6",
    subject: "Mathematics",
    title: "Trigonometry — Basics to Advanced",
    teacher: "Mr. Sharma",
    duration: "60 min",
    date: "May 12, 2026",
    views: 22,
    gradient: "from-blue-500 to-indigo-600",
    emoji: "📐",
    bookmarked: true,
  },
];

const subjects = ["All", "Mathematics", "Science", "English", "ML Basics", "Computer Science"];

export default function RecordedClassesPage() {
  return (
    <DashboardLayout activeSection="/student-dashboard/recorded-classes">
      <div className="space-y-8">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white"
          style={{
            background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 40%, #10b981 100%)",
            boxShadow: "0 16px 48px rgba(6,182,212,0.4)",
          }}
        >
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 left-1/4 h-32 w-32 rounded-full bg-white/8" />
          <div className="absolute right-8 top-6 text-5xl hidden sm:block">🎬</div>

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur-sm">
                <PlayCircle className="h-3 w-3" /> 42 videos
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur-sm">
                <Bookmark className="h-3 w-3" /> 3 bookmarked
              </span>
            </div>
            <h1 className="text-3xl font-black md:text-4xl">Recorded Classes 🎬</h1>
            <p className="mt-2 text-base font-semibold text-white/80 max-w-lg">
              Replay your live sessions, revise at your own pace, and never miss a concept.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Videos",   value: "42",    icon: PlayCircle, gradient: "from-cyan-500 to-teal-500" },
            { label: "Hours Watched",  value: "18h",   icon: Clock,      gradient: "from-blue-500 to-indigo-500" },
            { label: "Bookmarked",     value: "3",     icon: Bookmark,   gradient: "from-emerald-500 to-teal-500" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center gap-2 rounded-3xl border-2 border-white/80 bg-white/70 p-4 text-center shadow-[0_8px_24px_rgba(6,182,212,0.10)] backdrop-blur-sm"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-md`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="text-[11px] font-bold text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search recordings..."
              className="h-11 w-full rounded-2xl border-2 border-white/80 bg-white/70 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none backdrop-blur-sm placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-200/40"
            />
          </div>
          <button className="flex h-11 items-center gap-2 rounded-2xl border-2 border-white/80 bg-white/70 px-4 text-sm font-bold text-slate-600 backdrop-blur-sm transition hover:border-cyan-300">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>

        {/* Subject tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {subjects.map((subject, i) => (
            <button
              key={subject}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                i === 0
                  ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-[0_4px_16px_rgba(6,182,212,0.35)]"
                  : "border-2 border-white/80 bg-white/70 text-slate-600 hover:border-cyan-300 backdrop-blur-sm"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Recordings grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recordings.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -5 }}
              className="flex flex-col gap-4 rounded-3xl border-2 border-white/80 bg-white/70 p-5 shadow-[0_8px_24px_rgba(6,182,212,0.08)] backdrop-blur-sm transition-all hover:border-cyan-200 hover:shadow-[0_16px_40px_rgba(6,182,212,0.18)]"
            >
              {/* Thumbnail */}
              <div className={`relative flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br ${rec.gradient} text-5xl shadow-md`}>
                {rec.emoji}
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20 opacity-0 transition hover:opacity-100">
                  <PlayCircle className="h-10 w-10 text-white" />
                </div>
                {rec.bookmarked && (
                  <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-xl bg-white/90 shadow">
                    <Bookmark className="h-3.5 w-3.5 fill-current text-cyan-600" />
                  </span>
                )}
              </div>

              {/* Info */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide text-cyan-600">{rec.subject}</p>
                <p className="mt-1 font-black text-slate-900 leading-snug">{rec.title}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{rec.teacher}</p>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {rec.duration}</span>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {rec.views} views</span>
                <span>{rec.date}</span>
              </div>

              {/* Play button */}
              <button className={`flex items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-black text-white shadow-md transition hover:-translate-y-0.5 bg-gradient-to-r ${rec.gradient}`}>
                <PlayCircle className="h-4 w-4" /> Watch Now
              </button>
            </motion.div>
          ))}
        </div>

        {/* Load more */}
        <div className="flex justify-center">
          <button className="flex items-center gap-2 rounded-full border-2 border-white/80 bg-white/70 px-6 py-3 text-sm font-black text-slate-700 shadow-sm backdrop-blur-sm transition hover:border-cyan-300 hover:text-cyan-700">
            <BookOpen className="h-4 w-4" /> Load More Videos
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}
