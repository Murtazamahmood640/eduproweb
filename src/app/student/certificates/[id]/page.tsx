"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { 
  Award, ShieldCheck, Download, Share2, 
  Printer, Loader2, CheckCircle2, Landmark 
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function CertificateDetailView() {
  const { id } = useParams();
  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  const fetchCertificate = async () => {
    try {
      const res = await api.get(`/certificates/my`);
      const found = res.data.find((c: any) => c._id === id);
      if (found) setCert(found);
      else toast.error("Credential not found.");
    } catch (err) {
      toast.error("Failed to authenticate credential.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Verifying Academic Integrity...</p>
    </div>
  );

  if (!cert) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-6 print:p-0 print:bg-white">
      {/* Action Bar (Hidden on print) */}
      <div className="max-w-[1000px] mx-auto mb-12 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">Academic Distinction</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {cert.certificateId}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
          <button className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <Share2 className="w-4 h-4" /> Share Credential
          </button>
        </div>
      </div>

      {/* The Certificate Template */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        ref={certificateRef}
        className="max-w-[1100px] mx-auto bg-white shadow-[0_0_100px_rgba(0,0,0,0.05)] rounded-[2rem] overflow-hidden relative border-[12px] border-double border-gray-100 print:shadow-none print:border-none print:rounded-none"
      >
        {/* Aesthetic Borders & Watermarks */}
        <div className="absolute inset-0 border-[40px] border-white pointer-events-none" />
        <div className="absolute inset-[40px] border-2 border-primary/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
        
        <div className="relative z-10 p-20 md:p-32 text-center space-y-16">
          {/* Institutional Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-8">
               <div className="w-20 h-20 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-primary/30">
                  <Landmark className="w-10 h-10 text-white" />
               </div>
            </div>
            <h2 className="text-[12px] font-black text-primary uppercase tracking-[0.6em] mb-2">Institutional Achievement Award</h2>
            <div className="h-0.5 w-48 bg-primary/20 mx-auto" />
          </div>

          {/* Main Declaration */}
          <div className="space-y-12">
            <div>
              <p className="text-xl font-serif italic text-gray-500 mb-8">This is to certify that</p>
              <h3 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-4">
                {cert.student?.name || "Distinguished Scholar"}
              </h3>
              <p className="text-lg font-serif italic text-gray-500">has successfully attained the status of mastery in</p>
            </div>

            <div>
              <h4 className="text-4xl md:text-5xl font-black text-primary tracking-tight uppercase mb-6 leading-tight">
                {cert.course?.title}
              </h4>
              <p className="max-w-2xl mx-auto text-gray-400 font-medium leading-relaxed">
                Demonstrating exceptional proficiency, analytical capability, and academic excellence 
                through the rigorous completion of all course requirements with a final grade of 
                <span className="text-gray-900 font-black"> {cert.grade}</span>.
              </p>
            </div>
          </div>

          {/* Footer Metadata & Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 border-t border-gray-100">
             <div className="text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Issued On</p>
                <p className="text-sm font-black text-gray-900">{new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
             </div>
             
             <div className="flex flex-col items-center justify-center relative">
                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10 relative">
                   <ShieldCheck className="w-12 h-12 text-primary" />
                   <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20 animate-spin-slow" />
                </div>
                <p className="mt-4 text-[9px] font-black text-primary uppercase tracking-[0.2em]">Verified Secure</p>
             </div>

             <div className="text-center">
                <div className="mb-4 h-12 flex items-end justify-center">
                   <p className="font-serif italic text-2xl text-gray-800">EduPro Faculty</p>
                </div>
                <div className="h-px w-32 bg-gray-200 mx-auto mb-2" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Academic Board</p>
             </div>
          </div>

          {/* Verifiability Footnote */}
          <div className="pt-12 flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 text-[8px] font-black text-gray-300 uppercase tracking-widest">
               <CheckCircle2 className="w-3 h-3" /> Digital ID: {cert.certificateId}
             </div>
             <p className="text-[8px] text-gray-300 max-w-md uppercase tracking-widest">
               This credential is cryptographically signed and stored on the EduPro Academic Registry. 
               Verifiable via the institutional portal.
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
