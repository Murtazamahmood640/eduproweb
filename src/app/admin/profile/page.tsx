"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  User, ShieldCheck, Mail, Camera, Loader2,
  Lock, Eye, EyeOff, CheckCircle2, Award, X,
  Briefcase, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function AdminProfile() {
  const { dbUser, refreshDbUser } = useAuth();
  const [tab, setTab] = useState<"account" | "security">("account");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    city: ""
  });

  useEffect(() => {
    if (dbUser) {
      setFormData({
        name: dbUser.name || "",
        phoneNumber: dbUser.phoneNumber || "",
        city: dbUser.city || ""
      });
    }
  }, [dbUser]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Updating system credentials...");
    try {
      setSaving(true);
      await api.put("/users/profile", formData);
      await refreshDbUser();
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (err) {
      toast.error("Update failed.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading system avatar...");
    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);
      const res = await api.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      await api.put("/users/profile", { profilePicture: res.data.url });
      await refreshDbUser();
      toast.success("Avatar updated!", { id: toastId });
    } catch (err) {
      toast.error("Upload failed.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match.");
    }
    const toastId = toast.loading("Securing account...");
    try {
      await api.post("/admin/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      setPasswords({ current: "", new: "", confirm: "" });
      toast.success("Password secured successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update password.", { id: toastId });
    }
  };

  if (!dbUser) return null;

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-primary-100">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>System Administration</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase tracking-[0.1em]">Administrative Profile</h1>
        <p className="text-gray-400 text-[11px] font-bold mt-1 uppercase tracking-widest">Manage your privileged access and credentials</p>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 w-fit">
        {(["account", "security"] as const).map((t) => (
          <button 
            key={t} 
            onClick={() => setTab(t)}
            className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              tab === t 
                ? "bg-white text-primary shadow-sm border border-gray-100" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sidebar Summary */}
        <div className="space-y-6">
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
              <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">{dbUser.name}</h2>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">{dbUser.role}</p>
              
              <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                   <span className="text-gray-400">ID</span>
                   <span className="text-gray-900">{dbUser.userId}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                   <span className="text-gray-400">Security</span>
                   <span className="text-emerald-500 flex items-center gap-1">
                     <ShieldCheck className="w-3 h-3" /> Hardened
                   </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-2">
          {tab === "account" && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-primary/5 p-8 md:p-10">
              <h3 className="text-lg font-black text-gray-900 tracking-tight mb-8 uppercase tracking-[0.05em]">Profile Information</h3>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                      <input 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all" 
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email (Immutable)</label>
                      <input disabled value={dbUser.email} className="w-full px-5 py-4 bg-gray-100 border border-gray-100 rounded-xl text-sm font-bold text-gray-400 cursor-not-allowed" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                      <input 
                        value={formData.phoneNumber} 
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all" 
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Work City</label>
                      <input 
                        value={formData.city} 
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all" 
                      />
                   </div>
                </div>
                <div className="pt-6 border-t border-gray-50">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="px-10 py-4 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                  >
                    {saving ? "Synchronizing..." : "Update Credentials"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {tab === "security" && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-primary/5 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase tracking-[0.05em]">Access Security</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Update your platform access keys</p>
                 </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                {[
                  { id: "current", label: "Current Master Password", val: passwords.current },
                  { id: "new", label: "New secure Password", val: passwords.new },
                  { id: "confirm", label: "Confirm New Password", val: passwords.confirm }
                ].map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{field.label}</label>
                    <div className="relative">
                      <input 
                        type={showPass[field.id as keyof typeof showPass] ? "text" : "password"}
                        value={field.val}
                        onChange={(e) => setPasswords({ ...passwords, [field.id]: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPass({ ...showPass, [field.id]: !showPass[field.id as keyof typeof showPass] })}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                      >
                        {showPass[field.id as keyof typeof showPass] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="pt-6">
                  <button type="submit" className="w-full py-4 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-200">
                    Harden Account Access
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
