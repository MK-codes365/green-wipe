
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HardDrive, Loader2, CheckCircle, AlertTriangle, ShieldCheck, XCircle, PauseCircle, PlayCircle, MinusCircle, Zap, Settings, ShieldAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  getWipeSuggestion,
  createCertificateAction,
} from '@/app/actions';
import { drives as initialDrives, type Drive } from '@/lib/data';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

type WipeStatus = 'Ready' | 'Wiping' | 'Paused' | 'Verifying' | 'Wiped' | 'Failed';

interface DriveWithStatus extends Drive {
    status: WipeStatus;
    progress: number;
    eta: number;
}


export function DriveWiper() {
  const [drives, setDrives] = useState<DriveWithStatus[]>(initialDrives.map(d => ({ ...d, status: 'Ready', progress: 0, eta: 0 })));
  const [selectedDrive, setSelectedDrive] = useState<DriveWithStatus | null>(null);
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState<{
    wipeSuggestion: string;
    nistGuidance: string;
  } | null>(null);
  const [selectedWipeMethod, setSelectedWipeMethod] = useState('NIST SP 800-88 Purge');

  const { toast } = useToast();
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleWipeAttempt = (drive: DriveWithStatus, isAdvanced: boolean) => {
    if (drive.isBoot) {
      toast({
        variant: 'destructive',
        title: 'Unsafe Attempt',
        description: 'Cannot wipe the boot drive. Please select a different drive.',
      });
      return;
    }
    // Reset failed status if user tries again
    if (drive.status === 'Failed') {
      setDrives((prevDrives) =>
        prevDrives.map((d) =>
          d.id === drive.id ? { ...d, status: 'Ready', progress: 0 } : d
        )
      );
    }
    
    if (isAdvanced) {
      handleAdvancedWipeClick(drive);
    } else {
      handleSimpleWipeClick(drive);
    }
  };


  const handleAdvancedWipeClick = async (drive: DriveWithStatus) => {
    setSelectedDrive(drive);
    setShowSuggestionDialog(true);
    setIsLoadingSuggestion(true);
    const result = await getWipeSuggestion({
      fileName: drive.name,
      fileSize: drive.size,
    });
    if (result.success && result.data) {
      setSuggestion(result.data);
      if (result.data.wipeSuggestion.includes("Purge")){
        setSelectedWipeMethod('NIST SP 800-88 Purge')
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setShowSuggestionDialog(false);
    }
    setIsLoadingSuggestion(false);
  };
  
  const handleSimpleWipeClick = (drive: DriveWithStatus) => {
    setSelectedWipeMethod('NIST SP 800-88 Purge'); // Default for simple wipe
    startWiping(drive);
  }

  const startWiping = (drive: DriveWithStatus) => {
    setShowSuggestionDialog(false);
    setDrives((prevDrives) =>
      prevDrives.map((d) =>
        d.id === drive.id ? { ...d, status: 'Wiping', progress: d.progress > 0 ? d.progress : 0, eta: d.eta > 0 ? d.eta : 30 } : d
      )
    );
  };
  
  const pauseWiping = (driveId: string) => {
    setDrives((prevDrives) =>
      prevDrives.map((d) =>
        d.id === driveId ? { ...d, status: 'Paused' } : d
      )
    );
  };
  
  const resumeWiping = (drive: DriveWithStatus) => {
    setDrives((prevDrives) =>
      prevDrives.map((d) =>
        d.id === drive.id ? { ...d, status: 'Wiping' } : d
      )
    );
  };

  const cancelWiping = (driveId: string) => {
    setDrives((prevDrives) =>
        prevDrives.map((d) =>
          d.id === driveId ? { ...d, status: 'Ready', progress: 0, eta: 0 } : d
        )
      );
  };


  useEffect(() => {
    const wipingDrive = drives.find(d => d.status === 'Wiping');

    if (wipingDrive) {
        intervalRef.current = setInterval(() => {
            setDrives(prevDrives => prevDrives.map(d => {
                if (d.id === wipingDrive.id && d.status === 'Wiping') {
                    const newProgress = d.progress + (Math.random() * 5);
                    const newEta = d.eta - 1;
                    if (newProgress >= 100) {
                        return { ...d, status: 'Verifying', progress: 100, eta: 0 };
                    }
                    return { ...d, progress: newProgress, eta: newEta > 0 ? newEta : 0 };
                }
                return d;
            }));
        }, 1000);
    } else {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }
    
    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };
  }, [drives]);


  useEffect(() => {
    const driveToVerify = drives.find(d => d.status === 'Verifying');

    if (driveToVerify) {
        const generateCertificate = async () => {
            if (!driveToVerify) return;
            
            const result = await createCertificateAction({
              itemName: `${driveToVerify.name} (${driveToVerify.model})`,
              itemSize: driveToVerify.size,
              clientName: 'Green Wipe Demo Client',
              wipeMethod: selectedWipeMethod,
            });
    
            if (result.success && result.data) {
               setDrives((prevDrives) =>
                prevDrives.map((d) =>
                  d.id === driveToVerify.id ? { ...d, status: 'Wiped', progress: 100 } : d
                )
              );
              router.push(`/verify?id=${result.data.certificateId}`);
            } else {
              toast({
                variant: 'destructive',
                title: 'Error creating certificate',
                description: result.error,
              });
              setDrives((prevDrives) =>
                prevDrives.map((d) =>
                  d.id === driveToVerify.id ? { ...d, status: 'Failed', progress: 0 } : d
                )
              );
            }
            setSelectedDrive(null);
          };
      generateCertificate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drives, router]);

  const getStatusIcon = (drive: DriveWithStatus) => {
    switch (drive.status) {
      case 'Wiping':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />;
      case 'Paused':
          return <PauseCircle className="h-4 w-4 text-yellow-500" />;
      case 'Verifying':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'Wiped':
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
         return <CheckCircle className="h-4 w-4 text-green-500 opacity-50" />;
    }
  };

  const getStatusText = (drive: DriveWithStatus) => {
     switch (drive.status) {
      case 'Wiping':
        return 'In Progress';
      case 'Paused':
        return 'Paused';
      case 'Verifying':
        return 'Verifying';
      case 'Wiped':
        return 'Wiped';
      case 'Failed':
        return 'Failed';
       case 'Ready':
        return 'Ready to Wipe';
      default:
        return 'Ready';
    }
  }

  const isAnyDriveWiping = drives.some(d => d.status === 'Wiping' || d.status === 'Paused' || d.status === 'Verifying');

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            {drives.map((drive) => (
              <div
                key={drive.id}
                className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 rounded-lg bg-secondary"
              >
                <div className="flex w-full md:w-auto items-center gap-4">
                  <HardDrive className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-grow">
                    <p className="font-semibold flex items-center gap-2">{drive.name} <span className="text-xs font-mono text-muted-foreground">({drive.id})</span> {drive.isBoot && <ShieldAlert size={16} className="text-yellow-500" title="Boot Drive"/>}</p>
                    <p className="text-sm text-muted-foreground">
                      {drive.model} - {drive.size} ({drive.type})
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                   <div className="flex items-center justify-center gap-2 w-full md:w-32">
                      {getStatusIcon(drive)}
                      <span className="text-sm">{getStatusText(drive)}</span>
                  </div>
                  {drive.status === 'Wiping' || drive.status === 'Paused' || drive.status === 'Verifying' ? (
                    <div className="w-full md:w-64 flex items-center gap-4">
                      <div className="flex-grow">
                        <Progress value={drive.status === 'Verifying' ? 100 : drive.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground text-center mt-1">ETA: {drive.eta}s</p>
                      </div>
                      {drive.status === 'Wiping' && (
                        <Button size="icon" variant="ghost" onClick={() => pauseWiping(drive.id)}><PauseCircle/></Button>
                      )}
                      {drive.status === 'Paused' && (
                        <Button size="icon" variant="ghost" onClick={() => resumeWiping(drive)}><PlayCircle/></Button>
                      )}
                      {(drive.status === 'Wiping' || drive.status === 'Paused') && (
                        <Button size="icon" variant="destructive" onClick={() => cancelWiping(drive.id)}><MinusCircle/></Button>
                      )}
                    </div>
                  ) : ( drive.status !== 'Wiped' && (
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                        <Button
                          size="sm"
                          onClick={() => handleWipeAttempt(drive, false)}
                          disabled={isAnyDriveWiping}
                          className="w-full sm:w-auto"
                        >
                          <Zap className="mr-2 h-4 w-4"/>Simple Wipe
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleWipeAttempt(drive, true)}
                          disabled={isAnyDriveWiping}
                          className="w-full sm:w-auto"
                        >
                          <Settings className="mr-2 h-4 w-4"/>Advanced Wipe
                        </Button>
                    </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={showSuggestionDialog}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setShowSuggestionDialog(false);
                setSelectedDrive(null);
            }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Advanced Wipe Options</DialogTitle>
            <DialogDescription>
              {isLoadingSuggestion
                ? 'Getting AI suggestion...'
                : `AI-powered recommendation for wiping "${selectedDrive?.name}".`}
            </DialogDescription>
          </DialogHeader>
          {isLoadingSuggestion ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            suggestion && selectedDrive && (
              <div className="space-y-4">
                <ScrollArea className="max-h-60 w-full rounded-md border p-4">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <CheckCircle size={16} className="text-green-500" />{' '}
                      Suggested Procedure
                    </h3>
                    <p className="text-sm text-muted-foreground pl-6">
                      {suggestion.wipeSuggestion}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <AlertTriangle size={16} className="text-yellow-500" /> NIST
                      SP 800-88 Guidance
                    </h3>
                    <p className="text-sm text-muted-foreground pl-6">
                      {suggestion.nistGuidance}
                    </p>
                  </div>
                </ScrollArea>
                <div>
                  <h3 className="font-semibold">Wipe Method</h3>
                  <RadioGroup value={selectedWipeMethod} onValueChange={setSelectedWipeMethod} className="mt-2 space-y-1">
                     <div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="NIST SP 800-88 Purge" id="nist-purge-drive" />
                        <Label htmlFor="nist-purge-drive">NIST SP 800-88 Purge</Label>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">Cryptographic erase or use of dedicated hardware to purge data.</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DoD 5220.22-M (3-pass)" id="dod-3-drive" />
                        <Label htmlFor="dod-3-drive">DoD 5220.22-M (3-pass)</Label>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">Overwrites with a character, its complement, then random characters.</p>
                    </div>
                     <div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DoD 5220.22-M (7-pass)" id="dod-7-drive" />
                        <Label htmlFor="dod-7-drive">DoD 5220.22-M (7-pass)</Label>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">A more thorough version of the 3-pass DoD method.</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Gutmann method (35-pass)" id="gutmann-drive" />
                        <Label htmlFor="gutmann-drive">Gutmann method (35-pass)</Label>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">Extremely secure method using 35 overwrite patterns.</p>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSuggestionDialog(false);
                setSelectedDrive(null);
            }}
            >
              Cancel
            </Button>
            <Button onClick={() => {
                if (selectedDrive) {
                    startWiping(selectedDrive);
                }
            }} disabled={isLoadingSuggestion}>
              Proceed with Wipe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
