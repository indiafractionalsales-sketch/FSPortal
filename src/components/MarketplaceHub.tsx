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

import React, { useState, useRef } from "react";
import {
  Search, ShieldCheck, MapPin, ExternalLink, Star, Filter,
  Building2, ArrowRight, MessageSquare, Plus, Sparkles, CheckCircle2, Bookmark,
  ChevronLeft, ChevronRight
} from "lucide-react";
import {
  MARKETPLACE_CATEGORIES,
  MOCK_AGENCIES,
  MarketplaceAgency,
  MarketplaceCategoryId
} from "@/lib/marketplace-data";
import AgencyInquiryDrawer from "@/components/AgencyInquiryDrawer";
import AgencyRegistrationDrawer from "@/components/AgencyRegistrationDrawer";

interface MarketplaceHubProps {
  activeCategory: MarketplaceCategoryId;
  onSelectCategory: (catId: MarketplaceCategoryId) => void;
  userEmail?: string;
  userName?: string;
  userType?: string;
}

export default function MarketplaceHub({
  activeCategory,
  onSelectCategory,
  userEmail = "",
  userName = "",
  userType = ""
}: MarketplaceHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedAgencyForInquiry, setSelectedAgencyForInquiry] = useState<MarketplaceAgency | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [savedAgencyIds, setSavedAgencyIds] = useState<Set<string>>(new Set());

  const scrollChipsRef = useRef<HTMLDivElement>(null);

  const handleScrollChips = (direction: "left" | "right") => {
    if (scrollChipsRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      scrollChipsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Get current category info
  const categoryInfo = MARKETPLACE_CATEGORIES.find((cat) => cat.id === activeCategory) || MARKETPLACE_CATEGORIES[0];

  // Filter agencies
  const filteredAgencies = MOCK_AGENCIES.filter((agency) => {
    // Category match
    if (agency.category !== activeCategory) return false;

    // Verified match
    if (onlyVerified && !agency.isVerified) return false;

    // Region match
    if (selectedRegion !== "All" && agency.region !== selectedRegion) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = agency.name.toLowerCase().includes(q);
      const matchTag = agency.tag.toLowerCase().includes(q);
      const matchDesc = agency.description.toLowerCase().includes(q);
      const matchLocation = agency.location.toLowerCase().includes(q);
      const matchSpecialty = agency.specialties.some((s) => s.toLowerCase().includes(q));
      return matchName || matchTag || matchDesc || matchLocation || matchSpecialty;
    }

    return true;
  });

  const toggleSaveAgency = (agencyId: string) => {
    setSavedAgencyIds((prev) => {
      const next = new Set(prev);
      if (next.has(agencyId)) next.delete(agencyId);
      else next.add(agencyId);
      return next;
    });
  };

  return (
    <div className="w-full space-y-5">
      
      {/* Category Hero Banner */}
      <div className={`w-full rounded-2xl p-6 bg-gradient-to-r ${categoryInfo.color} text-white shadow-md relative overflow-hidden`}>
        {/* Subtle background decoration circles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-xs font-headline font-bold uppercase tracking-wider">
              <span>{categoryInfo.icon}</span>
              <span>Marketplace Category</span>
            </div>
            <h2 className="font-serif font-bold text-xl md:text-2xl tracking-tight leading-tight">
              {categoryInfo.name}
            </h2>
            <p className="text-xs md:text-sm text-white/90 font-sans leading-relaxed">
              {categoryInfo.description}
            </p>
          </div>

          {userType === "tpsp" && (
            <button
              onClick={() => setIsRegistrationOpen(true)}
              className="flex-shrink-0 self-start md:self-center px-4 py-2.5 bg-white text-gray-900 hover:bg-gray-100 font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#701010]" /> List Your Agency
            </button>
          )}
        </div>
      </div>

      {/* Toolbar: Category Chips, Search & Filters */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">
        
        {/* Category Horizontal Quick Switcher with Smooth Nav & Hidden Scrollbars */}
        <div className="relative flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleScrollChips("left")}
            className="hidden md:flex p-1 text-gray-400 hover:text-[#701010] hover:bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0 transition-colors cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={scrollChipsRef}
            className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar scroll-smooth w-full"
          >
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#701010] text-white shadow-sm"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-150"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.shortName}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleScrollChips("right")}
            className="hidden md:flex p-1 text-gray-400 hover:text-[#701010] hover:bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0 transition-colors cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Filter Inputs Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${categoryInfo.shortName} agencies...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#701010] focus:bg-white transition-all"
            />
          </div>

          {/* Region Dropdown & Verified Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            
            {/* Region Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#701010] transition-all font-headline"
              >
                <option value="All">All Regions</option>
                <option value="Asia Pacific">Asia Pacific</option>
                <option value="Europe">Europe</option>
                <option value="North America">North America</option>
                <option value="Middle East">Middle East</option>
                <option value="Latin America">Latin America</option>
              </select>
            </div>

            {/* Verified Switch */}
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-headline font-bold uppercase tracking-wider transition-all cursor-pointer ${
                onlyVerified
                  ? "bg-sky-50 border-sky-300 text-sky-800"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${onlyVerified ? "text-sky-600" : "text-gray-400"}`} />
              <span>Verified Only</span>
            </button>

          </div>

        </div>

      </div>

      {/* Agency Grid */}
      {filteredAgencies.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h4 className="font-serif font-bold text-lg text-gray-900">No Agencies Found</h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            No agencies matched your search filters under <strong>{categoryInfo.name}</strong>. Try clearing search keywords or selecting another region.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedRegion("All");
              setOnlyVerified(false);
            }}
            className="px-4 py-2 bg-[#701010]/10 text-[#701010] font-headline font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#701010]/15 transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAgencies.map((agency) => {
            const isSaved = savedAgencyIds.has(agency.id);

            return (
              <div
                key={agency.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover:border-gray-200"
              >
                {/* Top Row: Logo, Info & Save Bookmark */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl ${agency.logoBg} flex-shrink-0 flex items-center justify-center text-white font-bold shadow-sm`}>
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-serif font-bold text-base text-gray-900 leading-snug group-hover:text-[#701010] transition-colors">
                            {agency.name}
                          </h4>
                          {agency.isVerified && (
                            <span className="inline-flex items-center gap-0.5 text-[8px] font-headline font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded-full" title="Verified Partner">
                              <ShieldCheck className="w-3 h-3 text-sky-600" /> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-450 flex items-center gap-1 mt-0.5">
                          <span>📍 {agency.location}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-[#701010]">{agency.tag}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveAgency(agency.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isSaved ? "text-amber-500 bg-amber-50" : "text-gray-300 hover:text-gray-600 hover:bg-gray-50"
                      }`}
                      title={isSaved ? "Saved Agency" : "Save Agency"}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Tagline & Description */}
                  <p className="text-xs text-gray-700 font-sans leading-relaxed line-clamp-2">
                    {agency.description}
                  </p>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {agency.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Key Metrics & Action Button */}
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  
                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 bg-gray-50/70 p-2.5 rounded-xl text-center">
                    <div>
                      <p className="text-[9px] font-headline font-bold text-gray-400 uppercase tracking-widest">Projects</p>
                      <p className="text-xs font-serif font-bold text-gray-900 mt-0.5">{agency.stats.projectsDone}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-headline font-bold text-gray-400 uppercase tracking-widest">Response</p>
                      <p className="text-xs font-serif font-bold text-gray-900 mt-0.5">{agency.stats.avgResponse}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-headline font-bold text-gray-400 uppercase tracking-widest">Rating</p>
                      <p className="text-xs font-serif font-bold text-amber-600 mt-0.5 flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {agency.rating}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAgencyForInquiry(agency)}
                      className="flex-1 py-2 px-3 bg-[#701010] hover:bg-[#580d0d] text-white font-headline font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Request Quote / Connect
                    </button>
                    
                    <a
                      href={`https://${agency.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-gray-200 text-gray-700 hover:text-[#701010] hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-center"
                      title={`Visit ${agency.name} Website`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Proposal Inquiry Drawer */}
      <AgencyInquiryDrawer
        isOpen={!!selectedAgencyForInquiry}
        onClose={() => setSelectedAgencyForInquiry(null)}
        agency={selectedAgencyForInquiry}
        userEmail={userEmail}
        userName={userName}
      />

      {/* Registration Drawer */}
      <AgencyRegistrationDrawer
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />

    </div>
  );
}
