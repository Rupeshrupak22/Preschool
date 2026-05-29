"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Brain,
  CheckCircle2,
  Code2,
  Cpu,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Rocket,
  School,
  ShieldCheck,
  Sparkles,
  Target,
  Users
} from "lucide-react";

type Icon = React.ComponentType<{ className?: string }>;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 }
};

const rotatingWords = [
  { text: "creators", className: "from-blue-700 to-cyan-600" },
  { text: "problem solvers", className: "from-rose-600 to-amber-500" },
  { text: "brave", className: "from-violet-700 to-fuchsia-500" }
];

const metrics: { value: string; label: string; icon: Icon; accent: string }[] = [
  { value: "5-12", label: "Classes", icon: GraduationCap, accent: "from-blue-600 to-cyan-500" },
  { value: "10+", label: "Future skills", icon: Brain, accent: "from-violet-600 to-fuchsia-500" },
  { value: "100%", label: "Project-first learning", icon: Target, accent: "from-emerald-600 to-teal-500" },
  { value: "24/7", label: "Digital access", icon: Rocket, accent: "from-amber-500 to-rose-500" }
];

const values: { title: string; copy: string; icon: Icon; tone: string }[] = [
  {
    title: "Learn by building",
    copy: "Students do not just watch lessons. They create apps, bots, websites, AI tools, and working prototypes.",
    icon: Cpu,
    tone: "bg-blue-600"
  },
  {
    title: "Confidence before complexity",
    copy: "Every concept is broken into simple wins so students feel capable before the work becomes advanced.",
    icon: HeartHandshake,
    tone: "bg-rose-600"
  },
  {
    title: "Real school readiness",
    copy: "Our programs fit classrooms, events, certifications, labs, and parent-visible progress.",
    icon: School,
    tone: "bg-emerald-600"
  },
  {
    title: "Safe modern technology",
    copy: "AI, coding, robotics, and digital skills are taught with responsible habits and guided practice.",
    icon: ShieldCheck,
    tone: "bg-slate-950"
  }
];

const pillars: { title: string; icon: Icon }[] = [
  { title: "Coding", icon: Code2 },
  { title: "Artificial Intelligence", icon: Brain },
  { title: "Robotics", icon: Cpu },
  { title: "Communication", icon: Users },
  { title: "Innovation", icon: Lightbulb },
  { title: "Certification", icon: Award }
];

const timeline = [
  ["Discover", "Students explore future skills through stories, demos, and live challenges."],
  ["Build", "They create guided projects with mentors and classroom-friendly milestones."],
  ["Present", "Every learner practices explaining ideas, results, and project decisions."],
  ["Grow", "Progress reports, certificates, and portfolio work help them move forward."]
];

export default function AboutPage() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % rotatingWords.length);
    }, 1600);

    return () => window.clearInterval(timer);
  }, []);

  const activeWord = rotatingWords[wordIndex];

  return (
    <main className="min-h-screen overflow-hidden text-slate-950">
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden px-4 pb-12 pt-10 md:px-6">
        <div className="absolute inset-0">
          <img src="/bg-hero.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.90)_45%,rgba(239,246,255,0.58)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:64px_64px] opacity-60" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1fr]">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -2, scale: 1.02 }}
              className="inline-flex items-center gap-3 rounded-full border border-blue-200 bg-white/88 px-4 py-2 text-sm font-black text-blue-800 shadow-[0_14px_34px_rgba(37,99,235,0.12)] backdrop-blur"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-700 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              Future skills for confident students
            </motion.div>
            <motion.h1 variants={fadeUp} className="mt-7 max-w-4xl text-3xl font-black leading-[1.08] text-slate-950 sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-slate-950 via-blue-900 to-slate-950 bg-clip-text text-transparent">
                ADYAPAN
              </span>{" "}
              helps students become
              <span className="relative mt-3 block min-h-[1.18em] overflow-hidden sm:mt-4">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeWord.text}
                    initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -18, filter: "blur(10px)" }}
                    transition={{ duration: 0.38, ease: "easeOut" }}
                    className={`inline-block bg-gradient-to-r ${activeWord.className} bg-clip-text text-transparent`}
                  >
                    {activeWord.text}
                  </motion.span>
                </AnimatePresence>
                <span className="ml-2 text-slate-950">.</span>
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-700">
              We bring{" "}
              <span className="font-black text-blue-700">coding</span>,{" "}
              <span className="font-black text-violet-700">AI</span>,{" "}
              <span className="font-black text-emerald-700">robotics</span>, communication, and certification into one
              joyful learning ecosystem for schools and young learners.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="/login"
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-slate-950 px-7 font-black text-white shadow-[0_18px_38px_rgba(15,23,42,0.22)] transition hover:-translate-y-1 hover:bg-blue-700 hover:shadow-[0_22px_44px_rgba(37,99,235,0.28)]"
              >
                Start Learning <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </a>
              <a
                href="/#schools"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-xl border border-blue-200 bg-white/90 px-7 font-black text-blue-800 shadow-[0_18px_38px_rgba(37,99,235,0.12)] backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
              >
                Partner With Us
              </a>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-7 grid max-w-xl gap-3 sm:grid-cols-3">
              {["Live projects", "Mentor support", "Skill reports"].map((item) => (
                <div key={item} className="rounded-xl border border-blue-100 bg-white/82 px-4 py-3 text-sm font-black text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-blue-300 hover:text-blue-800">
                  {item}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative min-h-[430px] overflow-hidden rounded-[30px] border border-white/80 bg-white/76 p-5 shadow-[0_28px_80px_rgba(37,99,235,0.18)] backdrop-blur"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white/88 px-4 py-3 shadow-sm">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Impact board</p>
                <p className="mt-1 text-sm font-bold text-slate-500">Designed for measurable student growth</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Live ready</span>
            </div>
            <div className="grid h-full gap-4 sm:grid-cols-2">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ delay: 0.15 + index * 0.08 }}
                  className="group relative flex min-h-40 flex-col justify-between overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-[0_22px_48px_rgba(37,99,235,0.16)]"
                >
                  <div className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${metric.accent}`} />
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${metric.accent} text-white shadow-[0_14px_28px_rgba(37,99,235,0.18)] transition group-hover:scale-110`}>
                    <metric.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className={`bg-gradient-to-r ${metric.accent} bg-clip-text text-4xl font-black text-transparent`}>
                      {metric.value}
                    </p>
                    <p className="mt-2 text-sm font-black uppercase tracking-[0.12em] text-slate-500">{metric.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-700">Our belief</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">A school child should not wait for college to build something real.</h2>
            </div>
            <p className="text-lg font-semibold leading-8 text-slate-700">
              ADYAPAN exists to make future skills feel simple, exciting, and useful. We combine structured curriculum
              with hands-on projects so learners can see their ideas turn into visible outcomes.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {values.map((item) => (
              <motion.article
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_18px_50px_rgba(37,99,235,0.10)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(37,99,235,0.15)]"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${item.tone}`}>
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{item.copy}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-blue-100 bg-white/82 px-4 py-16 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-700">How we work</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">From curious first click to confident project showcase.</h2>
            <div className="mt-8 grid gap-4">
              {timeline.map(([title, copy], index) => (
                <motion.div
                  key={title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.35 }}
                  variants={fadeUp}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <span>
                    <strong className="block text-lg font-black">{title}</strong>
                    <span className="mt-1 block text-sm font-semibold leading-6 text-slate-600">{copy}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, rotate: -2, y: 20 }}
                whileInView={{ opacity: 1, rotate: 0, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex min-h-32 items-end rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5 shadow-[0_16px_42px_rgba(37,99,235,0.10)]"
              >
                <div>
                  <pillar.icon className="h-8 w-8 text-blue-700" />
                  <p className="mt-4 text-lg font-black">{pillar.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6">
        <div className="mx-auto max-w-7xl rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">Why it feels different</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">Modern learning with a human pulse.</h2>
              <p className="mt-5 text-base font-semibold leading-8 text-white/72">
                The platform supports digital dashboards, but the heart of ADYAPAN is mentorship, presentation practice,
                teamwork, and the spark a student feels when a project finally works.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Project demos instead of passive assignments",
                "Mentor-led support for tricky concepts",
                "Progress dashboards for students and parents",
                "Certifications that make effort visible"
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                  <p className="text-sm font-bold leading-6 text-white/86">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[28px] border border-blue-100 bg-white p-6 shadow-[0_20px_60px_rgba(37,99,235,0.12)] md:flex-row md:items-center md:p-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                <Target className="h-6 w-6" />
              </span>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">Next step</p>
            </div>
            <h2 className="mt-4 text-3xl font-black">Bring future skills into your learning journey.</h2>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a href="/dashboard" className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-4 font-black text-white transition hover:-translate-y-1">
              Open Dashboard <Rocket className="h-5 w-5" />
            </a>
            <a href="/#demo" className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 font-black text-slate-950 transition hover:-translate-y-1">
              Book Demo <GraduationCap className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
