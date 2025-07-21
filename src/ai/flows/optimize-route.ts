'use server';

/**
 * @fileOverview AI-powered route optimization for bärgare (tow truck drivers).
 *
 * - optimizeRoute - A function that takes a starting location, breakdown location, and destination, and returns an optimized route.
 * - OptimizeRouteInput - The input type for the optimizeRoute function.
 * - OptimizeRouteOutput - The return type for the optimizeRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeRouteInputSchema = z.object({
  startLocation: z.string().describe('The current location of the bärgare.'),
  breakdownLocation: z.string().describe('The location of the vehicle breakdown.'),
  destination: z.string().describe('The final destination for the vehicle.'),
});
export type OptimizeRouteInput = z.infer<typeof OptimizeRouteInputSchema>;

const OptimizeRouteOutputSchema = z.object({
  optimizedRoute: z.string().describe('The optimized route from the starting location to the breakdown location and then to the destination, including turn-by-turn directions.'),
  estimatedTime: z.string().describe('The estimated travel time for the optimized route.'),
  estimatedDistance: z.string().describe('The estimated distance for the optimized route.'),
});
export type OptimizeRouteOutput = z.infer<typeof OptimizeRouteOutputSchema>;

export async function optimizeRoute(input: OptimizeRouteInput): Promise<OptimizeRouteOutput> {
  return optimizeRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeRoutePrompt',
  input: {schema: OptimizeRouteInputSchema},
  output: {schema: OptimizeRouteOutputSchema},
  prompt: `You are an AI route optimization expert for bärgare (tow truck drivers). Your goal is to provide the quickest and most efficient route, along with estimated travel time and distance, given the starting location, breakdown location, and final destination.

Starting Location: {{{startLocation}}}
Breakdown Location: {{{breakdownLocation}}}
Destination: {{{destination}}}

Provide the optimized route with turn-by-turn directions, estimated travel time, and estimated distance. Be as concise as possible.
`,
});

const optimizeRouteFlow = ai.defineFlow(
  {
    name: 'optimizeRouteFlow',
    inputSchema: OptimizeRouteInputSchema,
    outputSchema: OptimizeRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
