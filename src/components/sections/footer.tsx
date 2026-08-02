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

import React from "react";
import { Twitter, Linkedin, Instagram, Facebook, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#075985] via-[#0284c7] to-[#0369a1] text-white pt-12 pb-8 border-t border-sky-400/30 font-sans shadow-2xl">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        
        {/* Top Footer Header Row: Brand Logo & Tagline + Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 pb-8 border-b border-white/20">

          {/* Brand Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-lg">
            <Link href="/">
              <span className="font-serif font-bold text-2xl md:text-3xl tracking-tight text-white hover:text-sky-200 transition-colors">
                Fractional Sales Partner
              </span>
            </Link>
            <p className="text-sky-100/90 text-xs md:text-sm mt-2 leading-relaxed font-medium">
              Empowering MSMEs from emerging markets to scale globally through verified fractional sales expertise.
            </p>
          </div>

          {/* Social Icons (Twitter, LinkedIn, Instagram, Facebook) */}
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

        {/* Bottom Section: Legal Disclaimer & Perfectly Aligned 4-Link Bar */}
        <div className="pt-6 flex flex-col lg:flex-row justify-between items-center lg:items-center gap-6 text-xs text-sky-100">
          
          {/* Legal Disclaimer & Registered Address */}
          <div className="flex flex-col gap-0.5 text-center lg:text-left text-[11px] leading-relaxed max-w-xl opacity-90">
            <p className="text-white font-medium">© {new Date().getFullYear()} Biztribe Trading & Consultancy India Private Limited. All rights reserved.</p>
            <p className="text-sky-100/80">"Fractional Sales Partner" is a registered brand of Biztribe Trading & Consultancy India Private Limited.</p>
            <p className="text-sky-100/70">B-1001, Kapil Akhila, Pancard Club Road, Baner, Pune – 411 045, Maharashtra, India</p>
            <p className="text-sky-100/70">Email: sales@fractionalsalespartner.com | CIN: U62020PN2026PTC251766</p>
          </div>

          {/* Perfectly Aligned 4 Legal Navigation Links */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-5 sm:gap-x-6 gap-y-2 text-xs uppercase tracking-wider font-semibold">
            <Link
              href="/security"
              className="hover:text-white text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Trust & Security</span>
            </Link>
            <span className="text-white/30 hidden sm:inline">•</span>
            <Link href="/legal/terms" className="hover:text-white text-sky-100 transition-colors whitespace-nowrap">Terms & Conditions</Link>
            <span className="text-white/30 hidden sm:inline">•</span>
            <Link href="/legal/privacy" className="hover:text-white text-sky-100 transition-colors whitespace-nowrap">Privacy Policy</Link>
            <span className="text-white/30 hidden sm:inline">•</span>
            <Link href="/legal/refund" className="hover:text-white text-sky-100 transition-colors whitespace-nowrap">Refund & Cancellation</Link>
          </div>

        </div>

      </div>
    </footer>
  );
}
