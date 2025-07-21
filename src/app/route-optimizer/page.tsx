import { RouteOptimizerClient } from "@/components/route-optimizer-client";

export default function RouteOptimizerPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Ruttoptimering med AI</h1>
        <p className="text-muted-foreground mt-1">
          Beräkna den snabbaste vägen till haveriplatsen och slutdestinationen.
        </p>
      </div>
      <RouteOptimizerClient />
    </div>
  );
}
