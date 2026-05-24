"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Send, BookOpen, Code2, FlaskConical,
  HelpCircle, Zap, Brain, Star, RotateCcw,
} from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";

// ── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

// ── Static data ──────────────────────────────────────────────────────────────
const quickActions = [
  { label: "Explain Simply",  icon: BookOpen,     prompt: "Explain this concept in simple words for a Class 9 student: ",  color: "from-blue-500 to-indigo-600" },
  { label: "Homework Help",   icon: HelpCircle,   prompt: "Help me solve this homework problem: ",                          color: "from-purple-500 to-violet-600" },
  { label: "Coding Help",     icon: Code2,        prompt: "Help me understand this coding concept: ",                       color: "from-cyan-500 to-blue-600" },
  { label: "Science Facts",   icon: FlaskConical, prompt: "Tell me an interesting science fact about: ",                    color: "from-emerald-500 to-teal-600" },
  { label: "Quiz Me",         icon: Brain,        prompt: "Give me a quick quiz question on: ",                             color: "from-orange-500 to-amber-600" },
  { label: "Daily Challenge", icon: Zap,          prompt: "Give me today's learning challenge for a Class 9 student.",      color: "from-rose-500 to-pink-600" },
];

const suggestedTopics = [
  { label: "Mathematics",    emoji: "📐", color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
  { label: "Science",        emoji: "🔬", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
  { label: "AI & Coding",    emoji: "🤖", color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
  { label: "Robotics",       emoji: "⚙️", color: "bg-orange-50 text-orange-700 hover:bg-orange-100" },
  { label: "Communication",  emoji: "🎤", color: "bg-rose-50 text-rose-700 hover:bg-rose-100" },
  { label: "History",        emoji: "📜", color: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" },
  { label: "English",        emoji: "📖", color: "bg-cyan-50 text-cyan-700 hover:bg-cyan-100" },
  { label: "Fun Facts",      emoji: "💡", color: "bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100" },
];

// Simulated AI responses
const aiResponses: Record<string, string> = {
  default: "Great question! 🌟 Let me help you understand this better. Learning is all about asking the right questions — and you're already doing that! Try asking me something specific like 'Explain photosynthesis simply' or 'Help me with quadratic equations'.",
  math: "Mathematics is like a puzzle 🧩 — every problem has a solution! For algebra, remember: whatever you do to one side of the equation, do the same to the other. Want me to walk through a specific problem step by step?",
  science: "Science is everywhere around us! 🔬 From the food you eat to the phone you use — it's all science. What topic would you like to explore? Photosynthesis, Newton's Laws, or maybe the water cycle?",
  coding: "Coding is like giving instructions to a robot 🤖 — you have to be very precise! Python is a great language to start with. Want me to explain loops, functions, or maybe help you debug something?",
  quiz: "Quiz time! 🎯 Here's your question:\n\nWhat is the powerhouse of the cell?\n\nA) Nucleus\nB) Mitochondria\nC) Ribosome\nD) Cell Wall\n\nThink carefully before answering! 🤔",
};

function getAiResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("math") || lower.includes("algebra") || lower.includes("equation")) return aiResponses.math;
  if (lower.includes("science") || lower.includes("physics") || lower.includes("chemistry") || lower.includes("biology")) return aiResponses.science;
  if (lower.includes("code") || lower.includes("coding") || lower.includes("python") || lower.includes("program")) return aiResponses.coding;
  if (lower.includes("quiz") || lower.includes("question") || lower.includes("test")) return aiResponses.quiz;
  return aiResponses.default;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function AiLabPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Hey there! 👋 I'm your Adyapan AI learning buddy! I can help you understand concepts, solve homework, write code, or just share cool facts. What would you like to learn today? 🚀",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: getAiResponse(text),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 900);
  }

  return (
    <DashboardLayout activeSection="/student-dashboard/ai-lab">
      <div className="flex h-[calc(100vh-160px)] flex-col gap-4 lg:flex-row">

        {/* ── LEFT: Quick Actions ─────────────────────────────────────── */}
        <div className="flex shrink-0 flex-col gap-3 lg:w-52">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
            <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Actions</p>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.prompt)}
                  className={`flex w-full items-center gap-2.5 rounded-xl bg-gradient-to-r ${action.color} px-3 py-2.5 text-left text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
                >
                  <action.icon className="h-3.5 w-3.5 shrink-0" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CENTER: Chat ────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.07)]">
          {/* Chat header */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                <Sparkles className="h-4 w-4 text-yellow-300" />
              </div>
              <div>
                <p className="text-sm font-black text-white">Adyapan AI</p>
                <p className="text-[10px] font-semibold text-white/60">Your learning buddy · Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setMessages([{
                id: "welcome",
                role: "ai",
                text: "Hey there! 👋 I'm your Adyapan AI learning buddy! I can help you understand concepts, solve homework, write code, or just share cool facts. What would you like to learn today? 🚀",
              }])}
              className="flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-[10px] font-bold text-white transition hover:bg-white/25"
            >
              <RotateCcw className="h-3 w-3" /> New Chat
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                    msg.role === "ai"
                      ? "bg-gradient-to-br from-violet-500 to-blue-500 text-white"
                      : "bg-gradient-to-br from-slate-700 to-slate-900 text-white"
                  }`}>
                    {msg.role === "ai" ? "✨" : "👤"}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm font-semibold leading-relaxed whitespace-pre-line ${
                    msg.role === "ai"
                      ? "rounded-tl-sm bg-slate-50 text-slate-800"
                      : "rounded-tr-sm bg-gradient-to-br from-violet-600 to-blue-600 text-white"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading bubble */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm text-white">✨</div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-slate-50 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      className="h-2 w-2 rounded-full bg-slate-400"
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-slate-100 p-3">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything... 💬"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-md transition hover:-translate-y-0.5 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* ── RIGHT: Suggested Topics ─────────────────────────────────── */}
        <div className="flex shrink-0 flex-col gap-3 lg:w-44">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
            <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Topics</p>
            <div className="space-y-1.5">
              {suggestedTopics.map((topic) => (
                <button
                  key={topic.label}
                  onClick={() => sendMessage(`Tell me something interesting about ${topic.label}`)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${topic.color}`}
                >
                  <span>{topic.emoji}</span>
                  <span>{topic.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fun tip */}
          <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 p-4">
            <Star className="h-4 w-4 text-yellow-500 mb-2" />
            <p className="text-[11px] font-black text-slate-700">Pro Tip!</p>
            <p className="mt-1 text-[10px] font-semibold text-slate-500 leading-relaxed">
              Ask me to "explain simply" any topic and I'll break it down just for you! 🎯
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
