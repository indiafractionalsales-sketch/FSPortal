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
import { FileText, CheckCircle2, ShieldCheck, X, AlertTriangle } from "lucide-react";
import { getSPServiceAgreementDetails, SPServiceAgreementData } from "@/lib/sp-service-agreement-template";

interface SPServiceAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  agreementData: SPServiceAgreementData;
  isSaving?: boolean;
}

export function SPServiceAgreementModal({
  isOpen,
  onClose,
  onAccept,
  agreementData,
  isSaving = false,
}: SPServiceAgreementModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  const agreement = getSPServiceAgreementDetails(agreementData);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#701010] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileText className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg leading-tight">
                Sales Partner Representation &amp; Event Listing Service Agreement
              </h2>
              <p className="text-[11px] text-amber-100/90 font-mono mt-0.5">
                Ref: {agreement.refNo} | Biztribe Trading &amp; Consultancy India Pvt Ltd
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-gray-700 font-sans leading-relaxed">
          {/* Header Summary Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Issuing Entity</span>
              <p className="font-semibold text-gray-900">{agreement.company.name}</p>
              <p className="text-xs text-gray-600">Brand: {agreement.company.brand} ({agreement.company.website})</p>
              <p className="text-xs text-gray-500 mt-1">{agreement.company.address}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Sales Partner (Host)</span>
              <p className="font-semibold text-gray-900">{agreement.partner.name}</p>
              <p className="text-xs text-gray-600">{agreement.partner.email}</p>
              <p className="text-xs text-gray-600 mt-1">Event: {agreement.event.name}</p>
            </div>
          </div>

          {/* Key Obligations Highlight Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-950 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-amber-900">Key Sales Partner Obligations &amp; Payout Criteria:</p>
              <ul className="list-disc pl-4 space-y-1 text-amber-900 font-medium">
                <li>Up to 25% platform facilitation &amp; escrow fee deduction on gross package charges.</li>
                <li>Mandatory GPS app check-in at venue on time + 2-hour minimum live stream to client.</li>
                <li>Social media updates/clips posted every 2 hours during event operation.</li>
                <li>Commuting &amp; travel charges are covered under representation fees and settled within 7 days post-event audit.</li>
                <li>All leads captured belong exclusively to Biztribe. Zero tolerance for theft, racial abuse, or defamation.</li>
              </ul>
            </div>
          </div>

          {/* Legal Clauses List */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="font-serif font-bold text-base text-gray-900">Terms and Conditions</h3>
            {agreement.legalSections.map((section, idx) => (
              <div key={idx} className="space-y-1 bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                <h4 className="font-bold text-xs text-[#701010] uppercase tracking-wider">{section.heading}</h4>
                <p className="text-xs text-gray-700 leading-relaxed text-justify whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Electronic Stamp Disclaimer */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 text-green-900">
            <ShieldCheck className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Digital Contract Execution (Section 10A Information Technology Act, 2000)</p>
              <p className="text-green-800 leading-normal">
                By checking the confirmation box below and submitting your post, this agreement is electronically executed between yourself and Biztribe Trading &amp; Consultancy India Private Limited. A copy of this agreement is legally bound to your post listing reference ({agreement.refNo}).
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-900 select-none">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              disabled={isSaving}
              className="w-4 h-4 text-[#701010] rounded border-gray-300 focus:ring-[#701010] cursor-pointer"
            />
            <span>I have read, understood, and agree to legally bind myself to the Sales Partner Service Agreement.</span>
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-headline uppercase tracking-wider disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="px-5 py-2 text-xs font-bold text-white bg-[#701010] hover:bg-[#5a0c0c] rounded-lg transition-colors shadow-sm font-headline uppercase tracking-wider flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-200" />
              I Understand &amp; Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
