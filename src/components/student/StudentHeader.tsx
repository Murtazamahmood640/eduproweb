'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Search,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

export const StudentHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-2xl shadow-lg shadow-primary/10 border-b border-gray-200/50 py-3'
          : 'bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-xl border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Breadcrumb/Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
              <span>Dashboard</span>
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              <span className="text-primary">Overview</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900">Welcome Back, Murtaza!</h2>
          </motion.div>

          {/* Center - Quick stats */}
          <div className="hidden lg:flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-semibold"
            >
              <Calendar className="w-4 h-4" />
              <span>3 Classes Today</span>
            </motion.div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-primary"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-primary group"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-lg"
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute top-12 right-0 bg-white rounded-xl shadow-xl p-4 w-80 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity border border-gray-200"
              >
                <h3 className="font-bold mb-3 text-gray-900">Notifications</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-lg bg-primary-50 border border-primary-200 text-sm"
                    >
                      <p className="font-semibold text-gray-900">New Assignment Due</p>
                      <p className="text-[12px] text-gray-600 mt-1">Complete your Math quiz before 5 PM</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.button>

            {/* Divider */}
            <div className="h-6 w-[1px] bg-gray-200" />

            {/* Profile Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="hidden sm:flex flex-col items-end">
                  <p className="text-xs font-black text-gray-900">Murtaza</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-primary" />
                    <p className="text-[8px] text-primary font-bold">ELITE</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-primary-300 to-primary rounded-lg flex items-center justify-center font-black text-primary-900 shadow-md group-hover:shadow-lg transition-all">
                  MM
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </motion.button>

              {/* Profile dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={
                  profileOpen
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: -10, pointerEvents: 'none' }
                }
                transition={{ duration: 0.2 }}
                className="absolute top-12 right-0 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden min-w-[240px]"
              >
                <div className="p-4 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900">Murtaza Mahmood</p>
                  <p className="text-[11px] text-gray-500 mt-1">Premium Elite Member</p>
                </div>
                <div className="p-2 space-y-1">
                  <motion.button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                    <Settings className="w-4 h-4" />
                    Settings
                  </motion.button>
                  <Link
                    href="/"
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Exit Portal
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
