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

import { adminDb } from '../src/lib/firebase-admin';

async function testFetch() {
  if (!adminDb) {
    console.error("adminDb not initialized");
    return;
  }

  try {
    const snapshot = await adminDb.collection('Pricing_Configs').get();
    console.log("Found Pricing_Configs documents count:", snapshot.size);
    snapshot.forEach(doc => {
      console.log(`Document ID: ${doc.id}, data:`, doc.data());
    });
  } catch (err) {
    console.error("Error fetching configs:", err);
  }
}

testFetch();
