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

import {genkit} from 'genkit';
import {googleAI, vertexAI} from '@genkit-ai/google-genai';

let projectId = 'fractional-sales-4436e';

// The @genkit-ai/google-genai Vertex AI plugin natively checks
// process.env.GCLOUD_SERVICE_ACCOUNT_CREDS for service account JSON.
// We bridge FIREBASE_SERVICE_ACCOUNT_JSON → GCLOUD_SERVICE_ACCOUNT_CREDS
// so the plugin's built-in auth path handles everything.
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON && !process.env.GCLOUD_SERVICE_ACCOUNT_CREDS) {
  process.env.GCLOUD_SERVICE_ACCOUNT_CREDS = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  try {
    projectId = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON).project_id || projectId;
  } catch (e) {}
  console.log('Genkit: Bridged FIREBASE_SERVICE_ACCOUNT_JSON → GCLOUD_SERVICE_ACCOUNT_CREDS for project:', projectId);
}

export const ai = genkit({
  plugins: [
    googleAI(),
    vertexAI({
      projectId,
      location: 'us-central1',
    })
  ],
  model: 'googleai/gemini-2.5-flash',
});
