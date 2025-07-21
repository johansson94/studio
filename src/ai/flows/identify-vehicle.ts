'use server';

/**
 * @fileOverview Identifies a vehicle's make and model from an image.
 * 
 * - identifyVehicle - A function that takes an image and returns vehicle details.
 * - IdentifyVehicleInput - The input type for the identifyVehicle function.
 * - IdentifyVehicleOutput - The return type for the identifyVehicle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const IdentifyVehicleInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a vehicle, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyVehicleInput = z.infer<typeof IdentifyVehicleInputSchema>;

const IdentifyVehicleOutputSchema = z.object({
  make: z.string().describe("The make of the identified vehicle, e.g., 'Volvo'."),
  model: z.string().describe("The model of the identified vehicle, e.g., 'XC60'."),
});
export type IdentifyVehicleOutput = z.infer<typeof IdentifyVehicleOutputSchema>;

export async function identifyVehicle(input: IdentifyVehicleInput): Promise<IdentifyVehicleOutput> {
  return identifyVehicleFlow(input);
}

const prompt = ai.definePrompt({
    name: 'identifyVehiclePrompt',
    input: { schema: IdentifyVehicleInputSchema },
    output: { schema: IdentifyVehicleOutputSchema },
    prompt: `You are a vehicle identification expert. Analyze the provided image and identify the vehicle's make and model.

    Photo: {{media url=photoDataUri}}
    
    Return only the make and model.
    `,
});

const identifyVehicleFlow = ai.defineFlow(
  {
    name: 'identifyVehicleFlow',
    inputSchema: IdentifyVehicleInputSchema,
    outputSchema: IdentifyVehicleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
