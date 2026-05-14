"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Sparkles, Zap, PlayCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href?: string;
}

interface OnboardingTourProps {
  steps: Step[];
  onComplete: () => void;
  tourKey: string;
}

export default function OnboardingTour({ steps, onComplete, tourKey }: OnboardingTourProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem(`onboarding_${tourKey}`);
    if (!hasSeen) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [tourKey]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (steps[nextStep].href) {
        router.push(steps[nextStep].href as string);
      }
    } else {
      complete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const complete = () => {
    localStorage.setItem(`onboarding_${tourKey}`, "true");
    setIsVisible(false);
    onComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-xl bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden relative"
          >
            {/* Background Decorative */}
            <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${steps[currentStep].color}`} />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            {/* Header */}
            <div className="p-8 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">System Walkthrough</p>
                        <h3 className="text-sm font-black text-gray-900 uppercase">Step {currentStep + 1} of {steps.length}</h3>
                    </div>
                </div>
                <button onClick={complete} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Body */}
            <div className="p-12 text-center">
                <motion.div 
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-xl shadow-primary/10 bg-gradient-to-br ${steps[currentStep].color} text-white`}>
                        {steps[currentStep].icon}
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">{steps[currentStep].title}</h2>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            {steps[currentStep].description}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <button 
                    onClick={complete}
                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
                >
                    Skip Demo
                </button>

                <div className="flex gap-3">
                    {currentStep > 0 && (
                        <button 
                            onClick={handlePrev}
                            className="flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-200 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:text-gray-900 transition-all shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                    )}
                    <button 
                        onClick={handleNext}
                        className={`flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-all shadow-xl shadow-primary/20 active:scale-95 group`}
                    >
                        {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
