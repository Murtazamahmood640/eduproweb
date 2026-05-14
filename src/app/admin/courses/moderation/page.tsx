"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle, XCircle, Play, FileText, Layout, 
  ShieldCheck, AlertTriangle, Eye, ArrowRight, Loader2,
  Brain, ClipboardCheck, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import toast from "react-hot-toast";
import SlideOverlay from "@/components/ui/SlideOverlay";

type AuditTab = "courses" | "quizzes" | "assignments";

export default function GlobalAuditHub() {
  const [activeTab, setActiveTab] = useState<AuditTab>("courses");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [moderating, setModerating] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingData();
  }, [activeTab]);

  const fetchPendingData = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === "courses" ? "/admin/courses" : 
                      activeTab === "quizzes" ? "/admin/quizzes" : "/admin/assignments";
      const res = await api.get(`${endpoint}?status=Pending`);
      setData(res.data);
      setSelectedItem(null);
    } catch (err) {
      toast.error(`Failed to load ${activeTab} queue.`);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: "Approved" | "Rejected") => {
    const reason = status === "Rejected" ? prompt("Please provide a rejection reason:") : "";
    if (status === "Rejected" && !reason) return;

    try {
      setModerating(true);
      const endpoint = activeTab === "courses" ? `/admin/courses/${id}/status` :
                      activeTab === "quizzes" ? `/admin/quizzes/${id}/status` :
                      `/admin/assignments/${id}/status`;
      
      await api.patch(endpoint, { status, rejectionReason: reason });
      toast.success(`${activeTab.slice(0, -1)} ${status.toLowerCase()} successfully!`);
      setSelectedItem(null);
      fetchPendingData();
    } catch (err) {
      toast.error("Moderation action failed.");
    } finally {
      setModerating(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Scanning Global Audit Manifest...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 uppercase tracking-widest">Global Audit Hub</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
            Academic verification and content quality assurance
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">Authorized Administrator</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl w-fit">
        {(["courses", "quizzes", "assignments"] as AuditTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? "bg-white text-gray-900 shadow-md shadow-gray-200/50" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Queue */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pending {activeTab}</h2>
          {data.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center">
              <Sparkles className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Queue is Clear</p>
            </div>
          ) : (
            data.map((item) => (
              <button 
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className={`w-full text-left p-6 rounded-2xl border transition-all group ${
                  selectedItem?._id === item._id ? "bg-white border-primary shadow-xl ring-4 ring-primary/5" : "bg-white border-slate-100 hover:border-primary/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {activeTab === "courses" ? (
                      <img src={item.thumbnail || "/course-placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                    ) : activeTab === "quizzes" ? (
                      <Brain className="w-6 h-6 text-primary" />
                    ) : (
                      <FileText className="w-6 h-6 text-emerald-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-tight mb-1 truncate">{item.title}</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-3">
                        Course: {activeTab === "courses" ? (item.instructor?.name || "Faculty") : (item.course?.title || "N/A")}
                    </p>
                    <div className="flex items-center gap-3">
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">
                         Audit Required
                       </span>
                       <span className="text-[8px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                         Review <ArrowRight className="w-3 h-3" />
                       </span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <SlideOverlay
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={`Academic Audit: ${selectedItem?.title || "Content"}`}
        subtitle={activeTab === "courses" ? "Masterclass Verification" : "Assessment Review"}
      >
        <div className="space-y-10 py-4">
            {/* Action Buttons */}
            <div className="flex gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 pb-8 border-b border-gray-100">
                <button 
                  onClick={() => handleAction(selectedItem?._id, "Rejected")}
                  disabled={moderating}
                  className="flex-1 py-4 bg-white border-2 border-rose-100 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Reject Content
                </button>
                <button 
                  onClick={() => handleAction(selectedItem?._id, "Approved")}
                  disabled={moderating}
                  className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Approve for Global Launch
                </button>
            </div>

            {/* Content Details */}
            <div className="space-y-8">
                {selectedItem && (
                    <>
                    {activeTab === "courses" ? (
                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Introductory Audit</label>
                                <div className="aspect-video bg-slate-900 rounded-[2rem] border-8 border-slate-100 shadow-2xl flex items-center justify-center relative overflow-hidden">
                                    {activeVideo || selectedItem.introVideoUrl ? (
                                        <video key={activeVideo || selectedItem.introVideoUrl} src={activeVideo || selectedItem.introVideoUrl} controls className="w-full h-full object-contain" />
                                    ) : (
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">No video asset provided</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Instructional Philosophy</label>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    {selectedItem.description}
                                </p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Curriculum Manifest</label>
                                <div className="space-y-2">
                                    {selectedItem.outline?.map((item: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between group hover:border-primary transition-all">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 text-[10px] font-black flex items-center justify-center border border-slate-100">{idx + 1}</span>
                                                <p className="font-black text-slate-900 text-[11px] uppercase tracking-tight truncate">{item.title}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {item.videoUrl && <button onClick={() => setActiveVideo(item.videoUrl)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-primary hover:text-white transition-all"><Play className="w-3.5 h-3.5" /></button>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : activeTab === "quizzes" ? (
                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Questionnaire Review ({selectedItem.questions?.length} items)</label>
                            <div className="space-y-4">
                                {selectedItem.questions?.map((q: any, i: number) => (
                                    <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                                        <p className="font-black text-gray-900 text-sm">Q{i+1}: {q.question}</p>
                                        <div className="space-y-2">
                                            {q.options.map((opt: string, oi: number) => (
                                                <div key={oi} className={`px-4 py-2 rounded-lg text-[10px] font-bold border ${oi === q.correctAnswer ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-gray-100 text-gray-400"}`}>
                                                    {opt} {oi === q.correctAnswer && "✓"}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Assignment Manifest & Brief</label>
                            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                    <FileText className="w-32 h-32" />
                                </div>
                                <p className="text-slate-600 font-medium leading-relaxed mb-10 text-lg">
                                   "{selectedItem.description}"
                                </p>
                                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                           <CheckCircle className="w-3 h-3 text-emerald-500" /> Point Valuation
                                        </p>
                                        <p className="text-2xl font-black text-slate-900">{selectedItem.points} <span className="text-xs text-slate-400 font-bold">Credits</span></p>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                           <Layout className="w-3 h-3 text-primary" /> Module Mapping
                                        </p>
                                        <p className="text-lg font-black text-slate-900 uppercase tracking-tight">Module {selectedItem.moduleIndex + 1}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    </>
                )}
            </div>
        </div>
      </SlideOverlay>
    </div>
  );
}

