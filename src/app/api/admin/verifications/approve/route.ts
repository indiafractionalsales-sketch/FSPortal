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
import { getDocument, setDocument } from "@/lib/firestore-rest";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    const idToken = authHeader.split("Bearer ")[1];

    const body = await req.json();
    const { adminUid, verificationId, targetUid, action } = body;

    if (!adminUid || !verificationId || !targetUid || !action) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Check admin rights
    const adminUser = (await getDocument("users", adminUid, idToken, "default")) as any;
    if (!adminUser || (adminUser.isAdmin !== true && adminUser.role !== "admin")) {
      return NextResponse.json({ error: "Access denied. Admin rights required." }, { status: 403 });
    }

    // Check verification doc in fsindiadb first, then default
    let verificationDoc = (await getDocument("Verifications", verificationId, idToken, "fsindiadb")) as any;
    let targetDb = "fsindiadb";

    if (!verificationDoc) {
      verificationDoc = (await getDocument("Verifications", verificationId, idToken, "default")) as any;
      targetDb = "default";
    }

    if (!verificationDoc) {
      return NextResponse.json({ error: "Verification record not found" }, { status: 404 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";
    const now = new Date().toISOString();

    const updatedVerification = {
      ...verificationDoc,
      status: newStatus,
      approvedAt: now,
      approvedBy: adminUid
    };

    await setDocument("Verifications", verificationId, updatedVerification, idToken, targetDb);

    // Update target user flags
    const userDoc = (await getDocument("users", targetUid, idToken, targetDb)) || (await getDocument("users", targetUid, idToken, "default")) || {};
    const updatedUser = {
      ...userDoc,
      isVerified: action === "approve",
      verificationStatus: newStatus,
      verifiedBadge: action === "approve" ? "Business Verified 🛡️" : ""
    };
    await setDocument("users", targetUid, updatedUser, idToken, targetDb);
    await setDocument("users", targetUid, updatedUser, idToken, "default");

    return NextResponse.json({
      success: true,
      message: `Verification request ${action === "approve" ? "approved" : "rejected"} successfully.`,
      verification: updatedVerification
    });
  } catch (err: any) {
    console.error("Error in admin verifications approve route:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
