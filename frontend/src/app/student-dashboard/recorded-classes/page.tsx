"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Clock, BookOpen, Search, Filter, Bookmark, Eye, X } from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";
import { useDashboardData } from "@/lib/dashboard/use-dashboard-data";

export default function RecordedClassesPage() {
  const data = useDashboardData();
  const recordings = data.recordedClasses;
  const [filterSubject, setFilterSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const subjects = ["All", ...Array.from(new Set(recordings.map((r) => r.subject)))];

  const filtered = recordings.filter((r) => {
    const matchSubject = filterSubject === "All" || r.subject === filterSubject;
    const matchSearch = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchSearch;
  });

  return (
    <DashboardLayout activeSection="/student-dashboard/recorded-classes">
      <div className="space-y-6">

        {/* Video Player Modal */}
        {playingVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="relative w-full max-w-4xl rounded-2xl bg-black overflow-hidden">
              <button onClick={() => setPlayingVideo(null)} className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition">
                <X className="h-5 w-5" />
              </button>
              <video src={playingVideo} controls autoPlay className="w-full aspect-video" />
            </div>
          </div>
        )}

        <div>
          <h1 className="text-2xl font-black text-slate-950">Recorded Classes</h1>
          <p className="mt-1 text-sm text-slate-500">{recordings.length} videos from your teachers</p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search recordings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
          </div>
        </div>

        {/* Subject filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {subjects.map((subject) => (
            <button key={subject} onClick={() => setFilterSubject(subject)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${filterSubject === subject ? "bg-blue-600 text-white shadow-md" : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}>
              {subject}
            </button>
          ))}
        </div>

        {/* Recordings grid */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
            <PlayCircle className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-500">No recorded classes yet</p>
            <p className="mt-1 text-xs text-slate-400">Your teacher will upload recorded classes here</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((rec, i) => (
              <motion.div key={rec.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md">
                {/* Thumbnail */}
                <div className={`relative flex h-28 items-center justify-center rounded-xl bg-gradient-to-br ${rec.gradient} cursor-pointer`} onClick={() => rec.url && setPlayingVideo(rec.url)}>
                  <PlayCircle className="h-12 w-12 text-white/80" />
                </div>
                {/* Info */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600">{rec.subject}</p>
                  <p className="mt-1 text-sm font-bold text-slate-900 leading-snug">{rec.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{rec.teacher}</p>
                </div>
                {/* Meta */}
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  {rec.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {rec.duration}</span>}
                  <span>{rec.date}</span>
                </div>
                {/* Play button */}
                <button onClick={() => rec.url && setPlayingVideo(rec.url)} disabled={!rec.url} className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-sm transition bg-gradient-to-r ${rec.gradient} ${!rec.url ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5"}`}>
                  <PlayCircle className="h-4 w-4" /> {rec.url ? "Watch Now" : "No Video"}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
