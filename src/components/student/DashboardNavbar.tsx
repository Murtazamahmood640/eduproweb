'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Search,
  Brain,
  Award,
  Calendar,
  Settings,
  LogOut,
  Bell,
  User,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationCenter } from '@/components/ui/NotificationCenter';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Courses', href: '/student/courses', icon: BookOpen },
  { label: 'Browse', href: '/student/browse', icon: Search },
  { label: 'Quizzes', href: '/student/quizzes', icon: Brain },
  { label: 'Certificates', href: '/student/certificates', icon: Award },
  { label: 'Schedule', href: '/student/appointments', icon: Calendar },
];

export const DashboardNavbar = () => {
  const pathname = usePathname();
  const { dbUser, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/auth/login';
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const displayName = dbUser?.name || "Student";
  const initials = displayName.split(" ").map((n: any) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main navbar */}
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-lg">E</span>
            </div>
            <div className="hidden sm:block leading-none">
              <span className="font-black text-sm text-gray-900">EduPro</span>
              <span className="block text-[8px] font-bold uppercase tracking-widest text-primary/60 mt-0.5">Portal</span>
            </div>
          </Link>

          {/* Center - Icon Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link key={href} href={href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all group ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span className="text-xs font-bold uppercase tracking-wider hidden lg:inline">{label}</span>
                    {active && (
                      <motion.div
                        layoutId="navUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary-600 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Right - Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <NotificationCenter portal="student" />

            {/* Divider */}
            <div className="h-6 w-px bg-gray-100 hidden sm:block" />

            {/* User Profile Dropdown */}
            <div className="relative">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button 
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-lg transition-all group ${profileOpen ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary-50'}`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center text-white font-black text-xs">
                    {initials}
                  </div>
                  <span className="hidden sm:inline">{displayName.split(' ')[0]}</span>
                  <motion.div
                    animate={{ rotate: profileOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-3.5 h-3.5 opacity-30" />
                  </motion.div>
                </button>
              </motion.div>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="text-xs font-black text-gray-900 truncate">{dbUser?.email || "N/A"}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/student/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-primary/10 hover:text-primary transition-all">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link href="/student/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-primary/10 hover:text-primary transition-all">
                        <Settings className="w-4 h-4" /> Account Settings
                      </Link>
                      <div className="h-px bg-gray-50 my-2 mx-2" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all text-left"
                      >
                        <LogOut className="w-4 h-4" /> Decommission Session
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 bg-white"
            >
              <div className="grid grid-cols-3 gap-2 px-2 py-4">
                {navItems.map(({ label, href, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                        active
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-primary-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[10px] font-bold">{label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
