"use client";

import React, { useState, useEffect } from "react";
import { 
  Star, MapPin, Briefcase, GraduationCap, 
  Linkedin, Youtube, Github, ExternalLink,
  Play, BookOpen, Clock, Users, ArrowLeft,
  Calendar, CheckCircle2, Award
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";

export default function FacultyProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchTeacher();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      const res = await api.get(`/faculty/${id}`);
      setTeacher(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
      <div className="w-16 h-16 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Archiving Portfolio...</p>
    </div>
  );

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-900 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Faculty
          </button>
          <div className="flex gap-4">
             <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
               Book Consultation
             </button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Profile Hero */}
        <section className="relative h-[60vh] bg-gray-900 overflow-hidden">
          <img 
            src={teacher.profilePicture} 
            className="w-full h-full object-cover opacity-60" 
            alt={teacher.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-20 container mx-auto px-6">
             <div className="max-w-4xl">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-primary/20">
                 <CheckCircle2 className="w-4 h-4" /> Verified Academic Expert
               </div>
               <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none mb-4">
                 {teacher.name}
               </h1>
               <div className="flex flex-wrap items-center gap-6">
                 <p className="text-primary text-xl font-black uppercase tracking-[0.2em]">{teacher.specialization}</p>
                 <div className="w-2 h-2 bg-gray-200 rounded-full hidden md:block" />
                 <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="text-lg font-black text-gray-900">4.9/5.0</span>
                 </div>
               </div>
             </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-20">
           <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                 {/* Sidebar Stats */}
                 <div className="lg:col-span-4 space-y-12">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Experience</p>
                          <p className="text-3xl font-black text-gray-900">{teacher.experience}y+</p>
                       </div>
                       <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Hourly Rate</p>
                          <p className="text-2xl font-black text-primary">PKR {teacher.hourlyRate}</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 pb-4 border-b border-gray-100">Academic Background</h4>
                       <div className="space-y-6">
                          <div className="flex gap-4">
                             <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                                <GraduationCap className="w-5 h-5 text-gray-400" />
                             </div>
                             <div>
                                <p className="text-xs font-black text-gray-900 uppercase tracking-tight">Qualification</p>
                                <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">{teacher.qualification}</p>
                             </div>
                          </div>
                          <div className="flex gap-4">
                             <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                                <Award className="w-5 h-5 text-gray-400" />
                             </div>
                             <div>
                                <p className="text-xs font-black text-gray-900 uppercase tracking-tight">Focus Area</p>
                                <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">{teacher.specialization}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 pb-4 border-b border-gray-100">Social Connections</h4>
                       <div className="flex gap-3">
                          {[
                            { icon: Linkedin, val: teacher.linkedin },
                            { icon: Github, val: teacher.github },
                            { icon: Youtube, val: teacher.youtube },
                            { icon: ExternalLink, val: teacher.portfolio }
                          ].filter(s => s.val).map((social, i) => (
                            <a 
                              key={i}
                              href={social.val}
                              target="_blank"
                              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all border border-gray-100"
                            >
                               <social.icon className="w-5 h-5" />
                            </a>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Main Content */}
                 <div className="lg:col-span-8 space-y-20">
                    <section>
                       <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-8 uppercase">The Academic <span className="text-primary italic">Philosophy</span></h2>
                       <p className="text-lg text-gray-600 font-medium leading-[1.8] mb-10">
                         {teacher.bio}
                       </p>
                       
                       {teacher.introVideo && (
                         <div className="aspect-video bg-gray-900 rounded-[3rem] relative overflow-hidden group shadow-2xl">
                            <video 
                              src={teacher.introVideo} 
                              className="w-full h-full object-cover opacity-60"
                              controls
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
                               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl text-primary">
                                  <Play className="w-8 h-8 fill-primary" />
                               </div>
                            </div>
                         </div>
                       )}
                    </section>

                    <section className="space-y-10">
                       <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase border-l-4 border-primary pl-6">Professional Roadmap</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Education</h4>
                             <p className="text-sm text-gray-900 font-bold leading-relaxed whitespace-pre-wrap">{teacher.education || "Academic credentials available upon request."}</p>
                          </div>
                          <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Work History</h4>
                             <p className="text-sm text-gray-900 font-bold leading-relaxed whitespace-pre-wrap">{teacher.workHistory || "Professional journey available upon request."}</p>
                          </div>
                       </div>
                    </section>

                    <section className="p-12 bg-gray-900 rounded-[3rem] text-white relative overflow-hidden">
                       <div className="absolute inset-0 bg-box-pattern opacity-[0.1]" />
                       <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                          <div>
                             <h3 className="text-3xl font-black tracking-tight mb-2">Ready to transform your future?</h3>
                             <p className="text-white/60 text-sm font-medium">Book a 1-on-1 strategy session with {teacher.name.split(' ')[0]}.</p>
                          </div>
                          <button className="px-10 py-5 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-105 transition-all active:scale-95">
                             Reserve Seat Now
                          </button>
                       </div>
                    </section>
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
