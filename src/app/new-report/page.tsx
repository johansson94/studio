import { NewReportForm } from "@/components/new-report-form";

export default function NewReportPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Skapa ny uppdragsrapport</h1>
        <p className="text-muted-foreground mt-1">
          Logga ett nytt uppdrag med fordonsdetaljer, plats och beskrivning.
        </p>
      </div>
      <NewReportForm />
    </div>
  );
}
