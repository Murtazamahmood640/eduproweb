"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronRight, 
  BookOpen, 
  List, 
  DollarSign, 
  Eye, 
  CheckCircle, 
  Plus, 
  Trash2, 
  GripVertical, 
  Video, 
  FileText, 
  Upload,
  Loader2,
  BrainCircuit,
  Sparkles,
  Wand2,
  CheckCircle2,
  MessageSquare
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

export default function CreateCourse() {
  const router = useRouter();
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
      
      // The backend returns { question, options, correctAnswer }
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

  // Upload Handler
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
      
      // 1. Create Course
      const courseData = {
        title,
        description,
        instructor: "", // Backend will use req.user
        price: Number(price),
        thumbnail,
        introVideoUrl: introVideo,
        outline: sections.flatMap(s => s.lessons.map((l: any) => ({ ...l, sectionTitle: s.title })))
      };

      const courseRes = await api.post("/courses", courseData);
      const courseId = courseRes.data._id;

      // 2. Create Module-wise Assignments
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
                moduleIndex: Number(si) // si is the section/module index
              });
            }
          }
        }
      }

      // 3. Create Quizzes (If any)
      for (const quiz of quizzes) {
        if (quiz.title && quiz.questions[0].questionText) {
          await api.post("/quizzes", { ...quiz, course: courseId });
        }
      }

      toast.success("Course submitted for review!");
      router.push("/teacher/courses");
    } catch (err) {
      console.error("Publish error:", err);
      toast.error("Failed to publish course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10">
      <LoadingOverlay isVisible={loading} message="Publishing Course..." />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Create Masterclass</h1>
          <p className="text-gray-500 font-medium mt-2">Architect your curriculum and empower learners worldwide.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {step} of 5</span>
           <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
             <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }} />
           </div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-5 gap-4">
        {steps.map((s) => (
          <button
            key={s.id}
            onClick={() => step > s.id && setStep(s.id)}
            className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all border ${
              step === s.id ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105" :
              step > s.id ? "bg-white text-primary border-primary/20" : "bg-white text-gray-300 border-gray-100"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step === s.id ? "bg-white/20" : "bg-gray-50"}`}>
              {step > s.id ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest hidden md:block">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Course Title</label>
                  <input 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Quantum Physics for Beginners" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Category</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Level</label>
                  <select 
                    value={level}
                    onChange={e => setLevel(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">Select Level</option>
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Course Thumbnail</label>
                <div className="relative aspect-video rounded-[2rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center group overflow-hidden bg-gray-50 hover:border-primary/20 transition-all cursor-pointer">
                  {thumbnail ? (
                    <img src={thumbnail} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-200 group-hover:text-primary transition-colors" />
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-4">Upload Cover Art</p>
                    </>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files && handleFileUpload(e.target.files[0], "thumbnail")} />
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Description</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5} 
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none resize-none" 
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Course Intro Video</label>
              <div className="p-8 border-2 border-dashed border-gray-100 rounded-[2rem] flex items-center gap-6 group hover:border-primary/20 transition-all">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary">
                  <Video className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-gray-900 uppercase tracking-widest">
                    {introVideo ? "Video Uploaded ✅" : "Select Intro Video"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 font-bold">MP4 format recommended (Max 50MB)</p>
                </div>
                <div className="relative">
                   <button className="bg-primary text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                     {uploading === "introVideo" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
                   </button>
                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files && handleFileUpload(e.target.files[0], "introVideo")} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Curriculum */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Academic Roadmap</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Define your course sections and lessons</p>
               </div>
               <div className="flex gap-3">
                  <button 
                    onClick={suggestAIOutline}
                    disabled={aiLoading === "outline"}
                    className="bg-indigo-50 text-primary px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-primary/10 hover:bg-indigo-100 transition-all"
                  >
                    {aiLoading === "outline" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    AI Smart Outline
                  </button>
                  <button onClick={addSection} className="bg-primary text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20">
                    <Plus className="w-4 h-4" /> Add Section
                  </button>
               </div>
            </div>
            
            <div className="space-y-6">
              {sections.map((section, si) => (
                <div key={si} className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-300">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <input 
                      value={section.title}
                      onChange={e => {
                        const updated = [...sections];
                        updated[si].title = e.target.value;
                        setSections(updated);
                      }}
                      className="flex-1 bg-white border border-gray-100 px-6 py-3 rounded-xl text-sm font-black outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button onClick={() => addLesson(si)} className="bg-white text-primary border border-primary/20 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">
                      + Lesson
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 ml-14">
                    {section.lessons.map((lesson, li) => (
                      <div key={li} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                         <div className="flex-1 min-w-0 w-full">
                           <input 
                            value={lesson.title}
                            onChange={e => {
                              const updated = [...sections];
                              updated[si].lessons[li].title = e.target.value;
                              setSections(updated);
                            }}
                            placeholder="Lesson Title"
                            className="w-full text-sm font-bold outline-none mb-4"
                           />
                           <div className="flex flex-wrap gap-4 mb-4">
                             {/* Video Upload */}
                             <div className="relative group">
                               <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${lesson.videoUrl ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400 group-hover:text-primary"}`}>
                                 <Video className="w-3.5 h-3.5" /> {lesson.videoUrl ? "Video Linked" : "Add Video"}
                               </button>
                               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files && handleFileUpload(e.target.files[0], "lessonVideo", si, li)} />
                             </div>
                             {/* PDF Upload */}
                             <div className="relative group">
                               <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${lesson.pdfUrl ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400 group-hover:text-primary"}`}>
                                 <FileText className="w-3.5 h-3.5" /> {lesson.pdfUrl ? "PDF Linked" : "Add PDF"}
                               </button>
                               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files && handleFileUpload(e.target.files[0], "lessonPdf", si, li)} />
                             </div>
                           </div>

                           <div className="space-y-4">
                             <div className="space-y-2">
                               <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Reading Material / Text Content</label>
                               <textarea 
                                value={lesson.textContent}
                                onChange={e => {
                                  const updated = [...sections];
                                  updated[si].lessons[li].textContent = e.target.value;
                                  setSections(updated);
                                }}
                                placeholder="Add lecture notes, code snippets, or additional text here..."
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                               />
                             </div>

                             <div className="pt-4 border-t border-gray-50">
                               <div className="flex items-center gap-2 mb-4">
                                 <input 
                                   type="checkbox" 
                                   checked={!!lesson.assignment?.title || !!lesson.assignment?.description}
                                   onChange={(e) => {
                                     const updated = [...sections];
                                     if (e.target.checked) {
                                       updated[si].lessons[li].assignment = { title: "", description: "", points: 100 };
                                     } else {
                                       updated[si].lessons[li].assignment = null;
                                     }
                                     setSections(updated);
                                   }}
                                   className="accent-primary"
                                 />
                                 <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest">Include Assignment</label>
                               </div>
                               
                               {lesson.assignment && (
                                 <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl space-y-4">
                                   <input 
                                     value={lesson.assignment.title}
                                     onChange={e => {
                                       const updated = [...sections];
                                       updated[si].lessons[li].assignment.title = e.target.value;
                                       setSections(updated);
                                     }}
                                     placeholder="Assignment Title"
                                     className="w-full bg-white border border-primary/10 px-4 py-2 rounded-lg text-xs font-bold outline-none"
                                   />
                                   <textarea 
                                     value={lesson.assignment.description}
                                     onChange={e => {
                                       const updated = [...sections];
                                       updated[si].lessons[li].assignment.description = e.target.value;
                                       setSections(updated);
                                     }}
                                     placeholder="Assignment instructions..."
                                     rows={2}
                                     className="w-full bg-white border border-primary/10 px-4 py-2 rounded-lg text-xs font-bold outline-none resize-none"
                                   />
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>
                         <button className="text-gray-300 hover:text-red-500 transition-colors">
                           <Trash2 className="w-5 h-5" />
                         </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Quizzes (Optional) */}
        {step === 3 && (
           <div className="space-y-10">
             <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Knowledge Check</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">This step is optional but recommended</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(4)} className="bg-gray-50 text-gray-400 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 hover:bg-gray-100">
                    Skip for Now
                  </button>
                  <button onClick={addQuiz} className="bg-primary text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20">
                    <Plus className="w-4 h-4" /> Create Quiz
                  </button>
                </div>
             </div>

             <div className="space-y-8">
               {quizzes.map((quiz, qi) => (
                 <div key={qi} className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 space-y-8">
                    <div className="space-y-4">
                       <div className="flex items-center justify-between gap-4">
                         <div className="flex items-center gap-4 flex-1">
                           <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-primary">
                             <BrainCircuit className="w-6 h-6" />
                           </div>
                           <input 
                            value={quiz.title}
                            onChange={e => {
                              const updated = [...quizzes];
                              updated[qi].title = e.target.value;
                              setQuizzes(updated);
                            }}
                            placeholder="Quiz Title (e.g. Fundamental Logic Assessment)"
                            className="flex-1 bg-white border border-gray-100 px-6 py-3 rounded-xl text-sm font-black outline-none focus:ring-2 focus:ring-primary/20"
                           />
                         </div>
                         <div className="flex gap-2">
                           <button onClick={() => addQuestion(qi)} className="bg-white text-primary border border-primary/20 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">
                             + Question
                           </button>
                         </div>
                       </div>

                       {/* Lecture Source Material */}
                       <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Lecture Intelligence Studio</span>
                             </div>
                             <div className="flex gap-2">
                                <div className="relative group">
                                   <button className="bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 transition-all">
                                     <FileText className="w-3.5 h-3.5" /> Upload PDF / Word
                                   </button>
                                   <input 
                                     type="file" 
                                     accept=".txt,.md,.json,.pdf,.docx,.doc"
                                     className="absolute inset-0 opacity-0 cursor-pointer"
                                     onChange={async (e) => {
                                       const file = e.target.files?.[0];
                                       if (file) {
                                         const toastId = toast.loading("Extracting academic content...");
                                         try {
                                           const formData = new FormData();
                                           formData.append("file", file);
                                           const res = await api.post("/ai/extract-text", formData, {
                                             headers: { "Content-Type": "multipart/form-data" }
                                           });
                                           const textarea = document.getElementById(`lecture-source-${qi}`) as HTMLTextAreaElement;
                                           if (textarea) textarea.value = res.data.text;
                                           toast.success("Document analyzed successfully!", { id: toastId });
                                         } catch (err: any) {
                                           const msg = err.response?.data?.message || "Failed to parse document.";
                                           toast.error(msg, { id: toastId });
                                         }
                                       }
                                     }}
                                   />
                                </div>
                                <button 
                                   onClick={() => generateAIQuizForCourse(qi, (document.getElementById(`lecture-source-${qi}`) as HTMLTextAreaElement)?.value)}
                                   disabled={aiLoading === "quiz"}
                                   className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all disabled:opacity-50"
                                >
                                  {aiLoading === "quiz" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                                  Generate 10 MCQs from Material
                                </button>
                             </div>
                          </div>
                          <textarea 
                             id={`lecture-source-${qi}`}
                             placeholder="Paste your lecture notes, document content, or transcript here. AI will extract 10 key questions directly from this material..."
                             rows={4}
                             className="w-full bg-white border border-indigo-100 rounded-xl p-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                          />
                       </div>
                    </div>

                   <div className="space-y-6">
                     {quiz.questions.map((q: any, questionIndex: number) => (
                       <div key={questionIndex} className="bg-white border border-gray-100 rounded-2xl p-8 space-y-6">
                         <div>
                           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Question {questionIndex + 1}</label>
                           <input 
                             value={q.question}
                             onChange={e => {
                               const updated = [...quizzes];
                               updated[qi].questions[questionIndex].question = e.target.value;
                               setQuizzes(updated);
                             }}
                             className="w-full text-sm font-bold border-b border-gray-100 pb-2 outline-none"
                             placeholder="Write your question here..."
                           />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {q.options.map((opt: string, optIndex: number) => (
                             <div key={optIndex} className="flex items-center gap-3">
                               <input 
                                 type="radio" 
                                 name={`correct-${qi}-${questionIndex}`}
                                 checked={q.correctAnswer === optIndex}
                                 onChange={() => {
                                   const updated = [...quizzes];
                                   updated[qi].questions[questionIndex].correctAnswer = optIndex;
                                   setQuizzes(updated);
                                 }}
                                 className="accent-primary"
                               />
                               <input 
                                 value={opt}
                                 onChange={e => {
                                   const updated = [...quizzes];
                                   updated[qi].questions[questionIndex].options[optIndex] = e.target.value;
                                   setQuizzes(updated);
                                 }}
                                 className="flex-1 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-xs font-bold outline-none"
                                 placeholder={`Option ${optIndex + 1}`}
                               />
                             </div>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* Step 4: Pricing */}
        {step === 4 && (
          <div className="space-y-10">
             <h2 className="text-2xl font-black text-gray-900 tracking-tight">Value Proposition</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Price (PKR)</label>
                  <input 
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="e.g. 12000"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Original Price (For Discount Display)</label>
                  <input 
                    type="number"
                    value={originalPrice}
                    onChange={e => setOriginalPrice(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                  />
               </div>
             </div>
             <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10">
               <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Platform Insight</p>
               <p className="text-sm font-medium text-gray-600 leading-relaxed">
                 Courses priced between <span className="font-black text-primary">PKR 10,000 - 25,000</span> see 40% higher conversion rates for specialized academic content.
               </p>
             </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="space-y-10">
             <h2 className="text-2xl font-black text-gray-900 tracking-tight">Final Manifest</h2>
             <div className="space-y-4">
               {[
                 { label: "Title", value: title || "Missing", ok: !!title },
                 { label: "Category", value: category || "Missing", ok: !!category },
                 { label: "Thumbnail", value: thumbnail ? "Uploaded" : "Missing", ok: !!thumbnail },
                 { label: "Curriculum", value: `${sections.length} Sections`, ok: sections.length > 0 },
                 { label: "Quizzes", value: `${quizzes.length} Quizzes`, ok: quizzes.length > 0 },
                 { label: "Price", value: `PKR ${price}`, ok: !!price },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                   <div className="flex items-center gap-3">
                     <span className={`text-sm font-bold ${item.ok ? "text-gray-900" : "text-red-400"}`}>{item.value}</span>
                     {item.ok ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Loader2 className="w-5 h-5 text-gray-200" />}
                   </div>
                 </div>
               ))}
             </div>

             <div className="flex gap-4">
               <button className="flex-1 py-4 bg-gray-50 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100 hover:bg-gray-100 transition-all">Save Draft</button>
               <button 
                onClick={handlePublish}
                disabled={loading}
                className="flex-[2] py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-600 transition-all flex items-center justify-center gap-2"
               >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>🚀 Publish Course</>}
               </button>
             </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center px-4">
         <button 
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
          className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary disabled:opacity-30 transition-colors"
         >
           ← Back
         </button>
         {step < 5 && (
           <button 
            onClick={() => setStep(s => Math.min(5, s + 1))}
            className="bg-white border border-gray-100 px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-primary/20 transition-all"
           >
             Continue
           </button>
         )}
      </div>
    </div>
  );
}
