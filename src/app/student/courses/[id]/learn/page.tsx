"use client";

import React, { useState, useEffect } from "react";
import { 
  Play, CheckCircle, Lock, ChevronLeft, ChevronRight, 
  Menu, X, FileText, BrainCircuit, MessageSquare,
  Award, ArrowLeft, Loader2, Video, Clock, Download,
  ExternalLink, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function CoursePlayer() {
  const { id } = useParams();
  const router = useRouter();
  const { dbUser } = useAuth();
  
  const [course, setCourse] = useState<any>(null);
  const [registration, setRegistration] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"video" | "text" | "assignment" | "quiz">("video");
  const [isGraduating, setIsGraduating] = useState(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  // New sequential state
  const [completedLessonStages, setCompletedLessonStages] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const [regRes, quizRes] = await Promise.all([
        api.get(`/registrations`),
        api.get(`/quizzes/course/${id}`)
      ]);
      
      const reg = regRes.data.find((r: any) => r.course?._id === id);
      if (reg) {
        setRegistration(reg);
        setCourse(reg.course);
        const allLessons = reg.course.outline || [];
        setLessons(allLessons);
        setQuizzes(quizRes.data);
        
        // Determine initial active lesson based on progress
        const completedCount = Math.floor(((reg.progress || 0) / 100) * allLessons.length);
        setActiveLessonIdx(Math.min(completedCount, allLessons.length - 1));
      } else {
        toast.error("Enrollment verification failed.");
        router.push(`/student/courses/${id}`);
      }
    } catch (err) {
      toast.error("Failed to load course intelligence.");
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (newIdx: number) => {
    try {
      setUpdatingProgress(true);
      const newProgress = Math.round(((newIdx + 1) / lessons.length) * 100);
      await api.patch(`/registrations/${registration._id}`, { progress: Math.max(registration.progress, newProgress) });
      setRegistration({ ...registration, progress: Math.max(registration.progress, newProgress) });
    } catch (err) {
      console.error("Progress update failed");
    } finally {
      setUpdatingProgress(false);
    }
  };

  const completeStage = (stage: string) => {
    const lessonId = lessons[activeLessonIdx]._id || activeLessonIdx.toString();
    const currentStages = completedLessonStages[lessonId] || [];
    if (!currentStages.includes(stage)) {
      setCompletedLessonStages({
        ...completedLessonStages,
        [lessonId]: [...currentStages, stage]
      });
    }

    // Auto-advance tabs
    if (stage === "video") setActiveTab("text");
    else if (stage === "text" && currentLesson.assignment) setActiveTab("assignment");
    else if ((stage === "text" || stage === "assignment") && quizzes.length > 0) setActiveTab("quiz");
    else if (stage === "quiz" || (stage === "text" && !currentLesson.assignment && quizzes.length === 0)) {
        if (activeLessonIdx < lessons.length - 1) {
            updateProgress(activeLessonIdx);
            setActiveLessonIdx(activeLessonIdx + 1);
            setActiveTab("video");
        } else {
            updateProgress(activeLessonIdx);
            toast.success("Curriculum Completed!");
        }
    }
  };

  const claimCertificate = async () => {
    try {
      setIsGraduating(true);
      const res = await api.post('/certificates/generate', { courseId: id });
      toast.success("Congratulations on your academic distinction!");
      window.location.href = `/student/certificates/${res.data._id}`;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Graduation process failed.");
    } finally {
      setIsGraduating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Academic Environment...</p>
    </div>
  );

  const currentLesson = lessons[activeLessonIdx];
  const completedCount = Math.floor(((registration?.progress || 0) / 100) * lessons.length);
  
  const lessonId = currentLesson?._id || activeLessonIdx.toString();
  const stages = completedLessonStages[lessonId] || [];
  
  const isTabLocked = (tab: string) => {
    if (tab === "video") return false;
    if (tab === "text") return !stages.includes("video") && activeLessonIdx >= completedCount;
    if (tab === "assignment") return !stages.includes("text") && activeLessonIdx >= completedCount;
    if (tab === "quiz") return (currentLesson.assignment && !stages.includes("assignment")) && activeLessonIdx >= completedCount;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-primary/10 selection:text-primary">
      {/* Light Header */}
      <nav className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-[100] sticky top-0 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/student/dashboard" className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all group border border-slate-200">
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:-translate-x-0.5 transition-all" />
          </Link>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mb-1">Academic Journey</span>
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-wider truncate max-w-xs lg:max-w-md">
              {course?.title || "Classroom"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-4 px-5 py-2 bg-slate-50 rounded-2xl border border-slate-200">
             <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
               <Award className="w-4 h-4" />
             </div>
             <div className="flex flex-col">
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
               <span className="text-xs font-black text-primary">{registration?.progress || 0}%</span>
             </div>
           </div>

           {registration?.progress === 100 && (
              <button 
                onClick={claimCertificate}
                disabled={isGraduating}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                {isGraduating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                Certificate
              </button>
           )}

           <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 bg-white text-slate-400 border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center justify-center transition-all"
           >
             {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] scroll-smooth custom-scrollbar">
          <div className="max-w-5xl mx-auto px-6 py-10 lg:py-16">
            
            {/* Sequential Tabs */}
            <div className="flex items-center gap-2 mb-10 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
                 {[
                   { id: "video", label: "Lecture", icon: Video },
                   { id: "text", label: "Notes", icon: FileText },
                   { id: "assignment", label: "Task", icon: Award, condition: currentLesson?.assignment },
                   { id: "quiz", label: "Quiz", icon: BrainCircuit, condition: quizzes.length > 0 }
                 ].map((tab) => {
                   if (tab.condition === false) return null;
                   const active = activeTab === tab.id;
                   const locked = isTabLocked(tab.id);
                   return (
                    <button 
                      key={tab.id}
                      disabled={locked}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        active ? 'bg-primary text-white shadow-md' : 
                        locked ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {locked ? <Lock className="w-3.5 h-3.5" /> : <tab.icon className="w-3.5 h-3.5" />}
                      {tab.label}
                    </button>
                   );
                 })}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "video" && (
                <motion.div 
                  key="video"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                    <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video relative group">
                    {currentLesson?.videoUrl ? (
                      <video 
                        src={currentLesson.videoUrl.startsWith('http') 
                          ? currentLesson.videoUrl 
                          : `https://res.cloudinary.com/dbi8kszne/video/upload/${currentLesson.videoUrl.includes('/') ? '' : 'edupro/'}${currentLesson.videoUrl}${currentLesson.videoUrl.includes('.') ? '' : '.mp4'}`
                        } 
                        className="w-full h-full object-contain"
                        controls
                        controlsList="nodownload"
                        poster={course?.thumbnail}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                        <Video className="w-12 h-12 text-slate-700 mb-4" />
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Video format unavailable</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                       <span className="px-2 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded">Module {activeLessonIdx + 1}</span>
                       <h2 className="text-3xl font-black text-slate-900 tracking-tight">{currentLesson?.title}</h2>
                    </div>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-3xl">
                      {currentLesson?.description || "In this module, we explore the core functional principles and strategic frameworks essential for academic mastery."}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-4">
                            {currentLesson?.pdfUrl && (
                                <a 
                                 href={currentLesson.pdfUrl.startsWith('http') 
                                   ? currentLesson.pdfUrl 
                                   : `https://res.cloudinary.com/dbi8kszne/raw/upload/${currentLesson.pdfUrl.includes('/') ? '' : 'edupro/'}${currentLesson.pdfUrl}${currentLesson.pdfUrl.includes('.') ? '' : '.pdf'}`
                                 }
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100"
                                >
                                    <Download className="w-3.5 h-3.5" /> PDF Materials
                                </a>
                            )}
                        </div>
                        <button 
                         onClick={() => completeStage("video")}
                         className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-primary transition-all flex items-center gap-2"
                        >
                          Complete Lecture <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "text" && (
                <motion.div 
                  key="text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-10 md:p-16"
                >
                  <div className="max-w-3xl mx-auto space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                         <FileText className="w-6 h-6" />
                       </div>
                       <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Lecture <span className="text-primary italic">Notes</span></h3>
                    </div>
                    
                    <div 
                      className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900"
                      dangerouslySetInnerHTML={{ 
                        __html: currentLesson.textContent?.includes('<') 
                          ? currentLesson.textContent 
                          : (currentLesson.textContent || "No supplemental notes for this lecture.").replace(/\n/g, '<br />') 
                      }} 
                    />

                    <div className="pt-12 mt-12 border-t border-slate-100 flex justify-end">
                       <button 
                        onClick={() => completeStage("text")}
                        className="px-10 py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-105"
                       >
                         Next Step: {currentLesson.assignment ? "Practical Task" : quizzes.length > 0 ? "Quiz" : "Next Lesson"}
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "assignment" && (
                <motion.div 
                  key="assignment"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-12 md:p-20"
                >
                   <div className="max-w-2xl mx-auto">
                     <div className="flex items-center gap-5 mb-10">
                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-100">
                          <Award className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Practical <span className="text-amber-500 italic">Task</span></h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Application of core concepts</p>
                        </div>
                     </div>

                     <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 mb-10">
                        <h4 className="text-lg font-black text-slate-900 mb-3">{currentLesson.assignment.title}</h4>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">{currentLesson.assignment.description}</p>
                     </div>

                     <div className="border-2 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center text-center gap-6 group hover:border-primary/30 transition-all cursor-pointer">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-primary transition-all">
                          <Download className="w-8 h-8 rotate-180" />
                        </div>
                        <div>
                           <p className="text-lg font-black text-slate-900 mb-1">Submit Your Solution</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PDF, DOCX or ZIP (Max 50MB)</p>
                        </div>
                        <button 
                          onClick={() => completeStage("assignment")}
                          className="px-12 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10"
                        >
                          Complete Task
                        </button>
                     </div>
                   </div>
                </motion.div>
              )}

              {activeTab === "quiz" && (
                <motion.div 
                  key="quiz"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-12">
                     <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Academic <span className="text-primary italic">Validation</span></h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Neural Benchmarks for Module {activeLessonIdx + 1}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizzes.map((quiz) => (
                      <div key={quiz._id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
                            <BrainCircuit className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{quiz.title}</h4>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Final Assessment</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                           <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                             <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 15m</span>
                             <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Pass: 80%</span>
                           </div>
                           <Link 
                            href={`/student/quizzes/${quiz._id}`}
                            className="px-6 py-3 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                           >
                            Start
                           </Link>
                        </div>
                      </div>
                    ))}
                    {/* Fallback to advance if quiz is just a placeholder */}
                    <button 
                      onClick={() => completeStage("quiz")}
                      className="col-span-full py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors"
                    >
                      Skip Assessment & Advance →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Linear Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:flex flex-col bg-white border-l border-slate-200 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-200">
                 <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-1">Academic Map</h3>
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{lessons.length} Modules in Sequence</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                 {lessons.map((lesson, i) => {
                   const active = activeLessonIdx === i;
                   const locked = i > completedCount;
                   const completed = i < completedCount;
                   return (
                     <button 
                      key={i}
                      disabled={locked}
                      onClick={() => { setActiveLessonIdx(i); setActiveTab("video"); }}
                      className={`w-full text-left p-5 rounded-2xl transition-all border ${
                        active ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 
                        locked ? 'bg-white text-slate-300 border-transparent opacity-50 cursor-not-allowed' : 
                        'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                      }`}
                     >
                       <div className="flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                            active ? 'bg-primary border-primary text-white' : 
                            completed ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}>
                             {completed ? <CheckCircle className="w-4 h-4" /> : <span className="text-[10px] font-black">{i + 1}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className={`text-[11px] font-black uppercase tracking-tight truncate ${active ? 'text-white' : 'text-slate-900'}`}>{lesson.title}</p>
                             <div className="flex items-center gap-3 mt-1.5">
                                {locked ? (
                                  <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-slate-300"><Lock className="w-3 h-3" /> Locked</span>
                                ) : (
                                  <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-slate-400"><Clock className="w-3 h-3" /> 15 min</span>
                                )}
                             </div>
                          </div>
                       </div>
                     </button>
                   );
                 })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
