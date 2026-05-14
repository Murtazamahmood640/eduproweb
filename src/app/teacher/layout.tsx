"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationCenter } from "@/components/ui/NotificationCenter";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Brain,
  Users,
  Calendar,
  User,
  Bell,
  LogOut,
  Settings,
  Menu,
  X,
  BarChart3,
  Sparkles,
  PlayCircle,
  Zap,
  ShieldCheck,
  Camera,
  Video
} from "lucide-react";
import OnboardingTour from "@/components/ui/OnboardingTour";

const teacherSteps = [
  {
    title: "Welcome to EduPro",
    description: "Your elite teaching journey begins here. This dashboard gives you a bird's eye view of your academic impact.",
    icon: <Zap className="w-10 h-10" />,
    color: "from-primary to-primary-600",
    href: "/teacher/dashboard"
  },
  {
    title: "Establish Your Brand",
    description: "Your faculty profile is your professional calling card. A high-quality bio and intro video are mandatory to unlock all features.",
    icon: <PlayCircle className="w-10 h-10" />,
    color: "from-violet-500 to-purple-600",
    href: "/teacher/profile"
  },
  {
    title: "Publish Curricula",
    description: "Launch your courses here. Once verified by our Super Admins, your content will be accessible to global learners.",
    icon: <BookOpen className="w-10 h-10" />,
    color: "from-emerald-500 to-teal-600",
    href: "/teacher/courses"
  },
  {
    title: "Manage Students",
    description: "Track enrollments, manage your student directory, and schedule 1-on-1 sessions through your student hub.",
    icon: <Users className="w-10 h-10" />,
    color: "from-amber-500 to-orange-600",
    href: "/teacher/students"
  }
];

const navItems = [
  { label: "Overview",    href: "/teacher/dashboard",    icon: LayoutDashboard },
  { label: "Courses",     href: "/teacher/courses",      icon: BookOpen },
  { label: "Examinations", href: "/teacher/quizzes",      icon: Brain },
  { label: "Academics",   href: "/teacher/students",     icon: Users },
  { label: "Schedule",    href: "/teacher/appointments", icon: Calendar },
  { label: "Insights",    href: "/teacher/analytics",    icon: BarChart3 },
];
export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { dbUser, loading: authLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !dbUser) {
      router.replace("/auth/login");
    } else if (!authLoading && dbUser && dbUser.role !== 'teacher') {
      // Role enforcement
      if (dbUser.role === 'student') {
        router.replace("/student/dashboard");
      } else if (['admin', 'superadmin', 'employee_admin'].includes(dbUser.role)) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [dbUser, authLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/auth/login";
    } catch (e) {
      console.error("Signout failed:", e);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] mb-1">Authenticating Faculty</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Verifying Academic Standing...</p>
          </div>
        </div>
      </div>
    );
  }

  // Final authorization guard
  if (!dbUser || dbUser.role !== 'teacher') return null;

  const displayName = dbUser?.name || "Teacher";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const userId = dbUser?.userId || "—";

  const isActive = (href: string) =>
    pathname === href || (href !== "/teacher/dashboard" && pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col bg-box-pattern">

      {/* ── Top Navigation Bar (Teacher Portal) ────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        {/* Brand row */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 border-b border-gray-50">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="leading-none">
              <span className="font-black text-xl text-gray-900">Edu<span className="text-primary">Pro</span></span>
              <span className="block text-[8px] font-bold uppercase tracking-[0.3em] text-primary/40 mt-0.5">Faculty Portal</span>
            </div>
          </Link>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-lg border border-primary-100">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">Academic Excellence</span>
            </div>

            <NotificationCenter portal="teacher" />

            <div className="h-8 w-[1px] bg-gray-100" />

            {/* Teacher chip */}
            <div className="relative">
              <div 
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className={`flex items-center gap-3 pl-2 cursor-pointer transition-all ${profileOpen ? 'opacity-80' : ''}`}
              >
                <div className="hidden sm:block text-right leading-none">
                  <p className="text-xs font-black text-gray-900">{displayName}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{userId} · Teacher</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center font-black text-primary text-sm shadow-sm hover:border-primary transition-all">
                  {initials}
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
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Authenticated as</p>
                      <p className="text-xs font-black text-gray-900 truncate">{dbUser?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/teacher/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-primary/10 hover:text-primary transition-all">
                        <User className="w-4 h-4" /> Faculty Profile
                      </Link>
                      <Link href="/teacher/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-primary/10 hover:text-primary transition-all">
                        <Settings className="w-4 h-4" /> Account Settings
                      </Link>
                      <div className="h-px bg-gray-50 my-2 mx-2" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all text-left">
                        <LogOut className="w-4 h-4" /> Terminate Session
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Nav links row — Center Aligned Desktop */}
        <nav className="hidden lg:flex items-center justify-center gap-1 px-6 h-14">
          <div className="flex items-center gap-1">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    active
                      ? "bg-primary text-white shadow-xl shadow-primary/20"
                      : "text-gray-400 hover:text-primary hover:bg-primary-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? "text-white" : "text-gray-400 group-hover:text-primary"}`} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Absolute positioned actions to keep links centered */}
          <div className="absolute right-8 flex items-center gap-3">
            <Link
              href="/teacher/courses/create"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary border border-primary-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Create
            </Link>
            <div className="h-8 w-[1px] bg-gray-100" />
            <button
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </nav>

        {/* Mobile nav dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 grid grid-cols-2 gap-2"
            >
              {navItems.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      active
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:text-primary hover:bg-primary-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {label}
                  </Link>
                );
              })}
              <Link
                href="/teacher/courses/create"
                onClick={() => setMobileOpen(false)}
                className="col-span-2 flex items-center justify-center gap-3 py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 mt-2"
              >
                <PlusCircle className="w-5 h-5" />
                Create New Content
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ── Page Content ───────────────────────────────── */}
      <main className="flex-1 overflow-y-auto relative">
        <OnboardingTour 
          steps={teacherSteps} 
          tourKey="teacher_v2" 
          onComplete={() => console.log("Teacher Tour Finished")} 
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </div>

        {/* Profile Completion Overlay */}
        <AnimatePresence>
          {dbUser?.role === 'teacher' && !dbUser?.isProfileComplete && pathname !== "/teacher/profile" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-lg w-full bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-12 text-center"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">Verification Checklist</h2>
                <p className="text-gray-500 font-medium mb-6 leading-relaxed">
                    To activate your faculty credentials, please complete the mandatory academic profile requirements.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-10">
                   <div className={`p-6 rounded-2xl border ${dbUser?.profilePicture ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 overflow-hidden ${dbUser?.profilePicture ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                         {dbUser?.profilePicture ? (
                            <img src={dbUser.profilePicture} className="w-full h-full object-cover" alt="Verified" />
                         ) : (
                            <Camera className="w-5 h-5" />
                         )}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-1">Identity Image</p>
                      <p className={`text-[9px] font-bold uppercase ${dbUser?.profilePicture ? 'text-emerald-600' : 'text-gray-400'}`}>
                         {dbUser?.profilePicture ? 'Verified' : 'Pending'}
                      </p>
                   </div>
                   <div className={`p-6 rounded-2xl border ${dbUser?.introVideo ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${dbUser?.introVideo ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                         <Video className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-1">Intro Video</p>
                      <p className={`text-[9px] font-bold uppercase ${dbUser?.introVideo ? 'text-emerald-600' : 'text-gray-400'}`}>
                         {dbUser?.introVideo ? 'Verified' : 'Pending'}
                      </p>
                   </div>
                </div>

                <button 
                    onClick={() => router.push("/teacher/profile")}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-600 transition-all active:scale-95"
                >
                    {dbUser?.profilePicture ? 'Complete Missing Steps' : 'Start Verification'} <Sparkles className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors"
                >
                    Sign Out
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
