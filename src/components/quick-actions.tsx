
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, HardDrive } from 'lucide-react';

export function QuickActions() {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button className="w-full justify-start" asChild>
                    <Link href="/wipe">
                        <>
                            <File className="mr-4" />
                            Wipe a File
                        </>
                    </Link>
                </Button>
                <Button className="w-full justify-start" variant="secondary" asChild>
                    <Link href="/wipe">
                        <>
                            <HardDrive className="mr-4" />
                            Wipe a Drive
                        </>
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
