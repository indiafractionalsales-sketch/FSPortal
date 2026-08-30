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

import {
  getDocument,
  saveDocument,
  queryCollection,
  listSubcollection
} from "@/lib/firestore-rest";

export { getDocument };



export interface MarketplaceAgency {
  id?: string;
  __id?: string;
  name: string;
  category: string;
  location: string;
  region: string;
  rating: number;
  reviewsCount: number;
  responseSla: string;
  completedProjects: number;
  isVerified: boolean;
  tagline: string;
  description: string;
  website: string;
  specialties: string[];
  ownerUid: string;
  ownerEmail: string;
  logoUrl?: string;
  bookingUrl?: string;
  status: "approved" | "pending_admin_approval" | "inactive" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceInquiry {
  id?: string;
  __id?: string;
  agencyId: string;
  agencyName: string;
  agencyOwnerUid: string;
  buyerUid: string;
  buyerName: string;
  buyerEmail: string;
  buyerPersona: string;
  projectRequirements: string;
  timeline: string;
  estimatedBudget?: string;
  attachmentUrl?: string;
  status: "new" | "viewed" | "in_discussion" | "completed" | "archived";
  firstAgencyReplyAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id?: string;
  __id?: string;
  inquiryId: string;
  senderUid: string;
  senderName: string;
  senderType: "buyer" | "agency" | "system" | "ai_agent";
  text: string;
  attachmentUrl?: string;
  attachmentName?: string;
  cardType?: "review_request" | "meeting_invite" | "milestone_update";
  cardData?: Record<string, any>;
  createdAt: string;
}

export interface Review {
  id?: string;
  __id?: string;
  inquiryId: string;
  agencyId: string;
  reviewerUid: string;
  reviewerName: string;
  targetUid: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

const COLLECTION_AGENCIES = "Marketplace_Agencies";
const COLLECTION_INQUIRIES = "Marketplace_Inquiries";
const COLLECTION_REVIEWS = "Reviews";

export function flattenSpecialties(input?: string[] | string): string[] {
  if (!input) return [];
  const rawList = Array.isArray(input) ? input : [input];
  const result: string[] = [];
  rawList.forEach(item => {
    if (typeof item === "string") {
      const parts = item.split(/[;,]/).map(s => s.trim()).filter(Boolean);
      result.push(...parts);
    }
  });
  return Array.from(new Set(result));
}

/**
 * Fetch live approved agency listings from Firestore.
 * Queries both fsindiadb and default database instances.
 */
export async function fetchLiveMarketplaceAgencies(
  category?: string,
  idToken?: string
): Promise<MarketplaceAgency[]> {
  try {
    if (!idToken) return [];
    
    const whereFilters: { field: string; op: "EQUAL"; value: any }[] = [
      { field: "status", op: "EQUAL", value: "approved" }
    ];

    if (category && category !== "all") {
      whereFilters.push({ field: "category", op: "EQUAL", value: category });
    }

    const [indiaRes, globalRes] = await Promise.all([
      queryCollection(COLLECTION_AGENCIES, idToken, {
        where: whereFilters,
        limit: 50,
        orderByField: "createdAt",
        orderDirection: "DESCENDING",
        databaseId: "fsindiadb"
      }).catch(() => ({ docs: [] })),
      queryCollection(COLLECTION_AGENCIES, idToken, {
        where: whereFilters,
        limit: 50,
        orderByField: "createdAt",
        orderDirection: "DESCENDING",
        databaseId: "default"
      }).catch(() => ({ docs: [] }))
    ]);

    const combinedDocs = [...(indiaRes.docs || []), ...(globalRes.docs || [])];
    const uniqueMap = new Map<string, Record<string, unknown>>();
    combinedDocs.forEach(doc => {
      const docId = (doc.__id as string) || (doc.id as string);
      if (docId) uniqueMap.set(docId, doc);
    });

    return Array.from(uniqueMap.values()).map(doc => ({
      id: (doc.__id as string) || (doc.id as string),
      __id: doc.__id as string,
      name: (doc.name as string) || "Unnamed Agency",
      category: (doc.category as string) || "Other",
      location: (doc.location as string) || "Global",
      region: (doc.region as string) || "Global",
      rating: typeof doc.rating === "number" ? doc.rating : 5.0,
      reviewsCount: typeof doc.reviewsCount === "number" ? doc.reviewsCount : 0,
      responseSla: (doc.responseSla as string) || "< 2 hrs",
      completedProjects: typeof doc.completedProjects === "number" ? doc.completedProjects : 10,
      isVerified: doc.isVerified !== undefined ? Boolean(doc.isVerified) : Boolean(doc.verified),
      tagline: (doc.tagline as string) || "",
      description: (doc.description as string) || "",
      website: (doc.website as string) || "",
      specialties: flattenSpecialties(doc.specialties as any),
      ownerUid: (doc.ownerUid as string) || "",
      ownerEmail: (doc.ownerEmail as string) || "",
      logoUrl: (doc.logoUrl as string) || "",
      bookingUrl: (doc.bookingUrl as string) || "",
      status: (doc.status as any) || "approved",
      createdAt: (doc.createdAt as string) || new Date().toISOString(),
      updatedAt: (doc.updatedAt as string) || new Date().toISOString(),
    }));

  } catch (err) {
    console.error("Error fetching live marketplace agencies:", err);
    return [];
  }
}


/**
 * Check if the user already has an existing listing in a specific category.
 */
export async function checkDuplicateListing(
  ownerUid: string,
  category: string,
  idToken: string
): Promise<MarketplaceAgency | null> {
  try {
    const { docs } = await queryCollection(COLLECTION_AGENCIES, idToken, {
      where: [
        { field: "ownerUid", op: "EQUAL", value: ownerUid },
        { field: "category", op: "EQUAL", value: category }
      ],
      limit: 1
    });

    if (docs.length > 0) {
      const doc = docs[0];
      return {
        id: (doc.__id as string) || (doc.id as string),
        __id: doc.__id as string,
        name: (doc.name as string) || "",
        category: (doc.category as string) || "",
        location: (doc.location as string) || "",
        region: (doc.region as string) || "",
        rating: typeof doc.rating === "number" ? doc.rating : 5.0,
        reviewsCount: typeof doc.reviewsCount === "number" ? doc.reviewsCount : 0,
        responseSla: (doc.responseSla as string) || "< 2 hrs",
        completedProjects: typeof doc.completedProjects === "number" ? doc.completedProjects : 0,
        isVerified: Boolean(doc.isVerified),
        tagline: (doc.tagline as string) || "",
        description: (doc.description as string) || "",
        website: (doc.website as string) || "",
        specialties: Array.isArray(doc.specialties) ? (doc.specialties as string[]) : [],
        ownerUid: (doc.ownerUid as string) || "",
        ownerEmail: (doc.ownerEmail as string) || "",
        logoUrl: (doc.logoUrl as string) || "",
        bookingUrl: (doc.bookingUrl as string) || "",
        status: (doc.status as any) || "pending_admin_approval",
        createdAt: (doc.createdAt as string) || "",
        updatedAt: (doc.updatedAt as string) || "",
      };
    }
    return null;
  } catch (err) {
    console.error("Error checking duplicate listing:", err);
    return null;
  }
}

/**
 * Register a new agency listing in Marketplace_Agencies.
 */
export async function registerAgencyListing(
  data: Partial<MarketplaceAgency>,
  idToken: string
): Promise<string> {
  const docId = `agency_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const payload: MarketplaceAgency = {
    name: data.name || "",
    category: data.category || "Other",
    location: data.location || "India",
    region: data.region || "Asia Pacific",
    rating: 5.0,
    reviewsCount: 0,
    responseSla: "< 2 hrs",
    completedProjects: data.completedProjects || 1,
    isVerified: Boolean(data.isVerified),
    tagline: data.tagline || "",
    description: data.description || "",
    website: data.website || "",
    specialties: data.specialties || [],
    ownerUid: data.ownerUid || "",
    ownerEmail: data.ownerEmail || "",
    logoUrl: data.logoUrl || "",
    bookingUrl: data.bookingUrl || "",
    status: data.status || (data.isVerified ? "approved" : "pending_admin_approval"),
    createdAt: now,
    updatedAt: now,
  };

  await saveDocument(COLLECTION_AGENCIES, docId, payload as any, idToken);
  return docId;
}

/**
 * Update an existing agency listing.
 */
export async function updateAgencyListing(
  agencyId: string,
  updates: Partial<MarketplaceAgency>,
  idToken: string
): Promise<void> {
  const existing = await getDocument(COLLECTION_AGENCIES, agencyId, idToken);
  if (!existing) throw new Error("Agency listing not found.");

  const payload = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  await saveDocument(COLLECTION_AGENCIES, agencyId, payload, idToken);
}

/**
 * Submit an inquiry to an agency.
 */
export async function submitAgencyInquiry(
  data: Omit<MarketplaceInquiry, "id" | "__id" | "createdAt" | "updatedAt" | "status">,
  idToken: string
): Promise<string> {
  const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const inquiryPayload: MarketplaceInquiry = {
    ...data,
    status: "new",
    createdAt: now,
    updatedAt: now
  };

  // 1. Create main inquiry document
  await saveDocument(COLLECTION_INQUIRIES, inquiryId, inquiryPayload as any, idToken);

  // 2. Create Message #1 in Messages sub-collection
  const msgId = `msg_1_${Date.now()}`;
  const firstMsgPayload: ChatMessage = {
    inquiryId,
    senderUid: data.buyerUid,
    senderName: data.buyerName,
    senderType: "buyer",
    text: data.projectRequirements,
    attachmentUrl: data.attachmentUrl || "",
    createdAt: now
  };

  await saveDocument(
    `${COLLECTION_INQUIRIES}/${inquiryId}/Messages`,
    msgId,
    firstMsgPayload as any,
    idToken
  );

  return inquiryId;
}

/**
 * Send a chat message within an inquiry thread.
 */
export async function sendChatMessage(
  inquiryId: string,
  msg: Omit<ChatMessage, "id" | "__id" | "inquiryId" | "createdAt">,
  idToken: string
): Promise<string> {
  const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const payload: ChatMessage = {
    ...msg,
    inquiryId,
    createdAt: now
  };

  await saveDocument(
    `${COLLECTION_INQUIRIES}/${inquiryId}/Messages`,
    msgId,
    payload as any,
    idToken
  );

  // If agency replied, update inquiry status to "in_discussion" and capture response timestamp
  if (msg.senderType === "agency") {
    const inquiry = await getDocument(COLLECTION_INQUIRIES, inquiryId, idToken);
    if (inquiry) {
      const updates: Partial<MarketplaceInquiry> = {
        status: "in_discussion",
        updatedAt: now,
      };
      if (!inquiry.firstAgencyReplyAt) {
        updates.firstAgencyReplyAt = now;
      }
      await saveDocument(COLLECTION_INQUIRIES, inquiryId, { ...inquiry, ...updates }, idToken);
    }
  }

  return msgId;
}

/**
 * Fetch messages for a specific inquiry thread.
 */
export async function fetchInquiryMessages(
  inquiryId: string,
  idToken: string
): Promise<ChatMessage[]> {
  try {
    const rawDocs = await listSubcollection(
      `${COLLECTION_INQUIRIES}/${inquiryId}/Messages`,
      idToken
    );

    const msgs: ChatMessage[] = rawDocs.map(doc => ({
      id: (doc.__id as string) || (doc.id as string),
      __id: doc.__id as string,
      inquiryId: (doc.inquiryId as string) || inquiryId,
      senderUid: (doc.senderUid as string) || "",
      senderName: (doc.senderName as string) || "User",
      senderType: (doc.senderType as any) || "buyer",
      text: (doc.text as string) || "",
      attachmentUrl: (doc.attachmentUrl as string) || "",
      attachmentName: (doc.attachmentName as string) || "",
      cardType: doc.cardType as any,
      cardData: doc.cardData as any,
      createdAt: (doc.createdAt as string) || new Date().toISOString()
    }));

    // Sort by createdAt ascending
    return msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } catch (err) {
    console.error("Error fetching inquiry messages:", err);
    return [];
  }
}

/**
 * Fetch user's active inquiries (either as buyer or agency owner).
 */
export async function fetchUserInquiries(
  userId: string,
  idToken: string
): Promise<MarketplaceInquiry[]> {
  try {
    const [asBuyer, asAgency] = await Promise.all([
      queryCollection(COLLECTION_INQUIRIES, idToken, {
        where: [{ field: "buyerUid", op: "EQUAL", value: userId }],
        limit: 50
      }).catch(() => ({ docs: [] })),
      queryCollection(COLLECTION_INQUIRIES, idToken, {
        where: [{ field: "agencyOwnerUid", op: "EQUAL", value: userId }],
        limit: 50
      }).catch(() => ({ docs: [] }))
    ]);

    const combinedMap = new Map<string, Record<string, unknown>>();
    [...asBuyer.docs, ...asAgency.docs].forEach(doc => {
      const docId = (doc.__id as string) || (doc.id as string);
      if (docId) combinedMap.set(docId, doc);
    });

    return Array.from(combinedMap.values()).map(doc => ({
      id: (doc.__id as string) || (doc.id as string),
      __id: doc.__id as string,
      agencyId: (doc.agencyId as string) || "",
      agencyName: (doc.agencyName as string) || "Agency",
      agencyOwnerUid: (doc.agencyOwnerUid as string) || "",
      buyerUid: (doc.buyerUid as string) || "",
      buyerName: (doc.buyerName as string) || "Buyer",
      buyerEmail: (doc.buyerEmail as string) || "",
      buyerPersona: (doc.buyerPersona as string) || "OBO",
      projectRequirements: (doc.projectRequirements as string) || "",
      timeline: (doc.timeline as string) || "Flexible",
      estimatedBudget: (doc.estimatedBudget as string) || "",
      attachmentUrl: (doc.attachmentUrl as string) || "",
      status: (doc.status as any) || "new",
      firstAgencyReplyAt: doc.firstAgencyReplyAt as string,
      createdAt: (doc.createdAt as string) || new Date().toISOString(),
      updatedAt: (doc.updatedAt as string) || new Date().toISOString()
    })).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (err) {
    console.error("Error fetching user inquiries:", err);
    return [];
  }
}

/**
 * Toggle bookmark/shortlist status for an agency.
 */
export async function toggleSaveAgency(
  agencyId: string,
  userId: string,
  idToken: string
): Promise<string[]> {
  const userDoc = await getDocument("users", userId, idToken);
  const currentSaved: string[] = Array.isArray(userDoc?.savedAgencies)
    ? (userDoc.savedAgencies as string[])
    : [];

  let updatedSaved: string[];
  if (currentSaved.includes(agencyId)) {
    updatedSaved = currentSaved.filter(id => id !== agencyId);
  } else {
    updatedSaved = [...currentSaved, agencyId];
  }

  if (userDoc) {
    await saveDocument("users", userId, { ...userDoc, savedAgencies: updatedSaved }, idToken);
  }

  return updatedSaved;
}

/**
 * Submit a review for an agency and update overall rating.
 */
export async function submitReview(
  inquiryId: string,
  agencyId: string,
  reviewerUid: string,
  reviewerName: string,
  targetUid: string,
  rating: number,
  comment: string,
  idToken: string
): Promise<void> {
  const reviewId = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const reviewPayload: Review = {
    inquiryId,
    agencyId,
    reviewerUid,
    reviewerName,
    targetUid,
    rating: Math.min(5, Math.max(1, rating)),
    comment,
    createdAt: now
  };

  // 1. Save review document
  await saveDocument(COLLECTION_REVIEWS, reviewId, reviewPayload as any, idToken);

  // 2. Recalculate Agency Rating
  const { docs: existingReviews } = await queryCollection(COLLECTION_REVIEWS, idToken, {
    where: [{ field: "agencyId", op: "EQUAL", value: agencyId }],
    limit: 100
  });

  const totalReviews = existingReviews.length;
  const sumRating = existingReviews.reduce((acc, r) => acc + (typeof r.rating === "number" ? r.rating : 5), 0);
  const avgRating = totalReviews > 0 ? parseFloat((sumRating / totalReviews).toFixed(1)) : 5.0;

  const agencyDoc = await getDocument(COLLECTION_AGENCIES, agencyId, idToken);
  if (agencyDoc) {
    await saveDocument(COLLECTION_AGENCIES, agencyId, {
      ...agencyDoc,
      rating: avgRating,
      reviewsCount: totalReviews,
      updatedAt: now
    }, idToken);
  }
}
