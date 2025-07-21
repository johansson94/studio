
'use server';

/**
 * @fileOverview Transcribes audio to text using an AI model.
 * 
 * - transcribeAudio - A function that takes audio data and returns a transcription.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TranscribeAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio recording, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

const TranscribeAudioOutputSchema = z.object({
  transcription: z.string().describe("The transcribed text from the audio."),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;


export async function transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}

const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    // Using a model that supports audio input. Gemini 1.5 Flash is a good candidate.
    const { output } = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: [{
            text: 'Transcribe the following audio recording accurately. The language is likely Swedish. Return only the transcribed text.'
        },{
            media: {
                url: input.audioDataUri
            }
        }],
        output: {
            format: 'json',
            schema: TranscribeAudioOutputSchema
        }
    });
    
    return output!;
  }
);
