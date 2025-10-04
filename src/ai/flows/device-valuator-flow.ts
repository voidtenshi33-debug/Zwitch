'use server';

/**
 * @fileOverview An AI flow to estimate the value of a used electronic device by analyzing its images.
 *
 * - deviceValuator - A function that provides a valuation and recommendation based on images.
 * - DeviceValuatorInput - The input type for the deviceValuator function.
 * - DeviceValuatorOutput - The return type for the deviceValuator function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DeviceValuatorInputSchema = z.object({
  deviceType: z.string().describe('The type of device (e.g., "Mobile Phone", "Laptop").'),
  model: z.string().describe('The specific model of the device (e.g., "Apple iPhone 11").'),
  photoDataUris: z.array(z.string()).describe(
    "A set of photos of a device, as data URIs that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. The images should show the device from multiple angles, including any damage."
  ),
});
export type DeviceValuatorInput = z.infer<typeof DeviceValuatorInputSchema>;

const DeviceValuatorOutputSchema = z.object({
  estimatedMinValue: z.number().describe('The lower end of the estimated resale value range.'),
  estimatedMaxValue: z.number().describe('The higher end of the estimated resale value range.'),
  recommendation: z.string().describe('The recommended action for the user (e.g., "High Resale Value! We recommend selling this.").'),
  suggestedTitle: z.string().describe('A suggested title for the listing if the user decides to sell.'),
  suggestedCategory: z.string().describe('The suggested category for the listing.'),
});
export type DeviceValuatorOutput = z.infer<typeof DeviceValuatorOutputSchema>;

export async function deviceValuator(input: DeviceValuatorInput): Promise<DeviceValuatorOutput> {
  return deviceValuatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'deviceValuatorPrompt',
  input: { schema: DeviceValuatorInputSchema },
  output: { schema: DeviceValuatorOutputSchema },
  prompt: `You are an expert evaluator for a second-hand electronics marketplace in India. Your currency is Indian Rupees (INR).

  A user wants to know the value of their old device. Based on the provided images and device details, you must diagnose the item's condition, provide a realistic resale price range, a clear recommendation, a suggested listing title, and a category.

  - Analyze the images to determine the physical condition (e.g., screen cracks, scratches, overall wear).
  - If the value is very low based on the visible condition, recommend donating or selling for spare parts.
  - If the value is decent, recommend selling it.
  - The suggested title should be clear and include the model and an inferred condition (e.g., "Used - Good", "Screen Damaged").

  Device Type: {{{deviceType}}}
  Model: {{{model}}}
  {{#each photoDataUris}}
  Photo: {{media url=this}}
  {{/each}}
  
  Provide your response in the specified JSON format.`,
});


const deviceValuatorFlow = ai.defineFlow(
  {
    name: 'deviceValuatorFlow',
    inputSchema: DeviceValuatorInputSchema,
    outputSchema: DeviceValuatorOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
