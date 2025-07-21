'use server';

/**
 * @fileOverview Extracts structured filter criteria from a natural language search query.
 * 
 * - extractSearchFilters - A function that takes a search query and returns a filter object.
 * - ExtractSearchFiltersInput - The input type for the extractSearchFilters function.
 * - ExtractSearchFiltersOutput - The return type for the extractSearchFilters function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExtractSearchFiltersInputSchema = z.object({
  query: z.string().describe("The user's natural language search query."),
});
export type ExtractSearchFiltersInput = z.infer<typeof ExtractSearchFiltersInputSchema>;

const ExtractSearchFiltersOutputSchema = z.object({
  status: z.enum(["New", "In Progress", "Completed"]).optional().describe("Filter by job status."),
  vehicleType: z.enum(["Car", "Motorcycle", "Truck", "Van"]).optional().describe("Filter by vehicle type."),
  location: z.string().optional().describe("Filter by a specific location or city."),
  assignedToName: z.string().optional().describe("Filter by the name of the assigned driver."),
  category: z.string().optional().describe("Filter by job category (e.g., 'Punktering', 'Olycka')."),
  priority: z.enum(["Hög", "Normal", "Låg"]).optional().describe("Filter by job priority."),
  searchText: z.string().optional().describe("Any remaining general search text not covered by other filters."),
});
export type ExtractSearchFiltersOutput = z.infer<typeof ExtractSearchFiltersOutputSchema>;

export async function extractSearchFilters(input: ExtractSearchFiltersInput): Promise<ExtractSearchFiltersOutput> {
  return extractSearchFiltersFlow(input);
}

const prompt = ai.definePrompt({
    name: 'extractSearchFiltersPrompt',
    input: { schema: ExtractSearchFiltersInputSchema },
    output: { schema: ExtractSearchFiltersOutputSchema },
    prompt: `You are an expert at interpreting search queries for a towing company's job board. Your task is to extract structured filter criteria from a user's natural language query.

    The query is in Swedish.

    Analyze the user's query: "{{{query}}}"

    Extract the following information if present:
    - **status**: Is the user asking for "nya" (New), "pågående" (In Progress), or "slutförda" (Completed) jobs?
    - **vehicleType**: Does the query mention "bil" (Car), "lastbil" (Truck), "motorcykel" (Motorcycle), or "skåpbil" (Van)?
    - **location**: Is a city or specific place mentioned, like "Uppsala", "Stockholm", "Arlanda"?
    - **assignedToName**: Is a person's name mentioned, like "Erik" or "Anna Svensson"?
    - **category**: Is a specific job category mentioned, like "punktering", "olycka", "batteriproblem"?
    - **priority**: Is a priority level mentioned, like "hög prio", "låg prioritet"?
    - **searchText**: If there are any parts of the query that don't fit into the above categories (like a license plate, customer name, or general description word), return them as searchText.

    Example 1:
    Query: "visa alla nya jobb för lastbilar i stockholm"
    Output: { "status": "New", "vehicleType": "Truck", "location": "Stockholm" }

    Example 2:
    Query: "punkteringar tilldelade till Erik"
    Output: { "category": "Punktering", "assignedToName": "Erik" }

    Example 3:
    Query: "RA-8464"
    Output: { "searchText": "RA-8464" }

    Now, process the user's query.
    `,
});

const extractSearchFiltersFlow = ai.defineFlow(
  {
    name: 'extractSearchFiltersFlow',
    inputSchema: ExtractSearchFiltersInputSchema,
    outputSchema: ExtractSearchFiltersOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
