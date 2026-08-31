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
import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle, ShoppingBag } from "lucide-react";
import { MARKETPLACE_CATEGORIES, MarketplaceCategoryId } from "@/lib/marketplace-data";

interface LeftSidebarProps {
  user: any;
  userType: string;
  spData: any;
  oboData: any;
  tpspData: any;
  planName: string;
  feedTab?: string;
  setFeedTab?: (tab: any) => void;
  mobileTab?: string;
  setMobileTab?: (tab: "profile" | "feed" | "discover") => void;
  className?: string; // To allow layout adjustments from parent
  isMarketplaceActive?: boolean;
  setIsMarketplaceActive?: (active: boolean) => void;
  activeMarketplaceCategory?: MarketplaceCategoryId;
  setActiveMarketplaceCategory?: (cat: MarketplaceCategoryId) => void;
  onOpenAgencyRegistration?: () => void;
}

export default function LeftSidebar({
  user,
  userType,
  spData,
  oboData,
  tpspData,
  planName,
  feedTab = "global",
  setFeedTab,
  mobileTab,
  setMobileTab,
  className = "",
  isMarketplaceActive = false,
  setIsMarketplaceActive,
  activeMarketplaceCategory = "biz_dev",
  setActiveMarketplaceCategory,
  onOpenAgencyRegistration
}: LeftSidebarProps) {
  const router = useRouter();

  const handleFeedTabClick = (tab: "global" | "mine" | "deals") => {
    if (setIsMarketplaceActive) setIsMarketplaceActive(false);
    if (setFeedTab) setFeedTab(tab);
    if (setMobileTab) setMobileTab("feed");
    // If we're not on the home page, redirect to home and let it handle the feed tab
    if (typeof window !== 'undefined' && window.location.pathname !== "/home") {
      router.push("/home");
    }
  };

  const handleMarketplaceClick = () => {
    if (setIsMarketplaceActive) setIsMarketplaceActive(true);
    if (setMobileTab) setMobileTab("feed");
    if (typeof window !== 'undefined' && window.location.pathname !== "/home") {
      router.push("/home");
    }
  };

  const handleBackToMainMenu = () => {
    if (setIsMarketplaceActive) setIsMarketplaceActive(false);
    if (setFeedTab) setFeedTab("global");
    if (setMobileTab) setMobileTab("feed");
  };

  const handleCategoryClick = (catId: MarketplaceCategoryId) => {
    if (setActiveMarketplaceCategory) setActiveMarketplaceCategory(catId);
    if (setMobileTab) setMobileTab("feed");
  };

  const getPersonaLabel = () => {
    if (userType === "obo") return "Overseas Business Owner";
    if (userType === "sp") return "Sales Partner";
    if (userType === "tpsp") return "Service Provider";
    if (oboData && (oboData.brandName || oboData.logo)) return "Overseas Business Owner";
    if (tpspData && (tpspData.companyName || tpspData.logo)) return "Service Provider";
    return "Sales Partner";
  };

  const getProfileName = () => {
    if (spData?.fullName) return spData.fullName;
    if (oboData?.brandName) return oboData.brandName;
    if (tpspData?.companyName) return tpspData.companyName;
    if (user?.displayName) return user.displayName;
    return "Partner User";
  };

  return (
    <div className={`w-full md:w-[300px] xl:w-[320px] 2xl:w-[360px] flex-shrink-0 ${mobileTab === 'profile' ? 'flex' : (mobileTab ? 'hidden' : 'flex')} md:flex flex-col overflow-y-auto p-4 custom-scrollbar bg-white/50 gap-4 border-r border-gray-100 ${className}`}>
      
      {/* Profile Header (Banner, Avatar, Persona Pill) */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex-shrink-0">
        {/* Banner */}
        <div className="h-16 bg-[#701010] relative overflow-hidden">
          {(oboData?.banner || spData?.banner || tpspData?.banner) && (
            <img src={oboData.banner || spData.banner || tpspData.banner} alt="Banner" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Avatar & Persona Pill */}
        <div className="px-4 pb-3">
          <div className="relative -mt-8 flex items-end justify-between">
            {spData?.profilePhoto ? (
              <img
                src={spData.profilePhoto}
                alt="Profile"
                className="w-16 h-16 rounded-full border-4 border-white shadow-sm object-cover"
              />
            ) : oboData?.logo || tpspData?.logo ? (
              <img
                src={oboData.logo || tpspData.logo}
                alt="Profile"
                className="w-16 h-16 rounded-full border-4 border-white shadow-sm object-cover"
              />
            ) : user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-16 h-16 rounded-full border-4 border-white shadow-sm object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-gray-800 font-bold text-xl shadow-sm">
                {user?.email?.charAt(0).toUpperCase() ?? "P"}
              </div>
            )}
          </div>

          <div className="mt-2.5">
            <h3 className="font-serif font-bold text-sm text-gray-900 truncate">{getProfileName()}</h3>
            <div className="mt-1">
              <span className="inline-flex items-center text-[9.5px] font-headline font-bold text-[#701010] bg-[#701010]/8 border border-[#701010]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-2xs">
                {getPersonaLabel()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Sidebar Content: Marketplace Mode vs Standard Mode */}
      {isMarketplaceActive ? (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-3.5 py-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* Sticky Back Button Header */}
            <button
              onClick={handleBackToMainMenu}
              className="w-full flex items-center gap-2 px-2.5 py-2 mb-3 bg-[#701010]/5 hover:bg-[#701010]/10 text-[#701010] font-headline font-bold text-xs uppercase tracking-wider rounded-lg transition-all border border-[#701010]/15 group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Main Menu</span>
            </button>

            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 px-1">
              <h4 className="text-xs font-headline font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#701010]" /> Marketplace
              </h4>
              <span className="text-[9px] font-headline font-bold text-[#701010] bg-[#701010]/10 px-1.5 py-0.5 rounded">
                {MARKETPLACE_CATEGORIES.length} Categories
              </span>
            </div>

            {/* Category Tabs */}
            <ul className="space-y-1 custom-scrollbar">
              {MARKETPLACE_CATEGORIES.map((cat) => {
                const isActive = activeMarketplaceCategory === cat.id;

                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 transition-all rounded-lg text-left cursor-pointer ${
                        isActive
                          ? "bg-blue-50/90 border-l-4 border-blue-600 text-blue-950 font-bold shadow-xs"
                          : "hover:bg-gray-50 text-gray-700 border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-1">
                        <span className="text-sm flex-shrink-0">{cat.icon}</span>
                        <span className={`text-[12px] font-headline leading-tight ${isActive ? "text-blue-950 font-bold" : "font-semibold"}`}>
                          {cat.shortName}
                        </span>
                      </div>
                      <span className={`text-[9px] font-headline font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                        isActive ? "bg-blue-200/80 text-blue-900" : "bg-gray-100 text-gray-500"
                      }`}>
                        {cat.badgeCount}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Register CTA (Only visible for Third-Party Service Providers) */}
          {userType === "tpsp" && onOpenAgencyRegistration && (
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={onOpenAgencyRegistration}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-[#701010]/5 border border-gray-200 hover:border-[#701010]/30 text-gray-800 hover:text-[#701010] transition-all rounded-lg text-xs font-headline font-bold uppercase tracking-wider cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#701010]" /> Register Agency
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Standard Quick Links Mode */
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-4 flex-1">
          <h4 className="text-xs font-headline font-bold text-gray-900 uppercase tracking-widest pb-1.5 mb-3 border-b border-gray-50">Quick Links</h4>
          <ul className="space-y-1.5">
            <li>
              <button onClick={() => handleFeedTabClick("global")} className={`w-full flex items-center gap-2.5 px-2 py-2 transition-all rounded-lg text-left ${feedTab === "global" && !isMarketplaceActive ? "bg-[#701010]/5 text-[#701010]" : "hover:bg-gray-50 text-gray-700"}`}>
                <span className="text-base">🌍</span>
                <span className="text-xs font-headline font-bold uppercase tracking-wider">Global Feed</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleFeedTabClick("mine")} className={`w-full flex items-center gap-2.5 px-2 py-2 transition-all rounded-lg text-left ${feedTab === "mine" && !isMarketplaceActive ? "bg-[#701010]/5 text-[#701010]" : "hover:bg-gray-50 text-gray-700"}`}>
                <span className="text-base">📝</span>
                <span className="text-xs font-headline font-bold uppercase tracking-wider">My Posts</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleFeedTabClick("deals")} className={`w-full flex items-center gap-2.5 px-2 py-2 transition-all rounded-lg text-left ${feedTab === "deals" && !isMarketplaceActive ? "bg-[#701010]/5 text-[#701010]" : "hover:bg-gray-50 text-gray-700"}`}>
                <span className="text-base">💼</span>
                <span className="text-xs font-headline font-bold uppercase tracking-wider">My Deals</span>
              </button>
            </li>

            {/* Marketplace Entry Button */}
            <li>
              <button 
                onClick={handleMarketplaceClick} 
                className="w-full flex items-center justify-between px-2 py-2 bg-gradient-to-r from-[#701010]/10 to-amber-50 hover:from-[#701010]/15 hover:to-amber-100 border border-[#701010]/20 text-[#701010] transition-all rounded-lg text-left cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🛍️</span>
                  <span className="text-xs font-headline font-bold uppercase tracking-wider text-[#701010]">Marketplace</span>
                </div>
                <span className="text-[9px] font-headline font-bold uppercase tracking-widest bg-[#701010] text-white px-1.5 py-0.5 rounded shadow-xs">
                  New
                </span>
              </button>
            </li>

            {/* Lead Inbox & Messages Link */}
            <li>
              <button 
                onClick={() => router.push('/messages')} 
                className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 hover:text-[#701010] transition-all rounded-lg text-left text-gray-700 cursor-pointer"
              >
                <span className="text-base">💬</span>
                <span className="text-xs font-headline font-bold uppercase tracking-wider">Lead Messages Inbox</span>
              </button>
            </li>

            <li>
              <button 
                onClick={() => router.push('/networking')} 
                className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 hover:text-[#701010] transition-all rounded-lg text-left text-gray-700"
              >
                <span className="text-base">✨</span>
                <span className="text-xs font-headline font-bold uppercase tracking-wider">AI Powered Networking</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => router.push('/pricing')} 
                className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 hover:text-[#701010] transition-all rounded-lg text-left text-gray-700"
              >
                <span className="text-base">💳</span>
                <span className="text-xs font-headline font-bold uppercase tracking-wider">Plans & Subscriptions</span>
              </button>
            </li>
          </ul>
        </div>
      )}

    </div>
  );
}
