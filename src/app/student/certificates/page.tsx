"use client";

import React, { useState, useEffect } from "react";
import { 
  Award, Download, ShieldCheck, Share2, 
  ExternalLink, Loader2, Search, Calendar,
  Trophy, BadgeCheck, GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CertificatesPage() {
  const { dbUser } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get("/certificates/my");
      setCertificates(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Authenticating Credentials...</p>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Header */}
      <div className="relative p-12 bg-[#0a0a0b] rounded-[3rem] border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-full bg-primary/10 blur-[120px] rounded-full translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Blockchain Verified Credentials</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Academic <br /><span className="text-primary italic">Distinctions</span>
          </h1>
          <p className="text-white/40 text-lg font-medium leading-relaxed">
            Every certificate earned on EduPro is a testament to your commitment to excellence. These credentials are institutional-grade and universally verifiable.
          </p>
        </div>
      </div>

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certificates.map((cert, i) => (
            <Link
              key={cert._id}
              href={`/student/certificates/${cert._id}`}
              className="group relative bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 hover:border-primary/40 transition-all"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
              
              <div className="p-10 space-y-8">
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-2 group-hover:text-primary transition-colors">
                    {cert.course?.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full my-auto" />
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> ID: {cert.certificateId}</span>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group-hover:bg-primary/5 group-hover:border-primary/10 transition-all">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Attained Grade</p>
                    <p className="text-sm font-black text-gray-900">{cert.grade}</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-3 bg-white text-gray-400 rounded-xl border border-gray-100 hover:text-primary hover:border-primary/20 transition-all shadow-sm">
                       <Share2 className="w-4 h-4" />
                     </button>
                     <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                       <Download className="w-4 h-4" /> Download PDF
                     </button>
                  </div>
                </div>
              </div>
              
              {/* Institutional Branding Strip */}
              <div className="px-10 py-5 bg-gray-900 flex items-center justify-between">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">EduPro Academy Institutional Credential</span>
                <ExternalLink className="w-4 h-4 text-white/20" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-24 bg-white border border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center justify-center text-center px-6">
           <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 text-slate-200 border border-slate-100">
             <Trophy className="w-10 h-10" />
           </div>
           <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-4">Credentials Pending</h3>
           <p className="text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
             Complete your current active modules to 100% mastery to unlock your official academic distinctions.
           </p>
           <button className="mt-10 px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-600 transition-all">
             Resume Learning
           </button>
        </div>
      )}
    </div>
  );
}
