
'use server';
/**
 * @fileOverview Manages generation and verification of data wipe certificates.
 * 
 * - verifyCertificate - Verifies a certificate by its ID.
 * - createCertificate - Creates a new certificate for a wiped item.
 * - anchorCertificate - Anchors a certificate to the (simulated) blockchain.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { type CreateCertificateInput, type Certificate, type CertificateVerificationOutput } from '@/lib/types';
import { completedWipes } from '@/lib/db';


// Tool for creating a certificate
const createCertificateTool = ai.defineTool(
    {
        name: 'createCertificateTool',
        description: 'Creates a new data wipe certificate in the system and returns its ID.',
        inputSchema: z.object({
            itemName: z.string(),
            itemSize: z.string(),
            clientName: z.string(),
            wipeMethod: z.string(),
        }),
        outputSchema: z.object({ certificateId: z.string() }),
    },
    async (input) => {
        const date = new Date();
        const dateString = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
        // Sanitize inputs for ID generation
        const safeItemName = input.itemName.replace(/[^a-zA-Z0-9.]/g, '').toUpperCase().split('.')[0];
        const safeItemSize = input.itemSize.replace(/\s/g, '');
        const certificateId = `GW-${safeItemName}-${safeItemSize}-${dateString}`;

        const newCertificate: Certificate = {
            ...input,
            certificateId,
            wipeCompletionDate: date.toISOString(),
            verificationMethod: 'Cryptographic Signature (Simulated)',
            reportJson: '', // Will be populated when verified
            anchored: false, // Start as not anchored
            transactionId: null, // No transaction ID initially
            auditTrail: [
                { timestamp: new Date(date.getTime() - 5000).toISOString(), event: `Wipe process initiated for ${input.itemName}.` },
                { timestamp: new Date(date.getTime() - 1000).toISOString(), event: `Wipe completed using ${input.wipeMethod}.` },
                { timestamp: date.toISOString(), event: `Certificate ${certificateId} created.` },
            ]
        };
        
        // Dynamically create the JSON report
        newCertificate.reportJson = JSON.stringify(newCertificate, null, 2);

        completedWipes.set(certificateId, newCertificate);
        console.log(`Created certificate with ID: ${certificateId}`);
        return { certificateId };
    }
);

const creationPrompt = ai.definePrompt({
    name: 'certificateCreationPrompt',
    input: { schema: z.object({
        itemName: z.string(),
        itemSize: z.string(),
        clientName: z.string(),
        wipeMethod: z.string(),
    }) },
    output: { schema: z.object({ certificateId: z.string() }) },
    tools: [createCertificateTool],
    prompt: `A file wipe has been completed. Use the createCertificateTool to generate a new certificate with the provided details and return the certificate ID.
    
    Item Name: {{{itemName}}}
    Item Size: {{{itemSize}}}
    Client Name: {{{clientName}}}
    Wipe Method: {{{wipeMethod}}}
    `
});

export const createCertificateFlow = ai.defineFlow(
    {
        name: 'createCertificateFlow',
        inputSchema: z.object({
            itemName: z.string(),
            itemSize: z.string(),
            clientName: z.string(),
            wipeMethod: z.string(),
        }),
        outputSchema: z.object({ certificateId: z.string() }),
    },
    async (input) => {
        const result = await creationPrompt(input);
        const output = result.output;
        if (!output) {
            throw new Error('Failed to create certificate.');
        }
        return output;
    }
);

export const anchorCertificateFlow = ai.defineFlow({
    name: 'anchorCertificateFlow',
    inputSchema: z.string(),
    outputSchema: z.object({
        success: z.boolean(),
        transactionId: z.string().optional(),
    }),
}, async (certificateId) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 5000));

    const certificate = completedWipes.get(certificateId);
    if (!certificate) {
        return { success: false };
    }

    const transactionId = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const updatedCertificate: Certificate = {
        ...certificate,
        anchored: true,
        transactionId: transactionId,
        auditTrail: [
            ...(certificate.auditTrail || []),
            { timestamp: new Date().toISOString(), event: 'Certificate anchored to blockchain.' },
        ],
    };
    updatedCertificate.reportJson = JSON.stringify(updatedCertificate, null, 2);

    completedWipes.set(certificateId, updatedCertificate);
    console.log(`Anchored certificate ${certificateId} with txID: ${transactionId}`);
    
    return { success: true, transactionId };
});


// Wrapper function for use in server actions - direct data access
export async function verifyCertificate(certificateId: string): Promise<CertificateVerificationOutput> {
    console.log(`Verifying certificate with ID: ${certificateId}`);
    const certificate = completedWipes.get(certificateId);

    if (certificate) {
        return {
            found: true,
            message: 'Certificate verified successfully.',
            certificate: certificate,
        };
    } else {
        const validIds = Array.from(completedWipes.keys()).join(', ');
        return {
            found: false,
            message: `Certificate not found. Please check the ID and try again. Valid demo ID: ${validIds}`,
        };
    }
}

// Wrapper function for use in server actions
export async function createCertificate(input: CreateCertificateInput): Promise<{ certificateId: string }> {
    return createCertificateFlow(input);
}

export async function anchorCertificate(certificateId: string): Promise<{ success: boolean; transactionId?: string; }> {
    return anchorCertificateFlow(certificateId);
}
