"use client";

import React, { useState, useRef } from "react";
import { 
  Plus, Trash2, CheckCircle, GripVertical, Brain, Clock, 
  Sparkles, Loader2, Image as ImageIcon, Send, X, MessageSquare,
  Wand2
} from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

type Question = {
  id: number;
  question: string;
  options: string[];
  correct: number;
};

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [duration, setDuration] = useState("15");
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, question: "", options: ["", "", "", ""], correct: 0 },
  ]);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState("");
  const [aiQuestionCount, setAiQuestionCount] = useState(10);
  const [courses, setCourses] = useState<any[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const ocrInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/teacher/courses");
      // Ensure we have an array
      const courseData = Array.isArray(res.data) ? res.data : [];
      setCourses(courseData);
    } catch (err) {
      console.error("Failed to fetch courses", err);
      toast.error("Could not sync your courses portfolio.");
    }
  };

  const handlePublish = async () => {
    if (!title) return toast.error("Please enter a quiz title.");
    if (!course) return toast.error("Please select a course.");
    if (questions.some(q => !q.question || q.options.some(o => !o))) {
      return toast.error("Please complete all questions and options.");
    }

    const toastId = toast.loading("Publishing elite assessment...");
    try {
      setPublishing(true);
      await api.post("/quizzes", {
        title,
        course,
        duration,
        passingScore: 60,
        questions: questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correct
        }))
      });
      toast.success("Quiz published successfully!", { id: toastId });
      // Reset or redirect
      setTitle("");
      setQuestions([{ id: 1, question: "", options: ["", "", "", ""], correct: 0 }]);
    } catch (err) {
      toast.error("Failed to publish quiz.", { id: toastId });
    } finally {
      setPublishing(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), question: "", options: ["", "", "", ""], correct: 0 }]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: number, field: "question" | "correct", value: string | number) => {
    setQuestions(questions.map((q) => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (id: number, optIdx: number, value: string) => {
    setQuestions(questions.map((q) => {
      if (q.id !== id) return q;
      const opts = [...q.options];
      opts[optIdx] = value;
      return { ...q, options: opts };
    }));
  };

  const generateAIQuiz = async () => {
    if (!aiContent.trim()) return toast.error("Please provide context for the AI.");
    
    console.log("🚀 Sending AI Generation Request:", { count: aiQuestionCount, content: aiContent.substring(0, 100) + "..." });
    const toastId = toast.loading(`AI is architecting ${aiQuestionCount} questions...`);
    try {
      setAiLoading(true);
      const res = await api.post("/ai/generate-quiz", { 
        content: aiContent,
        count: aiQuestionCount 
      });
      
      const newQuestions = res.data.map((q: any, idx: number) => ({
        id: Date.now() + idx,
        question: q.question,
        options: q.options,
        correct: q.correctAnswer
      }));

      setQuestions(newQuestions);
      setShowAiPanel(false);
      // Keep content for reference if they want to regenerate
      toast.success(`AI Intelligence has generated ${res.data.length} questions!`, { id: toastId });
    } catch (err) {
      toast.error("AI failed to generate quiz. Please try again.", { id: toastId });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-black text-slate-900 tracking-tight uppercase">Quiz Architect</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Design high-precision assessments with AI augmentation</p>
        </div>
        <button 
          onClick={() => setShowAiPanel(!showAiPanel)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${
            showAiPanel ? "bg-slate-900 text-white shadow-slate-900/20" : "bg-primary text-white shadow-primary/20 hover:scale-105"
          }`}
        >
          <Sparkles className={`w-4 h-4 ${aiLoading ? "animate-spin" : ""}`} /> 
          {showAiPanel ? "Close AI Lab" : "Launch AI Magic"}
        </button>
      </div>

      <AnimatePresence>
        {showAiPanel && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl shadow-primary/5 relative">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner">
                            <Brain className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">AI Intelligence Studio</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Generate assessments from documents or transcripts</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">MCQ Count</label>
                        <input 
                            type="number" 
                            min="3" max="50"
                            value={aiQuestionCount}
                            onChange={(e) => setAiQuestionCount(Number(e.target.value))}
                            className="w-12 bg-white border border-slate-200 rounded-lg text-xs font-black text-center py-1 focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                   <div className="relative">
                        <textarea 
                            value={aiContent}
                            onChange={(e) => setAiContent(e.target.value)}
                            placeholder="Paste your masterclass notes, lecture transcripts, or key concepts here..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-8 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary min-h-[180px] placeholder:text-slate-300 transition-all"
                        />
                        <div className="absolute bottom-6 right-6">
                            <Sparkles className="w-6 h-6 text-primary/20" />
                        </div>
                   </div>
                   
                    <div className="flex flex-col sm:flex-row gap-4">
                       <button 
                         onClick={generateAIQuiz}
                         disabled={aiLoading || !aiContent.trim()}
                         className="flex-[2] bg-primary hover:bg-primary-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-95"
                       >
                         {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                         Generate Elite Quiz
                       </button>
                       
                       <input 
                         type="file" 
                         className="hidden" 
                         id="lecture-upload" 
                         accept=".txt,.md,.pdf,.docx"
                         onChange={async (e) => {
                           const file = e.target.files?.[0];
                           if (file) {
                             const toastId = toast.loading("Analyzing academic document structure...");
                             try {
                               const formData = new FormData();
                               formData.append("file", file);
                               const res = await api.post("/ai/extract-text", formData, {
                                 headers: { "Content-Type": "multipart/form-data" }
                               });
                               setAiContent(res.data.text);
                               toast.success("Intelligence extracted!", { id: toastId });
                             } catch (err: any) {
                               toast.error("Failed to parse document.", { id: toastId });
                             }
                           }
                         }}
                       />
                       <button 
                         onClick={() => document.getElementById('lecture-upload')?.click()}
                         disabled={aiLoading}
                         className="flex-1 bg-white border-2 border-slate-100 text-slate-600 hover:bg-slate-50 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                       >
                         <Send className="w-4 h-4" /> Upload Material
                       </button>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <p className="text-[9px] text-primary/60 font-black uppercase tracking-widest leading-relaxed">
                      AI is configured to architect high-precision multiple-choice questions with challenging distractors.
                    </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-display font-bold text-slate-900">Quiz Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1.5 block">Quiz Title *</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Module 4 — Visual Design Quiz"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-edu-indigo/20 focus:border-edu-indigo" 
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1.5 block">Linked Course</label>
            <select 
              value={course} 
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-edu-indigo/20 focus:border-edu-indigo appearance-none"
            >
              <option value="">Select course...</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1.5 block">Time Limit (minutes)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)} 
                min="5" max="120"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-edu-indigo/20 focus:border-edu-indigo" 
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 mb-1.5 block">Passing Score (%)</label>
            <input 
              type="number" 
              defaultValue="60" 
              min="1" max="100"
              className="w-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-edu-indigo/20 focus:border-edu-indigo" 
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div key={q.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-slate-300 flex-shrink-0 mt-1" />
                <div className="w-8 h-8 rounded-xl bg-edu-indigo flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">{qi + 1}</span>
                </div>
              </div>
              <button onClick={() => removeQuestion(q.id)} disabled={questions.length === 1}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Question</label>
              <textarea
                value={q.question}
                onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                placeholder="Enter your question here..."
                rows={2}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-edu-indigo/20 focus:border-edu-indigo resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Answer Options (select correct answer)</label>
              {q.options.map((opt, oi) => (
                <div key={oi} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${q.correct === oi ? "border-edu-emerald bg-emerald-50" : "border-slate-200"}`}>
                  <button
                    onClick={() => updateQuestion(q.id, "correct", oi)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      q.correct === oi ? "border-edu-emerald bg-edu-emerald" : "border-slate-300 hover:border-edu-emerald"
                    }`}
                  >
                    {q.correct === oi && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </button>
                  <span className="w-6 text-xs font-bold text-slate-400 flex-shrink-0">{["A", "B", "C", "D"][oi]}</span>
                  <input
                    value={opt}
                    onChange={(e) => updateOption(q.id, oi, e.target.value)}
                    placeholder={`Option ${["A", "B", "C", "D"][oi]}...`}
                    className={`flex-1 bg-transparent text-sm focus:outline-none ${q.correct === oi ? "text-edu-emerald font-bold" : "text-slate-700"}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Question */}
      <button onClick={addQuestion} className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 font-bold text-sm hover:border-edu-indigo hover:text-edu-indigo transition-all">
        <Plus className="w-5 h-5" /> Add Another Question
      </button>

      {/* Summary & Publish */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-display font-bold text-slate-900">{questions.length} Question{questions.length !== 1 ? "s" : ""}</p>
            <p className="text-xs text-slate-400">{duration} minute time limit · 60% passing score</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-edu-indigo" />
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50">Save Draft</button>
          <button 
            onClick={handlePublish}
            disabled={publishing}
            className="flex-1 py-3 bg-edu-indigo text-white rounded-xl font-bold text-sm hover:bg-edu-indigo/90 transition-all disabled:opacity-50"
          >
            {publishing ? "Publishing..." : "🚀 Publish Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
