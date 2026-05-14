'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Search,
  BookOpen,
  Award,
  Users,
  Zap,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

const NavbarV2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const courseCategories = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: 'Languages',
      desc: 'Learn new languages',
      courses: ['German', 'Spanish', 'French', 'Arabic'],
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Technology',
      desc: 'Master coding & development',
      courses: ['Python', 'JavaScript', 'Web Dev', 'Data Science'],
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: 'Professional',
      desc: 'Career advancement courses',
      courses: ['Marketing', 'Business', 'Finance', 'Project Mgmt'],
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Academic',
      desc: 'School & exam preparation',
      courses: ['Math', 'Science', 'English', 'O-Levels'],
    },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -120 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-2xl shadow-2xl shadow-primary/10 border-b border-gray-200/50 py-3'
            : 'bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-xl border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                  <span className="text-white font-black text-lg">E</span>
                </div>
                <span className="text-xl font-black text-gray-900 hidden sm:block group-hover:text-primary transition-colors">
                  EduPro
                </span>
              </Link>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Courses Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setActiveMenu('courses')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <motion.button
                  className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-primary transition-colors flex items-center gap-1 group/btn"
                  whileHover={{ color: '#0023ff' }}
                >
                  Courses
                  <ChevronDown className="w-4 h-4 group-hover/btn:rotate-180 transition-transform" />
                </motion.button>

                {/* Megamenu */}
                <AnimatePresence>
                  {activeMenu === 'courses' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 pt-4"
                    >
                      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-8 w-[900px] grid grid-cols-4 gap-6">
                        {courseCategories.map((cat, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group/cat cursor-pointer"
                          >
                            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg group-hover/cat:bg-primary/5 transition-colors">
                              <div className="p-2 bg-primary-50 rounded-lg text-primary group-hover/cat:bg-primary group-hover/cat:text-white transition-all">
                                {cat.icon}
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 text-sm">
                                  {cat.title}
                                </h3>
                                <p className="text-[11px] text-gray-500">
                                  {cat.desc}
                                </p>
                              </div>
                            </div>
                            <ul className="space-y-2 pl-3 border-l-2 border-transparent group-hover/cat:border-primary transition-colors">
                              {cat.courses.map((course) => (
                                <li key={course}>
                                  <Link
                                    href={`/courses?search=${course.toLowerCase()}`}
                                    className="text-xs text-gray-600 hover:text-primary font-semibold transition-colors inline-flex items-center gap-1 group/link"
                                  >
                                    {course}
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other nav items */}
              {[
                { label: 'Trainers', href: '/trainers' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <motion.div key={item.label} whileHover={{ scale: 1.05 }}>
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 hover:text-primary"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Auth buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-primary transition-colors"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/auth/signup"
                    className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-600 rounded-lg hover:shadow-lg hover:shadow-primary/40 transition-all"
                  >
                    Join Free
                  </Link>
                </motion.div>
              </div>

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 flex items-center gap-2"
              >
                <div className="flex-1 relative">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search courses, trainers, languages..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="px-4 py-4 border-t border-gray-200 bg-gray-50 space-y-3">
                {['Courses', 'Trainers', 'About', 'Contact'].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="block px-4 py-2 text-sm font-bold text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-3 space-y-2 border-t border-gray-200">
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Join Free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-[72px]" />
    </>
  );
};

export default NavbarV2;
