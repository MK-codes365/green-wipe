
'use server';

import { dataWipeSuggestion } from '@/ai/flows/data-wipe-suggestion';
import { verifyCertificate, createCertificate, anchorCertificate } from '@/ai/flows/certificate-flow';
import type { DataWipeSuggestionInput, VerifyCertificateInput, CreateCertificateInput, Stats } from '@/lib/types';


// This is a workaround to make the in-memory stats persistent across Next.js hot reloads in development.
// In a production environment, you would use a proper database.
declare global {
  var appStats: Stats | undefined;
  var chartData: any[] | undefined;
}

const initialStats: Stats = {
    totalWipes: 0,
    pdfDownloads: 0,
    eWasteDiverted: 0,
    co2Saved: 0,
    energySaved: 0,
    treesSaved: 0,
    lastCertificateId: '',
    wipeMethodDistribution: {}
};

const initialChartData = [
    { date: "Start", totalWipes: 0, co2Saved: 0, eWasteDiverted: 0, energySaved: 0 },
];

// Use the global object to persist stats in development
if (typeof global.appStats === 'undefined') {
  global.appStats = initialStats;
}
const stats = global.appStats!;

if (typeof global.chartData === 'undefined') {
    global.chartData = [...initialChartData];
}
const chartData = global.chartData!;


// Function to reset stats if needed (for development/testing)
export async function resetStats() {
    global.appStats = { ...initialStats };
    global.chartData = [...initialChartData];
    return { success: true, data: global.appStats };
}


// Constants for environmental impact simulation
const EWASTE_PER_WIPE_KG = 0.05; // 50 grams
const CO2_PER_WIPE_KG = 0.1; // 100 grams
const ENERGY_PER_WIPE_KWH = 0.02; // 0.02 kWh
const WIPES_PER_TREE = 50; // Equivalent of 1 tree planted for every 50 wipes

export async function getStats() {
    return { success: true, data: stats };
}

export async function getChartData() {
    return { success: true, data: chartData };
}

export async function incrementWipes(wipeMethod: string) {
    stats.totalWipes++;
    stats.eWasteDiverted = parseFloat((stats.eWasteDiverted + EWASTE_PER_WIPE_KG).toFixed(2));
    stats.co2Saved = parseFloat((stats.co2Saved + CO2_PER_WIPE_KG).toFixed(2));
    stats.energySaved = parseFloat((stats.energySaved + ENERGY_PER_WIPE_KWH).toFixed(2));
    stats.treesSaved = Math.floor(stats.totalWipes / WIPES_PER_TREE);

    if (stats.wipeMethodDistribution) {
        stats.wipeMethodDistribution[wipeMethod] = (stats.wipeMethodDistribution[wipeMethod] || 0) + 1;
    }
    
    // Add a new data point for the chart
    chartData.push({
        date: `Wipe ${stats.totalWipes}`,
        totalWipes: stats.totalWipes,
        co2Saved: stats.co2Saved,
        eWasteDiverted: stats.eWasteDiverted,
        energySaved: stats.energySaved,
    });
    
    // Keep the chart data from getting too large for this demo
    if(chartData.length > 20) {
        chartData.shift();
    }

    return { success: true, data: stats };
}

export async function incrementPdfDownloads() {
    stats.pdfDownloads++;
    return { success: true, data: stats };
}


export async function getWipeSuggestion(input: DataWipeSuggestionInput) {
    try {
        const result = await dataWipeSuggestion(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("AI suggestion failed:", error);
        // Ensure a serializable error message is returned
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during AI suggestion.";
        return { success: false, error: errorMessage };
    }
}

export async function verifyCertificateAction(input: VerifyCertificateInput) {
    try {
      const result = await verifyCertificate(input.certificateId);
      if (result.found && result.certificate) {
        return { success: true, data: result.certificate };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error("Certificate verification failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unknown error occurred during verification.';
      return { success: false, error: errorMessage };
    }
}

export async function anchorCertificateAction(input: { certificateId: string }) {
    try {
        const result = await anchorCertificate(input.certificateId);
        return { success: result.success };
    } catch (error) {
        console.error("Certificate anchoring failed:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during anchoring.";
        return { success: false, error: errorMessage };
    }
}

export async function createCertificateAction(input: CreateCertificateInput) {
    try {
        const result = await createCertificate(input);
        if (result && result.certificateId) {
            stats.lastCertificateId = result.certificateId; // Store the new certificate ID
            await incrementWipes(input.wipeMethod || 'N/A');
            return { success: true, data: { certificateId: result.certificateId } };
        }
        throw new Error("Certificate creation did not return a certificate ID.");

    } catch (error) {
        console.error("Certificate creation failed:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during creation.";
        return { success: false, error: errorMessage };
    }
}

    