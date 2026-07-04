"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building, Users, Globe, Award, Briefcase, Phone, Settings, FileText, Check, ChevronDown, ChevronUp, ImageIcon, ArrowLeft, Pencil, Plus, Trash2, X, ExternalLink,
  TrendingUp, Compass, Shield, GraduationCap, ChevronLeft, ChevronRight, Home, Bell, LogOut
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { saveDocument, getDocument } from "@/lib/firestore-rest";
import { uploadImage } from "@/lib/storage-rest";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const router = useRouter();
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

  // States
  const [userType, setUserType] = useState<"obo" | "sp" | "tpsp" | "">("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [isRoleLocked, setIsRoleLocked] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Force view-only in profile page
  const [profileFetched, setProfileFetched] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ─── Product & Service Catalog (UI state — Firestore in next sprint) ─────
  const [products, setProducts] = useState<Array<{
    id: string; name: string; specification: string;
    referenceLink: string; photos: string[];
  }>>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [customerCare, setCustomerCare] = useState({ name: "", email: "", phone: "", hours: "" });
  const [grievanceOfficer, setGrievanceOfficer] = useState({ name: "", email: "", phone: "" });
  const [editingCustomerCare, setEditingCustomerCare] = useState(false);
  const [editingGrievanceOfficer, setEditingGrievanceOfficer] = useState(false);
  const [databaseId, setDatabaseId] = useState("default");

  // OBO Profile Form State
  const [oboData, setOboData] = useState({
    legalName: "",
    brandName: "",
    gstNumber: "",
    incorporationDate: "",
    revenueRange: "",
    phone: "",
    website: "",
    instaHandle: "",
    fbHandle: "",
    linkedinHandle: "",
    logo: "",
    banner: "",
    country: ""
  });

  // SP Profile Form State
  const [spData, setSpData] = useState({
    // Section 1 — Personal Details
    fullName: "",
    preferredName: "",
    gender: "",
    dob: "",
    nationality: "",
    primaryLanguage: "",
    secondaryLanguage: "",
    profilePhoto: "",
    banner: "", // Banner added for LinkedIn-style layout

    // Section 2 — Contact Details
    mobilePrimary: "",
    mobileWhatsapp: "",
    emailPersonal: "",
    linkedinProfile: "",
    instagram: "",
    city: "",
    regionCounty: "",
    country: "",
    postcode: "",
    timeZone: "",

    // Section 3 — Professional Details
    employmentStatus: "", // Freelance/Employed/Part-time
    jobTitle: "",
    industryExperience: "",
    yearsExperience: "",
    b2bB2cExperience: "", // B2B/B2C/Both
    targetMarket: "",
    languagesSales: "",

    // Section 4 — Sales Performance Metrics
    salesChannels: [] as string[],
    avgDealSize: "",
    pastBrands: "",
    productCategories: "",

    // Section 5 — Engagement & Commission
    engagementType: "",
    commissionStructure: "",

    // Section 6 — Network & Reach
    whatsappGroups: "",
    socialFollowing: "",
    communityAccess: "",
    tradeFairExp: "",
    retailConnections: "",

    // Section 7 — Compliance & Legal
    rightToWork: "",
    companyName: "",
    companyRegNo: "",
    gdprCompliant: "",
    status: "Active",
    performanceRating: "",
    notes: "",
    preferredCurrency: "USD"
  });

  // TPSP Form State
  const [tpspData, setTpspData] = useState({
    companyName: "",
    services: "",
    contactPerson: "",
    phone: "",
    email: "",
    website: "",
    location: "",
    logo: "",
    banner: "",
    country: ""
  });

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Load existing profile from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchProfiles = async () => {
      try {
        const idToken = await user.getIdToken();

        const userData = await getDocument("users", user.uid, idToken, "default");
        if (userData?.role) {
          const role = userData.role as "obo" | "sp" | "tpsp";
          const dbId = (userData.databaseId as string) || "default";
          setDatabaseId(dbId);
          setUserType(role);
          setIsRoleLocked(true);

          if (role === "obo") {
            const oboData = await getDocument("OBO_Profile", user.uid, idToken, dbId);
            if (oboData) setOboData(prev => ({ ...prev, ...oboData }));
          } else if (role === "sp") {
            const spData = await getDocument("SP_Profile", user.uid, idToken, dbId);
            if (spData) setSpData(prev => ({ ...prev, ...spData, salesChannels: (spData.salesChannels as string[]) || [] }));
          } else if (role === "tpsp") {
            const tpspData = await getDocument("TPSP_Profile", user.uid, idToken, dbId);
            if (tpspData) setTpspData(prev => ({ ...prev, ...tpspData, logo: (tpspData.logo as string) || "", banner: (tpspData.banner as string) || "" }));
          }
          return;
        }

        // Fallback: check profile collections directly
        const oboData = await getDocument("OBO_Profile", user.uid, idToken);
        if (oboData) {
          setUserType("obo");
          setOboData(prev => ({ ...prev, ...oboData }));
          setIsRoleLocked(true);
          return;
        }

        const spData = await getDocument("SP_Profile", user.uid, idToken);
        if (spData) {
          setUserType("sp");
          setSpData(prev => ({ ...prev, ...spData, salesChannels: (spData.salesChannels as string[]) || [] }));
          setIsRoleLocked(true);
          return;
        }

        const tpspData = await getDocument("TPSP_Profile", user.uid, idToken);
        if (tpspData) {
          setUserType("tpsp");
          setTpspData(prev => ({ ...prev, ...tpspData, logo: (tpspData.logo as string) || "", banner: (tpspData.banner as string) || "" }));
          setIsRoleLocked(true);
          return;
        }

        // No profile found — new user, redirect to onboarding
        router.replace("/onboarding");
      } catch (err) {
        console.error("Error loading profiles:", err);
        router.replace("/onboarding");
      } finally {
        setProfileFetched(true);
      }
    };

    fetchProfiles();
  }, [user]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (userType === "obo") {
          setOboData(prev => ({ ...prev, logo: base64 }));
        } else if (userType === "sp") {
          setSpData(prev => ({ ...prev, profilePhoto: base64 }));
        } else if (userType === "tpsp") {
          setTpspData(prev => ({ ...prev, logo: base64 }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (userType === "obo") {
          setOboData(prev => ({ ...prev, banner: base64 }));
        } else if (userType === "sp") {
          setSpData(prev => ({ ...prev, banner: base64 }));
        } else if (userType === "tpsp") {
          setTpspData(prev => ({ ...prev, banner: base64 }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    const wasCreatingProfile = !isRoleLocked;

    try {
      if (!userType) {
        throw new Error("Please select a profile type.");
      }

      // Get a fresh ID token for Firestore + Storage REST authentication
      const idToken = await user.getIdToken();

      let currentDbId = databaseId;
      
      if (!isRoleLocked) {
        let userCountry = "";
        if (userType === "obo") userCountry = oboData.country;
        else if (userType === "sp") userCountry = spData.country;
        else if (userType === "tpsp") userCountry = tpspData.country;
        
        currentDbId = userCountry.toLowerCase() === "india" ? "fsindiadb" : "default";
        setDatabaseId(currentDbId);

        await saveDocument("users", user.uid, {
          uid: user.uid,
          role: userType,
          databaseId: currentDbId,
          createdAt: new Date().toISOString(),
        }, idToken, "default");
        setIsRoleLocked(true);
      }

      // ── Upload images to Storage (if newly selected as base64) ──────────
      // Base64 strings start with "data:" — Storage URLs start with "https:"
      // We only upload when user has picked a new image, not when loading existing URL.

      if (userType === "obo") {
        if (!oboData.legalName || !oboData.brandName || !oboData.gstNumber || !oboData.incorporationDate || !oboData.revenueRange) {
          throw new Error("Please fill in all mandatory fields: Company Legal Name, Brand Name, GST/TAX Number, Incorporation Date, and Revenue Range.");
        }
        const finalObo = { ...oboData, registeredEmail: user.email || "" };
        if (finalObo.logo?.startsWith("data:")) {
          finalObo.logo = await uploadImage(finalObo.logo, `profiles/${user.uid}/avatar.jpg`, idToken);
        }
        if (finalObo.banner?.startsWith("data:")) {
          finalObo.banner = await uploadImage(finalObo.banner, `profiles/${user.uid}/banner.jpg`, idToken);
        }
        await saveDocument("OBO_Profile", user.uid, finalObo as unknown as Record<string, unknown>, idToken, currentDbId);
        setOboData(finalObo); // update state with storage URLs

      } else if (userType === "sp") {
        if (!spData.city || !spData.yearsExperience) {
          throw new Error("Please fill in all mandatory fields: City and Years of Experience.");
        }
        const finalSp = { ...spData, registeredEmail: user.email || "" };
        if (finalSp.profilePhoto?.startsWith("data:")) {
          finalSp.profilePhoto = await uploadImage(finalSp.profilePhoto, `profiles/${user.uid}/avatar.jpg`, idToken);
        }
        if (finalSp.banner?.startsWith("data:")) {
          finalSp.banner = await uploadImage(finalSp.banner, `profiles/${user.uid}/banner.jpg`, idToken);
        }
        await saveDocument("SP_Profile", user.uid, finalSp as unknown as Record<string, unknown>, idToken, currentDbId);
        setSpData(finalSp);

      } else if (userType === "tpsp") {
        if (!tpspData.companyName) {
          throw new Error("Company Name is mandatory for Third Party Service Providers.");
        }
        const finalTpsp = { ...tpspData, registeredEmail: user.email || "" };
        if (finalTpsp.logo?.startsWith("data:")) {
          finalTpsp.logo = await uploadImage(finalTpsp.logo, `profiles/${user.uid}/avatar.jpg`, idToken);
        }
        if (finalTpsp.banner?.startsWith("data:")) {
          finalTpsp.banner = await uploadImage(finalTpsp.banner, `profiles/${user.uid}/banner.jpg`, idToken);
        }
        await saveDocument("TPSP_Profile", user.uid, finalTpsp as unknown as Record<string, unknown>, idToken, currentDbId);
        setTpspData(finalTpsp);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        if (wasCreatingProfile) {
          router.push("/home");
        } else {
          setIsEditing(false);
        }
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save profile.";
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  // Compute live visual resources based on user persona type
  const currentAvatar = userType === "obo" ? oboData.logo : userType === "sp" ? spData.profilePhoto : userType === "tpsp" ? tpspData.logo : "";
  const currentBanner = userType === "obo" ? oboData.banner : userType === "sp" ? spData.banner : userType === "tpsp" ? tpspData.banner : "";
  const currentName = userType === "obo" ? oboData.legalName : userType === "sp" ? spData.fullName : userType === "tpsp" ? tpspData.companyName : "";

  if (loading || !profileFetched) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#701010] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#0d0e12] font-body antialiased flex flex-col pb-16">
      <Navbar user={user} profileData={{ spData, oboData, tpspData }} />

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full flex gap-8">
        {/* Left Column: Profile Content */}
        <div className="flex-1 min-w-0 space-y-8">


        {/* LinkedIn-style Profile Header Card */}
        {userType !== "" && (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm relative">
            {/* Banner Container */}
            <div className="h-40 md:h-48 bg-gradient-to-r from-[#701010]/95 to-[#952525] relative group">
              {currentBanner ? (
                <img src={currentBanner} alt="Profile Banner" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full opacity-35 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              )}

              {/* Banner Edit Trigger — edit mode only */}
              {isEditing && (
                <div className="absolute right-4 bottom-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                    id="banner-file-input"
                  />
                  <label
                    htmlFor="banner-file-input"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 text-[10px] font-headline font-bold uppercase tracking-wider rounded-lg shadow-sm border border-gray-200/50 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] select-none"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-gray-600" />
                    {currentBanner ? "Change Banner" : "Upload Banner"}
                  </label>
                </div>
              )}
              
            </div>

            {/* Avatar & Info Row */}
            <div className="px-6 pb-6 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              {/* Avatar (Overlapping Banner) */}
              <div className="relative -mt-12 sm:-mt-16 flex-shrink-0 group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-50 flex items-center justify-center">
                  {currentAvatar ? (
                    <img src={currentAvatar} alt="Profile Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <Users className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Avatar Edit Trigger — edit mode only */}
                {isEditing && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-file-input"
                    />
                    <label
                      htmlFor="avatar-file-input"
                      className="absolute bottom-0 right-0 p-2 bg-[#701010] hover:bg-[#580c0c] text-white rounded-full shadow-md border-2 border-white cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </label>
                  </>
                )}
              </div>

              {/* User details */}
              <div className="flex-1 sm:ml-4 pt-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={currentName}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (userType === "obo") {
                        setOboData(prev => ({ ...prev, legalName: val }));
                      } else if (userType === "sp") {
                        setSpData(prev => ({ ...prev, fullName: val }));
                      } else if (userType === "tpsp") {
                        setTpspData(prev => ({ ...prev, companyName: val }));
                      }
                    }}
                    placeholder={
                      userType === "obo"
                        ? "Enter Company Legal Name..."
                        : userType === "sp"
                          ? "Enter Full Name..."
                          : "Enter Company Name..."
                    }
                    className="w-full bg-transparent text-xl md:text-2xl font-serif font-bold text-gray-900 border-b border-transparent hover:border-gray-250 focus:border-[#701010] focus:ring-0 outline-none pb-0.5 transition-all duration-300"
                  />
                ) : (
                  <h1 className="text-xl md:text-2xl font-serif font-bold text-gray-900 pb-0.5">{currentName || "—"}</h1>
                )}
                <p className="text-[10px] font-headline text-gray-500 mt-1.5 uppercase tracking-wider font-bold">
                  {userType === "obo" ? "Overseas Business Owner" : userType === "sp" ? "Sales Partner" : "Third Party Service Provider"}
                </p>
                {/* View mode stat chips */}
                {!isEditing && userType === "obo" && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {oboData.revenueRange && (
                      <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-[#701010]/5 text-[#701010] px-2.5 py-1 rounded-full border border-[#701010]/15">{oboData.revenueRange}</span>
                    )}
                    {oboData.incorporationDate && (
                      <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                        Est. {new Date(oboData.incorporationDate + "T00:00:00").getFullYear()}
                      </span>
                    )}
                  </div>
                )}
                {!isEditing && userType === "sp" && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {spData.employmentStatus && (
                      <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-[#701010]/5 text-[#701010] px-2.5 py-1 rounded-full border border-[#701010]/15">{spData.employmentStatus}</span>
                    )}
                    {spData.yearsExperience && (
                      <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{spData.yearsExperience} yrs exp.</span>
                    )}
                  </div>
                )}
              </div>
              {!isEditing && (
                <div className="flex-shrink-0 mb-2 sm:mb-0">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 text-[10px] font-headline font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {isEditing && (<>
        {/* Role Modern Card Selector */}
        <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-headline font-bold uppercase tracking-wider text-gray-700 block">I am *</label>
            {isRoleLocked && (
              <span className="text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010] bg-red-50 px-2 py-0.5 rounded flex items-center gap-1 border border-red-100">
                🔒 Persona Locked
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "obo", label: "Business Owner", desc: "Overseas Brand Owner", icon: Building },
              { id: "sp", label: "Sales Partner", desc: "Freelance/Agency Seller", icon: Users },
              { id: "tpsp", label: "Service Provider", desc: "Logistics, Customs, Legal", icon: Globe }
            ].map((role) => {
              const isActive = userType === role.id;
              const IconComponent = role.icon;
              return (
                <button
                  key={role.id}
                  type="button"
                  disabled={isRoleLocked && !isActive}
                  onClick={() => {
                    if (!isRoleLocked) setUserType(role.id as any);
                  }}
                  className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all duration-300 text-center gap-2 group ${isActive
                      ? "border-[#701010] bg-red-50/10 ring-1 ring-[#701010] text-[#701010]"
                      : "border-gray-200 bg-white text-gray-800 " + (isRoleLocked ? "opacity-40 cursor-not-allowed" : "hover:border-gray-400 cursor-pointer")
                    }`}
                >
                  <IconComponent className={`w-6 h-6 transition-transform ${!isRoleLocked ? "group-hover:scale-110" : ""
                    } ${isActive ? "text-[#701010]" : "text-gray-400"
                    }`} />
                  <div>
                    <p className="text-xs font-headline font-bold uppercase tracking-wider">{role.label}</p>
                    <p className="text-[9px] text-gray-450 mt-0.5 leading-snug font-sans">{role.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        {saveError && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg text-xs leading-relaxed font-sans">
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" /> Profile saved successfully! Redirecting...
          </div>
        )}

        {/* Forms content */}
        {userType === "obo" && (
          <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-2">
              <h3 className="font-serif font-bold text-base text-gray-900">Overseas Business Owner Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Brand Name *</label>
                <input
                  value={oboData.brandName}
                  onChange={e => setOboData({ ...oboData, brandName: e.target.value })}
                  placeholder="Brand/Trading Name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Country *</label>
                <div className="relative">
                  <select
                    value={oboData.country}
                    onChange={e => setOboData({ ...oboData, country: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors appearance-none"
                  >
                    <option value="">Select Country</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">GST/TAX Number *</label>
                <input
                  value={oboData.gstNumber}
                  onChange={e => setOboData({ ...oboData, gstNumber: e.target.value })}
                  placeholder="GST, VAT, or Tax ID"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Incorporation Date *</label>
                <input
                  type="date"
                  value={oboData.incorporationDate}
                  onChange={e => setOboData({ ...oboData, incorporationDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Revenue Range in Rupee denomination *</label>
              <div className="relative">
                <select
                  value={oboData.revenueRange}
                  onChange={e => setOboData({ ...oboData, revenueRange: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors appearance-none"
                >
                  <option value="">Select Range</option>
                  <option value="Under 50 Lakhs">Under 50 Lakhs</option>
                  <option value="50 Lakhs - 2 Crores">50 Lakhs - 2 Crores</option>
                  <option value="2 Crores - 5 Crores">2 Crores - 5 Crores</option>
                  <option value="Above 5 Crores">Above 5 Crores</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Phone</label>
                <input
                  value={oboData.phone}
                  onChange={e => setOboData({ ...oboData, phone: e.target.value })}
                  placeholder="Contact Phone"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Website</label>
                <input
                  value={oboData.website}
                  onChange={e => setOboData({ ...oboData, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Insta Handle</label>
                <input
                  value={oboData.instaHandle}
                  onChange={e => setOboData({ ...oboData, instaHandle: e.target.value })}
                  placeholder="@username"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#701010] bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Facebook Handle</label>
                <input
                  value={oboData.fbHandle}
                  onChange={e => setOboData({ ...oboData, fbHandle: e.target.value })}
                  placeholder="username"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#701010] bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">LinkedIn Handle</label>
                <input
                  value={oboData.linkedinHandle}
                  onChange={e => setOboData({ ...oboData, linkedinHandle: e.target.value })}
                  placeholder="company/username"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#701010] bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {userType === "sp" && (
          <div className="space-y-4">
            {/* Stepper Progress Bar */}
            <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500">
                  Step {activeSectionIndex + 1} of 7
                </span>
                <span className="text-xs font-serif font-bold text-gray-800">
                  {activeSectionIndex === 0 && "Personal Details"}
                  {activeSectionIndex === 1 && "Contact Details"}
                  {activeSectionIndex === 2 && "Professional Details"}
                  {activeSectionIndex === 3 && "Performance Metrics"}
                  {activeSectionIndex === 4 && "Engagement & Commission"}
                  {activeSectionIndex === 5 && "Network & Reach"}
                  {activeSectionIndex === 6 && "Compliance & Legal"}
                </span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#701010] h-full transition-all duration-300"
                  style={{ width: `${((activeSectionIndex + 1) / 7) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Forms */}
            <div className="border border-gray-100 rounded-xl bg-white p-6 shadow-sm space-y-4">
              {activeSectionIndex === 0 && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#701010]" /> Section 1 — Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Full Name</label>
                      <input
                        value={spData.fullName}
                        onChange={e => setSpData({ ...spData, fullName: e.target.value })}
                        placeholder="Legal Name"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Preferred Name</label>
                      <input
                        value={spData.preferredName}
                        onChange={e => setSpData({ ...spData, preferredName: e.target.value })}
                        placeholder="Display Name"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-550 block mb-1">Gender</label>
                      <div className="relative">
                        <select
                          value={spData.gender}
                          onChange={e => setSpData({ ...spData, gender: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] appearance-none"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-550 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-550 block mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={spData.dob}
                        onChange={e => setSpData({ ...spData, dob: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-555 block mb-1">Nationality</label>
                      <input
                        value={spData.nationality}
                        onChange={e => setSpData({ ...spData, nationality: e.target.value })}
                        placeholder="Nationality"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Primary Language</label>
                      <input
                        value={spData.primaryLanguage}
                        onChange={e => setSpData({ ...spData, primaryLanguage: e.target.value })}
                        placeholder="Primary Language"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Secondary Language</label>
                      <input
                        value={spData.secondaryLanguage}
                        onChange={e => setSpData({ ...spData, secondaryLanguage: e.target.value })}
                        placeholder="Secondary Language(s)"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSectionIndex === 1 && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#701010]" /> Section 2 — Contact Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Mobile (Primary)</label>
                      <input
                        value={spData.mobilePrimary}
                        onChange={e => setSpData({ ...spData, mobilePrimary: e.target.value })}
                        placeholder="Primary Mobile Number"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Mobile (WhatsApp)</label>
                      <input
                        value={spData.mobileWhatsapp}
                        onChange={e => setSpData({ ...spData, mobileWhatsapp: e.target.value })}
                        placeholder="WhatsApp Mobile Number"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Email (Personal)</label>
                      <input
                        value={spData.emailPersonal}
                        onChange={e => setSpData({ ...spData, emailPersonal: e.target.value })}
                        placeholder="Personal Email Address"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Time Zone</label>
                      <input
                        value={spData.timeZone}
                        onChange={e => setSpData({ ...spData, timeZone: e.target.value })}
                        placeholder="e.g. GMT+1"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">LinkedIn Profile</label>
                      <input
                        value={spData.linkedinProfile}
                        onChange={e => setSpData({ ...spData, linkedinProfile: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Instagram Link</label>
                      <input
                        value={spData.instagram}
                        onChange={e => setSpData({ ...spData, instagram: e.target.value })}
                        placeholder="https://instagram.com/..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">City *</label>
                      <input value={spData.city} onChange={e => setSpData({ ...spData, city: e.target.value })} placeholder="City" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Region/County</label>
                      <input value={spData.regionCounty} onChange={e => setSpData({ ...spData, regionCounty: e.target.value })} placeholder="State/Region" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-550 block mb-1">Country</label>
                      <div className="relative">
                        <select value={spData.country} onChange={e => setSpData({ ...spData, country: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none appearance-none">
                          <option value="">Select Country</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="India">India</option>
                          <option value="Australia">Australia</option>
                          <option value="Canada">Canada</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-550 block mb-1">Postcode</label>
                      <input value={spData.postcode} onChange={e => setSpData({ ...spData, postcode: e.target.value })} placeholder="ZIP" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {activeSectionIndex === 2 && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#701010]" /> Section 3 — Professional Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Employment Status</label>
                      <div className="relative">
                        <select
                          value={spData.employmentStatus}
                          onChange={e => setSpData({ ...spData, employmentStatus: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] appearance-none"
                        >
                          <option value="">Select Status</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Employed">Employed</option>
                          <option value="Part-time">Part-time</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-555 pointer-events-none" />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Job Title</label>
                      <input
                        value={spData.jobTitle}
                        onChange={e => setSpData({ ...spData, jobTitle: e.target.value })}
                        placeholder="Current Role"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Industry Experience/Domain</label>
                      <input
                        value={spData.industryExperience}
                        onChange={e => setSpData({ ...spData, industryExperience: e.target.value })}
                        placeholder="e.g. FMCG, IT, Retail"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Years of Exp *</label>
                        <input
                          value={spData.yearsExperience}
                          onChange={e => setSpData({ ...spData, yearsExperience: e.target.value })}
                          placeholder="e.g. 5"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-550 block mb-1">B2B/B2C Exp</label>
                        <div className="relative">
                          <select
                            value={spData.b2bB2cExperience}
                            onChange={e => setSpData({ ...spData, b2bB2cExperience: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] appearance-none"
                          >
                            <option value="">Select</option>
                            <option value="B2B">B2B</option>
                            <option value="B2C">B2C</option>
                            <option value="Both">Both</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-555 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Target Market</label>
                      <input
                        value={spData.targetMarket}
                        onChange={e => setSpData({ ...spData, targetMarket: e.target.value })}
                        placeholder="e.g. United Kingdom"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Languages for Sales</label>
                      <input
                        value={spData.languagesSales}
                        onChange={e => setSpData({ ...spData, languagesSales: e.target.value })}
                        placeholder="Languages used for Pitching"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSectionIndex === 3 && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#701010]" /> Section 4 — Sales Performance Metrics
                  </h3>
                  <div>
                    <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-550 block mb-2">Sales Channels</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Online", "Retail", "WhatsApp", "Events & Expos"].map((channel) => {
                        const isChecked = spData.salesChannels.includes(channel);
                        return (
                          <label key={channel} className="flex items-center gap-2 border border-gray-100 p-2 rounded-lg cursor-pointer hover:bg-gray-55 transition-colors">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const nextChannels = e.target.checked
                                  ? [...spData.salesChannels, channel]
                                  : spData.salesChannels.filter(c => c !== channel);
                                setSpData({ ...spData, salesChannels: nextChannels });
                              }}
                              className="accent-[#701010]"
                            />
                            <span className="text-xs text-gray-700 font-headline uppercase font-bold tracking-wider">{channel}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Average Deal Size</label>
                      <input
                        value={spData.avgDealSize}
                        onChange={e => setSpData({ ...spData, avgDealSize: e.target.value })}
                        placeholder="e.g. £10K"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Preferred Currency</label>
                      <div className="relative">
                        <select
                          value={spData.preferredCurrency}
                          onChange={e => setSpData({ ...spData, preferredCurrency: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] appearance-none disabled:bg-gray-50 disabled:text-gray-500"
                          disabled={!isEditing}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="INR">INR</option>
                          <option value="AUD">AUD</option>
                          <option value="CAD">CAD</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Past Brands Represented</label>
                      <input
                        value={spData.pastBrands}
                        onChange={e => setSpData({ ...spData, pastBrands: e.target.value })}
                        placeholder="Previous brands"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Product Categories Handled</label>
                    <input
                      value={spData.productCategories}
                      onChange={e => setSpData({ ...spData, productCategories: e.target.value })}
                      placeholder="Categories e.g. Wellness, Fashion"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                    />
                  </div>
                </div>
              )}

              {activeSectionIndex === 4 && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#701010]" /> Section 5 — Engagement & Commission
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Engagement Type</label>
                      <div className="relative">
                        <select
                          value={spData.engagementType}
                          onChange={e => setSpData({ ...spData, engagementType: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] appearance-none"
                        >
                          <option value="">Select Type</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Retainer">Retainer</option>
                          <option value="Commission">Commission</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-555 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-550 block mb-1">Commission Structure Agreed</label>
                      <div className="relative">
                        <select
                          value={spData.commissionStructure}
                          onChange={e => setSpData({ ...spData, commissionStructure: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] appearance-none"
                        >
                          <option value="">Select Commission</option>
                          <option value="<=5%">&lt;= 5% on net sales</option>
                          <option value="<=10%">&lt;= 10% on net sales</option>
                          <option value="<25%">&lt; 25% on net sales</option>
                          <option value=">25%">&gt; 25% on net sales</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-555 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSectionIndex === 5 && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#701010]" /> Section 6 — Network & Reach
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-550 block mb-1">WhatsApp Groups Access</label>
                      <input
                        value={spData.whatsappGroups}
                        onChange={e => setSpData({ ...spData, whatsappGroups: e.target.value })}
                        placeholder="e.g. Yes — 5 groups, ~1200 members"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-550 block mb-1">Social Media Following</label>
                      <input
                        value={spData.socialFollowing}
                        onChange={e => setSpData({ ...spData, socialFollowing: e.target.value })}
                        placeholder="e.g. Instagram 4.5K, LinkedIn 2K"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Community Access</label>
                      <input
                        value={spData.communityAccess}
                        onChange={e => setSpData({ ...spData, communityAccess: e.target.value })}
                        placeholder="e.g. Indian diaspora UK"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Trade Fair Experience</label>
                      <input
                        value={spData.tradeFairExp}
                        onChange={e => setSpData({ ...spData, tradeFairExp: e.target.value })}
                        placeholder="e.g. Yes — 3 expos"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-550 block mb-1">Retail Connections</label>
                    <input
                      value={spData.retailConnections}
                      onChange={e => setSpData({ ...spData, retailConnections: e.target.value })}
                      placeholder="e.g. Yes — 4 local stores"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                    />
                  </div>
                </div>
              )}

              {activeSectionIndex === 6 && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#701010]" /> Section 7 — Compliance & Legal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Right to Work</label>
                      <input
                        value={spData.rightToWork}
                        onChange={e => setSpData({ ...spData, rightToWork: e.target.value })}
                        placeholder="Yes / No / Visa Type"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Company Name (if any)</label>
                      <input
                        value={spData.companyName}
                        onChange={e => setSpData({ ...spData, companyName: e.target.value })}
                        placeholder="Registered Company Name"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Company Registration No</label>
                      <input
                        value={spData.companyRegNo}
                        onChange={e => setSpData({ ...spData, companyRegNo: e.target.value })}
                        placeholder="Reg Number"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">GDPR Compliant</label>
                      <div className="relative">
                        <select
                          value={spData.gdprCompliant}
                          onChange={e => setSpData({ ...spData, gdprCompliant: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] appearance-none"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-555 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Status</label>
                      <div className="relative">
                        <select
                          value={spData.status}
                          onChange={e => setSpData({ ...spData, status: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] appearance-none"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Prospect">Prospect</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-555 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Rating (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={spData.performanceRating}
                        onChange={e => setSpData({ ...spData, performanceRating: e.target.value })}
                        placeholder="e.g. 5"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Notes</label>
                      <input
                        value={spData.notes}
                        onChange={e => setSpData({ ...spData, notes: e.target.value })}
                        placeholder="Notes"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step navigation buttons inside the card */}
              <div className="flex justify-between items-center pt-4 mt-6 border-t border-gray-100">
                {activeSectionIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() => setActiveSectionIndex(activeSectionIndex - 1)}
                    className="rounded-full px-5 py-2 font-headline text-[10px] uppercase tracking-wider font-bold border border-gray-200 hover:bg-gray-55 transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                ) : isRoleLocked ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-full px-5 py-2 font-headline text-[10px] uppercase tracking-wider font-bold border border-gray-200 hover:bg-gray-55 transition-colors text-gray-700 inline-flex items-center cursor-pointer"
                  >
                    Cancel
                  </button>
                ) : (
                  <Link
                    href="/home"
                    className="rounded-full px-5 py-2 font-headline text-[10px] uppercase tracking-wider font-bold border border-gray-200 hover:bg-gray-55 transition-colors text-gray-700 inline-flex items-center"
                  >
                    Cancel
                  </Link>
                )}

                {activeSectionIndex < 6 ? (
                  <button
                    type="button"
                    onClick={() => setActiveSectionIndex(activeSectionIndex + 1)}
                    className="rounded-full px-5 py-2 font-headline text-[10px] uppercase tracking-wider font-bold bg-[#701010] text-white hover:bg-[#580c0c] transition-colors cursor-pointer"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="rounded-full px-5 py-2 font-headline text-[10px] uppercase tracking-wider font-bold bg-[#701010] text-white hover:bg-[#580c0c] transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      "Submit & Save"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {userType === "tpsp" && (
          <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-2">
              <h3 className="font-serif font-bold text-base text-gray-900">Third Party Service Provider Details</h3>
            </div>

            <div>
              <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-700 block mb-1">Company Name *</label>
              <input
                value={tpspData.companyName}
                onChange={e => setTpspData({ ...tpspData, companyName: e.target.value })}
                placeholder="Service Provider Company Name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-700 block mb-1">Service Categories</label>
              <input
                value={tpspData.services}
                onChange={e => setTpspData({ ...tpspData, services: e.target.value })}
                placeholder="e.g. Logistics, Custom Clearance, Marketing Agency"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-700 block mb-1">Contact Person</label>
                <input
                  value={tpspData.contactPerson}
                  onChange={e => setTpspData({ ...tpspData, contactPerson: e.target.value })}
                  placeholder="Primary Contact"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Country *</label>
                <div className="relative">
                  <select
                    value={tpspData.country}
                    onChange={e => setTpspData({ ...tpspData, country: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors appearance-none"
                  >
                    <option value="">Select Country</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-700 block mb-1">Location</label>
                <input
                  value={tpspData.location}
                  onChange={e => setTpspData({ ...tpspData, location: e.target.value })}
                  placeholder="City, State"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-700 block mb-1">Phone</label>
                <input
                  value={tpspData.phone}
                  onChange={e => setTpspData({ ...tpspData, phone: e.target.value })}
                  placeholder="Contact Phone"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-700 block mb-1">Email</label>
                <input
                  value={tpspData.email}
                  onChange={e => setTpspData({ ...tpspData, email: e.target.value })}
                  placeholder="corporate@example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-700 block mb-1">Website</label>
              <input
                value={tpspData.website}
                onChange={e => setTpspData({ ...tpspData, website: e.target.value })}
                placeholder="https://example.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
              />
            </div>
          </div>
        )}

        {/* Footer controls for non-SP roles */}
        {userType !== "sp" && userType !== "" && (
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            {isRoleLocked ? (
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-full px-6 py-2.5 font-headline text-[11px] uppercase tracking-wider font-bold border border-gray-200 hover:bg-gray-100 transition-colors text-gray-700 inline-flex items-center"
              >
                Cancel
              </button>
            ) : (
              <Link
                href="/home"
                className="rounded-full px-6 py-2.5 font-headline text-[11px] uppercase tracking-wider font-bold border border-gray-200 hover:bg-gray-100 transition-colors text-gray-700 inline-flex items-center"
              >
                Cancel
              </Link>
            )}
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="rounded-full px-6 py-2.5 font-headline text-[11px] uppercase tracking-wider font-bold bg-[#701010] hover:bg-[#580c0c] text-white transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : "Save Profile"}
            </button>
          </div>
        )}

        {/* ─── Close edit mode wrapper ─── */}
        </>)}

        {/* ════════════════════ VIEW MODE PROFILE CARDS ════════════════════ */}
        {!isEditing && isRoleLocked && (
          <div className="space-y-6">

            {/* OBO View Cards */}
            {userType === "obo" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                    <Building className="w-4 h-4 text-[#701010]" /> Business Details
                  </h3>
                  <div className="space-y-3.5">
                    {oboData.brandName && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Brand Name</p><p className="text-sm text-gray-800">{oboData.brandName}</p></div>}
                    {oboData.gstNumber && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">GST / TAX Number</p><p className="text-sm text-gray-800 font-mono">{oboData.gstNumber}</p></div>}
                    {oboData.incorporationDate && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Incorporated</p><p className="text-sm text-gray-800">{new Date(oboData.incorporationDate + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p></div>}
                    {oboData.revenueRange && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Annual Revenue</p><p className="text-sm text-gray-800">{oboData.revenueRange}</p></div>}
                    {!oboData.brandName && !oboData.gstNumber && !oboData.incorporationDate && !oboData.revenueRange && <p className="text-xs text-gray-400 italic">No business details provided</p>}
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                    <Phone className="w-4 h-4 text-[#701010]" /> Contact & Social
                  </h3>
                  <div className="space-y-3">
                    {oboData.phone && <div className="flex items-center gap-3"><Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /><p className="text-sm text-gray-800">{oboData.phone}</p></div>}
                    {oboData.website && <div className="flex items-center gap-3"><Globe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /><a href={oboData.website.startsWith("http") ? oboData.website : `https://${oboData.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#701010] hover:underline truncate">{oboData.website}</a></div>}
                    {oboData.linkedinHandle && <div className="flex items-center gap-3"><Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /><p className="text-sm text-gray-700">{oboData.linkedinHandle}</p></div>}
                    {oboData.instaHandle && <div className="flex items-center gap-3"><Award className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /><p className="text-sm text-gray-700">@{oboData.instaHandle}</p></div>}
                    {oboData.fbHandle && <div className="flex items-center gap-3"><Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /><p className="text-sm text-gray-700">{oboData.fbHandle}</p></div>}
                    {!oboData.phone && !oboData.website && !oboData.linkedinHandle && !oboData.instaHandle && !oboData.fbHandle && <p className="text-xs text-gray-400 italic">No contact details provided</p>}
                  </div>
                </div>
              </div>
            )}

            {/* SP View Cards */}
            {userType === "sp" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                    <Users className="w-4 h-4 text-[#701010]" /> Personal Details
                  </h3>
                  <div className="space-y-3.5">
                    {spData.preferredName && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Preferred Name</p><p className="text-sm text-gray-800">{spData.preferredName}</p></div>}
                    {spData.nationality && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Nationality</p><p className="text-sm text-gray-800">{spData.nationality}</p></div>}
                    {spData.city && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Location</p><p className="text-sm text-gray-800">{[spData.city, spData.country].filter(Boolean).join(", ")}</p></div>}
                    {spData.mobilePrimary && <div className="flex items-center gap-3"><Phone className="w-3.5 h-3.5 text-gray-400" /><p className="text-sm text-gray-800">{spData.mobilePrimary}</p></div>}
                  </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                    <Briefcase className="w-4 h-4 text-[#701010]" /> Professional Details
                  </h3>
                  <div className="space-y-3.5">
                    {spData.jobTitle && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Job Title</p><p className="text-sm text-gray-800">{spData.jobTitle}</p></div>}
                    {spData.industryExperience && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Industry</p><p className="text-sm text-gray-800">{spData.industryExperience}</p></div>}
                    {spData.yearsExperience && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Experience</p><p className="text-sm text-gray-800">{spData.yearsExperience} years</p></div>}
                    {spData.salesChannels && spData.salesChannels.length > 0 && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-1.5">Sales Channels</p><div className="flex flex-wrap gap-1.5">{spData.salesChannels.map(ch => <span key={ch} className="text-[9px] font-headline font-bold uppercase tracking-wider bg-[#701010]/5 text-[#701010] px-2 py-0.5 rounded-full border border-[#701010]/20">{ch}</span>)}</div></div>}
                  </div>
                </div>
              </div>
            )}

            {/* TPSP View Cards */}
            {userType === "tpsp" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                    <Building className="w-4 h-4 text-[#701010]" /> Company Details
                  </h3>
                  <div className="space-y-3.5">
                    {tpspData.services && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Services</p><p className="text-sm text-gray-800">{tpspData.services}</p></div>}
                    {tpspData.location && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Location</p><p className="text-sm text-gray-800">{tpspData.location}</p></div>}
                  </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                    <Phone className="w-4 h-4 text-[#701010]" /> Contact Details
                  </h3>
                  <div className="space-y-3.5">
                    {tpspData.contactPerson && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Contact Person</p><p className="text-sm text-gray-800">{tpspData.contactPerson}</p></div>}
                    {tpspData.phone && <div className="flex items-center gap-3"><Phone className="w-3.5 h-3.5 text-gray-400" /><p className="text-sm text-gray-800">{tpspData.phone}</p></div>}
                    {tpspData.email && <div className="flex items-center gap-3"><FileText className="w-3.5 h-3.5 text-gray-400" /><p className="text-sm text-gray-800">{tpspData.email}</p></div>}
                    {tpspData.website && <div className="flex items-center gap-3"><Globe className="w-3.5 h-3.5 text-gray-400" /><a href={tpspData.website.startsWith("http") ? tpspData.website : `https://${tpspData.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#701010] hover:underline truncate">{tpspData.website}</a></div>}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════ PRODUCT / SERVICE CATALOG ══════════════════ */}
            {/* Independent of Edit Profile — user can manage catalog without editing profile */}
            {(userType === "obo" || userType === "tpsp") && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

                {/* Catalog Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#701010]" />
                      {userType === "obo" ? "Product Catalog" : "Service Catalog"}
                    </h2>
                    <p className="text-[10px] font-headline text-gray-400 uppercase tracking-wider mt-0.5">
                      {products.length === 0 ? "No items listed yet" : `${products.length} ${products.length === 1 ? "item" : "items"} listed`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const id = `p_${Date.now()}`;
                      setProducts(prev => [...prev, { id, name: "", specification: "", referenceLink: "", photos: [] }]);
                      setEditingProductId(id);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#701010] hover:bg-[#580c0c] text-white text-[10px] font-headline font-bold uppercase tracking-wider rounded-lg transition-all duration-200 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add {userType === "obo" ? "Product" : "Service"}
                  </button>
                </div>

                <div className="px-6 py-6 space-y-6">

                  {/* Customer Care & Grievance Officer — shared for all products */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Customer Care */}
                    <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/40">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-serif font-bold text-sm text-gray-800 flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#701010]" /> Customer Care
                        </h4>
                        <button
                          onClick={() => setEditingCustomerCare(prev => !prev)}
                          className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 hover:text-[#701010] flex items-center gap-1 px-2 py-1 rounded-md hover:bg-[#701010]/5 transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                          {editingCustomerCare ? "Done" : "Edit"}
                        </button>
                      </div>
                      {editingCustomerCare ? (
                        <div className="space-y-2.5">
                          {([
                            { key: "name", label: "Name / Department", placeholder: "Customer Support Team" },
                            { key: "email", label: "Email", placeholder: "support@brand.com" },
                            { key: "phone", label: "Phone", placeholder: "+91 98765 43210" },
                            { key: "hours", label: "Support Hours", placeholder: "Mon–Fri, 9am–6pm IST" }
                          ] as const).map(field => (
                            <div key={field.key}>
                              <label className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400">{field.label}</label>
                              <input
                                value={customerCare[field.key]}
                                onChange={e => setCustomerCare(p => ({ ...p, [field.key]: e.target.value }))}
                                placeholder={field.placeholder}
                                className="w-full mt-0.5 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {customerCare.name && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Name</p><p className="text-sm text-gray-800">{customerCare.name}</p></div>}
                          {customerCare.email && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Email</p><p className="text-sm text-gray-800">{customerCare.email}</p></div>}
                          {customerCare.phone && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Phone</p><p className="text-sm text-gray-800">{customerCare.phone}</p></div>}
                          {customerCare.hours && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Hours</p><p className="text-sm text-gray-800">{customerCare.hours}</p></div>}
                          {!customerCare.name && !customerCare.email && !customerCare.phone && (
                            <p className="text-xs text-gray-400 italic">Click Edit to add customer care details</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Grievance Officer */}
                    <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/40">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-serif font-bold text-sm text-gray-800 flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-[#701010]" /> Grievance Officer
                        </h4>
                        <button
                          onClick={() => setEditingGrievanceOfficer(prev => !prev)}
                          className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 hover:text-[#701010] flex items-center gap-1 px-2 py-1 rounded-md hover:bg-[#701010]/5 transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                          {editingGrievanceOfficer ? "Done" : "Edit"}
                        </button>
                      </div>
                      {editingGrievanceOfficer ? (
                        <div className="space-y-2.5">
                          {([
                            { key: "name", label: "Officer Name", placeholder: "Full Name" },
                            { key: "email", label: "Email", placeholder: "grievance@brand.com" },
                            { key: "phone", label: "Phone", placeholder: "+91 98765 43210" }
                          ] as const).map(field => (
                            <div key={field.key}>
                              <label className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400">{field.label}</label>
                              <input
                                value={grievanceOfficer[field.key]}
                                onChange={e => setGrievanceOfficer(p => ({ ...p, [field.key]: e.target.value }))}
                                placeholder={field.placeholder}
                                className="w-full mt-0.5 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {grievanceOfficer.name && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Name</p><p className="text-sm text-gray-800">{grievanceOfficer.name}</p></div>}
                          {grievanceOfficer.email && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Email</p><p className="text-sm text-gray-800">{grievanceOfficer.email}</p></div>}
                          {grievanceOfficer.phone && <div><p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mb-0.5">Phone</p><p className="text-sm text-gray-800">{grievanceOfficer.phone}</p></div>}
                          {!grievanceOfficer.name && !grievanceOfficer.email && !grievanceOfficer.phone && (
                            <p className="text-xs text-gray-400 italic">Click Edit to add grievance officer details</p>
                          )}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Product / Service Items */}
                  {products.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-100">
                        {userType === "obo" ? "Products" : "Services"} ({products.length})
                      </h4>

                      {products.map((product, idx) => {
                        const isEditingThis = editingProductId === product.id;
                        return (
                          <div key={product.id} className={`border rounded-xl transition-all duration-200 overflow-hidden ${isEditingThis ? "border-[#701010]/25 ring-1 ring-[#701010]/10" : "border-gray-100 bg-white"}`}>

                            {isEditingThis ? (
                              /* ── Edit form ── */
                              <div className="p-5 space-y-4 bg-[#701010]/[0.012]">
                                {/* Header Row: Name Input + Controls */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                                  <input
                                    value={product.name}
                                    onChange={e => setProducts(prev => prev.map(p => p.id === product.id ? { ...p, name: e.target.value } : p))}
                                    placeholder={`Enter ${userType === "obo" ? "Product" : "Service"} Name`}
                                    className="flex-1 text-sm font-serif font-bold text-gray-900 border-b border-transparent hover:border-gray-200 focus:border-[#701010] outline-none pb-0.5 bg-transparent transition-colors"
                                  />
                                  <div className="flex gap-2 flex-shrink-0">
                                    <button
                                      onClick={() => setEditingProductId(null)}
                                      className="text-[9px] font-headline font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors"
                                    >
                                      <Check className="w-3 h-3" /> Done
                                    </button>
                                    <button
                                      onClick={() => { setProducts(prev => prev.filter(p => p.id !== product.id)); setEditingProductId(null); }}
                                      className="text-[9px] font-headline font-bold uppercase tracking-wider text-red-500 flex items-center gap-1 px-2.5 py-1.5 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" /> Delete
                                    </button>
                                  </div>
                                </div>

                                {/* Side-by-side Layout: Photos (Left) & Specification (Right) */}
                                <div className="flex flex-col md:flex-row gap-4">
                                  {/* Photos — max 5 in a 2x3 vertical grid (width 152px) */}
                                  <div className="flex-shrink-0 flex flex-col items-center">
                                    <div className="grid grid-cols-2 gap-2 w-[152px]">
                                      {product.photos.map((photo, pIdx) => (
                                        <div key={pIdx} className="w-[72px] h-[72px] rounded-lg border border-gray-200 overflow-hidden relative group">
                                          <img src={photo} alt="" className="w-full h-full object-cover" />
                                          <button
                                            onClick={() => { const u = [...product.photos]; u.splice(pIdx, 1); setProducts(prev => prev.map(p => p.id === product.id ? { ...p, photos: u } : p)); }}
                                            className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                          >
                                            <X className="w-4 h-4 text-white" />
                                          </button>
                                        </div>
                                      ))}
                                      {product.photos.length < 5 && (
                                        <label className="w-[72px] h-[72px] rounded-lg border-2 border-dashed border-gray-200 hover:border-[#701010]/30 cursor-pointer flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#701010] transition-colors">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (!file || product.photos.length >= 5) return;
                                              const reader = new FileReader();
                                              reader.onloadend = () => setProducts(prev => prev.map(p => p.id === product.id ? { ...p, photos: [...p.photos, reader.result as string] } : p));
                                              reader.readAsDataURL(file);
                                            }}
                                          />
                                          <ImageIcon className="w-4 h-4 text-gray-400" />
                                          <span className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-450">Add</span>
                                        </label>
                                      )}
                                      {/* Padding placeholders to keep the 2x3 grid visual structure intact */}
                                      {Array.from({ length: Math.max(0, 6 - product.photos.length - (product.photos.length < 5 ? 1 : 0)) }).map((_, i) => (
                                        <div key={i} className="w-[72px] h-[72px] rounded-lg border border-dashed border-gray-100 bg-gray-50/50" />
                                      ))}
                                    </div>
                                    <div className="text-[9px] text-gray-400 font-headline font-bold uppercase tracking-wider mt-2">
                                      Photos {product.photos.length}/5
                                    </div>
                                  </div>

                                  {/* Specification — Rich Text (Right side, matches grid height) */}
                                  <div className="flex-1 min-w-0">
                                    <div className="h-[232px] flex flex-col border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#701010] transition-colors bg-white">
                                      {/* Toolbar */}
                                      <div className="flex-shrink-0 flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50/80">
                                        {[
                                          { cmd: "bold", label: <b>B</b>, title: "Bold" },
                                          { cmd: "italic", label: <i>I</i>, title: "Italic" },
                                          { cmd: "underline", label: <u>U</u>, title: "Underline" }
                                        ].map(({ cmd, label, title }) => (
                                          <button
                                            key={cmd}
                                            type="button"
                                            onMouseDown={e => { e.preventDefault(); document.execCommand(cmd); }}
                                            className="w-6 h-6 flex items-center justify-center rounded text-xs text-gray-600 hover:bg-white hover:shadow-sm transition-all"
                                            title={title}
                                          >{label}</button>
                                        ))}
                                        <div className="w-px h-4 bg-gray-200 mx-1" />
                                        <button type="button" onMouseDown={e => { e.preventDefault(); document.execCommand("insertUnorderedList"); }} className="w-6 h-6 flex items-center justify-center rounded text-gray-600 hover:bg-white hover:shadow-sm transition-all" title="Bullet list">
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16"><circle cx="3" cy="5" r="1.2" fill="currentColor" /><line x1="6" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.5" /><circle cx="3" cy="9" r="1.2" fill="currentColor" /><line x1="6" y1="9" x2="14" y2="9" stroke="currentColor" strokeWidth="1.5" /><circle cx="3" cy="13" r="1.2" fill="currentColor" /><line x1="6" y1="13" x2="14" y2="13" stroke="currentColor" strokeWidth="1.5" /></svg>
                                        </button>
                                        <button type="button" onMouseDown={e => { e.preventDefault(); document.execCommand("insertOrderedList"); }} className="w-6 h-6 flex items-center justify-center rounded text-gray-600 hover:bg-white hover:shadow-sm transition-all" title="Numbered list">
                                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16"><text x="1" y="6" fontSize="5">1.</text><line x1="6" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.5" /><text x="1" y="10" fontSize="5">2.</text><line x1="6" y1="9" x2="14" y2="9" stroke="currentColor" strokeWidth="1.5" /><text x="1" y="14" fontSize="5">3.</text><line x1="6" y1="13" x2="14" y2="13" stroke="currentColor" strokeWidth="1.5" /></svg>
                                        </button>
                                      </div>
                                      {/* Editable area */}
                                      <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={e => setProducts(prev => prev.map(p => p.id === product.id ? { ...p, specification: (e.target as HTMLDivElement).innerHTML } : p))}
                                        data-placeholder="Enter Specifications / Details..."
                                        className="flex-1 overflow-y-auto px-3 py-2.5 text-sm text-gray-800 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:italic empty:before:pointer-events-none"
                                        style={{ lineHeight: "1.65" }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Reference Link */}
                                <div className="relative">
                                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                  <input
                                    value={product.referenceLink}
                                    onChange={e => setProducts(prev => prev.map(p => p.id === product.id ? { ...p, referenceLink: e.target.value } : p))}
                                    placeholder="https://example.com/reference-link"
                                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
                                  />
                                </div>
                              </div>
                            ) : (
                              /* ── View card ── */
                              <div className="p-5">
                                <div className="flex gap-4">
                                  {/* Thumbnails */}
                                  {product.photos.length > 0 ? (
                                    <div className="flex gap-1.5 flex-shrink-0">
                                      {product.photos.slice(0, 3).map((photo, pIdx) => (
                                        <div key={pIdx} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                          <img src={photo} alt="" className="w-full h-full object-cover" />
                                        </div>
                                      ))}
                                      {product.photos.length > 3 && (
                                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                          <span className="text-xs font-headline font-bold text-gray-500">+{product.photos.length - 3}</span>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="w-16 h-16 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center flex-shrink-0">
                                      <ImageIcon className="w-5 h-5 text-gray-300" />
                                    </div>
                                  )}
                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <h5 className="font-serif font-bold text-sm text-gray-900">
                                        {product.name || <span className="text-gray-400 italic font-sans font-normal text-sm">Untitled</span>}
                                      </h5>
                                      <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                          onClick={() => setEditingProductId(product.id)}
                                          className="p-1.5 text-gray-400 hover:text-[#701010] hover:bg-[#701010]/5 rounded-lg transition-colors"
                                          title="Edit"
                                        >
                                          <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => setProducts(prev => prev.filter(p => p.id !== product.id))}
                                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Delete"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                    {product.specification ? (
                                      <div className="text-sm text-gray-600 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: product.specification }} />
                                    ) : (
                                      <p className="text-xs text-gray-400 italic mt-1">No specification added</p>
                                    )}
                                    {product.referenceLink && (
                                      <a
                                        href={product.referenceLink.startsWith("http") ? product.referenceLink : `https://${product.referenceLink}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] text-[#701010] hover:underline mt-2 font-headline font-bold uppercase tracking-wider"
                                      >
                                        <ExternalLink className="w-3 h-3" /> Reference
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Empty state */
                    <div className="text-center py-10">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No {userType === "obo" ? "products" : "services"} listed yet</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click <span className="font-semibold text-gray-600">Add {userType === "obo" ? "Product" : "Service"}</span> above to start building your catalog
                      </p>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        )}
        </div>

        {/* Right Column: Agency Directories */}
        <div className="w-[300px] flex-shrink-0 hidden lg:block space-y-6">
          {/* Section 1: Overseas Marketing Agencies */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h4 className="text-[10px] font-headline font-bold text-gray-900 uppercase tracking-widest leading-none">Marketing Agencies</h4>
              <div className="flex items-center gap-1 text-gray-400">
                <button
                  onClick={() => setActiveMarketingIndex(prev => (prev === 0 ? marketingAgencies.length - 1 : prev - 1))}
                  className="p-1 hover:text-[#701010] hover:bg-gray-50 rounded transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-headline font-bold text-gray-700 min-w-[24px] text-center">
                  {activeMarketingIndex + 1}/{marketingAgencies.length}
                </span>
                <button
                  onClick={() => setActiveMarketingIndex(prev => (prev === marketingAgencies.length - 1 ? 0 : prev + 1))}
                  className="p-1 hover:text-[#701010] hover:bg-gray-50 rounded transition-colors"
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
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mt-0.5">
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
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mt-0.5">
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
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-400 mt-0.5">
                    📍 {legalAgencies[activeLegalIndex].location}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-605 leading-relaxed font-sans">
                {legalAgencies[activeLegalIndex].desc}
              </p>
              <div className="pt-1.5 border-t border-gray-50">
                <a
                  href={`https://${legalAgencies[activeLegalIndex].website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010] hover:underline"
                >
                  <ExternalLink className="w-3 h-3" /> Visit Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
