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

const regionsData = [
  {
    id: 'IN',
    regionName: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    plans: {
      starter: {
        planName: 'Starter (Free)',
        costMonth: 0,
        costYear: 0,
        quotas: { cardScansLimit: 5, maxCardsStored: 20, reportsLimit: 0, aiSearchLimit: 0 }
      },
      growth: {
        planName: 'Growth (Silver)',
        costMonth: 59,
        costYear: 639,
        quotas: { cardScansLimit: 30, maxCardsStored: 250, reportsLimit: 1, aiSearchLimit: 0 }
      },
      professional: {
        planName: 'Professional (Gold)',
        costMonth: 108,
        costYear: 1296,
        quotas: { cardScansLimit: 59, maxCardsStored: 600, reportsLimit: -1, aiSearchLimit: 1 }
      },
      enterprise: {
        planName: 'Enterprise (Platinum)',
        costMonth: 369,
        costYear: 3501,
        quotas: { cardScansLimit: -1, maxCardsStored: 5000, reportsLimit: -1, aiSearchLimit: 100 }
      }
    },
    topups: {
      aiSearch: { quantity: 99, cost: 49 }
    },
    commissionSlabs: [
      { limit: 5000, rate: 0.10 },
      { limit: 15999, rate: 0.20 },
      { limit: 999999999, rate: 0.25 }
    ]
  },
  {
    id: 'US',
    regionName: 'Americas & Global',
    currency: 'USD',
    currencySymbol: '$',
    plans: {
      starter: {
        planName: 'Starter (Free)',
        costMonth: 0,
        costYear: 0,
        quotas: { cardScansLimit: 5, maxCardsStored: 20, reportsLimit: 0, aiSearchLimit: 0 }
      },
      growth: {
        planName: 'Growth (Silver)',
        costMonth: 1.99,
        costYear: 19.99,
        quotas: { cardScansLimit: 30, maxCardsStored: 250, reportsLimit: 1, aiSearchLimit: 0 }
      },
      professional: {
        planName: 'Professional (Gold)',
        costMonth: 3.99,
        costYear: 39.99,
        quotas: { cardScansLimit: 59, maxCardsStored: 600, reportsLimit: -1, aiSearchLimit: 1 }
      },
      enterprise: {
        planName: 'Enterprise (Platinum)',
        costMonth: 9.99,
        costYear: 99.99,
        quotas: { cardScansLimit: -1, maxCardsStored: 5000, reportsLimit: -1, aiSearchLimit: 100 }
      }
    },
    topups: {
      aiSearch: { quantity: 99, cost: 1.99 }
    },
    commissionSlabs: [
      { limit: 100, rate: 0.10 },
      { limit: 500, rate: 0.20 },
      { limit: 999999999, rate: 0.25 }
    ]
  },
  {
    id: 'GB',
    regionName: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    plans: {
      starter: {
        planName: 'Starter (Free)',
        costMonth: 0,
        costYear: 0,
        quotas: { cardScansLimit: 5, maxCardsStored: 20, reportsLimit: 0, aiSearchLimit: 0 }
      },
      growth: {
        planName: 'Growth (Silver)',
        costMonth: 1.49,
        costYear: 14.99,
        quotas: { cardScansLimit: 30, maxCardsStored: 250, reportsLimit: 1, aiSearchLimit: 0 }
      },
      professional: {
        planName: 'Professional (Gold)',
        costMonth: 2.99,
        costYear: 29.99,
        quotas: { cardScansLimit: 59, maxCardsStored: 600, reportsLimit: -1, aiSearchLimit: 1 }
      },
      enterprise: {
        planName: 'Enterprise (Platinum)',
        costMonth: 7.99,
        costYear: 79.99,
        quotas: { cardScansLimit: -1, maxCardsStored: 5000, reportsLimit: -1, aiSearchLimit: 100 }
      }
    },
    topups: {
      aiSearch: { quantity: 99, cost: 1.49 }
    },
    commissionSlabs: [
      { limit: 80, rate: 0.10 },
      { limit: 400, rate: 0.20 },
      { limit: 999999999, rate: 0.25 }
    ]
  },
  {
    id: 'EU',
    regionName: 'European Union',
    currency: 'EUR',
    currencySymbol: '€',
    plans: {
      starter: {
        planName: 'Starter (Free)',
        costMonth: 0,
        costYear: 0,
        quotas: { cardScansLimit: 5, maxCardsStored: 20, reportsLimit: 0, aiSearchLimit: 0 }
      },
      growth: {
        planName: 'Growth (Silver)',
        costMonth: 1.79,
        costYear: 17.99,
        quotas: { cardScansLimit: 30, maxCardsStored: 250, reportsLimit: 1, aiSearchLimit: 0 }
      },
      professional: {
        planName: 'Professional (Gold)',
        costMonth: 3.49,
        costYear: 34.99,
        quotas: { cardScansLimit: 59, maxCardsStored: 600, reportsLimit: -1, aiSearchLimit: 1 }
      },
      enterprise: {
        planName: 'Enterprise (Platinum)',
        costMonth: 8.99,
        costYear: 89.99,
        quotas: { cardScansLimit: -1, maxCardsStored: 5000, reportsLimit: -1, aiSearchLimit: 100 }
      }
    },
    topups: {
      aiSearch: { quantity: 99, cost: 1.79 }
    },
    commissionSlabs: [
      { limit: 90, rate: 0.10 },
      { limit: 450, rate: 0.20 },
      { limit: 999999999, rate: 0.25 }
    ]
  },
  {
    id: 'SEA',
    regionName: 'South East Asia',
    currency: 'SGD',
    currencySymbol: 'S$',
    plans: {
      starter: {
        planName: 'Starter (Free)',
        costMonth: 0,
        costYear: 0,
        quotas: { cardScansLimit: 5, maxCardsStored: 20, reportsLimit: 0, aiSearchLimit: 0 }
      },
      growth: {
        planName: 'Growth (Silver)',
        costMonth: 2.49,
        costYear: 24.99,
        quotas: { cardScansLimit: 30, maxCardsStored: 250, reportsLimit: 1, aiSearchLimit: 0 }
      },
      professional: {
        planName: 'Professional (Gold)',
        costMonth: 4.99,
        costYear: 49.99,
        quotas: { cardScansLimit: 59, maxCardsStored: 600, reportsLimit: -1, aiSearchLimit: 1 }
      },
      enterprise: {
        planName: 'Enterprise (Platinum)',
        costMonth: 11.99,
        costYear: 119.99,
        quotas: { cardScansLimit: -1, maxCardsStored: 5000, reportsLimit: -1, aiSearchLimit: 100 }
      }
    },
    topups: {
      aiSearch: { quantity: 99, cost: 2.49 }
    },
    commissionSlabs: [
      { limit: 130, rate: 0.10 },
      { limit: 650, rate: 0.20 },
      { limit: 999999999, rate: 0.25 }
    ]
  },
  {
    id: 'ME',
    regionName: 'Middle East',
    currency: 'AED',
    currencySymbol: 'د.إ',
    plans: {
      starter: {
        planName: 'Starter (Free)',
        costMonth: 0,
        costYear: 0,
        quotas: { cardScansLimit: 5, maxCardsStored: 20, reportsLimit: 0, aiSearchLimit: 0 }
      },
      growth: {
        planName: 'Growth (Silver)',
        costMonth: 6.99,
        costYear: 69.99,
        quotas: { cardScansLimit: 30, maxCardsStored: 250, reportsLimit: 1, aiSearchLimit: 0 }
      },
      professional: {
        planName: 'Professional (Gold)',
        costMonth: 13.99,
        costYear: 139.99,
        quotas: { cardScansLimit: 59, maxCardsStored: 600, reportsLimit: -1, aiSearchLimit: 1 }
      },
      enterprise: {
        planName: 'Enterprise (Platinum)',
        costMonth: 34.99,
        costYear: 349.99,
        quotas: { cardScansLimit: -1, maxCardsStored: 5000, reportsLimit: -1, aiSearchLimit: 100 }
      }
    },
    topups: {
      aiSearch: { quantity: 99, cost: 6.99 }
    },
    commissionSlabs: [
      { limit: 350, rate: 0.10 },
      { limit: 1750, rate: 0.20 },
      { limit: 999999999, rate: 0.25 }
    ]
  }
];

export async function seedPricingConfigs() {
  if (!adminDb) {
    console.error('Database not initialized. Cannot seed.');
    return;
  }

  console.log('Starting pricing config seeding...');
  const collRef = adminDb.collection('Pricing_Configs');

  for (const region of regionsData) {
    try {
      await collRef.doc(region.id).set(region);
      console.log(`Successfully seeded region config: ${region.id} (${region.regionName})`);
    } catch (err) {
      console.error(`Failed to seed region ${region.id}:`, err);
    }
  }

  console.log('Pricing config seeding complete!');
}

// Run the script directly if invoked from node/tsx
if (require.main === module) {
  seedPricingConfigs().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
