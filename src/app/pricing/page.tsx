"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Check, Sparkles, Zap, ShieldCheck, Globe, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Foundation",
    price: "PKR 12,000",
    period: "/ per course",
    desc: "Perfect for single subject mastery.",
    features: [
      "Lifetime course access",
      "All video modules",
      "Practice worksheets",
      "Community forum access",
      "Digital certificate",
    ],
    cta: "Enroll Now",
    popular: false,
  },
  {
    name: "Mastery Plus",
    price: "PKR 35,000",
    period: "/ 3 subjects",
    desc: "Our most popular choice for O/A Level prep.",
    features: [
      "Everything in Foundation",
      "Live monthly Q&A sessions",
      "3 Mock Examinations",
      "Paper marking by experts",
      "Physical certificate delivery",
    ],
    cta: "Select Bundle",
    popular: true,
  },
  {
    name: "Elite Academy",
    price: "PKR 75,000",
    period: "/ full level",
    desc: "Complete academic support for the year.",
    features: [
      "Everything in Mastery Plus",
      "Unlimited 1-on-1 sessions",
      "University application help",
      "Scholarship guidance",
      "Career counseling",
    ],
    cta: "Join Elite",
    popular: false,
  },
];

const PricingPage = () => {
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
            <Zap className="w-4 h-4" />
            <span>Investment in Excellence</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight"
          >
            Transparent <br /><span className="text-primary">Scholarships</span> & Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-medium"
          >
            Invest in world-class education. We offer flexible plans and need-based scholarships for high-achieving students globally.
          </motion.p>
        </div>
      </section>

      {/* ── Pricing Grid ── */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 rounded-[2.5rem] border flex flex-col h-full relative transition-all group hover:shadow-2xl ${
                  plan.popular 
                    ? "border-primary shadow-xl shadow-primary/5 bg-white scale-105 z-10" 
                    : "border-gray-100 bg-gray-50 hover:bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                    Most Popular Choice
                  </div>
                )}
                <div className="mb-10">
                  <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{plan.name}</h3>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">{plan.desc}</p>
                </div>
                <div className="mb-10 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-gray-900 tracking-tight">{plan.price}</span>
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{plan.period}</span>
                </div>
                <div className="space-y-5 flex-1 mb-12">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-4 text-xs font-bold text-gray-600">
                      <Check className={`w-5 h-5 shrink-0 p-1 rounded-full ${plan.popular ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`} />
                      <span className="leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link 
                  href="/auth/signup"
                  className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all shadow-xl ${
                    plan.popular 
                      ? "bg-primary text-white shadow-primary/20 hover:bg-primary-600 active:scale-95" 
                      : "bg-white border-2 border-gray-100 text-gray-900 hover:border-primary/20 hover:text-primary active:scale-95"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* FAQ link banner */}
          <div className="mt-24 p-10 rounded-[2.5rem] border border-gray-100 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-gray-50">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-900 tracking-tight">Need a custom scholarship?</h4>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">We offer up to 100% financial aid for verified merit students.</p>
              </div>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-gray-900 border-2 border-gray-100 text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-primary hover:text-primary transition-all shadow-sm group">
              Apply for Aid <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default PricingPage;
