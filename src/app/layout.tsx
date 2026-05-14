import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EduPro Academy | Premium Online Learning Platform",
  description: "Expert courses, practical skills, and real results. Join EduPro Academy to master UI/UX design, web development, data science, and more.",
};

import AnimatedBackground from "@/components/ui/AnimatedBackground";
import CustomCursor from "@/components/ui/CustomCursor";
import { AnimatedGradientMesh } from "@/components/backgrounds/AnimatedGradientMesh";
import { EducationThemeBackground } from "@/components/backgrounds/EducationThemeBackground";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import ChatBotWrapper from "@/components/ui/ChatBotWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased text-edu-slate-900 selection:bg-edu-indigo/20 selection:text-edu-indigo bg-white relative`}>
        <AuthProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'text-[11px] font-black uppercase tracking-widest border border-gray-100 shadow-2xl rounded-xl p-4',
              duration: 4000,
              style: {
                background: '#fff',
                color: '#000',
              },
              success: {
                iconTheme: {
                  primary: '#1d4ed8',
                  secondary: '#fff',
                },
              },
            }}
          />
          <CustomCursor />
          <AnimatedGradientMesh />
          <EducationThemeBackground />
          <AnimatedBackground />
          {children}
          <ChatBotWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}
