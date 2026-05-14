"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Code, Zap, Users, TrendingUp, Award } from "lucide-react";
import Link from "next/link";

const paths = [
  {
    id: 1,
    icon: BookOpen,
    title: "Academic Excellence",
    description: "Master O/A Level curriculum with our elite instructors",
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-400/30",
    students: "12,500+",
    rating: "4.9",
    modules: 45,
  },
  {
    id: 2,
    icon: Code,
    title: "Tech Mastery",
    description: "Learn programming and software development from experts",
    color: "from-purple-500/20 to-purple-600/10",
    borderColor: "border-purple-400/30",
    students: "8,300+",
    rating: "4.8",
    modules: 38,
  },
  {
    id: 3,
    icon: Zap,
    title: "Language Power",
    description: "Achieve fluency in German, Spanish, and more",
    color: "from-amber-500/20 to-amber-600/10",
    borderColor: "border-amber-400/30",
    students: "15,200+",
    rating: "4.9",
    modules: 52,
  },
];

const InteractivePaths = () => {
  return (
    <section className="section-container relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute -top-40 left-0 w-[600px] h-[600px] bg-primary-100/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-50/30 rounded-full blur-3xl pointer-events-none" style={{ animationDelay: "2s" }} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-full"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">
            ✨ Learning Pathways
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight"
        >
          Choose Your <span className="text-primary">Learning Journey</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-lg leading-relaxed"
        >
          Pick from our curated learning paths designed by experts to help you achieve your academic and professional goals
        </motion.p>
      </div>

      {/* Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {paths.map((path, index) => {
          const Icon = path.icon;
          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -12 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card wrapper */}
              <div className={`relative h-full bg-gradient-to-br ${path.color} backdrop-blur-xl border ${path.borderColor} rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer`}>
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Top accent */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <motion.div
                    className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/30 transition-all"
                    whileHover={{ rotate: 12 }}
                  >
                    <Icon className="w-7 h-7 text-gray-900" />
                  </motion.div>

                  {/* Title and Description */}
                  <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-8 flex-1 leading-relaxed">
                    {path.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8 pt-6 border-t border-white/20">
                    <div className="text-center">
                      <div className="text-lg font-black text-gray-900">{path.modules}</div>
                      <div className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider mt-1">Modules</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-black text-gray-900">{path.rating}</div>
                      <div className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider mt-1">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-black text-gray-900">{path.students}</div>
                      <div className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider mt-1">Students</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/courses"
                      className="block w-full py-3 px-4 bg-white/30 hover:bg-white/50 border border-white/40 rounded-lg font-bold text-sm text-gray-900 text-center transition-all group/btn backdrop-blur-sm"
                    >
                      Explore Path →
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center mt-16 relative z-10"
      >
        <p className="text-gray-600 font-medium mb-6">
          Not sure which path to choose?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-600 transition-all shadow-lg shadow-primary/30 group"
        >
          Get Personalized Guidance
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </motion.div>
    </section>
  );
};

export default InteractivePaths;
