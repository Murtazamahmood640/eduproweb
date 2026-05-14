'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Search,
  Brain,
  Award,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Home,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', href: '/student/courses', icon: BookOpen },
  { label: 'Explore', href: '/student/browse', icon: Search },
  { label: 'Quizzes', href: '/student/quizzes', icon: Brain },
  { label: 'Certificates', href: '/student/certificates', icon: Award },
  { label: 'Schedule', href: '/student/appointments', icon: Calendar },
];

export const StudentSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActive = (href: string) =>
    pathname === href || (href !== '/student/dashboard' && pathname.startsWith(href));

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-br from-primary to-primary-600 text-white rounded-full shadow-2xl shadow-primary/40"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed lg:relative inset-y-0 left-0 z-30 w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-r border-gray-800/50 overflow-y-auto flex flex-col ${
              !isOpen ? 'hidden lg:flex' : ''
            }`}
          >
            {/* Sidebar Header */}
            <div className="sticky top-0 z-20 p-6 bg-gradient-to-b from-gray-900/95 to-transparent backdrop-blur-md border-b border-gray-800/30">
              <Link href="/student/dashboard" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.05 }}
                  className="w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/40 group-hover:shadow-xl"
                >
                  <span className="text-white font-black text-lg">E</span>
                </motion.div>
                <div>
                  <h1 className="text-white font-black text-lg">EduPro</h1>
                  <p className="text-primary-300 text-[10px] font-semibold">Student Portal</p>
                </div>
              </Link>
            </div>

            {/* User Profile Card */}
            <div className="p-4 mx-4 mt-6 bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 rounded-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-300 to-primary rounded-full flex items-center justify-center font-black text-primary-900 text-sm shadow-lg">
                  MM
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-sm truncate">Murtaza Mahmood</p>
                  <p className="text-primary-200 text-[10px] font-semibold flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3" />
                    Premium Elite
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-3 py-2 text-[10px] font-black text-white uppercase tracking-widest bg-primary hover:bg-primary-600 rounded-lg transition-all"
              >
                View Profile
              </motion.button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 mt-6">
              {navItems.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <motion.div
                    key={href}
                    onMouseEnter={() => setHoveredItem(href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all group overflow-hidden ${
                        active
                          ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg shadow-primary/40'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {/* Background shine effect */}
                      {hoveredItem === href && !active && (
                        <motion.div
                          layoutId="sidebar-shine"
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          initial={{ x: -300 }}
                          animate={{ x: 300 }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}

                      <Icon
                        className={`w-5 h-5 flex-shrink-0 transition-transform ${
                          active ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                        }`}
                      />
                      <span className="relative z-10">{label}</span>

                      {active && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute right-4"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 space-y-2 border-t border-gray-800/30">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all font-semibold text-sm"
              >
                <Settings className="w-5 h-5" />
                Settings
              </motion.button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all font-semibold text-sm"
                >
                  <Home className="w-5 h-5" />
                  Back to Website
                </Link>
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};
