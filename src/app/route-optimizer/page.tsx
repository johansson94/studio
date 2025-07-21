import { RouteOptimizerClient } from "@/components/route-optimizer-client";

export default function RouteOptimizerPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">AI Route Optimizer</h1>
        <p className="text-muted-foreground mt-1">
          Calculate the quickest route to the breakdown and destination.
        </p>
      </div>
      <RouteOptimizerClient />
    </div>
  );
}
