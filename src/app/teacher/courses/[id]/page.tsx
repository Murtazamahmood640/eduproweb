"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, BookOpen, Users, DollarSign, 
  Star, PlayCircle, FileText, PlusCircle, 
  Edit, Eye, CheckCircle, Clock, Trash2,
  Loader2,
  Video
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

export default function TeacherCourseManagement() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/teacher/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course management data:", err);
        // Fallback to general course if teacher-specific route fails
        try {
            const fallback = await api.get(`/courses/${id}`);
            setCourse(fallback.data);
        } catch(e) {}
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Portfolio Asset...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">Asset Not Found</h2>
        <p className="text-gray-500 mb-8">This course does not exist in your portfolio.</p>
        <Link href="/teacher/courses" className="btn-primary px-8 py-3 rounded-xl">Back to Portfolio</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/teacher/courses" className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all group shadow-sm">
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:-translate-x-1 transition-all" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">{course.title}</h1>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest rounded-md">
                Active & Published
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                ID: {course._id.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/courses/${course._id}`} target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            <Eye className="w-4 h-4 text-primary" /> Public View
          </Link>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-all shadow-xl shadow-primary/20">
            <Edit className="w-4 h-4" /> Edit Architecture
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Learners", value: course.studentsCount || 0, icon: Users, color: "text-primary bg-primary-50" },
          { label: "Gross Revenue", value: `PKR ${(course.price * (course.studentsCount || 0)).toLocaleString()}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
          { label: "Public Rating", value: course.rating || "5.0", icon: Star, color: "text-amber-500 bg-amber-50" },
          { label: "Lessons Total", value: course.outline?.length || 0, icon: BookOpen, color: "text-violet-600 bg-violet-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-2xl transition-all group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Curriculum Architecture */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Curriculum Architecture</h3>
            <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
              {course.outline?.length || 0} Modules Total
            </span>
          </div>

          <div className="space-y-4">
            {course.outline?.map((module: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 group hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center font-black text-primary text-sm shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-base mb-1">{module.title}</h4>
                      <div className="flex items-center gap-4">
                         {module.videoUrl && (
                           <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                             <Video className="w-3.5 h-3.5 text-primary opacity-30" /> Video Material
                           </span>
                         )}
                         {module.pdfUrl && (
                           <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                             <FileText className="w-3.5 h-3.5 text-emerald-400 opacity-30" /> PDF Resource
                           </span>
                         )}
                      </div>
                    </div>
                  </div>
                  <button className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-300 rounded-lg hover:text-primary hover:bg-primary-50 transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            
            <button className="w-full py-6 bg-white border-2 border-dashed border-gray-100 rounded-2xl text-gray-300 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all group">
              <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Append Module Architecture
            </button>
          </div>
        </div>

        {/* Settings & Info */}
        <div className="space-y-10">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-primary/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
             <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 relative z-10">Media Assets</h3>
             
             <div className="space-y-6 relative z-10">
                <div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Course Thumbnail</p>
                   <div className="aspect-video bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden group relative">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} className="w-full h-full object-cover" alt="Thumbnail" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-8 h-8 text-gray-200" /></div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button className="p-3 bg-white rounded-xl shadow-2xl active:scale-95 transition-transform"><Edit className="w-4 h-4 text-primary" /></button>
                      </div>
                   </div>
                </div>

                <div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Introductory Video</p>
                   <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <PlayCircle className="w-5 h-5 text-primary opacity-30" />
                         <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Intro_Video.mp4</span>
                      </div>
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8">
             <h4 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.3em] mb-4">Danger Zone</h4>
             <p className="text-[10px] text-rose-400 font-bold leading-relaxed mb-6">
                Decommissioning this course will permanently remove it from the global catalog and student enrollment.
             </p>
             <button className="w-full py-4 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all flex items-center justify-center gap-3">
                <Trash2 className="w-4 h-4" /> Decommission Course
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
