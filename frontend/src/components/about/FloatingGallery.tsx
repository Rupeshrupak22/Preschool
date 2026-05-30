"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface GalleryCard {
  id: string;
  label: string;
  sublabel: string;
  bgImage: string;
  bg: string;
  aspect: string;
  rotate: number;
  useCaption?: boolean;
}

const cards: GalleryCard[] = [
  { id: "c1", label: "ADYAPAN AI",         sublabel: "Your Learning Buddy — ask anything, homework, concepts, science facts!", bgImage: "/assets/inside-adyapan/adyapan-ai.png",         bg: "from-purple-100 via-violet-50 to-pink-100",   aspect: "aspect-[4/3]", rotate: -2   },
  { id: "c2", label: "AI Learning",         sublabel: "Explore artificial intelligence",                                         bgImage: "/assets/inside-adyapan/ai-learning.png",         bg: "from-purple-100 via-fuchsia-50 to-violet-200", aspect: "aspect-[3/4]", rotate: 2.5,  useCaption: true },
  { id: "c3", label: "Student Innovation",  sublabel: "Ideas that change the world",                                             bgImage: "/assets/inside-adyapan/student-innovation.png",  bg: "from-rose-100 via-pink-50 to-orange-100",    aspect: "aspect-[4/3]", rotate: -1.5 },
  { id: "c4", label: "Coding Studio",       sublabel: "Write code, build apps",                                                  bgImage: "/assets/inside-adyapan/coding-studio.png",       bg: "from-emerald-100 via-teal-50 to-green-200",  aspect: "aspect-[3/4]", rotate: 3,    useCaption: true },
  { id: "c5", label: "Mentor Sessions",     sublabel: "Learn from the best",                                                     bgImage: "/assets/inside-adyapan/mentor-sessions.png",     bg: "from-amber-100 via-yellow-50 to-orange-100", aspect: "aspect-[4/3]", rotate: -2.5 },
  { id: "c6", label: "Gamified",            sublabel: "Tests in game format — contests, quizzes & fun challenges",               bgImage: "/assets/inside-adyapan/gamified.png",            bg: "from-sky-100 via-blue-50 to-indigo-100",    aspect: "aspect-[4/3]", rotate: 1.5  },
];

function Card({ card }: { card: GalleryCard }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.05, rotate: 0, y: -8, transition: { duration: 0.3 } }}
      style={{ rotate: card.rotate }}
      className={`relative ${card.aspect} w-full cursor-pointer overflow-hidden rounded-3xl border-2 border-white/80 shadow-[0_12px_40px_rgba(168,85,247,0.12),0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-sm ${card.useCaption ? "flex flex-col" : ""}`}
    >
      {card.useCaption ? (
        <>
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.bgImage}
              alt={card.label}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </div>
          <div className="shrink-0 bg-white/70 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs font-black leading-tight text-slate-900">{card.label}</p>
            <p className="mt-0.5 text-[10px] font-semibold text-slate-500">{card.sublabel}</p>
          </div>
        </>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={card.bgImage}
          alt={card.label}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      )}
    </motion.div>
  );
}

function ParallaxColumn({ cards: colCards, speed, className = "" }: { cards: GalleryCard[]; speed: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rawY = useTransform(scrollYProgress, [0, 1], [0, speed]);
  const y = useSpring(rawY, { stiffness: 55, damping: 18, mass: 0.7 });
  return (
    <motion.div ref={ref} style={{ y }} className={`flex flex-col gap-4 ${className}`}>
      {colCards.map((card) => <Card key={card.id} card={card} />)}
    </motion.div>
  );
}

export default function FloatingGallery() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 50%, rgba(168,85,247,0.10) 0%, transparent 45%)," +
            "radial-gradient(circle at 85% 20%, rgba(236,72,153,0.09) 0%, transparent 40%)," +
            "radial-gradient(circle at 50% 90%, rgba(59,130,246,0.08) 0%, transparent 40%)," +
            "linear-gradient(135deg, #f5f0ff 0%, #fdf2f8 45%, #eff6ff 100%)",
        }}
      />
      <img src="/learning-doodles.svg" alt="" aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.04] select-none" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center md:mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-purple-700 shadow-sm backdrop-blur">
            ✨ Inside Adyapan
          </span>
          <h2 className="mt-4 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
            Where Learning Feels{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
              Like Play
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-slate-600">
            Creativity, AI, robotics, and real-world projects — all in one joyful classroom experience.
          </p>
        </motion.div>

        {/* Desktop: 3 parallax columns */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-5 md:items-start pb-16">
          <ParallaxColumn cards={[cards[0], cards[3]]} speed={-40} className="mt-8" />
          <ParallaxColumn cards={[cards[2], cards[5]]} speed={-70} className="mt-0" />
          <ParallaxColumn cards={[cards[1], cards[4]]} speed={-50} className="mt-14" />
        </div>

        {/* Mobile: 2-col grid */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
