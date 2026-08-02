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

import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<any> | null = null;

/**
 * Asynchronously loads FingerprintJS agent and returns the persistent visitorId.
 * Caches the load promise so initialization runs only once per session.
 */
export async function getVisitorId(): Promise<string> {
  if (typeof window === 'undefined') {
    return 'server_side';
  }

  try {
    if (!fpPromise) {
      fpPromise = FingerprintJS.load();
    }
    const fp = await fpPromise;
    const result = await fp.get();
    return result.visitorId || 'unknown_visitor';
  } catch (error) {
    console.warn('[Security] Failed to generate device fingerprint:', error);
    return 'fallback_visitor';
  }
}
