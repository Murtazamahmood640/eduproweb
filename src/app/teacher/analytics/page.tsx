"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, Users, BookOpen, Star, 
  BarChart3, Activity, Sparkles,
  ArrowUpRight, Zap, Target,
  Globe, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function TeacherAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, coursesRes] = await Promise.all([
        api.get("/teacher/stats"),
        api.get("/teacher/courses"),
      ]);
      setStats(statsRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      toast.error("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Computing Insights...</p>
    </div>
  );

  const totalRevenue = courses.reduce((sum, c) => sum + ((c.enrollmentCount || 0) * (c.price || 0)), 0);
  const avgRating = courses.length
    ? (courses.reduce((s, c) => s + (c.rating || 0), 0) / courses.length).toFixed(1)
    : "0.0";
  const completionRate = stats?.completionRate ?? 0;

  const metricCards = [
    { label: "Gross Revenue", value: `PKR ${totalRevenue.toLocaleString()}`, trend: "+Live", icon: Zap, sub: "Based on Enrollments" },
    { label: "Active Students", value: (stats?.totalStudents || 0).toLocaleString(), trend: "+Live", icon: Users, sub: "Enrolled Learners" },
    { label: "Total Courses", value: (stats?.totalCourses || 0).toString(), trend: "+Live", icon: BookOpen, sub: "Course Portfolio" },
    { label: "Avg Rating", value: `${avgRating}/5.0`, trend: "+Live", icon: Star, sub: "Student Feedback" },
  ];

  return (
    <div className="space-y-10">
      {/* ── Elite Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-primary-100">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Academic Intelligence</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase tracking-[0.1em]">Insights & Velocity</h1>
          <p className="text-gray-400 text-[11px] font-bold mt-1 uppercase tracking-widest">Real-time performance metrics from live database</p>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-600 transition-all"
        >
          Refresh Data
        </button>
      </div>

      {/* ── Metric Matrix ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl hover:border-primary/20 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-box-pattern opacity-[0.02] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center border border-primary-100 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                  <ArrowUpRight className="w-3 h-3" /> {stat.trend}
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 tracking-tight mb-1">{stat.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{stat.label}</p>
              <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em] bg-primary-50 w-fit px-3 py-1.5 rounded-lg border border-primary-100">
                {stat.sub}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Course Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Course Performance Matrix</h2>
          </div>
          <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-xl shadow-primary/5">
            {courses.length === 0 ? (
              <div className="p-12 text-center">
                <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No courses yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Course</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Students</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating</th>
                      <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {courses.map((course, i) => (
                      <tr key={i} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{course.title}</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{course.category || "Uncategorized"}</p>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-gray-600">{(course.enrollmentCount || 0).toLocaleString()} Learners</td>
                        <td className="px-8 py-6 text-sm font-black text-gray-900">PKR {((course.enrollmentCount || 0) * (course.price || 0)).toLocaleString()}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                            <span className="text-sm font-black text-gray-900">{course.rating || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg ${
                            course.status === "approved" ? "bg-primary text-white shadow-lg shadow-primary/20" :
                            course.status === "rejected" ? "bg-rose-100 text-rose-600" :
                            "bg-amber-100 text-amber-600"
                          }`}>
                            <Target className="w-3 h-3" /> {course.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Velocity Sidebar */}
        <div className="space-y-10">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-xl shadow-primary/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-box-pattern opacity-[0.03]" />
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10 relative z-10">Institutional Velocity</h3>
            <div className="space-y-8 relative z-10">
              {[
                { label: "Courses Published", val: `${courses.filter(c => c.status === 'approved').length}/${courses.length}`, pct: courses.length ? `${Math.round((courses.filter(c => c.status === 'approved').length / courses.length) * 100)}%` : "0%", color: "bg-emerald-500" },
                { label: "Portfolio Completion", val: courses.length > 0 ? "Active" : "No Courses", pct: courses.length > 0 ? "100%" : "0%", color: "bg-primary" },
                { label: "Student Base", val: `${(stats?.totalStudents || 0)} Students`, pct: "100%", color: "bg-gray-900" },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{item.label}</p>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">{item.val}</p>
                  </div>
                  <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: item.pct }}
                      transition={{ duration: 1.5, delay: i * 0.1 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-primary-50 rounded-2xl border border-primary-100 text-center">
              <Globe className="w-8 h-8 text-primary mx-auto mb-4 opacity-30" />
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-relaxed">
                {courses.length === 0 
                  ? "Create your first course to start tracking performance."
                  : `Your portfolio has ${courses.length} course${courses.length !== 1 ? 's' : ''} with ${stats?.totalStudents || 0} enrolled students.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
