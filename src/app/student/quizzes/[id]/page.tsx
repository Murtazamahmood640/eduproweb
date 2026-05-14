"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Brain, Clock, ChevronRight, ChevronLeft, CheckCircle, X, Trophy, Loader2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quiz && !submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz, submitted, timeLeft]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/quizzes/${id}`);
      setQuiz(res.data);
      setTimeLeft((res.data.duration || 15) * 60);
      setAnswers(Array(res.data.questions.length).fill(null));
    } catch (err) {
      toast.error("Failed to load quiz.");
      router.push("/student/quizzes");
    } finally {
      setLoading(false);
    }
  };

  const q = quiz?.questions?.[current];
  const totalAnswered = answers.filter((a) => a !== null).length;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < quiz.questions.length - 1) {
      setCurrent(current + 1);
      setSelected(answers[current + 1]);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(answers[current - 1]);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const score = Math.round((answers.filter((a, i) => a === quiz.questions[i].correctAnswer).length / quiz.questions.length) * 100);
    
    try {
      await api.post(`/quizzes/${id}/submit`, {
        answers,
        score
      });
      if (score >= 60) toast.success("Elite performance! Quiz passed.");
      else toast.error("Passing threshold not met.");
    } catch (err) {
      console.error("Failed to save results", err);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-edu-indigo animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 tracking-widest">Architecting Assessment...</p>
    </div>
  );

  if (submitted) {
    const score = Math.round((answers.filter((a, i) => a === quiz.questions[i].correctAnswer).length / quiz.questions.length) * 100);
    const passed = score >= 60;
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-12">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${passed ? "bg-emerald-100" : "bg-red-100"}`}>
          {passed ? <Trophy className="w-12 h-12 text-edu-emerald" /> : <X className="w-12 h-12 text-red-500" />}
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">{passed ? "🎉 Quiz Passed!" : "Quiz Failed"}</h1>
          <p className="text-slate-500">{quiz.title}</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className={`text-6xl font-display font-bold mb-2 ${passed ? "text-edu-emerald" : "text-red-500"}`}>{score}%</div>
          <p className="text-slate-500 text-sm">{answers.filter((a, i) => a === quiz.questions[i].correctAnswer).length} / {quiz.questions.length} correct answers</p>
          {passed ? (
            <p className="mt-3 text-edu-emerald font-medium text-sm">Excellent work! You have mastered this content.</p>
          ) : (
            <p className="mt-3 text-red-500 font-medium text-sm">You need 60% to pass. Review the material and try again.</p>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setSubmitted(false); setCurrent(0); setSelected(null); setAnswers(Array(quiz.questions.length).fill(null)); setTimeLeft((quiz.duration || 15) * 60); }}
            className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50">
            Retake Quiz
          </button>
          <a href="/student/quizzes" className="px-6 py-3 bg-edu-indigo text-white rounded-xl font-bold hover:bg-edu-indigo/90">
            Back to Quizzes
          </a>
        </div>
      </div>
    );
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-lg font-bold text-slate-900">{quiz.title}</h1>
          <p className="text-xs text-slate-500">{quiz.course?.title}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <Clock className="w-4 h-4 text-edu-indigo" />
          <span className="font-bold text-slate-900 text-sm tabular-nums">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-edu-indigo rounded-full transition-all" style={{ width: `${((current + 1) / quiz.questions.length) * 100}%` }} />
        </div>
        <span className="text-xs font-bold text-slate-500 flex-shrink-0">{current + 1}/{quiz.questions.length}</span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-edu-indigo flex items-center justify-center flex-shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {current + 1}</span>
        </div>

        <h2 className="font-display text-lg font-bold text-slate-900 mb-6 leading-relaxed">{q.question}</h2>

        <div className="space-y-3">
          {q.options.map((opt: string, i: number) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all font-medium text-sm ${
                selected === i
                  ? "border-edu-indigo bg-indigo-50 text-edu-indigo"
                  : "border-slate-200 text-slate-700 hover:border-edu-indigo/50 hover:bg-slate-50"
              }`}
            >
              <span className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold mr-3 ${
                selected === i ? "bg-edu-indigo text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {["A", "B", "C", "D"][i]}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={handlePrev} disabled={current === 0} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex gap-1">
          {quiz.questions.map((_: any, i: number) => (
            <button key={i} onClick={() => { setCurrent(i); setSelected(answers[i]); }}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-edu-indigo w-6" : answers[i] !== null ? "bg-edu-emerald" : "bg-slate-200"}`}
            />
          ))}
        </div>

        {current === quiz.questions.length - 1 ? (
          <button onClick={handleSubmit} disabled={totalAnswered < quiz.questions.length}
            className="flex items-center gap-2 px-5 py-2.5 bg-edu-emerald text-white rounded-xl font-bold text-sm hover:bg-edu-emerald/90 disabled:opacity-40 disabled:cursor-not-allowed">
            <CheckCircle className="w-4 h-4" /> Submit Quiz
          </button>
        ) : (
          <button onClick={handleNext} className="flex items-center gap-2 px-4 py-2.5 bg-edu-indigo text-white rounded-xl font-bold text-sm hover:bg-edu-indigo/90">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
