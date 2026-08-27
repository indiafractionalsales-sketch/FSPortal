"use client";

/**
 * Copyright (c) 2026 Biztribe Trading & Consultancy India Private Limited.
 * All rights reserved.
 *
 * This file is part of the Fractional Sales Partner platform.
 * CONFIDENTIAL AND PROPRIETARY — Unauthorised copying, redistribution,
 * modification, or use of this file, via any medium, is strictly prohibited.
 * Violation will result in civil and criminal prosecution under the
 * Copyright Act 1957, Information Technology Act 2000, and applicable
 * Indian and international intellectual property laws.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Briefcase, ShieldCheck, CheckCircle2, ArrowRight, Building2, 
  MapPin, Calendar, Lock, Video, Camera, Sparkles, ChevronDown, 
  Users, Layers, Award, FileText, Globe2, Scan, HelpCircle, ArrowUpRight,
  TrendingUp, AlertCircle, RefreshCw, DollarSign, Compass, PieChart, Check, XIcon,
  Clock, Zap
} from "lucide-react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

export default function PostRequirementPage() {
  const router = useRouter();
  const [activeStoryTab, setActiveStoryTab] = useState<"problem" | "nuances" | "solution" | "post">("problem");
  const [budgetSlider, setBudgetSlider] = useState<number>(30000);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Realtime World Clocks
  const [times, setTimes] = useState({
    paris: "",
    dubai: "",
    frankfurt: "",
    singapore: "",
    london: "",
    newyork: ""
  });

  // Toast Notification Cycle State
  const [toastIndex, setToastIndex] = useState(0);

  const toasts = [
    { text: "Textile Exporter from Surat just booked SP for Dubai Gitex 2026", flag: "🇦🇪" },
    { text: "Engineering Components Brand from Pune posted requirement for Frankfurt Messe", flag: "🇩🇪" },
    { text: "Ayurvedic Brand from Ahmedabad hired SP for Paris Expo 2026", flag: "🇫🇷" },
    { text: "Leather Goods Trader from Kanpur booked SP for Milan Design Week", flag: "🇮🇹" }
  ];

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setTimes({
        paris: now.toLocaleTimeString("en-US", { timeZone: "Europe/Paris", hour: '2-digit', minute: '2-digit' }),
        dubai: now.toLocaleTimeString("en-US", { timeZone: "Asia/Dubai", hour: '2-digit', minute: '2-digit' }),
        frankfurt: now.toLocaleTimeString("en-US", { timeZone: "Europe/Berlin", hour: '2-digit', minute: '2-digit' }),
        singapore: now.toLocaleTimeString("en-US", { timeZone: "Asia/Singapore", hour: '2-digit', minute: '2-digit' }),
        london: now.toLocaleTimeString("en-US", { timeZone: "Europe/London", hour: '2-digit', minute: '2-digit' }),
        newyork: now.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: '2-digit', minute: '2-digit' })
      });
    };

    updateTimes();
    const interval = setInterval(updateTimes, 10000);

    const toastInterval = setInterval(() => {
      setToastIndex((prev) => (prev + 1) % toasts.length);
    }, 4500);

    return () => {
      clearInterval(interval);
      clearInterval(toastInterval);
    };
  }, []);

  // Calculations for interactive budget simulator
  const traditionalMarketsCovered = Math.max(1, Math.floor(budgetSlider / 60000));
  const fractionalExposCovered = Math.floor(budgetSlider / 2500);
  const fractionalCountriesCovered = Math.min(12, Math.max(2, Math.floor(fractionalExposCovered / 1.5)));

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans flex flex-col selection:bg-rose-100 selection:text-rose-900 relative">
      {/* Global Top Navbar */}
      <Navbar />

      {/* Floating Live Activity Toast Notification (Visual Hook 3.2) */}
      <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-white/95 backdrop-blur-md border-2 border-emerald-300 rounded-2xl p-4 shadow-xl transition-all animate-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">{toasts[toastIndex].flag}</span>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-headline font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Platform Match
            </div>
            <p className="text-xs font-semibold text-gray-900 leading-snug">
              {toasts[toastIndex].text}
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section: Presentation Header */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-white via-rose-50/50 to-[#fcfcfc] border-b border-rose-100 relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-rose-200/30 via-amber-200/30 to-sky-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl text-center">
          
          {/* World Clock Live Realtime Widget Bar (Visual Hook 1.3) */}
          <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-2xl bg-white/90 border-2 border-rose-200/80 shadow-2xs text-xs text-gray-800 font-medium">
            <span className="flex items-center gap-1.5 text-rose-700 font-headline font-bold text-[10px] uppercase tracking-wider pr-2 border-r border-rose-200">
              <Clock className="w-3.5 h-3.5 text-rose-600 animate-spin" style={{ animationDuration: '12s' }} /> Live Rep Status
            </span>
            <span className="flex items-center gap-1">🇫🇷 Paris <strong className="text-rose-950 font-bold">{times.paris || "12:30"}</strong></span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">🇩🇪 Frankfurt <strong className="text-rose-950 font-bold">{times.frankfurt || "12:30"}</strong></span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">🇦🇪 Dubai <strong className="text-rose-950 font-bold">{times.dubai || "14:30"}</strong></span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">🇸🇬 Singapore <strong className="text-rose-950 font-bold">{times.singapore || "18:30"}</strong></span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">🇬🇧 London <strong className="text-rose-950 font-bold">{times.london || "11:30"}</strong></span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/80 border border-rose-300 text-rose-900 text-xs font-bold font-headline uppercase tracking-wider mb-6 shadow-xs block w-fit mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>The MSME Global Expansion Playbook</span>
          </div>

          {/* 2 Parallel Cheerful Verticals Hero Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left mb-12 max-w-6xl mx-auto">
            
            {/* Vertical 1: The Problem (Rich Warm Rose Panel) */}
            <div className="bg-[#fff1f2] border-2 border-rose-200/90 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/40 rounded-bl-full pointer-events-none" />
              
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-900 text-[10px] font-bold font-headline uppercase tracking-wider mb-4 shadow-2xs">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Vertical 01 — The Problem</span>
                </div>

                <h2 className="text-xl md:text-2xl font-serif font-bold text-rose-950 leading-snug mb-3">
                  Why Sinking Your Budget into One Country Fails
                </h2>

                <p className="text-xs md:text-sm text-rose-900/80 leading-relaxed mb-6">
                  Pouring your entire MSME expansion budget into a single full-time hire in one country burns $120,000+ in fixed overhead, locks you into one market, and leaves zero budget for other global regions.
                </p>

                {/* Doodle Graphic: Thinking Founder at Desk with Pen */}
                <div className="bg-white border-2 border-rose-200/90 rounded-2xl p-5 shadow-xs mb-4 text-center">
                  <div className="flex items-center justify-center gap-4 py-2">
                    <svg className="w-24 h-24 text-rose-600 shrink-0" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 80 L90 80" />
                      <path d="M20 80 L20 95" />
                      <path d="M80 80 L80 95" />
                      <circle cx="50" cy="35" r="12" />
                      <path d="M50 47 L50 70" />
                      <path d="M50 55 L35 45" />
                      <path d="M35 45 L32 38" />
                      <path d="M50 55 L68 65" />
                      <path d="M30 36 L24 30" stroke="#701010" strokeWidth="3" />
                      <path d="M68 28 C75 25, 82 25, 85 30 C88 35, 85 40, 80 42 C85 45, 82 50, 75 48 C72 48, 70 45, 68 42 Z" fill="#fff1f2" stroke="#f43f5e" strokeDasharray="3 3" />
                      <text x="76" y="38" fontSize="8" fontWeight="bold" fill="#be123c" textAnchor="middle" stroke="none">$120K</text>
                      <text x="76" y="44" fontSize="6" fill="#be123c" textAnchor="middle" stroke="none">Sunk!</text>
                    </svg>
                    
                    <div className="text-left max-w-xs">
                      <p className="text-xs font-bold text-rose-950 mb-1">Founder's Capital Dilemma</p>
                      <p className="text-[11px] text-gray-600 leading-snug">
                        Sitting at the desk with pen in hand... realizing 100% of capital is trapped in 1 market with high fixed risk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-rose-200/70 border border-rose-300 rounded-xl text-xs text-rose-950 font-bold flex items-center justify-between shadow-2xs">
                <span>⚠️ High Fixed Risk</span>
                <span className="text-rose-800">0 Multi-Country Reach</span>
              </div>
            </div>

            {/* Vertical 2: The Solution (Rich Cheerful Emerald Panel) */}
            <div className="bg-[#ecfdf5] border-2 border-emerald-200/90 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/40 rounded-bl-full pointer-events-none" />

              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 text-[10px] font-bold font-headline uppercase tracking-wider mb-4 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Vertical 02 — The Solution</span>
                </div>

                <h2 className="text-xl md:text-2xl font-serif font-bold text-emerald-950 leading-snug mb-3">
                  How Fractional Sales Unlocks Global Reach
                </h2>

                <p className="text-xs md:text-sm text-emerald-900/80 leading-relaxed mb-6">
                  Distribute the exact same budget across 6+ countries. Hire verified native Sales Partners for specific expos, buyer verifications, and market entries under 7-day escrow protection.
                </p>

                {/* Doodle Graphic: Global Expansion Tree */}
                <div className="bg-white border-2 border-emerald-200/90 rounded-2xl p-5 shadow-xs mb-4 text-center">
                  <div className="flex items-center justify-center gap-4 py-2">
                    <svg className="w-24 h-24 text-emerald-600 shrink-0" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="50" cy="50" r="14" fill="#ecfdf5" stroke="#059669" />
                      <text x="50" y="52" fontSize="7" fontWeight="bold" fill="#047857" textAnchor="middle" stroke="none">BUDGET</text>
                      <path d="M50 36 L50 18" stroke="#10b981" />
                      <path d="M62 42 L80 30" stroke="#10b981" />
                      <path d="M62 58 L80 70" stroke="#10b981" />
                      <path d="M38 58 L20 70" stroke="#10b981" />
                      <path d="M38 42 L20 30" stroke="#10b981" />
                      <circle cx="50" cy="14" r="8" fill="#fff" stroke="#10b981" />
                      <text x="50" y="17" fontSize="7" textAnchor="middle" stroke="none">🇫🇷</text>
                      <circle cx="84" cy="27" r="8" fill="#fff" stroke="#10b981" />
                      <text x="84" y="30" fontSize="7" textAnchor="middle" stroke="none">🇩🇪</text>
                      <circle cx="84" cy="73" r="8" fill="#fff" stroke="#10b981" />
                      <text x="84" y="76" fontSize="7" textAnchor="middle" stroke="none">🇮🇹</text>
                      <circle cx="16" cy="73" r="8" fill="#fff" stroke="#10b981" />
                      <text x="16" y="76" fontSize="7" textAnchor="middle" stroke="none">🇦🇪</text>
                      <circle cx="16" cy="27" r="8" fill="#fff" stroke="#10b981" />
                      <text x="16" y="30" fontSize="7" textAnchor="middle" stroke="none">🇺🇸</text>
                    </svg>

                    <div className="text-left max-w-xs">
                      <p className="text-xs font-bold text-emerald-950 mb-1">Optimized Global Distribution</p>
                      <p className="text-[11px] text-gray-600 leading-snug">
                        1 Budget → Native Local Experts in France, Germany, Italy, UAE &amp; US. Pay only per event.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-200/70 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-bold flex items-center justify-between shadow-2xs">
                <span>✨ 0 Fixed Payroll Risk</span>
                <span className="text-emerald-800">6+ Markets Covered</span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => router.push("/login?role=obo&redirect=create-post")}
              className="w-full sm:w-auto px-8 py-4 bg-[#701010] hover:bg-[#5a0c0c] text-white font-headline font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Post Requirement Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-rose-200" />
            </button>
            <a
              href="#interactive-presentation"
              className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-headline font-bold text-sm uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Executive Presentation</span>
              <PieChart className="w-4 h-4 text-gray-500" />
            </a>
          </div>

          {/* Cheerful Color Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-[#fff1f2] border-2 border-rose-200 p-4 rounded-2xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-rose-700">Cost Savings</p>
              <p className="text-xl font-serif font-bold text-rose-950">Up to 80%</p>
              <p className="text-[10px] text-rose-900/70">Vs hiring full-time overseas reps</p>
            </div>
            <div className="bg-[#ecfdf5] border-2 border-emerald-200 p-4 rounded-2xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Global Reach</p>
              <p className="text-xl font-serif font-bold text-emerald-950">5x Markets</p>
              <p className="text-[10px] text-emerald-900/70">Covered under the same budget</p>
            </div>
            <div className="bg-[#fffbeb] border-2 border-amber-200 p-4 rounded-2xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Local Nuance</p>
              <p className="text-xl font-serif font-bold text-amber-950">100% Native</p>
              <p className="text-[10px] text-amber-900/70">Local language &amp; buyer network</p>
            </div>
            <div className="bg-[#f0f9ff] border-2 border-sky-200 p-4 rounded-2xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-700">Security</p>
              <p className="text-[11px] font-bold text-sky-950">7-Day Escrow Payout</p>
              <p className="text-[10px] text-sky-900/70">Section 10A IT Act Contract</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Market Coverage Staggered Flag Grid (Visual Hook 6.2) */}
      <section className="py-12 bg-gradient-to-r from-rose-50/40 via-amber-50/40 to-emerald-50/40 border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <p className="text-center text-xs font-headline font-bold uppercase tracking-widest text-gray-500 mb-6">
            Active Verified Sales Partner Coverage Across 12 Key Global Markets
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
            {[
              { flag: "🇫🇷", name: "France", count: "34 Reps Active" },
              { flag: "🇩🇪", name: "Germany", count: "48 Reps Active" },
              { flag: "🇦🇪", name: "UAE & Gulf", count: "52 Reps Active" },
              { flag: "🇮🇹", name: "Italy", count: "29 Reps Active" },
              { flag: "🇬🇧", name: "United Kingdom", count: "41 Reps Active" },
              { flag: "🇺🇸", name: "United States", count: "65 Reps Active" },
              { flag: "🇸🇬", name: "Singapore", count: "22 Reps Active" },
              { flag: "🇯🇵", name: "Japan", count: "18 Reps Active" },
              { flag: "🇪🇸", name: "Spain", count: "26 Reps Active" },
              { flag: "🇳🇱", name: "Netherlands", count: "31 Reps Active" },
              { flag: "🇸🇦", name: "Saudi Arabia", count: "38 Reps Active" },
              { flag: "🇮🇳", name: "India", count: "110 Reps Active" }
            ].map((market, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-xs border border-gray-200 rounded-xl p-3 shadow-2xs hover:shadow-xs hover:scale-105 transition-all">
                <span className="text-2xl block mb-1">{market.flag}</span>
                <p className="text-xs font-bold text-gray-900 leading-tight">{market.name}</p>
                <p className="text-[10px] font-medium text-emerald-700 mt-0.5">{market.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Presentation Storyboard */}
      <section id="interactive-presentation" className="py-16 md:py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-rose-800 bg-rose-100 border border-rose-300 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
              Executive Presentation
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              The Strategic Shift: From Fixed Capital Sinking to Fractional Distribution
            </h2>
          </div>

          {/* Presentation Nav Switcher Tabs */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-12 p-2 bg-gray-100/90 rounded-2xl max-w-3xl mx-auto border border-gray-200/80 shadow-2xs">
            <button
              onClick={() => setActiveStoryTab("problem")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-headline uppercase tracking-wider transition-all cursor-pointer ${
                activeStoryTab === "problem"
                  ? "bg-[#701010] text-white shadow-md"
                  : "text-gray-700 hover:text-gray-900 hover:bg-white/60"
              }`}
            >
              1. The Capital Trap
            </button>
            <button
              onClick={() => setActiveStoryTab("nuances")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-headline uppercase tracking-wider transition-all cursor-pointer ${
                activeStoryTab === "nuances"
                  ? "bg-[#701010] text-white shadow-md"
                  : "text-gray-700 hover:text-gray-900 hover:bg-white/60"
              }`}
            >
              2. Cultural Nuances
            </button>
            <button
              onClick={() => setActiveStoryTab("solution")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-headline uppercase tracking-wider transition-all cursor-pointer ${
                activeStoryTab === "solution"
                  ? "bg-[#701010] text-white shadow-md"
                  : "text-gray-700 hover:text-gray-900 hover:bg-white/60"
              }`}
            >
              3. Fractional Solution
            </button>
            <button
              onClick={() => setActiveStoryTab("post")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-headline uppercase tracking-wider transition-all cursor-pointer ${
                activeStoryTab === "post"
                  ? "bg-[#701010] text-white shadow-md"
                  : "text-gray-700 hover:text-gray-900 hover:bg-white/60"
              }`}
            >
              4. Live Post Demo
            </button>
          </div>

          {/* Presentation Slide 1: The Problem */}
          {activeStoryTab === "problem" && (
            <div className="bg-[#fff1f2] border-2 border-rose-300 rounded-3xl p-8 md:p-12 shadow-sm animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-800 bg-white border border-rose-300 px-3 py-1 rounded-md mb-4 inline-block shadow-2xs">
                    Slide 01 — The MSME Expansion Dilemma
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-rose-950 mb-4">
                    The Capital Trap of Traditional Overseas Offices
                  </h3>
                  <p className="text-xs md:text-sm text-rose-900/80 leading-relaxed mb-6">
                    When a Business Owner, Manufacturer, or Trader wants to expand globally, traditional advice says: <em className="text-rose-950 font-bold">"Set up a local entity, lease an office, and hire a full-time sales executive in the target country."</em>
                  </p>

                  <div className="space-y-3 bg-white p-5 rounded-2xl border-2 border-rose-200 text-xs shadow-2xs">
                    <div className="flex items-center justify-between text-gray-900 font-bold border-b border-rose-100 pb-2">
                      <span>Full-Time Overseas Hire (1 Country)</span>
                      <span className="text-rose-600 font-extrabold">$80,000 - $120,000 / yr</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-700">
                      <span>Local Office Lease &amp; Compliance</span>
                      <span>$25,000 / yr</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-700">
                      <span>Travel &amp; Administrative Overhead</span>
                      <span>$15,000 / yr</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-rose-800 pt-2 border-t border-rose-100">
                      <span>Total Fixed Budget Consumed</span>
                      <span className="text-rose-700 font-extrabold">$120,000+ (Sunk in 1 Market)</span>
                    </div>
                  </div>
                </div>

                {/* Visual Doodle Illustration / Comparison Diagram */}
                <div className="bg-white border-2 border-rose-300 rounded-2xl p-6 shadow-sm text-center">
                  <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-300 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-rose-950 mb-2">High Risk &amp; High Sunk Cost</h4>
                  <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                    You have spent your <strong>entire MSME expansion budget</strong> on a single country. If that market slows down, 100% of your capital is at risk, leaving $0 for UK, Germany, UAE, or US opportunities.
                  </p>
                  <div className="p-3 bg-rose-100/80 border border-rose-300 rounded-xl text-xs text-rose-950 font-bold">
                    ⚠️ 0 Flexibility | 0 Budget for other markets | High Fixed Payroll Risk
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Presentation Slide 2: Cultural Sales Nuance Matrix (Cheerful Color Panels) */}
          {activeStoryTab === "nuances" && (
            <div className="bg-[#fffbeb] border-2 border-amber-300 rounded-3xl p-8 md:p-12 shadow-sm animate-in fade-in duration-300">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900 bg-white border border-amber-300 px-3 py-1 rounded-md mb-3 inline-block shadow-2xs">
                  Slide 02 — Cross-Border Reality
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mb-3">
                  How You Sell in France 🇫🇷 ≠ Italy 🇮🇹 ≠ Germany 🇩🇪
                </h3>
                <p className="text-xs md:text-sm text-amber-900/80">
                  Every country has distinct business etiquettes, language expectations, and buyer relationships. A single full-time hire cannot effectively cover multiple distinct cultures.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* France (Soft Royal Blue / Indigo Tint) */}
                <div className="bg-[#f4f4ff] border-2 border-indigo-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">🇫🇷</span>
                      <div>
                        <h4 className="font-serif font-bold text-base text-indigo-950">France (Paris Expos)</h4>
                        <p className="text-[10px] text-indigo-700 font-bold uppercase">Relationship &amp; Compliance</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed mb-4">
                      Requires fluent French, formal business etiquette, strict EU regulatory documentation, and local relationship cultivation.
                    </p>
                  </div>
                  <div className="text-[11px] text-indigo-950 font-bold p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs">
                    💡 Needs local native French speaker with trade fair networks.
                  </div>
                </div>

                {/* Italy (Warm Terracotta / Orange Tint) */}
                <div className="bg-[#fff7ed] border-2 border-orange-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">🇮🇹</span>
                      <div>
                        <h4 className="font-serif font-bold text-base text-orange-950">Italy (Milan Trade Fairs)</h4>
                        <p className="text-[10px] text-orange-700 font-bold uppercase">Design &amp; Personal Rapport</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed mb-4">
                      Requires strong personal rapport, deep aesthetic and product design presentation, and direct localized buyer introductions.
                    </p>
                  </div>
                  <div className="text-[11px] text-orange-950 font-bold p-3 bg-white rounded-xl border border-orange-200 shadow-2xs">
                    💡 Needs on-ground Italian rep with direct B2B buyer connections.
                  </div>
                </div>

                {/* Germany (Crisp Forest Emerald Tint) */}
                <div className="bg-[#f0fdf4] border-2 border-emerald-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">🇩🇪</span>
                      <div>
                        <h4 className="font-serif font-bold text-base text-emerald-950">Germany (Hannover Messe)</h4>
                        <p className="text-[10px] text-emerald-700 font-bold uppercase">Precision &amp; Technical Specs</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed mb-4">
                      Requires extreme engineering precision, structured data sheets, German fluency, and verified quality certification handovers.
                    </p>
                  </div>
                  <div className="text-[11px] text-emerald-950 font-bold p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                    💡 Needs technical sales delegate fluent in German &amp; ISO standards.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Presentation Slide 3: The Fractional Solution */}
          {activeStoryTab === "solution" && (
            <div className="bg-[#ecfdf5] border-2 border-emerald-300 rounded-3xl p-8 md:p-12 shadow-sm animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-900 bg-white border border-emerald-300 px-3 py-1 rounded-md mb-4 inline-block shadow-2xs">
                    Slide 03 — The Fractional Allocation Strategy
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-emerald-950 mb-4">
                    Redistribute One Budget Across 6+ Countries Effortlessly
                  </h3>
                  <p className="text-xs md:text-sm text-emerald-900/80 leading-relaxed mb-6">
                    Instead of spending $100,000 on 1 country, **allocate $10,000 to $15,000 per market** to hire top Fractional Sales Partners for specific expos, B2B meetings, and buyer verifications.
                  </p>

                  <div className="space-y-2.5 text-xs font-bold text-gray-900">
                    <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border-2 border-emerald-200 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>🇫🇷 Paris Expo: Hire local French Sales Rep (Silver Expo Package)</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border-2 border-emerald-200 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>🇩🇪 Frankfurt Messe: Hire technical German Sales Rep (Technical Delegate Coverage)</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border-2 border-emerald-200 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>🇦🇪 Dubai Gitex: Hire bilingual Arabic/English Sales Rep (Bilingual Pitch Coverage)</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border-2 border-emerald-200 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>🇺🇸 Las Vegas CES: Hire US B2B Booth Delegate (Full Booth Management)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-emerald-300 rounded-2xl p-6 shadow-sm text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-emerald-950 mb-2">10x Multi-Country ROI</h4>
                  <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                    Zero fixed payroll. Zero office leases. Pay only for verified event packages with <strong>7-day escrow protection</strong> and real-time scanned leads CRM.
                  </p>
                  <button
                    onClick={() => router.push("/login?role=obo&redirect=create-post")}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Post Requirement &amp; Allocate Budget
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Presentation Slide 4: Live Event Post Showcase */}
          {activeStoryTab === "post" && (
            <div className="bg-[#f0f9ff] border-2 border-sky-300 rounded-3xl p-8 md:p-12 shadow-sm animate-in fade-in duration-300">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-900 bg-white border border-sky-300 px-3 py-1 rounded-md mb-3 inline-block shadow-2xs">
                  Slide 04 — Real Platform Execution
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-sky-950 mb-3">
                  How a Sales Partner Event Listing Appears on Platform
                </h3>
                <p className="text-xs md:text-sm text-sky-900/80">
                  Business Owners review transparent event posts created by Sales Partners, complete with line-item packages, venue location, and verified partner profiles.
                </p>
              </div>

              {/* Demo Post Card Graphic */}
              <div className="max-w-3xl mx-auto bg-white border-2 border-sky-200 rounded-2xl shadow-md overflow-hidden text-left">
                <div className="relative h-64 w-full bg-gray-100">
                  <Image 
                    src="/hero-bg-2.png" 
                    alt="Expo Demonstration" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-600" /> Paris Expo Porte de Versailles, France
                  </div>
                  <div className="absolute top-4 right-4 bg-[#701010] text-white px-3 py-1 rounded-full text-xs font-bold font-headline uppercase tracking-wider shadow-sm">
                    Verified Sales Partner
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                    <div>
                      <h4 className="text-lg font-serif font-bold text-gray-900">
                        Global Trade &amp; Consumer Expo Representation 2026
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> Oct 14 - Oct 18, 2026 | Expected Footfall: 45,000+ B2B Visitors
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#701010] uppercase font-bold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">Flexible Custom Packages</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-[10px] font-bold text-gray-700 uppercase">Bronze Package</p>
                      <p className="text-xs font-semibold text-gray-600 mt-1">Visiting Card Scan &amp; Booth Pitch</p>
                    </div>
                    <div className="p-3 bg-rose-50 border-2 border-rose-200 rounded-xl">
                      <p className="text-[10px] font-bold text-rose-800 uppercase">Silver Package (Popular)</p>
                      <p className="text-xs font-semibold text-rose-950 mt-1">Visiting Card Scan + 2-hr Live Stream &amp; Sample Check</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-[10px] font-bold text-gray-700 uppercase">Gold Package</p>
                      <p className="text-xs font-semibold text-gray-600 mt-1">Full 5-Day Booth Management &amp; B2B Meetings</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Protected by 7-Day Escrow &amp; GPS Check-In Audit</span>
                    </div>
                    <button
                      onClick={() => router.push("/login?role=obo&redirect=create-post")}
                      className="px-5 py-2.5 bg-[#701010] hover:bg-[#5a0c0c] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-sm"
                    >
                      Book Representation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Scope of Requirements Section (Cheerful Cards) */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-rose-800 bg-rose-100 border border-rose-300 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
              Versatile Coverage
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              What Requirements Can You Post?
            </h2>
            <p className="text-sm md:text-base text-gray-500 mt-3">
              Sales Partners provide complete on-ground coverage across trade expos, B2B meetings, and field verification tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Requirement Card 1 */}
            <div className="bg-[#fff1f2] border-2 border-rose-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-rose-200 text-rose-600 flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-rose-950 mb-2">
                  Expo Booth Management &amp; Sales
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed mb-4">
                  Deploy trained local Sales Partners to manage your stall at international trade fairs, pitch products to visitors, and capture verified buyer leads.
                </p>
                <ul className="space-y-2 text-xs font-bold text-rose-900">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" /> Full stall representation &amp; product pitch
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" /> Visiting card scanning via AI OCR
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" /> Mandatory 2-hr live video feed
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-rose-200">
                <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                  Popular for Expos <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Requirement Card 2 */}
            <div className="bg-[#ecfdf5] border-2 border-emerald-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-emerald-950 mb-2">
                  On-Ground Buyer Verification
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed mb-4">
                  Protect your business against fraud. Have local partners physically visit buyer offices or factories to verify business credentials and physical existence.
                </p>
                <ul className="space-y-2 text-xs font-bold text-emerald-900">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Physical office &amp; factory visit check
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Geotagged photo &amp; video evidence
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Business registration audit
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-200">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  Risk Mitigation <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Requirement Card 3 */}
            <div className="bg-[#fffbeb] border-2 border-amber-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-amber-200 text-amber-600 flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-amber-950 mb-2">
                  Sample Handovers &amp; Quality Checks
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed mb-4">
                  Need to deliver physical product samples or perform batch quality checks before shipping? Local Sales Partners handle physical handovers and inspections.
                </p>
                <ul className="space-y-2 text-xs font-bold text-amber-900">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> In-person sample delivery to buyers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Pre-shipment batch condition checks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Immediate buyer feedback collection
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-amber-200">
                <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                  Export Operations <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Budget Simulator Panel */}
      <section className="py-16 md:py-24 bg-[#f8fafc] border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
              Interactive ROI Calculator
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Compare Your Global Reach: Traditional vs. Fractional
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-2">
              Slide your annual international sales budget to see how many global expos and countries you can cover.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#fffbeb] via-rose-50/50 to-[#ecfdf5] border-2 border-amber-200 rounded-3xl p-8 shadow-sm">
            {/* Slider control */}
            <div className="mb-10 max-w-2xl mx-auto bg-white p-6 rounded-2xl border-2 border-amber-200 shadow-2xs">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-700 uppercase">Your Annual Sales Budget</span>
                <span className="text-2xl font-serif font-bold text-[#701010]">${budgetSlider.toLocaleString('en-US')} USD</span>
              </div>
              <input
                type="range"
                min="10000"
                max="150000"
                step="5000"
                value={budgetSlider}
                onChange={(e) => setBudgetSlider(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#701010]"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-2">
                <span>$10,000</span>
                <span>$75,000</span>
                <span>$150,000</span>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Traditional Route */}
              <div className="bg-[#fff1f2] border-2 border-rose-300 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-serif font-bold text-base text-rose-950">Traditional Fixed Overseas Hire</h4>
                  <XIcon className="w-5 h-5 text-rose-600" />
                </div>
                <div className="space-y-3 text-xs text-gray-800">
                  <div className="flex justify-between py-1.5 border-b border-rose-200 font-medium">
                    <span>Countries Covered</span>
                    <span className="font-bold text-rose-700">{traditionalMarketsCovered} Market Only</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-rose-200 font-medium">
                    <span>Expos Attended</span>
                    <span className="font-bold text-rose-700">1 - 2 Fairs max</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-rose-200 font-medium">
                    <span>Fixed Payroll Risk</span>
                    <span className="font-bold text-rose-700">100% Sunk Expense</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-rose-950">
                    <span>Overall Flexibility</span>
                    <span className="text-rose-700">Zero (Locked in 1 Country)</span>
                  </div>
                </div>
              </div>

              {/* Fractional Route */}
              <div className="bg-[#ecfdf5] border-2 border-emerald-300 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-serif font-bold text-base text-emerald-950">Fractional Sales Partner Allocation</h4>
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="space-y-3 text-xs text-gray-800">
                  <div className="flex justify-between py-1.5 border-b border-emerald-200 font-medium">
                    <span>Countries Covered</span>
                    <span className="font-bold text-emerald-700">{fractionalCountriesCovered} Global Markets 🌍</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-200 font-medium">
                    <span>Expos Attended</span>
                    <span className="font-bold text-emerald-700">{fractionalExposCovered} Trade Fairs ✨</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-200 font-medium">
                    <span>Escrow &amp; Audit Protection</span>
                    <span className="font-bold text-emerald-700">100% Money-Back Escrow</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-emerald-950">
                    <span>Overall Flexibility</span>
                    <span className="text-emerald-700">Maximum (On-Demand Execution)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Escrow Guarantee Banner (Rich Cheerful Palette) */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-gradient-to-r from-rose-100 via-amber-100 to-emerald-100 border-2 border-amber-300 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-300 text-rose-900 text-[11px] font-bold uppercase tracking-wider mb-4 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  <span>Biztribe Escrow &amp; Audit Guarantee</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
                  Zero Financial Risk for Business Owners
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed mb-6">
                  Your funds are protected in escrow. Payouts are withheld if a Sales Partner fails to arrive on time, misses the mandatory 2-hour live stream, fails to post 2-hour social updates, or misrepresents your brand.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-900 font-bold">
                  <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-lg border border-amber-200 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Mandatory GPS Check-In Audit
                  </div>
                  <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-lg border border-amber-200 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Confidentiality &amp; NDA
                  </div>
                  <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-lg border border-amber-200 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 12-Month Non-Compete Guarantee
                  </div>
                  <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-lg border border-amber-200 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Transparent 25% Platform Fee
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-amber-300 rounded-2xl p-6 shadow-sm text-center">
                <Award className="w-10 h-10 text-[#701010] mx-auto mb-3" />
                <h4 className="text-base font-serif font-bold text-gray-900 mb-1">Ready to Hire a Rep?</h4>
                <p className="text-xs text-gray-500 mb-6">Create your business account and post your requirement in under 2 minutes.</p>
                <button
                  onClick={() => router.push("/login?role=obo&redirect=create-post")}
                  className="w-full py-3.5 bg-[#701010] hover:bg-[#5a0c0c] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Create Business Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (Accordion) */}
      <section className="py-16 md:py-24 bg-[#fcfcfc]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-amber-900 bg-amber-100 border border-amber-300 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
              Clear Answers
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 tracking-tight">
              Frequently Asked Questions for Business Owners
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Why is Fractional Sales better than hiring 1 full-time rep in France or Germany?",
                a: "Hiring 1 full-time rep locks 100% of your expansion capital in 1 country, carries high fixed payroll risk, and cannot pitch buyers in other European or Asian countries due to distinct regional etiquettes. Fractional Sales lets you hire top native reps in 6+ countries for specific events and tasks under the exact same budget."
              },
              {
                q: "What happens if a Sales Partner fails to show up at the event venue?",
                a: "If the Sales Partner fails to check in via GPS at the designated venue on time, or fails to complete the mandatory 2-hour live stream, representation funds are immediately frozen, withheld, and refunded to your account per Clause 3 of the Service Agreement."
              },
              {
                q: "Who legally owns the attendee contact leads captured at the booth?",
                a: "100% of all attendee contact cards, scanned visiting cards, inquiry forms, and lead data generated during the event belong exclusively to your business and Biztribe Trading & Consultancy. Sales Partners are legally barred from harvesting or using your leads under strict non-disclosure terms."
              },
              {
                q: "How are commuting and travel charges handled?",
                a: "Commuting and travel charges are classified under total representation charges quoted in the package. They are subject to platform escrow rules, audit verification, and the standard 7-day post-event settlement schedule."
              },
              {
                q: "Do I need a physical registered office in the country where the expo takes place?",
                a: "No! That is the core power of Fractional Sales Partner. Verified local Sales Partners act as your on-the-ground fractional sales force, providing local presence without the overhead of establishing offshore offices."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm text-gray-900 hover:text-[#701010] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${openFaq === index ? "rotate-180 text-[#701010]" : ""}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 pt-1 text-xs text-gray-700 leading-relaxed border-t border-gray-100 bg-gray-50/50 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
