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
import { ShieldCheck, Clock, CheckCircle2, AlertCircle, Send, Sparkles, Building, FileText } from "lucide-react";
import { auth } from "@/lib/firebase";

interface BusinessVerificationWidgetProps {
  userRole?: string;
  isVerified?: boolean;
  verificationStatus?: string;
  verifiedBadge?: string;
  currentGstin?: string;
  onSuccess?: (verificationSummary?: {
    legalName: string;
    tradeName?: string;
    gstin?: string;
    state?: string;
    city?: string;
  }) => void;
}

export default function BusinessVerificationWidget({
  userRole = "sp",
  isVerified = false,
  verificationStatus = "",
  verifiedBadge = "",
  currentGstin = "",
  onSuccess
}: BusinessVerificationWidgetProps) {
  const [activeTab, setActiveTab] = useState<"auto_gst" | "manual_admin">("auto_gst");
  const [gstin, setGstin] = useState(currentGstin);
  const [businessName, setBusinessName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [notes, setNotes] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAutoVerifyGST = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Please log in to verify GSTIN.");

      const idToken = await currentUser.getIdToken();
      const res = await fetch("/api/verification/verify-gst", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          uid: currentUser.uid,
          gstin,
          role: userRole
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "GST Verification failed.");

      const summary = data.verification?.summary || {};
      setSuccessMessage(`GSTIN Verified Successfully! Legal Name: ${summary.legalName || gstin}`);
      if (onSuccess) {
        onSuccess({
          legalName: summary.legalName || "",
          tradeName: summary.tradeName || summary.legalName || "",
          gstin: gstin.toUpperCase(),
          state: summary.state || "",
          city: summary.city || ""
        });
      }
    } catch (err: any) {
      setErrorMessage(`${err.message || "Failed to verify GSTIN."} Switched to manual entry so you can enter company name for Admin approval.`);
      setActiveTab("manual_admin");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Please log in to submit verification.");

      const idToken = await currentUser.getIdToken();
      const res = await fetch("/api/verification/manual-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          uid: currentUser.uid,
          role: userRole,
          businessName,
          panNumber,
          notes
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Manual submission failed.");

      setSuccessMessage("Business verification request queued for Admin Approval!");
      if (onSuccess) {
        onSuccess({
          legalName: businessName,
          tradeName: businessName,
          gstin: "",
          state: "",
          city: ""
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit manual verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
      
      {/* Header & Current Status */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#701010]" />
          <h3 className="font-serif font-bold text-base text-gray-900">Business KYC Verification</h3>
        </div>

        {isVerified ? (
          <span className="inline-flex items-center gap-1 text-xs font-headline font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {verifiedBadge || "GST Verified 🛡️"}
          </span>
        ) : verificationStatus === "pending_admin_approval" ? (
          <span className="inline-flex items-center gap-1 text-xs font-headline font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Admin Approval ⏳
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-headline font-bold text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3.5 h-3.5 text-gray-400" /> Unverified
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-xl border border-gray-150">
        <button
          type="button"
          onClick={() => setActiveTab("auto_gst")}
          className={`py-2 text-xs font-headline font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "auto_gst"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Auto-Verify GSTIN
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("manual_admin")}
          className={`py-2 text-xs font-headline font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "manual_admin"
              ? "bg-[#701010] text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Manual Entry (Non-GST)
        </button>
      </div>

      {/* Feedback Alert Messages */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tab 1: Auto GST Verification */}
      {activeTab === "auto_gst" ? (
        <form onSubmit={handleAutoVerifyGST} className="space-y-3.5">
          <p className="text-xs text-gray-500 font-sans leading-relaxed">
            Enter your 15-digit Indian GSTIN for instant real-time API verification and auto-approval.
          </p>

          <div className="space-y-1">
            <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
              15-Digit GSTIN Number *
            </label>
            <input
              type="text"
              required
              maxLength={15}
              placeholder="e.g. 27AAAAA0000A1Z5"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 uppercase tracking-wider focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || gstin.length < 15}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" /> Verify GST & Auto-Approve
              </>
            )}
          </button>
        </form>
      ) : (
        /* Tab 2: Manual Non-GST Submission */
        <form onSubmit={handleManualSubmit} className="space-y-3.5">
          <p className="text-xs text-gray-500 font-sans leading-relaxed">
            Exempt or below turnover threshold? Submit manual details for <strong>Admin Review</strong>.
          </p>

          <div className="space-y-1">
            <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
              Business Legal Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Biztribe Trading & Consultancy"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
              PAN Number (Optional)
            </label>
            <input
              type="text"
              maxLength={10}
              placeholder="e.g. ABCDE1234F"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono uppercase tracking-wider text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
              Notes / Registration Proof Details
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Udyam MSME number, Shop & Establishment license, or reason for GST exemption..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !businessName}
            className="w-full py-2.5 bg-[#701010] hover:bg-[#580d0d] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit for Admin Approval
              </>
            )}
          </button>
        </form>
      )}

    </div>
  );
}
