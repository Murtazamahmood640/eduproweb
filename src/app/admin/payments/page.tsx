"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Search, Eye, Filter, TrendingUp, AlertCircle } from "lucide-react";

const mockTransactions = [
  { id: 1, student: "Ahmed Khan", course: "Mathematics O Level", amount: "PKR 15,000", date: "2024-05-20", status: "Completed", method: "Bank Transfer" },
  { id: 2, student: "Fatima Ali", course: "Physics A Level", amount: "PKR 18,000", date: "2024-05-19", status: "Completed", method: "JazzCash" },
  { id: 3, student: "Hassan Ahmed", course: "English Mastery", amount: "PKR 12,000", date: "2024-05-18", status: "Pending", method: "EasyPaisa" },
  { id: 4, student: "Sarah Khan", course: "Chemistry O Level", amount: "PKR 14,000", date: "2024-05-17", status: "Completed", method: "Bank Transfer" },
  { id: 5, student: "Ali Hassan", course: "Urdu Literature A Level", amount: "PKR 13,000", date: "2024-05-16", status: "Failed", method: "JazzCash" },
  { id: 6, student: "Zainab Ahmed", course: "German A1 Beginner", amount: "PKR 10,000", date: "2024-05-15", status: "Completed", method: "EasyPaisa" },
];

const summaryStats = [
  { label: "Total Revenue", value: "PKR 2.4M", change: "+12% from last month", icon: TrendingUp },
  { label: "Pending Payments", value: "PKR 35K", change: "3 transactions", icon: AlertCircle },
];

export default function AdminPayments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch = transaction.student.toLowerCase().includes(search.toLowerCase()) || 
                         transaction.course.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
          <CreditCard className="w-10 h-10 text-primary" />
          Payment Management
        </h1>
        <p className="text-gray-500">Track and manage all transactions</p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {summaryStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-2">{stat.label}</p>
                  <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-2">{stat.change}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 bg-white rounded-2xl border border-gray-200 p-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by student name or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {["All", "Completed", "Pending", "Failed"].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all border-2 ${
                  statusFilter === status
                    ? "bg-primary text-white border-primary shadow-lg"
                    : "bg-white border-gray-200 text-gray-600 hover:border-primary/30"
                }`}
              >
                {status}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Student</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Course</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Payment Method</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-black text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, i) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{transaction.student}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{transaction.course}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{transaction.amount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 font-bold text-xs rounded-lg border border-blue-200">
                      {transaction.method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg font-bold text-xs ${
                      transaction.status === "Completed"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : transaction.status === "Pending"
                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
