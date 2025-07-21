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
  pricing: z.object({
    startFee: z.number().describe('The base fee for any job.'),
    costPerKm: z.number().describe('The cost per kilometer.'),
  }).describe('The pricing model for the company.'),
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

const generateTripReportFlow = ai.defineFlow(
  {
    name: 'generateTripReportFlow',
    inputSchema: GenerateTripReportInputSchema,
    outputSchema: GenerateTripReportOutputSchema,
  },
  async (input) => {
    // 1. Get the optimized route and distance
    const routeInfo = await optimizeRoute({
        startLocation: input.startLocation,
        breakdownLocation: input.breakdownLocation,
        destination: input.destination,
    });
    const distanceKm = parseInt(routeInfo.estimatedDistance.replace(' km', ''), 10);

    // 2. Calculate costs based on dynamic pricing
    const mileageCost = distanceKm * input.pricing.costPerKm;
    const totalCost = input.pricing.startFee + mileageCost;

    // For this app, let's assume the deductible is the start fee
    // and the mileage cost is booked as "other fees".
    const costs = {
      deductible: input.pricing.startFee,
      otherFees: Math.round(mileageCost),
      total: Math.round(totalCost),
    };
    
    return {
      distance: routeInfo.estimatedDistance,
      costs,
    };
  }
);
