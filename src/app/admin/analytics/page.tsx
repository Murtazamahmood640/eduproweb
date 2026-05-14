"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, BookOpen, CreditCard } from "lucide-react";

const analyticsData = [
  { label: "Student Growth", value: "+24%", change: "from last month", trend: "up" },
  { label: "Course Enrollments", value: "+156", change: "new enrollments", trend: "up" },
  { label: "Revenue Growth", value: "+18%", change: "from last month", trend: "up" },
  { label: "Completion Rate", value: "68%", change: "courses completed", trend: "up" },
];

const chartData = [
  { month: "Jan", students: 120, revenue: 84, courses: 45 },
  { month: "Feb", students: 145, revenue: 95, courses: 52 },
  { month: "Mar", students: 178, revenue: 112, courses: 61 },
  { month: "Apr", students: 210, revenue: 135, courses: 73 },
  { month: "May", students: 247, revenue: 156, courses: 89 },
  { month: "Jun", students: 285, revenue: 178, courses: 105 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
          <BarChart3 className="w-10 h-10 text-primary" />
          Platform Analytics
        </h1>
        <p className="text-gray-500">Platform performance and growth metrics</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm font-semibold">{metric.label}</p>
                <p className="text-3xl font-black text-gray-900 mt-2">{metric.value}</p>
              </div>
              <motion.div
                animate={{ y: metric.trend === "up" ? [0, -4, 0] : 0 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-emerald-600"
              >
                <TrendingUp className="w-6 h-6" />
              </motion.div>
            </div>
            <p className="text-xs text-gray-400">{metric.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all"
        >
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Student Growth Trend
          </h2>
          
          <div className="space-y-4">
            {chartData.map((data, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-sm text-gray-900">{data.month}</p>
                  <p className="text-xs font-bold text-primary">{data.students} students</p>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                  className="h-2 bg-gray-100 rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.students / 285) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-primary to-primary-600 rounded-full"
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all"
        >
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Revenue Trend
          </h2>
          
          <div className="space-y-4">
            {chartData.map((data, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-sm text-gray-900">{data.month}</p>
                  <p className="text-xs font-bold text-primary">PKR {data.revenue}K</p>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  className="h-2 bg-gray-100 rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.revenue / 178) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Course Growth */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all"
      >
        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Course Enrollment Trend
        </h2>
        
        <div className="space-y-4">
          {chartData.map((data, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-sm text-gray-900">{data.month}</p>
                <p className="text-xs font-bold text-primary">{data.courses} enrollments</p>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                className="h-2 bg-gray-100 rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.courses / 105) * 100}%` }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                />
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
