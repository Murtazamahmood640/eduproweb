"use client";

import React, { useState, useEffect } from "react";
import { Bell, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";

interface NotificationCenterProps {
  portal: "student" | "teacher" | "admin";
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ portal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    fetchNotifications();
    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all ${isOpen ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-primary hover:bg-primary-50'}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white animate-pulse" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50"
            >
              <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-slate-50/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Platform Alerts</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Mark Read
                  </button>
                )}
              </div>
              
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n._id} 
                      onClick={() => markAsRead(n._id)}
                      className={`p-5 border-b border-gray-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer relative ${!n.read ? 'bg-primary/[0.02]' : ''}`}
                    >
                      {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                      <div className="flex flex-col gap-1">
                        <p className={`text-xs font-black tracking-tight ${n.read ? 'text-gray-500' : 'text-gray-900'}`}>{n.title}</p>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{n.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{getTimeAgo(n.createdAt)}</p>
                          {n.link && (
                            <Link 
                              href={n.link} 
                              onClick={() => { setIsOpen(false); markAsRead(n._id); }}
                              className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline"
                            >
                              Action Required
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                      <Bell className="w-6 h-6 text-slate-200" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Alerts detected</p>
                    <p className="text-[10px] text-gray-300 font-bold uppercase mt-1">Your stream is clear</p>
                  </div>
                )}
              </div>

              <Link 
                href={`/${portal}/notifications`} 
                onClick={() => setIsOpen(false)}
                className="block p-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary hover:bg-slate-50 transition-all border-t border-gray-50 bg-slate-50/30"
              >
                View Analytics Archive
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
