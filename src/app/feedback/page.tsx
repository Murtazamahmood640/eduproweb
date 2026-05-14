"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { Star, Quote, ThumbsUp, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "The Web Development track is absolutely fantastic. I went from knowing nothing to building my own SaaS in just 6 months. The support from mentors is incredible.",
    author: "Ahmed Raza",
    role: "Full Stack Developer",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200",
    rating: 5,
  },
  {
    text: "I've tried many platforms, but EduPro's focus on practical projects is what sets it apart. The UI/UX course gave me a portfolio that actually got me hired.",
    author: "Sarah Khan",
    role: "Product Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    rating: 5,
  },
  {
    text: "Clear, concise, and professional. The Python course is the best I've seen. Every concept is explained with real-world examples.",
    author: "Michael Chen",
    role: "Data Analyst",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    rating: 4,
  },
  {
    text: "The community aspect of EduPro is what I love most. You're never learning alone. There's always someone to help when you get stuck.",
    author: "Jane Smith",
    role: "Student",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200",
    rating: 5,
  },
];

const FeedbackPage = () => {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <section className="pt-32 pb-20 bg-white border-b border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-edu-amber/5 blur-3xl rounded-full translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-50 text-edu-amber rounded-full mb-6"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold tracking-wider uppercase">SUCCESS STORIES</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-h1 text-slate-900 mb-6"
          >
            Student <span className="text-edu-indigo">Feedback</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            Don't just take our word for it. Hear what our community of 50,000+ students has to say about their experience.
          </motion.p>
        </div>
      </section>

      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 relative"
            >
              <Quote className="absolute top-10 right-10 w-12 h-12 text-edu-indigo/5" />
              
              <div className="flex space-x-1 text-edu-amber mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < t.rating ? "fill-current" : "text-slate-200"}`} />
                ))}
              </div>

              <p className="text-slate-700 text-lg italic mb-10 leading-relaxed">
                "{t.text}"
              </p>

              <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                <div className="flex items-center space-x-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-md">
                    <img src={t.image} alt={t.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{t.author}</h4>
                    <p className="text-sm text-edu-indigo font-bold uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center space-x-2 text-slate-400">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-sm font-bold">Helpful</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-white rounded-[3rem] p-12 text-center border border-dashed border-slate-300">
          <MessageSquare className="w-12 h-12 text-edu-indigo mx-auto mb-6" />
          <h2 className="heading-h2 mb-4">Want to share your experience?</h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Your feedback helps us improve and helps other students make the right choice.
          </p>
          <button className="btn-primary">Write a Review</button>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default FeedbackPage;
