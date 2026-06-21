"use client";

import React from "react";
import Image from "next/image";
import { Mail, ArrowUp, Phone } from "lucide-react";

const InstagramIcon = ({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
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
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

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

const TwitterIcon = ({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
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
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.slice(1);
    const el = document.getElementById(targetId);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  const scrollToRegistrationForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("register-form");
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer id="contact" className="relative bg-[#020205] border-t border-slate-900 pt-16 pb-8 overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute bottom-0 right-10 w-64 h-64 rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Logo & Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/aws_sbg_logo.png"
                  alt="AWS Student Builder Groups REC Logo"
                  fill
                  className="object-contain filter drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                />
              </div>
              <div>
                <span className="text-white font-bold text-base tracking-wide block">
                  AWS <span className="text-[#00f0ff]">STUDENT</span>
                </span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block -mt-1">
                  Builder Groups @ REC
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Empowering student cloud builders to design, construct, and scale modern web projects. Together we push the boundaries of cloud engineering and artificial intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs text-white font-extrabold uppercase tracking-widest border-b border-slate-900 pb-2">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="#home"
                onClick={(e) => handleLinkClick(e, "#home")}
                className="text-slate-400 hover:text-[#00f0ff] transition-colors"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={(e) => handleLinkClick(e, "#about")}
                className="text-slate-400 hover:text-[#00f0ff] transition-colors"
              >
                About
              </a>
              <a
                href="#schedule"
                onClick={(e) => handleLinkClick(e, "#schedule")}
                className="text-slate-400 hover:text-[#00f0ff] transition-colors"
              >
                Schedule
              </a>
              <a
                href="#hackathons"
                onClick={(e) => handleLinkClick(e, "#hackathons")}
                className="text-slate-400 hover:text-[#00f0ff] transition-colors"
              >
                Hackathons
              </a>
              <a
                href="#speakers"
                onClick={(e) => handleLinkClick(e, "#speakers")}
                className="text-slate-400 hover:text-[#00f0ff] transition-colors"
              >
                Speakers
              </a>
              <a
                href="#sponsors"
                onClick={(e) => handleLinkClick(e, "#sponsors")}
                className="text-slate-400 hover:text-[#00f0ff] transition-colors"
              >
                Sponsors
              </a>
              <a
                href="#organizers"
                onClick={(e) => handleLinkClick(e, "#organizers")}
                className="text-slate-400 hover:text-[#00f0ff] transition-colors"
              >
                Organizers
              </a>
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, "#contact")}
                className="text-slate-400 hover:text-[#00f0ff] transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Socials & Contact */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-xs text-white font-extrabold uppercase tracking-widest border-b border-slate-900 pb-2">
              Contact & Connect
            </h4>
            
            {/* Club Email & Instagram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail size={14} className="text-[#00f0ff] flex-shrink-0" />
                <div className="truncate">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Club Email</span>
                  <a href="mailto:aws.sbg.rec@gmail.com" className="text-white hover:text-[#00f0ff] font-semibold transition-colors block truncate">
                    aws.sbg.rec@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <InstagramIcon size={14} className="text-[#00f0ff] flex-shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Instagram</span>
                  <a 
                    href="https://instagram.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-[#00f0ff] font-semibold transition-colors block"
                  >
                    @aws.sbg.rec
                  </a>
                </div>
              </div>
            </div>

            {/* Member Contact Details */}
            <div className="pt-2 space-y-2">
              <h5 className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">
                Student Coordinators
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-2.5 space-y-0.5">
                  <p className="text-xs font-bold text-white">Prathakshanaa</p>
                  <p className="text-[9px] text-cyan-400 font-semibold uppercase tracking-wider">Captain</p>
                  <a href="tel:+919876543210" className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-[#00f0ff] transition-colors pt-1">
                    <Phone size={10} className="flex-shrink-0" />
                    <span>+91 98765 43210</span>
                  </a>
                </div>
                <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-2.5 space-y-0.5">
                  <p className="text-xs font-bold text-white">Pranav Ranjan</p>
                  <p className="text-[9px] text-cyan-400 font-semibold uppercase tracking-wider">Tech Lead</p>
                  <a href="tel:+918765432109" className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-[#00f0ff] transition-colors pt-1">
                    <Phone size={10} className="flex-shrink-0" />
                    <span>+91 87654 32109</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Social Icons Row */}
            <div className="flex gap-4 pt-1">
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#00f0ff] hover:border-[#00f0ff]/40 hover:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all"
                title="LinkedIn"
              >
                <LinkedinIcon size={14} />
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#00f0ff] hover:border-[#00f0ff]/40 hover:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all"
                title="GitHub"
              >
                <GithubIcon size={14} />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#00f0ff] hover:border-[#00f0ff]/40 hover:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all"
                title="Twitter"
              >
                <TwitterIcon size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
          <p>© 2026 AWS Student Builder Groups REC. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-900 hover:border-[#00f0ff]/40 hover:text-[#00f0ff] transition-all group font-semibold uppercase tracking-wider"
            title="Scroll to Top"
          >
            Scroll Top <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}
