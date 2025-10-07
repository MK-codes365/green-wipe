import { z } from 'zod';

const AuditLogSchema = z.object({
    timestamp: z.string().describe('ISO 8601 date string of the event.'),
    event: z.string().describe('Description of the event.'),
});

export const CertificateSchema = z.object({
    certificateId: z.string().describe('Unique identifier for the certificate.'),
    itemName: z.string().describe('Name of the wiped item (e.g., file name or drive name).'),
    itemSize: z.string().describe('Size of the wiped item.'),
    wipeMethod: z.string().describe('The method used for data erasure (e.g., NIST SP 800-88 Purge).'),
    wipeCompletionDate: z.string().describe('ISO 8601 date string of when the wipe was completed.'),
    verificationMethod: z.string().describe('Method used to verify the wipe (e.g., Digital Signature).'),
    clientName: z.string().describe('Name of the client or organization that performed the wipe.'),
    reportJson: z.string().describe('A JSON string representing the full certificate report.'),
    anchored: z.boolean().optional().describe('Whether the certificate is anchored to a blockchain.'),
    transactionId: z.string().nullable().optional().describe('The transaction ID of the blockchain anchor.'),
    auditTrail: z.array(AuditLogSchema).optional().describe('A timestamped log of events related to the certificate.'),
});

export type Certificate = z.infer<typeof CertificateSchema>;

export const VerifyCertificateInputSchema = z.object({
  certificateId: z.string().describe('The ID of the certificate to verify.'),
});
export type VerifyCertificateInput = z.infer<typeof VerifyCertificateInputSchema>;

export const CertificateVerificationOutputSchema = z.object({
    found: z.boolean().describe('Whether the certificate was found.'),
    message: z.string().describe('A message about the verification status.'),
    certificate: CertificateSchema.optional().describe('The certificate data, if found.'),
});
export type CertificateVerificationOutput = z.infer<typeof CertificateVerificationOutputSchema>;


export const DataWipeSuggestionInputSchema = z.object({
  fileName: z.string().describe('The name of the file to be wiped.'),
  fileSize: z.string().describe('The size of the file to be wiped.'),
});
export type DataWipeSuggestionInput = z.infer<typeof DataWipeSuggestionInputSchema>;

export const DataWipeSuggestionOutputSchema = z.object({
  wipeSuggestion: z
    .string()
    .describe(
      'The suggested data wiping procedure based on the item, verified against NIST SP 800-88.'
    ),
  nistGuidance: z.string().describe('Relevant guidance from NIST SP 800-88.'),
});
export type DataWipeSuggestionOutput = z.infer<typeof DataWipeSuggestionOutputSchema>;


export const CreateCertificateInputSchema = z.object({
    itemName: z.string(),
    itemSize: z.string(),
    clientName: z.string(),
    wipeMethod: z.string(),
});
export type CreateCertificateInput = z.infer<typeof CreateCertificateInputSchema>;

export const CreateCertificateOutputSchema = z.object({
    certificateId: z.string(),
});
export type CreateCertificateOutput = z.infer<typeof CreateCertificateOutputSchema>;


export const StatsSchema = z.object({
    totalWipes: z.number(),
    pdfDownloads: z.number(),
    eWasteDiverted: z.number(),
    co2Saved: z.number(),
    energySaved: z.number(),
    treesSaved: z.number(),
    lastCertificateId: z.string(),
    wipeMethodDistribution: z.record(z.string(), z.number()).optional(),
});
export type Stats = z.infer<typeof StatsSchema>;


export const TranslationInputSchema = z.object({
  jsonContent: z.any().describe('A JSON object containing the text to be translated.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Hindi", "Spanish").'),
});
export type TranslationInput = z.infer<typeof TranslationInputSchema>;

export const TranslationOutputSchema = z.any().describe('A JSON object with the translated content.');
export type TranslationOutput = z.infer<typeof TranslationOutputSchema>;
