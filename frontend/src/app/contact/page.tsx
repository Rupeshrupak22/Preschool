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
      <section className="relative min-h-[35vh] overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/contactus2.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-16">
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            Get in touch with our team
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">
            Have a question about our courses, classes, or school support? Reach out - our team responds within 24 hours.
          </p>
        </div>
      </section>

      {/* Two Column Layout - Company Information & Personal Information */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-stretch">
          
          {/* Left Column - Company Information Box */}
          <div className="relative overflow-hidden rounded-3xl border-4 border-blue-300 bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100 shadow-2xl flex flex-col">
            {/* Header with gradient background */}
            <div className="h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-t-3xl flex items-center justify-center">
              <h2 className="text-xl font-black text-white">Company Information</h2>
            </div>
            
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
              <div>
                <p className="text-base text-gray-700 leading-relaxed font-medium mb-8">
                  Connect with ADYAPAN - where education meets innovation. We're here to support your learning journey
                </p>

                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg">
                      <PhoneCall className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">PHONE</h3>
                      <p className="text-xl font-black text-gray-900">+91 8179124566</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">EMAIL</h3>
                      <p className="text-xl font-black text-gray-900">support@adyapan.com</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow-lg">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">ADDRESS</h3>
                      <p className="text-lg font-black text-gray-900">ADYAPAN EDUTECH PRIVATE LTD</p>
                      <p className="text-sm text-gray-700 font-medium">Sattva Magnus, behind Reliance Bazaar</p>
                      <p className="text-sm text-gray-700 font-medium">Shaikpet, Sabza Colony, Ambedkar Nagar,</p>
                      <p className="text-sm text-gray-700 font-medium">Hyderabad, Telangana 500008</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-300 to-purple-500 text-white shadow-lg">
                      <Clock3 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">VISIT US</h3>
                      <p className="text-xl font-black text-gray-900">Mon-Sat, 11 AM- 8 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional content to fill space */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 text-white">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">Quick Response</p>
                    <p className="text-xs text-gray-600">We reply within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Personal Information Form Box */}
          <div className="relative overflow-hidden rounded-3xl border-4 border-purple-300 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 shadow-2xl flex flex-col">
            {/* Header with gradient background */}
            <div className="h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-t-3xl flex items-center justify-center">
              <h2 className="text-xl font-black text-white">Personal Information</h2>
            </div>
            
            <div className="flex-1 p-8 md:p-10 flex flex-col">
              <p className="text-base text-gray-700 leading-relaxed font-medium mb-8">
                Fill out the form below and we'll get back as soon as possible
              </p>

              <form id="contact-form" onSubmit={submitContact} className="flex-1 flex flex-col space-y-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="block w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="interest" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    id="interest"
                    name="interest"
                    type="text"
                    className="block w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Message */}
                <div className="flex-1">
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="block w-full h-full min-h-[120px] resize-none rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-lg font-black text-white shadow-lg transition hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 mt-auto"
                >
                  Submit request
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl">Find Us</h2>
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.844789!2d78.399023!3d17.413497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9158edcba987%3A0x123456789abcdef0!2sSattva%20Magnus%2C%20behind%20Reliance%20Bazaar%20Shaikpet%2C%20Sabza%20Colony%2C%20Ambedkar%20Nagar%2C%20Toli%20Chowki%2C%20Hyderabad%2C%20Telangana%20500008!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ADYAPAN Office Location"
              className="w-full"
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
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-24">
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
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
          <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Build smarter decisions, faster
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/90 md:text-xl">
            Join our growing community of students and schools who trust ADYAPAN for innovative learning solutions. 
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
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center shadow-xl md:p-12">
            <h3 className="text-2xl font-bold text-white md:text-3xl">Follow Us on Social Media</h3>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-300">
              Stay connected with ADYAPAN for the latest updates, educational content, and community insights.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://www.instagram.com/adyapanschool/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <Instagram className="h-5 w-5" />
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/adyapan-edutech-pvt-ltd/posts/?feedView=all"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

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
