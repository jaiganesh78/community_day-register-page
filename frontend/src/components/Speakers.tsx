"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

const LinkedinIcon = ({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface Speaker {
  name: string;
  role: string;
  company: string;
  topic: string;
  bio: string;
  linkedin: string;
  tag?: string;
  image?: string;
}

const speakers: Speaker[] = [
  {
    name: "Shubham Londhe",
    role: "Developer Advocate",
    company: "Amazon Web Services",
    topic: "Stepping Into The Agentic Web: Building Smart Applications with Strands Agents and MCP",
    bio: "Developer Advocate at AWS, specializing in DevOps, developer tooling, and modern container architectures.",
    linkedin: "https://www.linkedin.com/in/shubhamlondhe1996/",
    tag: "Keynote Speaker",
    image: "/madan.png",
  },
  {
    name: "Arkodyuti Saha",
    role: "Community Manager (Developer Experience)",
    company: "Amazon Web Services",
    topic: "Be A Builder On Campus: Kickstarting Cloud & AI Journeys",
    bio: "Community Manager at AWS, developer evangelist, and mentor helping students scale their tech expertise.",
    linkedin: "https://www.linkedin.com/in/arkodyutisaha",
    tag: "Keynote Speaker",
    image: "/sanjay.png",
  },
  {
    name: "Abishek Subramanian",
    role: "Senior Solutions Engineer",
    company: "Databricks",
    topic: "Agentic AI on AWS - The Next Era of Cloud Intelligence",
    bio: "Senior Solutions Engineer at Databricks with expertise in scalable data platforms and cloud integration architectures.",
    linkedin: "https://www.linkedin.com/in/abishek-subramanian",
    image: "/abhishek.png",
  },
  {
    name: "Aadhityaa SB",
    role: "AI Developer",
    company: "EY",
    topic: "Build Structured AI Agent Systems with AWS Strands SDK",
    bio: "AI Developer specializing in deploying and structuring Agentic systems inside secure cloud infrastructures.",
    linkedin: "https://www.linkedin.com/in/aadhi0612/",
    image: "/crew_1.png",
  },
  {
    name: "Ashok Kumar J",
    role: "Founder & CTO",
    company: "G3 CyberSpace",
    topic: "Cloud Compliance and Zero Trust Security",
    bio: "CTO and compliance auditor specializing in security controls, GDPR, and enterprise cloud policies.",
    linkedin: "https://www.linkedin.com/in/ashok-kumar-jeyachandran-290a15a5/",
    image: "/crew_2.png",
  },
  {
    name: "A.V. Karthik",
    role: "AWS Solutions Architect",
    company: "RR Donnelley",
    topic: "Architecting Resilient Applications with AWS CloudFront and S3",
    bio: "Solutions Architect focusing on microservices, serverless migrations, and content delivery networking.",
    linkedin: "https://www.linkedin.com/in/karthikav93/",
    image: "/crew_3.png",
  },
  {
    name: "Jeevitha M",
    role: "AI Engineer & Community Builder",
    company: "AWS Community Builder",
    topic: "Deploying Foundation Models at Scale with Amazon Bedrock",
    bio: "AWS Community Builder and developer advocate focusing on AI pipelines and scalable foundation model hosting.",
    linkedin: "https://www.linkedin.com/in/jeevitha-m-357979223/",
    image: "/monica.png",
  },
];

export default function Speakers() {
  return (
    <section id="speakers" className="py-10 relative overflow-hidden bg-black/20">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-[#00f0ff]/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 mb-16">
          <div className="text-cyan-400 font-semibold uppercase tracking-wider text-xs">
            Expert Insights
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Featured Speakers
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Hover over a card to reveal session details, abstracts, and professional backgrounds.
          </p>
        </div>

        {/* 3D Cards Grid */}
        <div className="flex flex-wrap justify-center gap-8">
          {speakers.map((speaker, idx) => (
            <div key={idx} className="w-full max-w-sm md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] flex-shrink-0">
              <SpeakerCard speaker={speaker} idx={idx} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function SpeakerCard({ speaker, idx }: { speaker: Speaker; idx: number }) {
  const bgGradients = [
    "from-[#11291f] to-[#091711] border-emerald-500/20 shadow-[0_15px_35px_rgba(16,185,129,0.15)]", // green
    "from-[#122332] to-[#0a151f] border-cyan-500/20 shadow-[0_15px_35px_rgba(6,182,212,0.15)]",      // blue
    "from-[#221813] to-[#140e0c] border-orange-500/20 shadow-[0_15px_35px_rgba(249,115,22,0.15)]",   // clay
    "from-[#1d1730] to-[#110e1d] border-purple-500/20 shadow-[0_15px_35px_rgba(139,92,246,0.15)]",   // purple
  ];
  const bgGradient = bgGradients[idx % bgGradients.length];
  const speakerImage = speaker.image || "/abhishek.png";

  return (
    <div
      className="relative h-[420px] w-full cursor-pointer [perspective:1000px] group select-none"
    >
      {/* Inner Flipping Card Wrapper */}
      <div
        style={{ transitionDuration: "1100ms" }}
        className="relative w-full h-full [transform-style:preserve-3d] transition-transform group-hover:[transform:rotateY(180deg)]"
      >
        
        {/* FRONT FACE */}
        <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gradient-to-b ${bgGradient} border border-white/5 rounded-[28px] flex flex-col justify-end shadow-2xl relative overflow-hidden`}>
          
          {/* Full bleed image background */}
          <div className="absolute inset-0 z-0">
            <Image
              src={speakerImage}
              alt={speaker.name}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Blending overlay gradient to make text readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent pointer-events-none" />
          </div>

          {/* Title & Bio Info */}
          <div className="space-y-1 text-center w-full px-6 pt-3 select-none relative z-20">
            <h3 className="text-xl font-black text-white tracking-wide leading-tight drop-shadow-md truncate">
              {speaker.name}
            </h3>
            <p className="text-xs font-bold text-cyan-400 tracking-wide uppercase leading-none text-glow">
              {speaker.role}
            </p>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-none mt-1 drop-shadow">
              {speaker.company}
            </p>
          </div>

          {/* Stats & CTA bottom bar */}
          <div className="mt-6 w-full px-6 pb-6 flex items-center justify-between border-t border-white/10 pt-4 relative z-20">
            <div className="text-left">
              <span className="text-[8px] text-slate-300 font-bold uppercase tracking-wider block leading-none">Session</span>
              <span className="text-xs font-black text-white mt-1.5 block leading-none">Track 0{idx + 1}</span>
            </div>
            <button className="px-5 py-2.5 bg-white hover:bg-[#00f0ff] hover:text-slate-950 text-slate-950 font-bold rounded-full text-[10px] uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95">
              View Topic
            </button>
          </div>

        </div>

        {/* BACK FACE */}
        <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-b ${bgGradient} border border-white/5 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden`}>
          {/* Subtle blurred speaker photo in the background for depth */}
          <div className="absolute inset-0 opacity-15 blur-xl scale-110 pointer-events-none z-0">
            <Image
              src={speakerImage}
              alt=""
              fill
              className="object-cover object-top"
            />
          </div>

          <div className="space-y-4 relative z-10">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest">
                Topic & Abstract
              </span>
              <a
                href={speaker.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // Stop flip on click
                className="text-slate-300 hover:text-[#00f0ff] transition-colors p-1"
                title="LinkedIn Profile"
              >
                <LinkedinIcon size={18} />
              </a>
            </div>

            {/* Session Title */}
            <div className="space-y-1">
              <h4 className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                Presentation Topic
              </h4>
              <p className="text-xs sm:text-sm font-bold text-white tracking-wide leading-snug">
                {speaker.topic}
              </p>
            </div>

            {/* Abstract */}
            <div className="space-y-1">
              <h4 className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                Abstract
              </h4>
              <p className="text-[10.5px] text-slate-300 leading-relaxed line-clamp-6">
                {speaker.bio}
              </p>
            </div>

          </div>

          {/* Footer controls */}
          <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs relative z-10">
            <span className="text-slate-400 font-bold uppercase text-[8px] tracking-widest">
              Click to flip back
            </span>
            <a
              href={speaker.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-cyan-400 font-extrabold hover:text-[#00f0ff] hover:underline flex items-center gap-1 text-[11px]"
            >
              LinkedIn Profile <ExternalLink size={12} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
