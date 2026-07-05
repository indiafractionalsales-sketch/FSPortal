"use client";

import { useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { MapPin, ImageIcon, X, Send, Calendar, Clock, Users, Globe, ExternalLink, ThumbsUp, MessageCircle, Video, Star, Pencil, Tag, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
// @ts-ignore
import { load } from '@cashfreepayments/cashfree-js';


interface CommentData {
  id: string;
  postId: string;
  text: string;
  authorUid: string;
  authorName: string;
  authorAvatar: string;
  imageUrl: string | null;
  createdAt: any;
}

interface SPPost {
  __id?: string;
  // SP specific
  eventName?: string;
  eventUrl?: string;
  date?: string;
  time?: string;
  country?: string;
  city?: string;
  venue?: string;
  googleMapLink?: string;
  expectedFootfall?: string;
  description?: string;
  packages?: any[];
  preferredCurrency?: string;

  // OBO specific
  targetCountry?: string;
  targetIndustry?: string;
  targetCustomerType?: string;
  b2bChannels?: string;
  b2cChannels?: string;
  engagementType?: string;
  commissionRate?: string;
  currency?: string;
  minExperience?: string;
  repLocation?: string;
  expectedOutcomes?: string;

  // Shared
  mediaUrl?: string;
  videoUrl?: string;
  ownerUid?: string;
  createdAt?: string;
  postType?: string;
  paymentStatus?: string;
}

interface SPPostCardProps {
  post: SPPost;
  authorName?: string;
  authorAvatar?: string;
  currentUserCurrency?: string;
  onEdit?: () => void;
  onViewDetails?: () => void;
}

export default function SPPostCard({ post, authorName, authorAvatar, currentUserCurrency, onEdit, onViewDetails }: SPPostCardProps) {

  const [viewingPackage, setViewingPackage] = useState<any | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const isOwner = auth.currentUser?.uid === post.ownerUid;

  const initials = authorName
    ? authorName.charAt(0).toUpperCase()
    : "S";

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

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

  const calculateTotalCost = (items: any[]) => {
    return items.reduce((total, item) => {
      const cost = parseFloat(item.cost) || 0;
      return total + cost;
    }, 0);
  };

  const currencyStr = post.preferredCurrency || "USD";


  const fetchComments = async () => {
    if (!post.__id) return;
    setIsLoadingComments(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;
      
      const res = await fetch(`/api/comments?postId=${post.__id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      console.log('fetchComments Response:', res.status, data);
      
      if (data.comments) {
        setComments(data.comments);
      } else {
        console.log('No documents found in response.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleOpenComments = () => {
    setIsCommentsOpen(true);
    if (comments.length === 0) {
      fetchComments();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image exceeds 5MB limit. Please choose a smaller file.");
      return;
    }
    
    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setSelectedImage(dataUrl);
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitComment = async () => {
    if (!newCommentText.trim() && !selectedImage) return;
    setIsSubmittingComment(true);
    
    try {
      let finalImageUrl = null;
      if (selectedImage) {
        const imageRef = ref(storage, `comments/${post.__id}/${Date.now()}_img.jpg`);
        await uploadString(imageRef, selectedImage, 'data_url');
        finalImageUrl = await getDownloadURL(imageRef);
      }

      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId: post.__id,
          text: newCommentText,
          authorName: auth.currentUser?.displayName || authorName,
          authorAvatar: auth.currentUser?.photoURL || authorAvatar,
          imageUrl: finalImageUrl
        })
      });

      if (!res.ok) throw new Error("Failed to post comment");
      
      const { data } = await res.json();
      setComments([...comments, data]);
      setNewCommentText("");
      setSelectedImage(null);

    } catch (e) {
      console.error(e);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCheckout = async (packageId: string) => {
    try {
      setIsCheckingOut(true);
      const isProd = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === 'PRODUCTION';
      const cashfree = await load({ mode: isProd ? "production" : "sandbox" });
      const token = await auth.currentUser?.getIdToken();
      
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.__id,
          packageId: packageId,
          idToken: token
        })
      });

      const data = await res.json();
      
      if (data.error) {
        alert(data.error);
        setIsCheckingOut(false);
        return;
      }

      if (data.payment_session_id) {
        cashfree.checkout({
          paymentSessionId: data.payment_session_id
        });
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
    <div className="relative bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">

      {/* Post Author */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-start gap-3">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm mt-0.5" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#701010] flex items-center justify-center text-white font-serif font-bold text-lg mt-0.5">{initials}</div>
          )}
          <div>
            <h3 className="font-serif font-bold text-sm text-gray-900 leading-snug flex items-center flex-wrap gap-2">
              {authorName || "User"}
              {post.paymentStatus === 'sold' && (
                <span className="bg-red-50 border border-red-100 text-red-600 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-[0_1px_2px_rgba(239,68,68,0.1)] flex items-center gap-1.5 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]" />
                  CLOSED
                </span>
              )}
              {post.postType === "obo" && (
                <span
                  className="font-sans font-normal text-xs text-gray-600 ml-1.5 cursor-pointer hover:underline"
                  onClick={onViewDetails}
                >
                  is looking for Sales Partners in <span className="font-bold text-[#701010]">{post.targetCountry || "Global"}</span>
                </span>
              )}
            </h3>
            <p className="text-[9px] font-headline text-gray-500 mt-1 uppercase tracking-wider">
              {post.postType === "obo" ? "Business Owner" : "Sales Partner"} · {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Package Capsules */}
          {post.packages && post.packages.length > 0 && (
            <div className="flex items-center gap-1.5 mr-2">
              {post.packages.map((pkg, idx) => (
                <button
                  key={pkg.id || idx}
                  onClick={() => setViewingPackage(pkg)}
                  className="px-2 py-1 bg-[#701010]/5 hover:bg-[#701010]/10 border border-[#701010]/20 rounded-md text-[#701010] text-[9px] font-headline font-bold uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Tag className="w-3 h-3 text-[#701010] fill-[#701010] mr-0.5" />
                  {calculateTotalCost(pkg.items || []).toLocaleString(currencyStr === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency: currencyStr })}
                </button>
              ))}
            </div>
          )}

          {isOwner && onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              title="Edit Post"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {post.postType === "obo" ? (
        <>
          {/* Info above image */}
          <div className="px-4 pb-3">
            {post.expectedOutcomes && (
              <div>
                <p className="text-sm text-gray-800 leading-relaxed font-sans line-clamp-4">{post.expectedOutcomes}</p>
              </div>
            )}
          </div>

          {post.mediaUrl ? (
            <div className="flex w-full h-44 border-t border-b border-gray-100 bg-gray-50/30">
              {/* Media thumbnail */}
              <div className="w-2/5 h-full overflow-hidden flex-shrink-0 border-r border-gray-100 bg-black">
                <img src={post.mediaUrl} alt="Product/Brand" className="w-full h-full object-cover opacity-90" />
              </div>
              {/* Info beside image (Grid Table) */}
              <div className="flex-1 p-3 grid grid-cols-2 gap-x-2 gap-y-3 content-center">
                <div className="flex flex-col">
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 leading-none flex items-center gap-1">
                    <span className="text-[11px] leading-none -mt-0.5">🎯</span> Targeting
                  </p>
                  <p className="text-[11px] font-bold text-[#701010] font-sans line-clamp-1 mt-1" title={post.targetIndustry}>{post.targetIndustry}</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 leading-none flex items-center gap-1">
                    <span className="text-[11px] leading-none -mt-0.5">🌐</span> Channels
                  </p>
                  <p className="text-[11px] text-gray-800 font-sans line-clamp-1 mt-1" title={post.b2bChannels || post.b2cChannels}>{post.b2bChannels || post.b2cChannels}</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 leading-none flex items-center gap-1">
                    <span className="text-[11px] leading-none -mt-0.5">📍</span> Location
                  </p>
                  <p className="text-[11px] text-gray-800 font-sans line-clamp-1 mt-1" title={post.repLocation}>{post.repLocation}</p>
                </div>

                {post.commissionRate && (
                  <div className="flex flex-col">
                    <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 leading-none flex items-center gap-1">
                      <span className="text-[11px] leading-none -mt-0.5">💰</span> Commission
                    </p>
                    <p className="text-[11px] font-bold text-[#701010] font-sans line-clamp-1 mt-1" title={post.commissionRate}>{post.commissionRate}</p>
                  </div>
                )}

                {post.currency && (
                  <div className="flex flex-col">
                    <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 leading-none flex items-center gap-1">
                      <span className="text-[11px] leading-none -mt-0.5">💵</span> Currency
                    </p>
                    <p className="text-[11px] text-gray-800 font-sans line-clamp-1 mt-1" title={post.currency}>{post.currency}</p>
                  </div>
                )}

                {post.engagementType && (
                  <div className="flex flex-col">
                    <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 leading-none flex items-center gap-1">
                      <span className="text-[11px] leading-none -mt-0.5">🤝</span> Engagement
                    </p>
                    <p className="text-[11px] text-gray-800 font-sans line-clamp-1 mt-1" title={post.engagementType}>{post.engagementType}</p>
                  </div>
                )}

                {post.minExperience && (
                  <div className="flex flex-col">
                    <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 leading-none flex items-center gap-1">
                      <span className="text-[11px] leading-none -mt-0.5">💼</span> Experience
                    </p>
                    <p className="text-[11px] text-gray-800 font-sans line-clamp-1 mt-1" title={post.minExperience}>{post.minExperience}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="px-4 pb-3 border-t border-gray-50 pt-4 grid grid-cols-2 gap-x-4 gap-y-4">
              <div className="flex items-start gap-2.5">
                <span className="text-[14px] leading-none flex-shrink-0 mt-0.5">🎯</span>
                <div>
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 leading-none">Targeting</p>
                  <p className="text-xs font-bold text-[#701010] font-sans line-clamp-1 mt-1">{post.targetIndustry}</p>
                  <p className="text-[10px] text-gray-600 font-sans line-clamp-1 mt-0.5">{post.targetCustomerType}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-[#701010] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 leading-none">Channels</p>
                  <p className="text-xs text-gray-800 font-sans line-clamp-1 mt-1">{post.b2bChannels || post.b2cChannels}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#701010] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 leading-none">Location</p>
                  <p className="text-xs text-gray-800 font-sans line-clamp-1 mt-1">{post.repLocation}</p>
                </div>
              </div>
              {post.commissionRate && (
                <div className="flex items-start gap-2.5">
                  <span className="text-[15px] leading-none flex-shrink-0 mt-0.5">💰</span>
                  <div>
                    <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 leading-none">Commission</p>
                    <p className="text-sm font-bold text-[#701010] font-sans mt-1">{post.commissionRate}</p>
                  </div>
                </div>
              )}
              {post.currency && (
                <div className="flex items-start gap-2.5">
                  <span className="text-[15px] leading-none flex-shrink-0 mt-0.5">💵</span>
                  <div>
                    <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 leading-none">Currency</p>
                    <p className="text-sm font-bold text-gray-800 font-sans mt-1">{post.currency}</p>
                  </div>
                </div>
              )}
              {post.engagementType && (
                <div className="flex items-start gap-2.5">
                  <span className="text-[15px] leading-none flex-shrink-0 mt-0.5">🤝</span>
                  <div>
                    <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 leading-none">Engagement</p>
                    <p className="text-sm text-gray-800 font-sans mt-1">{post.engagementType}</p>
                  </div>
                </div>
              )}
              {post.minExperience && (
                <div className="flex items-start gap-2.5">
                  <span className="text-[15px] leading-none flex-shrink-0 mt-0.5">💼</span>
                  <div>
                    <p className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-500 leading-none">Experience</p>
                    <p className="text-sm text-gray-800 font-sans mt-1">{post.minExperience}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Description — shown prominently above media */}
          {post.description && (
            <div className="px-4 pb-3">
              <p className="text-xs text-gray-700 leading-relaxed font-sans line-clamp-3">{post.description}</p>
            </div>
          )}

          {/* Event Details Area */}
          {post.mediaUrl ? (
            <div className="flex w-full h-36 border-t border-b border-gray-100 bg-gray-50/30">
              {/* Media thumbnail */}
              <div className="w-1/3 h-full overflow-hidden flex-shrink-0">
                <img src={post.mediaUrl} alt="Event" className="w-full h-full object-cover" />
              </div>
              {/* Details */}
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <h4
                    className="font-serif font-bold text-sm text-gray-900 leading-snug line-clamp-2 cursor-pointer hover:text-[#701010] hover:underline transition-colors"
                    onClick={onViewDetails}
                  >
                    {post.eventName}
                  </h4>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
                    {formattedDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#701010] flex-shrink-0" />
                        <span className="text-[10px] text-gray-700 font-sans truncate">{formattedDate}</span>
                      </div>
                    )}
                    {post.time && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#701010] flex-shrink-0" />
                        <span className="text-[10px] text-gray-700 font-sans truncate">{post.time}</span>
                      </div>
                    )}
                    {/* Location col1, Event capsule col2 — same grid row */}
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#701010] flex-shrink-0" />
                      <span className="text-[10px] text-gray-700 font-sans truncate">
                        {[post.venue, post.city, post.country].filter(Boolean).join(", ")}
                        {post.googleMapLink && (
                          <a href={post.googleMapLink} target="_blank" rel="noopener noreferrer" className="ml-1 text-[#701010] font-bold hover:underline">(Map)</a>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {post.eventUrl ? (
                        <a href={post.eventUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[8px] font-headline font-bold uppercase tracking-widest text-[#701010] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full hover:bg-red-100 transition-colors">
                          Event ↗
                        </a>
                      ) : (
                        <span className="inline-flex text-[8px] font-headline font-bold uppercase tracking-widest text-[#701010] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                          Event
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  {post.expectedFootfall ? (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[9px] font-headline font-bold uppercase tracking-wider text-gray-600">
                        Expected: <span className="text-[#701010]">{post.expectedFootfall}</span>
                      </span>
                    </div>
                  ) : <div />}
                </div>
              </div>
            </div>
          ) : (
            /* No media: text-only card */
            <div className="px-4 pb-3 border-t border-gray-50 pt-3">
              <h4
                className="font-serif font-bold text-base text-gray-900 leading-snug cursor-pointer hover:text-[#701010] hover:underline transition-colors"
                onClick={onViewDetails}
              >
                {post.eventName}
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2.5">
                {formattedDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#701010] flex-shrink-0" />
                    <span className="text-[10px] text-gray-700 font-sans">{formattedDate}</span>
                  </div>
                )}
                {post.time && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#701010] flex-shrink-0" />
                    <span className="text-[10px] text-gray-700 font-sans">{post.time}</span>
                  </div>
                )}
                {/* Location col1, Event capsule col2 — same grid row */}
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#701010] flex-shrink-0" />
                  <span className="text-[10px] text-gray-700 font-sans truncate">
                    {[post.venue, post.city, post.country].filter(Boolean).join(", ")}
                  </span>
                </div>
                <div className="flex items-center">
                  {post.eventUrl ? (
                    <a href={post.eventUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[8px] font-headline font-bold uppercase tracking-widest text-[#701010] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full hover:bg-red-100 transition-colors">
                      Event ↗
                    </a>
                  ) : (
                    <span className="inline-flex text-[8px] font-headline font-bold uppercase tracking-widest text-[#701010] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                      Event
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}



      {/* Video link */}
      {post.videoUrl && (
        <div className="px-4 pb-3 flex items-center gap-4">
          <a href={post.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[9px] font-headline font-bold uppercase tracking-widest text-[#701010] hover:underline">
            <Video className="w-3 h-3" /> Watch Video
          </a>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center border-t border-gray-100 mx-4 gap-2 py-1">

        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-700 font-headline font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:text-[#701010] transition-all rounded-lg">
          <ThumbsUp className="w-3.5 h-3.5" /> Like
        </button>
        <button onClick={handleOpenComments} className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-700 font-headline font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:text-[#701010] transition-all rounded-lg">
          <MessageCircle className="w-3.5 h-3.5" /> Comment
        </button>
      </div>
    </div>

    {/* Package Viewing Drawer (Bottom/Right aligned based on screen) */}
    {viewingPackage && (
      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={() => setViewingPackage(null)}
        />
        {/* Drawer */}
        <div className="relative w-full max-w-md bg-gray-50 h-full shadow-2xl flex flex-col animate-slide-in-right">
          <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 shadow-sm">
            <div>
              <h2 className="font-serif font-bold text-lg text-gray-900">{viewingPackage.name || "Package Details"}</h2>
              <p className="text-[10px] font-headline text-gray-500 uppercase tracking-wider mt-0.5 font-bold">
                Total: {calculateTotalCost(viewingPackage.items || []).toLocaleString(currencyStr === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency: currencyStr })}
              </p>
            </div>
            <button 
              onClick={() => setViewingPackage(null)}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Pencil className="w-4 h-4 hidden" /> {/* Just to keep the icon hidden to use X but we'll use a generic X instead */}
              <span className="text-xl leading-none">&times;</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
              <div className="grid grid-cols-12 gap-3 pb-3 border-b border-gray-100">
                <div className="col-span-8 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Line Item</div>
                <div className="col-span-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Cost ({getCurrencySymbol(currencyStr)})</div>
              </div>
              
              <div className="divide-y divide-gray-50">
                {(viewingPackage.items || []).map((item: any, i: number) => (
                  <div key={item.id || i} className="grid grid-cols-12 gap-3 py-3 items-center">
                    <div className="col-span-8 text-sm text-gray-700">{item.description || "—"}</div>
                    <div className="col-span-4 text-sm font-semibold text-gray-900 text-right">
                      {parseFloat(item.cost || 0).toLocaleString(currencyStr === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency: currencyStr })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setViewingPackage(null)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm"
              >
                Close
              </button>
              {!isOwner && post.paymentStatus !== 'sold' && (
                <button
                  onClick={() => handleCheckout(viewingPackage.id)}
                  disabled={isCheckingOut}
                  className="px-6 py-2 bg-[#701010] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#5a0c0c] transition-colors shadow-sm flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {isCheckingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    "Pay to Confirm"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Comments Drawer */}
    {isCommentsOpen && (
      <div className="fixed inset-0 z-[100] flex justify-end">
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={() => setIsCommentsOpen(false)}
        />
        <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-serif font-bold text-lg text-gray-900">Comments</h2>
            <button 
              onClick={() => setIsCommentsOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
            {isLoadingComments ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#701010]" /></div>
            ) : comments.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">No comments yet. Be the first to start the conversation!</div>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    {c.authorAvatar ? (
                      <img src={c.authorAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs">
                        {c.authorName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                        <p className="font-bold text-xs text-gray-900">{c.authorName}</p>
                        <p className="text-sm text-gray-700 mt-0.5">{c.text}</p>
                        {c.imageUrl && (
                          <img src={c.imageUrl} alt="attached" className="mt-2 rounded-lg max-h-48 object-cover" />
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 ml-2">
                        {new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 flex flex-col gap-2">
            {selectedImage && (
              <div className="relative self-start mb-2">
                <img src={selectedImage} alt="preview" className="h-20 rounded-lg border border-gray-200 object-cover" />
                <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <label className="p-2 text-gray-400 hover:text-[#701010] hover:bg-gray-100 rounded-full cursor-pointer transition-colors relative">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} disabled={isSubmittingComment || isCompressing} />
                {isCompressing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
              </label>
              <input 
                type="text" 
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a comment..." 
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-[#701010] outline-none"
                onKeyDown={(e) => { if(e.key === 'Enter') handleSubmitComment(); }}
                disabled={isSubmittingComment}
              />
              <button 
                onClick={handleSubmitComment}
                disabled={isSubmittingComment || (!newCommentText.trim() && !selectedImage)}
                className="p-2 text-white bg-[#701010] hover:bg-[#5a0c0c] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
