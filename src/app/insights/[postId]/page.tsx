"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import { getDocument } from "@/lib/firestore-rest";
import {
  Phone, Mail, MapPin, Calendar, User as UserIcon,
  Flame, Sun, Snowflake, ArrowLeft, Loader2,
  ChevronRight, Clock, AlertCircle, ChevronLeft,
  ExternalLink, Shield, TrendingUp, Compass, Star,
  Home, Briefcase, GraduationCap, Award, FileText, Globe
} from "lucide-react";

interface Lead {
  id: string;
  status: "pending" | "processing" | "processed" | "failed";
  capturedByUid: string;
  ownerUid: string;
  postId: string | null;
  cardImageUrl: string;
  voiceNoteUrl: string | null;
  textNote: string | null;
  createdAt: string | null;
  processedAt: string | null;
  contactInfo: {
    name?: string;
    designation?: string;
    company?: string;
    email?: string;
    phone?: string;
    website?: string;
  } | null;
  temperature: "hot" | "warm" | "cold" | null;
  actionItem: string | null;
  contextSummary: string | null;
}

// Vertical bar chart segment
const VerticalBarChart = ({ hot, warm, cold }: { hot: number; warm: number; cold: number }) => {
  const total = hot + warm + cold;
  if (total === 0) {
    return (
      <div className="h-48 flex items-center justify-center border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs bg-white">
        No processed leads to display chart
      </div>
    );
  }

  const maxCount = Math.max(hot, warm, cold, 1);

  const items = [
    { label: "Hot", count: hot, pct: (hot / maxCount) * 100, color: "bg-red-500", text: "text-red-700", bgLight: "bg-red-50", border: "border-red-200" },
    { label: "Warm", count: warm, pct: (warm / maxCount) * 100, color: "bg-amber-400", text: "text-amber-700", bgLight: "bg-amber-50", border: "border-amber-200" },
    { label: "Cold", count: cold, pct: (cold / maxCount) * 100, color: "bg-blue-300", text: "text-blue-700", bgLight: "bg-blue-50", border: "border-blue-200" },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-[#701010] mb-4">Lead Quality Distribution</p>
      <div className="flex items-end justify-around h-40 pt-4 border-b border-gray-100 pb-2">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center w-16 h-full justify-end group">
            <span className="text-[10px] font-bold text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {item.count}
            </span>
            <div className="w-8 bg-gray-50 rounded-t-md relative flex items-end justify-center overflow-hidden h-32 border border-gray-100/50">
              <div
                className={`w-full rounded-t-sm ${item.color} transition-all duration-750 ease-out`}
                style={{ height: `${item.pct || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-around pt-3">
        {items.map((item) => (
          <div key={item.label} className="w-16 text-center">
            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-headline font-bold uppercase tracking-widest border ${item.bgLight} ${item.text} ${item.border}`}>
              {item.label} ({item.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TemperatureChip = ({ temp }: { temp: "hot" | "warm" | "cold" | null }) => {
  if (!temp) return null;
  const cfg = {
    hot: { icon: Flame, cls: "bg-red-50 text-red-600 border-red-100" },
    warm: { icon: Sun, cls: "bg-amber-50 text-amber-600 border-amber-100" },
    cold: { icon: Snowflake, cls: "bg-blue-50 text-blue-600 border-blue-100" },
  }[temp];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-headline font-bold uppercase tracking-widest border ${cfg.cls}`}>
      <Icon className="w-2.5 h-2.5" />{temp}
    </span>
  );
};

export default function PostInsightsPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;

  const [user, setUser] = useState<User | null>(null);
  const [mobileTab, setMobileTab] = useState<"profile" | "feed" | "discover">("feed");
  const [userType, setUserType] = useState<"obo" | "sp" | "tpsp" | "">("");

  // Profiles data states matching home page
  const [oboData, setOboData] = useState({
    brandName: "",
    legalName: "",
    logo: "",
    banner: ""
  });
  const [spData, setSpData] = useState({
    fullName: "",
    profilePhoto: "",
    banner: "",
    preferredCurrency: ""
  });
  const [tpspData, setTpspData] = useState({
    companyName: "",
    logo: "",
    banner: ""
  });

  const [post, setPost] = useState<any>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [spProfile, setSpProfile] = useState<any>(null);

  // Agency Directory Lists & States matching home page
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

  const fetchLeads = useCallback(async (token: string) => {
    const res = await fetch(`/api/leads/list?postId=${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setLeads(data.leads || []);
    }
  }, [postId]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      try {
        const token = await u.getIdToken();
        const userData = await getDocument("users", u.uid, token);
        const dbId = (userData?.databaseId as string) || "default";

        if (userData?.role) {
          setUserType(userData.role as "obo" | "sp" | "tpsp");
          if (userData.role === "obo") {
            const data = await getDocument("OBO_Profile", u.uid, token, dbId);
            if (data) {
              setOboData({
                brandName: (data.brandName as string) || "",
                legalName: (data.legalName as string) || "",
                logo: (data.logo as string) || "",
                banner: (data.banner as string) || ""
              });
            }
          }
          else if (userData.role === "sp") {
            const data = await getDocument("SP_Profile", u.uid, token, dbId);
            if (data) {
              setSpData({
                fullName: (data.fullName as string) || "",
                profilePhoto: (data.profilePhoto as string) || "",
                banner: (data.banner as string) || "",
                preferredCurrency: (data.preferredCurrency as string) || ""
              });
            }
          } else if (userData.role === "tpsp") {
            const data = await getDocument("TPSP_Profile", u.uid, token, dbId);
            if (data) {
              setTpspData({
                companyName: (data.companyName as string) || "",
                logo: (data.logo as string) || "",
                banner: (data.banner as string) || ""
              });
            }
          }
        }

        const postData = await getDocument("Posts", postId, token, dbId);
        setPost(postData);

        if (postData) {
          const spUid = postData.postType === "sp" ? postData.ownerUid : postData.paymentLockedBy;
          if (spUid) {
            const spProf = await getDocument("SP_Profile", spUid as string, token, dbId);
            setSpProfile(spProf);
          }
        }

        await fetchLeads(token);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router, postId, fetchLeads]);

  const handleProcessAll = async () => {
    setProcessing(true);
    try {
      const token = await user?.getIdToken();
      const pending = leads.filter(l => l.status === "pending");
      for (const lead of pending) {
        await fetch("/api/leads/process", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ leadId: lead.id }),
        });
      }
      if (token) await fetchLeads(token);
    } finally {
      setProcessing(false);
    }
  };

  const processedLeads = leads.filter(l => l.status === "processed");
  const pendingLeads = leads.filter(l => l.status === "pending");
  const hot = processedLeads.filter(l => l.temperature === "hot").length;
  const warm = processedLeads.filter(l => l.temperature === "warm").length;
  const cold = processedLeads.filter(l => l.temperature === "cold").length;

  const ctaLeads = processedLeads.filter(l => l.actionItem);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#701010] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const eventDate = post?.date ? new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;
  const location = [post?.venue, post?.city, post?.country].filter(Boolean).join(", ");

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#0d0e12] font-body antialiased overflow-hidden h-screen flex flex-col text-sm">
      {/* Top Navbar */}
      <Navbar user={user} profileData={{ spData, oboData, tpspData }} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden pb-16 md:pb-0">

        {/* Left Sidebar (copied from home page) */}
        <div className={`w-full md:w-[260px] 2xl:w-[360px] flex-shrink-0 ${mobileTab === 'profile' ? 'flex' : 'hidden'} md:flex flex-col overflow-y-auto p-4 custom-scrollbar bg-white/50 gap-4 border-r border-gray-100`}>

          {/* Profile Card */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex-shrink-0">
            <div className="h-16 bg-[#701010] relative overflow-hidden">
              {(oboData.banner || spData.banner || tpspData.banner) && <img src={oboData.banner || spData.banner || tpspData.banner} alt="Banner" className="w-full h-full object-cover" />}
            </div>

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
                className="font-serif font-bold text-base text-gray-900 leading-tight hover:text-[#701010] transition-colors cursor-pointer block text-left w-full truncate font-serif"
              >
                {spData.fullName || oboData.brandName || tpspData.companyName || user?.displayName || user?.email || "Partner User"}
              </button>
              <p className="text-[10px] font-headline text-gray-500 mt-1 uppercase tracking-wider truncate">
                {userType === "obo" ? "Overseas Business Owner" : userType === "sp" ? "Sales Partner" : userType === "tpsp" ? "Service Provider" : "Configure Profile"}
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-snug truncate">{user?.email || ""}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-4 flex-grow">
            <h4 className="text-xs font-headline font-bold text-gray-900 uppercase tracking-widest pb-1.5 mb-3 border-b border-gray-50">Quick Links</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => router.push("/home")} className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 transition-all rounded-lg text-left text-gray-700">
                  <span className="text-base">🌍</span>
                  <span className="text-xs font-headline font-bold uppercase tracking-wider font-headline">Global Feed</span>
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/home")} className="w-full flex items-center gap-2.5 px-2 py-2 hover:bg-gray-50 transition-all rounded-lg text-left text-gray-700">
                  <span className="text-base">💼</span>
                  <span className="text-xs font-headline font-bold uppercase tracking-wider font-headline">My Deals</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Center Dashboard Area */}
        <div className={`flex-1 ${mobileTab === 'feed' ? 'flex' : 'hidden'} md:flex flex-col overflow-y-auto p-4 custom-scrollbar bg-[#faf8f5]`}>
          <div className="w-full max-w-[1020px] mx-auto space-y-4 pb-8">

            {/* Back Navigation */}
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={() => router.push("/home")}
                className="inline-flex items-center gap-1.5 text-xs font-headline font-bold uppercase tracking-widest text-gray-500 hover:text-[#701010] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to feed
              </button>
            </div>

            {/* EVENT HEADER CARD */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="h-1 bg-[#701010]" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010] mb-1">Event</p>
                    <h1 className="text-xl font-serif font-bold text-gray-900 leading-tight font-serif">
                      {post?.eventName || "Event Insights"}
                    </h1>
                  </div>
                  <div className="bg-[#701010]/5 border border-[#701010]/10 rounded-lg px-4 py-2 text-center shrink-0">
                    <p className="text-2xl font-serif font-bold text-[#701010] leading-none font-serif">{leads.length}</p>
                    <p className="text-[9px] font-headline uppercase tracking-widest text-[#701010]/70 mt-0.5">leads</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500 mb-4">
                  {eventDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {eventDate}
                    </span>
                  )}
                  {location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {location}
                    </span>
                  )}
                </div>

                {/* Sales Partner details */}
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-gray-400 mb-2">Sales Partner</p>
                  <div className="flex items-center gap-3">
                    {spProfile?.profilePhoto ? (
                      <img src={spProfile.profilePhoto} alt="SP" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-serif font-bold text-gray-900 font-serif">{spProfile?.fullName || "—"}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
                        {spProfile?.mobilePrimary && (
                          <a href={`tel:${spProfile.mobilePrimary}`} className="text-[10px] text-gray-500 hover:text-[#701010] flex items-center gap-1 transition-colors">
                            <Phone className="w-3 h-3 text-gray-400" />{spProfile.mobilePrimary}
                          </a>
                        )}
                        {spProfile?.emailPersonal && (
                          <a href={`mailto:${spProfile.emailPersonal}`} className="text-[10px] text-gray-500 hover:text-[#701010] flex items-center gap-1 transition-colors">
                            <Mail className="w-3 h-3 text-gray-400" />{spProfile.emailPersonal}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PENDING LEAD ACTIONS */}
            {pendingLeads.length > 0 && (
              <div className="bg-amber-50/65 border border-amber-250/70 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <p className="text-xs text-amber-800 font-headline font-bold">
                    {pendingLeads.length} lead{pendingLeads.length !== 1 ? "s" : ""} captured are awaiting AI extraction
                  </p>
                </div>
                <button
                  onClick={handleProcessAll}
                  disabled={processing}
                  className="shrink-0 px-4 py-2 bg-[#701010] text-white rounded-lg text-[10px] font-headline font-bold uppercase tracking-widest hover:bg-[#5a0c0c] transition-all active:scale-[0.98] disabled:opacity-60 flex items-center gap-1.5 shadow-sm hover:shadow"
                >
                  {processing ? <Loader2 className="w-3 h-3 animate-spin" /> : "⚡"}
                  {processing ? "Processing…" : "Process All"}
                </button>
              </div>
            )}

            {/* HIGHLIGHTS SECTION */}
            {processedLeads.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010] mb-1">Highlights</p>
                <p className="text-xs text-gray-400 font-headline mb-4 border-b border-gray-50 pb-2">Sales partner commentary extracts</p>
                <div className="space-y-4">
                  {processedLeads
                    .filter(l => l.contextSummary)
                    .map(l => (
                      <div key={l.id} className="flex gap-3.5 items-start">
                        <div className="w-12 h-8 rounded overflow-hidden bg-gray-100 border border-gray-200 shrink-0 mt-0.5">
                          <img src={l.cardImageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-xs font-bold text-gray-800 font-serif">
                              {l.contactInfo?.name || "Contact"}
                            </p>
                            <TemperatureChip temp={l.temperature} />
                          </div>
                          <p className="text-xs text-gray-650 leading-relaxed font-sans">{l.contextSummary}</p>
                        </div>
                      </div>
                    ))}
                  {processedLeads.filter(l => l.contextSummary).length === 0 && (
                    <p className="text-xs text-gray-400 font-headline italic py-2">No comments or summaries extracted yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* TWO-COLUMN STATS AND CTAs GRID */}
            {processedLeads.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Lead Quality Distribution (Vertical Bar Chart) */}
                <VerticalBarChart hot={hot} warm={warm} cold={cold} />

                {/* CTAs / Action Items with Deadlines */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col justify-between">
                  <div>
                    <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010] mb-1">Next Actions</p>
                    <p className="text-xs text-gray-400 font-headline mb-4">Follow-ups extracted from captures</p>
                  </div>
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] custom-scrollbar pr-1">
                    {ctaLeads.map(l => (
                      <div key={l.id} className="bg-emerald-50/40 border border-emerald-100 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1 border-b border-emerald-100/50 pb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <p className="text-[10px] font-bold text-emerald-800 font-serif truncate">
                            {l.contactInfo?.name || "Contact"} {l.contactInfo?.company ? `(${l.contactInfo.company})` : ""}
                          </p>
                        </div>
                        <p className="text-xs text-emerald-700 leading-relaxed font-semibold">{l.actionItem}</p>
                      </div>
                    ))}
                    {ctaLeads.length === 0 && (
                      <div className="h-full flex items-center justify-center text-gray-400 text-xs italic py-10">
                        No pending follow-ups or action items.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TABULAR CONTACT LIST */}
            {processedLeads.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50">
                  <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010]">All Contacts</p>
                  <p className="text-xs text-gray-400 font-headline mt-0.5">{processedLeads.length} processed leads</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-headline font-bold uppercase tracking-wider text-gray-400">
                        <th className="py-3 px-4 font-headline">Contact</th>
                        <th className="py-3 px-4 font-headline">Company & Role</th>
                        <th className="py-3 px-4 font-headline">Priority</th>
                        <th className="py-3 px-4 font-headline">Contact Details</th>
                        <th className="py-3 px-4 text-right font-headline">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-sans">
                      {processedLeads.map((lead) => {
                        const isExpanded = expandedLead === lead.id;
                        return (
                          <React.Fragment key={lead.id}>
                            <tr
                              className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                              onClick={() => setExpandedLead(isExpanded ? null : lead.id)}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-7 rounded overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                    <img src={lead.cardImageUrl} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="font-serif font-bold text-gray-900 text-sm group-hover:text-[#701010] transition-colors font-serif">
                                      {lead.contactInfo?.name || "Unknown"}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-headline mt-0.5">
                                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-bold text-gray-800 text-xs">
                                  {lead.contactInfo?.company || "—"}
                                </p>
                                <p className="text-[10px] text-gray-500 font-headline mt-0.5">
                                  {lead.contactInfo?.designation || "—"}
                                </p>
                              </td>
                              <td className="py-3 px-4">
                                <TemperatureChip temp={lead.temperature} />
                              </td>
                              <td className="py-3 px-4 space-y-0.5 text-gray-600">
                                {lead.contactInfo?.email && (
                                  <span className="block truncate max-w-[150px]" title={lead.contactInfo.email}>
                                    ✉️ {lead.contactInfo.email}
                                  </span>
                                )}
                                {lead.contactInfo?.phone && (
                                  <span className="block">
                                    📞 {lead.contactInfo.phone}
                                  </span>
                                )}
                                {!lead.contactInfo?.email && !lead.contactInfo?.phone && (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button className="text-xs font-headline font-bold uppercase tracking-wider text-[#701010] group-hover:underline">
                                  {isExpanded ? "Collapse" : "Details"}
                                </button>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="bg-gray-50/30">
                                <td colSpan={5} className="py-4 px-5 border-t border-gray-100">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Left: Card & audio player */}
                                    <div className="space-y-3">
                                      <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-gray-450 border-b border-gray-100 pb-1">Business Card Image</p>
                                      <div className="max-w-xs rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                        <img src={lead.cardImageUrl} alt="Card" className="w-full object-cover" />
                                      </div>
                                      {lead.voiceNoteUrl && (
                                        <div className="space-y-1">
                                          <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-gray-450">Voice Note</p>
                                          <audio controls src={lead.voiceNoteUrl} className="w-full h-8" />
                                        </div>
                                      )}
                                    </div>
                                    {/* Right: Notes */}
                                    <div className="space-y-3">
                                      {lead.contextSummary && (
                                        <div className="bg-white border border-gray-150 rounded-lg p-3 shadow-sm">
                                          <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-gray-450 mb-1">Floor Context & Notes</p>
                                          <p className="text-xs text-gray-650 leading-relaxed">{lead.contextSummary}</p>
                                        </div>
                                      )}
                                      {lead.actionItem && (
                                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 shadow-sm">
                                          <p className="text-[9px] font-headline font-bold uppercase tracking-widest text-emerald-700 mb-1">Required Next Action</p>
                                          <p className="text-xs text-emerald-800 leading-relaxed font-semibold">{lead.actionItem}</p>
                                        </div>
                                      )}
                                      {!lead.contextSummary && !lead.actionItem && (
                                        <p className="text-xs text-gray-400 italic">No additional commentary or actions captured.</p>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty state */}
            {leads.length === 0 && (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-10 text-center">
                <p className="text-sm font-headline font-bold uppercase tracking-wider text-gray-300">No leads captured yet</p>
                <p className="text-xs text-gray-400 mt-1">Scan cards at the event to see insights here.</p>
              </div>
            )}

          </div>
        </div>

        {/* Right Sidebar (copied from home page) */}
        <div className={`w-full lg:w-[300px] 2xl:w-[400px] flex-shrink-0 ${mobileTab === 'discover' ? 'flex' : 'hidden'} lg:flex flex-col overflow-y-auto p-4 custom-scrollbar bg-white/50 border-l border-gray-100 space-y-6`}>

          {/* Marketing Agencies */}
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
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-455 mt-0.5">
                    📍 {marketingAgencies[activeMarketingIndex].location}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-650 leading-relaxed font-sans">
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

          {/* Biz Dev Partners */}
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
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${bizDevAgencies[activeBizDevIndex].bg} flex-shrink-0 flex items-center justify-center text-white shadow-sm`}>
                  {(() => {
                    const IconComp = { Award, Briefcase, Users: UserIcon }[bizDevAgencies[activeBizDevIndex].icon];
                    return IconComp ? <IconComp className="w-5 h-5" /> : null;
                  })()}
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-headline font-bold uppercase tracking-widest text-[#701010] bg-red-50/50 border border-red-100/30 px-1.5 py-0.5 rounded">
                    {bizDevAgencies[activeBizDevIndex].tag}
                  </span>
                  <h5 className="font-serif font-bold text-sm text-gray-900 mt-1 leading-snug font-serif">
                    {bizDevAgencies[activeBizDevIndex].name}
                  </h5>
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-455 mt-0.5">
                    📍 {bizDevAgencies[activeBizDevIndex].location}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-650 leading-relaxed font-sans">
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

          {/* Legal Advisors */}
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
                  <h5 className="font-serif font-bold text-sm text-gray-900 mt-1 leading-snug font-serif">
                    {legalAgencies[activeLegalIndex].name}
                  </h5>
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-455 mt-0.5">
                    📍 {legalAgencies[activeLegalIndex].location}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-650 leading-relaxed font-sans">
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

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[40] flex items-center justify-around pb-safe">
        <button onClick={() => setMobileTab("profile")} className={`flex flex-col items-center p-3 w-full ${mobileTab === 'profile' ? 'text-[#701010]' : 'text-gray-500 hover:text-gray-900'}`}>
          <UserIcon className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-headline font-bold uppercase tracking-wider">Profile</span>
        </button>
        <button onClick={() => setMobileTab("feed")} className={`flex flex-col items-center p-3 w-full ${mobileTab === 'feed' ? 'text-[#701010]' : 'text-gray-500 hover:text-gray-900'}`}>
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-headline font-bold uppercase tracking-wider">Insights</span>
        </button>
        <button onClick={() => setMobileTab("discover")} className={`flex flex-col items-center p-3 w-full ${mobileTab === 'discover' ? 'text-[#701010]' : 'text-gray-500 hover:text-gray-900'}`}>
          <Compass className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-headline font-bold uppercase tracking-wider">Discover</span>
        </button>
      </div>

    </main>
  );
}

// React fragment needs to be imported or referenced via React.Fragment
import React from "react";
