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
import { Home, Bell, Settings, LogOut, Scan } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut, type User } from "firebase/auth";
import LeadCaptureInterface from "@/components/LeadCaptureInterface";

interface NavbarProps {
  user?: User | null;
  profileData?: {
    spData?: { profilePhoto?: string; fullName?: string };
    oboData?: { logo?: string; brandName?: string };
    tpspData?: { logo?: string; companyName?: string };
  };
}

export default function Navbar({ user = null, profileData = {} }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  
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

  const profileImage = getProfileImage();
  const profileName = getProfileName();

  return (
    <header className="bg-white h-16 flex-shrink-0 w-full z-50 flex items-center justify-between px-6 border-b border-gray-100">
      {/* Left: Logo */}
      <div className="flex flex-col items-start gap-0 w-1/4">
        <Link href="/home" className="font-serif font-bold text-lg md:text-xl tracking-tighter text-gray-900 flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          Fractional Sales
          <span className="text-[#701010] font-headline text-[10px] uppercase tracking-widest font-bold border border-[#701010]/20 px-1.5 py-0.5 ml-1">
            Portal
          </span>
        </Link>
        <span className="text-[9px] font-sans text-gray-500 italic leading-none mt-[1px]">Every Post is a Business</span>
      </div>

      {/* Center: Nav icons */}
      <div className="flex items-center justify-center gap-1 w-2/4 h-full">
        <button 
          onClick={() => router.push("/home")}
          className={`px-4 md:px-8 h-full border-b-2 transition-colors flex items-center justify-center ${
            pathname === "/home" 
              ? "border-[#701010] text-[#701010]" 
              : "border-transparent text-gray-500 hover:text-[#701010] hover:bg-gray-50"
          }`}
          title="Home"
        >
          <Home className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setIsScanOpen(true)}
          className={`px-4 md:px-8 h-full border-b-2 transition-colors flex items-center justify-center ${
            isScanOpen 
              ? "border-[#701010] text-[#701010]" 
              : "border-transparent text-gray-500 hover:text-[#701010] hover:bg-gray-50"
          }`}
          title="Scan Visiting Card"
        >
          <Scan className="w-5 h-5" />
        </button>
      </div>

      {/* Right: Profile & Actions */}
      <div className="flex items-center justify-end gap-3 w-1/4">
        <button className="w-9 h-9 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors relative">
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
