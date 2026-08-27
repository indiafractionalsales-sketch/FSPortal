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
  Clock, Zap, DollarSign, UserCheck, Video, FileCheck
} from "lucide-react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

export default function SalesPartnerPage() {
  const router = useRouter();
  const [eventsPerMonth, setEventsPerMonth] = useState<number>(3);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Animated counter state
  const [counterStarted, setCounterStarted] = useState(false);
  const [payoutCount, setPayoutCount] = useState(0);
  const [brandsCount, setBrandsCount] = useState(0);
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
    { text: "Sales Partner in Dubai earned $2,400 representing Surat Textile Brand at Gitex", flag: "🇦🇪", initials: "AK", time: "3 min ago" },
    { text: "Sales Partner in Frankfurt earned €1,800 for Hannover Messe Technical Audit", flag: "🇩🇪", initials: "MS", time: "7 min ago" },
    { text: "Sales Partner in Paris received $1,200 payout after 7-day milestone clearance", flag: "🇫🇷", initials: "PL", time: "12 min ago" },
    { text: "Sales Partner in London booked for 3 upcoming trade shows in June 2026", flag: "🇬🇧", initials: "JR", time: "16 min ago" }
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
          let p = 0;
          const pTimer = setInterval(() => {
            p += 5;
            if (p >= 100) { clearInterval(pTimer); p = 100; }
            setPayoutCount(p);
          }, 25);
          let b = 0;
          const bTimer = setInterval(() => {
            b += 2;
            if (b >= 40) { clearInterval(bTimer); b = 40; }
            setBrandsCount(b);
          }, 40);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [counterStarted]);

  // Income estimator calculations
  const avgPackagePrice = 1200;
  const estimatedMonthlyIncome = eventsPerMonth * avgPackagePrice;
  const estimatedAnnualIncome = estimatedMonthlyIncome * 12;

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-900 relative">
      <Navbar />

      {/* ── Floating Activity Toast ── */}
      <div className="fixed bottom-6 right-6 z-50 max-w-sm">
        <div className="absolute -inset-1 rounded-3xl bg-emerald-200/40 animate-ping pointer-events-none" />
        <div className="relative bg-white/95 backdrop-blur-md border-2 border-emerald-300 rounded-2xl p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-800 text-white flex items-center justify-center text-xs font-bold font-headline shrink-0 shadow-sm">
              {toasts[toastIndex].initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-headline font-bold text-emerald-800 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  Verified SP Payout
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
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-white via-emerald-50/40 to-[#fcfcfc] border-b border-emerald-100 relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-200/30 via-teal-200/30 to-sky-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl text-center">

          {/* World Clock Bar */}
          <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-2xl bg-[#f8fafc] border-2 border-slate-200 shadow-2xs text-xs text-slate-800 font-medium">
            <span className="flex items-center gap-1.5 text-slate-800 font-headline font-bold text-[10px] uppercase tracking-wider pr-2 border-r border-slate-200">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> Active Expo Hours
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

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold font-headline uppercase tracking-wider mb-6 shadow-xs w-fit mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>The Sales Partner Playbook</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight max-w-4xl mx-auto mb-6 leading-tight">
            Monetize Your Local Network &amp; On-Ground Presence at Trade Expos
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Represent global manufacturers, exporters, and brands at international trade fairs in your city. Earn guaranteed package fees with 100% milestone payment protection.
          </p>

          {/* ── 2-Column Hero Split ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left mb-12 max-w-6xl mx-auto items-stretch">

            {/* LEFT: Traditional Freelance Struggles */}
            <div className="bg-[#fff1f2] border-2 border-rose-200/90 rounded-3xl p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-900 text-[10px] font-bold font-headline uppercase tracking-wider mb-4 shadow-2xs">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>The Traditional Freelance Trap</span>
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-rose-950 leading-snug mb-3">
                  Chasing Clients &amp; Dealing with Payment Defaults
                </h2>
                <p className="text-xs md:text-sm text-rose-900/80 leading-relaxed mb-6">
                  Independent sales agents spend 60% of their time cold-calling overseas clients, pitching without contract guarantees, and waiting months for unpaid invoices.
                </p>

                <div className="bg-white border-2 border-rose-200/90 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
                  <div className="flex items-center justify-between text-gray-800 font-bold border-b border-rose-100 pb-2">
                    <span>Client Acquisition Overhead</span>
                    <span className="text-rose-700">60% Unpaid Time</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Payment Reliability</span>
                    <span className="text-rose-700">High Default Risk</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Contract Security</span>
                    <span className="text-rose-700">Informal Emails Only</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-3 bg-rose-200/70 border border-rose-300 rounded-xl text-xs text-rose-950 font-bold flex items-center justify-between shadow-2xs">
                <span>⚠️ Unpredictable Income</span>
                <span className="text-rose-800">Zero Payment Security</span>
              </div>
            </div>

            {/* RIGHT: The Fractional Sales Partner Way */}
            <div className="bg-gradient-to-b from-[#ecfdf5] via-[#d1fae5]/70 to-[#ecfdf5] border-2 border-emerald-500 rounded-3xl p-8 shadow-xl ring-4 ring-emerald-200/60 flex flex-col justify-between relative overflow-hidden scale-[1.02]">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white font-headline font-bold text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-md flex items-center gap-1.5 z-10">
                <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span>Verified Partner Network</span>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold font-headline uppercase tracking-wider mb-4 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>The Platform Advantage</span>
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-emerald-950 leading-snug mb-3">
                  List Your Packages &amp; Receive Pre-Funded Orders
                </h2>
                <p className="text-xs md:text-sm text-emerald-950/90 leading-relaxed mb-5 font-medium">
                  Publish your trade show representation packages (Bronze, Silver, Gold). Business Owners lock funds in milestone security before you step foot on the expo floor.
                </p>

                <div className="bg-white border-2 border-emerald-300 rounded-2xl p-5 shadow-sm space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-gray-800 font-bold border-b border-emerald-100 pb-2">
                    <span>Payment Security</span>
                    <span className="text-emerald-700">100% Milestone Locked</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Payout Schedule</span>
                    <span className="text-emerald-700">Guaranteed 7-Day Settlement</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Legal Compliance</span>
                    <span className="text-emerald-700">Section 10A IT Act Digital Contract</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => router.push("/login?role=sp")}
                  className="w-full py-3.5 bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_18px_rgba(5,150,105,0.3)] border-t border-emerald-300/40 border-b border-emerald-950/40 hover:from-[#10b981] hover:to-[#047857] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Register as Sales Partner</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-emerald-200" />
                </button>
              </div>
            </div>
          </div>

          {/* Animated Metrics Bar */}
          <div ref={metricsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-[#ecfdf5] border-2 border-emerald-200 p-4 rounded-2xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Payment Security</p>
              <p className="text-xl font-serif font-bold text-emerald-950">{counterStarted ? payoutCount : 0}% Guaranteed</p>
              <p className="text-[10px] text-emerald-900/70">7-day milestone payout</p>
            </div>
            <div className="bg-[#fffbeb] border-2 border-amber-200 p-4 rounded-2xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Global Brands</p>
              <p className="text-xl font-serif font-bold text-amber-950">{counterStarted ? brandsCount : 0}+ Exporters</p>
              <p className="text-[10px] text-amber-900/70">Hiring local on-ground reps</p>
            </div>
            <div className="bg-[#f0f9ff] border-2 border-sky-200 p-4 rounded-2xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-700">Expo Reach</p>
              <p className="text-xl font-serif font-bold text-sky-950">12 Key Markets</p>
              <p className="text-[10px] text-sky-900/70">UK, EU, UAE, Asia</p>
            </div>
            <div className="bg-[#fff1f2] border-2 border-rose-200 p-4 rounded-2xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-rose-700">Legal Audit</p>
              <p className="text-11px font-bold text-rose-950">GPS Check-In Verified</p>
              <p className="text-[10px] text-rose-900/70">100% transparent execution</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: Post Trade Show Package ── */}
      <section id="post-trade-show-package" className="py-16 md:py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
              Package Creation Engine
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Post Your Trade Show Representation Packages
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-2">
              List standard Bronze, Silver, or Gold representation offerings for upcoming expos in your region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bronze Tier */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-headline font-bold text-gray-700 uppercase bg-gray-200 px-2.5 py-1 rounded-md inline-block mb-3">Bronze Package</span>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Visiting Card Scan &amp; Booth Pitch</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Hand out product catalogs, pitch to walk-in visitors, and scan visiting cards using AI OCR.
                </p>
                <ul className="space-y-2 text-xs font-bold text-gray-800">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-gray-600 shrink-0" /> Full stall staffing &amp; basic pitch</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-gray-600 shrink-0" /> Visiting card AI OCR digitization</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-gray-600 shrink-0" /> End-of-day lead summary email</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-bold">Standard Tier</span>
                <span className="text-xs font-bold text-gray-900">$300 - $600 / day</span>
              </div>
            </div>

            {/* Silver Tier */}
            <div className="bg-rose-50/80 border-2 border-rose-300 rounded-2xl p-6 shadow-md flex flex-col justify-between relative scale-[1.02]">
              <span className="absolute -top-3 right-4 bg-[#701010] text-white text-[9px] font-headline font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                Most Popular
              </span>
              <div>
                <span className="text-[10px] font-headline font-bold text-rose-800 uppercase bg-rose-100 border border-rose-300 px-2.5 py-1 rounded-md inline-block mb-3">Silver Package</span>
                <h3 className="text-lg font-serif font-bold text-rose-950 mb-2">Card OCR + 2-Hr Live Stream &amp; Sample Check</h3>
                <p className="text-xs text-gray-700 leading-relaxed mb-4">
                  Includes mandatory 2-hour live video feed for brand owner audit, sample handover, and lead capture.
                </p>
                <ul className="space-y-2 text-xs font-bold text-rose-900">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" /> All Bronze deliverables included</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" /> Mandatory 2-hour live video stream</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" /> Physical product sample handovers</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-rose-200 flex items-center justify-between">
                <span className="text-xs text-rose-800 font-bold">Popular Choice</span>
                <span className="text-xs font-bold text-[#701010]">$800 - $1,500 / event</span>
              </div>
            </div>

            {/* Gold Tier */}
            <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-headline font-bold text-emerald-800 uppercase bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-md inline-block mb-3">Gold Package</span>
                <h3 className="text-lg font-serif font-bold text-emerald-950 mb-2">Full Multi-Day Management &amp; B2B Meetings</h3>
                <p className="text-xs text-gray-700 leading-relaxed mb-4">
                  Full multi-day booth leadership, direct buyer appointment scheduling, and technical presentation.
                </p>
                <ul className="space-y-2 text-xs font-bold text-emerald-900">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Multi-day booth leadership</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Scheduled B2B buyer meetings</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Complete lead CRM database upload</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-200 flex items-center justify-between">
                <span className="text-xs text-emerald-800 font-bold">Premium Tier</span>
                <span className="text-xs font-bold text-emerald-900">$2,000+ / event</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: On-Ground Verification & Audits ── */}
      <section id="on-ground-verification" className="py-16 md:py-24 bg-[#f8fafc] border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-sky-800 bg-sky-100 border border-sky-300 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
              Field Execution Tasks
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Execute On-Ground Buyer Verifications &amp; Audits
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-2">
              Beyond trade expos, earn extra income completing physical field verification tasks in your area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-2xs">
              <Building2 className="w-8 h-8 text-sky-600 mb-4" />
              <h3 className="text-base font-serif font-bold text-gray-900 mb-2">Office &amp; Factory Visits</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Physically visit buyer premises, capture geotagged photos &amp; videos, and verify physical business presence.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-2xs">
              <FileCheck className="w-8 h-8 text-amber-600 mb-4" />
              <h3 className="text-base font-serif font-bold text-gray-900 mb-2">Sample Handover &amp; Inspection</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Deliver high-value product samples directly to B2B buyers and conduct pre-shipment quality checks.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-2xs">
              <Video className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="text-base font-serif font-bold text-gray-900 mb-2">GPS &amp; Video Audit Reporting</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Log live GPS check-ins and upload timestamped proof of inspection straight to the platform dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Browse Brand Requirements ── */}
      <section id="browse-brand-requirements" className="py-16 md:py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
              Requirements Feed
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Browse Brand Requirements &amp; Submit Proposals
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-2">
              Discover offshore exporters looking for local Sales Partners in your country.
            </p>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl border-2 border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
              <h3 className="text-base font-serif font-bold">Active Brand Requirements Looking for Local SPs</h3>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full">
                Updated Real-Time
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded">🇮🇳 Textile Brand from Surat</span>
                    <span className="text-xs text-slate-400">• Dubai Gitex 2026</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Seeking Bilingual Sales Partner for 5-Day Stall Pitch</h4>
                </div>
                <button onClick={() => router.push("/login?role=sp")} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer">
                  Submit Proposal
                </button>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded">🇮🇳 Engineering Brand from Pune</span>
                    <span className="text-xs text-slate-400">• Frankfurt Messe</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Seeking Technical German-Speaking Representative</h4>
                </div>
                <button onClick={() => router.push("/login?role=sp")} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer">
                  Submit Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: 7-Day Payout Schedule ── */}
      <section id="7-day-payout-schedule" className="py-16 md:py-24 bg-[#f8fafc] border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
              Financial Safety
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              7-Day Guaranteed Payout Schedule
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-2">
              How platform milestone protection guarantees your earnings for every completed representation assignment.
            </p>
          </div>

          <div className="bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100 border-2 border-emerald-300 rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
              {[
                { step: "1", title: "Apply & Quote", sub: "Submit proposal" },
                { step: "2", title: "Budget Locked", sub: "Brand pre-funds milestone" },
                { step: "3", title: "Execute Event", sub: "GPS & 2-hr live stream" },
                { step: "4", title: "Upload Leads", sub: "AI OCR visiting cards" },
                { step: "5", title: "7-Day Payout", sub: "Funds disbursed to wallet" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/90 p-4 rounded-2xl border border-emerald-200 shadow-2xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-2">
                    {item.step}
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-[10px] text-gray-600">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Partner Code & NDA Terms ── */}
      <section id="partner-code-nda" className="py-16 md:py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-rose-800 bg-rose-100 border border-rose-300 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
              Compliance Standard
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Partner Code of Conduct &amp; NDA Terms
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-2">
              Professional guidelines ensuring high trust between offshore brand owners and local Sales Partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium text-gray-700">
            <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-200 space-y-2">
              <h4 className="font-bold text-rose-950 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-600" /> Non-Disclosure &amp; Lead Ownership
              </h4>
              <p>All attendee cards, buyer inquiries, and presentation materials belong exclusively to the hiring business owner. Partners are legally bound under digital NDA.</p>
            </div>

            <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-200 space-y-2">
              <h4 className="font-bold text-rose-950 text-sm flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-600" /> 2-Hour Mandatory Live Stream
              </h4>
              <p>Silver and Gold expo packages require a 2-hour live video feed broadcast via platform to verify active stall presence and buyer engagement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: Earnings Estimator Calculator ── */}
      <section className="py-16 md:py-24 bg-[#f8fafc] border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
              Income Estimator
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 tracking-tight">
              Estimate Your Monthly Partner Earnings
            </h2>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl p-8 shadow-sm">
            <div className="mb-8 max-w-xl mx-auto bg-white p-6 rounded-2xl border border-emerald-200 text-center">
              <p className="text-xs font-bold text-gray-700 uppercase mb-2">Expos / Assignments Per Month</p>
              <p className="text-3xl font-serif font-bold text-emerald-700 mb-4">{eventsPerMonth} Expos</p>
              <input
                type="range" min="1" max="10" step="1"
                value={eventsPerMonth} onChange={(e) => setEventsPerMonth(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-2">
                <span>1 Expo</span><span>5 Expos</span><span>10 Expos</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
              <div className="bg-white p-5 rounded-2xl border border-emerald-200">
                <p className="text-xs text-gray-500 font-bold uppercase">Estimated Monthly Income</p>
                <p className="text-3xl font-serif font-bold text-emerald-800 mt-1">${estimatedMonthlyIncome.toLocaleString()} USD</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-emerald-200">
                <p className="text-xs text-gray-500 font-bold uppercase">Estimated Annual Income</p>
                <p className="text-3xl font-serif font-bold text-emerald-800 mt-1">${estimatedAnnualIncome.toLocaleString()} USD</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FAQ for Sales Partners ── */}
      <section className="py-16 md:py-24 bg-[#fcfcfc]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-emerald-900 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
              Partner FAQs
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 tracking-tight">
              Frequently Asked Questions for Sales Partners
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How am I paid for representation packages?",
                summary: "Funds are pre-funded by brand owners into milestone security and released 7 days after event completion.",
                a: "When a brand owner accepts your package, they lock the full package fee on platform. Once the event is executed and verified (via GPS & live stream), payout is released to your registered account within 7 days."
              },
              {
                q: "Do I need my own company registered to become a Sales Partner?",
                summary: "No — independent sales executives and freelancers can register with verified photo ID and local address proof.",
                a: "No! Individual freelancers, seasoned sales professionals, and independent reps can sign up as Sales Partners by completing our digital KYC verification."
              },
              {
                q: "What if the hiring business owner cancels the assignment?",
                summary: "Cancellation policies protect partners — partial or full fees are paid if cancelled within 48 hours of event.",
                a: "Per platform terms, if a brand cancels an assignment within 48 hours of the event date, cancellation penalties are awarded to the Sales Partner to compensate for reserved time."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 hover:border-emerald-200 rounded-xl overflow-hidden shadow-2xs">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center gap-4 font-serif font-bold text-sm text-gray-900 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                    Q{index + 1}
                  </span>
                  <span className="flex-1">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${openFaq === index ? "rotate-180 text-emerald-800" : ""}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 pt-1 border-t border-gray-100 bg-gray-50/50">
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
