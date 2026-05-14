"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, User, Mail, Globe, Linkedin, Youtube, 
  Lock, Eye, EyeOff, ShieldCheck, Star, Github, ExternalLink,
  Sparkles, Award, MapPin, Briefcase, Video,
  Upload, CheckCircle2, AlertCircle, Loader2, X, Plus,
  GraduationCap, Play, Phone, Map, Languages
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TeacherProfile() {
  const { refreshDbUser, dbUser } = useAuth();
  const [tab, setTab] = useState<"profile" | "security" | "schedule">("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    specialization: "",
    experience: "",
    introVideo: "",
    hourlyRate: 0,
    availableDays: [] as string[],
    qualification: "",
    phoneNumber: "",
    city: "",
    gender: "",
    language: "",
    linkedin: "",
    youtube: "",
    github: "",
    portfolio: "",
    education: "",
    workHistory: "",
    profilePicture: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/teacher/profile");
      setUser(res.data);
      setFormData({
        name: res.data.name || "",
        bio: res.data.bio || "",
        specialization: res.data.specialization || "",
        experience: res.data.experience || "",
        introVideo: res.data.introVideo || "",
        hourlyRate: res.data.hourlyRate || 0,
        availableDays: res.data.availableDays || [],
        qualification: res.data.qualification || "",
        phoneNumber: res.data.phoneNumber || "",
        city: res.data.city || "",
        gender: res.data.gender || "",
        language: res.data.language || "",
        linkedin: res.data.linkedin || "",
        youtube: res.data.youtube || "",
        github: res.data.github || "",
        portfolio: res.data.portfolio || "",
        education: res.data.education || "",
        workHistory: res.data.workHistory || "",
        profilePicture: res.data.profilePicture || ""
      });
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const isImageMandatory = !user?.profilePicture;
    if (isImageMandatory) {
      toast.error("Profile picture is mandatory. Please upload one first.");
      setTab("profile");
      return;
    }

    const toastId = toast.loading("Synchronizing profile...");
    try {
      setSaving(true);
      await api.put("/teacher/profile", formData);
      await refreshDbUser();
      toast.success("Profile synchronized with academic systems!", { id: toastId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading identity image...");
    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);
      const res = await api.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const updatedUrl = res.data.url;
      setUser({ ...user, profilePicture: updatedUrl });
      setFormData({ ...formData, profilePicture: updatedUrl });
      
      await api.put("/teacher/profile", { ...formData, profilePicture: updatedUrl });
      await refreshDbUser();
      
      toast.success("Identity image verified!", { id: toastId });
    } catch (err) {
      toast.error("Image upload failed.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Max size 50MB allowed.");
      return;
    }

    const toastId = toast.loading("Uploading intro video...");
    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);
      const res = await api.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData({ ...formData, introVideo: res.data.url });
      toast.success("Intro video updated!", { id: toastId });
    } catch (err) {
      toast.error("Video upload failed.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const toggleDay = (day: string) => {
    const next = formData.availableDays.includes(day)
      ? formData.availableDays.filter(d => d !== day)
      : [...formData.availableDays, day];
    setFormData({ ...formData, availableDays: next });
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Faculty Profile...</p>
    </div>
  );

  const isComplete = user?.isProfileComplete;

  return (
    <div className="max-w-4xl space-y-10 pb-32">
      {/* Warning if profile incomplete */}
      <AnimatePresence>
        {!isComplete && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4 overflow-hidden"
          >
            <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                <AlertCircle className="w-5 h-5" />
            </div>
            <div>
                <h4 className="font-black text-amber-900 text-sm uppercase tracking-tight">Mandatory Profile Completion Required</h4>
                <p className="text-amber-700 text-xs font-bold mt-1 leading-relaxed">
                    Complete your profile and upload an introductory video to publish courses.
                </p>
                <div className="flex gap-4 mt-3">
                    <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${user?.profilePicture ? "text-emerald-600" : "text-amber-400"}`}>
                        <CheckCircle2 className="w-3 h-3" /> Identity Image
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${formData.bio ? "text-emerald-600" : "text-amber-400"}`}>
                        <CheckCircle2 className="w-3 h-3" /> Bio
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${formData.specialization ? "text-emerald-600" : "text-amber-400"}`}>
                        <CheckCircle2 className="w-3 h-3" /> Specialization
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${formData.introVideo ? "text-emerald-600" : "text-amber-400"}`}>
                        <CheckCircle2 className="w-3 h-3" /> Intro Video
                    </span>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-primary-100">
            <User className="w-3.5 h-3.5" />
            <span>Faculty Credentials</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Account Settings</h1>
          <p className="text-gray-400 text-[11px] font-bold mt-1 uppercase tracking-widest">Manage your elite academic presence</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
          >
            <Eye className="w-4 h-4" /> Preview Profile
          </button>
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          {(["profile", "security", "schedule"] as const).map((t) => (
            <button 
              key={t} 
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === t 
                  ? "bg-white text-primary shadow-sm border border-gray-100" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t === "schedule" ? "Availability" : t}
            </button>
          ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-primary/5 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-box-pattern opacity-[0.03]" />
            <div className="relative z-10">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="w-full h-full rounded-2xl bg-primary text-white flex items-center justify-center font-black text-3xl shadow-2xl overflow-hidden relative group">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Profile" />
                    ) : (
                      user?.name?.charAt(0)
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-primary/80 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                      </div>
                    )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-lg hover:text-primary transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">{user?.name}</h2>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">{user?.specialization || "Academy Member"}</p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl shadow-gray-200">
             <div className="absolute inset-0 bg-box-pattern opacity-[0.1]" />
             <Video className="w-12 h-12 text-white/20 mb-4" />
             <h4 className="text-[11px] font-black uppercase tracking-widest mb-2">Intro Video</h4>
             <p className="text-[10px] text-white/50 leading-relaxed font-bold">
               Increase enrollment by <span className="text-white">85%</span> with a high-quality video introduction.
             </p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-2">
          {tab === "profile" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <form onSubmit={handleUpdate} className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-primary/5 p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:bg-white transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specialty <span className="text-primary">*</span></label>
                    <input 
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      placeholder="e.g. Mathematics O/A Level"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:bg-white transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Experience (Years) <span className="text-primary">*</span></label>
                    <input 
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:bg-white transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Highest Qualification</label>
                    <input 
                      value={formData.qualification}
                      onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:bg-white transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input 
                        value={formData.phoneNumber} 
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:bg-white transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City / Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input 
                        value={formData.city} 
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:bg-white transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Language</label>
                    <div className="relative">
                      <Languages className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input 
                        value={formData.language} 
                        onChange={(e) => setFormData({...formData, language: e.target.value})}
                        className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:bg-white transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:bg-white transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">LinkedIn Profile</label>
                      <input value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Github Profile</label>
                      <input value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold" />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bio <span className="text-primary">*</span></label>
                    <textarea rows={4} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold resize-none" />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Intro Video</label>
                    <div 
                      onClick={() => videoInputRef.current?.click()}
                      className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all relative overflow-hidden"
                    >
                      {formData.introVideo ? (
                        <video src={formData.introVideo} className="w-full h-full object-cover" controls />
                      ) : (
                        <div className="text-center">
                          <Video className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Click to upload faculty intro</p>
                        </div>
                      )}
                    </div>
                    <input type="file" ref={videoInputRef} onChange={handleVideoUpload} className="hidden" accept="video/*" />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Educational Background</label>
                    <textarea rows={3} value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold resize-none" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Work History</label>
                    <textarea rows={3} value={formData.workHistory} onChange={(e) => setFormData({...formData, workHistory: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold resize-none" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={saving || uploading}
                  className="px-10 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95"
                >
                   {saving ? "Synchronizing..." : "Synchronize Profile"}
                </button>
              </form>
            </motion.div>
          )}

          {tab === "security" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-xl shadow-primary/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Security updates are handled via secure email workflow.</p>
            </motion.div>
          )}

          {tab === "schedule" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-8 shadow-xl shadow-primary/5">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weekly Commitment</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {days.map((day) => (
                    <button key={day} onClick={() => toggleDay(day)} className={`py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.availableDays.includes(day) ? "border-primary bg-primary-50 text-primary" : "border-gray-100 text-gray-400"}`}>
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hourly Rate (PKR)</label>
                <input type="number" value={formData.hourlyRate} onChange={(e) => setFormData({...formData, hourlyRate: parseInt(e.target.value) || 0})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold" />
              </div>
              <button onClick={() => handleUpdate()} className="px-10 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Save Availability</button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Faculty Preview Modal (Matching the Public Profile Design) */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPreview(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Left: Immersive Visuals */}
              <div className="md:w-2/5 bg-gray-900 relative">
                <div className="absolute inset-0 bg-box-pattern opacity-[0.1]" />
                {user?.profilePicture ? (
                  <img src={user.profilePicture} className="w-full h-full object-cover opacity-70" alt="Profile" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl font-black text-white/10 uppercase">
                    {user?.name?.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                   <div className="flex items-center gap-2 mb-3">
                     <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                     <span className="text-white text-[10px] font-black uppercase tracking-widest">Top Rated Faculty Member</span>
                   </div>
                   <h2 className="text-4xl font-black text-white tracking-tight leading-tight">{user?.name}</h2>
                   <p className="text-primary text-xs font-black uppercase tracking-[0.2em] mt-2">{formData.specialization}</p>
                </div>
              </div>

              {/* Right: Portfolio Details */}
              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-12">
                   <div className="flex gap-8">
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Experience</p>
                        <p className="text-2xl font-black text-gray-900">{formData.experience || "0"}y+</p>
                      </div>
                      <div className="w-px h-10 bg-gray-100" />
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Students</p>
                        <p className="text-2xl font-black text-gray-900">1.2k+</p>
                      </div>
                   </div>
                   <div className="px-6 py-3 bg-primary/10 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest border border-primary/20">
                     PKR {formData.hourlyRate}{"/hr"}
                   </div>
                </div>

                <div className="space-y-12">
                   <section>
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 mb-4 border-l-4 border-primary pl-4">The Academic Philosophy</h4>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {formData.bio || "No biography provided yet."}
                      </p>
                   </section>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                           <GraduationCap className="w-3.5 h-3.5" /> Education
                         </h4>
                         <p className="text-xs text-gray-700 font-bold leading-relaxed whitespace-pre-wrap">
                           {formData.education || "Academic credentials available on request."}
                         </p>
                      </div>
                      <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                           <Briefcase className="w-3.5 h-3.5" /> Work History
                         </h4>
                         <p className="text-xs text-gray-700 font-bold leading-relaxed whitespace-pre-wrap">
                           {formData.workHistory || "Professional journey shared privately."}
                         </p>
                      </div>
                   </div>

                   {formData.introVideo && (
                     <section>
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 mb-6">Introduction Video</h4>
                        <div className="aspect-video bg-gray-900 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                          <video src={formData.introVideo} className="w-full h-full object-cover opacity-60" controls />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl group-hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 fill-primary" />
                             </div>
                          </div>
                        </div>
                     </section>
                   )}

                   <div className="pt-10 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex gap-3">
                         {[
                           { icon: Linkedin, val: formData.linkedin },
                           { icon: Github, val: formData.github },
                           { icon: Youtube, val: formData.youtube },
                           { icon: ExternalLink, val: formData.portfolio }
                         ].filter(s => s.val).map((social, i) => (
                           <div key={i} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                             <social.icon className="w-4 h-4" />
                           </div>
                         ))}
                      </div>
                      <button className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                        Book Consultation
                      </button>
                   </div>
                </div>
              </div>

              {/* Close Overlay */}
              <button 
                onClick={() => setShowPreview(false)}
                className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white md:text-gray-400 md:bg-gray-100 transition-all shadow-xl"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
