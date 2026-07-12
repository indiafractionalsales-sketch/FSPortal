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
import { X, Loader2, CheckCircle2, User, Clock, AlertTriangle, Check, Trash2 } from "lucide-react";
import { auth } from "@/lib/firebase";

interface Offer {
  offerId: string;
  postId: string;
  offerorUid: string;
  offerorName: string;
  offerorAvatar: string;
  amount: number;
  currency: string;
  message: string;
  status: "pending" | "accepted" | "declined" | "withdrawn";
  createdAt: string;
}

interface OffersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  budgetRangeText: string;
  onDealFinalized: () => void;
}

const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'INR': return '₹';
    case 'AUD': return 'A$';
    case 'CAD': return 'C$';
    case 'USD': default: return '$';
  }
};

export default function OffersPanel({
  isOpen,
  onClose,
  postId,
  postTitle,
  budgetRangeText,
  onDealFinalized,
}: OffersPanelProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionInProgress, setActionInProgress] = useState(false);
  const [confirmAcceptOffer, setConfirmAcceptOffer] = useState<Offer | null>(null);

  useEffect(() => {
    if (isOpen && postId) {
      fetchOffers();
    }
  }, [isOpen, postId]);

  const fetchOffers = async () => {
    setLoading(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication required.");

      const idToken = await user.getIdToken();
      const res = await fetch(`/api/offers?postId=${postId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load offers.");

      // Sort: accepted first, then pending (newest first), then others
      const sortedOffers = (data.offers || []).sort((a: Offer, b: Offer) => {
        if (a.status === "accepted") return -1;
        if (b.status === "accepted") return 1;
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setOffers(sortedOffers);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load offers.");
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpdateStatus = async (offerId: string, action: "accept" | "decline") => {
    setActionInProgress(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication required.");

      const idToken = await user.getIdToken();
      const res = await fetch("/api/offers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          offerId,
          action,
          idToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${action} offer.`);

      setConfirmAcceptOffer(null);

      if (action === "accept" && data.requiresPayment) {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          throw new Error("Failed to load Razorpay payment gateway.");
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
          amount: data.amount,
          currency: 'INR',
          name: 'Fractional Sales Partner',
          description: `Accept Offer Payment`,
          order_id: data.order_id,
          prefill: {
            name: auth.currentUser?.displayName || 'Customer',
            email: auth.currentUser?.email || 'customer@example.com',
          },
          handler: async function (response: any) {
            setActionInProgress(true);
            try {
              const verifyRes = await fetch('/api/payment-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  receipt: data.receipt
                })
              });
              
              const verifyData = await verifyRes.json();
              if (verifyData.error) {
                alert(verifyData.error);
              } else {
                onClose();
                onDealFinalized();
              }
            } catch (vErr) {
              console.error("Verification failed:", vErr);
              alert("Payment verification failed. Please contact support.");
            } finally {
              setActionInProgress(false);
            }
          },
          modal: {
            ondismiss: async function () {
              console.log("Checkout dismissed by user. Releasing payment lock.");
              try {
                await fetch(`/api/payment-status?order_id=${data.receipt}&action=cancel`);
              } catch (cErr) {
                console.error("Failed to release lock:", cErr);
              }
              setActionInProgress(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      }

      await fetchOffers();

      if (action === "accept") {
        onDealFinalized();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Failed to execute action.`);
    } finally {
      setActionInProgress(false);
    }
  };

  if (!isOpen) return null;

  const hasAcceptedOffer = offers.some((o) => o.status === "accepted");

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={!actionInProgress ? onClose : undefined} 
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 border-l border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-serif font-bold text-gray-900 line-clamp-1">{postTitle}</h2>
            <p className="text-[10px] text-gray-500 font-headline uppercase tracking-wider mt-0.5 font-bold flex items-center gap-1.5">
              <span>Target: {budgetRangeText}</span>
              <span>•</span>
              <span className="text-[#701010]">{offers.length} Responses</span>
            </p>
          </div>
          <button 
            onClick={onClose} 
            disabled={actionInProgress}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <span>⚠️</span>
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#701010]" />
              <p className="text-xs text-gray-500 font-headline uppercase tracking-wider">Loading offers...</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white border border-gray-150 rounded-2xl shadow-sm">
              <span className="text-3xl mb-2">✉️</span>
              <h4 className="font-serif font-bold text-gray-900 text-sm">No Offers Received Yet</h4>
              <p className="text-xs text-gray-500 max-w-xs mt-1">
                Your post is currently visible to all Sales Partners. When someone responds with a bid, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {offers.map((offer) => {
                const formattedDate = new Date(offer.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit"
                });

                const isOfferPending = offer.status === "pending";
                const isOfferAccepted = offer.status === "accepted";
                const isOfferDeclined = offer.status === "declined";

                return (
                  <div 
                    key={offer.offerId} 
                    className={`bg-white border rounded-2xl p-4 shadow-sm transition-all duration-200 ${
                      isOfferAccepted 
                        ? "border-emerald-200 ring-2 ring-emerald-50"
                        : isOfferDeclined
                          ? "border-gray-100 opacity-60"
                          : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    {/* User profile section */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {offer.offerorAvatar ? (
                          <img 
                            src={offer.offerorAvatar} 
                            alt={offer.offerorName} 
                            className="w-10 h-10 rounded-full object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-serif font-bold text-sm text-gray-900 leading-none">
                            {offer.offerorName}
                          </h4>
                          <span className="text-[9px] text-gray-400 font-headline uppercase tracking-wider mt-1 block flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {formattedDate}
                          </span>
                        </div>
                      </div>

                      {/* Offer Amount display */}
                      <div className="text-right">
                        <span className="text-base font-serif font-bold text-[#701010] block">
                          {getCurrencySymbol(offer.currency)}{offer.amount.toLocaleString()}
                        </span>
                        <span className="text-[9px] font-headline font-bold text-gray-400 uppercase tracking-widest mt-0.5 block">
                          {offer.currency}
                        </span>
                      </div>
                    </div>

                    {/* Proposal message */}
                    {offer.message && (
                      <div className="mt-3.5 bg-gray-50/50 p-3 rounded-xl border border-gray-100 text-xs text-gray-750 font-sans leading-relaxed">
                        <p className="whitespace-pre-wrap">{offer.message}</p>
                      </div>
                    )}

                    {/* Badges and Actions */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3 gap-3">
                      <div>
                        {isOfferAccepted && (
                          <span className="inline-flex items-center gap-1.5 text-[9px] font-headline font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Accepted & Finalized
                          </span>
                        )}
                        {isOfferDeclined && (
                          <span className="inline-flex items-center gap-1.5 text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-full">
                            Declined
                          </span>
                        )}
                        {offer.status === "withdrawn" && (
                          <span className="inline-flex items-center gap-1.5 text-[9px] font-headline font-bold uppercase tracking-wider text-red-500 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
                            Withdrawn
                          </span>
                        )}
                        {isOfferPending && !hasAcceptedOffer && (
                          <span className="inline-flex items-center gap-1.5 text-[9px] font-headline font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
                            Pending Review
                          </span>
                        )}
                      </div>

                      {/* Pending actions */}
                      {isOfferPending && !hasAcceptedOffer && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(offer.offerId, "decline")}
                            disabled={actionInProgress}
                            className="px-3 py-1.5 text-[10px] font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-headline uppercase tracking-wider flex items-center gap-1 disabled:opacity-50"
                            title="Decline Offer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmAcceptOffer(offer)}
                            disabled={actionInProgress}
                            className="px-3.5 py-1.5 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                            title="Accept Offer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Accept
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {confirmAcceptOffer && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-[120] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 text-center animate-in scale-in duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-gray-900 text-base">Finalize Deal?</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Are you sure you want to accept <strong>{confirmAcceptOffer.offerorName}</strong>'s offer of{" "}
                <span className="font-bold text-[#701010]">
                  {getCurrencySymbol(confirmAcceptOffer.currency)}
                  {confirmAcceptOffer.amount.toLocaleString()}
                </span>?
              </p>
              <div className="mt-3.5 bg-amber-50 text-[10px] text-amber-800 p-2.5 rounded-lg border border-amber-100 leading-relaxed text-left flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  Accepting this offer will decline all other pending offers and lock this deal. An email will be sent to <strong>sales@fractionalsalespartner.com</strong> to arrange payment kickoff.
                </span>
              </div>
              
              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setConfirmAcceptOffer(null)}
                  disabled={actionInProgress}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(confirmAcceptOffer.offerId, "accept")}
                  disabled={actionInProgress}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {actionInProgress ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    "Confirm Accept"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
