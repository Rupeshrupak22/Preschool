"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  FileText,
  Gamepad2,
  MonitorPlay,
  Play,
  Plus,
  Rocket,
  Search,
  TrendingUp,
  Upload,
  Users,
  Video,
} from "lucide-react";

// Re-export the ActiveView type so views accept the correct type
export type ActiveView = "home" | "syllabus" | "roadmap" | "leaderboard" | "doubts" | "students" | "attendance" | "recorded-video" | "live-class" | "class-progress" | "assign-homework" | "homework-submissions" | "upload-notes" | "quiz-console" | "skills-planner";

type TeacherStudent = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  classLevel?: string | null;
  schoolName?: string | null;
  createdAt?: string | null;
};

type TeacherHomework = {
  id: string;
  title?: string | null;
  subject?: string | null;
  classLevel?: string | null;
  dueDate?: string | null;
  priority?: string | null;
  status?: string | null;
  createdAt?: string | null;
};

type TeacherNote = {
  id: string;
  title?: string | null;
  subject?: string | null;
  classLevel?: string | null;
  fileName?: string | null;
  fileSize?: string | null;
  createdAt?: string | null;
};

function initials(name?: string | null) {
  return String(name || "T").trim().charAt(0).toUpperCase() || "T";
}

function cleanText(value: unknown, fallback = "") {
  return String(value ?? fallback).trim();
}

// ─── Recorded Video View ─────────────────────────────────────────────
export function RecordedVideoView({ setActiveView }: { setActiveView: (view: ActiveView) => void }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [description, setDescription] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    }
  }

  return (
    <section className="min-h-screen pb-28 lg:pb-8">
      <div className="flex h-[64px] items-center gap-4 bg-white px-5 md:px-8 lg:px-10 border-b border-gray-100">
        <button onClick={() => setActiveView("home")} className="rounded-full p-1">
          <ArrowLeft className="h-6 w-6 text-slate-950" />
        </button>
        <h1 className="text-xl font-bold text-slate-950">Upload Recorded Video</h1>
      </div>
      <div className="px-5 py-5 md:px-8 lg:px-10 space-y-5 max-w-2xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-4">
          <label className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 cursor-pointer hover:bg-blue-50 transition">
            <input type="file" accept="video/*" className="hidden" onChange={handleFileSelect} />
            <div className="text-center">
              {selectedFile ? (
                <>
                  <Video className="mx-auto h-8 w-8 text-green-500" />
                  <p className="mt-2 text-sm font-semibold text-green-600">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                </>
              ) : (
                <>
                  <Upload className="mx-auto h-8 w-8 text-blue-400" />
                  <p className="mt-2 text-sm font-semibold text-blue-600">Click to select video</p>
                  <p className="text-xs text-gray-400">MP4, MOV, WebM up to 500MB</p>
                </>
              )}
            </div>
          </label>

          <input className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-200" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video title" />
          <select className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-200" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option>Mathematics</option><option>Science</option><option>English</option>
          </select>
          <textarea className="min-h-20 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" />
          <button onClick={() => { if (!selectedFile) return; setUploaded(true); setTimeout(() => { setUploaded(false); setSelectedFile(null); setTitle(""); setDescription(""); }, 3000); }} disabled={!selectedFile || !title} className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-40">
            {uploaded ? "✓ Published to Library" : "Publish to Class Library"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Live Class Console View ─────────────────────────────────────────
export function LiveClassView({ setActiveView, schedule }: { setActiveView: (view: ActiveView) => void; schedule: Array<Record<string, string | number | null>> }) {
  return (
    <section className="min-h-screen pb-28 lg:pb-8">
      <div className="flex h-[64px] items-center gap-4 bg-white px-5 md:px-8 lg:px-10 border-b border-gray-100">
        <button onClick={() => setActiveView("home")} className="rounded-full p-1">
          <ArrowLeft className="h-6 w-6 text-slate-950" />
        </button>
        <h1 className="text-xl font-bold text-slate-950">Live Class Console</h1>
      </div>
      <div className="px-5 py-5 md:px-8 lg:px-10 space-y-5 max-w-3xl">
        {/* Start new live class */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <MonitorPlay className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-bold">Start a Live Session</h3>
              <p className="text-sm text-blue-100">Stream directly to classroom smartboards</p>
            </div>
          </div>
          <button className="mt-4 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-blue-700 shadow hover:bg-blue-50 transition">
            Go Live Now
          </button>
        </div>

        {/* Scheduled classes */}
        <h3 className="text-base font-bold text-gray-900">Scheduled Classes</h3>
        {schedule.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
            <Calendar className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm font-semibold text-gray-500">No scheduled classes</p>
            <p className="mt-1 text-xs text-gray-400">Schedule a live class to see it here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedule.map((item, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <Play className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{String(item.title || item.subject || "Class")}</p>
                  <p className="text-xs text-gray-500">{String(item.date || item.time || "")}</p>
                </div>
                <button className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">Join</button>
              </div>
            ))}
          </div>
        )}

        {/* Schedule new */}
        <button className="w-full rounded-xl border-2 border-dashed border-gray-200 py-4 text-sm font-semibold text-gray-500 hover:border-blue-300 hover:text-blue-600 transition">
          + Schedule New Class
        </button>
      </div>
    </section>
  );
}

// ─── Class Progress View ─────────────────────────────────────────────
export function ClassProgressView({ setActiveView, classBreakdown, students }: { setActiveView: (view: ActiveView) => void; classBreakdown: Array<{ classLevel: string; total: number }>; students: TeacherStudent[] }) {
  return (
    <section className="min-h-screen pb-28 lg:pb-8">
      <div className="flex h-[64px] items-center gap-4 bg-white px-5 md:px-8 lg:px-10 border-b border-gray-100">
        <button onClick={() => setActiveView("home")} className="rounded-full p-1">
          <ArrowLeft className="h-6 w-6 text-slate-950" />
        </button>
        <h1 className="text-xl font-bold text-slate-950">Class Progress</h1>
      </div>
      <div className="px-5 py-5 md:px-8 lg:px-10 space-y-5 max-w-4xl">
        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 text-center">
            <p className="text-2xl font-bold text-blue-600">{students.length}</p>
            <p className="text-xs font-medium text-gray-500">Total Students</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">{classBreakdown.length}</p>
            <p className="text-xs font-medium text-gray-500">Classes</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 text-center">
            <p className="text-2xl font-bold text-purple-600">68%</p>
            <p className="text-xs font-medium text-gray-500">Avg Completion</p>
          </div>
        </div>

        {/* Per-class breakdown */}
        <h3 className="text-base font-bold text-gray-900">Class-wise Breakdown</h3>
        {classBreakdown.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
            <TrendingUp className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm font-semibold text-gray-500">No class data yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {classBreakdown.map((item) => (
              <div key={item.classLevel} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">{item.classLevel}</p>
                  <span className="text-xs font-semibold text-blue-600">{item.total} students</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: `${Math.min(100, Math.max(20, item.total * 15))}%` }} />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">Syllabus progress</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Assign Homework View ────────────────────────────────────────────
export function AssignHomeworkView({
  setActiveView, form, setForm, classOptions, submitting, onSubmit, status, setActionMode,
}: {
  setActiveView: (view: ActiveView) => void;
  form: { subject: string; title: string; description: string; classLevel: string; dueDate: string; priority: string; fileName: string; fileSize: string };
  setForm: (patch: Partial<typeof form>) => void;
  classOptions: string[];
  submitting: boolean;
  onSubmit: () => void;
  status: string;
  setActionMode: (mode: "homework" | "note") => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => { setActionMode("homework"); }, [setActionMode]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setForm({ fileName: file.name, fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
    }
  }

  return (
    <section className="min-h-screen pb-28 lg:pb-8">
      <div className="flex h-[64px] items-center gap-4 bg-white px-5 md:px-8 lg:px-10 border-b border-gray-100">
        <button onClick={() => setActiveView("home")} className="rounded-full p-1">
          <ArrowLeft className="h-6 w-6 text-slate-950" />
        </button>
        <h1 className="text-xl font-bold text-slate-950">Assign Homework</h1>
      </div>
      <div className="px-5 py-5 md:px-8 lg:px-10 space-y-4 max-w-2xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-4">
          <input className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-200" value={form.title} onChange={(e) => setForm({ title: e.target.value })} placeholder="Homework title" />
          <div className="grid grid-cols-2 gap-3">
            <select className="h-11 rounded-xl border border-gray-200 px-3 text-sm font-medium outline-none" value={form.subject} onChange={(e) => setForm({ subject: e.target.value })}>
              <option>Mathematics</option><option>Science</option><option>English</option>
            </select>
            <select className="h-11 rounded-xl border border-gray-200 px-3 text-sm font-medium outline-none" value={form.classLevel} onChange={(e) => setForm({ classLevel: e.target.value })}>
              <option value="">All classes</option>
              {classOptions.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <input className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-200" value={form.dueDate} onChange={(e) => setForm({ dueDate: e.target.value })} placeholder="Due date (YYYY-MM-DD)" type="date" />

          {/* File upload */}
          <label className="flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition">
            <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.ppt,.pptx" className="hidden" onChange={handleFileSelect} />
            <Upload className="h-6 w-6 text-gray-400" />
            {selectedFile ? (
              <div>
                <p className="text-sm font-semibold text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-600">Attach worksheet or file (optional)</p>
                <p className="text-xs text-gray-400">PDF, DOC, PNG, JPG, PPT</p>
              </div>
            )}
          </label>

          <textarea className="min-h-24 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200" value={form.description} onChange={(e) => setForm({ description: e.target.value })} placeholder="Instructions / description" />
          <button onClick={async () => {
            if (selectedFile) {
              const fd = new FormData();
              fd.append("file", selectedFile);
              const uploadRes = await fetch("/api/teacher/upload", { method: "POST", body: fd });
              const uploadData = await uploadRes.json().catch(() => ({}));
              if (uploadRes.ok && uploadData.file?.url) {
                setForm({ fileName: uploadData.file.name, fileSize: uploadData.file.size });
                await fetch("/api/teacher/classroom", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "homework", subject: form.subject, title: form.title, description: form.description, classLevel: form.classLevel, dueDate: form.dueDate, priority: form.priority, fileName: uploadData.file.name, fileSize: uploadData.file.size, fileUrl: uploadData.file.url }),
                });
                setSelectedFile(null);
                onSubmit();
                return;
              }
            }
            onSubmit();
          }} disabled={submitting} className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-60">
            {submitting ? "Sending..." : "Send Homework to Students"}
          </button>
          {status && <p className="text-center text-xs font-semibold text-blue-700">{status}</p>}
        </div>
      </div>
    </section>
  );
}

// ─── Homework Submissions View ───────────────────────────────────────
export function HomeworkSubmissionsView({ setActiveView, homework }: { setActiveView: (view: ActiveView) => void; homework: TeacherHomework[] }) {
  return (
    <section className="min-h-screen pb-28 lg:pb-8">
      <div className="flex h-[64px] items-center gap-4 bg-white px-5 md:px-8 lg:px-10 border-b border-gray-100">
        <button onClick={() => setActiveView("home")} className="rounded-full p-1">
          <ArrowLeft className="h-6 w-6 text-slate-950" />
        </button>
        <h1 className="text-xl font-bold text-slate-950">Homework Submissions</h1>
        <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{homework.length} assigned</span>
      </div>
      <div className="px-5 py-5 md:px-8 lg:px-10 space-y-4 max-w-4xl">
        {homework.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
            <ClipboardList className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm font-semibold text-gray-500">No homework assigned yet</p>
            <p className="mt-1 text-xs text-gray-400">Assign homework from the Academics section</p>
          </div>
        ) : (
          <div className="space-y-3">
            {homework.map((hw) => (
              <div key={hw.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{hw.title || "Untitled"}</p>
                    <p className="mt-1 text-xs text-gray-500">{hw.subject} • {hw.classLevel || "All Classes"}</p>
                    {hw.dueDate && <p className="mt-1 text-xs text-orange-600 font-medium">Due: {hw.dueDate}</p>}
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${hw.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-600"}`}>
                    {hw.status || "Active"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Upload Notes View ───────────────────────────────────────────────
export function UploadNotesView({
  setActiveView, notes, form, setForm, classOptions, submitting, onSubmit, status, setActionMode,
}: {
  setActiveView: (view: ActiveView) => void;
  notes: TeacherNote[];
  form: { subject: string; title: string; description: string; classLevel: string; dueDate: string; priority: string; fileName: string; fileSize: string };
  setForm: (patch: Partial<typeof form>) => void;
  classOptions: string[];
  submitting: boolean;
  onSubmit: () => void;
  status: string;
  setActionMode: (mode: "homework" | "note") => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => { setActionMode("note"); }, [setActionMode]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setForm({ fileName: file.name, fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
      if (!form.title) setForm({ title: file.name.replace(/\.[^.]+$/, "") });
    }
  }

  return (
    <section className="min-h-screen pb-28 lg:pb-8">
      <div className="flex h-[64px] items-center gap-4 bg-white px-5 md:px-8 lg:px-10 border-b border-gray-100">
        <button onClick={() => setActiveView("home")} className="rounded-full p-1">
          <ArrowLeft className="h-6 w-6 text-slate-950" />
        </button>
        <h1 className="text-xl font-bold text-slate-950">Upload Notes</h1>
        <span className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{notes.length} uploaded</span>
      </div>
      <div className="px-5 py-5 md:px-8 lg:px-10 space-y-5 max-w-3xl">
        {/* Upload form */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Upload New Chapter Notes</h3>

          {/* File picker */}
          <label className="flex h-28 items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 cursor-pointer hover:bg-blue-50 transition">
            <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg" className="hidden" onChange={handleFileSelect} />
            <div className="text-center">
              {selectedFile ? (
                <>
                  <FileText className="mx-auto h-7 w-7 text-green-500" />
                  <p className="mt-1 text-sm font-semibold text-green-600">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                </>
              ) : (
                <>
                  <Upload className="mx-auto h-7 w-7 text-blue-400" />
                  <p className="mt-1 text-sm font-semibold text-blue-600">Click to select file</p>
                  <p className="text-xs text-gray-400">PDF, DOC, PPT, Images</p>
                </>
              )}
            </div>
          </label>

          <input className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-200" value={form.title} onChange={(e) => setForm({ title: e.target.value })} placeholder="Chapter title" />
          <div className="grid grid-cols-2 gap-3">
            <select className="h-11 rounded-xl border border-gray-200 px-3 text-sm font-medium outline-none" value={form.subject} onChange={(e) => setForm({ subject: e.target.value })}>
              <option>Mathematics</option><option>Science</option><option>English</option>
            </select>
            <select className="h-11 rounded-xl border border-gray-200 px-3 text-sm font-medium outline-none" value={form.classLevel} onChange={(e) => setForm({ classLevel: e.target.value })}>
              <option value="">All classes</option>
              {classOptions.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <textarea className="min-h-20 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200" value={form.description} onChange={(e) => setForm({ description: e.target.value })} placeholder="Description" />
          <button onClick={async () => {
            if (selectedFile) {
              const fd = new FormData();
              fd.append("file", selectedFile);
              const uploadRes = await fetch("/api/teacher/upload", { method: "POST", body: fd });
              const uploadData = await uploadRes.json().catch(() => ({}));
              if (uploadRes.ok && uploadData.file?.url) {
                setForm({ fileName: uploadData.file.name, fileSize: uploadData.file.size });
                await fetch("/api/teacher/classroom", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "note", subject: form.subject, title: form.title, description: form.description, classLevel: form.classLevel, fileName: uploadData.file.name, fileSize: uploadData.file.size, fileUrl: uploadData.file.url }),
                });
                setSelectedFile(null);
                onSubmit();
                return;
              }
            }
            onSubmit();
          }} disabled={submitting || !selectedFile} className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-40">
            {submitting ? "Uploading..." : "Upload & Notify Students"}
          </button>
          {status && <p className="text-center text-xs font-semibold text-blue-700">{status}</p>}
        </div>

        {/* Existing notes */}
        {notes.length > 0 && (
          <>
            <h3 className="text-base font-bold text-gray-900">Previously Uploaded</h3>
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                    <FileText className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{note.title || note.fileName || "Note"}</p>
                    <p className="text-[11px] text-gray-500">{note.subject} • {note.classLevel || "All"} {note.fileSize ? `• ${note.fileSize}` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ─── Quiz Console View ───────────────────────────────────────────────
export function QuizConsoleView({ setActiveView }: { setActiveView: (view: ActiveView) => void }) {
  const games = [
    { name: "Quiz Arena", description: "Multiple choice questions with timer", color: "blue", players: "Class-wide" },
    { name: "Word Unscramble", description: "Rearrange letters to form words", color: "emerald", players: "Individual" },
    { name: "Cognitive Puzzle", description: "Logic and pattern recognition", color: "purple", players: "Individual" },
    { name: "Syntax Blocks", description: "Arrange code blocks in order", color: "orange", players: "Teams" },
  ];

  return (
    <section className="min-h-screen pb-28 lg:pb-8">
      <div className="flex h-[64px] items-center gap-4 bg-white px-5 md:px-8 lg:px-10 border-b border-gray-100">
        <button onClick={() => setActiveView("home")} className="rounded-full p-1">
          <ArrowLeft className="h-6 w-6 text-slate-950" />
        </button>
        <h1 className="text-xl font-bold text-slate-950">Arcade & Quiz Console</h1>
      </div>
      <div className="px-5 py-5 md:px-8 lg:px-10 space-y-5 max-w-4xl">
        <p className="text-sm text-gray-600">Manage and push interactive quizzes and games to students.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {games.map((game) => (
            <div key={game.name} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${game.color}-50`}>
                  <Gamepad2 className={`h-5 w-5 text-${game.color}-600`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{game.name}</p>
                  <p className="text-xs text-gray-500">{game.players}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-600">{game.description}</p>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition">Preview</button>
                <button className="flex-1 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 transition">Push to Class</button>
              </div>
            </div>
          ))}
        </div>

        {/* MCQ Injector */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h3 className="text-sm font-bold text-gray-900">MCQ Injector — Quick Add</h3>
          <p className="mt-1 text-xs text-gray-500">Add questions that auto-populate into Quiz Arena</p>
          <div className="mt-4 space-y-3">
            <input className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200" placeholder="Type your question..." />
            <div className="grid grid-cols-2 gap-2">
              <input className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none" placeholder="Option A" />
              <input className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none" placeholder="Option B" />
              <input className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none" placeholder="Option C" />
              <input className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none" placeholder="Option D (correct)" />
            </div>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition">Add Question</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Future Skills Planner View ──────────────────────────────────────
export function SkillsPlannerView({ setActiveView }: { setActiveView: (view: ActiveView) => void }) {
  const skills = [
    { name: "Spoken English", status: "Active", weeks: 4, progress: 65 },
    { name: "Puzzle & Logic", status: "Active", weeks: 6, progress: 40 },
    { name: "Habit Tracker", status: "Coming Soon", weeks: 8, progress: 0 },
    { name: "Digital Literacy", status: "Coming Soon", weeks: 10, progress: 0 },
    { name: "General Knowledge", status: "Planned", weeks: 12, progress: 0 },
    { name: "Show & Tell", status: "Planned", weeks: 6, progress: 0 },
  ];

  return (
    <section className="min-h-screen pb-28 lg:pb-8">
      <div className="flex h-[64px] items-center gap-4 bg-white px-5 md:px-8 lg:px-10 border-b border-gray-100">
        <button onClick={() => setActiveView("home")} className="rounded-full p-1">
          <ArrowLeft className="h-6 w-6 text-slate-950" />
        </button>
        <h1 className="text-xl font-bold text-slate-950">Future Skills Planner</h1>
      </div>
      <div className="px-5 py-5 md:px-8 lg:px-10 space-y-5 max-w-4xl">
        <p className="text-sm text-gray-600">Plan and track classroom lesson manuals for modern skills.</p>

        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.name} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
                    <Rocket className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{skill.name}</p>
                    <p className="text-[11px] text-gray-500">{skill.weeks} weeks curriculum</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  skill.status === "Active" ? "bg-green-50 text-green-700" :
                  skill.status === "Coming Soon" ? "bg-yellow-50 text-yellow-700" :
                  "bg-gray-50 text-gray-600"
                }`}>{skill.status}</span>
              </div>
              {skill.progress > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>Progress</span>
                    <span className="font-semibold">{skill.progress}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: `${skill.progress}%` }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
