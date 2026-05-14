"use client";

import api from "@/lib/api";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Star, Users, Clock, ChevronRight, BookOpen, Zap, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import SlideOverlay from "@/components/ui/SlideOverlay";

const levelColors: Record<string, string> = { Beginner: "bg-emerald-100 text-emerald-700", Intermediate: "bg-blue-100 text-blue-700", Advanced: "bg-red-100 text-red-700" };

export default function BrowseCourses() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Academy...</p>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [payModal, setPayModal] = useState<any | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const courseId = searchParams.get('id');
    if (courseId && allCourses.length > 0) {
      const course = allCourses.find(c => c._id === courseId);
      if (course) setPayModal(course);
    }
  }, [searchParams, allCourses]);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setAllCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!payModal) return;
    const toastId = toast.loading("Enrolling in course...");
    try {
      await api.post("/registrations", { courseId: payModal._id });
      toast.success("Enrolled successfully! Welcome to the course.", { id: toastId });
      setPayModal(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Enrollment failed", { id: toastId });
    }
  };

  const categories = ["All", ...Array.from(new Set(allCourses.map(c => c.category).filter(Boolean)))];

  const filtered = allCourses.filter((c) => {
    const matchCat = category === "All" || c.category === category;
    const matchQ = c.title.toLowerCase().includes(query.toLowerCase()) || 
                   (c.teacher?.name || "").toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  const handleConfirmRegistration = (course: any) => {
    setPayModal(course);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Curating Elite Masterclasses...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Browse Courses</h1>
        <p className="text-slate-500 text-sm mt-1">Discover and enroll in new courses to expand your skills</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses or instructors..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-edu-indigo/20 focus:border-edu-indigo"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              category === cat ? "bg-edu-indigo text-white shadow-md shadow-edu-indigo/20" : "bg-white text-slate-600 border border-slate-200 hover:border-edu-indigo hover:text-edu-indigo"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.length > 0 ? filtered.map((course) => (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={course._id} 
            className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden hover:shadow-2xl hover:border-primary/20 transition-all flex flex-col group"
          >
            <Link href={`/courses/${course._id}`} className="block flex-1">
              <div className="h-40 bg-gray-50 flex items-center justify-center border-b border-gray-100 relative overflow-hidden">
                <BookOpen className="w-16 h-16 text-gray-200 group-hover:scale-110 group-hover:text-primary/20 transition-all" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 backdrop-blur-md rounded-lg border border-white shadow-sm text-[9px] font-black uppercase tracking-widest text-primary">
                  {course.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg ${levelColors[course.level] || 'bg-gray-100 text-gray-600'}`}>
                    {course.level}
                  </span>
                </div>
                <h3 className="font-black text-gray-900 text-base leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Faculty: {course.teacher?.name || "Global Expert"}</p>
                <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> 4.9</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> 1.2k</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.duration || '12h'}</span>
                </div>
              </div>
            </Link>
            <div className="p-6 pt-0 mt-auto">
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-lg font-black text-primary tracking-tight">PKR {course.price?.toLocaleString()}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleConfirmRegistration(course);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5" /> Enroll Now
                </button>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-center mx-auto mb-8 text-slate-200">
              <Sparkles className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">No Masterclasses Found</h3>
            <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm leading-relaxed mb-10">
              We couldn't find any courses matching your current filter. Try adjusting your search or category selection.
            </p>
            <button 
              onClick={() => { setQuery(""); setCategory("All"); }}
              className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-600 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Enrollment Drawer */}
      <SlideOverlay
        isOpen={!!payModal}
        onClose={() => setPayModal(null)}
        title="Confirm Enrollment"
        subtitle={payModal?.title}
      >
        <div className="space-y-8">
          <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Financial Investment</span>
              <span className="text-lg font-black text-gray-900 tracking-tight">PKR {payModal?.price?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Academic Status</span>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Open Enrollment</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[11px] text-gray-400 font-bold leading-relaxed uppercase tracking-wider text-center">
              By confirming, you will be granted immediate access to all lecture materials, assignments, and faculty consultations.
            </p>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              onClick={() => setPayModal(null)} 
              className="flex-1 py-5 border border-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleEnroll} 
              className="flex-1 py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95"
            >
              Start Learning
            </button>
          </div>
        </div>
      </SlideOverlay>
    </div>
  );
}
