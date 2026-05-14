"use client";
import React, { useState, useEffect } from "react";
import { Users, Search, BookOpen, TrendingUp, Star, Filter, Sparkles, MoreVertical, ArrowRight, Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import SlideOverlay from "@/components/ui/SlideOverlay";
import api from "@/lib/api";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-600 border-emerald-100",
  completed: "bg-primary-50 text-primary border-primary-100",
  cancelled: "bg-gray-50 text-gray-400 border-gray-100",
};

export default function TeacherStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", course: "" });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/teacher/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const courses = ["All", ...Array.from(new Set(students.map(s => s.courseTitle).filter(Boolean)))];
  
  const filtered = students.filter((s) => {
    const matchCourse = courseFilter === "All" || s.courseTitle === courseFilter;
    const matchSearch = (s.name || "").toLowerCase().includes(search.toLowerCase()) || (s.email || "").toLowerCase().includes(search.toLowerCase());
    return matchCourse && matchSearch;
  });

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Synchronizing Learner Directory...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase tracking-[0.2em]">Student Registry</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
              {students.length} global learners · {students.filter(s => s.status === 'Active').length} active currently
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" /> Add Student
        </motion.button>
      </div>

      {/* ── Summary Matrix ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Learners", value: students.length, icon: Users, color: "bg-primary-50 text-primary" },
          { label: "Active Momentum", value: students.filter((s) => s.status === "Active").length, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
          { label: "Credentialed", value: students.filter((s) => s.status === "Completed").length, icon: Star, color: "bg-amber-50 text-amber-500" },
          { label: "Mean Velocity", value: `${Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length)}%`, icon: BookOpen, color: "bg-primary-50 text-primary" },
        ].map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-2xl hover:border-primary/20 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform ${s.color}`}><s.icon className="w-6 h-6" /></div>
            <p className="text-3xl font-black text-gray-900 tracking-tight">{s.value}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Search & Navigation ── */}
      <div className="space-y-4 border-b border-gray-100 pb-8">
        <div className="relative w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Identify student by name or credentials..."
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all" 
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Filter</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {courses.map((c) => (
            <motion.button 
              key={c}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCourseFilter(c)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                courseFilter === c 
                  ? "bg-gradient-to-r from-primary to-primary-600 text-white border-primary shadow-lg shadow-primary/30" 
                  : "bg-white border-gray-200 text-gray-600 hover:border-primary/30 hover:bg-gray-50"
              }`}
            >
              {c === "All" ? "Full Registry" : c}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Table Matrix ── */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Academic Profile</th>
                <th className="text-left px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden md:table-cell">Assigned Module</th>
                <th className="text-left px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden lg:table-cell">Velocity</th>
                <th className="text-left px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden lg:table-cell">Last Score</th>
                <th className="text-right px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-primary-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary font-black text-sm flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                        {student.avatar}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-sm tracking-tight">{student.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">{student.course}</p>
                  </td>
                  <td className="px-8 py-6 hidden lg:table-cell">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden shrink-0">
                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${student.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden lg:table-cell">
                    <span className={`text-sm font-black tracking-tight ${student.quizScore >= 80 ? "text-emerald-600" : student.quizScore >= 60 ? "text-amber-500" : "text-rose-500"}`}>
                      {student.quizScore}%
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border ${statusStyles[student.status]}`}>{student.status}</span>
                      <button className="p-2 text-gray-300 hover:text-primary transition-colors"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <Users className="w-16 h-16 text-gray-100 mx-auto mb-6" />
            <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">No students identified</h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Adjust your filtration parameters</p>
          </div>
        )}
      </div>

      {/* ── Add Student Form ── */}
      <SlideOverlay
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Student"
        subtitle="Register a new student to your course"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Enter student name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="student@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Select Course</label>
            <select
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
            >
              <option value="">Choose a course...</option>
              {["Mathematics O Level", "Physics A Level", "English Mastery"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all mt-8"
          >
            Add Student
          </motion.button>

          <button
            onClick={() => setIsFormOpen(false)}
            className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </SlideOverlay>
    </div>
  );
}
