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
import { getDocument } from "@/lib/firestore-rest";
import Navbar from "@/components/Navbar";
import { 
  Settings, Loader2, Save, Plus, Trash2, ArrowLeft,
  ShieldCheck, AlertTriangle, HelpCircle, CheckCircle, Info
} from "lucide-react";

export default function AdminPricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Active configurations
  const [selectedRegion, setSelectedRegion] = useState<string>("IN");
  const [config, setConfig] = useState<any>(null);
  
  // Status states
  const [configLoading, setConfigLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Profile data for navbar
  const [oboData, setOboData] = useState<any>({ brandName: "", logo: "" });
  const [spData, setSpData] = useState<any>({ fullName: "", profilePhoto: "" });
  const [tpspData, setTpspData] = useState<any>({ companyName: "", logo: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
      } else {
        setUser(currentUser);
        try {
          // Verify custom claims for admin permission on client-side
          const tokenResult = await currentUser.getIdTokenResult();
          if (tokenResult.claims.admin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          console.error("Failed to parse claims:", err);
          setIsAdmin(false);
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchProfileForNavbar = async (currentUser: User) => {
    try {
      const idToken = await currentUser.getIdToken();
      const userData = await getDocument("users", currentUser.uid, idToken, "default");
      if (userData) {
        const dbId = (userData.databaseId as string) || "default";
        if (userData.role === "obo") {
          const profile = await getDocument("OBO_Profile", currentUser.uid, idToken, dbId);
          if (profile) setOboData(profile);
        } else if (userData.role === "sp") {
          const profile = await getDocument("SP_Profile", currentUser.uid, idToken, dbId);
          if (profile) setSpData(profile);
        } else if (userData.role === "tpsp") {
          const profile = await getDocument("TPSP_Profile", currentUser.uid, idToken, dbId);
          if (profile) setTpspData(profile);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch profile metadata for admin navbar:", err);
    }
  };

  const fetchRegionConfig = async (regionId: string, currentUser: User) => {
    setConfigLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const idToken = await currentUser.getIdToken();
      const data = await getDocument("Pricing_Configs", regionId, idToken, "default");
      if (data) {
        setConfig(data);
      } else {
        throw new Error(`Pricing configurations not found for region: ${regionId}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load region config.");
    } finally {
      setConfigLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchProfileForNavbar(user);
      fetchRegionConfig(selectedRegion, user);
    } else if (user && !loading && !isAdmin) {
      setLoading(false);
    }
  }, [user, isAdmin, selectedRegion]);

  useEffect(() => {
    if (user && isAdmin !== null) {
      setLoading(false);
    }
  }, [isAdmin]);

  const handlePlanChange = (planKey: string, fieldKey: string, value: any) => {
    if (!config) return;
    const updatedPlans = { ...config.plans };
    updatedPlans[planKey] = {
      ...updatedPlans[planKey],
      [fieldKey]: value
    };
    setConfig({ ...config, plans: updatedPlans });
  };

  const handlePlanQuotaChange = (planKey: string, quotaKey: string, value: any) => {
    if (!config) return;
    const updatedPlans = { ...config.plans };
    updatedPlans[planKey] = {
      ...updatedPlans[planKey],
      quotas: {
        ...updatedPlans[planKey].quotas,
        [quotaKey]: Number(value)
      }
    };
    setConfig({ ...config, plans: updatedPlans });
  };

  const handleTopupChange = (fieldKey: string, value: any) => {
    if (!config) return;
    setConfig({
      ...config,
      topups: {
        ...config.topups,
        aiSearch: {
          ...config.topups.aiSearch,
          [fieldKey]: Number(value)
        }
      }
    });
  };

  const handleSlabChange = (index: number, fieldKey: string, value: any) => {
    if (!config) return;
    const updatedSlabs = [...config.commissionSlabs];
    updatedSlabs[index] = {
      ...updatedSlabs[index],
      [fieldKey]: Number(value)
    };
    setConfig({ ...config, commissionSlabs: updatedSlabs });
  };

  const addSlab = () => {
    if (!config) return;
    const updatedSlabs = [...(config.commissionSlabs || [])];
    updatedSlabs.push({ limit: 999999999, rate: 0.25 });
    setConfig({ ...config, commissionSlabs: updatedSlabs });
  };

  const removeSlab = (index: number) => {
    if (!config) return;
    const updatedSlabs = config.commissionSlabs.filter((_: any, i: number) => i !== index);
    setConfig({ ...config, commissionSlabs: updatedSlabs });
  };

  const handleSaveConfig = async () => {
    if (!user || !config) return;
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/admin/pricing/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify(config)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update configurations.");
      }

      setSuccessMessage(`Pricing configurations updated successfully for region: ${selectedRegion}!`);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save pricing configuration.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-gray-400 text-sm">Verifying administrator credentials…</p>
        </div>
      </div>
    );
  }

  // Access Denied Screen for non-admins
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#0d0e12] text-white flex items-center justify-center p-4">
        <div className="bg-[#12131a] border border-red-500/20 max-w-md w-full rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full flex items-center justify-center mx-auto shadow-md">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-headline font-bold text-white">Access Denied</h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              This terminal is restricted to platform administrators. To modify plan configurations, your UID must be promoted using the secure CLI utility script.
            </p>
          </div>
          <button
            onClick={() => router.replace("/home")}
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Global Feed
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0e12] text-white font-body antialiased pb-20">
      {/* Dynamic Navbar */}
      <Navbar user={user} profileData={{ spData, oboData, tpspData }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Header Console Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <h1 className="text-2xl font-headline font-bold tracking-tight text-white">
                Pricing & Commission Console
              </h1>
            </div>
            <p className="text-gray-400 text-xs">
              Dynamically modify pricing quotas, metered top-ups, and progressive tax slabs for six global regions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-headline font-bold uppercase tracking-wider shrink-0">Select Target Region</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white/5 border border-white/10 hover:border-white/20 rounded-xl px-4 py-2 text-xs font-headline font-bold outline-none cursor-pointer text-white appearance-none pr-8 relative bg-no-repeat bg-[right_12px_center]"
            >
              <option value="IN" className="bg-[#12131a] text-white">IN (India - INR)</option>
              <option value="US" className="bg-[#12131a] text-white">US (Americas - USD)</option>
              <option value="GB" className="bg-[#12131a] text-white">GB (United Kingdom - GBP)</option>
              <option value="EU" className="bg-[#12131a] text-white">EU (Europe - EUR)</option>
              <option value="SEA" className="bg-[#12131a] text-white">SEA (South East Asia - SGD)</option>
              <option value="ME" className="bg-[#12131a] text-white">ME (Middle East - AED)</option>
            </select>
          </div>
        </div>

        {/* Global Notifications */}
        {errorMessage && (
          <div className="mt-6 bg-red-950/30 border border-red-500/30 text-red-400 px-4 py-3.5 rounded-xl text-sm flex items-center gap-3">
            <Info className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mt-6 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 px-4 py-3.5 rounded-xl text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {configLoading ? (
          <div className="min-h-[400px] flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : !config ? (
          <div className="min-h-[400px] flex justify-center items-center text-gray-500 text-xs">
            Failed to parse configuration parameters.
          </div>
        ) : (
          <div className="space-y-12 mt-8">
            
            {/* SECTION 1: Dynamic Subscription Plans */}
            <div className="space-y-4">
              <h3 className="text-base font-headline font-bold text-indigo-400 border-b border-white/5 pb-2">
                1. Regional Plans Settings (Currency: {config.currency} {config.currencySymbol})
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.keys(config.plans).map((planKey) => {
                  const plan = config.plans[planKey];
                  return (
                    <div key={planKey} className="bg-white/3 border border-white/5 rounded-3xl p-6 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-xs font-headline font-bold uppercase tracking-wider text-white">
                          {plan.planName}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                          id: {planKey}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-headline font-bold text-gray-500 uppercase tracking-wider block mb-1">Monthly Cost ({config.currencySymbol})</label>
                          <input
                            type="number"
                            value={plan.costMonth}
                            onChange={(e) => handlePlanChange(planKey, "costMonth", Number(e.target.value))}
                            className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs w-full text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-headline font-bold text-gray-500 uppercase tracking-wider block mb-1">Yearly Cost ({config.currencySymbol})</label>
                          <input
                            type="number"
                            value={plan.costYear}
                            onChange={(e) => handlePlanChange(planKey, "costYear", Number(e.target.value))}
                            className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs w-full text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-headline font-bold text-gray-500 uppercase tracking-wider block mb-1">Card Scans Quota (-1: Unlim)</label>
                          <input
                            type="number"
                            value={plan.quotas.cardScansLimit}
                            onChange={(e) => handlePlanQuotaChange(planKey, "cardScansLimit", e.target.value)}
                            className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs w-full text-white outline-none animate-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-headline font-bold text-gray-500 uppercase tracking-wider block mb-1">Max Cards Stored Limit</label>
                          <input
                            type="number"
                            value={plan.quotas.maxCardsStored || plan.quotas.maxStored || 20}
                            onChange={(e) => handlePlanQuotaChange(planKey, "maxCardsStored", e.target.value)}
                            className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs w-full text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-headline font-bold text-gray-500 uppercase tracking-wider block mb-1">Reports Quota (-1: Unlim, 0: Locked)</label>
                          <input
                            type="number"
                            value={plan.quotas.reportsLimit}
                            onChange={(e) => handlePlanQuotaChange(planKey, "reportsLimit", e.target.value)}
                            className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs w-full text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-headline font-bold text-gray-500 uppercase tracking-wider block mb-1">AI Search Quota (0: Locked)</label>
                          <input
                            type="number"
                            value={plan.quotas.aiSearchLimit}
                            onChange={(e) => handlePlanQuotaChange(planKey, "aiSearchLimit", e.target.value)}
                            className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs w-full text-white outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: Metered Top-ups */}
            <div className="space-y-4">
              <h3 className="text-base font-headline font-bold text-indigo-400 border-b border-white/5 pb-2">
                2. AI Search Query Top-Up Package
              </h3>
              
              <div className="bg-white/3 border border-white/5 rounded-3xl p-6 max-w-xl space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[9px] font-headline font-bold text-gray-500 uppercase tracking-wider block mb-1">Booster Query Quantity</label>
                    <input
                      type="number"
                      value={config.topups?.aiSearch?.quantity || 99}
                      onChange={(e) => handleTopupChange("quantity", e.target.value)}
                      className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs w-full text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-headline font-bold text-gray-500 uppercase tracking-wider block mb-1">Booster Cost ({config.currencySymbol})</label>
                    <input
                      type="number"
                      value={config.topups?.aiSearch?.cost || 49}
                      onChange={(e) => handleTopupChange("cost", e.target.value)}
                      className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs w-full text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Progressive Commission Slabs */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="text-base font-headline font-bold text-indigo-400">
                  3. Progressive Deal Commission Slabs (Tax Bracket Model)
                </h3>
                <button
                  onClick={addSlab}
                  className="flex items-center gap-1 text-[10px] font-headline font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Bracket
                </button>
              </div>

              <div className="space-y-3">
                {config.commissionSlabs?.map((slab: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 bg-white/3 border border-white/5 p-4 rounded-2xl max-w-2xl">
                    <span className="text-xs font-headline font-bold text-gray-500 shrink-0 min-w-[50px]">Slab #{idx + 1}</span>
                    
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[8px] font-headline font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Upper Threshold Limit ({config.currency})</label>
                        <input
                          type="number"
                          value={slab.limit}
                          onChange={(e) => handleSlabChange(idx, "limit", e.target.value)}
                          className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 text-xs w-full text-white outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-headline font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Rate Percentage (e.g., 0.20 = 20%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={slab.rate}
                          onChange={(e) => handleSlabChange(idx, "rate", e.target.value)}
                          className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 text-xs w-full text-white outline-none font-mono"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => removeSlab(idx)}
                      disabled={config.commissionSlabs.length <= 1}
                      className="text-red-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-red-500 shrink-0 mt-3.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="border-t border-white/5 pt-8 flex items-center justify-between">
              <p className="text-[10px] text-gray-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Administrative modifications instantly update client limits and calculations.
              </p>
              
              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-headline font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save {selectedRegion} Config</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
