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

import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { getPostByIdServer } from "@/lib/server-posts";
import Navbar from "@/components/Navbar";
import { Calendar, Clock, MapPin, Users, Globe, ExternalLink, Share2, ArrowLeft } from "lucide-react";
import PostClientView from "./PostClientView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostByIdServer(id);

  const headerList = await headers();
  const host = headerList.get("host") || "fractionalsalespartner.com";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  const title = post?.eventName
    ? `${post.eventName} | Fractional Sales Partner`
    : "Sales Partnership Opportunity | Fractional Sales Partner";

  const description = "Come and visit fractionalsalespartner.com for more collaborations!";
  const pageUrl = `${baseUrl}/post/${id}`;
  const ogImageUrl = `${baseUrl}/post/${id}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Fractional Sales Partner",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post?.eventName || "Fractional Sales Partner Event",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostByIdServer(id);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#701010]">
            ⚠️
          </div>
          <h2 className="text-xl font-bold font-serif text-gray-900 mb-2">Post Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">
            This post may have been removed or the link is invalid.
          </p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 bg-[#701010] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#500b0b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go to Home Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <PostClientView post={post} postId={id} />
      </main>
    </div>
  );
}
