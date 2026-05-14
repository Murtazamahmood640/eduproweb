"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/ui/CourseCard";
import { Search, Filter, Sparkles, BookOpen, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

const categories = ["All", "Mathematics", "Languages", "Science", "Tech", "Business", "Arts", "Social Studies"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];

const CoursesPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <main className="min-h-screen flex flex-col bg-white selection:bg-primary selection:text-white">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="pt-36 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white relative border-b border-gray-100 bg-box-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 border border-primary-100"
              >
                <Sparkles className="w-4 h-4" />
                <span>Elite Academic Catalogue</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight"
              >
                Discover Premium <br />
                <span className="text-primary">Expert-Led Courses</span>
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative max-w-xl mx-auto lg:mx-0"
              >
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search by subject, level or instructor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-2xl text-gray-900 font-bold placeholder-gray-300 focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all shadow-xl shadow-primary/5"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="hidden lg:block relative"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[10px] border-white aspect-[4/3]">
                <img 
                  src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=1200&h=900" 
                  alt="Academic Learning" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Filters & Results ── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters Bar */}
          <div className="space-y-6 mb-16 pb-8 border-b border-gray-100">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                      selectedCategory === cat
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                        : "bg-white border-gray-200 text-gray-600 hover:border-primary/30 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Excellence...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course, index) => (
                    <motion.div
                      key={course._id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <CourseCard
                        id={course._id}
                        title={course.title}
                        category={course.category}
                        instructor={course.instructor} // Now an object
                        rating={course.rating || 5.0}
                        students={course.studentsCount || 0}
                        price={`PKR ${course.price?.toLocaleString()}`}
                        image={course.thumbnail}
                        level={course.level || "Beginner"}
                        demoVideo={course.introVideoUrl}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-40 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">No matching courses</h3>
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Refine your search or try another category</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CoursesPage;
