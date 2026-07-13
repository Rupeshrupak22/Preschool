"use client";

import { motion } from "framer-motion";
import { FileText, Download, Bookmark, BookmarkCheck } from "lucide-react";
import type { NoteItem } from "@/lib/dashboard/dashboard-data";

interface Props {
  notes: NoteItem[];
}

const typeConfig = {
  pdf: { label: "PDF", color: "bg-red-100 text-red-700" },
  note: { label: "Note", color: "bg-blue-100 text-blue-700" },
  video: { label: "Video", color: "bg-purple-100 text-purple-700" },
};

const subjectColors: Record<string, string> = {
  Mathematics: "from-blue-500 to-indigo-600",
  Science: "from-emerald-500 to-teal-600",
  "Computer Science": "from-cyan-500 to-blue-600",
  "AI Basics": "from-purple-500 to-fuchsia-600",
  English: "from-rose-500 to-pink-600",
  "Current Affairs": "from-orange-500 to-amber-600",
};

export default function NotesLibrary({ notes }: Props) {
  return (
    <section id="notes">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-950">Notes & PDF Library</h2>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition">Browse All →</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {notes.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 text-sm font-semibold text-slate-500 shadow-[0_4px_16px_rgba(15,23,42,0.06)] sm:col-span-2 xl:col-span-3">
            No notes or PDFs have been uploaded yet.
          </div>
        ) : notes.map((note, i) => {
          const gradient = subjectColors[note.subject] ?? "from-slate-500 to-slate-600";
          const typeStyle = typeConfig[note.type];

          return (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3 }}
              className="group flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_8px_28px_rgba(15,23,42,0.10)]"
            >
              {/* Icon + Bookmark */}
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}>
                  <FileText className="h-5 w-5" />
                </div>
                <button className="text-slate-300 transition hover:text-yellow-500">
                  {note.bookmarked ? (
                    <BookmarkCheck className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-black text-slate-950 leading-snug">{note.title}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-400">{note.subject}</span>
                  <span className="text-slate-200">·</span>
                  <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase ${typeStyle.color}`}>
                    {typeStyle.label}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400">{note.uploadDate}</p>
                  <p className="text-[10px] font-semibold text-slate-400">{note.size}</p>
                </div>
                <button className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-1.5 text-[11px] font-black text-white transition hover:bg-blue-700">
                  <Download className="h-3 w-3" />
                  Download
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
