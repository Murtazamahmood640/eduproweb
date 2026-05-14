"use client";

import React from "react";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "EduPro Academy is the definitive platform for O/A Level preparation. The depth of instruction in Mathematics and Physics is unparalleled — I achieved A* in both subjects.",
    author: "Ahmed Raza",
    role: "O-Level Student",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    text: "The Urdu Language courses are excellent. Uzma Siraj makes complex classical poetry so accessible and engaging. Truly a world-class learning experience.",
    author: "Fatima Zehra",
    role: "A-Level Student",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    text: "Booking live 1-on-1 sessions with Waleed Anwar saved my Calculus grade. The personalised attention and structured approach is worth every penny.",
    author: "Zaid Ibrahim",
    role: "Undergraduate Aspirant",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
  },
];

const Testimonials = () => {
  return (
    <section className="section-container bg-gradient-to-b from-white via-primary-50/20 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 left-0 w-[400px] h-[400px] bg-primary-50/40 rounded-full blur-3xl pointer-events-none" style={{ animationDelay: "2s" }} />
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="badge-primary mb-4">Student Success Stories</span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="heading-h2 mt-4 mb-4"
        >
          Voices of Our <span className="text-black">Achievers</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-edu-slate-500 text-base leading-relaxed"
        >
          Join thousands of high-achievers worldwide who have transformed their
          academic journey through EduPro Academy.
        </motion.p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-xl border border-edu-slate-100/60 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-primary/15 transition-all duration-400 flex flex-col hover:bg-white/90 relative group"
          >
            {/* Gradient border on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
              {/* Quote icon */}
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform"
                whileHover={{ rotate: 10 }}
              >
                <Quote className="w-5 h-5 text-white fill-current" />
              </motion.div>

              {/* Stars */}
              <motion.div 
                className="flex items-center gap-1.5 mb-6"
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Star className="w-4 h-4 text-amber-400 fill-current drop-shadow-sm" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Text */}
              <motion.p 
                className="text-edu-slate-600 text-sm leading-relaxed flex-1 mb-8 font-medium"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                &quot;{t.text}&quot;
              </motion.p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-edu-slate-100/50">
                <motion.img
                  src={t.image || null}
                  alt={t.author}
                  className="w-12 h-12 rounded-xl object-cover border-3 border-primary-100 shadow-md group-hover:border-primary-200"
                  whileHover={{ scale: 1.05 }}
                />
                <div>
                  <h4 className="font-bold text-edu-slate-900 text-sm group-hover:text-primary transition-colors">{t.author}</h4>
                  <p className="text-[11px] text-primary-600 font-semibold uppercase tracking-wider mt-0.5">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
