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

import { admin, adminDb } from '../src/lib/firebase-admin';

export async function promoteUserToAdmin(uid: string) {
  if (!adminDb) {
    console.error('Database not initialized.');
    return;
  }

  try {
    // 1. Verify user exists in Auth
    const userRecord = await admin.auth().getUser(uid);
    console.log(`Found Auth User: ${userRecord.email} (UID: ${userRecord.uid})`);

    // 2. Set Custom User Claims
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Auth custom claims successfully set to { admin: true } for UID: ${uid}`);

    // 3. Update Firestore Document
    const userDocRef = adminDb.collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (userDoc.exists) {
      await userDocRef.update({ isAdmin: true });
      console.log(`Firestore document users/${uid} successfully updated with isAdmin: true`);
    } else {
      // Create user doc if it doesn't exist (e.g., if they only exist in Auth)
      await userDocRef.set({
        uid,
        email: userRecord.email,
        role: 'sp', // Default fallback role
        isAdmin: true,
        createdAt: new Date().toISOString()
      }, { merge: true });
      console.log(`Firestore document users/${uid} did not exist. Created a new doc with isAdmin: true`);
    }

    console.log(`User promotion complete! User will need to refresh/re-auth their token to apply the admin claim.`);
  } catch (err: any) {
    console.error('Failed to promote user to admin:', err.message || err);
  }
}

// Run the script directly if invoked from node/tsx
if (require.main === module) {
  const targetUid = process.argv[2];
  if (!targetUid) {
    console.error('Please specify a target user UID. Usage: npx tsx scripts/set-admin.ts <uid>');
    process.exit(1);
  }
  promoteUserToAdmin(targetUid).then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
