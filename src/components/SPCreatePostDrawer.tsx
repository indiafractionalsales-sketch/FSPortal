"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, MapPin, Calendar, Clock, Globe, Video, Users, Check, Plus, Trash2, ChevronRight, ChevronLeft, Package as PackageIcon } from "lucide-react";
import { auth } from "@/lib/firebase";
import { saveDocument } from "@/lib/firestore-rest";
import { uploadImage } from "@/lib/storage-rest";

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
}

const InputHelper = ({ icon: Icon, label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider font-headline">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />}
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder} 
        className={`w-full border border-gray-200 rounded-lg py-1.5 bg-white/50 focus:bg-white text-xs text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all ${Icon ? 'pl-8 pr-2' : 'px-2'}`}
      />
    </div>
  </div>
);

const getCurrencySymbol = (currency: string) => {
  switch(currency) {
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'INR': return '₹';
    case 'AUD': return 'A$';
    case 'CAD': return 'C$';
    case 'USD': default: return '$';
  }
};

export default function SPCreatePostDrawer({ isOpen, onClose, onSuccess, editPostData, authorName, authorAvatar, preferredCurrency = "USD" }: SPCreatePostDrawerProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
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
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    if (editPostData && isOpen) {
      setFormData({
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
      setImagePreview(editPostData.mediaUrl || null);
      setPackages(editPostData.packages || []);
      setStep(1);
    } else if (isOpen) {
      setFormData({
        eventName: "", eventUrl: "", date: "", time: "", country: "", city: "", 
        pincode: "", venue: "", googleMapLink: "", expectedFootfall: "", videoUrl: "", description: ""
      });
      setImageFile(null);
      setImagePreview(null);
      setPackages([]);
      setStep(1);
    }
  }, [editPostData, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addPackage = () => {
    if (packages.length >= 3) return;
    setPackages([...packages, { 
      id: Date.now().toString(), 
      name: `Package ${packages.length + 1}`, 
      items: [{ id: Date.now().toString() + "_1", description: "", cost: "" }] 
    }]);
  };

  const removePackage = (pkgId: string) => {
    setPackages(packages.filter(p => p.id !== pkgId));
  };

  const addLineItem = (pkgId: string) => {
    setPackages(packages.map(p => {
      if (p.id === pkgId) {
        return { ...p, items: [...p.items, { id: Date.now().toString(), description: "", cost: "" }] };
      }
      return p;
    }));
  };

  const removeLineItem = (pkgId: string, itemId: string) => {
    setPackages(packages.map(p => {
      if (p.id === pkgId) {
        return { ...p, items: p.items.filter(i => i.id !== itemId) };
      }
      return p;
    }));
  };

  const updateLineItem = (pkgId: string, itemId: string, field: "description" | "cost", value: string) => {
    setPackages(packages.map(p => {
      if (p.id === pkgId) {
        return {
          ...p,
          items: p.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
        };
      }
      return p;
    }));
  };
  
  const updatePackageName = (pkgId: string, name: string) => {
    setPackages(packages.map(p => p.id === pkgId ? { ...p, name } : p));
  };

  const calculateTotalCost = (items: LineItem[]) => {
    return items.reduce((total, item) => {
      const cost = parseFloat(item.cost) || 0;
      return total + cost;
    }, 0).toLocaleString(preferredCurrency === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency: preferredCurrency });
  };

  const handleNext = () => {
    const missingFields: string[] = [];
    if (!formData.eventName) missingFields.push("Event Name");
    if (!formData.date) missingFields.push("Date");
    if (!formData.venue) missingFields.push("Venue");
    if (!formData.city) missingFields.push("City");
    if (!formData.country) missingFields.push("Country");
    if (!formData.pincode) missingFields.push("Pincode/ZIP");
    if (!formData.googleMapLink) missingFields.push("Google Map Link");
    if (!formData.description) missingFields.push("Description");
    if (!imagePreview) missingFields.push("Cover Image");

    if (missingFields.length > 0) {
      setError(`Please fill in all mandatory fields. Missing: ${missingFields.join(", ")}`);
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to post.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const idToken = await user.getIdToken();
      let uploadedImageUrl = "";
      
      if (imagePreview && imagePreview.startsWith("data:")) {
        const timestamp = Date.now();
        uploadedImageUrl = await uploadImage(imagePreview, `sp_posts/${user.uid}_${timestamp}.jpg`, idToken);
      } else if (imagePreview) {
        uploadedImageUrl = imagePreview;
      }

      const postPayload = {
        ...formData,
        packages,
        postType: "sp",
        ownerUid: user.uid,
        authorName: authorName || user.displayName || user.email || "User",
        authorAvatar: authorAvatar || user.photoURL || "",
        mediaUrl: uploadedImageUrl,
        createdAt: editPostData?.createdAt || new Date().toISOString(),
      };

      const postId = editPostData?.__id || `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await saveDocument("Posts", postId, postPayload as any, idToken);

      setFormData({
        eventName: "", eventUrl: "", date: "", time: "", country: "", city: "", 
        pincode: "", venue: "", googleMapLink: "", expectedFootfall: "", videoUrl: "", description: ""
      });
      setImageFile(null);
      setImagePreview(null);
      setPackages([]);
      setStep(1);
      setSaving(false);
      onSuccess();

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create post");
      setSaving(false);
    }
  };

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
            <h2 className="text-xl font-serif font-bold text-gray-900">{editPostData ? "Edit Post" : "Create Event Post"}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${step === 1 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>Step 1: Event Info</span>
              <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${step === 2 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>Step 2: Packages</span>
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
              <X className="w-4 h-4" /> {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-8">
              {/* Section: Event Basics & Pitch */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-indigo-900 border-b border-indigo-100 pb-1.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Event Basics & Pitch
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InputHelper label="Event Name *" value={formData.eventName} onChange={(v: string) => setFormData({...formData, eventName: v})} placeholder="e.g. Tech Summit" />
                  <InputHelper type="date" label="Date *" value={formData.date} onChange={(v: string) => setFormData({...formData, date: v})} />
                  <InputHelper type="time" icon={Clock} label="Time" value={formData.time} onChange={(v: string) => setFormData({...formData, time: v})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InputHelper icon={Globe} label="Event URL" value={formData.eventUrl} onChange={(v: string) => setFormData({...formData, eventUrl: v})} placeholder="https://..." />
                  <InputHelper icon={Video} label="Video URL" value={formData.videoUrl} onChange={(v: string) => setFormData({...formData, videoUrl: v})} placeholder="https://..." />
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider font-headline">Footfall</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <select 
                        value={formData.expectedFootfall} 
                        onChange={(e) => setFormData({...formData, expectedFootfall: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg pl-8 pr-2 py-1.5 bg-white/50 focus:bg-white text-xs text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all appearance-none"
                      >
                        <option value="">Select Range</option>
                        <option value="0-100">0 - 100</option>
                        <option value="100-500">100 - 500</option>
                        <option value="500-1000">500 - 1000</option>
                        <option value="1000-5000">1000 - 5000</option>
                        <option value="5000+">5000+</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider font-headline">Cover Image *</label>
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
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe your offering..."
                      rows={3}
                      className="w-full h-full border border-gray-200 rounded-lg p-2 bg-white/50 focus:bg-white text-xs text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Location */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-indigo-900 border-b border-indigo-100 pb-1.5 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InputHelper label="Venue *" value={formData.venue} onChange={(v: string) => setFormData({...formData, venue: v})} placeholder="Grand Hyatt" />
                  <InputHelper label="City *" value={formData.city} onChange={(v: string) => setFormData({...formData, city: v})} placeholder="New York" />
                  <InputHelper label="Country *" value={formData.country} onChange={(v: string) => setFormData({...formData, country: v})} placeholder="USA" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InputHelper label="Pincode / ZIP *" value={formData.pincode} onChange={(v: string) => setFormData({...formData, pincode: v})} placeholder="10001" />
                  <div className="md:col-span-2">
                    <InputHelper icon={MapPin} label="Google Map Link *" value={formData.googleMapLink} onChange={(v: string) => setFormData({...formData, googleMapLink: v})} placeholder="https://maps.google.com/..." />
                  </div>
                </div>
              </div>
              <div className="h-2" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                  <PackageIcon className="w-4 h-4" /> Offer Packages
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
                  <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">Create customized packages with line items and costs to offer to brands.</p>
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
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">{index + 1}</span>
                          <input 
                            value={pkg.name} 
                            onChange={(e) => updatePackageName(pkg.id, e.target.value)}
                            className="bg-transparent border-none font-bold text-gray-900 focus:ring-0 p-0 text-sm w-48 focus:outline-none" 
                            placeholder="Package Name" 
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Cost</span>
                            <span className="text-sm font-black text-indigo-700">{calculateTotalCost(pkg.items)}</span>
                          </div>
                          <button 
                            onClick={() => removePackage(pkg.id)}
                            className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-white space-y-3">
                        <div className="grid grid-cols-12 gap-3 pb-2 border-b border-gray-100">
                          <div className="col-span-8 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Line Item Description</div>
                          <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Cost ({getCurrencySymbol(preferredCurrency)})</div>
                          <div className="col-span-1"></div>
                        </div>
                        
                        {pkg.items.map(item => (
                          <div key={item.id} className="grid grid-cols-12 gap-3 items-center group">
                            <div className="col-span-8">
                              <input 
                                value={item.description}
                                onChange={(e) => updateLineItem(pkg.id, item.id, 'description', e.target.value)}
                                placeholder="e.g. Dedicated stall space, Marketing collateral..."
                                className="w-full border border-transparent hover:border-gray-200 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all bg-transparent focus:bg-white"
                              />
                            </div>
                            <div className="col-span-3">
                              <input 
                                type="number"
                                value={item.cost}
                                onChange={(e) => updateLineItem(pkg.id, item.id, 'cost', e.target.value)}
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
          {step === 2 ? (
            <button 
              onClick={() => setStep(1)}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-headline uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button 
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-headline uppercase tracking-wider disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          {step === 1 ? (
            <button 
              onClick={handleNext}
              disabled={saving}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#701010] hover:bg-[#5a0c0c] rounded-lg transition-colors shadow-sm font-headline uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
            >
              Next: Packages <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#701010] hover:bg-[#5a0c0c] rounded-lg transition-colors shadow-sm font-headline uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">{editPostData ? "Save Changes" : "Create Post"}</span>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
