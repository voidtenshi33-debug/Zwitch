'use server';

/**
 * @fileOverview A flow to generate a listing description based on the title, category and images.
 *
 * - generateListingDescription - A function that generates a listing description.
 * - GenerateListingDescriptionInput - The input type for the generateListingDescription function.
 * - GenerateListingDescriptionOutput - The return type for the generateListingDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateListingDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the listing.'),
  category: z.string().describe('The category of the item.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type GenerateListingDescriptionInput = z.infer<typeof GenerateListingDescriptionInputSchema>;

const GenerateListingDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated description for the listing.'),
});

export type GenerateListingDescriptionOutput = z.infer<typeof GenerateListingDescriptionOutputSchema>;

export async function generateListingDescription(
  input: GenerateListingDescriptionInput
): Promise<GenerateListingDescriptionOutput> {
  return generateListingDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateListingDescriptionPrompt',
  input: {schema: GenerateListingDescriptionInputSchema},
  output: {schema: GenerateListingDescriptionOutputSchema},
  prompt: `You are an expert at writing clear, concise, and appealing descriptions for online listings.

  Based on the provided title, category and image (if available), generate a suitable description for the item. The description should be informative and help potential buyers or recipients understand what the item is, its condition (if inferable), and its potential uses.

  Title: {{{title}}}
  Category: {{{category}}}
  {{#if photoDataUri}}Photo: {{media url=photoDataUri}}{{/if}}
  `,
});

const generateListingDescriptionFlow = ai.defineFlow(
  {
    name: 'generateListingDescriptionFlow',
    inputSchema: GenerateListingDescriptionInputSchema,
    outputSchema: GenerateListingDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
