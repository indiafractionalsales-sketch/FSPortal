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
import { ArrowLeft } from "lucide-react";

interface PostClientViewProps {
  post: ServerPost;
  postId: string;
}

export default function PostClientView({ post, postId }: PostClientViewProps) {
  const [viewingPost, setViewingPost] = useState<any | null>(null);

  const formattedPost = {
    ...post,
    __id: post.id || postId,
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
      </div>

      {/* Render Full Interactive SPPostCard with Clickable Price Tags, Checkout & Booking */}
      <SPPostCard
        post={formattedPost as any}
        authorName={post.eventName || "Sales Opportunity"}
        onViewDetails={() => setViewingPost(formattedPost)}
      />

      {/* Optional Post Details Drawer */}
      <PostDetailsDrawer
        isOpen={!!viewingPost}
        onClose={() => setViewingPost(null)}
        post={viewingPost}
      />
    </div>
  );
}

