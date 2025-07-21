'use server';

/**
 * @fileOverview Generates a customer-friendly receipt message for a completed job.
 * 
 * - generateReceiptMessage - A function that takes job details and returns a formatted message.
 * - GenerateReceiptMessageInput - The input type for the generateReceiptMessage function.
 * - GenerateReceiptMessageOutput - The return type for the generateReceiptMessage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateReceiptMessageInputSchema = z.object({
  jobId: z.string().describe("The job ID."),
  customerName: z.string().describe("The customer's name."),
  vehicleMake: z.string().describe("The make of the vehicle."),
  vehicleModel: z.string().describe("The model of the vehicle."),
  destination: z.string().describe("The destination workshop or location."),
  destinationNotes: z.string().optional().describe("Notes about the drop-off."),
  keysLocation: z.string().optional().describe("Where the keys were left."),
  costs: z.object({
    deductible: z.number(),
    otherFees: z.number(),
    total: z.number(),
    paidOnSite: z.boolean(),
  }).optional().describe("Cost breakdown."),
});
export type GenerateReceiptMessageInput = z.infer<typeof GenerateReceiptMessageInputSchema>;

const GenerateReceiptMessageOutputSchema = z.object({ message: z.string() });
export type GenerateReceiptMessageOutput = z.infer<typeof GenerateReceiptMessageOutputSchema>;

export async function generateReceiptMessage(input: GenerateReceiptMessageInput): Promise<GenerateReceiptMessageOutput> {
  return generateReceiptMessageFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateReceiptMessagePrompt',
    input: { schema: GenerateReceiptMessageInputSchema },
    output: { schema: GenerateReceiptMessageOutputSchema },
    prompt: `You are a helpful assistant for a towing company called RescueAssist. Your task is to generate a concise and friendly SMS/email message for a customer after a job is completed. The message should be in Swedish.

    Use the following information:
    - Job ID: {{{jobId}}}
    - Customer Name: {{{customerName}}}
    - Vehicle: {{{vehicleMake}}} {{{vehicleModel}}}
    - Destination: {{{destination}}}
    - Destination Notes: {{{destinationNotes}}}
    - Keys Location: {{{keysLocation}}}
    {{#if costs}}
    - Deductible: {{{costs.deductible}}} SEK
    - Other Fees: {{{costs.otherFees}}} SEK
    - Total Cost: {{{costs.total}}} SEK
    - Paid on site: {{#if costs.paidOnSite}}Ja{{else}}Nej{{/if}}
    {{/if}}

    Generate a message that confirms the job is complete and provides the key details. Start with a friendly greeting. End with a thank you and the company name, RescueAssist.
    `,
});

const generateReceiptMessageFlow = ai.defineFlow(
  {
    name: 'generateReceiptMessageFlow',
    inputSchema: GenerateReceiptMessageInputSchema,
    outputSchema: GenerateReceiptMessageOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
