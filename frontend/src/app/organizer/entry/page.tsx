"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Camera, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";

interface ScanResult {
  status: "SUCCESS" | "ALREADY_VERIFIED" | "ERROR";
  message: string;
  verifiedAt?: string;
  participant?: {
    name: string;
    email: string;
    organization: string;
  };
}

export default function EntryScanner() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  
  const qrReaderRef = useRef<Html5Qrcode | null>(null);
  const readerId = "qr-reader-entry";

  useEffect(() => {
    // Start scanning on mount
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    setCameraError("");
    setScanResult(null);
    setScanning(true);

    // Give the DOM a moment to mount the element
    setTimeout(async () => {
      try {
        const qrScanner = new Html5Qrcode(readerId);
        qrReaderRef.current = qrScanner;

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        await qrScanner.start(
          { facingMode: "environment" },
          config,
          async (decodedText) => {
            // Success callback: QR code scanned
            await handleQrDecoded(decodedText);
          },
          (errorMessage) => {
            // Verbose error logs, ignorable
          }
        );
      } catch (err: any) {
        console.error("Camera initialisation failed:", err);
        setCameraError("Camera access denied or device is already in use by another panel.");
        setScanning(false);
      }
    }, 100);
  };

  const stopScanner = async () => {
    if (qrReaderRef.current && qrReaderRef.current.isScanning) {
      try {
        await qrReaderRef.current.stop();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setScanning(false);
  };

  const handleQrDecoded = async (decodedText: string) => {
    // Stop scanning once we get a payload
    await stopScanner();
    setLoading(true);

    try {
      // Decode QR JSON payload
      const payload = JSON.parse(decodedText);
      if (!payload.registrationCode || !payload.signature) {
        throw new Error("Missing required payload fields.");
      }

      // Verify on backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/organizer/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationCode: payload.registrationCode,
          signature: payload.signature,
          action: "ENTRY",
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Verification rejected.");
      }

      if (data.status === "ALREADY_VERIFIED") {
        setScanResult({
          status: "ALREADY_VERIFIED",
          message: data.message || "This pass was already checked in.",
          verifiedAt: data.verifiedAt,
          participant: data.participant,
        });
      } else {
        setScanResult({
          status: "SUCCESS",
          message: "Check-in successful! Access granted.",
          verifiedAt: data.verifiedAt,
          participant: data.participant,
        });
      }
    } catch (err: any) {
      setScanResult({
        status: "ERROR",
        message: err.message || "Invalid ticket payload signature or unknown error.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScanNext = async () => {
    setScanResult(null);
    await startScanner();
  };

  return (
    <div className="min-h-screen bg-[#020205] text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-md w-full mx-auto space-y-6 flex-grow flex flex-col justify-center relative z-10">
        
        {/* Back and title bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/organizer/dashboard")}
            className="p-2 bg-slate-950 border border-slate-900 rounded-xl hover:border-cyan-500/20 text-slate-300 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-white">
              Gate Check-In
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
              Entry Verification System
            </p>
          </div>
        </div>

        {/* Scan / Alert Container */}
        <div className="w-full glass-panel rounded-3xl border border-cyan-500/15 p-6 shadow-[0_0_40px_rgba(0,240,255,0.05)] aspect-square flex flex-col items-center justify-center relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-3 z-20"
              >
                <Loader2 size={32} className="animate-spin text-cyan-400" />
                <p className="text-xs text-slate-300 font-semibold tracking-widest uppercase animate-pulse">
                  Querying Gate Credentials...
                </p>
              </motion.div>
            )}

            {scanResult ? (
              /* Verification Results Screen */
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-between text-center p-4 z-10"
              >
                <div>
                  {scanResult.status === "SUCCESS" && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full inline-block mb-4 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                      <CheckCircle2 size={36} />
                    </div>
                  )}
                  {scanResult.status === "ALREADY_VERIFIED" && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full inline-block mb-4 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                      <AlertTriangle size={36} />
                    </div>
                  )}
                  {scanResult.status === "ERROR" && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full inline-block mb-4 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                      <XCircle size={36} />
                    </div>
                  )}

                  <h3 className={`text-lg font-black uppercase tracking-wider ${
                    scanResult.status === "SUCCESS" ? "text-green-400" :
                    scanResult.status === "ALREADY_VERIFIED" ? "text-yellow-400" : "text-red-400"
                  }`}>
                    {scanResult.status === "SUCCESS" ? "Access Granted" :
                     scanResult.status === "ALREADY_VERIFIED" ? "Already Checked In" : "Access Denied"}
                  </h3>
                  
                  <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                    {scanResult.message}
                  </p>
                </div>

                {scanResult.participant && (
                  <div className="glass-panel border-slate-900 bg-slate-950/40 p-4 rounded-xl w-full space-y-1">
                    <div className="text-slate-500 text-[9px] uppercase tracking-wider font-bold">Participant</div>
                    <div className="text-white font-extrabold text-sm truncate">{scanResult.participant.name}</div>
                    <div className="text-slate-400 text-xs truncate">{scanResult.participant.email}</div>
                    <div className="text-[10px] text-cyan-400 font-semibold truncate pt-0.5">{scanResult.participant.organization}</div>
                    {scanResult.verifiedAt && (
                      <div className="text-[9px] text-slate-500 font-mono pt-1">
                        Checked-in: {new Date(scanResult.verifiedAt).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleScanNext}
                  className="neon-btn w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 mt-4"
                >
                  <RefreshCw size={12} />
                  Scan Next Ticket
                </button>
              </motion.div>
            ) : (
              /* Active Scanning Feed */
              <motion.div
                key="scanner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col justify-between items-center relative"
              >
                {/* Camera viewport wrapper */}
                <div className="w-full flex-grow relative bg-black/60 rounded-2xl border border-slate-900 overflow-hidden flex items-center justify-center">
                  <div id={readerId} className="w-full h-full object-cover"></div>
                  
                  {!scanning && !cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-slate-500">
                      <Camera size={24} />
                      <p className="text-[10px] uppercase font-bold tracking-widest">Initialising lens...</p>
                    </div>
                  )}

                  {cameraError && (
                    <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center space-y-3 z-10 bg-black/90">
                      <XCircle className="text-red-400" size={28} />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">Camera Hook Failed</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{cameraError}</p>
                      <button
                        onClick={startScanner}
                        className="neon-btn-secondary px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {scanning && (
                    <div className="absolute inset-0 pointer-events-none border-[3px] border-dashed border-cyan-500/20 rounded-2xl animate-pulse flex items-center justify-center">
                      {/* Laser scanner guide line */}
                      <div className="w-4/5 h-[1.5px] bg-cyan-400 shadow-[0_0_10px_#00f0ff] animate-[y-scan_2s_infinite_linear]" />
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-slate-500 text-center font-semibold tracking-wider mt-4">
                  POSITION TICKET QR IN TARGET BOX
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Styled animation keyframe overrides */}
      <style jsx global>{`
        @keyframes y-scan {
          0% { transform: translateY(-80px); }
          50% { transform: translateY(80px); }
          100% { transform: translateY(-80px); }
        }
      `}</style>
    </div>
  );
}
