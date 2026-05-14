'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ParallaxSection, StaggerChild } from '@/components/animations/ParallaxSection';
import { ScrollCounter } from '@/components/animations/ScrollCounter';
import { ScrollText } from '@/components/animations/ScrollText';
import { CheckCircle2, Zap, Award, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: <CheckCircle2 className="w-8 h-8" />,
    title: 'Expert Instructors',
    desc: 'Learn from top educators with years of experience'
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Interactive Learning',
    desc: 'Engage with live classes and real-time feedback'
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Certifications',
    desc: 'Earn recognized credentials upon completion'
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Track Progress',
    desc: 'Monitor your growth with detailed analytics'
  }
];

export const ParallaxShowcase = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-white to-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section with Parallax */}
        <div className="mb-24">
          <ParallaxSection offset={100}>
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-5xl font-black text-gray-900 mb-6"
              >
                Why Students Choose EduPro
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Join thousands of learners achieving their dreams with world-class education
              </motion.p>
            </div>
          </ParallaxSection>
        </div>

        {/* Features Grid with Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {features.map((feature, i) => (
            <StaggerChild key={i} index={i}>
              <motion.div
                className="p-8 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm hover:border-primary/20 hover:bg-white transition-all group"
                whileHover={{ y: -8 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            </StaggerChild>
          ))}
        </div>

        {/* Stats Section with Parallax */}
        <ParallaxSection offset={-50} direction="down">
          <div className="bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl p-12 border border-primary/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="text-4xl font-black text-primary mb-2"
                >
                  <ScrollCounter target={50000} suffix="+" />
                </motion.div>
                <p className="text-gray-600 font-semibold">Active Students</p>
              </div>
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl font-black text-primary mb-2"
                >
                  <ScrollCounter target={1200} suffix="+" />
                </motion.div>
                <p className="text-gray-600 font-semibold">Premium Courses</p>
              </div>
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-black text-primary mb-2"
                >
                  <ScrollCounter target={98} suffix="%" />
                </motion.div>
                <p className="text-gray-600 font-semibold">Success Rate</p>
              </div>
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-black text-primary mb-2"
                >
                  <ScrollCounter target={4.9} suffix="" />
                </motion.div>
                <p className="text-gray-600 font-semibold">Avg Rating</p>
              </div>
            </div>
          </div>
        </ParallaxSection>
      </div>
    </section>
  );
};
