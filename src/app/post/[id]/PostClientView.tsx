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
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { ServerPost } from "@/lib/server-posts";
import SPPostCard from "@/components/SPPostCard";
import PostDetailsDrawer from "@/components/PostDetailsDrawer";
import { ArrowLeft, Share2, Check, Sparkles } from "lucide-react";

interface PostClientViewProps {
  post: ServerPost;
  postId: string;
}

export default function PostClientView({ post, postId }: PostClientViewProps) {
  const [viewingPost, setViewingPost] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const formattedPost = {
    ...post,
    __id: post.id || postId,
  };

  const baseUrl = "https://fractionalsalespartner.com";
  const shareUrl = `${baseUrl}/post/${postId}`;
  const shareText = `Come & Meet our Fractional Sales Partner for more collaborations!\n\n${shareUrl}`;

  const handleShare = async () => {
    const shareData = {
      title: post.eventName || "Sales Opportunity | Fractional Sales Partner",
      text: shareText,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Guest Conversion CTA Banner (Hook 1: Opportunity Sharing Loop) */}
      {!user && (
        <div className="w-full bg-gradient-to-r from-[#701010] via-red-900 to-[#5a0c0c] text-white rounded-2xl p-5 shadow-lg border border-red-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="space-y-1 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-3 h-3 text-amber-300" /> Fractional Sales Network
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-tight">
              Expand Your Business with Local Sales Representation
            </h3>
            <p className="text-xs text-red-100/90 max-w-xl">
              Join business owners and regional sales partners closing deals worldwide. Register free to respond to this opportunity & connect directly.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#701010] font-headline font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-105 flex-shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            Register to Respond ↗
          </Link>
        </div>
      )}
      {/* Top Navigation — Back to Feed + Share Post */}
      <div className="flex items-center justify-between">
        <Link
          href="/home"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#701010] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#701010] bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          {copied ? "Link Copied!" : "Share Post"}
        </button>
      </div>

      {/* Full Interactive SPPostCard — price tags, booking, checkout all intact */}
      <SPPostCard
        post={formattedPost as any}
        authorName={post.eventName || "Sales Opportunity"}
        onViewDetails={() => setViewingPost(formattedPost)}
      />

      {/* Post Details Drawer */}
      <PostDetailsDrawer
        isOpen={!!viewingPost}
        onClose={() => setViewingPost(null)}
        post={viewingPost}
      />
    </div>
  );
}

