"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  CalendarDays,
  Code2,
  Cpu,
  BookOpen,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Mic,
  Palette,
  Play,
  QrCode,
  Rocket,
  School,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Star,
  Trophy,
  Users
} from "lucide-react";

type Icon = React.ComponentType<{ className?: string }>;

const skills: { title: string; icon: Icon; copy: string }[] = [
  { title: "Coding", icon: Code2, copy: "Scratch to Python, logic, algorithms, and product thinking." },
  { title: "Artificial Intelligence", icon: Brain, copy: "Prompting, ML concepts, AI tools, and ethical use cases." },
  { title: "Robotics", icon: Cpu, copy: "Sensors, Arduino, automation, robotics models, and lab builds." },
  { title: "Web Development", icon: Sparkles, copy: "HTML, CSS, React, APIs, hosting, and web portfolios." },
  { title: "App Development", icon: Smartphone, copy: "Mobile UI, no-code to code, app logic, and publishing." },
  { title: "Public Speaking", icon: Mic, copy: "Communication, pitching, debates, interviews, and stage confidence." },
  { title: "Graphic Design", icon: Palette, copy: "Visual hierarchy, branding, design systems, and creator tools." },
  { title: "Career Skills", icon: GraduationCap, copy: "Portfolios, resumes, problem solving, and career exploration." },
  { title: "Startup & Innovation", icon: Rocket, copy: "Ideation, MVPs, market research, and student entrepreneurship." },
  { title: "Cybersecurity", icon: ShieldCheck, copy: "Digital safety, networks, ethical hacking, and cyber hygiene." }
];

const paths = [
  {
    title: "Class 5-8",
    level: "Explorer Track",
    steps: ["Visual coding", "Creative web", "AI basics", "Robotics lab", "Portfolio demo day"],
    courses: ["Scratch Lab", "Junior Python", "AI for Kids", "Robotics Starter"]
  },
  {
    title: "Class 9-12",
    level: "Builder Track",
    steps: ["Python mastery", "Full-stack web", "AI projects", "Career portfolio", "Startup capstone"],
    courses: ["Python Pro", "React Studio", "AI Builder", "Innovation Lab"]
  }
];

const certificates = ["AI Certification", "Python Certification", "Web Development Certification", "Robotics Certification"];

const projects = [
  { title: "AI Study Buddy", type: "AI Projects", stat: "92% task accuracy" },
  { title: "School House Website", type: "Websites", stat: "Deployed live" },
  { title: "Line Follower Bot", type: "Robotics Models", stat: "Arduino build" },
  { title: "Attendance App", type: "Apps", stat: "QR enabled" },
  { title: "Smart Farming Kit", type: "Smart Farming", stat: "IoT sensors" },
  { title: "Water Quality Monitor", type: "IoT", stat: "Live dashboard" }
];

const curriculumPrograms: { title: string; icon: Icon; copy: string }[] = [
  {
    title: "Coding",
    icon: Code2,
    copy: "Introduce coding skills to young learners through logic, loops, projects, and computational thinking."
  },
  {
    title: "Robotics",
    icon: Cpu,
    copy: "Hands-on robotics activities that build creativity, sensors knowledge, and innovation confidence."
  },
  {
    title: "Artificial Intelligence",
    icon: Brain,
    copy: "AI concepts, smart tools, prompt thinking, and future-ready technology awareness for students."
  },
  {
    title: "Critical Thinking",
    icon: ShieldCheck,
    copy: "Break down problems, reason clearly, and develop structured algorithmic thinking skills."
  },
  {
    title: "Life Skills",
    icon: GraduationCap,
    copy: "Communication, teamwork, presentation, confidence, and responsible digital habits."
  },
  {
    title: "Finance & Entrepreneurship",
    icon: Rocket,
    copy: "Introduce money basics, startup thinking, innovation, and student entrepreneurship concepts."
  }
];

const events = [
  "AI Hackathon",
  "Coding Championship",
  "Student Founder Club",
  "Career Webinar",
  "Robotics Workshop"
];

const testimonials = [
  {
    name: "Ananya S.",
    role: "Class 8 Student",
    quote: "I built my first AI project and presented it confidently in school."
  },
  {
    name: "Rohit Mehta",
    role: "Parent",
    quote: "The roadmap feels premium, practical, and very clear for future careers."
  },
  {
    name: "Principal, Sunrise Public School",
    role: "School Partner",
    quote: "ADYAPAN made coding labs, teacher training, and certification easy to roll out."
  }
];

const heroPrograms: { title: string; range: string; icon: Icon; glow: string; avatar: string }[] = [
  {
    title: "Primary",
    range: "Class 1-5",
    icon: BookOpen,
    glow: "from-fuchsia-400/25 via-purple-300/18 to-cyan-300/22",
    avatar: "P"
  },
  {
    title: "Middle",
    range: "Class 6 to 8",
    icon: School,
    glow: "from-purple-400/25 via-pink-300/18 to-emerald-300/22",
    avatar: "M"
  },
  {
    title: "High School",
    range: "Class 9-12",
    icon: GraduationCap,
    glow: "from-cyan-400/25 via-blue-300/18 to-fuchsia-300/22",
    avatar: "HS"
  }
];

const heroBenefits: { title: string; icon: Icon; color: string }[] = [
  { title: "Play Based Learning", icon: Play, color: "bg-rose-100 text-rose-600" },
  { title: "Activity & Fun Worksheets", icon: CalendarDays, color: "bg-amber-100 text-amber-700" },
  { title: "Live Classes with Expert Teachers", icon: Users, color: "bg-cyan-100 text-cyan-700" },
  { title: "Safe & Friendly Environment", icon: ShieldCheck, color: "bg-indigo-100 text-indigo-700" }
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
};

function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.55 }}
      className="mx-auto mb-10 max-w-3xl text-center"
    >
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-purple-700">{eyebrow}</p>
      <h2 className="text-3xl font-black leading-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent md:text-5xl">{title}</h2>
      <p className="mt-4 text-base font-bold leading-7 text-slate-800 md:text-lg">{copy}</p>
    </motion.div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-lg border-2 border-white/60 bg-white/70 backdrop-blur px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-600 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/15"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="h-12 w-full rounded-lg border-2 border-white/60 bg-white/70 backdrop-blur px-4 text-sm text-slate-900 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/15"
    />
  );
}

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [status, setStatus] = useState("");
  const [leadSuccess, setLeadSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((index) => (index + 1) % testimonials.length);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  async function submitLead(event: FormEvent<HTMLFormElement>, type: "demo" | "school" | "newsletter") {
    event.preventDefault();
    setStatus("Submitting...");
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, type })
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error);
      return;
    }

    setStatus("");
    setLeadSuccess(true);
    event.currentTarget.reset();
  }

  return (
    <main className="min-h-screen overflow-hidden text-slate-900">
      <div className="pointer-events-none fixed inset-0 !z-0 bg-[url('/classroom-bg.svg')] bg-cover bg-center bg-no-repeat" />
      <div className="pointer-events-none fixed inset-0 !z-0 bg-gradient-to-b from-white/50 via-white/72 to-white/92" />
      <div className="pointer-events-none fixed inset-0 !z-0 bg-[radial-gradient(circle_at_17%_18%,rgba(245,158,11,0.20),transparent_22%),radial-gradient(circle_at_83%_24%,rgba(37,99,235,0.16),transparent_24%)]" />

      {/* Soft classroom overlays */}
      <div className="fixed inset-0 !z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-10 w-32 h-32 rounded-full border border-amber-300/40 bg-white/10 blur-[1px]" />
        <div className="absolute right-8 top-28 hidden h-16 w-16 rounded-full border border-sky-300/35 bg-white/10 md:block" />
        <div className="absolute -bottom-8 left-20 w-36 h-36 rounded-full bg-blue-200/20 blur-3xl" />
      </div>

      <section id="top" className="relative !z-10 min-h-[92vh] overflow-hidden px-4 pt-10 md:px-6">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 pb-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/75 bg-white/76 backdrop-blur-md px-4 py-2 text-sm font-bold text-slate-900 shadow-[0_14px_36px_rgba(15,23,42,0.12)]">
              <img src="/adyapan-logo.svg" alt="ADYAPAN" className="h-10 w-10 rounded-full object-contain shadow-lg" />
              Nurturing Minds. Building Futures.
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.96] tracking-tight text-slate-950 drop-shadow-[0_2px_0_rgba(255,255,255,0.9)] sm:text-6xl md:text-8xl">
              Big Dreams <span className="block text-blue-700">Start Small</span>
            </h1>
            <p className="mt-7 max-w-2xl rounded-3xl border border-white/70 bg-white/62 p-5 text-lg font-bold leading-8 text-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.10)] backdrop-blur-md sm:text-xl md:text-2xl md:leading-9">
              Nurturing young minds from <span className="font-black text-blue-700">Class 1</span> and guiding them
              all the way to <span className="font-black text-blue-700">Class 12</span>.
            </p>
            <div className="mt-8 h-3 w-44 rounded-full bg-gradient-to-r from-amber-300 via-sky-300 to-blue-500 shadow-lg" />
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <a
                href="#curriculum"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-700 to-sky-500 px-7 font-bold text-white shadow-[0_18px_34px_rgba(37,99,235,0.28)] transition hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(37,99,235,0.36)]"
              >
                Explore Programs <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#demo"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-white/80 bg-white/76 backdrop-blur-md px-7 font-bold text-slate-900 shadow-[0_14px_30px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:bg-white"
              >
                <CalendarDays className="h-5 w-5" /> Book a Free Class
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="grid gap-5 sm:grid-cols-3"
          >
            {heroPrograms.map((program, index) => (
              <a
                key={program.title}
                href="#curriculum"
                className="group relative min-h-[390px] overflow-hidden rounded-[30px] border border-white/80 bg-white/70 p-5 text-center shadow-[0_24px_70px_rgba(15,23,42,0.13)] backdrop-blur-xl transition duration-300 hover:-translate-y-3 hover:border-blue-200 hover:bg-white/86 hover:shadow-[0_30px_90px_rgba(37,99,235,0.20)] sm:min-h-[455px] sm:rounded-[34px] sm:p-6"
              >
                <div className={`absolute inset-x-4 bottom-4 top-24 rounded-[28px] bg-gradient-to-b ${program.glow} opacity-75 blur-sm transition duration-300 group-hover:scale-105 group-hover:opacity-100`} />
                <div className="absolute inset-0 rounded-[30px] ring-1 ring-inset ring-white/90 transition duration-300 group-hover:ring-fuchsia-300/70" />
                <div className="absolute inset-0 rounded-[30px] opacity-0 shadow-[inset_0_0_28px_rgba(168,85,247,0.24),0_0_34px_rgba(34,211,238,0.22)] transition duration-300 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center text-purple-600 drop-shadow-[0_0_16px_rgba(168,85,247,0.28)] transition duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:text-fuchsia-600 group-hover:drop-shadow-[0_0_22px_rgba(217,70,239,0.55)]">
                    <program.icon className="h-12 w-12 stroke-[2.4]" />
                  </div>
                  <h3 className="mt-5 text-2xl font-black leading-tight text-slate-950">{program.title}</h3>
                  <p className="mt-2 text-base font-black text-slate-600">({program.range})</p>
                </div>
                <div className="relative z-10 mx-auto mt-6 flex h-48 max-w-[168px] items-end justify-center sm:h-56">
                  <div className="absolute bottom-0 h-28 w-36 rounded-[32px] bg-white/72 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_34px_rgba(34,211,238,0.30)]" />
                  <img
                    src="/assets/school-boy.png"
                    alt={`${program.title} student`}
                    className="relative z-10 h-full w-auto object-contain drop-shadow-[0_22px_26px_rgba(88,28,135,0.20)] transition duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_24px_rgba(168,85,247,0.40)]"
                  />
                  <span
                    className={`absolute ${index % 2 === 0 ? "left-0" : "right-0"} bottom-8 z-20 rounded-2xl border border-white bg-white/92 px-3 py-2 text-sm font-black text-purple-700 shadow-[0_12px_28px_rgba(168,85,247,0.20)] transition duration-300 group-hover:-translate-y-1`}
                  >
                    {program.avatar}
                  </span>
                </div>
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.7 }}
          className="relative mx-auto mb-10 grid max-w-6xl gap-4 rounded-[32px] border border-white/75 bg-white/72 p-5 shadow-[0_26px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4"
        >
          {heroBenefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group flex min-h-24 items-center gap-4 rounded-2xl border border-white/80 bg-white/68 p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-[0_18px_36px_rgba(37,99,235,0.14)]"
            >
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${benefit.color} transition duration-300 group-hover:scale-110`}>
                <benefit.icon className="h-7 w-7" />
              </span>
              <p className="text-base font-bold leading-6 text-slate-900">{benefit.title}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <section id="curriculum" className="px-4 py-20 md:px-6 relative">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-8 lg:grid-cols-[0.72fr_1fr]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.55 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-purple-300 bg-white/70 backdrop-blur px-4 py-2 text-xs font-bold text-purple-700 shadow-[0_10px_28px_rgba(168,85,247,0.15)]">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                <span className="h-2 w-2 rounded-full bg-pink-400" />
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                ADYAPAN Curriculum
              </div>
              <h2 className="text-4xl font-black leading-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent md:text-5xl">
                Skilling Curriculum <span className="text-blue-600">for classrooms</span>
              </h2>
              <p className="mt-5 max-w-lg text-base font-bold leading-7 text-slate-800">
                Comprehensive learning pathways designed to equip students with essential 21st-century skills
                through interactive, practical, and engaging classroom methodology.
              </p>
          <div className="mt-7 grid max-w-md gap-4 sm:grid-cols-2">
                {[
                  ["20K+", "Students enrolled"],
                  ["250+", "School workshops"]
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border-2 border-white/60 bg-white/70 backdrop-blur p-5 text-center shadow-[0_16px_34px_rgba(168,85,247,0.15)] transition hover:-translate-y-1 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:text-white hover:border-white"
                  >
                    <p className="text-2xl font-black">{value}</p>
                    <p className="mt-1 text-xs font-bold">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              transition={{ delay: 0.08, duration: 0.55 }}
              className="rounded-[24px] border-2 border-white/60 bg-white/70 backdrop-blur p-6 shadow-[0_22px_55px_rgba(168,85,247,0.15)] transition hover:-translate-y-1 hover:border-white"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-[0_14px_30px_rgba(168,85,247,0.3)] font-bold">
                  <Code2 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Coding</h3>
                  <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-slate-800">
                    Introduce coding skills to young learners, promoting logical thinking, computational skills,
                    and confidence to build real digital projects.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {curriculumPrograms.map((program, index) => (
              <motion.div
                key={program.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-90px" }}
                transition={{ delay: index * 0.035, duration: 0.45 }}
                className={`group rounded-2xl border-2 bg-white/70 backdrop-blur p-6 shadow-[0_16px_40px_rgba(168,85,247,0.15)] transition hover:-translate-y-1 hover:bg-gradient-to-br hover:from-purple-400 hover:to-pink-400 hover:text-white hover:shadow-[0_22px_48px_rgba(168,85,247,0.3)] hover:border-white ${
                  index === 0 ? "border-purple-300 ring-2 ring-purple-200/50" : "border-white/60"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-purple-200 bg-purple-100 text-purple-600 transition group-hover:border-white/25 group-hover:bg-white/20 group-hover:text-white">
                  <program.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-black text-slate-900 transition group-hover:text-white">
                  {program.title}
                </h3>
                <p className="mt-4 min-h-16 text-sm font-bold leading-6 text-slate-800 transition group-hover:text-white/90">
                  {program.copy}
                </p>
                <p className="mt-5 flex items-center gap-2 text-xs font-bold text-purple-700 transition group-hover:text-white">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 transition group-hover:bg-white" />
                  Available
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-9 rounded-[22px] border-2 border-white/60 bg-white/70 backdrop-blur p-7 text-center shadow-[0_18px_48px_rgba(168,85,247,0.15)]">
            <h3 className="text-2xl font-black text-slate-900">Ready to transform education?</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-bold leading-6 text-slate-800">
              Join schools and students using ADYAPAN's future skills curriculum to prepare learners for tomorrow.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="tel:+918292244709"
                className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 text-sm font-bold text-white shadow-[0_12px_26px_rgba(168,85,247,0.3)] transition hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(168,85,247,0.4)]"
              >
                WhatsApp
              </a>
              <a
                href="#demo"
                className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-6 text-sm font-bold text-white shadow-[0_12px_26px_rgba(59,130,246,0.3)] transition hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(59,130,246,0.4)]"
              >
                Schedule a Demo
              </a>
              <button
                onClick={() => setStatus("ADYAPAN brochure download will be connected with the final PDF.")}
                className="inline-flex h-11 items-center justify-center rounded-full border-2 border-white/60 bg-white/70 backdrop-blur px-6 text-sm font-bold text-slate-900 transition hover:-translate-y-1 hover:bg-white hover:border-white"
              >
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="path" className="bg-gradient-to-r from-purple-200/50 via-pink-100/50 to-blue-200/50 px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Learning path"
            title="Class-wise journeys from beginner to advanced"
            copy="Two clear pathways help students progress from fundamentals to capstones without losing momentum."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {paths.map((path) => (
              <div key={path.title} className="rounded-2xl border-2 border-white/60 bg-white/70 backdrop-blur p-6 shadow-[0_16px_40px_rgba(168,85,247,0.15)] transition hover:-translate-y-1">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-purple-700">{path.level}</p>
                    <h3 className="mt-1 text-2xl font-black text-slate-900">{path.title}</h3>
                  </div>
                  <GraduationCap className="h-10 w-10 text-pink-600" />
                </div>
                <div className="mt-8 grid gap-4">
                  {path.steps.map((step, index) => (
                    <div key={step} className="grid grid-cols-[2.5rem_1fr] items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-300 to-pink-300 text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <div className="rounded-lg border-2 border-white/60 bg-white/70 backdrop-blur px-4 py-3">
                        <p className="font-bold text-slate-900">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {path.courses.map((course) => (
                    <span key={course} className="rounded-full bg-gradient-to-r from-purple-200 to-pink-200 px-3 py-1 text-sm font-bold text-slate-900">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="certificates" className="px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Certification"
            title="Enroll -> Take Exam -> Get Certified"
            copy="Premium credentials with QR verification, downloadable records, and exam enrollment workflows."
          />
          <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <div className="rounded-2xl border-2 border-white/60 bg-white/70 backdrop-blur p-6 shadow-[0_16px_40px_rgba(168,85,247,0.15)]">
              <div className="relative overflow-hidden rounded-xl border-2 border-white/60 bg-gradient-to-br from-purple-300/30 via-white/8 to-pink-300/24 p-6">
                <div className="absolute right-4 top-4 rounded-lg bg-white/80 p-2">
                  <QrCode className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-purple-700">ADYAPAN Credential</p>
                <h3 className="mt-12 text-3xl font-black text-slate-900">AI Builder Certificate</h3>
                <p className="mt-3 text-slate-800 font-bold">Awarded for project mastery, exam performance, and mentor review.</p>
                <div className="mt-10 flex items-center justify-between border-t-2 border-white/60 pt-4 text-sm font-bold text-slate-800">
                  <span>ID ADY-CERT-2026</span>
                  <span>QR Verified</span>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setStatus("Certificate preview downloaded as a production-ready flow placeholder.")}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/70 backdrop-blur border-2 border-white/60 font-bold text-slate-900 hover:bg-white transition"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
                <a
                  href="/signup"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 font-bold text-white shadow-[0_12px_26px_rgba(34,197,94,0.3)] hover:-translate-y-1 transition"
                >
                  Exam Enrollment <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {certificates.map((certificate) => (
                <div key={certificate} className="rounded-xl border-2 border-white/60 bg-white/70 backdrop-blur p-5 transition hover:-translate-y-1 hover:border-purple-300">
                  <ShieldCheck className="h-8 w-8 text-purple-600" />
                  <h3 className="mt-5 text-xl font-black text-slate-900">{certificate}</h3>
                  <p className="mt-3 text-sm font-bold leading-6 text-slate-800">Exam, QR credential, mentor remark, and portfolio linkage.</p>
                  <a href="/signup" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-purple-700">
                    Enroll <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="bg-gradient-to-r from-purple-200/50 via-pink-100/50 to-blue-200/50 px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Student projects"
            title="A portfolio-first showcase with real outcomes"
            copy="Students ship practical work across AI, websites, robotics, apps, smart farming, and IoT."
          />
          <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-4">
            {projects.map((project) => (
              <div key={project.title} className="min-w-[280px] snap-start rounded-2xl border-2 border-white/60 bg-white/70 backdrop-blur p-5 shadow-[0_16px_40px_rgba(168,85,247,0.15)] md:min-w-[360px] transition hover:-translate-y-1">
                <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-100 to-pink-100">
                  <Play className="h-12 w-12 text-purple-600" />
                </div>
                <p className="mt-5 text-sm font-bold text-purple-700">{project.type}</p>
                <h3 className="mt-1 text-xl font-black text-slate-900">{project.title}</h3>
                <p className="mt-3 font-bold text-slate-800">{project.stat}</p>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setStatus(`${project.title} GitHub workspace opened.`)}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-purple-100 text-sm font-bold text-purple-700 hover:bg-purple-200 transition"
                  >
                    <Github className="h-4 w-4" /> GitHub
                  </button>
                  <button
                    onClick={() => setStatus(`${project.title} demo launched.`)}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-sm font-bold text-white hover:shadow-lg transition"
                  >
                    <ExternalLink className="h-4 w-4" /> Demo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="schools" className="px-4 py-20 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_.85fr]">
          <div>
            <SectionTitle
              eyebrow="School partnerships"
              title="Future Skills Programs built for modern schools"
              copy="Deploy AI curriculum, coding labs, robotics workshops, teacher training, and certification dashboards."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {["AI Curriculum", "Coding Labs", "Robotics Workshops", "Teacher Training", "Future Skills Programs", "Analytics"].map((item) => (
                <div key={item} className="rounded-xl border-2 border-white/60 bg-white/70 backdrop-blur p-5 transition hover:-translate-y-1 hover:border-purple-300">
                  <School className="h-7 w-7 text-purple-600" />
                  <p className="mt-4 font-bold text-slate-900">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <form id="demo" onSubmit={(event) => submitLead(event, "school")} className="rounded-2xl border-2 border-white/60 bg-white/70 backdrop-blur p-6 shadow-[0_16px_40px_rgba(168,85,247,0.15)]">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">Partnership CTA</p>
            <h3 className="mt-3 text-2xl font-black text-slate-900">School onboarding form</h3>
            <div className="mt-6 grid gap-3">
              <Field name="name" placeholder="Coordinator name" required />
              <Field name="email" type="email" placeholder="Work email" required />
              <Field name="phone" placeholder="Phone" required />
              <Field name="school" placeholder="School name" required />
              <Field name="city" placeholder="City" required />
              <button className="mt-2 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-white shadow-[0_12px_26px_rgba(168,85,247,0.3)] transition hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(168,85,247,0.4)]">
                Request Partnership
              </button>
            </div>
          </form>
        </div>
      </section>

      <section id="events" className="bg-white/70 px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Community"
            title="Hackathons, competitions, clubs, webinars, and workshops"
            copy="The platform keeps students motivated through recurring events, badges, leaderboards, and founder-style challenges."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {events.map((event, index) => (
              <motion.div
                key={event}
                whileHover={{ y: -6 }}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-saffron-500/15 text-saffron-700">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{event}</h3>
                <p className="mt-3 text-sm leading-6 text-saffron-900/56">Live cohorts, challenge boards, and community recognition.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Reviews"
            title="Trusted by students, parents, and schools"
            copy="Auto-sliding feedback, rating proof, and video-style cards built into the premium platform surface."
          />
          <div className="glass mx-auto max-w-3xl rounded-2xl p-8 text-center">
            <div className="mx-auto flex justify-center gap-1 text-saffron-600">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="mt-6 text-2xl font-medium leading-10">"{testimonials[activeTestimonial].quote}"</p>
            <p className="mt-6 font-semibold">{testimonials[activeTestimonial].name}</p>
            <p className="mt-1 text-sm text-saffron-900/52">{testimonials[activeTestimonial].role}</p>
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.name}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`Show ${testimonial.name} review`}
                  className={`h-2.5 rounded-full transition ${activeTestimonial === index ? "w-8 bg-saffron-400" : "w-2.5 bg-blue-200"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {leadSuccess && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/35 px-4 backdrop-blur-sm">
          <motion.button
            type="button"
            onClick={() => setLeadSuccess(false)}
            initial={{ opacity: 0, scale: 0.55, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/80 bg-white p-7 text-center shadow-[0_30px_90px_rgba(168,85,247,0.35)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(250,204,21,0.28),transparent_25%),radial-gradient(circle_at_85%_20%,rgba(34,211,238,0.22),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(236,72,153,0.22),transparent_30%)]" />
            {[
              "left-8 top-8 bg-yellow-300",
              "left-16 bottom-10 bg-cyan-300",
              "right-10 top-10 bg-pink-400",
              "right-20 bottom-12 bg-purple-400",
              "left-1/2 top-5 bg-emerald-300",
            ].map((className, index) => (
              <motion.span
                key={className}
                initial={{ y: 18, opacity: 0, scale: 0.4 }}
                animate={{ y: [-8, -34, -10], opacity: [0, 1, 0.75], scale: [0.6, 1.1, 0.8] }}
                transition={{ delay: index * 0.08, duration: 1.2, repeat: 1 }}
                className={`absolute h-3 w-3 rounded-full ${className}`}
              />
            ))}
            <div className="relative">
              <motion.div
                initial={{ scale: 0.4 }}
                animate={{ scale: [0.4, 1.2, 1] }}
                transition={{ duration: 0.45 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-amber-300 text-white shadow-[0_18px_34px_rgba(217,70,239,0.35)]"
              >
                <Sparkles className="h-10 w-10" />
              </motion.div>
              <p className="mt-5 text-sm font-black uppercase tracking-[0.28em] text-purple-700">Boom</p>
              <h3 className="mt-2 text-4xl font-black text-slate-950">Congrats!</h3>
              <p className="mx-auto mt-3 max-w-xs text-sm font-bold leading-6 text-slate-600">
                Request received. ADYAPAN team will contact you soon.
              </p>
              <span className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 text-sm font-black text-white shadow-[0_14px_30px_rgba(168,85,247,0.28)]">
                Done
              </span>
            </div>
          </motion.button>
        </div>
      )}

      {status && !leadSuccess && (
        <button
          onClick={() => setStatus("")}
          className="fixed bottom-5 left-1/2 z-50 max-w-[92vw] -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-saffron-900 shadow-glass"
        >
          {status}
        </button>
      )}
    </main>
  );
}








