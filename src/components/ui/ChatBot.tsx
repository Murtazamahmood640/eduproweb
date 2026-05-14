"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, X, Send, Bot, User, 
  Sparkles, GraduationCap, BookOpen, Award,
  Users, ShieldCheck, BarChart3, CreditCard,
  ArrowRight, ChevronDown
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
  quickReplies?: string[];
  link?: { text: string; href: string };
}

const KNOWLEDGE_BASE: Record<string, { answer: string; quickReplies?: string[]; link?: { text: string; href: string } }> = {
  greeting: {
    answer: "Welcome to EduPro Academy! 🎓 I'm your virtual assistant. I can help you learn about our courses, pricing, certifications, and how to get started. What would you like to know?",
    quickReplies: ["What courses do you offer?", "How much does it cost?", "Tell me about certifications", "How do I sign up?"]
  },
  courses: {
    answer: "We offer a wide range of professional courses including:\n\n📐 **O-Level Mathematics** — Cambridge-certified curriculum\n💻 **Web Development** — Full-stack with React & Node.js\n🇩🇪 **German Language** (A1-B2) — With native instructors\n📊 **Data Science & AI** — Hands-on with Python\n🎨 **UI/UX Design** — Industry-standard tools\n\nAll courses include video lectures, quizzes, assignments, and a verified certificate upon completion.",
    quickReplies: ["How much does it cost?", "Who are the teachers?", "How do I enroll?"],
    link: { text: "Browse All Courses", href: "/courses" }
  },
  pricing: {
    answer: "Our pricing is designed to be accessible:\n\n💎 **Individual Courses** — Starting from $29\n🏆 **Premium Bundle** — Access all courses for $99/year\n🆓 **Free Trial** — Preview any course before purchasing\n\nWe also offer scholarships and group discounts for institutions. All purchases include lifetime access to course materials.",
    quickReplies: ["How do I sign up?", "What's included?", "Refund policy?"]
  },
  certifications: {
    answer: "Every completed course earns you a **verified digital certificate** that you can:\n\n✅ Share on LinkedIn and social media\n✅ Download as a professional PDF\n✅ Verify online via unique certificate ID\n\nOur certificates are recognized by leading institutions and employers worldwide.",
    quickReplies: ["How do I earn a certificate?", "What courses do you offer?", "Sign up now"],
    link: { text: "View Certificates", href: "/about" }
  },
  signup: {
    answer: "Getting started is easy! Here's how:\n\n1️⃣ Click **'Get Started'** or visit our signup page\n2️⃣ Choose your role — **Student** or **Teacher**\n3️⃣ Verify your email with a quick OTP code\n4️⃣ Browse courses and start learning!\n\nThe entire process takes less than 2 minutes.",
    quickReplies: ["What courses do you offer?", "How much does it cost?", "Teacher benefits?"],
    link: { text: "Create Free Account", href: "/auth/signup" }
  },
  teachers: {
    answer: "Our faculty includes **Cambridge-certified educators** and industry professionals with 10+ years of experience. Each instructor is:\n\n🎯 Vetted through a rigorous selection process\n📹 Required to provide high-quality video content\n📝 Monitored for student satisfaction ratings\n\nInterested in teaching? Apply through our Teacher Portal!",
    quickReplies: ["How do I become a teacher?", "What courses do you offer?", "Student benefits?"],
    link: { text: "Meet Our Trainers", href: "/trainers" }
  },
  features: {
    answer: "EduPro Academy offers a **premium learning experience**:\n\n📹 **HD Video Lectures** — Learn at your own pace\n📝 **Interactive Quizzes** — Test your knowledge\n📋 **Assignments** — Apply what you've learned\n📊 **Progress Analytics** — Track your trajectory\n🏆 **Verified Certificates** — Prove your skills\n👨‍🏫 **Expert Faculty** — Top 1% instructors\n💬 **Community Support** — Connect with peers",
    quickReplies: ["How much does it cost?", "How do I sign up?", "What courses do you offer?"]
  },
  refund: {
    answer: "We offer a **30-day money-back guarantee** on all course purchases. If you're not satisfied, simply contact our support team for a full refund — no questions asked.\n\nYour satisfaction is our priority! 💙",
    quickReplies: ["How do I sign up?", "What courses do you offer?", "Contact support"]
  },
  contact: {
    answer: "You can reach us through multiple channels:\n\n📧 **Email**: support@edupro.academy\n📞 **Phone**: Available Mon-Fri, 9am-5pm\n💬 **Live Chat**: You're using it right now!\n📍 **Office**: Visit our Contact page for directions\n\nWe typically respond within 24 hours.",
    quickReplies: ["What courses do you offer?", "How do I sign up?"],
    link: { text: "Contact Us", href: "/contact" }
  },
  teacher_benefits: {
    answer: "As an EduPro instructor, you get:\n\n💰 **Revenue Sharing** — Earn from every enrollment\n📊 **Analytics Dashboard** — Track your impact\n🛠️ **Course Builder** — Professional content tools\n🌍 **Global Reach** — Students from around the world\n🏆 **Recognition** — Featured instructor profiles\n\nApply today and start making a difference!",
    quickReplies: ["How do I sign up?", "What courses do you offer?"],
    link: { text: "Apply as Teacher", href: "/auth/signup" }
  },
  default: {
    answer: "I'm not sure I understand that question. Let me help you with what I know best! You can ask me about:\n\n• Our courses and curriculum\n• Pricing and payment options\n• Certifications and credentials\n• How to sign up\n• Teacher opportunities\n\nOr try one of the options below:",
    quickReplies: ["What courses do you offer?", "How much does it cost?", "How do I sign up?", "Tell me about certifications"]
  }
};

function matchIntent(input: string): string {
  const lower = input.toLowerCase();
  
  if (/^(hi|hello|hey|good morning|good evening|sup|yo|greetings)/i.test(lower)) return "greeting";
  if (/course|program|learn|study|class|subject|curriculum|offer|teach/i.test(lower)) return "courses";
  if (/price|cost|fee|pay|money|afford|cheap|expensive|free|discount|how much/i.test(lower)) return "pricing";
  if (/certif|diploma|credential|badge|award|verify|recognized/i.test(lower)) return "certifications";
  if (/sign.?up|register|join|start|create.?account|enroll|get.?started|how.?do.?i/i.test(lower) && !/teacher|teach|instruct/i.test(lower)) return "signup";
  if (/teacher|instructor|faculty|professor|trainer|tutor|who.?teach/i.test(lower) && /benefit|become|apply|earn|revenue/i.test(lower)) return "teacher_benefits";
  if (/teacher|instructor|faculty|professor|trainer|tutor|who.?teach/i.test(lower)) return "teachers";
  if (/feature|what.?include|tool|analytics|quiz|assignment|video|platform/i.test(lower)) return "features";
  if (/refund|money.?back|cancel|return|guarantee/i.test(lower)) return "refund";
  if (/contact|support|help|email|phone|reach|talk/i.test(lower)) return "contact";
  
  return "default";
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message
      setTimeout(() => {
        const welcome = KNOWLEDGE_BASE.greeting;
        addBotMessage(welcome.answer, welcome.quickReplies);
      }, 500);
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const addBotMessage = (text: string, quickReplies?: string[], link?: { text: string; href: string }) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text,
        sender: "bot",
        timestamp: new Date(),
        quickReplies,
        link
      }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: msg,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // 1. Try Knowledge Base first (Instant response for common intents)
    const intent = matchIntent(msg);
    if (intent !== "default") {
       const response = KNOWLEDGE_BASE[intent];
       addBotMessage(response.answer, response.quickReplies, response.link);
       return;
    }

    // 2. Otherwise, use AI Intelligence for dynamic answers
    setIsTyping(true);
    try {
      const res = await api.post("/ai/chat", { 
        message: msg,
        history: messages.slice(-5)
      });
      
      const aiResponse = res.data.response;
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
        quickReplies: ["Tell me about courses", "How much does it cost?"]
      }]);
    } catch (err) {
      addBotMessage("I'm having a bit of trouble reaching my central intelligence. Can I help you with something basic instead?", KNOWLEDGE_BASE.default.quickReplies);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[90] w-16 h-16 bg-gradient-to-br from-primary to-primary-600 text-white rounded-2xl shadow-2xl shadow-primary/30 flex items-center justify-center group"
          >
            <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[100] w-[400px] h-[600px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-600 p-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm">EduPro Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-white/70 text-[9px] font-bold uppercase tracking-widest">Online · Instant Reply</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] ${msg.sender === "user" ? "order-1" : "order-2"}`}>
                    {msg.sender === "bot" && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 bg-primary/10 rounded-md flex items-center justify-center">
                          <Bot className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">EduPro AI</span>
                      </div>
                    )}
                    <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-primary text-white rounded-br-md font-semibold" 
                        : "bg-white border border-gray-100 text-gray-700 rounded-bl-md shadow-sm font-medium"
                    }`}>
                      {msg.text.split('\n').map((line, i) => (
                        <span key={i}>
                          {line.split(/(\*\*.*?\*\*)/).map((part, j) => 
                            part.startsWith('**') && part.endsWith('**') 
                              ? <strong key={j} className="font-black">{part.slice(2, -2)}</strong>
                              : part
                          )}
                          {i < msg.text.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>

                    {/* Link button */}
                    {msg.link && (
                      <Link 
                        href={msg.link.href}
                        className="mt-2 flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/20 transition-all w-fit"
                      >
                        {msg.link.text} <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}

                    {/* Quick Replies */}
                    {msg.quickReplies && msg.sender === "bot" && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.quickReplies.map((reply) => (
                          <button
                            key={reply}
                            onClick={() => handleSend(reply)}
                            className="px-3 py-1.5 bg-white border border-primary/20 text-primary text-[10px] font-bold rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 bg-primary/10 rounded-md flex items-center justify-center">
                    <Bot className="w-3 h-3 text-primary" />
                  </div>
                  <div className="px-4 py-3 bg-white border border-gray-100 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about courses, pricing, or features..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="p-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-primary/20 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-2">
                Powered by EduPro Intelligence
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
