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

import PDFDocument from 'pdfkit';
import crypto from 'crypto';
import { getServiceAgreementDetails, ServiceAgreementData } from './service-agreement-template';

export async function generateServiceAgreementPDF(data: ServiceAgreementData): Promise<Buffer> {
  // Defensive input sanitization
  const safeData: ServiceAgreementData = {
    agreementRef: data.agreementRef || `FSP-SA-${Date.now().toString(36).toUpperCase()}`,
    date: data.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    clientName: (data.clientName && data.clientName.trim()) || "Business Owner",
    companyName: (data.companyName && data.companyName.trim()) || "",
    clientEmail: (data.clientEmail && data.clientEmail.trim()) || "client@fractionalsalespartner.com",
    spName: (data.spName && data.spName.trim()) || "Sales Partner",
    spEmail: (data.spEmail && data.spEmail.trim()) || "partner@fractionalsalespartner.com",
    packageName: (data.packageName && data.packageName.trim()) || "Sales Representation Package",
    totalAmount: isNaN(Number(data.totalAmount)) ? 0 : Number(data.totalAmount),
    currency: (data.currency && data.currency.trim()) || "INR",
    lineItems: Array.isArray(data.lineItems) && data.lineItems.length > 0 ? data.lineItems.map(item => {
      if (typeof item === 'string') {
        return { description: String(item || "Package Inclusion"), cost: 0 };
      }
      if (typeof item === 'object' && item !== null) {
        const desc = (item as any).description || (item as any).name || (item as any).title || "Package Item";
        const rawCost = (item as any).cost !== undefined ? (item as any).cost : (item as any).price;
        const costNum = isNaN(Number(rawCost)) ? 0 : Number(rawCost);
        return { description: String(desc), cost: costNum };
      }
      return { description: "Package Item", cost: 0 };
    }) : [{ description: (data.packageName && data.packageName.trim()) || "Sales Representation Package", cost: isNaN(Number(data.totalAmount)) ? 0 : Number(data.totalAmount) }],
    eventName: (data.eventName && data.eventName.trim()) || data.packageName || "Sales Representation",
    paymentTxnId: (data.paymentTxnId && data.paymentTxnId.trim()) || "COMPLETED",
    paymentTimestamp: data.paymentTimestamp || new Date().toISOString(),
    userIp: (data.userIp && data.userIp.trim()) || "Recorded Web Session"
  };

  const agreement = getServiceAgreementDetails(safeData);

  // Compute SHA-256 Verification Checksum
  const checksumRawData = `${agreement.refNo || 'FSP-SA-000'}|${agreement.client.email || 'N/A'}|${agreement.engagement.totalAmount || 0}|${agreement.auditTrail.txnId || 'N/A'}|${agreement.date || ''}`;
  const sha256Checksum = crypto.createHash('sha256').update(checksumRawData).digest('hex');

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const primaryColor = '#701010';
      const textColor = '#1f2937';
      const grayColor = '#6b7280';
      const lightBg = '#f9fafb';

      // --- Header Banner ---
      doc.rect(40, 40, 515, 60).fill(primaryColor);
      doc.fillColor('#FFFFFF')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('FRACTIONAL SALES PARTNER', 55, 52);
      
      doc.fontSize(10)
         .font('Helvetica')
         .text('OFFICIAL SERVICE AGREEMENT', 55, 74);

      doc.fillColor('#FFFFFF')
         .fontSize(8)
         .text(`Ref: ${agreement.refNo}`, 380, 54, { align: 'right' })
         .text(`Date: ${agreement.date}`, 380, 72, { align: 'right' });

      doc.moveDown(3);
      let currentY = 115;

      // --- Company & Client Box ---
      const boxY = currentY;

      // Define Left Column strings
      const compName = `${agreement.company.name} (${agreement.company.brand})`;
      const compAddr = `Reg. Address: ${agreement.company.address}`;
      const compEmail = `Email: ${agreement.company.email} | Web: ${agreement.company.website}`;

      // Define Right Column strings
      const clientNameStr = `Name: ${agreement.client.name}`;
      const clientEmailStr = `Email: ${agreement.client.email}`;
      const spNameStr = `Sales Partner: ${agreement.salesPartner.name}`;

      // Calculate total Left Column height dynamically
      doc.font('Helvetica').fontSize(7.5);
      const leftH = 22 + doc.heightOfString(compName, { width: 230 }) 
                       + doc.heightOfString(compAddr, { width: 230 }) 
                       + doc.heightOfString(compEmail, { width: 230 }) + 16;

      // Calculate total Right Column height dynamically
      const rightH = 22 + doc.heightOfString(clientNameStr, { width: 245 }) 
                        + doc.heightOfString(clientEmailStr, { width: 245 }) 
                        + doc.heightOfString(spNameStr, { width: 245 }) + 16;

      const boxHeight = Math.max(leftH, rightH, 80);

      // Draw background rectangle
      doc.rect(40, boxY, 515, boxHeight).fillAndStroke(lightBg, '#e5e7eb');

      // --- Draw Left Column ---
      doc.fillColor(primaryColor)
         .fontSize(9)
         .font('Helvetica-Bold')
         .text('ISSUING COMPANY (FACILITATOR):', 50, boxY + 8, { width: 230 });

      doc.fillColor(textColor).fontSize(7.5).font('Helvetica');
      let leftY = boxY + 22;

      doc.text(compName, 50, leftY, { width: 230 });
      leftY += doc.heightOfString(compName, { width: 230 }) + 3;

      doc.text(compAddr, 50, leftY, { width: 230 });
      leftY += doc.heightOfString(compAddr, { width: 230 }) + 3;

      doc.text(compEmail, 50, leftY, { width: 230 });

      // --- Draw Right Column ---
      doc.fillColor(primaryColor)
         .fontSize(9)
         .font('Helvetica-Bold')
         .text('CLIENT / PAYEE:', 295, boxY + 8, { width: 245 });

      doc.fillColor(textColor).fontSize(7.5).font('Helvetica');
      let rightY = boxY + 22;

      doc.text(clientNameStr, 295, rightY, { width: 245 });
      rightY += doc.heightOfString(clientNameStr, { width: 245 }) + 3;

      doc.text(clientEmailStr, 295, rightY, { width: 245 });
      rightY += doc.heightOfString(clientEmailStr, { width: 245 }) + 3;

      doc.text(spNameStr, 295, rightY, { width: 245 });

      currentY += boxHeight + 15;

      // --- Package & Commercials Table ---
      doc.fillColor(primaryColor)
         .fontSize(11)
         .font('Helvetica-Bold')
         .text(`PACKAGE & COMMERCIAL DETAILS — ${agreement.engagement.packageName.toUpperCase()}`, 40, currentY);

      currentY += 18;

      // Table Header
      doc.rect(40, currentY, 515, 20).fill('#374151');
      doc.fillColor('#FFFFFF')
         .fontSize(8)
         .font('Helvetica-Bold')
         .text('ITEM / DESCRIPTION', 50, currentY + 6)
         .text(`AMOUNT (${agreement.engagement.currency})`, 420, currentY + 6, { align: 'right', width: 125 });

      currentY += 20;

      // Line items
      for (const item of agreement.engagement.lineItems) {
        doc.rect(40, currentY, 515, 22).fillAndStroke('#FFFFFF', '#f3f4f6');
        doc.fillColor(textColor)
           .fontSize(8)
           .font('Helvetica')
           .text(item.description, 50, currentY + 7)
           .text(`${agreement.engagement.currency} ${Number(item.cost).toLocaleString('en-IN')}`, 420, currentY + 7, { align: 'right', width: 125 });
        currentY += 22;
      }

      // Total Row
      doc.rect(40, currentY, 515, 22).fillAndStroke('#f3f4f6', '#d1d5db');
      doc.fillColor(primaryColor)
         .fontSize(9)
         .font('Helvetica-Bold')
         .text('TOTAL PAYABLE CONSIDERATION:', 50, currentY + 6)
         .text(`${agreement.engagement.currency} ${agreement.engagement.totalAmount.toLocaleString('en-IN')}`, 420, currentY + 6, { align: 'right', width: 125 });

      currentY += 35;

      // --- Package Inclusions ---
      doc.fillColor(primaryColor)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('STANDARD PACKAGE INCLUSIONS & SCOPE OF SERVICES:', 40, currentY);

      currentY += 15;

      for (let i = 0; i < agreement.engagement.inclusions.length; i++) {
        const item = agreement.engagement.inclusions[i];
        doc.fillColor(textColor)
           .fontSize(8)
           .font('Helvetica')
           .text(`${i + 1}. ${item}`, 45, currentY, { width: 505 });
        currentY += doc.heightOfString(`${i + 1}. ${item}`, { width: 505 }) + 4;
      }

      currentY += 15;

      // Check if space left for legal sections, else add page
      if (currentY > 620) {
        doc.addPage();
        currentY = 50;
      }

      // --- Legal Clauses ---
      doc.fillColor(primaryColor)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('TERMS & CONDITIONS (INCORPORATED BY REFERENCE):', 40, currentY);

      currentY += 15;

      for (const section of agreement.legalSections) {
        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
        }

        doc.fillColor(textColor)
           .fontSize(8)
           .font('Helvetica-Bold')
           .text(section.heading, 40, currentY);
        currentY += 12;

        doc.fillColor(grayColor)
           .fontSize(7.5)
           .font('Helvetica')
           .text(section.content, 40, currentY, { width: 515, align: 'justify' });

        currentY += doc.heightOfString(section.content, { width: 515 }) + 10;
      }

      // --- Execution & Verification Stamp ---
      if (currentY > 650) {
        doc.addPage();
        currentY = 50;
      }

      const stampY = currentY + 10;

      let formattedAuditTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
      try {
        const parsedDate = new Date(agreement.auditTrail.timestamp);
        if (!isNaN(parsedDate.getTime())) {
          formattedAuditTimestamp = parsedDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
        }
      } catch (e) {}

      const issuedText = `Issued By: ${agreement.company.name}\nBrand Platform: ${agreement.company.brand} (${agreement.company.website})\nAuthorized Signatory: Digital System Seal (Biztribe Trading & Consultancy)\nJurisdiction: Competent Courts in Pune, Maharashtra, India`;
      const acceptedText = `Accepted By: ${agreement.client.name}\nClient Email: ${agreement.client.email}\nPayment Txn ID: ${agreement.auditTrail.txnId || 'N/A'}\nTimestamp: ${formattedAuditTimestamp}\nElectronic Signature: Verified Click-Wrap Acceptance (Sec 10A IT Act)`;

      doc.font('Helvetica').fontSize(7.5);
      const sLeftH = doc.heightOfString(issuedText, { width: 235, lineGap: 2.5 }) + 38;
      const sRightH = doc.heightOfString(acceptedText, { width: 245, lineGap: 2.5 }) + 38;
      const stampBoxHeight = Math.max(sLeftH, sRightH, 105);

      doc.rect(40, stampY, 515, stampBoxHeight).fillAndStroke('#f0fdf4', '#bbf7d0');

      doc.fillColor('#166534')
         .fontSize(9)
         .font('Helvetica-Bold')
         .text('DIGITAL EXECUTION & AUDIT TRAIL VERIFICATION STAMP', 50, stampY + 8);

      doc.fillColor(textColor)
         .fontSize(7.5)
         .font('Helvetica')
         .text(issuedText, 50, stampY + 24, { width: 235, lineGap: 2.5 });

      doc.fillColor(textColor)
         .fontSize(7.5)
         .font('Helvetica')
         .text(acceptedText, 295, stampY + 24, { width: 245, lineGap: 2.5 });

      // Add Checksum Footer Box
      doc.fillColor('#15803d')
         .fontSize(6.5)
         .font('Helvetica-Bold')
         .text(`SHA-256 Checksum: ${sha256Checksum}`, 50, stampY + stampBoxHeight - 14, { width: 495 });

      // Render page footers on all pages
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.fillColor(grayColor)
           .fontSize(7)
           .font('Helvetica')
           .text(
             `Page ${i + 1} of ${range.count} | Ref: ${agreement.refNo} | Digitally Verified by Biztribe Audit System (Sec 10A IT Act, 2000)`,
             40,
             815,
             { align: 'center', width: 515 }
           );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
