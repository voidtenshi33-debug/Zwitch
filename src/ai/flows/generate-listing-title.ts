'use server';

/**
 * @fileOverview A flow to generate a listing title based on the description and images.
 *
 * - generateListingTitle - A function that generates a listing title.
 * - GenerateListingTitleInput - The input type for the generateListingTitle function.
 * - GenerateListingTitleOutput - The return type for the generateListingTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateListingTitleInputSchema = z.object({
  description: z.string().describe('The description of the item.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type GenerateListingTitleInput = z.infer<typeof GenerateListingTitleInputSchema>;

const GenerateListingTitleOutputSchema = z.object({
  title: z.string().describe('The generated title for the listing.'),
});

export type GenerateListingTitleOutput = z.infer<typeof GenerateListingTitleOutputSchema>;

export async function generateListingTitle(
  input: GenerateListingTitleInput
): Promise<GenerateListingTitleOutput> {
  return generateListingTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateListingTitlePrompt',
  input: {schema: GenerateListingTitleInputSchema},
  output: {schema: GenerateListingTitleOutputSchema},
  prompt: `You are an expert at writing catchy and descriptive titles for online listings.

  Based on the description and image (if available) provided, generate a title that accurately represents the item and attracts potential buyers or recipients.

  Description: {{{description}}}
  {{#if photoDataUri}}Photo: {{media url=photoDataUri}}{{/if}}
  `,
});

const generateListingTitleFlow = ai.defineFlow(
  {
    name: 'generateListingTitleFlow',
    inputSchema: GenerateListingTitleInputSchema,
    outputSchema: GenerateListingTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
