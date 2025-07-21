import { LiveMap } from "@/components/live-map";
import { mockJobs, mockUsers } from "@/lib/mock-data";

export default function LiveMapPage() {
  const drivers = mockUsers.filter(user => user.role === 'Driver' && user.position);
  const newJobs = mockJobs.filter(job => job.status === 'New');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Livekarta</h1>
        <p className="text-muted-foreground mt-1">
          Realtidsöversikt av förare och nya uppdrag.
        </p>
      </div>
      <LiveMap drivers={drivers} jobs={newJobs} />
    </div>
  );
}
