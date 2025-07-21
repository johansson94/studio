'use server';

/**
 * @fileOverview Categorizes and prioritizes a new job based on its description.
 * 
 * - categorizeJob - A function that takes a job description and returns a category, priority, and suggested action.
 * - CategorizeJobInput - The input type for the categorizeJob function.
 * - CategorizeJobOutput - The return type for the categorizeJob function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CategorizeJobInputSchema = z.object({
  description: z.string().describe("The customer's description of the incident."),
});
export type CategorizeJobInput = z.infer<typeof CategorizeJobInputSchema>;

const CategorizeJobOutputSchema = z.object({
  category: z.string().describe("A category for the job, e.g., 'Mekaniskt fel', 'Olycka', 'Punktering', 'Låsöppning', 'Bränslebrist', 'Batteriproblem', 'Annat'."),
  priority: z.enum(["Hög", "Normal", "Låg"]).describe("The priority level of the job."),
  suggestedAction: z.string().describe("A single suggested action, e.g., 'Bärgning', 'Starthjälp', 'Däckbyte'."),
});
export type CategorizeJobOutput = z.infer<typeof CategorizeJobOutputSchema>;

export async function categorizeJob(input: CategorizeJobInput): Promise<CategorizeJobOutput> {
  return categorizeJobFlow(input);
}

const prompt = ai.definePrompt({
    name: 'categorizeJobPrompt',
    input: { schema: CategorizeJobInputSchema },
    output: { schema: CategorizeJobOutputSchema },
    prompt: `You are an expert dispatcher for a towing company. Your task is to analyze a customer's description of an incident and categorize it.

    Description: "{{{description}}}"

    Based on the description, determine the most likely category for the job.
    Available categories: 'Mekaniskt fel', 'Olycka', 'Punktering', 'Låsöppning', 'Bränslebrist', 'Batteriproblem', 'Annat'.

    Assess the urgency and assign a priority level. Use "Hög" for incidents involving accidents, dangerous locations (like highways), or situations blocking traffic. Use "Normal" for standard breakdowns. Use "Låg" for non-urgent requests.
    Available priorities: "Hög", "Normal", "Låg".

    Finally, suggest a single, primary action required.
    Available actions: 'Bärgning', 'Starthjälp', 'Däckbyte', 'Låsöppning', 'Bränsleleverans'.

    Return the category, priority, and suggested action.
    `,
});

const categorizeJobFlow = ai.defineFlow(
  {
    name: 'categorizeJobFlow',
    inputSchema: CategorizeJobInputSchema,
    outputSchema: CategorizeJobOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
