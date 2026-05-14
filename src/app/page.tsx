"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import WhyChoose from "@/components/home/WhyChoose";
import TrainersSection from "@/components/home/TrainersSection";
import Testimonials from "@/components/home/Testimonials";
import Levels from "@/components/home/Levels";
import InteractivePaths from "@/components/home/InteractivePaths";
import { ParallaxShowcase } from "@/components/home/ParallaxShowcase";
import Footer from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const stats = [
  { label: "Active Students",   value: "50,000+" },
  { label: "Premium Courses",   value: "1,200+"  },
  { label: "Success Rating",    value: "4.9 / 5" },
  { label: "Elite Instructors", value: "150+"     },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-white via-white to-primary-50/20">
      <Navbar />
      <Hero />

      {/* ── Stats Bar ───────────────────────────────────── */}
      <section className="bg-gradient-to-r from-primary via-primary-600 to-primary border-y border-primary/30 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-white/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.08, y: -4 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group cursor-pointer"
              >
                <motion.p 
                  className="text-3xl md:text-4xl font-black text-white tracking-tight"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-[11px] text-white/70 font-semibold uppercase tracking-widest mt-3 group-hover:text-white/90 transition-colors">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedCourses />
      <ParallaxShowcase />
      <InteractivePaths />
      <WhyChoose />
      <Levels />
      <TrainersSection />
      <Testimonials />

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section className="section-container pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-primary via-primary-600 to-primary-700 rounded-3xl px-8 py-16 md:px-20 md:py-24 text-center overflow-hidden group shadow-2xl shadow-primary/30"
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 animate-pulse pointer-events-none" />
          
          {/* Subtle diagonal tint */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 32px)",
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block px-5 py-1.5 bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-8">
              Limited Enrollment — Act Now
            </span>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight"
            >
              Ready to Master Your <br />
              <span className="text-white/80">Academic Destiny?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-white/60 text-lg mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              Join 50,000+ elite students on EduPro Academy and gain exclusive
              access to top examiners and subject specialists — anywhere in the world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/signup"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-primary rounded-xl font-bold text-sm hover:bg-white/95 transition-all shadow-xl shadow-black/30 relative overflow-hidden"
                >
                  <span className="relative z-10">Join Now — It&apos;s Free</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/courses"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-white/15 backdrop-blur-md border-2 border-white/30 text-white rounded-xl font-bold text-sm hover:bg-white/25 hover:border-white/50 transition-all"
                >
                  <span className="relative z-10">Browse Courses</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
