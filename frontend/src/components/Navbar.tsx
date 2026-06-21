"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, ArrowRight, QrCode } from "lucide-react";
import { useRegistration } from "@/context/RegistrationContext";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Schedule", href: "#schedule" },
  { label: "Hackathons", href: "#hackathons" },
  { label: "Speakers", href: "#speakers" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Organizers", href: "#organizers" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { badgeData } = useRegistration();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Track active section on scroll
      const sections = navItems.map(item => item.href.slice(1));
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetId = href.slice(1);
    const el = document.getElementById(targetId);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
      setActiveSection(targetId);
    }
  };

  const scrollToRegistrationForm = () => {
    setIsOpen(false);
    const el = document.getElementById("register-form");
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#020205]/85 backdrop-blur-md border-b border-cyan-500/10 py-3 shadow-lg shadow-cyan-950/10"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand (Left) */}
          <div className="flex items-center gap-3 w-1/4">
            <a
              href="#home"
              onClick={(e) => handleClick(e, "#home")}
              className="flex items-center gap-2 group focus:outline-none"
            >
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-cyan-500/20 bg-slate-950 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/aws_sbg_logo.png"
                  alt="AWS Student Builder Groups REC Logo"
                  fill
                  className="object-cover filter drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                  priority
                  sizes="44px"
                />
              </div>
              <div className="flex flex-col hidden sm:flex">
                <span className="text-white font-bold text-sm tracking-wide">
                  AWS <span className="text-[#00f0ff] text-glow">STUDENT</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-1">
                  Builder Groups @ REC
                </span>
              </div>
            </a>
          </div>

          {/* Centered Navigation Links (Desktop) */}
          <div className="hidden md:flex flex-grow justify-center">
            <ul className="flex items-center gap-6 glass-panel px-6 py-2 rounded-full border border-slate-800/80 bg-slate-950/20">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => handleClick(e, item.href)}
                      className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-[#00f0ff] ${
                        isActive ? "text-[#00f0ff] font-bold text-glow" : "text-slate-400"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Registration CTA (Right Desktop) */}
          <div className="hidden md:flex justify-end w-1/4">
            <button
              onClick={scrollToRegistrationForm}
              className="neon-btn px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white flex items-center gap-2"
            >
              {badgeData ? (
                <>View QR Code <QrCode size={14} /></>
              ) : (
                <>Register Now <ArrowRight size={14} /></>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed inset-0 top-[73px] bg-[#020205]/95 backdrop-blur-lg border-t border-cyan-500/10 transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-3">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`block px-4 py-3 rounded-lg text-base font-medium border border-transparent transition-all ${
                  isActive
                    ? "bg-cyan-950/20 text-[#00f0ff] border-cyan-500/20 font-bold"
                    : "text-slate-300 hover:bg-slate-900/50"
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <div className="pt-4 px-4">
            <button
              onClick={scrollToRegistrationForm}
              className="neon-btn w-full py-3 rounded-full text-center text-sm font-bold text-white flex items-center justify-center gap-2"
            >
              {badgeData ? (
                <>View QR Code <QrCode size={15} /></>
              ) : (
                <>Register Now <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
