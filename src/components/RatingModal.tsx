"use client";

import { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  targetUid: string;
  targetName: string;
  existingReview?: {
    rating: number;
    comment: string;
  } | null;
}

export default function RatingModal({
  isOpen,
  onClose,
  postId,
  targetUid,
  targetName,
  existingReview,
}: RatingModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isReadOnly = !!existingReview;

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0 || isReadOnly) return;

    setIsSubmitting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId,
          targetUid,
          rating,
          comment,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit review");
      }
    } catch (err) {
      console.error("Review submit error:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-serif font-bold text-lg text-gray-900">
            {isReadOnly ? "Your Rating" : "Rate Partner"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🎉</div>
              <p className="font-serif font-bold text-lg text-gray-900">
                Review Submitted!
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Thank you for your feedback.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                {isReadOnly
                  ? `Your review for ${targetName}`
                  : `How was your experience working with ${targetName}?`}
              </p>

              {/* Stars */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => !isReadOnly && setHoverRating(star)}
                    onMouseLeave={() => !isReadOnly && setHoverRating(0)}
                    className={`transition-all duration-150 ${
                      isReadOnly
                        ? "cursor-default"
                        : "cursor-pointer hover:scale-125 active:scale-110"
                    }`}
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Rating label */}
              {rating > 0 && (
                <p className="text-center text-sm font-medium text-gray-500 mb-4">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Below Average"}
                  {rating === 3 && "Average"}
                  {rating === 4 && "Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}

              {/* Comment */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isReadOnly}
                placeholder="Share your experience... (optional)"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#701010]/20 focus:border-[#701010]/30 disabled:bg-gray-50 disabled:text-gray-500"
                rows={3}
              />

              {/* Submit button */}
              {!isReadOnly && (
                <button
                  onClick={handleSubmit}
                  disabled={rating === 0 || isSubmitting}
                  className="w-full mt-4 py-3 bg-[#701010] hover:bg-[#5a0c0c] text-white rounded-xl text-sm font-headline font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
