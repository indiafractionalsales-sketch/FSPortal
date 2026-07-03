"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building, Briefcase, Settings, ImageIcon } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { saveDocument } from "@/lib/firestore-rest";
import { uploadImage } from "@/lib/storage-rest";

// Helper Components (Must be outside the main component to prevent focus loss on re-render)
const Input = ({ label, value, onChange, type = "text", placeholder = "", required = false }: any) => (
  <div className="flex flex-col gap-1.5 mb-4 w-full">
    <label className="text-sm font-semibold text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
    <input 
      type={type} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none" 
    />
  </div>
);

const Select = ({ label, value, onChange, options, required = false }: any) => (
  <div className="flex flex-col gap-1.5 mb-4 w-full">
    <label className="text-sm font-semibold text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none bg-white"
    >
      <option value="">Select option</option>
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default function OnboardingWizard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Wizard State
  const [currentStep, setCurrentStep] = useState(0); // 0 = Role Selection, 1+ = Details
  const [userType, setUserType] = useState<"obo" | "sp" | "tpsp" | "">("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);

  // Data States
  const [oboData, setOboData] = useState({
    legalName: "", brandName: "", gstNumber: "", incorporationDate: "", revenueRange: "",
    phone: "", website: "", instaHandle: "", fbHandle: "", linkedinHandle: "", logo: "", banner: ""
  });

  const [spData, setSpData] = useState({
    fullName: "", preferredName: "", gender: "", dob: "", nationality: "", primaryLanguage: "", secondaryLanguage: "", profilePhoto: "", banner: "",
    mobilePrimary: "", mobileWhatsapp: "", emailPersonal: "", linkedinProfile: "", instagram: "", city: "", regionCounty: "", country: "", postcode: "", timeZone: "",
    employmentStatus: "", jobTitle: "", industryExperience: "", yearsExperience: "", b2bB2cExperience: "", targetMarket: "", languagesSales: "",
    salesChannels: [] as string[], avgDealSize: "", pastBrands: "", productCategories: "",
    engagementType: "", commissionStructure: "",
    whatsappGroups: "", socialFollowing: "", communityAccess: "", tradeFairExp: "", retailConnections: "",
    rightToWork: "", companyName: "", companyRegNo: "", gdprCompliant: "", status: "Active", performanceRating: "", notes: ""
  });

  const [tpspData, setTpspData] = useState({
    companyName: "", services: "", contactPerson: "", phone: "", email: "", website: "", location: "", logo: "", banner: ""
  });

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

  // Step Configurations
  const OBO_STEPS = ["Basic Details", "Contact & Socials", "Branding"];
  const SP_STEPS = ["Personal Info", "Contact Details", "Professional Experience", "Sales & Network", "Compliance & Media"];
  const TPSP_STEPS = ["Company Info", "Contact Details", "Branding"];

  const steps = userType === "obo" ? OBO_STEPS : userType === "sp" ? SP_STEPS : userType === "tpsp" ? TPSP_STEPS : [];

  const handleNext = () => {
    if (currentStep === steps.length) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const isStepValid = () => {
    if (currentStep === 0) return !!userType;
    
    if (userType === "obo") {
      if (currentStep === 1) return !!oboData.legalName && !!oboData.brandName && !!oboData.gstNumber;
      if (currentStep === 2) return !!oboData.phone && !!oboData.website;
      if (currentStep === 3) return !!oboData.logo && !!oboData.banner && gdprConsent;
    }
    if (userType === "sp") {
      if (currentStep === 1) return !!spData.fullName;
      if (currentStep === 2) return !!spData.mobilePrimary;
      if (currentStep === 5) return !!spData.profilePhoto && !!spData.banner && gdprConsent;
    }
    if (userType === "tpsp") {
      if (currentStep === 1) return !!tpspData.companyName && !!tpspData.services && !!tpspData.contactPerson;
      if (currentStep === 2) return !!tpspData.phone && !!tpspData.website;
      if (currentStep === 3) return !!tpspData.logo && !!tpspData.banner && gdprConsent;
    }
    return true;
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    setError("");

    try {
      const idToken = await user.getIdToken();

      // Save User Doc
      await saveDocument("users", user.uid, {
        uid: user.uid,
        email: user.email || "",
        role: userType,
        createdAt: new Date().toISOString(),
        gdprConsent: gdprConsent,
        gdprConsentDate: new Date().toISOString(),
      }, idToken);

      // Save Profile Doc
      if (userType === "obo") {
        const finalData = { ...oboData, gdprConsent, gdprConsentDate: new Date().toISOString() };
        if (finalData.logo?.startsWith("data:")) finalData.logo = await uploadImage(finalData.logo, `profiles/${user.uid}/avatar.jpg`, idToken);
        if (finalData.banner?.startsWith("data:")) finalData.banner = await uploadImage(finalData.banner, `profiles/${user.uid}/banner.jpg`, idToken);
        await saveDocument("OBO_Profile", user.uid, finalData as any, idToken);
      } else if (userType === "sp") {
        const finalData = { ...spData, gdprConsent, gdprConsentDate: new Date().toISOString() };
        if (finalData.profilePhoto?.startsWith("data:")) finalData.profilePhoto = await uploadImage(finalData.profilePhoto, `profiles/${user.uid}/avatar.jpg`, idToken);
        if (finalData.banner?.startsWith("data:")) finalData.banner = await uploadImage(finalData.banner, `profiles/${user.uid}/banner.jpg`, idToken);
        await saveDocument("SP_Profile", user.uid, finalData as any, idToken);
      } else if (userType === "tpsp") {
        const finalData = { ...tpspData, gdprConsent, gdprConsentDate: new Date().toISOString() };
        if (finalData.logo?.startsWith("data:")) finalData.logo = await uploadImage(finalData.logo, `profiles/${user.uid}/avatar.jpg`, idToken);
        if (finalData.banner?.startsWith("data:")) finalData.banner = await uploadImage(finalData.banner, `profiles/${user.uid}/banner.jpg`, idToken);
        await saveDocument("TPSP_Profile", user.uid, finalData as any, idToken);
      }

      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Failed to create profile");
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (userType === "obo") setOboData(prev => ({ ...prev, [field]: base64 }));
        if (userType === "sp") setSpData(prev => ({ ...prev, [field]: base64 }));
        if (userType === "tpsp") setTpspData(prev => ({ ...prev, [field]: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Helpers are now outside the component

  if (loading) return null;

  return (
    <main className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left side: Image */}
      <div className="hidden md:block md:w-1/2 relative bg-gray-900 flex-shrink-0">
        <Image src="/hero-collage.png" alt="Sales professionals networking" fill priority className="object-cover opacity-100 brightness-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl font-serif font-bold mb-4">Join Fractional Sales</h2>
          <p className="text-lg opacity-90">Set up your profile to connect with top-tier brands and high-performance sales partners globally.</p>
        </div>
      </div>

      {/* Right side: Wizard */}
      <div className="w-full md:w-1/2 flex flex-col h-screen overflow-y-auto bg-gray-50/30">
        <div className="max-w-xl w-full mx-auto p-8 lg:p-12 flex-1 flex flex-col">
          
          <div className="mb-10">
            {currentStep > 0 && (
              <div className="mb-8">
                <div className="text-sm font-bold text-indigo-600 mb-2 font-headline uppercase tracking-wider">Step {currentStep} of {steps.length}</div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{steps[currentStep - 1]}</h1>
                <div className="flex gap-1 mt-4">
                  {steps.map((s, idx) => (
                    <div key={idx} className={`h-1 flex-1 rounded-full ${idx < currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            {error && <div className="p-4 mb-6 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">{error}</div>}

            {/* Step 0: Role Selection */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">How will you use the portal?</h1>
                
                {[
                  { id: "obo", title: "Brand / Business Owner", desc: "I want to list my products/services and find sales partners.", icon: Building },
                  { id: "sp", title: "Sales Partner", desc: "I want to find products to sell and earn commissions.", icon: Briefcase },
                  { id: "tpsp", title: "Third Party Provider", desc: "I provide supporting services like marketing or legal.", icon: Settings }
                ].map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setUserType(role.id as any)}
                    className={`w-full text-left p-6 rounded-xl border-2 transition-all flex items-start gap-4 ${
                      userType === role.id ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${userType === role.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <role.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{role.title}</div>
                      <div className="text-gray-500 text-sm mt-1">{role.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* OBO Forms */}
            {userType === "obo" && currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Input label="Legal Company Name" required value={oboData.legalName} onChange={(v: string) => setOboData(p => ({...p, legalName: v}))} />
                <Input label="Brand Name" required value={oboData.brandName} onChange={(v: string) => setOboData(p => ({...p, brandName: v}))} />
                <Input label="GST/TAX Number" required value={oboData.gstNumber} onChange={(v: string) => setOboData(p => ({...p, gstNumber: v}))} />
                <Input label="Incorporation Date" type="date" value={oboData.incorporationDate} onChange={(v: string) => setOboData(p => ({...p, incorporationDate: v}))} />
                <Select label="Revenue Range" value={oboData.revenueRange} onChange={(v: string) => setOboData(p => ({...p, revenueRange: v}))} options={["Pre-revenue", "$0-$1M", "$1M-$5M", "$5M+"]} />
              </div>
            )}
            {userType === "obo" && currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Input label="Phone Number" required value={oboData.phone} onChange={(v: string) => setOboData(p => ({...p, phone: v}))} />
                <Input label="Website" required value={oboData.website} onChange={(v: string) => setOboData(p => ({...p, website: v}))} />
                <Input label="LinkedIn Profile" value={oboData.linkedinHandle} onChange={(v: string) => setOboData(p => ({...p, linkedinHandle: v}))} />
                <Input label="Instagram Handle" value={oboData.instaHandle} onChange={(v: string) => setOboData(p => ({...p, instaHandle: v}))} />
                <Input label="Facebook Page" value={oboData.fbHandle} onChange={(v: string) => setOboData(p => ({...p, fbHandle: v}))} />
              </div>
            )}

            {/* SP Forms */}
            {userType === "sp" && currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Input label="Full Name" required value={spData.fullName} onChange={(v: string) => setSpData(p => ({...p, fullName: v}))} />
                <Input label="Preferred Name" value={spData.preferredName} onChange={(v: string) => setSpData(p => ({...p, preferredName: v}))} />
                <Select label="Gender" value={spData.gender} onChange={(v: string) => setSpData(p => ({...p, gender: v}))} options={["Male", "Female", "Other", "Prefer not to say"]} />
                <Input label="Date of Birth" type="date" value={spData.dob} onChange={(v: string) => setSpData(p => ({...p, dob: v}))} />
                <Input label="Nationality" value={spData.nationality} onChange={(v: string) => setSpData(p => ({...p, nationality: v}))} />
              </div>
            )}
            {userType === "sp" && currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Input label="Primary Mobile" required value={spData.mobilePrimary} onChange={(v: string) => setSpData(p => ({...p, mobilePrimary: v}))} />
                <Input label="WhatsApp Number" value={spData.mobileWhatsapp} onChange={(v: string) => setSpData(p => ({...p, mobileWhatsapp: v}))} />
                <Input label="Personal Email" type="email" value={spData.emailPersonal} onChange={(v: string) => setSpData(p => ({...p, emailPersonal: v}))} />
                <Input label="City" value={spData.city} onChange={(v: string) => setSpData(p => ({...p, city: v}))} />
                <Input label="Country" value={spData.country} onChange={(v: string) => setSpData(p => ({...p, country: v}))} />
              </div>
            )}
            {userType === "sp" && currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Select label="Employment Status" value={spData.employmentStatus} onChange={(v: string) => setSpData(p => ({...p, employmentStatus: v}))} options={["Freelance", "Employed", "Part-time"]} />
                <Input label="Job Title" value={spData.jobTitle} onChange={(v: string) => setSpData(p => ({...p, jobTitle: v}))} />
                <Input label="Years of Experience" type="number" value={spData.yearsExperience} onChange={(v: string) => setSpData(p => ({...p, yearsExperience: v}))} />
                <Select label="Focus Area" value={spData.b2bB2cExperience} onChange={(v: string) => setSpData(p => ({...p, b2bB2cExperience: v}))} options={["B2B", "B2C", "Both"]} />
              </div>
            )}
            {userType === "sp" && currentStep === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Input label="LinkedIn Profile" value={spData.linkedinProfile} onChange={(v: string) => setSpData(p => ({...p, linkedinProfile: v}))} />
                <Input label="Social Following (Approx)" value={spData.socialFollowing} onChange={(v: string) => setSpData(p => ({...p, socialFollowing: v}))} />
                <Input label="Average Deal Size" value={spData.avgDealSize} onChange={(v: string) => setSpData(p => ({...p, avgDealSize: v}))} />
                <Input label="Past Brands Worked With" value={spData.pastBrands} onChange={(v: string) => setSpData(p => ({...p, pastBrands: v}))} />
              </div>
            )}
            {userType === "sp" && currentStep === 5 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Select label="Right to Work" value={spData.rightToWork} onChange={(v: string) => setSpData(p => ({...p, rightToWork: v}))} options={["Citizen", "Visa", "No Work Rights"]} />
                <Input label="Company Name (if applicable)" value={spData.companyName} onChange={(v: string) => setSpData(p => ({...p, companyName: v}))} />
                <Input label="Company Reg No." value={spData.companyRegNo} onChange={(v: string) => setSpData(p => ({...p, companyRegNo: v}))} />
              </div>
            )}

            {/* TPSP Forms */}
            {userType === "tpsp" && currentStep === 1 && (
              <div className="grid grid-cols-1 gap-x-4">
                <Input label="Company Name" required value={tpspData.companyName} onChange={(v: string) => setTpspData(p => ({...p, companyName: v}))} />
                <Input label="Primary Services Provided" required value={tpspData.services} onChange={(v: string) => setTpspData(p => ({...p, services: v}))} placeholder="e.g. Legal Consulting, Marketing..." />
                <Input label="Contact Person" required value={tpspData.contactPerson} onChange={(v: string) => setTpspData(p => ({...p, contactPerson: v}))} />
              </div>
            )}
            {userType === "tpsp" && currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Input label="Phone Number" required value={tpspData.phone} onChange={(v: string) => setTpspData(p => ({...p, phone: v}))} />
                <Input label="Email Address" type="email" value={tpspData.email} onChange={(v: string) => setTpspData(p => ({...p, email: v}))} />
                <Input label="Website" required value={tpspData.website} onChange={(v: string) => setTpspData(p => ({...p, website: v}))} />
                <Input label="Location / City" value={tpspData.location} onChange={(v: string) => setTpspData(p => ({...p, location: v}))} />
              </div>
            )}

            {/* Shared Branding/Media Step */}
            {currentStep > 0 && currentStep === steps.length && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Profile Avatar / Logo <span className="text-red-500">*</span></label>
                  <label className="flex items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 overflow-hidden relative group">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, userType === "sp" ? "profilePhoto" : "logo")} />
                    {(userType === "obo" ? oboData.logo : userType === "sp" ? spData.profilePhoto : tpspData.logo) ? (
                      <img src={userType === "obo" ? oboData.logo : userType === "sp" ? spData.profilePhoto : tpspData.logo} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center"><ImageIcon className="w-8 h-8 mb-1 opacity-50" /><span className="text-[10px] font-bold uppercase">Upload</span></div>
                    )}
                  </label>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Cover Banner <span className="text-red-500">*</span></label>
                  <label className="flex items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 overflow-hidden relative">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "banner")} />
                    {(userType === "obo" ? oboData.banner : userType === "sp" ? spData.banner : tpspData.banner) ? (
                      <img src={userType === "obo" ? oboData.banner : userType === "sp" ? spData.banner : tpspData.banner} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center"><ImageIcon className="w-8 h-8 mb-2 opacity-50" /><span className="text-xs font-bold uppercase tracking-wider">Upload Cover Image</span></div>
                    )}
                  </label>
                </div>
                
                {/* GDPR Consent */}
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={gdprConsent} 
                        onChange={(e) => setGdprConsent(e.target.checked)}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                      />
                      <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 10" fill="none">
                        <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      I consent to Fractional Sales Portal storing and processing my personal information, including my name, images, and product/service details, for the purpose of sales and marketing on the platform as per GDPR guidelines. <span className="text-red-500">*</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

          </div>

          {/* Navigation Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
            {currentStep > 0 ? (
              <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 font-semibold px-4 py-2 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div /> // Spacer
            )}

            <button
              onClick={handleNext}
              disabled={saving || !isStepValid()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {saving ? "Saving..." : currentStep === steps.length ? "Finish & Go to Portal" : "Continue"}
              {!saving && currentStep !== steps.length && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
