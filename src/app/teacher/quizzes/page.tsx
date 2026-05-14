"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Brain, PlusCircle, Trash2, CheckCircle, Clock, 
  BookOpen, Sparkles, Filter, ChevronRight,
  FileText, Users, Award, Loader2, Search,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import toast from "react-hot-toast";
import SlideOverlay from "@/components/ui/SlideOverlay";

export default function AssessmentHub() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [assessments, setAssessments] = useState<{quizzes: any[], assignments: any[]}>({ quizzes: [], assignments: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"quizzes" | "assignments">("quizzes");
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [viewingSubmissions, setViewingSubmissions] = useState(false);
  const [showAssessmentTypeModal, setShowAssessmentTypeModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: "", description: "", points: 100, moduleIndex: 0 });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await api.get("/teacher/courses");
        setCourses(res.data);
        if (res.data.length > 0) setSelectedCourse(res.data[0]);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchAssessments();
    }
  }, [selectedCourse]);

  const fetchAssessments = async () => {
    try {
      const [quizRes, assignmentRes] = await Promise.all([
        api.get(`/quizzes/course/${selectedCourse._id}`),
        api.get(`/assignments/course/${selectedCourse._id}`)
      ]);
      setAssessments({
        quizzes: quizRes.data,
        assignments: assignmentRes.data
      });
    } catch (err) {
      console.error("Error fetching assessments:", err);
    }
  };

  const handleViewSubmissions = async (assignment: any) => {
    try {
      setSelectedAssignment(assignment);
      setViewingSubmissions(true);
      const res = await api.get(`/assignments/submissions/${assignment._id}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  const handleGrade = async (submissionId: string, marks: number, feedback: string) => {
    const toastId = toast.loading("Submitting grade...");
    try {
      await api.patch(`/assignments/grade/${submissionId}`, { marks, feedback });
      toast.success("Grade submitted.", { id: toastId });
      handleViewSubmissions(selectedAssignment);
    } catch (err) {
      toast.error("Failed to grade submission.", { id: toastId });
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Assessment Hub...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase tracking-[0.2em]">Examination Hub</h1>
          <div className="flex items-center gap-4 mt-2">
            <select 
                value={selectedCourse?._id}
                onChange={(e) => setSelectedCourse(courses.find(c => c._id === e.target.value))}
                className="bg-primary-50 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-primary-100 outline-none"
            >
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
        </div>
        <button 
            onClick={() => setShowAssessmentTypeModal(true)}
            className="inline-flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary/20 active:scale-95"
        >
          <PlusCircle className="w-5 h-5" /> Design Assessment
        </button>
      </div>

      {/* Choice Drawer */}
      <SlideOverlay
        isOpen={showAssessmentTypeModal}
        onClose={() => setShowAssessmentTypeModal(false)}
        title="Create New..."
        subtitle={`Assessment format for ${selectedCourse?.title}`}
      >
        <div className="grid grid-cols-1 gap-6">
            <Link href="/teacher/quizzes/create" className="flex items-center gap-6 p-8 bg-primary/5 border border-primary/10 rounded-[2rem] group hover:bg-primary transition-all">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                    <Brain className="w-8 h-8" />
                </div>
                <div className="text-left">
                    <p className="text-lg font-black text-gray-900 group-hover:text-white transition-colors">Elite Quiz</p>
                    <p className="text-[10px] font-bold text-gray-400 group-hover:text-white/60 transition-colors uppercase tracking-widest leading-relaxed">Multi-choice Knowledge Check</p>
                </div>
            </Link>

            <button 
                onClick={() => { setShowAssessmentTypeModal(false); setShowAssignmentModal(true); }}
                className="flex items-center gap-6 p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] group hover:bg-emerald-600 transition-all"
            >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-sm">
                    <FileText className="w-8 h-8" />
                </div>
                <div className="text-left text-left">
                    <p className="text-lg font-black text-gray-900 group-hover:text-white transition-colors">Graded Assignment</p>
                    <p className="text-[10px] font-bold text-gray-400 group-hover:text-white/60 transition-colors uppercase tracking-widest leading-relaxed">Open Submission & File Upload</p>
                </div>
            </button>
        </div>
      </SlideOverlay>

      {/* Assignment Creator Drawer */}
      <SlideOverlay
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        title="Task Architecture"
        subtitle="Design an elite grading assignment"
      >
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Course Module</label>
                <select 
                    value={newAssignment.moduleIndex}
                    onChange={e => setNewAssignment({...newAssignment, moduleIndex: Number(e.target.value)})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-primary/5 appearance-none"
                >
                    {selectedCourse?.outline?.map((item: any, idx: number) => (
                        <option key={idx} value={idx}>Module {idx + 1}: {item.title}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assignment Title</label>
                <input 
                    value={newAssignment.title}
                    onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                    placeholder="e.g. Building a Responsive Dashboard"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-primary/5"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instructions</label>
                <textarea 
                    value={newAssignment.description}
                    onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}
                    placeholder="Describe the task and submission requirements..."
                    rows={6}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-primary/5 resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Maximum Points</label>
                    <input 
                        type="number"
                        value={newAssignment.points}
                        onChange={e => setNewAssignment({...newAssignment, points: Number(e.target.value)})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Due Date</label>
                    <input 
                        type="date"
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black outline-none"
                    />
                </div>
            </div>

            <button 
                onClick={async () => {
                    const toastId = toast.loading("Creating assignment...");
                    try {
                        await api.post("/assignments", { ...newAssignment, course: selectedCourse._id });
                        setShowAssignmentModal(false);
                        fetchAssessments();
                        setNewAssignment({ title: "", description: "", points: 100, moduleIndex: 0 });
                        toast.success("Assignment published!", { id: toastId });
                    } catch (err) {
                        toast.error("Failed to create assignment.", { id: toastId });
                    }
                }}
                className="w-full py-5 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-black transition-all active:scale-[0.98] mt-8"
            >
                Publish Assignment to Module
            </button>
        </div>
      </SlideOverlay>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
        <button 
          onClick={() => setActiveTab("quizzes")}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "quizzes" ? "bg-gray-900 text-white shadow-xl" : "bg-white text-gray-400 hover:bg-gray-50"}`}
        >
           Quizzes ({assessments.quizzes.length})
        </button>
        <button 
          onClick={() => setActiveTab("assignments")}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "assignments" ? "bg-gray-900 text-white shadow-xl" : "bg-white text-gray-400 hover:bg-gray-50"}`}
        >
          Assignments ({assessments.assignments.length})
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        {activeTab === "quizzes" ? (
          assessments.quizzes.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-100">
                <Brain className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Quizzes Created for this Masterclass</p>
            </div>
          ) : (
            assessments.quizzes.map((quiz, i) => (
              <motion.div key={quiz._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 flex items-center justify-between group hover:border-primary/20 transition-all shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Brain className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-1">{quiz.title}</h3>
                    <div className="flex items-center gap-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Module Assessment · {quiz.questions.length} Questions</p>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                            quiz.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            quiz.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                            {quiz.status || 'Pending'}
                        </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <button className="px-6 py-2.5 bg-gray-50 text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all">Edit</button>
                   <button className="p-3 bg-rose-50 text-rose-500 rounded-xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))
          )
        ) : (
          assessments.assignments.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-100">
                <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Assignments Defined for this Architecture</p>
            </div>
          ) : (
            assessments.assignments.map((assignment, i) => (
              <motion.div key={assignment._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 flex items-center justify-between group hover:border-primary/20 transition-all shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-1">{assignment.title}</h3>
                    <div className="flex items-center gap-3">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Graded Task · Max {assignment.points} Points</p>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                            assignment.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            assignment.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                            {assignment.status || 'Pending'}
                        </span>
                    </div>
                  </div>
                </div>
                <button 
                    onClick={() => handleViewSubmissions(assignment)}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all"
                >
                   <Users className="w-4 h-4" /> View Submissions
                </button>
              </motion.div>
            ))
          )
        )}
      </div>

      {/* Submissions Drawer */}
      <SlideOverlay
        isOpen={viewingSubmissions}
        onClose={() => setViewingSubmissions(false)}
        title="Student Manifest"
        subtitle={selectedAssignment?.title}
      >
        <div className="space-y-6">
            {submissions.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-100">
                    <Users className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Elite Submissions Received Yet</p>
                </div>
            ) : (
                submissions.map((sub, i) => (
                    <div key={sub._id} className="bg-white border border-gray-100 rounded-[2rem] p-6 space-y-4 shadow-sm group hover:border-primary/20 transition-all">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src={sub.student.profilePicture || `https://ui-avatars.com/api/?name=${sub.student.name}`} className="w-12 h-12 rounded-xl border border-gray-100 shadow-sm" />
                                <div>
                                    <p className="text-sm font-black text-gray-900">{sub.student.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 tracking-tight">{sub.student.email}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${sub.status === 'graded' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                                {sub.status}
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <Link href={sub.fileUrl} target="_blank" className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest hover:underline">
                                <FileText className="w-4 h-4" /> Download Assets
                            </Link>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    defaultValue={sub.marks} 
                                    className="w-16 px-2 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-black text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    onBlur={(e) => handleGrade(sub._id, Number(e.target.value), "")}
                                />
                                <span className="text-[10px] font-black text-gray-400">/ {selectedAssignment?.points}</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </SlideOverlay>
    </div>
  );
}
