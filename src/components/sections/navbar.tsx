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
import { 
  Menu, X, User, Briefcase, UserCheck, Building2, 
  Cpu, ArrowRight, Sparkles
} from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when mega menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          {/* Left: Mega Menu Trigger */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 font-sans font-bold text-xs md:text-sm text-[#701010] hover:text-[#5a0c0c] tracking-widest uppercase transition-colors"
            >
              MENU <Menu className="w-5 h-5 text-[#701010]" />
            </button>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex flex-col items-center justify-center text-center">
            <Link href="/" className="font-serif font-bold text-lg md:text-xl tracking-tighter text-gray-900 flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              Fractional Sales 
              <span className="text-[#701010] font-headline text-[10px] uppercase tracking-widest font-bold border border-[#701010]/20 px-1.5 py-0.5 ml-1 rounded-sm">
                Portal
              </span>
            </Link>
            <span className="text-[9px] font-sans text-gray-500 italic mt-[1px] leading-none">Every Post is a Business</span>
          </div>

          {/* Right: Login / User Account */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-[#701010] hover:text-[#5a0c0c] border border-[#701010]/30 hover:border-[#701010] px-3.5 py-1.5 rounded-md transition-all font-headline uppercase tracking-wider">
              Login / Sign Up
            </Link>
            <Link href="/login" className="relative p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
              <User className="w-5 h-5 text-gray-700" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#701010] rounded-full border-2 border-white"></span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Expanded Mega Menu Overlay (Soft Light Pastel Tint Panels) */}
      {isOpen && (
        <div className="fixed inset-0 z-[70] bg-[#fafafa] text-gray-900 flex flex-col overflow-y-auto animate-in fade-in duration-200">
          {/* Mega Menu Top Header */}
          <div className="flex-none w-full px-6 h-16 flex items-center justify-between border-b border-gray-200 bg-white shadow-sm">
            {/* Left: Close Button */}
            <div className="flex items-center">
              <button 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 font-sans font-bold text-xs md:text-sm text-gray-700 hover:text-red-600 transition-colors tracking-widest uppercase"
              >
                CLOSE <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Center: Brand Logo */}
            <div className="flex flex-col items-center justify-center text-center">
              <Link href="/" onClick={() => setIsOpen(false)} className="font-serif font-bold text-lg md:text-xl tracking-tighter text-gray-900 flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                Fractional Sales 
                <span className="text-[#701010] font-headline text-[10px] uppercase tracking-widest font-bold border border-[#701010]/20 px-1.5 py-0.5 ml-1 rounded-sm">
                  Portal
                </span>
              </Link>
              <span className="text-[9px] font-sans text-gray-500 italic mt-[1px] leading-none">Every Post is a Business</span>
            </div>

            {/* Right: Quick Action */}
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-white bg-[#701010] hover:bg-[#5a0c0c] px-4 py-2 rounded-md transition-all font-headline uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
              >
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Mega Menu Content (4 Soft Pastel Tint Panels) */}
          <div className="flex-1 container mx-auto px-6 py-8">
            {/* Sub-header Banner */}
            <div className="mb-8 pb-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-serif font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  Global Trade &amp; Export Ecosystem
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Connecting Manufacturers &amp; Traders, Sales Partners, and Ecosystem Service Providers worldwide.
                </p>
              </div>
              <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-[#701010] bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-full w-fit shadow-2xs">
                3-Persona Portal Structure
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Column 1: FOR BUSINESS OWNERS (Soft Pastel Rose Tint Panel) */}
              <div className="bg-[#fff5f5]/80 border border-rose-200/80 hover:border-rose-300 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-9 h-9 rounded-xl bg-white border border-rose-200 text-rose-600 flex items-center justify-center shadow-2xs">
                      <Briefcase className="w-4 h-4" />
                    </span>
                    <span className="text-[9px] font-headline font-bold uppercase tracking-widest text-rose-800 bg-rose-100/80 border border-rose-200 px-2 py-0.5 rounded-md">
                      Manufacturers &amp; Traders
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-rose-950 tracking-wide mb-1">
                    For Business Owners
                  </h3>
                  <p className="text-[11px] text-rose-900/70 mb-5 leading-relaxed">
                    Manufacturers, Traders &amp; Exporters expanding into global markets with dedicated sales representation.
                  </p>

                  <ul className="space-y-3">
                    <li>
                      <Link href="/login?role=obo" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-rose-700 transition-colors">
                        <span className="text-rose-500 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-rose-700 transition-colors">Post Business Requirements</p>
                          <p className="text-[10px] text-rose-900/50">Request SPs for trade shows &amp; B2B expos</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/login?role=obo" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-rose-700 transition-colors">
                        <span className="text-rose-500 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-rose-700 transition-colors">Browse Sales Partners</p>
                          <p className="text-[10px] text-rose-900/50">Filter by country, industry &amp; footfall</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/login?role=obo" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-rose-700 transition-colors">
                        <span className="text-rose-500 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-rose-700 transition-colors">Hire Booth Representatives</p>
                          <p className="text-[10px] text-rose-900/50">Booth management, sales &amp; meetings</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/legal/privacy" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-rose-700 transition-colors">
                        <span className="text-rose-500 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-rose-700 transition-colors">Escrow &amp; Payment Safety</p>
                          <p className="text-[10px] text-rose-900/50">7-day post-event audit payout protection</p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-rose-200/60">
                  <Link href="/login?role=obo" onClick={() => setIsOpen(false)} className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center justify-between">
                    <span>Hire Sales Reps</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Column 2: FOR SALES PARTNERS (Soft Pastel Mint/Emerald Tint Panel) */}
              <div className="bg-[#f0fdf4]/80 border border-emerald-200/80 hover:border-emerald-300 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-9 h-9 rounded-xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-2xs">
                      <UserCheck className="w-4 h-4" />
                    </span>
                    <span className="text-[9px] font-headline font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Expo Reps &amp; On-Ground Agents
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-emerald-950 tracking-wide mb-1">
                    For Sales Partners
                  </h3>
                  <p className="text-[11px] text-emerald-900/70 mb-5 leading-relaxed">
                    Represent offshore brands at expos, execute buyer verifications, quality checks &amp; local field tasks.
                  </p>

                  <ul className="space-y-3">
                    <li>
                      <Link href="/login?role=sp" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-emerald-700 transition-colors">
                        <span className="text-emerald-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">Post Trade Show Package</p>
                          <p className="text-[10px] text-emerald-900/50">List Bronze, Silver &amp; Gold expo offerings</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/login?role=sp" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-emerald-700 transition-colors">
                        <span className="text-emerald-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">On-Ground Verification &amp; Audits</p>
                          <p className="text-[10px] text-emerald-900/50">Buyer verification, quality checks &amp; sample handovers</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/login?role=sp" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-emerald-700 transition-colors">
                        <span className="text-emerald-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">Browse Brand Requirements</p>
                          <p className="text-[10px] text-emerald-900/50">Find offshore manufacturers hiring local reps</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/login?role=sp" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-emerald-700 transition-colors">
                        <span className="text-emerald-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">7-Day Payout Schedule</p>
                          <p className="text-[10px] text-emerald-900/50">Transparent representation fee disbursement</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/login?role=sp" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-emerald-700 transition-colors">
                        <span className="text-emerald-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">Partner Code &amp; NDA Terms</p>
                          <p className="text-[10px] text-emerald-900/50">2-hr livestream &amp; conduct compliance</p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-200/60">
                  <Link href="/login?role=sp" onClick={() => setIsOpen(false)} className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-between">
                    <span>List Expo Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Column 3: THIRD-PARTY SERVICES (Soft Pastel Sun Gold/Amber Tint Panel) */}
              <div className="bg-[#fffbeb]/80 border border-amber-200/80 hover:border-amber-300 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-9 h-9 rounded-xl bg-white border border-amber-200 text-amber-600 flex items-center justify-center shadow-2xs">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <span className="text-[9px] font-headline font-bold uppercase tracking-widest text-amber-800 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded-md">
                      Trade Ecosystem
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-amber-950 tracking-wide mb-1">
                    Third-Party Services
                  </h3>
                  <p className="text-[11px] text-amber-900/70 mb-5 leading-relaxed">
                    End-to-end B2B services supporting cross-border trade &amp; business operations.
                  </p>

                  <ul className="space-y-3">
                    <li>
                      <Link href="#tpsp-marketing" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-amber-700 transition-colors">
                        <span className="text-amber-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">Biz Dev &amp; Marketing Agencies</p>
                          <p className="text-[10px] text-amber-900/50">Market entry, lead gen &amp; PR across borders</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="#tpsp-legal" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-amber-700 transition-colors">
                        <span className="text-amber-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">Legal &amp; Regulatory Services</p>
                          <p className="text-[10px] text-amber-900/50">Contracts, IP protection &amp; incorporation</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="#tpsp-tax" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-amber-700 transition-colors">
                        <span className="text-amber-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">Accounting, Audit &amp; Tax</p>
                          <p className="text-[10px] text-amber-900/50">Global tax compliance, VAT/GST &amp; audit</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="#tpsp-logistics" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-amber-700 transition-colors">
                        <span className="text-amber-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">Logistics &amp; Freight Forwarding</p>
                          <p className="text-[10px] text-amber-900/50">International shipping &amp; sample dispatch</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="#tpsp-cha" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-amber-700 transition-colors">
                        <span className="text-amber-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">Custom House Agents (CHAs)</p>
                          <p className="text-[10px] text-amber-900/50">Customs clearance, import docs &amp; tariffs</p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-200/60">
                  <Link href="#tpsp" onClick={() => setIsOpen(false)} className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center justify-between">
                    <span>Ecosystem Partners</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Column 4: PLATFORM TOOLS & LEGAL (Soft Pastel Sky Blue Tint Panel) */}
              <div className="bg-[#f0f9ff]/80 border border-sky-200/80 hover:border-sky-300 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-9 h-9 rounded-xl bg-white border border-sky-200 text-sky-600 flex items-center justify-center shadow-2xs">
                      <Cpu className="w-4 h-4" />
                    </span>
                    <span className="text-[9px] font-headline font-bold uppercase tracking-widest text-sky-800 bg-sky-100/80 border border-sky-200 px-2 py-0.5 rounded-md">
                      Platform Suite
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-sky-950 tracking-wide mb-1">
                    Tools &amp; Compliance
                  </h3>
                  <p className="text-[11px] text-sky-900/70 mb-5 leading-relaxed">
                    AI tools, verified legal contracts, and security standards.
                  </p>

                  <ul className="space-y-3">
                    <li>
                      <Link href="/login" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-sky-700 transition-colors">
                        <span className="text-sky-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-sky-700 transition-colors flex items-center gap-1.5">
                            AI Visiting Card Scanner <Sparkles className="w-3 h-3 text-amber-500" />
                          </p>
                          <p className="text-[10px] text-sky-900/50">Instant OCR lead capture &amp; CRM export</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/home" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-sky-700 transition-colors">
                        <span className="text-sky-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-sky-700 transition-colors">Global Event Directory</p>
                          <p className="text-[10px] text-sky-900/50">US, UK, UAE, EU &amp; India Trade Shows</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/legal/terms" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-sky-700 transition-colors">
                        <span className="text-sky-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-sky-700 transition-colors">Service Agreements</p>
                          <p className="text-[10px] text-sky-900/50">Digital Section 10A IT Act 2000 Contracts</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/legal/privacy" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-sky-700 transition-colors">
                        <span className="text-sky-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-sky-700 transition-colors">Security &amp; Data Privacy</p>
                          <p className="text-[10px] text-sky-900/50">GDPR &amp; Enterprise Security Standards</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/legal/contact" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-gray-800 hover:text-sky-700 transition-colors">
                        <span className="text-sky-600 font-bold opacity-70 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-sky-700 transition-colors">Platform Support &amp; FAQs</p>
                          <p className="text-[10px] text-sky-900/50">Platform Help Desk &amp; Contact</p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-sky-200/60">
                  <Link href="/legal/terms" onClick={() => setIsOpen(false)} className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center justify-between">
                    <span>Explore Suite</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
