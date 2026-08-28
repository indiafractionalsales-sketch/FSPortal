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
    const { adminUid, agencyId, status } = body;

    if (!adminUid || !agencyId || !status) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    if (!["approved", "rejected", "pending_admin_approval"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    // Verify admin rights
    const adminUser = (await getDocument("users", adminUid, idToken, "default")) as any;
    if (!adminUser || adminUser.isAdmin !== true) {
      return NextResponse.json({ error: "Access denied. Admin rights required." }, { status: 403 });
    }

    // Update Agency document in Marketplace_Agencies collection
    const agencyDoc = (await getDocument("Marketplace_Agencies", agencyId, idToken, "default")) as any || {};
    const updatedAgency = {
      ...agencyDoc,
      id: agencyId,
      status,
      updatedAt: new Date().toISOString(),
      updatedBy: adminUid
    };

    await setDocument("Marketplace_Agencies", agencyId, updatedAgency, idToken, "default");

    return NextResponse.json({
      success: true,
      message: `Agency ${agencyId} status updated to ${status}.`,
      agency: updatedAgency
    });
  } catch (err: any) {
    console.error("Error in admin marketplace status route:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
