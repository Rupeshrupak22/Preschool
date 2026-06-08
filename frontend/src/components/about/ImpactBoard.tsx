"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Brain, Target, Smartphone, GraduationCap } from "lucide-react";

const cards = [
  {
    id: 1,
    badge: "CLASS 1-12",
    heading: "Class 1–12",
    description: "Comprehensive curriculum and future skills learning programs for students from Class 1 to 12.",
    image: "/assets/inside-adyapan/box1.png",
    gradient: "linear-gradient(135deg, #2d66ff 0%, #6f2cff 100%)",
    glowColor: "rgba(45,102,255,0.55)",
    stripIcon: GraduationCap,
    stripLabel: "STUDENT ILLUSTRATION",
    textMinHeight: 186,
  },
  {
    id: 2,
    badge: "FUTURE SKILLS",
    heading: "25+ Future Skills",
    description: "Coding, AI, Current Affairs, Communication, Design Thinking, Financial Literacy, Entrepreneurship, Public Speaking and more.",
    image: "/assets/inside-adyapan/box2.png",
    gradient: "linear-gradient(135deg, #a02cff 0%, #ff4aa2 100%)",
    glowColor: "rgba(160,44,255,0.55)",
    stripIcon: Brain,
    stripLabel: "STUDENT USING LAPTOP",
  },
  {
    id: 3,
    badge: "REAL-WORLD LEARNING",
    heading: "Real-World Learning",
    description: "Hands-on projects, practical activities, challenges and industry-inspired learning experiences.",
    image: "/assets/inside-adyapan/box3.png",
    gradient: "linear-gradient(135deg, #24b84f 0%, #7be04f 100%)",
    glowColor: "rgba(36,184,79,0.55)",
    stripIcon: Target,
    stripLabel: "STUDENT BUILDING SOMETHING",
  },
  {
    id: 4,
    badge: "24/7 SUPPORT",
    heading: "24/7 Learning Support",
    description: "Access to learning resources, AI tools, mentors, assignments and learning content anytime.",
    image: "/assets/inside-adyapan/box4.png",
    gradient: "linear-gradient(135deg, #ff8230 0%, #ff4c9a 100%)",
    glowColor: "rgba(255,130,48,0.55)",
    stripIcon: Smartphone,
    stripLabel: "STUDENT WITH TABLET/HEADPHONES",
  },
];

function ImpactCard({ card }: { card: (typeof cards)[0] }) {
  const Icon = card.stripIcon;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -10, scale: 1.025 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[32px] p-6 cursor-pointer"
      style={{
        background: card.gradient,
        boxShadow: hovered
          ? `0 32px 80px ${card.glowColor}, 0 8px 24px rgba(0,0,0,0.12)`
          : "0 20px 60px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.35s ease",
      }}
    >
      {/* ── Spotlight follow cursor ── */}
      {hovered && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[32px]"
          style={{
            background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.13), transparent 70%)`,
          }}
        />
      )}

      {/* ── Shimmer sweep on hover ── */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[32px]"
        initial={{ x: "-100%", opacity: 0 }}
        animate={hovered ? { x: "150%", opacity: 1 } : { x: "-100%", opacity: 0 }}
        transition={{ duration: 0.65, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
        }}
      />

      {/* ── Top badge ── */}
      <div className="flex items-start justify-between gap-3">
        <motion.span
          whileHover={{ scale: 1.06 }}
          className="rounded-full px-4 py-1.5 text-[11px] font-bold tracking-[2px] text-white"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.32)",
          }}
        >
          {card.badge}
        </motion.span>
      </div>

      {/* ── Heading + description + image ── */}
      <div className="mt-4 flex items-end justify-between gap-4">
        <div
          className="flex-1 min-w-0"
          style={card.textMinHeight ? { minHeight: card.textMinHeight } : undefined}
        >
          <h3 className="text-[42px] font-extrabold leading-[1.1] text-white tracking-tight">
            {card.heading}
          </h3>
          <p className="mt-3 text-[15px] font-semibold leading-[1.65] text-white/90 max-w-[260px]">
            {card.description}
          </p>
        </div>

        {/* Circular student image */}
        <motion.div
          animate={hovered ? { scale: 1.08, rotate: 2 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative h-[210px] w-[210px] shrink-0 sm:h-[220px] sm:w-[220px]"
        >
          <div
            className="absolute inset-0 rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.2)]"
            style={{ border: "2px solid rgba(255,255,255,0.4)" }}
          />
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <Image
              src={card.image}
              alt={card.stripLabel}
              fill
              className="object-cover object-center"
              sizes="220px"
              priority={card.id <= 2}
            />
          </div>
        </motion.div>
      </div>

      {/* ── Bottom glass strip ── */}
      <motion.div
        animate={hovered ? { y: -3, background: "rgba(255,255,255,0.22)" } : { y: 0, background: "rgba(255,255,255,0.12)" }}
        transition={{ duration: 0.25 }}
        className="mt-5 flex items-center gap-3 rounded-2xl px-4 py-3"
        style={{
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.25)",
        }}
      >
        <Icon className="h-5 w-5 shrink-0 text-white/90" />
        <span className="text-[11px] font-bold tracking-[2px] text-white/95 uppercase">
          {card.stripLabel}
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function ImpactBoard() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f8fbff 0%, #f4f8ff 100%)" }}
    >
      <img
        src="/learning-doodles.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-[0.045]"
      />

      <div className="relative w-full">
        {/* Header panel */}
        <div
          className="mb-6 flex items-center justify-between rounded-[28px] px-7 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          style={{
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(10px)",
            border: "1px solid #dfe7f7",
          }}
        >
          <div>
            <p className="text-[15px] font-extrabold uppercase tracking-[4px]" style={{ color: "#2353ff" }}>
              IMPACT BOARD
            </p>
            <p className="mt-1 text-[20px] font-bold" style={{ color: "#5f6f8d" }}>
              Designed for measurable student growth
            </p>
          </div>
          <span
            className="rounded-full px-7 py-3 text-[15px] font-bold"
            style={{ background: "#dff5e7", color: "#17864a" }}
          >
            Live ready
          </span>
        </div>

        {/* 2×2 grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {cards.map((card) => (
            <ImpactCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
