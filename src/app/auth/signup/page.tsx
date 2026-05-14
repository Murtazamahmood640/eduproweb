"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { 
  GraduationCap, Mail, Lock, Eye, EyeOff, 
  User, ArrowRight, BookOpen, Users, 
  ShieldCheck, Sparkles, CheckCircle2 
} from "lucide-react";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingOverlay isVisible={true} message="Preparing Academy Gate..." />}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const { refreshDbUser } = useAuth();
  
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [showPassword, setShowPassword] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["bg-gray-100", "bg-rose-400", "bg-amber-400", "bg-emerald-500"];
  const strengthLabels = ["", "Weak", "Moderate", "Secure"];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const toastId = toast.loading("Creating your account...");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      try {
        await api.post('/users/profile', { name, email, role });
        await refreshDbUser();
      } catch (backendErr) {
        console.error("Backend profile creation failed:", backendErr);
      }

      toast.success("Account created! Verifying email...", { id: toastId });
      router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}&role=${role}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ""}`);

    } catch (err: any) {
      const msg = err.code === "auth/email-already-in-use" 
        ? "An account with this email already exists." 
        : (err.message || "Failed to create an account");
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white">
      <LoadingOverlay isVisible={loading} message="Creating your academy account..." />
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
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join the Elite</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Start Your <br /><span className="text-primary">Academic Journey</span>
          </h2>
          <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-md mb-12">
            Unlock professional tools, expert mentorship, and a global community of high-achievers.
          </p>

          <div className="space-y-6">
            {[
              { title: "Elite Faculty", desc: "Direct access to top 1% subject specialists" },
              { title: "Verified Certificates", desc: "Recognized by leading global institutions" },
              { title: "Smart Analytics", desc: "Track your trajectory with precision data" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-4 p-5 bg-gray-50 border border-gray-100 rounded-xl hover:border-primary/20 transition-all"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 mb-1">{item.title}</p>
                  <p className="text-[11px] text-gray-400 font-bold leading-relaxed uppercase tracking-wider">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-gray-300 text-[10px] font-black uppercase tracking-[0.3em]">
          © 2025 EduPro Academy Global.
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-10 bg-gray-50 relative overflow-y-auto">
        <div className="w-full max-w-[460px] bg-white p-10 rounded-2xl border border-gray-100 shadow-2xl shadow-primary/5 my-10">
          <div className="lg:hidden flex justify-center mb-10">
             <Link href="/" className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg"><GraduationCap className="text-white w-5 h-5" /></div>
              <span className="font-black text-xl text-gray-900 tracking-tight text-2xl">Edu<span className="text-primary">Pro</span></span>
            </Link>
          </div>

          <header className="mb-10 text-center">
            <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Create Account</h1>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest text-[10px]">Begin your path to excellence</p>
          </header>

          <div className="flex bg-gray-50 rounded-xl p-1.5 mb-8 border border-gray-100">
            {(["student", "teacher"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${
                  role === r
                    ? "bg-white text-primary shadow-sm border border-gray-100"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {r === "student" ? <BookOpen className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                <span>I am a {r}</span>
              </button>
            ))}
          </div>

          {error && <div className="mb-4 text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-lg">{error}</div>}

          <form className="space-y-5" onSubmit={handleSignup}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.academy"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Create Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-14 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-gray-900"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-3 px-1">
                  <div className="flex gap-1.5 mb-1.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-500 ${i <= strength ? strengthColors[strength] : "bg-gray-100"}`} />
                    ))}
                  </div>
                  <p className={`text-[9px] font-black uppercase tracking-widest text-right ${strength === 1 ? "text-rose-500" : strength === 2 ? "text-amber-500" : "text-emerald-500"}`}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 text-[11px] font-bold text-gray-400 px-1 pt-2">
              <input id="terms" required type="checkbox" className="mt-0.5 rounded text-primary focus:ring-primary w-3.5 h-3.5 flex-shrink-0" />
              <label htmlFor="terms" className="leading-relaxed">
                I agree to the <Link href="/terms" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary-600 transition-all active:scale-[0.98] shadow-xl shadow-primary/20 group mt-4 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Start My Path"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 p-4 bg-primary-50 border border-primary-100 rounded-xl">
            <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-widest leading-relaxed">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Verified 256-bit encrypted data.</span>
            </div>
          </div>

          <p className="mt-10 text-center text-gray-500 font-medium text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary font-black hover:underline ml-1">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
