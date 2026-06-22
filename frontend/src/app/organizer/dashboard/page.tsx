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
    emailProvider: string | null;
    lastEmailAttemptAt: string | null;
    lastEmailError: string | null;
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
  emailsSentSuccessfully: number;
  emailsFailed: number;
  emailPending: number;
  awsSesDeliveries: number;
  gmailFallbackDeliveries: number;
  fallbackRate: number;
  successRate: number;
  todaysRegistrations: number;
}

interface DashboardHealth {
  awsStatus: 'ACTIVE' | 'INACTIVE';
  gmailStatus: 'ACTIVE' | 'INACTIVE';
  lastSuccessfulEmailTimestamp: string | null;
  lastFailedEmailTimestamp: string | null;
  totalFailuresToday: number;
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
  const [health, setHealth] = useState<DashboardHealth | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [actionRunning, setActionRunning] = useState(false);
  
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
      setHealth(data.health);
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

  // Trigger Bulk Resend of Failed Emails
  const handleResendFailed = async () => {
    if (!confirm("Are you sure you want to resend all failed emails? This will process in batches of 25 with a 1.5s delay to prevent throttling.")) return;
    setActionRunning(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/organizer/email/resend-failed`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      alert(data.message);
      fetchDashboardData();
      fetchParticipants();
    } catch (err: any) {
      console.error("Error resending failed emails:", err);
      alert("Failed to trigger bulk resend: " + err.message);
    } finally {
      setActionRunning(false);
    }
  };

  // Trigger Bulk Retry of Pending Emails
  const handleRetryPending = async () => {
    if (!confirm("Are you sure you want to retry all pending emails? This will process in batches of 25 with a 1.5s delay.")) return;
    setActionRunning(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/organizer/email/retry-pending`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      alert(data.message);
      fetchDashboardData();
      fetchParticipants();
    } catch (err: any) {
      console.error("Error retrying pending emails:", err);
      alert("Failed to trigger pending retry: " + err.message);
    } finally {
      setActionRunning(false);
    }
  };

  // Export Failed Emails list as CSV
  const handleExportFailedReport = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/organizer/email/export-failed`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aws-community-day-failed-emails-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting failed emails:", err);
      alert("Failed to export failed emails report.");
    }
  };

  // Export Delivery Report as CSV
  const handleExportDeliveryReport = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/organizer/email/export-delivery-report`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aws-community-day-email-delivery-report-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting delivery report:", err);
      alert("Failed to export delivery report.");
    }
  };

  // Resend single email
  const handleResendSingleEmail = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to resend the entry pass email to ${userEmail}?`)) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/organizer/participants/${userId}/resend-email`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || `Email successfully resent to ${userEmail}`);
        fetchDashboardData();
        fetchParticipants();
      } else {
        alert(data.message || "Failed to resend email.");
      }
    } catch (err) {
      console.error("Error resending email:", err);
      alert("Error sending email request.");
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
      case "EMAIL_SENT_SES": return `[${time}] Pass email sent via AWS SES to ${log.user?.email || "user"}.`;
      case "EMAIL_SENT_GMAIL": return `[${time}] Pass email sent via Gmail SMTP to ${log.user?.email || "user"}.`;
      case "EMAIL_FAILED_SES": return `[${time}] AWS SES delivery failed for ${log.user?.email || "user"}.`;
      case "EMAIL_FAILED_GMAIL": return `[${time}] Gmail SMTP delivery failed for ${log.user?.email || "user"}.`;
      case "EMAIL_FALLBACK_SUCCESS": return `[${time}] Fallback email triggered successfully for ${log.user?.email || "user"}.`;
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
              { label: "Email Sent", val: metrics.emailsSentSuccessfully, sub: `${metrics.emailPending} pending`, icon: Mail, color: "text-green-400" },
              { label: "Email Failures", val: metrics.emailsFailed, sub: `${metrics.successRate}% Success Rate`, icon: ShieldAlert, color: "text-red-400", alert: metrics.emailsFailed > 0 },
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
          
          {/* Left Column: Health, Operations & Activities */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Email Provider Health Widget */}
            {health && (
              <div className="glass-panel p-5 rounded-2xl border border-cyan-500/10 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Cloud size={14} className="animate-pulse" />
                  Email Provider Health
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-900/60">
                    <span className="text-slate-400">AWS SES (Primary)</span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wider ${
                      health.awsStatus === 'ACTIVE' 
                        ? "bg-green-500/10 border-green-500/20 text-green-400" 
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${health.awsStatus === 'ACTIVE' ? "bg-green-400" : "bg-red-400"}`} />
                      {health.awsStatus === 'ACTIVE' ? "AVAILABLE" : "UNAVAILABLE"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-900/60">
                    <span className="text-slate-400">Gmail SMTP (Fallback)</span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wider ${
                      health.gmailStatus === 'ACTIVE' 
                        ? "bg-green-500/10 border-green-500/20 text-green-400" 
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${health.gmailStatus === 'ACTIVE' ? "bg-green-400" : "bg-red-400"}`} />
                      {health.gmailStatus === 'ACTIVE' ? "AVAILABLE" : "UNAVAILABLE"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-900/60">
                    <span className="text-slate-400">Failures Today</span>
                    <span className={`font-bold ${health.totalFailuresToday > 0 ? "text-red-400" : "text-slate-400"}`}>
                      {health.totalFailuresToday}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Last Success:</span>
                      <span className="font-mono text-slate-400">
                        {health.lastSuccessfulEmailTimestamp 
                          ? new Date(health.lastSuccessfulEmailTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                          : 'Never'}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Last Failure:</span>
                      <span className="font-mono text-slate-400">
                        {health.lastFailedEmailTimestamp 
                          ? new Date(health.lastFailedEmailTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                          : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Operations Metrics Widget */}
            {metrics && (
              <div className="glass-panel p-5 rounded-2xl border border-cyan-500/10 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Mail size={14} />
                  Delivery Operations
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-900/60">
                    <span className="text-slate-400">AWS SES Deliveries</span>
                    <span className="font-bold text-white font-mono">{metrics.awsSesDeliveries}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-900/60">
                    <span className="text-slate-400">Gmail Fallbacks</span>
                    <span className="font-bold text-cyan-400 font-mono">{metrics.gmailFallbackDeliveries}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-900/60">
                    <span className="text-slate-400">Fallback Rate</span>
                    <span className="font-bold text-yellow-400 font-mono">{metrics.fallbackRate}%</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-900/60">
                    <span className="text-slate-400">Success Rate</span>
                    <span className="font-bold text-green-400 font-mono">{metrics.successRate}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity Panel */}
            <section className="glass-panel rounded-2xl border border-cyan-500/10 p-5 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400">
                Live Activity Log
              </h3>
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
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
          </div>

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

            {/* Bulk Actions Panel */}
            <div className="glass-panel p-4 rounded-xl border border-cyan-500/10 flex flex-wrap items-center justify-between gap-4 bg-[#020205]/40 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bulk Operational Tools:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleResendFailed}
                  disabled={actionRunning || !metrics || metrics.emailsFailed === 0}
                  className="neon-btn-secondary px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:border-red-500/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {actionRunning ? <Loader2 size={10} className="animate-spin" /> : <AlertTriangle size={10} />}
                  Resend Failed ({metrics?.emailsFailed || 0})
                </button>
                
                <button
                  type="button"
                  onClick={handleRetryPending}
                  disabled={actionRunning || !metrics || metrics.emailPending === 0}
                  className="neon-btn-secondary px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {actionRunning ? <Loader2 size={10} className="animate-spin" /> : <Mail size={10} />}
                  Retry Pending ({metrics?.emailPending || 0})
                </button>

                <button
                  type="button"
                  onClick={handleExportFailedReport}
                  className="neon-btn-secondary px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/20 flex items-center gap-1.5"
                >
                  <Download size={10} />
                  Export Failed CSV
                </button>

                <button
                  type="button"
                  onClick={handleExportDeliveryReport}
                  className="neon-btn-secondary px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-green-400 hover:bg-green-500/10 hover:border-green-500/20 flex items-center gap-1.5"
                >
                  <Download size={10} />
                  Delivery Report
                </button>
              </div>
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
                  <option value="all">All Email Status</option>
                  <option value="SENT">Sent Successfully</option>
                  <option value="PENDING">Pending Delivery</option>
                  <option value="FAILED">Failed Delivery</option>
                  <option value="AWS_SES">AWS SES Primary</option>
                  <option value="GMAIL_FALLBACK">Gmail Fallback</option>
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
                            <div className="flex flex-col items-center gap-1">
                              <span className={`inline-flex px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${getEmailBadgeColor(reg?.emailStatus || "PENDING")}`}>
                                {reg?.emailStatus || "PENDING"}
                              </span>
                              {reg?.emailProvider && (
                                <span className="text-[8px] font-black text-cyan-400 font-mono tracking-wider">
                                  {reg.emailProvider === 'AWS_SES' ? 'AWS SES' : 'GMAIL FALLBACK'}
                                </span>
                              )}
                              {reg?.lastEmailAttemptAt && (
                                <span className="text-[8px] text-slate-500" title={`Last Attempt: ${new Date(reg.lastEmailAttemptAt).toLocaleString()}`}>
                                  {new Date(reg.lastEmailAttemptAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                              {reg?.emailStatus === 'FAILED' && reg?.lastEmailError && (
                                <div className="text-[8px] text-red-400 max-w-[120px] truncate hover:text-clip hover:whitespace-normal font-mono bg-red-950/20 border border-red-500/10 px-1 py-0.5 rounded" title={reg.lastEmailError}>
                                  {reg.lastEmailError}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleResendSingleEmail(p.id, p.email)}
                                className="p-2 text-slate-400 hover:text-cyan-400 transition-colors bg-slate-950 rounded-lg border border-slate-900 hover:border-cyan-500/20"
                                title="Resend Entry QR Code Email"
                              >
                                <Mail size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteParticipant(p.id)}
                                disabled={deletingId === p.id}
                                className="p-2 text-slate-500 hover:text-red-400 transition-colors bg-slate-950 rounded-lg border border-slate-900 hover:border-red-500/20 disabled:opacity-50"
                                title="Soft delete participant"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
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
