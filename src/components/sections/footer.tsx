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

"use client";

import React, { useState } from "react";
import { Twitter, Linkedin, Instagram, Facebook, ShieldCheck, Lock, Fingerprint, ChevronRight, Award } from "lucide-react";
import Link from "next/link";
import { SecurityTrustModal } from "@/components/SecurityTrustModal";

export function Footer() {
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  return (
    <>
      {/* Fresh Bright Trustworthy Blue Footer */}
      <footer className="bg-gradient-to-br from-[#075985] via-[#0284c7] to-[#0369a1] text-white pt-14 pb-10 border-t border-sky-400/30 font-sans shadow-2xl">
        <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
          
          {/* Main Footer Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 pb-10 border-b border-white/20">

            {/* Brand Logo & Tagline */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-lg">
              <Link href="/">
                <span className="font-serif font-bold text-2xl md:text-3xl tracking-tight text-white hover:text-sky-200 transition-colors">
                  Fractional Sales Partner
                </span>
              </Link>
              <p className="text-sky-100/90 text-xs md:text-sm mt-3 leading-relaxed font-medium">
                Empowering MSMEs from emerging markets to scale globally through verified fractional sales expertise.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Twitter" className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-[#0369a1] border border-white/20 rounded-full transition-all duration-300 shadow-sm">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-[#0369a1] border border-white/20 rounded-full transition-all duration-300 shadow-sm">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-[#0369a1] border border-white/20 rounded-full transition-all duration-300 shadow-sm">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-[#0369a1] border border-white/20 rounded-full transition-all duration-300 shadow-sm">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Highlighted Trust & Security Banner */}
          <div className="my-8 p-4 md:p-6 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
            
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="p-3 bg-white text-[#0284c7] rounded-xl shadow-md flex-shrink-0">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-sky-900 bg-sky-100 px-2.5 py-0.5 rounded-full shadow-sm">
                    Verified Trust & Security Architecture
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                </div>
                <h4 className="text-base font-bold text-white mt-1">
                  Enterprise Security, Anti-Fraud & Regulatory Shield
                </h4>
              </div>
            </div>

            {/* 3 Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-white">
              <div className="flex items-center gap-2 bg-white/15 px-3.5 py-1.5 rounded-xl border border-white/20 shadow-sm font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Cloudflare WAF</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 px-3.5 py-1.5 rounded-xl border border-white/20 shadow-sm font-medium">
                <Fingerprint className="w-4 h-4 text-purple-200" />
                <span>Anti-Fraud (Max 3)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 px-3.5 py-1.5 rounded-xl border border-white/20 shadow-sm font-medium">
                <Lock className="w-4 h-4 text-amber-300" />
                <span>256-Bit TLS HSTS</span>
              </div>
            </div>

            {/* Modal Trigger Action */}
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="px-5 py-2.5 bg-white hover:bg-sky-50 text-[#0369a1] font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer flex-shrink-0 hover:scale-105"
            >
              Trust & Security Center <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Legal & Links Bar */}
          <div className="pt-6 border-t border-white/20 flex flex-col lg:flex-row justify-between items-center lg:items-start gap-6 text-xs text-sky-100">
            
            {/* Legal Disclaimer & Registered Address */}
            <div className="flex flex-col gap-1 text-center lg:text-left text-[11px] leading-relaxed max-w-xl opacity-90">
              <p className="text-white font-medium">© {new Date().getFullYear()} Biztribe Trading & Consultancy India Private Limited. All rights reserved.</p>
              <p className="text-sky-100/80">"Fractional Sales Partner" is a registered brand of Biztribe Trading & Consultancy India Private Limited.</p>
              <p className="mt-0.5 text-sky-100/70">B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune – 411 045, Maharashtra, India</p>
              <p className="text-sky-100/70">Email: sales@fractionalsalespartner.com | CIN: U62020PN2026PTC251766</p>
            </div>

            {/* Legal Navigation Links */}
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-x-6 gap-y-2 text-xs uppercase tracking-wider font-semibold">
              <button
                onClick={() => setIsSecurityModalOpen(true)}
                className="hover:text-white text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Trust & Security
              </button>
              <Link href="/legal/terms" className="hover:text-white text-sky-100 transition-colors">Terms & Conditions</Link>
              <Link href="/legal/privacy" className="hover:text-white text-sky-100 transition-colors">Privacy Policy</Link>
              <Link href="/legal/refund" className="hover:text-white text-sky-100 transition-colors">Refund & Cancellation</Link>
              <Link href="/legal/contact" className="hover:text-white text-sky-100 transition-colors">Contact Us</Link>
            </div>

          </div>

        </div>
      </footer>

      {/* Security Trust Architecture Modal */}
      <SecurityTrustModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </>
  );
}
