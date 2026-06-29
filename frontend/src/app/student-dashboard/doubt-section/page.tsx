"use client";

import { type FormEvent, useState } from "react";
import { CheckCircle2, HelpCircle, ImageIcon, MessageSquareText, Send } from "lucide-react";
import DashboardLayout from "@/components/student-dashboard/DashboardLayout";
import { useDashboardData } from "@/lib/dashboard/use-dashboard-data";

const subjects = ["Mathematics", "Science", "English", "Computer Science", "Future Skills"];

export default function DoubtSectionPage() {
  const data = useDashboardData();
  const [subject, setSubject] = useState(subjects[0]);
  const [question, setQuestion] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentFile(file);
      setAttachmentName(file.name);
    }
  }

  async function submitDoubt(event: FormEvent) {
    event.preventDefault();
    if (!question.trim()) {
      setStatus("Question is required.");
      return;
    }

    setSubmitting(true);
    setStatus("");

    let fileUrl: string | undefined;

    // Upload file if selected
    if (attachmentFile) {
      const fd = new FormData();
      fd.append("file", attachmentFile);
      const uploadRes = await fetch("/api/teacher/upload", { method: "POST", body: fd });
      const uploadData = await uploadRes.json().catch(() => ({}));
      if (uploadRes.ok && uploadData.file?.url) {
        fileUrl = uploadData.file.url;
      }
    }

    const response = await fetch("/api/student-doubts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        question,
        attachmentName,
        attachmentType: attachmentFile ? attachmentFile.type : undefined,
        attachmentUrl: fileUrl,
      }),
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus(payload.error ?? "Doubt could not be sent.");
      setSubmitting(false);
      return;
    }

    setQuestion("");
    setAttachmentName("");
    setAttachmentFile(null);
    setStatus("Doubt sent to your teacher.");
    setSubmitting(false);
  }

  const pending = data.doubts.filter((doubt) => doubt.status !== "solved").length;
  const solved = data.doubts.filter((doubt) => doubt.status === "solved").length;

  return (
    <DashboardLayout activeSection="/student-dashboard/doubt-section">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Student Doubts Solver</h1>
          <p className="mt-1 text-sm font-semibold text-slate-400">Ask your teacher and track replies from school records.</p>
        </div>

        <form onSubmit={submitDoubt} className="rounded-[1.75rem] border border-white/80 bg-white/85 p-5 shadow-[0_16px_44px_rgba(59,130,246,0.10)]">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-black uppercase text-slate-500">Subject</span>
              <select value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-1 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none">
                {subjects.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase text-slate-500">Attach File</span>
              <label className="mt-1 flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 cursor-pointer hover:border-blue-300 transition">
                <input type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleFileSelect} />
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-500 truncate">
                  {attachmentFile ? attachmentFile.name : "Choose PNG, JPG, PDF..."}
                </span>
              </label>
            </label>
          </div>
          <label className="mt-3 block">
            <span className="text-xs font-black uppercase text-slate-500">Question</span>
            <textarea value={question} onChange={(event) => setQuestion(event.target.value)} rows={4} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none" />
          </label>
          {status && <p className="mt-3 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-black text-blue-700">{status}</p>}
          <button disabled={submitting} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-sm font-black text-white shadow-lg shadow-blue-500/25 disabled:opacity-60">
            <Send className="h-4 w-4" />
            {submitting ? "Sending..." : "Send Doubt"}
          </button>
        </form>

        <div className="grid grid-cols-3 gap-2 rounded-[1.5rem] bg-white/80 p-2 text-center text-sm font-black text-slate-500">
          <span className="rounded-[1.2rem] bg-white py-3 text-indigo-600 shadow">All Doubts {data.doubts.length}</span>
          <span className="py-3">Pending {pending}</span>
          <span className="py-3">Solved {solved}</span>
        </div>

        <div className="space-y-4">
          {data.doubts.length === 0 ? (
            <div className="rounded-[1.5rem] bg-white/80 p-6 text-sm font-bold text-slate-500">No doubts submitted yet.</div>
          ) : data.doubts.map((doubt) => {
            const isSolved = doubt.status === "solved";
            return (
              <article key={doubt.id} className="rounded-[1.5rem] bg-white/90 p-5 shadow-[0_14px_34px_rgba(37,99,235,0.10)]">
                <div className="flex items-start gap-4">
                  <span className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isSolved ? "bg-emerald-50 text-emerald-600" : "bg-yellow-50 text-yellow-500"}`}>
                    {isSolved ? <CheckCircle2 className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-black text-slate-950">{doubt.subject}</h2>
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${isSolved ? "bg-emerald-50 text-emerald-600" : "bg-yellow-50 text-yellow-600"}`}>
                        {isSolved ? "Solved" : "Pending"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{doubt.createdAt}</p>
                  </div>
                </div>
                <p className="mt-4 text-base leading-7 text-slate-800">{doubt.question}</p>
                {doubt.attachmentName && (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-600">
                    <ImageIcon className="h-4 w-4 text-sky-500" />
                    {doubt.attachmentName}
                  </div>
                )}
                {isSolved && (
                  <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-blue-700">
                    <p className="flex items-center gap-2 font-black"><MessageSquareText className="h-4 w-4" /> Solved Explanation:</p>
                    <p className="mt-2 font-semibold leading-7">{doubt.teacherReply}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
