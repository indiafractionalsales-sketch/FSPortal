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
import { X, Building2, CheckCircle2, PlusCircle, Globe, Shield, Sparkles, Upload } from "lucide-react";
import { MARKETPLACE_CATEGORIES, MarketplaceCategoryId } from "@/lib/marketplace-data";

import BusinessVerificationWidget from "@/components/BusinessVerificationWidget";
import { auth } from "@/lib/firebase";
import { getDocument, setDocument } from "@/lib/firestore-rest";

interface AgencyRegistrationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AgencyRegistrationDrawer({
  isOpen,
  onClose,
  onSuccess
}: AgencyRegistrationDrawerProps) {
  const [name, setName] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [category, setCategory] = useState<MarketplaceCategoryId>("biz_dev");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState<"Asia Pacific" | "Europe" | "North America" | "Middle East" | "Latin America" | "Global">("Asia Pacific");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [specialties, setSpecialties] = useState("");
  
  const [isVerified, setIsVerified] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [verifiedBadge, setVerifiedBadge] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load current user verification status
  useEffect(() => {
    async function loadUserVerification() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          const userDoc = (await getDocument("users", currentUser.uid, idToken, "default")) as any;
          if (userDoc) {
            setIsVerified(userDoc.isVerified === true);
            setVerificationStatus(userDoc.verificationStatus || "");
            setVerifiedBadge(userDoc.verifiedBadge || "");
          }
        } catch (err) {
          console.warn("Failed to load user verification status:", err);
        }
      }
    }
    if (isOpen) {
      loadUserVerification();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        const agencyId = `agency_${currentUser.uid}_${Date.now()}`;
        const newStatus = isVerified ? "approved" : "pending_admin_approval";

        const newAgencyRecord = {
          id: agencyId,
          ownerUid: currentUser.uid,
          name,
          category,
          location,
          country: country || "India",
          region,
          tagline,
          description,
          website,
          specialties: specialties.split(",").map(s => s.trim()).filter(Boolean),
          rating: 5.0,
          reviewCount: 1,
          completedProjects: 0,
          verified: isVerified,
          status: newStatus, // "approved" if GST verified, else "pending_admin_approval"
          createdAt: new Date().toISOString()
        };

        const targetDb = (country === "India" || !country) ? "fsindiadb" : "default";
        await setDocument("Marketplace_Agencies", agencyId, newAgencyRecord, idToken, targetDb);
        if (targetDb !== "default") {
          await setDocument("Marketplace_Agencies", agencyId, newAgencyRecord, idToken, "default");
        }
      }
    } catch (err) {
      console.warn("Error saving agency registration to Firestore:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end transition-opacity duration-300">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#701010] flex items-center justify-center text-white font-bold shadow-sm">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-gray-900 leading-tight">Register Your Agency</h3>
              <p className="text-xs text-gray-500 font-headline">List your service on the Global Fractional Marketplace</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5 custom-scrollbar">

          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-serif font-bold text-xl text-gray-900">Listing Submitted for Verification</h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Thank you! Your agency listing for <strong>{name}</strong> has been submitted. Our marketplace verification team will review your business credentials within 24 hours.
              </p>
              <button
                onClick={handleClose}
                className="w-full py-2.5 bg-[#701010] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#580d0d] transition-all"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Business KYC Verification Section */}
              <BusinessVerificationWidget
                userRole="tpsp"
                isVerified={isVerified}
                verificationStatus={verificationStatus}
                verifiedBadge={verifiedBadge}
                onSuccess={() => {
                  setIsVerified(true);
                  setVerificationStatus("approved");
                }}
              />

              {/* Category Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                  Service Category *
                </label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MarketplaceCategoryId)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
                >
                  {MARKETPLACE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Agency Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                  Agency / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Customs & Clearing Corp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
                />
              </div>

              {/* Agency Logo / Brand Icon Upload (UI Wireframe Provision) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Agency Logo / Brand Thumbnail</span>
                  <span className="text-[10px] text-gray-400 font-normal normal-case">(Optional — distinct from Company logo)</span>
                </label>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 overflow-hidden relative group">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Agency Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg text-xs font-headline font-bold text-gray-700 cursor-pointer transition-all shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-[#701010]" />
                      <span>{logoPreview ? "Change Agency Logo" : "Upload Agency Logo"}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setLogoPreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <p className="text-[10px] text-gray-400 mt-1">PNG, JPG or WebP. Square 1:1 ratio recommended.</p>
                  </div>
                </div>
              </div>

              {/* Location & Region */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                    HQ Location (City, Country) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. London, UK"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                    Operating Region *
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
                  >
                    <option value="Asia Pacific">Asia Pacific</option>
                    <option value="Europe">Europe</option>
                    <option value="North America">North America</option>
                    <option value="Middle East">Middle East</option>
                    <option value="Latin America">Latin America</option>
                    <option value="Global">Global Coverage</option>
                  </select>
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                  One-Line Value Proposition / Tagline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Licensed customs clearance & ICEGATE compliance specialists."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                  Detailed Services Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Summarize your key agency capabilities, experience, target client industries, and track record..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all custom-scrollbar resize-none"
                />
              </div>

              {/* Website */}
              <div className="space-y-1.5">
                <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                  Official Website Domain *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. apexcustoms.in"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
                />
              </div>

              {/* Core Specialties */}
              <div className="space-y-1.5">
                <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                  Key Specialties (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Duty Drawback, Tariff Advisory, Port Clearance"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#701010] hover:bg-[#580d0d] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Submit Agency for Verification</>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
