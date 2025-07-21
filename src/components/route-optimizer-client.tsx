"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { optimizeRoute, type OptimizeRouteOutput } from "@/ai/flows/optimize-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Route, Clock, Milestone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  startLocation: z.string().min(3, "Please enter a valid start location"),
  breakdownLocation: z.string().min(3, "Please enter a valid breakdown location"),
  destination: z.string().min(3, "Please enter a valid destination"),
});

type FormValues = z.infer<typeof formSchema>;

export function RouteOptimizerClient() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<OptimizeRouteOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startLocation: "Bärgningsstation, Stockholm",
      breakdownLocation: "",
      destination: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const res = await optimizeRoute(values);
        setResult(res);
      } catch (e) {
        setError("Failed to optimize route. Please try again.");
        console.error(e);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Enter Route Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="startLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Your current location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="breakdownLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breakdown Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Where is the vehicle?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Final Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Workshop address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Optimizing...
                  </>
                ) : (
                  "Optimize Route"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-xl font-headline font-semibold">Optimized Route</h3>
        <Card className="min-h-[300px] flex items-center justify-center">
            {isPending && (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Calculating best route...</p>
                </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {result && (
                <div className="p-6 w-full space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                        <div className="bg-secondary p-4 rounded-lg">
                            <h4 className="text-sm font-semibold text-muted-foreground">Est. Time</h4>
                            <p className="text-lg font-bold flex items-center justify-center gap-2"><Clock className="h-5 w-5"/>{result.estimatedTime}</p>
                        </div>
                        <div className="bg-secondary p-4 rounded-lg">
                             <h4 className="text-sm font-semibold text-muted-foreground">Est. Distance</h4>
                            <p className="text-lg font-bold flex items-center justify-center gap-2"><Milestone className="h-5 w-5"/>{result.estimatedDistance}</p>
                        </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                         <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Route className="h-5 w-5"/>Directions</h4>
                        <p className="text-sm whitespace-pre-wrap font-mono bg-secondary p-4 rounded-lg leading-relaxed">{result.optimizedRoute}</p>
                    </div>
                </div>
            )}
            {!isPending && !result && !error && (
                <p className="text-muted-foreground">Results will be displayed here.</p>
            )}
        </Card>
      </div>
    </div>
  );
}
