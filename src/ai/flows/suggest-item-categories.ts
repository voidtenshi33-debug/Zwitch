'use server';

/**
 * @fileOverview Suggests item categories based on the item description and images.
 *
 * - suggestItemCategories - A function that handles the item category suggestion process.
 * - SuggestItemCategoriesInput - The input type for the suggestItemCategories function.
 * - SuggestItemCategoriesOutput - The return type for the suggestItemCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestItemCategoriesInputSchema = z.object({
  description: z.string().describe('The description of the item.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestItemCategoriesInput = z.infer<
  typeof SuggestItemCategoriesInputSchema
>;

const SuggestItemCategoriesOutputSchema = z.object({
  suggestedCategories: z
    .array(z.string())
    .describe('The suggested categories for the item.'),
});
export type SuggestItemCategoriesOutput = z.infer<
  typeof SuggestItemCategoriesOutputSchema
>;

export async function suggestItemCategories(
  input: SuggestItemCategoriesInput
): Promise<SuggestItemCategoriesOutput> {
  return suggestItemCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestItemCategoriesPrompt',
  input: {schema: SuggestItemCategoriesInputSchema},
  output: {schema: SuggestItemCategoriesOutputSchema},
  prompt: `You are an expert in item categorization for online marketplaces.

  Based on the provided item description and image (if available), suggest the most relevant categories for the item. Provide only the categories in a JSON array format.

  Description: {{{description}}}
  {{#if photoDataUri}}
  Image: {{media url=photoDataUri}}
  {{/if}}`,
});

const suggestItemCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestItemCategoriesFlow',
    inputSchema: SuggestItemCategoriesInputSchema,
    outputSchema: SuggestItemCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
