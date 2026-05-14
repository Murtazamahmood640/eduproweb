"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  ChevronRight,
  PlusCircle,
  Eye,
  Bell,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Zap,
  RefreshCw,
  AlertCircle,
  PlayCircle,
  ShieldCheck as Shield
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import OnboardingTour from "@/components/ui/OnboardingTour";

const teacherSteps = [
  {
    title: "Faculty Dashboard",
    description: "Welcome to your command center. Monitor student growth, revenue trends, and course performance in real-time.",
    icon: <Zap className="w-10 h-10" />,
    color: "from-primary to-primary-600"
  },
  {
    title: "Content Launchpad",
    description: "Create and manage elite curricula. Once approved by the Super Admin, your content reaches global learners.",
    icon: <BookOpen className="w-10 h-10" />,
    color: "from-emerald-500 to-teal-600"
  },
  {
    title: "Academic Oversight",
    description: "Manage your student directory, review submissions, and engage with learners through structured sessions.",
    icon: <Users className="w-10 h-10" />,
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "Global Profile",
    description: "Your faculty profile is your professional brand. A high-quality intro video is mandatory to unlock full platform features.",
    icon: <PlayCircle className="w-10 h-10" />,
    color: "from-violet-500 to-purple-600"
  }
];

export default function TeacherDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes, coursesRes] = await Promise.all([
          api.get("/users/profile"),
          api.get("/teacher/stats"),
          api.get("/teacher/courses")
        ]);
        setProfile(profileRes.data);
        setStatsData(statsRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        console.error("Error fetching teacher data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Total Students", value: statsData?.totalStudents || "0",   icon: Users,      change: "+0% Growth", color: "text-primary bg-primary-50" },
    { label: "Active Courses", value: statsData?.activeCourses || "0",       icon: BookOpen,   change: "Up to date",        color: "text-primary bg-primary-50" },
    { label: "Total Revenue",  value: statsData?.totalRevenue || "PKR 0",icon: DollarSign, change: "Earnings", color: "text-primary bg-primary-50" },
    { label: "Avg. Rating",    value: statsData?.avgRating || "N/A",   icon: Star,       change: "Performance", color: "text-primary bg-primary-50" },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <RefreshCw className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Syncing Portfolio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* ── Welcome Banner (Elite Theme) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-primary/10 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-primary/5"
      >
        <div className="absolute inset-0 bg-box-pattern opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[40rem] h-full bg-primary/5 blur-[120px] rounded-full translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary-100">
              <Sparkles className="w-4 h-4" />
              <span>Academy {profile?.role === 'superadmin' ? 'Super Admin' : 'Senior Instructor'}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-none">
              The platform is <br /><span className="text-primary text-5xl">Evolving, {profile?.name?.split(' ')[0] || 'Teacher'}</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg mb-10 leading-relaxed font-medium">
              Your academic footprint is expanding. Your instructor ID is <span className="text-primary font-black">{profile?.userId}</span>. Manage your courses and students below.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/teacher/courses/create" className="inline-flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary/20 active:scale-95">
                <PlusCircle className="w-5 h-5" /> Launch Course
              </Link>
              <Link href="/teacher/appointments" className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 border border-gray-100 px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                <Bell className="w-5 h-5 text-primary" /> Session Hub
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col items-center justify-center w-72 h-72 bg-white rounded-[2.5rem] border border-primary/10 relative group overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-primary/5 group-hover:scale-150 transition-transform duration-1000" />
            <TrendingUp className="w-24 h-24 text-primary relative z-10 mb-2 opacity-20" />
            <div className="text-center relative z-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Impact Radius</p>
              <p className="text-3xl font-black text-primary">+24.8%</p>
            </div>
            <div className="absolute top-6 right-6">
               <ArrowUpRight className="w-6 h-6 text-primary opacity-30" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Performance Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const gradients = [
            "from-primary to-primary-600",
            "from-emerald-500 to-teal-600",
            "from-amber-500 to-orange-600",
            "from-violet-500 to-purple-600"
          ];
          const gradient = gradients[i % gradients.length];
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.04 }}
              className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-8 border border-white/20 hover:shadow-2xl transition-all group overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg bg-white/20 group-hover:bg-white/30 group-hover:scale-110 transition-all">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-4xl font-black text-white tracking-tight mb-1">{stat.value}</p>
                <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-4">{stat.label}</p>
                <div className="flex items-center gap-2 text-[9px] font-black text-white uppercase tracking-[0.2em] bg-white/20 w-fit px-3 py-1.5 rounded-lg border border-white/30">
                  <Zap className="w-3 h-3 fill-white" />
                  {stat.change}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Active Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between ml-1">
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Course Portfolio</h2>
            <Link href="/teacher/courses" className="text-[10px] font-black text-primary uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2">
              Portfolio View <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {courses.length > 0 ? (
              courses.map((course, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 hover:border-primary/20 hover:shadow-2xl transition-all group"
                >
                  <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-primary transition-all group-hover:rotate-6">
                    <BookOpen className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <p className="font-black text-gray-900 text-base truncate tracking-tight">{course.title}</p>
                      <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-md border ${
                        course.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                        course.status === "Rejected" ? "bg-rose-50 text-rose-600 border-rose-100" :
                        "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        {course.status}
                      </span>
                    </div>
                    {course.status === "Rejected" && course.rejectionReason && (
                      <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-rose-600 leading-relaxed uppercase tracking-tight">
                          Rejection Reason: {course.rejectionReason}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Users className="w-4 h-4 text-primary opacity-30" /> {course.students} Learners</span>
                      {course.rating > 0 && <span className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-400 fill-current" /> {course.rating}</span>}
                      <span className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary opacity-30" /> {course.revenue}</span>
                    </div>
                  </div>
                  <Link href={`/teacher/courses/${course._id}`} className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-xl transition-all group-hover:shadow-lg">
                    <Eye className="w-6 h-6" />
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No courses launched yet</p>
                <Link href="/teacher/courses/create" className="text-primary font-black text-[10px] uppercase tracking-widest mt-4 inline-block hover:underline">
                  Launch your first course
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-10">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-xl shadow-primary/5">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10">Recent Enrollment</h3>
            <div className="space-y-6 text-center py-10">
              <Users className="w-10 h-10 text-gray-100 mx-auto mb-4" />
              <p className="text-gray-300 font-bold text-[10px] uppercase tracking-widest">No recent activity</p>
            </div>
            <Link href="/teacher/students" className="mt-12 w-full inline-flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all border border-gray-100">
              Student Directory <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-box-pattern opacity-[0.1]" />
            <h4 className="text-sm font-black mb-4 relative z-10 uppercase tracking-widest">Expert Support</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-bold relative z-10 mb-8">
              Need help structuring your modules? Our senior curriculum designers are available for consultation.
            </p>
            <button className="relative z-10 w-full py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-600 transition-all">
              Request Mentorship
            </button>
          </div>
        </div>
      </div>

      <OnboardingTour
        tourKey="teacher_dashboard"
        onComplete={() => console.log("Teacher tour finished")}
        steps={teacherSteps}
      />
    </div>
  );
}
