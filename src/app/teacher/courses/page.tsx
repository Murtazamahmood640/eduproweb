"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, Users, Star, Eye, Edit, Trash2, 
  ToggleLeft, ToggleRight, PlusCircle, DollarSign, 
  BarChart, Sparkles, Filter, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import toast from "react-hot-toast";
import SlideOverlay from "@/components/ui/SlideOverlay";
import CourseForm from "@/components/forms/CourseForm";

export default function TeacherCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/teacher/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast.error("Failed to load your courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    const toastId = toast.loading("Deleting course...");
    try {
      setActionLoading(courseId);
      await api.delete(`/courses/${courseId}`);
      setCourses(prev => prev.filter(c => c._id !== courseId));
      toast.success("Course deleted.", { id: toastId });
    } catch (err) {
      toast.error("Failed to delete course.", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCourses = courses.filter(c => 
    activeFilter === "All" || c.status === activeFilter
  );

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0);
  const avgRating = courses.length 
    ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1) 
    : "N/A";

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Course Portfolio...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase tracking-[0.2em]">Course Portfolio</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
              {courses.length} courses total · {courses.filter(c => c.status === "approved").length} active globally
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowCreateDrawer(true)}
          className="inline-flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary/20 active:scale-95"
        >
          <PlusCircle className="w-5 h-5" /> Launch New Course
        </button>
      </div>

      {/* ── Summary Matrix ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users, color: "text-primary bg-primary-50 border-primary-100" },
          { label: "Active Courses", value: courses.filter(c => c.status === "approved").length.toString(), icon: BookOpen, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { label: "Avg Rating", value: avgRating === "N/A" ? "N/A" : `${avgRating} ★`, icon: Star, color: "text-amber-500 bg-amber-50 border-amber-100" },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-2xl border p-8 flex items-center gap-6 hover:shadow-2xl transition-all group ${s.color.split(" ").slice(2).join(" ")}`}>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform ${s.color.split(" ").slice(0, 2).join(" ")}`}>
              <s.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 tracking-tight">{s.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        {["All", "pending", "approved", "rejected"].map(f => (
          <button 
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeFilter === f 
                ? "bg-gray-900 text-white shadow-xl" 
                : "bg-white border border-gray-100 text-gray-400 hover:bg-gray-50"
            }`}
          >
            {f === "All" ? <><Filter className="w-4 h-4" /> All Courses</> : f}
          </button>
        ))}
      </div>

      {/* ── Course Grid ── */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No courses found</p>
          <button 
            onClick={() => setShowCreateDrawer(true)}
            className="mt-4 inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
          >
            <PlusCircle className="w-4 h-4" /> Create your first course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredCourses.map((course) => (
            <motion.div 
              key={course._id} 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all overflow-hidden group"
            >
              <div className="p-8 md:p-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center">
                {/* Thumbnail */}
                <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                  {course.thumbnail 
                    ? <img src={course.thumbnail} className="w-full h-full object-cover" alt={course.title} />
                    : <div className="w-full h-full flex items-center justify-center group-hover:bg-primary transition-all"><BookOpen className="w-10 h-10 text-primary group-hover:text-white" /></div>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <h2 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-primary transition-colors">{course.title}</h2>
                        <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-md border ${
                          course.status === "approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                          course.status === "rejected" ? "bg-rose-50 text-rose-600 border-rose-100" :
                          "bg-amber-50 text-amber-600 border-amber-100"
                        }`}>
                          {course.status || "Pending"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary opacity-30" /> {course.category || "Uncategorized"}</span>
                        <span className="w-1.5 h-1.5 bg-gray-100 rounded-full" />
                        <span>{course.level || "All Levels"}</span>
                        <span className="w-1.5 h-1.5 bg-gray-100 rounded-full" />
                        <span>PKR {(course.price || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sub-stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-10 border-b border-gray-50 mb-10">
                    {[
                      { label: "Enrolled Students", value: (course.enrollmentCount || 0).toLocaleString(), icon: Users },
                      { label: "Avg Rating", value: course.rating ? `${course.rating} / 5.0` : "Unrated", icon: Star },
                      { label: "Revenue", value: `PKR ${((course.enrollmentCount || 0) * (course.price || 0)).toLocaleString()}`, icon: DollarSign },
                    ].map((stat, i) => (
                      <div key={i} className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                          <stat.icon className="w-4 h-4 text-primary opacity-30" />
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                        <p className="text-lg font-black text-gray-900 tracking-tight">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href={`/teacher/courses/${course._id}/edit`} className="inline-flex items-center gap-3 px-8 py-3.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-all shadow-xl shadow-primary/20">
                      <Edit className="w-4 h-4" /> Edit Course
                    </Link>
                    <Link href={`/teacher/courses/${course._id}`} className="inline-flex items-center gap-3 px-8 py-3.5 bg-gray-50 border border-gray-100 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:shadow-xl transition-all">
                      <Eye className="w-4 h-4 text-primary opacity-30" /> View Details
                    </Link>
                    <button 
                      onClick={() => handleDelete(course._id)}
                      disabled={actionLoading === course._id}
                      className="inline-flex items-center gap-3 px-6 py-3.5 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 hover:text-white transition-all ml-auto disabled:opacity-50"
                    >
                      {actionLoading === course._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Course Drawer */}
      <SlideOverlay
        isOpen={showCreateDrawer}
        onClose={() => setShowCreateDrawer(false)}
        title="Launch Masterclass"
        subtitle="Design your elite academic curriculum"
      >
        <CourseForm 
          onSuccess={() => {
            setShowCreateDrawer(false);
            fetchCourses();
          }}
          onCancel={() => setShowCreateDrawer(false)}
        />
      </SlideOverlay>
    </div>
  );
}

