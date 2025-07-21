'use server';

/**
 * @fileOverview Generates a trip report with distance and cost calculation.
 * 
 * - generateTripReport - A function that takes job locations and returns distance and cost.
 * - GenerateTripReportInput - The input type for the generateTripReport function.
 * - GenerateTripReportOutput - The return type for the generateTripReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { optimizeRoute } from './optimize-route';

const GenerateTripReportInputSchema = z.object({
  startLocation: z.string().describe('The current location of the bärgare.'),
  breakdownLocation: z.string().describe('The location of the vehicle breakdown.'),
  destination: z.string().describe('The final destination for the vehicle.'),
});
export type GenerateTripReportInput = z.infer<typeof GenerateTripReportInputSchema>;

const GenerateTripReportOutputSchema = z.object({
  distance: z.string().describe('The total estimated distance for the trip in kilometers.'),
  costs: z.object({
    deductible: z.number().describe('The suggested deductible cost, can be a base fee.'),
    otherFees: z.number().describe('The calculated mileage cost.'),
    total: z.number().describe('The total calculated cost.'),
  }),
});
export type GenerateTripReportOutput = z.infer<typeof GenerateTripReportOutputSchema>;

export async function generateTripReport(input: GenerateTripReportInput): Promise<GenerateTripReportOutput> {
  return generateTripReportFlow(input);
}

const START_FEE = 500; // Base fee for any job
const COST_PER_KM = 25; // Cost per kilometer

const generateTripReportFlow = ai.defineFlow(
  {
    name: 'generateTripReportFlow',
    inputSchema: GenerateTripReportInputSchema,
    outputSchema: GenerateTripReportOutputSchema,
  },
  async (input) => {
    // 1. Get the optimized route and distance
    const routeInfo = await optimizeRoute(input);
    const distanceKm = parseInt(routeInfo.estimatedDistance.replace(' km', ''), 10);

    // 2. Calculate costs
    const mileageCost = distanceKm * COST_PER_KM;
    const totalCost = START_FEE + mileageCost;

    // For this app, let's assume the deductible is a fixed base fee
    // and the mileage cost is booked as "other fees".
    const costs = {
      deductible: START_FEE,
      otherFees: Math.round(mileageCost),
      total: Math.round(totalCost),
    };
    
    return {
      distance: routeInfo.estimatedDistance,
      costs,
    };
  }
);
