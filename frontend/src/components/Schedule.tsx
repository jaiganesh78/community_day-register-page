"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, Users, Coffee, Mic } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";

/* ─────────────────────────────────────────────
   3D TOY COMPONENT
   ───────────────────────────────────────────── */
const ThreeDToy = () => {
  return (
    <div className="perspective-container w-10 h-10 flex items-center justify-center pointer-events-none">
      <div className="preserve-3d w-full h-full relative flex items-center justify-center animate-float-toy">
        {/* Core glowing sphere */}
        <div className="absolute w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_#00f0ff] animate-pulse" />
        {/* Outer Ring 1 */}
        <div className="absolute w-8 h-8 rounded-full border-2 border-cyan-400/40 animate-spin-ring-1 preserve-3d" />
        {/* Outer Ring 2 */}
        <div className="absolute w-10 h-10 rounded-full border-2 border-blue-500/40 animate-spin-ring-2 preserve-3d" />
      </div>
    </div>
  );
};


interface AgendaItem {
  time: string;
  title: string;
  speaker: string;
  description: string;
  type: "keynote" | "technical" | "break" | "general";
}

const agenda: AgendaItem[] = [
  {
    time: "08:00 AM – 09:00 AM",
    title: "Registration & Networking",
    speaker: "REC Organizers",
    description: "Collect your ID badges, welcome kits, and networking pass.",
    type: "general",
  },
  {
    time: "09:00 AM – 09:15 AM",
    title: "Welcome Address",
    speaker: "REC Faculty & Student Leads",
    description: "Welcome speech, lamp lighting, and briefing of Community Day goals.",
    type: "general",
  },
  {
    time: "09:15 AM – 09:30 AM",
    title: "Sponsor Speech 1",
    speaker: "Industry Partner",
    description: "Insights on cloud careers and industry requirements.",
    type: "keynote",
  },
  {
    time: "09:30 AM – 09:45 AM",
    title: "Sponsor Speech 2",
    speaker: "Industry Partner",
    description: "Technological trends and internship opportunities.",
    type: "keynote",
  },
  {
    time: "09:45 AM – 10:15 AM",
    title: "Track Allocation & Networking",
    speaker: "Volunteers",
    description: "Guidance on halls and setup for parallel tracks.",
    type: "general",
  },
  {
    time: "10:15 AM – 10:45 AM",
    title: "Technical Session 1",
    speaker: "Parallel Session Speakers",
    description: "Session 1 running in parallel: Track 1, Track 2, and Track 3.",
    type: "technical",
  },
  {
    time: "10:45 AM – 11:00 AM",
    title: "Tea Break & Hall Transition",
    speaker: "Attendees & Experts",
    description: "Refuel and move to the respective track halls.",
    type: "break",
  },
  {
    time: "11:00 AM – 11:30 AM",
    title: "Technical Session 2",
    speaker: "Parallel Session Speakers",
    description: "Session 2 running in parallel: Track 1, Track 2, and Track 3.",
    type: "technical",
  },
  {
    time: "11:30 AM – 12:00 PM",
    title: "Technical Session 3",
    speaker: "Parallel Session Speakers",
    description: "Session 3 running in parallel: Track 1, Track 2, and Track 3.",
    type: "technical",
  },
  {
    time: "12:00 PM – 01:00 PM",
    title: "Lunch Break",
    speaker: "Attendees & Partner Desk",
    description: "Complimentary buffet lunch and partner desk visits.",
    type: "break",
  },
  {
    time: "01:00 PM – 01:30 PM",
    title: "Technical Session 4",
    speaker: "Parallel Session Speakers",
    description: "Session 4 running in parallel: Track 1, Track 2, and Track 3.",
    type: "technical",
  },
  {
    time: "01:30 PM – 02:00 PM",
    title: "Technical Session 5",
    speaker: "Parallel Session Speakers",
    description: "Session 5 running in parallel: Track 1, Track 2, and Track 3.",
    type: "technical",
  },
  {
    time: "02:00 PM – 02:30 PM",
    title: "Tea Break & Networking",
    speaker: "Attendees & Experts",
    description: "Refuel with snacks and network with builders.",
    type: "break",
  },
  {
    time: "02:30 PM – 03:00 PM",
    title: "Quiz / Sponsor Activity",
    speaker: "Quiz Masters",
    description: "AWS trivia quiz and exciting sponsor engagement challenges.",
    type: "general",
  },
  {
    time: "03:00 PM – 03:45 PM",
    title: "Closing Ceremony",
    speaker: "REC Faculty & Student Leads",
    description: "Closing address, raffle draws, and community builder announcements.",
    type: "keynote",
  },
  {
    time: "03:45 PM – 04:00 PM",
    title: "Group Photo Session",
    speaker: "All Attendees",
    description: "Capturing memories of AWS Student Community Day 2026.",
    type: "general",
  },
  {
    time: "04:00 PM – 04:30 PM",
    title: "Goodies & Swag Distribution",
    speaker: "Volunteers",
    description: "Collect your event certificates and custom community swags.",
    type: "general",
  },
  {
    time: "05:00 PM onwards",
    title: "College Closing Time",
    speaker: "Organizers & Attendees",
    description: "End of AWS Student Community Day 2026. Have a safe journey back!",
    type: "general",
  },
];

const TYPE_CONFIG = {
  keynote: {
    icon: <Mic size={11} />,
    label: "Keynote",
    dotBg: "bg-cyan-400",
    dotGlow: "shadow-[0_0_14px_rgba(34,211,238,0.6)]",
    dotRing: "ring-cyan-400/25",
    badge: "bg-cyan-500/10 border-cyan-500/25 text-cyan-400",
    cardBorder: "border-cyan-500/20 hover:border-cyan-500/40",
    cardGlow: "hover:shadow-[0_0_22px_rgba(34,211,238,0.07)]",
    timeCls: "text-cyan-400",
    lineCls: "bg-cyan-500/30",
    curveCls: "border-cyan-500/20",
  },
  technical: {
    icon: <Terminal size={11} />,
    label: "Tech",
    dotBg: "bg-blue-400",
    dotGlow: "shadow-[0_0_14px_rgba(96,165,250,0.6)]",
    dotRing: "ring-blue-400/25",
    badge: "bg-blue-500/10 border-blue-500/25 text-blue-400",
    cardBorder: "border-blue-500/20 hover:border-blue-500/40",
    cardGlow: "hover:shadow-[0_0_22px_rgba(96,165,250,0.07)]",
    timeCls: "text-blue-400",
    lineCls: "bg-blue-500/30",
    curveCls: "border-blue-500/20",
  },
  break: {
    icon: <Coffee size={11} />,
    label: "Break",
    dotBg: "bg-amber-400",
    dotGlow: "shadow-[0_0_14px_rgba(251,191,36,0.5)]",
    dotRing: "ring-amber-400/25",
    badge: "bg-amber-500/10 border-amber-500/25 text-amber-400",
    cardBorder: "border-amber-500/20 hover:border-amber-500/40",
    cardGlow: "hover:shadow-[0_0_22px_rgba(251,191,36,0.06)]",
    timeCls: "text-amber-400",
    lineCls: "bg-amber-500/30",
    curveCls: "border-amber-500/20",
  },
  general: {
    icon: <Users size={11} />,
    label: "General",
    dotBg: "bg-slate-400",
    dotGlow: "shadow-[0_0_10px_rgba(148,163,184,0.35)]",
    dotRing: "ring-slate-400/20",
    badge: "bg-slate-500/10 border-slate-500/25 text-slate-400",
    cardBorder: "border-slate-700/40 hover:border-slate-600/60",
    cardGlow: "hover:shadow-[0_0_22px_rgba(148,163,184,0.05)]",
    timeCls: "text-slate-400",
    lineCls: "bg-slate-500/30",
    curveCls: "border-slate-600/20",
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

/** Single card in the snake grid */
function SnakeCard({ item, number }: { item: AgendaItem; number: number }) {
  const cfg = TYPE_CONFIG[item.type];
  return (
    <div className="flex flex-col items-center group w-full">
      {/* Numbered node */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        data-timeline-node={number}
        className={`relative z-10 mb-3 w-9 h-9 rounded-full flex items-center justify-center
          ${cfg.dotBg} ${cfg.dotGlow} ring-4 ${cfg.dotRing}
          transition-all duration-300 group-hover:scale-110`}
      >
        <span className="text-xs font-black text-slate-950 leading-none">{number}</span>
      </motion.div>

      {/* Card */}
      <motion.div
        variants={cardVariants}
        className={`w-full rounded-2xl border bg-[#070712]/90 px-4 py-3.5 space-y-1.5
          transition-all duration-300 ${cfg.cardBorder} ${cfg.cardGlow}`}
      >
        <div className={`text-[11px] sm:text-xs font-mono font-black tracking-wide ${cfg.timeCls} px-2.5 py-1 rounded-md bg-slate-950/80 border border-current/15 w-fit mb-2 shadow-[0_0_12px_rgba(0,0,0,0.5)]`}>
          {item.time}
        </div>
        <div className="flex items-start gap-2">
          <span
            className={`flex-shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5
              rounded text-[9px] font-black uppercase tracking-wider border mt-0.5 ${cfg.badge}`}
          >
            {cfg.icon}
            <span className="hidden sm:inline ml-0.5">{cfg.label}</span>
          </span>
          <h3 className="text-[13px] font-bold text-white leading-snug">{item.title}</h3>
        </div>
        <p className="text-[11px] text-slate-500 line-clamp-1 pl-6">{item.speaker}</p>
        <p className="text-[11px] text-slate-400 pl-6 leading-relaxed mt-1">{item.description}</p>
      </motion.div>
    </div>
  );
}



interface TrackSession {
  session: string;
  time: string;
  topic: string;
  speaker: string;
}

interface TrackInfo {
  name: string;
  theme: "blue" | "cyan" | "amber";
  badge: string;
  glow: string;
  border: string;
  bullet: string;
  textBadge: string;
  sessions: TrackSession[];
}

const TRACKS_DATA: TrackInfo[] = [
  {
    name: "Track 1: Cloud & DevOps",
    theme: "blue",
    badge: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    glow: "shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:shadow-[0_0_35px_rgba(59,130,246,0.25)]",
    border: "border-blue-500/20 hover:border-blue-500/40",
    bullet: "before:bg-blue-400 before:shadow-[0_0_8px_rgba(96,165,250,0.6)]",
    textBadge: "text-blue-400",
    sessions: [
      { session: "Session 1", time: "10:15 AM – 10:45 AM", topic: "Track 1: Session Details To Be Announced", speaker: "" },
      { session: "Break", time: "10:45 AM – 11:00 AM", topic: "Tea Break & Hall Transition", speaker: "" },
      { session: "Session 2", time: "11:00 AM – 11:30 AM", topic: "Track 1: Session Details To Be Announced", speaker: "" },
      { session: "Session 3", time: "11:30 AM – 12:00 PM", topic: "Track 1: Session Details To Be Announced", speaker: "" },
      { session: "Break", time: "12:00 PM – 01:00 PM", topic: "Lunch Break & Networking", speaker: "" },
      { session: "Session 4", time: "01:00 PM – 01:30 PM", topic: "Track 1: Session Details To Be Announced", speaker: "" },
      { session: "Session 5", time: "01:30 PM – 02:00 PM", topic: "Track 1: Session Details To Be Announced", speaker: "" },
    ]
  },
  {
    name: "Track 2: AI & Generative AI",
    theme: "cyan",
    badge: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
    glow: "shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:shadow-[0_0_35px_rgba(6,182,212,0.25)]",
    border: "border-cyan-500/20 hover:border-cyan-500/40",
    bullet: "before:bg-cyan-400 before:shadow-[0_0_8px_rgba(34,211,238,0.6)]",
    textBadge: "text-cyan-400",
    sessions: [
      { session: "Session 1", time: "10:15 AM – 10:45 AM", topic: "Track 2: Session Details To Be Announced", speaker: "" },
      { session: "Break", time: "10:45 AM – 11:00 AM", topic: "Tea Break & Hall Transition", speaker: "" },
      { session: "Session 2", time: "11:00 AM – 11:30 AM", topic: "Track 2: Session Details To Be Announced", speaker: "" },
      { session: "Session 3", time: "11:30 AM – 12:00 PM", topic: "Track 2: Session Details To Be Announced", speaker: "" },
      { session: "Break", time: "12:00 PM – 01:00 PM", topic: "Lunch Break & Networking", speaker: "" },
      { session: "Session 4", time: "01:00 PM – 01:30 PM", topic: "Track 2: Session Details To Be Announced", speaker: "" },
      { session: "Session 5", time: "01:30 PM – 02:00 PM", topic: "Track 2: Session Details To Be Announced", speaker: "" },
    ]
  },
  {
    name: "Track 3: Career & Community",
    theme: "amber",
    badge: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    glow: "shadow-[0_0_25px_rgba(245,158,11,0.12)] hover:shadow-[0_0_35px_rgba(245,158,11,0.22)]",
    border: "border-amber-500/20 hover:border-amber-500/40",
    bullet: "before:bg-amber-400 before:shadow-[0_0_8px_rgba(251,191,36,0.5)]",
    textBadge: "text-amber-400",
    sessions: [
      { session: "Session 1", time: "10:15 AM – 10:45 AM", topic: "Track 3: Session Details To Be Announced", speaker: "" },
      { session: "Break", time: "10:45 AM – 11:00 AM", topic: "Tea Break & Hall Transition", speaker: "" },
      { session: "Session 2", time: "11:00 AM – 11:30 AM", topic: "Track 3: Session Details To Be Announced", speaker: "" },
      { session: "Session 3", time: "11:30 AM – 12:00 PM", topic: "Track 3: Session Details To Be Announced", speaker: "" },
      { session: "Break", time: "12:00 PM – 01:00 PM", topic: "Lunch Break & Networking", speaker: "" },
      { session: "Session 4", time: "01:00 PM – 01:30 PM", topic: "Track 3: Session Details To Be Announced", speaker: "" },
      { session: "Session 5", time: "01:30 PM – 02:00 PM", topic: "Track 3: Session Details To Be Announced", speaker: "" },
    ]
  }
];

const COLS = 3;
const FILTERS = ["all", "keynote", "technical", "break", "general"] as const;

export default function Schedule() {
  const [filter, setFilter] = useState<string>("all");
  const filtered = agenda.filter((item) => filter === "all" || item.type === filter);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [nodeCoords, setNodeCoords] = useState<{ x: number; y: number }[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [toyPos, setToyPos] = useState<{ x: number; y: number } | null>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 65%", "end 65%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 20,
    restDelta: 0.001,
  });

  useEffect(() => {
    const updatePosition = () => {
      const pathEl = pathRef.current;
      if (!pathEl || nodeCoords.length === 0) return;

      const totalLength = pathEl.getTotalLength();
      if (!totalLength) return;

      const progress = smoothProgress.get();
      const clamped = Math.max(0, Math.min(1, progress));

      const point = pathEl.getPointAtLength(clamped * totalLength);
      setToyPos({ x: point.x, y: point.y });
    };

    const unsubscribe = smoothProgress.on("change", updatePosition);
    updatePosition();
    window.addEventListener("resize", updatePosition, { passive: true });

    const interval = setInterval(updatePosition, 100);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", updatePosition);
      clearInterval(interval);
    };
  }, [nodeCoords, smoothProgress]);

  // Group into rows of COLS
  const rows: AgendaItem[][] = [];
  for (let i = 0; i < filtered.length; i += COLS) {
    rows.push(filtered.slice(i, i + COLS));
  }

  // Effect to measure static layout node coordinates
  useEffect(() => {
    const measureCoords = () => {
      if (!sectionRef.current) return;
      const isMobile = window.innerWidth < 768;
      const nodes = Array.from(document.querySelectorAll("[data-timeline-node]"))
        .filter((el) => {
          const inMobile = el.closest(".md\\:hidden") !== null;
          return isMobile ? inMobile : !inMobile;
        })
        .map((el) => {
          const num = parseInt(el.getAttribute("data-timeline-node") || "0", 10);
          return { el, num };
        })
        .sort((a, b) => a.num - b.num);

      if (nodes.length === 0) return;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const coords = nodes.map(({ el }) => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left - sectionRect.left + rect.width / 2,
          y: rect.top - sectionRect.top + rect.height / 2,
        };
      });
      setNodeCoords(coords);
    };

    window.addEventListener("resize", measureCoords, { passive: true });
    // Execute after mount and font loading stabilizes layout
    const timer = setTimeout(measureCoords, 200);

    return () => {
      window.removeEventListener("resize", measureCoords);
      clearTimeout(timer);
    };
  }, [filter, filtered.length]);



  // Compute continuous path string
  const pathD = (() => {
    if (nodeCoords.length === 0 || !sectionRef.current) return "";
    const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;
    const sectionWidth = sectionRef.current.clientWidth;

    let d = `M ${nodeCoords[0].x} ${nodeCoords[0].y}`;

    for (let i = 0; i < nodeCoords.length - 1; i++) {
      const start = nodeCoords[i];
      const end = nodeCoords[i + 1];

      const isRowTransition = !isMobile && Math.abs(start.y - end.y) > 40 && Math.abs(start.x - end.x) < 40;

      if (isRowTransition) {
        const isRightBend = start.x > sectionWidth / 2;
        const colStep = nodeCoords.length > 1 ? Math.abs(nodeCoords[1].x - nodeCoords[0].x) : 0;
        const exitDist = colStep ? colStep * 0.52 : 160;
        const curveOff = colStep ? colStep * 0.35 : 100;

        const startXExit = isRightBend ? start.x + exitDist : start.x - exitDist;
        const endXExit = isRightBend ? end.x + exitDist : end.x - exitDist;

        const cp1x = isRightBend ? startXExit + curveOff : startXExit - curveOff;
        const cp2x = isRightBend ? endXExit + curveOff : endXExit - curveOff;

        d += ` L ${startXExit} ${start.y}`;
        d += ` C ${cp1x} ${start.y}, ${cp2x} ${end.y}, ${endXExit} ${end.y}`;
        d += ` L ${end.x} ${end.y}`;
      } else {
        d += ` L ${end.x} ${end.y}`;
      }
    }
    return d;
  })();

  return (
    <section ref={sectionRef} id="schedule" className="py-10 relative overflow-hidden">
      {/* Continuous Timeline Overlay Path SVG */}
      {pathD && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Background track path */}
          <path
            d={pathD}
            fill="none"
            className="stroke-slate-800/40"
            strokeWidth="2"
          />
          {/* Glowing foreground path */}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            className="stroke-cyan-400/80 timeline-dash-flow"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* 3D Moving Toy on the Timeline Path */}
      {toyPos && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: `${toyPos.x}px`,
            top: `${toyPos.y}px`,
            transform: "translate(-50%, -50%) translate3d(0, 0, 0)",
          }}
        >
          <ThreeDToy />
        </div>
      )}

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-10 left-1/4 w-96 h-96 rounded-full bg-cyan-600/5 blur-[150px]" />
        <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ─── Header ─────────────────────────────────────────── */}
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center space-y-3 mb-12"
        >
          <p className="text-cyan-400 font-bold uppercase tracking-widest text-[10px]">
            Event Agenda
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Event Schedule
          </h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Follow the path — a full day of cloud, AI, and community sessions.
          </p>

          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {FILTERS.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                  border transition-all duration-200 ${
                    filter === t
                      ? "bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                      : "border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ─── Timeline Scroll Container ───────────────────────── */}
        <div ref={timelineRef} className="relative">
          {/* ─── Snake Timeline — Desktop ────────────────────────── */}
          <motion.div 
            key={`desktop_${filter}`}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="hidden md:block"
          >
            {rows.map((row, rowIdx) => {
              const isReversed = rowIdx % 2 === 1;
              const globalStart = rowIdx * COLS;
              
              // Pad reversed rows that are not full with empty divs on the left
              const paddingCount = isReversed ? COLS - row.length : 0;
              const padArray = Array.from({ length: paddingCount });

              return (
                <React.Fragment key={rowIdx}>
                  {/* ── 3-column row ── */}
                  <div className="relative">
                    <div className="grid grid-cols-3 gap-5">
                      {/* Render empty padding divs on the left if reversed and incomplete */}
                      {padArray.map((_, pIdx) => (
                        <div key={`pad-${pIdx}`} />
                      ))}
                      
                      {(isReversed ? [...row].reverse() : row).map((item, colIdx) => {
                        const seqNum = isReversed
                          ? globalStart + (row.length - 1 - colIdx) + 1
                          : globalStart + colIdx + 1;
                        return <SnakeCard key={colIdx} item={item} number={seqNum} />;
                      })}
                    </div>
                  </div>

                  {/* ── U-curve spacing spacer ── */}
                  {rowIdx < rows.length - 1 && (
                    <div className="h-10" />
                  )}
                </React.Fragment>
              );
            })}
          </motion.div>

          {/* ─── Vertical list — Mobile ──────────────────────────── */}
          <motion.div 
            key={`mobile_${filter}`}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="md:hidden relative"
          >
            <div className="space-y-3 pl-2">
              {filtered.map((item, idx) => {
                const cfg = TYPE_CONFIG[item.type];
                return (
                  <div key={idx} className="flex items-start gap-4 group">
                    {/* Mobile dot */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5 }}
                      data-timeline-node={idx + 1}
                      className={`relative z-10 flex-shrink-0 mt-3 w-5 h-5 rounded-full
                        flex items-center justify-center ${cfg.dotBg} ${cfg.dotGlow}`}
                    >
                      <span className="text-[8px] font-black text-slate-950">{idx + 1}</span>
                    </motion.div>

                    {/* Mobile card */}
                    <motion.div
                      variants={cardVariants}
                      className={`flex-1 rounded-xl border bg-[#070712]/80 px-4 py-3
                        transition-all duration-300 ${cfg.cardBorder}`}
                    >
                      <div className={`text-[10px] sm:text-[11px] font-mono font-black tracking-wide ${cfg.timeCls} px-2 py-0.5 rounded-md bg-slate-950/80 border border-current/15 w-fit mb-1.5 shadow-[0_0_12px_rgba(0,0,0,0.5)]`}>
                        {item.time}
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-1">{item.description}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{item.speaker}</p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ─── Parallel Session Tracks Breakout ─────────────────── */}
        <div className="mt-24 pt-16 border-t border-slate-900/60 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center space-y-3 mb-12"
          >
            <p className="text-cyan-400 font-bold uppercase tracking-widest text-[10px]">
              Event Tracks
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Technical Tracks
            </h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Session details for each of our three parallel technical tracks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TRACKS_DATA.map((track, tIdx) => (
              <motion.div
                key={tIdx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: tIdx * 0.12 }}
                className={`rounded-2xl border bg-[#070712]/95 p-5 space-y-5 transition-all duration-300 ${track.border} ${track.glow}`}
              >
                {/* Track header */}
                <div className="space-y-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${track.badge}`}>
                    Track {tIdx + 1}
                  </span>
                  <h4 className="text-lg font-black text-white">{track.name.split(': ')[1]}</h4>
                </div>

                {/* Session list */}
                <div className="space-y-4">
                  {track.sessions.map((sess, sIdx) => (
                    <div key={sIdx} className={`relative pl-6 before:absolute before:left-1.5 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:border before:border-slate-950/80 ${track.bullet}`}>
                      {/* Vertical connector line between bullets */}
                      {sIdx < track.sessions.length - 1 && (
                        <div className="absolute left-[8px] top-4 bottom-[-16px] w-[1px] bg-slate-800/60" />
                      )}
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-mono font-black ${track.textBadge}`}>
                            {sess.time}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">
                            {sess.session}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-200 leading-snug group-hover:text-white transition-colors duration-200">
                          {sess.topic}
                        </h5>
                        {sess.speaker && (
                          <p className="text-[10px] text-slate-500">
                            {sess.speaker}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
