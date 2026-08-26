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

import { useState } from "react";
import Link from "next/link";
import { ServerPost } from "@/lib/server-posts";
import SPPostCard from "@/components/SPPostCard";
import PostDetailsDrawer from "@/components/PostDetailsDrawer";
import { ArrowLeft, Share2, Check } from "lucide-react";

interface PostClientViewProps {
  post: ServerPost;
  postId: string;
}

export default function PostClientView({ post, postId }: PostClientViewProps) {
  const [viewingPost, setViewingPost] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

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
    <div className="space-y-6">
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

