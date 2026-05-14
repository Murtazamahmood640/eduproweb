"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Brain, Clock, CheckCircle, XCircle, PlayCircle, Trophy, AlertCircle, Search, Filter, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";


const quizzes = [
  { id: "q1", title: "Module 1 — Intro to UI/UX", course: "UI/UX Design Mastery", questions: 10, duration: "15 min", status: "Passed", score: 90, dueDate: null },
  { id: "q2", title: "Module 2 — User Research", course: "UI/UX Design Mastery", questions: 12, duration: "20 min", status: "Failed", score: 55, dueDate: null },
  { id: "q3", title: "Module 4 — Visual Design", course: "UI/UX Design Mastery", questions: 15, duration: "25 min", status: "Not Started", score: null, dueDate: "Today" },
  { id: "q4", title: "JavaScript Fundamentals", course: "Web Development", questions: 20, duration: "30 min", status: "Not Started", score: null, dueDate: "May 3" },
  { id: "q5", title: "React Hooks & State", course: "Web Development", questions: 12, duration: "20 min", status: "In Progress", score: null, dueDate: "May 5" },
  { id: "q6", title: "NumPy & Pandas Basics", course: "Python for Data Science", questions: 10, duration: "15 min", status: "Locked", score: null, dueDate: null },
];

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  "Passed": { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", label: "Passed" },
  "Failed": { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Failed" },
  "Not Started": { icon: PlayCircle, color: "text-primary", bg: "bg-primary-50", label: "Not Started" },
  "In Progress": { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", label: "In Progress" },
  "Locked": { icon: Brain, color: "text-gray-300", bg: "bg-gray-50", label: "Locked" },
};

export default function StudentQuizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Not Started", "In Progress", "Passed", "Failed"];

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/quizzes/my");
      setQuizzes(res.data);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "All" ? quizzes : quizzes.filter((q) => q.status === filter);
  const passed = quizzes.filter((q) => q.status === "Passed").length;
  const total = quizzes.filter((q) => q.status !== "Locked").length;

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Examinations...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">My Quizzes</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">{passed} of {total} available quizzes passed</p>
        </div>
      </div>

      {/* Stats - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total Available", value: total, icon: Brain, color: "bg-primary-50 text-primary" },
          { label: "Passed", value: passed, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
          { label: "Failed", value: quizzes.filter((q) => q.status === "Failed").length, icon: XCircle, color: "bg-red-50 text-red-500" },
          { label: "In Progress", value: quizzes.filter((q) => q.status === "In Progress").length, icon: AlertCircle, color: "bg-amber-50 text-amber-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className={`w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-xl md:text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold whitespace-nowrap transition-all ${
              filter === f ? "bg-primary text-white shadow-md" : "bg-white text-gray-600 border border-gray-100 hover:border-primary/20"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Quiz Grid - Fixed Responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length > 0 ? filtered.map((quiz, i) => {
          const config = statusConfig[quiz.status] || statusConfig["Locked"];
          const StatusIcon = config.icon;
          const isActionable = quiz.status === "Not Started" || quiz.status === "In Progress" || quiz.status === "Failed";

          return (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col h-full hover:border-primary/20 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                  {React.createElement(StatusIcon, {
                    className: `w-5 h-5 md:w-6 md:h-6 ${config.color}`,
                  })}
                </div>
              </div>

              <div className="flex-1 min-w-0 mb-6">
                <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight mb-1 group-hover:text-primary transition-colors">
                  {quiz.title}
                </h3>
                <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-widest">{quiz.course?.title}</p>
                
                <div className="flex items-center gap-3 mt-4 text-[10px] text-gray-500 font-semibold">
                  <span className="flex items-center gap-1"><Brain className="w-3 h-3 text-primary" /> {quiz.questions?.length || 0} Qs</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> {quiz.duration} min</span>
                  {quiz.score !== null && (
                    <span className={`flex items-center gap-1 font-black ${quiz.score >= 60 ? "text-emerald-600" : "text-red-500"}`}>
                      <Trophy className="w-3 h-3" /> {quiz.score}%
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                {quiz.status === "Locked" ? (
                  <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">Module Locked</span>
                ) : isActionable ? (
                  <Link
                    href={`/student/quizzes/${quiz._id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary-600 transition-all active:scale-95 shadow-sm"
                  >
                    {quiz.status === "Failed" ? "Retake Quiz" : "Start Now"}
                  </Link>
                ) : (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md ${config.bg} ${config.color}`}>
                    <CheckCircle className="w-3 h-3" /> {config.label}
                  </div>
                )}
              </div>
            </motion.div>
          );
        }) : (
          <div className="col-span-full py-20 text-center bg-white border border-dashed border-gray-200 rounded-3xl">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Sparkles className="w-8 h-8 text-slate-200" />
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No examinations found in this category</p>
             <Link href="/student/courses" className="mt-4 inline-block text-primary text-[10px] font-black uppercase tracking-widest hover:underline">
               Explore Your Curriculum
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
