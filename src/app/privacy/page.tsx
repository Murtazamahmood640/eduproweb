"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const PrivacyPage = () => {
  return (
    <main className="min-h-screen flex flex-col bg-white selection:bg-primary selection:text-white">
      <Navbar />

      {/* ── Light Hero Section with Box Pattern ── */}
      <section className="pt-36 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white relative border-b border-gray-100 bg-box-pattern text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 border border-primary-100"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Legal Compliance</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight"
          >
            Privacy <span className="text-primary">Policy</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-medium"
          >
            Your trust is our priority. Learn how we protect and manage your academic data with the highest global security standards.
          </motion.p>
        </div>
      </section>

      <section className="py-32 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-10 md:p-20 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-gray-100">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mb-16 border-b border-gray-50 pb-8">Last updated: May 02, 2026</p>
            
            <div className="space-y-16">
              <section className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">1. Information We Collect</h2>
                <p className="text-gray-500 leading-relaxed text-sm font-medium">
                  We collect information you provide directly to us when you create an account, enroll in a course, participate in community forums, or communicate with us. This includes your name, email address, payment information, and academic preferences.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">2. How We Use Your Information</h2>
                <ul className="space-y-5 text-sm text-gray-500 font-black uppercase tracking-widest text-[10px]">
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-primary-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5"><Sparkles className="w-3 h-3 text-primary" /></div>
                    <span>Providing, maintaining, and improving our elite learning services.</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-primary-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5"><Sparkles className="w-3 h-3 text-primary" /></div>
                    <span>Processing transactions and academic record management.</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-primary-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5"><Sparkles className="w-3 h-3 text-primary" /></div>
                    <span>Communicating high-impact updates and academic notices.</span>
                  </li>
                </ul>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">3. Data Security</h2>
                <p className="text-gray-500 leading-relaxed text-sm font-medium">
                  We implement industry-standard 256-bit encryption and strict access controls to protect your data from unauthorized access or disclosure. Our servers are audited monthly for security compliance.
                </p>
              </section>

              <section className="pt-16 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Legal Compliance Office</p>
                  <p className="text-lg font-black text-primary">legal@edupro.academy</p>
                </div>
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 opacity-20">
                   <ShieldCheck className="w-10 h-10 text-gray-400" />
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default PrivacyPage;
