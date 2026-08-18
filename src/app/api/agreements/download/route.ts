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

import { NextResponse } from 'next/server';
import { admin, adminDb } from '@/lib/firebase-admin';
import { generateServiceAgreementPDF } from '@/lib/pdf-generator';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id') || searchParams.get('ref') || searchParams.get('postId');

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order_id or ref parameter' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // 1. Try finding in Agreements collection first by SA_ prefix, raw orderId, or queries
    let agreementRecord: any = null;

    let agreementSnap = await adminDb.collection('Agreements').doc(`SA_${orderId}`).get();
    if (!agreementSnap.exists && orderId.startsWith('SA_')) {
      agreementSnap = await adminDb.collection('Agreements').doc(orderId).get();
    }

    if (agreementSnap.exists) {
      agreementRecord = agreementSnap.data();
    } else {
      // Query Agreements by agreementRef, rzpPaymentId, or rzpOrderId
      const agByRefSnap = await adminDb.collection('Agreements').where('agreementRef', '==', orderId).limit(1).get();
      if (!agByRefSnap.empty) {
        agreementRecord = agByRefSnap.docs[0].data();
      } else {
        const agByPostSnap = await adminDb.collection('Agreements').where('postId', '==', orderId).limit(1).get();
        if (!agByPostSnap.empty) {
          agreementRecord = agByPostSnap.docs[0].data();
        } else {
          // 2. Query Deals by doc ID or postId
          const cleanDealId = orderId.startsWith('deal_') ? orderId : `deal_${orderId}`;
          const dealSnap = await adminDb.collection('Deals').doc(cleanDealId).get();
          if (dealSnap.exists) {
            agreementRecord = dealSnap.data();
          } else {
            const rawDealSnap = await adminDb.collection('Deals').doc(orderId).get();
            if (rawDealSnap.exists) {
              agreementRecord = rawDealSnap.data();
            } else {
              // 3. Query Posts by doc ID or paymentOrderId
              const postSnap = await adminDb.collection('Posts').doc(orderId).get();
              if (postSnap.exists) {
                agreementRecord = postSnap.docs[0].data();
              } else {
                const postByOrderSnap = await adminDb.collection('Posts').where('paymentOrderId', '==', orderId).limit(1).get();
                if (!postByOrderSnap.empty) {
                  agreementRecord = postByOrderSnap.docs[0].data();
                }
              }
            }
          }
        }
      }
    }

    // Extract details
    const agreementRef = agreementRecord?.agreementRef || `FSP-SA-${orderId.slice(-8).toUpperCase()}`;
    const companyName = agreementRecord?.buyerCompanyName || agreementRecord?.companyName || "";
    const clientName = agreementRecord?.buyerPersonName || agreementRecord?.clientName || "Business Owner";
    const clientEmail = agreementRecord?.buyerEmail || agreementRecord?.clientEmail || "client@fractionalsalespartner.com";
    const spName = agreementRecord?.spName || "Sales Partner";
    const spEmail = agreementRecord?.spEmail || "partner@fractionalsalespartner.com";
    const packageName = agreementRecord?.packageName || agreementRecord?.title || "Sales Package Engagement";
    const totalAmount = Number(agreementRecord?.totalAmount || agreementRecord?.amount || 0);
    const currency = agreementRecord?.currency || "INR";
    const lineItems = agreementRecord?.lineItems || [{ description: packageName, cost: totalAmount }];
    const eventName = agreementRecord?.eventName || packageName;
    const paymentTxnId = agreementRecord?.rzpPaymentId || agreementRecord?.paymentTxnId || orderId;

    const pdfBuffer = await generateServiceAgreementPDF({
      agreementRef,
      date: agreementRecord?.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      companyName,
      clientName,
      clientEmail,
      spName,
      spEmail,
      packageName,
      totalAmount,
      currency,
      lineItems,
      eventName,
      paymentTxnId,
      paymentTimestamp: agreementRecord?.createdAt || new Date().toISOString(),
    });

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Service_Agreement_${agreementRef}.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Error serving Service Agreement PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF document' }, { status: 500 });
  }
}
