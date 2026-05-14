"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, Clock, Video, CheckCircle, XCircle, 
  PlusCircle, User, BookOpen, Loader2, AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import toast from "react-hot-toast";
import VirtualClassroom from "@/components/ui/VirtualClassroom";
import SlideOverlay from "@/components/ui/SlideOverlay";

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  "pending": { color: "text-amber-500", bg: "bg-amber-50", icon: Clock },
  "confirmed": { color: "text-edu-indigo", bg: "bg-indigo-50", icon: Clock },
  "completed": { color: "text-edu-emerald", bg: "bg-emerald-50", icon: CheckCircle },
  "cancelled": { color: "text-red-500", bg: "bg-red-50", icon: XCircle },
};

export default function StudentAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBook, setShowBook] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);

  // Booking Form State
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aptRes, regRes] = await Promise.all([
        api.get("/appointments/student"),
        api.get("/registrations")
      ]);
      setAppointments(aptRes.data);
      setRegistrations(regRes.data);
    } catch (err) {
      console.error("Error fetching student data:", err);
      toast.error("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedCourseId || !date || !time || !topic) {
      toast.error("Please fill all required fields.");
      return;
    }

    const selectedReg = registrations.find(r => r.course._id === selectedCourseId);
    if (!selectedReg) return;

    const toastId = toast.loading("Requesting appointment...");
    try {
      setBookingLoading(true);
      // Combine date and time
      const combinedDate = new Date(`${date}T${time}`);
      
      const res = await api.post("/appointments", {
        instructorId: selectedReg.course.teacher._id,
        courseId: selectedCourseId,
        topic,
        date: combinedDate.toISOString(),
        duration,
        notes: ""
      });

      setAppointments([res.data, ...appointments]);
      setShowBook(false);
      setTopic(""); setDate(""); setTime("");
      toast.success("Appointment requested!", { id: toastId });
    } catch (err) {
      toast.error("Failed to book appointment.", { id: toastId });
    } finally {
      setBookingLoading(false);
    }
  };

  const upcoming = appointments.filter(a => a.status === "confirmed" || a.status === "pending").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const history = appointments.filter(a => a.status === "completed" || a.status === "cancelled");

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });

  const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit"
  });

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading your schedule...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 uppercase tracking-widest">Appointments</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
            {upcoming.length} upcoming · {history.length} completed
          </p>
        </div>
        <button
          onClick={() => setShowBook(true)}
          className="flex items-center gap-2 bg-edu-indigo text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-edu-indigo/90 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" /> Book Live Class
        </button>
      </div>

      {/* Next Upcoming */}
      {upcoming.length > 0 ? (
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-edu-indigo/20 blur-3xl rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Next Session</p>
              <h2 className="font-display text-2xl font-black mb-3 uppercase tracking-tight">{upcoming[0].topic || "Session"}</h2>
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">
                with <span className="text-white">{upcoming[0].instructor?.name || "Instructor"}</span>
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-6">
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <Calendar className="w-4 h-4 text-edu-indigo" /> {formatDate(upcoming[0].date)}
                </span>
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-edu-indigo" /> {formatTime(upcoming[0].date)}
                </span>
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <Video className="w-4 h-4 text-edu-indigo" /> {upcoming[0].duration} min
                </span>
              </div>
            </div>
            {upcoming[0].status === "confirmed" && upcoming[0].meetingLink ? (
              <button 
                onClick={() => setActiveSession(upcoming[0])}
                className="flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl active:scale-95"
              >
                <Video className="w-5 h-5" /> Join Virtual Classroom
              </button>
            ) : (
              <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                  {upcoming[0].status === "pending" ? "Awaiting Instructor Approval" : "Link pending confirmation"}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-100">
          <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No sessions scheduled</p>
          <button onClick={() => setShowBook(true)} className="mt-4 text-edu-indigo text-[10px] font-black uppercase tracking-widest hover:underline">
            Book your first session
          </button>
        </div>
      )}

      {/* All Appointments */}
      {appointments.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Schedule Manifest</h2>
          <div className="grid grid-cols-1 gap-4">
            {appointments.map((apt) => {
              const config = statusConfig[apt.status] || statusConfig["pending"];
              return (
                <div key={apt._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center hover:border-edu-indigo/20 transition-all group">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-edu-indigo font-black text-lg overflow-hidden group-hover:bg-edu-indigo group-hover:text-white transition-all">
                    {apt.instructor?.profilePicture ? (
                      <img src={apt.instructor.profilePicture} className="w-full h-full object-cover" alt="" />
                    ) : (apt.instructor?.name?.charAt(0) || "I")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-black text-slate-900 text-sm tracking-tight">{apt.topic || "Session"}</p>
                      <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-md border ${config.bg} ${config.color} border-current/10`}>
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
                      with {apt.instructor?.name || "Instructor"} · {apt.course?.title || "Masterclass"}
                    </p>
                    <div className="flex flex-wrap items-center gap-6">
                      <span className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(apt.date)}
                      </span>
                      <span className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5" /> {formatTime(apt.date)} ({apt.duration} min)
                      </span>
                    </div>
                  </div>
                  {apt.status === "confirmed" && apt.meetingLink && (
                    <button 
                      onClick={() => setActiveSession(apt)}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all"
                    >
                      <Video className="w-4 h-4" /> Join Classroom
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Booking Drawer */}
      <SlideOverlay
        isOpen={showBook}
        onClose={() => setShowBook(false)}
        title="Book Live Class"
        subtitle="Schedule an elite 1-on-1 session with your faculty"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Active Masterclass</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-edu-indigo w-4 h-4" />
              <select 
                value={selectedCourseId} 
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-edu-indigo/20 focus:border-edu-indigo appearance-none"
              >
                <option value="">Choose a course...</option>
                {registrations.map((r) => (
                  <option key={r._id} value={r.course._id}>{r.course.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Objective</label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-4 text-edu-indigo w-4 h-4" />
              <input 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                placeholder="e.g. Help with advanced calculus..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-edu-indigo/20 focus:border-edu-indigo" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black focus:outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Time</label>
              <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              onClick={() => setShowBook(false)} 
              className="flex-1 py-4 border border-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleBook}
              disabled={bookingLoading}
              className="flex-1 py-4 bg-edu-indigo text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-edu-indigo/90 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
            >
              {bookingLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Request Session"}
            </button>
          </div>
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
