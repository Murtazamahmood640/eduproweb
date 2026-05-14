"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, TrendingUp, CreditCard, Award, BarChart3, Activity, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import OnboardingTour from "@/components/ui/OnboardingTour";
import { ShieldCheck, Brain, Zap } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [topCourses, setTopCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/courses")
        ]);
        setStats(statsRes.data);
        setTopCourses(coursesRes.data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 tracking-widest">Synthesizing Platform Intelligence...</p>
    </div>
  );

  const statsCards = [
    { icon: Users, label: "Total Students", value: stats?.totalStudents || 0, sub: "Active Enrollments", color: "from-primary to-primary-600" },
    { icon: Users, label: "Total Teachers", value: stats?.totalTeachers || 0, sub: "Expert Instructors", color: "from-emerald-500 to-teal-600" },
    { icon: BookOpen, label: "Total Courses", value: stats?.totalCourses || 0, sub: "Live Architecture", color: "from-amber-500 to-orange-600" },
    { icon: TrendingUp, label: "Revenue", value: `PKR ${(stats?.totalRevenue || 0).toLocaleString()}`, sub: "Gross Earnings", color: "from-violet-500 to-purple-600" },
  ];

  const recentActivities = [
    { type: "enrollment", user: "Real-time sync", action: "active", course: "Live DB", time: "just now" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-gray-900 mb-2">Admin Intelligence</h1>
        <p className="text-gray-500 text-lg">Real-time platform oversight and database control.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`relative bg-gradient-to-br ${stat.color} rounded-2xl p-6 border border-white/20 shadow-xl transition-all group overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-white/20 mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-4xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">{stat.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                <Activity className="w-5 h-5" />
              </div>
              System Activity
            </h2>
          </div>

          <div className="space-y-4">
             <div className="p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Activity Stream Connected to Real DB</p>
             </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl transition-all"
        >
          <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                <AlertCircle className="w-5 h-5" />
            </div>
            Command Center
          </h2>

          <div className="space-y-3">
            {[
              { label: "Manage Students", href: "/admin/students" },
              { label: "Verify Teachers", href: "/admin/teachers" },
              { label: "Review Courses", href: "/admin/courses" },
              { label: "Platform Settings", href: "/admin/settings" },
            ].map((item, i) => (
              <Link key={i} href={item.href}>
                <motion.div
                    whileHover={{ x: 6 }}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-xl hover:border-primary hover:text-primary transition-all mb-3 cursor-pointer"
                >
                    {item.label}
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Course Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl transition-all"
      >
        <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
            <BarChart3 className="w-5 h-5" />
          </div>
          Live Curriculum Performance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topCourses.map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="p-6 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-black text-gray-900 mb-1">{course.title}</p>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">{course.instructor?.name || 'EduPro Teacher'}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900 text-lg">PKR {course.price.toLocaleString()}</p>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Active Architecture</p>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <OnboardingTour
        tourKey="admin_dashboard"
        onComplete={() => console.log("Admin tour finished")}
        steps={[
          {
            title: "Welcome to Command Center",
            description: "This is your central hub for platform oversight. Monitor real-time growth and system health at a glance.",
            icon: <Zap className="w-12 h-12" />,
            color: "from-primary to-primary-600"
          },
          {
            title: "Faculty Control",
            description: "Manage your professional instructors. You can onboard new faculty, verify credentials, and monitor performance.",
            icon: <Brain className="w-12 h-12" />,
            color: "from-emerald-500 to-teal-600",
            href: "/admin/teachers"
          },
          {
            title: "Curriculum Moderation",
            description: "Ensure quality standards by reviewing and approving new course submissions from teachers.",
            icon: <ShieldCheck className="w-12 h-12" />,
            color: "from-amber-500 to-orange-600",
            href: "/admin/courses/moderation"
          },
          {
            title: "Financial Analytics",
            description: "Track gross revenue and payment distributions across the entire academy ecosystem.",
            icon: <CreditCard className="w-12 h-12" />,
            color: "from-violet-500 to-purple-600",
            href: "/admin/analytics"
          }
        ]}
      />
    </div>
  );
}
