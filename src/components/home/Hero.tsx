"use client";

import React from "react";
import { ArrowRight, Star, CheckCircle2, Play, Sparkles, Trophy, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero = () => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-br from-white via-white to-primary-50 selection:bg-primary selection:text-white">
      {/* ── Animated gradient background ── */}
      <div className="absolute inset-0 bg-box-pattern opacity-50 pointer-events-none" />
      
      {/* ── Multiple animated blobs ── */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-gradient-to-br from-primary-50/40 to-primary-100/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 -left-20 w-[40rem] h-[40rem] bg-gradient-to-tr from-primary-50/30 to-transparent blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary rounded-xl mb-8 border border-primary-100 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Gold Standard of Education</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight"
            >
              Architecting <br />
              <span className="text-primary">Academic Elite</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0 font-medium"
            >
              Join the top 1% of achievers with our specialized O/A Level curricula and world-renowned language programs. Direct access to elite global trainers.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link 
                href="/courses" 
                className="group relative inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20 hover:bg-primary-600 transition-all active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">Explore Mastery</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="inline-flex items-center gap-3 px-8 py-5 text-gray-900 font-black text-xs uppercase tracking-widest hover:text-primary transition-all group">
                <div className="w-12 h-12 rounded-full border-2 border-primary/10 flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary/20 transition-all">
                  <Play className="w-4 h-4 fill-primary text-primary" />
                </div>
                Learn Process
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-16 pt-10 border-t border-gray-100 flex flex-wrap justify-center lg:justify-start gap-10"
            >
              {[
                { label: "Elite Students", val: "50k+", icon: Trophy },
                { label: "Verified Faculty", val: "250+", icon: ShieldCheck },
                { label: "A* Track Record", val: "94%", icon: Star },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                    <stat.icon className="w-5 h-5 text-primary opacity-30" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-black text-gray-900 leading-none">{stat.val}</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Right Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden border-4 border-white shadow-lg shadow-primary/10 w-full max-w-md h-80">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600&h=480" 
                alt="Elite Student" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
            </div>

            {/* Floating Achievement Card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">Status</p>
                <p className="text-gray-900 font-black text-sm">Elite Access</p>
              </div>
            </motion.div>

            {/* Accent Shapes */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 border-[24px] border-primary/5 rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
