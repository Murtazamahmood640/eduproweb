"use client";

import React from "react";
import { Star, Users, Clock, PlayCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TEACHERS } from "@/lib/data";
import { motion } from "framer-motion";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: any; // Can be string ID or { name, profilePicture }
  price: string;
  rating: number;
  students: number;
  image: string;
  level: string;
  category: string;
  demoVideo?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  instructor,
  price,
  rating,
  students,
  image,
  level,
  category,
  demoVideo,
}) => {
  // Handle both legacy string ID and new populated object
  const isPopulated = typeof instructor === "object" && instructor !== null;
  const teacherFromData = !isPopulated ? TEACHERS.find(t => t.id === instructor) : null;
  
  const teacherName = isPopulated ? instructor.name : (teacherFromData?.name || "Expert Instructor");
  const teacherImage = isPopulated ? instructor.profilePicture : (teacherFromData?.image || "https://ui-avatars.com/api/?name=" + teacherName);
  const teacherSpecialty = isPopulated ? "Subject Specialist" : (teacherFromData?.specialty || "Academic Mentor");

  const [showVideo, setShowVideo] = React.useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/40 transition-all duration-500 overflow-hidden flex flex-col h-full relative"
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative flex flex-col h-full">
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden shrink-0 bg-gradient-to-br from-primary-100 via-primary-50 to-blue-100">
          {showVideo && demoVideo ? (
            <iframe
              src={demoVideo}
              title={title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <>
              <img
                src={image || "https://images.unsplash.com/photo-1516307365440-15265e8537d3?auto=format&fit=crop&q=80&w=800&h=500"}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = "https://images.unsplash.com/photo-1516307365440-15265e8537d3?auto=format&fit=crop&q=80&w=800&h=500";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                {demoVideo && (
                  <motion.button
                    onClick={() => setShowVideo(true)}
                    initial={{ scale: 0.7, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-4"
                  >
                    <PlayCircle className="text-white w-20 h-20 opacity-100 drop-shadow-2xl fill-white hover:scale-110 transition-transform" />
                  </motion.button>
                )}
              </div>
            </>
          )}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-primary text-[9px] font-black uppercase tracking-widest rounded-md shadow-sm border border-white/20">
            {category}
          </span>
          <span className="px-2.5 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow-sm">
            {level}
          </span>
        </div>
      </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-1 relative z-10">
          <motion.div 
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-50 rounded-lg">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
              <span className="text-xs font-black text-gray-900">{rating.toFixed(1)}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <div className="flex items-center gap-1 text-gray-500">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">{(students / 1000).toFixed(1)}k</span>
            </div>
          </motion.div>

          <h3 className="text-sm font-black text-gray-900 leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2 h-10">
            <Link href={`/courses/${id}`} className="hover:underline">{title}</Link>
          </h3>

          <div className="mt-auto pt-6 flex items-center justify-between border-t-2 border-gray-100">
            <div className="flex items-center gap-2.5">
              <img 
                src={teacherImage || null} 
                alt={teacherName} 
                className="w-9 h-9 rounded-full object-cover border-2 border-primary/20 shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 leading-none">{teacherName}</span>
                <span className="text-[9px] text-gray-400 font-semibold mt-0.5">{teacherSpecialty}</span>
              </div>
            </div>
            <motion.div 
              className="text-right"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-base font-black text-primary">{price}</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
