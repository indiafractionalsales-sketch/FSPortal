"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import {
  Search, Home, Tv, Store, Users, Grid, MessageCircle, Bell,
  Settings, LogOut, MoreHorizontal, ThumbsUp, Share2, Plus,
  Bookmark, Clock, Calendar, Video, ImageIcon, ChevronDown, ChevronUp, Check, X, Phone, Globe, FileText, Briefcase, GraduationCap, Award,
  ChevronLeft, ChevronRight, ExternalLink, Shield, TrendingUp, Compass, MapPin, Star, UserIcon
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getDocument, queryCollection } from "@/lib/firestore-rest";
import Navbar from "@/components/Navbar";
import SPPostCard from "@/components/SPPostCard";
import SPCreatePostDrawer from "@/components/SPCreatePostDrawer";
import OBOCreatePostDrawer from "@/components/OBOCreatePostDrawer";
import PostDetailsDrawer from "@/components/PostDetailsDrawer";

export default function HomePage() {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileTab, setMobileTab] = useState<"profile" | "feed" | "discover">("feed");
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
  const [isInterested, setIsInterested] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isOBOCreatePostOpen, setIsOBOCreatePostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Record<string, unknown> | null>(null);
  const [viewingPost, setViewingPost] = useState<Record<string, unknown> | null>(null);

  // Feed state
  const [feedTab, setFeedTab] = useState<"global" | "mine">("global");
  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastDocRef = useRef<Record<string, unknown> | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const PAGE_SIZE = 10;

  // Core profile identity states (for displaying avatar/names)
  const [userType, setUserType] = useState<"obo" | "sp" | "tpsp" | "">("");
  const [oboData, setOboData] = useState({
    brandName: "",
    legalName: "",
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
              legalName: (oboData.legalName as string) || "",
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
              } else {
                router.replace("/onboarding");
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

  const loadMorePosts = useCallback(async () => {
    if (feedLoading || !hasMore || isFetchingRef.current) return;
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    isFetchingRef.current = true;
    setFeedLoading(true);
    try {
      const idToken = await currentUser.getIdToken();
      const whereClause = feedTab === "mine" ? [{ field: "ownerUid", op: "EQUAL" as const, value: currentUser.uid }] : [];
      
      const { docs, lastDoc } = await queryCollection("Posts", idToken, {
        orderByField: "createdAt",
        orderDirection: "DESCENDING",
        limit: PAGE_SIZE,
        startAfterDoc: lastDocRef.current,
        where: whereClause,
      });
      setPosts(prev => [...prev, ...docs]);
      lastDocRef.current = lastDoc;
      setHasMore(docs.length === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      isFetchingRef.current = false;
      setFeedLoading(false);
    }
  }, [feedLoading, hasMore, feedTab]);

  const refreshFeed = async () => {
    if (isFetchingRef.current) return;
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    isFetchingRef.current = true;
    setFeedLoading(true);
    setHasMore(true);
    lastDocRef.current = null;
    try {
      const idToken = await currentUser.getIdToken();
      const whereClause = feedTab === "mine" ? [{ field: "ownerUid", op: "EQUAL" as const, value: currentUser.uid }] : [];

      const { docs, lastDoc } = await queryCollection("Posts", idToken, {
        orderByField: "createdAt",
        orderDirection: "DESCENDING",
        limit: PAGE_SIZE,
        where: whereClause,
      });
      setPosts(docs);
      lastDocRef.current = lastDoc;
      setHasMore(docs.length === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to refresh posts", err);
    } finally {
      isFetchingRef.current = false;
      setFeedLoading(false);
    }
  };

  // Refresh feed when feedTab changes, or on initial load
  useEffect(() => {
    if (user && !loading) {
      // Clear posts immediately for better UX
      setPosts([]);
      setHasMore(true);
      lastDocRef.current = null;
      refreshFeed();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedTab, user, loading]);

  // IntersectionObserver for infinite scroll sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMorePosts]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    if (post.postType === "sp") {
      setIsCreatePostOpen(true);
    } else if (post.postType === "obo") {
      setIsOBOCreatePostOpen(true);
    }
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
      <Navbar user={user} profileData={{ spData, oboData, tpspData }} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden pb-16 md:pb-0">

        {/* Left Sidebar */}
        <div className={`w-full md:w-[260px] 2xl:w-[360px] flex-shrink-0 ${mobileTab === 'profile' ? 'flex' : 'hidden'} md:flex flex-col overflow-y-auto p-4 custom-scrollbar bg-white/50 gap-4 border-r border-gray-100`}>

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
                  <span className="text-xs font-headline font-bold text-gray-700 uppercase tracking-wider">Interests Shown</span>
                  <span className="text-xs font-bold text-[#701010] font-headline">12</span>
                </div>
                <div className="flex justify-between items-center py-1.5 cursor-pointer hover:bg-gray-50 px-2 rounded-md transition-colors">
                  <span className="text-xs font-headline font-bold text-gray-700 uppercase tracking-wider">Interests Received</span>
                  <span className="text-xs font-bold text-[#701010] font-headline">8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-4 flex-1">
            <h4 className="text-xs font-headline font-bold text-gray-900 uppercase tracking-widest pb-1.5 mb-3">Quick Links</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => setFeedTab("global")} className={`w-full flex items-center gap-2.5 px-2 py-2 transition-all rounded-lg text-left ${feedTab === "global" ? "bg-[#701010]/5 text-[#701010]" : "hover:bg-gray-50 text-gray-700"}`}>
                  <span className="text-base">🌍</span>
                  <span className="text-xs font-headline font-bold uppercase tracking-wider">Global Feed</span>
                </button>
              </li>
              <li>
                <button onClick={() => setFeedTab("mine")} className={`w-full flex items-center gap-2.5 px-2 py-2 transition-all rounded-lg text-left ${feedTab === "mine" ? "bg-[#701010]/5 text-[#701010]" : "hover:bg-gray-50 text-gray-700"}`}>
                  <span className="text-base">📝</span>
                  <span className="text-xs font-headline font-bold uppercase tracking-wider">My Posts</span>
                </button>
              </li>
              <div className="h-px bg-gray-100 my-2" />
              {[
                { label: 'My Network', icon: '🤝' },
                { label: 'My Deals', icon: '💼' },
                { label: 'Saved Items', icon: '🔖' },
              ].map((item) => (
                <li key={item.label}>
                  <button className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 transition-all rounded-lg text-left text-gray-700">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-headline font-bold uppercase tracking-wider">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center Feed Area */}
        <div className={`flex-1 ${mobileTab === 'feed' ? 'flex' : 'hidden'} md:flex flex-col overflow-y-auto p-4 custom-scrollbar bg-gray-50/50`}>
          <div className="w-full max-w-[1020px] mx-auto space-y-4">

            {/* Share Post Card */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
              <div className="flex gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#701010] flex-shrink-0 flex items-center justify-center text-white font-bold font-headline">
                  {user?.email?.charAt(0).toUpperCase() ?? "P"}
                </div>
                <button 
                  onClick={() => {
                    if (userType === "sp") setIsCreatePostOpen(true);
                    else if (userType === "obo") setIsOBOCreatePostOpen(true);
                    else alert("Post creation is currently available for Sales Partners and Brand Owners only.");
                  }}
                  className="flex-grow bg-gray-50 hover:bg-gray-100 border border-gray-150 rounded-full px-4 text-left text-gray-500 text-xs transition-colors flex items-center"
                >
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


            {/* Dynamic Posts Feed */}
            {posts.length === 0 && !feedLoading && (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center text-gray-400">
                <p className="text-sm font-headline font-bold uppercase tracking-wider">No posts yet</p>
                <p className="text-xs mt-1">Be the first to post an event!</p>
              </div>
            )}

            {posts.map((post) => (
              <SPPostCard
                key={post.__id as string}
                post={post as any}
                authorName={post.authorName as string | undefined}
                authorAvatar={post.authorAvatar as string | undefined}
                onEdit={() => handleEditPost(post)}
                onViewDetails={() => setViewingPost(post)}
              />
            ))}

            {/* Loading spinner */}
            {feedLoading && hasMore && (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-[#701010] border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Invisible sentinel element — triggers next page load when scrolled into view */}
            {hasMore && <div ref={sentinelRef} className="h-4" />}

            {!hasMore && posts.length > 0 && (
              <p className="text-center text-[10px] font-headline font-bold uppercase tracking-widest text-gray-400 py-4">
                You&apos;ve reached the end
              </p>
            )}

          </div>
        </div>

        {/* Right Sidebar */}
        <div className={`w-full lg:w-[300px] 2xl:w-[400px] flex-shrink-0 ${mobileTab === 'discover' ? 'flex' : 'hidden'} lg:flex flex-col overflow-y-auto p-4 custom-scrollbar bg-white/50 border-l border-gray-100 space-y-6`}>

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

      {/* SP Post Creation Drawer */}
      <SPCreatePostDrawer 
        isOpen={isCreatePostOpen} 
        editPostData={editingPost}
        onClose={() => {
          setIsCreatePostOpen(false);
          setEditingPost(null);
        }} 
        onSuccess={() => {
          setIsCreatePostOpen(false);
          setEditingPost(null);
          refreshFeed();
        }} 
      />

      {/* OBO Post Creation Drawer */}
      <OBOCreatePostDrawer
        isOpen={isOBOCreatePostOpen}
        onClose={() => { setIsOBOCreatePostOpen(false); setEditingPost(null); }}
        onSuccess={() => {
          setIsOBOCreatePostOpen(false);
          setEditingPost(null);
          refreshFeed();
        }}
        editPostData={editingPost}
        companyName={oboData?.legalName || oboData?.brandName}
      />

      {/* Post Details Drawer */}
      <PostDetailsDrawer 
        isOpen={!!viewingPost}
        onClose={() => setViewingPost(null)}
        post={viewingPost}
      />

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[40] flex items-center justify-around pb-safe">
        <button onClick={() => setMobileTab("profile")} className={`flex flex-col items-center p-3 w-full ${mobileTab === 'profile' ? 'text-[#701010]' : 'text-gray-500 hover:text-gray-900'}`}>
          <UserIcon className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-headline font-bold uppercase tracking-wider">Profile</span>
        </button>
        <button onClick={() => setMobileTab("feed")} className={`flex flex-col items-center p-3 w-full ${mobileTab === 'feed' ? 'text-[#701010]' : 'text-gray-500 hover:text-gray-900'}`}>
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-headline font-bold uppercase tracking-wider">Feed</span>
        </button>
        <button onClick={() => setMobileTab("discover")} className={`flex flex-col items-center p-3 w-full ${mobileTab === 'discover' ? 'text-[#701010]' : 'text-gray-500 hover:text-gray-900'}`}>
          <Compass className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-headline font-bold uppercase tracking-wider">Discover</span>
        </button>
      </div>
    </main>
  );
}
