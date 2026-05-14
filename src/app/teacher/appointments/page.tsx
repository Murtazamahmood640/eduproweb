"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, Clock, Video, CheckCircle, XCircle, 
  Plus, Loader2, Sparkles, User, AlertCircle
} from "lucide-react";
import SlideOverlay from "@/components/ui/SlideOverlay";
import VirtualClassroom from "@/components/ui/VirtualClassroom";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function TeacherAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSlots, setShowSlots] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<any>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments/teacher");
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: "confirmed" | "cancelled") => {
    const toastId = toast.loading(`${status === "confirmed" ? "Accepting" : "Declining"} appointment...`);
    try {
      setActionLoading(id);
      const res = await api.patch(`/appointments/${id}/status`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? res.data : a));
      toast.success(`Appointment ${status === "confirmed" ? "accepted" : "declined"}.`, { id: toastId });
    } catch (err) {
      toast.error("Failed to update appointment.", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const pending = appointments.filter(a => a.status === "pending");
  const confirmed = appointments.filter(a => a.status === "confirmed");
  const past = appointments.filter(a => a.status === "completed" || a.status === "cancelled");

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Sessions...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase tracking-widest">Appointments</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
              {pending.length} pending · {confirmed.length} upcoming sessions
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowSlots(true)} 
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Set Availability
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
          <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">No appointments yet</p>
          <p className="text-xs text-gray-300 font-medium mt-2">Students will request sessions once enrolled in your courses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Pending Requests */}
            {pending.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> New Session Requests
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {pending.map((req) => (
                    <motion.div 
                      key={req._id} 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-xl border border-primary/20 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-lg shadow-primary/5"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg overflow-hidden">
                        {req.student?.profilePicture 
                          ? <img src={req.student.profilePicture} className="w-full h-full object-cover" alt="" />
                          : (req.student?.name?.charAt(0) || "S")
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900 text-sm mb-0.5">{req.student?.name || "Student"}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
                          {req.topic || "General Session"}{req.course ? ` · ${req.course.title}` : ""}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest bg-primary-50 px-2 py-1 rounded-md border border-primary-100">
                            <Calendar className="w-3 h-3" /> {formatDate(req.date)}
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3" /> {req.duration} min
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button 
                          onClick={() => handleStatusUpdate(req._id, "confirmed")}
                          disabled={actionLoading === req._id}
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50"
                        >
                          {actionLoading === req._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Accept
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(req._id, "cancelled")}
                          disabled={actionLoading === req._id}
                          className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" /> Decline
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirmed Sessions */}
            {confirmed.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Video className="w-4 h-4 text-primary" /> Confirmed Sessions
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {confirmed.map((apt) => (
                    <div key={apt._id} className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:border-primary/20 transition-all">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 text-gray-900 flex items-center justify-center font-black text-sm shrink-0 overflow-hidden">
                        {apt.student?.profilePicture 
                          ? <img src={apt.student.profilePicture} className="w-full h-full object-cover" alt="" />
                          : (apt.student?.name?.charAt(0) || "S")
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900 text-sm mb-0.5">{apt.student?.name || "Student"}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
                          {apt.topic || "General Session"}{apt.course ? ` · ${apt.course.title}` : ""}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest bg-primary-50 px-2 py-1 rounded-md">
                            <Calendar className="w-3 h-3" /> {formatDate(apt.date)}
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3" /> {apt.duration} min
                          </span>
                        </div>
                      </div>
                      {apt.meetingLink ? (
                        <button 
                          onClick={() => setActiveSession(apt)}
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all"
                        >
                          <Video className="w-4 h-4" /> Launch Classroom
                        </button>
                      ) : (
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">No link yet</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-8">
            {past.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Recent History</h3>
                <div className="space-y-4">
                  {past.slice(0, 5).map((apt) => (
                    <div key={apt._id} className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center font-black text-xs">
                        {apt.student?.name?.charAt(0) || "S"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{apt.student?.name || "Student"}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{formatDate(apt.date).split(",")[0]}</p>
                      </div>
                      <div className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded ${
                        apt.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                      }`}>
                        {apt.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-primary rounded-xl p-6 text-white relative overflow-hidden">
              <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-white/5" />
              <h4 className="text-sm font-black mb-2 uppercase tracking-widest">Expert Tip</h4>
              <p className="text-[11px] text-white/70 leading-relaxed font-bold">
                Keeping your availability updated leads to <span className="text-white">40% higher</span> booking rates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Availability Management Drawer */}
      <SlideOverlay
        isOpen={showSlots}
        onClose={() => setShowSlots(false)}
        title="Schedule Manager"
        subtitle="Manage your global availability"
      >
        <div className="space-y-8">
          <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2.5rem]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Architectural Note</p>
                <p className="text-[10px] text-gray-500 font-bold mt-1.5 leading-relaxed">
                  Your primary operational hours and hourly rate are synchronized through the <strong className="text-primary">Profile → Availability</strong> module. Please update your master schedule there to reflect accurately across the student interface.
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowSlots(false)} 
            className="w-full py-5 text-[10px] font-black text-white bg-gray-900 uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all shadow-2xl active:scale-95"
          >
            Acknowledge Session
          </button>
        </div>
      </SlideOverlay>
      <VirtualClassroom 
        isOpen={!!activeSession}
        onClose={() => setActiveSession(null)}
        meetingLink={activeSession?.meetingLink}
        sessionTitle={activeSession?.topic || "Live Class"}
      />
    </div>
  );
}
