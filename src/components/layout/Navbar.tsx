"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  GraduationCap, Menu, X, ArrowRight, 
  Search, Sparkles, User, LogOut, LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, dbUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Successfully decommissioned session.");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
          scrolled
            ? "bg-white/90 backdrop-blur-2xl border-gray-100 py-3 shadow-[0_8px_40px_rgba(0,35,102,0.1)]"
            : "bg-gradient-to-b from-white/50 to-transparent py-6 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-3 group relative z-10">
              <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform duration-500">
                <GraduationCap className="text-white w-7 h-7" />
              </div>
              <div className="leading-none">
                <span className="font-black text-2xl text-gray-900 tracking-tighter">
                  Edu<span className="text-primary">Pro</span>
                </span>
                <span className="block text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 mt-0.5">Academy</span>
              </div>
            </Link>

            {/* ── Desktop Navigation ── */}
            <div className="hidden lg:flex items-center gap-1">
              <Link href="/" className="px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-primary transition-all rounded-xl hover:bg-primary-50">Home</Link>
              <Link href="/courses" className="px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-primary transition-all rounded-xl hover:bg-primary-50">Courses</Link>
              <Link href="/trainers" className="px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-primary transition-all rounded-xl hover:bg-primary-50">Trainers</Link>
              <Link href="/about" className="px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-primary transition-all rounded-xl hover:bg-primary-50">About Us</Link>
              <Link href="/contact" className="px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-primary transition-all rounded-xl hover:bg-primary-50">Contact</Link>
            </div>

            {/* ── Utilities ── */}
            <div className="hidden lg:flex items-center gap-6">
              <button onClick={() => setShowSearch(true)} className="p-2.5 text-gray-400 hover:text-primary transition-colors hover:bg-primary-50 rounded-xl"><Search className="w-5 h-5" /></button>
              <div className="h-8 w-[1px] bg-gray-200" />
              
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href={`/${dbUser?.role || 'student'}/dashboard`} className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/20 transition-all">
                    <LayoutDashboard className="w-4 h-4" /> Command Center
                  </Link>
                  <button onClick={handleLogout} className="p-2.5 text-gray-400 hover:text-rose-500 transition-colors hover:bg-rose-50 rounded-xl">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/auth/login" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 hover:text-primary">Sign In</Link>
                  <Link href="/auth/signup" className="bg-primary text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-600 transition-all active:scale-95">Get Started</Link>
                </div>
              )}
            </div>

            {/* ── Mobile Toggle ── */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden bg-white border-t border-gray-100 shadow-2xl"
            >
              <div className="p-8 space-y-6">
                <Link href="/" onClick={() => setIsOpen(false)} className="block text-sm font-black uppercase tracking-widest text-gray-900">Home</Link>
                <Link href="/courses" onClick={() => setIsOpen(false)} className="block text-sm font-black uppercase tracking-widest text-gray-900">Courses</Link>
                <Link href="/trainers" onClick={() => setIsOpen(false)} className="block text-sm font-black uppercase tracking-widest text-gray-900">Trainers</Link>
                <Link href="/about" onClick={() => setIsOpen(false)} className="block text-sm font-black uppercase tracking-widest text-gray-900">About Us</Link>
                <Link href="/contact" onClick={() => setIsOpen(false)} className="block text-sm font-black uppercase tracking-widest text-gray-900">Contact</Link>
                
                {user ? (
                  <div className="pt-8 border-t border-gray-50 space-y-4">
                    <Link href={`/${dbUser?.role || 'student'}/dashboard`} onClick={() => setIsOpen(false)} className="flex items-center justify-center py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Dashboard</Link>
                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center justify-center py-4 border border-rose-100 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Sign Out</button>
                  </div>
                ) : (
                  <div className="pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center py-4 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest">Login</Link>
                    <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="flex items-center justify-center py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Join Free</Link>
                  </div>
                )}
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* ── Search Overlay ── */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center px-6"
          >
            <button onClick={() => setShowSearch(false)} className="absolute top-12 right-12 p-4 bg-gray-50 rounded-2xl hover:text-primary transition-all shadow-sm"><X className="w-8 h-8" /></button>
            <div className="w-full max-w-4xl text-center">
              <Search className="w-20 h-20 text-primary mx-auto mb-12 opacity-10" />
              <input 
                autoFocus
                placeholder="Search elite academy courses..."
                className="w-full text-3xl md:text-6xl font-black text-gray-900 placeholder:text-gray-100 bg-transparent border-b-4 border-gray-50 focus:outline-none focus:border-primary transition-all pb-6 tracking-tight"
              />
              <div className="mt-16 flex flex-wrap justify-center gap-4">
                {["Math O-Level", "German A1", "Python Mastery", "Digital Marketing"].map(tag => (
                  <button key={tag} className="px-8 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-primary hover:border-primary hover:shadow-xl transition-all">{tag}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
    </>
  );
};

export default Navbar;
