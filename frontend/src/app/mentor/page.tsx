"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Heart,
  MessageCircle,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

type Icon = React.ComponentType<{ className?: string }>;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const mentorBenefits: { icon: Icon; title: string; desc: string; tone: string }[] = [
  { icon: Target, title: "Personalized Guidance", desc: "One-on-one mentoring tailored to each student's learning pace and goals.", tone: "from-purple-500 to-pink-500" },
  { icon: Brain, title: "Expert Knowledge", desc: "Learn from industry professionals with real-world experience in their fields.", tone: "from-blue-500 to-cyan-400" },
  { icon: Heart, title: "Confidence Building", desc: "Mentors help students overcome doubts and build self-belief through encouragement.", tone: "from-emerald-400 to-teal-500" },
  { icon: Trophy, title: "Goal Achievement", desc: "Structured roadmaps and accountability to help students reach their milestones.", tone: "from-amber-400 to-orange-500" },
  { icon: MessageCircle, title: "Doubt Resolution", desc: "Instant doubt-clearing sessions so no question goes unanswered.", tone: "from-rose-500 to-red-500" },
  { icon: BookOpen, title: "Project Reviews", desc: "Detailed feedback on assignments and projects to improve quality of work.", tone: "from-indigo-500 to-violet-500" },
];

const mentorStats = [
  { value: "35+", label: "Expert Mentors" },
  { value: "1:1", label: "Personal Sessions" },
  { value: "4.9/5", label: "Student Rating" },
  { value: "24/7", label: "Doubt Support" },
];

const howItWorks = [
  { step: "01", title: "Get Matched", desc: "AI matches you with the perfect mentor based on your goals, class, and learning style." },
  { step: "02", title: "Schedule Sessions", desc: "Book live 1:1 sessions at your convenience with flexible scheduling." },
  { step: "03", title: "Learn & Grow", desc: "Get personalized guidance, project reviews, and doubt resolution." },
  { step: "04", title: "Track Progress", desc: "See your improvement with detailed reports and mentor feedback." },
];

const testimonials = [
  { name: "Aarav S.", class: "Class 8", quote: "My mentor helped me understand coding concepts I struggled with for months, in just 2 sessions!", rating: 5 },
  { name: "Priya M.", class: "Class 10", quote: "The personalized attention made all the difference. My grades improved significantly.", rating: 5 },
  { name: "Rohan K.", class: "Class 7", quote: "I love how my mentor makes learning fun and always encourages me to try new things.", rating: 5 },
];

export default function MentorPage() {
  return (
    <main className="min-h-screen overflow-hidden text-slate-950 relative">
      {/* Full-page video background */}
      <div className="fixed inset-0 -z-10">
        <video autoPlay muted loop playsInline preload="none" className="h-full w-full object-cover opacity-80">
          <source src="/mentor-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" />
      </div>

      {/* HERO */}
      <section className="relative px-4 pb-24 pt-16 md:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/20 bg-white/10 p-10 backdrop-blur-sm"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 py-2.5 text-sm font-bold text-black backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-purple-600" />
              ADYAPAN Mentorship Program
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-black md:text-6xl lg:text-7xl">
              Learn from
              <br />
              the best
              <br />
              <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                mentors
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-relaxed text-gray-900 md:text-xl">
              Every student deserves a personal guide. Our expert mentors provide 1:1 sessions, doubt clearing, project reviews, and confidence building to help students excel.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/login"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-bold text-white shadow-[0_16px_40px_rgba(124,58,237,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(124,58,237,0.4)]"
              >
                Find Your Mentor
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </a>
              <a
                href="/overview"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-8 py-4 font-bold text-black backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                Platform Overview
                <GraduationCap className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {mentorStats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-white/30 bg-white/20 p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/35"
            >
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold text-slate-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">Why Choose a Mentor</p>
          <h2 className="mt-3 text-4xl font-black text-slate-900">Guidance that makes a difference</h2>
        </div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.08 }}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {mentorBenefits.map((card) => (
            <motion.article
              key={card.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl border border-white/30 bg-white/20 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/35 hover:shadow-[0_20px_50px_rgba(124,58,237,0.15)]"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <card.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-black text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{card.desc}</p>
              <div className={`absolute -bottom-1 left-0 h-1 w-0 rounded-full bg-gradient-to-r ${card.tone} transition-all duration-500 group-hover:w-full`} />
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.4)]"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">How It Works</p>
            <h2 className="mt-4 text-4xl font-black leading-tight">Your mentorship journey starts here</h2>
            <p className="mt-5 text-base font-medium leading-7 text-slate-400">
              From matching with the right mentor to tracking your growth — every step is designed to make learning personal, effective, and enjoyable.
            </p>
            <div className="mt-8">
              <a
                href="/login"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Get Started <Zap className="h-5 w-5 transition group-hover:rotate-12" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {howItWorks.map((item) => (
              <motion.article
                key={item.step}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="group rounded-3xl border border-white/30 bg-white/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/35 hover:shadow-[0_16px_40px_rgba(59,130,246,0.15)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Users className="h-6 w-6" />
                  </span>
                  <span className="text-4xl font-black text-purple-100/60">{item.step}</span>
                </div>
                <h3 className="mt-5 text-2xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{item.desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">Student Stories</p>
          <h2 className="mt-3 text-4xl font-black text-slate-900">What students say</h2>
        </div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-5 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-white/30 bg-white/20 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/35"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 text-sm font-medium leading-6 text-slate-700 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs font-medium text-slate-500">{t.class}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 pb-24 md:px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/30 bg-white/25 p-8 text-center shadow-[0_16px_48px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-12"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black text-slate-900">Ready to find your perfect mentor?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base font-medium leading-7 text-slate-600">
            Join thousands of students who are learning faster, building confidence, and achieving their goals with personalized mentorship.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="/login" className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-7 font-bold text-white shadow-[0_12px_30px_rgba(124,58,237,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(124,58,237,0.4)]">
              Start Now <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
            <a href="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/30 px-7 font-bold text-slate-900 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/50">
              Contact Us <Calendar className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
