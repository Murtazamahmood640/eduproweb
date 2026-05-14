"use client";

import React from "react";
import { ShieldCheck, Target, Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: "Elite Instructors",
    description:
      "Learn from Cambridge-certified examiners and industry-leading language specialists.",
  },
  {
    icon: <Target className="w-6 h-6 text-primary" />,
    title: "Precision Curriculum",
    description:
      "Our structured modules are mapped directly to the latest O/A Level and IELTS syllabi.",
  },
  {
    icon: <Award className="w-6 h-6 text-primary" />,
    title: "Verified Excellence",
    description:
      "Earn certificates recognized by top institutions to validate your academic mastery.",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    title: "Insightful Analytics",
    description:
      "Track your learning trajectory with detailed performance reports and predictive scoring.",
  },
];

const progressItems = [
  { label: "Video Modules",       value: "12 / 16", pct: 75 },
  { label: "Practice Papers",     value: "8 / 10",  pct: 80 },
  { label: "Live Workshops",      value: "3 / 4",   pct: 75 },
];

const WhyChoose = () => {
  return (
    <section className="bg-gradient-to-br from-white via-primary-50/20 to-primary-100/10 py-24 relative overflow-hidden">
      {/* Decorative animated blobs */}
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-tl from-primary/15 to-primary/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none animate-pulse" />
      <div className="absolute top-20 left-1/4 w-[35rem] h-[35rem] bg-primary-100/20 blur-3xl rounded-full pointer-events-none" style={{ animationDelay: "1s" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* ── Left Content ─────────────────────────────── */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-primary-100">
              The EduPro Advantage
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6"
            >
              Engineered for <br />
              <span className="text-primary">Academic Superiority</span>
            </motion.h2>

            <p className="text-gray-500 text-lg leading-relaxed mb-12 max-w-xl">
              We don&apos;t just teach subjects; we architect success. Our platform combines 
              theoretical mastery with strategic exam techniques.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/60 backdrop-blur-xl border border-gray-100/50 rounded-2xl p-7 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all group relative overflow-hidden"
                >
                  {/* Animated gradient on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-lg flex items-center justify-center mb-5 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all"
                      whileHover={{ rotate: 8, scale: 1.1 }}
                    >
                      <div className="text-primary group-hover:text-primary-700 transition-colors">
                        {feature.icon}
                      </div>
                    </motion.div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-medium">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right — Progress Visualization ────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-100 rounded-2xl p-8 shadow-2xl shadow-primary/5 relative overflow-hidden"
          >
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
              style={{ backgroundImage: "repeating-linear-gradient(45deg, #002366 0px, #002366 1px, transparent 1px, transparent 10px)" }} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-black text-gray-900 text-sm uppercase tracking-widest">Mastery Level</h4>
                <span className="text-primary font-black text-sm">72%</span>
              </div>

              <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden mb-10 border border-gray-100">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "72%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(0,35,102,0.3)]"
                />
              </div>

              <div className="space-y-5">
                {progressItems.map((item, i) => (
                  <div key={i} className="p-5 bg-gray-50 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-600">{item.label}</span>
                      <span className="text-xs font-black text-primary">{item.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.2 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                  <Award className="text-white w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Certificate Ready</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">Advanced O-Level Mathematics</p>
                </div>
                <button className="px-5 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary/20">
                  Claim
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
