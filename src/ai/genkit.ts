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
