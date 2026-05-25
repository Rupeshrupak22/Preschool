"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, Zap } from "lucide-react";

const allNews = [
  {
    id: "n1",
    category: "Space",
    emoji: "🚀",
    title: "NASA Finds Water Ice on the Moon!",
    summary: "Frozen water was found in dark craters on the Moon's south pole. Future astronauts could use it!",
    cardBg: "from-[#1e1b4b] to-[#3730a3]",
    badgeBg: "bg-blue-500",
    readTime: "2 min",
    wow: "🌕 Moon Mission",
  },
  {
    id: "n2",
    category: "AI",
    emoji: "🤖",
    title: "AI Tutors Help Kids Learn Maths 3× Faster",
    summary: "A new AI study buddy helps students solve problems step-by-step — like having a teacher 24/7!",
    cardBg: "from-[#4a1d96] to-[#7c3aed]",
    badgeBg: "bg-purple-500",
    readTime: "2 min",
    wow: "🧠 Mind-blowing",
  },
  {
    id: "n3",
    category: "Fun Fact",
    emoji: "🐙",
    title: "Octopuses Have 3 Hearts & Blue Blood!",
    summary: "These super-smart sea creatures use copper instead of iron in their blood — that's why it's blue!",
    cardBg: "from-[#064e3b] to-[#059669]",
    badgeBg: "bg-emerald-500",
    readTime: "1 min",
    wow: "🤯 Wow Factor",
  },
  {
    id: "n4",
    category: "Science",
    emoji: "⚡",
    title: "Lightning Strikes Earth 100 Times Every Second",
    summary: "Right now, somewhere on Earth, lightning is striking. That's 8 million bolts every single day!",
    cardBg: "from-[#78350f] to-[#d97706]",
    badgeBg: "bg-amber-500",
    readTime: "2 min",
    wow: "⚡ Shocking!",
  },
  {
    id: "n5",
    category: "Tech",
    emoji: "🎮",
    title: "Video Games Are Now Used to Train Surgeons",
    summary: "Doctors who play video games make fewer mistakes in surgery. Gaming skills = real-world skills!",
    cardBg: "from-[#831843] to-[#ec4899]",
    badgeBg: "bg-pink-500",
    readTime: "2 min",
    wow: "🎯 Game Changer",
  },
  {
    id: "n6",
    category: "Nature",
    emoji: "🌳",
    title: "Trees Can Talk to Each Other Underground",
    summary: "Forests share food and warnings through a hidden fungus network — scientists call it the 'Wood Wide Web'!",
    cardBg: "from-[#14532d] to-[#16a34a]",
    badgeBg: "bg-green-600",
    readTime: "3 min",
    wow: "🌿 Nature Magic",
  },
];

const categories = ["All", "Space", "AI", "Science", "Tech", "Nature", "Fun Fact"];

export default function DailyNewsPreview() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = allNews.filter((n) => {
    const matchCat = activeCategory === "All" || n.category === activeCategory;
    const matchSearch =
      search.trim() === "" ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.summary.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section>
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 text-xl shadow-[0_6px_20px_rgba(249,115,22,0.4)]">
            🔥
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Today's Discoveries</h2>
            <p className="text-xs font-semibold text-slate-500">Tap a card to learn something amazing!</p>
          </div>
          <span className="hidden rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-3 py-1 text-[10px] font-black text-white shadow-sm sm:inline-flex">
            ✨ Fresh
          </span>
        </div>
        <a
          href="/student-dashboard/daily-news"
          className="flex w-fit items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-black text-purple-700 transition hover:bg-purple-100"
        >
          See All <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search space, AI, science, fun facts..."
          className="h-12 w-full rounded-2xl border-2 border-white/80 bg-white/80 pl-11 pr-4 text-sm font-semibold text-slate-900 shadow-[0_4px_16px_rgba(168,85,247,0.08)] outline-none backdrop-blur-sm placeholder:text-slate-400 transition focus:border-purple-300 focus:ring-4 focus:ring-purple-200/40"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-600 hover:bg-slate-300"
          >
            clear
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition-all ${
              activeCategory === cat
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_4px_16px_rgba(168,85,247,0.4)]"
                : "border-2 border-white/80 bg-white/70 text-slate-600 hover:border-purple-300 backdrop-blur-sm"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-purple-200 bg-white/60 py-12 text-center"
          >
            <span className="text-5xl">🔍</span>
            <p className="font-black text-slate-700">No results found</p>
            <p className="text-xs font-semibold text-slate-400">Try a different search or category</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((news, i) => (
              <motion.a
                key={news.id}
                href="/student-dashboard/daily-news"
                layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex flex-col overflow-hidden rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all hover:shadow-[0_20px_48px_rgba(0,0,0,0.2)]"
              >
                {/* Colourful top panel */}
                <div className={`relative flex items-center justify-between bg-gradient-to-br ${news.cardBg} px-5 py-5`}>
                  {/* Big emoji */}
                  <span className="text-5xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                    {news.emoji}
                  </span>
                  {/* Wow badge */}
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black text-white backdrop-blur-sm">
                    {news.wow}
                  </span>
                  {/* Decorative blob */}
                  <div className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
                </div>

                {/* White bottom panel */}
                <div className="flex flex-1 flex-col gap-2 bg-white px-5 py-4">
                  {/* Category + read time */}
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full ${news.badgeBg} px-2.5 py-0.5 text-[10px] font-black text-white`}>
                      {news.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <Zap className="h-2.5 w-2.5" /> {news.readTime} read
                    </span>
                  </div>

                  {/* Title */}
                  <p className="text-sm font-black leading-snug text-slate-900">{news.title}</p>

                  {/* Summary */}
                  <p className="text-[11px] font-semibold leading-relaxed text-slate-500 flex-1">{news.summary}</p>

                  {/* CTA */}
                  <div className="flex items-center gap-1 pt-1 text-[11px] font-black text-purple-600 transition-all group-hover:gap-2">
                    Learn More <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
