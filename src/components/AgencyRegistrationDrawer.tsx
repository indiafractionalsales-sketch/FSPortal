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
import { X, Building2, CheckCircle2, PlusCircle, Globe, Shield, Sparkles, Upload, Calendar, EyeOff, Edit3 } from "lucide-react";
import { MARKETPLACE_CATEGORIES, MarketplaceCategoryId } from "@/lib/marketplace-data";

import BusinessVerificationWidget from "@/components/BusinessVerificationWidget";
import { auth } from "@/lib/firebase";
import { getDocument } from "@/lib/firestore-rest";
import {
  registerAgencyListing,
  updateAgencyListing,
  checkDuplicateListing,
  MarketplaceAgency
} from "@/lib/marketplace-service";

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
  const [existingListingId, setExistingListingId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [name, setName] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [category, setCategory] = useState<MarketplaceCategoryId>("biz_dev");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState<"Asia Pacific" | "Europe" | "North America" | "Middle East" | "Latin America" | "Global">("Asia Pacific");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [completedProjects, setCompletedProjects] = useState<number>(10);
  const [bookingUrl, setBookingUrl] = useState("");
  const [status, setStatus] = useState<"approved" | "pending_admin_approval" | "inactive">("approved");
  
  const [isVerified, setIsVerified] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [verifiedBadge, setVerifiedBadge] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDelisting, setIsDelisting] = useState(false);

  // Load current user verification status & check for existing agency listing
  useEffect(() => {
    async function loadUserDataAndCheckExisting() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          
          // 1. User verification status
          const userDoc = (await getDocument("users", currentUser.uid, idToken)) as any;
          if (userDoc) {
            setIsVerified(userDoc.isVerified === true);
            setVerificationStatus(userDoc.verificationStatus || "");
            setVerifiedBadge(userDoc.verifiedBadge || "");
          }

          // 2. Check for duplicate listing in the selected category
          const existing = await checkDuplicateListing(currentUser.uid, category, idToken);
          if (existing) {
            setExistingListingId(existing.id || existing.__id || null);
            setIsEditMode(true);
            setName(existing.name || "");
            setLocation(existing.location || "");
            setRegion(existing.region as any || "Asia Pacific");
            setTagline(existing.tagline || "");
            setDescription(existing.description || "");
            setWebsite(existing.website || "");
            setSpecialties((existing.specialties || []).join(", "));
            setCompletedProjects(existing.completedProjects || 10);
            setLogoPreview(existing.logoUrl || "");
            setBookingUrl(existing.bookingUrl || "");
            setStatus(existing.status as any || "approved");
          } else {
            setExistingListingId(null);
            setIsEditMode(false);
          }
        } catch (err) {
          console.warn("Failed to load user verification or check existing agency:", err);
        }
      }
    }
    if (isOpen) {
      loadUserDataAndCheckExisting();
    }
  }, [isOpen, category]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        const finalStatus = isVerified ? "approved" : "pending_admin_approval";

        const agencyPayload: Partial<MarketplaceAgency> = {
          name,
          category,
          location,
          region,
          tagline,
          description,
          website,
          specialties: specialties.split(/[;,]/).map(s => s.trim()).filter(Boolean),
          completedProjects: Number(completedProjects) || 10,
          ownerUid: currentUser.uid,
          ownerEmail: currentUser.email || "",
          logoUrl: logoPreview,
          bookingUrl,
          isVerified,
          status: finalStatus
        };

        if (existingListingId) {
          await updateAgencyListing(existingListingId, agencyPayload, idToken);
        } else {
          await registerAgencyListing(agencyPayload, idToken);
        }
      }
    } catch (err) {
      console.warn("Error saving agency registration:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    }
  };

  const handleToggleDelist = async () => {
    if (!existingListingId) return;
    setIsDelisting(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        const newStatus = status === "inactive" ? (isVerified ? "approved" : "pending_admin_approval") : "inactive";
        await updateAgencyListing(existingListingId, { status: newStatus }, idToken);
        setStatus(newStatus);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.warn("Error toggling delist status:", err);
    } finally {
      setIsDelisting(false);
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
              {isEditMode ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-gray-900 leading-tight">
                {isEditMode ? "Edit Agency Listing" : "Register Your Agency"}
              </h3>
              <p className="text-xs text-gray-500 font-headline">
                {isEditMode ? "Update your agency profile & settings" : "List your service on the Global Fractional Marketplace"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
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
              <h4 className="font-serif font-bold text-xl text-gray-900">
                {isEditMode ? "Listing Updated Successfully" : "Listing Submitted for Verification"}
              </h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                {isEditMode
                  ? `Your changes to ${name} have been saved.`
                  : `Thank you! Your agency listing for ${name} has been submitted. Our marketplace verification team will review your business credentials.`}
              </p>
              <button
                onClick={handleClose}
                className="w-full py-2.5 bg-[#701010] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#580d0d] transition-all cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {isEditMode && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-headline text-amber-900">
                    <Edit3 className="w-4 h-4 text-amber-700" />
                    <span>Existing listing found for this category. You are in <strong>Edit Mode</strong>.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleDelist}
                    disabled={isDelisting}
                    className="px-2.5 py-1 bg-white border border-amber-300 hover:bg-amber-100 rounded-lg text-[11px] font-headline font-bold text-amber-800 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <EyeOff className="w-3 h-3" />
                    {status === "inactive" ? "Re-publish" : "Unpublish"}
                  </button>
                </div>
              )}
              
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

              {/* Agency Logo Upload */}
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

              {/* Website & Booking Link */}
              <div className="grid grid-cols-2 gap-3">
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

                <div className="space-y-1.5">
                  <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Discovery Call Link</span>
                    <span className="text-[10px] text-gray-400 font-normal normal-case">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="Calendly / Google Meet link"
                      value={bookingUrl}
                      onChange={(e) => setBookingUrl(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Core Specialties & Completed Projects Track Record */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                    Key Specialties (Semicolon or Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Duty Drawback, Tariff Advisory"
                    value={specialties}
                    onChange={(e) => setSpecialties(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-headline font-bold text-gray-900 uppercase tracking-wider">
                    Projects Done
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={completedProjects}
                    onChange={(e) => setCompletedProjects(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
                  />
                </div>
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
                  <>{isEditMode ? "Save Changes" : "Submit Agency for Verification"}</>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}

