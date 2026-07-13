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

import { admin, adminDb, getDbForId } from '@/lib/firebase-admin';
import {
  UserRegion,
  FeatureName,
  CommissionSlab,
  UserBilling,
  getRegionFromCountry,
  getCurrencyForRegion,
  calculateProgressiveCommission,
  getDefaultStarterPlan
} from '@/lib/billing-utils';

export type { UserRegion, FeatureName, CommissionSlab, UserBilling };
export { getRegionFromCountry, getCurrencyForRegion, calculateProgressiveCommission, getDefaultStarterPlan };

// Fetch user country from regional user DB and profile depending on their role
async function getUserCountryFromDb(uid: string, role: string, dbId: string): Promise<string> {
  try {
    const db = getDbForId(dbId);
    if (!db) return '';
    let profileSnap;
    if (role === 'sp') {
      profileSnap = await db.collection('SP_Profile').doc(uid).get();
    } else if (role === 'obo') {
      profileSnap = await db.collection('OBO_Profile').doc(uid).get();
    } else if (role === 'tpsp') {
      profileSnap = await db.collection('TPSP_Profile').doc(uid).get();
    }

    if (profileSnap?.exists) {
      const data = profileSnap.data() || {};
      return data.country || '';
    }
  } catch (err) {
    console.error(`Error resolving country for user ${uid}:`, err);
  }
  return '';
}

// Check and consume quota for a feature inside a transaction
export async function checkAndConsumeQuota(
  uid: string,
  feature: FeatureName,
  quantity: number = 1
): Promise<{ allowed: boolean; error?: 'subscription_expired' | 'quota_exceeded' | 'db_error' | 'user_not_found'; billing?: UserBilling }> {
  const db = adminDb;
  if (!db) return { allowed: false, error: 'db_error' };

  try {
    const result = await db.runTransaction(async (transaction) => {
      const userRef = db.collection('users').doc(uid);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        return { allowed: false, error: 'user_not_found' as const };
      }

      const userData = userDoc.data() || {};
      let billing = userData.billing as UserBilling | undefined;

      // 1. Initialize legacy user billing structure if absent
      if (!billing) {
        const role = userData.role || 'sp';
        const dbId = userData.databaseId || 'default';
        const country = await getUserCountryFromDb(uid, role, dbId);
        const region = getRegionFromCountry(country);
        billing = getDefaultStarterPlan(region);
        transaction.update(userRef, { billing });
      }

      // 2. Verify subscription expiry
      if (billing.validUntil) {
        const expiryDate = new Date(billing.validUntil).getTime();
        const now = Date.now();
        
        if (now > expiryDate) {
          const gracePeriodMs = 3 * 24 * 60 * 60 * 1000; // 3-day grace period
          if (now > expiryDate + gracePeriodMs) {
            if (billing.status !== 'expired') {
              billing.status = 'expired';
              transaction.update(userRef, { 'billing.status': 'expired' });
            }
            return { allowed: false, error: 'subscription_expired' as const, billing };
          } else {
            if (billing.status !== 'past_due') {
              billing.status = 'past_due';
              transaction.update(userRef, { 'billing.status': 'past_due' });
            }
          }
        } else if (billing.status === 'past_due' || billing.status === 'expired') {
          billing.status = 'active';
          transaction.update(userRef, { 'billing.status': 'active' });
        }
      }

      // 3. Quota validations
      if (feature === 'cardScans') {
        const limit = billing.quotas.cardScans.limit;
        const used = billing.quotas.cardScans.usedThisMonth;
        
        if (limit !== -1 && used + quantity > limit) {
          return { allowed: false, error: 'quota_exceeded' as const, billing };
        }
        
        // Consume quota
        const newUsed = used + quantity;
        transaction.update(userRef, { 'billing.quotas.cardScans.usedThisMonth': newUsed });
        billing.quotas.cardScans.usedThisMonth = newUsed;

      } else if (feature === 'aiSearch') {
        const limit = billing.quotas.aiSearch.limit;
        const used = billing.quotas.aiSearch.usedThisMonth;
        const remainingCredits = billing.quotas.aiSearch.creditsRemaining;

        if (limit !== -1 && used + quantity > limit) {
          // Check metered top-ups
          if (remainingCredits >= quantity) {
            const newCredits = remainingCredits - quantity;
            transaction.update(userRef, { 'billing.quotas.aiSearch.creditsRemaining': newCredits });
            billing.quotas.aiSearch.creditsRemaining = newCredits;
          } else {
            return { allowed: false, error: 'quota_exceeded' as const, billing };
          }
        } else {
          // Consume standard plan quota
          const newUsed = used + quantity;
          transaction.update(userRef, { 'billing.quotas.aiSearch.usedThisMonth': newUsed });
          billing.quotas.aiSearch.usedThisMonth = newUsed;
        }

      } else if (feature === 'reports') {
        const limit = billing.quotas.reports.limit;
        const used = billing.quotas.reports.usedThisMonth;

        if (limit !== -1 && used + quantity > limit) {
          return { allowed: false, error: 'quota_exceeded' as const, billing };
        }

        const newUsed = used + quantity;
        transaction.update(userRef, { 'billing.quotas.reports.usedThisMonth': newUsed });
        billing.quotas.reports.usedThisMonth = newUsed;
      }

      return { allowed: true, billing };
    });

    return result;
  } catch (error) {
    console.error(`Transaction failed for quota check on user ${uid}:`, error);
    return { allowed: false, error: 'db_error' };
  }
}
