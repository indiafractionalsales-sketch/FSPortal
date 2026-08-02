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

import React, { useEffect } from "react";
import { ShieldCheck, Lock, Fingerprint, FileText, CheckCircle2, X, ExternalLink, ShieldAlert, Zap, AlertTriangle, Globe, Database, KeyRound } from "lucide-react";
import Link from "next/link";

interface SecurityTrustModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecurityTrustModal({ isOpen, onClose }: SecurityTrustModalProps) {
  // Prevent background scrolling when modal is open
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-900/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-sky-100 overflow-hidden my-auto max-h-[88vh] flex flex-col z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fresh Trustworthy Blue */}
        <div className="bg-gradient-to-r from-[#075985] via-[#0284c7] to-[#0369a1] p-5 sm:p-6 text-white relative flex-shrink-0 shadow-md">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 pr-10">
            <div className="p-3 bg-white text-[#0284c7] rounded-xl shadow-lg flex-shrink-0">
              <ShieldCheck className="w-8 h-8 text-[#0284c7]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-mono tracking-widest uppercase bg-white/20 text-white border border-white/30 px-2.5 py-0.5 rounded-full font-bold">
                  Verified Security Architecture
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-sans bg-emerald-400/20 text-emerald-100 border border-emerald-300/30 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Systems Fully Protected
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1 leading-tight">
                Threat Mitigation & Security Architecture
              </h2>
              <p className="text-xs text-sky-100 font-sans mt-0.5">
                Visual threat analysis detailing Cloudflare Edge, Firebase Rules, and Anti-Fraud implementations.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 sm:p-6 md:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar bg-slate-50">
          
          {/* Top Security Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-sky-100 shadow-sm">
            <div className="text-center p-2">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Edge Protection</p>
              <p className="text-xs sm:text-sm font-bold text-[#0284c7] mt-0.5 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cloudflare WAF
              </p>
            </div>
            <div className="text-center p-2 border-l border-slate-100">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Database Rules</p>
              <p className="text-xs sm:text-sm font-bold text-[#0284c7] mt-0.5 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Firebase Rules
              </p>
            </div>
            <div className="text-center p-2 border-l border-slate-100">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Anti-Fraud Capping</p>
              <p className="text-xs sm:text-sm font-bold text-purple-700 mt-0.5">Max 3 / Device</p>
            </div>
            <div className="text-center p-2 border-l border-slate-100">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Privacy Compliance</p>
              <p className="text-xs sm:text-sm font-bold text-emerald-700 mt-0.5">DPDPA 2023 & IT Act</p>
            </div>
          </div>

          {/* Security Threat vs Solution Cards */}
          <div className="space-y-6">
            
            {/* Card 1: Cloudflare Edge Defense */}
            <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-sky-50 text-[#0284c7] rounded-lg">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">1. Edge Protection & Bot Mitigation</h3>
                    <p className="text-[11px] text-slate-500">Cloudflare Anycast WAF Proxy • DDoS Shield</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                  ACTIVE EDGE SHIELD
                </span>
              </div>

              {/* Threat vs Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-rose-50/80 border border-rose-200/60 rounded-xl">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Potential Threat Vector:</span>
                  </div>
                  <p className="text-rose-900 text-[11px] leading-relaxed font-medium">
                    Automated scraper bots, DDoS traffic floods, and malicious SQL/Script injection probes targeting origin database servers.
                  </p>
                </div>
                <div className="p-3.5 bg-sky-50/90 border border-sky-200/80 rounded-xl">
                  <div className="flex items-center gap-1.5 text-[#0369a1] font-bold mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0284c7]" />
                    <span>Implemented Solution:</span>
                  </div>
                  <p className="text-slate-800 text-[11px] leading-relaxed font-medium">
                    Cloudflare Edge Proxy intercepts packets globally, executing Bot Fight Mode, HSTS 256-Bit SSL, and rate-limiting before traffic reaches backend code.
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 font-sans pt-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Bot Fight Mode Active</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> HSTS 256-Bit Forced HTTPS</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Automatic Email Obfuscation</li>
              </ul>
            </div>

            {/* Card 2: Firebase Built-in Security Rules & Auth JWT */}
            <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">2. Firebase Security Rules & Auth Tokens</h3>
                    <p className="text-[11px] text-slate-500">Firebase Firestore Rules • Cryptographic JWT Verification</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                  FIREBASE ENFORCED
                </span>
              </div>

              {/* Threat vs Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-rose-50/80 border border-rose-200/60 rounded-xl">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Potential Threat Vector:</span>
                  </div>
                  <p className="text-rose-900 text-[11px] leading-relaxed font-medium">
                    Unauthenticated database reads/writes, forged user IDs, or direct database tampering bypassing application UI controls.
                  </p>
                </div>
                <div className="p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-xl">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Implemented Solution:</span>
                  </div>
                  <p className="text-slate-800 text-[11px] leading-relaxed font-medium">
                    Declarative `firestore.rules` validate cryptographic Firebase Auth JWT tokens (`request.auth.uid == userId`), ensuring zero unauthorized data access.
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 font-sans pt-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Firestore Security Rules</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Cryptographic Auth Tokens</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Multi-Region Data Segregation</li>
              </ul>
            </div>

            {/* Card 3: Anti-Fraud Device Hashing */}
            <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">3. Anti-Fraud & Multi-Account Capping</h3>
                    <p className="text-[11px] text-slate-500">Persistent FingerprintJS Visitor Hashing • Max 3 Capping</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full">
                  ENFORCED (MAX 3)
                </span>
              </div>

              {/* Threat vs Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-rose-50/80 border border-rose-200/60 rounded-xl">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Potential Threat Vector:</span>
                  </div>
                  <p className="text-rose-900 text-[11px] leading-relaxed font-medium">
                    Malicious actors creating 10+ fake ghost accounts from a single physical device to spam deal feeds or submit fraudulent posts.
                  </p>
                </div>
                <div className="p-3.5 bg-purple-50/90 border border-purple-200/80 rounded-xl">
                  <div className="flex items-center gap-1.5 text-purple-800 font-bold mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Implemented Solution:</span>
                  </div>
                  <p className="text-slate-800 text-[11px] leading-relaxed font-medium">
                    Hardware canvas & component visitor hashing (`visitorId`) strictly caps registrations to Max 3 accounts per physical device, throwing HTTP 403 blocks on 4th attempts.
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 font-sans pt-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Max 3 Accounts / Device Cap</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Canvas & Hardware Telemetry</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Automatic HTTP 403 Denial</li>
              </ul>
            </div>

            {/* Card 4: Network Telemetry & Audit Logs */}
            <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">4. Network Telemetry & Audit Logging</h3>
                    <p className="text-[11px] text-slate-500">Real-time IP Extraction • Dedicated Firestore Audit Trail</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                  IMMUTABLE LOGS
                </span>
              </div>

              {/* Threat vs Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-rose-50/80 border border-rose-200/60 rounded-xl">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Potential Threat Vector:</span>
                  </div>
                  <p className="text-rose-900 text-[11px] leading-relaxed font-medium">
                    Anonymous IP spoofing, fraudulent deal submissions via hidden VPN proxies, and unverified transactional activity with zero legal trail.
                  </p>
                </div>
                <div className="p-3.5 bg-blue-50/90 border border-blue-200/80 rounded-xl">
                  <div className="flex items-center gap-1.5 text-blue-800 font-bold mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Implemented Solution:</span>
                  </div>
                  <p className="text-slate-800 text-[11px] leading-relaxed font-medium">
                    Server-side telemetry captures real-time IP, country, city, user-agent, and proxy headers into an isolated, immutable `AuditLogs` Firestore collection.
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 font-sans pt-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> IP & Geolocation Telemetry</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> VPN / Proxy Detection</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Immutable `AuditLogs` Storage</li>
              </ul>
            </div>

            {/* Card 5: DPDPA 2023 & Regulatory Compliance */}
            <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">5. Regulatory & Data Privacy Compliance</h3>
                    <p className="text-[11px] text-slate-500">Digital Personal Data Protection Act 2023 • IT Act 2000</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                  DPDPA 2023 COMPLIANT
                </span>
              </div>

              {/* Threat vs Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-rose-50/80 border border-rose-200/60 rounded-xl">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Potential Threat Vector:</span>
                  </div>
                  <p className="text-rose-900 text-[11px] leading-relaxed font-medium">
                    Over-intrusive data harvesting, unauthorized permission prompts (microphone/precise GPS), and data processing lacking explicit legal mandates.
                  </p>
                </div>
                <div className="p-3.5 bg-emerald-50/90 border border-emerald-200/80 rounded-xl">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Implemented Solution:</span>
                  </div>
                  <p className="text-slate-800 text-[11px] leading-relaxed font-medium">
                    Telemetry operates strictly under Section 4 Legitimate Interests of DPDPA 2023 for platform integrity, with zero intrusive device permissions requested.
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 font-sans pt-1">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Zero Intrusive Permissions</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Section 4 Legitimate Interest</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> Indian IT Act 2000 Aligned</li>
              </ul>
            </div>

          </div>

          {/* Legal Guarantee Banner */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs shadow-md">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-sky-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-white">Biztribe Legal & Security Blueprint Guarantee</p>
                <p className="text-slate-300 text-[11px]">
                  All platform security mechanisms operate under verified architectural blueprints to defend legitimate MSMEs and Sales Partners.
                </p>
              </div>
            </div>
            <Link
              href="/legal/privacy"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors flex-shrink-0 shadow-sm"
            >
              Read Privacy Policy <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <p className="text-[11px] text-slate-500 font-mono">
            Security Version 1.0.0 • Verified Trust Active
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#075985] hover:bg-[#0369a1] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Close Security Center
          </button>
        </div>

      </div>
    </div>
  );
}
