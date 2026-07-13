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
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getDocument, listSubcollection } from "@/lib/firestore-rest";
import { getCurrencyForRegion, getRegionFromCountry } from "@/lib/billing-utils";
import Navbar from "@/components/Navbar";
import { 
  Check, Lock, Loader2, Sparkles, CreditCard, Receipt, 
  Printer, ArrowRight, ShieldCheck, HelpCircle, CheckCircle, Info
} from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  
  // Data states
  const [userBilling, setUserBilling] = useState<any>(null);
  const [resolvedRegion, setResolvedRegion] = useState<string>("US");
  const [pricingConfig, setPricingConfig] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Active Invoice Modal State
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Profile display states for navbar
  const [userType, setUserType] = useState<string>("");
  const [spData, setSpData] = useState<any>({ fullName: "", profilePhoto: "" });
  const [oboData, setOboData] = useState<any>({ brandName: "", logo: "" });
  const [tpspData, setTpspData] = useState<any>({ companyName: "", logo: "" });

  // Load Razorpay script dynamically
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchData = async (currentUser: User) => {
    try {
      setLoading(true);
      const idToken = await currentUser.getIdToken();

      // 1. Fetch user root doc to extract billing
      const userData: any = await getDocument("users", currentUser.uid, idToken, "default");
      let region = "US";
      let dbPartitionId = "default";

      if (userData) {
        setUserType((userData.role as string) || "sp");
        
        // Fetch specific profile for navbar display
        dbPartitionId = (userData.databaseId as string) || "default";
        let country = "";

        if (userData.role === "obo") {
          let profile = await getDocument("OBO_Profile", currentUser.uid, idToken, dbPartitionId);
          if (!profile && dbPartitionId === "default") {
            profile = await getDocument("OBO_Profile", currentUser.uid, idToken, "fsindiadb");
            if (profile) dbPartitionId = "fsindiadb";
          }
          if (profile) {
            setOboData(profile);
            country = (profile.country as string) || "";
          }
        } else if (userData.role === "sp") {
          let profile = await getDocument("SP_Profile", currentUser.uid, idToken, dbPartitionId);
          if (!profile && dbPartitionId === "default") {
            profile = await getDocument("SP_Profile", currentUser.uid, idToken, "fsindiadb");
            if (profile) dbPartitionId = "fsindiadb";
          }
          if (profile) {
            setSpData(profile);
            country = (profile.country as string) || "";
          }
        } else if (userData.role === "tpsp") {
          let profile = await getDocument("TPSP_Profile", currentUser.uid, idToken, dbPartitionId);
          if (!profile && dbPartitionId === "default") {
            profile = await getDocument("TPSP_Profile", currentUser.uid, idToken, "fsindiadb");
            if (profile) dbPartitionId = "fsindiadb";
          }
          if (profile) {
            setTpspData(profile);
            country = (profile.country as string) || "";
          }
        }

        const billing = userData.billing || {};
        setUserBilling(billing);

        // Resolve region:
        // 1. billing.region
        // 2. profile country mapping
        // 3. databaseId mapping (fsindiadb -> IN)
        if (billing.region) {
          region = billing.region;
        } else if (country) {
          region = getRegionFromCountry(country);
        } else if (dbPartitionId === "fsindiadb") {
          region = "IN";
        }
        
        // If the profile or billing indicates India, enforce the India database partition for invoices
        if (region === "IN") {
          dbPartitionId = "fsindiadb";
        }
      }

      setResolvedRegion(region);

      // 2. Fetch corresponding pricing configuration for region
      const config = await getDocument("Pricing_Configs", region, idToken, "default");
      if (config) {
        setPricingConfig(config);
      }

      // 3. Fetch invoice ledger records
      setInvoicesLoading(true);
      const invoiceDocs = await listSubcollection(`users/${currentUser.uid}/Invoices`, idToken, dbPartitionId);
      // Sort invoices by date descending
      const sorted = invoiceDocs.sort((a: any, b: any) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setInvoices(sorted);
      setInvoicesLoading(false);

    } catch (err: any) {
      console.error("Failed to load pricing details:", err);
      setErrorMessage("Error fetching billing options. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData(user);
    }
  }, [user]);

  const handleCheckout = async (planId: string | null, topupId: string | null) => {
    if (!user) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    const key = planId ? `plan_${planId}` : `topup_${topupId}`;
    setPaymentProcessing(key);

    try {
      // 1. Ensure Razorpay is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please disable ad-blockers and try again.");
      }

      const idToken = await user.getIdToken();

      // 2. Call checkout API to generate Razorpay order
      const checkoutRes = await fetch("/api/plans/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          billingCycle: planId ? billingCycle : undefined,
          topupId,
          idToken
        })
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) {
        throw new Error(checkoutData.error || "Failed to initiate payment transaction.");
      }

      // 3. Configure Razorpay SDK options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        name: "ScaleFraction",
        description: checkoutData.description,
        order_id: checkoutData.order_id,
        handler: async (response: any) => {
          setPaymentProcessing("verifying");
          try {
            // 4. Verify payment signature on backend
            const verifyRes = await fetch("/api/plans/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                receipt: checkoutData.receipt,
                idToken
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            setSuccessMessage(
              planId 
                ? `Plan successfully upgraded to ${verifyData.billing?.planName || planId}!` 
                : "Top-up credits successfully credited to your account!"
            );
            
            // Refresh local pricing and billing states
            await fetchData(user);

          } catch (verifyErr: any) {
            setErrorMessage(verifyErr.message || "An error occurred while confirming payment. Please contact support.");
          } finally {
            setPaymentProcessing(null);
          }
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || ""
        },
        theme: {
          color: "#6366f1" // Premium Indigo
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(null);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setErrorMessage(err.message || "Failed to load payment portal.");
      setPaymentProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-gray-400 text-sm">Loading plans and billing profiles…</p>
        </div>
      </div>
    );
  }

  // Get regional currency details
  const activeRegion = resolvedRegion || "US";
  const currencySymbol = getCurrencyForRegion(activeRegion as any).symbol;
  const currencyCode = getCurrencyForRegion(activeRegion as any).currency;

  const plansList = pricingConfig?.plans || {};
  const starterPlan = plansList.starter || { costMonth: 0, costYear: 0, planName: "Starter" };
  const growthPlan = plansList.growth || { costMonth: 59, costYear: 639, planName: "Growth (Silver)" };
  const proPlan = plansList.professional || { costMonth: 108, costYear: 1296, planName: "Professional (Gold)" };
  const enterprisePlan = plansList.enterprise || { costMonth: 369, costYear: 3501, planName: "Enterprise (Platinum)" };

  const topupConfig = pricingConfig?.topups?.aiSearch || { quantity: 99, cost: 49 };

  return (
    <main className="min-h-screen bg-[#0d0e12] text-white font-body antialiased pb-20">
      {/* Dynamic Navbar */}
      <Navbar user={user} profileData={{ spData, oboData, tpspData }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">

          <h1 className="text-4xl font-headline font-bold tracking-tight text-white sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Local currency support matching your regional database partitioning. Choose a term plan, unlock advanced AI networking copilot modules, and process lead card scans seamlessly.
          </p>
        </div>

        {/* Global Notifications */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mt-6 bg-red-950/30 border border-red-500/30 text-red-400 px-4 py-3.5 rounded-xl text-sm flex items-center gap-3">
            <Info className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="max-w-3xl mx-auto mt-6 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 px-4 py-3.5 rounded-xl text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Billing Cycle Switcher */}
        <div className="flex justify-center mt-10">
          <div className="relative bg-white/5 border border-white/10 p-1.5 rounded-full flex items-center shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-1.5 rounded-full text-xs font-headline font-bold uppercase tracking-wider transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-1.5 rounded-full text-xs font-headline font-bold uppercase tracking-wider transition-all duration-300 ${
                billingCycle === "yearly"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly <span className="text-[10px] text-indigo-300 ml-1">(Save ~20%)</span>
            </button>
          </div>
        </div>

        {/* Plans Grid (Obsidian Glassmorphic Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 items-stretch">
          
          {/* Card 1: Starter (Free) */}
          <div className={`backdrop-blur-md bg-white/3 border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:shadow-lg ${
            userBilling?.planId === "starter" ? "border-indigo-500/40 ring-1 ring-indigo-500/40" : "border-white/5"
          }`}>
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-headline font-bold text-gray-200">{starterPlan.planName}</h3>
                {userBilling?.planId === "starter" && (
                  <span className="text-[9px] font-headline font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                )}
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-headline font-bold text-white">{currencySymbol}0</span>
                <span className="text-gray-500 text-xs ml-1">/ month</span>
              </div>
              <p className="text-xs text-gray-450 mt-2">Essential entry plan to trial business card captures.</p>
              
              <div className="h-px bg-white/5 my-6" />

              <ul className="space-y-4 text-xs text-gray-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>5 Business Card Scans / mo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Max 20 stored cards</span>
                </li>
                <li className="flex items-center gap-2.5 text-gray-500">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Report Export locked</span>
                </li>
                <li className="flex items-center gap-2.5 text-gray-500">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>AI Semantic Search locked</span>
                </li>
              </ul>
            </div>
            <button
              disabled
              className="w-full mt-8 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs font-bold uppercase tracking-wider cursor-not-allowed"
            >
              {userBilling?.planId === "starter" ? "Current Plan" : "Free Plan"}
            </button>
          </div>

          {/* Card 2: Growth (Silver) */}
          <div className={`backdrop-blur-md bg-white/3 border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:shadow-lg ${
            userBilling?.planId === "growth" ? "border-indigo-500/40 ring-1 ring-indigo-500/40" : "border-white/5"
          }`}>
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-headline font-bold text-gray-200">{growthPlan.planName}</h3>
                {userBilling?.planId === "growth" && (
                  <span className="text-[9px] font-headline font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                )}
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-headline font-bold text-white">
                  {currencySymbol}
                  {billingCycle === "yearly" ? growthPlan.costYear : growthPlan.costMonth}
                </span>
                <span className="text-gray-500 text-xs ml-1">/ {billingCycle === "yearly" ? "year" : "month"}</span>
              </div>
              <p className="text-xs text-gray-450 mt-2">
                {billingCycle === "yearly" ? `Billed once annually` : "Billed monthly"}
              </p>
              
              <div className="h-px bg-white/5 my-6" />

              <ul className="space-y-4 text-xs text-gray-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>30 Card Scans / mo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Max 250 stored cards</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>1 Report Export total</span>
                </li>
                <li className="flex items-center gap-2.5 text-gray-500">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>AI Semantic Search locked</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout("growth", null)}
              disabled={userBilling?.planId === "growth" || paymentProcessing !== null}
              className={`w-full mt-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                userBilling?.planId === "growth"
                  ? "bg-indigo-900/30 border border-indigo-500/20 text-indigo-400 cursor-default"
                  : "bg-white text-[#0d0e12] hover:bg-gray-100 active:scale-95"
              }`}
            >
              {paymentProcessing === "plan_growth" && <Loader2 className="w-4 h-4 animate-spin" />}
              {userBilling?.planId === "growth" ? "Current Plan" : "Upgrade"}
            </button>
          </div>

          {/* Card 3: Professional (Gold) - MOST POPULAR */}
          <div className="relative backdrop-blur-md bg-gradient-to-b from-indigo-900/10 to-indigo-950/20 border border-indigo-500/30 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl shadow-indigo-500/5 ring-1 ring-indigo-500/20">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-headline font-bold bg-indigo-600 text-white px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow-md">
              Most Popular
            </span>
            <div>
              <div className="flex justify-between items-start mt-1">
                <h3 className="text-lg font-headline font-bold text-white">{proPlan.planName}</h3>
                {userBilling?.planId === "professional" && (
                  <span className="text-[9px] font-headline font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                )}
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-headline font-bold text-white">
                  {currencySymbol}
                  {billingCycle === "yearly" ? proPlan.costYear : proPlan.costMonth}
                </span>
                <span className="text-gray-500 text-xs ml-1">/ {billingCycle === "yearly" ? "year" : "month"}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {billingCycle === "yearly" ? `Billed once annually` : "Billed monthly"}
              </p>
              
              <div className="h-px bg-indigo-500/10 my-6" />

              <ul className="space-y-4 text-xs text-gray-200">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>59 Card Scans / mo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Max 600 stored cards</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-indigo-300">Unlimited Report Exports</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>1 GPT Query / mo + Top-ups</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout("professional", null)}
              disabled={userBilling?.planId === "professional" || paymentProcessing !== null}
              className={`w-full mt-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                userBilling?.planId === "professional"
                  ? "bg-indigo-900/30 border border-indigo-500/20 text-indigo-400 cursor-default"
                  : "bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-600/10"
              }`}
            >
              {paymentProcessing === "plan_professional" && <Loader2 className="w-4 h-4 animate-spin" />}
              {userBilling?.planId === "professional" ? "Current Plan" : "Upgrade"}
            </button>
          </div>

          {/* Card 4: Enterprise (Platinum) */}
          <div className={`backdrop-blur-md bg-white/3 border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:shadow-lg ${
            userBilling?.planId === "enterprise" ? "border-indigo-500/40 ring-1 ring-indigo-500/40" : "border-white/5"
          }`}>
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-headline font-bold text-gray-200">{enterprisePlan.planName}</h3>
                {userBilling?.planId === "enterprise" && (
                  <span className="text-[9px] font-headline font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                )}
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-headline font-bold text-white">
                  {currencySymbol}
                  {billingCycle === "yearly" ? enterprisePlan.costYear : enterprisePlan.costMonth}
                </span>
                <span className="text-gray-500 text-xs ml-1">/ {billingCycle === "yearly" ? "year" : "month"}</span>
              </div>
              <p className="text-xs text-gray-450 mt-2">
                {billingCycle === "yearly" ? `Billed once annually` : "Billed monthly"}
              </p>
              
              <div className="h-px bg-white/5 my-6" />

              <ul className="space-y-4 text-xs text-gray-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-indigo-300">Unlimited Card Scans</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Max 5000 stored cards</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Unlimited Report Exports</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>100 GPT Queries / mo + Top-ups</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout("enterprise", null)}
              disabled={userBilling?.planId === "enterprise" || paymentProcessing !== null}
              className={`w-full mt-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                userBilling?.planId === "enterprise"
                  ? "bg-indigo-900/30 border border-indigo-500/20 text-indigo-400 cursor-default"
                  : "bg-white text-[#0d0e12] hover:bg-gray-100 active:scale-95"
              }`}
            >
              {paymentProcessing === "plan_enterprise" && <Loader2 className="w-4 h-4 animate-spin" />}
              {userBilling?.planId === "enterprise" ? "Current Plan" : "Upgrade"}
            </button>
          </div>

        </div>

        {/* Quota Usage Summary Section */}
        {userBilling && (
          <div className="bg-white/3 border border-white/5 p-6 rounded-3xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-[10px] font-headline font-bold text-gray-500 uppercase tracking-widest mb-1">Active Plan Type</p>
              <h4 className="text-lg font-headline font-bold text-white">{userBilling.planName || "Starter (Free)"}</h4>
              <p className="text-xs text-gray-450 mt-1">
                {userBilling.validUntil 
                  ? `Valid until ${new Date(userBilling.validUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` 
                  : "Permanent free access"}
              </p>
            </div>
            <div className="border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
              <p className="text-[10px] font-headline font-bold text-gray-500 uppercase tracking-widest mb-1">Card Scanning Quota</p>
              <h4 className="text-lg font-headline font-bold text-white">
                {userBilling.quotas?.cardScans?.usedThisMonth} / {userBilling.quotas?.cardScans?.limit === -1 ? "Unlimited" : userBilling.quotas?.cardScans?.limit}
              </h4>
              <p className="text-xs text-gray-450 mt-1">
                Max stored threshold: {userBilling.quotas?.cardScans?.maxStored} contacts
              </p>
            </div>
            <div className="border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
              <p className="text-[10px] font-headline font-bold text-gray-500 uppercase tracking-widest mb-1">AI search Credits</p>
              <h4 className="text-lg font-headline font-bold text-white flex items-center gap-1.5">
                {userBilling.quotas?.aiSearch?.creditsRemaining || 0} top-up credit(s) remaining
              </h4>
              <p className="text-xs text-gray-450 mt-1">
                Included plan quota: {userBilling.quotas?.aiSearch?.usedThisMonth} / {userBilling.quotas?.aiSearch?.limit} query
              </p>
            </div>
          </div>
        )}

        {/* Top-up Purchases Section */}
        {userBilling && (userBilling.planId === "professional" || userBilling.planId === "enterprise") && (
          <div className="bg-gradient-to-r from-indigo-950/20 to-purple-950/10 border border-indigo-500/10 rounded-3xl p-6 mt-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="font-headline font-bold text-base text-white flex items-center justify-center md:justify-start gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                Need more AI Search queries?
              </h4>
              <p className="text-gray-400 text-xs">
                Purchase an instant search package booster: get **{topupConfig.quantity} searches** for **{currencySymbol}{topupConfig.cost}** only. Credits do not expire.
              </p>
            </div>
            <button
              onClick={() => handleCheckout(null, "aiSearch")}
              disabled={paymentProcessing !== null}
              className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-headline font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
            >
              {paymentProcessing === "topup_aiSearch" && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>⚡ Buy Queries Booster</span>
            </button>
          </div>
        )}

        {/* Invoice Ledger Section */}
        <div className="mt-16 space-y-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-headline font-bold">Billing & Invoice History</h3>
          </div>

          {invoicesLoading ? (
            <div className="bg-white/3 border border-white/5 rounded-2xl p-8 flex justify-center items-center">
              <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="bg-white/3 border border-white/5 rounded-2xl p-8 text-center text-gray-500 text-xs">
              No transactions have been recorded yet.
            </div>
          ) : (
            <div className="bg-white/3 border border-white/5 rounded-2xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 font-headline font-bold uppercase tracking-wider border-b border-white/5">
                      <th className="px-6 py-4">Invoice ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {invoices.map((inv: any) => (
                      <tr key={inv.invoiceId} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4 font-mono text-gray-300 font-semibold">{inv.invoiceId}</td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(inv.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-gray-200 font-semibold">{inv.description}</td>
                        <td className="px-6 py-4 text-white font-bold">
                          {getCurrencyForRegion(inv.region || 'US').symbol}
                          {inv.amount}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-white/5 text-gray-300 border border-white/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[9px] font-bold">
                            {inv.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold underline underline-offset-4"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Invoice Receipt Modal Overlay */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-[#0d0e12]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12131a] border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-white/5 px-6 py-4 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-400" />
                <h4 className="font-headline font-bold text-sm text-white">Invoice Details</h4>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {/* Print Area */}
            <div id="invoice-print-area" className="p-8 space-y-6 text-gray-300 text-xs leading-relaxed bg-[#12131a]">
              {/* Vendor & Receipt Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-headline font-bold tracking-tight text-white">ScaleFraction</h2>
                  <p className="text-gray-400">Biztribe Trading & Consultancy</p>
                  <p className="text-[10px] text-gray-500">Corporate Office Address, India</p>
                  {selectedInvoice.region === 'IN' && (
                    <p className="text-[10px] text-indigo-400/80 font-semibold font-mono">GSTIN: 27AAFCB1234F1ZP</p>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <p className="text-gray-400 font-headline font-bold text-xs uppercase tracking-wider">Receipt</p>
                  <p className="font-semibold text-white font-mono">{selectedInvoice.invoiceId}</p>
                  <p className="text-[10px] text-gray-550">
                    Date: {new Date(selectedInvoice.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-6">
                <div>
                  <p className="text-gray-500 font-headline font-bold uppercase tracking-wider text-[9px] mb-1">Billed To</p>
                  <p className="font-semibold text-white">{selectedInvoice.userName || "ScaleFraction Partner"}</p>
                  <p className="text-gray-450">{selectedInvoice.userEmail}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-headline font-bold uppercase tracking-wider text-[9px] mb-1">Transaction Details</p>
                  <p className="text-gray-450"><span className="text-gray-400">Payment ID:</span> <span className="font-mono text-white font-semibold">{selectedInvoice.paymentId}</span></p>
                  <p className="text-gray-450"><span className="text-gray-400">Gateway:</span> Razorpay ({selectedInvoice.paymentMethod})</p>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-gray-400 font-headline font-bold uppercase tracking-wider text-[9px] border-b border-white/5 pb-2">
                  <span>Description</span>
                  <span>Total</span>
                </div>
                <div className="flex justify-between items-start font-semibold text-white py-1">
                  <span>{selectedInvoice.description}</span>
                  <span>
                    {getCurrencyForRegion(selectedInvoice.region).symbol}
                    {selectedInvoice.taxBreakdown?.taxableAmount || selectedInvoice.amount}
                  </span>
                </div>
                
                {/* Indian GST Tax Breakdown */}
                {selectedInvoice.region === 'IN' && selectedInvoice.taxBreakdown && (
                  <div className="space-y-1.5 border-t border-dashed border-white/5 pt-3.5 text-gray-405">
                    <div className="flex justify-between">
                      <span>Taxable Amount</span>
                      <span>₹{selectedInvoice.taxBreakdown.taxableAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CGST (9%)</span>
                      <span>₹{selectedInvoice.taxBreakdown.cgst}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST (9%)</span>
                      <span>₹{selectedInvoice.taxBreakdown.sgst}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Total Summary */}
              <div className="flex justify-between items-center border-t border-white/10 pt-6 text-sm">
                <span className="font-headline font-bold uppercase tracking-widest text-gray-400 text-xs">Total Amount Paid</span>
                <span className="text-xl font-headline font-bold text-white">
                  {getCurrencyForRegion(selectedInvoice.region).symbol}
                  {selectedInvoice.amount}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white/3 border-t border-white/5 px-6 py-4 flex justify-between gap-3 shrink-0">
              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Cryptographically secured transaction ledger.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const printContents = document.getElementById("invoice-print-area")?.innerHTML;
                    const originalContents = document.body.innerHTML;
                    if (printContents) {
                      document.body.innerHTML = printContents;
                      window.print();
                      window.location.reload();
                    }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
