import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Facebook,
  Instagram,
  Linkedin,
  Globe,
  Mail,
  Phone,
  Send,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const platformLinks = [
    { label: "Browse Courses", href: "/courses" },
    { label: "Our Trainers",   href: "/trainers" },
    { label: "About Us",       href: "/about" },
    { label: "Contact Us",     href: "/contact" },
    { label: "Feedback",       href: "/feedback" },
  ];

  const resourceLinks = [
    { label: "Student Portal",  href: "/student/dashboard" },
    { label: "Teacher Portal",  href: "/teacher/dashboard" },
    { label: "Privacy Policy",  href: "/privacy" },
    { label: "Help Center",     href: "/feedback" },
  ];

  const socials = [
    { Icon: Facebook,  href: "#" },
    { Icon: Instagram, href: "#" },
    { Icon: Linkedin,  href: "#" },
    { Icon: Globe,     href: "#" },
  ];

  return (
    <footer className="bg-primary text-white pt-20 pb-10 relative overflow-hidden">
      {/* Very subtle diagonal line pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 36px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Newsletter banner ──────────────────────── */}
        <div className="bg-white/10 border border-white/15 rounded-2xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-xl md:text-2xl font-black text-white mb-2">
              Stay Ahead with EduPro
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Get new courses, study tips, and resources delivered to your
              inbox every week.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 sm:w-72 px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-bold text-sm hover:bg-primary-50 transition-all active:scale-95 shadow-lg shadow-black/10 whitespace-nowrap">
              <Send className="w-4 h-4" />
              Subscribe
            </button>
          </div>
        </div>

        {/* ── Main grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="bg-white/15 p-2.5 rounded-xl group-hover:scale-105 transition-transform border border-white/20">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <div className="leading-none">
                <span className="font-black text-xl text-white">EduPro</span>
                <span className="block text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 mt-0.5">Academy</span>
              </div>
            </Link>

            <p className="text-white/55 text-sm leading-relaxed max-w-xs">
              EduPro Academy is a globally trusted online learning platform
              empowering students to master academics and advance their futures.
            </p>

            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 flex items-center justify-center bg-white/10 border border-white/15 rounded-lg hover:bg-white hover:text-primary transition-all text-white"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-5">
              Platform
            </h4>
            <ul className="space-y-3">
              {platformLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white font-medium transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-5">
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white font-medium transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/10 border border-white/15 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">Email</p>
                  <a href="mailto:support@edupro.com" className="text-sm text-white/80 hover:text-white transition-colors">
                    support@edupro.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/10 border border-white/15 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">Phone</p>
                  <a href="tel:+15551234567" className="text-sm text-white/80 hover:text-white transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────── */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © {currentYear}{" "}
            <span className="text-white font-semibold">EduPro Academy</span>.
            All rights reserved. Built for future leaders worldwide.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms",   href: "/terms"   },
              { label: "Cookies", href: "/refund"  },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[11px] font-semibold text-white/40 hover:text-white transition-colors uppercase tracking-wider"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
