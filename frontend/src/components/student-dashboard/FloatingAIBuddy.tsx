"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, HelpCircle, Code2, FlaskConical, X } from "lucide-react";

const chips = [
  { label: "Explain Simply", icon: BookOpen },
  { label: "Homework Help",  icon: HelpCircle },
  { label: "Coding Help",    icon: Code2 },
  { label: "Science Facts",  icon: FlaskConical },
];

/* ── Inline CSS-robot SVG ─────────────────────────────────────────── */
function RobotSVG({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Antenna left */}
      <line x1="22" y1="10" x2="18" y2="3" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="2.5" r="2.5" fill="#f97316" />
      {/* Antenna right */}
      <line x1="42" y1="10" x2="46" y2="3" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
      <circle cx="46" cy="2.5" r="2.5" fill="#f97316" />
      {/* Halo / crown */}
      <ellipse cx="32" cy="10" rx="9" ry="3.5" fill="#fbbf24" opacity="0.9" />
      {/* Head */}
      <rect x="14" y="10" width="36" height="26" rx="10" fill="white" />
      {/* Head sheen */}
      <rect x="14" y="10" width="36" height="13" rx="10" fill="url(#headSheen)" opacity="0.25" />
      {/* Screen / face */}
      <rect x="18" y="15" width="28" height="16" rx="5" fill="#0f172a" />
      {/* Eyes */}
      <ellipse cx="25" cy="22" rx="3.5" ry="4" fill="#38bdf8" />
      <ellipse cx="39" cy="22" rx="3.5" ry="4" fill="#38bdf8" />
      {/* Eye glow */}
      <ellipse cx="25" cy="22" rx="2" ry="2.5" fill="#7dd3fc" opacity="0.7" />
      <ellipse cx="39" cy="22" rx="2" ry="2.5" fill="#7dd3fc" opacity="0.7" />
      {/* Smile */}
      <path d="M26 29 Q32 33 38 29" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Ears / headphones */}
      <rect x="9"  y="17" width="6" height="10" rx="3" fill="#f97316" />
      <rect x="49" y="17" width="6" height="10" rx="3" fill="#f97316" />
      {/* Body */}
      <rect x="18" y="37" width="28" height="18" rx="8" fill="white" />
      {/* Chest gem */}
      <circle cx="32" cy="46" r="4" fill="#06b6d4" opacity="0.85" />
      <circle cx="32" cy="46" r="2" fill="#e0f2fe" opacity="0.9" />
      {/* Left arm */}
      <rect x="8"  y="38" width="9" height="5" rx="2.5" fill="white" transform="rotate(-15 8 38)" />
      {/* Right arm */}
      <rect x="47" y="38" width="9" height="5" rx="2.5" fill="white" transform="rotate(15 47 38)" />
      {/* Legs */}
      <rect x="22" y="54" width="8" height="8" rx="4" fill="white" />
      <rect x="34" y="54" width="8" height="8" rx="4" fill="white" />
      {/* Gradient def */}
      <defs>
        <linearGradient id="headSheen" x1="14" y1="10" x2="50" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function FloatingAIBuddy() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Panel ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm sm:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.93 }}
              transition={{ type: "spring", damping: 22, stiffness: 260 }}
              className="fixed bottom-[108px] right-4 z-[91] w-[calc(100vw-32px)] max-w-[400px] overflow-hidden rounded-3xl text-white shadow-[0_24px_64px_rgba(139,92,246,0.55)]"
              style={{
                background:
                  "linear-gradient(135deg,#4f46e5 0%,#7c3aed 40%,#a855f7 70%,#ec4899 100%)",
              }}
            >
              {/* Blobs */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-8 left-12 h-28 w-28 rounded-full bg-white/8" />

              {/* Header row */}
              <div className="relative flex items-start justify-between gap-3 p-5 pb-2">
                <div className="flex items-start gap-3">
                  {/* Mini robot in panel */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400/40 to-pink-400/30 backdrop-blur-sm shadow-[0_4px_16px_rgba(255,255,255,0.15)]">
                    <RobotSVG size={44} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
                        ADYAPAN SMART
                      </p>
                      <span className="rounded-full bg-emerald-400/30 px-2 py-0.5 text-[9px] font-black text-emerald-200">
                        ✨ NEW
                      </span>
                    </div>
                    <h3 className="mt-0.5 text-lg font-black leading-tight">
                      Your Learning Buddy
                    </h3>
                    <p className="mt-0.5 text-xs font-semibold text-white/70">
                      Ask anything — homework, concepts, coding, science facts!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15 transition hover:bg-white/25"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Chips */}
              <div className="relative px-5 pb-3 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  {chips.map((chip) => (
                    <a
                      key={chip.label}
                      href="/student-dashboard/smart-lab"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
                    >
                      <chip.icon className="h-3.5 w-3.5 shrink-0 text-white/80" />
                      {chip.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="relative px-5 pb-5">
                <a
                  href="/student-dashboard/smart-lab"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-black text-purple-700 shadow-[0_8px_24px_rgba(255,255,255,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(255,255,255,0.35)]"
                >
                  Open Smart Lab
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Floating robot trigger ──────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-6 right-4 z-[91] flex flex-col items-center"
        aria-label="Open Smart Learning Buddy"
        style={{ filter: "drop-shadow(0 12px 28px rgba(168,85,247,0.65))" }}
      >
        {/* Glow disc behind robot */}
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-10 w-16 rounded-full blur-xl opacity-70"
          style={{ background: "radial-gradient(ellipse,#a855f7 0%,transparent 70%)" }}
        />

        {/* NEW badge */}
        {!open && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-black text-white shadow-md"
          >
            NEW
          </motion.span>
        )}

        {/* Robot or X */}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.18 }}
              className="flex h-16 w-16 items-center justify-center rounded-full text-white"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                boxShadow: "0 8px 32px rgba(168,85,247,0.6)",
              }}
            >
              <X className="h-7 w-7" />
            </motion.span>
          ) : (
            <motion.span
              key="robot"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.18 }}
              className="relative flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#ec4899 100%)",
                boxShadow: "0 8px 32px rgba(168,85,247,0.6)",
              }}
            >
              <RobotSVG size={46} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Shadow ellipse (ground shadow) */}
        <span className="mt-1 h-2 w-10 rounded-full bg-purple-400/30 blur-sm" />
      </motion.button>
    </>
  );
}
