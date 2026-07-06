/**
 * Lead service — client-side helpers for saving and processing leads.
 *
 * Capture flow (offline-first):
 *   1. Upload card image + voice note to Firebase Storage
 *   2. Save a "pending" lead doc to Firestore with storage URLs
 *   → No AI call at capture time
 *
 * Process flow (user-triggered):
 *   1. SP clicks "Process All" on the Insights page
 *   2. For each pending lead, POST to /api/leads/process with the leadId
 *   3. Route downloads media from Storage, runs Gemini, updates the doc
 */

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";

export interface PendingLeadPayload {
  cardImageBlob: Blob;
  voiceNoteBlob?: Blob | null;
  textNote?: string | null;
  postId?: string | null;
  ownerUid?: string | null; // Business Owner uid (from the post)
}

export interface PendingLead {
  id: string;
  status: "pending" | "processing" | "processed" | "failed";
  capturedByUid: string;
  ownerUid: string;
  postId: string | null;
  cardImageUrl: string;
  voiceNoteUrl: string | null;
  textNote: string | null;
  createdAt: any;
  contactInfo: any | null;
  temperature: "hot" | "warm" | "cold" | null;
  actionItem: string | null;
  contextSummary: string | null;
  processedAt: any | null;
}

/**
 * Saves a pending lead by calling the server-side API which:
 * 1. Uploads media to Firebase Storage
 * 2. Routes the Firestore write to the SP's country-specific database
 *
 * No AI processing happens here — fast even on slow event WiFi.
 */
export async function savePendingLead(
  payload: PendingLeadPayload
): Promise<string> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("cardImage", payload.cardImageBlob, "card.jpg");
  if (payload.voiceNoteBlob) {
    formData.append("voiceNote", payload.voiceNoteBlob, "voice.webm");
  }
  if (payload.textNote) formData.append("textNote", payload.textNote);
  if (payload.postId) formData.append("postId", payload.postId);
  if (payload.ownerUid) formData.append("ownerUid", payload.ownerUid);

  const res = await fetch("/api/leads/save", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to save lead");

  return data.leadId;
}

/**
 * Fetches all pending leads for the current user.
 */
export async function getPendingLeads(): Promise<PendingLead[]> {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];

  const q = query(
    collection(db, "Leads"),
    where("capturedByUid", "==", uid),
    where("status", "==", "pending")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<PendingLead, "id">),
  }));
}

/**
 * Triggers AI processing for a single lead by its Firestore document ID.
 * Calls the /api/leads/process route which handles Storage download + AI.
 */
export async function processLead(leadId: string): Promise<void> {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch("/api/leads/process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ leadId }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || `Failed to process lead ${leadId}`);
  }
}

/**
 * Processes all pending leads for the current user sequentially.
 * Returns counts of success and failure.
 */
export async function batchProcessLeads(
  onProgress?: (done: number, total: number) => void
): Promise<{ success: number; failed: number }> {
  const pending = await getPendingLeads();
  let success = 0;
  let failed = 0;

  for (let i = 0; i < pending.length; i++) {
    try {
      await processLead(pending[i].id);
      success++;
    } catch {
      failed++;
    }
    onProgress?.(i + 1, pending.length);
  }

  return { success, failed };
}
