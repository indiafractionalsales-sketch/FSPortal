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

export async function sendWelcomeEmail(toEmail: string, fullName: string, role: string): Promise<boolean> {
  const token = process.env.MAILTRAP_API_TOKEN;

  let roleTitle = "Member";
  let tagline = "Step into the future of fractional sales.";
  let messageContent = "";
  let bullets = "";

  if (role === "sp") {
    roleTitle = "Sales Partner";
    tagline = "Unlock high-performance sales opportunities.";
    messageContent = `You have successfully onboarded as a <strong>Sales Partner</strong>. Fractional Sales Partner is designed to connect you with elite brands seeking top-tier fractional sales expertise. Whether you specialize in cold outreach, enterprise sales, or lead generation, our platform is built to showcase your talent and help you scale your portfolio.`;
    bullets = `
      <li style="margin-bottom: 10px;"><strong>Browse Listings:</strong> Explore active sales opportunities posted by vetted brands.</li>
      <li style="margin-bottom: 10px;"><strong>Submit Pitches:</strong> Propose custom offers and structures that match your expertise.</li>
      <li style="margin-bottom: 10px;"><strong>Earn & Scale:</strong> Manage contract terms and commissions with transparency.</li>
    `;
  } else if (role === "obo") {
    roleTitle = "Business Owner";
    tagline = "Supercharge your sales with elite talent.";
    messageContent = `You have successfully onboarded as a <strong>Business Owner</strong>. Fractional Sales Partner gives you instant access to a global network of vetted, high-performance fractional sales partners. Post your growth objectives, receive competitive offers, and build a high-performance sales team tailored to your needs.`;
    bullets = `
      <li style="margin-bottom: 10px;"><strong>Post Opportunities:</strong> Create posts detailing your budget, market, and expectations.</li>
      <li style="margin-bottom: 10px;"><strong>Compare Offers:</strong> Review personalized proposals and portfolios from interested partners.</li>
      <li style="margin-bottom: 10px;"><strong>Secure Contracts:</strong> Confirm and manage sales deals through a performant deal ledger.</li>
    `;
  } else if (role === "tpsp") {
    roleTitle = "Third-Party Service Provider";
    tagline = "Connect with active sales operations.";
    messageContent = `You have successfully onboarded as a <strong>Third-Party Service Provider</strong>. Fractional Sales Partner connects you with active sales partners and businesses who require training, lead lists, tools, or other ancillary services to power their campaigns.`;
    bullets = `
      <li style="margin-bottom: 10px;"><strong>Offer Services:</strong> Advertise your tools and training directly to partners and brand owners.</li>
      <li style="margin-bottom: 10px;"><strong>Grow Reach:</strong> Expand your B2B clients within a high-growth environment.</li>
      <li style="margin-bottom: 10px;"><strong>Build Relationships:</strong> Form long-term partnerships with expanding sales teams.</li>
    `;
  }

  const subject = `Welcome to Fractional Sales Partner, ${fullName}!`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Fractional Sales Partner</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@700&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f6f9fc;">
        <tr>
          <td align="center" style="padding: 40px 10px 40px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #eef2f6;">
              
              <!-- Brand Header Banner -->
              <tr>
                <td style="background-color: #0d0e12; padding: 40px 40px 30px 40px; text-align: center; background-image: linear-gradient(135deg, #0d0e12 0%, #171821 100%);">
                  <h1 style="margin: 0; font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                    Fractional Sales <span style="color: #6366f1;">Partner</span>
                  </h1>
                  <p style="margin: 8px 0 0 0; font-size: 12px; text-transform: uppercase; tracking: 0.1em; color: #73b9f5; font-weight: 600; letter-spacing: 1.5px;">
                    Fractional Sales Portal
                  </p>
                </td>
              </tr>

              <!-- Relatable Banner Image -->
              <tr>
                <td style="padding: 0;">
                  <img src="https://fractionalsalespartner.com/hero-collage.png" alt="Fractional Sales Partner Platform" style="width: 100%; height: auto; display: block; border: 0;" onerror="this.src='https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&h=220&q=80';">
                </td>
              </tr>

              <!-- Main Content Body -->
              <tr>
                <td style="padding: 40px 40px 30px 40px;">
                  <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0d0e12; line-height: 1.3;">
                    Welcome aboard, ${fullName}!
                  </h2>
                  <p style="margin: 0 0 20px 0; font-size: 15px; color: #4b5563; line-height: 1.6; font-style: italic; font-weight: 600; color: #6366f1;">
                    "${tagline}"
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 15px; color: #374151; line-height: 1.6;">
                    ${messageContent}
                  </p>
                  
                  <!-- Role Specific Next Steps -->
                  <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px;">
                      Your Next Steps as a ${roleTitle}
                    </h3>
                    <ul style="margin: 0; padding: 0 0 0 20px; font-size: 14px; color: #334155; line-height: 1.6;">
                      ${bullets}
                    </ul>
                  </div>

                  <!-- Call to Action Button -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 10px 0 20px 0;">
                        <a href="https://fractionalsalespartner.com/home" target="_blank" style="background-color: #6366f1; color: #ffffff; display: inline-block; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 30px; border-radius: 6px; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.15); transition: background-color 0.2s ease;">
                          Access Portal Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Thank you note -->
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #4b5563; line-height: 1.6;">
                    Thank you for choosing Fractional Sales Partner. We are excited to have you as part of our professional ecosystem. If you ever have any questions or feedback, please reach out to us at <a href="mailto:sales@fractionalsalespartner.com" style="color: #6366f1; text-decoration: underline;">sales@fractionalsalespartner.com</a>.
                  </p>
                  <p style="margin: 15px 0 0 0; font-size: 14px; color: #4b5563; font-weight: 600;">
                    Best regards,<br>
                    <span style="color: #0d0e12;">The Fractional Sales Partner Team</span>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8;">
                    This is an automated notification from Fractional Sales Partner. All rights reserved.
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                    &copy; 2026 Biztribe Trading & Consultancy India Private Limited.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const textBody = `
Welcome to Fractional Sales Partner, ${fullName}!

Role: ${roleTitle}
"${tagline}"

${messageContent.replace(/<[^>]*>/g, '')}

Access your dashboard: https://fractionalsalespartner.com/home

If you have any questions, reach out to us at sales@fractionalsalespartner.com.

Best regards,
The Fractional Sales Partner Team
  `.trim();

  // If token is missing, run in mock mode
  if (!token) {
    console.log("📨 [MOCK EMAIL SENT - Welcome Email]");
    console.log(`To: ${toEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (Text): ${textBody}`);
    return true;
  }

  try {
    const response = await fetch("https://send.api.mailtrap.io/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        from: {
          email: "sales@fractionalsalespartner.com",
          name: "Fractional Sales Partner Platform"
        },
        to: [
          {
            email: toEmail
          }
        ],
        subject: subject,
        html: htmlBody,
        text: textBody
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mailtrap API responded with ${response.status}: ${errorText}`);
    }

    const resData = await response.json();
    console.log("✉️ Welcome Email sent successfully via Mailtrap API:", resData);
    return true;
  } catch (error) {
    console.error("❌ Failed to send welcome email via Mailtrap API:", error);
    return false;
  }
}

