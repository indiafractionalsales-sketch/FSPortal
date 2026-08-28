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
import { queryGSTVerificationAPI, VerificationRecord } from "@/lib/gst-verification";
import { setDocument, getDocument } from "@/lib/firestore-rest";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    const idToken = authHeader.split("Bearer ")[1];

    const body = await req.json();
    const { uid, gstin, role = "sp" } = body;

    if (!uid || !gstin) {
      return NextResponse.json({ error: "Missing required fields: uid and gstin" }, { status: 400 });
    }

    // Step 1: Query GST verification service
    const gstResult = await queryGSTVerificationAPI(gstin);

    if (!gstResult.success) {
      return NextResponse.json({
        success: false,
        error: gstResult.error || "GSTIN verification failed. Ensure GSTIN is active and valid."
      }, { status: 400 });
    }

    const verificationId = `ver_gst_${gstin.trim().toUpperCase()}`;
    const now = new Date().toISOString();

    // Step 2: Create record for dedicated Verifications collection
    const record: VerificationRecord = {
      id: verificationId,
      uid,
      role,
      provider: "sandbox_gst",
      verificationType: "gst_india",
      identifier: gstin.trim().toUpperCase(),
      country: "India",
      status: "approved",
      verifiedAt: now,
      approvedBy: "system_auto",
      summary: {
        legalName: gstResult.legalName,
        tradeName: gstResult.tradeName,
        taxpayerType: gstResult.taxpayerType,
        state: gstResult.state,
        city: gstResult.city
      },
      rawResponse: gstResult.rawResponse
    };

    // Save to Verifications collection
    await setDocument("Verifications", verificationId, record, idToken, "default");

    // Step 3: Update User document with verification metadata
    const userDoc = (await getDocument("users", uid, idToken, "default")) as any || {};
    const updatedUser = {
      ...userDoc,
      isVerified: true,
      verificationStatus: "approved",
      verificationId,
      verifiedType: "gst_india",
      verifiedBadge: "GST Verified 🛡️",
      gstin: gstin.trim().toUpperCase(),
      legalName: gstResult.legalName
    };
    await setDocument("users", uid, updatedUser, idToken, "default");

    return NextResponse.json({
      success: true,
      message: "GSTIN Auto-Verification Successful!",
      verification: record
    });
  } catch (err: any) {
    console.error("Error in verify-gst API:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
