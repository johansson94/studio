'use server';

/**
 * @fileOverview Generates a formal insurance report for a completed job.
 * 
 * - generateInsuranceReport - A function that takes a job object and returns a formatted report.
 * - GenerateInsuranceReportInput - The input type for the generateInsuranceReport function.
 * - GenerateInsuranceReportOutput - The return type for the generateInsuranceReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const JobSchemaForReport = z.object({
  id: z.string(),
  customer: z.object({
    name: z.string(),
    phone: z.string(),
  }),
  vehicle: z.object({
    make: z.string(),
    model: z.string(),
    licensePlate: z.string(),
    vin: z.string().optional(),
    mileage: z.number(),
  }),
  location: z.string(),
  destination: z.string(),
  description: z.string(),
  reportedAt: z.string(),
  insuranceCompany: z.string().optional(),
  actionsTaken: z.array(z.string()).optional(),
  driverDiagnosis: z.array(z.string()).optional(),
  costs: z.object({
    deductible: z.number(),
    otherFees: z.number(),
    total: z.number(),
    paidOnSite: z.boolean(),
  }).optional(),
});

const GenerateInsuranceReportInputSchema = z.object({
  job: JobSchemaForReport.describe("The job object to generate a report for."),
});
export type GenerateInsuranceReportInput = z.infer<typeof GenerateInsuranceReportInputSchema>;

const GenerateInsuranceReportOutputSchema = z.object({
  report: z.string().describe("A comprehensive report in markdown format, suitable for an insurance company."),
});
export type GenerateInsuranceReportOutput = z.infer<typeof GenerateInsuranceReportOutputSchema>;

export async function generateInsuranceReport(input: GenerateInsuranceReportInput): Promise<GenerateInsuranceReportOutput> {
  return generateInsuranceReportFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateInsuranceReportPrompt',
    input: { schema: GenerateInsuranceReportInputSchema },
    output: { schema: GenerateInsuranceReportOutputSchema },
    prompt: `You are an administrator for a towing company called RescueAssist. 
    Your task is to generate a formal and detailed report for an insurance company based on a completed job.
    The report must be in Swedish.

    Use the following job data to create the report:
    {{{json job}}}

    Structure the report clearly in markdown format with the following sections:

    ## Skadeanmälan Bärgning - Ärende: {{job.id}}

    ### 1. Grundläggande Information
    - **Ärendenummer:** {{job.id}}
    - **Rapporterad:** {{job.reportedAt}}
    - **Försäkringsbolag:** {{job.insuranceCompany}}

    ### 2. Försäkringstagare & Fordon
    - **Kundens Namn:** {{job.customer.name}}
    - **Kundens Telefon:** {{job.customer.phone}}
    - **Fordon:** {{job.vehicle.make}} {{job.vehicle.model}}
    - **Registreringsnummer:** {{job.vehicle.licensePlate}}
    - **VIN-kod:** {{job.vehicle.vin}}
    - **Mätarställning:** {{job.vehicle.mileage}} km

    ### 3. Händelseförlopp
    - **Haveriplats:** {{job.location}}
    - **Kundens Beskrivning:** {{job.description}}
    - **Destination:** {{job.destination}}

    ### 4. Vår Bedömning & Åtgärder
    - **Förarens Diagnos på Plats:**
      {{#each job.driverDiagnosis}}
      - {{this}}
      {{/each}}
    - **Vidtagna Åtgärder:**
      {{#each job.actionsTaken}}
      - {{this}}
      {{/each}}

    ### 5. Kostnadsspecifikation
    {{#if job.costs}}
    - **Självrisk:** {{job.costs.deductible}} SEK
    - **Övriga avgifter (specificerat som milkostnad/arbete):** {{job.costs.otherFees}} SEK
    - **Totalsumma:** {{job.costs.total}} SEK
    - **Status:** {{#if job.costs.paidOnSite}}Betalad på plats av kund{{else}}Faktureras{{/if}}
    {{else}}
    - Inga kostnader specificerade.
    {{/if}}

    ---
    Med vänlig hälsning,
    RescueAssist AB
    `,
});

const generateInsuranceReportFlow = ai.defineFlow(
  {
    name: 'generateInsuranceReportFlow',
    inputSchema: GenerateInsuranceReportInputSchema,
    outputSchema: GenerateInsuranceReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
