"use client";

import React, { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SlideOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  subtitle?: string;
}

export const SlideOverlay: React.FC<SlideOverlayProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-[3px] z-[200]"
          />

          {/* Slide Panel — 55% width on desktop, full on mobile */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[55%] bg-white shadow-2xl z-[201] flex flex-col"
          >
            {/* Sticky Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-black text-gray-900 tracking-tight truncate">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-widest">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {children}
            </div>

            {/* Footer fade */}
            <div className="h-6 bg-gradient-to-t from-white to-transparent pointer-events-none sticky bottom-0" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SlideOverlay;
