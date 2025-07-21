import { JobsChart } from "@/components/jobs-chart";
import { KpiCard } from "@/components/kpi-card";
import { mockKpis, jobsChartData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Reporting Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Summary of key performance metrics and job data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockKpis.map((kpi) => (
          <KpiCard key={kpi.title} kpi={kpi} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Weekly Job Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <JobsChart data={jobsChartData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
