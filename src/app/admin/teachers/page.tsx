"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Brain, Plus, Search, Filter, Star, 
  Edit, Trash2, Mail, Phone, BookOpen, 
  Users, Award, Loader2, AlertCircle,
  Globe, Github, Linkedin, Youtube, GraduationCap
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import SlideOverlay from "@/components/ui/SlideOverlay";

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    specialization: "", 
    education: "", 
    experience: "",
    socialLinks: { linkedin: "", youtube: "", github: "" }
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = (teacher.name || "").toLowerCase().includes(search.toLowerCase()) || 
                         (teacher.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || (statusFilter === "Active" ? teacher.isActive !== false : teacher.isActive === false);
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (teacher: any) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name || "",
      email: teacher.email || "",
      specialization: teacher.specialization || "",
      education: teacher.education || "",
      experience: teacher.experience || "",
      socialLinks: {
        linkedin: teacher.socialLinks?.linkedin || "",
        youtube: teacher.socialLinks?.youtube || "",
        github: teacher.socialLinks?.github || ""
      }
    });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!editingTeacher) return;
    const toastId = toast.loading("Updating faculty credentials...");
    try {
      setSaving(true);
      await api.patch(`/admin/teachers/${editingTeacher._id}`, formData);
      toast.success("Faculty profile synchronized.", { id: toastId });
      setIsFormOpen(false);
      fetchTeachers();
    } catch (err) {
      toast.error("Synchronization failed.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    setEditingTeacher(null);
    setFormData({ name: "", email: "", subject: "", courses: "" });
    setIsFormOpen(true);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Faculty Records...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
            <Brain className="w-10 h-10 text-primary" />
            Faculty Management
          </h1>
          <p className="text-gray-500 font-medium">{teachers.length} professional instructors</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:bg-primary-600 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Teacher
        </motion.button>
      </motion.div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by name, email or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-gray-900"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-gray-900 appearance-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Faculty</option>
            <option value="Inactive">Inactive / Suspended</option>
          </select>
        </div>
      </div>

      {/* Teachers Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredTeachers.map((teacher, i) => (
          <motion.div
            key={teacher._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="bg-white rounded-[2rem] border border-gray-100 p-8 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform">
                <span className="font-black text-2xl">{teacher.name?.charAt(0)}</span>
              </div>
              <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                teacher.isActive !== false
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-gray-50 text-gray-400 border-gray-100"
              }`}>
                {teacher.isActive !== false ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-black text-gray-900 mb-1 tracking-tight">{teacher.name}</h3>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{teacher.specialization || "Senior Instructor"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 py-6 border-y border-gray-50">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Courses</p>
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary opacity-30" />
                    <p className="text-xl font-black text-gray-900">{teacher.courseCount || 0}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Students</p>
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary opacity-30" />
                    <p className="text-xl font-black text-gray-900">{teacher.studentCount || 0}</p>
                </div>
              </div>
            </div>

            {/* Course List */}
            {teacher.courses && teacher.courses.length > 0 && (
              <div className="mb-6">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Teaching Portfolio</p>
                <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                  {teacher.courses.map((course: any) => (
                    <div key={course._id} className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-700 truncate">{course.title}</p>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md flex-shrink-0 ${
                        course.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                        course.status === 'Rejected' ? 'bg-rose-50 text-rose-500' :
                        'bg-amber-50 text-amber-600'
                      }`}>{course.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleEdit(teacher)}
                className="flex-1 px-4 py-3.5 bg-gray-50 text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all"
              >
                Profile
              </button>
              <button
                className="p-3.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredTeachers.length === 0 && (
          <div className="py-20 text-center">
              <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No faculty matches found</p>
          </div>
      )}

      {/* Add/Edit Teacher Form */}
      <SlideOverlay
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingTeacher ? "Refine Faculty Profile" : "Onboard New Faculty"}
        subtitle={editingTeacher ? "Update credentials and specialization" : "Add a new professional instructor to the academy"}
      >
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity</label>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">System Email</label>
            <input
              type="email"
              placeholder="email@edupro.academy"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specialization</label>
            <input
              type="text"
              placeholder="e.g. Advanced Mathematics, Web Systems"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Academic Credentials (Education)</label>
            <textarea
              placeholder="PhD in Mathematics, MIT..."
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all min-h-[100px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Professional Trajectory (Experience)</label>
            <textarea
              placeholder="10+ years at Stanford University..."
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Digital Footprint (Socials)</label>
            <div className="grid grid-cols-3 gap-3">
               <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                  <input 
                    placeholder="LinkedIn"
                    value={formData.socialLinks.linkedin}
                    onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold focus:outline-none" 
                  />
               </div>
               <div className="relative">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-900" />
                  <input 
                    placeholder="GitHub"
                    value={formData.socialLinks.github}
                    onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, github: e.target.value}})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold focus:outline-none" 
                  />
               </div>
               <div className="relative">
                  <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                  <input 
                    placeholder="YouTube"
                    value={formData.socialLinks.youtube}
                    onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, youtube: e.target.value}})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold focus:outline-none" 
                  />
               </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving || !editingTeacher}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl transition-all mt-8 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingTeacher ? "Synchronize Changes" : "Confirm Onboarding")}
          </motion.button>

          <button
            onClick={() => setIsFormOpen(false)}
            className="w-full py-4 bg-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all"
          >
            Cancel Session
          </button>
        </div>
      </SlideOverlay>
    </div>
  );
}
