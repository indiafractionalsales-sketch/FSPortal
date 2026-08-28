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

    const isRegularOrSEZ = 
      gstResult.taxpayerType.toLowerCase().includes("regular") || 
      gstResult.taxpayerType.toLowerCase().includes("sez");

    // Auto-approve Regular & SEZ units; Queue Composition/Casual/Suspended for Admin Review
    const calculatedStatus = (gstResult.status.toLowerCase() === "active" && isRegularOrSEZ)
      ? "approved"
      : "pending_admin_approval";

    // Step 2: Create record for dedicated Verifications collection in fsindiadb
    const record: VerificationRecord = {
      id: verificationId,
      uid,
      role,
      provider: "sandbox_gst",
      verificationType: "gst_india",
      identifier: gstin.trim().toUpperCase(),
      country: "India",
      status: calculatedStatus,
      verifiedAt: now,
      approvedBy: calculatedStatus === "approved" ? "system_auto" : "",
      summary: {
        legalName: gstResult.legalName,
        tradeName: gstResult.tradeName,
        taxpayerType: gstResult.taxpayerType,
        state: gstResult.state,
        city: gstResult.city,
        services: gstResult.services,
        fullAddress: gstResult.fullAddress,
        notes: calculatedStatus === "pending_admin_approval" 
          ? `Queued for Admin Review: Taxpayer type is '${gstResult.taxpayerType}'`
          : undefined
      },
      rawResponse: gstResult.rawResponse
    };

    // Save to Verifications collection in fsindiadb (fallback to default)
    try {
      await setDocument("Verifications", verificationId, record, idToken, "fsindiadb");
    } catch (saveErr) {
      console.warn("Notice: Writing Verifications to fsindiadb failed, using default db:", saveErr);
      await setDocument("Verifications", verificationId, record, idToken, "default").catch(() => {});
    }

    // Step 3: Update User document with verification metadata in both fsindiadb and default
    try {
      const userDocIndia = (await getDocument("users", uid, idToken, "fsindiadb").catch(() => null)) || (await getDocument("users", uid, idToken, "default").catch(() => null)) || {};
      const updatedUser = {
        ...userDocIndia,
        isVerified: calculatedStatus === "approved",
        verificationStatus: calculatedStatus,
        verificationId,
        verifiedType: "gst_india",
        verifiedBadge: calculatedStatus === "approved" ? "GST Verified 🛡️" : "Pending Admin Review ⏳",
        gstin: gstin.trim().toUpperCase(),
        legalName: gstResult.legalName
      };

      await setDocument("users", uid, updatedUser, idToken, "fsindiadb").catch(() => {});
      await setDocument("users", uid, updatedUser, idToken, "default").catch(() => {});
    } catch (userErr) {
      console.warn("Non-blocking user doc update warning:", userErr);
    }

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
