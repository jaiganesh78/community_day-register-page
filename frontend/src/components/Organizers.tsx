"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
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

const GithubIcon = ({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
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
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const MailIcon = ({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
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
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

interface Advisor {
  name: string;
  role: string;
  department: string;
  linkedin: string;
  bio?: string;
  background?: string;
  focusAreas?: string[];
  isSpecial?: boolean;
}

interface CoreMember {
  name: string;
  role: string;
  department: string;
  bio: string;
  linkedin: string;
  github: string;
  email: string;
  image: string;
  responsibilities: string[];
}

interface CrewMember {
  name: string;
  role: string;
  department: string;
  image: string;
  bio: string;
  responsibilities: string[];
  linkedin: string;
  github: string;
  email: string;
}

const advisors: Advisor[] = [
  {
    name: "Mr. B. Bhuvaneshwaran",
    role: "Faculty Coordinator & Cloud Mentor",
    department: "Information Technology",
    linkedin: "https://www.linkedin.com/in/bhuvaneswaranrec/",
    bio: "A dedicated educator and mentor, guiding the AWS Students Builder Group at REC in fostering innovation, technical excellence, and industry readiness. With a strong focus on cloud computing and emerging technologies, he supports students in building practical skills, leading impactful initiatives, and creating meaningful learning experiences through community-driven programs and events.",
    focusAreas: [
      "Student Mentorship & Leadership",
      "Cloud Learning Initiatives",
      "Industry-Academia Collaboration",
      "Community Growth & Development"
    ],
    isSpecial: true,
  },
];

const coreTeam: CoreMember[] = [
  {
    name: "Prathakshanaa",
    role: "Cloud Captain",
    department: "Information Technology",
    bio: "Leads the cloud learning initiatives of the AWS Students Builder Group and promotes AWS technologies within the student community. Responsible for organizing cloud-focused events, encouraging hands-on learning, and helping students explore certifications, projects, and career opportunities in cloud computing.",
    linkedin: "https://www.linkedin.com/in/prathakshanaa/",
    github: "https://github.com/",
    email: "prathakshanaa@example.com",
    image: "/prathakshanaa.jpeg",
    responsibilities: [
      "AWS Learning Programs",
      "Community Building",
      "Technical Workshops",
      "Cloud Advocacy"
    ]
  },
  {
    name: "Pranav Ranjan",
    role: "Tech Lead",
    department: "Information Technology",
    bio: "Oversees the technical execution of community initiatives and Student Community Day 2026. Ensures smooth operation of event platforms, technical infrastructure, and digital experiences while guiding the team on technical decisions and innovation.",
    linkedin: "https://www.linkedin.com/in/knpranavranjan/",
    github: "https://github.com/",
    email: "pranav@example.com",
    image: "/pranav-ranjan.jpeg",
    responsibilities: [
      "Technical Strategy",
      "Platform Development",
      "Cloud Architecture",
      "Team Mentorship"
    ]
  },
  {
    name: "Thirunavukkarasu",
    role: "Social Media Lead",
    department: "Computer Science",
    bio: "Drives the online presence of the AWS Students Builder Group through engaging content, event promotions, and community engagement. Responsible for building awareness, increasing reach, and showcasing the impact of community initiatives.",
    linkedin: "https://www.linkedin.com/in/thirunavukkarasu-veeramani-140b6a317/",
    github: "https://github.com/",
    email: "thirunavukkarasu@example.com",
    image: "/thirunavukkarasu.png",
    responsibilities: [
      "Content Strategy",
      "Event Promotions",
      "Community Engagement",
      "Brand Communication"
    ]
  },
  {
    name: "Giiridharan",
    role: "IT & Support Lead",
    department: "Information Technology",
    bio: "Manages the technical support and operational requirements of events and community activities. Ensures all systems, equipment, and digital resources function efficiently to provide a seamless experience for speakers, attendees, and organizers.",
    linkedin: "https://www.linkedin.com/in/giridharanr777/",
    github: "https://github.com/",
    email: "giiridharan@example.com",
    image: "/giridharan.png",
    responsibilities: [
      "Technical Operations",
      "Event Infrastructure",
      "Troubleshooting & Support",
      "Resource Management"
    ]
  },
  {
    name: "Dilip Kannan",
    role: "Event Management Lead",
    department: "Information Technology",
    bio: "Coordinates planning, execution, and collaboration across various teams to ensure the success of Student Community Day 2026 and community activities. Works closely with speakers, sponsors, volunteers, and organizers to deliver impactful experiences.",
    linkedin: "https://www.linkedin.com/in/dilip-kannan-k/",
    github: "https://github.com/",
    email: "dilip@example.com",
    image: "/dilip_kannan.JPG",
    responsibilities: [
      "Event Planning",
      "Team Coordination",
      "Stakeholder Management",
      "Community Operations"
    ]
  }
];

const crewTeam: CrewMember[] = [
  {
    name: "Aditya P",
    role: "Technical Support",
    department: "Information Technology",
    image: "/crew_1.png",
    bio: "Aditya manages cloud-native developer environments, assists with registration API integrations, and ensures high availability of hackathon server clusters.",
    responsibilities: ["API Integrations", "Cluster Operations", "Hardware Diagnostics"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "aditya@example.com"
  },
  {
    name: "Bhavya S",
    role: "Ops Coordinator",
    department: "Computer Science",
    image: "/crew_2.png",
    bio: "Bhavya coordinates presentation logistics, controls stage lighting setups, and organizes interactive gaming arenas for event breaks.",
    responsibilities: ["Stage Event Flow", "Breakout Session Logistics", "AV Control Systems"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "bhavya@example.com"
  },
  {
    name: "Charan K",
    role: "Web Developer",
    department: "Information Technology",
    image: "/crew_3.png",
    bio: "Charan is a developer building landing pages, optimizing SVG animations, and ensuring mobile-first responsive viewports for the event site.",
    responsibilities: ["Tailwind Utility Styling", "Next.js Build Optimization", "Responsive QA Testing"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "charan@example.com"
  },
  {
    name: "Divya N",
    role: "Design Associate",
    department: "Computer Science",
    image: "/crew_4.png",
    bio: "Divya crafts custom vectors, designs banner assets, and styles printable ID badges for all student delegates and keynote speakers.",
    responsibilities: ["Graphic Vector Assets", "ID Badge Custom Layouts", "Promotional Keynote Slides"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "divya@example.com"
  },
  {
    name: "Eshwar R",
    role: "Logistics Associate",
    department: "Information Technology",
    image: "/crew_5.png",
    bio: "Eshwar handles collegiate networking arrangements, manages check-in desks, and directs catering queues during the community lunch break.",
    responsibilities: ["Delegate Check-in Systems", "Local Vendor Coordination", "Catering & Lounge Setup"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "eshwar@example.com"
  },
  {
    name: "Faisal M",
    role: "Cloud Associate",
    department: "Computer Science",
    image: "/crew_1.png",
    bio: "Faisal sets up sandbox AWS IAM credentials, builds serverless mock APIs for workshops, and assists attendees with container builds.",
    responsibilities: ["AWS Account Vending", "Serverless API Mocks", "Docker Build Support"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "faisal@example.com"
  },
  {
    name: "Gita V",
    role: "Public Relations",
    department: "Artificial Intelligence",
    image: "/priya.png",
    bio: "Gita runs public relations pipelines, drafting collegiate announcements and publishing newsletter summaries to local tech hubs.",
    responsibilities: ["Newsletter Content Copy", "Collegiate PR Outreach", "Sponsor Relations Support"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "gita@example.com"
  },
  {
    name: "Jaiganesh",
    role: "Technical Support",
    department: "Information Technology",
    image: "/1772814923817.jpg",
    bio: "Jaiganesh conducts live tech checks, verifies HDMI projections, and ensures flawless audio signals across main venue presentation halls.",
    responsibilities: ["Technical support", "event coordination support", "social media content editing"],
    linkedin: "https://www.linkedin.com/in/jai-ganesh-g-aa294632a/",
    github: "https://github.com/jaiganesh78",
    email: "jaigokul67@gmail.com"
  },
  {
    name: "Indu J",
    role: "Ops Coordinator",
    department: "Computer Science",
    image: "/crew_3.png",
    bio: "Indu arranges accommodation guides, coordinates local shuttle schedules, and runs the info desk for out-of-town student delegates.",
    responsibilities: ["Delegate Travel Guides", "Shuttle Dispatch Flow", "General Information Desk"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "indu@example.com"
  },
  {
    name: "Karthik S",
    role: "Web Developer",
    department: "Information Technology",
    image: "/crew_4.png",
    bio: "Karthik designs the real-time feedback forms, tracks registrations database pipelines, and automates email confirmations via SES.",
    responsibilities: ["SES Email Templates", "Database Pipeline Queries", "Feedback Form API"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "karthik@example.com"
  },
  {
    name: "Leela M",
    role: "Design Associate",
    department: "Computer Science",
    image: "/crew_5.png",
    bio: "Leela plans video highlights, takes official event photos, and edits social media reels showcasing keynote highlights.",
    responsibilities: ["Highlight Reel Editing", "Photography Coverage", "Social Post Aesthetics"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "leela@example.com"
  },
  {
    name: "Manoj K",
    role: "Logistics Associate",
    department: "Information Technology",
    image: "/crew_1.png",
    bio: "Manoj handles the inventory management of AWS merchandise, distributes T-shirts, and ensures proper storage of extra setup gear.",
    responsibilities: ["Swag Inventory Audits", "Merchandise Distribution", "Equipment Storage Plan"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "manoj@example.com"
  },
  {
    name: "Nisha R",
    role: "Social Media",
    department: "Artificial Intelligence",
    image: "/priya.png",
    bio: "Nisha coordinates real-time event updates, shares live speaker quote cards, and moderates discord community builder channels.",
    responsibilities: ["Live Session Posting", "Speaker Quote Cards", "Discord Moderation"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "nisha@example.com"
  },
  {
    name: "Balaambiga",
    role: "Ops Coordinator",
    department: "Information Technology",
    image: "/balaambiga.jpg",
    bio: "Balaambiga manages logistics, registration support, and attendee queries for the AWS Student Builder Groups.",
    responsibilities: ["Registration Support", "Logistics Coordination", "Attendee Query Help"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "balaambiga@example.com"
  },
  {
    name: "Rannesh Khumar",
    role: "Crew Member",
    department: "Information Technology",
    image: "/rannesh_khumar.jpeg",
    bio: "Rannesh assists with event operations, tech support, and logistics for AWS Student Builder Groups.",
    responsibilities: ["Event Operations", "Technical Support", "Logistics Coordination"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "rannesh@example.com"
  },
  {
    name: "Sam Devaraj",
    role: "Crew Member",
    department: "Information Technology",
    image: "/sam_devaraj.jpeg",
    bio: "Sam coordinates technical setups, cloud workshops support, and hardware logistics.",
    responsibilities: ["Technical Setup", "Workshop Coordination", "Hardware Logistics"],
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    email: "sam@example.com"
  }
];

export default function Organizers() {
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
  const [activeCoreIdx, setActiveCoreIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll Core Team carousel every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCoreIdx((prev) => (prev + 1) % coreTeam.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeCoreIdx]);


  return (
    <section id="organizers" className="py-10 relative overflow-hidden bg-black/20">
      {/* Background radial glows */}
      <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">

        {/* Section Heading */}
        <div className="text-center space-y-4">
          <div className="text-cyan-400 font-semibold uppercase tracking-wider text-xs">
            Organizing Committee
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Meet the Builders
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            The student heads and faculty mentors of the AWS Student Builder Groups at REC College hosting the 2026 Community Day.
          </p>
        </div>

        {/* 1. Faculty Coordinator Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[#00f0ff] border-b border-slate-900 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Faculty Coordinator
          </h3>

          {/* Featured Faculty Coordinator Spotlight click expansion */}
          <FeaturedCoordinatorCard member={advisors[0]} />
        </div>

        {/* 2. Core Team Showcase Section — Coverflow Slider + About Us */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[#00f0ff] border-b border-slate-900 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Core Team
          </h3>

          <div className="flex flex-col lg:flex-row gap-12 items-center justify-between min-h-[480px]">
            {/* Left Side: Coverflow Slider */}
            <div className="w-full lg:w-1/2 flex items-center justify-center relative h-[360px] sm:h-[400px]">
              <div
                style={{ perspective: 1000 }}
                className="relative w-full max-w-[420px] h-full flex items-center justify-center overflow-visible"
              >
                {coreTeam.map((member, idx) => {
                  // Wrapping logic for a circular list
                  let offset = idx - activeCoreIdx;
                  const N = coreTeam.length;
                  if (offset < -Math.floor(N / 2)) offset += N;
                  if (offset > Math.floor((N - 1) / 2)) offset -= N;

                  const isActive = offset === 0;
                  const cardXOffset = isMobile ? 80 : 100;

                  return (
                    <motion.div
                      key={member.name}
                      onClick={() => setActiveCoreIdx(idx)}
                      style={{
                        zIndex: 10 - Math.abs(offset),
                        pointerEvents: "auto",
                      }}
                      animate={{
                        x: offset * cardXOffset,
                        scale: offset === 0 ? 1 : 0.8,
                        rotateY: offset === 0 ? 0 : offset < 0 ? 25 : -25,
                        opacity: offset === 0 ? 1 : Math.max(0.2, 0.7 - Math.abs(offset) * 0.15),
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 22,
                      }}
                      className="absolute w-[240px] sm:w-[280px] aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c1a30] to-[#050b14] border border-cyan-500/20 shadow-[0_0_35px_rgba(0,240,255,0.15)] hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(0,240,255,0.25)] cursor-pointer group/core flex-shrink-0 origin-center"
                    >
                      {/* Portrait Image */}
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 240px, 280px"
                        className="object-cover object-top transition-transform duration-500 group-hover/core:scale-105"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10" />

                      {/* Floating name badge overlay inside card */}
                      <div className="absolute bottom-5 left-4 right-4 z-20 text-center select-none">
                        <h4 className="text-base sm:text-lg font-bold tracking-wide text-white drop-shadow-md truncate">
                          {member.name}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-cyan-400 font-semibold uppercase tracking-wider mt-0.5 truncate leading-none">
                          {member.role}
                        </p>
                      </div>

                      {/* Coverflow card focus effect border */}
                      {isActive && (
                        <div className="absolute inset-0 border-2 border-cyan-400/60 rounded-3xl pointer-events-none z-30" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Side: About Us Panel */}
            <div className="w-full lg:w-1/2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCoreIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel text-white rounded-3xl p-6 sm:p-8 border border-cyan-500/10 shadow-[0_0_40px_rgba(0,240,255,0.08)] bg-[#070712]/90 space-y-6"
                >
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/15 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
                      Core Team Profile
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black mt-2 text-white leading-tight">
                      {coreTeam[activeCoreIdx].name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="text-xs sm:text-sm font-semibold text-cyan-400 uppercase tracking-wider text-glow leading-none">
                        {coreTeam[activeCoreIdx].role}
                      </p>
                      <span className="text-slate-600 text-xs">•</span>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest leading-none">
                        {coreTeam[activeCoreIdx].department}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-[9px] sm:text-[10px] text-[#00f0ff]/65 font-bold uppercase tracking-wider mb-1">
                        Biography & Leadership
                      </h5>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                        {coreTeam[activeCoreIdx].bio}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-[9px] sm:text-[10px] text-[#00f0ff]/65 font-bold uppercase tracking-wider mb-2">
                        Key Responsibilities & Focus
                      </h5>
                      <ul className="grid grid-cols-1 gap-2">
                        {coreTeam[activeCoreIdx].responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-center gap-3 text-slate-300 text-xs sm:text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                    <a
                      href={coreTeam[activeCoreIdx].linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#00f0ff] hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 transition-all active:scale-95 cursor-pointer"
                      title="LinkedIn Profile"
                    >
                      <LinkedinIcon size={16} />
                    </a>
                    <a
                      href={coreTeam[activeCoreIdx].github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                      title="GitHub Profile"
                    >
                      <GithubIcon size={16} />
                    </a>
                    <a
                      href={`mailto:${coreTeam[activeCoreIdx].email}`}
                      className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#ea4335] hover:border-[#ea4335]/50 hover:bg-[#ea4335]/10 transition-all active:scale-95 cursor-pointer"
                      title="Email"
                    >
                      <MailIcon size={16} />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 3. Event Crew Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-[#00f0ff] flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Event Crew
            </h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              Our hard-working student crew members supporting logistics, technical operations, design, and venue management. Click any crew member to view full profiles.
            </p>
          </div>

          {/* Infinite Overlapping Stack Slider moving Left-to-Right */}
          <div className="marquee-container relative w-full overflow-hidden py-10">
            {/* Soft Edge Blending Gradients */}
            <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#020205] to-transparent z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#020205] to-transparent z-20 pointer-events-none" />

            <div className="animate-marquee-ltr flex gap-4 pl-10">
              {[...crewTeam, ...crewTeam].map((member, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedCrew(member)}
                  className="crew-card-stacked group relative flex-shrink-0 w-44 sm:w-52 glass-panel rounded-[24px] border border-cyan-500/10 bg-[#070712]/90 overflow-hidden flex flex-col p-4 cursor-pointer"
                >
                  {/* Card Glow Highlight Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />

                  {/* Image Container - Medium-sized circle/square */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 150px, 200px"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  </div>

                  {/* Text details */}
                  <div className="mt-3.5 space-y-1 text-left relative z-10">
                    <h4 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                      {member.name}
                    </h4>
                    <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest leading-none text-glow">
                      {member.role}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                      {member.department}
                    </p>
                  </div>

                  {/* Hover details overlay */}
                  <div className="absolute inset-0 bg-[#070712]/95 backdrop-blur-sm p-4 flex flex-col justify-between translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-30 rounded-[24px] border border-cyan-500/30">
                    <div className="space-y-3 overflow-hidden">
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">{member.name}</h4>
                        <p className="text-[9px] font-semibold text-cyan-400 uppercase tracking-widest truncate">{member.role}</p>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Bio</span>
                          <p className="text-[10px] text-slate-300 leading-normal line-clamp-3 font-medium">
                            {member.bio}
                          </p>
                        </div>

                        <div>
                          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Focus</span>
                          <div className="flex flex-wrap gap-1">
                            {member.responsibilities.slice(0, 2).map((resp, i) => (
                              <span key={i} className="text-[8px] bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-medium">
                                {resp}
                              </span>
                            ))}
                            {member.responsibilities.length > 2 && (
                              <span className="text-[8px] text-slate-500 px-1 py-0.5 font-bold">
                                +{member.responsibilities.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#00f0ff] hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 transition-all active:scale-90"
                          title="LinkedIn"
                        >
                          <LinkedinIcon size={10} />
                        </a>
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all active:scale-90"
                          title="GitHub"
                        >
                          <GithubIcon size={10} />
                        </a>
                        <a
                          href={`mailto:${member.email}`}
                          className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#ea4335] hover:border-[#ea4335]/50 hover:bg-[#ea4335]/10 transition-all active:scale-90"
                          title="Email"
                        >
                          <MailIcon size={10} />
                        </a>
                      </div>
                      <span className="text-[8px] text-[#00f0ff]/70 font-bold uppercase tracking-wider">
                        More ➔
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Crew Member Modal */}
        <AnimatePresence>
          {selectedCrew && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedCrew(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-xl glass-panel text-white rounded-3xl p-6 md:p-8 border border-cyan-500/20 shadow-[0_0_50px_rgba(0,240,255,0.2)] bg-[#070712]/95 flex flex-col md:flex-row gap-6 md:gap-8 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCrew(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#00f0ff] hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 active:scale-95 transition-all cursor-pointer z-50"
                  aria-label="Close details"
                >
                  ✕
                </button>

                {/* Left Section - Medium image in Modal */}
                <div className="w-full md:w-[45%] flex-shrink-0 relative aspect-square md:aspect-auto md:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                  <Image
                    src={selectedCrew.image}
                    alt={selectedCrew.name}
                    fill
                    priority
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Right Section - Member details */}
                <div className="flex-1 flex flex-col justify-between space-y-4 pt-2 md:pt-0">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/15 text-cyan-400 text-[9px] font-bold uppercase tracking-widest">
                      Crew Committee Member
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold mt-2 text-white leading-tight">
                      {selectedCrew.name}
                    </h3>
                    <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mt-0.5 text-glow">
                      {selectedCrew.role}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      Dept: {selectedCrew.department}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h5 className="text-[9px] text-[#00f0ff]/65 font-bold uppercase tracking-wider mb-1">
                        Biography
                      </h5>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {selectedCrew.bio}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-[9px] text-[#00f0ff]/65 font-bold uppercase tracking-wider mb-1">
                        Key Focus Areas
                      </h5>
                      <ul className="grid grid-cols-1 gap-1.5">
                        {selectedCrew.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse flex-shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Social Icons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                    <a
                      href={selectedCrew.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#00f0ff] hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 transition-all active:scale-95 cursor-pointer"
                      title="LinkedIn Profile"
                    >
                      <LinkedinIcon size={14} />
                    </a>
                    <a
                      href={selectedCrew.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                      title="GitHub Profile"
                    >
                      <GithubIcon size={14} />
                    </a>
                    <a
                      href={`mailto:${selectedCrew.email}`}
                      className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#ea4335] hover:border-[#ea4335]/50 hover:bg-[#ea4335]/10 transition-all active:scale-95 cursor-pointer"
                      title="Email"
                    >
                      <MailIcon size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}


// 3. Featured Coordinator Card Component (Mr. B. Bhuvaneshwaran)

function FeaturedCoordinatorCard({ member }: { member: Advisor }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 15%"]
  });

  // Automatically collapse when user scrolls past or away
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.1 || latest > 0.9) {
      setIsExpanded(false);
    }
  });

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 150);
  };

  // Transform values based on click state
  const imageX = isExpanded && !isMobile ? "-226px" : "0px";
  const imageWidth = isExpanded && !isMobile ? "420px" : (isMobile ? "260px" : "320px");
  const textOpacity = isExpanded ? 1 : 0;
  const textX = isExpanded && !isMobile ? "226px" : (isMobile ? "0px" : "40px");
  const pointerEvents = isExpanded ? ("auto" as const) : ("none" as const);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[500px] flex items-center justify-center py-16 overflow-hidden"
    >
      <div className="relative w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">

        {/* Animated Coordinator Square Photo (moves left & expands wider on click) */}
        <motion.div
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          animate={{
            x: imageX,
            width: imageWidth,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="relative aspect-square h-[260px] sm:h-[320px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c1a30] to-[#050b14] border border-cyan-500/20 shadow-[0_0_35px_rgba(0,240,255,0.15)] hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(0,240,255,0.25)] flex-shrink-0 z-20 cursor-pointer group/spotlight"
        >
          <Image
            src="/bhuvaneshwaran.png"
            alt={member.name}
            fill
            priority
            className="object-cover object-top"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

          {/* Subtle click indicator hint */}
          <div className="absolute top-4 right-4 z-20 bg-slate-950/80 backdrop-blur-sm border border-cyan-500/20 rounded-full px-3 py-1 text-[9px] font-bold text-cyan-300 uppercase tracking-wider pointer-events-none group-hover/spotlight:border-cyan-400 group-hover/spotlight:text-cyan-200 transition-colors">
            {isMobile
              ? (isExpanded ? "Tap to collapse" : "Tap to view bio")
              : (isExpanded ? "Click to lock open" : "Hover to view bio")}
          </div>

          {/* Floating name badge overlay inside card */}
          <div className="absolute bottom-5 left-5 right-5 z-20 text-white select-none">
            <h5 className="text-lg sm:text-xl font-bold tracking-wide drop-shadow-md">{member.name}</h5>
            <p className="text-xs text-cyan-300 font-semibold uppercase tracking-wider mt-0.5">{member.role}</p>
          </div>
        </motion.div>

        {/* Animated Professional Description Panel (slides/fades in on the right on click) */}
        <motion.div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          animate={{
            opacity: textOpacity,
            x: textX,
            scale: isExpanded ? 1 : 0.95
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ pointerEvents }}
          className="w-full lg:w-[420px] text-left space-y-5 z-10 p-6 rounded-2xl glass-panel border border-cyan-500/10 text-white lg:absolute lg:left-[calc(50%-210px)]"
        >
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/15 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
              Spotlight Organizer
            </span>
            <h3 className="text-2xl font-black mt-2 text-white leading-tight">
              {member.name}
            </h3>
            <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mt-0.5 text-glow animate-pulse">
              {member.role}
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">
              {member.department}
            </p>
          </div>

          <div className="space-y-3.5">
            <div>
              <h5 className="text-[9px] text-[#00f0ff]/65 font-bold uppercase tracking-wider mb-1">
                Faculty Biography
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {member.bio}
              </p>
            </div>

            {member.focusAreas && (
              <div>
                <h5 className="text-[9px] text-[#00f0ff]/65 font-bold uppercase tracking-wider mb-1.5">
                  Key Focus Areas
                </h5>
                <ul className="grid grid-cols-1 gap-1.5">
                  {member.focusAreas.map((area, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse flex-shrink-0" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-[#00f0ff] font-bold uppercase text-xs tracking-wider transition-colors"
            >
              <LinkedinIcon size={16} /> Connect on LinkedIn
            </a>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              AWS SBG REC
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
