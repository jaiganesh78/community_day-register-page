"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { User } from "lucide-react";

interface SuccessBadgeProps {
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  registrationCode?: string;
  qrImage?: string;
}

export default function SuccessBadge({ 
  name, 
  email, 
  role = "Participation", 
  avatar,
  registrationCode,
  qrImage
}: SuccessBadgeProps) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlipped(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="relative w-full max-w-sm mx-auto h-[480px]"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="w-full h-full relative cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 1.2, type: "spring", stiffness: 45, damping: 15 }}
        onClick={() => setFlipped(!flipped)}
      >
        {/* Front Side: Animated QR Code */}
        <div 
          className="absolute inset-0 bg-black/40 border border-cyan-500/30 rounded-3xl p-8 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,240,255,0.1)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative p-4 bg-white rounded-xl overflow-hidden">
            {qrImage ? (
              <img src={qrImage} alt="QR Code" className="w-[180px] h-[180px] block" />
            ) : (
              <QRCode value={registrationCode || `ticket-${email}`} size={180} />
            )}
            {/* Scanning line animation */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1.5 bg-cyan-400 shadow-[0_0_15px_#00f0ff]"
              animate={{ y: [0, 212, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="mt-6 text-cyan-400 font-semibold text-sm animate-pulse tracking-widest uppercase">
            Pass Ready
          </p>
          {registrationCode && (
            <p className="mt-2 text-slate-400 font-mono text-xs tracking-wider">
              ID: <span className="text-white font-bold">{registrationCode}</span>
            </p>
          )}
        </div>

        {/* Back Side: Final Badge */}
        <div 
          className="absolute inset-0 border border-cyan-500/50 rounded-3xl flex flex-col justify-between shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* Full bleed avatar background */}
          <div className="absolute inset-0 z-0">
            {avatar ? (
              <img 
                src={avatar === "man" ? "/avatar-man.png" : "/avatar-woman.png"} 
                alt="Avatar" 
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
                 {/* Background glows */}
                <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[-20%] w-48 h-48 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none" />
                <div className="w-40 h-40 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <User size={80} className="text-cyan-400/50" />
                </div>
              </div>
            )}
            {/* Blending overlay gradient to make text readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30 pointer-events-none" />
          </div>
          
          <div className="w-full text-center p-5 border-b border-white/20 relative z-10 bg-black/20 backdrop-blur-[2px]">
            <h4 className="text-cyan-400 font-black text-lg uppercase tracking-widest shadow-cyan-500/50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              AWS Community Day Rec
            </h4>
          </div>

          <div className="flex-1 flex flex-col items-center justify-end pb-8 relative z-10 w-full space-y-2">
            <div className="text-center w-full">
              <p className="text-xs text-cyan-400 uppercase tracking-[0.2em] font-bold mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {role}
              </p>
              {registrationCode && (
                <p className="text-[10px] text-slate-300 font-mono tracking-widest uppercase mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {registrationCode}
                </p>
              )}
              <h3 className="text-3xl font-extrabold text-white truncate w-full px-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <span className="digital-glitch" data-text={name}>
                  {name}
                </span>
              </h3>
            </div>
          </div>

          <div className="w-full p-5 border-t border-white/20 relative z-10 flex justify-between items-end bg-black/40 backdrop-blur-sm">
            <div className="text-left">
              <p className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Date</p>
              <p className="text-xs text-white font-bold mt-0.5">Sep 12, 2026</p>
            </div>
            <div className="bg-white p-1 rounded w-[48px] h-[48px] flex items-center justify-center">
              {qrImage ? (
                <img src={qrImage} alt="QR Code" className="w-[40px] h-[40px] block" />
              ) : (
                <QRCode value={registrationCode || `ticket-${email}`} size={40} />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
