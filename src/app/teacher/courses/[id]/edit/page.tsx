"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { 
  ChevronRight, BookOpen, List, DollarSign, 
  Eye, CheckCircle, Plus, Trash2, GripVertical, 
  Video, FileText, Upload, Loader2, BrainCircuit
} from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const steps = [
  { id: 1, label: "Basic Info", icon: BookOpen },
  { id: 2, label: "Curriculum", icon: List },
  { id: 3, label: "Pricing", icon: DollarSign },
  { id: 4, label: "Review", icon: Eye },
];

const categories = ["Web Development", "UI/UX Design", "Data Science", "Digital Marketing", "Business", "Photography"];
const levels = ["Beginner", "Intermediate", "Advanced"];

export default function EditCourse() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [introVideo, setIntroVideo] = useState("");
  const [price, setPrice] = useState("");

  const [sections, setSections] = useState<any[]>([
    { title: "Introduction", lessons: [{ title: "Course Overview", videoUrl: "", pdfUrl: "", textContent: "", assignment: null }] },
  ]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`);
        const c = res.data;
        setTitle(c.title);
        setDescription(c.description);
        setCategory(c.category || "");
        setLevel(c.level || "");
        setThumbnail(c.thumbnail || "");
        setIntroVideo(c.introVideoUrl || "");
        setPrice(c.price.toString());
        
        // Map outline to sections (for now simple flat mapping)
        if (c.outline?.length > 0) {
            setSections([{
                title: "Curriculum Architecture",
                lessons: c.outline.map((l: any) => ({
                    ...l,
                    assignment: l.assignment || null
                }))
            }]);
        }
      } catch (err) {
        console.error("Error fetching course for edit:", err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  const handleFileUpload = async (file: File, type: string, sectionIndex?: number, lessonIndex?: number) => {
    try {
      setUploading(type);
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
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

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const courseData = {
        title,
        description,
        price: Number(price),
        thumbnail,
        introVideoUrl: introVideo,
        outline: sections.flatMap(s => s.lessons.map((l: any) => ({ ...l, sectionTitle: s.title })))
      };

      await api.patch(`/courses/${courseId}`, courseData); // Need to ensure PATCH exists in backend
      toast.success("Course updated successfully!");
      router.push("/teacher/courses");
    } catch (err) {
      toast.error("Failed to update course.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10">
      <h1 className="text-3xl font-black text-gray-900">Edit Architecture</h1>
      
      {/* Basic Step logic reused from create page... but simplified for brevity in this scratch */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
         {step === 1 && (
            <div className="space-y-6">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-4 bg-gray-50 rounded-xl" />
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={5} className="w-full p-4 bg-gray-50 rounded-xl" />
                <button onClick={() => setStep(2)} className="btn-primary w-full py-4 rounded-xl">Next: Curriculum</button>
            </div>
         )}
         
         {step === 2 && (
            <div className="space-y-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Academic Roadmap</h2>
                  <button 
                    onClick={() => {
                        const updated = [...sections];
                        updated[0].lessons.push({ title: "New Lesson", videoUrl: "", pdfUrl: "", textContent: "", assignment: null });
                        setSections(updated);
                    }}
                    className="bg-primary text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Lesson
                  </button>
                </div>

                <div className="space-y-6">
                  {sections[0].lessons.map((lesson: any, li: number) => (
                      <div key={li} className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-6 relative group">
                          <button 
                            onClick={() => {
                                const updated = [...sections];
                                updated[0].lessons.splice(li, 1);
                                setSections(updated);
                            }}
                            className="absolute top-6 right-6 p-2 text-gray-300 hover:text-rose-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="max-w-md">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Lesson Title</label>
                            <input 
                              value={lesson.title} 
                              onChange={e => {
                                  const updated = [...sections];
                                  updated[0].lessons[li].title = e.target.value;
                                  setSections(updated);
                              }} 
                              className="w-full p-3 font-bold bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/10" 
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Video Upload */}
                              <div className="relative group/upload">
                                <div className={`flex items-center justify-between p-4 rounded-2xl border-2 border-dashed transition-all ${lesson.videoUrl ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-100 group-hover/upload:border-primary/30"}`}>
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lesson.videoUrl ? "bg-emerald-500 text-white" : "bg-gray-50 text-gray-400"}`}>
                                      <Video className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Video Lecture</span>
                                      <span className="text-[10px] font-bold text-gray-900 truncate max-w-[120px]">{lesson.videoUrl ? "Linked Ready" : "Unlinked"}</span>
                                    </div>
                                  </div>
                                  <div className="relative">
                                    <button className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${lesson.videoUrl ? "bg-emerald-500 text-white" : "bg-primary text-white"}`}>
                                      {uploading === "lessonVideo" ? <Loader2 className="w-3 h-3 animate-spin" /> : (lesson.videoUrl ? "Update" : "Upload")}
                                    </button>
                                    <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files && handleFileUpload(e.target.files[0], "lessonVideo", 0, li)} />
                                  </div>
                                </div>
                              </div>

                              {/* PDF Upload */}
                              <div className="relative group/upload">
                                <div className={`flex items-center justify-between p-4 rounded-2xl border-2 border-dashed transition-all ${lesson.pdfUrl ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-100 group-hover/upload:border-primary/30"}`}>
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lesson.pdfUrl ? "bg-emerald-500 text-white" : "bg-gray-50 text-gray-400"}`}>
                                      <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Digital Asset</span>
                                      <span className="text-[10px] font-bold text-gray-900 truncate max-w-[120px]">{lesson.pdfUrl ? "PDF Linked" : "Unlinked"}</span>
                                    </div>
                                  </div>
                                  <div className="relative">
                                    <button className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${lesson.pdfUrl ? "bg-emerald-500 text-white" : "bg-primary text-white"}`}>
                                      {uploading === "lessonPdf" ? <Loader2 className="w-3 h-3 animate-spin" /> : (lesson.pdfUrl ? "Update" : "Upload")}
                                    </button>
                                    <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files && handleFileUpload(e.target.files[0], "lessonPdf", 0, li)} />
                                  </div>
                                </div>
                              </div>
                          </div>

                          <div className="space-y-2">
                              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Reading Material</label>
                              <textarea 
                                value={lesson.textContent} 
                                onChange={e => {
                                    const updated = [...sections];
                                    updated[0].lessons[li].textContent = e.target.value;
                                    setSections(updated);
                                }} 
                                rows={3}
                                placeholder="Add lecture notes or context here..."
                                className="w-full p-4 bg-white border border-gray-100 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-primary/10 resize-none" 
                              />
                          </div>
                      </div>
                  ))}
                </div>

                <button onClick={() => setStep(3)} className="bg-primary text-white w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all">
                  Next: Pricing Model
                </button>
            </div>
         )}

         {step === 3 && (
             <div className="space-y-6">
                 <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl" />
                 <button onClick={() => setStep(4)} className="btn-primary w-full py-4 rounded-xl">Review</button>
             </div>
         )}

         {step === 4 && (
             <div className="space-y-6">
                 <p className="text-sm font-bold">Ready to update your masterclass?</p>
                 <button onClick={handleUpdate} className="btn-primary w-full py-4 rounded-xl">
                    {saving ? <Loader2 className="animate-spin" /> : "Update Course"}
                 </button>
             </div>
         )}
      </div>
    </div>
  );
}
