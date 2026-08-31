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
    const { type, recipientEmail, authorName, postTitle, postUrl, actorName, commentText } = await req.json();

    console.log("--------------------------------------------------");
    console.log(`📨 POST ACTIVITY EMAIL TRIGGER: [${type?.toUpperCase()}]`);
    console.log(`To: ${recipientEmail || "User"}`);

    switch (type) {
      case "sp_post_created":
        console.log(`Subject: New Sales Partner Opportunity: ${postTitle || "Global Partner Active"}`);
        console.log(`Body: Hello Business Owner, Sales Partner ${authorName || "A representative"} has just published an opportunity on Fractional Sales Partner that can help your business expand into new regions.`);
        break;

      case "obo_post_created":
        console.log(`Subject: ⚡ Urgent RFP: New Business Opportunity Posted by ${authorName || "Brand Owner"}`);
        console.log(`Body: Hello Sales Partner, A Business Owner has just posted a detailed requirement: "${postTitle || "Sales Requirement"}". Respond immediately to secure this engagement.`);
        break;

      case "post_liked":
        console.log(`Subject: 🚀 Your Post is Gaining Traction on Fractional Sales Partner`);
        console.log(`Body: Hello ${authorName || "Partner"}, ${actorName || "Someone"} liked your post "${postTitle || "Opportunity"}". Your post is reaching more business partners across the network.`);
        break;

      case "post_commented":
        console.log(`Subject: 💬 New Comment Received on Your Opportunity Post`);
        console.log(`Body: Hello ${authorName || "Partner"}, ${actorName || "A user"} commented: "${commentText || "Inquired"}" on your post "${postTitle || "Opportunity"}". Log in now to reply.`);
        break;

      case "expo_reengagement":
        console.log(`Subject: 🗓️ Visiting any Trade Expos this Quarter? Convert your trip into a gig!`);
        console.log(`Body: Hello ${authorName || "Sales Partner"}, It's been a while since we saw your activity! If you are attending any upcoming trade fairs or expos, drop a quick post to offer fractional representation to brands seeking global presence.`);
        break;

      default:
        console.log(`Generic notification dispatched for type: ${type}`);
    }
    console.log("--------------------------------------------------");

    return NextResponse.json({
      success: true,
      message: `Activity email for ${type} logged successfully`
    });
  } catch (err: any) {
    console.error("Error in post activity mailer route:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to dispatch activity email" },
      { status: 500 }
    );
  }
}
