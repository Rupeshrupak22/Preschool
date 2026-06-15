"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

const stats = [
  {
    heading: "Coding to Creativity",
    subheading: "Future Skills Learning",
    subheadingColor: "text-cyan-300",
  },
  {
    heading: "AI + Human",
    subheading: "Learning Support",
    subheadingColor: "text-violet-300",
  },
  {
    heading: "Real-World",
    subheading: "Hands-On Projects",
    subheadingColor: "text-emerald-300",
  },
  {
    heading: "Beyond Academics",
    subheading: "Industry Skills",
    subheadingColor: "text-amber-300",
  },
];

const rotatingWords = [
  { text: "Problem Solver", className: "from-rose-400 to-amber-300" },
  { text: "Creator", className: "from-sky-400 to-cyan-300" },
  { text: "Brave", className: "from-violet-500 to-fuchsia-400" },
];

const colorLoop = ["#0ea5e9", "#14b8a6", "#7c3aed", "#e11d48", "#eab308", "#ffffff"];

function ColorLoopWord({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      animate={{ color: [...colorLoop, colorLoop[0]] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="antialiased drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)]"
    >
      {children}
    </motion.span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" as const },
  },
};

export default function AboutVideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % rotatingWords.length);
    }, 1600);

    return () => window.clearInterval(timer);
  }, []);

  const activeWord = rotatingWords[wordIndex];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[260px] overflow-hidden md:min-h-[420px] lg:min-h-[520px]"
    >
      {/* Layer 1 — background video */}
      <motion.div className="absolute inset-0 z-0 overflow-hidden" style={{ y: videoY }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          src="/videos/about-video.mp4"
          className="absolute inset-0 h-full w-full scale-[1.03] object-cover blur-[4px] opacity-70"
          aria-hidden
        />
      </motion.div>

      {/* Layer 2 — readability overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,10,25,0.42) 0%, rgba(5,10,25,0.62) 100%)",
        }}
      />

      {/* Layer 3 — content */}
      <div className="relative z-[2] flex min-h-full flex-col">
        <div className="flex flex-col px-8 pb-4 pt-0 md:px-8 md:pb-6 md:pt-8 lg:pt-12">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.14, delayChildren: 0.15 }}
            className="mx-auto w-full max-w-[1400px] text-center md:text-left"
          >
            <motion.div
              variants={fadeUp}
              animate={{ y: [0, -5, 0] }}
              transition={{
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="inline-flex items-center rounded-full border border-white/45 bg-white/25 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-white antialiased shadow-[0_8px_32px_rgba(0,0,0,0.22)] backdrop-blur-md md:text-sm"
            >
              ABOUT ADYAPAN
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-4 max-w-4xl text-[24px] font-black leading-[1.08] text-white antialiased drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] sm:text-[28px] md:mt-5 md:text-[36px] lg:text-[44px] xl:text-[52px]"            >
              <ColorLoopWord>Empowering</ColorLoopWord> Students
              <br />
              For The <ColorLoopWord>Future</ColorLoopWord>
              <br />
              Helps Them To Become
              <span className="relative mt-1 block min-h-[1.2em] sm:mt-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeWord.text}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.38, ease: "easeOut" }}
                    className={`inline-block bg-gradient-to-r ${activeWord.className} bg-clip-text font-black text-transparent antialiased`}
                  >
                    {activeWord.text}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-[700px] text-base font-semibold leading-relaxed text-white antialiased md:mx-0 md:mt-5 md:text-lg lg:text-[22px] lg:leading-[1.65]"
            >
              ADYAPAN delivers future-ready education through AI-powered learning,
              project-based experiences, and technology-driven pathways that build
              real future skills — helping every student grow with confidence,
              creativity, and purpose.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-5 flex flex-col items-center gap-2.5 sm:flex-row md:mt-6 md:justify-start md:gap-3"
            >
              <a
                href="/login"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-slate-950 shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
              >
                Explore Programs
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#our-belief"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/35 bg-white/12 px-6 text-sm font-bold text-white shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating stats panel */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-auto w-full max-w-[1400px] px-8 pb-8 md:pb-10 lg:pb-12"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.heading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 + index * 0.08 }}
                className="group flex aspect-[3/2] flex-col justify-center rounded-[30px] border border-white/20 bg-white/10 px-4 py-3.5 text-left shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-white/15 md:px-5 md:py-4 lg:px-6"
              >
                <span className="text-[22px] font-black leading-[1.08] tracking-tight text-white antialiased drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-[1.02] md:text-[26px] lg:text-[30px] xl:text-[34px]">
                  {stat.heading}
                </span>
                <span
                  className={`mt-1.5 text-xs font-bold leading-snug antialiased md:mt-2 md:text-sm lg:text-base xl:text-lg ${stat.subheadingColor}`}
                >
                  {stat.subheading}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
