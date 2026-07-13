"use client";

import { motion } from "framer-motion";
import {
  Award,
  Brain,
  CheckCircle2,
  Code2,
  Cpu,
  GraduationCap,
  HeartHandshake,
  Newspaper,
  Lightbulb,
  Rocket,
  School,
  ShieldCheck,
  Target,
  Users
} from "lucide-react";
import AboutVideoHero from "@/components/about/AboutVideoHero";
import FloatingGallery from "@/components/about/FloatingGallery";
import ImpactBoard from "@/components/about/ImpactBoard";

type Icon = React.ComponentType<{ className?: string }>;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 }
};

const values: {
  title: string;
  copy: string;
  icon: Icon;
  iconGradient: string;
  glow: string;
}[] = [
  {
    title: "Learn by building",
    copy: "Students do not just watch lessons. They create apps, bots, websites, AI tools, and working prototypes.",
    icon: Cpu,
    iconGradient: "from-blue-500 to-blue-700",
    glow: "0 12px 40px rgba(37,99,235,0.35)",
  },
  {
    title: "Confidence before complexity",
    copy: "Every concept is broken into simple wins so students feel capable before the work becomes advanced.",
    icon: HeartHandshake,
    iconGradient: "from-rose-500 to-pink-600",
    glow: "0 12px 40px rgba(244,63,94,0.32)",
  },
  {
    title: "Real school readiness",
    copy: "Our programs fit classrooms, events, certifications, labs, and parent-visible progress.",
    icon: School,
    iconGradient: "from-emerald-500 to-green-600",
    glow: "0 12px 40px rgba(16,185,129,0.32)",
  },
  {
    title: "Safe modern technology",
    copy: "AI, coding, current affairs, and digital skills are taught with responsible habits and guided practice.",
    icon: ShieldCheck,
    iconGradient: "from-slate-800 to-slate-950",
    glow: "0 12px 40px rgba(15,23,42,0.4)",
  },
];

const pillars: {
  title: string;
  icon: Icon;
  accent: string;
  iconBg: string;
  cardBg: string;
}[] = [
  { title: "Coding", icon: Code2, accent: "group-hover:text-blue-600", iconBg: "bg-blue-600", cardBg: "from-blue-50/90 to-white" },
  { title: "Artificial Intelligence", icon: Brain, accent: "group-hover:text-violet-600", iconBg: "bg-violet-600", cardBg: "from-violet-50/90 to-white" },
  { title: "Current Affairs", icon: Newspaper, accent: "group-hover:text-emerald-600", iconBg: "bg-emerald-600", cardBg: "from-emerald-50/90 to-white" },
  { title: "Communication", icon: Users, accent: "group-hover:text-rose-600", iconBg: "bg-rose-600", cardBg: "from-rose-50/90 to-white" },
  { title: "Innovation", icon: Lightbulb, accent: "group-hover:text-amber-600", iconBg: "bg-amber-500", cardBg: "from-amber-50/90 to-white" },
  { title: "Certification", icon: Award, accent: "group-hover:text-cyan-600", iconBg: "bg-cyan-600", cardBg: "from-cyan-50/90 to-white" },
];

const timelineSteps = [
  { title: "Discover", copy: "Students explore future skills through stories, demos, and live challenges.", stepBg: "bg-blue-600", ring: "ring-blue-200", hoverBorder: "hover:border-blue-300" },
  { title: "Build", copy: "They create guided projects with mentors and classroom-friendly milestones.", stepBg: "bg-emerald-600", ring: "ring-emerald-200", hoverBorder: "hover:border-emerald-300" },
  { title: "Present", copy: "Every learner practices explaining ideas, results, and project decisions.", stepBg: "bg-violet-600", ring: "ring-violet-200", hoverBorder: "hover:border-violet-300" },
  { title: "Grow", copy: "Progress reports, certificates, and portfolio work help them move forward.", stepBg: "bg-amber-500", ring: "ring-amber-200", hoverBorder: "hover:border-amber-300" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden text-slate-950">
      <AboutVideoHero />

      <section className="px-6 py-12 md:px-10 lg:px-16 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-7xl"
        >
          <ImpactBoard />
        </motion.div>
      </section>

      <section id="our-belief" className="relative overflow-hidden px-6 py-24 md:px-10 lg:px-16 md:py-[120px]">
        <img
          src="/learning-doodles.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.05] select-none"
        />

        <div className="relative mx-auto max-w-[1400px]">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="inline-flex w-fit items-center rounded-full border border-blue-300/90 bg-blue-100/95 px-5 py-2 text-sm font-black uppercase tracking-[0.28em] text-cyan-800 antialiased shadow-sm backdrop-blur-md lg:col-start-1 lg:row-start-1"
            >
              Our belief
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="mt-6 max-w-[650px] text-[32px] font-black leading-[1.05] text-slate-950 antialiased sm:text-[44px] lg:col-start-1 lg:row-start-2 lg:mt-6 lg:text-[56px]"
            >
              A school child should not wait for college to build something real.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-6 rounded-3xl border border-blue-200/60 p-6 md:p-8 lg:col-start-2 lg:row-start-2 lg:mt-6 lg:self-start"
              style={{
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <p className="text-lg font-semibold leading-8 text-slate-800 antialiased">
                ADYAPAN exists to make future skills feel simple, exciting, and useful. We combine structured curriculum
                with hands-on projects so learners can see their ideas turn into visible outcomes.
              </p>
            </motion.div>
          </div>

          <div className="relative mt-14 md:mt-16 lg:mt-20">
            <div
              className="pointer-events-none absolute left-[6%] right-[6%] top-1/2 hidden h-px -translate-y-1/2 xl:block"
              style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.18) 15%, rgba(59,130,246,0.18) 85%, transparent)" }}
              aria-hidden
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {values.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative flex min-h-[280px] flex-col rounded-[28px] border border-blue-200/30 p-6 transition-shadow duration-300 hover:shadow-[0_28px_72px_rgba(15,23,42,0.12)] sm:min-h-[300px] xl:min-h-[320px]"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow: "0 20px 60px rgba(15,23,42,0.08)",
                  }}
                >
                  <span className="absolute right-5 top-5 text-sm font-black tracking-[0.2em] text-slate-900/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.iconGradient} text-white transition-transform duration-300 group-hover:scale-110`}
                    style={{ boxShadow: item.glow }}
                  >
                    <item.icon className="h-8 w-8" />
                  </span>

                  <h3 className="mt-6 text-xl font-black text-slate-950 antialiased">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm font-semibold leading-7 text-slate-700 antialiased">{item.copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FloatingGallery />

      <section className="relative overflow-hidden border-y border-blue-100 px-6 py-20 md:px-10 lg:px-16 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(circle at 8% 20%, rgba(244,63,94,0.08) 0%, transparent 42%)," +
              "radial-gradient(circle at 92% 70%, rgba(59,130,246,0.10) 0%, transparent 45%)," +
              "linear-gradient(180deg, #ffffff 0%, #f8fbff 50%, #ffffff 100%)",
          }}
        />
        <img
          src="/learning-doodles.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.035] select-none"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0">
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-sm font-black uppercase tracking-[0.2em] text-rose-700 shadow-sm lg:col-start-1 lg:row-start-1"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
              How we work
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-4 text-3xl font-black leading-[1.12] text-slate-950 sm:text-4xl lg:col-start-1 lg:row-start-2 lg:mt-4 lg:text-[2.65rem]"
            >
              Transforming Young Learners Into{" "}
              <span className="bg-gradient-to-r from-rose-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                Future Innovators.
              </span>
            </motion.h2>

            <div className="relative mt-8 space-y-4 pl-1 lg:col-start-1 lg:row-start-3 lg:mt-10">
              <div className="pointer-events-none absolute bottom-4 left-[1.35rem] top-4 w-0.5 bg-gradient-to-b from-blue-300 via-violet-300 to-amber-300" />
              {timelineSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: 6, transition: { duration: 0.25 } }}
                  className={`group relative flex gap-4 rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_16px_48px_rgba(37,99,235,0.14)] ${step.hoverBorder}`}
                >
                  <span
                    className={`relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-lg ring-4 ${step.stepBg} ${step.ring}`}
                  >
                    {index + 1}
                  </span>
                  <span className="relative z-[1]">
                    <strong className="block text-lg font-black text-slate-900 transition-colors group-hover:text-blue-800">
                      {step.title}
                    </strong>
                    <span className="mt-1 block text-sm font-semibold leading-6 text-slate-600">{step.copy}</span>
                  </span>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/40 to-blue-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </motion.div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:col-start-2 lg:row-start-3 lg:mt-16 lg:self-start">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 28, rotate: index % 2 === 0 ? -2 : 2 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    transition: { duration: 0.28 },
                  }}
                  className={`group relative flex min-h-[7.5rem] cursor-default overflow-hidden rounded-2xl border border-blue-100/80 bg-gradient-to-br ${pillar.cardBg} p-4 shadow-[0_12px_40px_rgba(37,99,235,0.10)] transition-shadow duration-300 hover:shadow-[0_20px_56px_rgba(37,99,235,0.18)]`}
                >
                  <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/60 blur-2xl transition-transform duration-500 group-hover:scale-150" />
                  <div>
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-[0_8px_24px_rgba(15,23,42,0.18)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${pillar.iconBg}`}
                    >
                      <pillar.icon className="h-5 w-5" />
                    </span>
                    <p className={`mt-3 text-base font-black leading-snug text-slate-900 transition-colors ${pillar.accent}`}>
                      {pillar.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 lg:px-16">
        <div
          className="mx-auto max-w-7xl rounded-[32px] p-6 md:p-10"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 35%, #ec4899 70%, #f97316 100%)",
            boxShadow: "0 28px 80px rgba(168,85,247,0.35)",
          }}
        >
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
                Why it feels different
              </p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Modern learning with a human pulse.
              </h2>
              <p className="mt-5 text-base font-semibold leading-8 text-white/80">
                The platform supports digital dashboards, but the heart of ADYAPAN is mentorship, presentation practice,
                teamwork, and the spark a student feels when a project finally works.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Project demos instead of passive assignments",
                "Mentor-led support for tricky concepts",
                "Progress dashboards for students and parents",
                "Certifications that make effort visible"
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="group flex items-start gap-3 rounded-2xl p-4 transition-shadow duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 100%)",
                    backdropFilter: "blur(24px) saturate(180%)",
                    WebkitBackdropFilter: "blur(24px) saturate(180%)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.4)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-yellow-200 drop-shadow-sm" />
                  </span>
                  <p className="text-sm font-bold leading-6 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10 lg:px-16">
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
