"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, Clock, Calendar, Trophy, 
  ArrowRight, Sparkles, Brain, FileText, 
  Zap, PlayCircle, Loader2, Target
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import OnboardingTour from "@/components/ui/OnboardingTour";

export default function StudentDashboard() {
  const { dbUser } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [regRes, statsRes] = await Promise.all([
          api.get("/registrations"),
          api.get("/users/student-stats")
        ]);
        setEnrolledCourses(regRes.data);
        setStatsData(statsRes.data);
      } catch (err) {
        console.error("Error fetching dashboard intelligence:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Active Modules", value: statsData?.activeModules?.toString() || "0", icon: BookOpen, sub: "Learning Growth" },
    { label: "Completed Modules", value: statsData?.completedModules?.toString() || "0", icon: Target, sub: "Academic Progress" },
    { label: "Pending Assessments", value: statsData?.examsPending?.toString() || "0", icon: Brain, sub: "Focus Priority" },
    { label: "Certificates", value: statsData?.credentialsEarned?.toString() || "0", icon: Trophy, sub: "Distinctions" },
  ];

  const upcomingItems = [
    { title: "Calculus Mock Assessment", course: "Advanced Mathematics", due: "Tomorrow, 10:00 AM", icon: Brain },
    { title: "React Architecture Quiz", course: "Modern Web Engineering", due: "May 15, 08:00 PM", icon: Sparkles },
    { title: "Physics Lab Submission", course: "Quantum Mechanics", due: "May 18, 11:59 PM", icon: FileText },
  ];

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Personalizing Your Classroom...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* ── Elite Welcome Banner ── */}
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
              <span>Academic Performance Tracking</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-none">
              Resuming your <br /><span className="text-primary">Trajectory, {dbUser?.name?.split(' ')[0] || 'Scholar'}</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg mb-10 leading-relaxed font-medium">
              Your academic velocity has increased by <span className="text-primary font-black">12.4%</span> this week. You are on track for <span className="text-primary font-black">A* distinction</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/student/courses" className="inline-flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary/20 active:scale-95">
                Resume Classroom <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col items-center justify-center w-72 h-72 bg-white rounded-[2.5rem] border border-primary/10 relative group overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-primary/5 group-hover:scale-150 transition-transform duration-1000" />
            <div className="text-center relative z-10">
              <p className="text-5xl font-black text-primary tracking-tighter">{statsData?.overallMastery || 0}%</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Overall Mastery</p>
            </div>
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none scale-90">
              <circle cx="144" cy="144" r="130" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
              <circle 
                cx="144" cy="144" r="130" 
                fill="transparent" stroke="#002366" strokeWidth="12" 
                strokeDasharray="816.8" strokeDashoffset={816.8 * (1 - (statsData?.overallMastery || 0) / 100)} 
                strokeLinecap="round" 
              />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* ── Summary Matrix ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-4xl font-black text-white tracking-tight mb-1 group-hover:text-white">{stat.value}</p>
                <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-4">{stat.label}</p>
                <div className="flex items-center gap-2 text-[9px] font-black text-white uppercase tracking-[0.2em] bg-white/20 w-fit px-3 py-1.5 rounded-lg border border-white/30 group-hover:border-white/50 transition-colors">
                  <Zap className="w-3 h-3 fill-white" />
                  {stat.sub}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Active Classroom */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between ml-1">
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Active Classroom</h2>
            <Link href="/student/courses" className="text-[10px] font-black text-primary uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2">
              Full Portfolio <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {enrolledCourses.length > 0 ? enrolledCourses.map((reg, i) => {
              const course = reg.course;
              if (!course) return null;
              
              const gradients = [
                { bg: "from-primary to-primary-600", icon: "text-primary", light: "from-primary-50 to-primary-100", border: "border-primary-200" },
                { bg: "from-emerald-500 to-teal-600", icon: "text-emerald-500", light: "from-emerald-50 to-teal-50", border: "border-emerald-200" },
                { bg: "from-amber-500 to-orange-600", icon: "text-amber-500", light: "from-amber-50 to-orange-50", border: "border-amber-200" },
              ];
              const gradient = gradients[i % gradients.length];
              
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/15 transition-all group relative overflow-hidden"
              >
                {/* Gradient border on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className={`w-16 h-16 bg-gradient-to-br ${gradient.light} border ${gradient.border} rounded-2xl flex items-center justify-center shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all relative z-10`}>
                  <PlayCircle className={`w-8 h-8 ${gradient.icon} group-hover:text-white`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-black text-gray-900 text-base truncate tracking-tight">{course.title}</p>
                    <span className="text-sm font-black text-primary tracking-tighter">{reg.progress}% Mastery</span>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-5">
                    Lead: {course.teacher?.name || "Faculty Member"} · {course.category}
                  </p>
                  <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${reg.progress}%` }}
                      transition={{ duration: 1.5, delay: 0.6 + i * 0.1 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
                <Link href={`/student/courses/${course._id}/learn`} className="w-full md:w-auto px-8 py-3.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-all shadow-xl shadow-primary/20 text-center">
                  Continue
                </Link>
              </motion.div>
            );
            }) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No enrolled courses yet</p>
                <Link href="/courses" className="text-primary font-black text-[10px] uppercase tracking-widest mt-4 inline-block hover:underline">
                  Explore Academy Catalogue
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Student Timeline */}
        <div className="space-y-10">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-xl shadow-primary/5">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10">Student Timeline</h3>
            <div className="space-y-6">
              {upcomingItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100 group">
                  <div className="w-10 h-10 bg-primary-50 text-primary border border-primary-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-gray-900 leading-tight mb-1">{item.title}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-3 truncate">{item.course}</p>
                    <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-widest bg-white border border-primary-100 w-fit px-2 py-1 rounded-md shadow-sm">
                      <Clock className="w-3 h-3" />
                      {item.due}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/student/appointments" className="mt-12 w-full inline-flex items-center justify-center gap-3 py-6 border-2 border-dashed border-gray-200 text-gray-400 hover:text-primary hover:border-primary hover:bg-primary-50 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all group">
               <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
               Book Elite Session
            </Link>
          </div>

          <div className="bg-primary rounded-2xl p-8 text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-box-pattern opacity-[0.05]" />
             <div className="relative z-10">
                <Trophy className="w-12 h-12 text-white/20 mb-4" />
                <h4 className="text-sm font-black mb-2 uppercase tracking-widest">Next Milestone</h4>
                <p className="text-xs text-white/60 leading-relaxed font-bold mb-6">
                  Complete your current modules to unlock verifiable Academic Distinctions.
                </p>
                <div className="flex items-center gap-3">
                   <Target className="w-5 h-5 text-white/40" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Graduation Projected: June 2025</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <OnboardingTour
        tourKey="student_dashboard"
        onComplete={() => console.log("Student tour finished")}
        steps={[
          {
            title: "Welcome to Your Academy",
            description: "This is your personalized learning trajectory. Track your mastery and academic velocity in real-time.",
            icon: <Sparkles className="w-12 h-12" />,
            color: "from-primary to-primary-600"
          },
          {
            title: "Active Classroom",
            description: "Quickly resume your latest modules and track your progress through the curriculum architecture.",
            icon: <PlayCircle className="w-12 h-12" />,
            color: "from-emerald-500 to-teal-600",
            href: "/student/courses"
          },
          {
            title: "Academic Timeline",
            description: "Stay ahead of deadlines. View your upcoming assessments, quizzes, and project submissions.",
            icon: <Calendar className="w-12 h-12" />,
            color: "from-amber-500 to-orange-600"
          },
          {
            title: "Verifiable Credentials",
            description: "Once you achieve mastery, you can download and share your official digital certificates.",
            icon: <Trophy className="w-12 h-12" />,
            color: "from-violet-500 to-purple-600"
          }
        ]}
      />
    </div>
  );
}
