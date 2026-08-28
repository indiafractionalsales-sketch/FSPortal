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
import { VerificationRecord } from "@/lib/gst-verification";
import { setDocument, getDocument } from "@/lib/firestore-rest";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    const idToken = authHeader.split("Bearer ")[1];

    const body = await req.json();
    const {
      uid,
      role = "sp",
      businessName,
      panNumber = "",
      documentUrl = "",
      notes = "",
      country = "India"
    } = body;

    if (!uid || !businessName) {
      return NextResponse.json({ error: "Missing required fields: uid and businessName" }, { status: 400 });
    }

    const verificationId = `ver_manual_${uid}_${Date.now()}`;
    const now = new Date().toISOString();

    const record: VerificationRecord = {
      id: verificationId,
      uid,
      role,
      provider: "manual_admin",
      verificationType: "manual_admin",
      identifier: panNumber || businessName,
      country,
      status: "pending_admin_approval",
      verifiedAt: now,
      approvedBy: "",
      summary: {
        legalName: businessName,
        panNumber,
        documentUrl,
        notes
      }
    };

    // Write to Verifications collection
    await setDocument("Verifications", verificationId, record, idToken, "default");

    // Update User Document
    const userDoc = (await getDocument("users", uid, idToken, "default")) as any || {};
    const updatedUser = {
      ...userDoc,
      isVerified: false,
      verificationStatus: "pending_admin_approval",
      verificationId,
      verifiedType: "manual_admin",
      legalName: businessName
    };
    await setDocument("users", uid, updatedUser, idToken, "default");

    return NextResponse.json({
      success: true,
      message: "Manual Business Verification Submitted for Admin Approval!",
      verification: record
    });
  } catch (err: any) {
    console.error("Error in manual-submit verification API:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
