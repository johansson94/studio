
import { config } from 'dotenv';
config();

import '@/ai/flows/optimize-route.ts';
import '@/ai/flows/generate-receipt-message.ts';
import '@/ai/flows/generate-trip-report.ts';
import '@/ai/flows/generate-dashboard-report.ts';
import '@/ai/flows/identify-vehicle.ts';
import '@/ai/flows/transcribe-audio.ts';
import '@/ai/flows/generate-insurance-report.ts';
import '@/ai/tools/vehicle-lookup-tool.ts';
import '@/ai/flows/suggest-driver.ts';
import '@/ai/flows/categorize-job.ts';




