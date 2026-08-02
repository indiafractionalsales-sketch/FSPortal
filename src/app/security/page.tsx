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
import Link from "next/link";
import { ShieldCheck, Lock, Fingerprint, FileText, CheckCircle2, ExternalLink, ShieldAlert, Zap, AlertTriangle, Globe, Database, KeyRound, ArrowLeft, Award, Shield } from "lucide-react";
import { Footer } from "@/components/sections/footer";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <header className="bg-gradient-to-r from-[#075985] via-[#0284c7] to-[#0369a1] text-white py-12 px-4 sm:px-8 border-b border-sky-400/30 shadow-lg">
        <div className="container mx-auto max-w-[1200px]">
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-emerald-400/20 text-emerald-100 border border-emerald-300/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              Systems Protected & Operational
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full font-bold mb-3 border border-white/20">
                Verified Security Architecture
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                Trust & Security Center
              </h1>
              <p className="text-sm sm:text-base text-sky-100 mt-3 leading-relaxed">
                A transparent, technical overview of how our platform defends MSMEs, Business Owners, and Sales Partners against threat vectors, fraud, and privacy violations.
              </p>
            </div>

            <div className="p-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl flex items-center gap-4 flex-shrink-0">
              <div className="p-3 bg-white text-[#0284c7] rounded-xl shadow-md">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Enterprise Grade</p>
                <p className="text-sm font-extrabold text-amber-300">256-Bit HSTS Secured</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto max-w-[1200px] px-4 sm:px-8 py-12 space-y-10">
        
        {/* Security Overview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
          <div className="p-3 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Edge Protection</p>
            <p className="text-sm sm:text-base font-extrabold text-[#0284c7] mt-1 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cloudflare WAF
            </p>
          </div>
          <div className="p-3 text-center border-l border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Database Access</p>
            <p className="text-sm sm:text-base font-extrabold text-[#0284c7] mt-1 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Declarative Rules
            </p>
          </div>
          <div className="p-3 text-center border-l border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Anti-Fraud Limit</p>
            <p className="text-sm sm:text-base font-extrabold text-purple-700 mt-1">
              Max 3 / Device
            </p>
          </div>
          <div className="p-3 text-center border-l border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Privacy Law</p>
            <p className="text-sm sm:text-base font-extrabold text-emerald-700 mt-1">
              DPDPA 2023 Act
            </p>
          </div>
        </div>

        {/* Threat vs Solution Section Title */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#0284c7] font-bold bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            5 Core Security Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Threat Vectors & Implemented Solutions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Comprehensive defense mechanisms engineered into every layer of our application stack.
          </p>
        </div>

        {/* 5 Security Cards */}
        <div className="space-y-6">

          {/* Card 1: Edge Proxy & DDoS Shield */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-50 text-[#0284c7] rounded-xl">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">1. Edge Protection & Bot Mitigation</h3>
                  <p className="text-xs text-slate-500">Cloudflare Anycast WAF Proxy • Automated Bot Shield</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-center">
                ACTIVE EDGE SHIELD
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-rose-50/80 border border-rose-200/60 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Potential Threat Vector:</span>
                </div>
                <p className="text-rose-900 leading-relaxed font-medium">
                  Automated scraper bots, DDoS traffic floods, and malicious SQL/Script injection probes targeting origin database servers to harvest contact information or crash application availability.
                </p>
              </div>

              <div className="p-4 bg-sky-50/90 border border-sky-200/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-[#0369a1] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#0284c7]" />
                  <span>Implemented Solution:</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Cloudflare Edge Proxy intercepts packets globally across 300+ Anycast locations, executing Bot Fight Mode, HSTS 256-Bit SSL, and rate-limiting before traffic reaches backend code.
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 font-sans pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Bot Fight Mode Active</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> HSTS 256-Bit Forced HTTPS</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Automatic Email Obfuscation</li>
            </ul>
          </div>

          {/* Card 2: Database Access Rules & Auth Tokens */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">2. Database Security Rules & Cryptographic Tokens</h3>
                  <p className="text-xs text-slate-500">Declarative Security Rules • Signed Auth Token Verification</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full self-start sm:self-center">
                DATABASE ENFORCED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-rose-50/80 border border-rose-200/60 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Potential Threat Vector:</span>
                </div>
                <p className="text-rose-900 leading-relaxed font-medium">
                  Unauthenticated database reads/writes, forged user identity parameters, or direct database tampering attempting to bypass application UI controls or read private deal information.
                </p>
              </div>

              <div className="p-4 bg-amber-50/90 border border-amber-200/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Implemented Solution:</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Server-side declarative security rules validate cryptographically signed auth tokens (`request.auth.uid == userId`) on every query, ensuring zero unauthorized data access.
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 font-sans pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Database Access Control Rules</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Cryptographic Auth Tokens</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Multi-Region Data Isolation</li>
            </ul>
          </div>

          {/* Card 3: Anti-Fraud & Multi-Account Capping */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">3. Anti-Fraud & Multi-Account Capping</h3>
                  <p className="text-xs text-slate-500">Persistent FingerprintJS Visitor Hashing • Max 3 Capping</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full self-start sm:self-center">
                ENFORCED (MAX 3)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-rose-50/80 border border-rose-200/60 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Potential Threat Vector:</span>
                </div>
                <p className="text-rose-900 leading-relaxed font-medium">
                  Malicious actors creating 10+ fake ghost accounts from a single physical device to spam deal feeds, manipulate pricing, or submit fraudulent post proposals.
                </p>
              </div>

              <div className="p-4 bg-purple-50/90 border border-purple-200/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-purple-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Implemented Solution:</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Hardware canvas & component visitor hashing (`visitorId`) strictly caps registrations to Max 3 accounts per physical device, automatically throwing HTTP 403 blocks on 4th attempts.
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 font-sans pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Max 3 Accounts / Device Cap</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Canvas & Hardware Telemetry</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Automatic HTTP 403 Denial</li>
            </ul>
          </div>

          {/* Card 4: Network Telemetry & Audit Logging */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">4. Network Telemetry & Audit Logging</h3>
                  <p className="text-xs text-slate-500">Real-time IP Extraction • Dedicated Audit Trail Storage</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full self-start sm:self-center">
                IMMUTABLE LOGS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-rose-50/80 border border-rose-200/60 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Potential Threat Vector:</span>
                </div>
                <p className="text-rose-900 leading-relaxed font-medium">
                  Anonymous IP spoofing, fraudulent deal submissions via hidden VPN proxies, and unverified transactional activity with zero legal trail for dispute resolution.
                </p>
              </div>

              <div className="p-4 bg-blue-50/90 border border-blue-200/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-blue-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Implemented Solution:</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Server-side telemetry captures real-time IP, country, city, user-agent, and proxy headers into an isolated, immutable `AuditLogs` database collection.
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 font-sans pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> IP & Geolocation Telemetry</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> VPN / Proxy Detection</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Immutable `AuditLogs` Storage</li>
            </ul>
          </div>

          {/* Card 5: Regulatory & Data Privacy Compliance */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">5. Regulatory & Data Privacy Compliance</h3>
                  <p className="text-xs text-slate-500">Digital Personal Data Protection Act 2023 • IT Act 2000</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-center">
                DPDPA 2023 COMPLIANT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-rose-50/80 border border-rose-200/60 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Potential Threat Vector:</span>
                </div>
                <p className="text-rose-900 leading-relaxed font-medium">
                  Over-intrusive data harvesting, unauthorized permission prompts (microphone/precise GPS), and data processing lacking explicit legal mandates under Indian privacy laws.
                </p>
              </div>

              <div className="p-4 bg-emerald-50/90 border border-emerald-200/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Implemented Solution:</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Telemetry operates strictly under Section 4 Legitimate Interests of DPDPA 2023 for platform integrity, with zero intrusive device permissions requested.
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 font-sans pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Zero Intrusive Permissions</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Section 4 Legitimate Interest</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Indian IT Act 2000 Aligned</li>
            </ul>
          </div>

        </div>

        {/* Legal Guarantee Banner */}
        <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <ShieldAlert className="w-8 h-8 text-sky-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-white text-base">Biztribe Legal & Security Blueprint Guarantee</p>
              <p className="text-slate-300 text-xs mt-0.5">
                All platform security mechanisms operate under verified architectural blueprints to defend legitimate MSMEs and Sales Partners.
              </p>
            </div>
          </div>
          <Link
            href="/legal/privacy"
            className="px-5 py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors flex-shrink-0 shadow-sm"
          >
            Read Privacy Policy <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
