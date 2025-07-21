import { NewReportForm } from "@/components/new-report-form";

export default function NewReportPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Create New Job Report</h1>
        <p className="text-muted-foreground mt-1">
          Log a new job with vehicle details, location, and description.
        </p>
      </div>
      <NewReportForm />
    </div>
  );
}
