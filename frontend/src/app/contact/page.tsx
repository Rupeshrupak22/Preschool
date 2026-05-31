"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Clock3, Instagram, Linkedin, Mail, MapPin, MessageSquare, PhoneCall, Sparkles } from "lucide-react";

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
    <main className="min-h-screen bg-white">
      {/* Hero Section with Scenic Background */}
      <section className="relative z-20 flex aspect-[16/9] min-h-[420px] items-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/contactus.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/45 via-blue-950/25 to-transparent" />
        <div className="absolute inset-0 backdrop-blur-[3px]" />
        
        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 md:px-6 lg:py-16">
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/55 bg-white/25 px-6 py-3 text-sm font-extrabold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_14px_40px_rgba(15,23,42,0.2)] backdrop-blur-xl md:text-base">
              <Sparkles className="h-5 w-5 text-sky-500" />
              Contact ADYAPAN
            </div>
            <h1 className="max-w-4xl text-[46px] font-black leading-[1.05] tracking-normal text-white drop-shadow-[0_6px_24px_rgba(15,23,42,0.45)] sm:text-[58px] md:text-[72px] lg:text-[86px]">
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                Get in touch
              </span>{" "}
              with our team
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-extrabold leading-8 text-white drop-shadow-[0_4px_18px_rgba(15,23,42,0.5)] md:text-2xl md:leading-10">
              Have a question about our courses, classes, or school support? Reach out - our team responds within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <div className="relative isolate overflow-hidden">
        <video
          className="fixed inset-0 -z-20 h-screen w-screen object-cover"
          src="/videos/contactus.mp4"
          poster="/contactus2.jpeg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="fixed inset-0 -z-10 bg-white/75" />

      {/* Two Column Layout - Company Information & Personal Information */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          
          {/* Left Column - Company Information Box */}
          <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 shadow-xl backdrop-blur-sm md:p-10">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Company information</h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Connect with ADYAPAN - where education meets innovation. We're here to support your learning journey.
            </p>

            <div className="mt-10 space-y-6">
              {/* Phone */}
              <a href="tel:+918179124566" className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white shadow-sm">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Phone</h3>
                  <p className="mt-1 text-lg font-bold text-gray-900">+91 81791 24566</p>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:support@adyapan.com" className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white shadow-sm">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Email</h3>
                  <p className="mt-1 text-lg font-bold text-gray-900">support@adyapan.com</p>
                </div>
              </a>

              {/* Address */}
              <a 
                href="https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KdkGZDKLl8s7MSJtLa_4zSEV&daddr=Sattva+Magnus,+behind+Reliance+Bazaar+Shaikpet,+Sabza+Colony,+Ambedkar+Nagar,+Toli+Chowki,+Hyderabad,+Telangana+500008"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-4 group"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white shadow-sm">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Address</h3>
                  <p className="mt-1 text-base font-bold text-gray-900">ADYAPAN EDUTECH PRIVATE LIMITED</p>
                  <p className="text-sm text-gray-600">Sattva Magnus, behind Reliance Bazaar Shaikpet,</p>
                  <p className="text-sm text-gray-600">Sabza Colony, Ambedkar Nagar, Toli Chowki,</p>
                  <p className="text-sm text-gray-600">Hyderabad, Telangana 500008</p>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm">
                  <Clock3 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">Visit Us</h3>
                  <p className="mt-1 text-lg font-bold text-gray-900">Mon-Sat, 11 AM - 8 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Personal Information Form Box */}
          <div className="rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-8 shadow-xl backdrop-blur-sm md:p-10">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Personal information</h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            <form id="contact-form" onSubmit={submitContact} className="mt-8 space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Company Name / Subject */}
              <div>
                <label htmlFor="interest" className="block text-sm font-semibold text-gray-700">
                  Subject *
                </label>
                <select
                  id="interest"
                  name="interest"
                  required
                  defaultValue=""
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  <option value="Course enrollment">Course enrollment</option>
                  <option value="Live class support">Live class support</option>
                  <option value="School partnership">School partnership</option>
                  <option value="Placement support">Placement support</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="mt-2 block w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit request
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative z-10 py-16">
        <div className="pointer-events-none absolute inset-0 bg-white/55" />
        <div className="relative mx-auto max-w-[1400px] px-4 md:px-6">
          <div className="mx-auto mb-8 rounded-[32px] border border-white/50 bg-white/45 px-6 py-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-[18px] md:px-10 md:py-10 lg:px-16 lg:py-12">
            <h2
              className="text-[40px] font-black leading-none md:text-[56px] lg:text-[72px]"
              style={{ textShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
            >
              <span className="bg-gradient-to-r from-[#67e8f9] via-[#38bdf8] to-[#3b82f6] bg-clip-text text-transparent">
                Find
              </span>{" "}
              <span className="text-[#0f172a]">Us</span>
            </h2>
            {/* <p className="mx-auto mt-5 max-w-[900px] text-lg font-medium leading-[1.7] text-[#334155] md:text-2xl">
              Visit our campus and discover a future-ready learning environment designed to help students grow through innovation, technology, and real-world skills.
            </p> */}
          </div>

          <div className="relative overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.844789!2d78.399023!3d17.413497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9158edcba987%3A0x123456789abcdef0!2sSattva%20Magnus%2C%20behind%20Reliance%20Bazaar%20Shaikpet%2C%20Sabza%20Colony%2C%20Ambedkar%20Nagar%2C%20Toli%20Chowki%2C%20Hyderabad%2C%20Telangana%20500008!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ADYAPAN Office Location"
              className="h-[320px] w-full md:h-[400px] lg:h-[500px]"
            />
            <a
              href="https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KdkGZDKLl8s7MSJtLa_4zSEV&daddr=Sattva+Magnus,+behind+Reliance+Bazaar+Shaikpet,+Sabza+Colony,+Ambedkar+Nagar,+Toli+Chowki,+Hyderabad,+Telangana+500008"
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-24">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl">Frequently Asked Questions</h2>
        <div className="mx-auto grid max-w-3xl gap-4">
          <button
            type="button"
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-5 text-left text-base font-semibold text-gray-900 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <span>How do I enroll in a course?</span>
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </button>
          <button
            type="button"
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-5 text-left text-base font-semibold text-gray-900 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <span>Are classes live or recorded?</span>
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </button>
          <button
            type="button"
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-5 text-left text-base font-semibold text-gray-900 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <span>Do you provide placement support?</span>
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </section>

      {/* Build Smarter Decisions Section */}
      <section className="relative z-10 bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-600/90 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
          <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Build smarter decisions, faster
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/90 md:text-xl">
            Join thousands of students and schools who trust ADYAPAN for innovative learning solutions. 
            Transform education with AI-powered insights, personalized learning paths, and comprehensive support.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-xl transition hover:bg-gray-50"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="/overview"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="relative z-10 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="relative">
            <div className="absolute inset-x-8 -inset-y-6 -z-10 rounded-[32px] bg-blue-400/25 blur-3xl" />
            <div className="rounded-[32px] border border-white/25 bg-gradient-to-br from-[#14b8e6] via-[#1d9bf0] to-[#2563eb] p-8 text-center shadow-[0_20px_60px_rgba(37,99,235,0.25)] transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_28px_80px_rgba(37,99,235,0.32)] md:p-12">
              <h3 className="text-2xl font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.15)] md:text-3xl">Follow Us on Social Media</h3>
              <p className="mx-auto mt-4 max-w-2xl text-base text-white/90">
                Stay connected with ADYAPAN for the latest updates, educational content, and community insights.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://www.instagram.com/adyapanschool/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/[0.18] px-6 py-3 text-base font-semibold text-white shadow-sm backdrop-blur-[12px] transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:bg-white/25 hover:shadow-[0_15px_35px_rgba(0,0,0,0.15)]"
                >
                  <Instagram className="h-5 w-5" />
                  Instagram
                </a>
                <a
                  href="https://www.linkedin.com/company/adyapan-edutech-pvt-ltd/posts/?feedView=all"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/[0.18] px-6 py-3 text-base font-semibold text-white shadow-sm backdrop-blur-[12px] transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:bg-white/25 hover:shadow-[0_15px_35px_rgba(0,0,0,0.15)]"
                >
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Success Modal */}
      {success && (
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900">Message Sent!</h3>
            <p className="mx-auto mt-3 max-w-sm text-base text-gray-600">
              Thanks for reaching out. ADYAPAN team will contact you soon.
            </p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-8 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </button>
      )}

      {/* Status Message */}
      {status && !success && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-xl">
          {status}
        </div>
      )}
    </main>
  );
}
