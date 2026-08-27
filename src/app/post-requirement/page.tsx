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

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Briefcase, ShieldCheck, CheckCircle2, ArrowRight, Building2, 
  MapPin, Calendar, Lock, Video, Camera, Sparkles, ChevronDown, 
  Users, Layers, Award, FileText, Globe2, Scan, HelpCircle, ArrowUpRight,
  TrendingUp, AlertCircle, RefreshCw, DollarSign, Compass, PieChart, Check, XIcon
} from "lucide-react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

export default function PostRequirementPage() {
  const router = useRouter();
  const [activeStoryTab, setActiveStoryTab] = useState<"problem" | "nuances" | "solution" | "post">("problem");
  const [budgetSlider, setBudgetSlider] = useState<number>(30000);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Calculations for interactive budget simulator
  const traditionalMarketsCovered = Math.max(1, Math.floor(budgetSlider / 60000));
  const fractionalExposCovered = Math.floor(budgetSlider / 2500);
  const fractionalCountriesCovered = Math.min(12, Math.max(2, Math.floor(fractionalExposCovered / 1.5)));

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans flex flex-col selection:bg-rose-100 selection:text-rose-900">
      {/* Global Top Navbar */}
      <Navbar />

      {/* Hero Section: Presentation Header */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-white via-rose-50/40 to-[#fafafa] border-b border-rose-100/60 relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-rose-200/20 via-amber-200/20 to-sky-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold font-headline uppercase tracking-wider mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>The MSME Global Expansion Playbook</span>
          </div>

          <h1 className="text-xl md:text-3xl lg:text-4xl font-serif font-bold text-gray-900 tracking-tight leading-snug max-w-3xl mx-auto mb-4">
            Why Sinking Your Budget into One Country Fails—And How <span className="text-[#701010] bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200/80 inline-block font-bold">Fractional Sales</span> Unlocks Global Reach
          </h1>

          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Selling in France 🇫🇷 is not selling in Italy 🇮🇹, which is not selling in Germany 🇩🇪. Discover how smart Business Owners distribute a single market budget across 5+ countries using on-ground Fractional Sales Partners.
          </p>

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

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white border border-rose-100 p-4 rounded-xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600">Cost Savings</p>
              <p className="text-xl font-serif font-bold text-gray-900">Up to 80%</p>
              <p className="text-[10px] text-gray-500">Vs hiring full-time overseas reps</p>
            </div>
            <div className="bg-white border border-emerald-100 p-4 rounded-xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Global Reach</p>
              <p className="text-xl font-serif font-bold text-gray-900">5x Markets</p>
              <p className="text-[10px] text-gray-500">Covered under the same budget</p>
            </div>
            <div className="bg-white border border-amber-100 p-4 rounded-xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Local Nuance</p>
              <p className="text-xl font-serif font-bold text-gray-900">100% Native</p>
              <p className="text-[10px] text-gray-500">Local language &amp; buyer network</p>
            </div>
            <div className="bg-white border border-sky-100 p-4 rounded-xl shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-600">Security</p>
              <p className="text-[11px] font-bold text-gray-900">7-Day Escrow Payout</p>
              <p className="text-[10px] text-gray-500">Section 10A IT Act Legal Contract</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Presentation Storyboard */}
      <section id="interactive-presentation" className="py-16 md:py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full inline-block mb-3">
              Executive Presentation
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              The Strategic Shift: From Fixed Capital Sinking to Fractional Distribution
            </h2>
          </div>

          {/* Presentation Nav Switcher Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 p-1.5 bg-gray-100/80 rounded-2xl max-w-3xl mx-auto">
            <button
              onClick={() => setActiveStoryTab("problem")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-headline uppercase tracking-wider transition-all cursor-pointer ${
                activeStoryTab === "problem"
                  ? "bg-white text-rose-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              1. The Capital Trap
            </button>
            <button
              onClick={() => setActiveStoryTab("nuances")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-headline uppercase tracking-wider transition-all cursor-pointer ${
                activeStoryTab === "nuances"
                  ? "bg-white text-rose-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              2. Cultural Nuances
            </button>
            <button
              onClick={() => setActiveStoryTab("solution")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-headline uppercase tracking-wider transition-all cursor-pointer ${
                activeStoryTab === "solution"
                  ? "bg-white text-rose-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              3. Fractional Solution
            </button>
            <button
              onClick={() => setActiveStoryTab("post")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-headline uppercase tracking-wider transition-all cursor-pointer ${
                activeStoryTab === "post"
                  ? "bg-white text-rose-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              4. Live Post Demo
            </button>
          </div>

          {/* Presentation Slide 1: The Problem */}
          {activeStoryTab === "problem" && (
            <div className="bg-[#fff5f5]/60 border border-rose-200 rounded-3xl p-8 md:p-12 shadow-sm animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 bg-white border border-rose-200 px-2.5 py-1 rounded-md mb-4 inline-block">
                    Slide 01 — The MSME Expansion Dilemma
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
                    The Capital Trap of Traditional Overseas Offices
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-6">
                    When a Business Owner, Manufacturer, or Trader wants to expand globally, traditional advice says: <em className="text-gray-900 font-semibold">"Set up a local entity, lease an office, and hire a full-time sales executive in the target country."</em>
                  </p>

                  <div className="space-y-3 bg-white p-5 rounded-2xl border border-rose-100 text-xs">
                    <div className="flex items-center justify-between text-gray-800 font-bold border-b border-gray-100 pb-2">
                      <span>Full-Time Overseas Hire (1 Country)</span>
                      <span className="text-rose-600">$80,000 - $120,000 / yr</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Local Office Lease &amp; Compliance</span>
                      <span>$25,000 / yr</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Travel &amp; Administrative Overhead</span>
                      <span>$15,000 / yr</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-rose-700 pt-2 border-t border-gray-100">
                      <span>Total Fixed Budget Consumed</span>
                      <span>$120,000+ (Sunk in 1 Market)</span>
                    </div>
                  </div>
                </div>

                {/* Visual Doodle Illustration / Comparison Diagram */}
                <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-sm text-center">
                  <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-gray-900 mb-2">High Risk &amp; High Sunk Cost</h4>
                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                    You have spent your <strong>entire MSME expansion budget</strong> on a single country. If that market slows down, 100% of your capital is at risk, leaving $0 for UK, Germany, UAE, or US opportunities.
                  </p>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-medium">
                    ⚠️ 0 Flexibility | 0 Budget for other markets | High Fixed Payroll Risk
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Presentation Slide 2: Cultural Sales Nuance Matrix */}
          {activeStoryTab === "nuances" && (
            <div className="bg-[#fffbeb]/60 border border-amber-200 rounded-3xl p-8 md:p-12 shadow-sm animate-in fade-in duration-300">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-white border border-amber-200 px-2.5 py-1 rounded-md mb-3 inline-block">
                  Slide 02 — Cross-Border Reality
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3">
                  How You Sell in France 🇫🇷 ≠ Italy 🇮🇹 ≠ Germany 🇩🇪
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Every country has distinct business etiquettes, language expectations, and buyer relationships. A single full-time hire cannot effectively cover multiple distinct cultures.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* France */}
                <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-2xs">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🇫🇷</span>
                    <div>
                      <h4 className="font-serif font-bold text-base text-gray-900">France (Paris Expos)</h4>
                      <p className="text-[10px] text-amber-700 font-bold uppercase">Relationship &amp; Compliance</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    Requires fluent French, formal business etiquette, strict EU regulatory documentation, and local relationship cultivation.
                  </p>
                  <div className="text-[11px] text-amber-900 font-medium p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                    💡 Needs local native French speaker with trade fair networks.
                  </div>
                </div>

                {/* Italy */}
                <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-2xs">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🇮🇹</span>
                    <div>
                      <h4 className="font-serif font-bold text-base text-gray-900">Italy (Milan Trade Fairs)</h4>
                      <p className="text-[10px] text-amber-700 font-bold uppercase">Design &amp; Personal Rapport</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    Requires strong personal rapport, deep aesthetic and product design presentation, and direct localized buyer introductions.
                  </p>
                  <div className="text-[11px] text-amber-900 font-medium p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                    💡 Needs on-ground Italian rep with direct B2B buyer connections.
                  </div>
                </div>

                {/* Germany */}
                <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-2xs">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🇩🇪</span>
                    <div>
                      <h4 className="font-serif font-bold text-base text-gray-900">Germany (Hannover Messe)</h4>
                      <p className="text-[10px] text-amber-700 font-bold uppercase">Precision &amp; Technical Specs</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    Requires extreme engineering precision, structured data sheets, German fluency, and verified quality certification handovers.
                  </p>
                  <div className="text-[11px] text-amber-900 font-medium p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                    💡 Needs technical sales delegate fluent in German &amp; ISO standards.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Presentation Slide 3: The Fractional Solution */}
          {activeStoryTab === "solution" && (
            <div className="bg-[#f0fdf4]/60 border border-emerald-200 rounded-3xl p-8 md:p-12 shadow-sm animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-white border border-emerald-200 px-2.5 py-1 rounded-md mb-4 inline-block">
                    Slide 03 — The Fractional Allocation Strategy
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
                    Redistribute One Budget Across 6+ Countries Effortlessly
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-6">
                    Instead of spending $100,000 on 1 country, **allocate $10,000 to $15,000 per market** to hire top Fractional Sales Partners for specific expos, B2B meetings, and buyer verifications.
                  </p>

                  <div className="space-y-2 text-xs font-medium text-gray-800">
                    <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>🇫🇷 Paris Expo: Hire local French Sales Rep (€1,200 package)</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>🇩🇪 Frankfurt Messe: Hire technical German Sales Rep (€1,500 package)</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>🇦🇪 Dubai Gitex: Hire bilingual Arabic/English Sales Rep ($1,800 package)</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>🇺🇸 Las Vegas CES: Hire US B2B Booth Delegate ($2,000 package)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-gray-900 mb-2">10x Multi-Country ROI</h4>
                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                    Zero fixed payroll. Zero office leases. Pay only for verified event packages with <strong>7-day escrow protection</strong> and real-time scanned leads CRM.
                  </p>
                  <button
                    onClick={() => router.push("/login?role=obo&redirect=create-post")}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    Post Requirement &amp; Allocate Budget
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Presentation Slide 4: Live Event Post Showcase */}
          {activeStoryTab === "post" && (
            <div className="bg-[#f0f9ff]/60 border border-sky-200 rounded-3xl p-8 md:p-12 shadow-sm animate-in fade-in duration-300">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-700 bg-white border border-sky-200 px-2.5 py-1 rounded-md mb-3 inline-block">
                  Slide 04 — Real Platform Execution
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3">
                  How a Sales Partner Event Listing Appears on Platform
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Business Owners review transparent event posts created by Sales Partners, complete with line-item packages, venue location, and verified partner profiles.
                </p>
              </div>

              {/* Demo Post Card Graphic */}
              <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden text-left">
                <div className="relative h-64 w-full bg-gray-100">
                  <Image 
                    src="/hero-bg-2.png" 
                    alt="Expo Demonstration" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1.5">
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
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Package Rates From</p>
                      <p className="text-lg font-bold text-emerald-600">€1,200 EUR</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/60">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Bronze Package</p>
                      <p className="text-sm font-bold text-gray-900">€500</p>
                      <p className="text-[10px] text-gray-500 mt-1">Visiting Card Scan &amp; Booth Pitch</p>
                    </div>
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                      <p className="text-[10px] font-bold text-rose-700 uppercase">Silver Package (Popular)</p>
                      <p className="text-sm font-bold text-rose-950">€1,200</p>
                      <p className="text-[10px] text-rose-900/60 mt-1">+ 2-hr Live Stream &amp; Sample Check</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/60">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Gold Package</p>
                      <p className="text-sm font-bold text-gray-900">€2,500</p>
                      <p className="text-[10px] text-gray-500 mt-1">Full 5-Day Booth Management &amp; B2B Meetings</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Protected by 7-Day Escrow &amp; GPS Check-In Audit</span>
                    </div>
                    <button
                      onClick={() => router.push("/login?role=obo&redirect=create-post")}
                      className="px-5 py-2.5 bg-[#701010] hover:bg-[#5a0c0c] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
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

      {/* Interactive Budget Simulator */}
      <section className="py-16 md:py-24 bg-[#f8fafc] border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full inline-block mb-3">
              Interactive ROI Calculator
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Compare Your Global Reach: Traditional vs. Fractional
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-2">
              Slide your annual international sales budget to see how many global expos and countries you can cover.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            {/* Slider control */}
            <div className="mb-10 max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-600 uppercase">Your Annual Sales Budget</span>
                <span className="text-xl font-serif font-bold text-[#701010]">${budgetSlider.toLocaleString('en-US')} USD</span>
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
              <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                <span>$10,000</span>
                <span>$75,000</span>
                <span>$150,000</span>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Traditional Route */}
              <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-serif font-bold text-base text-gray-900">Traditional Fixed Overseas Hire</h4>
                  <XIcon className="w-5 h-5 text-rose-500" />
                </div>
                <div className="space-y-3 text-xs text-gray-700">
                  <div className="flex justify-between py-1.5 border-b border-rose-200/60">
                    <span>Countries Covered</span>
                    <span className="font-bold text-rose-700">{traditionalMarketsCovered} Market Only</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-rose-200/60">
                    <span>Expos Attended</span>
                    <span className="font-bold text-rose-700">1 - 2 Fairs max</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-rose-200/60">
                    <span>Fixed Payroll Risk</span>
                    <span className="font-bold text-rose-700">100% Sunk Expense</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-rose-900">
                    <span>Overall Flexibility</span>
                    <span className="text-rose-600">Zero (Locked in 1 Country)</span>
                  </div>
                </div>
              </div>

              {/* Fractional Route */}
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-serif font-bold text-base text-gray-900">Fractional Sales Partner Allocation</h4>
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="space-y-3 text-xs text-gray-700">
                  <div className="flex justify-between py-1.5 border-b border-emerald-200/60">
                    <span>Countries Covered</span>
                    <span className="font-bold text-emerald-700">{fractionalCountriesCovered} Global Markets 🌍</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-200/60">
                    <span>Expos Attended</span>
                    <span className="font-bold text-emerald-700">{fractionalExposCovered} Trade Fairs ✨</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-200/60">
                    <span>Escrow &amp; Audit Protection</span>
                    <span className="font-bold text-emerald-700">100% Money-Back Escrow</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-emerald-900">
                    <span>Overall Flexibility</span>
                    <span className="text-emerald-600">Maximum (On-Demand Execution)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Escrow Guarantee & Legal Security Section */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50 border border-rose-200/80 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200 text-rose-800 text-[11px] font-bold uppercase tracking-wider mb-4 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  <span>Biztribe Escrow &amp; Audit Guarantee</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
                  Zero Financial Risk for Business Owners
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-6">
                  Your funds are protected in escrow. Payouts are withheld if a Sales Partner fails to arrive on time, misses the mandatory 2-hour live stream, fails to post 2-hour social updates, or misrepresents your brand.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-800 font-medium">
                  <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-rose-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Mandatory GPS Check-In Audit
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-rose-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Confidentiality &amp; NDA
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-rose-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 12-Month Non-Compete Guarantee
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-rose-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Transparent 25% Platform Fee
                  </div>
                </div>
              </div>

              <div className="bg-white border border-rose-200/90 rounded-2xl p-6 shadow-sm text-center">
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
      <section className="py-16 md:py-24 bg-[#fafafa]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full inline-block mb-3">
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
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm text-gray-900 hover:text-[#701010] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${openFaq === index ? "rotate-180 text-[#701010]" : ""}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
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
