"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import {
  Search, Home, Tv, Store, Users, Grid, MessageCircle, Bell,
  Settings, LogOut, MoreHorizontal, ThumbsUp, Share2, Plus,
  Bookmark, Clock, Calendar, Video, ImageIcon, ChevronDown, ChevronUp, Check, X, Phone, Globe, FileText, Briefcase, GraduationCap, Award,
  ChevronLeft, ChevronRight, ExternalLink, Shield, TrendingUp, Compass
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getDocument } from "@/lib/firestore-rest";

export default function HomePage() {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Agency Directory Lists & States with custom branding/logos
  const marketingAgencies = [
    { name: "Global Growth Media", location: "London, UK", desc: "Expert B2B SaaS growth & performance marketing for international scale.", tag: "SaaS & Tech", website: "globalgrowth.io", icon: "TrendingUp", bg: "bg-gradient-to-br from-indigo-500 to-purple-600" },
    { name: "Pacific Brand Architects", location: "Singapore", desc: "Premium brand localization and entry strategy for Southeast Asia.", tag: "Consumer Brands", website: "pacificarchitects.sg", icon: "Compass", bg: "bg-gradient-to-br from-orange-400 to-red-500" },
    { name: "EuroLaunch Partners", location: "Munich, Germany", desc: "European go-to-market strategies, PR, and local compliance.", tag: "Enterprise PR", website: "eurolaunch.de", icon: "Globe", bg: "bg-gradient-to-br from-blue-500 to-cyan-600" }
  ];

  const bizDevAgencies = [
    { name: "Vanguard Sales Group", location: "New York, USA", desc: "Outsourced enterprise sales teams, lead generation, and local rep hire.", tag: "Enterprise Sales", website: "vanguardsales.com", icon: "Award", bg: "bg-gradient-to-br from-emerald-500 to-teal-600" },
    { name: "Asiapoint Business Solutions", location: "Tokyo, Japan", desc: "B2B client acquisition, matchmaking, and local channel management.", tag: "Channel Partners", website: "asiapoint.jp", icon: "Briefcase", bg: "bg-gradient-to-br from-amber-500 to-orange-600" },
    { name: "Aria Outreach Associates", location: "Dubai, UAE", desc: "Direct sales outreach and corporate relationships in MEA region.", tag: "Direct Outreach", website: "ariaoutreach.ae", icon: "Users", bg: "bg-gradient-to-br from-fuchsia-500 to-pink-600" }
  ];

  const legalAgencies = [
    { name: "LexGlobal Consult", location: "Geneva, Switzerland", desc: "Cross-border contract drafting, global entity setup, and IP registry.", tag: "IP & Contracts", website: "lexglobal.ch", icon: "Shield", bg: "bg-gradient-to-br from-slate-700 to-slate-900" },
    { name: "CrossBorder Compliance", location: "Washington DC, USA", desc: "Trade compliance audits, export regulations, and sanctions vetting.", tag: "Trade Law", website: "crossbordercompliance.law", icon: "FileText", bg: "bg-gradient-to-br from-blue-800 to-indigo-950" },
    { name: "IndoPacific Legal Advisory", location: "Sydney, Australia", desc: "Joint-venture agreements, localized employment laws, and tax registry.", tag: "Corporate Law", website: "indopacificlaw.com.au", icon: "GraduationCap", bg: "bg-gradient-to-br from-red-700 to-red-900" }
  ];

  const [activeMarketingIndex, setActiveMarketingIndex] = useState(0);
  const [activeBizDevIndex, setActiveBizDevIndex] = useState(0);
  const [activeLegalIndex, setActiveLegalIndex] = useState(0);

  // Core profile identity states (for displaying avatar/names)
  const [userType, setUserType] = useState<"obo" | "sp" | "tpsp" | "">("");
  const [oboData, setOboData] = useState({
    brandName: "",
    logo: "",
    banner: ""
  });
  const [spData, setSpData] = useState({
    fullName: "",
    profilePhoto: ""
  });
  const [tpspData, setTpspData] = useState({
    companyName: "",
    logo: "",
    banner: ""
  });

  // Monitor auth state changes
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

  // Load basic profile identity from Firestore (for display purposes)
  useEffect(() => {
    if (!user) return;

    const fetchProfiles = async () => {
      try {
        const idToken = await user.getIdToken();

        const userData = await getDocument("users", user.uid, idToken);
        if (userData?.role) {
          setUserType(userData.role as "obo" | "sp" | "tpsp");
          if (userData.role === "obo") {
            const data = await getDocument("OBO_Profile", user.uid, idToken);
            if (data) {
              setOboData({
                brandName: (data.brandName as string) || "",
                logo: (data.logo as string) || "",
                banner: (data.banner as string) || ""
              });
            }
          } else if (userData.role === "sp") {
            const data = await getDocument("SP_Profile", user.uid, idToken);
            if (data) {
              setSpData({
                fullName: (data.fullName as string) || "",
                profilePhoto: (data.profilePhoto as string) || ""
              });
            }
          } else if (userData.role === "tpsp") {
            const data = await getDocument("TPSP_Profile", user.uid, idToken);
            if (data) {
              setTpspData({
                companyName: (data.companyName as string) || "",
                logo: (data.logo as string) || "",
                banner: (data.banner as string) || ""
              });
            }
          }
        } else {
          // Fallback checks
          const oboData = await getDocument("OBO_Profile", user.uid, idToken);
          if (oboData) {
            setUserType("obo");
            setOboData({
              brandName: (oboData.brandName as string) || "",
              logo: (oboData.logo as string) || "",
              banner: (oboData.banner as string) || ""
            });
          } else {
            const spData = await getDocument("SP_Profile", user.uid, idToken);
            if (spData) {
              setUserType("sp");
              setSpData({
                fullName: (spData.fullName as string) || "",
                profilePhoto: (spData.profilePhoto as string) || ""
              });
            } else {
              const tpspData = await getDocument("TPSP_Profile", user.uid, idToken);
              if (tpspData) {
                setUserType("tpsp");
                setTpspData({
                  companyName: (tpspData.companyName as string) || "",
                  logo: (tpspData.logo as string) || "",
                  banner: (tpspData.banner as string) || ""
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading basic profile metadata: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#701010] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#0d0e12] font-body antialiased overflow-hidden h-screen flex flex-col text-sm">
      {/* Top Navbar */}
      <header className="bg-white h-16 flex-shrink-0 w-full z-50 flex items-center justify-between px-6 border-b border-gray-100">
        {/* Left: Logo */}
        <div className="flex flex-col items-start gap-0 w-1/4">
          <Link href="/home" className="font-serif font-bold text-lg md:text-xl tracking-tighter text-gray-900 flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            Fractional Sales
            <span className="text-[#701010] font-headline text-[10px] uppercase tracking-widest font-bold border border-[#701010]/20 px-1.5 py-0.5 ml-1">
              Portal
            </span>
          </Link>
          <span className="text-[9px] font-sans text-gray-500 italic leading-none mt-[1px]">Where Every Post is a Business</span>
        </div>

        {/* Center: Nav icons */}
        <div className="hidden md:flex items-center justify-center gap-1 w-2/4 h-full">
          <button className="px-8 h-full border-b-2 border-[#701010] text-[#701010] hover:bg-gray-55 transition-colors">
            <Home className="w-5 h-5" />
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
              {spData.profilePhoto ? (
                <img src={spData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : oboData.logo || tpspData.logo ? (
                <img src={oboData.logo || tpspData.logo} alt="Profile" className="w-full h-full object-cover" />
              ) : user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm font-headline">
                  {user?.email?.charAt(0).toUpperCase() ?? "P"}
                </div>
              )}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg py-2 z-50 shadow-lg">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                  {spData.profilePhoto ? (
                    <img src={spData.profilePhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                  ) : oboData.logo || tpspData.logo ? (
                    <img src={oboData.logo || tpspData.logo} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                  ) : user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex flex-shrink-0 items-center justify-center text-gray-700 font-bold text-base font-headline">
                      {user?.email?.charAt(0).toUpperCase() ?? "P"}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-serif font-bold text-gray-900 truncate">{spData.fullName || oboData.brandName || tpspData.companyName || user?.displayName || "Partner User"}</p>
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
                    className="w-full text-left px-3 py-2 text-xs font-headline font-bold uppercase tracking-wider text-gray-700 hover:bg-red-55 hover:text-red-700 flex items-center gap-3 transition-colors rounded-md"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Sidebar */}
        <div className="w-[300px] flex-shrink-0 hidden md:flex flex-col overflow-y-auto p-4 custom-scrollbar gap-4 border-r border-gray-100">

          {/* Profile Card */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            {/* Banner */}
            <div className="h-16 bg-[#701010] relative overflow-hidden">
              {(oboData.banner || tpspData.banner) && <img src={oboData.banner || tpspData.banner} alt="Banner" className="w-full h-full object-cover" />}
            </div>

            {/* Avatar */}
            <div className="px-4 pb-4">
              <div className="relative -mt-8 mb-2">
                {spData.profilePhoto ? (
                  <img
                    src={spData.profilePhoto}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-4 border-white shadow-sm object-cover"
                  />
                ) : oboData.logo || tpspData.logo ? (
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

              <button
                onClick={() => router.push("/profile")}
                className="font-serif font-bold text-base text-gray-900 leading-tight hover:text-[#701010] transition-colors cursor-pointer block text-left w-full"
              >
                {spData.fullName || oboData.brandName || tpspData.companyName || user?.displayName || user?.email || "Partner User"}
              </button>
              <p className="text-[10px] font-headline text-gray-500 mt-1 uppercase tracking-wider">
                {userType === "obo" ? "Overseas Business Owner" : userType === "sp" ? "Sales Partner" : userType === "tpsp" ? "Service Provider" : "Configure Profile"}
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-snug">{user?.email || ""}</p>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded-md transition-colors">
                  <span className="text-xs font-headline font-bold text-gray-700 uppercase tracking-wider">Connections</span>
                  <span className="text-xs font-bold text-[#701010] font-headline">248</span>
                </div>
                <div className="flex justify-between items-center py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded-md transition-colors">
                  <span className="text-xs font-headline font-bold text-gray-700 uppercase tracking-wider">Profile views</span>
                  <span className="text-xs font-bold text-[#701010] font-headline">34</span>
                </div>
                <div className="flex justify-between items-center py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded-md transition-colors">
                  <span className="text-xs font-headline font-bold text-gray-700 uppercase tracking-wider">Post impressions</span>
                  <span className="text-xs font-bold text-[#701010] font-headline">1,204</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-4">
            <h4 className="text-xs font-headline font-bold text-gray-900 uppercase tracking-widest pb-1.5 mb-3">Quick Links</h4>
            <ul className="space-y-1.5">
              {[
                { label: 'My Network', icon: '🤝' },
                { label: 'My Deals', icon: '💼' },
                { label: 'Saved Items', icon: '🔖' },
              ].map((item) => (
                <li key={item.label}>
                  <button className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-55 transition-all rounded-lg text-left">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-headline font-bold uppercase tracking-wider text-gray-700">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center Feed Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/50">
          <div className="max-w-[980px] mx-auto space-y-4">

            {/* Share Post Card */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
              <div className="flex gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#701010] flex-shrink-0 flex items-center justify-center text-white font-bold font-headline">
                  {user?.email?.charAt(0).toUpperCase() ?? "P"}
                </div>
                <button className="flex-grow bg-gray-50 hover:bg-gray-100 border border-gray-150 rounded-full px-4 text-left text-gray-500 text-xs transition-colors flex items-center">
                  Start a post about fractional sales...
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <button className="flex items-center gap-2 text-xs font-headline font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                  <span>🖼️</span> Media
                </button>
                <button className="flex items-center gap-2 text-xs font-headline font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                  <span>📅</span> Event
                </button>
                <button className="flex items-center gap-2 text-xs font-headline font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                  <span>📝</span> Write article
                </button>
              </div>
            </div>

            {/* Premium Post Card */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              {/* Post Author info */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#701010] flex items-center justify-center text-white font-serif font-bold text-lg">F</div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-gray-900 leading-tight">Fractional Sales Portal</h3>
                    <p className="text-[9px] font-headline text-gray-500 mt-0.5 uppercase tracking-wider">Official Updates & Insights</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 rounded-full hover:bg-gray-50">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-3">
                <p className="text-gray-800 text-xs leading-relaxed font-sans">
                  Welcome to the premium Fractional Sales Portal! Our mission is to seamlessly bridge the gap between overseas business owners and expert local sales partners. Define your persona settings today to customize your experience.
                </p>
              </div>

              {/* Post Video/Image area */}
              <div className="bg-black w-full aspect-video flex items-center justify-center relative cursor-pointer group">
                <div className="w-full h-full bg-[#16161a] flex flex-col items-center justify-center p-6 relative">
                  <div className="absolute inset-0 bg-radial-gradient opacity-20"></div>
                  <h3 className="text-white font-serif font-bold text-lg md:text-xl mb-6 tracking-tight text-center z-10">The CEO's Risk Mindset</h3>
                  <div className="relative w-28 h-28 bg-[#faf8f5]/10 border border-white/20 flex items-center justify-center group-hover:scale-105 transition-all duration-300 z-10 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-colors shadow">
                      <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white ml-1"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="px-4 py-3 flex items-center justify-between text-gray-500 border-b border-gray-100 mx-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-[#701010] rounded-full flex items-center justify-center"><ThumbsUp className="w-2.5 h-2.5 text-white fill-current" /></div>
                  <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-700 hover:underline cursor-pointer">1.3K Likes</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-700 hover:underline cursor-pointer">12 comments</span>
                  <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-700 hover:underline cursor-pointer">96 shares</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between px-2 py-2 mx-4 gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-700 font-headline font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:text-[#701010] transition-all duration-300 rounded-lg">
                  <ThumbsUp className="w-3.5 h-3.5" /> Like
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-700 font-headline font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:text-[#701010] transition-all duration-300 rounded-lg">
                  <MessageCircle className="w-3.5 h-3.5" /> Comment
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-700 font-headline font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:text-[#701010] transition-all duration-300 rounded-lg">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[300px] flex-shrink-0 hidden lg:block overflow-y-auto p-4 custom-scrollbar border-l border-gray-100 space-y-6">

          {/* Section 1: Overseas Marketing Agencies */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h4 className="text-[10px] font-headline font-bold text-gray-900 uppercase tracking-widest leading-none">Marketing Agencies</h4>
              <div className="flex items-center gap-1 text-gray-400">
                <button
                  onClick={() => setActiveMarketingIndex(prev => (prev === 0 ? marketingAgencies.length - 1 : prev - 1))}
                  className="p-1 hover:text-[#701010] hover:bg-gray-55 rounded transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-headline font-bold text-gray-700 min-w-[24px] text-center">
                  {activeMarketingIndex + 1}/{marketingAgencies.length}
                </span>
                <button
                  onClick={() => setActiveMarketingIndex(prev => (prev === marketingAgencies.length - 1 ? 0 : prev + 1))}
                  className="p-1 hover:text-[#701010] hover:bg-gray-55 rounded transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Logo & Header Info */}
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${marketingAgencies[activeMarketingIndex].bg} flex-shrink-0 flex items-center justify-center text-white shadow-sm`}>
                  {(() => {
                    const IconComp = { TrendingUp, Compass, Globe }[marketingAgencies[activeMarketingIndex].icon];
                    return IconComp ? <IconComp className="w-5 h-5" /> : null;
                  })()}
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-headline font-bold uppercase tracking-widest text-[#701010] bg-red-50/50 border border-red-100/30 px-1.5 py-0.5 rounded">
                    {marketingAgencies[activeMarketingIndex].tag}
                  </span>
                  <h5 className="font-serif font-bold text-sm text-gray-900 mt-1 leading-snug">
                    {marketingAgencies[activeMarketingIndex].name}
                  </h5>
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-450 mt-0.5">
                    📍 {marketingAgencies[activeMarketingIndex].location}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                {marketingAgencies[activeMarketingIndex].desc}
              </p>
              <div className="pt-1.5 border-t border-gray-50">
                <a
                  href={`https://${marketingAgencies[activeMarketingIndex].website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010] hover:underline"
                >
                  <ExternalLink className="w-3 h-3" /> Visit Website
                </a>
              </div>
            </div>
          </div>

          {/* Section 2: Business Development Agencies */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h4 className="text-[10px] font-headline font-bold text-gray-900 uppercase tracking-widest leading-none">Biz Dev Partners</h4>
              <div className="flex items-center gap-1 text-gray-400">
                <button
                  onClick={() => setActiveBizDevIndex(prev => (prev === 0 ? bizDevAgencies.length - 1 : prev - 1))}
                  className="p-1 hover:text-[#701010] hover:bg-gray-55 rounded transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-headline font-bold text-gray-700 min-w-[24px] text-center">
                  {activeBizDevIndex + 1}/{bizDevAgencies.length}
                </span>
                <button
                  onClick={() => setActiveBizDevIndex(prev => (prev === bizDevAgencies.length - 1 ? 0 : prev + 1))}
                  className="p-1 hover:text-[#701010] hover:bg-gray-55 rounded transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Logo & Header Info */}
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${bizDevAgencies[activeBizDevIndex].bg} flex-shrink-0 flex items-center justify-center text-white shadow-sm`}>
                  {(() => {
                    const IconComp = { Award, Briefcase, Users }[bizDevAgencies[activeBizDevIndex].icon];
                    return IconComp ? <IconComp className="w-5 h-5" /> : null;
                  })()}
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-headline font-bold uppercase tracking-widest text-[#701010] bg-red-50/50 border border-red-100/30 px-1.5 py-0.5 rounded">
                    {bizDevAgencies[activeBizDevIndex].tag}
                  </span>
                  <h5 className="font-serif font-bold text-sm text-gray-900 mt-1 leading-snug">
                    {bizDevAgencies[activeBizDevIndex].name}
                  </h5>
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-450 mt-0.5">
                    📍 {bizDevAgencies[activeBizDevIndex].location}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                {bizDevAgencies[activeBizDevIndex].desc}
              </p>
              <div className="pt-1.5 border-t border-gray-50">
                <a
                  href={`https://${bizDevAgencies[activeBizDevIndex].website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010] hover:underline"
                >
                  <ExternalLink className="w-3 h-3" /> Visit Website
                </a>
              </div>
            </div>
          </div>

          {/* Section 3: Overseas Legal Help */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h4 className="text-[10px] font-headline font-bold text-gray-900 uppercase tracking-widest leading-none">Legal Advisors</h4>
              <div className="flex items-center gap-1 text-gray-400">
                <button
                  onClick={() => setActiveLegalIndex(prev => (prev === 0 ? legalAgencies.length - 1 : prev - 1))}
                  className="p-1 hover:text-[#701010] hover:bg-gray-55 rounded transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-headline font-bold text-gray-700 min-w-[24px] text-center">
                  {activeLegalIndex + 1}/{legalAgencies.length}
                </span>
                <button
                  onClick={() => setActiveLegalIndex(prev => (prev === legalAgencies.length - 1 ? 0 : prev + 1))}
                  className="p-1 hover:text-[#701010] hover:bg-gray-55 rounded transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Logo & Header Info */}
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${legalAgencies[activeLegalIndex].bg} flex-shrink-0 flex items-center justify-center text-white shadow-sm`}>
                  {(() => {
                    const IconComp = { Shield, FileText, GraduationCap }[legalAgencies[activeLegalIndex].icon];
                    return IconComp ? <IconComp className="w-5 h-5" /> : null;
                  })()}
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-headline font-bold uppercase tracking-widest text-[#701010] bg-red-50/50 border border-red-100/30 px-1.5 py-0.5 rounded">
                    {legalAgencies[activeLegalIndex].tag}
                  </span>
                  <h5 className="font-serif font-bold text-sm text-gray-900 mt-1 leading-snug">
                    {legalAgencies[activeLegalIndex].name}
                  </h5>
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-450 mt-0.5">
                    📍 {legalAgencies[activeLegalIndex].location}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                {legalAgencies[activeLegalIndex].desc}
              </p>
              <div className="pt-1.5 border-t border-gray-50">
                <a
                  href={`https://${legalAgencies[activeLegalIndex].website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010] hover:underline"
                >
                  <ExternalLink className="w-3 h-3" /> Visit Advisory
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Global CSS for scrollbar control */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: transparent;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #0d0e12;
        }
      `}} />
    </main>
  );
}
