"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, Mail, Lock, Eye, EyeOff,
  Shield, ArrowRight, AlertCircle, ShieldCheck, Sparkles, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { refreshDbUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials.");
        setLoading(false);
        return;
      }

      // Store admin session in localStorage
      localStorage.setItem("adminUser", JSON.stringify(data));
      
      // Hydrate AuthContext so AdminLayout recognizes the session
      await refreshDbUser();
      
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Could not connect to the server. Is the backend running?");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white">
      {/* ── Left Branded Panel (Light Theme) ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-white border-r border-gray-100 relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: "radial-gradient(#002366 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <Link href="/" className="relative flex items-center gap-3 z-10 group">
          <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <div className="leading-none">
            <span className="font-black text-2xl text-gray-900">Edu<span className="text-primary">Pro</span></span>
            <span className="block text-[8px] font-bold uppercase tracking-[0.3em] text-gray-400 mt-0.5">Academy</span>
          </div>
        </Link>

        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest mb-8 border border-primary-100"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Personnel</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Command Center <br /><span className="text-primary">& Administration</span>
          </h2>
          <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-md mb-12">
            Secure administrative portal for platform oversight, user management, and curriculum verification.
          </p>

          <div className="space-y-4">
            {[
              "Real-time platform analytics",
              "Curriculum approval engine",
              "Granular user permissions",
              "Global system settings",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-gray-300 text-[10px] font-black uppercase tracking-[0.3em]">
          © 2025 EduPro Academy Global.
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-10 bg-gray-50 relative overflow-y-auto">
        <div className="w-full max-w-[440px] bg-white p-10 rounded-2xl border border-gray-100 shadow-2xl shadow-primary/5">
          <div className="lg:hidden flex justify-center mb-10">
             <Link href="/" className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg"><GraduationCap className="text-white w-5 h-5" /></div>
              <span className="font-black text-xl text-gray-900 tracking-tight text-2xl">Edu<span className="text-primary">Pro</span></span>
            </Link>
          </div>

          <header className="mb-10 text-center">
            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="text-primary w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Admin Portal</h1>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest text-[10px]">Restricted System Access</p>
          </header>

          {error && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-red-500 text-xs font-bold text-center bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-3"
            >
                <AlertCircle className="w-4 h-4" />
                {error}
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admin Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@edupro.academy"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-14 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-gray-900"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 group mt-4 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Access Control Center"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-10 text-center text-gray-400 font-medium text-[10px] uppercase tracking-widest">
            Authorized Personnel Only. Logged access.
          </p>

          <div className="mt-8 text-center pt-8 border-t border-gray-50">
            <Link href="/auth/login" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline transition-colors flex items-center justify-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to Public Portals
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
