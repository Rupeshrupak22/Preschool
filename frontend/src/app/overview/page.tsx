"use client";

import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CalendarDays,
  CheckCircle2,
  Lightbulb,
  MessageCircle,
  PlayCircle,
  School,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

type Icon = React.ComponentType<{ className?: string }>;

const platformCards: { title: string; copy: string; icon: Icon; tone: string; accent: string }[] = [
  {
    title: "Future Skills Curriculum",
    copy: "Coding, AI, current affairs, communication, design thinking, and career skills mapped class-wise.",
    icon: Brain,
    tone: "from-purple-500 to-pink-500",
    accent: "purple"
  },
  {
    title: "AI Learning Dashboard",
    copy: "Subject-wise score, attendance, homework, rank, live classes, and AI improvement insights.",
    icon: BarChart3,
    tone: "from-blue-500 to-cyan-400",
    accent: "blue"
  },
  {
    title: "Mentor-Led Growth",
    copy: "Expert mentors guide students with doubt sessions, project reviews, and confidence building.",
    icon: Users,
    tone: "from-emerald-400 to-teal-500",
    accent: "emerald"
  },
  {
    title: "School Partnership",
    copy: "Curriculum rollout, teacher support, workshops, competitions, and progress reporting for schools.",
    icon: School,
    tone: "from-amber-400 to-orange-500",
    accent: "amber"
  }
];

const journey = [
  { title: "Diagnose", copy: "Student level, class, strengths, weak areas, interests, and learning habits are mapped.", icon: Target },
  { title: "Learn", copy: "Live classes, activities, projects, worksheets, and recorded sessions keep learning active.", icon: PlayCircle },
  { title: "Track", copy: "Attendance, homework, subject scores, class rank, and AI analysis stay visible in one place.", icon: Bot },
  { title: "Showcase", copy: "Students build portfolios, earn certificates, and present real outcomes confidently.", icon: Trophy }
];

const outcomes = [
  "Class-wise academic + future skills mapping",
  "Hindi, English, Math, Science, Social Science, AI and Coding reports",
  "Daily live class schedule with recorded backup",
  "Homework, doubt session, and mentor feedback tracking",
  "Parent-friendly progress dashboard and rank visibility",
  "Safe learning environment with guided improvement plans"
];

const stats = [
  ["360°", "Student tracking"],
  ["35+", "Expert mentors"],
  ["4.9/5", "Parent trust"]
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function OverviewPage() {
  return (
    <main className="min-h-screen overflow-hidden text-slate-950 relative">
      {/* Full-page background */}
      <div className="fixed inset-0 -z-10">
        <video autoPlay muted loop playsInline preload="none" className="h-full w-full object-cover opacity-80">
          <source src="/overview-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" />
      </div>

      {/* HERO */}
      <section className="relative px-6 pb-24 pt-16 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/20 bg-white/10 p-10 backdrop-blur-sm"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 py-2.5 text-sm font-bold text-black backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-purple-600" />
              ADYAPAN Platform Overview
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-black sm:text-5xl md:text-6xl lg:text-7xl">
              One connected
              <br />
              system for
              <br />
              <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                school growth
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-relaxed text-gray-900 md:text-xl">
              ADYAPAN combines academics, future skills, LMS, live classes, mentors, progress tracking, AI insights, and school partnerships into one smart learning ecosystem.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/student-dashboard"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-bold text-white shadow-[0_16px_40px_rgba(124,58,237,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(124,58,237,0.4)]"
              >
                View Student Dashboard
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </a>
              <a
                href="/mentors"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-8 py-4 font-bold text-black backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                Explore Features
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Cards */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.08 }}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {platformCards.map((card) => (
            <motion.article
              key={card.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl border border-white/30 bg-white/20 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/35 hover:shadow-[0_20px_50px_rgba(124,58,237,0.15)]"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <card.icon className="h-7 w-7" />
              </div>
              <h2 className="mt-6 text-xl font-black text-slate-900">{card.title}</h2>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{card.copy}</p>
              <div className={`absolute -bottom-1 left-0 h-1 w-0 rounded-full bg-gradient-to-r ${card.tone} transition-all duration-500 group-hover:w-full`} />
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Journey Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-16">
        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.4)]"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">How it works</p>
            <h2 className="mt-4 text-4xl font-black leading-tight">A complete student journey, not only a class.</h2>
            <p className="mt-5 text-base font-medium leading-7 text-slate-400">
              The platform is built to answer the most important parent and school question: what is the child learning,
              where are they improving, and what should happen next?
            </p>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm text-center">
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {journey.map((item, index) => (
              <motion.article
                key={item.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="group rounded-3xl border border-white/30 bg-white/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/35 hover:shadow-[0_16px_40px_rgba(59,130,246,0.15)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <item.icon className="h-6 w-6" />
                  </span>
                  <span className="text-4xl font-black text-blue-100/60">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-2xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{item.copy}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/30 bg-white/20 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">What students get</p>
                <h2 className="mt-3 text-4xl font-black text-slate-900">Everything needed for daily learning clarity</h2>
              </div>
              <a href="/dashboard" className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 px-6 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-purple-700 hover:shadow-[0_12px_30px_rgba(124,58,237,0.3)]">
                Open LMS
              </a>
            </div>
            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {outcomes.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/40 bg-white/30 p-4 font-medium text-slate-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/50 hover:shadow-md">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-7 shadow-[0_16px_48px_rgba(59,130,246,0.15)] backdrop-blur-xl"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="mx-auto h-72 w-auto rounded-2xl object-contain shadow-lg"
            >
              <source src="/overview_video.mp4" type="video/mp4" />
            </video>
            <h2 className="mt-5 text-3xl font-black text-slate-900">Built around the student</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
              Each child sees the right subjects, right reports, right classes, and right improvement plan based on their
              class and learning journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 pb-24 md:px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/30 bg-white/25 p-8 text-center shadow-[0_16px_48px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-12"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-white shadow-lg">
            <Lightbulb className="h-8 w-8" />
          </div>
          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black text-slate-900">A modern overview for parents, students, and schools.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base font-medium leading-7 text-slate-600">
            Use this page as the quick explanation of ADYAPAN: what it does, how learning is tracked, and why it is
            different from a normal online class.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="/login" className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 font-bold text-white shadow-[0_12px_30px_rgba(16,185,129,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(16,185,129,0.4)]">
              Join Now <Zap className="h-5 w-5 transition group-hover:rotate-12" />
            </a>
            <a href="/#demo" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/30 px-7 font-bold text-slate-900 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/50">
              Book Demo <CalendarDays className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
