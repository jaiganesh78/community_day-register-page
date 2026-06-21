"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, CheckCircle2, Gift, Mail, Calendar, 
  Search, ArrowUpDown, Trash2, Download, LogOut, 
  ExternalLink, ChevronLeft, ChevronRight, AlertTriangle, Cloud, ShieldAlert,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  designation: string;
  city: string;
  avatar: string;
  createdAt: string;
  registration: {
    registrationCode: string;
    entryVerified: boolean;
    entryVerifiedAt: string | null;
    goodiesVerified: boolean;
    goodiesVerifiedAt: string | null;
    emailStatus: string;
  } | null;
}

interface DashboardMetrics {
  totalRegistrations: number;
  checkedIn: number;
  pendingEntry: number;
  goodiesDistributed: number;
  pendingGoodies: number;
  checkInRate: number;
  goodiesRate: number;
  emailFailures: number;
  emailPending: number;
  todaysRegistrations: number;
}

interface ActivityLog {
  id: string;
  action: string;
  createdAt: string;
  metadata: any;
  user: {
    name: string;
    email: string;
  } | null;
}

export default function OrganizerDashboard() {
  const router = useRouter();

  // Metrics and Logs states
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  
  // Participant grid states
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Search and Filters
  const [search, setSearch] = useState("");
  const [entryFilter, setEntryFilter] = useState("all");
  const [goodiesFilter, setGoodiesFilter] = useState("all");
  const [emailFilter, setEmailFilter] = useState("all");
  
  // Sorting
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // General loading & errors
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Fetch Dashboard Stats and Activities
  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/organizer/dashboard`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/organizer/login");
        return;
      }
      const data = await res.json();
      setMetrics(data.metrics);
      setActivities(data.recentActivity);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  // Fetch Participants Table
  const fetchParticipants = async () => {
    setTableLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: String(currentPage),
        limit: "10",
        sortBy,
        sortOrder,
      });

      if (search.trim()) queryParams.append("search", search);
      if (entryFilter !== "all") queryParams.append("entryStatus", entryFilter);
      if (goodiesFilter !== "all") queryParams.append("goodiesStatus", goodiesFilter);
      if (emailFilter !== "all") queryParams.append("emailStatus", emailFilter);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/organizer/participants?${queryParams.toString()}`,
        {
          credentials: "include",
        }
      );
      if (res.status === 401) {
        router.push("/organizer/login");
        return;
      }
      const data = await res.json();
      setParticipants(data.data);
      setTotalParticipants(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error loading participants:", err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    // Initial Load
    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Fetch table whenever filters, pagination, or sorting changes
    fetchParticipants();
  }, [currentPage, entryFilter, goodiesFilter, emailFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchParticipants();
  };

  // Trigger Soft Delete
  const handleDeleteParticipant = async (id: string) => {
    if (!confirm("Are you sure you want to soft delete this participant? Their records will be excluded from active lists but kept in the DB logs.")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/organizer/participants/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        // Refresh
        fetchDashboardData();
        fetchParticipants();
      }
    } catch (err) {
      console.error("Error deleting participant:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Trigger CSV Export
  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const queryParams = new URLSearchParams({
        sortBy,
        sortOrder,
      });

      if (search.trim()) queryParams.append("search", search);
      if (entryFilter !== "all") queryParams.append("entryStatus", entryFilter);
      if (goodiesFilter !== "all") queryParams.append("goodiesStatus", goodiesFilter);
      if (emailFilter !== "all") queryParams.append("emailStatus", emailFilter);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/organizer/participants/export?${queryParams.toString()}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("CSV Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aws-community-day-participants-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV Export error:", err);
      alert("Failed to export CSV file");
    } finally {
      setExporting(false);
    }
  };

  // Trigger Logout
  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error logging out:", err);
    }
    router.push("/organizer/login");
  };

  // Toggle Column Sort
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const getEmailBadgeColor = (status: string) => {
    switch (status) {
      case "SENT": return "bg-green-500/10 border-green-500/20 text-green-400";
      case "FAILED": return "bg-red-500/10 border-red-500/20 text-red-400";
      default: return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
    }
  };

  const formatActivityText = (log: ActivityLog) => {
    const time = new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const uName = log.user?.name || "System";
    switch (log.action) {
      case "PARTICIPANT_REGISTERED": return `[${time}] User ${uName} registered successfully.`;
      case "ENTRY_VERIFIED": return `[${time}] Participant verified at check-in gate.`;
      case "GOODIES_CLAIMED": return `[${time}] Swag goodies claimed for participant.`;
      case "ORGANIZER_LOGIN": return `[${time}] Organizer logged in.`;
      case "EMAIL_SENT": return `[${time}] Pass email sent to ${log.user?.email || "user"}.`;
      case "EMAIL_FAILED": return `[${time}] Pass email failed for ${log.user?.email || "user"}.`;
      case "QR_RESENT": return `[${time}] Entry QR pass resent to email.`;
      case "PASSWORD_CHANGED": return `[${time}] Security credential changed successfully.`;
      case "CSV_EXPORTED": return `[${time}] Participant database exported to CSV.`;
      default: return `[${time}] Activity logged: ${log.action}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-slate-100 p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/3 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/3 blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Header Panel */}
        <header className="glass-panel rounded-2xl border border-cyan-500/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Cloud size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-wider text-white">
                AWS Community Day
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
                Admin Operations Centre
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push("/organizer/entry")}
              className="neon-btn px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2"
            >
              <CheckCircle2 size={14} />
              Gate Check-in
            </button>
            <button
              onClick={() => router.push("/organizer/goodies")}
              className="neon-btn px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2"
            >
              <Gift size={14} />
              Goodies Desks
            </button>
            <button
              onClick={handleLogout}
              className="neon-btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </header>

        {/* Metrics Grid */}
        {metrics && (
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Total Signups", val: metrics.totalRegistrations, sub: `+${metrics.todaysRegistrations} today`, icon: Users, color: "text-blue-400" },
              { label: "Checked In", val: metrics.checkedIn, sub: `${metrics.checkInRate}% Checked-in`, icon: CheckCircle2, color: "text-cyan-400" },
              { label: "Swags Claimed", val: metrics.goodiesDistributed, sub: `${metrics.goodiesRate}% Claimed`, icon: Gift, color: "text-purple-400" },
              { label: "Email Sent", val: metrics.totalRegistrations - metrics.emailFailures - metrics.emailPending, sub: `${metrics.emailPending} pending`, icon: Mail, color: "text-green-400" },
              { label: "Email Failures", val: metrics.emailFailures, sub: "Action required", icon: ShieldAlert, color: "text-red-400", alert: metrics.emailFailures > 0 },
            ].map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className={`glass-panel p-5 rounded-2xl border ${m.alert ? "border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.05)]" : "border-cyan-500/10"} flex flex-col justify-between min-h-[110px]`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
                    <Icon size={14} className={m.color} />
                  </div>
                  <div className="mt-3">
                    <h2 className="text-2xl font-black text-white">{m.val}</h2>
                    <p className="text-[10px] text-slate-500 mt-1 font-semibold">{m.sub}</p>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Recent Activity Panel (Left side in lg layout) */}
          <section className="lg:col-span-1 glass-panel rounded-2xl border border-cyan-500/10 p-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400">
              Live Activity Log
            </h3>
            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {activities.length > 0 ? (
                activities.map((act) => (
                  <div key={act.id} className="text-[11px] leading-relaxed border-b border-slate-900/60 pb-2.5 last:border-b-0">
                    <p className="text-slate-300 font-medium">{formatActivityText(act)}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5 font-mono">
                      {new Date(act.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-600 text-center py-6">No recent actions recorded.</p>
              )}
            </div>
          </section>

          {/* Participant Grid panel (Right side in lg layout) */}
          <section className="lg:col-span-3 glass-panel rounded-2xl border border-cyan-500/10 p-5 space-y-5">
            
            {/* Table Filters & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Participants Grid ({totalParticipants})
              </h3>
              
              <button
                onClick={handleExportCsv}
                disabled={exporting || participants.length === 0}
                className="neon-btn-secondary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
              >
                {exporting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Compiling CSV...
                  </>
                ) : (
                  <>
                    <Download size={12} />
                    Export CSV
                  </>
                )}
              </button>
            </div>

            {/* Filter controls row */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="relative sm:col-span-2">
                <input
                  type="text"
                  placeholder="Search by name, email, college, code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Search size={13} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                <select
                  value={entryFilter}
                  onChange={(e) => { setEntryFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-950/60 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-2 py-2.5 text-[11px] text-slate-300 outline-none"
                >
                  <option value="all">Gate Checks</option>
                  <option value="checked-in">Checked In</option>
                  <option value="pending">Pending</option>
                </select>

                <select
                  value={goodiesFilter}
                  onChange={(e) => { setGoodiesFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-950/60 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-2 py-2.5 text-[11px] text-slate-300 outline-none"
                >
                  <option value="all">Swag Claims</option>
                  <option value="claimed">Claimed</option>
                  <option value="pending">Pending</option>
                </select>

                <select
                  value={emailFilter}
                  onChange={(e) => { setEmailFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-950/60 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-2 py-2.5 text-[11px] text-slate-300 outline-none"
                >
                  <option value="all">Email Status</option>
                  <option value="SENT">Sent</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
            </form>

            {/* Table Area */}
            <div className="overflow-x-auto border border-slate-900 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 font-bold uppercase border-b border-slate-900">
                    <th 
                      onClick={() => toggleSort("name")}
                      className="p-4 cursor-pointer hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        Participant
                        <ArrowUpDown size={11} />
                      </div>
                    </th>
                    <th className="p-4">College / Org</th>
                    <th 
                      onClick={() => toggleSort("registrationCode")}
                      className="p-4 cursor-pointer hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-1.5 font-mono">
                        Code
                        <ArrowUpDown size={11} />
                      </div>
                    </th>
                    <th className="p-4 text-center">Entry</th>
                    <th className="p-4 text-center">Swag</th>
                    <th className="p-4 text-center">Email</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableLoading ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-slate-500">
                        <Loader2 size={24} className="animate-spin mx-auto mb-2 text-cyan-400" />
                        Fetching participant updates...
                      </td>
                    </tr>
                  ) : participants.length > 0 ? (
                    participants.map((p) => {
                      const reg = p.registration;
                      return (
                        <tr key={p.id} className="border-b border-slate-900/60 hover:bg-slate-900/10 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">{p.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{p.email}</div>
                          </td>
                          <td className="p-4">
                            <div className="truncate max-w-[150px] font-medium text-slate-300">{p.organization}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{p.designation}</div>
                          </td>
                          <td className="p-4 font-mono font-bold text-cyan-400">
                            {reg?.registrationCode || "N/A"}
                          </td>
                          <td className="p-4 text-center">
                            {reg?.entryVerified ? (
                              <span className="inline-flex px-2.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                                In
                              </span>
                            ) : (
                              <span className="inline-flex px-2.5 py-1.5 rounded-full bg-slate-800/40 border border-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                Out
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {reg?.goodiesVerified ? (
                              <span className="inline-flex px-2.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                                Claimed
                              </span>
                            ) : (
                              <span className="inline-flex px-2.5 py-1.5 rounded-full bg-slate-800/40 border border-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                Unclaimed
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex px-2.5 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${getEmailBadgeColor(reg?.emailStatus || "PENDING")}`}>
                              {reg?.emailStatus || "PENDING"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteParticipant(p.id)}
                              disabled={deletingId === p.id}
                              className="p-2 text-slate-500 hover:text-red-400 transition-colors bg-slate-950 rounded-lg border border-slate-900 hover:border-red-500/20 disabled:opacity-50"
                              title="Soft delete participant"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-slate-500">
                        No participants match your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-900 pt-4 text-xs text-slate-500">
                <div>
                  Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || tableLoading}
                    className="p-2 bg-slate-950 border border-slate-900 rounded-lg hover:border-cyan-500/20 text-slate-300 disabled:opacity-50"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || tableLoading}
                    className="p-2 bg-slate-950 border border-slate-900 rounded-lg hover:border-cyan-500/20 text-slate-300 disabled:opacity-50"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

          </section>

        </div>

      </div>
    </div>
  );
}
