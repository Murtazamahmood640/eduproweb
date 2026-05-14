"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Star, Users, Clock, Globe, ShieldCheck, 
  PlayCircle, FileText, Award, ChevronRight, 
  ChevronDown, ArrowLeft, GraduationCap, CheckCircle2,
  Loader2, Video, PlusCircle, Lock, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const CourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.slug as string;
  
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [playIntroInline, setPlayIntroInline] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
        
        // Check enrollment status separately — don't let it break course loading
        if (user) {
          try {
            const regRes = await api.get("/registrations");
            const enrolled = regRes.data.some((r: any) => r.course?._id === res.data._id);
            setIsEnrolled(enrolled);
          } catch (regErr) {
            console.warn("Could not check enrollment status:", regErr);
          }
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id, user]);

  const handleEnroll = () => {
    if (!user) {
      toast.error("Institutional access required. Redirecting to signup...");
      const currentPath = window.location.pathname;
      router.push(`/auth/signup?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (isEnrolled) {
      router.push(`/student/courses/${course._id}/learn`);
      return;
    }

    // Redirect to student portal with the course ID to trigger auto-enroll
    router.push(`/student/browse?id=${course._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Course Masterclass...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4 opacity-20" />
          <h1 className="text-2xl font-black text-gray-900 mb-2">Course Not Found</h1>
          <p className="text-gray-500 mb-6">The course you are looking for does not exist or has been moved.</p>
          <Link href="/courses" className="btn-primary px-8 py-3 rounded-xl">Back to Courses</Link>
        </div>
      </div>
    );
  }

  const instructor = course.instructor;

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-white via-white to-primary/5">
      <Navbar />

      <AnimatePresence>
        {showIntro && course.introVideoUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
          >
            <button onClick={() => setShowIntro(false)} className="absolute top-10 right-10 text-white hover:text-primary transition-colors">
               <PlusCircle className="w-10 h-10 rotate-45" />
            </button>
            <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10">
               <iframe src={course.introVideoUrl} className="w-full h-full" allowFullScreen />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <section className="pt-28 pb-20 bg-gradient-to-br from-primary/5 via-white to-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/8 blur-[140px] rounded-full translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/courses" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap gap-3 items-center mb-6">
                <span className="px-4 py-1.5 bg-gradient-to-r from-primary to-primary-600 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">
                  {course.category || "General"}
                </span>
                <span className="px-4 py-1.5 bg-white border-2 border-gray-200 text-gray-600 text-[11px] font-black uppercase tracking-widest rounded-full hover:border-primary/30 transition-colors">
                  {course.level || "Beginner"}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6">
                {course.title}
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed max-w-3xl">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-black text-gray-900">{course.rating || 5.0}</span>
                  <span className="text-xs font-bold text-gray-400">({course.studentsCount || 0} Students)</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={instructor?.profilePicture || "https://ui-avatars.com/api/?name=" + instructor?.name} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt={instructor?.name} />
                  <span className="text-sm font-bold text-gray-500">
                    Taught by <span className="text-primary font-black">{instructor?.name || "Senior Expert"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar Card */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 md:p-8">
                {/* Media Container */}
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-gray-100 border border-gray-100 group">
                  {!playIntroInline ? (
                    <img 
                      src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full relative">
                      <iframe 
                        src={course.introVideoUrl} 
                        className="w-full h-full" 
                        allow="autoplay"
                        allowFullScreen 
                      />
                      <button 
                        onClick={() => setShowIntro(true)}
                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-lg shadow-xl hover:bg-white transition-colors"
                      >
                         <Eye className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {!playIntroInline ? (
                    <button 
                      onClick={() => setPlayIntroInline(true)}
                      className="w-full py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-[0.98]"
                    >
                      <PlayCircle className="w-5 h-5 text-primary" /> Watch Promo Masterclass
                    </button>
                  ) : (
                    <button 
                      onClick={() => setPlayIntroInline(false)}
                      className="w-full py-4 bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-[0.98]"
                    >
                       Back to Thumbnail
                    </button>
                  )}

                  <div className="pt-6 border-t border-gray-50">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-2">Investment Requirement</p>
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-4xl font-black text-gray-900">PKR {course.price?.toLocaleString()}</span>
                    </div>
                    
                    <button 
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className={`w-full py-4 font-black text-sm uppercase tracking-[0.1em] rounded-xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 ${isEnrolled ? "bg-edu-emerald text-white shadow-edu-emerald/20 hover:bg-emerald-600" : "bg-primary text-white shadow-primary/20 hover:bg-primary-600"}`}
                    >
                      {enrolling ? "Initializing..." : isEnrolled ? "Access Course Material" : "Enroll in Masterclass"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-primary-100">
              <ShieldCheck className="w-4 h-4" /> Curriculum Architecture
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">The Academic Roadmap</h2>
            <p className="text-gray-500 font-medium mb-12">Enroll now to unlock the full depth of this masterclass and its specialized resources.</p>
            
            <div className="space-y-4">
              {course.outline?.map((item: any, i: number) => (
                <div 
                  key={i} 
                  className={`relative overflow-hidden bg-white border rounded-3xl transition-all duration-500 ${expandedIndex === i ? "border-primary/40 shadow-2xl shadow-primary/5" : "border-gray-100 shadow-sm"}`}
                >
                  {/* Header / Trigger */}
                  <button 
                    onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                    className="w-full text-left p-8 flex items-center justify-between group relative z-20"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm border transition-all ${expandedIndex === i ? "bg-primary text-white border-primary" : "bg-gray-50 text-primary border-gray-100"}`}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-lg group-hover:text-primary transition-colors">{item.title}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">10:45 Duration · {item.textContent ? "Reading Included" : "Video Lecture"}</p>
                      </div>
                    </div>
                    {expandedIndex === i ? <ChevronDown className="w-6 h-6 text-primary" /> : <ChevronRight className="w-6 h-6 text-gray-200 group-hover:text-primary transition-colors" />}
                  </button>

                  {/* Expanded Content Section (Blurred/Locked) */}
                  <AnimatePresence>
                    {expandedIndex === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-gray-50"
                      >
                        <div className="p-8 relative">
                           {/* Blur Overlay */}
                           <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-10 text-center">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-4 border border-gray-100">
                                 <Lock className="w-6 h-6 text-primary" />
                              </div>
                              <p className="text-sm font-black text-gray-900 uppercase tracking-tight mb-2">Academic Content Locked</p>
                              <p className="text-[10px] text-gray-400 font-bold max-w-[200px] leading-relaxed">Enroll in this masterclass to unlock high-definition lectures and resources.</p>
                           </div>

                           {/* Blurred Background Content (Mock) */}
                           <div className="space-y-6 opacity-30 filter blur-[4px]">
                              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                 <PlayCircle className="w-5 h-5 text-primary" />
                                 <span className="text-xs font-bold text-gray-900">Watch Lecture: {item.title}</span>
                              </div>
                              {item.pdfUrl && (
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                   <FileText className="w-5 h-5 text-emerald-500" />
                                   <span className="text-xs font-bold text-gray-900">Download: Technical Resource Guide</span>
                                </div>
                              )}
                              <div className="p-6 bg-gray-50 rounded-2xl">
                                 <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                                 </p>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CourseDetailPage;
