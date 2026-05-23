"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  Code2,
  Cpu,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Menu,
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
  Users,
  X
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
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-saffron-600">{eyebrow}</p>
      <h2 className="text-3xl font-semibold leading-tight text-saffron-900 md:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-saffron-900/68 md:text-lg">{copy}</p>
    </motion.div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-saffron-900 outline-none transition placeholder:text-saffron-900/40 focus:border-saffron-400 focus:ring-4 focus:ring-saffron-500/15"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-saffron-900 outline-none transition focus:border-saffron-400 focus:ring-4 focus:ring-saffron-500/15"
    />
  );
}

function AdyapanLogo() {
  return (
    <a href="#top" className="flex items-center gap-3" aria-label="ADYAPAN School home">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 via-cyan-600 to-blue-950 text-sm font-black lowercase text-white shadow-[0_10px_24px_rgba(13,148,136,0.22)]">
        ady.
      </span>
      <span className="leading-none">
        <span className="block text-3xl font-black tracking-tight text-slate-950">Adyapan</span>
        <span className="ml-1 block text-[10px] font-black uppercase tracking-[0.42em] text-slate-500">School</span>
      </span>
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [status, setStatus] = useState("");
  const navItems = [
    { label: "Home", href: "#top" },
    { label: "Coding", href: "#curriculum" },
    { label: "Robotics & AI", href: "#curriculum" },
    { label: "VR/AR Lab", href: "#projects" },
    { label: "LMS", href: "/dashboard", active: true },
    { label: "Books", href: "#footer" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((index) => (index + 1) % testimonials.length);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(
    () => [
      ["20K+", "future learners"],
      ["250+", "school workshops"],
      ["94%", "project completion"],
      ["4.9/5", "parent rating"]
    ],
    []
  );

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
    <main className="min-h-screen overflow-hidden bg-ink text-saffron-900">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-blue-100 bg-white/95 shadow-[0_12px_35px_rgba(37,99,235,0.10)] backdrop-blur-xl">
        <div className="mx-auto flex h-[86px] max-w-7xl items-center justify-between gap-6 px-5 md:px-10">
          <AdyapanLogo />
          <div className="hidden items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-2 shadow-[0_10px_35px_rgba(37,99,235,0.12)] md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`relative rounded-full px-5 py-3 text-base font-black transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:text-white hover:shadow-[0_12px_24px_rgba(37,99,235,0.24)] ${
                  item.active ? "bg-blue-700 text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)]" : "text-slate-950"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
          <button
            className="rounded-xl border border-blue-200 bg-white p-2 text-slate-950 shadow-[0_10px_28px_rgba(37,99,235,0.12)] transition hover:bg-blue-700 hover:text-white md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Open navigation"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-saffron-900/10 bg-white px-4 py-4 md:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-black transition hover:bg-blue-700 hover:text-white ${
                    item.active ? "bg-blue-700 text-white" : "text-slate-950"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <section id="top" className="relative min-h-[92vh] overflow-hidden px-4 pt-32 md:px-6">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 pb-16 lg:grid-cols-[1.02fr_.98fr]">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-saffron-500/20 bg-white px-5 py-2.5 text-sm font-semibold text-saffron-700 shadow-[0_12px_32px_rgba(37,99,235,0.14)] transition hover:bg-saffron-500 hover:text-white">
              <Sparkles className="h-4 w-4" />
              India's Future Skills Platform for Classes 5-12
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-tight text-saffron-900 md:text-7xl">
              ADYAPAN <span className="rounded-2xl bg-saffron-500 px-3 text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)]">Future</span> Skills Platform
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-saffron-900/72 md:text-xl">
              Learn coding, AI, robotics, design, communication, and career skills through mentor-led journeys,
              certification exams, and school-ready future labs.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/signup"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-saffron-500 px-7 py-3.5 font-bold text-white shadow-[0_16px_34px_rgba(37,99,235,0.28)] transition hover:-translate-y-1 hover:bg-saffron-700 hover:shadow-[0_20px_42px_rgba(37,99,235,0.34)]"
              >
                Start Learning <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#demo"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-saffron-500 bg-white px-7 py-3.5 font-bold text-saffron-700 shadow-[0_14px_32px_rgba(37,99,235,0.1)] transition hover:-translate-y-1 hover:bg-saffron-500 hover:text-white hover:shadow-[0_18px_38px_rgba(37,99,235,0.25)]"
              >
                Book Free Demo <CalendarDays className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(([value, label]) => (
                <div key={label} className="group rounded-2xl border border-saffron-500/15 bg-white p-4 shadow-[0_12px_30px_rgba(37,99,235,0.1)] transition hover:-translate-y-1 hover:bg-saffron-500 hover:shadow-[0_18px_36px_rgba(37,99,235,0.25)]">
                  <p className="text-2xl font-black text-saffron-800 transition group-hover:text-white">{value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-saffron-900/52 transition group-hover:text-white/90">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-saffron-900/62">
              {["CBSE aligned", "Project first", "QR verified certificates", "Mentor reviews"].map((badge) => (
                <span key={badge} className="rounded-full border border-saffron-500/15 bg-white px-4 py-2 font-semibold text-saffron-800 shadow-[0_8px_20px_rgba(37,99,235,0.08)] transition hover:bg-saffron-500 hover:text-white">
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="relative rounded-[28px] border border-saffron-500/20 bg-white p-5 shadow-[0_28px_80px_rgba(37,99,235,0.18)]"
          >
            <div className="absolute left-8 right-8 top-8 h-px scan-line" />
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["AI Lab", Brain, "Build an AI revision coach"],
                ["Code Studio", Code2, "Ship portfolio websites"],
                ["Robotics", Cpu, "Automate real-world tasks"],
                ["Career OS", Trophy, "Badges, streaks, certificates"]
              ].map(([label, IconComponent, text]) => {
                const CardIcon = IconComponent as Icon;
                return (
                  <div key={String(label)} className="group rounded-2xl border border-saffron-500/15 bg-saffron-50/60 p-5 transition hover:-translate-y-1 hover:bg-saffron-500 hover:text-white hover:shadow-[0_18px_36px_rgba(37,99,235,0.22)]">
                    <CardIcon className="h-8 w-8 text-saffron-600 transition group-hover:text-white group-hover:scale-110" />
                    <p className="mt-5 text-lg font-bold transition group-hover:text-white">{String(label)}</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-saffron-900/60 transition group-hover:text-white/90">{String(text)}</p>
                  </div>
                );
              })}
            </div>
            <div className="group mt-4 rounded-2xl border border-saffron-500/20 bg-saffron-50 p-5 transition hover:bg-saffron-500 hover:text-white hover:shadow-[0_18px_38px_rgba(37,99,235,0.24)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-saffron-900/60 transition group-hover:text-white/85">Live success pulse</p>
                  <p className="mt-1 text-2xl font-black transition group-hover:text-white">1,284 projects certified</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-saffron-500/20 transition group-hover:bg-white/20">
                  <BarChart3 className="h-8 w-8 text-saffron-700 transition group-hover:text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="curriculum" className="px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-8 lg:grid-cols-[0.72fr_1fr]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.55 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-saffron-500/20 bg-white px-4 py-2 text-xs font-bold text-saffron-800 shadow-[0_10px_28px_rgba(37,99,235,0.1)]">
                <span className="h-2 w-2 rounded-full bg-saffron-500" />
                <span className="h-2 w-2 rounded-full bg-saffron-700" />
                <span className="h-2 w-2 rounded-full bg-saffron-500" />
                ADYAPAN Curriculum
              </div>
              <h2 className="text-4xl font-black leading-tight text-saffron-900 md:text-5xl">
                Skilling Curriculum <span className="text-saffron-500">for classrooms</span>
              </h2>
              <p className="mt-5 max-w-lg text-base font-medium leading-7 text-saffron-900/70">
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
                    className="rounded-2xl border border-saffron-500/15 bg-white p-5 text-center shadow-[0_16px_34px_rgba(37,99,235,0.12)] transition hover:-translate-y-1 hover:bg-saffron-500 hover:text-white"
                  >
                    <p className="text-2xl font-black">{value}</p>
                    <p className="mt-1 text-xs font-semibold">{label}</p>
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
              className="rounded-[24px] border border-saffron-500/12 bg-white p-6 shadow-[0_22px_55px_rgba(15,23,42,0.12)] transition hover:-translate-y-1 hover:border-saffron-500/30"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-saffron-500 text-white shadow-[0_14px_30px_rgba(37,99,235,0.26)]">
                  <Code2 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-saffron-900">Coding</h3>
                  <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-saffron-900/68">
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
                className={`group rounded-2xl border bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.1)] transition hover:-translate-y-1 hover:bg-saffron-500 hover:text-white hover:shadow-[0_22px_48px_rgba(37,99,235,0.24)] ${
                  index === 0 ? "border-saffron-400 ring-2 ring-saffron-300/35" : "border-saffron-500/12"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-saffron-500/20 bg-saffron-50 text-saffron-600 transition group-hover:border-white/25 group-hover:bg-white/20 group-hover:text-white">
                  <program.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-black text-saffron-900 transition group-hover:text-white">
                  {program.title}
                </h3>
                <p className="mt-4 min-h-16 text-sm font-medium leading-6 text-saffron-900/68 transition group-hover:text-white/90">
                  {program.copy}
                </p>
                <p className="mt-5 flex items-center gap-2 text-xs font-bold text-saffron-800 transition group-hover:text-white">
                  <span className="h-2 w-2 rounded-full bg-saffron-500 transition group-hover:bg-white" />
                  Available
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-9 rounded-[22px] border border-saffron-500/16 bg-white p-7 text-center shadow-[0_18px_48px_rgba(15,23,42,0.1)]">
            <h3 className="text-2xl font-black text-saffron-900">Ready to transform education?</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-saffron-900/66">
              Join schools and students using ADYAPAN's future skills curriculum to prepare learners for tomorrow.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="tel:+919000000000"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-saffron-500 px-6 text-sm font-black text-white shadow-[0_12px_26px_rgba(37,99,235,0.22)] transition hover:-translate-y-1 hover:bg-saffron-700"
              >
                WhatsApp
              </a>
              <a
                href="#demo"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-saffron-900 px-6 text-sm font-black text-white shadow-[0_12px_26px_rgba(15,23,42,0.16)] transition hover:-translate-y-1 hover:bg-saffron-700"
              >
                Schedule a Demo
              </a>
              <button
                onClick={() => setStatus("ADYAPAN brochure download will be connected with the final PDF.")}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-saffron-500/25 bg-white px-6 text-sm font-black text-saffron-800 transition hover:-translate-y-1 hover:bg-saffron-500 hover:text-white"
              >
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="path" className="bg-white/70 px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Learning path"
            title="Class-wise journeys from beginner to advanced"
            copy="Two clear pathways help students progress from fundamentals to capstones without losing momentum."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {paths.map((path) => (
              <div key={path.title} className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-saffron-700">{path.level}</p>
                    <h3 className="mt-1 text-2xl font-semibold">{path.title}</h3>
                  </div>
                  <GraduationCap className="h-10 w-10 text-saffron-600" />
                </div>
                <div className="mt-8 grid gap-4">
                  {path.steps.map((step, index) => (
                    <div key={step} className="grid grid-cols-[2.5rem_1fr] items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-saffron-300/30 bg-saffron-500/15 text-sm font-semibold">
                        {index + 1}
                      </span>
                      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                        <p className="font-medium">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {path.courses.map((course) => (
                    <span key={course} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-saffron-900/70">
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
            <div className="glass rounded-2xl p-6">
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-saffron-500/30 via-white/8 to-saffron-900/24 p-6">
                <div className="absolute right-4 top-4 rounded-lg bg-white p-2">
                  <QrCode className="h-8 w-8 text-saffron-900" />
                </div>
                <p className="text-sm uppercase tracking-[0.22em] text-saffron-700">ADYAPAN Credential</p>
                <h3 className="mt-12 text-3xl font-semibold">AI Builder Certificate</h3>
                <p className="mt-3 text-saffron-900/64">Awarded for project mastery, exam performance, and mentor review.</p>
                <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-saffron-900/62">
                  <span>ID ADY-CERT-2026</span>
                  <span>QR Verified</span>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setStatus("Certificate preview downloaded as a production-ready flow placeholder.")}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-50 font-semibold hover:bg-blue-100"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
                <a
                  href="/signup"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-saffron-500 font-semibold shadow-glow hover:bg-saffron-400"
                >
                  Exam Enrollment <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {certificates.map((certificate) => (
                <div key={certificate} className="rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-saffron-300/40">
                  <ShieldCheck className="h-8 w-8 text-saffron-600" />
                  <h3 className="mt-5 text-xl font-semibold">{certificate}</h3>
                  <p className="mt-3 text-sm leading-6 text-saffron-900/58">Exam, QR credential, mentor remark, and portfolio linkage.</p>
                  <a href="/signup" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-saffron-700">
                    Enroll <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="bg-white/70 px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Student projects"
            title="A portfolio-first showcase with real outcomes"
            copy="Students ship practical work across AI, websites, robotics, apps, smart farming, and IoT."
          />
          <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-4">
            {projects.map((project) => (
              <div key={project.title} className="glass min-w-[280px] snap-start rounded-2xl p-5 md:min-w-[360px]">
                <div className="flex aspect-video items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
                  <Play className="h-12 w-12 text-saffron-600" />
                </div>
                <p className="mt-5 text-sm text-saffron-700">{project.type}</p>
                <h3 className="mt-1 text-xl font-semibold">{project.title}</h3>
                <p className="mt-3 text-saffron-900/58">{project.stat}</p>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setStatus(`${project.title} GitHub workspace opened.`)}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 text-sm font-semibold hover:bg-blue-100"
                  >
                    <Github className="h-4 w-4" /> GitHub
                  </button>
                  <button
                    onClick={() => setStatus(`${project.title} demo launched.`)}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-saffron-500 text-sm font-semibold hover:bg-saffron-400"
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
                <div key={item} className="rounded-xl border border-slate-200 bg-white p-5">
                  <School className="h-7 w-7 text-saffron-600" />
                  <p className="mt-4 font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <form id="demo" onSubmit={(event) => submitLead(event, "school")} className="glass rounded-2xl p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-saffron-700">Partnership CTA</p>
            <h3 className="mt-3 text-2xl font-semibold">School onboarding form</h3>
            <div className="mt-6 grid gap-3">
              <Field name="name" placeholder="Coordinator name" required />
              <Field name="email" type="email" placeholder="Work email" required />
              <Field name="phone" placeholder="Phone" required />
              <Field name="school" placeholder="School name" required />
              <Field name="city" placeholder="City" required />
              <button className="mt-2 h-12 rounded-lg bg-saffron-500 font-semibold shadow-glow transition hover:bg-saffron-400">
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








