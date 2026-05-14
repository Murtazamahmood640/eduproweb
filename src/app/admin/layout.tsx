"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationCenter } from "@/components/ui/NotificationCenter";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Award,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Zap,
  Brain,
  FileText,
  ShieldCheck,
  User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Teachers", href: "/admin/teachers", icon: Brain },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Course Moderation", href: "/admin/courses/moderation", icon: ShieldCheck },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Results", href: "/admin/results", icon: FileText },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Manage Admins", href: "/admin/manage-admins", icon: ShieldCheck, superAdminOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { dbUser, loading: authLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const isLoginPage = pathname === '/admin/login';
    if (!authLoading && !dbUser && !isLoginPage) {
      router.replace('/admin/login?redirect=' + encodeURIComponent(pathname));
    } else if (!authLoading && dbUser && !isLoginPage) {
       const authorizedRoles = ['admin', 'superadmin', 'employee_admin'];
       if (!authorizedRoles.includes(dbUser.role)) {
          router.replace('/student/dashboard');
       }
    }
  }, [pathname, authLoading, dbUser, router]);

  const handleLogout = async () => {
    try {
      await logout();
      // Use window.location.href for a hard redirect to ensure clean state
      window.location.href = '/admin/login';
    } catch (e) {
      console.error("Signout failed:", e);
    }
  };

  const isLoginPage = pathname === '/admin/login';
  const authorizedRoles = ['admin', 'superadmin', 'employee_admin'];
  const isAuthorized = dbUser && authorizedRoles.includes(dbUser.role);

  // Loading state
  if (authLoading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Brain className="w-10 h-10 text-primary animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Authenticating Architecture...</p>
        </div>
      </div>
    );
  }

  // Not logged in or not authorized
  if (!isLoginPage && (!dbUser || !isAuthorized)) {
    return null;
  }

  // If it's the login page, render children directly without sidebar/header
  if (isLoginPage) return <>{children}</>;

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Top Navigation Bar (Admin Portal) ────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 border-b border-gray-50">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="leading-none">
              <span className="font-black text-xl text-gray-900">Edu<span className="text-primary">Pro</span></span>
              <span className="block text-[8px] font-bold uppercase tracking-[0.3em] text-primary/40 mt-0.5">Admin Panel</span>
            </div>
          </Link>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-lg border border-primary-100">
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">Platform Control</span>
            </div>

            {/* Notifications */}
            <NotificationCenter portal="admin" />

            <div className="h-8 w-[1px] bg-gray-100" />

            {/* Admin chip */}
            <div className="relative">
              <div 
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className={`flex items-center gap-3 pl-2 cursor-pointer transition-all ${profileOpen ? 'opacity-80' : ''}`}
              >
                <div className="hidden sm:block text-right leading-none">
                  <p className="text-xs font-black text-gray-900">{dbUser?.name}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{dbUser?.userId} · Admin</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 border border-primary-200 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md hover:shadow-lg transition-all">
                  {dbUser?.profilePicture ? (
                    <img src={dbUser.profilePicture} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    dbUser?.name?.[0]?.toUpperCase() || 'A'
                  )}
                </div>
              </div>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Administrative Role</p>
                      <p className="text-xs font-black text-gray-900 truncate uppercase">{dbUser?.role}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/admin/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-primary/10 hover:text-primary transition-all">
                        <User className="w-4 h-4" /> System Profile
                      </Link>
                      <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-primary/10 hover:text-primary transition-all">
                        <Settings className="w-4 h-4" /> Platform Config
                      </Link>
                      <div className="h-px bg-gray-50 my-2 mx-2" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all text-left">
                        <LogOut className="w-4 h-4" /> Purge Session
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-xl transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 bg-white"
            >
              <nav className="flex flex-col p-4 space-y-1">
                {navItems
                  .filter(item => !item.superAdminOnly || dbUser?.role === 'superadmin')
                  .map(({ label, href, icon: Icon }) => (
                  <Link key={href} href={href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive(href)
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-bold text-sm">{label}</span>
                    </motion.div>
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation (Desktop) */}
        <nav className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6 space-y-2">
          {navItems
            .filter(item => !item.superAdminOnly || dbUser?.role === 'superadmin')
            .map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ x: 6 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm relative group ${
                    active
                      ? "bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg shadow-primary/30"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                  {active && (
                    <motion.div
                      layoutId="navHighlight"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 40 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}

          {/* Logout */}
          <motion.button
            whileHover={{ x: 6 }}
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm w-full mt-auto"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
