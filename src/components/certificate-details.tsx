
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader as TableHeaderComponent } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Certificate } from "@/lib/types";
import { Download, FileJson, CheckCircle, ShieldCheck, ListChecks, Leaf, Bolt, Trash2, Loader2 } from "lucide-react";
import { incrementPdfDownloads } from '@/app/actions';

interface CertificateDetailsProps {
    certificate: Certificate;
    isAnchoring?: boolean;
}

export function CertificateDetails({ certificate, isAnchoring }: CertificateDetailsProps) {

    const downloadJson = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(certificate.reportJson)}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `${certificate.certificateId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPdf = () => {
        incrementPdfDownloads(); // Update count on download
        const { jsPDF } = require("jspdf");
        const doc = new jsPDF();
    
        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text("Certificate of Data Erasure", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.line(20, 25, 190, 25);

        // Certificate Details
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Certificate ID: ${certificate.certificateId}`, 20, 40);
        doc.text(`Client: ${certificate.clientName}`, 20, 50);
        doc.text(`Completion Date: ${new Date(certificate.wipeCompletionDate).toLocaleString()}`, 20, 60);
    
        // Item Information
        doc.setFont('helvetica', 'bold');
        doc.text("Item Information", 20, 80);
        doc.setLineWidth(0.2);
        doc.line(20, 82, 70, 82); // horizontal line
        doc.setFont('helvetica', 'normal');
        doc.text(`Item Name: ${certificate.itemName}`, 20, 90);
        doc.text(`Item Size: ${certificate.itemSize}`, 20, 100);

        // Wipe Details
        doc.setFont('helvetica', 'bold');
        doc.text("Wipe Details", 20, 120);
        doc.line(20, 122, 60, 122); // horizontal line
        doc.setFont('helvetica', 'normal');
        doc.text(`Wipe Method: ${certificate.wipeMethod}`, 20, 130);
        doc.text(`Verification: ${certificate.verificationMethod}`, 20, 140);

        // Environmental Impact Report
        doc.setFont('helvetica', 'bold');
        doc.text("Environmental Impact Report", doc.internal.pageSize.getWidth() / 2, 160, { align: 'center' });
        doc.setLineWidth(0.2);
        doc.line(70, 162, 140, 162);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('E-Waste Diverted: 0.05 kg', 20, 175);
        doc.text('CO₂ Emission Saved: 0.10 kg', 20, 185);
        doc.text('Energy Saved: 0.02 kWh', 20, 195);
        doc.setFontSize(12); // Reset font size
        
        // Blockchain Anchor
        if (certificate.anchored && certificate.transactionId) {
            doc.setFont('helvetica', 'bold');
            doc.text("Blockchain Anchor", 20, 215);
            doc.line(20, 217, 75, 217);
            doc.setFont('helvetica', 'normal');
            doc.text(`Status: Anchored`, 20, 225);
            doc.text(`TxID: ${certificate.transactionId}`, 20, 235, { maxWidth: 170 });
        }


        // Add Wipe Method Stamp
        const stampDetails: { [key: string]: { text: string, color: [number, number, number] } } = {
            'NIST SP 800-88 Purge': { text: 'NIST 800-88', color: [46, 139, 87] },
            'DoD 5220.22-M (3-pass)': { text: 'DoD 3-PASS', color: [70, 130, 180] },
            'DoD 5220.22-M (7-pass)': { text: 'DoD 7-PASS', color: [0, 0, 139] },
            'Gutmann method (35-pass)': { text: 'GUTMANN', color: [139, 0, 0] },
            'Remote Device Wipe': { text: 'REMOTE WIPE', color: [105, 105, 105] },
        };

        const stamp = stampDetails[certificate.wipeMethod];
        if (stamp) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(stamp.color[0], stamp.color[1], stamp.color[2]);
            doc.setDrawColor(stamp.color[0], stamp.color[1], stamp.color[2]);
            doc.setLineWidth(1);
            doc.circle(160, 230, 15); // Outer circle
            doc.circle(160, 230, 13); // Inner circle
            doc.text(stamp.text, 160, 228, { align: 'center' });
            doc.text('VERIFIED', 160, 234, { align: 'center' });
            doc.setTextColor(0, 0, 0); // Reset color
        }


        // Signature
        doc.setFont('helvetica', 'bold');
        doc.text("Authorized Signature:", 20, 250);

        // More realistic signature
        doc.setFont('zapfdingbats', 'normal'); 
        doc.setLineWidth(0.6);
        doc.setDrawColor(0, 0, 0); // Black ink
        const x = 25, y = 265;
        doc.lines([
            [2, -2], [5, -4], [10, 0], [13, -3], [18, 2], // S-like shape
            [22, -5], [25, 0], [28, 4], [30, 0], // h-like
            [32, -2], [35, 2], // r
            [38, -3], [40, 0], // e
            [42, -4], [45, 2], [48, -2], // y-a
        ], x, y, [1, 1]);
         doc.lines([
            [2, -3], [5, 2], [8, -4], [12, 1], // J-like
            [16, -2], [18, 0], // a
            [20, -3], [22, 1], // i
            [24, -4], [28, 3], [32, -2], // n
        ], x + 55, y, [1, 1]);
        doc.circle(x + 73, y-6, 0.5, 'F'); // Dot for 'i' in Jain

        doc.setLineWidth(0.3);
        doc.line(20, 270, 120, 270); // Signature line
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text("Shreya Jain, Chief Compliance Officer", 20, 275);
        doc.text("Green Wipe Inc.", 20, 280);

        // Footer
        doc.setFontSize(10);
        doc.text("Digitally Signed - Green Wipe Inc.", doc.internal.pageSize.getWidth() / 2, 290, { align: 'center' });
        doc.save(`${certificate.certificateId}.pdf`);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                        <CardTitle>Certificate Verified</CardTitle>
                        <CardDescription>Details for certificate ID: {certificate.certificateId}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Client</TableCell>
                            <TableCell>{certificate.clientName}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Completion Date</TableCell>
                            <TableCell>{new Date(certificate.wipeCompletionDate).toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Wipe Method</TableCell>
                            <TableCell>{certificate.wipeMethod}</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell className="font-medium">Verification</TableCell>
                            <TableCell>{certificate.verificationMethod}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <h3 className="text-lg font-semibold mt-6 mb-2">Item Details</h3>
                <Table>
                     <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Item Name</TableCell>
                            <TableCell>{certificate.itemName}</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell className="font-medium">Size</TableCell>
                            <TableCell>{certificate.itemSize}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                 <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Environmental Impact</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <Card className="bg-secondary/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center justify-center gap-2"><Trash2 size={16}/>E-Waste Diverted</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">0.05 <span className="text-sm font-normal">kg</span></p>
                            </CardContent>
                        </Card>
                         <Card className="bg-secondary/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center justify-center gap-2"><Leaf size={16}/>CO₂ Saved</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">0.10 <span className="text-sm font-normal">kg</span></p>
                            </CardContent>
                        </Card>
                         <Card className="bg-secondary/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center justify-center gap-2"><Bolt size={16}/>Energy Saved</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">0.02 <span className="text-sm font-normal">kWh</span></p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                 {(certificate.anchored || isAnchoring) && (
                    <>
                        <h3 className="text-lg font-semibold mt-6 mb-2">Blockchain Anchor</h3>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Status</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        {isAnchoring ? (
                                            <>
                                                <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
                                                <span>Pending Anchor...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="h-5 w-5 text-green-500" />
                                                <span>Anchored</span>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Transaction ID</TableCell>
                                    <TableCell className="font-mono text-xs break-all">
                                        {certificate.transactionId || 'Awaiting confirmation...'}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </>
                 )}
                 {certificate.auditTrail && certificate.auditTrail.length > 0 && (
                    <>
                        <h3 className="text-lg font-semibold mt-6 mb-2 flex items-center gap-2">
                           <ListChecks />
                           Audit Trail
                        </h3>
                        <Table>
                            <TableHeaderComponent>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Event</TableHead>
                                </TableRow>
                            </TableHeaderComponent>
                            <TableBody>
                                {certificate.auditTrail.map((log, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                        <TableCell>{log.event}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                 )}
            </CardContent>
            <CardFooter className="gap-4">
                <Button onClick={downloadPdf}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </Button>
                <Button variant="secondary" onClick={downloadJson}>
                    <FileJson className="mr-2 h-4 w-4" />
                    Download JSON
                </Button>
            </CardFooter>
        </Card>
    );
}

    

    
