"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";

// ── Data ─────────────────────────────────────────────────────────────────────
type Category = "All" | "Science" | "Space" | "AI" | "Coding" | "Robotics" | "Fun Facts" | "Innovation" | "Inspiring";

interface NewsItem {
  id: string;
  category: Exclude<Category, "All">;
  emoji: string;
  title: string;
  summary: string;
  readTime: string;
  gradient: string;
  badge: string;
}

const allNews: NewsItem[] = [
  { id: "1",  category: "Space",      emoji: "🚀", title: "NASA Discovers Water Ice on the Moon's South Pole",          summary: "Scientists confirm frozen water exists in permanently shadowed craters, opening doors for future lunar missions.",                    readTime: "2 min", gradient: "from-blue-500 to-indigo-600",   badge: "bg-blue-100 text-blue-700" },
  { id: "2",  category: "AI",         emoji: "🤖", title: "AI Helps Students Learn Maths 3x Faster",                   summary: "A new study shows AI tutors improve problem-solving skills significantly in students aged 10–15.",                                readTime: "3 min", gradient: "from-purple-500 to-fuchsia-600", badge: "bg-purple-100 text-purple-700" },
  { id: "3",  category: "Fun Facts",  emoji: "💡", title: "Octopuses Have Three Hearts and Blue Blood!",               summary: "These amazing creatures use copper-based blood instead of iron-based, making it appear blue.",                                   readTime: "1 min", gradient: "from-emerald-500 to-teal-600",  badge: "bg-emerald-100 text-emerald-700" },
  { id: "4",  category: "Robotics",   emoji: "⚙️", title: "Students Build Robot That Cleans Ocean Plastic",           summary: "A team of Class 10 students from Pune built an autonomous robot that collects plastic from water bodies.",                       readTime: "3 min", gradient: "from-orange-500 to-amber-600",  badge: "bg-orange-100 text-orange-700" },
  { id: "5",  category: "Science",    emoji: "🔬", title: "Scientists Grow Plants in Moon Soil for the First Time",    summary: "NASA researchers successfully grew plants in lunar regolith, a major step toward growing food in space.",                         readTime: "2 min", gradient: "from-cyan-500 to-sky-600",      badge: "bg-cyan-100 text-cyan-700" },
  { id: "6",  category: "Coding",     emoji: "💻", title: "Python Becomes the World's Most Popular Language",          summary: "For the third year in a row, Python tops the TIOBE index — and it's the easiest language for beginners to learn!",              readTime: "2 min", gradient: "from-yellow-500 to-orange-500",  badge: "bg-yellow-100 text-yellow-700" },
  { id: "7",  category: "Inspiring",  emoji: "🌟", title: "14-Year-Old Invents App to Help Blind Students Read",       summary: "Aryan from Jaipur built an AI-powered app that converts textbook images to audio — and won a national award.",                   readTime: "3 min", gradient: "from-rose-500 to-pink-600",     badge: "bg-rose-100 text-rose-700" },
  { id: "8",  category: "Innovation", emoji: "🧪", title: "New Solar Paint Can Turn Any Wall Into a Power Source",     summary: "Scientists developed a special paint that absorbs sunlight and generates electricity — imagine painting your school roof!",       readTime: "2 min", gradient: "from-violet-500 to-purple-600",  badge: "bg-violet-100 text-violet-700" },
  { id: "9",  category: "Space",      emoji: "🌌", title: "James Webb Telescope Captures Oldest Galaxy Ever Seen",    summary: "The galaxy formed just 300 million years after the Big Bang — that's 13.5 billion years ago!",                                   readTime: "2 min", gradient: "from-blue-600 to-cyan-600",     badge: "bg-blue-100 text-blue-700" },
  { id: "10", category: "Science",    emoji: "🦋", title: "Butterflies Can See Colors Humans Cannot",                  summary: "Butterflies have 15 types of photoreceptors compared to humans' 3, allowing them to see ultraviolet patterns on flowers.",       readTime: "1 min", gradient: "from-fuchsia-500 to-rose-500",  badge: "bg-fuchsia-100 text-fuchsia-700" },
  { id: "11", category: "AI",         emoji: "🎨", title: "AI Can Now Generate Music, Art, and Stories in Seconds",   summary: "Generative AI tools are changing how we create — and learning how they work is becoming an essential skill for students.",        readTime: "3 min", gradient: "from-indigo-500 to-purple-600",  badge: "bg-indigo-100 text-indigo-700" },
  { id: "12", category: "Fun Facts",  emoji: "🐙", title: "A Day on Venus Is Longer Than a Year on Venus",            summary: "Venus rotates so slowly that it takes 243 Earth days to spin once — but only 225 days to orbit the Sun!",                       readTime: "1 min", gradient: "from-teal-500 to-emerald-600",  badge: "bg-teal-100 text-teal-700" },
];

const categories: Category[] = ["All", "Science", "Space", "AI", "Coding", "Robotics", "Fun Facts", "Innovation", "Inspiring"];

const categoryEmojis: Record<Category, string> = {
  All: "🌍", Science: "🔬", Space: "🚀", AI: "🤖", Coding: "💻",
  Robotics: "⚙️", "Fun Facts": "💡", Innovation: "🧪", Inspiring: "🌟",
};

export default function DailyNewsPage() {
  const [active, setActive] = useState<Category>("All");

  const filtered = active === "All" ? allNews : allNews.filter((n) => n.category === active);

  return (
    <DashboardLayout activeSection="/student-dashboard/daily-news">
      <div className="space-y-6">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 px-6 py-6 text-white shadow-[0_8px_32px_rgba(249,115,22,0.3)]">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 left-20 h-24 w-24 rounded-full bg-white/5" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-widest text-white/60">Adyapan Discovery Feed</p>
            <h1 className="mt-1 text-2xl font-black">Today's Learning Discoveries 🚀</h1>
            <p className="mt-1 text-sm font-semibold text-white/70">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              {" · "}{allNews.length} stories waiting for you
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition ${
                active === cat
                  ? "bg-slate-950 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              <span>{categoryEmojis[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {filtered.map((news, i) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.07)] transition-shadow hover:shadow-[0_8px_32px_rgba(15,23,42,0.12)]"
            >
              {/* Colour strip */}
              <div className={`h-2 w-full bg-gradient-to-r ${news.gradient}`} />

              <div className="flex flex-1 flex-col gap-3 p-4">
                {/* Category + read time */}
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${news.badge}`}>
                    {news.emoji} {news.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">{news.readTime} read</span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-black text-slate-950 leading-snug">{news.title}</h3>

                {/* Summary */}
                <p className="flex-1 text-[11px] font-semibold text-slate-500 leading-relaxed">{news.summary}</p>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                  <a
                    href="/student-dashboard/ai-lab"
                    className="flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1.5 text-[10px] font-black text-purple-700 transition hover:bg-purple-100"
                  >
                    <Sparkles className="h-3 w-3" /> Explain Simply
                  </a>
                  <button className="flex items-center gap-1 text-[11px] font-black text-blue-600 transition hover:gap-2">
                    Learn More <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
