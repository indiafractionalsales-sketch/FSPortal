'use server';

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

/**
 * @fileOverview This file defines a Genkit flow for generating personalized descriptions of fractional sales partners.
 *
 * - aiPoweredPartnerDescription - A function that generates a personalized description of a fractional sales partner.
 * - AIPoweredPartnerDescriptionInput - The input type for the aiPoweredPartnerDescription function.
 * - AIPoweredPartnerDescriptionOutput - The return type for the aiPoweredPartnerDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPoweredPartnerDescriptionInputSchema = z.object({
  salesNiche: z
    .string()
    .describe('The specific sales niche or industry the customer operates in.'),
  idealPartnerCharacteristics: z
    .string()
    .describe(
      'A description of the ideal characteristics, skills, and experience the customer is looking for in a fractional sales partner.'
    ),
});
export type AIPoweredPartnerDescriptionInput = z.infer<
  typeof AIPoweredPartnerDescriptionInputSchema
>;

const AIPoweredPartnerDescriptionOutputSchema = z.object({
  partnerDescription: z
    .string()
    .describe(
      'A personalized and compelling description of the perfect fractional sales partner for the given needs.'
    ),
});
export type AIPoweredPartnerDescriptionOutput = z.infer<
  typeof AIPoweredPartnerDescriptionOutputSchema
>;

export async function aiPoweredPartnerDescription(
  input: AIPoweredPartnerDescriptionInput
): Promise<AIPoweredPartnerDescriptionOutput> {
  return aiPoweredPartnerDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredPartnerDescriptionPrompt',
  input: {schema: AIPoweredPartnerDescriptionInputSchema},
  output: {schema: AIPoweredPartnerDescriptionOutputSchema},
  prompt: `You are an AI-powered expert in matching businesses with ideal fractional sales partners for ScaleFraction, a platform specializing in high-performance sales teams.

Based on the customer's sales niche and their desired partner characteristics, generate a personalized and compelling description of the perfect fractional sales partner that highlights their expertise, potential contributions, and how they align with the customer's needs.

The description should showcase the platform's intelligent matching capabilities and entice the customer.

Sales Niche: {{{salesNiche}}}
Ideal Partner Characteristics: {{{idealPartnerCharacteristics}}}`,
});

const aiPoweredPartnerDescriptionFlow = ai.defineFlow(
  {
    name: 'aiPoweredPartnerDescriptionFlow',
    inputSchema: AIPoweredPartnerDescriptionInputSchema,
    outputSchema: AIPoweredPartnerDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
