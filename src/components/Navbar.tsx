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

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, Bell, Settings, LogOut, Scan, CreditCard, Store, Search, Compass, X } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut, type User } from "firebase/auth";
import LeadCaptureInterface from "@/components/LeadCaptureInterface";

interface NavbarProps {
  user?: User | null;
  userType?: string;
  profileData?: {
    spData?: { profilePhoto?: string; fullName?: string };
    oboData?: { logo?: string; brandName?: string };
    tpspData?: { logo?: string; companyName?: string };
  };
  isMarketplaceActive?: boolean;
  onMarketplaceClick?: () => void;
  onHomeClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filterRegion?: string;
  onFilterRegionChange?: (region: string) => void;
  filterIndustry?: string;
  onFilterIndustryChange?: (industry: string) => void;
  filterCommission?: string;
  onFilterCommissionChange?: (type: string) => void;
  onClearFilters?: () => void;
}

export default function Navbar({ 
  user = null, 
  userType = "", 
  profileData = {},
  isMarketplaceActive = false,
  onMarketplaceClick,
  onHomeClick,
  searchQuery = "",
  onSearchChange,
  filterRegion = "",
  onFilterRegionChange,
  filterIndustry = "",
  onFilterIndustryChange,
  filterCommission = "",
  onFilterCommissionChange,
  onClearFilters
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  
  const { spData, oboData, tpspData } = profileData || {};

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getProfileImage = () => {
    if (spData?.profilePhoto) return spData.profilePhoto;
    if (oboData?.logo) return oboData.logo;
    if (tpspData?.logo) return tpspData.logo;
    if (user?.photoURL) return user.photoURL;
    return null;
  };

  const getProfileName = () => {
    if (spData?.fullName) return spData.fullName;
    if (oboData?.brandName) return oboData.brandName;
    if (tpspData?.companyName) return tpspData.companyName;
    if (user?.displayName) return user.displayName;
    return "Partner User";
  };

  const getPersonaLabel = () => {
    if (userType === "obo") return "Overseas Business Owner";
    if (userType === "sp") return "Sales Partner";
    if (userType === "tpsp") return "Service Provider";
    if (oboData && (oboData.brandName || oboData.logo)) return "Overseas Business Owner";
    if (tpspData && (tpspData.companyName || tpspData.logo)) return "Service Provider";
    return "Sales Partner";
  };

  const profileImage = getProfileImage();
  const profileName = getProfileName();
  const personaLabel = getPersonaLabel();

  return (
    <header className="bg-white h-16 flex-shrink-0 w-full z-50 flex items-center justify-between px-6 border-b border-gray-100">
      {/* Left: Logo & Integrated Search Bar */}
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
        <Link href="/home" className="font-serif font-bold text-sm md:text-xl tracking-tighter text-gray-900 flex flex-col items-start hover:opacity-80 transition-opacity flex-shrink-0">
          <div className="flex items-center gap-1">
            <span className="whitespace-nowrap">Fractional Sales</span>
            <span className="hidden md:inline-block text-[#701010] font-headline text-[8px] md:text-[10px] uppercase tracking-widest font-bold border border-[#701010]/20 px-1 py-[1px] md:px-1.5 md:py-0.5 ml-0 md:ml-1 rounded-sm">
              Partner
            </span>
          </div>
          <span className="text-[8px] md:text-[9px] font-sans text-gray-500 italic leading-none mt-[2px] truncate max-w-full">Every Post is a Business Post</span>
        </Link>

        {/* Global Navbar Search Bar & Filter Popover */}
        {onSearchChange && (
          <div className="relative hidden md:flex items-center gap-2 max-w-md w-full ml-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search opportunities by title, region, author..."
                value={searchQuery || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#701010] text-gray-900 transition-all font-sans"
              />
              {searchQuery && (
                <button onClick={() => onSearchChange("")} className="absolute right-2 top-2 text-gray-400 hover:text-gray-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-headline font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                isFilterPopoverOpen || filterRegion || filterIndustry || filterCommission
                  ? "bg-red-50 text-[#701010] border-red-200 shadow-2xs"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> Filter
              {(filterRegion || filterIndustry || filterCommission) && (
                <span className="w-2 h-2 rounded-full bg-[#701010] animate-pulse" />
              )}
            </button>

            {/* Floating Filter Popover */}
            {isFilterPopoverOpen && (
              <div className="absolute top-11 right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-3 font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-headline font-bold uppercase tracking-wider text-gray-900">Filter Opportunities</span>
                  <button onClick={() => setIsFilterPopoverOpen(false)} className="text-gray-400 hover:text-gray-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 mb-1 block">Target Country / Region</label>
                  <select
                    value={filterRegion || ""}
                    onChange={(e) => onFilterRegionChange && onFilterRegionChange(e.target.value)}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-900 outline-none focus:border-[#701010] font-sans"
                  >
                    <option value="">All Regions</option>
                    <option value="United Kingdom">United Kingdom & Europe</option>
                    <option value="United States">United States & North America</option>
                    <option value="India">India & South Asia</option>
                    <option value="Singapore">Singapore & Southeast Asia</option>
                    <option value="United Arab Emirates">UAE & Middle East</option>
                    <option value="Australia">Australia & Oceania</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 mb-1 block">Industry Vertical</label>
                  <select
                    value={filterIndustry || ""}
                    onChange={(e) => onFilterIndustryChange && onFilterIndustryChange(e.target.value)}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-900 outline-none focus:border-[#701010] font-sans"
                  >
                    <option value="">All Industries</option>
                    <option value="Healthcare">Biotech, Pharma & Healthcare</option>
                    <option value="Software">IT, SaaS & Technology</option>
                    <option value="Manufacturing">Industrial & Manufacturing</option>
                    <option value="Consumer">FMCG & Consumer Brands</option>
                    <option value="Consultancy">Business Consultancy</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 mb-1 block">Opportunity Type</label>
                  <select
                    value={filterCommission || ""}
                    onChange={(e) => onFilterCommissionChange && onFilterCommissionChange(e.target.value)}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-900 outline-none focus:border-[#701010] font-sans"
                  >
                    <option value="">All Types</option>
                    <option value="obo">Business Owner Opportunities (OBO)</option>
                    <option value="consultancy">Sales Partner Consultancies</option>
                    <option value="event">Trade Fairs & Expos</option>
                  </select>
                </div>

                {(filterRegion || filterIndustry || filterCommission || searchQuery) && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        if (onClearFilters) onClearFilters();
                      }}
                      className="text-[10px] font-headline font-bold uppercase tracking-wider text-[#701010] hover:underline"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center: Nav icons */}
      <div className="flex items-center justify-center gap-1 flex-shrink-0 h-full">
        {/* 1. Home Feed */}
        <button 
          onClick={() => {
            if (onHomeClick) {
              onHomeClick();
            } else {
              router.push("/home");
            }
          }}
          className={`px-4 md:px-7 h-full border-b-2 transition-colors flex items-center justify-center cursor-pointer ${
            !isMarketplaceActive && pathname === "/home" 
              ? "border-[#701010] text-[#701010]" 
              : "border-transparent text-gray-500 hover:text-[#701010] hover:bg-gray-50"
          }`}
          title="Home Feed"
        >
          <Home className="w-5 h-5" />
        </button>

        {/* 2. Scan Visiting Card */}
        <button 
          onClick={() => setIsScanOpen(true)}
          className={`px-4 md:px-7 h-full border-b-2 transition-colors flex items-center justify-center cursor-pointer ${
            isScanOpen 
              ? "border-[#701010] text-[#701010]" 
              : "border-transparent text-gray-500 hover:text-[#701010] hover:bg-gray-55"
          }`}
          title="Scan Visiting Card"
        >
          <Scan className="w-5 h-5" />
        </button>

        {/* 3. Marketplace Directory */}
        <button 
          onClick={() => {
            if (onMarketplaceClick) {
              onMarketplaceClick();
            } else {
              router.push("/home");
            }
          }}
          className={`px-4 md:px-7 h-full border-b-2 transition-colors flex items-center justify-center cursor-pointer ${
            isMarketplaceActive 
              ? "border-[#701010] text-[#701010]" 
              : "border-transparent text-gray-500 hover:text-[#701010] hover:bg-gray-50"
          }`}
          title="Marketplace Directory"
        >
          <Store className="w-5 h-5" />
        </button>
      </div>

      {/* Right: Profile & Actions */}
      <div className="flex items-center justify-end gap-3 flex-1 min-w-0">
        <button className="hidden md:flex w-9 h-9 hover:bg-gray-100 rounded-full items-center justify-center transition-colors relative">
          <Bell className="w-4 h-4 text-gray-700" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#701010] rounded-full border border-white"></span>
        </button>

        <div className="relative ml-1">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-9 h-9 rounded-full border border-gray-200 overflow-hidden hover:border-gray-400 transition-colors"
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm font-headline">
                {user?.email?.charAt(0).toUpperCase() ?? "P"}
              </div>
            )}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg py-2 z-50 shadow-lg">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex flex-shrink-0 items-center justify-center text-gray-700 font-bold text-base font-headline">
                    {user?.email?.charAt(0).toUpperCase() ?? "P"}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-sm font-serif font-bold text-gray-900 truncate">{profileName}</p>
                  <p className="text-[10px] font-headline text-gray-500 uppercase tracking-wider truncate">{user?.email || ""}</p>
                </div>
              </div>
              <div className="p-1">
                <button
                  onClick={() => { router.push("/profile"); setShowProfileMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-headline font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors rounded-md"
                >
                  <Settings className="w-3.5 h-3.5" />
                  My Profile
                </button>
                <button
                  onClick={() => { router.push("/pricing"); setShowProfileMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-headline font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors rounded-md"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Upgrade & Billing
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs font-headline font-bold uppercase tracking-wider text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-3 transition-colors rounded-md"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <LeadCaptureInterface isOpen={isScanOpen} onClose={() => setIsScanOpen(false)} />
    </header>
  );
}
