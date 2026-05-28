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
  ["Contact Us", "/contact"]
];

const socials = [
  ["Instagram", "https://www.instagram.com/adyapanschool/", Instagram],
  ["LinkedIn", "https://www.linkedin.com/company/adyapan-edutech-pvt-ltd/posts/?feedView=all", Linkedin],
  ["YouTube", "https://www.youtube.com/@adyapan21", Youtube]
];

export default function SiteFooter() {
  return (
    <footer id="footer" className="relative overflow-hidden border-t border-blue-100 bg-white px-4 py-10 text-slate-950 md:px-6 md:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <img
              src="/adyapan-logo.svg"
              alt="ADYAPAN"
              className="h-16 w-16 shrink-0 rounded-full object-contain drop-shadow-[0_12px_18px_rgba(234,88,12,0.2)]"
            />
            <span className="text-4xl font-black leading-none tracking-tight text-slate-950 sm:text-5xl">Adyapan</span>
            <span className="inline-flex items-center rounded-full bg-cyan-600 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
              Future Skills
            </span>
          </div>
          <p className="mt-6 max-w-sm text-base font-medium leading-8 text-slate-700">
            We help students from Class 5 to 12 become confident creators through coding, AI, robotics,
            communication, design, and career-ready future skills.
          </p>
          <div className="mt-8 flex gap-3">
            {socials.map(([label, href, Icon]) => {
              const SocialIcon = Icon as React.ComponentType<{ className?: string }>;
              return (
                <a
                  key={String(label)}
                  href={String(href)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`ADYAPAN ${String(label)}`}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-700 shadow-[0_12px_28px_rgba(37,99,235,0.10)] transition hover:-translate-y-1 hover:bg-cyan-600 hover:text-white hover:shadow-[0_16px_34px_rgba(13,148,136,0.22)]"
                >
                  <SocialIcon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="inline-block border-b-2 border-cyan-600 pb-2 text-2xl font-black text-slate-950">
            Learning Programs
          </h3>
          <div className="mt-6 grid gap-4 text-base font-semibold leading-7 text-slate-950 md:mt-7 md:grid-cols-2 md:gap-4">
            {learningPrograms.map((item) => (
              <a key={item} href="/#curriculum" className="transition hover:translate-x-1 hover:text-cyan-700">
                {item}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="inline-block border-b-2 border-cyan-600 pb-2 text-2xl font-black text-slate-950">
            Quick Links
          </h3>
          <div className="mt-6 grid gap-4 text-base font-semibold text-slate-950 md:mt-7 md:grid-cols-2 md:gap-5">
            {quickLinks.map(([label, href]) => (
              <a key={label} href={href} className="transition hover:translate-x-1 hover:text-cyan-700">
                {label}
              </a>
            ))}
            <a
              href="/principal/dashboard"
              target="_blank"
              rel="noreferrer"
              className="transition hover:translate-x-1 hover:text-cyan-700"
            >
              Principal Access
            </a>
            <a href="/teacher/login" className="transition hover:translate-x-1 hover:text-cyan-700">
              Teacher Access
            </a>
            <a href="/login?next=/admin" className="transition hover:translate-x-1 hover:text-cyan-700">
              Admin Access
            </a>
          </div>
        </div>

        <div>
          <h3 className="inline-block border-b-2 border-cyan-600 pb-2 text-2xl font-black text-slate-950">
            Get In Touch
          </h3>
          <div className="mt-6 grid gap-4 text-base font-semibold text-slate-950 md:mt-7 md:gap-5">
            <a href="mailto:support@adyapan.com" className="flex items-center gap-3 transition hover:text-cyan-700">
              <Mail className="h-5 w-5 text-cyan-700" />
              support@adyapan.com
            </a>
            <a href="tel:+918292244709" className="flex items-center gap-3 transition hover:text-cyan-700">
              <Phone className="h-5 w-5 text-cyan-700" />
              +91 82922 44709
            </a>
            <span className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-cyan-700" />
              India
            </span>
          </div>
          <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-5 text-base text-slate-950 shadow-[0_20px_50px_rgba(37,99,235,0.12)]">
            <Clock className="mb-4 h-6 w-6 text-blue-700" />
            <p>Mon - Sat: 09:00 AM - 5:00 PM</p>
            <p className="mt-2 text-cyan-700">Sunday: Closed</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl justify-center border-t border-blue-100 pt-8 text-sm text-slate-500">
        <span>Copyright 2026 ADYAPAN Future Skills Platform. All rights reserved.</span>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-blue-700 text-white shadow-[0_18px_38px_rgba(37,99,235,0.30)] transition hover:-translate-y-1 hover:bg-cyan-600 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
        aria-label="Back to top"
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </footer>
  );
}

