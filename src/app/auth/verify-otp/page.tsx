"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, ShieldCheck, RefreshCw, GraduationCap, ChevronLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

import toast from "react-hot-toast";

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") || "student";
  const { refreshDbUser } = useAuth();
  const redirect = searchParams.get("redirect");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otpSent, setOtpSent] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Send initial OTP on mount once user is authenticated
    let isMounted = true;
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && !otpSent && isMounted) {
        // Add a small delay to ensure backend is ready and token is refreshed
        setTimeout(() => {
          if (isMounted) handleResend();
        }, 1000);
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [otpSent]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) return;

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", { otp: otpString });
      toast.success("Identity verified! Welcoming you to the academy...");
      
      // Refresh local auth state to reflect verified status
      await refreshDbUser();

      const userRole = res.data.user?.role || role;

      // Success! Redirect to intended destination or dashboard
      if (redirect) {
        router.push(redirect);
      } else if (userRole === "student") {
        router.push("/student/dashboard");
      } else if (userRole === "teacher") {
        router.push("/teacher/dashboard");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    
    setResending(true);
    setError("");
    try {
      await api.post("/auth/send-otp");
      setOtpSent(true);
      setTimer(60);
      toast.success("A fresh verification code has been dispatched.");
    } catch (err: any) {
      console.error("Resend error:", err);
      setError("Failed to send code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-3xl border border-gray-100 shadow-2xl shadow-primary/5"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
          </Link>
        </div>

        <header className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Verify Email</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
            Enter the 6-digit code sent to
          </p>
          <p className="text-primary font-bold mt-1 break-all">{email}</p>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-500 text-xs font-bold text-center rounded-xl"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleVerify} className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-16 text-center text-2xl font-black bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-gray-900"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.some(d => !d)}
            className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-600 transition-all active:scale-[0.98] shadow-xl shadow-primary/20 group disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Verify Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-widest">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className={`text-sm font-black transition-all ${
              timer > 0 ? "text-gray-300 cursor-not-allowed" : "text-primary hover:underline"
            }`}
          >
            {resending ? "Sending..." : timer > 0 ? `Resend Code in ${timer}s` : "Resend Code Now"}
          </button>
        </div>

        <div className="mt-12 p-5 bg-primary-50 border border-primary-100 rounded-2xl">
          <div className="flex items-center gap-4 text-[10px] font-black text-primary uppercase tracking-widest leading-relaxed">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span>Secure 2-Factor Authentication</span>
          </div>
        </div>

        <Link 
          href="/auth/signup" 
          className="mt-8 flex items-center justify-center gap-2 text-gray-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Signup
        </Link>
      </motion.div>
    </main>
  );
}
