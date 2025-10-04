'use server';

/**
 * @fileOverview An AI flow to estimate the value of a used electronic device.
 *
 * - deviceValuator - A function that provides a valuation and recommendation.
 * - DeviceValuatorInput - The input type for the deviceValuator function.
 * - DeviceValuatorOutput - The return type for the deviceValuator function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DeviceValuatorInputSchema = z.object({
  deviceType: z.string().describe('The type of device (e.g., "Mobile Phone", "Laptop").'),
  model: z.string().describe('The specific model of the device (e.g., "Apple iPhone 11").'),
  condition: z.string().describe('The condition of the device (e.g., "Screen cracked", "Turns on").'),
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

  A user wants to know the value of their old device. Based on the provided details, you must provide a realistic resale price range, a clear recommendation on what to do with it, a suggested listing title, and a category.

  - If the value is very low, recommend donating or selling for spare parts.
  - If the value is decent, recommend selling it.
  - The suggested title should be clear and include the model and condition.

  Device Type: {{{deviceType}}}
  Model: {{{model}}}
  Condition: {{{condition}}}

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
