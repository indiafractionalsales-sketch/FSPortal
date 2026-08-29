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
import Navbar from "@/components/Navbar";
import {
  ShieldCheck, Clock, CheckCircle2, XCircle, Filter, Search, Loader2, ArrowLeft,
  Building2, FileText, AlertCircle, RefreshCw
} from "lucide-react";

export default function AdminVerificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [verifications, setVerifications] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Verification user check
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
            fetchVerifications(idToken);
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

  const fetchVerifications = async (idToken: string) => {
    setFetching(true);
    try {
      const { docs: indiaDocs } = await queryCollection("Verifications", idToken, {
        orderByField: "verifiedAt",
        orderDirection: "DESCENDING",
        databaseId: "fsindiadb"
      }).catch(() => ({ docs: [] }));

      const { docs: globalDocs } = await queryCollection("Verifications", idToken, {
        orderByField: "verifiedAt",
        orderDirection: "DESCENDING",
        databaseId: "default"
      }).catch(() => ({ docs: [] }));

      const combinedMap = new Map<string, any>();
      [...(indiaDocs || []), ...(globalDocs || [])].forEach(item => {
        const key = String((item as any).id || (item as any).__id || Math.random());
        combinedMap.set(key, item);
      });

      setVerifications(Array.from(combinedMap.values()));
    } catch (err) {
      console.warn("Failed to fetch Verifications collection:", err);
      setVerifications([]);
    } finally {
      setFetching(false);
    }
  };

  const handleApproveOrReject = async (verificationId: string, targetUid: string, action: "approve" | "reject") => {
    if (!user) return;
    setProcessingId(verificationId);
    setFeedbackMessage(null);

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/admin/verifications/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          adminUid: user.uid,
          verificationId,
          targetUid,
          action
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed.");

      setFeedbackMessage(`Request ${action === "approve" ? "Approved" : "Rejected"} successfully.`);
      fetchVerifications(idToken);
    } catch (err: any) {
      setFeedbackMessage(err.message || "Failed to update status.");
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
          <p className="text-xs text-gray-600">You must be logged in as an Administrator to view the KYC Verification Centre.</p>
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

  const filtered = verifications.filter(item => {
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const legalName = (item.summary?.legalName || "").toLowerCase();
      const identifier = (item.identifier || "").toLowerCase();
      const uid = (item.uid || "").toLowerCase();
      return legalName.includes(q) || identifier.includes(q) || uid.includes(q);
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
                <ShieldCheck className="w-6 h-6 text-[#701010]" /> Verification & KYC Approval Centre
              </h1>
            </div>
            <p className="text-xs text-gray-500 font-headline ml-8">
              Review, approve, or reject business identity submissions & manual GST exemption queues.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (user) {
                  const token = await user.getIdToken();
                  fetchVerifications(token);
                }
              }}
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-headline font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetching ? "animate-spin" : ""}`} /> Refresh Queue
            </button>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedbackMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
            <span>{feedbackMessage}</span>
            <button onClick={() => setFeedbackMessage(null)} className="text-emerald-600 font-bold">Dismiss</button>
          </div>
        )}

        {/* Toolbar: Filters & Search */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-headline font-bold uppercase text-gray-500">Filter Status:</span>
            <div className="flex gap-1">
              {["all", "pending_admin_approval", "approved", "rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    filterStatus === st
                      ? "bg-[#701010] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {st === "all" ? "All" : st === "pending_admin_approval" ? "Pending ⏳" : st === "approved" ? "Approved 🛡️" : "Rejected ❌"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search legal name or GSTIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010]"
            />
          </div>
        </div>

        {/* Queue List */}
        <div className="bg-white border border-gray-150 rounded-2xl shadow-xs overflow-hidden">
          {fetching ? (
            <div className="py-16 text-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#701010]" />
              <p className="text-xs font-headline">Loading verification records...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-gray-900">Queue is Clear</h3>
              <p className="text-xs text-gray-500">No verification requests matching your filter criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <div key={item.id} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors">
                  
                  {/* Entity Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-sm text-gray-900">
                        {item.summary?.legalName || item.identifier || "Business Candidate"}
                      </span>

                      {item.status === "approved" ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved 🛡️
                        </span>
                      ) : item.status === "pending_admin_approval" ? (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending Approval ⏳
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-red-600" /> Rejected ❌
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-sans">
                      <span><strong>Type:</strong> {item.verificationType === "gst_india" ? "Auto GST (India)" : "Manual Non-GST"}</span>
                      <span><strong>ID / GSTIN:</strong> <code className="font-mono text-gray-700 bg-gray-100 px-1 py-0.5 rounded">{item.identifier}</code></span>
                      <span><strong>Role:</strong> <span className="uppercase text-gray-700 font-bold">{item.role || "SP"}</span></span>
                      <span><strong>Submitted:</strong> {item.verifiedAt ? new Date(item.verifiedAt).toLocaleDateString() : "Recent"}</span>
                    </div>

                    {item.summary?.notes && (
                      <p className="text-xs text-gray-600 bg-gray-50 border border-gray-150 p-2 rounded-lg mt-1 italic">
                        &quot;{item.summary.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApproveOrReject(item.id, item.uid, "approve")}
                      disabled={processingId === item.id}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleApproveOrReject(item.id, item.uid, "reject")}
                      disabled={processingId === item.id}
                      className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
