
import { FileWiper } from '@/components/file-wiper';
import { DriveWiper } from '@/components/drive-wiper';
import { DeviceWiper } from '@/components/device-wiper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, HardDrive, Smartphone } from 'lucide-react';

export default function WipePage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1 flex flex-col items-center content-fade-in">
        <Tabs defaultValue="file" className="w-full max-w-2xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="file">
              <File className="mr-2" />
              Wipe a File
            </TabsTrigger>
            <TabsTrigger value="drive">
              <HardDrive className="mr-2" />
              Wipe a Drive
            </TabsTrigger>
            <TabsTrigger value="device">
              <Smartphone className="mr-2" />
              Wipe a Device
            </TabsTrigger>
          </TabsList>
          <TabsContent value="file" className="mt-6">
            <FileWiper />
          </TabsContent>
          <TabsContent value="drive" className="mt-6">
            <DriveWiper />
          </TabsContent>
          <TabsContent value="device" className="mt-6">
            <DeviceWiper />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
