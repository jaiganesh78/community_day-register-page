"use client";

import React, { useState, useEffect } from "react";
import { Clock, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const THEMES = {
  days: {
    bg: "bg-gradient-to-b from-[#0b1430] to-[#040817]/95",
    border: "border-blue-500/30",
    text: "bg-gradient-to-b from-blue-400 via-cyan-400 to-[#00f0ff] bg-clip-text text-transparent",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
  },
  hours: {
    bg: "bg-gradient-to-b from-[#0b1430] to-[#040817]/95",
    border: "border-blue-500/30",
    text: "bg-gradient-to-b from-blue-400 via-cyan-400 to-[#00f0ff] bg-clip-text text-transparent",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
  },
  minutes: {
    bg: "bg-gradient-to-b from-[#0b1430] to-[#040817]/95",
    border: "border-blue-500/30",
    text: "bg-gradient-to-b from-blue-400 via-cyan-400 to-[#00f0ff] bg-clip-text text-transparent",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
  },
  seconds: {
    bg: "bg-gradient-to-b from-[#0b1430] to-[#040817]/95",
    border: "border-blue-500/30",
    text: "bg-gradient-to-b from-blue-400 via-cyan-400 to-[#00f0ff] bg-clip-text text-transparent",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
  },
};

function FlipDigit({ 
  digit, 
  theme, 
  position 
}: { 
  digit: string; 
  theme: any; 
  position: "first" | "middle" | "last"; 
}) {
  const [prevDigit, setPrevDigit] = useState(digit);
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== currentDigit) {
      setPrevDigit(currentDigit);
      setCurrentDigit(digit);
      setIsFlipping(true);
    }
  }, [digit, currentDigit]);

  const roundedClass = 
    position === "first" 
      ? "rounded-l-2xl rounded-r-none" 
      : position === "last" 
      ? "rounded-r-2xl rounded-l-none" 
      : "rounded-none";

  return (
    <div
      style={{ perspective: 1000 }}
      className={`relative w-[50px] h-[75px] sm:w-[84px] sm:h-[126px] ${roundedClass} border flex items-center justify-center font-mono font-black text-3xl sm:text-6xl select-none ${theme.bg} ${theme.border} ${theme.glow}`}
    >
      {/* Static Top Half (Shows New Digit) */}
      <div 
        className="absolute inset-0 w-full h-full flex items-center justify-center"
        style={{ clipPath: "inset(0 0 50% 0)" }}
      >
        <span className={`leading-none inline-block ${theme.text}`}>{currentDigit}</span>
      </div>

      {/* Static Bottom Half (Shows Old Digit) */}
      <div 
        className="absolute inset-0 w-full h-full flex items-center justify-center"
        style={{ clipPath: "inset(50% 0 0 0)" }}
      >
        <span className={`leading-none inline-block ${theme.text}`}>{prevDigit}</span>
      </div>

      {/* Flipping Card (3D) */}
      <motion.div
        key={currentDigit + "_" + prevDigit}
        initial={{ rotateX: 0 }}
        animate={isFlipping ? { rotateX: -180 } : { rotateX: 0 }}
        transition={isFlipping ? { duration: 0.6, ease: "easeInOut" } : { duration: 0 }}
        onAnimationComplete={() => {
          if (isFlipping) {
            setPrevDigit(currentDigit);
            setIsFlipping(false);
          }
        }}
        style={{ 
          transformStyle: "preserve-3d",
          transformOrigin: "center 50%",
        }}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      >
        {/* Front Side (Old Digit, Top Half) */}
        <div 
          className={`absolute inset-0 w-full h-full flex items-center justify-center ${theme.bg} ${theme.border} ${roundedClass}`}
          style={{ 
            clipPath: "inset(0 0 50% 0)", 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <span className={`leading-none inline-block ${theme.text}`}>{prevDigit}</span>
        </div>

        {/* Back Side (New Digit, Bottom Half) */}
        <div 
          className={`absolute inset-0 w-full h-full flex items-center justify-center ${theme.bg} ${theme.border} ${roundedClass}`}
          style={{ 
            clipPath: "inset(50% 0 0 0)", 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateX(180deg)",
          }}
        >
          <span className={`leading-none inline-block ${theme.text}`}>{currentDigit}</span>
        </div>
      </motion.div>

      {/* Horizontal split divider */}
      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#020205]/60 z-20" />

      {/* Metal hinge clips - only on outer edges */}
      {position === "first" && (
        <div className="absolute left-[-3px] top-1/2 -translate-y-1/2 w-[6px] h-[10px] sm:w-[8px] sm:h-[14px] sm:left-[-4px] bg-slate-400 border border-slate-300 rounded-sm shadow-sm z-30" />
      )}
      {position === "last" && (
        <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-[6px] h-[10px] sm:w-[8px] sm:h-[14px] sm:right-[-4px] bg-slate-400 border border-slate-300 rounded-sm shadow-sm z-30" />
      )}

      {/* Glossy top overlay */}
      <div 
        className={`absolute inset-x-0 top-0 bottom-1/2 bg-white/[0.03] pointer-events-none z-20 ${
          position === "first" 
            ? "rounded-tl-2xl" 
            : position === "last" 
            ? "rounded-tr-2xl" 
            : ""
        }`} 
      />
    </div>
  );
}

export default function Countdown() {
  const targetDate = new Date("2026-09-12T09:00:00+05:30"); // Sep 12, 2026 9:00 AM IST

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleScrollDown = () => {
    const nextSection = document.getElementById("about");
    if (nextSection) {
      window.scrollTo({
        top: nextSection.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  if (!isMounted) {
    return (
      <section id="countdown" className="w-full flex items-center justify-center bg-black py-10" />
    );
  }

  const timeUnits = [
    { label: "Days", value: timeLeft.days, theme: THEMES.days },
    { label: "Hours", value: timeLeft.hours, theme: THEMES.hours },
    { label: "Minutes", value: timeLeft.minutes, theme: THEMES.minutes },
    { label: "Seconds", value: timeLeft.seconds, theme: THEMES.seconds },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
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

  return (
    <section id="countdown" className="w-full relative flex flex-col justify-center items-center overflow-hidden py-10 bg-[#020205]">
      {/* Background Grid & Ambient Glows */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none animate-pulse-glow" />

      <div className="max-w-6xl mx-auto px-4 relative z-10 text-center space-y-12 w-full flex flex-col items-center">
        
        {/* Section Heading */}
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 text-cyan-400 font-semibold uppercase tracking-widest text-[10px] bg-cyan-950/30 px-4 py-1.5 rounded-full border border-cyan-500/20">
            <Clock size={12} className="animate-pulse" />
            T-Minus Event Launch
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight uppercase tracking-tight">
            Mark Your Calendar
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Every second brings us closer to an unforgettable gathering of cloud enthusiasts, industry experts, students, and builders. See you on{" "}
            <span className="text-base sm:text-lg font-black bg-gradient-to-r from-blue-500 via-cyan-400 to-[#00f0ff] bg-clip-text text-transparent inline-block mx-1 drop-shadow-[0_0_8px_rgba(0,240,255,0.2)]">
              September 12, 2026
            </span>{" "}
            at REC chennai
          </p>
        </div>

        {/* Large Flip Clock Horizontal Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto w-full pt-4"
        >
          {timeUnits.map((unit, idx) => {
            const digits = String(unit.value).padStart(2, "0").split("");
            return (
              <React.Fragment key={unit.label}>
                {/* Unit Container */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center gap-3"
                >
                  {/* Digit Cards */}
                  <div className="flex -space-x-px relative">
                    {digits.map((d, dIdx) => {
                      let position: "first" | "middle" | "last" = "middle";
                      if (dIdx === 0) {
                        position = "first";
                      } else if (dIdx === digits.length - 1) {
                        position = "last";
                      }
                      return (
                        <FlipDigit 
                          key={dIdx} 
                          digit={d} 
                          theme={unit.theme} 
                          position={position}
                        />
                      );
                    })}
                  </div>
                  {/* Label */}
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">
                    {unit.label}
                  </span>
                </motion.div>

                {/* Separator Colon */}
                {idx < timeUnits.length - 1 && (
                  <div className="hidden sm:block text-2xl sm:text-5xl font-black text-slate-800 self-start mt-[20px] sm:mt-[32px] select-none">
                    :
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </motion.div>

        {/* Action and Venue Prompt */}
        <div className="space-y-4 pt-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            Rajalakshmi Engineering College (REC) Campus, Chennai
          </p>
          
          <button
            onClick={handleScrollDown}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-800 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all animate-bounce mt-4 cursor-pointer"
            title="Explore More"
          >
            <ArrowDown size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}
