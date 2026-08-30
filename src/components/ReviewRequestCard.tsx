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
import { Star, CheckCircle2, Clock } from "lucide-react";

interface ReviewRequestCardProps {
  inquiryId: string;
  agencyId: string;
  agencyName: string;
  agencyOwnerUid: string;
  buyerUid: string;
  currentUserUid: string;
  onSubmitted?: () => void;
  onSubmitReview: (rating: number, comment: string) => Promise<void>;
}

export default function ReviewRequestCard({
  agencyName,
  buyerUid,
  currentUserUid,
  onSubmitted,
  onSubmitReview
}: ReviewRequestCardProps) {
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isDeferred, setIsDeferred] = useState(false);

  const isBuyer = currentUserUid === buyerUid;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitReview(selectedRating, comment);
      setIsDone(true);
      if (onSubmitted) onSubmitted();
    } catch (err) {
      console.error("Error submitting review from chat card:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDeferred) {
    return (
      <div className="my-2 p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Review deferred. A gentle reminder will be sent in 3 days.</span>
        </div>
        <button
          onClick={() => setIsDeferred(false)}
          className="text-[11px] font-headline font-bold text-amber-800 underline hover:text-amber-950"
        >
          Review Now
        </button>
      </div>
    );
  }

  if (isDone) {
    return (
      <div className="my-2 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 shadow-xs">
        <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h5 className="font-serif font-bold text-xs text-emerald-900">Thank You for Your Feedback!</h5>
        <p className="text-[11px] text-emerald-700 font-sans">
          Your rating of <strong>{selectedRating} ⭐</strong> has been recorded and updated on {agencyName}&apos;s marketplace profile.
        </p>
      </div>
    );
  }

  return (
    <div className="my-2 p-4 bg-gradient-to-br from-amber-50/90 to-amber-100/40 border border-amber-200/80 rounded-2xl shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
          🌟 Feedback Request
        </span>
        <span className="text-[10px] text-gray-400 font-headline">Post-Engagement</span>
      </div>

      <div className="space-y-1">
        <h5 className="font-serif font-bold text-sm text-gray-900">
          How was your experience working with {agencyName}?
        </h5>
        <p className="text-xs text-gray-600 font-sans">
          Your review helps other buyers on the marketplace find verified, high-performing partners.
        </p>
      </div>

      {isBuyer ? (
        <div className="space-y-3 pt-1">
          {/* Star Rating Picker */}
          <div className="flex items-center justify-center gap-1 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || selectedRating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setSelectedRating(star)}
                  className="p-1 transition-transform hover:scale-125 cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      active ? "fill-amber-400 text-amber-400" : "text-gray-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Comment Area */}
          <textarea
            rows={2}
            placeholder="Write a brief review (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-amber-500 resize-none shadow-2xs"
          />

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              onClick={() => setIsDeferred(true)}
              className="px-3 py-2 bg-white border border-amber-200 text-amber-800 hover:bg-amber-50 font-headline font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Remind Me Later
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2.5 bg-white/70 rounded-xl text-center text-xs text-gray-500 font-sans italic">
          Review request card sent to buyer. Pending rating submission.
        </div>
      )}
    </div>
  );
}
