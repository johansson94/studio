'use server';

/**
 * @fileOverview A tool for looking up vehicle information by license plate.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// This is a mock database. In a real application, this would be an API call.
const vehicleDatabase: Record<string, { make: string; model: string; vin: string; insuranceCompany: string; engine: string; fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid'; drivetrain: 'FWD' | 'RWD' | 'AWD' }> = {
    'REG 123': { make: 'Volvo', model: 'XC60', vin: 'YV1DZ835C6F123456', insuranceCompany: 'If', engine: 'B4 Mild-Hybrid', fuelType: 'Gasoline', drivetrain: 'AWD' },
    'AUD 456': { make: 'Audi', model: 'A4', vin: 'WAUZZZ8K5DA098765', insuranceCompany: 'Trygg-Hansa', engine: '2.0 TDI', fuelType: 'Diesel', drivetrain: 'FWD' },
    'TRU 789': { make: 'Scania', model: 'R-series', vin: 'YS2R4X20001234567', insuranceCompany: 'Dina Försäkringar', engine: 'DC13 146', fuelType: 'Diesel', drivetrain: 'RWD' },
    'VAN 101': { make: 'Ford', model: 'Transit', vin: 'WF0XXXTTGXGY12345', insuranceCompany: 'Länsförsäkringar', engine: '2.0 EcoBlue', fuelType: 'Diesel', drivetrain: 'FWD' },
    'MC 202': { make: 'Kawasaki', model: 'Ninja 400', vin: 'JKBRGHYU879SDF987', insuranceCompany: 'Bilsport & MC', engine: '399cc', fuelType: 'Gasoline', drivetrain: 'RWD' },
    'TES 303': { make: 'Tesla', model: 'Model Y', vin: '5YJYGDEE3LF123456', insuranceCompany: 'If', engine: 'Dual Motor', fuelType: 'Electric', drivetrain: 'AWD' },
};

const VehicleInfoSchema = z.object({
    make: z.string().describe("The make of the vehicle."),
    model: z.string().describe("The model of the vehicle."),
    vin: z.string().describe("The Vehicle Identification Number (VIN)."),
    insuranceCompany: z.string().describe("The insurance company for the vehicle."),
    engine: z.string().describe("The engine specification of the vehicle."),
    fuelType: z.enum(["Gasoline", "Diesel", "Electric", "Hybrid"]).describe("The fuel type of the vehicle."),
    drivetrain: z.enum(["FWD", "RWD", "AWD"]).describe("The drivetrain of the vehicle (Front-wheel drive, Rear-wheel drive, All-wheel drive)."),
});

export const getVehicleInfoByLicensePlate = ai.defineTool(
  {
    name: 'getVehicleInfoByLicensePlate',
    description: 'Returns vehicle information for a given license plate, or null if not found.',
    inputSchema: z.object({
      licensePlate: z.string().describe('The license plate of the vehicle.'),
    }),
    outputSchema: VehicleInfoSchema.nullable(),
  },
  async (input) => {
    console.log(`Looking up vehicle with plate: ${input.licensePlate}`);
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const vehicle = vehicleDatabase[input.licensePlate.toUpperCase()];

    if (vehicle) {
        return vehicle;
    } else {
        return null;
    }
  }
);
