'use server';

/**
 * @fileOverview Generates a dashboard summary report by analyzing completed jobs.
 * 
 * - generateDashboardReport - A function that takes a list of jobs and returns a summary.
 * - GenerateDashboardReportInput - The input type for the generateDashboardReport function.
 * - GenerateDashboardReportOutput - The return type for the generateDashboardReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Job, User } from '@/lib/types';

const JobSchema = z.object({
  id: z.string(),
  customer: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().optional(),
  }),
  vehicle: z.object({
    make: z.string(),
    model: z.string(),
    licensePlate: z.string(),
    type: z.enum(["Car", "Motorcycle", "Truck", "Van"]),
    mileage: z.number(),
  }),
  location: z.string(),
  position: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  destination: z.string(),
  description: z.string(),
  status: z.enum(["New", "In Progress", "Completed"]),
  reportedAt: z.string(), // Using string for simplicity in Zod schema
  assignedTo: z.string().optional(),
  arrivalImage: z.string().optional(),
  destinationImage: z.string().optional(),
  actionsTaken: z.array(z.string()).optional(),
  driverDiagnosis: z.array(z.string()).optional(),
  tmaUsed: z.boolean().optional(),
  destinationNotes: z.string().optional(),
  keysLocation: z.string().optional(),
  log: z.array(z.object({
    event: z.string(),
    timestamp: z.string(),
  })).optional(),
  costs: z.object({
    deductible: z.number(),
    otherFees: z.number(),
    total: z.number(),
    paidOnSite: z.boolean(),
  }).optional(),
});

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(["Dispatcher", "Driver"]),
  avatar: z.string(),
  position: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  assignedVehicle: z.object({
    licensePlate: z.string(),
    model: z.string(),
  }).optional(),
});


const GenerateDashboardReportInputSchema = z.object({
  jobs: z.array(JobSchema).describe("A list of completed job objects."),
  users: z.array(UserSchema).describe("A list of all users (drivers and dispatchers)."),
});
export type GenerateDashboardReportInput = z.infer<typeof GenerateDashboardReportInputSchema>;


const GenerateDashboardReportOutputSchema = z.object({
  report: z.string().describe("A comprehensive summary report in markdown format."),
});
export type GenerateDashboardReportOutput = z.infer<typeof GenerateDashboardReportOutputSchema>;

export async function generateDashboardReport(input: GenerateDashboardReportInput): Promise<GenerateDashboardReportOutput> {
  return generateDashboardReportFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateDashboardReportPrompt',
    input: { schema: GenerateDashboardReportInputSchema },
    output: { schema: GenerateDashboardReportOutputSchema },
    prompt: `You are a data analyst for a towing company called RescueAssist. Your task is to generate a summary report based on a list of recently completed jobs. Analyze the provided JSON data for jobs and users to identify trends and key metrics.

    The report should be in Swedish and formatted in clear markdown.
    
    Data provided:
    - A list of completed jobs: {{{json jobs}}}
    - A list of users: {{{json users}}}

    Please include the following sections in your report:

    ### Veckosummering

    Start with a brief, one-paragraph summary of the week's activities. Mention the total number of completed jobs.

    ### Ekonomisk Översikt

    - Totala intäkter (summan av alla 'total' kostnader).
    - Totala intäkter från självrisker.
    - Totala intäkter från övriga avgifter.

    ### Vanligaste Problem & Åtgärder

    - List the top 3 most common vehicle problems ('driverDiagnosis').
    - List the top 3 most common actions taken ('actionsTaken').

    ### Geografiska Insikter

    - List the top 3 most common job locations ('location').

    ### Prestationer

    - Identify the driver ('assignedTo') who completed the most jobs from the provided list. Look up the driver's name from the user list.

    Generate a comprehensive but easy-to-read report.
    `,
});

const generateDashboardReportFlow = ai.defineFlow(
  {
    name: 'generateDashboardReportFlow',
    inputSchema: GenerateDashboardReportInputSchema,
    outputSchema: GenerateDashboardReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
