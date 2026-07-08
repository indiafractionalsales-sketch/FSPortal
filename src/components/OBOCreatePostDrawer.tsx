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

import { useState, useEffect } from "react";
import { X, MapPin, Briefcase, Globe, Target, CheckSquare, DollarSign, Package, Info, AlertCircle, Image as ImageIcon } from "lucide-react";
import { auth } from "@/lib/firebase";
import { saveDocument } from "@/lib/firestore-rest";
import { uploadImage } from "@/lib/storage-rest";

interface OBOCreatePostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPostData?: Record<string, any> | null;
  authorName?: string;
  authorAvatar?: string;
}

const InputHelper = ({ icon: Icon, label, value, onChange, placeholder, type = "text", required = false, info }: any) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5">
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-headline">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {info && (
        <div className="group relative flex items-center justify-center">
          <Info className="w-3.5 h-3.5 text-gray-400 hover:text-[#701010] cursor-help transition-colors" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center pointer-events-none">
            {info}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder} 
        className={`w-full border border-gray-200 rounded-lg py-2.5 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all ${Icon ? 'pl-9 pr-3' : 'px-3'}`}
      />
    </div>
  </div>
);

const TextareaHelper = ({ icon: Icon, label, value, onChange, placeholder, required = false, info }: any) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5">
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-headline">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {info && (
        <div className="group relative flex items-center justify-center">
          <Info className="w-3.5 h-3.5 text-gray-400 hover:text-[#701010] cursor-help transition-colors" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center pointer-events-none">
            {info}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />}
      <textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder} 
        rows={4}
        className={`w-full border border-gray-200 rounded-lg py-2.5 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none ${Icon ? 'pl-9 pr-3' : 'px-3'}`}
      />
    </div>
  </div>
);

const SelectHelper = ({ icon: Icon, label, value, onChange, options, required = false }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-headline">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className={`w-full border border-gray-200 rounded-lg py-2.5 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all ${Icon ? 'pl-9 pr-3' : 'px-3'}`}
      >
        <option value="">Select...</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  </div>
);

const CheckboxHelper = ({ label, checked, onChange, required = false, info }: any) => (
  <label className="flex items-center gap-3 cursor-pointer group p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="relative flex items-center justify-center">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)}
        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
      />
      <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 10" fill="none">
        <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <div className="flex items-center gap-1.5 flex-1">
      <span className="text-sm font-semibold text-gray-700 select-none">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {info && (
        <div className="group/tooltip relative flex items-center justify-center ml-auto">
          <Info className="w-3.5 h-3.5 text-gray-400 hover:text-[#701010] cursor-help transition-colors" />
          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10 text-center pointer-events-none">
            {info}
            <div className="absolute top-full right-2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  </label>
);


export default function OBOCreatePostDrawer({ isOpen, onClose, onSuccess, editPostData, authorName, authorAvatar }: OBOCreatePostDrawerProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Section 1: Target Market
    targetCountry: "", targetCity: "", targetCustomerType: "", targetIndustry: "", b2bChannels: "", b2cChannels: "", expectedOutcomes: "",
    
    // Section 2: Sales Rep Profile
    languageRequired: "", culturalFamiliarity: "", repLocation: "", minExperience: "", industryExperience: "",
    b2bSalesExperience: false, b2cSalesExperience: false, existingNetwork: false, travelWillingness: false,
    
    // Section 3: Representation Scope
    representationType: "", countriesToCover: "", exclusiveNonExclusive: "", specificExpo: "", 
    competingBrandsRestriction: false, tradeFairRepresentation: false, onlineSalesRepresentation: false, retailChannelDevelopment: false,
    
    // Section 4: Commercial Terms
    engagementType: "", commissionRate: "", retainer: "", fixedCharges: "", currency: "",
    
    // Section 5: Support Provided
    productTraining: false, marketingMaterials: "", sampleProduct: false, leadSupport: false, msmeAttendExpos: false, 
    rightToWorkRequired: false, companyPreferred: false, insuranceRequired: false
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (editPostData && isOpen) {
      setFormData({
        targetCountry: editPostData.targetCountry || "", targetCity: editPostData.targetCity || "", 
        targetCustomerType: editPostData.targetCustomerType || "", targetIndustry: editPostData.targetIndustry || "", 
        b2bChannels: editPostData.b2bChannels || "", b2cChannels: editPostData.b2cChannels || "",
        expectedOutcomes: editPostData.expectedOutcomes || "",
        languageRequired: editPostData.languageRequired || "", culturalFamiliarity: editPostData.culturalFamiliarity || "", 
        repLocation: editPostData.repLocation || "", minExperience: editPostData.minExperience || "", 
        industryExperience: editPostData.industryExperience || "", b2bSalesExperience: editPostData.b2bSalesExperience || false, 
        b2cSalesExperience: editPostData.b2cSalesExperience || false, existingNetwork: editPostData.existingNetwork || false, 
        travelWillingness: editPostData.travelWillingness || false, representationType: editPostData.representationType || "", 
        countriesToCover: editPostData.countriesToCover || "", exclusiveNonExclusive: editPostData.exclusiveNonExclusive || "", 
        specificExpo: editPostData.specificExpo || "", competingBrandsRestriction: editPostData.competingBrandsRestriction || false, 
        tradeFairRepresentation: editPostData.tradeFairRepresentation || false, onlineSalesRepresentation: editPostData.onlineSalesRepresentation || false, 
        retailChannelDevelopment: editPostData.retailChannelDevelopment || false, engagementType: editPostData.engagementType || "", 
        commissionRate: editPostData.commissionRate || "", retainer: editPostData.retainer || "", 
        fixedCharges: editPostData.fixedCharges || "", currency: editPostData.currency || "",
        productTraining: editPostData.productTraining || false, marketingMaterials: editPostData.marketingMaterials || "", 
        sampleProduct: editPostData.sampleProduct || false, leadSupport: editPostData.leadSupport || false, 
        msmeAttendExpos: editPostData.msmeAttendExpos || false, rightToWorkRequired: editPostData.rightToWorkRequired || false, 
        companyPreferred: editPostData.companyPreferred || false, insuranceRequired: editPostData.insuranceRequired || false
      });
      setImagePreview(editPostData.mediaUrl || null);
    } else if (isOpen) {
      setFormData({
        targetCountry: "", targetCity: "", targetCustomerType: "", targetIndustry: "", b2bChannels: "", b2cChannels: "", expectedOutcomes: "",
        languageRequired: "", culturalFamiliarity: "", repLocation: "", minExperience: "", industryExperience: "",
        b2bSalesExperience: false, b2cSalesExperience: false, existingNetwork: false, travelWillingness: false,
        representationType: "", countriesToCover: "", exclusiveNonExclusive: "", specificExpo: "", 
        competingBrandsRestriction: false, tradeFairRepresentation: false, onlineSalesRepresentation: false, retailChannelDevelopment: false,
        engagementType: "", commissionRate: "", retainer: "", fixedCharges: "", currency: "",
        productTraining: false, marketingMaterials: "", sampleProduct: false, leadSupport: false, msmeAttendExpos: false, 
        rightToWorkRequired: false, companyPreferred: false, insuranceRequired: false
      });
      setImageFile(null);
      setImagePreview(null);
      setCurrentStep(1);
    }
  }, [editPostData, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to post.");
      return;
    }

    // Validation of required fields
    const missingFields: string[] = [];
    if (!formData.targetCountry) missingFields.push("Target Country");
    if (!formData.expectedOutcomes) missingFields.push("Partnership Goals & Outcomes");
    if (!formData.targetCustomerType) missingFields.push("Target Customer Type");
    if (!formData.targetIndustry) missingFields.push("Target Industry");
    if (!formData.b2bChannels) missingFields.push("B2B Channels Needed");
    if (!formData.languageRequired) missingFields.push("Language Required");
    if (!formData.repLocation) missingFields.push("Rep Location");
    if (!formData.minExperience) missingFields.push("Minimum Experience");
    if (!formData.countriesToCover) missingFields.push("Countries To Cover");
    if (!formData.engagementType) missingFields.push("Engagement Type");
    if (!formData.currency) missingFields.push("Currency");

    if (missingFields.length > 0) {
      setError(`Please fill in all mandatory fields. Missing: ${missingFields.join(", ")}`);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const idToken = await user.getIdToken();
      
      let uploadedImageUrl = "";
      if (imagePreview && imagePreview.startsWith("data:")) {
        const timestamp = Date.now();
        uploadedImageUrl = await uploadImage(imagePreview, `obo_posts/${user.uid}_${timestamp}.jpg`, idToken);
      } else if (imagePreview) {
        uploadedImageUrl = imagePreview;
      }
      
      const postPayload = {
        ...formData,
        postType: "obo",
        ownerUid: user.uid,
        authorName: authorName || user.displayName || user.email || "User",
        authorAvatar: user.photoURL || "",
        mediaUrl: uploadedImageUrl,
        createdAt: editPostData?.createdAt || new Date().toISOString(),
      };

      const postId = editPostData?.__id || `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await saveDocument("Posts", postId, postPayload as any, idToken);

      setFormData({
        targetCountry: "", targetCity: "", targetCustomerType: "", targetIndustry: "", b2bChannels: "", b2cChannels: "", expectedOutcomes: "",
        languageRequired: "", culturalFamiliarity: "", repLocation: "", minExperience: "", industryExperience: "",
        b2bSalesExperience: false, b2cSalesExperience: false, existingNetwork: false, travelWillingness: false,
        representationType: "", countriesToCover: "", exclusiveNonExclusive: "", specificExpo: "", 
        competingBrandsRestriction: false, tradeFairRepresentation: false, onlineSalesRepresentation: false, retailChannelDevelopment: false,
        engagementType: "", commissionRate: "", retainer: "", fixedCharges: "", currency: "",
        productTraining: false, marketingMaterials: "", sampleProduct: false, leadSupport: false, msmeAttendExpos: false, 
        rightToWorkRequired: false, companyPreferred: false, insuranceRequired: false
      });
      
      setImageFile(null);
      setImagePreview(null);
      setSaving(false);
      setCurrentStep(1);
      onSuccess();

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create post");
      setSaving(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={!saving ? handleClose : undefined} />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl h-full bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col transform transition-transform duration-300 border-l border-white/20">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/50 bg-white/50">
          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900">{editPostData ? "Edit Brand Post" : "Create Brand Post"}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-gray-500 font-headline uppercase tracking-wider">Find Sales Partners</p>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">Step {currentStep} of 5</span>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100/50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
          
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {/* Section 1 */}
          {currentStep === 1 && (
          <section className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <Globe className="w-5 h-5 text-[#701010]" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-headline">Section 1 — Target Market Requirements</h3>
            </div>

            {/* Media Upload */}
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100/60 mb-6">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-headline mb-3 block">
                Post Image (Optional)
              </label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="w-32 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 flex flex-col items-center justify-center cursor-pointer transition-colors flex-shrink-0">
                    <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-[10px] font-headline font-bold uppercase text-gray-500 tracking-wider">Add Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
                <div className="flex-1">
                  <p className="text-xs text-gray-500 leading-snug">
                    Add a banner or product image to make your post stand out on the global feed.
                  </p>
                </div>
              </div>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputHelper label="Target Country" required value={formData.targetCountry} onChange={(v: string) => setFormData({...formData, targetCountry: v})} />
                <InputHelper label="Target City" value={formData.targetCity} onChange={(v: string) => setFormData({...formData, targetCity: v})} />
              </div>
              <div className="mt-4">
                <TextareaHelper 
                  label="Partnership Goals & Expected Outcomes" 
                  required 
                  info="A high-level summary of the outcome you are looking for. Avoid using standard 'Job Description' formats."
                  placeholder="Describe the key objectives, expected sales volume, target accounts, or strategic goals..." 
                  value={formData.expectedOutcomes} 
                  onChange={(v: string) => setFormData({...formData, expectedOutcomes: v})} 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InputHelper label="Target Customer Type" required info="Spa owners, Wellness clinics, Retailers, D2C" value={formData.targetCustomerType} onChange={(v: string) => setFormData({...formData, targetCustomerType: v})} />
              <InputHelper label="Target Industry Vertical" required info="Hospitality, Health & Beauty, Retail" placeholder="Specify if other..." value={formData.targetIndustry} onChange={(v: string) => setFormData({...formData, targetIndustry: v})} />
              <InputHelper label="B2B Channels Needed" required info="Trade fairs, Cold outreach" placeholder="Trade fairs, Cold outreach..." value={formData.b2bChannels} onChange={(v: string) => setFormData({...formData, b2bChannels: v})} />
              <InputHelper label="B2C Channels Needed" info="WhatsApp groups, Instagram, Community events" placeholder="WhatsApp, Instagram..." value={formData.b2cChannels} onChange={(v: string) => setFormData({...formData, b2cChannels: v})} />
            </div>
          </section>
          )}

          {/* Section 2 */}
          {currentStep === 2 && (
          <section className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <Target className="w-5 h-5 text-[#701010]" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-headline">Section 2 — Sales Rep Profile Required</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputHelper label="Language Required" required value={formData.languageRequired} onChange={(v: string) => setFormData({...formData, languageRequired: v})} />
              <InputHelper label="Cultural Familiarity Needed" value={formData.culturalFamiliarity} onChange={(v: string) => setFormData({...formData, culturalFamiliarity: v})} />
              <InputHelper label="Rep Location" required value={formData.repLocation} onChange={(v: string) => setFormData({...formData, repLocation: v})} />
              <InputHelper label="Minimum Experience" required value={formData.minExperience} onChange={(v: string) => setFormData({...formData, minExperience: v})} />
              <InputHelper label="Industry Experience" placeholder="FMCG / Wellness etc..." value={formData.industryExperience} onChange={(v: string) => setFormData({...formData, industryExperience: v})} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <CheckboxHelper label="B2B Sales Experience Required" checked={formData.b2bSalesExperience} onChange={(v: boolean) => setFormData({...formData, b2bSalesExperience: v})} />
              <CheckboxHelper label="B2C Sales Experience Required" checked={formData.b2cSalesExperience} onChange={(v: boolean) => setFormData({...formData, b2cSalesExperience: v})} />
              <CheckboxHelper label="Existing Network Required" checked={formData.existingNetwork} onChange={(v: boolean) => setFormData({...formData, existingNetwork: v})} />
              <CheckboxHelper label="Travel Willingness Required" checked={formData.travelWillingness} onChange={(v: boolean) => setFormData({...formData, travelWillingness: v})} />
            </div>
          </section>
          )}

          {/* Section 3 */}
          {currentStep === 3 && (
          <section className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <Briefcase className="w-5 h-5 text-[#701010]" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-headline">Section 3 — Representation Scope</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectHelper label="Representation Type" value={formData.representationType} onChange={(v: string) => setFormData({...formData, representationType: v})} options={["Domestic", "Cross-border", "Both"]} />
              <InputHelper label="Countries to Cover" required value={formData.countriesToCover} onChange={(v: string) => setFormData({...formData, countriesToCover: v})} />
              <SelectHelper label="Exclusive / Non-Exclusive" value={formData.exclusiveNonExclusive} onChange={(v: string) => setFormData({...formData, exclusiveNonExclusive: v})} options={["Exclusive", "Non-Exclusive"]} />
              <InputHelper label="Specific Expo/Event" value={formData.specificExpo} onChange={(v: string) => setFormData({...formData, specificExpo: v})} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <CheckboxHelper label="Competing Brands Restriction" checked={formData.competingBrandsRestriction} onChange={(v: boolean) => setFormData({...formData, competingBrandsRestriction: v})} />
              <CheckboxHelper label="Trade Fair Representation" checked={formData.tradeFairRepresentation} onChange={(v: boolean) => setFormData({...formData, tradeFairRepresentation: v})} />
              <CheckboxHelper label="Online Sales Representation" checked={formData.onlineSalesRepresentation} onChange={(v: boolean) => setFormData({...formData, onlineSalesRepresentation: v})} />
              <CheckboxHelper label="Retail Channel Development" checked={formData.retailChannelDevelopment} onChange={(v: boolean) => setFormData({...formData, retailChannelDevelopment: v})} />
            </div>
          </section>
          )}

          {/* Section 4 */}
          {currentStep === 4 && (
          <section className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <DollarSign className="w-5 h-5 text-[#701010]" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-headline">Section 4 — Commercial Terms</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectHelper label="Engagement Type" required value={formData.engagementType} onChange={(v: string) => setFormData({...formData, engagementType: v})} options={["Commission only", "Fixed one-time Charges", "Fixed + Commission", "Project/Retainer + Commission"]} />
              <InputHelper label="Commission Rate Offered" value={formData.commissionRate} onChange={(v: string) => setFormData({...formData, commissionRate: v})} />
              <InputHelper label="Retainer Offered" value={formData.retainer} onChange={(v: string) => setFormData({...formData, retainer: v})} />
              <InputHelper label="Fixed Charges Offered" value={formData.fixedCharges} onChange={(v: string) => setFormData({...formData, fixedCharges: v})} />
              <InputHelper label="Currency of Payment" required value={formData.currency} onChange={(v: string) => setFormData({...formData, currency: v})} />
            </div>
          </section>
          )}

          {/* Section 5 */}
          {currentStep === 5 && (
          <section className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <Package className="w-5 h-5 text-[#701010]" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-headline">Section 5 — Support Provided</h3>
            </div>
            <div className="mb-4">
              <InputHelper label="Marketing Materials Provided" placeholder="online / print..." value={formData.marketingMaterials} onChange={(v: string) => setFormData({...formData, marketingMaterials: v})} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CheckboxHelper label="Product Training Provided" checked={formData.productTraining} onChange={(v: boolean) => setFormData({...formData, productTraining: v})} />
              <CheckboxHelper label="Sample Product Provided" checked={formData.sampleProduct} onChange={(v: boolean) => setFormData({...formData, sampleProduct: v})} />
              <CheckboxHelper label="Lead Support from Brand" checked={formData.leadSupport} onChange={(v: boolean) => setFormData({...formData, leadSupport: v})} />
              <CheckboxHelper label="Brand Attend Expos With Rep" checked={formData.msmeAttendExpos} onChange={(v: boolean) => setFormData({...formData, msmeAttendExpos: v})} />
              <CheckboxHelper label="Rep Must Have Right to Work" required checked={formData.rightToWorkRequired} onChange={(v: boolean) => setFormData({...formData, rightToWorkRequired: v})} />
              <CheckboxHelper label="Self-employed / Ltd Co. Preferred" checked={formData.companyPreferred} onChange={(v: boolean) => setFormData({...formData, companyPreferred: v})} />
              <CheckboxHelper label="Insurance Required" checked={formData.insuranceRequired} onChange={(v: boolean) => setFormData({...formData, insuranceRequired: v})} />
            </div>
          </section>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100/50 bg-white/50 flex justify-between items-center gap-3">
          {currentStep === 1 ? (
            <button onClick={handleClose} disabled={saving} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-headline uppercase tracking-wider disabled:opacity-50">
              Cancel
            </button>
          ) : (
            <button onClick={() => setCurrentStep(prev => prev - 1)} disabled={saving} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-headline uppercase tracking-wider disabled:opacity-50">
              Back
            </button>
          )}
          
          {currentStep < 5 ? (
            <button onClick={() => setCurrentStep(prev => prev + 1)} className="px-6 py-2.5 text-sm font-bold text-white bg-gray-900 hover:bg-black rounded-lg transition-colors shadow-sm font-headline uppercase tracking-wider">
              Next Step
            </button>
          ) : (
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 text-sm font-bold text-white bg-[#701010] hover:bg-[#5a0c0c] rounded-lg transition-colors shadow-sm font-headline uppercase tracking-wider flex items-center gap-2 disabled:opacity-50">
              {saving ? "Saving..." : (editPostData ? "Save Changes" : "Create Post")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
