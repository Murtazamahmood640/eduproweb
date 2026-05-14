"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Filter, Star, MapPin, 
  ChevronRight, BrainCircuit, Sparkles,
  ArrowRight, Video, Briefcase, GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";

export default function FacultyListing() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const res = await api.get("/faculty");
      setFaculty(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                          f.specialization?.toLowerCase().includes(search.toLowerCase());
    if (filter === "All") return matchesSearch;
    return matchesSearch && f.specialization === filter;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 bg-box-pattern opacity-[0.03]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              Elite Academic Council
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[0.9] uppercase mb-8">
              Learn from the <span className="text-primary italic">World's Best</span> Educators.
            </h1>
            <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-xl">
              Connect with verified industry experts, world-renowned researchers, and elite faculty members dedicated to your success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-[80px] z-40 bg-white/80 backdrop-blur-xl border-y border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, subject, or skill..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {["All", "Computer Science", "Mathematics", "Business", "Arts"].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    filter === cat 
                      ? "bg-primary text-white shadow-xl shadow-primary/20" 
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid Listing */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredFaculty.map((t, idx) => (
                <motion.div 
                  key={t._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                >
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img 
                      src={t.profilePicture} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                      alt={t.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
                    
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="flex items-center gap-2 mb-3">
                         <div className="px-3 py-1 bg-primary text-white rounded-full text-[8px] font-black uppercase tracking-widest">
                           {t.specialization}
                         </div>
                         <div className="flex items-center gap-1 text-amber-400">
                           <Star className="w-3 h-3 fill-amber-400" />
                           <span className="text-[10px] font-black text-white">4.9</span>
                         </div>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight leading-tight mb-2">{t.name}</h3>
                      <div className="flex items-center gap-4 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {t.experience}y Exp</span>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span className="flex items-center gap-1">PKR {t.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <p className="text-gray-500 text-xs font-medium leading-relaxed line-clamp-3">
                      {t.bio}
                    </p>
                    <Link 
                      href={`/faculty/${t._id}`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group/btn hover:bg-primary transition-all duration-300"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 group-hover/btn:text-white transition-colors">View Academic Profile</span>
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary group-hover/btn:bg-white group-hover/btn:text-primary transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredFaculty.length === 0 && (
            <div className="py-40 text-center">
               <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6">
                 <Search className="w-10 h-10" />
               </div>
               <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">No Faculty Members Found</h2>
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">Try adjusting your filters or search keywords</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
