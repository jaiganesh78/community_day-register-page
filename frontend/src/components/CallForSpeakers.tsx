"use client";

import React, { useState } from "react";
import { Mic, Send, Calendar, CheckCircle2, X } from "lucide-react";

export default function CallForSpeakers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    abstract: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmitted(false);
      setFormData({ name: "", email: "", topic: "", abstract: "" });
    }, 2500);
  };

  return (
    <section id="cfs" className="py-24 relative overflow-hidden bg-black/40 border-y border-slate-900">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/5 blur-[150px] pointer-events-none animate-pulse-glow" />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-blue-500/20 via-cyan-500/30 to-[#00f0ff]/10 hover:via-cyan-400/50 transition-all duration-500">
          
          <div className="glass-panel rounded-3xl p-8 md:p-14 text-center space-y-8 bg-slate-950/70 border border-slate-900">
            
            {/* Header Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-900 to-cyan-500/30 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.15)] animate-float">
              <Mic size={28} />
            </div>

            {/* Heading Content */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Share Your Cloud Story: <br />
                <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-[#00f0ff] bg-clip-text text-transparent text-glow">
                  Call for Speakers
                </span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Are you building on AWS, experimenting with Generative AI models, designing serverless pipelines, or managing hybrid architectures? We want to hear from you! AWS Student Community Day 2026 is welcoming proposals from student builders, academic researchers, and seasoned cloud professionals.
              </p>
            </div>

            {/* Quick Session Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto pt-2 text-xs">
              <div className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-300 flex items-center justify-center gap-2">
                <Calendar size={14} className="text-[#00f0ff]" />
                <span>Deadline: Aug 10, 2026</span>
              </div>
              <div className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-300 flex items-center justify-center gap-2">
                <Mic size={14} className="text-[#00f0ff]" />
                <span>Duration: 30 / 45 Min</span>
              </div>
              <div className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-300 flex items-center justify-center gap-2">
                <Send size={14} className="text-[#00f0ff]" />
                <span>Format: PPT + Live Demo</span>
              </div>
            </div>

            {/* High-Converting Animated CTA Button */}
            <div className="pt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="neon-btn px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(0,112,243,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] transition-all cursor-pointer"
              >
                Apply as a Speaker
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* CFS Form Modal popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-cyan-500/20 p-8 bg-slate-950 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 focus:outline-none"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff]">
                  <CheckCircle2 size={24} className="animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white">Proposal Submitted!</h3>
                <p className="text-xs text-slate-400">
                  Thank you! The REC Student Builder Review Committee will review your proposal shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Speaker Proposal Form</h3>
                  <p className="text-xs text-slate-500 mt-1">Submit your topic and abstract for AWS Student Community Day.</p>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jane Doe"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. janedoe@rec.edu"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Session Title</label>
                    <input
                      type="text"
                      required
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      placeholder="e.g. Scaling LLM Deployments using AWS Bedrock"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Abstract Summary</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.abstract}
                      onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                      placeholder="Explain what your talk covers, the target audience, and any live demo details."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full neon-btn py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest text-white shadow-md cursor-pointer"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
