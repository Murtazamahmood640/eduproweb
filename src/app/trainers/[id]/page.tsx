"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Star, MapPin, Briefcase, Mail, Linkedin, Globe, BookOpen, Users, PlayCircle } from "lucide-react";
import Link from "next/link";
import CourseCard from "@/components/ui/CourseCard";

// Mock data
const trainerInfo = {
  id: "1",
  name: "Dr. John Smith",
  role: "Senior Software Engineer at Google",
  location: "San Francisco, CA",
  specialty: "Web Development & Cloud Architecture",
  rating: 4.9,
  reviews: 1240,
  students: 15420,
  coursesCount: 8,
  image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600&h=800",
  bio: "Dr. John Smith is a passionate educator and a senior software engineer with over 15 years of industry experience. He has worked at top tech companies including Google and Amazon, building scalable web applications used by millions. His teaching philosophy focuses on practical, project-based learning that prepares students for real-world engineering challenges.",
  skills: ["React", "Next.js", "Node.js", "AWS", "System Design", "TypeScript"],
  courses: [
    {
      id: "10",
      title: "Advanced React & Next.js",
      category: "Development",
      instructor: "Dr. John Smith",
      rating: 4.9,
      students: 3201,
      price: "PKR 14,999",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600&h=400",
      level: "Advanced" as const,
    },
    {
      id: "14",
      title: "Node.js & Express APIs",
      category: "Development",
      instructor: "Dr. John Smith",
      rating: 4.8,
      students: 1540,
      price: "PKR 11,999",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600&h=400",
      level: "Intermediate" as const,
    }
  ]
};

export default function TrainerProfilePage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      {/* Header Profile Section */}
      <section className="pt-32 pb-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-40 h-40 md:w-56 md:h-56 relative rounded-3xl overflow-hidden shadow-xl border-4 border-white flex-shrink-0">
              <img src={trainerInfo.image} alt={trainerInfo.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-4 pt-4">
              <div>
                <h1 className="font-display text-4xl font-bold text-slate-900 mb-2">{trainerInfo.name}</h1>
                <p className="text-xl text-edu-indigo font-bold">{trainerInfo.role}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-600 text-sm">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {trainerInfo.location}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {trainerInfo.specialty}</span>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-edu-amber fill-current" />
                  <span className="font-bold text-slate-900">{trainerInfo.rating} Rating</span>
                  <span className="text-slate-500">({trainerInfo.reviews} Reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-edu-indigo" />
                  <span className="font-bold text-slate-900">{trainerInfo.students.toLocaleString()}</span>
                  <span className="text-slate-500">Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-slate-900">{trainerInfo.coursesCount}</span>
                  <span className="text-slate-500">Courses</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="btn-primary py-2 px-6">Message</button>
                <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-edu-indigo transition-all"><Linkedin className="w-5 h-5" /></button>
                <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-edu-indigo transition-all"><Globe className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="font-display text-xl font-bold text-slate-900 mb-4">About Me</h3>
              <p className="text-slate-600 leading-relaxed text-sm mb-6">
                {trainerInfo.bio}
              </p>
              
              <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {trainerInfo.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h2 className="heading-h2 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-edu-indigo" /> My Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trainerInfo.courses.map((course, i) => (
                <CourseCard key={i} {...course} />
              ))}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
