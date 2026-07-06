'use server';
/**
 * @fileOverview Genkit flow for AI-powered lead extraction from visiting cards and voice notes.
 *
 * - extractLead - Processes a visiting card image and audio voice note to extract structured lead data.
 * - ExtractLeadInput - Input type for the extractLead function.
 * - ExtractLeadOutput - Output type for the extractLead function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractLeadInputSchema = z.object({
  imageBase64: z
    .string()
    .describe('Base64-encoded visiting card image (data URI or raw base64).'),
  audioBase64: z
    .string()
    .optional()
    .describe('Base64-encoded audio voice note (webm). Optional.'),
  textNote: z
    .string()
    .optional()
    .describe('An optional text note provided by the user alongside or instead of the audio.'),
});
export type ExtractLeadInput = z.infer<typeof ExtractLeadInputSchema>;

const ContactInfoSchema = z.object({
  name: z.string().optional().describe('Full name of the contact.'),
  designation: z.string().optional().describe('Job title or designation.'),
  company: z.string().optional().describe('Company or organization name.'),
  email: z.string().optional().describe('Email address.'),
  phone: z.string().optional().describe('Phone number with country code if visible.'),
  website: z.string().optional().describe('Company website URL if visible on the card.'),
});

const ExtractLeadOutputSchema = z.object({
  contactInfo: ContactInfoSchema.describe('Structured contact information extracted from the visiting card image.'),
  temperature: z
    .enum(['hot', 'warm', 'cold'])
    .describe('Lead temperature classification based on voice tags or context.'),
  actionItem: z
    .string()
    .describe('The next action item or CTA extracted from the voice note or text note, in professional English.'),
  contextSummary: z
    .string()
    .describe('A brief professional English summary of the sales context from the voice note.'),
});
export type ExtractLeadOutput = z.infer<typeof ExtractLeadOutputSchema>;

export async function extractLead(
  input: ExtractLeadInput
): Promise<ExtractLeadOutput> {
  return extractLeadFlow(input);
}

/**
 * Ensures a base64 string is a proper data URI.
 * If it's already a data URI (starts with "data:"), returns as-is.
 * Otherwise wraps it with the appropriate MIME prefix.
 */
function toDataUri(base64: string, mimeType: string): string {
  if (base64.startsWith('data:')) return base64;
  return `data:${mimeType};base64,${base64}`;
}

const extractLeadFlow = ai.defineFlow(
  {
    name: 'extractLeadFlow',
    inputSchema: ExtractLeadInputSchema,
    outputSchema: ExtractLeadOutputSchema,
  },
  async (input) => {
    // Build prompt parts
    const promptParts: Array<{ text: string } | { media: { url: string; contentType?: string } }> = [];

    // System instruction
    promptParts.push({
      text: `You are an AI assistant for ScaleFraction, a B2B fractional sales marketplace platform.

Your job is to process a visiting card image and an accompanying voice note (or text note) from a Sales Partner who met someone at a trade show or event.

TASKS:
1. EXTRACT CONTACT INFO: Look at the visiting card image and extract the contact's full name, designation, company, email, phone number, and website URL. If any field is not visible, leave it as an empty string.

2. CLASSIFY LEAD TEMPERATURE: Based on the voice/text note, classify the lead:
   - "hot": Keywords like "HOT LEAD", "URGENT", "ASAP", "CLOSING", "ready to buy", "send contract", "schedule demo immediately"
   - "warm": Keywords like "WARM LEAD", "FOLLOW UP", "SEND INFO", "CHECK IN", interested but needs time, evaluating competitors
   - "cold": Keywords like "COLD LEAD", "JUST LOG", "NO ACTION", casual contact, not our target, networking only

3. EXTRACT ACTION ITEM: What is the next step? (e.g., "Call tomorrow at 10 AM", "Send brochure by Friday", "Add to newsletter list", "No action needed")

4. CONTEXT SUMMARY: Write a brief 1-2 sentence professional summary in English of what the Sales Partner conveyed, regardless of the language they spoke in.

IMPORTANT:
- The voice note may be in ANY language (Hindi, Marathi, Tamil, etc.). You MUST translate it to English.
- If no voice/text note is provided, classify as "cold" with action item "No context provided - review card manually".
- Always output in professional English.`,
    });

    // Add the visiting card image as a data URI
    const imageUri = toDataUri(input.imageBase64, 'image/jpeg');
    promptParts.push({
      media: { url: imageUri },
    });

    // Add audio if available
    if (input.audioBase64) {
      const audioUri = toDataUri(input.audioBase64, 'audio/webm');
      promptParts.push({
        media: { url: audioUri },
      });
    }

    // Add text note if available
    if (input.textNote) {
      promptParts.push({
        text: `Sales Partner's text note: "${input.textNote}"`,
      });
    }

    const { output } = await ai.generate({
      prompt: promptParts as any,
      output: { schema: ExtractLeadOutputSchema },
    });

    return output!;
  }
);
