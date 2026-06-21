"use client";

import React, { useState } from "react";
import { Mic, Building2, Send, CheckCircle2, X, Calendar, Clock, Handshake, Star, Award, Users } from "lucide-react";
import SuccessBadge from "./SuccessBadge";
import { useRegistration } from "@/context/RegistrationContext";

/* ─────────────────────────────────────────────
   SHARED TYPES & HELPERS
───────────────────────────────────────────── */
type ModalType = "speaker" | "sponsor" | null;

const INPUT_BASE =
  "w-full bg-black/40 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-700 focus:outline-none focus:ring-1 transition-all";

/* ─────────────────────────────────────────────
   SPEAKER FORM MODAL
───────────────────────────────────────────── */
function SpeakerModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", topic: "", abstract: "" });

  const { setBadgeData } = useRegistration();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setBadgeData({
      name: formData.name,
      email: formData.email,
      role: "Event Speaker"
    });
    setTimeout(() => { onClose(); }, 8000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-[#06060f] shadow-[0_0_60px_rgba(34,211,238,0.12)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-cyan-500/15 bg-black/30">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">Speaker Proposal</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1"><X size={17} /></button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="py-4">
              <SuccessBadge name={formData.name} email={formData.email} role="Event Speaker" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Speaker Proposal Form</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Submit your topic & abstract for AWS Student Community Day.</p>
              </div>
              {[
                { label: "Full Name", key: "name", type: "text", ph: "e.g. Jane Doe" },
                { label: "Email Address", key: "email", type: "email", ph: "e.g. janedoe@rec.edu" },
                { label: "Session Title", key: "topic", type: "text", ph: "e.g. Scaling LLMs with Amazon Bedrock" },
              ].map(({ label, key, type, ph }) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
                  <input
                    type={type} required placeholder={ph}
                    value={(formData as Record<string, string>)[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className={`${INPUT_BASE} focus:border-cyan-500 focus:ring-cyan-500/20`}
                  />
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Abstract Summary</label>
                <textarea
                  required rows={3}
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  placeholder="What your talk covers, target audience, and live demo details."
                  className={`${INPUT_BASE} focus:border-cyan-500 focus:ring-cyan-500/20 resize-none`}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest text-white
                  bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500
                  shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]
                  transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send size={13} /> Submit Proposal
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SPONSOR FORM MODAL
───────────────────────────────────────────── */
function SponsorModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    company: "", contact: "", email: "", tier: "", message: "",
  });

  const { setBadgeData } = useRegistration();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setBadgeData({
      name: formData.contact,
      email: formData.email,
      role: "Event Sponsor"
    });
    setTimeout(() => { onClose(); }, 8000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/30 bg-[#06060f] shadow-[0_0_60px_rgba(251,191,36,0.10)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-amber-500/15 bg-black/30">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">Sponsorship Enquiry</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1"><X size={17} /></button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="py-4">
              <SuccessBadge name={formData.contact} email={formData.email} role="Event Sponsor" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Sponsor Application</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Partner with us to support India's cloud student community.</p>
              </div>
              {[
                { label: "Company / Organisation Name", key: "company", type: "text", ph: "e.g. Acme Technologies" },
                { label: "Contact Person", key: "contact", type: "text", ph: "Your full name" },
                { label: "Business Email", key: "email", type: "email", ph: "partnerships@yourcompany.com" },
              ].map(({ label, key, type, ph }) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
                  <input
                    type={type} required placeholder={ph}
                    value={(formData as Record<string, string>)[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className={`${INPUT_BASE} focus:border-amber-500 focus:ring-amber-500/20`}
                  />
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Sponsorship Tier Interest</label>
                <select
                  required value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className={`${INPUT_BASE} focus:border-amber-500 focus:ring-amber-500/20`}
                >
                  <option value="">Select a tier</option>
                  <option value="title">Title Sponsor (Premium)</option>
                  <option value="gold">Gold Sponsor</option>
                  <option value="silver">Silver Sponsor</option>
                  <option value="community">Community Partner</option>
                  <option value="other">Other / Custom</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Message (Optional)</label>
                <textarea
                  rows={2} value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Any specific requirements or questions about the partnership?"
                  className={`${INPUT_BASE} focus:border-amber-500 focus:ring-amber-500/20 resize-none`}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest text-white
                  bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500
                  shadow-[0_0_20px_rgba(251,191,36,0.18)] hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]
                  transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Handshake size={13} /> Submit Enquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
export default function CallFor() {
  const [modal, setModal] = useState<ModalType>(null);

  return (
    <section id="cfs" className="py-10 relative overflow-hidden bg-black/30 border-y border-slate-900/60">
      {/* Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-600/4 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-cyan-600/4 blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">



        {/* Separate containers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

          {/* ── LEFT: Sponsors ── */}
          <div
            className="relative p-8 sm:p-10 rounded-3xl border border-slate-800/80
              bg-gradient-to-br from-[#0a0810]/95 to-[#07080f]/95 backdrop-blur-sm flex flex-col
              hover:border-amber-500/30 transition-all duration-500 group"
            style={{ boxShadow: "0 0 40px rgba(251, 191, 255, 0.015)" }}
          >
            <div className="flex flex-col flex-1 space-y-5">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                <Building2 size={26} />
              </div>

              {/* Text */}
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white">Call for Sponsors</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Partner with AWS Student Community Day 2026 and showcase your brand to a growing community of students, builders, developers, and future technology leaders.
                </p>
              </div>

              {/* Perks */}
              <ul className="space-y-2">
                {[
                  { icon: <Star size={12} />, text: "Brand visibility across event promotions and materials" },
                  { icon: <Award size={12} />, text: "Opportunity to engage with attendees and showcase solutions" },
                  { icon: <Users size={12} />, text: "Connect with emerging talent and future professionals" },
                  { icon: <Handshake size={12} />, text: "Support community-driven learning and innovation" },
                ].map((perk, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[12px] text-slate-300">
                    <span className="text-amber-400 flex-shrink-0 mt-0.5">{perk.icon}</span>
                    <span className="leading-normal">{perk.text}</span>
                  </li>
                ))}
              </ul>

              {/* Quick info chips */}
              <div className="space-y-2">
                <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sponsorship Opportunities</h5>
                <div className="flex flex-wrap gap-2">
                  {["Gold Partner", "Silver Partner", "Community Partner"].map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-amber-500/20 text-amber-400 bg-amber-500/5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed italic">
                Join us in empowering the next generation of cloud innovators while expanding your reach within the technology ecosystem.
              </p>

              {/* CTA */}
              <button
                onClick={() => setModal("sponsor")}
                className="mt-auto self-start flex items-center gap-2 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest
                  border border-amber-500/40 bg-amber-500/10 text-amber-300
                  hover:bg-amber-500/20 hover:border-amber-400
                  hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]
                  transition-all duration-300"
              >
                Apply as Sponsor <Handshake size={13} />
              </button>
            </div>
          </div>

          {/* ── RIGHT: Speakers ── */}
          <div
            className="relative p-8 sm:p-10 rounded-3xl border border-slate-800/80
              bg-gradient-to-br from-[#07080f]/95 to-[#05060c]/95 backdrop-blur-sm flex flex-col
              hover:border-cyan-500/30 transition-all duration-500 group"
            style={{ boxShadow: "0 0 40px rgba(34, 211, 238, 0.015)" }}
          >
            <div className="flex flex-col flex-1 space-y-5">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                <Mic size={26} />
              </div>

              {/* Text */}
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white">Call for Speakers</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Share your cloud expertise, AWS experiences, research insights, or innovative ideas with a vibrant community of students, developers, and technology enthusiasts at AWS Student Community Day 2026.
                </p>
              </div>

              {/* Perks */}
              <ul className="space-y-2">
                {[
                  { icon: <Calendar size={12} />, text: "Deadline: August 10, 2026" },
                  { icon: <Clock size={12} />, text: "Duration: 30-minute speaking sessions" },
                  { icon: <Mic size={12} />, text: "Format: Presentation + Interactive Q&A" },
                ].map((perk, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[12px] text-slate-300">
                    <span className="text-cyan-400 flex-shrink-0 mt-0.5">{perk.icon}</span>
                    <span className="leading-normal">{perk.text}</span>
                  </li>
                ))}
              </ul>

              {/* Topic chips */}
              <div className="space-y-2">
                <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Topics of Interest</h5>
                <div className="flex flex-wrap gap-2">
                  {["AWS Cloud", "Generative AI", "Serverless", "DevOps", "Security", "Emerging Technologies"].map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-cyan-500/20 text-cyan-400 bg-cyan-500/5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed italic">
                Inspire, educate, and help shape the future of the cloud community.
              </p>

              {/* CTA */}
              <button
                onClick={() => setModal("speaker")}
                className="mt-auto self-start flex items-center gap-2 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest
                  border border-cyan-500/40 bg-cyan-500/10 text-cyan-300
                  hover:bg-cyan-500/20 hover:border-cyan-400
                  hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]
                  transition-all duration-300"
              >
                Apply as Speaker <Mic size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "speaker" && <SpeakerModal onClose={() => setModal(null)} />}
      {modal === "sponsor" && <SponsorModal onClose={() => setModal(null)} />}
    </section>
  );
}
