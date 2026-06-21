"use client";

import React from "react";
import { Award, Users, Globe } from "lucide-react";
import { motion } from "framer-motion";

const AWSSmile = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" className="text-[#ff9900] fill-current">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"/>
  </svg>
);

const HashiCorpLogo = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" className="text-[#ffffff] fill-current">
    <path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm-1 4.5h2v3h-2v-3zm0 5h2v3h-2v-3z"/>
  </svg>
);

const MongoDBLogo = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" className="text-[#00ed64] fill-current">
    <path d="M12 2C11.5 2 7 6 7 12c0 4.5 3.5 8 5 8s5-3.5 5-8c0-6-4.5-10-5-10zm0 15c-1.5 0-3-2-3-5s1.5-5 3-5 3 2 3 5-1.5 5-3 5z"/>
  </svg>
);

const DatadogLogo = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" className="text-[#632ca6] fill-current">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
  </svg>
);

export default function Sponsors() {
  const sponsors = [
    {
      name: "MongoDB",
      category: "Gold Sponsor",
      desc: "Developer Data Platform",
      logo: <MongoDBLogo />,
      glowColor: "rgba(0, 237, 100, 0.15)"
    },
    {
      name: "HashiCorp",
      category: "Infrastructure Partner",
      desc: "Cloud Infrastructure Automation",
      logo: <HashiCorpLogo />,
      glowColor: "rgba(255, 255, 255, 0.1)"
    },
    {
      name: "Datadog",
      category: "Monitoring Partner",
      desc: "Cloud-Scale Monitoring & Security",
      logo: <DatadogLogo />,
      glowColor: "rgba(99, 44, 166, 0.15)"
    }
  ];

  const partners = [
    { name: "AWS User Group Chennai", role: "Official Community Partner" },
    { name: "AWS Student Builder Groups REC", role: "Hosting Student Group" },
    { name: "Rajalakshmi Engineering College", role: "Academic Host Venue" }
  ];

  return (
    <section id="sponsors" className="py-10 relative overflow-hidden bg-black/10">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* Section Heading */}
        <div className="text-center space-y-4">
          <div className="text-cyan-400 font-semibold uppercase tracking-wider text-xs">
            Partners & Sponsors
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Supporting the Builders
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Empowering the cloud student community in Chennai to learn, build, and deploy.
          </p>
        </div>

        {/* 1. Title Sponsor Box (AWS) */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Title Cloud Partner
          </h3>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass-panel rounded-[24px] p-8 md:p-10 border border-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#070712]/80 shadow-[0_0_50px_rgba(255,153,0,0.08)] hover:border-[#ff9900]/30 hover:shadow-[0_0_50px_rgba(255,153,0,0.18)] transition-all duration-500"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-[#ff9900]/20 shadow-inner">
                <AWSSmile />
              </div>
              <div className="text-left">
                <h4 className="text-2xl font-black text-white tracking-tight">Amazon Web Services</h4>
                <p className="text-xs text-[#ff9900] font-bold uppercase tracking-wider mt-0.5">Cloud Computing Services Provider</p>
              </div>
            </div>
            <div className="text-slate-400 text-xs sm:text-sm text-center sm:text-right max-w-xs leading-relaxed">
              Providing technical mentoring, builder credits, and exclusive training resources for AWS Community Day.
            </div>
          </motion.div>
        </div>

        {/* 2. Gold/Silver Sponsors Grid */}
        <div className="space-y-8 max-w-5xl mx-auto">
          <h3 className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            Event Sponsors
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sponsors.map((sponsor, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                style={{
                  boxShadow: `0 0 30px ${sponsor.glowColor}`
                }}
                className="glass-panel p-8 rounded-2xl border border-slate-800 bg-[#070712]/90 flex flex-col justify-between h-48 transition-all duration-300 hover:border-cyan-500/30"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center">
                    {sponsor.logo}
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider py-1 px-2.5 rounded bg-cyan-950/20 border border-cyan-500/10">
                    {sponsor.category}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">{sponsor.name}</h4>
                  <p className="text-xs text-slate-400 leading-normal">{sponsor.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. Community Partners Grid */}
        <div className="space-y-8 max-w-5xl mx-auto pt-6">
          <h3 className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            Community Partners
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partners.map((partner, idx) => (
              <div 
                key={idx} 
                className="glass-panel p-6 rounded-xl border border-slate-800/80 bg-[#070712]/70 flex items-center gap-4 hover:border-cyan-500/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-blue-950/30 border border-blue-500/20 flex items-center justify-center text-[#00f0ff] flex-shrink-0">
                  {idx === 0 ? <Globe size={16} /> : idx === 1 ? <Users size={16} /> : <Award size={16} />}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{partner.name}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{partner.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
