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
  startLocation: z.string().min(3, "Ange en giltig startplats"),
  breakdownLocation: z.string().min(3, "Ange en giltig haveriplats"),
  destination: z.string().min(3, "Ange en giltig destination"),
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
        setError("Kunde inte optimera rutten. Försök igen.");
        console.error(e);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Ange ruttinformation</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="startLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Startplats</FormLabel>
                    <FormControl>
                      <Input placeholder="Din nuvarande position" {...field} />
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
                    <FormLabel>Haveriplats</FormLabel>
                    <FormControl>
                      <Input placeholder="Var finns fordonet?" {...field} />
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
                    <FormLabel>Slutdestination</FormLabel>
                    <FormControl>
                      <Input placeholder="t.ex. verkstadsadress" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Optimerar...
                  </>
                ) : (
                  "Optimera Rutt"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-xl font-headline font-semibold">Optimerad Rutt</h3>
        <Card className="min-h-[300px] flex items-center justify-center">
            {isPending && (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Beräknar bästa rutt...</p>
                </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {result && (
                <div className="p-6 w-full space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                        <div className="bg-secondary p-4 rounded-lg">
                            <h4 className="text-sm font-semibold text-muted-foreground">Beräknad tid</h4>
                            <p className="text-lg font-bold flex items-center justify-center gap-2"><Clock className="h-5 w-5"/>{result.estimatedTime}</p>
                        </div>
                        <div className="bg-secondary p-4 rounded-lg">
                             <h4 className="text-sm font-semibold text-muted-foreground">Beräknad sträcka</h4>
                            <p className="text-lg font-bold flex items-center justify-center gap-2"><Milestone className="h-5 w-5"/>{result.estimatedDistance}</p>
                        </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                         <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Route className="h-5 w-5"/>Vägbeskrivning</h4>
                        <p className="text-sm whitespace-pre-wrap font-mono bg-secondary p-4 rounded-lg leading-relaxed">{result.optimizedRoute}</p>
                    </div>
                </div>
            )}
            {!isPending && !result && !error && (
                <p className="text-muted-foreground">Resultatet visas här.</p>
            )}
        </Card>
      </div>
    </div>
  );
}
