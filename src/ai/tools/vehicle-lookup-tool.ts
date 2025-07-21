'use server';

/**
 * @fileOverview A tool for looking up vehicle information by license plate.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// This is a mock database. In a real application, this would be an API call.
const vehicleDatabase: Record<string, { make: string; model: string; vin: string; insuranceCompany: string }> = {
    'REG 123': { make: 'Volvo', model: 'XC60', vin: 'YV1DZ835C6F123456', insuranceCompany: 'If' },
    'AUD 456': { make: 'Audi', model: 'A4', vin: 'WAUZZZ8K5DA098765', insuranceCompany: 'Trygg-Hansa' },
    'TRU 789': { make: 'Scania', model: 'R-series', vin: 'YS2R4X20001234567', insuranceCompany: 'Dina Försäkringar' },
    'VAN 101': { make: 'Ford', model: 'Transit', vin: 'WF0XXXTTGXGY12345', insuranceCompany: 'Länsförsäkringar' },
    'MC 202': { make: 'Kawasaki', model: 'Ninja 400', vin: 'JKBRGHYU879SDF987', insuranceCompany: 'Bilsport & MC' },
    'TES 303': { make: 'Tesla', model: 'Model Y', vin: '5YJYGDEE3LF123456', insuranceCompany: 'If' },
};

export const getVehicleInfoByLicensePlate = ai.defineTool(
  {
    name: 'getVehicleInfoByLicensePlate',
    description: 'Returns vehicle information for a given license plate.',
    inputSchema: z.object({
      licensePlate: z.string().describe('The license plate of the vehicle.'),
    }),
    outputSchema: z.object({
        make: z.string().describe("The make of the vehicle."),
        model: z.string().describe("The model of the vehicle."),
        vin: z.string().describe("The Vehicle Identification Number (VIN)."),
        insuranceCompany: z.string().describe("The insurance company for the vehicle."),
    }),
  },
  async (input) => {
    console.log(`Looking up vehicle with plate: ${input.licensePlate}`);
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const vehicle = vehicleDatabase[input.licensePlate.toUpperCase()];

    if (vehicle) {
        return vehicle;
    } else {
        throw new Error('Vehicle not found.');
    }
  }
);
