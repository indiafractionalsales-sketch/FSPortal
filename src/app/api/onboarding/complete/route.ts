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

import { NextResponse } from "next/server";
import { admin, adminDb, getDbForId } from "@/lib/firebase-admin";

const ALLOWED_ROLES = ["obo", "sp", "tpsp"] as const;
type AllowedRole = typeof ALLOWED_ROLES[number];

export async function POST(req: Request) {
  try {
    // ── 1. Authenticate the request ──────────────────────────────────────────
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const idToken = authHeader.split("Bearer ")[1];

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const uid = decodedToken.uid;

    // ── 2. Parse and validate request body ───────────────────────────────────
    const body = await req.json();
    const {
      role,
      country,
      isVerified,
      verificationStatus,
      verifiedBadge,
      gdprConsent,
      gdprConsentDate,
      termsAccepted,
      termsVersion,
      termsAcceptedDate,
      termsIpAddress,
      termsUserAgent,
    } = body;

    // Validate role — only allowed values accepted
    if (!ALLOWED_ROLES.includes(role as AllowedRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (!gdprConsent || !termsAccepted) {
      return NextResponse.json({ error: "Consent required" }, { status: 400 });
    }

    // ── 3. Determine target database ─────────────────────────────────────────
    const databaseId =
      typeof country === "string" && country.toLowerCase() === "india"
        ? "fsindiadb"
        : "default";

    // ── 4. Build the sanitized user document ─────────────────────────────────
    // NEVER trust client for isAdmin or billing — always hardcode safe values
    const userDoc = {
      uid,
      role,                                           // server-validated
      databaseId,
      isAdmin: false,                                 // always forced false
      billing: null,                                  // always forced null
      isVerified: !!isVerified,
      verificationStatus: verificationStatus || (isVerified ? "approved" : "unverified"),
      verifiedBadge: verifiedBadge || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gdprConsent: true,                              // validated above
      gdprConsentDate: gdprConsentDate || new Date().toISOString(),
      termsAccepted: true,                            // validated above
      termsVersion: termsVersion || "2.0",
      termsAcceptedDate: termsAcceptedDate || new Date().toISOString(),
      termsIpAddress: termsIpAddress || "unknown",
      termsUserAgent: termsUserAgent || "unknown",
    };

    // ── 5. Write to default database (always) ────────────────────────────────
    if (!adminDb) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    await adminDb.collection("users").doc(uid).set(userDoc, { merge: false });

    // ── 6. Mirror to regional database if applicable (non-blocking) ──────────
    if (databaseId !== "default") {
      try {
        const regionalDb = getDbForId(databaseId);
        if (regionalDb) {
          await regionalDb.collection("users").doc(uid).set(userDoc, { merge: false });
        }
      } catch (regionErr) {
        // Non-blocking — regional sync failure does not fail the onboarding
        console.warn(`Regional DB sync to ${databaseId} failed (non-blocking):`, regionErr);
      }
    }

    return NextResponse.json({ success: true, uid, role, databaseId });
  } catch (err) {
    console.error("Onboarding complete error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
