'use server';

/**
 * @fileOverview Provides a data wipe suggestion based on file properties, verified against NIST SP 800-88.
 *
 * - dataWipeSuggestion - A function that suggests the optimal data wiping procedure.
 */

import {ai} from '@/ai/genkit';
import { DataWipeSuggestionInputSchema, DataWipeSuggestionOutputSchema, type DataWipeSuggestionInput, type DataWipeSuggestionOutput } from '@/lib/types';


export async function dataWipeSuggestion(input: DataWipeSuggestionInput): Promise<DataWipeSuggestionOutput> {
  return dataWipeSuggestionFlow(input);
}

const dataWipeSuggestionPrompt = ai.definePrompt({
  name: 'dataWipeSuggestionPrompt',
  input: {schema: DataWipeSuggestionInputSchema},
  output: {schema: DataWipeSuggestionOutputSchema},
  prompt: `You are an expert in data sanitization. Based on the file properties provided, suggest an optimal data wiping procedure that aligns with NIST SP 800-88 standards. Also provide the relevant NIST guidance for this type of digital media.

File Name: {{{fileName}}}
File Size: {{{fileSize}}}

Suggestion:`,
});

const dataWipeSuggestionFlow = ai.defineFlow(
  {
    name: 'dataWipeSuggestionFlow',
    inputSchema: DataWipeSuggestionInputSchema,
    outputSchema: DataWipeSuggestionOutputSchema,
  },
  async input => {
    const {output} = await dataWipeSuggestionPrompt(input);
    return output!;
  }
);
