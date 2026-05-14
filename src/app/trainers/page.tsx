"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Star, Award, Linkedin, Share2, Globe, Sparkles, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TEACHERS } from "@/lib/data";

const TrainersPage = () => {
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
                <Award className="w-4 h-4" />
                <span>Verified Academic Experts</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight"
              >
                Learn from the <br />
                <span className="text-primary">Global Elite</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
              >
                Direct access to world-renowned examiners, linguists, and subject matter specialists dedicated to your academic trajectory. Our faculty brings decades of expertise across O/A Levels, professional certifications, and specialized skill development.
              </motion.p>
            </div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="hidden lg:block relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white aspect-[4/3] bg-gradient-to-br from-primary-100 via-blue-50 to-indigo-100">
                <img 
                  src="https://images.unsplash.com/photo-1544717297-fa95b3ee51f8?auto=format&fit=crop&q=80&w=1200&h=900" 
                  alt="Elite Educators" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.opacity = '0';
                  }}
                />
                <div className="absolute inset-0 bg-primary/5" />
              </div>
              {/* Badge bubble */}
              <div className="absolute -top-8 -right-8 bg-white border border-gray-100 p-6 rounded-2xl shadow-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Global Faculty</p>
                  <p className="text-xl font-black text-primary leading-none mt-1">6+</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Trainer Grid ── */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {TEACHERS.map((trainer, index) => (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-primary/10 transition-all flex flex-col lg:flex-row gap-10 items-start group"
              >
                <div className="relative w-full lg:w-56 h-72 lg:h-72 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-xl border-4 border-white group-hover:rotate-2 transition-transform duration-500">
                  <img src={trainer.image} alt={trainer.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex-grow space-y-5">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">{trainer.name}</h3>
                      <Sparkles className="w-5 h-5 text-primary/20" />
                    </div>
                    <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] bg-primary-50 w-fit px-4 py-1.5 rounded-lg border border-primary-100">{trainer.role}</p>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-gray-900 text-sm font-black">{trainer.rating}</span>
                    </div>
                    <div className="w-1.5 h-1.5 bg-gray-100 rounded-full" />
                    <span>{trainer.reviews.toLocaleString()} Elite Reviews</span>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium">
                    {trainer.bio}
                  </p>

                  {/* Experience & Achievements */}
                  <div className="grid grid-cols-2 gap-4 py-5 border-y border-gray-100">
                    {trainer.experience && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Experience</p>
                        <p className="text-sm font-black text-gray-900">{trainer.experience}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Students Taught</p>
                      <p className="text-sm font-black text-gray-900">{trainer.reviews}+</p>
                    </div>
                  </div>

                  {/* Achievements */}
                  {trainer.achievements && trainer.achievements.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Key Achievements</p>
                      <div className="space-y-2">
                        {trainer.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-xs font-semibold text-gray-600">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex space-x-2">
                      {[Linkedin, Globe, Share2].map((Icon, i) => (
                        <button key={i} className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-xl transition-all">
                          <Icon className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                    <Link href={`/trainers/${trainer.id}`} className="inline-flex items-center gap-3 bg-primary text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-600 transition-all active:scale-95 group/btn">
                      View Profile
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default TrainersPage;
