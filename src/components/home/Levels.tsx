"use client";

import React from "react";
import { Compass, GraduationCap, Trophy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const levels = [
  {
    icon: <Compass className="w-7 h-7 text-primary" />,
    title: "O Levels",
    subtitle: "Core Foundation",
    description:
      "Master the fundamentals of academic subjects with certified specialists, past-paper walkthroughs, and structured revision.",
    courses: 25,
  },
  {
    icon: <GraduationCap className="w-7 h-7 text-white" />,
    title: "A Levels",
    subtitle: "Advanced Mastery",
    description:
      "Deep-dive into specialised streams with direct examiner insights, essay coaching, and A* strategies.",
    courses: 38,
    highlighted: true,
  },
  {
    icon: <Trophy className="w-7 h-7 text-primary" />,
    title: "University Prep",
    subtitle: "Elite Placement",
    description:
      "Personalised coaching for top-tier global university admissions, SAT/IELTS prep, and personal statement support.",
    courses: 15,
  },
];

const Levels = () => {
  return (
    <section className="section-container bg-gradient-to-br from-primary-50/30 via-white to-primary-100/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-primary-100/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-primary-50/30 rounded-full blur-3xl pointer-events-none" style={{ animationDelay: "1.5s" }} />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 relative z-10">
        <div className="max-w-2xl">
          <span className="badge-primary mb-4">Structured Excellence</span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="heading-h2 mt-4 mb-4"
          >
            Find Your{" "}
            <span className="text-black">Academic Path</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-edu-slate-500 text-base leading-relaxed"
          >
            Whether you are building foundations or preparing for elite placements,
            we have a meticulously designed path for your success.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-600 transition-all active:scale-95 shadow-md shadow-primary/25"
          >
            Explore All Paths
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {levels.map((level, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div
              className={`relative rounded-2xl p-8 h-full flex flex-col border transition-all duration-300 group overflow-hidden ${
                level.highlighted
                  ? "bg-gradient-to-br from-primary via-primary-600 to-primary-700 border-primary shadow-2xl shadow-primary/40 text-white hover:shadow-2xl"
                  : "bg-white/70 backdrop-blur-xl border-edu-slate-100/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 hover:bg-white/90"
              }`}
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10">
                {/* Popular badge */}
                {level.highlighted && (
                  <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2"
                    initial={{ y: -20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <span className="px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      ⭐ Most Popular
                    </span>
                  </motion.div>
                )}

                {/* Icon */}
                <motion.div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                    level.highlighted
                      ? "bg-white/15 border border-white/30 shadow-lg shadow-white/10"
                      : "bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 shadow-md"
                  }`}
                  whileHover={{ rotate: 12 }}
                >
                  {level.icon}
                </motion.div>

                {/* Subtitle tag */}
                <motion.span
                  className={`text-[10px] font-black uppercase tracking-widest mb-3 block ${
                    level.highlighted ? "text-white/70" : "text-primary-600"
                  }`}
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                >
                  {level.subtitle}
                </motion.span>

                {/* Title */}
                <h3
                  className={`text-2xl font-black mb-4 tracking-tight group-hover:scale-105 origin-left transition-transform ${
                    level.highlighted ? "text-white" : "text-edu-slate-900"
                  }`}
                >
                  {level.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-sm leading-relaxed flex-1 mb-8 font-medium ${
                    level.highlighted ? "text-white/80" : "text-edu-slate-600"
                  }`}
                >
                  {level.description}
                </p>

                {/* Footer */}
                <div
                  className={`flex items-center justify-between pt-6 border-t ${
                    level.highlighted ? "border-white/15" : "border-edu-slate-100/50"
                  }`}
                >
                  <div>
                    <span
                      className={`text-2xl font-black block leading-none ${
                        level.highlighted ? "text-white" : "text-edu-slate-900"
                      }`}
                    >
                      {level.courses}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest mt-1 block ${
                        level.highlighted ? "text-white/50" : "text-edu-slate-500"
                      }`}
                    >
                      Courses
                    </span>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/courses"
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all font-bold ${
                        level.highlighted
                          ? "bg-white text-primary hover:shadow-lg hover:shadow-white/20"
                          : "bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 text-primary hover:bg-primary hover:text-white shadow-md hover:shadow-lg hover:shadow-primary/20"
                      }`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Levels;
