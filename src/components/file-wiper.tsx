
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getWipeSuggestion, createCertificateAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent } from '@/components/ui/card';
import { FileUp, Loader2, CheckCircle, AlertTriangle, File as FileIcon, PlayCircle, PauseCircle, MinusCircle, Zap, Settings } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';


type WipeStatus = 'Idle' | 'Wiping' | 'Paused' | 'Verifying' | 'Done';

export function FileWiper() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState<{ wipeSuggestion: string; nistGuidance: string } | null>(null);
  const [selectedWipeMethod, setSelectedWipeMethod] = useState('NIST SP 800-88 Purge');

  const [wipeStatus, setWipeStatus] = useState<WipeStatus>('Idle');
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(0);

  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAdvancedWipeClick = async (file: File) => {
    setShowSuggestionDialog(true);
    setIsLoadingSuggestion(true);
    const result = await getWipeSuggestion({
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(2)} KB`
    });
    if (result.success && result.data) {
      setSuggestion(result.data);
      // Set default wipe method based on suggestion if available
      if(result.data.wipeSuggestion.includes("Purge")){
          setSelectedWipeMethod('NIST SP 800-88 Purge');
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
      setShowSuggestionDialog(false);
    }
    setIsLoadingSuggestion(false);
  };
  
  const handleSimpleWipeClick = (file: File) => {
    setSelectedWipeMethod('NIST SP 800-88 Purge'); // Default for simple wipe
    startWiping();
  };

  const startWiping = () => {
    if (!selectedFile) return;
    setShowSuggestionDialog(false);
    setWipeStatus('Wiping');
    setProgress(progress > 0 ? progress : 0);
    setEta(eta > 0 ? eta : 15);
  };

  const pauseWiping = () => {
    setWipeStatus('Paused');
  };

  const resumeWiping = () => {
    setWipeStatus('Wiping');
  };

  const cancelWiping = () => {
    setWipeStatus('Idle');
    setProgress(0);
    setEta(0);
    setSelectedFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (wipeStatus === 'Wiping') {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 100) {
            return 100;
          }
          return newProgress;
        });
        setEta(prev => (prev > 0 ? prev - 1 : 0));
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
  }, [wipeStatus]);


  useEffect(() => {
    if (progress >= 100 && wipeStatus === 'Wiping') {
      setWipeStatus('Verifying');
      const generateCertificate = async () => {
        if (!selectedFile) return;
        const result = await createCertificateAction({
          itemName: selectedFile.name,
          itemSize: `${(selectedFile.size / 1024).toFixed(2)} KB`,
          clientName: 'Green Wipe Demo Client',
          wipeMethod: selectedWipeMethod,
        });

        if (result.success && result.data) {
          router.push(`/verify?id=${result.data.certificateId}`);
        } else {
          toast({
            variant: 'destructive',
            title: 'Error creating certificate',
            description: result.error,
          });
          // Reset state on failure
          setWipeStatus('Idle');
          setSelectedFile(null);
          setProgress(0);
        }
      };
      generateCertificate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, selectedFile, wipeStatus, router]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderContent = () => {
    switch(wipeStatus) {
        case 'Wiping':
        case 'Paused':
        case 'Verifying':
            return (
                <div className="space-y-4">
                    <div className="flex justify-center items-center">
                        <Loader2 className={`h-12 w-12 text-primary ${wipeStatus === 'Wiping' || wipeStatus === 'Verifying' ? 'animate-spin' : ''}`} />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tighter">
                        {wipeStatus === 'Verifying' ? 'Verifying Certificate...' : (wipeStatus === 'Paused' ? 'Wipe Paused' : 'Wiping File...')}
                    </h3>
                    <p className="text-muted-foreground">{selectedFile?.name}</p>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground">ETA: {eta}s</p>
                    <div className="flex justify-center gap-2">
                        {wipeStatus === 'Wiping' && <Button onClick={pauseWiping} variant="outline"><PauseCircle /> Pause</Button>}
                        {wipeStatus === 'Paused' && <Button onClick={resumeWiping} variant="outline"><PlayCircle /> Resume</Button>}
                        <Button onClick={cancelWiping} variant="destructive"><MinusCircle /> Cancel</Button>
                    </div>
                </div>
            );
        case 'Idle':
        default:
            return selectedFile ? (
                 <div className="space-y-4">
                    <div className="flex justify-center items-center">
                        <FileIcon className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tighter">{selectedFile.name}</h3>
                    <p className="text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                    <p className="text-sm text-green-500">Ready for secure wiping!</p>
                    <div className="flex flex-col items-center gap-4 pt-4">
                        <Button className="w-full" onClick={() => handleSimpleWipeClick(selectedFile)}><Zap />Simple Wipe</Button>
                        <Button className="w-full" onClick={() => handleAdvancedWipeClick(selectedFile)} variant="secondary"><Settings />Advanced Wipe</Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="flex justify-center items-center">
                        <FileUp className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tighter">Select a file to wipe</h3>
                    <p className="text-muted-foreground">Click here to choose a file from your device.</p>
                </div>
            );
    }
  }


  return (
    <>
      <Card
        className="w-full max-w-2xl mx-auto border-2 border-dashed hover:border-primary transition-colors cursor-pointer"
        onClick={() => wipeStatus === 'Idle' && !selectedFile && fileInputRef.current?.click()}
      >
        <CardContent className="p-6 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={wipeStatus !== 'Idle'}
          />
          {renderContent()}
        </CardContent>
      </Card>

      <Dialog open={showSuggestionDialog} onOpenChange={(isOpen) => { if (!isOpen) { setShowSuggestionDialog(false); }}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Advanced Wipe Options</DialogTitle>
            <DialogDescription>
              {isLoadingSuggestion ? 'Getting AI suggestion...' : `AI-powered recommendation for wiping "${selectedFile?.name}".`}
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
                        <RadioGroupItem value="NIST SP 800-88 Purge" id="nist-purge" />
                        <Label htmlFor="nist-purge">NIST SP 800-88 Purge</Label>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">Cryptographic erase or use of dedicated hardware to purge data.</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DoD 5220.22-M (3-pass)" id="dod-3" />
                        <Label htmlFor="dod-3">DoD 5220.22-M (3-pass)</Label>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">Overwrites with a character, its complement, then random characters.</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DoD 5220.22-M (7-pass)" id="dod-7" />
                        <Label htmlFor="dod-7">DoD 5220.22-M (7-pass)</Label>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">A more thorough version of the 3-pass DoD method.</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Gutmann method (35-pass)" id="gutmann" />
                        <Label htmlFor="gutmann">Gutmann method (35-pass)</Label>                      </div>
                      <p className="text-xs text-muted-foreground pl-6">Extremely secure method using 35 overwrite patterns.</p>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {setShowSuggestionDialog(false);}}>Cancel</Button>
            <Button onClick={startWiping} disabled={isLoadingSuggestion}>
              Proceed with Wipe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
