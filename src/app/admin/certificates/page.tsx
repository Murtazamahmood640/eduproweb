"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Search, Plus, Download, Filter, Eye, Loader2, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/certificates/all");
      setCertificates(res.data);
    } catch (err) {
      console.error("Error fetching certificates:", err);
      toast.error("Failed to load certificate manifest.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter((cert) => {
    const studentName = cert.student?.name || "Unknown Student";
    const courseTitle = cert.course?.title || "Unknown Course";
    const matchesSearch = studentName.toLowerCase().includes(search.toLowerCase()) || 
                         courseTitle.toLowerCase().includes(search.toLowerCase()) ||
                         cert.certificateId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || (statusFilter === "Issued" ? true : false); // Currently all are issued
    return matchesSearch && matchesStatus;
  });

  const issuedCount = certificates.length;

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Authenticating Global Credentials...</p>
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
          <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3 tracking-tight">
            <Award className="w-10 h-10 text-primary" />
            Credential Registry
          </h1>
          <p className="text-gray-500 font-medium tracking-tight">Authorized issuance and verification of academic mastery</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20 hover:bg-primary-600 transition-all"
        >
          <Plus className="w-4 h-4" /> Issue Manual Credential
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Credentials Issued", value: issuedCount.toString(), icon: Award, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { label: "Verification Requests", value: "0", icon: Eye, color: "text-blue-600 bg-blue-50 border-blue-100" },
          { label: "Global Reach", value: certificates.length > 0 ? "Global" : "Local", icon: Award, color: "text-primary bg-primary-50 border-primary-100" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-2xl border p-8 flex items-center gap-6 hover:shadow-2xl transition-all group ${stat.color.split(" ")[2]}`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${stat.color.split(" ").slice(0,2).join(" ")}`}>
               <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by student, course or certificate hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-gray-900 shadow-sm"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-gray-900 appearance-none shadow-sm"
          >
            <option value="All">All Credentials</option>
            <option value="Issued">Authenticated</option>
            <option value="Pending">Pending Audit</option>
          </select>
        </div>
      </motion.div>

      {/* Certificates Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-2xl shadow-primary/5"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Scholar Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Academic Course</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Credential ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Issued On</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCertificates.map((cert, i) => (
                <motion.tr
                  key={cert._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-900 text-sm mb-0.5">{cert.student?.name || "Unknown Scholar"}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cert.student?.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-gray-900">{cert.course?.title || "N/A"}</p>
                  </td>
                  <td className="px-8 py-6">
                    <code className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl font-mono text-[10px] text-primary font-black uppercase">{cert.certificateId}</code>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-3 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-xl transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-3 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredCertificates.length === 0 && (
              <div className="py-20 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No credentials found in registry</p>
              </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

