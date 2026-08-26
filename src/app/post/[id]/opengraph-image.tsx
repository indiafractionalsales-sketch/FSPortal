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

import { ImageResponse } from "next/og";
import { getPostByIdServer } from "@/lib/server-posts";

export const runtime = "nodejs";
export const alt = "Fractional Sales Partner Event Preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostByIdServer(id);

  const title = post?.eventName || post?.targetIndustry || "Sales Partnership Opportunity";
  const dateStr = post?.date
    ? new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "Upcoming Date";
  const timeStr = post?.time || "TBD";
  const venueStr = [post?.venue, post?.city, post?.country].filter(Boolean).join(", ") || "Location on Request";
  const footfall = post?.expectedFootfall || "1000+";
  const mediaUrl = post?.mediaUrl;
  const tagType = post?.postType === "obo" ? "BUSINESS REQUIREMENT" : "EVENT";

  // Safely fetch mediaUrl to Base64 with tight 1s timeout to ensure sub-second response for crawlers
  let mediaBase64: string | null = null;
  if (mediaUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);
      const res = await fetch(mediaUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const mimeType = res.headers.get("content-type") || "image/jpeg";
        mediaBase64 = `data:${mimeType};base64,${base64}`;
      }
    } catch (e) {
      // Fallback gracefully to high-impact brand logo box if image fetch takes > 1s
      mediaBase64 = null;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
          padding: "40px 50px",
          boxSizing: "border-box",
          border: "12px solid #701010",
        }}
      >
        {/* Main Content Row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            height: "460px",
            gap: "40px",
          }}
        >
          {/* Left Column: Media / Logo Banner */}
          <div
            style={{
              width: "380px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f9fafb",
              borderRadius: "20px",
              border: "2px solid #f3f4f6",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {mediaBase64 ? (
              // eslint-disable-next-next/no-img-element
              <img
                src={mediaBase64}
                alt={title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "30px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "36px",
                    fontWeight: 900,
                    color: "#701010",
                    letterSpacing: "1px",
                    marginBottom: "8px",
                  }}
                >
                  FSP
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Fractional Sales Partner
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Event Details Card (Second half snapshot style) */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              padding: "10px 0",
            }}
          >
            {/* Title & Tag Row */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    backgroundColor: "#fef2f2",
                    color: "#701010",
                    border: "1px solid #fecaca",
                    borderRadius: "20px",
                    padding: "6px 18px",
                    fontSize: "13px",
                    fontWeight: 800,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {tagType} ↗
                </span>
              </div>

              <div
                style={{
                  fontSize: "38px",
                  fontWeight: 800,
                  color: "#111827",
                  lineHeight: "1.25",
                  maxHeight: "100px",
                  overflow: "hidden",
                }}
              >
                {title}
              </div>
            </div>

            {/* Event Info Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Date & Time */}
              <div style={{ display: "flex", flexDirection: "row", gap: "32px", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "22px" }}>📅</span>
                  <span style={{ fontSize: "20px", fontWeight: 600, color: "#374151" }}>{dateStr}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "22px" }}>⏰</span>
                  <span style={{ fontSize: "20px", fontWeight: 600, color: "#374151" }}>{timeStr}</span>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "22px" }}>📍</span>
                <span
                  style={{
                    fontSize: "19px",
                    fontWeight: 500,
                    color: "#4b5563",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "600px",
                  }}
                >
                  {venueStr}
                </span>
              </div>

              {/* Attendance Badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                <span style={{ fontSize: "22px" }}>👥</span>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#6b7280", letterSpacing: "1px" }}>
                  EXPECTED:{" "}
                  <span style={{ color: "#701010", fontWeight: 900, fontSize: "18px" }}>{footfall}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Brand Banner */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "20px",
            borderTop: "2px dashed #e5e7eb",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#701010" }}>
              Fractional Sales Partner
            </span>
            <span style={{ fontSize: "16px", color: "#9ca3af" }}>|</span>
            <span style={{ fontSize: "16px", color: "#4b5563", fontWeight: 600 }}>
              Global Sales Networking Platform
            </span>
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: 800,
              color: "#701010",
              backgroundColor: "#f9fafb",
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            fractionalsalespartner.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
      },
    }
  );
}
