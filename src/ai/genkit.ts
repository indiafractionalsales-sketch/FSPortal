import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {vertexAI} from '@genkit-ai/vertexai';

let projectId = 'fractional-sales-4436e';
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    projectId = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON).project_id || projectId;
  } catch (e) {}
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

