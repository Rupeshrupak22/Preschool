"use client";

import { motion } from "framer-motion";
import { Gamepad2, Star, Trophy, Zap, Target, Flame, Lock, Play } from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";

const games = [
  {
    id: "g1",
    title: "Math Battle",
    subject: "Mathematics",
    description: "Solve equations faster than your classmates in real-time!",
    players: "2–4 players",
    xp: 150,
    gradient: "from-blue-500 to-indigo-600",
    emoji: "🔢",
    status: "play",
  },
  {
    id: "g2",
    title: "Science Quiz Blitz",
    subject: "Science",
    description: "Race through 20 science questions. Top scorer wins the badge!",
    players: "Solo / Team",
    xp: 120,
    gradient: "from-emerald-500 to-teal-600",
    emoji: "🔬",
    status: "play",
  },
  {
    id: "g3",
    title: "Word Wizard",
    subject: "English",
    description: "Build words, beat the clock, and climb the leaderboard.",
    players: "Solo",
    xp: 100,
    gradient: "from-rose-500 to-pink-600",
    emoji: "📝",
    status: "play",
  },
  {
    id: "g4",
    title: "AI Challenge",
    subject: "AI Basics",
    description: "Test your AI knowledge with scenario-based challenges.",
    players: "Solo",
    xp: 200,
    gradient: "from-purple-500 to-violet-600",
    emoji: "🤖",
    status: "locked",
  },
  {
    id: "g5",
    title: "History Hunt",
    subject: "Social Studies",
    description: "Explore historical events through an interactive treasure hunt.",
    players: "2–6 players",
    xp: 130,
    gradient: "from-amber-500 to-orange-600",
    emoji: "🗺️",
    status: "locked",
  },
  {
    id: "g6",
    title: "Code Racer",
    subject: "Computer Science",
    description: "Write code snippets faster than your peers. Debug and win!",
    players: "2–4 players",
    xp: 180,
    gradient: "from-cyan-500 to-sky-600",
    emoji: "💻",
    status: "locked",
  },
];

const leaderboard = [
  { rank: 1, name: "Priya S.",   xp: 1840, avatar: "PS", gradient: "from-yellow-400 to-orange-400" },
  { rank: 2, name: "Rohan M.",   xp: 1720, avatar: "RM", gradient: "from-slate-400 to-slate-500" },
  { rank: 3, name: "Aarav S.",   xp: 1650, avatar: "AS", gradient: "from-amber-600 to-orange-700" },
  { rank: 4, name: "Kavya T.",   xp: 1580, avatar: "KT", gradient: "from-purple-500 to-pink-500" },
  { rank: 5, name: "Arjun P.",   xp: 1490, avatar: "AP", gradient: "from-blue-500 to-indigo-500" },
];

export default function GamifiedPage() {
  return (
    <DashboardLayout activeSection="/student-dashboard/gamified">
      <div className="space-y-8">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
            boxShadow: "0 16px 48px rgba(168,85,247,0.4)",
          }}
        >
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 left-1/4 h-32 w-32 rounded-full bg-white/8" />
          <div className="absolute right-8 top-6 text-5xl hidden sm:block">🎮</div>

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur-sm">
                <Flame className="h-3 w-3 text-orange-300" /> 14-day streak
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur-sm">
                <Star className="h-3 w-3 text-yellow-300 fill-yellow-300" /> 1,650 XP earned
              </span>
              <span className="flex items-center gap-white/20 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur-sm">
                <Trophy className="h-3 w-3 text-yellow-300 mr-1.5" /> Rank #3
              </span>
            </div>
            <h1 className="text-3xl font-black md:text-4xl">Gamified Learning 🎯</h1>
            <p className="mt-2 text-base font-semibold text-white/80 max-w-lg">
              Play educational games, earn XP, win badges, and climb the leaderboard!
            </p>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "XP Earned",    value: "1,650", icon: Zap,    gradient: "from-purple-500 to-violet-500" },
            { label: "Games Played", value: "24",    icon: Gamepad2, gradient: "from-blue-500 to-indigo-500" },
            { label: "Badges Won",   value: "7",     icon: Trophy, gradient: "from-yellow-400 to-orange-500" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center gap-2 rounded-3xl border-2 border-white/80 bg-white/70 p-4 text-center shadow-[0_8px_24px_rgba(168,85,247,0.10)] backdrop-blur-sm"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-md`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="text-[11px] font-bold text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Games grid */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-900">Available Games</h2>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">Play to earn XP and unlock badges</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -5 }}
                className="flex flex-col gap-4 rounded-3xl border-2 border-white/80 bg-white/70 p-5 shadow-[0_8px_24px_rgba(168,85,247,0.08)] backdrop-blur-sm transition-all hover:border-purple-200 hover:shadow-[0_16px_40px_rgba(168,85,247,0.18)]"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${game.gradient} text-3xl shadow-md`}>
                    {game.emoji}
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                    game.status === "locked"
                      ? "bg-slate-100 text-slate-500"
                      : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                  }`}>
                    {game.status === "locked" ? "🔒 Locked" : `+${game.xp} XP`}
                  </span>
                </div>

                <div>
                  <p className="font-black text-slate-900">{game.title}</p>
                  <p className="mt-0.5 text-[10px] font-bold text-purple-600 uppercase tracking-wide">{game.subject}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-500 leading-relaxed">{game.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <Target className="h-3 w-3" /> {game.players}
                  </span>
                  <button
                    disabled={game.status === "locked"}
                    className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-black text-white transition hover:-translate-y-0.5 ${
                      game.status === "locked"
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed hover:translate-y-0"
                        : `bg-gradient-to-r ${game.gradient} shadow-md hover:shadow-lg`
                    }`}
                  >
                    {game.status === "locked" ? (
                      <><Lock className="h-3 w-3" /> Locked</>
                    ) : (
                      <><Play className="h-3 w-3 fill-current" /> Play Now</>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mini Leaderboard */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-900">Class Leaderboard</h2>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">Top XP earners this week</p>
          </div>
          <div className="rounded-3xl border-2 border-white/80 bg-white/70 p-5 shadow-[0_8px_24px_rgba(168,85,247,0.10)] backdrop-blur-sm space-y-3">
            {leaderboard.map((entry, i) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`flex items-center gap-4 rounded-2xl p-3 transition ${
                  entry.name === "Aarav S."
                    ? "bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200"
                    : "hover:bg-white/60"
                }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                  entry.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                  entry.rank === 2 ? "bg-slate-100 text-slate-600" :
                  entry.rank === 3 ? "bg-orange-100 text-orange-700" :
                  "bg-white text-slate-500"
                }`}>
                  {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                </span>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${entry.gradient} text-xs font-black text-white shadow-sm`}>
                  {entry.avatar}
                </div>
                <p className="flex-1 font-black text-slate-900 text-sm">{entry.name}</p>
                <span className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-purple-700">
                  <Zap className="h-3 w-3" /> {entry.xp.toLocaleString()} XP
                </span>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}
