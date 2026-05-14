"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, Search, Plus, Edit, Trash2, 
  Eye, Filter, Mail, Phone, Calendar, 
  BookOpen, Loader2, AlertCircle 
} from "lucide-react";
import api from "@/lib/api";
import SlideOverlay from "@/components/ui/SlideOverlay";

export default function AdminStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", enrolledCourses: "" });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = (student.name || "").toLowerCase().includes(search.toLowerCase()) || 
                         (student.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || (statusFilter === "Active" ? student.isActive !== false : student.isActive === false);
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      enrolledCourses: student.enrolledCourses?.length?.toString() || "0"
    });
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setFormData({ name: "", email: "", phone: "", enrolledCourses: "" });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) return toast.error("Name and Email are required.");
    
    const toastId = toast.loading(editingStudent ? "Synchronizing manifest..." : "Onboarding learner...");
    try {
      if (editingStudent) {
        await api.patch(`/admin/students/${editingStudent._id}`, formData);
        toast.success("Student manifest updated.", { id: toastId });
      } else {
        await api.post("/admin/students", formData);
        toast.success("Student successfully onboarded.", { id: toastId });
      }
      setIsFormOpen(false);
      fetchStudents();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed", { id: toastId });
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Student Manifest...</p>
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
            <Users className="w-10 h-10 text-primary" />
            Global Learner Directory
          </h1>
          <p className="text-gray-500 font-medium">{students.length} active enrollments</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:bg-primary-600 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Student
        </motion.button>
      </motion.div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
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
            <option value="Active">Active Learners</option>
            <option value="Inactive">Inactive / Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-2xl shadow-primary/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Student Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Manifest</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Registered</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-black group-hover:bg-primary group-hover:text-white transition-all">
                            {student.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="font-black text-gray-900 text-sm mb-1">{student.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{student.email}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary opacity-30" />
                        <span className="text-sm font-black text-gray-900">
                            {student.enrolledCourses?.length || 0} <span className="text-[10px] text-gray-400 font-bold uppercase ml-1">Courses</span>
                        </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      student.isActive !== false
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-gray-50 text-gray-400 border-gray-100"
                    }`}>
                      {student.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5 opacity-30" />
                        {new Date(student.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-xl transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
              <div className="py-20 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No learner matches found</p>
              </div>
          )}
        </div>
      </div>

      {/* Add/Edit Student Form */}
      <SlideOverlay
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingStudent ? "Synchronize Enrollment" : "Register Global Learner"}
        subtitle={editingStudent ? "Update student status and manifest" : "Onboard a new student into the EduPro ecosystem"}
      >
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity</label>
            <input
              type="text"
              placeholder="Student Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Communication Channel</label>
            <input
              type="email"
              placeholder="learner@global.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Protocol</label>
            <input
              type="tel"
              placeholder="+92 XXX XXXXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl transition-all mt-8"
          >
            {editingStudent ? "Update Manifest" : "Confirm Enrollment"}
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
