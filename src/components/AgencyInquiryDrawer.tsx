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
import { X, Send, ShieldCheck, CheckCircle2, Building2, MapPin, Globe, Sparkles } from "lucide-react";
import { MarketplaceAgency } from "@/lib/marketplace-data";

interface AgencyInquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agency: MarketplaceAgency | null;
  userEmail?: string;
  userName?: string;
}

export default function AgencyInquiryDrawer({
  isOpen,
  onClose,
  agency,
  userEmail = "",
  userName = ""
}: AgencyInquiryDrawerProps) {
  const [targetCountry, setTargetCountry] = useState("");
  const [budgetRange, setBudgetRange] = useState("$1,000 - $5,000");
  const [timeline, setTimeline] = useState("Immediate (< 2 weeks)");
  const [projectDetails, setProjectDetails] = useState("");
  const [contactMethod, setContactMethod] = useState<"email" | "whatsapp" | "portal">("portal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !agency) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 900);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setProjectDetails("");
    setTargetCountry("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end transition-opacity duration-300">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${agency.logoBg} flex items-center justify-center text-white font-bold shadow-sm`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-gray-900 leading-tight">{agency.name}</h3>
                {agency.isVerified && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-headline font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-sky-600" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-headline flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-gray-400" /> {agency.location}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">

          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-serif font-bold text-xl text-gray-900">Inquiry Sent Successfully!</h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Your request has been directly dispatched to <strong>{agency.name}</strong>. Their business team typically responds within <strong>{agency.stats.avgResponse}</strong>.
              </p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left text-xs space-y-1.5">
                <p className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500">Inquiry Summary</p>
                <p><span className="text-gray-500">Target Region:</span> {targetCountry || agency.location}</p>
                <p><span className="text-gray-500">Estimated Budget:</span> {budgetRange}</p>
                <p><span className="text-gray-500">Response Portal:</span> In-App Fractional Partner Messaging</p>
              </div>
              <button
                onClick={handleResetAndClose}
                className="w-full py-2.5 bg-[#701010] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#580d0d] transition-all"
              >
                Done & Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Agency Quick Snapshot */}
              <div className="bg-[#701010]/3 border border-[#701010]/15 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-[#701010] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#701010]" /> {agency.tag}
                  </span>
                  <span className="text-xs font-serif font-bold text-gray-800">⭐ {agency.rating} ({agency.reviewCount})</span>
                </div>
                <p className="text-xs text-gray-700 font-sans leading-relaxed">{agency.tagline}</p>
              </div>

              {/* Form Input: Target Location */}
              <div className="space-y-1.5">
                <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                  Target Country / Region of Operation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United Kingdom, Singapore, GCC, Global"
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
                />
              </div>

              {/* Budget & Timeline Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                    Est. Monthly Budget
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
                  >
                    <option value="Under $1,000">Under $1,000</option>
                    <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                    <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                    <option value="$15,000+">$15,000+</option>
                    <option value="To Be Discussed">To Be Discussed</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                    Project Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
                  >
                    <option value="Immediate (< 2 weeks)">Immediate (&lt; 2 weeks)</option>
                    <option value="Within 1 Month">Within 1 Month</option>
                    <option value="1 - 3 Months">1 - 3 Months</option>
                    <option value="Planning Phase">Planning Phase</option>
                  </select>
                </div>
              </div>

              {/* Requirement Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                  Requirement Details & Project Scope *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your business objective, scope of work needed, product/industry domain, or key questions for this agency..."
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all custom-scrollbar resize-none"
                />
              </div>

              {/* Preferred Communication Channel */}
              <div className="space-y-2">
                <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setContactMethod("portal")}
                    className={`py-2 px-2 text-[10px] font-headline font-bold uppercase tracking-wider rounded-lg border transition-all ${
                      contactMethod === "portal"
                        ? "bg-[#701010] text-white border-[#701010]"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    In-App Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactMethod("email")}
                    className={`py-2 px-2 text-[10px] font-headline font-bold uppercase tracking-wider rounded-lg border transition-all ${
                      contactMethod === "email"
                        ? "bg-[#701010] text-white border-[#701010]"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Direct Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactMethod("whatsapp")}
                    className={`py-2 px-2 text-[10px] font-headline font-bold uppercase tracking-wider rounded-lg border transition-all ${
                      contactMethod === "whatsapp"
                        ? "bg-[#701010] text-white border-[#701010]"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    WhatsApp / Phone
                  </button>
                </div>
              </div>

              {/* Action */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#701010] hover:bg-[#580d0d] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Proposal Inquiry
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
          <p className="text-[10px] font-headline text-gray-400 uppercase tracking-widest">
            Protected by Fractional Partner Trust & Security Standard
          </p>
        </div>

      </div>
    </div>
  );
}
