"use client";

import { FormEvent, useState } from "react";
import { Clock3, Instagram, Linkedin, Mail, MessageSquare, PhoneCall, Send, Sparkles } from "lucide-react";

type Icon = React.ComponentType<{ className?: string }>;

const contactCards: { label: string; value: string; href: string; icon: Icon }[] = [
  { label: "Phone", value: "+91 81791 24566", href: "tel:+918179124566", icon: PhoneCall },
  { label: "Email", value: "support@adyapan.com", href: "mailto:support@adyapan.com", icon: Mail },
  { label: "Hours", value: "Mon-Sat, 11 AM - 8 PM", href: "#contact-form", icon: Clock3 }
];

const contactFaqs = [
  "How do I enroll in a course?",
  "Are classes live or recorded?",
  "Do you provide placement support?"
];

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Submitting...");

    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, type: "demo" })
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || "Please check the form and try again.");
      return;
    }

    setStatus("");
    setSuccess(true);
    event.currentTarget.reset();
  }

  return (
    <main className="min-h-screen bg-[#f3eee8] text-slate-900">
      <section className="relative overflow-hidden">
        <div className="bg-[#10111d] px-4 pb-28 pt-16 text-center text-white md:px-6">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-amber-400">Get in touch</p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            We're Here to Help
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-bold leading-7 text-white/68 md:text-lg">
            Have a question about our courses, classes, or school support? Reach out - our team responds within 24 hours.
          </p>
        </div>

        <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-20 md:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {contactCards.map((card) => (
              <a
                key={card.label}
                href={card.href}
                className="flex min-h-32 flex-col items-center justify-center rounded-xl bg-white px-6 py-6 text-center shadow-[0_10px_22px_rgba(15,23,42,0.14)] transition hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(15,23,42,0.18)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <card.icon className="h-6 w-6" />
                </span>
                <span className="mt-4 text-xs font-black uppercase text-slate-400">{card.label}</span>
                <span className="mt-1 text-sm font-black text-slate-900">{card.value}</span>
              </a>
            ))}
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
            <form id="contact-form" onSubmit={submitContact} className="w-full">
              <h2 className="text-2xl font-black text-[#111827] md:text-3xl">Send Us a Message</h2>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-xs font-black text-slate-600">
                  Full Name *
                  <input
                    name="name"
                    required
                    placeholder="Your name"
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  />
                </label>
                <label className="grid gap-2 text-xs font-black text-slate-600">
                  Email *
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@email.com"
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  />
                </label>
                <label className="grid gap-2 text-xs font-black text-slate-600 sm:col-span-2">
                  Phone
                  <input
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  />
                </label>
                <label className="grid gap-2 text-xs font-black text-slate-600 sm:col-span-2">
                  Subject *
                  <select
                    name="interest"
                    required
                    defaultValue=""
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="" disabled>
                      Select a topic
                    </option>
                    <option value="Course enrollment">Course enrollment</option>
                    <option value="Live class support">Live class support</option>
                    <option value="School partnership">School partnership</option>
                    <option value="Placement support">Placement support</option>
                  </select>
                </label>
                <label className="grid gap-2 text-xs font-black text-slate-600 sm:col-span-2">
                  Message *
                  <textarea
                    name="message"
                    required
                    placeholder="Tell us how we can help..."
                    className="min-h-32 resize-none rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  />
                </label>
              </div>
              <button className="mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 text-sm font-black text-white shadow-[0_14px_24px_rgba(249,115,22,0.24)] transition hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(249,115,22,0.32)]">
                <Send className="h-5 w-5" />
                Send Message
              </button>
            </form>

            <div>
              <h2 className="text-2xl font-black text-[#111827] md:text-3xl">Frequently Asked</h2>
              <div className="mt-7 grid gap-4">
                {contactFaqs.map((question) => (
                  <button
                    key={question}
                    type="button"
                    className="flex h-14 w-full items-center justify-between rounded-xl bg-white px-5 text-left text-sm font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span>{question}</span>
                    <MessageSquare className="h-4 w-4 text-slate-500" />
                  </button>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-[#10111d] p-6 text-white">
                <h3 className="text-lg font-black">Follow Us</h3>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="https://www.instagram.com/adyapanschool/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-black text-white transition hover:bg-white/18"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </a>
                  <a
                    href="https://www.linkedin.com/company/adyapan-edutech-pvt-ltd/posts/?feedView=all"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-black text-white transition hover:bg-white/18"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {success && (
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/35 px-4 text-left backdrop-blur-sm"
        >
          <span className="relative block w-full max-w-sm rounded-[26px] border border-white/80 bg-white p-7 text-center shadow-[0_30px_90px_rgba(249,115,22,0.24)]">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
              <Sparkles className="h-8 w-8" />
            </span>
            <span className="mt-5 block text-2xl font-black text-slate-950">Message sent</span>
            <span className="mx-auto mt-3 block max-w-xs text-sm font-bold leading-6 text-slate-600">
              Thanks for reaching out. ADYAPAN team will contact you soon.
            </span>
            <span className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-black text-white">
              OK
            </span>
          </span>
        </button>
      )}

      {status && !success && (
        <button
          type="button"
          onClick={() => setStatus("")}
          className="fixed bottom-5 left-1/2 z-50 max-w-[92vw] -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_16px_38px_rgba(15,23,42,0.16)]"
        >
          {status}
        </button>
      )}
    </main>
  );
}
