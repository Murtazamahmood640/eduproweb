"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Search, Filter, Plus, Users, 
  Edit, Trash2, CheckCircle, XCircle, Clock,
  MoreVertical, ChevronRight, AlertCircle, Loader2
} from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import SlideOverlay from "@/components/ui/SlideOverlay";

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingCourseId, setRejectingCourseId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (courseId: string, status: string, reason?: string) => {
    const toastId = toast.loading(`${status === 'Approved' ? 'Approving' : 'Rejecting'} course...`);
    try {
      setActionLoading(courseId);
      await api.patch(`/admin/courses/${courseId}/status`, { status, rejectionReason: reason });
      await fetchCourses();
      setShowRejectModal(false);
      setRejectionReason("");
      setRejectingCourseId(null);
      toast.success(`Course ${status.toLowerCase()} successfully.`, { id: toastId });
    } catch (err) {
      toast.error("Failed to update course status.", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                         (course.instructor?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Curriculum Data...</p>
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
            <BookOpen className="w-10 h-10 text-primary" />
            Curriculum Control
          </h1>
          <p className="text-gray-500 font-medium">{courses.length} total courses in database</p>
        </div>
        <div className="flex gap-3">
            <Link href="/teacher/courses/create">
                <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:bg-primary-600 transition-all"
                >
                <Plus className="w-4 h-4" /> Create Course
                </motion.button>
            </Link>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by course title or instructor..."
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
            <option value="Pending">Pending Approval</option>
            <option value="Approved">Approved / Live</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-2xl shadow-primary/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Course Architecture</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Instructor</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCourses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                            {course.thumbnail ? <img src={course.thumbnail} className="w-full h-full object-cover" /> : <BookOpen className="w-full h-full p-3 text-gray-300" />}
                        </div>
                        <div>
                            <p className="font-black text-gray-900 text-sm mb-1">{course.title}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PKR {course.price?.toLocaleString()}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-[10px]">
                            {course.instructor?.name?.[0] || 'T'}
                        </div>
                        <p className="text-sm font-bold text-gray-600">{course.instructor?.name || 'EduPro Teacher'}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      course.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      course.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {course.status === 'Approved' && <CheckCircle className="w-3 h-3" />}
                      {course.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                      {course.status === 'Pending' && <Clock className="w-3 h-3 animate-pulse" />}
                      {course.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {course.status !== 'Approved' && (
                            <button 
                              onClick={() => handleStatusUpdate(course._id, 'Approved')}
                              disabled={actionLoading === course._id}
                              className="px-4 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                            >
                              Approve
                            </button>
                          )}
                          {course.status !== 'Rejected' && (
                            <button 
                              onClick={() => {
                                setRejectingCourseId(course._id);
                                setShowRejectModal(true);
                              }}
                              disabled={actionLoading === course._id}
                              className="px-4 py-2 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
                            >
                              Reject
                            </button>
                          )}
                        <Link href={`/teacher/courses/${course._id}/edit`}>
                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-all">
                                <Edit className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCourses.length === 0 && (
              <div className="py-20 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No matches found in architecture</p>
              </div>
          )}
        </div>
      </div>

      {/* Rejection Drawer */}
      <SlideOverlay
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Course"
        subtitle="Provide feedback for the instructor"
      >
        <div className="space-y-6">
          <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem]">
            <p className="text-rose-600 text-xs font-bold leading-relaxed">
              Please provide a clear and professional reason for rejection. This feedback will be shared directly with the instructor to help them refine the course architecture.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rejection Reason</label>
            <textarea 
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Insufficient content in module 3, video quality issues..."
              className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/5 min-h-[200px]"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              onClick={() => setShowRejectModal(false)} 
              className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleStatusUpdate(rejectingCourseId!, 'Rejected', rejectionReason)}
              disabled={!rejectionReason || actionLoading === rejectingCourseId}
              className="flex-1 py-4 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 disabled:opacity-50"
            >
              Submit Rejection
            </button>
          </div>
        </div>
      </SlideOverlay>
    </div>
  );
}
