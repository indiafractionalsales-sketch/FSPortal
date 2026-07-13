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

export type UserRegion = 'IN' | 'US' | 'GB' | 'EU' | 'SEA' | 'ME';
export type FeatureName = 'cardScans' | 'aiSearch' | 'reports';

export interface CommissionSlab {
  limit: number;
  rate: number;
}

export interface UserBilling {
  planId: 'starter' | 'growth' | 'professional' | 'enterprise' | 'custom';
  planName: string;
  region: UserRegion;
  currency: string;
  validUntil: string | null;
  billingCycle: 'monthly' | 'yearly' | 'free';
  status: 'active' | 'past_due' | 'expired' | 'free';
  quotas: {
    cardScans: {
      limit: number;
      usedThisMonth: number;
      maxStored: number;
    };
    aiSearch: {
      limit: number;
      usedThisMonth: number;
      creditType: 'metered' | 'unlimited';
      creditsRemaining: number;
    };
    reports: {
      limit: number;
      usedThisMonth: number;
    };
  };
}

// Map profile country value to standard pricing region
export function getRegionFromCountry(countryName?: string): UserRegion {
  if (!countryName) return 'US';
  const normalized = countryName.trim().toLowerCase();
  
  if (['india', 'in', 'ind'].includes(normalized)) return 'IN';
  
  if (['united kingdom', 'uk', 'gb', 'england', 'scotland', 'wales', 'london', 'great britain'].includes(normalized)) return 'GB';
  
  if (['germany', 'france', 'italy', 'spain', 'netherlands', 'belgium', 'ireland', 'europe', 'eu', 'switzerland', 'austria', 'sweden', 'norway', 'denmark'].includes(normalized)) return 'EU';
  
  if (['singapore', 'malaysia', 'thailand', 'vietnam', 'philippines', 'indonesia', 'sg', 'my'].includes(normalized)) return 'SEA';
  
  if (['united arab emirates', 'uae', 'saudi arabia', 'qatar', 'kuwait', 'bahrain', 'oman', 'dubai', 'me'].includes(normalized)) return 'ME';
  
  return 'US';
}

// Get regional currency details
export function getCurrencyForRegion(region: UserRegion): { currency: string; symbol: string } {
  switch (region) {
    case 'IN': return { currency: 'INR', symbol: '₹' };
    case 'GB': return { currency: 'GBP', symbol: '£' };
    case 'EU': return { currency: 'EUR', symbol: '€' };
    case 'SEA': return { currency: 'SGD', symbol: 'S$' };
    case 'ME': return { currency: 'AED', symbol: 'د.إ' };
    default: return { currency: 'USD', symbol: '$' };
  }
}

// Calculate progressive commission using slab brackets (income tax model)
export function calculateProgressiveCommission(cost: number, slabs: CommissionSlab[]): number {
  if (cost <= 0) return 0;
  let remaining = cost;
  let totalCommission = 0;
  let previousLimit = 0;

  for (const slab of slabs) {
    const slabRange = slab.limit - previousLimit;
    if (slabRange <= 0) continue;
    const taxableInSlab = Math.min(remaining, slabRange);

    totalCommission += taxableInSlab * slab.rate;
    remaining -= taxableInSlab;
    previousLimit = slab.limit;

    if (remaining <= 0) break;
  }

  return Math.round((totalCommission + Number.EPSILON) * 100) / 100;
}

// Default Starter Plan settings to initialize new or legacy profiles
export function getDefaultStarterPlan(region: UserRegion): UserBilling {
  const { currency } = getCurrencyForRegion(region);
  return {
    planId: 'starter',
    planName: 'Starter (Free)',
    region,
    currency,
    validUntil: null,
    billingCycle: 'free',
    status: 'free',
    quotas: {
      cardScans: {
        limit: 5,
        usedThisMonth: 0,
        maxStored: 20
      },
      aiSearch: {
        limit: 0,
        usedThisMonth: 0,
        creditType: 'metered',
        creditsRemaining: 0
      },
      reports: {
        limit: 0,
        usedThisMonth: 0
      }
    }
  };
}
