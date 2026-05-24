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

const heroPrograms: { title: string; range: string; icon: Icon; accent: string; avatar: string }[] = [
  {
    title: "Pre School",
    range: "Nursery to KG",
    icon: Sparkles,
    accent: "from-rose-50 to-rose-100 border-rose-100",
    avatar: "PS"
  },
  {
    title: "Primary",
    range: "Class 1-5",
    icon: BookOpen,
    accent: "from-amber-50 to-yellow-100 border-amber-100",
    avatar: "P"
  },
  {
    title: "Middle",
    range: "Class 6 to 8",
    icon: School,
    accent: "from-cyan-50 to-teal-100 border-cyan-100",
    avatar: "M"
  },
  {
    title: "High School",
    range: "Class 9-12",
    icon: GraduationCap,
    accent: "from-indigo-50 to-violet-100 border-indigo-100",
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
    setStatus(response.ok ? "Request received. ADYAPAN will contact you soon." : data.error);
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-purple-200 via-pink-100 to-blue-200 text-slate-900 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg-hero.jpg')" }}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <section id="top" className="relative min-h-[92vh] overflow-hidden px-4 pt-10 md:px-6">
        <div className="absolute left-10 top-20 hidden h-20 w-20 rounded-full border-2 border-yellow-300 md:block animate-pulse" />
        <div className="absolute right-8 top-28 hidden h-16 w-16 rounded-full border-2 border-green-300 md:block animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 pb-10 lg:grid-cols-[0.95fr_1.18fr]">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border-2 border-white bg-white/60 backdrop-blur px-4 py-2 text-sm font-bold text-slate-900 shadow-[0_12px_32px_rgba(168,85,247,0.2)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 text-white shadow-lg font-bold">
                ady.
              </span>
              Nurturing Minds. Building Futures.
            </div>
            <h1 className="max-w-3xl text-6xl font-black leading-[0.96] tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent md:text-8xl">
              Big Dreams <span className="block">Start Small</span>
            </h1>
            <p className="mt-7 max-w-2xl text-xl font-bold leading-9 text-slate-900 md:text-2xl">
              Nurturing young minds from <span className="font-black text-purple-600">Pre School</span> and guiding them
              all the way to <span className="font-black text-purple-600">Class 12</span>.
            </p>
            <div className="mt-8 h-3 w-44 rounded-full bg-gradient-to-r from-yellow-300 via-pink-400 to-blue-400 shadow-lg" />
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#curriculum"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 px-7 font-bold text-white shadow-[0_18px_34px_rgba(34,197,94,0.3)] transition hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(34,197,94,0.4)]"
              >
                Explore Programs <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#demo"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full border-2 border-white bg-white/70 backdrop-blur px-7 font-bold text-slate-900 shadow-[0_14px_30px_rgba(255,255,255,0.3)] transition hover:-translate-y-1 hover:bg-white"
              >
                <CalendarDays className="h-5 w-5" /> Book a Free Class
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {heroPrograms.map((program, index) => (
              <a
                key={program.title}
                href="#curriculum"
                className={`group min-h-[430px] overflow-hidden rounded-[36px] border-2 bg-gradient-to-b from-white/80 to-white/60 backdrop-blur p-6 text-center shadow-[0_20px_55px_rgba(168,85,247,0.2)] transition hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(168,85,247,0.3)] border-white/50`}
              >
                <program.icon className="mx-auto h-14 w-14 text-purple-600 transition group-hover:scale-110 group-hover:text-pink-600" />
                <h3 className="mt-6 text-2xl font-black text-slate-900">{program.title}</h3>
                <p className="mt-2 text-lg font-bold text-slate-700">({program.range})</p>
                <div className="relative mx-auto mt-10 flex h-52 w-36 items-end justify-center">
                  <div className="absolute bottom-0 h-32 w-28 rounded-t-[46px] rounded-b-[24px] bg-gradient-to-b from-purple-500 to-pink-600 shadow-xl transition group-hover:scale-105" />
                  <div className="absolute bottom-24 h-24 w-24 rounded-full bg-gradient-to-b from-yellow-200 to-orange-300 shadow-lg" />
                  <div className="absolute bottom-[138px] h-9 w-24 rounded-t-full bg-slate-900" />
                  <div className="absolute bottom-[110px] flex gap-6">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-950" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-950" />
                  </div>
                  <div className="absolute bottom-[92px] h-2 w-8 rounded-full bg-green-400" />
                  <div className="absolute bottom-8 rounded-xl bg-white/95 px-3 py-2 text-sm font-black text-purple-600 shadow">
                    {program.avatar}
                  </div>
                  <div
                    className={`absolute ${index % 2 === 0 ? "left-0" : "right-0"} bottom-2 h-14 w-14 rounded-2xl bg-white/80 shadow-md`}
                  />
                </div>
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.7 }}
          className="relative mx-auto mb-10 grid max-w-6xl gap-4 rounded-[32px] border-2 border-white/60 bg-white/70 backdrop-blur p-5 shadow-[0_26px_70px_rgba(168,85,247,0.15)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {heroBenefits.map((benefit) => (
            <div key={benefit.title} className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-purple-100">
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${benefit.color}`}>
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
              <div className="mt-7 grid max-w-md grid-cols-2 gap-4">
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
                href="tel:+919000000000"
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


      {status && (
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








