"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  User, Mail, Phone, Lock, Bell, Camera, 
  ShieldCheck, Eye, EyeOff, Globe, Edit3, 
  Settings, CreditCard, LogOut, Loader2,
  MapPin, CheckCircle2, Award, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SlideOver from "@/components/ui/SlideOver";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function StudentProfile() {
  const { dbUser, refreshDbUser } = useAuth();
  const [tab, setTab] = useState<"personal" | "security" | "notifications">("personal");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phoneNumber: "",
    city: "",
    language: "English (US)",
    gender: ""
  });

  useEffect(() => {
    if (dbUser) {
      setFormData({
        name: dbUser.name || "",
        bio: dbUser.bio || "",
        phoneNumber: dbUser.phoneNumber || "",
        city: dbUser.city || "",
        language: dbUser.language || "English (US)",
        gender: dbUser.gender || ""
      });
    }
  }, [dbUser]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Updating profile...");
    try {
      setSaving(true);
      await api.put("/users/profile", formData);
      await refreshDbUser();
      setIsEditOpen(false);
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to update profile", { id: toastId });
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
      
      await api.post("/users/profile", { profilePicture: res.data.url });
      await refreshDbUser();
      toast.success("Profile picture updated!", { id: toastId });
    } catch (err) {
      toast.error("Image upload failed.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  if (!dbUser) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Intelligence...</p>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight uppercase tracking-[0.1em]">Student Intelligence</h1>
          <p className="text-gray-400 text-[11px] font-bold mt-1 uppercase tracking-widest">Manage your identity, security, and learning preferences</p>
        </div>
        <button 
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200"
        >
          <Eye className="w-4 h-4" /> Preview Identity
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card & Tabs */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-primary/5 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-box-pattern opacity-[0.03]" />
            <div className="relative z-10">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="w-full h-full rounded-2xl bg-primary text-white flex items-center justify-center font-black text-3xl shadow-2xl overflow-hidden relative group">
                  {dbUser.profilePicture ? (
                    <img src={dbUser.profilePicture} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    dbUser.name?.charAt(0)
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
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-lg hover:text-primary transition-all"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">{dbUser.name}</h2>
              <p className="text-[10px] font-bold text-gray-400 mb-6 uppercase tracking-widest">{dbUser.email}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary text-[10px] font-black uppercase tracking-widest rounded-md border border-primary-100">
                <ShieldCheck className="w-3 h-3" />
                Verified Student
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="space-y-1">
            {[
              { id: "personal", label: "Personal Info", icon: User },
              { id: "security", label: "Security", icon: Lock },
              { id: "notifications", label: "Notifications", icon: Bell },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  tab === t.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/10" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </nav>

          <button 
            onClick={async () => {
              await logout();
              window.location.href = "/auth/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-2">
          {tab === "personal" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">Personal Details</h3>
                  <p className="text-xs text-gray-400 font-medium">Basic information used across the platform</p>
                </div>
                <button 
                  onClick={() => setIsEditOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 hover:text-primary border border-gray-100 rounded-lg text-xs font-bold transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-sm font-bold text-gray-900">{dbUser.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Email</p>
                  <p className="text-sm font-bold text-gray-900">{dbUser.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Phone</p>
                  <p className="text-sm font-bold text-gray-900">{dbUser.phoneNumber || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Language</p>
                  <p className="text-sm font-bold text-gray-900">{dbUser.language || "English (US)"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Bio</p>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {dbUser.bio || "No biography provided yet."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {tab === "security" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8"
            >
              <h3 className="text-lg font-black text-gray-900 tracking-tight mb-8">Update Password</h3>
              <div className="space-y-4 max-w-md">
                {[
                  { label: "Current Password", show: showOld, toggle: () => setShowOld(!showOld) },
                  { label: "New Password", show: showNew, toggle: () => setShowNew(!showNew) },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="text-xs font-bold text-gray-500 mb-1.5 block">{field.label}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                      <input 
                        type={field.show ? "text" : "password"} 
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all" 
                      />
                      <button type="button" onClick={field.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                        {field.show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-primary-600 transition-all shadow-lg shadow-primary/20">
                  Update Security
                </button>
              </div>
            </motion.div>
          )}

          {tab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8"
            >
              <h3 className="text-lg font-black text-gray-900 tracking-tight mb-8">Notification Settings</h3>
              <div className="space-y-4">
                {[
                  { label: "New course updates", desc: "Get notified when your trainers upload content", on: true },
                  { label: "Quiz reminders", desc: "Never miss a deadline for your assessments", on: true },
                  { label: "Direct messages", desc: "Notifications when trainers reply to your queries", on: false },
                ].map((notif, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                    <div className="max-w-xs">
                      <p className="text-sm font-bold text-gray-900">{notif.label}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{notif.desc}</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${notif.on ? "bg-primary" : "bg-gray-200"}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${notif.on ? "right-0.5" : "left-0.5"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* SlideOver Form */}
      <SlideOver 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)}
        title="Edit Personal Information"
        description="Your details will be updated across all portals"
      >
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Full Name</label>
              <input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary" 
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Phone Number</label>
              <input 
                value={formData.phoneNumber} 
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary" 
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Bio</label>
              <textarea 
                rows={4} 
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary resize-none" 
              />
            </div>
          </div>
          <div className="pt-6 border-t border-gray-50 flex gap-3">
            <button 
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="flex-1 py-3 bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* Student Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-gray-900 p-12 text-center relative">
                <div className="absolute inset-0 bg-box-pattern opacity-[0.1]" />
                <div className="relative z-10">
                   <div className="w-24 h-24 rounded-3xl bg-primary mx-auto mb-6 shadow-2xl overflow-hidden border-4 border-white/10">
                      {dbUser.profilePicture ? (
                        <img src={dbUser.profilePicture} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white">{dbUser.name?.charAt(0)}</div>
                      )}
                   </div>
                   <h2 className="text-2xl font-black text-white tracking-tight uppercase">{dbUser.name}</h2>
                   <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-1">Verified Student · {dbUser.userId}</p>
                </div>
              </div>

              <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-white">
                 <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Courses</p>
                       <p className="text-lg font-black text-gray-900">12</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Progress</p>
                       <p className="text-lg font-black text-gray-900">85%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Certificates</p>
                       <p className="text-lg font-black text-gray-900">4</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <section>
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                          <User className="w-3 h-3 text-primary" /> About Me
                       </h4>
                       <p className="text-sm text-gray-600 leading-relaxed font-medium">
                         {dbUser.bio || "No biography provided yet."}
                       </p>
                    </section>
                    <section>
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-primary" /> Region
                       </h4>
                       <p className="text-xs text-gray-900 font-black uppercase tracking-widest">
                         {dbUser.city || "Not specified"}
                       </p>
                    </section>
                 </div>
              </div>

              <button 
                onClick={() => setShowPreview(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white transition-all border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
