"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardNavbar } from "@/components/student/DashboardNavbar";
import { useAuth } from "@/context/AuthContext";
import OnboardingTour from "@/components/ui/OnboardingTour";
import { Target, Book, Brain, GraduationCap as Cert } from "lucide-react";

const studentSteps = [
  {
    title: "Student Command Center",
    description: "Welcome to your personal learning hub. Track your overall academic mastery and upcoming milestones.",
    icon: <Target className="w-10 h-10" />,
    color: "from-primary to-primary-600",
    href: "/student/dashboard"
  },
  {
    title: "Browse Elite Courses",
    description: "Explore our catalog of professional curricula and enroll in modules designed by global subject experts.",
    icon: <Book className="w-10 h-10" />,
    color: "from-emerald-500 to-teal-600",
    href: "/student/browse"
  },
  {
    title: "Examination Center",
    description: "Test your knowledge with mocks and assessments. Your results will help you refine your path to distinction.",
    icon: <Brain className="w-10 h-10" />,
    color: "from-amber-500 to-orange-600",
    href: "/student/quizzes"
  },
  {
    title: "Certified Excellence",
    description: "Your academic achievements deserve recognition. View and download your globally recognized certificates here.",
    icon: <Cert className="w-10 h-10" />,
    color: "from-violet-500 to-purple-600",
    href: "/student/certificates"
  }
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { dbUser, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !dbUser) {
      router.replace("/auth/login");
    } else if (!authLoading && dbUser && dbUser.role !== 'student') {
      // Role enforcement
      if (dbUser.role === 'teacher') {
        router.replace("/teacher/dashboard");
      } else if (['admin', 'superadmin', 'employee_admin'].includes(dbUser.role)) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [dbUser, authLoading, router]);

  // Premium loading state while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] mb-1">Authenticating Architecture</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Verifying Elite Credentials...</p>
          </div>
        </div>
      </div>
    );
  }

  // Double check authorization
  if (!dbUser || dbUser.role !== 'student') return null;

  return (
    <div className="min-h-screen bg-white">
      <DashboardNavbar />
      <main className="flex-1 overflow-y-auto relative">
        <OnboardingTour 
          steps={studentSteps} 
          tourKey="student_v2" 
          onComplete={() => console.log("Student Tour Finished")} 
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
