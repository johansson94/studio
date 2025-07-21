import { config } from 'dotenv';
config();

import '@/ai/flows/optimize-route.ts';
import '@/ai/flows/generate-receipt-message.ts';
import '@/ai/flows/generate-trip-report.ts';
import '@/ai/flows/generate-dashboard-report.ts';
