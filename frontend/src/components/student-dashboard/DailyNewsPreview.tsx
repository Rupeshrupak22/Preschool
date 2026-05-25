"use client";

import { motion } from "framer-motion";
import { Newspaper, ArrowRight } from "lucide-react";

const previewNews = [
  {
    id: "n1",
    category: "Space",
    emoji: "🚀",
    title: "NASA Discovers Water Ice on the Moon's South Pole",
    summary: "Scientists confirm frozen water exists in permanently shadowed craters.",
    color: "bg-blue-50 border-blue-100",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    id: "n2",
    category: "AI",
    emoji: "🤖",
    title: "AI Helps Students Learn Maths 3x Faster",
    summary: "A new study shows AI tutors improve problem-solving skills significantly.",
    color: "bg-purple-50 border-purple-100",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    id: "n3",
    category: "Fun Fact",
    emoji: "💡",
    title: "Octopuses Have Three Hearts and Blue Blood!",
    summary: "These amazing creatures use copper-based blood instead of iron-based.",
    color: "bg-emerald-50 border-emerald-100",
    badge: "bg-emerald-100 text-emerald-700",
  },
];

export default function DailyNewsPreview() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-black text-slate-950">Today's Learning Discoveries</h2>
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black text-orange-600">🔥 Fresh</span>
        </div>
        <a href="/student-dashboard/daily-news" className="text-xs font-bold text-blue-600 transition hover:text-blue-800">
          See All →
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {previewNews.map((news, i) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            className={`flex flex-col gap-3 rounded-2xl border p-4 ${news.color} transition-shadow hover:shadow-[0_6px_24px_rgba(15,23,42,0.10)]`}
          >
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${news.badge}`}>
                {news.emoji} {news.category}
              </span>
            </div>
            <p className="text-sm font-black text-slate-950 leading-snug">{news.title}</p>
            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">{news.summary}</p>
            <a
              href="/student-dashboard/daily-news"
              className="flex items-center gap-1 text-[11px] font-black text-blue-600 transition hover:gap-2"
            >
              Learn More <ArrowRight className="h-3 w-3" />
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
