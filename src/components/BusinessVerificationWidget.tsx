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
import { ShieldCheck, Clock, AlertCircle, Sparkles, FileText, RefreshCw } from "lucide-react";
import { auth } from "@/lib/firebase";

interface BusinessVerificationWidgetProps {
  userRole?: string;
  isVerified?: boolean;
  verificationStatus?: string;
  verifiedBadge?: string;
  currentGstin?: string;
  mode?: "auto_gst" | "manual_admin";
  onModeChange?: (mode: "auto_gst" | "manual_admin") => void;
  onSuccess?: (verificationSummary?: {
    legalName: string;
    tradeName?: string;
    gstin?: string;
    state?: string;
    city?: string;
    services?: string;
    fullAddress?: string;
  }) => void;
  onReset?: () => void;
}

export default function BusinessVerificationWidget({
  userRole = "sp",
  isVerified = false,
  verificationStatus = "",
  verifiedBadge = "",
  currentGstin = "",
  mode = "auto_gst",
  onModeChange,
  onSuccess,
  onReset
}: BusinessVerificationWidgetProps) {
  const [gstin, setGstin] = useState(currentGstin);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAutoVerifyGST = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

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
      if (onSuccess) {
        onSuccess({
          legalName: summary.legalName || "",
          tradeName: summary.tradeName || summary.legalName || "",
          gstin: gstin.toUpperCase(),
          state: summary.state || "",
          city: summary.city || "",
          services: summary.services || "",
          fullAddress: summary.fullAddress || ""
        });
      }
    } catch (err: any) {
      setErrorMessage(`${err.message || "GSTIN lookup failed."} Switched to manual entry mode.`);
      if (onModeChange) onModeChange("manual_admin");
    } finally {
      setLoading(false);
    }
  };

  // State 1: Verified state - Clean Blue Shield Badge, zero input clutter
  if (isVerified) {
    return (
      <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-gray-900">GST Verification Complete</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                {verifiedBadge || "GST Verified 🛡️"}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-0.5">GSTIN: {gstin || currentGstin || "Verified"}</p>
          </div>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-gray-500 hover:text-blue-600 flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-verify
          </button>
        )}
      </div>
    );
  }

  // State 2: Unverified state - Toggle switch & input
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-4">
      
      {/* Header & Toggle Switch */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h3 className="font-serif font-bold text-base text-gray-900">Business Verification</h3>
        </div>

        {/* Toggle Control Switch */}
        <div className="flex items-center p-1 bg-gray-100/90 rounded-xl border border-gray-200/60">
          <button
            type="button"
            onClick={() => onModeChange && onModeChange("auto_gst")}
            className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              mode === "auto_gst"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Auto GST
          </button>
          <button
            type="button"
            onClick={() => onModeChange && onModeChange("manual_admin")}
            className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              mode === "manual_admin"
                ? "bg-gray-800 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Manual Entry
          </button>
        </div>
      </div>

      {/* Error Callout if lookup failed */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span className="leading-snug">{errorMessage}</span>
        </div>
      )}

      {/* Mode 1: Auto GST Verification Input & Action */}
      {mode === "auto_gst" ? (
        <form onSubmit={handleAutoVerifyGST} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="block text-xs font-headline font-bold text-gray-800 uppercase tracking-wider">
              15-Digit GSTN Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={15}
              placeholder="e.g. 27AAAAA0000A1Z5"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 uppercase tracking-wider focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || gstin.length < 15}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
        /* Mode 2: Manual Entry Info Banner (No redundant input boxes or duplicate submit buttons) */
        <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-start gap-2 text-xs text-amber-800">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Manual Review Mode:</strong> Enter your company details below. Your verification will be queued for Admin Review upon clicking <strong>Continue</strong>.
          </span>
        </div>
      )}
    </div>
  );
}
