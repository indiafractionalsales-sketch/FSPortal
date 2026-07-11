"use client";

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

import { useState, useEffect } from "react";
import { X, Info, Loader2, Send, RefreshCw } from "lucide-react";
import { auth } from "@/lib/firebase";

interface ExistingOffer {
  offerId: string;
  amount: number;
  currency: string;
  message: string;
  status: string;
}

interface MakeOfferDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  budgetRangeText: string;
  preferredCurrency?: string;
  onSuccess: () => void;
  existingOffer?: ExistingOffer | null;
}

const getCurrencySymbol = (currency?: string) => {
  switch (currency) {
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'INR': return '₹';
    case 'AUD': return 'A$';
    case 'CAD': return 'C$';
    case 'USD': default: return '$';
  }
};

export default function MakeOfferDrawer({
  isOpen,
  onClose,
  postId,
  budgetRangeText,
  preferredCurrency = "USD",
  onSuccess,
  existingOffer,
}: MakeOfferDrawerProps) {
  const isEditMode = !!existingOffer && existingOffer.status === "pending";

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill when existing offer is loaded
  useEffect(() => {
    if (isOpen) {
      if (existingOffer) {
        setAmount(String(existingOffer.amount));
        setMessage(existingOffer.message || "");
      } else {
        setAmount("");
        setMessage("");
      }
      setError("");
    }
  }, [isOpen, existingOffer]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to submit an offer.");
      return;
    }

    const offerAmount = parseFloat(amount);
    if (isNaN(offerAmount) || offerAmount <= 0) {
      setError("Please enter a valid offer amount.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const idToken = await user.getIdToken();

      if (isEditMode && existingOffer) {
        // UPDATE existing offer via PUT
        const res = await fetch("/api/offers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            offerId: existingOffer.offerId,
            amount: offerAmount,
            currency: preferredCurrency,
            message,
            idToken,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update offer.");
      } else {
        // CREATE new offer via POST
        const res = await fetch("/api/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            amount: offerAmount,
            currency: preferredCurrency,
            message,
            idToken,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to submit offer.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to submit offer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={!saving ? onClose : undefined} 
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 border-l border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-serif font-bold text-gray-900">
              {isEditMode ? "Update Your Offer" : "Make an Offer"}
            </h2>
            <p className="text-[10px] text-gray-500 font-headline uppercase tracking-wider mt-0.5 font-bold">
              {isEditMode ? "Modify your representation bid" : "Submit your representation bid"}
            </p>
          </div>
          <button 
            onClick={onClose} 
            disabled={saving}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit mode banner */}
        {isEditMode && (
          <div className="mx-5 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
            <RefreshCw className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              You have an existing pending offer. Submitting will <strong>update</strong> your bid — your original proposal date is preserved.
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Budget Range Context Card */}
          <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-xl p-4">
            <h4 className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider font-headline mb-1">
              Client's Target Budget Range
            </h4>
            <p className="text-sm font-serif font-bold text-gray-900">{budgetRangeText}</p>
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
              We recommend aligning your bid with the client's stated range, though you are free to propose other pricing models.
            </p>
          </div>

          {/* Offer Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider font-headline flex items-center gap-1">
              Your Proposed Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500 font-serif">
                {getCurrencySymbol(preferredCurrency)}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-16 bg-white text-sm text-gray-900 focus:border-[#701010] focus:ring-1 focus:ring-[#701010] outline-none transition-all"
                disabled={saving}
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 font-headline uppercase tracking-wider">
                {preferredCurrency}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
              <Info className="w-3 h-3 flex-shrink-0" />
              This is based on your preferred payment currency.
            </p>
          </div>

          {/* Message Area */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider font-headline">
              Proposal / Intro Pitch (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself, list relevant experience in this market sector, and outline your execution strategy..."
              rows={6}
              maxLength={1000}
              className="w-full border border-gray-200 rounded-xl p-3 bg-white text-sm text-gray-900 focus:border-[#701010] focus:ring-1 focus:ring-[#701010] outline-none transition-all resize-none"
              disabled={saving}
            />
            <div className="flex justify-end">
              <span className="text-[9px] text-gray-400 font-headline">
                {message.length} / 1000 characters
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-headline uppercase tracking-wider disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2.5 bg-[#701010] hover:bg-[#5a0c0c] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 min-w-[130px] justify-center"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                {isEditMode ? "Updating..." : "Submitting..."}
              </>
            ) : (
              <>
                {isEditMode ? <RefreshCw className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                {isEditMode ? "Update Offer" : "Submit Offer"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
