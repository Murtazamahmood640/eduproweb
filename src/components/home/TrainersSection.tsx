"use client";

import React from "react";
import Link from "next/link";
import { Star, ArrowRight, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { TEACHERS } from "@/lib/data";

const TrainersSection = () => {
  return (
    <section className="bg-gradient-to-b from-primary-50/40 to-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-primary-100/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-primary-50/30 rounded-full blur-3xl pointer-events-none" style={{ animationDelay: "1.5s" }} />
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="badge-primary mb-4">World Class Trainers</span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="heading-h2 mt-4 mb-4"
          >
            Learn from the{" "}
            <span className="text-black">Best Experts</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-edu-slate-500 text-base leading-relaxed"
          >
            Our instructors are industry veterans, subject matter experts, and
            dedicated educators committed to your success worldwide.
          </motion.p>
        </div>

        {/* Trainer cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 relative z-10">
          {TEACHERS.slice(0, 3).map((trainer, index) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white/70 backdrop-blur-xl border border-edu-slate-100/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/15 transition-all duration-400 hover:bg-white/90 relative">
                {/* Photo */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                  <motion.img
                    src={trainer.image || undefined}
                    alt={trainer.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700"
                    whileHover={{ scale: 1.08 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Rating pill over image */}
                  <motion.div 
                    className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 group-hover:shadow-xl group-hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Star className="w-4 h-4 text-amber-400 fill-current drop-shadow-sm" />
                    <span className="text-xs font-black text-edu-slate-900">{trainer.rating}</span>
                    <span className="text-[10px] text-edu-slate-500 font-semibold">({trainer.reviews})</span>
                  </motion.div>
                </div>

                {/* Body */}
                <div className="p-6 relative z-10">
                  <motion.p 
                    className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 group-hover:text-primary-600 transition-colors"
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {trainer.specialty}
                  </motion.p>
                  <h3 className="font-bold text-edu-slate-900 text-lg mb-1 group-hover:text-primary transition-colors">{trainer.name}</h3>
                  <p className="text-xs text-edu-slate-400 font-semibold mb-5">{trainer.role}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-edu-slate-100/50">
                    <motion.div 
                      className="flex items-center gap-2 text-xs text-edu-slate-600 font-semibold"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Users className="w-4 h-4 text-primary" />
                      <span>{trainer.reviews.toLocaleString()} Reviews</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={`/trainers/${trainer.id}`}
                        className="w-10 h-10 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-xl flex items-center justify-center hover:bg-primary transition-all group/btn shadow-md hover:shadow-lg hover:shadow-primary/20"
                      >
                        <ArrowRight className="w-4 h-4 text-primary group-hover/btn:text-white transition-colors" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/trainers"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary border-2 border-primary/20 rounded-xl font-bold text-sm hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 shadow-sm"
          >
            Meet All Trainers
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;
