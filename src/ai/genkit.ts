import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {vertexAI} from '@genkit-ai/vertexai';

import fs from 'fs';
import path from 'path';

let projectId = 'fractional-sales-4436e';
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    projectId = serviceAccount.project_id || projectId;
    
    // Auto-create local credentials file for Google Cloud SDK / Vertex AI
    const tempCredPath = path.join(process.cwd(), 'gcp-credentials.json');
    if (!fs.existsSync(tempCredPath)) {
      fs.writeFileSync(tempCredPath, JSON.stringify(serviceAccount, null, 2));
    }
    process.env.GOOGLE_APPLICATION_CREDENTIALS = tempCredPath;
  } catch (e) {
    console.error('Failed to auto-configure GOOGLE_APPLICATION_CREDENTIALS for Vertex AI:', e);
  }
}

export const ai = genkit({
  plugins: [
    googleAI(),
    vertexAI({
      projectId,
      location: 'us-central1', // Standard default location for AI platform services
    })
  ],
  model: 'googleai/gemini-2.5-flash',
});

