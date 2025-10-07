import type { Certificate } from './types';

// This is a workaround to make the in-memory database persistent across Next.js hot reloads in development.
// In a production environment, you would use a proper database like Firestore, PostgreSQL, etc.
declare global {
  var completedWipes: Map<string, Certificate> | undefined;
}

const completedWipes = global.completedWipes || (global.completedWipes = new Map<string, Certificate>());

// Pre-populate with a valid certificate for demonstration if the map is empty
if (completedWipes.size === 0) {
    const demoCertId = `GW-DEMOFILE-1KB-20240521`;
    const demoDate = new Date();
    const demoCertData: Certificate = {
        certificateId: demoCertId,
        itemName: 'demo-file.txt',
        itemSize: '1 KB',
        wipeMethod: 'NIST SP 800-88 Purge',
        wipeCompletionDate: demoDate.toISOString(),
        verificationMethod: 'Cryptographic Signature (Simulated)',
        clientName: 'Green Wipe Demo Client',
        reportJson: '',
        anchored: true,
        transactionId: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        auditTrail: [
            { timestamp: new Date(demoDate.getTime() - 5000).toISOString(), event: 'Wipe process initiated for demo-file.txt.' },
            { timestamp: new Date(demoDate.getTime() - 1000).toISOString(), event: 'Wipe completed using NIST SP 800-88 Purge.' },
            { timestamp: demoDate.toISOString(), event: 'Certificate GW-DEMOFILE-1KB-20240521 created.' },
            { timestamp: demoDate.toISOString(), event: 'Certificate anchored to blockchain.' },
        ]
    };
    // Dynamically create the JSON report
    demoCertData.reportJson = JSON.stringify(demoCertData, null, 2);
    completedWipes.set(demoCertId, demoCertData);
}


export { completedWipes };
