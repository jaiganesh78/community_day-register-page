"use client";

import React from "react";
import { Check, Ticket, Award, Users, ShieldAlert } from "lucide-react";

interface TicketTier {
  title: string;
  subtitle: string;
  originalPrice: string;
  discountPrice: string;
  savings?: string;
  features: string[];
  btnText: string;
  link: string;
  badge?: string;
  isPopular?: boolean;
}

const tiers: TicketTier[] = [
  {
    title: "Student Pass",
    subtitle: "Individual Access",
    originalPrice: "₹500",
    discountPrice: "₹200",
    features: [
      "Access to all Keynotes & Technical Sessions",
      "Interactive Q&A with AWS Specialists",
      "Hands-on workshop sandbox guides",
      "Complimentary High-Tea & Buffet Lunch",
      "Official Event Certificate of Participation",
      "AWS Swag pack (Stickers, Keychain)"
    ],
    btnText: "Get Student Pass",
    link: "https://konfhub.com/aws-student-community-day-rec-2026",
    badge: "Limited Early Bird",
  },
  {
    title: "Student Group Pass",
    subtitle: "Team of 10 Builders",
    originalPrice: "₹2,000",
    discountPrice: "₹1,400",
    savings: "Save ₹600 (30% OFF)",
    features: [
      "All benefits of the Individual Student Pass",
      "Reserved seating in the Tech Hall for your team",
      "Special mention of your group on the community page",
      "Custom group photo shoot at the media wall",
      "Consolidated team certificate portfolio",
      "Team AWS Credits package ($10 / member)"
    ],
    btnText: "Register Student Team",
    link: "https://konfhub.com/aws-student-community-day-rec-2026",
    badge: "Best Value",
    isPopular: true,
  },
  {
    title: "Professional Pass",
    subtitle: "Individual Industry Access",
    originalPrice: "₹700",
    discountPrice: "₹500",
    features: [
      "Full Access to all keynotes and technical sessions",
      "Premium seating area in the Tech Hall",
      "Access to exclusive HR Networking & hiring desk",
      "Complimentary Premium Buffet Lunch & Snacks",
      "LinkedIn Profile review session with AWS Architects",
      "Exclusive AWS Community Swag Bag (T-shirt, Badge)"
    ],
    btnText: "Get Professional Pass",
    link: "https://konfhub.com/aws-student-community-day-rec-2026",
  },
];

export default function Registration() {
  return (
    <section id="registration" className="py-24 relative overflow-hidden bg-black/40 border-y border-slate-900">
      {/* Background Neon Glow */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <div className="text-cyan-400 font-semibold uppercase tracking-wider text-xs">
            Join the Event
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Register and Secure Tickets
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Choose the registration tier that fits you and secure your entry pass. Special group discounts available.
          </p>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`glass-panel p-8 rounded-3xl border flex flex-col justify-between relative transition-all duration-300 ${
                tier.isPopular
                  ? "border-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.1)] scale-100 lg:scale-[1.03]"
                  : "border-slate-800"
              } card-glow-hover`}
            >
              {tier.badge && (
                <span className="absolute -top-3.5 left-8 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-[#00f0ff] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                  {tier.badge}
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-white">{tier.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                    {tier.subtitle}
                  </p>
                </div>

                <div className="flex items-baseline gap-2 py-2 border-y border-slate-900">
                  <span className="text-3xl font-black text-white">{tier.discountPrice}</span>
                  <span className="text-sm text-slate-500 line-through font-semibold">
                    {tier.originalPrice}
                  </span>
                  {tier.savings && (
                    <span className="text-[10px] text-cyan-400 font-bold ml-auto uppercase tracking-wide bg-cyan-950/30 px-2 py-0.5 rounded-full">
                      {tier.savings}
                    </span>
                  )}
                </div>

                <ul className="space-y-3.5 text-xs text-slate-300">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <span className="text-[#00f0ff] flex-shrink-0 mt-0.5">
                        <Check size={14} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <a
                  href={tier.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3.5 rounded-2xl text-center text-xs font-extrabold uppercase tracking-widest transition-all ${
                    tier.isPopular
                      ? "neon-btn text-white"
                      : "neon-btn-secondary"
                  }`}
                >
                  {tier.btnText}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Swag/Fulfillment note */}
        <div className="max-w-2xl mx-auto mt-12 p-4 rounded-xl bg-blue-950/20 border border-blue-500/10 flex gap-3 items-center justify-center text-center">
          <ShieldAlert className="text-cyan-400 flex-shrink-0" size={16} />
          <p className="text-[10px] text-slate-400 font-medium">
            * Registrations close on September 10, 2026. Make sure to input your college email to verify student status at check-in.
          </p>
        </div>
      </div>
    </section>
  );
}
