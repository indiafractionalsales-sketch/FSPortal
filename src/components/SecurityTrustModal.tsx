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
import { ShieldCheck, Lock, Fingerprint, FileText, CheckCircle2, X, ExternalLink, ShieldAlert, Zap } from "lucide-react";
import Link from "next/link";

interface SecurityTrustModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecurityTrustModal({ isOpen, onClose }: SecurityTrustModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#701010] via-[#500b0b] to-[#1a1a1a] p-6 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                  Platform Security Center
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-sans bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Systems Protected
                </span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                Trust & Security Architecture
              </h2>
              <p className="text-xs text-white/70 font-sans mt-0.5">
                Enterprise-grade multi-layer defense, device fingerprinting, and regulatory compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Top Security Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="text-center p-2">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Edge Protection</p>
              <p className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cloudflare WAF
              </p>
            </div>
            <div className="text-center p-2 border-l border-gray-200">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Account Cap Limit</p>
              <p className="text-sm font-bold text-[#701010] mt-0.5">Max 3 / Physical Device</p>
            </div>
            <div className="text-center p-2 border-l border-gray-200">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">SSL Encryption</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">256-Bit HSTS TLS</p>
            </div>
            <div className="text-center p-2 border-l border-gray-200">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Privacy Compliance</p>
              <p className="text-sm font-bold text-blue-600 mt-0.5">DPDPA 2023 & IT Act</p>
            </div>
          </div>

          {/* Security Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pillar 1 */}
            <div className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm hover:border-gray-200 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  ACTIVE EDGE SHIELD
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">1. Cloudflare Edge Defense</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                All network traffic is proxied via Cloudflare Anycast edge servers, mitigating DDoS attacks, scraping bots, and brute-force intrusions before hitting application servers.
              </p>
              <ul className="mt-3 space-y-1 text-[11px] text-gray-600 font-sans">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Bot Fight Mode & Automated Scraper Defense</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Strict Transport Security (HSTS) Forced HTTPS</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Automatic Email Address Obfuscation</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm hover:border-gray-200 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-[#701010]/10 text-[#701010] rounded-lg">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                  MAX 3 ACCOUNTS / DEVICE
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">2. Anti-Fraud Device Hashing</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Integrated with persistent client-side device fingerprinting (`visitorId`), enforcing a strict policy capping registrations to a maximum of 3 accounts per physical device.
              </p>
              <ul className="mt-3 space-y-1 text-[11px] text-gray-600 font-sans">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Multi-Account Spammer Capping (HTTP 403 Block)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Hardware & Canvas Component Hash Verification</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Background Identity Telemetry Check</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm hover:border-gray-200 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                  IMMUTABLE LOGS
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">3. Network Telemetry & Audit Logs</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Every login, onboarding action, and high-value transaction records immutable network telemetry into dedicated Firestore audit collections for legal accountability.
              </p>
              <ul className="mt-3 space-y-1 text-[11px] text-gray-600 font-sans">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> IP, Country, City & User-Agent Tracking</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Automatic VPN / Proxy Header Detection</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Isolated Audit Logs Timeline Collection</li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm hover:border-gray-200 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  DPDPA 2023 COMPLIANT
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">4. Privacy & Regulatory Compliance</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Platform telemetry operates strictly under Section 4 Legitimate Interests of the Digital Personal Data Protection Act 2023 & Information Technology Act 2000.
              </p>
              <ul className="mt-3 space-y-1 text-[11px] text-gray-600 font-sans">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Zero Intrusive Camera or Location Requests</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Explicit Legitimate Interest Security Mandate</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Transparent Legal Privacy Policy Alignment</li>
              </ul>
            </div>

          </div>

          {/* Legal Notice Bar */}
          <div className="p-4 bg-gray-900 text-white rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-gray-100">Biztribe Legal & Security Guarantee</p>
                <p className="text-gray-400 text-[11px]">
                  All platform anti-fraud mechanisms operate under official security blueprints to defend legitimate sales partners and MSMEs.
                </p>
              </div>
            </div>
            <Link
              href="/legal/privacy"
              onClick={onClose}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors flex-shrink-0"
            >
              Read Privacy Policy <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <p className="text-[11px] text-gray-500 font-mono">
            Security Version 1.0.0 • Cloudflare Edge Active
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close Security Center
          </button>
        </div>

      </div>
    </div>
  );
}
