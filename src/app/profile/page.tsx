"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building, Users, Globe, Award, Briefcase, Phone, Settings, FileText, Check, ChevronDown, ChevronUp, ImageIcon, ArrowLeft
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { saveDocument, getDocument } from "@/lib/firestore-rest";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // States
  const [userType, setUserType] = useState<"obo" | "sp" | "tpsp" | "">("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [isRoleLocked, setIsRoleLocked] = useState(false);

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
    banner: ""
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
    notes: ""
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
    banner: ""
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

        const userData = await getDocument("users", user.uid, idToken);
        if (userData?.role) {
          const role = userData.role as "obo" | "sp" | "tpsp";
          setUserType(role);
          setIsRoleLocked(true);

          if (role === "obo") {
            const oboData = await getDocument("OBO_Profile", user.uid, idToken);
            if (oboData) setOboData(prev => ({ ...prev, ...oboData }));
          } else if (role === "sp") {
            const spData = await getDocument("SP_Profile", user.uid, idToken);
            if (spData) setSpData(prev => ({ ...prev, ...spData, salesChannels: (spData.salesChannels as string[]) || [] }));
          } else if (role === "tpsp") {
            const tpspData = await getDocument("TPSP_Profile", user.uid, idToken);
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
      } catch (err) {
        console.error("Error loading profiles:", err);
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

    try {
      if (!userType) {
        throw new Error("Please select a profile type.");
      }

      // Get a fresh ID token for Firestore REST authentication
      const idToken = await user.getIdToken();

      if (!isRoleLocked) {
        await saveDocument("users", user.uid, {
          uid: user.uid,
          email: user.email || "",
          role: userType,
          createdAt: new Date().toISOString(),
        }, idToken);
        setIsRoleLocked(true);
      }

      if (userType === "obo") {
        if (!oboData.legalName || !oboData.brandName || !oboData.gstNumber || !oboData.incorporationDate || !oboData.revenueRange) {
          throw new Error("Please fill in all mandatory fields: Company Legal Name, Brand Name, GST/TAX Number, Incorporation Date, and Revenue Range.");
        }
        await saveDocument("OBO_Profile", user.uid, oboData as unknown as Record<string, unknown>, idToken);
      } else if (userType === "sp") {
        await saveDocument("SP_Profile", user.uid, spData as unknown as Record<string, unknown>, idToken);
      } else if (userType === "tpsp") {
        if (!tpspData.companyName) {
          throw new Error("Company Name is mandatory for Third Party Service Providers.");
        }
        await saveDocument("TPSP_Profile", user.uid, tpspData as unknown as Record<string, unknown>, idToken);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push("/dashboard");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#701010] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#0d0e12] font-body antialiased flex flex-col pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors text-xs font-headline uppercase font-bold tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <div className="h-4 w-px bg-gray-200" />
            <span className="font-serif font-bold text-[#701010] tracking-wide text-sm">Fractional Sales Portal</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-6 py-10 flex-1 w-full space-y-8">


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

              {/* Banner Edit Trigger */}
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

                {/* Avatar Edit Trigger */}
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
              </div>

              {/* User details (Interactive Name Input) */}
              <div className="flex-1 sm:ml-4 pt-2">
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
                <p className="text-[10px] font-headline text-gray-500 mt-1.5 uppercase tracking-wider font-bold">
                  {userType === "obo" ? "Overseas Business Owner" : userType === "sp" ? "Sales Partner" : "Third Party Service Provider"}
                </p>
              </div>
            </div>
          </div>
        )}

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

            <div>
              <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Brand Name *</label>
              <input
                value={oboData.brandName}
                onChange={e => setOboData({ ...oboData, brandName: e.target.value })}
                placeholder="Brand/Trading Name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
              />
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
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">City</label>
                      <input value={spData.city} onChange={e => setSpData({ ...spData, city: e.target.value })} placeholder="City" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Region/County</label>
                      <input value={spData.regionCounty} onChange={e => setSpData({ ...spData, regionCounty: e.target.value })} placeholder="State/Region" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-550 block mb-1">Country</label>
                      <input value={spData.country} onChange={e => setSpData({ ...spData, country: e.target.value })} placeholder="Country" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none" />
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
                        <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-500 block mb-1">Years of Exp</label>
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
                ) : (
                  <Link
                    href="/dashboard"
                    className="rounded-full px-5 py-2 font-headline text-[10px] uppercase tracking-wider font-bold border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 inline-flex items-center"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="text-[10px] font-headline font-bold uppercase tracking-wider text-gray-700 block mb-1">Location</label>
                <input
                  value={tpspData.location}
                  onChange={e => setTpspData({ ...tpspData, location: e.target.value })}
                  placeholder="City, Country"
                  className="w-full border border-[#701010]/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#701010] bg-white transition-colors"
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
            <Link
              href="/dashboard"
              className="rounded-full px-6 py-2.5 font-headline text-[11px] uppercase tracking-wider font-bold border border-gray-200 hover:bg-gray-100 transition-colors text-gray-700 inline-flex items-center"
            >
              Cancel
            </Link>
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
      </main>
    </div>
  );
}
