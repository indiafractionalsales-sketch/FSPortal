"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, MapPin, Calendar, Clock, Globe, Video, Users, Check } from "lucide-react";
import { auth } from "@/lib/firebase";
import { saveDocument } from "@/lib/firestore-rest";
import { uploadImage } from "@/lib/storage-rest";

interface SPCreatePostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPostData?: Record<string, any> | null;
}

const InputHelper = ({ icon: Icon, label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-headline">{label}</label>
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

export default function SPCreatePostDrawer({ isOpen, onClose, onSuccess, editPostData }: SPCreatePostDrawerProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    description: "", // "What I can do for you?"
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    } else if (isOpen) {
      // Reset when opening in create mode
      setFormData({
        eventName: "", eventUrl: "", date: "", time: "", country: "", city: "", 
        pincode: "", venue: "", googleMapLink: "", expectedFootfall: "", videoUrl: "", description: ""
      });
      setImageFile(null);
      setImagePreview(null);
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

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to post.");
      return;
    }

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

    setSaving(true);
    setError("");

    try {
      const idToken = await user.getIdToken();
      let uploadedImageUrl = "";
      
      // Upload image if provided and it's a new file (data url)
      if (imagePreview && imagePreview.startsWith("data:")) {
        const timestamp = Date.now();
        uploadedImageUrl = await uploadImage(imagePreview, `sp_posts/${user.uid}_${timestamp}.jpg`, idToken);
      } else if (imagePreview) {
        // Keep existing URL if we didn't change the image
        uploadedImageUrl = imagePreview;
      }

      // Prepare payload
      const postPayload = {
        ...formData,
        postType: "sp",
        ownerUid: user.uid,
        authorName: user.displayName || user.email || "User",
        authorAvatar: user.photoURL || "",
        mediaUrl: uploadedImageUrl,
        createdAt: editPostData?.createdAt || new Date().toISOString(),
      };

      const postId = editPostData?.__id || `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await saveDocument("Posts", postId, postPayload as any, idToken);

      // Reset and close
      setFormData({
        eventName: "", eventUrl: "", date: "", time: "", country: "", city: "", 
        pincode: "", venue: "", googleMapLink: "", expectedFootfall: "", videoUrl: "", description: ""
      });
      setImageFile(null);
      setImagePreview(null);
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
            <p className="text-xs text-gray-500 font-headline uppercase tracking-wider mt-0.5">Share with Sales Partners</p>
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
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
              <X className="w-4 h-4" /> {error}
            </div>
          )}

          {/* Section: Event Basics */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-indigo-900 border-b border-indigo-100 pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Event Basics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputHelper label="Event Name *" value={formData.eventName} onChange={(v: string) => setFormData({...formData, eventName: v})} placeholder="e.g. Annual Tech Summit" />
              <InputHelper icon={Globe} label="Event URL" value={formData.eventUrl} onChange={(v: string) => setFormData({...formData, eventUrl: v})} placeholder="https://..." />
              <InputHelper type="date" label="Date *" value={formData.date} onChange={(v: string) => setFormData({...formData, date: v})} />
              <InputHelper type="time" icon={Clock} label="Time" value={formData.time} onChange={(v: string) => setFormData({...formData, time: v})} />
              
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-headline">Expected Footfall</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select 
                    value={formData.expectedFootfall} 
                    onChange={(e) => setFormData({...formData, expectedFootfall: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all appearance-none"
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
          </div>

          {/* Section: Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-indigo-900 border-b border-indigo-100 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputHelper label="Venue *" value={formData.venue} onChange={(v: string) => setFormData({...formData, venue: v})} placeholder="Grand Hyatt" />
              <InputHelper label="City *" value={formData.city} onChange={(v: string) => setFormData({...formData, city: v})} placeholder="New York" />
              <InputHelper label="Country *" value={formData.country} onChange={(v: string) => setFormData({...formData, country: v})} placeholder="USA" />
              <InputHelper label="Pincode / ZIP *" value={formData.pincode} onChange={(v: string) => setFormData({...formData, pincode: v})} placeholder="10001" />
            </div>
            <InputHelper icon={MapPin} label="Google Map Link *" value={formData.googleMapLink} onChange={(v: string) => setFormData({...formData, googleMapLink: v})} placeholder="https://maps.google.com/..." />
          </div>

          {/* Section: Pitch & Media */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-indigo-900 border-b border-indigo-100 pb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Your Pitch & Media
            </h3>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-headline">What I can do for you? *</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe what you are offering to brands at this event..."
                rows={4}
                className="w-full border border-gray-200 rounded-lg p-3 bg-white/50 focus:bg-white text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
              />
            </div>

            <InputHelper icon={Video} label="Reference Video URL" value={formData.videoUrl} onChange={(v: string) => setFormData({...formData, videoUrl: v})} placeholder="https://youtube.com/..." />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-headline">Cover Image *</label>
              <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50/50 bg-white/30 overflow-hidden relative transition-colors group">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <ImageIcon className="w-6 h-6 mb-2 opacity-60 group-hover:text-indigo-500 group-hover:opacity-100 transition-colors" />
                    <span className="text-xs font-bold uppercase tracking-wider">Click to upload</span>
                  </div>
                )}
              </label>
            </div>
          </div>
          
          <div className="h-4" /> {/* Bottom padding */}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100/50 bg-white/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-headline uppercase tracking-wider disabled:opacity-50"
          >
            Cancel
          </button>
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
        </div>

      </div>
    </div>
  );
}
