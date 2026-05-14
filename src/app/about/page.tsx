"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Users, Award, Globe, Target, ShieldCheck, 
  Sparkles, CheckCircle2, ArrowRight, BookOpen
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const AboutPage = () => {
  return (
    <main className="min-h-screen flex flex-col bg-white selection:bg-primary selection:text-white">
      <Navbar />

      {/* ── Light Hero Section with Box Pattern ── */}
      <section className="pt-36 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white relative border-b border-gray-100 bg-box-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 border border-primary-100"
              >
                <Sparkles className="w-4 h-4" />
                <span>Pioneering Digital Education</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight"
              >
                Architecting the <br />
                <span className="text-primary">Future of Learning</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
              >
                EduPro Academy was founded on a singular vision: to democratize access to elite, expert-led academic training for high-achievers worldwide.
              </motion.p>
            </div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="hidden lg:block relative"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[10px] border-white aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200&h=800" 
                  alt="Our Vision" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/5" />
              </div>
              {/* Badge bubble */}
              <div className="absolute -bottom-8 -right-8 bg-white border border-gray-100 p-6 rounded-2xl shadow-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center shadow-sm">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Est. Quality</p>
                  <p className="text-xl font-black text-primary leading-none mt-1">Global Standard</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Content Sections ── */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {[
              { title: "Our Mission", desc: "To bridge the gap between regional curriculum and international excellence through expert guidance.", icon: Target },
              { title: "Global Impact", desc: "Empowering 50,000+ students across 25+ countries to achieve their academic dreams.", icon: Globe },
              { title: "Elite Faculty", desc: "Access to the top 1% of educators from Cambridge, Oxford, and Ivy League backgrounds.", icon: Users },
            ].map((card, i) => (
              <div key={i} className="p-10 rounded-[2rem] border border-gray-100 bg-gray-50 hover:border-primary/20 hover:bg-white hover:shadow-2xl transition-all group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform border border-gray-100">
                  <card.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-box-pattern opacity-[0.05] pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tight">Ready to start your trajectory?</h2>
                <p className="text-white/60 text-lg mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
                  Join the thousands of students already mastering their future with EduPro Academy.
                </p>
                <Link href="/courses" className="inline-flex items-center gap-3 bg-white text-primary px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-2xl shadow-black/10 active:scale-95 group">
                  Get Started Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Active Students", val: "50k+" },
                  { label: "Elite Teachers", val: "250+" },
                  { label: "Average Grade", val: "A / A*" },
                  { label: "Countries", val: "25+" },
                ].map((stat, i) => (
                  <div key={i} className="p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-3xl font-black mb-1">{stat.val}</p>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutPage;
