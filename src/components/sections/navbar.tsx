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
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-white border-b border-gray-200">
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

      {/* Expanded Mega Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[70] bg-[#121212] text-white flex flex-col overflow-y-auto animate-in fade-in duration-200">
          {/* Mega Menu Top Header */}
          <div className="flex-none w-full px-6 h-16 flex items-center justify-between border-b border-white/10 bg-[#181818]">
            {/* Left: Close Button */}
            <div className="flex items-center">
              <button 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 font-sans font-bold text-xs md:text-sm text-amber-400 hover:text-amber-300 transition-colors tracking-widest uppercase"
              >
                CLOSE <X className="w-5 h-5" />
              </button>
            </div>

            {/* Center: Brand Logo */}
            <div className="flex flex-col items-center justify-center text-center">
              <Link href="/" onClick={() => setIsOpen(false)} className="font-serif font-bold text-lg md:text-xl tracking-tighter text-white flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                Fractional Sales 
                <span className="text-white font-headline text-[10px] uppercase tracking-widest font-bold border border-white/20 px-1.5 py-0.5 ml-1 rounded-sm">
                  Portal
                </span>
              </Link>
              <span className="text-[9px] font-sans text-white/60 italic mt-[1px] leading-none">Every Post is a Business</span>
            </div>

            {/* Right: Quick Action */}
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-white bg-[#701010] hover:bg-[#5a0c0c] px-4 py-2 rounded-md transition-all font-headline uppercase tracking-wider flex items-center gap-1.5 shadow-md"
              >
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Mega Menu Content (4 Ecosystem Columns) */}
          <div className="flex-1 container mx-auto px-6 py-10">
            {/* Sub-header Banner */}
            <div className="mb-8 pb-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-serif font-bold text-white tracking-tight flex items-center gap-2">
                  Global Trade &amp; Export Ecosystem Nav
                </h2>
                <p className="text-xs text-white/60">
                  Connecting Business Owners, Sales Partners, and Third-Party Ecosystem Providers worldwide.
                </p>
              </div>
              <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full w-fit">
                3-Persona Portal Structure
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Column 1: FOR BUSINESS OWNERS (OBO) */}
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </span>
                    <span className="text-[9px] font-headline font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                      Manufacturers &amp; Traders
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-white tracking-wide mb-1">
                    For Business Owners
                  </h3>
                  <p className="text-[11px] text-white/50 mb-5">
                    Manufacturers, Traders &amp; Exporters expanding into global markets with dedicated sales representation.
                  </p>

                  <ul className="space-y-3">
                    <li>
                      <Link href="/login?role=obo" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-red-400 transition-colors">
                        <span className="text-red-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-red-400 transition-colors">Post Business Requirements</p>
                          <p className="text-[10px] text-white/40">Request SPs for trade shows &amp; B2B expos</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/login?role=obo" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-red-400 transition-colors">
                        <span className="text-red-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-red-400 transition-colors">Browse Sales Partners</p>
                          <p className="text-[10px] text-white/40">Filter by country, industry &amp; footfall</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/login?role=obo" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-red-400 transition-colors">
                        <span className="text-red-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-red-400 transition-colors">Hire Booth Representatives</p>
                          <p className="text-[10px] text-white/40">Booth management, sales &amp; meetings</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/legal/privacy" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-red-400 transition-colors">
                        <span className="text-red-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-red-400 transition-colors">Escrow &amp; Payment Safety</p>
                          <p className="text-[10px] text-white/40">7-day post-event audit payout protection</p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link href="/login?role=obo" onClick={() => setIsOpen(false)} className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center justify-between">
                    <span>Hire Sales Reps</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Column 2: FOR SALES PARTNERS (SP) */}
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </span>
                    <span className="text-[9px] font-headline font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Event Reps &amp; Hosts
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-white tracking-wide mb-1">
                    For Sales Partners
                  </h3>
                  <p className="text-[11px] text-white/50 mb-5">
                    Represent global brands at expos and earn representation fees.
                  </p>

                  <ul className="space-y-3">
                    <li>
                      <Link href="/login?role=sp" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-emerald-400 transition-colors">
                        <span className="text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Post Trade Show Package</p>
                          <p className="text-[10px] text-white/40">List Bronze, Silver &amp; Gold offerings</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/login?role=sp" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-emerald-400 transition-colors">
                        <span className="text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Browse Brand Requirements</p>
                          <p className="text-[10px] text-white/40">Find MSMEs looking for sales reps</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/login?role=sp" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-emerald-400 transition-colors">
                        <span className="text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">7-Day Payout Schedule</p>
                          <p className="text-[10px] text-white/40">Transparent representation fee disbursement</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/login?role=sp" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-emerald-400 transition-colors">
                        <span className="text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Partner Code &amp; NDA Terms</p>
                          <p className="text-[10px] text-white/40">2-hr livestream &amp; conduct compliance</p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link href="/login?role=sp" onClick={() => setIsOpen(false)} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-between">
                    <span>List Expo Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Column 3: THIRD-PARTY SERVICES (TPSP) */}
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <span className="text-[9px] font-headline font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      Trade Ecosystem
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-white tracking-wide mb-1">
                    Third-Party Services
                  </h3>
                  <p className="text-[11px] text-white/50 mb-5">
                    End-to-end B2B services supporting cross-border trade.
                  </p>

                  <ul className="space-y-3">
                    <li>
                      <Link href="#tpsp-marketing" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-amber-400 transition-colors">
                        <span className="text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-amber-400 transition-colors">Biz Dev &amp; Marketing Agencies</p>
                          <p className="text-[10px] text-white/40">Market entry, lead gen &amp; PR across borders</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="#tpsp-legal" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-amber-400 transition-colors">
                        <span className="text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-amber-400 transition-colors">Legal &amp; Regulatory Services</p>
                          <p className="text-[10px] text-white/40">Contracts, IP protection &amp; incorporation</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="#tpsp-tax" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-amber-400 transition-colors">
                        <span className="text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-amber-400 transition-colors">Accounting, Audit &amp; Tax</p>
                          <p className="text-[10px] text-white/40">Global tax compliance, VAT/GST &amp; audit</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="#tpsp-logistics" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-amber-400 transition-colors">
                        <span className="text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-amber-400 transition-colors">Logistics &amp; Freight Forwarding</p>
                          <p className="text-[10px] text-white/40">International shipping &amp; sample dispatch</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="#tpsp-cha" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-amber-400 transition-colors">
                        <span className="text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-amber-400 transition-colors">Custom House Agents (CHAs)</p>
                          <p className="text-[10px] text-white/40">Customs clearance, import docs &amp; tariffs</p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link href="#tpsp" onClick={() => setIsOpen(false)} className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center justify-between">
                    <span>Ecosystem Partners</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Column 4: PLATFORM TOOLS & LEGAL */}
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Cpu className="w-4 h-4" />
                    </span>
                    <span className="text-[9px] font-headline font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                      Platform Suite
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-white tracking-wide mb-1">
                    Tools &amp; Compliance
                  </h3>
                  <p className="text-[11px] text-white/50 mb-5">
                    AI tools, verified legal contracts, and security standards.
                  </p>

                  <ul className="space-y-3">
                    <li>
                      <Link href="/login" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-sky-400 transition-colors">
                        <span className="text-sky-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
                            AI Visiting Card Scanner <Sparkles className="w-3 h-3 text-amber-400" />
                          </p>
                          <p className="text-[10px] text-white/40">Instant OCR lead capture &amp; CRM export</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/home" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-sky-400 transition-colors">
                        <span className="text-sky-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-sky-400 transition-colors">Global Event Directory</p>
                          <p className="text-[10px] text-white/40">US, UK, UAE, EU &amp; India Trade Shows</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/legal/terms" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-sky-400 transition-colors">
                        <span className="text-sky-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-sky-400 transition-colors">Service Agreements</p>
                          <p className="text-[10px] text-white/40">Digital Section 10A IT Act 2000 Contracts</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/legal/privacy" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-sky-400 transition-colors">
                        <span className="text-sky-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-sky-400 transition-colors">Security &amp; Data Privacy</p>
                          <p className="text-[10px] text-white/40">GDPR &amp; Enterprise Security Standards</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/legal/contact" onClick={() => setIsOpen(false)} className="group flex items-start gap-2 text-xs text-white/80 hover:text-sky-400 transition-colors">
                        <span className="text-sky-400 opacity-60 group-hover:opacity-100 transition-opacity">›</span>
                        <div>
                          <p className="font-semibold text-white group-hover:text-sky-400 transition-colors">Platform Support &amp; FAQs</p>
                          <p className="text-[10px] text-white/40">Platform Help Desk &amp; Contact</p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link href="/legal/terms" onClick={() => setIsOpen(false)} className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center justify-between">
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
