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
import {
  X, Image as ImageIcon, MapPin, Calendar, Clock, Globe, Video,
  Users, Plus, Trash2, ChevronRight, ChevronLeft,
  Package as PackageIcon, Briefcase, Languages, Target, Zap, Timer,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { saveDocument } from "@/lib/firestore-rest";
import { uploadImage } from "@/lib/storage-rest";
import { getVisitorId } from "@/lib/fingerprint";
import { SPServiceAgreementModal } from "@/components/SPServiceAgreementModal";
import { getSPServiceAgreementDetails } from "@/lib/sp-service-agreement-template";

interface SPCreatePostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPostData?: Record<string, any> | null;
  authorName?: string;
  authorAvatar?: string;
  preferredCurrency?: string;
}

interface LineItem {
  id: string;
  description: string;
  cost: string;
}

interface Package {
  id: string;
  name: string;
  items: LineItem[];
  outwardCurrency: string;
}

type PostSubType = "event" | "consultancy";

// ─── Shared small helpers ──────────────────────────────────────────────────

const InputHelper = ({
  icon: Icon, label, value, onChange, placeholder, type = "text",
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider font-headline">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border border-gray-200 rounded-lg py-1.5 bg-white/50 focus:bg-white text-xs text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all ${Icon ? "pl-8 pr-2" : "px-2"}`}
      />
    </div>
  </div>
);

const SelectHelper = ({
  icon: Icon, label, value, onChange, children,
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider font-headline">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border border-gray-200 rounded-lg py-1.5 bg-white/50 focus:bg-white text-xs text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all appearance-none ${Icon ? "pl-8 pr-2" : "px-2"}`}
      >
        {children}
      </select>
    </div>
  </div>
);

const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case "EUR": return "€";
    case "GBP": return "£";
    case "INR": return "₹";
    case "AUD": return "A$";
    case "CAD": return "C$";
    case "USD": default: return "$";
  }
};

// ─── Main Component ────────────────────────────────────────────────────────

export default function SPCreatePostDrawer({
  isOpen, onClose, onSuccess, editPostData, authorName, authorAvatar, preferredCurrency = "USD",
}: SPCreatePostDrawerProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // step: 0 = type selector, 1 = form details, 2 = packages
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [spPostSubType, setSpPostSubType] = useState<PostSubType>("event");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  // ── Event form fields ────────────────────────────────────────────────────
  const [eventForm, setEventForm] = useState({
    eventName: "",
    eventUrl: "",
    date: "",
    time: "",
    country: "",
    city: "",
    pincode: "",
    venue: "",
    googleMapLink: "",
    expectedFootfall: "",
    videoUrl: "",
    description: "",
  });

  // ── Consultancy form fields ──────────────────────────────────────────────
  const [consultancyForm, setConsultancyForm] = useState({
    serviceTitle: "",       // e.g. "Pharma Market Entry — UK"
    domain: "",             // e.g. "Pharmaceuticals"
    specialisation: "",     // free-text expert pitch
    targetMarkets: "",      // e.g. "UK, EU, Canada"
    engagementMode: "",     // "Remote" | "On-site" | "Hybrid"
    engagementDuration: "", // e.g. "3–6 months"
    languages: "",          // e.g. "English, Hindi, French"
    videoUrl: "",
    description: "",        // detailed description / what you can do
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);

  // ── Reset / prefill on open ──────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      if (editPostData) {
        const subType: PostSubType =
          editPostData.spPostSubType === "consultancy" ? "consultancy" : "event";
        setSpPostSubType(subType);
        setStep(1); // skip selector for edits
        if (subType === "event") {
          setEventForm({
            eventName: editPostData.eventName || "",
            eventUrl: editPostData.eventUrl || "",
            date: editPostData.date || "",
            time: editPostData.time || "",
            country: editPostData.country || "",
            city: editPostData.city || "",
            pincode: editPostData.pincode || "",
            venue: editPostData.venue || "",
            googleMapLink: editPostData.googleMapLink || "",
            expectedFootfall: editPostData.expectedFootfall || "",
            videoUrl: editPostData.videoUrl || "",
            description: editPostData.description || "",
          });
        } else {
          setConsultancyForm({
            serviceTitle: editPostData.serviceTitle || "",
            domain: editPostData.domain || "",
            specialisation: editPostData.specialisation || "",
            targetMarkets: editPostData.targetMarkets || "",
            engagementMode: editPostData.engagementMode || "",
            engagementDuration: editPostData.engagementDuration || "",
            languages: editPostData.languages || "",
            videoUrl: editPostData.videoUrl || "",
            description: editPostData.description || "",
          });
        }
        setImagePreview(editPostData.mediaUrl || null);
        setPackages(editPostData.packages || []);
        setAgreedToTerms(editPostData.spAgreementAccepted || false);
        setShowAgreementModal(false);
      } else {
        // fresh create
        setStep(0);
        setSpPostSubType("event");
        setEventForm({
          eventName: "", eventUrl: "", date: "", time: "", country: "", city: "",
          pincode: "", venue: "", googleMapLink: "", expectedFootfall: "", videoUrl: "", description: "",
        });
        setConsultancyForm({
          serviceTitle: "", domain: "", specialisation: "", targetMarkets: "",
          engagementMode: "", engagementDuration: "", languages: "", videoUrl: "", description: "",
        });
        setImageFile(null);
        setImagePreview(null);
        setPackages([]);
        setAgreedToTerms(false);
        setShowAgreementModal(false);
        setError("");
      }
    }
  }, [editPostData, isOpen]);

  if (!isOpen) return null;

  // ── Image handler ────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ── Package helpers ──────────────────────────────────────────────────────
  const addPackage = () => {
    if (packages.length >= 3) return;

    const defaultName =
      spPostSubType === "consultancy"
        ? packages.length === 0
          ? "Discovery Call"
          : packages.length === 1
          ? "Market Advisory & Strategy"
          : "Full Market Execution"
        : `Package ${packages.length + 1}`;

    const defaultDesc =
      spPostSubType === "consultancy"
        ? packages.length === 0
          ? "30–60 Min Discovery Call"
          : "Market Entry Strategy & Advisory"
        : "General Representation & Stall Management";

    const defaultCost =
      spPostSubType === "consultancy" && packages.length === 0 ? "2500" : "5000";

    const newPkg: Package = {
      id: `pkg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: defaultName,
      items: [{ id: `item_${Date.now()}`, description: defaultDesc, cost: defaultCost }],
      outwardCurrency: preferredCurrency,
    };
    setPackages([...packages, newPkg]);
  };

  const removePackage = (pkgId: string) =>
    setPackages(packages.filter((p) => p.id !== pkgId));

  const addLineItem = (pkgId: string) =>
    setPackages(
      packages.map((p) =>
        p.id === pkgId
          ? { ...p, items: [...p.items, { id: `item_${Date.now()}`, description: "", cost: "" }] }
          : p,
      ),
    );

  const removeLineItem = (pkgId: string, itemId: string) =>
    setPackages(
      packages.map((p) =>
        p.id === pkgId ? { ...p, items: p.items.filter((i) => i.id !== itemId) } : p,
      ),
    );

  const updateLineItem = (pkgId: string, itemId: string, field: "description" | "cost", value: string) =>
    setPackages(
      packages.map((p) =>
        p.id === pkgId
          ? { ...p, items: p.items.map((i) => (i.id === itemId ? { ...i, [field]: value } : i)) }
          : p,
      ),
    );

  const updatePackageName = (pkgId: string, name: string) =>
    setPackages(packages.map((p) => (p.id === pkgId ? { ...p, name } : p)));

  const calculateTotalCost = (items: LineItem[]) =>
    items
      .reduce((total, item) => total + (parseFloat(item.cost) || 0), 0)
      .toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  // ── Navigation ───────────────────────────────────────────────────────────
  const handleSelectType = (type: PostSubType) => {
    setSpPostSubType(type);
    setStep(1);
    setError("");
  };

  const handleNext = () => {
    setError("");
    if (spPostSubType === "event") {
      if (!eventForm.eventName.trim()) return setError("Event Name is required.");
      if (!eventForm.date.trim()) return setError("Event Date is required.");
      if (!eventForm.country.trim()) return setError("Country is required.");
      if (!eventForm.city.trim()) return setError("City is required.");
    } else {
      if (!consultancyForm.serviceTitle.trim()) return setError("Service Title is required.");
      if (!consultancyForm.domain.trim()) return setError("Domain / Industry is required.");
      if (!consultancyForm.specialisation.trim()) return setError("Specialisation Statement is required.");
      if (!consultancyForm.targetMarkets.trim()) return setError("Target Markets are required.");
    }
    if (!agreedToTerms) return setError("Please accept the Sales Partner Representation & Listing Agreement to proceed.");
    if (packages.length === 0) addPackage();
    setStep(2);
  };

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setError("");
    if (!agreedToTerms) {
      setStep(1);
      return setError("Please accept the Sales Partner Representation & Listing Agreement to proceed.");
    }
    if (packages.length === 0) return setError("Please add at least one package option.");
    for (const pkg of packages) {
      if (!pkg.name.trim()) return setError("All packages must have a title.");
      if (pkg.items.length === 0) return setError(`Package "${pkg.name}" must have at least one line item.`);
      for (const item of pkg.items) {
        if (!item.description.trim()) return setError(`Line item in "${pkg.name}" is missing a description.`);
        if (!item.cost.trim() || isNaN(Number(item.cost)) || Number(item.cost) <= 0)
          return setError(`Line item "${item.description || "unnamed"}" in "${pkg.name}" must have a valid positive cost.`);
      }
    }
    await executeSave();
  };

  const executeSave = async () => {
    setSaving(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const idToken = await user.getIdToken();

      // Telemetry (non-blocking)
      try {
        const visitorId = await getVisitorId();
        const label = spPostSubType === "consultancy"
          ? consultancyForm.serviceTitle
          : eventForm.eventName;
        fetch("/api/security/telemetry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "CREATE_POST", visitorId, userId: user.uid, extraDetails: { label } }),
        }).catch(() => {});
      } catch { /* non-blocking */ }

      // Image upload
      let uploadedImageUrl = "";
      if (imagePreview && imagePreview.startsWith("data:")) {
        uploadedImageUrl = await uploadImage(imagePreview, `sp_posts/${user.uid}_${Date.now()}.jpg`, idToken);
      } else if (imagePreview) {
        uploadedImageUrl = imagePreview;
      }

      // Agreement details — use event-style data where available
      const agreementEventName =
        spPostSubType === "event" ? eventForm.eventName : consultancyForm.serviceTitle;
      const spAgreementDetails = getSPServiceAgreementDetails({
        spName: authorName || user.displayName || user.email || "Sales Partner",
        spEmail: user.email || "",
        eventName: agreementEventName,
        venue: spPostSubType === "event" ? eventForm.venue : undefined,
        city: spPostSubType === "event" ? eventForm.city : undefined,
        country: spPostSubType === "event" ? eventForm.country : undefined,
        date: spPostSubType === "event" ? eventForm.date : undefined,
        currency: preferredCurrency,
      });

      // Build payload
      const baseFields = {
        packages,
        preferredCurrency,
        postType: "sp",
        spPostSubType,
        ownerUid: user.uid,
        authorName: authorName || user.displayName || user.email || "User",
        authorAvatar: authorAvatar || user.photoURL || "",
        mediaUrl: uploadedImageUrl,
        createdAt: editPostData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        spAgreementAccepted: true,
        spAgreementAcceptedAt: new Date().toISOString(),
        spAgreementRefNo: spAgreementDetails.refNo,
      };

      const typeSpecificFields =
        spPostSubType === "event"
          ? { ...eventForm }
          : { ...consultancyForm };

      const postPayload = { ...typeSpecificFields, ...baseFields };
      const postId =
        editPostData?.__id ||
        `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await saveDocument("Posts", postId, postPayload as any, idToken);

      // Reset
      setEventForm({
        eventName: "", eventUrl: "", date: "", time: "", country: "", city: "",
        pincode: "", venue: "", googleMapLink: "", expectedFootfall: "", videoUrl: "", description: "",
      });
      setConsultancyForm({
        serviceTitle: "", domain: "", specialisation: "", targetMarkets: "",
        engagementMode: "", engagementDuration: "", languages: "", videoUrl: "", description: "",
      });
      setImageFile(null);
      setImagePreview(null);
      setPackages([]);
      setStep(0);
      setShowAgreementModal(false);
      setSaving(false);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create post");
      setSaving(false);
    }
  };

  // ── Step labels ──────────────────────────────────────────────────────────
  const stepLabels = ["Select Type", "Details", "Packages"];
  const activeStep = step; // 0, 1, 2

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={!saving ? onClose : undefined}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl h-full bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col transform transition-transform duration-300 ease-out border-l border-white/20">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/50 bg-white/50">
          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900">
              {editPostData ? "Edit Post" : "Create Post"}
            </h2>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 mt-1">
              {stepLabels.map((label, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full transition-colors ${
                      activeStep === idx
                        ? "bg-indigo-100 text-indigo-700"
                        : activeStep > idx
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                  {idx < stepLabels.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                  )}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">

          {error && (
            <div className="p-3 mb-6 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* ── STEP 0: Type Selector ──────────────────────────────────── */}
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div className="text-center mb-2">
                <h3 className="text-base font-bold text-gray-900 mb-1">What kind of post are you creating?</h3>
                <p className="text-xs text-gray-500">Choose the type that best describes your offering.</p>
              </div>

              {/* Event Card */}
              <button
                onClick={() => handleSelectType("event")}
                className="group relative w-full text-left rounded-2xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-100 bg-white p-6 transition-all duration-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center shrink-0 transition-colors">
                    <span className="text-2xl">🎪</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-gray-900 font-headline">Event / Expo Representation</h4>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      I will physically represent a brand or business at an upcoming event, expo, or trade fair. Includes stall management, live streaming, and lead collection.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {["Venue-based", "Event Date Required", "Footfall Tracking", "Live Check-in"].map((tag) => (
                        <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>

              {/* Consultancy Card */}
              <button
                onClick={() => handleSelectType("consultancy")}
                className="group relative w-full text-left rounded-2xl border-2 border-gray-200 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-100 bg-white p-6 transition-all duration-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 group-hover:bg-teal-200 flex items-center justify-center shrink-0 transition-colors">
                    <span className="text-2xl">💼</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-gray-900 font-headline">Business Consultancy</h4>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      I am a domain specialist who can introduce or sell products/services into a specific market — e.g., introducing pharma products into the UK, or FMCG into the Middle East.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {["Remote / On-site", "Market Entry", "No Venue Required", "Domain Expertise"].map((tag) => (
                        <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full border border-teal-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* ── STEP 1: Form Fields ────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-8">

              {/* ── Event Form ── */}
              {spPostSubType === "event" && (
                <>
                  {/* Event Basics */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-indigo-900 border-b border-indigo-100 pb-1.5 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Event Basics & Pitch
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <InputHelper label="Event Name *" value={eventForm.eventName} onChange={(v) => setEventForm({ ...eventForm, eventName: v })} placeholder="e.g. Tech Summit" />
                      <InputHelper type="date" label="Date *" value={eventForm.date} onChange={(v) => setEventForm({ ...eventForm, date: v })} />
                      <InputHelper type="time" icon={Clock} label="Time" value={eventForm.time} onChange={(v) => setEventForm({ ...eventForm, time: v })} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <InputHelper icon={Globe} label="Event URL" value={eventForm.eventUrl} onChange={(v) => setEventForm({ ...eventForm, eventUrl: v })} placeholder="https://..." />
                      <InputHelper icon={Video} label="Video URL" value={eventForm.videoUrl} onChange={(v) => setEventForm({ ...eventForm, videoUrl: v })} placeholder="https://..." />
                      <SelectHelper icon={Users} label="Footfall" value={eventForm.expectedFootfall} onChange={(v) => setEventForm({ ...eventForm, expectedFootfall: v })}>
                        <option value="">Select Range</option>
                        <option value="0-100">0 – 100</option>
                        <option value="100-500">100 – 500</option>
                        <option value="500-1000">500 – 1000</option>
                        <option value="1000-5000">1000 – 5000</option>
                        <option value="5000+">5000+</option>
                      </SelectHelper>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Cover Image */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider font-headline">Cover Image</label>
                        <label className="flex flex-col items-center justify-center w-full h-[76px] rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50/50 bg-white/30 overflow-hidden relative transition-colors group">
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                          {imagePreview ? (
                            <>
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-black/60 text-white text-[9px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">Change</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-gray-400 flex flex-col items-center">
                              <ImageIcon className="w-4 h-4 mb-1 opacity-60 group-hover:text-indigo-500 group-hover:opacity-100 transition-colors" />
                              <span className="text-[9px] font-bold uppercase tracking-wider">Upload Cover</span>
                            </div>
                          )}
                        </label>
                      </div>
                      <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider font-headline">What I can do for you? *</label>
                        <textarea
                          value={eventForm.description}
                          onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                          placeholder="Describe your offering..."
                          rows={3}
                          className="w-full h-full border border-gray-200 rounded-lg p-2 bg-white/50 focus:bg-white text-xs text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-indigo-900 border-b border-indigo-100 pb-1.5 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Location Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <InputHelper label="Venue *" value={eventForm.venue} onChange={(v) => setEventForm({ ...eventForm, venue: v })} placeholder="Grand Hyatt" />
                      <InputHelper label="City *" value={eventForm.city} onChange={(v) => setEventForm({ ...eventForm, city: v })} placeholder="New York" />
                      <InputHelper label="Country *" value={eventForm.country} onChange={(v) => setEventForm({ ...eventForm, country: v })} placeholder="USA" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <InputHelper label="Pincode / ZIP" value={eventForm.pincode} onChange={(v) => setEventForm({ ...eventForm, pincode: v })} placeholder="10001" />
                      <div className="md:col-span-2">
                        <InputHelper icon={MapPin} label="Google Map Link" value={eventForm.googleMapLink} onChange={(v) => setEventForm({ ...eventForm, googleMapLink: v })} placeholder="https://maps.google.com/..." />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── Consultancy Form ── */}
              {spPostSubType === "consultancy" && (
                <>
                  {/* Identity & Expertise */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-teal-900 border-b border-teal-100 pb-1.5 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Service Identity & Expertise
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <InputHelper label="Service Title *" value={consultancyForm.serviceTitle} onChange={(v) => setConsultancyForm({ ...consultancyForm, serviceTitle: v })} placeholder="e.g. Pharma Market Entry — UK" />
                      </div>
                      <InputHelper icon={Briefcase} label="Domain / Industry *" value={consultancyForm.domain} onChange={(v) => setConsultancyForm({ ...consultancyForm, domain: v })} placeholder="e.g. Pharmaceuticals, FMCG, Tech..." />
                      <InputHelper icon={Languages} label="Languages" value={consultancyForm.languages} onChange={(v) => setConsultancyForm({ ...consultancyForm, languages: v })} placeholder="e.g. English, Hindi, French" />
                    </div>

                    {/* Specialisation — full width */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider font-headline">
                        Specialisation Statement *
                      </label>
                      <textarea
                        value={consultancyForm.specialisation}
                        onChange={(e) => setConsultancyForm({ ...consultancyForm, specialisation: e.target.value })}
                        placeholder="Describe your expertise — e.g. '12 years introducing pharmaceutical brands into UK & EU regulatory pathways, including MHRA submissions...'"
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg p-2 bg-white/50 focus:bg-white text-xs text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Markets & Engagement */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-teal-900 border-b border-teal-100 pb-1.5 flex items-center gap-2">
                      <Target className="w-4 h-4" /> Markets & Engagement
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-3">
                        <InputHelper icon={MapPin} label="Target Markets *" value={consultancyForm.targetMarkets} onChange={(v) => setConsultancyForm({ ...consultancyForm, targetMarkets: v })} placeholder="e.g. UK, EU, Canada, Middle East..." />
                      </div>
                      <SelectHelper icon={Zap} label="Engagement Mode" value={consultancyForm.engagementMode} onChange={(v) => setConsultancyForm({ ...consultancyForm, engagementMode: v })}>
                        <option value="">Select Mode</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid (Remote + On-site)</option>
                      </SelectHelper>
                      <SelectHelper icon={Timer} label="Typical Duration" value={consultancyForm.engagementDuration} onChange={(v) => setConsultancyForm({ ...consultancyForm, engagementDuration: v })}>
                        <option value="">Select Duration</option>
                        <option value="Discovery Call">Discovery Call (30–60 min)</option>
                        <option value="Project-based">Project-based</option>
                        <option value="1–3 months">1–3 months</option>
                        <option value="3–6 months">3–6 months</option>
                        <option value="6–12 months">6–12 months</option>
                        <option value="12+ months">12+ months / Ongoing</option>
                      </SelectHelper>
                      <InputHelper icon={Video} label="Intro Video URL" value={consultancyForm.videoUrl} onChange={(v) => setConsultancyForm({ ...consultancyForm, videoUrl: v })} placeholder="https://..." />
                    </div>
                  </div>

                  {/* Cover Image + Description */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-teal-900 border-b border-teal-100 pb-1.5 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Pitch & Visuals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider font-headline">Cover Image</label>
                        <label className="flex flex-col items-center justify-center w-full h-[76px] rounded-lg border-2 border-dashed border-teal-200 cursor-pointer hover:bg-teal-50/50 bg-white/30 overflow-hidden relative transition-colors group">
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                          {imagePreview ? (
                            <>
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-black/60 text-white text-[9px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">Change</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-teal-400 flex flex-col items-center">
                              <ImageIcon className="w-4 h-4 mb-1 opacity-60 group-hover:text-teal-600 group-hover:opacity-100 transition-colors" />
                              <span className="text-[9px] font-bold uppercase tracking-wider">Upload Cover</span>
                            </div>
                          )}
                        </label>
                      </div>
                      <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider font-headline">Full Description / What I Can Do For You</label>
                        <textarea
                          value={consultancyForm.description}
                          onChange={(e) => setConsultancyForm({ ...consultancyForm, description: e.target.value })}
                          placeholder="Additional details about your consultancy offering, past successes, network, etc."
                          rows={3}
                          className="w-full h-full border border-gray-200 rounded-lg p-2 bg-white/50 focus:bg-white text-xs text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Sales Partner Agreement */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-500 select-none">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-3.5 h-3.5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer shrink-0"
                  />
                  <span>
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setShowAgreementModal(true)}
                      className="text-indigo-600 font-medium underline hover:text-indigo-800 inline"
                    >
                      Sales Partner Representation &amp; Listing Service Agreement
                    </button>
                    .
                  </span>
                </label>
              </div>
              <div className="h-2" />
            </div>
          )}

          {/* ── STEP 2: Packages ──────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                  <PackageIcon className="w-4 h-4" />
                  {spPostSubType === "consultancy" ? "Consultancy Packages & Pricing" : "Offer Packages"}
                </h3>
                {packages.length < 3 && (
                  <button
                    onClick={addPackage}
                    className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Package
                  </button>
                )}
              </div>

              {packages.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                  <PackageIcon className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-500 mb-1">No packages added yet</p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
                    {spPostSubType === "consultancy"
                      ? "Define your consultancy tiers — e.g. Discovery, Advisory, Full Engagement."
                      : "Create customized packages with line items and costs to offer to brands."}
                  </p>
                  <button
                    onClick={addPackage}
                    className="text-[10px] font-bold tracking-wider uppercase text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Create First Package
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {packages.map((pkg, index) => (
                    <div key={pkg.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black shrink-0">
                            {index + 1}
                          </span>
                          <input
                            value={pkg.name}
                            onChange={(e) => updatePackageName(pkg.id, e.target.value)}
                            className="bg-transparent border-none font-bold text-gray-900 focus:ring-0 p-0 text-sm focus:outline-none min-w-0 truncate"
                            placeholder="Package Name"
                          />
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Your Currency</span>
                            <span className="text-[10px] font-bold text-gray-500 bg-white border border-gray-200 rounded-full px-2.5 py-0.5">
                              {getCurrencySymbol(preferredCurrency)} {preferredCurrency}
                            </span>
                          </div>
                          <div className="w-px h-6 bg-gray-200" />
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">Charged in</span>
                            <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5">
                              {calculateTotalCost(pkg.items)}
                            </span>
                          </div>
                          <button
                            onClick={() => removePackage(pkg.id)}
                            className="text-gray-300 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-white space-y-3">
                        <div className="grid grid-cols-12 gap-3 pb-2 border-b border-gray-100">
                          <div className="col-span-8 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Line Item Description</div>
                          <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Amount (₹ INR)</div>
                          <div className="col-span-1" />
                        </div>
                        {pkg.items.map((item) => (
                          <div key={item.id} className="grid grid-cols-12 gap-3 items-center group">
                            <div className="col-span-8">
                              <input
                                value={item.description}
                                onChange={(e) => updateLineItem(pkg.id, item.id, "description", e.target.value)}
                                placeholder={spPostSubType === "consultancy" ? "e.g. Market Entry Strategy & Advisory..." : "e.g. Dedicated stall space, Marketing collateral..."}
                                className="w-full border border-transparent hover:border-gray-200 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all bg-transparent focus:bg-white"
                              />
                            </div>
                            <div className="col-span-3">
                              <input
                                type="number"
                                value={item.cost}
                                onChange={(e) => updateLineItem(pkg.id, item.id, "cost", e.target.value)}
                                placeholder="0.00"
                                className="w-full border border-transparent hover:border-gray-200 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-right focus:ring-1 focus:ring-indigo-500 outline-none transition-all bg-transparent focus:bg-white"
                              />
                            </div>
                            <div className="col-span-1 flex justify-end">
                              <button
                                onClick={() => removeLineItem(pkg.id, item.id)}
                                disabled={pkg.items.length === 1}
                                className="text-gray-300 hover:text-red-500 disabled:opacity-30 disabled:hover:text-gray-300 p-1 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="pt-2">
                          <button
                            onClick={() => addLineItem(pkg.id)}
                            className="text-[10px] font-bold tracking-wider uppercase text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                          >
                            <Plus className="w-3 h-3" /> Add Item
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100/50 bg-white/50 flex justify-between gap-3">
          {/* Left button */}
          {step === 0 && (
            <button
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-headline uppercase tracking-wider disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          {step === 1 && (
            <button
              onClick={() => { setStep(0); setError(""); }}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-headline uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          {step === 2 && (
            <button
              onClick={() => { setStep(1); setError(""); }}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-headline uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}

          {/* Right button */}
          {step === 1 && (
            <button
              onClick={handleNext}
              disabled={saving}
              className={`px-6 py-2.5 text-sm font-bold text-white rounded-lg transition-colors shadow-sm font-headline uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 ${
                spPostSubType === "consultancy"
                  ? "bg-teal-700 hover:bg-teal-800"
                  : "bg-[#701010] hover:bg-[#5a0c0c]"
              }`}
            >
              Next: Packages <ChevronRight className="w-4 h-4" />
            </button>
          )}
          {step === 2 && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-2.5 text-sm font-bold text-white rounded-lg transition-colors shadow-sm font-headline uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 ${
                spPostSubType === "consultancy"
                  ? "bg-teal-700 hover:bg-teal-800"
                  : "bg-[#701010] hover:bg-[#5a0c0c]"
              }`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...
                </span>
              ) : (
                <span>{editPostData ? "Save Changes" : "Publish Post"}</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Sales Partner Service Agreement Modal */}
      <SPServiceAgreementModal
        isOpen={showAgreementModal}
        onClose={() => setShowAgreementModal(false)}
        onAccept={() => setAgreedToTerms(true)}
        isSaving={saving}
        agreementData={{
          spName: authorName || "Sales Partner",
          eventName: spPostSubType === "event" ? eventForm.eventName : consultancyForm.serviceTitle,
          venue: spPostSubType === "event" ? eventForm.venue : undefined,
          city: spPostSubType === "event" ? eventForm.city : undefined,
          country: spPostSubType === "event" ? eventForm.country : undefined,
          date: spPostSubType === "event" ? eventForm.date : undefined,
          currency: preferredCurrency,
        }}
      />
    </div>
  );
}
