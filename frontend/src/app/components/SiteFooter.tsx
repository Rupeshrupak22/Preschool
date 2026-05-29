"use client";

import { ArrowUp, Clock, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";

const learningPrograms = [
  "Future Skills Foundation (Class 5 to 8)",
  "Coding & AI Creators (Class 6 to 10)",
  "Robotics & Innovation Lab (Class 7 to 12)",
  "Career, Communication & Design (Class 9 to 12)"
];

const quickLinks = [
  ["About ADYAPAN", "/about"],
  ["Certifications", "/#certificates"],
  ["School Partnership", "/#schools"],
  ["LMS Dashboard", "/student-dashboard"],
  ["Login", "/login"],
  ["Contact Us", "/contact"],
  ["Principal Access", "/principal/dashboard"],
  ["Teacher Access", "/teacher/login"],
  ["Admin Access", "/login?next=/admin"]
];

const socials: [string, string, React.ComponentType<{ className?: string }>][] = [
  ["Instagram", "https://www.instagram.com/adyapanschool/", Instagram],
  ["LinkedIn", "https://www.linkedin.com/company/adyapan-edutech-pvt-ltd/posts/?feedView=all", Linkedin],
  ["YouTube", "https://www.youtube.com/@adyapan21", Youtube]
];

export default function SiteFooter() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Decorative top border */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16 md:px-8">
        {/* Main Grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img
                src="/adyapan-logo.svg"
                alt="ADYAPAN"
                className="h-14 w-14 shrink-0 rounded-full object-contain ring-2 ring-white/10"
              />
              <div>
                <span className="text-3xl font-black tracking-tight text-white">Adyapan</span>
                <span className="ml-2 inline-flex items-center rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-cyan-500/20">
                  Future Skills
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              We help students from Class 5 to 12 become confident creators through coding, AI, robotics,
              communication, design, and career-ready future skills.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(([label, href, Icon]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`ADYAPAN ${label}`}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-slate-400 ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-500/20 hover:text-cyan-400 hover:ring-cyan-500/30"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Learning Programs */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Learning Programs
            </h3>
            <div className="mt-1 h-0.5 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
            <ul className="mt-5 space-y-3">
              {learningPrograms.map((item) => (
                <li key={item}>
                  <a
                    href="/#curriculum"
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-400"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <div className="mt-1 h-0.5 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
            <ul className="mt-5 space-y-3">
              {quickLinks.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-400"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Get In Touch
            </h3>
            <div className="mt-1 h-0.5 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
            <ul className="mt-5 space-y-4">
              <li>
                <a href="mailto:support@adyapan.com" className="flex items-center gap-3 text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-400">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  support@adyapan.com
                </a>
              </li>
              <li>
                <a href="tel:+918292244709" className="flex items-center gap-3 text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-400">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  +91 82922 44709
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <MapPin className="h-4 w-4" />
                </div>
                India
              </li>
            </ul>

            {/* Hours Card */}
            <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                Business Hours
              </div>
              <p className="mt-2 text-sm text-slate-400">Mon – Sat: 09:00 AM – 5:00 PM</p>
              <p className="mt-1 text-sm text-red-400/80">Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © 2026 ADYAPAN Future Skills Platform. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="transition hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="transition hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/30 sm:bottom-8 sm:right-8 sm:h-12 sm:w-12"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
}
