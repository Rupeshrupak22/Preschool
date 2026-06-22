"use client";

import { useCallback, useEffect, useState } from "react";

type Message = {
  id: string;
  sender_name: string;
  message: string;
  is_read: number;
  created_at: string;
};

type Recipient = {
  label: string;
  value: string;
};

interface MessageSystemProps {
  userEmail: string;
  userRole: "principal" | "teacher" | "student";
  recipients?: Recipient[];
}

export function MessageSystem({ userEmail, userRole, recipients = [] }: MessageSystemProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showInbox, setShowInbox] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const fetchMessages = useCallback(async () => {
    try {
      const endpoint = userRole === "student" ? "/api/messages?role=student" : "/api/messages";
      const url = `${endpoint}${endpoint.includes("?") ? "&" : "?"}email=${encodeURIComponent(userEmail)}&role=${userRole}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages ?? []);
      }
    } catch {}
  }, [userEmail, userRole]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // refresh every 3s (near real-time)
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSend = async () => {
    if (!messageText.trim() || !recipient) return;
    setSending(true);
    try {
      await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient,
          message: messageText,
          senderRole: userRole,
          senderEmail: userEmail,
        }),
      });
      setSent(true);
      setMessageText("");
      setTimeout(() => setSent(false), 2000);
      fetchMessages(); // refresh inbox
    } catch {}
    setSending(false);
  };

  const markRead = async (id: string) => {
    try {
      await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: 1 } : m)));
    } catch {}
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    if (diffMs < 0) return "Just now"; // future date = just sent
    if (diffMs < 60000) return "Just now";
    if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`;
    if (diffMs < 86400000) return `${Math.floor(diffMs / 3600000)}h ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Compose Message Bubble — only for principal and teacher */}
      {userRole !== "student" && (
        <div className="fixed bottom-6 right-6 z-50">
          {!showCompose && !showInbox ? (
            <button
              onClick={() => { setShowInbox(true); setShowCompose(false); }}
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-cyan-700 text-white shadow-lg transition hover:bg-slate-950 hover:scale-105"
              title="Messages"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white">{unreadCount}</span>
              )}
            </button>
          ) : showInbox ? (
            <div className="w-80 rounded-lg border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-black text-slate-950">Inbox ({messages.length})</h3>
                <div className="flex gap-2">
                  <button onClick={() => { setShowInbox(false); setShowCompose(true); }} className="text-xs font-bold text-cyan-700 hover:underline">Compose</button>
                  <button onClick={() => setShowInbox(false)} className="text-slate-400 hover:text-slate-700 text-lg">&times;</button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-400">No messages yet</p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => markRead(m.id)}
                      className={`cursor-pointer border-b border-slate-50 px-4 py-3 transition hover:bg-slate-50 ${!m.is_read ? "bg-cyan-50" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800">{m.sender_name}</p>
                        <p className="text-[10px] text-slate-400">{formatTime(m.created_at)}</p>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">{m.message}</p>
                      {!m.is_read && <span className="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-500" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="w-80 rounded-lg border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-black text-slate-950">Send Message</h3>
                <button onClick={() => { setShowCompose(false); setSent(false); }} className="text-slate-400 hover:text-slate-700 text-lg">&times;</button>
              </div>
              <div className="p-4">
                {sent ? (
                  <div className="py-4 text-center">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-sm font-bold text-green-700">Message sent!</p>
                    <button onClick={() => setSent(false)} className="mt-2 text-xs text-cyan-700 hover:underline">Send another</button>
                  </div>
                ) : (
                  <>
                    <select
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="">Select recipient...</option>
                      {recipients.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..."
                      rows={3}
                      className="mb-3 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      onClick={handleSend}
                      disabled={sending || !messageText.trim() || !recipient}
                      className="w-full rounded-lg bg-cyan-700 py-2 text-sm font-black text-white transition hover:bg-slate-950 disabled:opacity-50"
                    >
                      {sending ? "Sending..." : "Send Message"}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Student: just a floating bell with inbox */}
      {userRole === "student" && (
        <div className="fixed bottom-6 right-6 z-50">
          {!showInbox ? (
            <button
              onClick={() => setShowInbox(true)}
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-cyan-700 text-white shadow-lg transition hover:bg-slate-950 hover:scale-105"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white">{unreadCount}</span>
              )}
            </button>
          ) : (
            <div className="w-80 rounded-lg border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-black text-slate-950">Messages ({messages.length})</h3>
                <button onClick={() => setShowInbox(false)} className="text-slate-400 hover:text-slate-700 text-lg">&times;</button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-400">No messages yet</p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => markRead(m.id)}
                      className={`cursor-pointer border-b border-slate-50 px-4 py-3 transition hover:bg-slate-50 ${!m.is_read ? "bg-cyan-50" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800">{m.sender_name}</p>
                        <p className="text-[10px] text-slate-400">{formatTime(m.created_at)}</p>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">{m.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
