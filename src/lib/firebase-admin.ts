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

import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize the Firebase Admin SDK if it hasn't been initialized already
if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    
    if (serviceAccountJson) {
      // Parse the JSON string from the environment variable
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin SDK initialized successfully with service account.');
    } else {
      // Fallback to Application Default Credentials for Cloud environments (like App Hosting)
      admin.initializeApp();
      console.log('Firebase Admin SDK initialized successfully with ADC.');
    }
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
  }
}

// Export the initialized firestore database instance targeting 'default' explicitly
const adminDb = admin.apps.length ? getFirestore(admin.app(), 'default') : null;

// Get a Firestore instance for a specific database ID
export function getDbForId(databaseId: string) {
  if (!admin.apps.length) return null;
  return getFirestore(admin.app(), databaseId || 'default');
}

// Helper to look up a user's configured database ID from 'default' DB users collection
export async function getUserDatabaseId(uid: string): Promise<string> {
  if (!adminDb) return 'default';
  try {
    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (userDoc.exists) {
      return userDoc.data()?.databaseId || 'default';
    }
  } catch (err) {
    console.error(`Error fetching database ID for user ${uid}:`, err);
  }
  return 'default';
}

export { adminDb, admin };

