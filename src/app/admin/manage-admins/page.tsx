"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Plus, Search, Filter, MoreVertical, 
  Trash2, Edit2, UserPlus, X, Check, ShieldAlert,
  User, Mail, Key, Shield, CheckCircle2
} from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import SlideOverlay from "@/components/ui/SlideOverlay";

const AVAILABLE_PERMISSIONS = [
  "manage_students",
  "manage_teachers",
  "manage_courses",
  "manage_payments",
  "view_analytics",
  "manage_results",
  "manage_certificates"
];

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // New Admin Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee_admin",
    permissions: [] as string[]
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/admin/admins");
      setAdmins(res.data);
    } catch (err) {
      console.error("Failed to fetch admins", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Creating admin account...");
    try {
      await api.post("/admin/create-admin", formData);
      setShowAddModal(false);
      fetchAdmins();
      setFormData({ name: "", email: "", password: "", role: "employee_admin", permissions: [] });
      toast.success("Admin account created successfully.", { id: toastId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create admin", { id: toastId });
    }
  };

  const filteredAdmins = admins.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black text-gray-900 mb-2">Manage Admins</h1>
          <p className="text-gray-500 text-lg">Control platform access & permissions</p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-600 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Create New Admin
        </motion.button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search admins by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-gray-900"
          />
        </div>
      </div>

      {/* Admin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white h-64 rounded-3xl border border-gray-100 animate-pulse" />
            ))
          ) : filteredAdmins.length > 0 ? (
            filteredAdmins.map((admin, i) => (
              <motion.div
                key={admin._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full opacity-10 translate-x-1/2 -translate-y-1/2 ${
                  admin.role === 'superadmin' ? 'bg-amber-500' : 'bg-primary'
                }`} />
                
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${
                    admin.role === 'superadmin' 
                      ? 'bg-amber-100 text-amber-600' 
                      : 'bg-primary-50 text-primary'
                  }`}>
                    {admin.name[0].toUpperCase()}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    admin.role === 'superadmin'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {admin.role.replace('_', ' ')}
                  </div>
                </div>

                <div className="space-y-1 mb-6 relative z-10">
                  <h3 className="font-black text-gray-900 text-xl">{admin.name}</h3>
                  <p className="text-gray-400 font-bold text-xs truncate">{admin.email}</p>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex flex-wrap gap-1.5">
                    {admin.permissions?.map((p: string) => (
                      <span key={p} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[8px] font-black uppercase tracking-tighter text-gray-500">
                        {p.replace('manage_', '').replace('view_', '')}
                      </span>
                    ))}
                    {admin.role === 'superadmin' && (
                      <span className="px-2 py-1 bg-amber-50 border border-amber-100 rounded-lg text-[8px] font-black uppercase tracking-tighter text-amber-600">
                        All Access
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      ID: {admin.userId}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {admin.role !== 'superadmin' && (
                        <button className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <ShieldAlert className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">No admins found matching your search.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Admin Drawer */}
      <SlideOverlay
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Admin"
        subtitle="Grant new access credentials"
      >
        <form onSubmit={handleCreateAdmin} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-gray-900 text-sm"
                  placeholder="John Smith"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-gray-900 text-sm"
                  placeholder="john@edupro.academy"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-gray-900 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Role</label>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <select
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-gray-900 text-sm appearance-none cursor-pointer"
                >
                  <option value="employee_admin">Employee Admin</option>
                  <option value="admin">Standard Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Granular Permissions</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_PERMISSIONS.map(perm => (
                <div 
                  key={perm}
                  onClick={() => handlePermissionToggle(perm)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${
                    formData.permissions.includes(perm)
                      ? "bg-primary/5 border-primary shadow-sm"
                      : "bg-white border-gray-100 hover:border-primary/20"
                  }`}
                >
                  <span className={`text-[11px] font-black uppercase tracking-tight transition-colors ${
                    formData.permissions.includes(perm) ? "text-primary" : "text-gray-500"
                  }`}>
                    {perm.replace('_', ' ')}
                  </span>
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                    formData.permissions.includes(perm) ? "bg-primary text-white" : "bg-gray-50 text-transparent"
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-600 transition-all active:scale-[0.98]"
            >
              Create Admin
            </button>
          </div>
        </form>
      </SlideOverlay>
    </div>
  );
}
