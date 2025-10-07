'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileCheck, Download, Trash2, Leaf, Bolt, Sprout } from 'lucide-react';
import { getStats } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import type { Stats as StatsType } from '@/lib/types';


export function Stats() {
    const [stats, setStats] = useState<StatsType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await getStats();
                if (result.success && result.data) {
                    setStats(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
        // Poll for updates every 2 seconds
        const interval = setInterval(fetchStats, 2000); 

        return () => clearInterval(interval);
    }, []);

    const statCards = [
        {
            title: "Total Wipes",
            value: stats?.totalWipes ?? 0,
            description: "Files & drives securely erased",
            icon: <FileCheck className="h-4 w-4 text-muted-foreground" />
        },
        {
            title: "Certificates Issued",
            value: stats?.pdfDownloads ?? 0,
            description: "Number of PDF certificates downloaded",
            icon: <Download className="h-4 w-4 text-muted-foreground" />
        },
        {
            title: "E-Waste Diverted",
            value: `${stats?.eWasteDiverted ?? 0} kg`,
            description: "By reusing drives instead of destroying them",
            icon: <Trash2 className="h-4 w-4 text-muted-foreground" />
        },
        {
            title: "CO₂ Saved",
            value: `${stats?.co2Saved ?? 0} kg`,
            description: "Estimated carbon footprint reduction",
            icon: <Leaf className="h-4 w-4 text-muted-foreground" />
        },
        {
            title: "Energy Saved",
            value: `${stats?.energySaved ?? 0} kWh`,
            description: "Energy conserved by avoiding drive manufacturing",
            icon: <Bolt className="h-4 w-4 text-muted-foreground" />
        },
        {
            title: "Tree Equivalence",
            value: `${stats?.treesSaved ?? 0} 🌱`,
            description: "Equivalent to trees planted from CO₂ reduction",
            icon: <Sprout className="h-4 w-4 text-muted-foreground" />
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           {statCards.map((card, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        {card.icon}
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-3/4" />
                        ) : (
                            <div className="text-2xl font-bold">{card.value}</div>
                        )}
                        <p className="text-xs text-muted-foreground">{card.description}</p>
                    </CardContent>
                </Card>
           ))}
        </div>
    );
}
