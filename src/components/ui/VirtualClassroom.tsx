"use client";

import React, { useEffect } from "react";
import { X, Maximize2, Minimize2, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VirtualClassroomProps {
  isOpen: boolean;
  onClose: () => void;
  meetingLink: string;
  sessionTitle: string;
}

export default function VirtualClassroom({ isOpen, onClose, meetingLink, sessionTitle }: VirtualClassroomProps) {
  // Extract room name from link for direct Jitsi API if needed, but iframe is simpler for now
  // Link format: https://meet.jit.si/EduPro-xxxx#config...
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col">
        {/* Header Bar */}
        <div className="h-16 px-6 bg-slate-900 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
              <Video className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Live Masterclass</p>
              <h2 className="text-sm font-black text-white uppercase tracking-tight">{sessionTitle}</h2>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/10 text-white hover:text-red-500 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-white/10"
          >
            <X className="w-4 h-4" /> End Session
          </button>
        </div>

        {/* Meeting Iframe */}
        <div className="flex-1 relative bg-slate-900">
          <iframe 
            src={meetingLink}
            allow="camera; microphone; display-capture; autoplay; clipboard-write"
            className="w-full h-full border-none"
            title="EduPro Virtual Classroom"
          />
          
          {/* Subtle Branding Overlay */}
          <div className="absolute bottom-6 left-6 pointer-events-none opacity-20">
             <h3 className="font-display text-lg font-black text-white uppercase tracking-tighter italic">EduPro Academy</h3>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
