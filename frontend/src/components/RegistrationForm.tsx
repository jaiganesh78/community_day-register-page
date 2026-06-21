"use client";

import React, { useState } from "react";
import {
  Cloud,
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useRegistration } from "@/context/RegistrationContext";
import SuccessBadge from "./SuccessBadge";
import { motion, AnimatePresence, type Variants } from "framer-motion";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  designation: string;
  city: string;
  avatar: string;
}

const initialForm: FormData = {
  fullName: "",
  email: "",
  phone: "",
  organization: "",
  designation: "",
  city: "",
  avatar: "man",
};

const inputVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function RegistrationForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [serverError, setServerError] = useState("");

  const { badgeData, setBadgeData } = useRegistration();

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Valid email is required";
    if (!form.phone.trim() || !/^\+?[\d\s\-()]{7,}$/.test(form.phone))
      newErrors.phone = "Valid phone number is required";
    if (!form.organization.trim()) newErrors.organization = "College/Organization is required";
    if (!form.designation.trim()) newErrors.designation = "Designation/Year is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleResendQr = async () => {
    const targetEmail = badgeData?.email || form.email;
    if (!targetEmail) return;
    setResending(true);
    setResendStatus("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/registrations/resend-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend email.");
      }
      setResendStatus("Pass email resent successfully!");
    } catch (err: any) {
      setResendStatus(err.message || "Too many attempts. Try again later.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");
    setIsAlreadyRegistered(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          organization: form.organization,
          designation: form.designation,
          city: form.city,
          avatar: form.avatar,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (data.status === "ALREADY_REGISTERED") {
        setIsAlreadyRegistered(true);
      }

      setBadgeData({
        name: data.user.name,
        email: data.user.email,
        role: "Participant",
        avatar: data.user.avatar,
        registrationCode: data.registrationCode,
        qrImage: data.qrImage,
      });
      
      setSubmitted(true);
    } catch (err: any) {
      setServerError(err.message || "Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "Arjun Sharma",
      type: "text",
      icon: User,
      col: "sm:col-span-2",
    },
    {
      name: "email",
      label: "Email Address",
      placeholder: "arjun@college.edu.in",
      type: "email",
      icon: Mail,
    },
    {
      name: "phone",
      label: "Phone Number",
      placeholder: "+91 98765 43210",
      type: "tel",
      icon: Phone,
    },
    {
      name: "organization",
      label: "College / Organization",
      placeholder: "Rajalakshmi Engineering College",
      type: "text",
      icon: Building2,
    },
    {
      name: "designation",
      label: "Designation / Year of Study",
      placeholder: "3rd Year B.Tech / Software Engineer",
      type: "text",
      icon: GraduationCap,
    },
    {
      name: "city",
      label: "City",
      placeholder: "Chennai",
      type: "text",
      icon: MapPin,
    },
  ];

  return (
    <section
      id="register-form"
      className="relative py-10 overflow-hidden bg-black/30 border-t border-slate-900"
    >
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-600/8 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-blue-600/8 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Cloud size={14} />
            Free Registration
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Register for{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-[#00f0ff] bg-clip-text text-transparent text-glow">
              AWS Community Day
            </span>
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            Join cloud enthusiasts, developers, students, and industry professionals
            for a day of learning, networking, and innovation.
          </p>
          <div className="flex items-center justify-center gap-6 pt-2">
            {[
              { icon: CheckCircle2, text: "No Registration Fee" },
              { icon: CheckCircle2, text: "Instant Confirmation" },
              { icon: Cloud, text: "AWS Swag Included" },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Icon size={13} className="text-cyan-400" />
                {text}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {(submitted || badgeData) ? (
            /* Success State - Animated ID Card */
            <div className="pb-8 flex flex-col items-center gap-6">
              {isAlreadyRegistered && (
                <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider text-center">
                  You are already registered for this event!
                </div>
              )}
              <SuccessBadge 
                name={badgeData?.name || form.fullName} 
                email={badgeData?.email || form.email} 
                avatar={badgeData?.avatar || form.avatar} 
                role={badgeData?.role || "Participant"} 
                registrationCode={badgeData?.registrationCode}
                qrImage={badgeData?.qrImage}
              />
              
              <div className="flex flex-col items-center gap-2 mt-2">
                <p className="text-slate-500 text-[11px] text-center">
                  Lost your ticket email?
                </p>
                <button
                  type="button"
                  onClick={handleResendQr}
                  disabled={resending}
                  className="neon-btn-secondary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {resending ? "Resending Pass..." : "Resend QR Code Email"}
                </button>
                {resendStatus && (
                  <p className={`text-[11px] font-medium text-center mt-1 ${resendStatus.includes("successfully") ? "text-cyan-400" : "text-red-400"}`}>
                    {resendStatus}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Registration Form */
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-panel rounded-3xl border border-cyan-500/15 p-6 sm:p-10 shadow-[0_0_40px_rgba(0,240,255,0.05)] space-y-6"
            >
              {/* Grid fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {fields.map((field, i) => {
                  const Icon = field.icon;
                  const error = errors[field.name as keyof FormData];
                  return (
                    <motion.div
                      key={field.name}
                      className={`space-y-1.5 ${field.col || ""}`}
                      custom={i}
                      variants={inputVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        {field.label}
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                          <Icon size={15} />
                        </div>
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name as keyof FormData]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className={`w-full bg-slate-950/60 border ${
                            error ? "border-red-500/60" : "border-slate-800 focus:border-cyan-500/60"
                          } rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all focus:bg-slate-900/60 focus:shadow-[0_0_0_3px_rgba(0,240,255,0.08)]`}
                        />
                      </div>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[11px] text-red-400 font-medium"
                        >
                          {error}
                        </motion.p>
                      )}
                    </motion.div>
                  );
                })}

                {/* Avatar Selection */}
                <motion.div
                  className="space-y-3 sm:col-span-2 pt-2 border-t border-slate-800/60"
                  custom={fields.length + 1}
                  variants={inputVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Select Your Avatar
                  </label>
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, avatar: "man" }))}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all ${
                        form.avatar === "man" 
                          ? "bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-110" 
                          : "bg-slate-800 hover:bg-slate-700 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="w-full h-full bg-black rounded-full overflow-hidden">
                        <img src="/avatar-man.png" alt="Man Avatar" className="w-full h-full object-cover" />
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, avatar: "woman" }))}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all ${
                        form.avatar === "woman" 
                          ? "bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-110" 
                          : "bg-slate-800 hover:bg-slate-700 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="w-full h-full bg-black rounded-full overflow-hidden">
                        <img src="/avatar-woman.png" alt="Woman Avatar" className="w-full h-full object-cover" />
                      </div>
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Privacy note */}
              <p className="text-[11px] text-slate-600 text-center">
                By registering, you agree to be contacted about AWS Community Day 2026 updates.
                Your data is never shared with third parties.
              </p>

              {/* Server Error Message */}
              {serverError && (
                <p className="text-xs text-red-400 font-semibold text-center mt-2">
                  {serverError}
                </p>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={submitting}
                className="neon-btn w-full py-4 rounded-2xl text-base font-extrabold text-white flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Securing Your Spot...
                  </>
                ) : (
                  <>
                    Complete Registration — Free Entry
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
