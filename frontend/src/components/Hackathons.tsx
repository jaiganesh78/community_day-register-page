"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X, ChevronRight, Trophy, Clock, Users, Cpu, Globe, Shield,
  Brain, Cloud, CheckCircle2, Send, Zap, Code2, BookOpen
} from "lucide-react";
import SuccessBadge from "./SuccessBadge";
import { useRegistration } from "@/context/RegistrationContext";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
interface Hackathon {
  id: number;
  title: string;
  tagline: string;
  poster: string;
  prize: string;
  duration: string;
  teamSize: string;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  domains: { icon: React.ReactNode; name: string; desc: string }[];
  rules: string[];
}

const hackathons: Hackathon[] = [
  {
    id: 1,
    title: "Cloud Innovation Challenge",
    tagline: "Build scalable cloud-native apps on AWS and compete for glory.",
    poster: "/hackathon_poster_1.png",
    prize: "₹50,000",
    duration: "24 Hours",
    teamSize: "2–4 Members",
    accentColor: "text-cyan-400",
    glowColor: "rgba(34,211,238,0.12)",
    borderColor: "border-cyan-500/30",
    domains: [
      { icon: <Cloud size={15} />, name: "Cloud Architecture", desc: "Serverless, containers, and multi-region deployments." },
      { icon: <Cpu size={15} />, name: "AI & Machine Learning", desc: "LLM integrations, Amazon Bedrock, SageMaker." },
      { icon: <Globe size={15} />, name: "Web3 & Decentralized Apps", desc: "Blockchain meets cloud — hybrid dApps." },
      { icon: <Shield size={15} />, name: "Cloud Security", desc: "Zero-trust, IAM hardening, threat detection." },
    ],
    rules: [
      "Teams of 2–4 members from any college or institution.",
      "All solutions must be deployed on AWS services.",
      "Projects must be built from scratch within 24 hours.",
      "Open-source libraries are allowed; paid APIs (except AWS) are not.",
      "Each team must submit a 3-minute demo video with source code.",
      "Plagiarism or use of pre-built templates results in disqualification.",
      "Final judging based on innovation, scalability, and presentation.",
    ],
  },
];


/* ─────────────────────────────────────────────
   HACKATHON CARD
───────────────────────────────────────────── */
function HackathonCard({
  hack,
  onOpen,
}: {
  hack: Hackathon;
  onOpen: () => void;
}) {
  return (
    <div
      className="group flex flex-col md:flex-row rounded-3xl border border-slate-800 bg-[#070712]/90 overflow-hidden
        hover:border-cyan-500/20 transition-all duration-500"
      style={{ boxShadow: `0 0 40px ${hack.glowColor}` }}
    >
      {/* LEFT — Poster */}
      <div className="relative w-full md:w-5/12 aspect-video md:aspect-auto min-h-[200px] overflow-hidden flex-shrink-0">
        <Image
          src={hack.poster}
          alt={hack.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#070712] hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070712] via-transparent to-transparent md:hidden" />

        {/* Prize badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-amber-500/30 flex items-center gap-1.5">
          <Trophy size={12} className="text-amber-400" />
          <span className="text-xs font-black text-amber-400">{hack.prize} Prize Pool</span>
        </div>
      </div>

      {/* RIGHT — Details */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-8">
        <div className="space-y-4">
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${hack.accentColor}`}>
              Hackathon
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {hack.title}
            </h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">{hack.tagline}</p>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <Clock size={12} className={hack.accentColor} />
              {hack.duration}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <Users size={12} className={hack.accentColor} />
              {hack.teamSize}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              <Cpu size={12} className={hack.accentColor} />
              {hack.domains.length} Domains
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onOpen}
          className={`mt-6 self-start flex items-center gap-2 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest
            border transition-all duration-300 text-white
            ${hack.id === 1
              ? "border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]"
              : "border-violet-500/50 bg-violet-500/10 hover:bg-violet-500/20 hover:border-violet-400 hover:shadow-[0_0_20px_rgba(167,139,250,0.25)]"
            }`}
        >
          View Details <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HACKATHON MODAL
───────────────────────────────────────────── */
function HackathonModal({
  hack,
  onClose,
}: {
  hack: Hackathon;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "", email: "", college: "", team: "", domain: "", size: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const { setBadgeData } = useRegistration();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setBadgeData({
      name: formData.name,
      email: formData.email,
      role: "Hackathon Builder"
    });
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 8000);
  };

  const isFirst = hack.id === 1;
  const accent = isFirst ? "cyan" : "violet";
  const accentStyle = isFirst
    ? "border-cyan-500/40 text-cyan-400 bg-cyan-500/10"
    : "border-violet-500/40 text-violet-400 bg-violet-500/10";
  const inputFocus = isFirst
    ? "focus:border-cyan-500 focus:ring-cyan-500/20"
    : "focus:border-violet-500 focus:ring-violet-500/20";
  const btnClass = isFirst
    ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
    : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-[0_0_20px_rgba(167,139,250,0.25)] hover:shadow-[0_0_30px_rgba(167,139,250,0.4)]";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      {/* Panel — cyberpunk STATUS screen style */}
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border bg-[#06060f]"
        style={{
          borderColor: isFirst ? "rgba(34,211,238,0.35)" : "rgba(167,139,250,0.35)",
          boxShadow: `0 0 60px ${hack.glowColor}, 0 0 120px ${hack.glowColor}`,
        }}
      >
        {/* Top title bar — cyberpunk */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b"
          style={{ borderColor: isFirst ? "rgba(34,211,238,0.2)" : "rgba(167,139,250,0.2)", background: "rgba(0,0,0,0.4)" }}
        >
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isFirst ? "bg-cyan-400" : "bg-violet-400"}`} />
            <span className={`text-xs font-black uppercase tracking-[0.25em] ${isFirst ? "text-cyan-400" : "text-violet-400"}`}>
              {hack.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — two panels */}
        <div className="flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden max-h-[calc(90vh-52px)]">

          {/* ── LEFT: Domains + Rules ── */}
          <div
            className="w-full lg:w-[55%] p-5 sm:p-6 space-y-6 overflow-y-auto border-b lg:border-b-0 lg:border-r"
            style={{ borderColor: isFirst ? "rgba(34,211,238,0.1)" : "rgba(167,139,250,0.1)" }}
          >
            {/* Domains */}
            <div>
              <h4 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isFirst ? "text-cyan-400" : "text-violet-400"}`}>
                ◈ Challenge Domains
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {hack.domains.map((d, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 p-3 rounded-xl border bg-black/30 ${isFirst ? "border-cyan-500/15" : "border-violet-500/15"}`}
                  >
                    <div className={`flex-shrink-0 mt-0.5 ${isFirst ? "text-cyan-400" : "text-violet-400"}`}>{d.icon}</div>
                    <div>
                      <p className="text-xs font-bold text-white">{d.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div>
              <h4 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isFirst ? "text-cyan-400" : "text-violet-400"}`}>
                ◈ Rules & Guidelines
              </h4>
              <ul className="space-y-2">
                {hack.rules.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className={`flex-shrink-0 text-[10px] font-black mt-0.5 w-5 h-5 rounded flex items-center justify-center border ${isFirst ? "border-cyan-500/30 text-cyan-400 bg-cyan-500/5" : "border-violet-500/30 text-violet-400 bg-violet-500/5"}`}>
                      {i + 1}
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{r}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── RIGHT: Registration Form ── */}
          <div className="w-full lg:w-[45%] p-5 sm:p-6 flex flex-col lg:overflow-y-auto lg:max-h-[calc(90vh-52px)]">
            {submitted ? (
              <div className="flex-1 flex flex-col items-center justify-center py-4">
                <SuccessBadge name={formData.name} email={formData.email} role="Hackathon Builder" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
                <div>
                  <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isFirst ? "text-cyan-400" : "text-violet-400"}`}>
                    ◈ Register Your Team
                  </h4>
                  <p className="text-[11px] text-slate-500">Fill in the details below to secure your spot.</p>
                </div>

                <div className="space-y-3 flex-1">
                  {[
                    { label: "Full Name", key: "name", type: "text", ph: "Your full name" },
                    { label: "Email Address", key: "email", type: "email", ph: "you@example.com" },
                    { label: "College / Institution", key: "college", type: "text", ph: "e.g. Rajalakshmi Engineering College" },
                    { label: "Team Name", key: "team", type: "text", ph: "e.g. ByteBusters" },
                  ].map(({ label, key, type, ph }) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
                      <input
                        type={type}
                        required
                        placeholder={ph}
                        value={(formData as Record<string, string>)[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className={`w-full bg-black/40 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-700 focus:outline-none focus:ring-1 ${inputFocus} transition-all`}
                      />
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Domain</label>
                      <select
                        required
                        value={formData.domain}
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                        className={`w-full bg-black/40 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 ${inputFocus} transition-all`}
                      >
                        <option value="">Select</option>
                        {hack.domains.map((d) => (
                          <option key={d.name} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Team Size</label>
                      <select
                        required
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className={`w-full bg-black/40 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 ${inputFocus} transition-all`}
                      >
                        <option value="">Select</option>
                        {["1", "2", "3", "4"].map((n) => (
                          <option key={n} value={n}>{n} member{n !== "1" ? "s" : ""}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest text-white transition-all duration-300 flex items-center justify-center gap-2 ${btnClass}`}
                >
                  <Send size={13} /> Register Now
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
export default function Hackathons() {
  const [activeHack, setActiveHack] = useState<Hackathon | null>(null);

  return (
    <section id="hackathons" className="py-10 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/3 w-96 h-80 rounded-full bg-cyan-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-violet-600/5 blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="text-center space-y-3 mb-12">
          <p className="text-cyan-400 font-bold uppercase tracking-widest text-[10px]">Compete & Win</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Hackathons</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Push your limits, build something extraordinary, and compete against the best student builders.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-6">
          {hackathons.map((hack) => (
            <HackathonCard key={hack.id} hack={hack} onOpen={() => setActiveHack(hack)} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeHack && (
        <HackathonModal hack={activeHack} onClose={() => setActiveHack(null)} />
      )}
    </section>
  );
}
