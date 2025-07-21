'use client'

import { JobsChart } from "@/components/jobs-chart";
import { KpiCard } from "@/components/kpi-card";
import { mockKpis, jobsChartData, mockJobs, mockUsers } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import React from "react";
import { Button } from "@/components/ui/button";
import { Bot, Loader2 } from "lucide-react";
import { generateDashboardReport } from "@/ai/flows/generate-dashboard-report";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [report, setReport] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReport(null);
    try {
      const completedJobs = mockJobs.filter(j => j.status === 'Completed').map(job => ({
        ...job,
        reportedAt: job.reportedAt.toISOString(),
        log: job.log?.map(l => ({ ...l, timestamp: l.timestamp.toISOString() }))
      }));

      const result = await generateDashboardReport({
        jobs: completedJobs,
        users: mockUsers,
      });
      setReport(result.report);
      
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte generera rapport.",
      });
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Översikt</h1>
        <p className="text-muted-foreground mt-1">
          Sammanfattning av nyckeltal och uppdragsdata.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockKpis.map((kpi) => (
          <KpiCard key={kpi.title} kpi={kpi} />
        ))}
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">AI-genererad Veckorapport</CardTitle>
          <CardDescription>
            Klicka på knappen för att analysera de senast slutförda uppdragen och generera en sammanfattning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <Button onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="animate-spin" /> : <Bot />}
            Generera Rapport
          </Button>

          {isGenerating && (
             <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Analyserar data och skapar rapport...</span>
            </div>
          )}

          {report && (
            <div className="prose prose-sm dark:prose-invert bg-secondary p-4 rounded-md">
                {/* Using dangerouslySetInnerHTML is okay here since we trust the AI source and it's for a simple markdown display */}
                <div dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br />').replace(/### (.*?)<br \/>/g, '<h3>$1</h3>').replace(/#### (.*?)<br \/>/g, '<h4>$1</h4>') }} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Uppdragsvolym per vecka</CardTitle>
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
