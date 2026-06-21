"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Cloud, Lock, Mail, Loader2, ArrowRight, RefreshCw, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrganizerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Password change states
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [changeError, setChangeError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      if (data.user?.mustChangePassword) {
        setMustChangePassword(true);
      } else {
        router.push("/organizer/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setChangeError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setChangeError("Password must be at least 8 characters");
      return;
    }

    setChanging(true);
    setChangeError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update password");
      }

      // Successful password change, redirect to dashboard
      router.push("/organizer/dashboard");
    } catch (err: any) {
      setChangeError(err.message || "Failed to change password. Make sure you are authenticated.");
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020205] text-slate-100 flex flex-col justify-center items-center px-4 overflow-hidden cyber-grid">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!mustChangePassword ? (
          /* Organizer Login Panel */
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -35 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md glass-panel rounded-3xl border border-cyan-500/15 p-8 sm:p-10 shadow-[0_0_50px_rgba(0,240,255,0.08)] text-center relative z-10"
          >
            {/* Logo and title */}
            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-6">
              <Cloud size={28} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
              Organizer Login
            </h2>
            <p className="text-slate-400 text-xs mb-8">
              AWS Community Day Event Management System
            </p>

            <form onSubmit={handleLogin} className="space-y-5 text-left">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="organizer@awscommunityday.com"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500/60 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all focus:bg-slate-900/60 focus:shadow-[0_0_0_3px_rgba(0,240,255,0.05)]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock size={15} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500/60 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all focus:bg-slate-900/60 focus:shadow-[0_0_0_3px_rgba(0,240,255,0.05)]"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-400 font-semibold text-center mt-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="neon-btn w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 mt-6 disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Verifying Identity...
                  </>
                ) : (
                  <>
                    Authenticate Access
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          /* Password Change Overlay (First Login) */
          <motion.div
            key="change-password"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -35 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md glass-panel rounded-3xl border border-yellow-500/20 p-8 sm:p-10 shadow-[0_0_50px_rgba(234,179,8,0.08)] text-center relative z-10"
          >
            <div className="inline-flex p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 mb-6 animate-pulse">
              <KeyRound size={28} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
              Reset Credentials
            </h2>
            <p className="text-slate-400 text-xs mb-8">
              For security, you must replace the default password before accessing the system.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-5 text-left">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  New Secure Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock size={15} />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-yellow-500/60 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all focus:bg-slate-900/60 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.05)]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <RefreshCw size={14} />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Verify password"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-yellow-500/60 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all focus:bg-slate-900/60 focus:shadow-[0_0_0_3px_rgba(234,179,8,0.05)]"
                  />
                </div>
              </div>

              {changeError && (
                <p className="text-xs text-red-400 font-semibold text-center mt-2">
                  {changeError}
                </p>
              )}

              <button
                type="submit"
                disabled={changing}
                className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center gap-2 mt-6 transition-all disabled:opacity-75"
              >
                {changing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Updating Passwords...
                  </>
                ) : (
                  <>
                    Save Password & Login
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
