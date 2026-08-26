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
import { getSPServiceAgreementDetails, SPServiceAgreementData } from './sp-service-agreement-template';

export async function generateSPServiceAgreementPDF(data: SPServiceAgreementData): Promise<Buffer> {
  const agreement = getSPServiceAgreementDetails(data);

  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Header Banner
      doc.rect(0, 0, doc.page.width, 60).fill('#701010');
      doc.fillColor('#FFFFFF')
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('SALES PARTNER REPRESENTATION AGREEMENT', 40, 20);
      doc.fontSize(9)
         .font('Helvetica')
         .text(`Ref: ${agreement.refNo} | Date: ${agreement.createdDate}`, 40, 40);

      doc.moveDown(3);

      // Entity Summary Box
      doc.fillColor('#111827')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('AGREEMENT PARTICULARS', 40, 80);
      doc.fontSize(9)
         .font('Helvetica')
         .text(`Platform Company: ${agreement.company.name}`)
         .text(`Brand: ${agreement.company.brand}`)
         .text(`Registered Partner: ${agreement.partner.name} (${agreement.partner.email})`)
         .text(`Event Name: ${agreement.event.name}`)
         .text(`Venue / Location: ${agreement.event.venue}, ${agreement.event.location}`);

      doc.moveDown(1.5);

      // Legal Terms Heading
      doc.fillColor('#701010')
         .fontSize(11)
         .font('Helvetica-Bold')
         .text('TERMS AND CONDITIONS (EXECUTED UNDER IT ACT 2000 SECTION 10A)');
      doc.moveDown(0.5);

      // Render All 19 Legal Clauses
      agreement.legalSections.forEach((section) => {
        if (doc.y > doc.page.height - 80) {
          doc.addPage();
        }
        doc.fillColor('#111827')
           .fontSize(9)
           .font('Helvetica-Bold')
           .text(section.heading);
        doc.fillColor('#374151')
           .fontSize(8)
           .font('Helvetica')
           .text(section.content, { align: 'justify' });
        doc.moveDown(0.8);
      });

      // Digital Execution Footer
      const checksum = crypto.createHash('sha256').update(`${agreement.refNo}-${data.spName}`).digest('hex').slice(0, 24);
      doc.moveDown(1);
      doc.rect(40, doc.y, doc.page.width - 80, 45).fillAndStroke('#F9FAFB', '#E5E7EB');
      doc.fillColor('#065F46')
         .fontSize(8)
         .font('Helvetica-Bold')
         .text('ELECTRONIC CONTRACT VERIFICATION AUDIT TRAIL', 50, doc.y - 38);
      doc.fillColor('#1F2937')
         .fontSize(7)
         .font('Helvetica')
         .text(`Signed by Sales Partner: ${agreement.partner.name} | Ref: ${agreement.refNo}`)
         .text(`Digital Verification Checksum: SHA256-${checksum.toUpperCase()}`);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
