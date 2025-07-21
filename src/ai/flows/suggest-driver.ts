
'use server';

/**
 * @fileOverview Suggests the best available driver for a new job.
 * 
 * - suggestDriver - A function that takes job and driver data and returns a suggestion.
 * - SuggestDriverInput - The input type for the suggestDriver function.
 * - SuggestDriverOutput - The return type for the suggestDriver function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestDriverInputSchema = z.object({
  job: z.object({
    location: z.string().describe("The location of the new job."),
    vehicleType: z.enum(["Car", "Motorcycle", "Truck", "Van"]).describe("The type of vehicle that needs assistance."),
  }),
  drivers: z.array(z.object({
    id: z.string(),
    name: z.string(),
    position: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional().describe("The driver's current coordinates."),
    vehicleType: z.enum(["Car", "Motorcycle", "Truck", "Van"]).describe("The type of tow truck the driver operates."),
  })).describe("A list of available drivers."),
});
export type SuggestDriverInput = z.infer<typeof SuggestDriverInputSchema>;

const SuggestDriverOutputSchema = z.object({
  driverId: z.string().describe("The ID of the suggested driver."),
  reason: z.string().describe("A brief explanation for why this driver is recommended, including estimated time to arrival."),
});
export type SuggestDriverOutput = z.infer<typeof SuggestDriverOutputSchema>;


export async function suggestDriver(input: SuggestDriverInput): Promise<SuggestDriverOutput> {
  return suggestDriverFlow(input);
}

const prompt = ai.definePrompt({
    name: 'suggestDriverPrompt',
    input: { schema: SuggestDriverInputSchema },
    output: { schema: SuggestDriverOutputSchema },
    prompt: `You are an expert dispatcher for a towing company. Your task is to recommend the best driver for a new job based on their proximity and the type of tow truck they operate.

    New Job Details:
    - Location: {{{job.location}}}
    - Vehicle Type to Rescue: {{{job.vehicleType}}}

    Available Drivers:
    {{{json drivers}}}

    Analyze the list of available drivers. Choose the driver who is closest to the job location. If the job requires a 'Truck', you must select a driver who also operates a 'Truck'. For all other job types ('Car', 'Van', 'Motorcycle'), any driver is suitable. 

    Your response must include the ID of the chosen driver and a short, clear reason for your choice (e.g., "Closest driver, approx. 15 min away."). Be concise.
    `,
});

const suggestDriverFlow = ai.defineFlow(
  {
    name: 'suggestDriverFlow',
    inputSchema: SuggestDriverInputSchema,
    outputSchema: SuggestDriverOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
