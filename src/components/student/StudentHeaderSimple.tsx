'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, Search, Settings, LogOut, Menu, X, Sparkles, GraduationCap } from 'lucide-react';

export const StudentHeaderSimple = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-white border-b border-gray-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-black text-gray-900">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm">Edu<span className="text-primary">Pro</span></span>
          </Link>

          {/* Title - Hidden on mobile */}
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold text-gray-900">Dashboard</h2>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            {/* Divider */}
            <div className="h-6 w-[1px] bg-gray-200" />

            {/* User Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center font-black text-white text-xs">
                MM
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-gray-900">Murtaza</span>
            </motion.div>

            {/* Logout */}
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
