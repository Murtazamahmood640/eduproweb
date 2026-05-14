"use client";

import React, { useState, useRef } from "react";
import { 
  BookOpen, List, DollarSign, Eye, CheckCircle, 
  Plus, Trash2, GripVertical, Video, FileText, 
  Upload, Loader2, BrainCircuit, Sparkles, Wand2
} from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

const steps = [
  { id: 1, label: "Basic Info", icon: BookOpen },
  { id: 2, label: "Curriculum", icon: List },
  { id: 3, label: "Quizzes", icon: BrainCircuit },
  { id: 4, label: "Pricing", icon: DollarSign },
  { id: 5, label: "Review", icon: Eye },
];

const categories = ["Web Development", "UI/UX Design", "Data Science", "Digital Marketing", "Business", "Photography"];
const levels = ["Beginner", "Intermediate", "Advanced"];

interface CourseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CourseForm({ onSuccess, onCancel }: CourseFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [introVideo, setIntroVideo] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");

  const [sections, setSections] = useState<any[]>([
    { title: "Introduction", lessons: [{ title: "Course Overview", videoUrl: "", pdfUrl: "" }] },
  ]);

  const [quizzes, setQuizzes] = useState<any[]>([
    { title: "Final Assessment", questions: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }] }
  ]);

  const [aiLoading, setAiLoading] = useState<"outline" | "quiz" | null>(null);

  const suggestAIOutline = async () => {
    if (!title) return toast.error("Please enter a course title first.");
    const toastId = toast.loading("AI is architecting your academic roadmap...");
    try {
      setAiLoading("outline");
      const res = await api.post("/ai/suggest-outline", { title, description });
      const suggestedOutline = res.data.map((t: string) => ({
        title: t,
        lessons: [{ title: `${t} Overview`, videoUrl: "", pdfUrl: "", textContent: "" }],
        assignment: { title: `${t} Practice Task`, description: `Complete the practical exercises for ${t}.`, points: 100 }
      }));
      setSections(suggestedOutline);
      toast.success("AI has suggested a high-performance outline!", { id: toastId });
    } catch (err) {
      toast.error("AI was unable to generate an outline.", { id: toastId });
    } finally {
      setAiLoading(null);
    }
  };

  const generateAIQuizForCourse = async (qi: number, customContent?: string) => {
    const quizTitle = quizzes[qi].title;
    if (!quizTitle && !customContent) return toast.error("Please enter a quiz title or provide source material.");
    
    const toastId = toast.loading("AI Intelligence is analyzing your lecture material...");
    try {
      setAiLoading("quiz");
      const res = await api.post("/ai/generate-quiz", { 
        content: customContent || `Course: ${title}. Quiz Topic: ${quizTitle}. Focus on core educational concepts.`,
        count: 10 
      });
      
      const newQuestions = res.data.map((q: any) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));

      const updated = [...quizzes];
      updated[qi].questions = newQuestions;
      setQuizzes(updated);
      toast.success("AI has generated a professional 10-question assessment!", { id: toastId });
    } catch (err) {
      toast.error("AI failed to generate assessment. Please try again.", { id: toastId });
    } finally {
      setAiLoading(null);
    }
  };

  const handleFileUpload = async (file: File, type: string, sectionIndex?: number, lessonIndex?: number) => {
    try {
      setUploading(type);
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const url = res.data.url;

      if (type === "thumbnail") setThumbnail(url);
      else if (type === "introVideo") setIntroVideo(url);
      else if (type === "lessonVideo" && sectionIndex !== undefined && lessonIndex !== undefined) {
        const updated = [...sections];
        updated[sectionIndex].lessons[lessonIndex].videoUrl = url;
        setSections(updated);
      }
      else if (type === "lessonPdf" && sectionIndex !== undefined && lessonIndex !== undefined) {
        const updated = [...sections];
        updated[sectionIndex].lessons[lessonIndex].pdfUrl = url;
        setSections(updated);
      }
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  };

  const addSection = () => setSections([...sections, { title: "New Section", lessons: [] }]);
  const addLesson = (si: number) => {
    const updated = [...sections];
    updated[si].lessons.push({ 
      title: "New Lesson", 
      videoUrl: "", 
      pdfUrl: "", 
      textContent: "",
      assignment: { title: "", description: "", points: 100 } 
    });
    setSections(updated);
  };
  
  const addQuiz = () => setQuizzes([...quizzes, { title: "New Quiz", questions: [{ questionText: "", options: ["", "", "", ""], correctOptionIndex: 0 }] }]);
  const addQuestion = (qi: number) => {
    const updated = [...quizzes];
    updated[qi].questions.push({ questionText: "", options: ["", "", "", ""], correctOptionIndex: 0 });
    setQuizzes(updated);
  };

  const handlePublish = async () => {
    try {
      setLoading(true);
      const courseData = {
        title,
        description,
        price: Number(price),
        thumbnail,
        introVideoUrl: introVideo,
        category,
        level,
        outline: sections.flatMap(s => s.lessons)
      };

      const courseRes = await api.post("/courses", courseData);
      const courseId = courseRes.data._id;

      if (courseId) {
        for (let si = 0; si < sections.length; si++) {
          for (let li = 0; li < sections[si].lessons.length; li++) {
            const lesson = sections[si].lessons[li];
            if (lesson.assignment && lesson.assignment.title) {
              await api.post("/assignments", {
                title: lesson.assignment.title,
                description: lesson.assignment.description || "",
                points: Number(lesson.assignment.points) || 100,
                course: courseId,
                moduleIndex: Number(si)
              });
            }
          }
        }
      }

      for (const quiz of quizzes) {
        if (quiz.title && quiz.questions[0].question) {
          await api.post("/quizzes", { ...quiz, course: courseId });
        }
      }

      toast.success("Course submitted for review!");
      onSuccess();
    } catch (err) {
      console.error("Publish error:", err);
      toast.error("Failed to publish course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <LoadingOverlay isVisible={loading} message="Publishing Course Architecture..." />
      
      <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">Phase {step} of 5</span>
         </div>
         <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
           <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }} />
         </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {steps.map((s) => (
          <div
            key={s.id}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all border ${
              step === s.id ? "bg-primary text-white border-primary shadow-lg shadow-primary/10" :
              step > s.id ? "bg-white text-primary border-primary/20" : "bg-white text-gray-300 border-gray-100"
            }`}
          >
            <s.icon className={`w-4 h-4 ${step === s.id ? "text-white" : "text-current"}`} />
            <span className="text-[8px] font-black uppercase tracking-tighter hidden sm:block">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="min-h-[400px]">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Masterclass Title</label>
              <input 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Advanced Quantum Computing" 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specialization</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Difficulty Level</label>
                <select 
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:bg-white"
                >
                  <option value="">Select Level</option>
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Academic Summary</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4} 
                placeholder="Describe the curriculum objectives..."
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none resize-none focus:bg-white" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cover Imagery</label>
                <div className="relative aspect-video rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center bg-gray-50 hover:border-primary/20 transition-all cursor-pointer overflow-hidden">
                  {thumbnail ? (
                    <img src={thumbnail} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-200" />
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2">Upload Thumbnail</p>
                    </>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files && handleFileUpload(e.target.files[0], "thumbnail")} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Promo Lecture</label>
                <div className="relative aspect-video rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center bg-gray-50 hover:border-primary/20 transition-all cursor-pointer overflow-hidden">
                  {introVideo ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                      <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Video Synchronized</p>
                    </div>
                  ) : (
                    <>
                      <Video className="w-8 h-8 text-gray-200" />
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2">Upload Intro Video</p>
                    </>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files && handleFileUpload(e.target.files[0], "introVideo")} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Curriculum */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Masterclass Modules</h3>
              <div className="flex gap-2">
                <button 
                  onClick={suggestAIOutline}
                  disabled={aiLoading === "outline"}
                  className="p-2 bg-primary/5 text-primary rounded-xl border border-primary/10 hover:bg-primary/10 transition-all"
                  title="AI Outline Generator"
                >
                  {aiLoading === "outline" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                </button>
                <button onClick={addSection} className="p-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-all">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {sections.map((section, si) => (
                <div key={si} className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <input 
                      value={section.title}
                      onChange={e => {
                        const updated = [...sections];
                        updated[si].title = e.target.value;
                        setSections(updated);
                      }}
                      className="flex-1 bg-white border border-gray-100 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider outline-none focus:border-primary/30"
                    />
                    <button onClick={() => addLesson(si)} className="text-[8px] font-black text-primary uppercase tracking-widest bg-white px-3 py-2 rounded-lg border border-primary/10 hover:bg-primary hover:text-white transition-all">
                      + Lecture
                    </button>
                  </div>

                  <div className="space-y-3">
                    {section.lessons.map((lesson, li) => (
                      <div key={li} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                          <input 
                            value={lesson.title}
                            onChange={e => {
                              const updated = [...sections];
                              updated[si].lessons[li].title = e.target.value;
                              setSections(updated);
                            }}
                            placeholder="Lecture Name"
                            className="flex-1 text-xs font-bold outline-none text-gray-900"
                          />
                          <div className="flex gap-2">
                             <div className="relative">
                               <button className={`p-2 rounded-lg transition-all ${lesson.videoUrl ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400 hover:text-primary"}`}>
                                 <Video className="w-3.5 h-3.5" />
                               </button>
                               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files && handleFileUpload(e.target.files[0], "lessonVideo", si, li)} />
                             </div>
                             <div className="relative">
                               <button className={`p-2 rounded-lg transition-all ${lesson.pdfUrl ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400 hover:text-primary"}`}>
                                 <FileText className="w-3.5 h-3.5" />
                               </button>
                               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files && handleFileUpload(e.target.files[0], "lessonPdf", si, li)} />
                             </div>
                          </div>
                        </div>
                        <textarea 
                          value={lesson.textContent}
                          onChange={e => {
                            const updated = [...sections];
                            updated[si].lessons[li].textContent = e.target.value;
                            setSections(updated);
                          }}
                          placeholder="Lecture notes & resources..."
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-[10px] font-bold outline-none resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Quizzes */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Cognitive Assessments</h3>
              <button onClick={addQuiz} className="p-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {quizzes.map((quiz, qi) => (
                <div key={qi} className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <input 
                      value={quiz.title}
                      onChange={e => {
                        const updated = [...quizzes];
                        updated[qi].title = e.target.value;
                        setQuizzes(updated);
                      }}
                      className="flex-1 bg-white border border-gray-100 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider outline-none"
                    />
                    <button onClick={() => generateAIQuizForCourse(qi)} className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all">
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {quiz.questions.map((q: any, questionIndex: number) => (
                      <div key={questionIndex} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
                        <input 
                          value={q.question}
                          onChange={e => {
                            const updated = [...quizzes];
                            updated[qi].questions[questionIndex].question = e.target.value;
                            setQuizzes(updated);
                          }}
                          className="w-full text-xs font-black text-gray-900 border-b border-gray-50 pb-2 outline-none"
                          placeholder={`Question ${questionIndex + 1}`}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          {q.options.map((opt: string, optIndex: number) => (
                            <input 
                              key={optIndex}
                              value={opt}
                              onChange={e => {
                                const updated = [...quizzes];
                                updated[qi].questions[questionIndex].options[optIndex] = e.target.value;
                                setQuizzes(updated);
                              }}
                              placeholder={`Option ${optIndex + 1}`}
                              className={`px-3 py-2 rounded-lg text-[10px] font-bold outline-none border transition-all ${q.correctAnswer === optIndex ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "bg-gray-50 border-gray-100 focus:border-primary/20"}`}
                              onClick={() => {
                                const updated = [...quizzes];
                                updated[qi].questions[questionIndex].correctAnswer = optIndex;
                                setQuizzes(updated);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    <button onClick={() => addQuestion(qi)} className="w-full py-3 bg-white border border-dashed border-gray-200 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest hover:border-primary/20 hover:text-primary transition-all">
                      + Add Question
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Pricing */}
        {step === 4 && (
          <div className="space-y-8">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Financial Architecture</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Retail Price (PKR)</label>
                <input 
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black outline-none focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Original Price (Strike-through)</label>
                <input 
                  type="number"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2.5rem]">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">Platform Strategy</span>
              </div>
              <p className="text-xs font-bold text-emerald-600/80 leading-relaxed">
                Elite masterclasses within the <span className="text-emerald-700">15k - 30k</span> bracket historically achieve maximum institutional adoption and student satisfaction ratings.
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="space-y-8">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Final Validation</h3>
            
            <div className="space-y-3">
              {[
                { label: "Architecture Title", value: title, ok: !!title },
                { label: "Curriculum roadmap", value: `${sections.length} Modules`, ok: sections.length > 0 },
                { label: "Instructional Media", value: thumbnail ? "Ready" : "Missing", ok: !!thumbnail },
                { label: "Monetization Strategy", value: `PKR ${price}`, ok: !!price },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white border border-gray-50 rounded-2xl shadow-sm">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-black ${item.ok ? "text-gray-900" : "text-rose-500"}`}>{item.value}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.ok ? "bg-emerald-500 text-white" : "bg-rose-100 text-rose-500"}`}>
                      {item.ok ? <CheckCircle className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6">
               <button 
                onClick={handlePublish}
                disabled={loading}
                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3"
               >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy Masterclass Architecture"}
               </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-gray-50">
        <button 
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
          className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors disabled:opacity-20"
        >
          Previous
        </button>
        {step < 5 && (
          <button 
            onClick={() => setStep(s => Math.min(5, s + 1))}
            className="px-10 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-gray-900 uppercase tracking-widest hover:border-primary/30 hover:shadow-xl transition-all"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
