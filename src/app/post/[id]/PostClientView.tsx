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
import {
  Calendar, Clock, MapPin, Users, Globe, ExternalLink, Share2, ArrowLeft, Check, Copy
} from "lucide-react";

interface PostClientViewProps {
  post: ServerPost;
  postId: string;
}

export default function PostClientView({ post, postId }: PostClientViewProps) {
  const [copied, setCopied] = useState(false);

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fractionalsalespartner.com";
  const shareUrl = `${baseUrl}/post/${postId}`;
  const shareText = `Come and visit our Fractional Sales Partner for more collaborations!\n\n${shareUrl}`;

  const handleUniversalShare = async () => {
    const shareData = {
      title: post.eventName || "Sales Opportunity",
      text: shareText,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyToClipboard();
        }
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
      {/* Top Navigation Back Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/home"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#701010] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>
        <button
          onClick={handleUniversalShare}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#701010] bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          {copied ? "Link Copied!" : "Share Post"}
        </button>
      </div>

      {/* Main Post Card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Banner Media if present */}
        {post.mediaUrl && (
          <div className="w-full max-h-[380px] overflow-hidden bg-gray-100 relative">
            {/* eslint-disable-next-next/no-img-element */}
            <img
              src={post.mediaUrl}
              alt={post.eventName || "Post Header"}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8 space-y-6">
          {/* Header & Category Badge */}
          <div className="space-y-3">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#701010] bg-red-50 border border-red-100 px-2.5 py-1 rounded-md">
              {post.postType === "obo" ? "Business Requirement" : "Sales Event"}
            </span>

            <h1 className="font-serif font-bold text-2xl md:text-3xl text-gray-900 leading-tight">
              {post.eventName || post.targetIndustry || "Sales Opportunity"}
            </h1>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/70 p-4 md:p-5 rounded-xl border border-gray-100 text-sm">
            {formattedDate && (
              <div className="flex items-center gap-2.5 text-gray-700">
                <Calendar className="w-4 h-4 text-[#701010] flex-shrink-0" />
                <span className="font-medium">{formattedDate}</span>
              </div>
            )}

            {post.time && (
              <div className="flex items-center gap-2.5 text-gray-700">
                <Clock className="w-4 h-4 text-[#701010] flex-shrink-0" />
                <span className="font-medium">{post.time}</span>
              </div>
            )}

            {(post.venue || post.city || post.country) && (
              <div className="flex items-center gap-2.5 text-gray-700 md:col-span-2">
                <MapPin className="w-4 h-4 text-[#701010] flex-shrink-0" />
                <span className="font-medium">
                  {[post.venue, post.city, post.country].filter(Boolean).join(", ")}
                </span>
              </div>
            )}

            {post.expectedFootfall && (
              <div className="flex items-center gap-2.5 text-gray-700 md:col-span-2">
                <Users className="w-4 h-4 text-[#701010] flex-shrink-0" />
                <span className="font-medium">
                  Expected Attendees: <strong className="text-[#701010]">{post.expectedFootfall}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {post.description && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">About this Opportunity</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans text-sm md:text-base">
                {post.description}
              </p>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500">
              Come and visit <strong className="text-[#701010]">fractionalsalespartner.com</strong> for more collaborations!
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={copyToClipboard}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <Link
                href="/home"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#701010] text-white rounded-xl text-xs font-bold hover:bg-[#500b0b] transition-colors"
              >
                Explore More Posts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
