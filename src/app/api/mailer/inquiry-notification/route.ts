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

export async function POST(req: Request) {
  try {
    const { agencyOwnerEmail, agencyName, category, region, inquiryId } = await req.json();

    // Log executive teaser email notification payload
    console.log("--------------------------------------------------");
    console.log("📨 EXECUTIVE INQUIRY TEASER EMAIL DISPATCHED");
    console.log(`To: ${agencyOwnerEmail || "Agency Owner"}`);
    console.log(`Subject: New Client Requirement Received for ${agencyName}`);
    console.log(`Body Teaser:
      Hello ${agencyName} Team,

      A potential client on the Fractional Sales Partner Marketplace has submitted a new inquiry for your agency.

      ---------------------------------------------
      Listing Category : ${category || "Specialized Services"}
      Target Region    : ${region || "Global Coverage"}
      Received Timestamp: ${new Date().toLocaleString()}
      ---------------------------------------------

      🔒 Executive Privacy Protection Active:
      Client identity, full requirements, and contact details are confidential and secured inside your portal workspace.

      Click below to unlock full client details and open direct communication:
      👉 Portal Link: https://app.fractionalsalespartner.com/messages?inquiryId=${inquiryId || ""}

      Best regards,
      The Fractional Sales Partner Enterprise Team
    `);
    console.log("--------------------------------------------------");

    return NextResponse.json({
      success: true,
      message: "Executive teaser email dispatched successfully"
    });
  } catch (err: any) {
    console.error("Error in inquiry notification route:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to dispatch teaser email" },
      { status: 500 }
    );
  }
}
