"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search, Plus, Edit, Filter, BarChart3 } from "lucide-react";
import SlideOverlay from "@/components/ui/SlideOverlay";

const mockResults = [
  { id: 1, student: "Ahmed Khan", course: "Mathematics O Level", score: 92, grade: "A", examDate: "2024-05-15", status: "Published" },
  { id: 2, student: "Fatima Ali", course: "Physics A Level", score: 88, grade: "A", examDate: "2024-05-16", status: "Published" },
  { id: 3, student: "Hassan Ahmed", course: "English Mastery", score: 85, grade: "B+", examDate: "2024-05-17", status: "Draft" },
  { id: 4, student: "Sarah Khan", course: "Chemistry O Level", score: 90, grade: "A", examDate: "2024-05-18", status: "Published" },
  { id: 5, student: "Ali Hassan", course: "Urdu A Level", score: 87, grade: "A", examDate: "2024-05-19", status: "Published" },
];

export default function AdminResults() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredResults = mockResults.filter((result) => {
    const matchesSearch = result.student.toLowerCase().includes(search.toLowerCase()) || 
                         result.course.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || result.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getGradeColor = (grade: string) => {
    if (grade === "A" || grade === "A+") return "bg-emerald-50 text-emerald-600";
    if (grade.includes("B")) return "bg-blue-50 text-blue-600";
    if (grade.includes("C")) return "bg-amber-50 text-amber-600";
    return "bg-red-50 text-red-600";
  };

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
            <FileText className="w-10 h-10 text-primary" />
            Results & Grades
          </h1>
          <p className="text-gray-500">Manage student examination results</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" /> Add Result
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Results", value: "247", icon: BarChart3 },
          { label: "Published", value: "215", icon: FileText },
          { label: "Draft", value: "32", icon: FileText },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold mb-2">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 bg-white rounded-2xl border border-gray-200 p-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by student name or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {["All", "Published", "Draft"].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all border-2 ${
                  statusFilter === status
                    ? "bg-primary text-white border-primary shadow-lg"
                    : "bg-white border-gray-200 text-gray-600 hover:border-primary/30"
                }`}
              >
                {status}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Student</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Course</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Score</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Grade</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Exam Date</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-black text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result, i) => (
                <motion.tr
                  key={result.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{result.student}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{result.course}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{result.score}%</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg font-bold text-xs border ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{result.examDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg font-bold text-xs ${
                      result.status === "Published"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all mx-auto"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Result Form */}
      <SlideOverlay
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Examination Result"
        subtitle="Enter student score and generate grade"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Student</label>
            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 appearance-none">
              <option>Select student...</option>
              {mockResults.map((r) => <option key={r.id}>{r.student}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Course</label>
            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 appearance-none">
              <option>Select course...</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Score (%)</label>
            <input type="number" placeholder="0-100" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/20" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary/30 mt-8"
          >
            Add Result
          </motion.button>
        </div>
      </SlideOverlay>
    </div>
  );
}
