
import { Stats } from '@/components/stats';
import { ImpactChart } from '@/components/impact-chart';
import { QuickActions } from '@/components/quick-actions';
import { CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1 content-fade-in">
        <div className="mb-8">
            <CardTitle className="text-5xl font-bold text-primary transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_10px_hsl(var(--primary))]">Green Score</CardTitle>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Stats />
                <ImpactChart />
            </div>
            <div className="lg:col-span-1 space-y-8">
                <QuickActions />
            </div>
        </div>
      </main>
    </div>
  );
}
