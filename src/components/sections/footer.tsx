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
import { Twitter, Linkedin, Instagram, Facebook, ShieldCheck, Lock, Fingerprint, ChevronRight } from "lucide-react";
import Link from "next/link";
import { SecurityTrustModal } from "@/components/SecurityTrustModal";

export function Footer() {
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#121212] text-white pt-14 pb-10 border-t border-white/10 font-sans">
        <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
          
          {/* Main Footer Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 pb-10 border-b border-white/10">

            {/* Brand Logo & Tagline */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-lg">
              <Link href="/">
                <span className="font-serif font-bold text-2xl md:text-3xl tracking-tight text-white hover:text-amber-400 transition-colors">
                  Fractional Sales Partner
                </span>
              </Link>
              <p className="text-white/60 text-xs md:text-sm mt-3 leading-relaxed">
                Empowering MSMEs from emerging markets to scale globally through verified fractional sales expertise.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Twitter" className="p-2.5 border border-white/15 rounded-full hover:bg-white hover:text-[#121212] transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2.5 border border-white/15 rounded-full hover:bg-white hover:text-[#121212] transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="p-2.5 border border-white/15 rounded-full hover:bg-white hover:text-[#121212] transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="p-2.5 border border-white/15 rounded-full hover:bg-white hover:text-[#121212] transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Highlighted Trust & Security Banner */}
          <div className="my-8 p-4 md:p-5 bg-gradient-to-r from-amber-500/10 via-white/5 to-emerald-500/10 border border-amber-400/20 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6 shadow-inner">
            
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="p-3 bg-amber-400/20 text-amber-400 rounded-xl border border-amber-400/30 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full">
                    Platform Security Architecture
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-white mt-1">
                  Enterprise-Grade Protection & Anti-Fraud Shield
                </h4>
              </div>
            </div>

            {/* 3 Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-[11px] text-white/80">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Cloudflare WAF</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                <span>Device Fingerprint (Max 3)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit TLS HSTS</span>
              </div>
            </div>

            {/* Modal Trigger Action */}
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer flex-shrink-0"
            >
              Trust & Security Center <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Legal & Links Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center lg:items-start gap-6 text-xs text-white/50">
            
            {/* Legal Disclaimer & Registered Address */}
            <div className="flex flex-col gap-1 text-center lg:text-left text-[11px] leading-relaxed max-w-xl opacity-75">
              <p className="text-white/80 font-medium">© {new Date().getFullYear()} Biztribe Trading & Consultancy India Private Limited. All rights reserved.</p>
              <p className="text-white/50">"Fractional Sales Partner" is a registered brand of Biztribe Trading & Consultancy India Private Limited.</p>
              <p className="mt-0.5 text-white/40">B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune – 411 045, Maharashtra, India</p>
              <p className="text-white/40">Email: sales@fractionalsalespartner.com | CIN: U62020PN2026PTC251766</p>
            </div>

            {/* Legal Navigation Links */}
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-x-6 gap-y-2 text-xs uppercase tracking-wider font-semibold">
              <button
                onClick={() => setIsSecurityModalOpen(true)}
                className="hover:text-amber-400 text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Trust & Security
              </button>
              <Link href="/legal/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/legal/refund" className="hover:text-white transition-colors">Refund & Cancellation</Link>
              <Link href="/legal/contact" className="hover:text-white transition-colors">Contact Us</Link>
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
