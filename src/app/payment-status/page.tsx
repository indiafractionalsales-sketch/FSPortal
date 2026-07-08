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

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID found in the redirection URL.");
      setLoading(false);
      return;
    }

    let pollCount = 0;
    const maxPolls = 5;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/payment-status?order_id=${orderId}`);
        if (!res.ok) {
          throw new Error("Failed to retrieve payment status");
        }
        const data = await res.json();
        
        // Cashfree sandbox status can take a second to update. 
        // If it is 'ACTIVE', we poll a few times before giving up.
        if (data.status === "ACTIVE" && pollCount < maxPolls) {
          pollCount++;
          setTimeout(checkStatus, 2000);
          return;
        }

        setStatus(data.status);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred while verifying the payment.");
        setLoading(false);
      }
    };

    checkStatus();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
        <p className="text-gray-600 max-w-sm">
          Please wait while we verify your transaction status with Cashfree. Do not close or refresh this page.
        </p>
      </div>
    );
  }

  if (error || status === "FAILED" || status === "CANCELLED" || status === "EXPIRED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h2>
        <p className="text-gray-600 max-w-md mb-6">
          {error || `Your payment transaction status is ${status || 'Unknown'}. If any amount was deducted, it will be automatically refunded by Cashfree.`}
        </p>
        <Link 
          href="/home"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition"
        >
          Return to Feed
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmed!</h2>
      <p className="text-gray-600 max-w-md mb-6">
        Your payment has been successfully processed and verified. The package selection has been locked and confirmed.
      </p>
      <Link 
        href="/home"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition"
      >
        Go to Home Feed
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <main className="max-w-7xl mx-auto py-12">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading</h2>
        </div>
      }>
        <PaymentStatusContent />
      </Suspense>
    </main>
  );
}
