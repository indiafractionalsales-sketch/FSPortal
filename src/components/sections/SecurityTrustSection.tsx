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
import { ShieldCheck, Lock, Fingerprint, ChevronRight, Award } from "lucide-react";
import Link from "next/link";

// Official Cloudflare Vector Brand Icon Component
function CloudflareLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.48 10.74c-.38 0-.74.07-1.07.19a4.84 4.84 0 0 0-9.21.6 3.6 3.6 0 0 0-2.6 3.47c0 2 1.62 3.6 3.6 3.6h9.28c2.2 0 4-1.78 4-4a4 4 0 0 0-4-3.86z" fill="#F38020" />
      <path d="M19.4 12.6a4.002 4.002 0 0 0-3.92-3.86c-.38 0-.74.07-1.07.19a4.84 4.84 0 0 0-9.21.6 3.6 3.6 0 0 0-2.6 3.47c0 2 1.62 3.6 3.6 3.6h9.28c2.2 0 4-1.78 4-4z" opacity="0.9" fill="#F38020" />
    </svg>
  );
}

export function SecurityTrustSection() {
  return (
    <section className="w-full bg-[#f8fafc] py-10 border-t border-slate-200 font-sans">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        
        {/* Light, Cool, Smart Security Trust Panel */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-sky-50/90 via-blue-50/80 to-indigo-50/90 border border-sky-200/80 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md hover:shadow-lg transition-all text-slate-900">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="p-3.5 bg-white text-[#0284c7] rounded-2xl shadow-sm border border-sky-100 flex-shrink-0">
              <Award className="w-7 h-7 text-[#0284c7]" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#0369a1] bg-sky-100/90 px-2.5 py-0.5 rounded-full border border-sky-200 shadow-2xs">
                  Verified Security Architecture
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                Protected by Cloudflare Edge & Anti-Fraud Shield
              </h3>
            </div>
          </div>

          {/* 3 Light Micro Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-800">
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-sky-200/80 shadow-xs font-semibold">
              <CloudflareLogo className="w-4 h-4" />
              <span>Protected by Cloudflare</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-purple-200/80 shadow-xs font-semibold text-purple-900">
              <Fingerprint className="w-4 h-4 text-purple-600" />
              <span>Anti-Fraud (Max 3)</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-amber-200/80 shadow-xs font-semibold text-amber-900">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>256-Bit TLS HSTS</span>
            </div>
          </div>

          {/* Direct Link to /security */}
          <Link
            href="/security"
            className="px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer flex-shrink-0 hover:scale-105"
          >
            Trust & Security Center <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
