"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Code2,
  Cpu,
  GraduationCap,
  LineChart,
  Newspaper,
  Lock,
  Radio,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Users,
  Wifi,
  Zap,
} from "lucide-react";

type Icon = React.ComponentType<{ className?: string }>;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const subjects: { name: string; icon: Icon; color: string }[] = [
  { name: "Current Affairs", icon: Newspaper, color: "from-blue-500 to-cyan-400" },
  { name: "Coding", icon: Code2, color: "from-green-500 to-emerald-400" },
  { name: "IoT", icon: Wifi, color: "from-cyan-500 to-sky-400" },
  { name: "Electronics", icon: Radio, color: "from-orange-500 to-amber-400" },
  { name: "AI/ML", icon: Brain, color: "from-purple-500 to-violet-400" },
];

const features: { icon: Icon; title: string; desc: string; tone: string }[] = [
  { icon: Target, title: "Comprehensive Platform", desc: "All-in-one solution for modern education", tone: "from-blue-500 to-indigo-600" },
  { icon: LineChart, title: "Real-time Analytics", desc: "Track progress with powerful insights", tone: "from-green-500 to-emerald-600" },
  { icon: Brain, title: "AI-Powered Learning", desc: "Personalized education for every student", tone: "from-purple-500 to-violet-600" },
  { icon: BookOpen, title: "Smart Curriculum", desc: "Organized and structured content", tone: "from-orange-500 to-red-500" },
  { icon: Users, title: "Collaborative Tools", desc: "Foster teamwork and engagement", tone: "from-pink-500 to-rose-600" },
  { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security", tone: "from-cyan-500 to-blue-600" },
];

const studentFeatures = [
  "Personalized Learning Paths",
  "Interactive Quizzes & Games",
  "AI Smart Chatbot Assistant",
  "Gamified Progress Reports",
  "Unlimited Practice Questions",
  "Digital Library Access",
  "Smart Study Planner",
];

const teacherFeatures = [
  "AI Lesson Plan Generator",
  "Auto Question Paper Maker",
  "Instant Auto-Grading",
  "Assignment Management",
  "Real-time Progress Tracking",
  "AI Teaching Assistant",
  "Parent Communication Hub",
];

const examFeatures: { icon: Icon; title: string; desc: string }[] = [
  { icon: BookOpen, title: "Multiple Formats", desc: "MCQs, Essays, Coding & More" },
  { icon: Zap, title: "Auto Evaluation", desc: "Instant Grading & Feedback" },
  { icon: Lock, title: "Secure Platform", desc: "Anti-Cheating Technology" },
  { icon: Brain, title: "AI Proctoring", desc: "Smart Monitoring System" },
  { icon: Target, title: "Auto Grading", desc: "Save Hours of Work" },
  { icon: LineChart, title: "Instant Reports", desc: "Real-time Analytics" },
];

const examStats = [
  { value: "100%", label: "Student Monitoring" },
  { value: "Instant", label: "Auto Grading" },
  { value: "20+", label: "Question Types" },
  { value: "15+", label: "Security Features" },
];

export default function MentorsPage() {
  return (
    <main className="min-h-screen overflow-hidden text-slate-950 relative">
      {/* Full-page video background */}
      <div className="fixed inset-0 -z-10">
        <video autoPlay muted loop playsInline preload="none" className="h-full w-full object-cover opacity-80">
          <source src="/mentor-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" />
      </div>

      {/* ─── HERO ─── */}
      <section className="relative px-6 pb-24 pt-16 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              AI-Powered Education Platform
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Where Learning
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Feels Fun Again
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-relaxed text-white/90 md:text-xl">
              Learning that feels exciting, personal, and interactive for every student — making education more engaging, creative, and enjoyable every day.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-bold text-white shadow-[0_16px_40px_rgba(124,58,237,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(124,58,237,0.4)]">
                <Rocket className="h-5 w-5 transition group-hover:rotate-12" />
                Start Free Trial
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20">
                <Calendar className="h-5 w-5" />
                Book a Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SUBJECTS ─── */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.08 }}
          className="rounded-3xl border border-white/30 bg-white/20 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl md:p-12"
        >
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">Future-Ready Skills</p>
            <h2 className="mt-3 text-4xl font-black text-slate-900 sm:text-5xl">Master Future-Ready Skills</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-slate-600">
              Learn from expert faculties in cutting-edge technologies
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {subjects.map((subject, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.08, y: -6 }}
                className="group cursor-pointer"
              >
                <div className={`flex h-32 flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${subject.color} p-5 shadow-lg transition-shadow duration-300 group-hover:shadow-2xl`}>
                  <subject.icon className="h-10 w-10 text-white drop-shadow-md" />
                  <p className="mt-3 text-sm font-bold text-white">{subject.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── FEATURES (Glossy Cards like Overview) ─── */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.08 }}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl border border-white/30 bg-white/20 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/35 hover:shadow-[0_20px_50px_rgba(124,58,237,0.15)]"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.tone} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-black text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{feature.desc}</p>
              <div className={`absolute -bottom-1 left-0 h-1 w-0 rounded-full bg-gradient-to-r ${feature.tone} transition-all duration-500 group-hover:w-full`} />
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* ─── FOR STUDENTS & TEACHERS ─── */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Students */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/30 bg-white/20 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">For Students</h3>
                <p className="text-sm font-medium text-slate-600">Learn, grow, and achieve more</p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {studentFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-2xl border border-white/40 bg-white/30 p-4 font-medium text-slate-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/50 hover:shadow-md"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-pink-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Teachers */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-white/30 bg-white/20 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">For Teachers</h3>
                <p className="text-sm font-medium text-slate-600">Teach smarter, not harder</p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {teacherFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-2xl border border-white/40 bg-white/30 p-4 font-medium text-slate-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/50 hover:shadow-md"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── EXAM SYSTEM ─── */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-16">
        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          {/* Left - Dark card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.4)]"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Exam System</p>
            <h2 className="mt-4 text-4xl font-black leading-tight">Advanced Online Exam System</h2>
            <p className="mt-5 text-base font-medium leading-7 text-slate-400">
              Conduct secure, AI-powered exams with instant results. Support for multiple formats, auto evaluation, and enterprise-grade security.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {examStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Glossy exam feature cards */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {examFeatures.map((feature, index) => (
              <motion.article
                key={feature.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="group rounded-3xl border border-white/30 bg-white/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/35 hover:shadow-[0_16px_40px_rgba(59,130,246,0.15)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <feature.icon className="h-6 w-6" />
                  </span>
                  <span className="text-4xl font-black text-blue-100/60">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-black text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{feature.desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-20" />
    </main>
  );
}
