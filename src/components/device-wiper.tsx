
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Smartphone, CheckCircle, XCircle, PauseCircle, PlayCircle, MinusCircle, Zap, Settings, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { createCertificateAction, getWipeSuggestion } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ScrollArea } from './ui/scroll-area';


type WipeStatus = 'Idle' | 'Wiping' | 'Paused' | 'Verifying' | 'Done' | 'Failed';

export function DeviceWiper() {
  const [platform, setPlatform] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [status, setStatus] = useState<WipeStatus>('Idle');
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(0);
  const [showAdvancedDialog, setShowAdvancedDialog] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState<{ wipeSuggestion: string; nistGuidance: string } | null>(null);
  const [selectedWipeMethod, setSelectedWipeMethod] = useState('NIST SP 800-88 Purge');

  const { toast } = useToast();
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSimpleWipe = () => {
    if (!platform || !serialNumber) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a platform and enter a serial number.',
      });
      return;
    }
    setSelectedWipeMethod('NIST SP 800-88 Purge');
    startWiping();
  };
  
  const handleAdvancedWipe = async () => {
    if (!platform || !serialNumber) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a platform and enter a serial number.',
      });
      return;
    }
    setShowAdvancedDialog(true);
    setIsLoadingSuggestion(true);
    const result = await getWipeSuggestion({
      fileName: `${platform} Device`,
      fileSize: serialNumber,
    });
    if (result.success && result.data) {
      setSuggestion(result.data);
      if (result.data.wipeSuggestion.includes("Purge")){
        setSelectedWipeMethod('NIST SP 800-88 Purge');
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
      setShowAdvancedDialog(false);
    }
    setIsLoadingSuggestion(false);
  };

  const startWiping = () => {
    setShowAdvancedDialog(false);
    setStatus('Wiping');
    setProgress(progress > 0 ? progress : 0);
    setEta(eta > 0 ? eta : 15);
  };

  const pauseWiping = () => {
    setStatus('Paused');
  };

  const resumeWiping = () => {
    setStatus('Wiping');
  };
  
  const cancelWiping = () => {
      setStatus('Idle');
      setProgress(0);
      setEta(0);
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (status === 'Wiping') {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 100) {
            if (interval) clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
        setEta(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);
  
  useEffect(() => {
      if (progress >= 100 && status === 'Wiping') {
        setStatus('Verifying');
        
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, status]);

  useEffect(() => {
    if (status !== 'Verifying') return;

    const generateCertificate = async () => {
        const result = await createCertificateAction({
            itemName: `${platform} Device`,
            itemSize: serialNumber,
            clientName: 'Green Wipe Demo Client',
            wipeMethod: selectedWipeMethod,
        });

        if (result.success && result.data) {
            setStatus('Done');
            toast({
                title: "Wipe Complete & Certificate Created",
                description: "Redirecting to verification page...",
            });
            router.push(`/verify?id=${result.data.certificateId}`);
        } else {
            toast({
                variant: 'destructive',
                title: 'Error creating certificate',
                description: result.error,
            });
            setStatus('Failed');
        }
    };
    generateCertificate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, platform, serialNumber, selectedWipeMethod, router, toast]);
  
  const reset = () => {
      setStatus('Idle');
      setProgress(0);
      setEta(0);
      setPlatform('');
      setSerialNumber('');
  }

  const renderContent = () => {
    switch(status) {
        case 'Wiping':
        case 'Paused':
        case 'Verifying':
            return (
                <div className="text-center space-y-4 flex flex-col items-center">
                    <Loader2 className={`h-12 w-12 text-primary ${status === 'Wiping' || status === 'Verifying' ? 'animate-spin' : ''}`} />
                    <h3 className="text-xl font-semibold">{status === 'Verifying' ? 'Creating Certificate...' : (status === 'Paused' ? 'Wipe Paused' : 'Wiping Device...')}</h3>
                    <p className="text-muted-foreground">Platform: {platform} | Serial: {serialNumber}</p>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground">ETA: {eta}s</p>
                    <div className="flex justify-center gap-2">
                        {status === 'Wiping' && <Button onClick={pauseWiping} variant="outline"><PauseCircle className="mr-2"/> Pause</Button>}
                        {status === 'Paused' && <Button onClick={resumeWiping} variant="outline"><PlayCircle className="mr-2"/> Resume</Button>}
                        {(status === 'Wiping' || status === 'Paused') && <Button onClick={cancelWiping} variant="destructive"><MinusCircle className="mr-2"/> Cancel</Button>}
                    </div>
                </div>
            )
        case 'Done':
            return (
                 <div className="text-center space-y-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <h3 className="text-xl font-semibold">Wipe Complete</h3>
                    <p className="text-muted-foreground">The remote wipe command was sent successfully.</p>
                    <Button onClick={reset}>Wipe Another Device</Button>
                </div>
            )
        case 'Failed':
             return (
                 <div className="text-center space-y-4">
                    <XCircle className="h-12 w-12 text-destructive mx-auto" />
                    <h3 className="text-xl font-semibold">Wipe Failed</h3>
                    <p className="text-muted-foreground">Could not complete the remote wipe.</p>
                    <Button onClick={reset} variant="secondary">Try Again</Button>
                </div>
            )
        case 'Idle':
        default:
            return (
                 <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Select onValueChange={setPlatform} value={platform}>
                        <SelectTrigger id="platform">
                            <SelectValue placeholder="Select a platform (e.g., Android)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="windows">Windows</SelectItem>
                            <SelectItem value="linux">Linux</SelectItem>
                            <SelectItem value="android">Android</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="serial">Device Serial Number</Label>
                        <Input
                            id="serial"
                            placeholder="Enter the device serial number"
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center gap-4 pt-4">
                        <Button className="w-full" onClick={handleSimpleWipe} disabled={!platform || !serialNumber}><Zap className="mr-2"/>Simple Wipe</Button>
                        <Button className="w-full" onClick={handleAdvancedWipe} disabled={!platform || !serialNumber} variant="secondary"><Settings className="mr-2"/>Advanced Wipe</Button>
                    </div>
                </div>
            )
    }
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Remote Device Wipe</CardTitle>
          <CardDescription>
            Securely wipe a device remotely by providing its platform and serial number.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
      
      <Dialog open={showAdvancedDialog} onOpenChange={setShowAdvancedDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Advanced Wipe Options</DialogTitle>
             <DialogDescription>
              {isLoadingSuggestion ? 'Getting AI suggestion...' : `AI-powered recommendation for wiping "${platform} Device".`}
            </DialogDescription>
          </DialogHeader>
           {isLoadingSuggestion ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            suggestion && (
              <div className="space-y-4">
                <ScrollArea className="max-h-60 w-full rounded-md border p-4">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><CheckCircle size={16} className="text-green-500" /> Suggested Procedure</h3>
                    <p className="text-sm text-muted-foreground pl-6">{suggestion.wipeSuggestion}</p>
                  </div>
                  <div className='mt-4'>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><AlertTriangle size={16} className="text-yellow-500" /> NIST SP 800-88 Guidance</h3>
                    <p className="text-sm text-muted-foreground pl-6">{suggestion.nistGuidance}</p>
                  </div>
                </ScrollArea>
                <div>
                  <h3 className="font-semibold">Wipe Method</h3>
                  <RadioGroup value={selectedWipeMethod} onValueChange={setSelectedWipeMethod} className="mt-2 space-y-1">
                    <div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="NIST SP 800-88 Purge" id="nist-purge-device" />
                        <Label htmlFor="nist-purge-device">NIST SP 800-88 Purge</Label>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">Cryptographic erase or use of dedicated hardware to purge data.</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DoD 5220.22-M (3-pass)" id="dod-3-device" />
                        <Label htmlFor="dod-3-device">DoD 5220.22-M (3-pass)</Label>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">Overwrites with a character, its complement, then random characters.</p>
                    </div>
                     <div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DoD 5220.22-M (7-pass)" id="dod-7-device" />
                        <Label htmlFor="dod-7-device">DoD 5220.22-M (7-pass)</Label>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">A more thorough version of the 3-pass DoD method.</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Gutmann method (35-pass)" id="gutmann-device" />
                        <Label htmlFor="gutmann-device">Gutmann method (35-pass)</Label>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">Extremely secure method using 35 overwrite patterns.</p>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdvancedDialog(false)}>Cancel</Button>
            <Button onClick={startWiping} disabled={isLoadingSuggestion}>
              Proceed with Wipe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
