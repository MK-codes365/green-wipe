
'use client';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileCheck2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { verifyCertificateAction, anchorCertificateAction } from '@/app/actions';
import type { Certificate } from '@/lib/types';
import { CertificateDetails } from '@/components/certificate-details';

function VerifyComponent() {
  const searchParams = useSearchParams();
  const idFromQuery = searchParams.get('id');


  const [certificateId, setCertificateId] = useState(idFromQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const { toast } = useToast();

  const handleVerify = useCallback(async (idToVerify: string) => {
    if (!idToVerify) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a Certificate ID.",
      });
      return;
    }
    setIsLoading(true);
    setCertificate(null);
    const result = await verifyCertificateAction({ certificateId: idToVerify });
    if (result.success && result.data) {
      setCertificate(result.data);
      // If found but not anchored, start the anchoring process
      if (!result.data.anchored) {
        setIsAnchoring(true);
        await anchorCertificateAction({certificateId: idToVerify});
        // No need to set isAnchoring to false, polling will handle the UI update
      }
    } else {
      setCertificate(null);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: result.error,
      });
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);
  
  // Effect to trigger verification when component mounts with an ID
  useEffect(() => {
    if (idFromQuery) {
        setCertificateId(idFromQuery);
        handleVerify(idFromQuery);
    }
  }, [idFromQuery, handleVerify]);

  // Effect for polling when anchoring
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isAnchoring) {
        interval = setInterval(async () => {
            const result = await verifyCertificateAction({ certificateId: certificateId });
            if (result.success && result.data?.anchored) {
                setCertificate(result.data);
                setIsAnchoring(false);
                clearInterval(interval);
                 toast({
                    title: "Blockchain Anchor Confirmed",
                    description: "The certificate is now securely anchored.",
                });
            }
        }, 2000); // Poll every 2 seconds
    }
    return () => {
        if (interval) clearInterval(interval);
    };
  }, [isAnchoring, certificateId, toast]);


  return (
    <div className="flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-4 content-fade-in">
        <Card className="w-full max-w-md">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <FileCheck2 className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>Verify Wipe Certificate</CardTitle>
                        <CardDescription>Enter the certificate ID to verify its authenticity.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleVerify(certificateId); }}>
                    <div className="space-y-4">
                        <Input 
                        placeholder="Certificate ID (e.g., GW-DEMOFILE-1KB-20240521)" 
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                        disabled={isLoading || isAnchoring}
                        />
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={() => handleVerify(certificateId)} disabled={isLoading || isAnchoring}>
                    {(isLoading || isAnchoring) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Verifying...' : (isAnchoring ? 'Anchoring...' : 'Verify')}
                </Button>
            </CardFooter>
        </Card>

        {certificate && (
            <div className="mt-8 w-full max-w-4xl">
               <CertificateDetails certificate={certificate} isAnchoring={isAnchoring} />
            </div>
        )}
      </main>
    </div>
  );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <VerifyComponent />
        </Suspense>
    )
}
