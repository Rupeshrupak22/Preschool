"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Sparkles, MessageCircle, Clock, Bookmark,
  TrendingUp, Flame, Star, ArrowRight, Bell, RefreshCw,
} from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";

type Category =
  | "All" | "Popular" | "Space" | "AI" | "Science"
  | "Coding" | "Nature" | "Fun Facts" | "Inspiring";

interface Story {
  id: string;
  source: string;
  sourceColor: string;
  sourceInitial: string;
  category: string;
  title: string;
  body: string;
  readTime: string;
  comments: number;
  emoji: string;
  hasImage: boolean;
  imageBg: string;
  imageUrl?: string;
  tag?: string;
  featured?: boolean;
  link?: string;
  pubDate?: string;
}

const tabs: Category[] = ["All", "Popular", "Space", "AI", "Science", "Coding", "Nature", "Fun Facts", "Inspiring"];

const tabIcons: Record<Category, React.ReactNode> = {
  All: <TrendingUp className="h-3 w-3" />,
  Popular: <Flame className="h-3 w-3" />,
  Space: <span>🚀</span>,
  AI: <span>🤖</span>,
  Science: <span>🔬</span>,
  Coding: <span>💻</span>,
  Nature: <span>🌿</span>,
  "Fun Facts": <span>💡</span>,
  Inspiring: <Star className="h-3 w-3" />,
};

/* ── Single story card ─────────────────────────────────────────────── */
function StoryCard({ story, delay = 0 }: { story: Story; delay?: number }) {
  const [saved, setSaved] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.13)" }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all"
    >
      {story.hasImage && (
        <div className={`relative flex items-center justify-center bg-gradient-to-br ${story.imageBg} py-7`}>
          <span className="text-6xl drop-shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 select-none">{story.emoji}</span>
          {story.tag && (
            <span className="absolute left-3 top-3 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-black text-white backdrop-blur-sm">{story.tag}</span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full ${story.sourceColor} text-[9px] font-black text-white`}>{story.sourceInitial}</span>
            <span className="text-[11px] font-bold text-slate-500">{story.source}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-500">Follow</span>
          </div>
          <button onClick={() => setSaved((v) => !v)} className={`transition ${saved ? "text-yellow-500" : "text-slate-300 hover:text-slate-500"}`}>
            <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>
        <h3 className="text-sm font-black leading-snug text-slate-900 group-hover:text-purple-700 transition-colors">{story.title}</h3>
        <p className={`flex-1 text-[11px] font-semibold leading-relaxed text-slate-500 ${expanded ? "" : "line-clamp-3"}`}>{story.body}</p>
        {!expanded && story.body.length > 120 && (
          <button onClick={() => setExpanded(true)} className="text-[10px] font-black text-blue-600 hover:text-blue-800 self-start">Read More →</button>
        )}
        {expanded && (
          <button onClick={() => setExpanded(false)} className="text-[10px] font-black text-blue-600 hover:text-blue-800 self-start">Show Less</button>
        )}
        {showExplain && (
          <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 text-[11px] font-semibold text-purple-800 leading-relaxed">
            <strong>Simple Explanation:</strong> {story.body.split(".")[0]}. This means it could change how we learn and understand the world around us.
          </div>
        )}
        <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {story.readTime} read</span>
            <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {story.comments}</span>
          </div>
          <button onClick={() => setShowExplain(!showExplain)} className="flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 text-[10px] font-black text-purple-700 transition hover:bg-purple-100">
            <Sparkles className="h-3 w-3" /> {showExplain ? "Hide" : "Explain"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Featured wide card ────────────────────────────────────────────── */
function FeaturedCard({ story }: { story: Story }) {
  const [showExplain, setShowExplain] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -4 }}
      className="group col-span-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)] transition-all hover:shadow-[0_20px_56px_rgba(0,0,0,0.15)] sm:col-span-2"
    >
      <div className="grid sm:grid-cols-[1fr_1.4fr]">
        <div className={`relative flex items-center justify-center bg-gradient-to-br ${story.imageBg} min-h-[180px]`}>
          <span className="text-8xl drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 select-none">{story.emoji}</span>
          {story.tag && (
            <span className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black text-white backdrop-blur-sm">{story.tag}</span>
          )}
        </div>
        <div className="flex flex-col justify-between gap-3 p-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full ${story.sourceColor} text-[10px] font-black text-white`}>{story.sourceInitial}</span>
              <span className="text-xs font-bold text-slate-500">{story.source}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-500">Follow</span>
            </div>
            <h2 className="text-lg font-black leading-snug text-slate-900 group-hover:text-purple-700 transition-colors md:text-xl">{story.title}</h2>
            <p className={`mt-2 text-xs font-semibold leading-relaxed text-slate-500 ${expanded ? "" : "line-clamp-3"}`}>{story.body}</p>
            {showExplain && (
              <div className="mt-3 rounded-xl bg-purple-50 border border-purple-100 p-3 text-xs font-semibold text-purple-800 leading-relaxed">
                <strong>Simple Explanation:</strong> {story.body.split(".")[0]}. In simple words, this discovery helps scientists understand more about our universe and could lead to exciting new technologies.
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {story.readTime} read</span>
              <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {story.comments} comments</span>
            </div>
            <button onClick={() => setShowExplain(!showExplain)} className="ml-auto flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-black text-white shadow-[0_4px_16px_rgba(139,92,246,0.4)] transition hover:-translate-y-0.5">
              <Sparkles className="h-3.5 w-3.5" /> {showExplain ? "Hide" : "Explain Simply"}
            </button>
            {story.link ? (
              <a href={story.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-black text-blue-600 transition hover:gap-2">
                {expanded ? "Show Less" : "Read More"} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs font-black text-blue-600 transition hover:gap-2">
                {expanded ? "Show Less" : "Read More"} <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default function DailyNewsPage() {
  const [active, setActive] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student-dashboard/news")
      .then((res) => res.json())
      .then((data) => { setStories(data.stories || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = stories.filter((s) => {
    const matchCat =
      active === "All" ||
      (active === "Popular" && s.featured) ||
      s.category === active;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.body.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = filtered.find((s) => s.featured);
  const rest = filtered.filter((s) => !s.featured || active !== "All");
  const gridStories = active === "All" ? filtered.filter((s) => !s.featured) : filtered;

  return (
    <DashboardLayout activeSection="/student-dashboard/daily-news">
      {/* Page background */}
      <div
        className="min-h-screen -mx-4 -mt-6 px-4 pt-6 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8"
        style={{ background: "linear-gradient(135deg,#eef2ff 0%,#faf5ff 50%,#fdf2f8 100%)" }}
      >
        <div className="mx-auto max-w-[1400px] space-y-5 pb-12">

          {/* ── Top bar ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search anything..."
                className="h-11 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-900 shadow-sm outline-none placeholder:text-slate-400 transition focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:border-purple-300">
                <Bell className="h-3.5 w-3.5" /> Notifications
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-black text-white shadow-md">
                AS
              </div>
            </div>
          </div>

          {/* ── Category tabs ────────────────────────────────────────── */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black transition-all ${
                  active === tab
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {tabIcons[tab]}
                #{tab}
              </button>
            ))}
          </div>

          {/* ── Feed ─────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-16">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
                <p className="text-sm font-bold text-slate-500">Fetching latest tech news...</p>
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-purple-200 bg-white/60 py-16 text-center"
              >
                <span className="text-5xl">🔍</span>
                <p className="font-black text-slate-700">No stories found</p>
                <p className="text-xs font-semibold text-slate-400">Try a different search or tab</p>
              </motion.div>
            ) : (
              <motion.div
                key={active + search}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Featured wide card — only on "All" */}
                {active === "All" && featured && (
                  <FeaturedCard story={featured} />
                )}

                {/* Masonry-style 3-col grid */}
                <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
                  {gridStories.map((story, i) => (
                    <div key={story.id} className="mb-4 break-inside-avoid">
                      <StoryCard story={story} delay={i * 0.04} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </DashboardLayout>
  );
}
