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

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck, CheckCircle2, ArrowRight, Building2,
  MapPin, Calendar, Lock, Sparkles, ChevronDown,
  Users, Layers, Award, FileText, ArrowUpRight,
  TrendingUp, AlertCircle, PieChart, Check, XIcon,
  Clock, Zap
} from "lucide-react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

export default function PostRequirementPage() {
  const router = useRouter();
  const [activeStoryTab, setActiveStoryTab] = useState<"problem" | "nuances" | "solution" | "post">("problem");
  const [budgetSlider, setBudgetSlider] = useState<number>(30000);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Animated counter state
  const [counterStarted, setCounterStarted] = useState(false);
  const [savingsCount, setSavingsCount] = useState(0);
  const [marketsCount, setMarketsCount] = useState(0);
  const metricsRef = useRef<HTMLDivElement>(null);

  // Realtime World Clocks
  const [times, setTimes] = useState({
    paris: "",
    dubai: "",
    frankfurt: "",
    singapore: "",
    london: "",
  });

  // Toast Notification Cycle State
  const [toastIndex, setToastIndex] = useState(0);

  const toasts = [
    { text: "Textile Exporter from Surat just booked SP for Dubai Gitex 2026", flag: "🇦🇪", initials: "TE", time: "2 min ago" },
    { text: "Engineering Components Brand from Pune posted requirement for Frankfurt Messe", flag: "🇩🇪", initials: "EC", time: "5 min ago" },
    { text: "Ayurvedic Brand from Ahmedabad hired SP for Paris Expo 2026", flag: "🇫🇷", initials: "AB", time: "9 min ago" },
    { text: "Leather Goods Trader from Kanpur booked SP for Milan Design Week", flag: "🇮🇹", initials: "LG", time: "14 min ago" }
  ];

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setTimes({
        paris: now.toLocaleTimeString("en-US", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" }),
        dubai: now.toLocaleTimeString("en-US", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit" }),
        frankfurt: now.toLocaleTimeString("en-US", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" }),
        singapore: now.toLocaleTimeString("en-US", { timeZone: "Asia/Singapore", hour: "2-digit", minute: "2-digit" }),
        london: now.toLocaleTimeString("en-US", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit" }),
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Counter animation on scroll into view
  useEffect(() => {
    const el = metricsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !counterStarted) {
          setCounterStarted(true);
          let s = 0;
          const sTimer = setInterval(() => {
            s += 4;
            if (s >= 80) { clearInterval(sTimer); s = 80; }
            setSavingsCount(s);
          }, 30);
          let m = 0;
          const mTimer = setInterval(() => {
            m++;
            if (m >= 5) { clearInterval(mTimer); m = 5; }
            setMarketsCount(m);
          }, 150);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [counterStarted]);

  // Budget simulator calculations
  const traditionalMarketsCovered = Math.max(1, Math.floor(budgetSlider / 60000));
  const fractionalExposCovered = Math.floor(budgetSlider / 2500);
  const fractionalCountriesCovered = Math.min(12, Math.max(2, Math.floor(fractionalExposCovered / 1.5)));
  const estimatedSavings = Math.round(budgetSlider * 0.65);
  const additionalMarketsUnlocked = Math.max(0, fractionalCountriesCovered - traditionalMarketsCovered);
  const globalCoveragePercent = Math.round((fractionalCountriesCovered / 12) * 100);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans flex flex-col selection:bg-rose-100 selection:text-rose-900 relative">
      <Navbar />

      {/* ── Floating Activity Toast (Upgraded: avatar + pulse ring + timestamp) ── */}
      <div className="fixed bottom-6 right-6 z-50 max-w-sm">
        <div className="absolute -inset-1 rounded-3xl bg-emerald-200/40 animate-ping pointer-events-none" />
        <div className="relative bg-white/95 backdrop-blur-md border-2 border-emerald-300 rounded-2xl p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-b from-rose-400 to-rose-700 text-white flex items-center justify-center text-xs font-bold font-headline shrink-0 shadow-sm">
              {toasts[toastIndex].initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-headline font-bold text-emerald-800 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  Platform Match Example
                </div>
                <span className="text-[10px] text-gray-400 font-medium shrink-0">{toasts[toastIndex].time}</span>
              </div>
              <p className="text-xs font-semibold text-gray-900 leading-snug">
                {toasts[toastIndex].flag} {toasts[toastIndex].text}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-white via-rose-50/50 to-[#fcfcfc] border-b border-rose-100 relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-rose-200/30 via-amber-200/30 to-sky-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl text-center">

          {/* World Clock Bar */}
          <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-2xl bg-[#f8fafc] border-2 border-slate-200 shadow-2xs text-xs text-slate-800 font-medium">
            <span className="flex items-center gap-1.5 text-slate-800 font-headline font-bold text-[10px] uppercase tracking-wider pr-2 border-r border-slate-200">
              <Clock className="w-3.5 h-3.5 text-sky-600" /> Active Market Hours
            </span>
            <span className="flex items-center gap-1">🇫🇷 Paris <strong className="text-slate-950">{times.paris || "12:30"}</strong></span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">🇩🇪 Frankfurt <strong className="text-slate-950">{times.frankfurt || "12:30"}</strong></span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">🇦🇪 Dubai <strong className="text-slate-950">{times.dubai || "14:30"}</strong></span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">🇸🇬 Singapore <strong className="text-slate-950">{times.singapore || "18:30"}</strong></span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">🇬🇧 London <strong className="text-slate-950">{times.london || "11:30"}</strong></span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/80 border border-rose-300 text-rose-900 text-xs font-bold font-headline uppercase tracking-wider mb-6 shadow-xs w-fit mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>The MSME Global Expansion Playbook</span>
          </div>

          {/* ── 2-Column Hero Split ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left mb-12 max-w-6xl mx-auto items-stretch">

            {/* LEFT: Problem Card with animated budget-burn bars */}
            <div className="bg-[#fff1f2] border-2 border-rose-200/90 rounded-3xl p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/40 rounded-bl-full pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-900 text-[10px] font-bold font-headline uppercase tracking-wider mb-4 shadow-2xs">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>The Capital Trap (The Old Way)</span>
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-rose-950 leading-snug mb-3">
                  Sinking Your Entire Budget into 1 Market Leaves You Trapped
                </h2>
                <p className="text-xs md:text-sm text-rose-900/80 leading-relaxed mb-6">
                  Setting up an overseas office or hiring 1 full-time rep burns $120,000+ in fixed overhead. If that single market slows down, 100% of your capital is trapped — with zero presence anywhere else.
                </p>

                {/* Animated Budget-Burn Visualization */}
                <div className="bg-white border-2 border-rose-200/90 rounded-2xl p-5 shadow-xs mb-4">
                  <p className="text-[10px] font-bold text-rose-900 uppercase tracking-wider mb-3">Annual Budget Allocation — Traditional Model</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold mb-1">
                        <span className="text-gray-800">🇫🇷 France Only (Fixed Hire)</span>
                        <span className="text-rose-700">$120,000 — 100%</span>
                      </div>
                      <div className="w-full h-4 bg-rose-100 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold mb-1 text-gray-400">
                        <span>🇩🇪 Germany</span><span>$0 remaining</span>
                      </div>
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-200 rounded-full" style={{ width: "0%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold mb-1 text-gray-400">
                        <span>🇬🇧 United Kingdom</span><span>$0 remaining</span>
                      </div>
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-200 rounded-full" style={{ width: "0%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold mb-1 text-gray-400">
                        <span>🇦🇪 UAE &amp; Gulf</span><span>$0 remaining</span>
                      </div>
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-200 rounded-full" style={{ width: "0%" }} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-2.5 bg-rose-100 border border-rose-200 rounded-xl text-[10px] font-bold text-rose-800 text-center">
                    ⚠️ 100% budget consumed in 1 country — 0 markets remaining
                  </div>
                </div>
              </div>
              <div className="p-3 bg-rose-200/70 border border-rose-300 rounded-xl text-xs text-rose-950 font-bold flex items-center justify-between shadow-2xs">
                <span>⚠️ High Fixed Overhead</span>
                <span className="text-rose-800">0 Multi-Country Reach</span>
              </div>
            </div>

            {/* RIGHT: Solution Card with multi-country allocation bars */}
            <div className="bg-gradient-to-b from-[#ecfdf5] via-[#d1fae5]/70 to-[#ecfdf5] border-2 border-emerald-500 rounded-3xl p-8 shadow-xl ring-4 ring-emerald-200/60 flex flex-col justify-between relative overflow-hidden scale-[1.02]">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white font-headline font-bold text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-md flex items-center gap-1.5 z-10">
                <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span>Recommended Playbook — 10x ROI</span>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold font-headline uppercase tracking-wider mb-4 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>The Smart Fractional Way (The Breakthrough)</span>
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-emerald-950 leading-snug mb-3">
                  Multiply Your Global Reach Across 6+ Key Markets On-Demand
                </h2>
                <p className="text-xs md:text-sm text-emerald-950/90 leading-relaxed mb-5 font-medium">
                  Distribute that same budget to hire top on-ground Sales Partners in the UK 🇬🇧, France 🇫🇷, Germany 🇩🇪, Sweden 🇸🇪, UAE 🇦🇪, and Spain 🇪🇸. Zero fixed payroll, zero overseas office leases.
                </p>

                {/* Multi-Country Allocation Bars */}
                <div className="bg-white border-2 border-emerald-300 rounded-2xl p-5 shadow-sm mb-5">
                  <p className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider mb-3">Same Budget — Distributed Across Markets</p>
                  <div className="space-y-2.5">
                    {[
                      { flag: "🇬🇧", name: "United Kingdom", pct: 25 },
                      { flag: "🇫🇷", name: "France", pct: 20 },
                      { flag: "🇩🇪", name: "Germany", pct: 20 },
                      { flag: "🇦🇪", name: "UAE & Gulf", pct: 18 },
                      { flag: "🇸🇪", name: "Sweden", pct: 10 },
                      { flag: "🇪🇸", name: "Spain", pct: 7 },
                    ].map((m) => (
                      <div key={m.name}>
                        <div className="flex justify-between text-[10px] font-bold text-gray-700 mb-1">
                          <span>{m.flag} {m.name}</span>
                          <span className="text-emerald-700">{m.pct}%</span>
                        </div>
                        <div className="w-full h-3 bg-emerald-50 rounded-full overflow-hidden border border-emerald-100">
                          <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: `${m.pct * 4}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-2.5 bg-emerald-100 border border-emerald-200 rounded-xl text-[10px] font-bold text-emerald-800 text-center">
                    ✅ 6 countries covered — 100% budget optimized
                  </div>
                </div>
              </div>

              <div>
                <div className="p-3 bg-emerald-200/90 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-bold flex items-center justify-between shadow-2xs mb-4">
                  <span>✨ 6+ Global Markets</span>
                  <span className="text-emerald-900">100% Milestone Lock Protected</span>
                </div>
                <button
                  onClick={() => router.push("/login?role=obo&redirect=create-post")}
                  className="w-full py-3.5 bg-gradient-to-b from-[#8b1515] via-[#701010] to-[#590a0a] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_18px_rgba(112,16,16,0.3)] border-t border-rose-300/40 border-b border-black/30 backdrop-blur-md hover:from-[#9c1818] hover:via-[#801212] hover:to-[#630b0b] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_10px_22px_rgba(112,16,16,0.4)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Post Your Requirement Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-rose-200" />
                </button>
              </div>
            </div>
          </div>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => router.push("/login?role=obo&redirect=create-post")}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-b from-[#8b1515] via-[#701010] to-[#590a0a] text-white font-headline font-bold text-sm uppercase tracking-wider rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(112,16,16,0.35)] border-t border-rose-300/40 border-b border-black/30 backdrop-blur-md hover:from-[#9c1818] hover:via-[#801212] hover:to-[#630b0b] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Post Requirement Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-rose-200" />
            </button>
            <a
              href="#interactive-presentation"
              className="w-full sm:w-auto px-7 py-4 bg-white/80 hover:bg-white/95 text-gray-900 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_15px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_8px_20px_rgba(0,0,0,0.1)] backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-headline font-bold text-sm uppercase tracking-wider rounded-xl"
            >
              <span>View Executive Presentation</span>
              <PieChart className="w-4 h-4 text-gray-600" />
            </a>
          </div>

          {/* Animated Metrics Bar — counters start on scroll */}
          <div ref={metricsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-[#fff1f2] border-2 border-rose-200 p-4 rounded-2xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-rose-700">Cost Savings</p>
              <p className="text-xl font-serif font-bold text-rose-950">Up to {counterStarted ? savingsCount : 0}%</p>
              <p className="text-[10px] text-rose-900/70">Vs hiring full-time overseas reps</p>
            </div>
            <div className="bg-[#ecfdf5] border-2 border-emerald-200 p-4 rounded-2xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Global Reach</p>
              <p className="text-xl font-serif font-bold text-emerald-950">{counterStarted ? marketsCount : 0}x Markets</p>
              <p className="text-[10px] text-emerald-900/70">Covered under the same budget</p>
            </div>
            <div className="bg-[#fffbeb] border-2 border-amber-200 p-4 rounded-2xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Local Nuance</p>
              <p className="text-xl font-serif font-bold text-amber-950">100% Native</p>
              <p className="text-[10px] text-amber-900/70">Local language &amp; buyer network</p>
            </div>
            <div className="bg-[#f0f9ff] border-2 border-sky-200 p-4 rounded-2xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-700">Security</p>
              <p className="text-[11px] font-bold text-sky-950">7-Day Milestone Settlement</p>
              <p className="text-[10px] text-sky-900/70">Section 10A IT Act Contract</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: How It Works — Step by Step (MOVED TO 2ND POSITION IMMEDIATELY AFTER HERO!) ── */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-gradient-to-r from-rose-100 via-amber-100 to-emerald-100 border-2 border-amber-300 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">

            {/* 5-Step Accountability Timeline */}
            <div className="mb-10">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-5 text-center">How It Works — Step by Step</p>
              <div className="flex items-start justify-between overflow-x-auto pb-2 gap-0">
                {[
                  { num: "①", label: "You Post", sub: "Requirement + Budget", bg: "bg-rose-500" },
                  { num: "②", label: "SP Applies", sub: "Proposal Submitted", bg: "bg-rose-400", dash: "border-rose-200" },
                  { num: "③", label: "Budget Locked", sub: "Milestone Locked", bg: "bg-amber-500", dash: "border-amber-200" },
                  { num: "④", label: "Event Executed", sub: "GPS + Live Stream", bg: "bg-emerald-500", dash: "border-emerald-200" },
                  { num: "⑤", label: "Leads + Payout", sub: "CRM + Settled", bg: "bg-emerald-600", dash: "border-emerald-300" },
                ].map((step, i, arr) => (
                  <div key={i} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-10 h-10 rounded-full ${step.bg} text-white flex items-center justify-center text-sm font-bold shadow-md mb-2`}>
                        {step.num}
                      </div>
                      <p className="text-[10px] font-bold text-gray-800 text-center whitespace-nowrap">{step.label}</p>
                      <p className="text-[9px] text-gray-500 text-center whitespace-nowrap">{step.sub}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <div className={`flex-1 border-t-2 border-dashed ${step.dash || "border-gray-200"} mx-1 mb-7 min-w-3`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-300 text-rose-900 text-[11px] font-bold uppercase tracking-wider mb-4 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  <span>Payment Protection &amp; Audit Guarantee</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
                  Lesser Financial Risk for Business Owners
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed mb-6">
                  Your funds are securely held in milestone lock. Payouts are withheld if a Sales Partner fails to arrive on time, misses the mandatory 2-hour live stream, fails to post 2-hour social updates, or misrepresents your brand.
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
                {/* Legal trust badge pills */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {["Section 10A IT Act", "NDA Enforced", "GPS Verified", "7-Day Refund Window"].map((badge) => (
                    <span key={badge} className="text-[10px] font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <Lock className="w-2.5 h-2.5 text-gray-500" /> {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white border-2 border-amber-300 rounded-2xl p-6 shadow-sm text-center">
                <Award className="w-10 h-10 text-[#701010] mx-auto mb-3" />
                <h4 className="text-base font-serif font-bold text-gray-900 mb-1">Ready to Hire a Rep?</h4>
                <p className="text-xs text-gray-500 mb-6">Create your business account and post your requirement in under 2 minutes.</p>
                <button
                  onClick={() => router.push("/login?role=obo&redirect=create-post")}
                  className="w-full py-3.5 bg-gradient-to-b from-[#8b1515] via-[#701010] to-[#590a0a] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_18px_rgba(112,16,16,0.35)] border-t border-rose-300/40 border-b border-black/30 backdrop-blur-md hover:from-[#9c1818] hover:via-[#801212] hover:to-[#630b0b] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Create Business Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Simple 3-Step Process ── */}
      <section className="py-16 md:py-24 bg-[#f8fafc] border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-sky-800 bg-sky-100 border border-sky-300 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              From Requirement to Verified On-Ground Rep
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-3">
              No overseas hiring, no fixed contracts. Post, review, and book — entirely on platform with full payment protection.
            </p>
          </div>

          <div className="relative">
            {/* Dashed connector (desktop only) */}
            <div className="hidden md:block absolute top-[46px] left-[23%] right-[23%] h-0 border-t-2 border-dashed border-gray-200 z-0 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-[92px] h-[92px] rounded-3xl bg-gradient-to-b from-[#8b1515] via-[#701010] to-[#590a0a] text-white flex items-center justify-center mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_24px_rgba(112,16,16,0.35)] border-t border-rose-400/30 group-hover:scale-105 transition-transform relative">
                  <FileText className="w-9 h-9 text-rose-100" />
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white border-2 border-rose-300 text-rose-800 text-xs font-bold font-headline flex items-center justify-center shadow-sm">
                    1
                  </span>
                </div>
                <h3 className="text-base font-serif font-bold text-gray-900 mb-2 mt-1">Post Your Requirement</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Describe the event, target country, dates, and exactly what you need the Sales Partner to handle — booth management, buyer verification, or sample handover.
                </p>
                <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5 text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-rose-600" /> Takes under 2 minutes
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-[92px] h-[92px] rounded-3xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 text-white flex items-center justify-center mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_24px_rgba(217,119,6,0.3)] border-t border-amber-300/40 group-hover:scale-105 transition-transform relative">
                  <Users className="w-9 h-9 text-amber-100" />
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white border-2 border-amber-300 text-amber-800 text-xs font-bold font-headline flex items-center justify-center shadow-sm">
                    2
                  </span>
                </div>
                <h3 className="text-base font-serif font-bold text-gray-900 mb-2 mt-1">Verified Partners Apply</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Pre-vetted local Sales Partners in your target country review your post and submit tailored proposals with their credentials and event track record.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Proposals within 24 hours
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-[92px] h-[92px] rounded-3xl bg-gradient-to-b from-emerald-400 via-emerald-600 to-emerald-800 text-white flex items-center justify-center mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_24px_rgba(5,150,105,0.3)] border-t border-emerald-300/40 group-hover:scale-105 transition-transform relative">
                  <ShieldCheck className="w-9 h-9 text-emerald-100" />
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white border-2 border-emerald-300 text-emerald-800 text-xs font-bold font-headline flex items-center justify-center shadow-sm">
                    3
                  </span>
                </div>
                <h3 className="text-base font-serif font-bold text-gray-900 mb-2 mt-1">Review, Hire &amp; Go Live</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Compare proposals, secure your budget in milestone lock, and your verified local rep is on the ground at the event — GPS-tracked and reporting in real-time.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Budget protected until delivery
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => router.push("/login?role=obo&redirect=create-post")}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-b from-[#8b1515] via-[#701010] to-[#590a0a] text-white font-headline font-bold text-sm uppercase tracking-wider rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(112,16,16,0.35)] border-t border-rose-300/40 border-b border-black/30 backdrop-blur-md hover:from-[#9c1818] hover:via-[#801212] hover:to-[#630b0b] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
              >
                <span>Start Step 1 — Post Your Requirement</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-rose-200" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Country Coverage Grid ── */}
      <section className="py-12 bg-gradient-to-r from-rose-50/40 via-amber-50/40 to-emerald-50/40 border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-8">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
              Global Presence
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-1">
              Wherever Your Buyers Are, We Have Boots on the Ground
            </h2>
            <p className="text-xs text-gray-500">Active Verified Sales Partner Coverage Across Key Global Markets</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-center">
            {[
              { flag: "🇫🇷", name: "France", count: "34 Reps", intensity: 24, highlight: false, badge: "" },
              { flag: "🇩🇪", name: "Germany", count: "48 Reps", intensity: 34, highlight: false, badge: "" },
              { flag: "🇮🇳", name: "India", count: "110 Reps", intensity: 79, highlight: false, badge: "" },
              { flag: "🇪🇸", name: "Spain", count: "26 Reps", intensity: 19, highlight: false, badge: "" },
              { flag: "🇸🇪", name: "Sweden", count: "19 Reps", intensity: 14, highlight: false, badge: "" },
              { flag: "🇦🇪", name: "UAE & Gulf", count: "52 Reps", intensity: 37, highlight: false, badge: "" },
              { flag: "🇬🇧", name: "United Kingdom", count: "140+ Reps", intensity: 100, highlight: true, badge: "Strongest Footprint" }
            ].map((market, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-3 transition-all flex flex-col items-center gap-1 ${
                  market.highlight
                    ? "bg-rose-50/90 border-2 border-[#701010] shadow-md ring-2 ring-rose-200 -translate-y-1"
                    : "bg-white/80 backdrop-blur-xs border border-gray-200 shadow-2xs hover:shadow-sm hover:scale-105"
                }`}
              >
                {market.badge && (
                  <span className="text-[8px] font-headline font-bold text-white bg-[#701010] px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                    ★ {market.badge}
                  </span>
                )}
                <span className="text-2xl">{market.flag}</span>
                <p className="text-xs font-bold text-gray-900 leading-tight">{market.name}</p>
                <div className="flex items-center gap-1.5">
                  {/* Pulsing live dot */}
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <p className={`text-[10px] font-bold ${market.highlight ? "text-[#701010]" : "text-emerald-700"}`}>
                    {market.count}
                  </p>
                </div>
                {/* Coverage intensity bar */}
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-0.5">
                  <div
                    className={`h-full rounded-full ${market.highlight ? "bg-gradient-to-r from-[#8b1515] to-[#701010]" : "bg-gradient-to-r from-emerald-400 to-emerald-600"}`}
                    style={{ width: `${market.intensity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Presentation Storyboard ── */}
      <section id="interactive-presentation" className="py-16 md:py-24 bg-[#f8fafc] border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-rose-800 bg-rose-100 border border-rose-300 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
              Executive Presentation
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              The Strategic Shift: From Fixed Capital Sinking to Fractional Distribution
            </h2>
          </div>

          {/* Glassy Tab Switcher */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-12 p-2 bg-gray-100/80 backdrop-blur-md rounded-2xl max-w-3xl mx-auto border border-gray-200/80 shadow-2xs">
            {(["problem", "nuances", "solution", "post"] as const).map((tab, i) => {
              const labels = ["1. The Capital Trap", "2. Cultural Nuances", "3. Fractional Solution", "4. Platform Demo"];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveStoryTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold font-headline uppercase tracking-wider transition-all cursor-pointer ${
                    activeStoryTab === tab
                      ? "bg-gradient-to-b from-[#8b1515] to-[#590a0a] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(112,16,16,0.35)] border-t border-rose-300/40"
                      : "text-gray-700 hover:text-gray-900 hover:bg-white/80"
                  }`}
                >
                  {labels[i]}
                </button>
              );
            })}
          </div>

          {/* Slide 1: The Problem */}
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
                    When a Business Owner, Manufacturer, or Trader wants to expand globally, traditional advice says: <em className="text-rose-950 font-bold">&ldquo;Set up a local entity, lease an office, and hire a full-time sales executive in the target country.&rdquo;</em>
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
                <div className="bg-white border-2 border-rose-300 rounded-2xl p-6 shadow-sm text-center">
                  <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-300 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-rose-950 mb-2">High Risk &amp; High Sunk Cost</h4>
                  <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                    You have spent your <strong>entire MSME expansion budget</strong> on a single country. If that market slows down, 100% of your capital is at risk — $0 left for UK, Germany, UAE, or Sweden.
                  </p>
                  <div className="p-3 bg-rose-100/80 border border-rose-300 rounded-xl text-xs text-rose-950 font-bold">
                    ⚠️ 0 Flexibility | 0 Budget for other markets | High Fixed Payroll Risk
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 2: Cultural Nuances (with Mistake callouts + Cultural Fit bars) */}
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
                {/* France */}
                <div className="bg-[#f4f4ff] border-2 border-indigo-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">🇫🇷</span>
                      <div>
                        <h4 className="font-serif font-bold text-base text-indigo-950">France (Paris Expos)</h4>
                        <p className="text-[10px] text-indigo-700 font-bold uppercase">Relationship &amp; Compliance</p>
                      </div>
                    </div>
                    {/* Mistake Callout */}
                    <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[10px] font-bold text-red-700 flex items-start gap-1.5">
                      <XIcon className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                      Common Mistake: Sending an English-only pitch deck to a Paris trade fair buyer.
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed mb-4">
                      Requires fluent French, formal business etiquette, strict EU regulatory documentation, and local relationship cultivation.
                    </p>
                    {/* Cultural Fit Bars */}
                    <div className="space-y-1.5 mb-4">
                      <div>
                        <div className="flex justify-between text-[9px] font-bold text-gray-500 mb-0.5">
                          <span>Without Local Partner</span><span className="text-red-500">25% fit</span>
                        </div>
                        <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400 rounded-full" style={{ width: "25%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] font-bold text-gray-500 mb-0.5">
                          <span>With Fractional SP</span><span className="text-indigo-600">92% fit</span>
                        </div>
                        <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: "92%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-indigo-950 font-bold p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs">
                    💡 Needs native French speaker with Paris trade fair networks.
                  </div>
                </div>

                {/* Italy */}
                <div className="bg-[#fff7ed] border-2 border-orange-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">🇮🇹</span>
                      <div>
                        <h4 className="font-serif font-bold text-base text-orange-950">Italy (Milan Trade Fairs)</h4>
                        <p className="text-[10px] text-orange-700 font-bold uppercase">Design &amp; Personal Rapport</p>
                      </div>
                    </div>
                    {/* Mistake Callout */}
                    <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[10px] font-bold text-red-700 flex items-start gap-1.5">
                      <XIcon className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                      Common Mistake: Leading with product specs before establishing personal rapport with Italian buyers.
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed mb-4">
                      Requires strong personal rapport, deep aesthetic and product design presentation, and direct localized buyer introductions.
                    </p>
                    {/* Cultural Fit Bars */}
                    <div className="space-y-1.5 mb-4">
                      <div>
                        <div className="flex justify-between text-[9px] font-bold text-gray-500 mb-0.5">
                          <span>Without Local Partner</span><span className="text-red-500">20% fit</span>
                        </div>
                        <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400 rounded-full" style={{ width: "20%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] font-bold text-gray-500 mb-0.5">
                          <span>With Fractional SP</span><span className="text-orange-600">90% fit</span>
                        </div>
                        <div className="h-1.5 bg-orange-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: "90%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-orange-950 font-bold p-3 bg-white rounded-xl border border-orange-200 shadow-2xs">
                    💡 Needs on-ground Italian rep with direct B2B buyer connections.
                  </div>
                </div>

                {/* Germany */}
                <div className="bg-[#f0fdf4] border-2 border-emerald-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">🇩🇪</span>
                      <div>
                        <h4 className="font-serif font-bold text-base text-emerald-950">Germany (Hannover Messe)</h4>
                        <p className="text-[10px] text-emerald-700 font-bold uppercase">Precision &amp; Technical Specs</p>
                      </div>
                    </div>
                    {/* Mistake Callout */}
                    <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[10px] font-bold text-red-700 flex items-start gap-1.5">
                      <XIcon className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                      Common Mistake: Attending Hannover Messe without German-language technical data sheets and certifications.
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed mb-4">
                      Requires extreme engineering precision, structured data sheets, German fluency, and verified quality certification handovers.
                    </p>
                    {/* Cultural Fit Bars */}
                    <div className="space-y-1.5 mb-4">
                      <div>
                        <div className="flex justify-between text-[9px] font-bold text-gray-500 mb-0.5">
                          <span>Without Local Partner</span><span className="text-red-500">18% fit</span>
                        </div>
                        <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400 rounded-full" style={{ width: "18%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] font-bold text-gray-500 mb-0.5">
                          <span>With Fractional SP</span><span className="text-emerald-600">95% fit</span>
                        </div>
                        <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "95%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-950 font-bold p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                    💡 Needs technical sales delegate fluent in German &amp; ISO standards.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 3: The Fractional Solution */}
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
                    Instead of spending $100,000 on 1 country, allocate $10,000–$15,000 per market to hire top Fractional Sales Partners for specific expos, B2B meetings, and buyer verifications.
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
                    Zero fixed payroll. Zero office leases. Pay only for verified event packages with <strong>7-day payment protection guarantee</strong> and real-time scanned leads CRM.
                  </p>
                  <button
                    onClick={() => router.push("/login?role=obo&redirect=create-post")}
                    className="w-full py-3.5 bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_18px_rgba(5,150,105,0.3)] border-t border-emerald-300/40 border-b border-emerald-950/40 hover:from-[#10b981] hover:to-[#047857] hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Post Requirement &amp; Allocate Budget
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Slide 4: Platform Demo */}
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
              <div className="max-w-3xl mx-auto bg-white border-2 border-sky-200 rounded-2xl shadow-md overflow-hidden text-left">
                <div className="relative h-64 w-full bg-gray-100">
                  <Image src="/hero-bg-2.png" alt="Expo Demonstration" fill className="object-cover" />
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
                      <h4 className="text-lg font-serif font-bold text-gray-900">Global Trade &amp; Consumer Expo Representation 2026</h4>
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
                      <span>Protected by 7-Day Milestone Lock &amp; GPS Check-In Audit</span>
                    </div>
                    <button
                      onClick={() => router.push("/login?role=obo&redirect=create-post")}
                      className="px-5 py-2.5 bg-gradient-to-b from-[#8b1515] via-[#701010] to-[#590a0a] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(112,16,16,0.3)] border-t border-rose-300/40 border-b border-black/30 backdrop-blur-md hover:from-[#9c1818] hover:via-[#801212] hover:to-[#630b0b] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
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

      {/* ── Scope of Requirements Section ── */}
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
            {/* Card 1 */}
            <div className="bg-[#fff1f2] border-2 border-rose-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-rose-200 text-rose-600 flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-rose-950 mb-2">Expo Booth Management &amp; Sales</h3>
                <p className="text-xs text-gray-700 leading-relaxed mb-4">
                  Deploy trained local Sales Partners to manage your stall at international trade fairs, pitch products to visitors, and capture verified buyer leads.
                </p>
                <ul className="space-y-2 text-xs font-bold text-rose-900">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" /> Full stall representation &amp; product pitch</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" /> Visiting card scanning via AI OCR</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" /> Mandatory 2-hr live video feed</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-rose-200">
                <span className="text-xs font-bold text-rose-700 flex items-center gap-1">Popular for Expos <ArrowUpRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-[#ecfdf5] border-2 border-emerald-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-emerald-950 mb-2">On-Ground Buyer Verification</h3>
                <p className="text-xs text-gray-700 leading-relaxed mb-4">
                  Protect your business against fraud. Have local partners physically visit buyer offices or factories to verify business credentials and physical existence.
                </p>
                <ul className="space-y-2 text-xs font-bold text-emerald-900">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Physical office &amp; factory visit check</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Geotagged photo &amp; video evidence</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Business registration audit</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-200">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">Risk Mitigation <ArrowUpRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-[#fffbeb] border-2 border-amber-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-amber-200 text-amber-600 flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-amber-950 mb-2">Sample Handovers &amp; Quality Checks</h3>
                <p className="text-xs text-gray-700 leading-relaxed mb-4">
                  Need to deliver physical product samples or perform batch quality checks before shipping? Local Sales Partners handle physical handovers and inspections.
                </p>
                <ul className="space-y-2 text-xs font-bold text-amber-900">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> In-person sample delivery to buyers</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Pre-shipment batch condition checks</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Immediate buyer feedback collection</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-amber-200">
                <span className="text-xs font-bold text-amber-700 flex items-center gap-1">Export Operations <ArrowUpRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Budget Simulator (with Savings Callout + Coverage Progress) ── */}
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
            {/* Slider */}
            <div className="mb-10 max-w-2xl mx-auto bg-white p-6 rounded-2xl border-2 border-amber-200 shadow-2xs">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-700 uppercase">Your Annual Sales Budget</span>
                <span className="text-2xl font-serif font-bold text-[#701010]">${budgetSlider.toLocaleString("en-US")} USD</span>
              </div>
              <input
                type="range" min="10000" max="150000" step="5000"
                value={budgetSlider} onChange={(e) => setBudgetSlider(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#701010]"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-2">
                <span>$10,000</span><span>$75,000</span><span>$150,000</span>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-[#fff1f2] border-2 border-rose-300 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-serif font-bold text-base text-rose-950">Traditional Fixed Overseas Hire</h4>
                  <XIcon className="w-5 h-5 text-rose-600" />
                </div>
                <div className="space-y-3 text-xs text-gray-800">
                  <div className="flex justify-between py-1.5 border-b border-rose-200 font-medium">
                    <span>Countries Covered</span><span className="font-bold text-rose-700">{traditionalMarketsCovered} Market Only</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-rose-200 font-medium">
                    <span>Expos Attended</span><span className="font-bold text-rose-700">1 - 2 Fairs max</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-rose-200 font-medium">
                    <span>Fixed Payroll Risk</span><span className="font-bold text-rose-700">100% Sunk Expense</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-rose-950">
                    <span>Overall Flexibility</span><span className="text-rose-700">Zero (Locked in 1 Country)</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#ecfdf5] border-2 border-emerald-300 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-serif font-bold text-base text-emerald-950">Fractional Sales Partner Allocation</h4>
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="space-y-3 text-xs text-gray-800">
                  <div className="flex justify-between py-1.5 border-b border-emerald-200 font-medium">
                    <span>Countries Covered</span><span className="font-bold text-emerald-700">{fractionalCountriesCovered} Global Markets 🌍</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-200 font-medium">
                    <span>Expos Attended</span><span className="font-bold text-emerald-700">{fractionalExposCovered} Trade Fairs ✨</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-200 font-medium">
                    <span>Milestone &amp; Audit Protection</span><span className="font-bold text-emerald-700">100% Money-Back Milestone Guarantee</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-emerald-950">
                    <span>Overall Flexibility</span><span className="text-emerald-700">Maximum (On-Demand Execution)</span>
                  </div>
                </div>
                {/* Global coverage progress bar */}
                <div className="mt-4 pt-3 border-t border-emerald-200">
                  <div className="flex justify-between text-[10px] font-bold text-emerald-800 mb-1.5">
                    <span>Global Key Market Coverage</span>
                    <span>{globalCoveragePercent}% of 12 Markets</span>
                  </div>
                  <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500" style={{ width: `${globalCoveragePercent}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Savings Unlocked Callout ── */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center shadow-md shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Your Projected Savings with Fractional Model</p>
                  <p className="text-2xl font-serif font-bold text-amber-950">~${estimatedSavings.toLocaleString("en-US")} saved</p>
                  <p className="text-[10px] text-amber-800">vs. traditional fixed overseas hire approach</p>
                </div>
              </div>
              <div className="text-center sm:text-right shrink-0">
                <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Additional Markets Unlocked</p>
                <p className="text-4xl font-serif font-bold text-amber-950">+{additionalMarketsUnlocked}</p>
                <p className="text-[10px] text-amber-800">countries vs. traditional model</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ (with Q-Badges + 30-Second Summaries) ── */}
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
                summary: "One hire locks 100% of your budget in 1 country — Fractional distributes the same budget across 6+ markets simultaneously.",
                a: "Hiring 1 full-time rep locks 100% of your expansion capital in 1 country, carries high fixed payroll risk, and cannot pitch buyers in other European or Asian countries due to distinct regional etiquettes. Fractional Sales lets you hire top native reps in 6+ countries for specific events and tasks under the exact same budget."
              },
              {
                q: "What happens if a Sales Partner fails to show up at the event venue?",
                summary: "Funds are immediately frozen and refunded — no payout is made without GPS check-in confirmation at the venue.",
                a: "If the Sales Partner fails to check in via GPS at the designated venue on time, or fails to complete the mandatory 2-hour live stream, representation funds are immediately frozen, withheld, and refunded to your account per Clause 3 of the Service Agreement."
              },
              {
                q: "Who legally owns the attendee contact leads captured at the booth?",
                summary: "100% of all leads belong to your business — Sales Partners are legally barred from retaining or reusing them.",
                a: "100% of all attendee contact cards, scanned visiting cards, inquiry forms, and lead data generated during the event belong exclusively to your business and Biztribe Trading & Consultancy. Sales Partners are legally barred from harvesting or using your leads under strict non-disclosure terms."
              },
              {
                q: "How are commuting and travel charges handled?",
                summary: "Travel is included in the total representation package — subject to standard milestone audit and 7-day settlement rules.",
                a: "Commuting and travel charges are classified under total representation charges quoted in the package. They are subject to platform milestone protection rules, audit verification, and the standard 7-day post-event settlement schedule."
              },
              {
                q: "Do I need a physical registered office in the country where the expo takes place?",
                summary: "No — verified local Sales Partners provide full local presence with no need for an overseas office setup.",
                a: "No! That is the core power of Fractional Sales Partner. Verified local Sales Partners act as your on-the-ground fractional sales force, providing local presence without the overhead of establishing offshore offices."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 hover:border-rose-200 rounded-xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center gap-4 font-serif font-bold text-sm text-gray-900 hover:text-[#701010] transition-colors cursor-pointer"
                >
                  {/* Numbered Q Badge */}
                  <span className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold font-headline flex items-center justify-center shrink-0">
                    Q{index + 1}
                  </span>
                  <span className="flex-1">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${openFaq === index ? "rotate-180 text-[#701010]" : ""}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 pt-1 border-t border-gray-100 bg-gray-50/50">
                    {/* 30-second summary */}
                    <div className="flex items-start gap-2 mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-emerald-900">{faq.summary}</p>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
