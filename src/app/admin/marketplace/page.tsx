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

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { queryCollection, getDocument } from "@/lib/firestore-rest";
import { MOCK_AGENCIES, MARKETPLACE_CATEGORIES } from "@/lib/marketplace-data";
import Navbar from "@/components/Navbar";
import {
  Building2, ShieldCheck, CheckCircle2, XCircle, Clock, Filter, Search, Loader2, ArrowLeft,
  RefreshCw, AlertCircle, Sparkles, ExternalLink
} from "lucide-react";

export default function AdminMarketplacePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [agencies, setAgencies] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Admin authorization check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
      } else {
        setUser(currentUser);
        try {
          const idToken = await currentUser.getIdToken();
          const userDoc = (await getDocument("users", currentUser.uid, idToken, "default")) as any;
          if (userDoc && (userDoc.isAdmin === true || userDoc.role === "admin")) {
            setIsAdmin(true);
            fetchAgencies(idToken);
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          console.error("Failed admin authorization check:", err);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchAgencies = async (idToken: string) => {
    setFetching(true);
    try {
      const { docs } = await queryCollection("Marketplace_Agencies", idToken, {
        orderByField: "createdAt",
        orderDirection: "DESCENDING"
      });

      // Combine database agencies with mock agencies for full admin visibility
      const combined = [...(docs || []), ...MOCK_AGENCIES.map(a => ({ ...a, status: "approved" }))];
      
      // Deduplicate by ID
      const uniqueMap = new Map<string, any>();
      combined.forEach(item => {
        const key = String((item as any).id || (item as any).__id || Math.random());
        uniqueMap.set(key, item);
      });
      setAgencies(Array.from(uniqueMap.values()));
    } catch (err) {
      console.warn("Failed to fetch Marketplace_Agencies collection:", err);
      setAgencies(MOCK_AGENCIES.map(a => ({ ...a, status: "approved" })));
    } finally {
      setFetching(false);
    }
  };

  const handleToggleAgencyStatus = async (agencyId: string, currentStatus: string, targetStatus: "approved" | "rejected") => {
    if (!user) return;
    setProcessingId(agencyId);
    setFeedbackMessage(null);

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/admin/marketplace/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          adminUid: user.uid,
          agencyId,
          status: targetStatus
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Status update failed.");

      setFeedbackMessage(`Agency ${agencyId} status updated to ${targetStatus.toUpperCase()}!`);
      
      // Update local state instantly
      setAgencies(prev => prev.map(a => a.id === agencyId ? { ...a, status: targetStatus } : a));
    } catch (err: any) {
      setFeedbackMessage(err.message || "Failed to update agency status.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#701010]" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="font-serif font-bold text-xl text-gray-900">Access Denied</h2>
          <p className="text-xs text-gray-600">You must be logged in as an Administrator to access Marketplace Agency Moderation.</p>
          <button
            onClick={() => router.push("/home")}
            className="px-4 py-2 bg-[#701010] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Return to Portal
          </button>
        </div>
      </div>
    );
  }

  const filtered = agencies.filter(item => {
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = (item.name || "").toLowerCase();
      const tagline = (item.tagline || "").toLowerCase();
      const location = (item.location || "").toLowerCase();
      return name.includes(q) || tagline.includes(q) || location.includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-150 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/home")}
                className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="font-serif font-bold text-xl md:text-2xl text-gray-900 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[#701010]" /> Marketplace Agency Moderation Portal
              </h1>
            </div>
            <p className="text-xs text-gray-500 font-headline ml-8">
              Moderate registered agencies, review GST verification state, and toggle approval status anytime.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/admin/verifications")}
              className="px-3.5 py-2 bg-[#701010] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#580d0d] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Open KYC Queue
            </button>
            <button
              onClick={async () => {
                if (user) {
                  const token = await user.getIdToken();
                  fetchAgencies(token);
                }
              }}
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-headline font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetching ? "animate-spin" : ""}`} /> Refresh List
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
            <span>{feedbackMessage}</span>
            <button onClick={() => setFeedbackMessage(null)} className="text-emerald-600 font-bold">Dismiss</button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-headline font-bold uppercase text-gray-500">Filter Status:</span>
            <div className="flex gap-1">
              {["all", "approved", "pending_admin_approval", "rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    filterStatus === st
                      ? "bg-[#701010] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {st === "all" ? "All" : st === "approved" ? "Approved 🛡️" : st === "pending_admin_approval" ? "Pending ⏳" : "Rejected ❌"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search agency name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010]"
            />
          </div>
        </div>

        {/* Agency Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fetching ? (
            <div className="col-span-full py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-150">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#701010]" />
              <p className="text-xs font-headline">Loading marketplace agencies...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-150 space-y-2">
              <Building2 className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-gray-900">No Agencies Found</h3>
              <p className="text-xs text-gray-500">No registered marketplace listings match your current filters.</p>
            </div>
          ) : (
            filtered.map((agency) => {
              const catInfo = MARKETPLACE_CATEGORIES.find(c => c.id === agency.category) || MARKETPLACE_CATEGORIES[0];
              const isCurrentlyApproved = agency.status === "approved" || !agency.status;

              return (
                <div
                  key={agency.id}
                  className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex flex-col justify-between space-y-4 hover:border-gray-200 transition-all"
                >
                  <div className="space-y-3">
                    
                    {/* Category & Status Bar */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-headline font-bold text-gray-700">
                        <span>{catInfo.icon}</span> <span>{catInfo.shortName}</span>
                      </span>

                      {isCurrentlyApproved ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-headline font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved 🛡️
                        </span>
                      ) : agency.status === "pending_admin_approval" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-headline font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending Approval ⏳
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-headline font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                          <XCircle className="w-3 h-3 text-red-600" /> Rejected ❌
                        </span>
                      )}
                    </div>

                    {/* Agency Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-lg text-gray-900 leading-snug">{agency.name}</h3>
                        {agency.verified && (
                          <span title="GST Verified Entity">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-sans">{agency.location} • {agency.region}</p>
                    </div>

                    <p className="text-xs text-gray-700 font-headline font-medium line-clamp-2 leading-relaxed">
                      &quot;{agency.tagline}&quot;
                    </p>

                  </div>

                  {/* Admin Moderation Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-gray-400 font-sans">
                      {agency.verified ? "GST Verified 🛡️" : "Manual KYC / Unverified"}
                    </span>

                    <div className="flex items-center gap-2">
                      {isCurrentlyApproved ? (
                        <button
                          onClick={() => handleToggleAgencyStatus(agency.id, agency.status, "rejected")}
                          disabled={processingId === agency.id}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-headline font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Revoke / Reject
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleAgencyStatus(agency.id, agency.status, "approved")}
                          disabled={processingId === agency.id}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve Listing
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </main>
    </div>
  );
}
