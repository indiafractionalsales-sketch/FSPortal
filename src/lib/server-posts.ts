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

import { getDbForId } from "@/lib/firebase-admin";

export interface ServerPost {
  id: string;
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
  postType?: string;
  mediaUrl?: string;
  ownerUid?: string;
  targetCountry?: string;
  targetIndustry?: string;
  targetCustomerType?: string;
  b2bChannels?: string;
  b2cChannels?: string;
  engagementType?: string;
  commissionRate?: string;
  fixedCharges?: string;
  currency?: string;
  budgetMin?: number;
  budgetMax?: number;
  createdAt?: string;
  updatedAt?: string;
}

const PROJECT_ID = "fractional-sales-4436e";

/**
 * Server-side function to fetch a single Post by ID.
 * Tries Firebase Admin SDK first; falls back to Firestore REST endpoint if admin SDK is unconfigured.
 */
export async function getPostByIdServer(postId: string): Promise<ServerPost | null> {
  if (!postId) return null;

  // 1. Try Firebase Admin SDK
  try {
    const db = getDbForId("default");
    if (db) {
      const docSnap = await db.collection("Posts").doc(postId).get();
      if (docSnap.exists) {
        return {
          id: docSnap.id,
          ...(docSnap.data() as Omit<ServerPost, "id">),
        };
      }
    }
  } catch (err) {
    console.warn("Firebase Admin SDK getPostByIdServer failed, attempting REST fallback:", err);
  }

  // 2. Fallback to Firestore REST API (read-only document fetch)
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/default/documents/Posts/${postId}`;
    const res = await fetch(url, {
      next: { revalidate: 60 }, // Cache post metadata for 60 seconds
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.fields) return null;

    // Convert Firestore REST JSON to plain JS object
    const fields = data.fields;
    const parseVal = (v: any): any => {
      if (!v) return undefined;
      if ("stringValue" in v) return v.stringValue;
      if ("integerValue" in v) return parseInt(v.integerValue, 10);
      if ("doubleValue" in v) return v.doubleValue;
      if ("booleanValue" in v) return v.booleanValue;
      if ("nullValue" in v) return null;
      if ("arrayValue" in v) return v.arrayValue.values?.map(parseVal) || [];
      if ("mapValue" in v) {
        const res: Record<string, any> = {};
        for (const [k, val] of Object.entries(v.mapValue.fields || {})) {
          res[k] = parseVal(val);
        }
        return res;
      }
      return undefined;
    };

    const postObj: Record<string, any> = { id: postId };
    for (const [key, rawVal] of Object.entries(fields)) {
      postObj[key] = parseVal(rawVal);
    }

    return postObj as ServerPost;
  } catch (err) {
    console.error("Error fetching post server-side:", err);
    return null;
  }
}
