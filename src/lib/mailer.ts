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

import nodemailer from "nodemailer";

// Creates the transporter dynamically based on env config
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || host === "smtp.yourprovider.com" || !user || !pass) {
    console.warn("⚠️ SMTP Credentials are not fully configured in environment variables. Mailer will run in MOCK mode.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports (587, etc.)
    auth: {
      user,
      pass,
    },
  });
};

interface DealEmailDetails {
  oboBrandName: string;
  oboEmail: string;
  postTitle: string;
  budgetRange: string;
  spName: string;
  spEmail: string;
  offerAmount: number;
  offerCurrency: string;
  spMessage?: string;
  postId: string;
  offerId: string;
}

export async function sendDealFinalizationEmail(details: DealEmailDetails): Promise<boolean> {
  const {
    oboBrandName,
    oboEmail,
    postTitle,
    budgetRange,
    spName,
    spEmail,
    offerAmount,
    offerCurrency,
    spMessage,
    postId,
    offerId,
  } = details;

  const subject = `🤝 Deal Finalized — ${oboBrandName} accepted ${spName}'s offer`;

  const textBody = `
─────────────────────────────────────────
  DEAL FINALIZATION NOTICE
─────────────────────────────────────────

Business Owner
  Brand:   ${oboBrandName} (${oboEmail})
  Post:    "${postTitle}"
  Budget:  ${budgetRange}

Accepted Offer
  Partner: ${spName} (${spEmail})
  Amount:  ${offerCurrency} ${offerAmount.toLocaleString()}
  Message: "${spMessage || "No message provided."}"

Timeline
  Accepted: ${new Date().toUTCString()}

Reference IDs
  Post ID:  ${postId}
  Offer ID: ${offerId}

─────────────────────────────────────────
Please follow up with both parties to
arrange payment and onboarding.
─────────────────────────────────────────
`;

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e6; rounded-card: 8px;">
      <h2 style="color: #701010; border-bottom: 2px solid #701010; padding-bottom: 10px; margin-top: 0;">🤝 Deal Finalized</h2>
      <p style="font-size: 15px; color: #333; line-height: 1.5;">
        A deal has been finalized on the <strong>ScaleFraction</strong> platform. Here are the details of the agreement:
      </p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <th colspan="2" style="text-align: left; padding: 8px; border-bottom: 1px solid #dee2e6; color: #701010; font-size: 14px; text-transform: uppercase;">Business Owner / Brand</th>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; width: 30%; font-size: 13px;">Brand Name:</td>
          <td style="padding: 8px; font-size: 13px;">${oboBrandName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Email:</td>
          <td style="padding: 8px; font-size: 13px;"><a href="mailto:${oboEmail}">${oboEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Post Title:</td>
          <td style="padding: 8px; font-size: 13px;">${postTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Budget Range:</td>
          <td style="padding: 8px; font-size: 13px;">${budgetRange}</td>
        </tr>
        
        <tr style="background-color: #f8f9fa;">
          <th colspan="2" style="text-align: left; padding: 8px; border-bottom: 1px solid #dee2e6; color: #701010; font-size: 14px; text-transform: uppercase; margin-top: 15px;">Accepted Sales Partner</th>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Name:</td>
          <td style="padding: 8px; font-size: 13px;">${spName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Email:</td>
          <td style="padding: 8px; font-size: 13px;"><a href="mailto:${spEmail}">${spEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; font-size: 13px;">Finalized Amount:</td>
          <td style="padding: 8px; font-weight: bold; color: #701010; font-size: 13px;">${offerCurrency} ${offerAmount.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; font-size: 13px; vertical-align: top;">Partner's Pitch:</td>
          <td style="padding: 8px; font-size: 13px; font-style: italic; color: #555;">"${spMessage || "No message provided."}"</td>
        </tr>
      </table>

      <div style="background-color: #fff9e6; border: 1px solid #ffeeba; color: #856404; padding: 12px; border-radius: 4px; font-size: 12px; margin-top: 20px;">
        <strong>Next Step:</strong> Please reach out to both parties directly to coordinate terms of payment, commission escrow structures, and kickoff onboarding processes.
      </div>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #dee2e6; font-size: 11px; color: #777; text-align: center;">
        <p>Post Ref ID: <code>${postId}</code> | Offer Ref ID: <code>${offerId}</code></p>
        <p>This is an automated notification from ScaleFraction. All rights reserved.</p>
      </div>
    </div>
  `;

  const transporter = getTransporter();

  if (!transporter) {
    console.log("📨 [MOCK EMAIL SENT]");
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${textBody}`);
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: `"ScaleFraction Platform" <${process.env.SMTP_USER}>`,
      to: "sales@fractionalsalespartner.com",
      cc: "hrishikesh.pangarkar@gmail.com",
      subject,
      text: textBody,
      html: htmlBody,
    });

    console.log("✉️ Real Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Failed to send deal finalization email:", error);
    // Return true anyway because the database state has been successfully updated and we don't want to crash/fail the UI transaction
    return false;
  }
}
