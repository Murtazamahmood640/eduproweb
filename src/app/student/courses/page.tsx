"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayCircle, Clock, CheckCircle, Lock, ChevronRight, RotateCcw, TrendingUp, Award, Plus, Loader2, Video, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import SlideOverlay from "@/components/ui/SlideOverlay";
import api from "@/lib/api";

export default function StudentCourses() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const [regRes, courseRes] = await Promise.all([
        api.get("/registrations"),
        api.get("/courses")
      ]);
      setRegistrations(regRes.data);
      // The backend already filters for approved status; only exclude already enrolled courses
      const enrolledIds = regRes.data.map((r: any) => r.course?._id);
      setAvailableCourses(courseRes.data.filter((c: any) => !enrolledIds.includes(c._id)));
    } catch (err) {
      console.error("Error fetching registrations portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  const inProgress = registrations.filter((r) => r.status === "active");
  const completed = registrations.filter((r) => r.status === "completed");
  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Synchronizing Masterclass Portfolio...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-500 text-sm mt-2">{registrations.length} enrolled · {completed.length} completed · Keep learning!</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-edu-indigo to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> Explore More
        </motion.button>
      </motion.div>

      {/* In Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-display text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-edu-indigo/10">
            <PlayCircle className="w-5 h-5 text-edu-indigo" />
          </span>
          In Progress ({inProgress.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inProgress.map((reg, idx) => {
            const course = reg.course;
            if (!course) return null;
            const color = "from-primary to-primary-600"; // Default color

            return (
              <motion.div
                key={reg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-2xl transition-all overflow-hidden flex flex-col h-full"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-primary/20" />
                  </div>
                  <div className="absolute top-4 right-4 flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-lg">
                    <div className="text-center">
                      <p className="text-lg font-black text-slate-900">{reg.progress}%</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex gap-3 items-start mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <PlayCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 leading-tight text-base line-clamp-2 mb-1">{course.title}</p>
                      <p className="text-sm text-slate-500 font-medium">{course.teacher?.name || "Faculty Member"}</p>
                    </div>
                  </div>

                  {/* Progress Info */}
                  <div className="space-y-4 mb-6">
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all`} style={{ width: `${reg.progress}%` }} />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                      <span className="truncate font-medium">Last Activity: Just now</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex gap-2 flex-col mt-auto">
                    <Link 
                      href={`/student/courses/${course._id}/learn`} 
                      className={`w-full py-3 bg-gradient-to-r ${color} text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-xl transition-all text-center group-hover:scale-105 active:scale-95`}
                    >
                      Continue Learning
                    </Link>
                    <Link 
                      href="/student/appointments" 
                      className="w-full py-3 bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all text-center flex items-center justify-center gap-2"
                    >
                      <Video className="w-3.5 h-3.5" /> Book Session
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Completed */}
      {completed.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-edu-emerald/10">
              <CheckCircle className="w-5 h-5 text-edu-emerald" />
            </span>
            Completed ({completed.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completed.map((reg, idx) => {
              const course = reg.course;
              if (!course) return null;
              const color = "from-emerald-500 to-teal-600";

              return (
                <motion.div
                  key={reg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-2xl transition-all overflow-hidden relative flex flex-col h-full"
                >
                  {/* Completion Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg flex items-center gap-1.5 backdrop-blur-sm bg-opacity-95">
                      <CheckCircle className="w-4 h-4" /> Completed
                    </div>
                  </div>

                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-15`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Award className="w-16 h-16 text-emerald-500/20" />
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex gap-3 items-start mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-base line-clamp-2 mb-1">{course.title}</p>
                        <p className="text-sm text-slate-500 font-medium">{course.teacher?.name || "Faculty Member"}</p>
                      </div>
                    </div>

                    {/* Achievement Info */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                      <p className="text-sm font-bold text-emerald-700">Course Completed</p>
                      <p className="text-xs text-emerald-600 mt-1">You've successfully finished this course</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-col mt-auto">
                      <Link 
                        href="/student/certificates" 
                        className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <Award className="w-4 h-4" /> View Certificate
                      </Link>
                      <button className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all border border-slate-200">
                        <RotateCcw className="w-4 h-4" /> Review Course
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Browse & Enroll Form ── */}
      <SlideOverlay
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Explore Courses"
        subtitle="Discover and enroll in new courses"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-900 mb-6 uppercase tracking-widest">Recommended Curricula</label>
            <div className="space-y-4">
              {availableCourses.slice(0, 3).length > 0 ? availableCourses.slice(0, 3).map((course, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  onClick={() => router.push(`/student/browse?id=${course._id}`)}
                  className="p-5 bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 rounded-2xl cursor-pointer hover:border-primary/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-black text-gray-900 text-sm group-hover:text-primary transition-colors">{course.title}</p>
                    <span className="text-[9px] font-black text-primary bg-primary-50 px-2 py-1 rounded-md uppercase tracking-tighter">New</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Lead: {course.teacher?.name || "Global Faculty"}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-primary uppercase">PKR {course.price?.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                       <Clock className="w-3 h-3" /> {course.duration || '12h'}
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-10">
                  <Sparkles className="w-8 h-8 text-gray-100 mx-auto mb-3" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No new recommendations</p>
                </div>
              )}
            </div>
          </div>

          <Link
            href="/student/browse"
            className="w-full inline-flex items-center justify-center gap-2 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all"
          >
            Explore Academy Catalogue <ChevronRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setIsFormOpen(false)}
            className="w-full py-4 bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all"
          >
            Dismiss
          </button>
        </div>
      </SlideOverlay>
    </div>
  );
}
