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
import { FileText, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { getServiceAgreementDetails, ServiceAgreementData } from "@/lib/service-agreement-template";

interface ServiceAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  agreementData: ServiceAgreementData;
  isAccepted?: boolean;
}

export function ServiceAgreementModal({
  isOpen,
  onClose,
  onAccept,
  agreementData,
  isAccepted = false,
}: ServiceAgreementModalProps) {
  if (!isOpen) return null;

  const agreement = getServiceAgreementDetails(agreementData);

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
              <h2 className="font-serif font-bold text-lg leading-tight">Service Agreement</h2>
              <p className="text-[11px] text-amber-100/90 font-mono mt-0.5">
                Ref: {agreement.refNo} | Biztribe Trading &amp; Consultancy India Pvt Ltd
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-gray-700 font-sans leading-relaxed">
          {/* Header Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Issuing Entity</span>
              <p className="font-semibold text-gray-900">{agreement.company.name}</p>
              <p className="text-xs text-gray-600">Brand: {agreement.company.brand} ({agreement.company.website})</p>
              <p className="text-xs text-gray-500 mt-1">{agreement.company.address}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Client / Payee</span>
              <p className="font-semibold text-gray-900">{agreement.client.name}</p>
              <p className="text-xs text-gray-600">{agreement.client.email}</p>
              <p className="text-xs text-gray-600 mt-1">Assigned Partner: {agreement.salesPartner.name}</p>
            </div>
          </div>

          {/* Package & Pricing Table */}
          <div>
            <h3 className="font-serif font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
              Package &amp; Pricing Breakdown — {agreement.engagement.packageName}
            </h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Line Item / Description</th>
                    <th className="p-3 text-right">Amount ({agreement.engagement.currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {agreement.engagement.lineItems.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{item.description}</td>
                      <td className="p-3 text-right font-semibold text-gray-900">
                        {agreement.engagement.currency} {Number(item.cost).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-amber-50/50 font-bold text-gray-900">
                    <td className="p-3 text-right text-xs uppercase tracking-wider">Total Consideration:</td>
                    <td className="p-3 text-right text-sm text-[#701010]">
                      {agreement.engagement.currency} {agreement.engagement.totalAmount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Package Deliverables / Inclusions */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4">
            <h4 className="font-bold text-sm text-amber-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700" />
              Included Package Deliverables &amp; Scope of Services:
            </h4>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-amber-950 font-medium">
              {agreement.engagement.inclusions.map((inclusion, idx) => (
                <li key={idx} className="leading-normal">{inclusion}</li>
              ))}
            </ol>
          </div>

          {/* Legal Clauses */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="font-serif font-bold text-base text-gray-900">Terms and Conditions</h3>
            {agreement.legalSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider">{section.heading}</h4>
                <p className="text-xs text-gray-600 leading-relaxed text-justify whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Electronic Stamp Disclaimer */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 text-green-900">
            <ShieldCheck className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Digital Contract Acceptance (Section 10A IT Act, 2000)</p>
              <p className="text-green-800 leading-normal">
                By confirming your acceptance on the payment screen, this agreement is electronically executed by Biztribe Trading &amp; Consultancy India Private Limited and yourself. An executed PDF copy will be dispatched to your registered email upon successful payment.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
          >
            Close Window
          </button>

          {onAccept && (
            <button
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="px-6 py-2.5 bg-[#701010] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#5a0c0c] transition-colors shadow-md flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {isAccepted ? "Agreement Accepted" : "I Accept & Confirm Agreement"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
