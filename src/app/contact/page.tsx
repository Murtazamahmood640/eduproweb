"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Mail, Phone, MapPin, Send, MessageCircle, 
  HelpCircle, Globe, Sparkles 
} from "lucide-react";
import { motion } from "framer-motion";

const ContactPage = () => {
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
                <MessageCircle className="w-4 h-4" />
                <span>Global Support Center</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight"
              >
                Get in Touch with <br />
                <span className="text-primary">Our Support</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
              >
                Whether you have questions about enrollment, teacher verification, or platform features, our elite support team is here to help you 24/7.
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
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1200&h=800" 
                  alt="Contact Us" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/5" />
              </div>
              {/* Badge bubble */}
              <div className="absolute -top-8 -right-8 bg-white border border-gray-100 p-6 rounded-2xl shadow-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Help Center</p>
                  <p className="text-xl font-black text-primary leading-none mt-1">Open 24/7</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Contact Form & Info ── */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Info Cards */}
            <div className="space-y-6">
              {[
                { label: "Email Us", val: "support@edupro.academy", sub: "Global Admissions", icon: Mail },
                { label: "Phone", val: "+92 (300) 123-4567", sub: "Mon-Sat, 9AM-9PM", icon: Phone },
                { label: "Headquarters", val: "Elite Plaza, Sector F-10", sub: "Islamabad, Pakistan", icon: MapPin },
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-[2rem] border border-gray-100 bg-gray-50 hover:border-primary/20 hover:bg-white hover:shadow-2xl transition-all group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{item.label}</p>
                  <p className="text-lg font-black text-gray-900 mb-1">{item.val}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 md:p-16 shadow-2xl shadow-primary/5">
                <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">Direct Messaging</h2>
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input type="email" placeholder="name@example.pk" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Inquiry Subject</label>
                    <input type="text" placeholder="e.g. Admission Inquiry" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Message</label>
                    <textarea rows={6} placeholder="How can we help you achieve excellence?" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all resize-none" />
                  </div>
                  <button className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-600 transition-all shadow-2xl shadow-primary/20 active:scale-95 group">
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Dispatch Message
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ContactPage;
