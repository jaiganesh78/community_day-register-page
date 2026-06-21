"use client";

import React from "react";
import { Users, Award, BookOpen, Presentation, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: <Users className="text-[#00f0ff] w-6 h-6" />,
    number: "500+",
    label: "Student Builders",
    desc: "Aspiring cloud enthusiasts attending",
  },
  {
    icon: <Presentation className="text-[#00f0ff] w-6 h-6" />,
    number: "15+",
    label: "Event Speakers",
    desc: "AWS Advocates and solutions architects",
  },
  {
    icon: <BookOpen className="text-[#00f0ff] w-6 h-6" />,
    number: "10+",
    label: "Technical Sessions",
    desc: "Demos on Serverless, Bedrock, and DevOps",
  },
  {
    icon: <Award className="text-[#00f0ff] w-6 h-6" />,
    number: "100%",
    label: "Swag & Rewards",
    desc: "AWS credits, stickers, and t-shirts",
  },
];

const highlights = [
  "Expert-led sessions from industry professionals and AWS community leaders",
  "Multiple technical tracks covering Cloud, AI/ML, DevOps, Security, and more",
  "Hands-on learning and practical insights from real-world projects",
  "Networking opportunities with students, professionals, and recruiters",
  "Community-driven discussions and knowledge sharing",
  "Exciting swag, rewards, and engagement activities",
];

const leftVariants = {
  hidden: { opacity: 0, x: -40 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
    }
  },
};

const rightContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 14,
    }
  },
};

export default function About() {
  return (
    <section id="about" className="py-10 relative overflow-hidden">
      {/* Ambient BG Glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Block - General Description */}
          <motion.div 
            variants={leftVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="text-cyan-400 font-semibold uppercase tracking-wider text-xs">
              Who We Are
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              AWS Student <br />
              Builder Groups @ REC
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              The AWS Student Builder Groups (SBG) at Rajalakshmi Engineering College is a student-led community passionate about cloud computing, innovation, and technology-driven learning. Through workshops, technical sessions, hackathons, and collaborative projects, we empower students to build practical skills and connect with the broader tech ecosystem.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              As part of this mission, we proudly present AWS Student Community Day 2026—a flagship event that brings together students, industry professionals, cloud experts, and community leaders for a day of learning, networking, and inspiration. Featuring multiple tracks, expert-led sessions, career insights, and community interactions, the event provides attendees with valuable knowledge, industry exposure, meaningful connections, and opportunities to grow in the world of cloud and emerging technologies. 🚀☁️
            </p>

            <ul className="space-y-3 pt-4">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                  <span className="flex-shrink-0 mt-0.5 text-[#00f0ff]">
                    <CheckCircle size={16} />
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Block - Glowing Grid Statistics */}
          <motion.div 
            variants={rightContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {stats.map((stat, idx) => (
              <motion.div 
                variants={cardVariants}
                key={idx} 
                className="relative group"
              >
                
                {/* Dynamic Radiating Glow on Hover/Touch (Cyan to Blue) */}
                <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-[#00f0ff]/80 to-[#2563eb]/80 opacity-0 group-hover:opacity-40 blur-[18px] transition-all duration-500 -z-10 group-hover:scale-[1.02] active:opacity-40" />
                
                {/* Sleek Glassmorphic Card */}
                <div className="glass-panel p-8 rounded-2xl border border-cyan-500/10 flex flex-col justify-between h-48 transition-all duration-300 group-hover:scale-[1.02] active:scale-[1.02] bg-[#070712]/90">
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-center">
                      {stat.icon}
                    </div>
                    <span className="text-3xl sm:text-4xl font-black text-white text-glow">
                      {stat.number}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white tracking-wide">
                      {stat.label}
                    </h3>
                    <p className="text-xs text-slate-400 leading-normal">
                      {stat.desc}
                    </p>
                  </div>
                </div>

              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
